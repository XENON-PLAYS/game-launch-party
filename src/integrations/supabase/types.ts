export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bug_reports: {
        Row: {
          created_at: string
          description: string
          game_id: string | null
          id: string
          report_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          game_id?: string | null
          id?: string
          report_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          game_id?: string | null
          id?: string
          report_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bug_reports_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_reactions: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "game_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      download_history: {
        Row: {
          created_at: string
          download_link_id: string | null
          game_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          download_link_id?: string | null
          game_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          download_link_id?: string | null
          game_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_history_download_link_id_fkey"
            columns: ["download_link_id"]
            isOneToOne: false
            referencedRelation: "download_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "download_history_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      download_links: {
        Row: {
          click_count: number
          created_at: string
          game_id: string
          id: string
          label: string
          status: string
          url: string
        }
        Insert: {
          click_count?: number
          created_at?: string
          game_id: string
          id?: string
          label: string
          status?: string
          url: string
        }
        Update: {
          click_count?: number
          created_at?: string
          game_id?: string
          id?: string
          label?: string
          status?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "download_links_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          game_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_comments: {
        Row: {
          content: string
          created_at: string
          dislikes: number
          game_id: string
          id: string
          likes: number
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          dislikes?: number
          game_id: string
          id?: string
          likes?: number
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          dislikes?: number
          game_id?: string
          id?: string
          likes?: number
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_comments_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "game_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      game_ratings: {
        Row: {
          created_at: string
          game_id: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_ratings_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_requests: {
        Row: {
          created_at: string
          description: string | null
          dlc: string | null
          game_name: string
          id: string
          status: string
          updated_at: string
          user_id: string
          user_nick: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          dlc?: string | null
          game_name: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          user_nick?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          dlc?: string | null
          game_name?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          user_nick?: string | null
        }
        Relationships: []
      }
      games: {
        Row: {
          capsule_image: string | null
          categorias: string[]
          classificacao: string | null
          created_at: string
          descricao: string | null
          desenvolvedor: string | null
          destaques: string[]
          distribuidor: string | null
          download_count: number
          galeria: string[]
          hero_image: string | null
          id: string
          idiomas: string[]
          imagem: string | null
          lancamento: string | null
          link_demo: string | null
          modos: string[]
          nome: string
          observacoes: string | null
          passo_a_passo: string | null
          pre_requisitos: string | null
          preco: number
          rating_avg: number | null
          rating_count: number | null
          requisitos_minimo: Json | null
          requisitos_recomendado: Json | null
          slug: string | null
          tamanho: string | null
          trailer_url: string | null
          updated_at: string
          vertical_image: string | null
        }
        Insert: {
          capsule_image?: string | null
          categorias?: string[]
          classificacao?: string | null
          created_at?: string
          descricao?: string | null
          desenvolvedor?: string | null
          destaques?: string[]
          distribuidor?: string | null
          download_count?: number
          galeria?: string[]
          hero_image?: string | null
          id?: string
          idiomas?: string[]
          imagem?: string | null
          lancamento?: string | null
          link_demo?: string | null
          modos?: string[]
          nome: string
          observacoes?: string | null
          passo_a_passo?: string | null
          pre_requisitos?: string | null
          preco?: number
          rating_avg?: number | null
          rating_count?: number | null
          requisitos_minimo?: Json | null
          requisitos_recomendado?: Json | null
          slug?: string | null
          tamanho?: string | null
          trailer_url?: string | null
          updated_at?: string
          vertical_image?: string | null
        }
        Update: {
          capsule_image?: string | null
          categorias?: string[]
          classificacao?: string | null
          created_at?: string
          descricao?: string | null
          desenvolvedor?: string | null
          destaques?: string[]
          distribuidor?: string | null
          download_count?: number
          galeria?: string[]
          hero_image?: string | null
          id?: string
          idiomas?: string[]
          imagem?: string | null
          lancamento?: string | null
          link_demo?: string | null
          modos?: string[]
          nome?: string
          observacoes?: string | null
          passo_a_passo?: string | null
          pre_requisitos?: string | null
          preco?: number
          rating_avg?: number | null
          rating_count?: number | null
          requisitos_minimo?: Json | null
          requisitos_recomendado?: Json | null
          slug?: string | null
          tamanho?: string | null
          trailer_url?: string | null
          updated_at?: string
          vertical_image?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read: boolean
          related_game_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          related_game_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          related_game_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_game_id_fkey"
            columns: ["related_game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_banned: boolean | null
          is_vip: boolean
          last_seen_at: string | null
          status: string | null
          theme: string | null
          updated_at: string
          user_id: string
          username: string | null
          vip_expires_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_banned?: boolean | null
          is_vip?: boolean
          last_seen_at?: string | null
          status?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          vip_expires_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_banned?: boolean | null
          is_vip?: boolean
          last_seen_at?: string | null
          status?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          vip_expires_at?: string | null
        }
        Relationships: []
      }
      source_repacks: {
        Row: {
          banner_url: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          file_size: string | null
          id: string
          screenshots: string[] | null
          source: string
          steam_appid: number | null
          title: string
          trailer_url: string | null
          updated_at: string
          upload_date: string | null
          uris: string[]
        }
        Insert: {
          banner_url?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          file_size?: string | null
          id?: string
          screenshots?: string[] | null
          source?: string
          steam_appid?: number | null
          title: string
          trailer_url?: string | null
          updated_at?: string
          upload_date?: string | null
          uris?: string[]
        }
        Update: {
          banner_url?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          file_size?: string | null
          id?: string
          screenshots?: string[] | null
          source?: string
          steam_appid?: number | null
          title?: string
          trailer_url?: string | null
          updated_at?: string
          upload_date?: string | null
          uris?: string[]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      merged_repacks: {
        Row: {
          banner_url: string | null
          base_key: string | null
          cover_url: string | null
          description: string | null
          file_size: string | null
          id: string | null
          screenshots: string[] | null
          sources: string[] | null
          steam_appid: number | null
          title: string | null
          trailer_url: string | null
          upload_date: string | null
          uris: string[] | null
        }
        Relationships: []
      }
      online_users_stats: {
        Row: {
          online_count: number | null
          total_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_admin_users_list: {
        Args: never
        Returns: {
          avatar_url: string
          created_at: string
          display_name: string
          id: string
          is_banned: boolean
          is_vip: boolean
          last_seen_at: string
          role: string
          status: string
          user_id: string
          username: string
        }[]
      }
      get_public_profiles: {
        Args: { _user_ids: string[] }
        Returns: {
          avatar_url: string
          badges: string[]
          bio: string
          created_at: string
          display_name: string
          is_vip: boolean
          last_seen_at: string
          status: string
          user_id: string
          username: string
        }[]
      }
      get_user_ranking: {
        Args: never
        Returns: {
          avatar_url: string
          badges: string[]
          display_name: string
          download_count: number
          is_vip: boolean
          username: string
        }[]
      }
      has_role: {
        Args: {
          p_role: Database["public"]["Enums"]["app_role"]
          p_user_id: string
        }
        Returns: boolean
      }
      increment_game_downloads: {
        Args: { game_id: string }
        Returns: undefined
      }
      increment_link_clicks: { Args: { link_id: string }; Returns: undefined }
      insert_user_role: {
        Args: { p_role: string; p_user_id: string }
        Returns: undefined
      }
      refresh_merged_repacks: { Args: never; Returns: undefined }
      repack_base_title: { Args: { t: string }; Returns: string }
      slugify: { Args: { text: string }; Returns: string }
      toggle_admin_role: { Args: { target_user_id: string }; Returns: string }
      toggle_ban_status: { Args: { target_user_id: string }; Returns: boolean }
      toggle_vip_status: { Args: { target_user_id: string }; Returns: boolean }
      update_online_status: { Args: never; Returns: undefined }
      update_own_profile: {
        Args: {
          _avatar_url?: string
          _bio?: string
          _display_name?: string
          _status?: string
          _theme?: string
          _user_id: string
          _username?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
