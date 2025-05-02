
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
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          aadhar_number?: string
          public_key: string
          private_key?: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role: string
          aadhar_number?: string
          public_key: string
          private_key?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          aadhar_number?: string
          public_key?: string
          private_key?: string
          created_at?: string
        }
      }
      demands: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string
          category_name: string
          proposer_id: string
          proposer_name: string
          submission_date: string
          status: string
          vote_count: number
          mla_id?: string
          mla_name?: string
          officer_id?: string
          officer_name?: string
          approval_date?: string
          rejection_date?: string
          hash: string
        }
        Insert: {
          id: string
          title: string
          description: string
          category_id: string
          category_name: string
          proposer_id: string
          proposer_name: string
          submission_date?: string
          status: string
          vote_count: number
          mla_id?: string
          mla_name?: string
          officer_id?: string
          officer_name?: string
          approval_date?: string
          rejection_date?: string
          hash: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string
          category_name?: string
          proposer_id?: string
          proposer_name?: string
          submission_date?: string
          status?: string
          vote_count?: number
          mla_id?: string
          mla_name?: string
          officer_id?: string
          officer_name?: string
          approval_date?: string
          rejection_date?: string
          hash?: string
        }
      }
      transactions: {
        Row: {
          id: string
          demand_id: string
          user_id: string
          user_name: string
          action: string
          timestamp: string
          previous_status: string | null
          new_status: string
          data_hash: string
        }
        Insert: {
          id: string
          demand_id: string
          user_id: string
          user_name: string
          action: string
          timestamp?: string
          previous_status: string | null
          new_status: string
          data_hash: string
        }
        Update: {
          id?: string
          demand_id?: string
          user_id?: string
          user_name?: string
          action?: string
          timestamp?: string
          previous_status?: string | null
          new_status?: string
          data_hash?: string
        }
      }
      votes: {
        Row: {
          id: string
          demand_id: string
          user_id: string
          vote_date: string
        }
        Insert: {
          id: string
          demand_id: string
          user_id: string
          vote_date?: string
        }
        Update: {
          id?: string
          demand_id?: string
          user_id?: string
          vote_date?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
