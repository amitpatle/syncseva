export interface Database {
  public: {
    Tables: {
      persons: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          photo_url: string | null;
          emergency_contact_name: string;
          emergency_contact_phone: string;
          address_street: string;
          address_city: string;
          address_state: string;
          address_postal_code: string;
          address_country: string;
          public_share_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          photo_url?: string | null;
          emergency_contact_name: string;
          emergency_contact_phone: string;
          address_street: string;
          address_city: string;
          address_state: string;
          address_postal_code: string;
          address_country?: string;
          public_share_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          photo_url?: string | null;
          emergency_contact_name?: string;
          emergency_contact_phone?: string;
          address_street?: string;
          address_city?: string;
          address_state?: string;
          address_postal_code?: string;
          address_country?: string;
          public_share_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Person = Database['public']['Tables']['persons']['Row'];
export type PersonInsert = Database['public']['Tables']['persons']['Insert'];
export type PersonUpdate = Database['public']['Tables']['persons']['Update'];