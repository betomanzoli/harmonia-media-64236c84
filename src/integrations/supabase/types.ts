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
      feedback: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          project_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          project_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_feedback_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_history: {
        Row: {
          action_type: string | null
          created_at: string | null
          details: Json | null
          id: string
          project_id: string
        }
        Insert: {
          action_type?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          project_id?: string
        }
        Update: {
          action_type?: string | null
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
          bandcamp_url: string | null
          created_at: string | null
          description: string | null
          embed_url: string | null
          file_id: string | null
          id: string
          name: string
          original_bandcamp_url: string | null
          project_id: string
          recommended: boolean | null
          updated_at: string | null
          version_id: string
        }
        Insert: {
          audio_url?: string | null
          bandcamp_url?: string | null
          created_at?: string | null
          description?: string | null
          embed_url?: string | null
          file_id?: string | null
          id?: string
          name: string
          original_bandcamp_url?: string | null
          project_id: string
          recommended?: boolean | null
          updated_at?: string | null
          version_id?: string
        }
        Update: {
          audio_url?: string | null
          bandcamp_url?: string | null
          created_at?: string | null
          description?: string | null
          embed_url?: string | null
          file_id?: string | null
          id?: string
          name?: string
          original_bandcamp_url?: string | null
          project_id?: string
          recommended?: boolean | null
          updated_at?: string | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_versions_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
        ]
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
