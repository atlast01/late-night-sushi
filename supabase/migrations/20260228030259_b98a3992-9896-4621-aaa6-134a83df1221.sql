
-- Fix: Require authentication for creating reservations
DROP POLICY "Anyone can create reservations" ON public.reservations;
CREATE POLICY "Authenticated users can create reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
