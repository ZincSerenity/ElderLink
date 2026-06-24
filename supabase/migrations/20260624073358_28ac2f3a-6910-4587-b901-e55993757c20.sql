CREATE OR REPLACE FUNCTION public.gen_invite_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  c text;
BEGIN
  LOOP
    c := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE invite_code = c);
  END LOOP;
  RETURN c;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, phone, invite_code)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'display_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
      NULLIF(NEW.phone, ''),
      'ElderLink User'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.phone,
    public.gen_invite_code()
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    invite_code = COALESCE(public.profiles.invite_code, EXCLUDED.invite_code);
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.gen_invite_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;