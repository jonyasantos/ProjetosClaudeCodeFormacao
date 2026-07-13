export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: number;
          category_id: string | null;
          created_at: string;
          date: string;
          description: string;
          external_id: string | null;
          id: string;
          type: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          created_at?: string;
          date: string;
          description: string;
          external_id?: string | null;
          id?: string;
          type: string;
          user_id?: string;
        };
        Update: {
          amount?: number;
          category_id?: string | null;
          created_at?: string;
          date?: string;
          description?: string;
          external_id?: string | null;
          id?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Tipos de conveniência usados no restante do app.
export type TipoTransacao = "receita" | "despesa" | "despesa_cartao";
export type Categoria = Database["public"]["Tables"]["categories"]["Row"];
export type Transacao = Omit<
  Database["public"]["Tables"]["transactions"]["Row"],
  "type"
> & { type: TipoTransacao };
