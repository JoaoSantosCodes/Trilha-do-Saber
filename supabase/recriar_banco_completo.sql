-- ============================================
-- RECRIAR BANCO DO ZERO - TRILHA DO SABER
-- ============================================
-- ATENÇÃO: Este script vai DROPAR todas as tabelas e recriar do zero!
-- Execute no SQL Editor do Supabase

-- ============================================
-- PASSO 1: DROPAR TODAS AS TABELAS (em ordem reversa de dependências)
-- ============================================

-- Dropar tabelas de relacionamento primeiro
DROP TABLE IF EXISTS classroom_students CASCADE;
DROP TABLE IF EXISTS classroom_teachers CASCADE;
DROP TABLE IF EXISTS parent_student_relation CASCADE;
DROP TABLE IF EXISTS teacher_subjects CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS student_achievements CASCADE;
DROP TABLE IF EXISTS student_observations CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS lesson_plans CASCADE;
DROP TABLE IF EXISTS learning_materials CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS study_plans CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS parental_controls CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;

-- Dropar tabelas principais
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS classrooms CASCADE;
DROP TABLE IF EXISTS coordinators CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS parents CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Dropar funções e triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS atualizar_ranking_semanal() CASCADE;

-- ============================================
-- PASSO 2: CRIAR EXTENSÕES
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- PASSO 3: CRIAR TABELAS PRINCIPAIS
-- ============================================

-- Tabela de usuários (substitui profiles)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) CHECK (role IN ('student', 'teacher', 'coordinator', 'parent', 'admin')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  phone VARCHAR(50),
  address TEXT,
  birth_date DATE,
  gender VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de alunos
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  grade INTEGER CHECK (grade >= 1 AND grade <= 12),
  school VARCHAR(255),
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  study_time_seconds INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}',
  enrollment_number VARCHAR(255),
  enrollment_status VARCHAR(50) DEFAULT 'active',
  enrollment_date DATE DEFAULT CURRENT_DATE,
  observations TEXT,
  guardian_name VARCHAR(255),
  guardian_phone VARCHAR(50),
  guardian_cpf VARCHAR(50),
  guardian_relationship VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de professores
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  specialization TEXT[],
  school VARCHAR(255),
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de coordenadores
CREATE TABLE coordinators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  school VARCHAR(255),
  department VARCHAR(255),
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pais
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de matérias
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  color VARCHAR(50),
  description TEXT,
  grade_levels INTEGER[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de turmas
CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  grade_level INTEGER CHECK (grade_level >= 1 AND grade_level <= 12),
  school VARCHAR(255),
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  coordinator_id UUID REFERENCES coordinators(id) ON DELETE SET NULL,
  grade INTEGER CHECK (grade >= 1 AND grade <= 9),
  shift VARCHAR(50),
  school_year INTEGER DEFAULT EXTRACT(year FROM CURRENT_DATE),
  max_students INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relacionamento aluno-turma
CREATE TABLE classroom_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  enrolled_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(classroom_id, student_id)
);

-- Tabela de relacionamento professor-turma
CREATE TABLE classroom_teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(classroom_id, teacher_id)
);

-- Tabela de relacionamento pai-aluno
CREATE TABLE parent_student_relation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  relationship VARCHAR(50) NOT NULL,
  can_view_reports BOOLEAN DEFAULT TRUE,
  can_set_goals BOOLEAN DEFAULT TRUE,
  can_limit_time BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(parent_id, student_id)
);

-- Tabela de relacionamento professor-matéria
CREATE TABLE teacher_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, subject_id)
);

-- Tabela de conquistas
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  category VARCHAR(255),
  condition_type VARCHAR(255),
  condition_value INTEGER,
  points_reward INTEGER DEFAULT 0,
  rarity VARCHAR(50) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conquistas do aluno
CREATE TABLE student_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, achievement_id)
);

-- Tabela de questões
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation TEXT,
  difficulty VARCHAR(50) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points INTEGER DEFAULT 10,
  grade_level INTEGER,
  tags TEXT[],
  image_url TEXT,
  usage_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  grade_level INTEGER,
  type VARCHAR(50) CHECK (type IN ('practice', 'test', 'exam')),
  time_limit_minutes INTEGER,
  total_points INTEGER,
  passing_score INTEGER,
  shuffle_questions BOOLEAN DEFAULT TRUE,
  shuffle_options BOOLEAN DEFAULT TRUE,
  show_explanations BOOLEAN DEFAULT TRUE,
  allow_retries BOOLEAN DEFAULT TRUE,
  max_attempts INTEGER,
  available_from TIMESTAMP WITH TIME ZONE,
  available_until TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'ended', 'archived')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de questões do quiz
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  order_number INTEGER,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tentativas de quiz
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_points INTEGER,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER,
  percentage NUMERIC,
  time_spent_seconds INTEGER,
  answers JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões de estudo
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  activities JSONB,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de planos de estudo
CREATE TABLE study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  goal_description TEXT,
  daily_time_goal_minutes INTEGER,
  weekly_quizzes_goal INTEGER,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')),
  progress JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  metadata JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de controles parentais
CREATE TABLE parental_controls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  max_daily_time_minutes INTEGER,
  allowed_start_time TIME,
  allowed_end_time TIME,
  blocked_subjects UUID[],
  require_approval_for_new_content BOOLEAN DEFAULT FALSE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  weekly_report_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de analytics
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(255) NOT NULL,
  event_data JSONB,
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de anúncios
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_published BOOLEAN DEFAULT TRUE,
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expire_date TIMESTAMP WITH TIME ZONE,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de materiais de aprendizado
CREATE TABLE learning_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  material_type VARCHAR(255) NOT NULL,
  file_url TEXT,
  file_size BIGINT,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  downloads_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de eventos do calendário
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(255) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  color VARCHAR(50) DEFAULT '#3b82f6',
  is_all_day BOOLEAN DEFAULT FALSE,
  reminder_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de planos de aula
CREATE TABLE lesson_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  objectives TEXT,
  content TEXT,
  methodology TEXT,
  resources TEXT,
  evaluation TEXT,
  homework TEXT,
  lesson_date DATE NOT NULL,
  duration_minutes INTEGER,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de observações do aluno
CREATE TABLE student_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
  observation_type VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  is_positive BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de presença
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'justified')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notas
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  grade_type VARCHAR(255) NOT NULL,
  grade_value NUMERIC NOT NULL,
  max_grade NUMERIC DEFAULT 10.00,
  weight NUMERIC DEFAULT 1.00,
  period VARCHAR(255),
  evaluation_date DATE NOT NULL,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tarefas
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignment_type VARCHAR(255) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  max_grade NUMERIC DEFAULT 10.00,
  attachments JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de submissões de tarefas
CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  submission_text TEXT,
  attachments JSONB DEFAULT '[]',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  grade NUMERIC,
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late', 'missing'))
);

-- ============================================
-- PASSO 4: CRIAR FUNÇÕES E TRIGGERS
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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON classrooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PASSO 5: HABILITAR RLS EM TODAS AS TABELAS
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_relation ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASSO 6: CRIAR POLÍTICAS RLS
-- ============================================

-- Políticas para users
CREATE POLICY "Anyone authenticated can view users"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert own data"
ON users FOR INSERT
TO public
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
TO public
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Public can insert users"
ON users FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Coordinators can update all users"
ON users FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM coordinators
  WHERE coordinators.user_id = auth.uid()
));

-- Políticas para students
CREATE POLICY "authenticated_view_students"
ON students FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "owner_update_students"
ON students FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "coordinator_manage_students"
ON students FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "public_insert_students"
ON students FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Políticas para teachers
CREATE POLICY "Teachers can view own data"
ON teachers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Teachers can update own data"
ON teachers FOR UPDATE
TO public
USING (user_id = auth.uid());

CREATE POLICY "Teachers can update own profile"
ON teachers FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Teachers can insert own data"
ON teachers FOR INSERT
TO public
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Coordinators can view all teachers"
ON teachers FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators see all teachers"
ON teachers FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM coordinators
  WHERE coordinators.user_id = auth.uid()
));

CREATE POLICY "Public can insert teachers"
ON teachers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Teachers see own data"
ON teachers FOR SELECT
TO public
USING (user_id = auth.uid());

-- Políticas para coordinators
CREATE POLICY "Coordinators can view own data"
ON coordinators FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Coordinators can update own data"
ON coordinators FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator' AND users.id = coordinators.user_id
));

CREATE POLICY "Coordinators can update own profile"
ON coordinators FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Public can insert coordinators"
ON coordinators FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Políticas para parents
CREATE POLICY "Parents can view own data"
ON parents FOR SELECT
TO public
USING (user_id = auth.uid());

CREATE POLICY "Parents can update own data"
ON parents FOR UPDATE
TO public
USING (user_id = auth.uid());

CREATE POLICY "Parents can insert own data"
ON parents FOR INSERT
TO public
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Coordinators can view all parents"
ON parents FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM coordinators
  WHERE coordinators.user_id = auth.uid()
));

-- Políticas para subjects
CREATE POLICY "Authenticated users can view active subjects"
ON subjects FOR SELECT
TO public
USING (auth.role() = 'authenticated' AND is_active = true);

-- Políticas para classrooms
CREATE POLICY "Coordinators can view all classrooms"
ON classrooms FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators can manage classrooms"
ON classrooms FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators can create classrooms"
ON classrooms FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators can update all classrooms"
ON classrooms FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators can delete all classrooms"
ON classrooms FOR DELETE
TO public
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators see all classrooms"
ON classrooms FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM coordinators
  WHERE coordinators.user_id = auth.uid()
));

CREATE POLICY "Teachers can view own classrooms"
ON classrooms FOR SELECT
TO authenticated
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can create classrooms"
ON classrooms FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM teachers
  WHERE teachers.user_id = auth.uid() AND teachers.id = classrooms.teacher_id
));

CREATE POLICY "Teachers can update own classrooms"
ON classrooms FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM teachers
  WHERE teachers.user_id = auth.uid() AND teachers.id = classrooms.teacher_id
));

CREATE POLICY "Teachers can delete own classrooms"
ON classrooms FOR DELETE
TO public
USING (EXISTS (
  SELECT 1 FROM teachers
  WHERE teachers.user_id = auth.uid() AND teachers.id = classrooms.teacher_id
));

CREATE POLICY "Teachers see their classrooms"
ON classrooms FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM classroom_teachers ct
  JOIN teachers t ON t.id = ct.teacher_id
  WHERE t.user_id = auth.uid() AND ct.classroom_id = classrooms.id AND ct.is_active = true
));

CREATE POLICY "Students see their classrooms"
ON classrooms FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM classroom_students cs
  JOIN students s ON s.id = cs.student_id
  WHERE s.user_id = auth.uid() AND cs.classroom_id = classrooms.id AND cs.is_active = true
));

-- Políticas para classroom_students
CREATE POLICY "Coordinators can manage classroom_students"
ON classroom_students FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators see all classroom_students"
ON classroom_students FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM coordinators
  WHERE coordinators.user_id = auth.uid()
));

CREATE POLICY "Students can view own classrooms"
ON classroom_students FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM students
  WHERE students.user_id = auth.uid() AND students.id = classroom_students.student_id
));

CREATE POLICY "Students see own classroom_students"
ON classroom_students FOR SELECT
TO public
USING (student_id IN (
  SELECT s.id FROM students s WHERE s.user_id = auth.uid()
));

CREATE POLICY "Teachers can add students to classrooms"
ON classroom_students FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM classrooms
    JOIN teachers ON teachers.id = classrooms.teacher_id
    JOIN users ON users.id = teachers.user_id
    WHERE users.id = auth.uid() AND classrooms.id = classroom_students.classroom_id
  ) OR EXISTS (
    SELECT 1 FROM classroom_teachers ct
    JOIN teachers t ON t.id = ct.teacher_id
    JOIN users u ON u.id = t.user_id
    WHERE u.id = auth.uid() AND ct.classroom_id = classroom_students.classroom_id AND ct.is_active = true
  )
);

CREATE POLICY "Teachers can remove students from classrooms"
ON classroom_students FOR DELETE
TO public
USING (
  EXISTS (
    SELECT 1 FROM classrooms
    JOIN teachers ON teachers.id = classrooms.teacher_id
    JOIN users ON users.id = teachers.user_id
    WHERE users.id = auth.uid() AND classrooms.id = classroom_students.classroom_id
  ) OR EXISTS (
    SELECT 1 FROM classroom_teachers ct
    JOIN teachers t ON t.id = ct.teacher_id
    JOIN users u ON u.id = t.user_id
    WHERE u.id = auth.uid() AND ct.classroom_id = classroom_students.classroom_id AND ct.is_active = true
  )
);

CREATE POLICY "Teachers see their classroom_students"
ON classroom_students FOR SELECT
TO public
USING (classroom_id IN (
  SELECT ct.classroom_id
  FROM classroom_teachers ct
  JOIN teachers t ON t.id = ct.teacher_id
  WHERE t.user_id = auth.uid() AND ct.is_active = true
));

CREATE POLICY "Parents can view children classrooms"
ON classroom_students FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM parent_student_relation psr
  JOIN parents p ON p.id = psr.parent_id
  JOIN users u ON u.id = p.user_id
  WHERE u.id = auth.uid() AND psr.student_id = classroom_students.student_id
));

-- Políticas para classroom_teachers
CREATE POLICY "Coordinators can assign teachers to classrooms"
ON classroom_teachers FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators can view all classroom_teachers"
ON classroom_teachers FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators can update classroom teachers"
ON classroom_teachers FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators can remove classroom teachers"
ON classroom_teachers FOR DELETE
TO public
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Teachers can view own classroom assignments"
ON classroom_teachers FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM teachers t
  JOIN users u ON u.id = t.user_id
  WHERE u.id = auth.uid() AND t.id = classroom_teachers.teacher_id
));

-- Políticas para parent_student_relation
CREATE POLICY "Coordinators can manage parent_student_relation"
ON parent_student_relation FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators see all relations"
ON parent_student_relation FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM coordinators
  WHERE coordinators.user_id = auth.uid()
));

CREATE POLICY "Parents can create relations"
ON parent_student_relation FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM parents
  WHERE parents.user_id = auth.uid() AND parents.id = parent_student_relation.parent_id
));

CREATE POLICY "Parents can view own relations"
ON parent_student_relation FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM parents
  WHERE parents.user_id = auth.uid() AND parents.id = parent_student_relation.parent_id
));

CREATE POLICY "Parents see own relations"
ON parent_student_relation FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM parents p
  WHERE p.user_id = auth.uid() AND p.id = parent_student_relation.parent_id
));

CREATE POLICY "Parents can view own children"
ON parent_student_relation FOR SELECT
TO authenticated
USING (parent_id IN (
  SELECT users.id FROM users
  WHERE users.id = auth.uid() AND users.role = 'parent'
));

-- Políticas para teacher_subjects
CREATE POLICY "Coordinators can insert teacher subjects"
ON teacher_subjects FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators can view all teacher subjects"
ON teacher_subjects FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Coordinators can delete teacher subjects"
ON teacher_subjects FOR DELETE
TO public
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'coordinator'
));

CREATE POLICY "Teachers can view own subjects"
ON teacher_subjects FOR SELECT
TO public
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

-- Políticas para achievements
CREATE POLICY "Everyone can view active achievements"
ON achievements FOR SELECT
TO public
USING (is_active = true);

-- Políticas para student_achievements
CREATE POLICY "Students can view own achievements"
ON student_achievements FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM students
  WHERE students.user_id = auth.uid() AND students.id = student_achievements.student_id
));

CREATE POLICY "Parents can view children achievements"
ON student_achievements FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM parent_student_relation psr
  JOIN parents p ON p.id = psr.parent_id
  JOIN users u ON u.id = p.user_id
  WHERE u.id = auth.uid() AND psr.student_id = student_achievements.student_id
));

-- Políticas para questions
CREATE POLICY "Everyone can view approved questions"
ON questions FOR SELECT
TO public
USING (approved = true AND is_active = true);

CREATE POLICY "Teachers can create questions"
ON questions FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM teachers
  WHERE teachers.user_id = auth.uid() AND teachers.id = questions.teacher_id
));

CREATE POLICY "Teachers can update own questions"
ON questions FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM teachers
  WHERE teachers.user_id = auth.uid() AND teachers.id = questions.teacher_id
));

CREATE POLICY "Teachers can view own questions"
ON questions FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM teachers
  WHERE teachers.user_id = auth.uid() AND teachers.id = questions.teacher_id
));

-- Políticas para quizzes
CREATE POLICY "Everyone can view active quizzes"
ON quizzes FOR SELECT
TO public
USING (
  is_active = true
  AND status IN ('active', 'scheduled')
  AND (available_from IS NULL OR available_from <= now())
  AND (available_until IS NULL OR available_until >= now())
);

CREATE POLICY "Teachers can create quizzes"
ON quizzes FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM teachers
  WHERE teachers.user_id = auth.uid() AND teachers.id = quizzes.teacher_id
));

CREATE POLICY "Teachers can update own quizzes"
ON quizzes FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM teachers
  WHERE teachers.user_id = auth.uid() AND teachers.id = quizzes.teacher_id
));

CREATE POLICY "Teachers can view own quizzes"
ON quizzes FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM teachers
  WHERE teachers.user_id = auth.uid() AND teachers.id = quizzes.teacher_id
));

-- Políticas para quiz_questions
CREATE POLICY "Teachers can create quiz questions"
ON quiz_questions FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM quizzes
  JOIN teachers ON teachers.id = quizzes.teacher_id
  JOIN users ON users.id = teachers.user_id
  WHERE users.id = auth.uid() AND quizzes.id = quiz_questions.quiz_id
));

CREATE POLICY "Teachers can view quiz questions"
ON quiz_questions FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM quizzes
  JOIN teachers ON teachers.id = quizzes.teacher_id
  JOIN users ON users.id = teachers.user_id
  WHERE users.id = auth.uid() AND quizzes.id = quiz_questions.quiz_id
));

CREATE POLICY "Teachers can update quiz questions"
ON quiz_questions FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM quizzes
  JOIN teachers ON teachers.id = quizzes.teacher_id
  JOIN users ON users.id = teachers.user_id
  WHERE users.id = auth.uid() AND quizzes.id = quiz_questions.quiz_id
));

CREATE POLICY "Teachers can delete quiz questions"
ON quiz_questions FOR DELETE
TO public
USING (EXISTS (
  SELECT 1 FROM quizzes
  JOIN teachers ON teachers.id = quizzes.teacher_id
  JOIN users ON users.id = teachers.user_id
  WHERE users.id = auth.uid() AND quizzes.id = quiz_questions.quiz_id
));

-- Políticas para quiz_attempts
CREATE POLICY "Students can create attempts"
ON quiz_attempts FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM students
  WHERE students.user_id = auth.uid() AND students.id = quiz_attempts.student_id
));

CREATE POLICY "Students can view own attempts"
ON quiz_attempts FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM students
  WHERE students.user_id = auth.uid() AND students.id = quiz_attempts.student_id
));

CREATE POLICY "Students can update own attempts"
ON quiz_attempts FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM students
  WHERE students.user_id = auth.uid() AND students.id = quiz_attempts.student_id
));

CREATE POLICY "Teachers can view attempts of own quizzes"
ON quiz_attempts FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM quizzes
  JOIN teachers ON teachers.id = quizzes.teacher_id
  WHERE teachers.user_id = auth.uid() AND quizzes.id = quiz_attempts.quiz_id
));

CREATE POLICY "Parents can view children attempts"
ON quiz_attempts FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM parent_student_relation psr
  JOIN parents p ON p.id = psr.parent_id
  JOIN users u ON u.id = p.user_id
  WHERE u.id = auth.uid() AND psr.student_id = quiz_attempts.student_id
));

-- Políticas para study_sessions
CREATE POLICY "Students can create sessions"
ON study_sessions FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM students
  WHERE students.user_id = auth.uid() AND students.id = study_sessions.student_id
));

CREATE POLICY "Students can view own sessions"
ON study_sessions FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM students
  WHERE students.user_id = auth.uid() AND students.id = study_sessions.student_id
));

CREATE POLICY "Students can update own sessions"
ON study_sessions FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM students
  WHERE students.user_id = auth.uid() AND students.id = study_sessions.student_id
));

CREATE POLICY "Parents can view children sessions"
ON study_sessions FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM parent_student_relation psr
  JOIN parents p ON p.id = psr.parent_id
  JOIN users u ON u.id = p.user_id
  WHERE u.id = auth.uid() AND psr.student_id = study_sessions.student_id
));

-- Políticas para study_plans
CREATE POLICY "Authorized users can create plans"
ON study_plans FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM students
  WHERE students.user_id = auth.uid() AND students.id = study_plans.student_id
));

CREATE POLICY "Students can view own plans"
ON study_plans FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM students
  WHERE students.user_id = auth.uid() AND students.id = study_plans.student_id
));

CREATE POLICY "Parents can view children plans"
ON study_plans FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM parent_student_relation psr
  JOIN parents p ON p.id = psr.parent_id
  JOIN users u ON u.id = p.user_id
  WHERE u.id = auth.uid() AND psr.student_id = study_plans.student_id
));

-- Políticas para messages
CREATE POLICY "Users can create messages"
ON messages FOR INSERT
TO public
WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can view own messages"
ON messages FOR SELECT
TO public
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can update sent messages"
ON messages FOR UPDATE
TO public
USING (auth.uid() = from_user_id);

-- Políticas para notifications
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
TO public
USING (auth.uid() = user_id);

-- Políticas para parental_controls
CREATE POLICY "Parents can view own controls"
ON parental_controls FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM parents
  WHERE parents.user_id = auth.uid() AND parents.id = parental_controls.parent_id
));

CREATE POLICY "Parents can manage own controls"
ON parental_controls FOR ALL
TO public
USING (EXISTS (
  SELECT 1 FROM parents
  WHERE parents.user_id = auth.uid() AND parents.id = parental_controls.parent_id
));

-- Políticas para analytics_events
CREATE POLICY "Users can create analytics events"
ON analytics_events FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Políticas para announcements
CREATE POLICY "Students can view published announcements of their classrooms"
ON announcements FOR SELECT
TO authenticated
USING (
  is_published = true
  AND (
    classroom_id IS NULL
    OR classroom_id IN (
      SELECT classroom_students.classroom_id
      FROM classroom_students
      WHERE classroom_students.student_id IN (
        SELECT students.id FROM students WHERE students.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Teachers can manage their announcements"
ON announcements FOR ALL
TO authenticated
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

-- Políticas para learning_materials
CREATE POLICY "Students can view materials of their classrooms"
ON learning_materials FOR SELECT
TO authenticated
USING (
  classroom_id IN (
    SELECT classroom_students.classroom_id
    FROM classroom_students
    WHERE classroom_students.student_id IN (
      SELECT students.id FROM students WHERE students.user_id = auth.uid()
    )
  )
  OR is_public = true
);

CREATE POLICY "Teachers can manage their materials"
ON learning_materials FOR ALL
TO authenticated
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

-- Políticas para calendar_events
CREATE POLICY "Students can view events of their classrooms"
ON calendar_events FOR SELECT
TO authenticated
USING (classroom_id IN (
  SELECT classroom_students.classroom_id
  FROM classroom_students
  WHERE classroom_students.student_id IN (
    SELECT students.id FROM students WHERE students.user_id = auth.uid()
  )
));

CREATE POLICY "Teachers can manage their events"
ON calendar_events FOR ALL
TO authenticated
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

-- Políticas para lesson_plans
CREATE POLICY "Teachers can manage their lesson plans"
ON lesson_plans FOR ALL
TO authenticated
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

-- Políticas para student_observations
CREATE POLICY "Students can view non-private observations about themselves"
ON student_observations FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT students.id FROM students WHERE students.user_id = auth.uid()
  )
  AND is_private = false
);

CREATE POLICY "Teachers can manage observations"
ON student_observations FOR ALL
TO authenticated
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

-- Políticas para attendance
CREATE POLICY "Teachers can insert attendance for their classrooms"
ON attendance FOR INSERT
TO authenticated
WITH CHECK (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

CREATE POLICY "Teachers can view attendance of their classrooms"
ON attendance FOR SELECT
TO authenticated
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

CREATE POLICY "Teachers can update attendance for their classrooms"
ON attendance FOR UPDATE
TO authenticated
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

-- Políticas para grades
CREATE POLICY "Students can view their own grades"
ON grades FOR SELECT
TO authenticated
USING (student_id IN (
  SELECT students.id FROM students WHERE students.user_id = auth.uid()
));

CREATE POLICY "Teachers can insert grades for their classrooms"
ON grades FOR INSERT
TO authenticated
WITH CHECK (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

CREATE POLICY "Teachers can view grades of their classrooms"
ON grades FOR SELECT
TO authenticated
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

CREATE POLICY "Teachers can update grades for their classrooms"
ON grades FOR UPDATE
TO authenticated
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

-- Políticas para assignments
CREATE POLICY "Students can view published assignments of their classrooms"
ON assignments FOR SELECT
TO authenticated
USING (
  is_published = true
  AND classroom_id IN (
    SELECT classroom_students.classroom_id
    FROM classroom_students
    WHERE classroom_students.student_id IN (
      SELECT students.id FROM students WHERE students.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Teachers can manage their assignments"
ON assignments FOR ALL
TO authenticated
USING (teacher_id IN (
  SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
));

-- Políticas para assignment_submissions
CREATE POLICY "Students can manage their own submissions"
ON assignment_submissions FOR ALL
TO authenticated
USING (student_id IN (
  SELECT students.id FROM students WHERE students.user_id = auth.uid()
));

CREATE POLICY "Teachers can view submissions of their assignments"
ON assignment_submissions FOR SELECT
TO authenticated
USING (assignment_id IN (
  SELECT assignments.id
  FROM assignments
  WHERE assignments.teacher_id IN (
    SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
  )
));

CREATE POLICY "Teachers can grade submissions of their assignments"
ON assignment_submissions FOR UPDATE
TO authenticated
USING (assignment_id IN (
  SELECT assignments.id
  FROM assignments
  WHERE assignments.teacher_id IN (
    SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
  )
));

-- ============================================
-- PASSO 7: FORÇAR RELOAD DO SCHEMA CACHE
-- ============================================

NOTIFY pgrst, 'reload schema';

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- Após executar este script:
-- 1. Aguarde 30 segundos para o schema cache recarregar
-- 2. Teste a aplicação novamente
-- 3. Se ainda houver problemas, verifique os logs do PostgREST

