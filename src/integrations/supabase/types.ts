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
      admin_users: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: number
          name: string | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: number
          name?: string | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: number
          name?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audio_samples: {
        Row: {
          audio_url: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          featured: boolean | null
          id: number
          project_id: string | null
          status: string | null
          tags: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          featured?: boolean | null
          id?: number
          project_id?: string | null
          status?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          featured?: boolean | null
          id?: number
          project_id?: string | null
          status?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      briefing_questions: {
        Row: {
          briefing_template_id: string
          created_at: string | null
          help_text: string | null
          id: string
          options: Json | null
          order: number | null
          question_text: string | null
          question_type: string | null
          required: boolean | null
          updated_at: string | null
        }
        Insert: {
          briefing_template_id: string
          created_at?: string | null
          help_text?: string | null
          id?: string
          options?: Json | null
          order?: number | null
          question_text?: string | null
          question_type?: string | null
          required?: boolean | null
          updated_at?: string | null
        }
        Update: {
          briefing_template_id?: string
          created_at?: string | null
          help_text?: string | null
          id?: string
          options?: Json | null
          order?: number | null
          question_text?: string | null
          question_type?: string | null
          required?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      briefing_responses: {
        Row: {
          client_briefing_id: string
          created_at: string | null
          file_urls: Json | null
          id: string
          question_id: string | null
          response_data: Json | null
          response_text: string | null
          updated_at: string | null
        }
        Insert: {
          client_briefing_id: string
          created_at?: string | null
          file_urls?: Json | null
          id?: string
          question_id?: string | null
          response_data?: Json | null
          response_text?: string | null
          updated_at?: string | null
        }
        Update: {
          client_briefing_id?: string
          created_at?: string | null
          file_urls?: Json | null
          id?: string
          question_id?: string | null
          response_data?: Json | null
          response_text?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      briefing_templates: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          order_sequence: number | null
          package_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_sequence?: number | null
          package_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_sequence?: number | null
          package_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_briefings: {
        Row: {
          client_id: string
          completion_rate: number | null
          created_at: string | null
          id: string
          notes: string | null
          package_id: string | null
          project_id: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          completion_rate?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          package_id?: string | null
          project_id?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          completion_rate?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          package_id?: string | null
          project_id?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      packages: {
        Row: {
          active: boolean | null
          created_at: string
          description: string
          features: Json
          id: string
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description: string
          features: Json
          id?: string
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string
          features?: Json
          id?: string
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          category: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: number
          image_url: string | null
          project_id: string | null
          status: string | null
          tags: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: number
          image_url?: string | null
          project_id?: string | null
          status?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: number
          image_url?: string | null
          project_id?: string | null
          status?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      project_categories: {
        Row: {
          category_id: string
          project_id: string
        }
        Insert: {
          category_id: string
          project_id: string
        }
        Update: {
          category_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_categories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          created_at: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          notes: string | null
          project_id: string
          uploaded_by: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          project_id: string
          uploaded_by?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          project_id?: string
          uploaded_by?: string | null
          version?: number | null
        }
        Relationships: []
      }
      project_history: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string | null
          id: string
          new_value: Json | null
          performed_by: string | null
          previous_value: Json | null
          project_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type?: string | null
          id?: string
          new_value?: Json | null
          performed_by?: string | null
          previous_value?: Json | null
          project_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string | null
          id?: string
          new_value?: Json | null
          performed_by?: string | null
          previous_value?: Json | null
          project_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_id: string
          client_name: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          package_id: string | null
          preview_code: string | null
          status: string | null
          tags: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          client_name?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          package_id?: string | null
          preview_code?: string | null
          status?: string | null
          tags?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          client_name?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          package_id?: string | null
          preview_code?: string | null
          status?: string | null
          tags?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      qualification_submissions: {
        Row: {
          attachments: Json | null
          created_at: string
          description: string | null
          feedback: string | null
          id: number
          status: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          description?: string | null
          feedback?: string | null
          id?: number
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          description?: string | null
          feedback?: string | null
          id?: number
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: number
          key: string | null
          type: string | null
          updated_at: string | null
          updated_by: string | null
          value: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          key?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          key?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Relationships: []
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
    Enums: {},
  },
} as const
