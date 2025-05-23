-- Adicionar tabela de validação
CREATE TABLE preview_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '72 hours'
);

-- Criar índice para busca rápida
CREATE INDEX idx_preview_validations_token ON preview_validations(token);

-- Adicionar tabela de logs de acesso
CREATE TABLE preview_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  email TEXT NOT NULL,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
