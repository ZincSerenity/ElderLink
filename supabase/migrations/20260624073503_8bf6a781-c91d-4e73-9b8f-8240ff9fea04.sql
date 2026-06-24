CREATE OR REPLACE FUNCTION public.redeem_invite(_code text, _direction text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  other uuid;
  me uuid := auth.uid();
BEGIN
  IF me IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT id INTO other
  FROM public.profiles
  WHERE invite_code = upper(_code);

  IF other IS NULL THEN
    RAISE EXCEPTION 'invalid code';
  END IF;

  IF other = me THEN
    RAISE EXCEPTION 'cannot link to self';
  END IF;

  IF _direction = 'watch' THEN
    INSERT INTO public.family_links(watcher_id, watched_id)
    VALUES (me, other)
    ON CONFLICT DO NOTHING;
  ELSIF _direction = 'be_watched' THEN
    INSERT INTO public.family_links(watcher_id, watched_id)
    VALUES (other, me)
    ON CONFLICT DO NOTHING;
  ELSE
    RAISE EXCEPTION 'invalid direction';
  END IF;

  RETURN other;
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_invite(text, text) TO authenticated;