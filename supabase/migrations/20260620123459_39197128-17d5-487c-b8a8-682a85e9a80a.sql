
REVOKE ALL ON FUNCTION public.is_linked(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.gen_invite_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.redeem_invite(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_invite(text, text) TO authenticated;
