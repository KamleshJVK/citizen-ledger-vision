export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      demands: {
        Row: {
          approval_date: string | null
          category_id: string
          description: string
          hash: string
          id: string
          mla_id: string | null
          officer_id: string | null
          proposer_id: string
          rejection_date: string | null
          status: Database["public"]["Enums"]["demand_status"]
          submission_date: string
          title: string
          vote_count: number
        }
        Insert: {
          approval_date?: string | null
          category_id: string
          description: string
          hash: string
          id?: string
          mla_id?: string | null
          officer_id?: string | null
          proposer_id: string
          rejection_date?: string | null
          status?: Database["public"]["Enums"]["demand_status"]
          submission_date?: string
          title: string
          vote_count?: number
        }
        Update: {
          approval_date?: string | null
          category_id?: string
          description?: string
          hash?: string
          id?: string
          mla_id?: string | null
          officer_id?: string | null
          proposer_id?: string
          rejection_date?: string | null
          status?: Database["public"]["Enums"]["demand_status"]
          submission_date?: string
          title?: string
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "demands_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demands_mla_id_fkey"
            columns: ["mla_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demands_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demands_proposer_id_fkey"
            columns: ["proposer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          description: string
          effective_date: string
          id: string
          officer_id: string
          title: string
        }
        Insert: {
          description: string
          effective_date: string
          id?: string
          officer_id: string
          title: string
        }
        Update: {
          description?: string
          effective_date?: string
          id?: string
          officer_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_demands: {
        Row: {
          demand_id: string
          policy_id: string
        }
        Insert: {
          demand_id: string
          policy_id: string
        }
        Update: {
          demand_id?: string
          policy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_demands_demand_id_fkey"
            columns: ["demand_id"]
            isOneToOne: false
            referencedRelation: "demands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_demands_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          action: Database["public"]["Enums"]["transaction_action"]
          data_hash: string
          demand_id: string
          id: string
          new_status: Database["public"]["Enums"]["demand_status"]
          previous_status: Database["public"]["Enums"]["demand_status"] | null
          timestamp: string
          user_id: string
          user_name: string
        }
        Insert: {
          action: Database["public"]["Enums"]["transaction_action"]
          data_hash: string
          demand_id: string
          id: string
          new_status: Database["public"]["Enums"]["demand_status"]
          previous_status?: Database["public"]["Enums"]["demand_status"] | null
          timestamp?: string
          user_id: string
          user_name: string
        }
        Update: {
          action?: Database["public"]["Enums"]["transaction_action"]
          data_hash?: string
          demand_id?: string
          id?: string
          new_status?: Database["public"]["Enums"]["demand_status"]
          previous_status?: Database["public"]["Enums"]["demand_status"] | null
          timestamp?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_demand_id_fkey"
            columns: ["demand_id"]
            isOneToOne: false
            referencedRelation: "demands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          aadhar_number: string | null
          created_at: string
          email: string
          id: string
          name: string
          private_key: string | null
          public_key: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          aadhar_number?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          private_key?: string | null
          public_key: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          aadhar_number?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          private_key?: string | null
          public_key?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      votes: {
        Row: {
          demand_id: string
          id: string
          user_id: string
          vote_date: string
        }
        Insert: {
          demand_id: string
          id?: string
          user_id: string
          vote_date?: string
        }
        Update: {
          demand_id?: string
          id?: string
          user_id?: string
          vote_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_demand_id_fkey"
            columns: ["demand_id"]
            isOneToOne: false
            referencedRelation: "demands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      demand_status:
        | "Pending"
        | "Voting Open"
        | "Reviewed"
        | "Forwarded"
        | "Approved"
        | "Rejected"
      transaction_action:
        | "Demand Submitted"
        | "Demand Reviewed"
        | "Demand Voted"
        | "Demand Approved"
        | "Demand Rejected"
      user_role: "Common Citizen" | "MLA" | "Higher Public Officer" | "Admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      demand_status: [
        "Pending",
        "Voting Open",
        "Reviewed",
        "Forwarded",
        "Approved",
        "Rejected",
      ],
      transaction_action: [
        "Demand Submitted",
        "Demand Reviewed",
        "Demand Voted",
        "Demand Approved",
        "Demand Rejected",
      ],
      user_role: ["Common Citizen", "MLA", "Higher Public Officer", "Admin"],
    },
  },
} as const
