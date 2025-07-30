-- GIVC Medical Coding Platform Database Schema
-- PostgreSQL with Arabic collation support

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Core user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name_ar VARCHAR(100),
    last_name_ar VARCHAR(100),
    role VARCHAR(50) DEFAULT 'student', -- student, instructor, admin, auditor
    language_preference VARCHAR(5) DEFAULT 'en', -- en, ar
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Course structure
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL, -- {ar: "عنوان", en: "Title"}
    description JSONB,
    category VARCHAR(100), -- foundation, coding_systems, specialty_tracks
    duration_hours INTEGER,
    required_accuracy DECIMAL(3,2) DEFAULT 0.95,
    prerequisites UUID[],
    created_by UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Course modules
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title JSONB NOT NULL,
    description JSONB,
    sequence_order INTEGER,
    duration_hours INTEGER,
    learning_objectives JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Lesson plans (core framework implementation)
CREATE TABLE lesson_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title JSONB NOT NULL,
    title_ar VARCHAR(255),
    objectives JSONB NOT NULL,
    objectives_ar JSONB,
    duration_minutes INTEGER DEFAULT 60,
    materials JSONB DEFAULT '{}',
    hook_scenario JSONB,
    content_segments JSONB DEFAULT '[]',
    activities JSONB DEFAULT '[]',
    practical_exercise JSONB,
    assessment JSONB,
    resources JSONB DEFAULT '[]',
    created_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Multimedia resources (10-step workflow implementation)
CREATE TABLE multimedia_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lesson_plans(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- video, interactive, quiz, simulation, slides
    title JSONB,
    url TEXT,
    metadata JSONB DEFAULT '{}', -- storyboard, captions, transcripts
    production_stage VARCHAR(50) DEFAULT 'planning', -- planning, creation, review, published
    workflow_step INTEGER DEFAULT 1, -- 1-10 step process
    quality_score DECIMAL(3,2),
    accessibility_compliant BOOLEAN DEFAULT false,
    languages TEXT[] DEFAULT '{en}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Instructor certifications (8-week program)
CREATE TABLE instructor_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID REFERENCES users(id),
    certification_type VARCHAR(100) DEFAULT 'GIVC Certified Medical Coding Instructor',
    program_start_date DATE,
    current_week INTEGER DEFAULT 1,
    weeks_completed INTEGER DEFAULT 0,
    attendance_rate DECIMAL(3,2) DEFAULT 0.00,
    mock_lesson_score DECIMAL(3,2),
    peer_review_score DECIMAL(3,2),
    assessment_scores JSONB DEFAULT '{}', -- scores for each week
    certified_date DATE,
    expires_date DATE,
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, certified, expired
    created_at TIMESTAMP DEFAULT NOW()
);

-- Training session attendance
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_number INTEGER NOT NULL,
    topic VARCHAR(255) NOT NULL,
    session_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    format VARCHAR(50), -- webinar, workshop, lab, panel
    instructor_id UUID REFERENCES users(id),
    max_participants INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE session_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES training_sessions(id),
    participant_id UUID REFERENCES users(id),
    attended BOOLEAN DEFAULT false,
    participation_score DECIMAL(3,2),
    feedback JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Competency framework
CREATE TABLE competency_framework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200),
    category VARCHAR(100), -- foundation, intermediate, advanced, specialty
    description JSONB,
    required_accuracy DECIMAL(3,2) DEFAULT 0.95,
    prerequisite_competencies UUID[],
    assessment_criteria JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Student competency tracking
CREATE TABLE student_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id),
    competency_id UUID REFERENCES competency_framework(id),
    current_accuracy DECIMAL(3,2) DEFAULT 0.00,
    attempts INTEGER DEFAULT 0,
    best_score DECIMAL(3,2) DEFAULT 0.00,
    achieved_date DATE,
    evidence JSONB DEFAULT '{}', -- links to assessments, projects, certifications
    status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, achieved
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Assessment framework
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lesson_plans(id),
    title JSONB NOT NULL,
    type VARCHAR(50), -- formative, summative, practical, certification
    instructions JSONB,
    duration_minutes INTEGER,
    total_questions INTEGER,
    passing_score DECIMAL(3,2) DEFAULT 0.80,
    max_attempts INTEGER DEFAULT 3,
    questions JSONB DEFAULT '[]',
    rubric JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Student assessment attempts
CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id),
    student_id UUID REFERENCES users(id),
    attempt_number INTEGER,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    time_taken_minutes INTEGER,
    score DECIMAL(5,2),
    percentage DECIMAL(5,2),
    passed BOOLEAN DEFAULT false,
    answers JSONB DEFAULT '{}',
    feedback JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'in_progress' -- in_progress, completed, abandoned
);

-- Question banks for assessment generation
CREATE TABLE question_banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100), -- icd10, cpt, hcpcs, terminology, compliance
    subcategory VARCHAR(100),
    question_text JSONB NOT NULL,
    question_type VARCHAR(50), -- multiple_choice, scenario_based, word_construction, matching
    options JSONB,
    correct_answer JSONB,
    explanation JSONB,
    difficulty VARCHAR(50), -- beginner, intermediate, advanced
    points INTEGER DEFAULT 1,
    tags TEXT[],
    usage_count INTEGER DEFAULT 0,
    accuracy_rate DECIMAL(3,2),
    created_by UUID REFERENCES users(id),
    validated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Content review workflow (quality assurance)
CREATE TABLE content_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL, -- Can reference lessons, multimedia, assessments
    content_type VARCHAR(50) NOT NULL, -- lesson_plan, multimedia, assessment, exercise
    reviewer_id UUID REFERENCES users(id),
    review_type VARCHAR(50) NOT NULL, -- medical_accuracy, educational, cultural, technical, compliance
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, needs_revision
    feedback JSONB DEFAULT '{}',
    score DECIMAL(3,2),
    accuracy_validated BOOLEAN DEFAULT false,
    compliance_verified BOOLEAN DEFAULT false,
    reviewed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Lesson delivery analytics
CREATE TABLE lesson_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lesson_plans(id),
    instructor_id UUID REFERENCES users(id),
    session_date TIMESTAMP,
    student_count INTEGER,
    completion_rate DECIMAL(3,2),
    engagement_score DECIMAL(3,2),
    assessment_avg_score DECIMAL(3,2),
    time_on_task_avg_minutes INTEGER,
    student_feedback JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Virtual lab configurations
CREATE TABLE virtual_labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description JSONB,
    lab_type VARCHAR(100), -- ehr_simulation, encoder_practice, case_study
    configuration JSONB DEFAULT '{}', -- EHR settings, available tools, scenarios
    difficulty_level VARCHAR(50),
    estimated_duration_minutes INTEGER,
    learning_objectives JSONB,
    prerequisite_lessons UUID[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Virtual lab sessions
CREATE TABLE lab_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID REFERENCES virtual_labs(id),
    student_id UUID REFERENCES users(id),
    instructor_id UUID REFERENCES users(id),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    session_data JSONB DEFAULT '{}', -- student actions, codes entered, time stamps
    performance_score DECIMAL(3,2),
    accuracy_score DECIMAL(3,2),
    feedback JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active' -- active, completed, abandoned
);

-- Medical coding validation (compliance hooks)
CREATE TABLE coding_validations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type VARCHAR(50),
    validation_type VARCHAR(50), -- icd10, cpt, hcpcs, modifier, drg
    codes_validated JSONB DEFAULT '[]',
    validation_results JSONB DEFAULT '{}',
    accuracy_score DECIMAL(3,2),
    guidelines_version VARCHAR(50),
    validated_at TIMESTAMP DEFAULT NOW(),
    validator_system VARCHAR(100), -- solventum, 3m, internal
    validation_status VARCHAR(50) DEFAULT 'valid' -- valid, invalid, needs_review
);

-- HIPAA compliance tracking
CREATE TABLE phi_scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type VARCHAR(50),
    scan_date TIMESTAMP DEFAULT NOW(),
    potential_phi_found BOOLEAN DEFAULT false,
    phi_patterns JSONB DEFAULT '[]',
    auto_redacted BOOLEAN DEFAULT false,
    manual_review_required BOOLEAN DEFAULT false,
    compliance_status VARCHAR(50) DEFAULT 'compliant', -- compliant, violation, under_review
    created_at TIMESTAMP DEFAULT NOW()
);

-- Arabic medical terminology management
CREATE TABLE medical_terminology (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    english_term VARCHAR(255) NOT NULL,
    arabic_term VARCHAR(255) NOT NULL,
    transliteration VARCHAR(255),
    category VARCHAR(100), -- anatomy, procedure, condition, medication
    who_emro_code VARCHAR(50),
    snomed_code VARCHAR(50),
    icd_code VARCHAR(50),
    definition_en TEXT,
    definition_ar TEXT,
    usage_frequency INTEGER DEFAULT 0,
    validated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Student progress tracking
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    module_id UUID REFERENCES modules(id),
    lesson_id UUID REFERENCES lesson_plans(id),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    completion_date TIMESTAMP,
    performance_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Certification pathways
CREATE TABLE certification_pathways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    description JSONB,
    pathway_type VARCHAR(100), -- aapc_cpc, ahima_cca, ccp_ksa
    required_modules UUID[],
    required_competencies UUID[],
    min_accuracy_rate DECIMAL(3,2) DEFAULT 0.95,
    estimated_duration_weeks INTEGER,
    certification_fee DECIMAL(10,2),
    external_exam_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Student certifications
CREATE TABLE student_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id),
    pathway_id UUID REFERENCES certification_pathways(id),
    started_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    overall_accuracy DECIMAL(3,2),
    certificate_issued_date DATE,
    certificate_number VARCHAR(100),
    blockchain_hash VARCHAR(255), -- for verification
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed, expired
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_lesson_plans_module ON lesson_plans(module_id);
CREATE INDEX idx_assessments_lesson ON assessments(lesson_id);
CREATE INDEX idx_student_progress_student ON student_progress(student_id);
CREATE INDEX idx_student_progress_course ON student_progress(course_id);
CREATE INDEX idx_competencies_student ON student_competencies(student_id);
CREATE INDEX idx_terminology_english ON medical_terminology(english_term);
CREATE INDEX idx_terminology_arabic ON medical_terminology(arabic_term);

-- Full text search indexes
CREATE INDEX idx_medical_terminology_search ON medical_terminology USING gin(to_tsvector('english', english_term || ' ' || arabic_term));
CREATE INDEX idx_lesson_plans_search ON lesson_plans USING gin(to_tsvector('english', (title->>'en') || ' ' || COALESCE(title->>'ar', '')));

-- Insert default competency framework
INSERT INTO competency_framework (name, name_ar, category, required_accuracy) VALUES
('Medical Terminology Fundamentals', 'أساسيات المصطلحات الطبية', 'foundation', 0.90),
('ICD-10-AM Navigation', 'التنقل في ICD-10-AM', 'foundation', 0.90),
('Basic Coding Principles', 'مبادئ الترميز الأساسية', 'foundation', 0.85),
('SCHI Procedural Coding', 'ترميز الإجراءات SCHI', 'intermediate', 0.95),
('E/M Level Selection', 'اختيار مستوى E/M', 'intermediate', 0.95),
('Complex Surgery Coding', 'ترميز الجراحة المعقدة', 'advanced', 0.95),
('Risk Adjustment Optimization', 'تحسين تعديل المخاطر', 'specialty', 0.98),
('Compliance and Audit Readiness', 'الامتثال والاستعداد للتدقيق', 'advanced', 0.95);

-- Insert default certification pathways
INSERT INTO certification_pathways (name, name_ar, pathway_type, min_accuracy_rate, estimated_duration_weeks) VALUES
('GIVC Medical Coding Foundation', 'شهادة GIVC لأساسيات الترميز الطبي', 'foundation', 0.90, 12),
('CCP-KSA Certification Preparation', 'إعداد شهادة CCP-KSA', 'ccp_ksa', 0.95, 20),
('Advanced Specialty Coding', 'الترميز المتخصص المتقدم', 'specialty', 0.95, 16);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lesson_plans_updated_at BEFORE UPDATE ON lesson_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_competencies_updated_at BEFORE UPDATE ON student_competencies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();