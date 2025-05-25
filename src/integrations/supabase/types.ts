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
      access_logs: {
        Row: {
          access_method: string
          accessed_at: string
          id: string
          ip_address: string | null
          preview_id: string
          user_email: string | null
        }
        Insert: {
          access_method: string
          accessed_at?: string
          id?: string
          ip_address?: string | null
          preview_id: string
          user_email?: string | null
        }
        Update: {
          access_method?: string
          accessed_at?: string
          id?: string
          ip_address?: string | null
          preview_id?: string
          user_email?: string | null
        }
        Relationships: []
      }
      briefing_fields: {
        Row: {
          created_at: string | null
          field_key: string
          field_name: string
          field_type: Database["public"]["Enums"]["field_type"]
          id: string
          is_active: boolean | null
          is_required: boolean | null
          max_length: number | null
          options: Json | null
          order_num: number
          placeholder: string | null
          section_id: string
        }
        Insert: {
          created_at?: string | null
          field_key: string
          field_name: string
          field_type: Database["public"]["Enums"]["field_type"]
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          max_length?: number | null
          options?: Json | null
          order_num: number
          placeholder?: string | null
          section_id: string
        }
        Update: {
          created_at?: string | null
          field_key?: string
          field_name?: string
          field_type?: Database["public"]["Enums"]["field_type"]
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          max_length?: number | null
          options?: Json | null
          order_num?: number
          placeholder?: string | null
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "briefing_fields_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "briefing_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      briefing_questions: {
        Row: {
          id: string
          order_num: number
          package_id: string | null
          question: string
          required: boolean | null
        }
        Insert: {
          id?: string
          order_num: number
          package_id?: string | null
          question: string
          required?: boolean | null
        }
        Update: {
          id?: string
          order_num?: number
          package_id?: string | null
          question?: string
          required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "briefing_questions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      briefing_responses: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          question_id: string
          response: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          question_id: string
          response?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          question_id?: string
          response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "briefing_responses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "briefing_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "briefing_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      briefing_sections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          order_num: number
          package_type: Database["public"]["Enums"]["package_type"]
          section_type: Database["public"]["Enums"]["section_type"]
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_num: number
          package_type: Database["public"]["Enums"]["package_type"]
          section_type: Database["public"]["Enums"]["section_type"]
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_num?: number
          package_type?: Database["public"]["Enums"]["package_type"]
          section_type?: Database["public"]["Enums"]["section_type"]
          title?: string
        }
        Relationships: []
      }
      briefings: {
        Row: {
          client_id: string | null
          completed_at: string | null
          completion_status: string | null
          created_at: string | null
          data: Json
          full_responses: Json | null
          id: string
          initial_responses: Json | null
          is_deleted: boolean | null
          package_type: Database["public"]["Enums"]["package_type"]
          payment_status: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["briefing_status"] | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          completion_status?: string | null
          created_at?: string | null
          data: Json
          full_responses?: Json | null
          id?: string
          initial_responses?: Json | null
          is_deleted?: boolean | null
          package_type: Database["public"]["Enums"]["package_type"]
          payment_status?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["briefing_status"] | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          completion_status?: string | null
          created_at?: string | null
          data?: Json
          full_responses?: Json | null
          id?: string
          initial_responses?: Json | null
          is_deleted?: boolean | null
          package_type?: Database["public"]["Enums"]["package_type"]
          payment_status?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["briefing_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "briefings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          comments: string | null
          created_at: string | null
          id: string
          project_id: string
          status: string
          updated_at: string | null
          user_email: string
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          id?: string
          project_id: string
          status?: string
          updated_at?: string | null
          user_email: string
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          id?: string
          project_id?: string
          status?: string
          updated_at?: string | null
          user_email?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: string
          client: string
          client_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
          due_date: string
          has_receipt: boolean | null
          id: string
          invoice_pdf: string | null
          status: string | null
        }
        Insert: {
          amount: string
          client: string
          client_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          due_date: string
          has_receipt?: boolean | null
          id?: string
          invoice_pdf?: string | null
          status?: string | null
        }
        Update: {
          amount?: string
          client?: string
          client_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          due_date?: string
          has_receipt?: boolean | null
          id?: string
          invoice_pdf?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          lead_campaign: string | null
          lead_content: string | null
          lead_medium: string | null
          lead_source: string | null
          lead_term: string | null
          name: string
          redirect_page: string | null
          responses: Json
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          lead_campaign?: string | null
          lead_content?: string | null
          lead_medium?: string | null
          lead_source?: string | null
          lead_term?: string | null
          name: string
          redirect_page?: string | null
          responses?: Json
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          lead_campaign?: string | null
          lead_content?: string | null
          lead_medium?: string | null
          lead_source?: string | null
          lead_term?: string | null
          name?: string
          redirect_page?: string | null
          responses?: Json
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          description: string | null
          id: string
          inclusions: Json | null
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          description?: string | null
          id?: string
          inclusions?: Json | null
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          description?: string | null
          id?: string
          inclusions?: Json | null
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          audio_url: string | null
          description: string | null
          id: string
          is_public: boolean | null
          project_id: string | null
          thumbnail_url: string | null
          title: string
          type: string
        }
        Insert: {
          audio_url?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          project_id?: string | null
          thumbnail_url?: string | null
          title: string
          type: string
        }
        Update: {
          audio_url?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          project_id?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      preview_access_logs: {
        Row: {
          accessed_at: string
          email: string
          id: string
          project_id: string
        }
        Insert: {
          accessed_at?: string
          email: string
          id?: string
          project_id: string
        }
        Update: {
          accessed_at?: string
          email?: string
          id?: string
          project_id?: string
        }
        Relationships: []
      }
      preview_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          project_id: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          project_id: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          project_id?: string
        }
        Relationships: []
      }
      preview_projects: {
        Row: {
          client_name: string
          created_at: string | null
          expiration_date: string | null
          feedback: string | null
          id: string
          last_activity_date: string | null
          package_type: string | null
          project_title: string
          status: string
        }
        Insert: {
          client_name: string
          created_at?: string | null
          expiration_date?: string | null
          feedback?: string | null
          id: string
          last_activity_date?: string | null
          package_type?: string | null
          project_title: string
          status: string
        }
        Update: {
          client_name?: string
          created_at?: string | null
          expiration_date?: string | null
          feedback?: string | null
          id?: string
          last_activity_date?: string | null
          package_type?: string | null
          project_title?: string
          status?: string
        }
        Relationships: []
      }
      preview_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          preview_id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          preview_id: string
          token: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          preview_id?: string
          token?: string
        }
        Relationships: []
      }
      preview_validations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          project_id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          project_id: string
          token: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          project_id?: string
          token?: string
        }
        Relationships: []
      }
      previews: {
        Row: {
          allowed_emails: string[]
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          preview_id: string
          project_id: string | null
          title: string
        }
        Insert: {
          allowed_emails: string[]
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          preview_id: string
          project_id?: string | null
          title: string
        }
        Update: {
          allowed_emails?: string[]
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          preview_id?: string
          project_id?: string | null
          title?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          created_at: string | null
          drive_url: string
          file_type: string
          id: string
          project_id: string
          title: string | null
        }
        Insert: {
          created_at?: string | null
          drive_url: string
          file_type: string
          id?: string
          project_id: string
          title?: string | null
        }
        Update: {
          created_at?: string | null
          drive_url?: string
          file_type?: string
          id?: string
          project_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_history: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          project_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          project_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_versions: {
        Row: {
          audio_url: string | null
          created_at: string | null
          description: string | null
          file_id: string | null
          id: string
          name: string
          project_id: string
          recommended: boolean | null
          version_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          file_id?: string | null
          id?: string
          name: string
          project_id: string
          recommended?: boolean | null
          version_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          file_id?: string | null
          id?: string
          name?: string
          project_id?: string
          recommended?: boolean | null
          version_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_email: string | null
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          expires_at: string | null
          feedback: string | null
          feedback_history: Json | null
          id: string
          package_id: string | null
          package_type: string | null
          preview_code: string | null
          preview_url: string | null
          status: string | null
          title: string
          updated_at: string | null
          use_google_drive: boolean | null
          versions: Json | null
        }
        Insert: {
          client_email?: string | null
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          expires_at?: string | null
          feedback?: string | null
          feedback_history?: Json | null
          id?: string
          package_id?: string | null
          package_type?: string | null
          preview_code?: string | null
          preview_url?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          use_google_drive?: boolean | null
          versions?: Json | null
        }
        Update: {
          client_email?: string | null
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          expires_at?: string | null
          feedback?: string | null
          feedback_history?: Json | null
          id?: string
          package_id?: string | null
          package_type?: string | null
          preview_code?: string | null
          preview_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          use_google_drive?: boolean | null
          versions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      append_feedback: {
        Args: { project_id: string; new_entry: Json }
        Returns: undefined
      }
    }
    Enums: {
      briefing_status: "pending" | "completed" | "approved"
      field_type:
        | "text"
        | "textarea"
        | "select"
        | "multi_select"
        | "radio"
        | "checkbox"
        | "file"
        | "date"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "converted"
        | "unqualified"
      package_type: "essencial" | "profissional" | "premium" | "qualification"
      section_type:
        | "basic_info"
        | "purpose"
        | "timeline"
        | "description"
        | "budget"
        | "features"
        | "story_concept"
        | "emotions"
        | "music_preferences"
        | "specific_elements"
        | "certificate_info"
        | "history_concept"
        | "stylistic_preferences"
        | "technical_details"
        | "commercial_requirements"
        | "call_scheduling"
        | "strategic_concept"
        | "emotional_palette"
        | "aesthetic_preferences"
        | "technical_specs"
        | "registration_info"
        | "consultation_scheduling"
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
      briefing_status: ["pending", "completed", "approved"],
      field_type: [
        "text",
        "textarea",
        "select",
        "multi_select",
        "radio",
        "checkbox",
        "file",
        "date",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "converted",
        "unqualified",
      ],
      package_type: ["essencial", "profissional", "premium", "qualification"],
      section_type: [
        "basic_info",
        "purpose",
        "timeline",
        "description",
        "budget",
        "features",
        "story_concept",
        "emotions",
        "music_preferences",
        "specific_elements",
        "certificate_info",
        "history_concept",
        "stylistic_preferences",
        "technical_details",
        "commercial_requirements",
        "call_scheduling",
        "strategic_concept",
        "emotional_palette",
        "aesthetic_preferences",
        "technical_specs",
        "registration_info",
        "consultation_scheduling",
      ],
    },
  },
} as const
