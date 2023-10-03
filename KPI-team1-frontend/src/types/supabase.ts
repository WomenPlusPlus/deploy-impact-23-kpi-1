
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      circle: {
        Row: {
          circle_id: number
          circle_name: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          circle_id?: number
          circle_name: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          circle_id?: number
          circle_name?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      circle_kpi_definition: {
        Row: {
          circle_id: number
          circle_kpidef_id: number
          circle_name: string | null
          kpi_id: number
          kpi_name: string | null
        }
        Insert: {
          circle_id: number
          circle_kpidef_id?: number
          circle_name?: string | null
          kpi_id: number
          kpi_name?: string | null
        }
        Update: {
          circle_id?: number
          circle_kpidef_id?: number
          circle_name?: string | null
          kpi_id?: number
          kpi_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_circle_id"
            columns: ["circle_id"]
            referencedRelation: "circle"
            referencedColumns: ["circle_id"]
          }
        ]
      }
      circle_user: {
        Row: {
          circle_id: number
          circle_name: string | null
          circle_user_id: number
          user_id: string
          user_name: string | null
        }
        Insert: {
          circle_id: number
          circle_name?: string | null
          circle_user_id?: number
          user_id?: string
          user_name?: string | null
        }
        Update: {
          circle_id?: number
          circle_name?: string | null
          circle_user_id?: number
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circle_user_circle_id_fkey"
            columns: ["circle_id"]
            referencedRelation: "circle"
            referencedColumns: ["circle_id"]
          },
          {
            foreignKeyName: "circle_user_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      kpi_definition: {
        Row: {
          created_at: string | null
          description: string | null
          kpi_id: number
          kpi_name: string
          periodicity: Database["public"]["Enums"]["periodicity"]
          unit: Database["public"]["Enums"]["unit"] | null
          updated_at: string | null
          value_max: number | null
          value_min: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          kpi_id?: number
          kpi_name: string
          periodicity: Database["public"]["Enums"]["periodicity"]
          unit?: Database["public"]["Enums"]["unit"] | null
          updated_at?: string | null
          value_max?: number | null
          value_min?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          kpi_id?: number
          kpi_name?: string
          periodicity?: Database["public"]["Enums"]["periodicity"]
          unit?: Database["public"]["Enums"]["unit"] | null
          updated_at?: string | null
          value_max?: number | null
          value_min?: number | null
        }
        Relationships: []
      }
      kpi_user: {
        Row: {
          created_at: string | null
          role: Database["public"]["Enums"]["role"]
          updated_at: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string | null
          role: Database["public"]["Enums"]["role"]
          updated_at?: string | null
          user_id?: string
          user_name: string
        }
        Update: {
          created_at?: string | null
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_user_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      kpi_values_history: {
        Row: {
          action: Database["public"]["Enums"]["action"]
          circle_id: number | null
          created_at: string | null
          kpi_id: number | null
          kpi_value_history_id: number
          kpi_value_id: number | null
          period_month: number
          period_year: number
          user_id: string
          value: number
        }
        Insert: {
          action: Database["public"]["Enums"]["action"]
          circle_id?: number | null
          created_at?: string | null
          kpi_id?: number | null
          kpi_value_history_id?: number
          kpi_value_id?: number | null
          period_month: number
          period_year: number
          user_id?: string
          value: number
        }
        Update: {
          action?: Database["public"]["Enums"]["action"]
          circle_id?: number | null
          created_at?: string | null
          kpi_id?: number | null
          kpi_value_history_id?: number
          kpi_value_id?: number | null
          period_month?: number
          period_year?: number
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_auth_user"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_circle"
            columns: ["circle_id"]
            referencedRelation: "circle"
            referencedColumns: ["circle_id"]
          },
          {
            foreignKeyName: "fk_kpi"
            columns: ["kpi_id"]
            referencedRelation: "kpi_definition"
            referencedColumns: ["kpi_id"]
          }
        ]
      }
      target: {
        Row: {
          created_at: string | null
          kpi_id: number
          target_id: number
          target_value: number
          timeframe: string
          unit: Database["public"]["Enums"]["unit"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          kpi_id: number
          target_id?: number
          target_value: number
          timeframe: string
          unit: Database["public"]["Enums"]["unit"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          kpi_id?: number
          target_id?: number
          target_value?: number
          timeframe?: string
          unit?: Database["public"]["Enums"]["unit"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_kpi"
            columns: ["kpi_id"]
            referencedRelation: "kpi_definition"
            referencedColumns: ["kpi_id"]
          }
        ]
      }
    }
    Views: {
      kpi_values: {
        Row: {
          action: Database["public"]["Enums"]["action"] | null
          circle_id: number | null
          created_at: string | null
          kpi_id: number | null
          kpi_value_history_id: number | null
          kpi_value_id: number | null
          period_month: number | null
          period_year: number | null
          user_id: string | null
          value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_auth_user"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_circle"
            columns: ["circle_id"]
            referencedRelation: "circle"
            referencedColumns: ["circle_id"]
          },
          {
            foreignKeyName: "fk_kpi"
            columns: ["kpi_id"]
            referencedRelation: "kpi_definition"
            referencedColumns: ["kpi_id"]
          }
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      action: "CREATE" | "UPDATE" | "DELETE"
      periodicity: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
      role: "admin" | "user"
      unit: "%" | "boolean" | "numeric"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
