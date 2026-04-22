export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      charities: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          cover_image_url: string | null
          is_featured: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          avatar_url: string | null
          stripe_customer_id: string | null
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due' | null
          subscription_plan: 'monthly' | 'yearly' | null
          stripe_subscription_id: string | null
          charity_id: string | null
          charity_percentage: number
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due' | null
          subscription_plan?: 'monthly' | 'yearly' | null
          stripe_subscription_id?: string | null
          charity_id?: string | null
          charity_percentage?: number
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due' | null
          subscription_plan?: 'monthly' | 'yearly' | null
          stripe_subscription_id?: string | null
          charity_id?: string | null
          charity_percentage?: number
          is_admin?: boolean
          created_at?: string
        }
      }
      scores: {
        Row: {
          id: string
          user_id: string
          score: number
          played_on: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          played_on: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          played_on?: string
          created_at?: string
        }
      }
      draws: {
        Row: {
          id: string
          draw_month: string
          status: 'draft' | 'simulated' | 'published'
          draw_type: 'random' | 'algorithmic'
          winning_numbers: number[] | null
          jackpot_amount: number
          tier_4_amount: number
          tier_3_amount: number
          total_subscribers: number
          jackpot_rolled_over: boolean
          published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          draw_month: string
          status?: 'draft' | 'simulated' | 'published'
          draw_type?: 'random' | 'algorithmic'
          winning_numbers?: number[] | null
          jackpot_amount?: number
          tier_4_amount?: number
          tier_3_amount?: number
          total_subscribers?: number
          jackpot_rolled_over?: boolean
          published_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          draw_month?: string
          status?: 'draft' | 'simulated' | 'published'
          draw_type?: 'random' | 'algorithmic'
          winning_numbers?: number[] | null
          jackpot_amount?: number
          tier_4_amount?: number
          tier_3_amount?: number
          total_subscribers?: number
          jackpot_rolled_over?: boolean
          published_at?: string | null
          created_at?: string
        }
      }
      draw_entries: {
        Row: {
          id: string
          draw_id: string
          user_id: string
          entry_numbers: number[] | null
          matched_count: number | null
          tier: 'jackpot' | 'tier_4' | 'tier_3' | 'none' | null
          created_at: string
        }
        Insert: {
          id?: string
          draw_id: string
          user_id: string
          entry_numbers?: number[] | null
          matched_count?: number | null
          tier?: 'jackpot' | 'tier_4' | 'tier_3' | 'none' | null
          created_at?: string
        }
        Update: {
          id?: string
          draw_id?: string
          user_id?: string
          entry_numbers?: number[] | null
          matched_count?: number | null
          tier?: 'jackpot' | 'tier_4' | 'tier_3' | 'none' | null
          created_at?: string
        }
      }
      winners: {
        Row: {
          id: string
          draw_id: string
          user_id: string
          tier: 'jackpot' | 'tier_4' | 'tier_3' | null
          prize_amount: number
          proof_url: string | null
          verification_status: 'pending' | 'approved' | 'rejected'
          payout_status: 'unpaid' | 'paid'
          created_at: string
        }
        Insert: {
          id?: string
          draw_id: string
          user_id: string
          tier?: 'jackpot' | 'tier_4' | 'tier_3' | null
          prize_amount: number
          proof_url?: string | null
          verification_status?: 'pending' | 'approved' | 'rejected'
          payout_status?: 'unpaid' | 'paid'
          created_at?: string
        }
        Update: {
          id?: string
          draw_id?: string
          user_id?: string
          tier?: 'jackpot' | 'tier_4' | 'tier_3' | null
          prize_amount?: number
          proof_url?: string | null
          verification_status?: 'pending' | 'approved' | 'rejected'
          payout_status?: 'unpaid' | 'paid'
          created_at?: string
        }
      }
      charity_contributions: {
        Row: {
          id: string
          user_id: string
          charity_id: string
          amount: number
          period_start: string
          period_end: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          charity_id: string
          amount: number
          period_start: string
          period_end: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          charity_id?: string
          amount?: number
          period_start?: string
          period_end?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience Type Aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Score = Database['public']['Tables']['scores']['Row']
export type Draw = Database['public']['Tables']['draws']['Row']
export type DrawEntry = Database['public']['Tables']['draw_entries']['Row']
export type Winner = Database['public']['Tables']['winners']['Row']
export type Charity = Database['public']['Tables']['charities']['Row']
export type CharityContribution = Database['public']['Tables']['charity_contributions']['Row']

// Composite Types
export type ScoreWithDate = Omit<Score, 'played_on'> & {
  played_on: Date
}

export type DrawWithEntries = Draw & {
  entries: DrawEntry[]
}

export type WinnerWithProfile = Winner & {
  profile: Profile
}

export type ProfileWithCharity = Profile & {
  charity: Charity | null
}
