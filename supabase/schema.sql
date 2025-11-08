-- ============================================
-- TRILHA DO SABER - SCHEMA DO BANCO DE DADOS
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca de texto

-- ============================================
-- TABELAS DE USUÁRIOS E AUTENTICAÇÃO
-- ============================================

-- Tabela de perfis de usuário (extende auth.users do Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('aluno', 'professor', 'coordenador', 'pais')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  data_nascimento DATE,
  serie TEXT,
  pontos INTEGER DEFAULT 0,
  moedas INTEGER DEFAULT 0,
  sequencia_atual INTEGER DEFAULT 0,
  cor_fundo_perfil TEXT DEFAULT '#E57373',
  icone_conquista_favorito TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pais/responsáveis
CREATE TABLE IF NOT EXISTS pais (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de professores
CREATE TABLE IF NOT EXISTS professores (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  matricula TEXT UNIQUE,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de coordenadores
CREATE TABLE IF NOT EXISTS coordenadores (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relação aluno-pais (um aluno pode ter múltiplos responsáveis)
CREATE TABLE IF NOT EXISTS aluno_pais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  pais_id UUID NOT NULL REFERENCES pais(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, pais_id)
);

-- ============================================
-- TABELAS DE MATÉRIAS E CONTEÚDO
-- ============================================

-- Tabela de matérias
CREATE TABLE IF NOT EXISTS materias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  descricao TEXT,
  cor_primaria TEXT,
  cor_secundaria TEXT,
  imagem_url TEXT,
  icone TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de trilhas do saber (por matéria)
CREATE TABLE IF NOT EXISTS trilhas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  materia_id UUID NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_fundo TEXT,
  cor_caminho TEXT,
  mascote_imagem TEXT,
  mascote_mensagem TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de lições
CREATE TABLE IF NOT EXISTS licoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trilha_id UUID NOT NULL REFERENCES trilhas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('licao', 'desafio')),
  icone TEXT,
  posicao_top TEXT,
  posicao_left TEXT,
  ordem INTEGER DEFAULT 0,
  pontos_recompensa INTEGER DEFAULT 10,
  moedas_recompensa INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de questões
CREATE TABLE IF NOT EXISTS questoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  licao_id UUID NOT NULL REFERENCES licoes(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  mensagem_mascote TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de opções de resposta
CREATE TABLE IF NOT EXISTS opcoes_resposta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  questao_id UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  emoji TEXT,
  correta BOOLEAN DEFAULT FALSE,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELAS DE TURMAS E ESCOLA
-- ============================================

-- Tabela de turmas
CREATE TABLE IF NOT EXISTS turmas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  professor_id UUID NOT NULL REFERENCES professores(id) ON DELETE CASCADE,
  serie TEXT,
  periodo TEXT CHECK (periodo IN ('manha', 'tarde', 'noite')),
  ano_letivo TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relação aluno-turma
CREATE TABLE IF NOT EXISTS aluno_turma (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  data_entrada DATE DEFAULT CURRENT_DATE,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, turma_id)
);

-- ============================================
-- TABELAS DE PROGRESSO E DESEMPENHO
-- ============================================

-- Tabela de progresso do aluno em lições
CREATE TABLE IF NOT EXISTS progresso_licoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  licao_id UUID NOT NULL REFERENCES licoes(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('bloqueada', 'disponivel', 'em_andamento', 'concluida')),
  pontos_ganhos INTEGER DEFAULT 0,
  moedas_ganhas INTEGER DEFAULT 0,
  tentativas INTEGER DEFAULT 0,
  acertos INTEGER DEFAULT 0,
  erros INTEGER DEFAULT 0,
  tempo_total_segundos INTEGER DEFAULT 0,
  data_inicio TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, licao_id)
);

-- Tabela de respostas do aluno
CREATE TABLE IF NOT EXISTS respostas_aluno (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  questao_id UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  opcao_id UUID NOT NULL REFERENCES opcoes_resposta(id) ON DELETE CASCADE,
  correta BOOLEAN NOT NULL,
  tempo_resposta_segundos INTEGER,
  vidas_restantes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de progresso semanal
CREATE TABLE IF NOT EXISTS progresso_semanal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  semana_inicio DATE NOT NULL,
  tempo_estudo_minutos INTEGER DEFAULT 0,
  licoes_completadas INTEGER DEFAULT 0,
  pontos_ganhos INTEGER DEFAULT 0,
  acertos_percentual NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, semana_inicio)
);

-- ============================================
-- TABELAS DE CONQUISTAS E GAMIFICAÇÃO
-- ============================================

-- Tabela de conquistas
CREATE TABLE IF NOT EXISTS conquistas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  icone TEXT NOT NULL,
  cor_gradiente TEXT,
  tipo TEXT CHECK (tipo IN ('sequencia', 'pontos', 'licoes', 'acertos', 'tempo', 'especial')),
  criterio_valor INTEGER,
  imagem_url TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relação aluno-conquistas
CREATE TABLE IF NOT EXISTS aluno_conquistas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  conquista_id UUID NOT NULL REFERENCES conquistas(id) ON DELETE CASCADE,
  data_desbloqueio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, conquista_id)
);

-- Tabela de ranking semanal
CREATE TABLE IF NOT EXISTS ranking_semanal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  semana_inicio DATE NOT NULL,
  pontos_xp INTEGER DEFAULT 0,
  posicao INTEGER,
  tipo TEXT NOT NULL CHECK (tipo IN ('amigos', 'global')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, semana_inicio, tipo)
);

-- ============================================
-- TABELAS DE AMIZADES E SOCIAL
-- ============================================

-- Tabela de amizades
CREATE TABLE IF NOT EXISTS amizades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  amigo_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'aceita', 'recusada', 'bloqueada')),
  solicitado_por UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_resposta TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (aluno_id != amigo_id),
  UNIQUE(aluno_id, amigo_id)
);

-- ============================================
-- TABELAS DE LOJA E INVENTÁRIO
-- ============================================

-- Tabela de itens da loja
CREATE TABLE IF NOT EXISTS itens_loja (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('avatar', 'coruja', 'powerup')),
  subcategoria TEXT,
  preco_moedas INTEGER NOT NULL,
  preco_pontos INTEGER DEFAULT 0,
  raridade TEXT CHECK (raridade IN ('comum', 'raro', 'epico', 'lendario')),
  ativo BOOLEAN DEFAULT TRUE,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de inventário do aluno
CREATE TABLE IF NOT EXISTS inventario_aluno (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES itens_loja(id) ON DELETE CASCADE,
  equipado BOOLEAN DEFAULT FALSE,
  data_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, item_id)
);

-- Tabela de power-ups ativos
CREATE TABLE IF NOT EXISTS powerups_ativos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES itens_loja(id) ON DELETE CASCADE,
  quantidade INTEGER DEFAULT 1,
  usado_em TIMESTAMP WITH TIME ZONE,
  expira_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELAS DE COMUNICAÇÃO
-- ============================================

-- Tabela de chats/conversas
CREATE TABLE IF NOT EXISTS conversas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participante_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participante_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('professor_pais', 'coordenador_pais', 'professor_professor')),
  ultima_mensagem_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (participante_1_id != participante_2_id),
  UNIQUE(participante_1_id, participante_2_id, tipo)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS mensagens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversa_id UUID NOT NULL REFERENCES conversas(id) ON DELETE CASCADE,
  remetente_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de comunicados gerais
CREATE TABLE IF NOT EXISTS comunicados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coordenador_id UUID NOT NULL REFERENCES coordenadores(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('geral', 'turma', 'escola')),
  turma_id UUID REFERENCES turmas(id) ON DELETE CASCADE,
  enviado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELAS DE TAREFAS E MISSÕES
-- ============================================

-- Tabela de tarefas dos pais
CREATE TABLE IF NOT EXISTS tarefas_pais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  pais_id UUID NOT NULL REFERENCES pais(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('licoes', 'tempo', 'pontos', 'personalizada')),
  meta_valor INTEGER NOT NULL,
  unidade TEXT,
  progresso_atual INTEGER DEFAULT 0,
  concluida BOOLEAN DEFAULT FALSE,
  recompensa TEXT,
  data_limite DATE,
  semana_inicio DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELAS DE CONFIGURAÇÕES
-- ============================================

-- Tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS configuracoes_usuario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  efeitos_sonoros BOOLEAN DEFAULT TRUE,
  musica_fundo BOOLEAN DEFAULT FALSE,
  lembretes_estudo BOOLEAN DEFAULT TRUE,
  notificacoes_push BOOLEAN DEFAULT TRUE,
  tema TEXT DEFAULT 'dark' CHECK (tema IN ('light', 'dark', 'auto')),
  idioma TEXT DEFAULT 'pt-BR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índices para perfis
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Índices para alunos
CREATE INDEX IF NOT EXISTS idx_alunos_pontos ON alunos(pontos DESC);
CREATE INDEX IF NOT EXISTS idx_aluno_turma_aluno ON aluno_turma(aluno_id);
CREATE INDEX IF NOT EXISTS idx_aluno_turma_turma ON aluno_turma(turma_id);

-- Índices para progresso
CREATE INDEX IF NOT EXISTS idx_progresso_licoes_aluno ON progresso_licoes(aluno_id);
CREATE INDEX IF NOT EXISTS idx_progresso_licoes_licao ON progresso_licoes(licao_id);
CREATE INDEX IF NOT EXISTS idx_progresso_licoes_status ON progresso_licoes(status);
CREATE INDEX IF NOT EXISTS idx_progresso_semanal_aluno ON progresso_semanal(aluno_id);
CREATE INDEX IF NOT EXISTS idx_progresso_semanal_semana ON progresso_semanal(semana_inicio);

-- Índices para ranking
CREATE INDEX IF NOT EXISTS idx_ranking_semanal_semana ON ranking_semanal(semana_inicio);
CREATE INDEX IF NOT EXISTS idx_ranking_semanal_tipo ON ranking_semanal(tipo);
CREATE INDEX IF NOT EXISTS idx_ranking_semanal_pontos ON ranking_semanal(pontos_xp DESC);

-- Índices para amizades
CREATE INDEX IF NOT EXISTS idx_amizades_aluno ON amizades(aluno_id);
CREATE INDEX IF NOT EXISTS idx_amizades_amigo ON amizades(amigo_id);
CREATE INDEX IF NOT EXISTS idx_amizades_status ON amizades(status);

-- Índices para mensagens
CREATE INDEX IF NOT EXISTS idx_mensagens_conversa ON mensagens(conversa_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_remetente ON mensagens(remetente_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_created ON mensagens(created_at DESC);

-- Índices para busca de texto
CREATE INDEX IF NOT EXISTS idx_profiles_full_name_trgm ON profiles USING gin(full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_username_trgm ON profiles USING gin(username gin_trgm_ops);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alunos_updated_at BEFORE UPDATE ON alunos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professores_updated_at BEFORE UPDATE ON professores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_turmas_updated_at BEFORE UPDATE ON turmas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licoes_updated_at BEFORE UPDATE ON licoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'aluno');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar ranking semanal
CREATE OR REPLACE FUNCTION atualizar_ranking_semanal()
RETURNS TRIGGER AS $$
DECLARE
  semana_atual DATE;
  pontos_total INTEGER;
BEGIN
  semana_atual := DATE_TRUNC('week', CURRENT_DATE)::DATE;
  
  -- Calcular pontos totais do aluno
  SELECT COALESCE(SUM(pontos_ganhos), 0) INTO pontos_total
  FROM progresso_licoes
  WHERE aluno_id = NEW.aluno_id
    AND data_conclusao >= semana_atual;
  
  -- Atualizar ou inserir ranking
  INSERT INTO ranking_semanal (aluno_id, semana_inicio, pontos_xp, tipo)
  VALUES (NEW.aluno_id, semana_atual, pontos_total, 'global')
  ON CONFLICT (aluno_id, semana_inicio, tipo)
  DO UPDATE SET pontos_xp = pontos_total, updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pais ENABLE ROW LEVEL SECURITY;
ALTER TABLE professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresso_licoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE amizades ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario_aluno ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (podem ser ajustadas conforme necessário)
-- Usuários podem ver seus próprios perfis
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Usuários podem atualizar seus próprios perfis
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Alunos podem ver seus próprios dados
CREATE POLICY "Alunos can view own data" ON alunos
  FOR SELECT USING (auth.uid() = id);

-- Professores podem ver alunos de suas turmas
CREATE POLICY "Professores can view alunos in turmas" ON alunos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM aluno_turma at
      JOIN turmas t ON t.id = at.turma_id
      WHERE at.aluno_id = alunos.id
        AND t.professor_id = auth.uid()
    )
  );

-- ============================================
-- DADOS INICIAIS (SEEDS)
-- ============================================

-- Inserir matérias padrão
INSERT INTO materias (nome, slug, descricao, cor_primaria, cor_secundaria, icone, ordem) VALUES
  ('Matemática', 'matematica', 'Reino da Matemática', '#8B5CF6', '#EC4899', 'calculate', 1),
  ('Ciências', 'ciencias', 'Reino de Ciências', '#00F0FF', '#5B13EC', 'science', 2),
  ('História', 'historia', 'Reino de História', '#eca413', '#FFD700', 'history_edu', 3),
  ('Português', 'portugues', 'Reino da Leitura', '#FF6B9D', '#C44569', 'auto_stories', 4),
  ('Geografia', 'geografia', 'Reino da Geografia', '#4ECDC4', '#44A08D', 'public', 5),
  ('Artes', 'artes', 'Reino das Artes', '#F7B731', '#EE5A6F', 'palette', 6)
ON CONFLICT (slug) DO NOTHING;

-- Inserir conquistas padrão
INSERT INTO conquistas (nome, descricao, icone, cor_gradiente, tipo, criterio_valor) VALUES
  ('Mestre da Lógica', 'Complete 10 lições de matemática', 'psychology', 'from-yellow-300 to-amber-500', 'licoes', 10),
  ('Explorador de Ciências', 'Complete 5 lições de ciências', 'rocket_launch', 'from-cyan-400 to-blue-500', 'licoes', 5),
  ('Sequência de 7 dias', 'Estude por 7 dias consecutivos', 'local_fire_department', 'from-lime-300 to-green-500', 'sequencia', 7),
  ('Mestre da Leitura', 'Complete 10 lições de português', 'auto_stories', 'from-pink-400 to-fuchsia-500', 'licoes', 10),
  ('Perfeccionista', 'Complete 10 aulas sem errar', 'star', 'from-yellow-300 to-amber-500', 'acertos', 10),
  ('Sábio', 'Alcançou 5000 XP', 'workspace_premium', 'from-yellow-300 to-amber-500', 'pontos', 5000),
  ('Vitorioso', 'Ficou em 1º lugar no ranking', 'emoji_events', 'from-yellow-300 to-amber-500', 'especial', 1),
  ('Conquistador', 'Completou 100 lições', 'military_tech', 'from-yellow-300 to-amber-500', 'licoes', 100),
  ('Foguete', 'Completou 5 lições em 1 dia', 'rocket_launch', 'from-yellow-300 to-amber-500', 'licoes', 5)
ON CONFLICT DO NOTHING;

