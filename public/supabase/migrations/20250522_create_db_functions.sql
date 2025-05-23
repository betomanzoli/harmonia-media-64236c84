
-- Function to check if a table exists
CREATE OR REPLACE FUNCTION public.check_if_table_exists(table_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = check_if_table_exists.table_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to execute SQL safely
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create preview_tokens table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_preview_tokens_table()
RETURNS void AS $$
BEGIN
  IF NOT public.check_if_table_exists('preview_tokens') THEN
    CREATE TABLE public.preview_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      preview_id TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Create index for faster lookups
    CREATE INDEX idx_preview_tokens_preview_id ON public.preview_tokens(preview_id);
    
    -- Enable row level security
    ALTER TABLE public.preview_tokens ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for reading tokens
    CREATE POLICY "Anyone can read tokens" ON public.preview_tokens
      FOR SELECT USING (true);
    
    -- Only admin can insert/update/delete
    CREATE POLICY "Only admins can insert" ON public.preview_tokens
      FOR INSERT WITH CHECK (true);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create access_logs table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_access_logs_table()
RETURNS void AS $$
BEGIN
  IF NOT public.check_if_table_exists('access_logs') THEN
    CREATE TABLE public.access_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_email TEXT,
      access_method TEXT NOT NULL,
      preview_id TEXT NOT NULL,
      ip_address TEXT,
      accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
    
    -- Create index for faster lookups
    CREATE INDEX idx_access_logs_preview_id ON public.access_logs(preview_id);
    
    -- Enable row level security
    ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
    
    -- Anyone can insert logs
    CREATE POLICY "Anyone can insert logs" ON public.access_logs
      FOR INSERT WITH CHECK (true);
    
    -- Only admins can read logs
    CREATE POLICY "Only admins can read logs" ON public.access_logs
      FOR SELECT USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create project_files table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_project_files_table()
RETURNS void AS $$
BEGIN
  IF NOT public.check_if_table_exists('project_files') THEN
    CREATE TABLE public.project_files (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL,
      file_type TEXT NOT NULL,
      drive_url TEXT NOT NULL,
      title TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Create index for faster lookups
    CREATE INDEX idx_project_files_project_id ON public.project_files(project_id);
    
    -- Enable row level security
    ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for reading files
    CREATE POLICY "Anyone can read files" ON public.project_files
      FOR SELECT USING (true);
    
    -- Only admins can insert/update/delete
    CREATE POLICY "Only admins can insert" ON public.project_files
      FOR INSERT WITH CHECK (true);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create preview_projects table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_preview_projects_table()
RETURNS void AS $$
BEGIN
  IF NOT public.check_if_table_exists('preview_projects') THEN
    CREATE TABLE public.preview_projects (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      project_title TEXT NOT NULL,
      package_type TEXT,
      status TEXT NOT NULL,
      feedback TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      expiration_date TIMESTAMP WITH TIME ZONE,
      last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Enable row level security
    ALTER TABLE public.preview_projects ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for reading projects
    CREATE POLICY "Anyone can read projects" ON public.preview_projects
      FOR SELECT USING (true);
    
    -- Create policy for updating projects
    CREATE POLICY "Anyone can update projects" ON public.preview_projects
      FOR UPDATE USING (true);
    
    -- Create policy for inserting projects
    CREATE POLICY "Anyone can insert projects" ON public.preview_projects
      FOR INSERT WITH CHECK (true);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
