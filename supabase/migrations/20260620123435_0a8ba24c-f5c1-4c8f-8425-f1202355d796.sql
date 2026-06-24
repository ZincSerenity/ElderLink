
-- Add invite code to profiles for linking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS invite_code text UNIQUE;

CREATE OR REPLACE FUNCTION public.gen_invite_code()
RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
DECLARE c text;
BEGIN
  LOOP
    c := upper(substr(encode(gen_random_bytes(6),'base64'),1,6));
    c := regexp_replace(c,'[^A-Z0-9]','X','g');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE invite_code = c);
  END LOOP;
  RETURN c;
END; $$;

UPDATE public.profiles SET invite_code = public.gen_invite_code() WHERE invite_code IS NULL;

-- Update handle_new_user to also set invite_code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, phone, invite_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.phone,
    public.gen_invite_code()
  );
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Family links: watcher sees watched's check-ins and can chat
CREATE TABLE public.family_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  watcher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  watched_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (watcher_id, watched_id),
  CHECK (watcher_id <> watched_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_links TO authenticated;
GRANT ALL ON public.family_links TO service_role;
ALTER TABLE public.family_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own links" ON public.family_links FOR SELECT TO authenticated
  USING (auth.uid() = watcher_id OR auth.uid() = watched_id);
CREATE POLICY "create links involving self" ON public.family_links FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = watcher_id OR auth.uid() = watched_id);
CREATE POLICY "delete own links" ON public.family_links FOR DELETE TO authenticated
  USING (auth.uid() = watcher_id OR auth.uid() = watched_id);

CREATE OR REPLACE FUNCTION public.is_linked(_a uuid, _b uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_links
    WHERE (watcher_id = _a AND watched_id = _b)
       OR (watcher_id = _b AND watched_id = _a)
  );
$$;

-- Check-ins
CREATE TABLE public.checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX checkins_user_time ON public.checkins(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkins TO authenticated;
GRANT ALL ON public.checkins TO service_role;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own checkins" ON public.checkins FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "watchers can view" ON public.checkins FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.family_links WHERE watcher_id = auth.uid() AND watched_id = checkins.user_id));

-- Messages (DM between linked users)
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX messages_pair ON public.messages(sender_id, recipient_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own messages" ON public.messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "send to linked users" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id AND public.is_linked(sender_id, recipient_id));
CREATE POLICY "mark own received as read" ON public.messages FOR UPDATE TO authenticated
  USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.checkins;

-- RPC to redeem an invite code; direction = 'watch' (I watch them) or 'be_watched' (they watch me)
CREATE OR REPLACE FUNCTION public.redeem_invite(_code text, _direction text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE other uuid; me uuid := auth.uid();
BEGIN
  IF me IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT id INTO other FROM public.profiles WHERE invite_code = upper(_code);
  IF other IS NULL THEN RAISE EXCEPTION 'invalid code'; END IF;
  IF other = me THEN RAISE EXCEPTION 'cannot link to self'; END IF;
  IF _direction = 'watch' THEN
    INSERT INTO public.family_links(watcher_id, watched_id) VALUES (me, other)
      ON CONFLICT DO NOTHING;
  ELSIF _direction = 'be_watched' THEN
    INSERT INTO public.family_links(watcher_id, watched_id) VALUES (other, me)
      ON CONFLICT DO NOTHING;
  ELSE RAISE EXCEPTION 'invalid direction'; END IF;
  RETURN other;
END; $$;
GRANT EXECUTE ON FUNCTION public.redeem_invite(text, text) TO authenticated;
