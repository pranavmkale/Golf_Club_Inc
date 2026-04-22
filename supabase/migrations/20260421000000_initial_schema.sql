-- Create charities table
CREATE TABLE public.charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'yearly') OR subscription_plan IS NULL),
  stripe_subscription_id TEXT,
  charity_id UUID REFERENCES public.charities(id),
  charity_percentage INT DEFAULT 10 CHECK (charity_percentage >= 10),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create scores table
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  score INT NOT NULL CHECK (score >= 1 AND score <= 45),
  played_on DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, played_on)
);

-- Create draws table
CREATE TABLE public.draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_month DATE UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('draft', 'simulated', 'published')) DEFAULT 'draft',
  draw_type TEXT CHECK (draw_type IN ('random', 'algorithmic')) DEFAULT 'random',
  winning_numbers INT[] CHECK (cardinality(winning_numbers) = 5),
  jackpot_amount NUMERIC DEFAULT 0,
  tier_4_amount NUMERIC DEFAULT 0,
  tier_3_amount NUMERIC DEFAULT 0,
  total_subscribers INT DEFAULT 0,
  jackpot_rolled_over BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create draw_entries table
CREATE TABLE public.draw_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entry_numbers INT[] CHECK (cardinality(entry_numbers) = 5),
  matched_count INT,
  tier TEXT CHECK (tier IN ('jackpot', 'tier_4', 'tier_3', 'none')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create winners table
CREATE TABLE public.winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tier TEXT CHECK (tier IN ('jackpot', 'tier_4', 'tier_3')),
  prize_amount NUMERIC NOT NULL,
  proof_url TEXT,
  verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  payout_status TEXT CHECK (payout_status IN ('unpaid', 'paid')) DEFAULT 'unpaid',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create charity_contributions table
CREATE TABLE public.charity_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_contributions ENABLE ROW LEVEL SECURITY;

-- Admin check function to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Charities policies
CREATE POLICY "Public read active charities" ON public.charities
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access on charities" ON public.charities
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Profiles policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Scores policies
CREATE POLICY "Users can CRUD own scores" ON public.scores
  USING (auth.uid() = user_id OR public.is_admin());

-- Draws policies
CREATE POLICY "Public read published draws" ON public.draws
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admin full access on draws" ON public.draws
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Draw Entries policies
CREATE POLICY "Users can read own entries" ON public.draw_entries
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin full access on draw_entries" ON public.draw_entries
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Winners policies
CREATE POLICY "Users can read own winnings" ON public.winners
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin full access on winners" ON public.winners
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Charity Contributions policies
CREATE POLICY "Users can read own contributions" ON public.charity_contributions
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin full access on charity_contributions" ON public.charity_contributions
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Create Indexes
CREATE INDEX idx_scores_user_played ON public.scores(user_id, played_on);
CREATE INDEX idx_draw_entries_draw_user ON public.draw_entries(draw_id, user_id);
CREATE INDEX idx_winners_draw_user ON public.winners(draw_id, user_id);
CREATE INDEX idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);

-- Handle profile creation on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
