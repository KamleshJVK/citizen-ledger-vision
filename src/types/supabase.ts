
import { DemandStatus, TransactionAction } from './index';

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
          status: DemandStatus
          vote_count: number
          mla_id: string | null
          mla_name: string | null
          officer_id: string | null
          officer_name: string | null
          approval_date: string | null
          rejection_date: string | null
          hash: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id: string
          category_name: string
          proposer_id: string
          proposer_name: string
          submission_date?: string
          status?: DemandStatus
          vote_count?: number
          mla_id?: string | null
          mla_name?: string | null
          officer_id?: string | null
          officer_name?: string | null
          approval_date?: string | null
          rejection_date?: string | null
          hash: string
          created_at?: string
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
          status?: DemandStatus
          vote_count?: number
          mla_id?: string | null
          mla_name?: string | null
          officer_id?: string | null
          officer_name?: string | null
          approval_date?: string | null
          rejection_date?: string | null
          hash?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          demand_id: string
          user_id: string
          user_name: string
          action: TransactionAction
          timestamp: string
          previous_status: DemandStatus | null
          new_status: DemandStatus
          data_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          demand_id: string
          user_id: string
          user_name: string
          action: TransactionAction
          timestamp?: string
          previous_status?: DemandStatus | null
          new_status: DemandStatus
          data_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          demand_id?: string
          user_id?: string
          user_name?: string
          action?: TransactionAction
          timestamp?: string
          previous_status?: DemandStatus | null
          new_status?: DemandStatus
          data_hash?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          aadhar_number: string | null
          public_key: string
          private_key: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: string
          aadhar_number?: string | null
          public_key: string
          private_key?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          aadhar_number?: string | null
          public_key?: string
          private_key?: string | null
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          demand_id: string
          user_id: string
          vote_date: string
          created_at: string
        }
        Insert: {
          id?: string
          demand_id: string
          user_id: string
          vote_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          demand_id?: string
          user_id?: string
          vote_date?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
