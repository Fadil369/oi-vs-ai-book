-- Arabic-English Medical Terminology Database
-- Based on WHO Arabic Medical Dictionary and Saudi-specific medical terms
-- Comprehensive database supporting bilingual medical coding education

-- Drop existing tables if they exist
DROP TABLE IF EXISTS terminology_translations CASCADE;
DROP TABLE IF EXISTS medical_terminology_enhanced CASCADE;
DROP TABLE IF EXISTS terminology_categories CASCADE;
DROP TABLE IF EXISTS terminology_synonyms CASCADE;
DROP TABLE IF EXISTS terminology_usage_stats CASCADE;
DROP TABLE IF EXISTS terminology_validation_rules CASCADE;

-- Create enhanced terminology categories
CREATE TABLE terminology_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(20) UNIQUE NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    parent_category_id UUID REFERENCES terminology_categories(id),
    description_en TEXT,
    description_ar TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced medical terminology table
CREATE TABLE medical_terminology_enhanced (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core terminology data
    english_term VARCHAR(255) NOT NULL,
    arabic_term VARCHAR(255) NOT NULL,
    transliteration VARCHAR(255),
    
    -- Categorization
    category_id UUID REFERENCES terminology_categories(id),
    subcategory VARCHAR(100),
    term_type VARCHAR(50) NOT NULL, -- anatomy, condition, procedure, medication, device, etc.
    
    -- Medical coding systems
    icd10_code VARCHAR(20),
    icd10_am_code VARCHAR(20),
    schi_code VARCHAR(50),
    cpt_code VARCHAR(10),
    hcpcs_code VARCHAR(10),
    snomed_code VARCHAR(20),
    who_emro_code VARCHAR(50),
    
    -- Language and regional data
    arabic_script_type VARCHAR(20) DEFAULT 'standard', -- standard, traditional, colloquial
    regional_variants JSONB DEFAULT '{}', -- {"saudi": "...", "gulf": "...", "levant": "..."}
    pronunciation_guide VARCHAR(500),
    
    -- Usage and context
    definition_en TEXT,
    definition_ar TEXT,
    usage_context TEXT, -- inpatient, outpatient, emergency, surgical, etc.
    clinical_specialty VARCHAR(100),
    frequency_score INTEGER DEFAULT 0,
    difficulty_level VARCHAR(20) DEFAULT 'intermediate', -- beginner, intermediate, advanced
    
    -- Educational metadata
    learning_objectives JSONB DEFAULT '[]',
    common_mistakes JSONB DEFAULT '[]',
    teaching_notes_en TEXT,
    teaching_notes_ar TEXT,
    
    -- Quality and validation
    verified_by UUID REFERENCES users(id),
    verification_date TIMESTAMP,
    accuracy_rating DECIMAL(3,2) DEFAULT 5.00,
    last_reviewed TIMESTAMP,
    review_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, needs_revision
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- Indexes
    UNIQUE(english_term, arabic_term, category_id)
);

-- Terminology translations and variations
CREATE TABLE terminology_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_term_id UUID REFERENCES medical_terminology_enhanced(id) ON DELETE CASCADE,
    
    -- Translation variations
    translation_type VARCHAR(50) NOT NULL, -- synonym, abbreviation, acronym, formal, informal
    english_variant VARCHAR(255),
    arabic_variant VARCHAR(255),
    
    -- Context and usage
    usage_context VARCHAR(100),
    formality_level VARCHAR(20), -- formal, informal, technical, colloquial
    regional_preference VARCHAR(50), -- saudi, gulf, general_arabic
    
    -- Quality metrics
    confidence_score DECIMAL(3,2) DEFAULT 0.95,
    usage_frequency INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Terminology synonyms and related terms
CREATE TABLE terminology_synonyms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_term_id UUID REFERENCES medical_terminology_enhanced(id),
    synonym_term_id UUID REFERENCES medical_terminology_enhanced(id),
    relationship_type VARCHAR(50), -- synonym, antonym, related, broader, narrower
    confidence_score DECIMAL(3,2) DEFAULT 0.90,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Usage statistics and analytics
CREATE TABLE terminology_usage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID REFERENCES medical_terminology_enhanced(id),
    usage_date DATE NOT NULL,
    
    -- Usage metrics
    search_count INTEGER DEFAULT 0,
    lookup_count INTEGER DEFAULT 0,
    correct_usage_count INTEGER DEFAULT 0,
    incorrect_usage_count INTEGER DEFAULT 0,
    
    -- Context tracking
    context_breakdown JSONB DEFAULT '{}', -- {"education": 10, "clinical": 5, "research": 2}
    user_level_breakdown JSONB DEFAULT '{}', -- {"beginner": 8, "intermediate": 7, "advanced": 2}
    
    -- Performance metrics
    average_response_time_ms INTEGER DEFAULT 0,
    
    UNIQUE(term_id, usage_date)
);

-- Validation rules for terminology
CREATE TABLE terminology_validation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- format, content, relationship, context
    
    -- Rule definition
    rule_pattern TEXT, -- Regex or validation pattern
    validation_function TEXT, -- Custom validation function name
    error_message_en TEXT,
    error_message_ar TEXT,
    
    -- Application scope
    applies_to_categories VARCHAR(200)[], -- Array of category codes
    applies_to_term_types VARCHAR(100)[], -- Array of term types
    
    -- Rule metadata
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert terminology categories
INSERT INTO terminology_categories (category_code, name_en, name_ar, description_en, description_ar, display_order) VALUES
-- Body Systems
('ANAT', 'Anatomy', 'التشريح', 'Anatomical structures and body parts', 'التراكيب التشريحية وأجزاء الجسم', 1),
('CARD', 'Cardiovascular', 'القلب والأوعية الدموية', 'Heart and blood vessel related terms', 'المصطلحات المتعلقة بالقلب والأوعية الدموية', 2),
('RESP', 'Respiratory', 'الجهاز التنفسي', 'Respiratory system terms', 'مصطلحات الجهاز التنفسي', 3),
('GAST', 'Gastrointestinal', 'الجهاز الهضمي', 'Digestive system terms', 'مصطلحات الجهاز الهضمي', 4),
('NEUR', 'Neurological', 'الجهاز العصبي', 'Nervous system terms', 'مصطلحات الجهاز العصبي', 5),
('ENDO', 'Endocrine', 'الغدد الصماء', 'Endocrine system terms', 'مصطلحات الغدد الصماء', 6),
('REPRO', 'Reproductive', 'الجهاز التناسلي', 'Reproductive system terms', 'مصطلحات الجهاز التناسلي', 7),
('MUSC', 'Musculoskeletal', 'الجهاز العضلي الهيكلي', 'Muscle and bone system terms', 'مصطلحات الجهاز العضلي والهيكلي', 8),
('DERM', 'Dermatological', 'الجلدية', 'Skin and dermatological terms', 'مصطلحات الجلد والأمراض الجلدية', 9),
('OPHTH', 'Ophthalmological', 'طب العيون', 'Eye and vision related terms', 'مصطلحات العين والرؤية', 10),
('ENT', 'Ear, Nose, Throat', 'الأنف والأذن والحنجرة', 'ENT system terms', 'مصطلحات الأنف والأذن والحنجرة', 11),
('URIN', 'Urinary', 'الجهاز البولي', 'Urinary system terms', 'مصطلحات الجهاز البولي', 12),

-- Medical Specialties
('EMERG', 'Emergency Medicine', 'طب الطوارئ', 'Emergency and urgent care terms', 'مصطلحات الطوارئ والعناية الفورية', 20),
('SURG', 'Surgery', 'الجراحة', 'Surgical procedures and terms', 'العمليات الجراحية والمصطلحات الجراحية', 21),
('ANES', 'Anesthesia', 'التخدير', 'Anesthesia and sedation terms', 'مصطلحات التخدير والتهدئة', 22),
('RADI', 'Radiology', 'الأشعة', 'Imaging and radiology terms', 'مصطلحات التصوير والأشعة', 23),
('PATH', 'Pathology', 'علم الأمراض', 'Pathological and laboratory terms', 'مصطلحات الأمراض والمختبر', 24),
('ONCO', 'Oncology', 'طب الأورام', 'Cancer and oncology terms', 'مصطلحات السرطان والأورام', 25),
('MENT', 'Mental Health', 'الصحة النفسية', 'Psychiatric and mental health terms', 'مصطلحات الطب النفسي والصحة النفسية', 26),

-- Healthcare Administration
('ADMIN', 'Healthcare Administration', 'الإدارة الصحية', 'Administrative and management terms', 'المصطلحات الإدارية والإدارة', 30),
('BILL', 'Medical Billing', 'الفوترة الطبية', 'Billing and reimbursement terms', 'مصطلحات الفوترة والتعويض', 31),
('QUAL', 'Quality Assurance', 'ضمان الجودة', 'Quality and safety terms', 'مصطلحات الجودة والسلامة', 32),
('COMP', 'Compliance', 'الامتثال', 'Regulatory and compliance terms', 'المصطلحات التنظيمية والامتثال', 33),

-- Saudi-Specific
('SAUDI', 'Saudi Healthcare', 'الرعاية الصحية السعودية', 'Saudi Arabia specific healthcare terms', 'مصطلحات الرعاية الصحية الخاصة بالمملكة العربية السعودية', 40),
('NPHIES', 'NPHIES Platform', 'منصة نفيس', 'NPHIES platform specific terms', 'مصطلحات خاصة بمنصة نفيس', 41),
('MOH', 'Ministry of Health', 'وزارة الصحة', 'Saudi Ministry of Health terms', 'مصطلحات وزارة الصحة السعودية', 42);

-- Insert comprehensive medical terminology
INSERT INTO medical_terminology_enhanced (
    english_term, arabic_term, transliteration, category_id, term_type,
    icd10_code, icd10_am_code, definition_en, definition_ar,
    clinical_specialty, frequency_score, difficulty_level
) VALUES
-- Cardiovascular terms
('Myocardial Infarction', 'احتشاء عضلة القلب', 'ihtishah aadalat alqalb', 
 (SELECT id FROM terminology_categories WHERE category_code = 'CARD'), 'condition',
 'I21.9', 'I21.9', 
 'Death of heart muscle due to insufficient blood flow', 
 'موت عضلة القلب بسبب عدم كفاية تدفق الدم',
 'Cardiology', 95, 'intermediate'),

('Hypertension', 'ارتفاع ضغط الدم', 'irtifaa daght aldam',
 (SELECT id FROM terminology_categories WHERE category_code = 'CARD'), 'condition',
 'I10', 'I10',
 'High blood pressure', 'ضغط الدم المرتفع',
 'Cardiology', 98, 'beginner'),

('Cardiac Catheterization', 'قسطرة القلب', 'qastarat alqalb',
 (SELECT id FROM terminology_categories WHERE category_code = 'CARD'), 'procedure',
 NULL, NULL,
 'Minimally invasive procedure to access the coronary circulation', 
 'إجراء طفيف التوغل للوصول إلى الدورة الدموية التاجية',
 'Cardiology', 85, 'advanced'),

-- Respiratory terms
('Pneumonia', 'التهاب رئوي', 'iltihab riawy',
 (SELECT id FROM terminology_categories WHERE category_code = 'RESP'), 'condition',
 'J18.9', 'J18.9',
 'Infection that inflames air sacs in one or both lungs',
 'عدوى تسبب التهاب الأكياس الهوائية في إحدى الرئتين أو كلتيهما',
 'Pulmonology', 90, 'intermediate'),

('Dyspnea', 'ضيق التنفس', 'dayq altanafus',
 (SELECT id FROM terminology_categories WHERE category_code = 'RESP'), 'symptom',
 'R06.0', 'R06.0',
 'Difficult or labored breathing', 'صعوبة أو ضيق في التنفس',
 'Pulmonology', 88, 'beginner'),

('Bronchoscopy', 'تنظير القصبات', 'tandheer alqasabat',
 (SELECT id FROM terminology_categories WHERE category_code = 'RESP'), 'procedure',
 NULL, NULL,
 'Procedure to look inside the airways and lungs',
 'إجراء للنظر داخل المجاري الهوائية والرئتين',
 'Pulmonology', 70, 'advanced'),

-- Gastrointestinal terms
('Gastroenteritis', 'التهاب المعدة والأمعاء', 'iltihab almiada wal amaa',
 (SELECT id FROM terminology_categories WHERE category_code = 'GAST'), 'condition',
 'K59.1', 'K59.1',
 'Inflammation of the stomach and intestines',
 'التهاب المعدة والأمعاء',
 'Gastroenterology', 85, 'intermediate'),

('Endoscopy', 'تنظير داخلي', 'tandheer dakhily',
 (SELECT id FROM terminology_categories WHERE category_code = 'GAST'), 'procedure',
 NULL, NULL,
 'Procedure using an endoscope to examine interior of a hollow organ',
 'إجراء باستخدام المنظار لفحص داخل عضو أجوف',
 'Gastroenterology', 80, 'intermediate'),

-- Endocrine terms
('Diabetes Mellitus', 'داء السكري', 'daa alsukkary',
 (SELECT id FROM terminology_categories WHERE category_code = 'ENDO'), 'condition',
 'E11.9', 'E11.9',
 'Group of metabolic disorders characterized by high blood sugar',
 'مجموعة من الاضطرابات الأيضية تتميز بارتفاع سكر الدم',
 'Endocrinology', 95, 'intermediate'),

('Thyroid Gland', 'الغدة الدرقية', 'alghudda aldaraqiyya',
 (SELECT id FROM terminology_categories WHERE category_code = 'ENDO'), 'anatomy',
 NULL, NULL,
 'Butterfly-shaped gland in the neck that produces hormones',
 'غدة على شكل فراشة في الرقبة تنتج الهرمونات',
 'Endocrinology', 80, 'beginner'),

-- Surgical terms
('Appendectomy', 'استئصال الزائدة الدودية', 'istisal alzaida aldudiya',
 (SELECT id FROM terminology_categories WHERE category_code = 'SURG'), 'procedure',
 NULL, NULL,
 'Surgical removal of the appendix',
 'الاستئصال الجراحي للزائدة الدودية',
 'General Surgery', 75, 'intermediate'),

('Laparoscopy', 'تنظير البطن', 'tandheer albatn',
 (SELECT id FROM terminology_categories WHERE category_code = 'SURG'), 'procedure',
 NULL, NULL,
 'Minimally invasive surgical technique using small incisions',
 'تقنية جراحية طفيفة التوغل تستخدم شقوق صغيرة',
 'General Surgery', 70, 'advanced'),

-- Emergency Medicine terms
('Trauma', 'رضح', 'radh',
 (SELECT id FROM terminology_categories WHERE category_code = 'EMERG'), 'condition',
 'T07', 'T07',
 'Physical injury caused by external force',
 'إصابة جسدية ناجمة عن قوة خارجية',
 'Emergency Medicine', 90, 'intermediate'),

('Resuscitation', 'إنعاش', 'inaash',
 (SELECT id FROM terminology_categories WHERE category_code = 'EMERG'), 'procedure',
 NULL, NULL,
 'Emergency procedure to restore life or consciousness',
 'إجراء طارئ لاستعادة الحياة أو الوعي',
 'Emergency Medicine', 85, 'advanced'),

-- Saudi-specific terms
('NPHIES', 'نفيس', 'naphis',
 (SELECT id FROM terminology_categories WHERE category_code = 'NPHIES'), 'system',
 NULL, NULL,
 'National Platform for Health Information Exchange Services',
 'المنصة الوطنية لتبادل المعلومات الصحية',
 'Health Information', 95, 'intermediate'),

('SCHI', 'التصنيف السعودي للتدخلات الصحية', 'altasnif alsudy liltadakhulat alsihiya',
 (SELECT id FROM terminology_categories WHERE category_code = 'SAUDI'), 'system',
 NULL, NULL,
 'Saudi Classification of Health Interventions',
 'التصنيف السعودي للتدخلات الصحية',
 'Medical Coding', 90, 'advanced'),

('Ministry of Health', 'وزارة الصحة', 'wizarat alsiha',
 (SELECT id FROM terminology_categories WHERE category_code = 'MOH'), 'organization',
 NULL, NULL,
 'Saudi Ministry of Health',
 'وزارة الصحة السعودية',
 'Healthcare Administration', 85, 'beginner'),

('Saudi Commission for Health Specialties', 'الهيئة السعودية للتخصصات الصحية', 'alhayia alsuudiya liltakhassusat alsihiya',
 (SELECT id FROM terminology_categories WHERE category_code = 'SAUDI'), 'organization',
 NULL, NULL,
 'SCFHS - Regulatory body for health professionals in Saudi Arabia',
 'الهيئة السعودية للتخصصات الصحية - الجهة التنظيمية للمهنيين الصحيين في المملكة',
 'Healthcare Administration', 80, 'intermediate'),

-- Medical coding specific terms
('International Classification of Diseases', 'التصنيف الدولي للأمراض', 'altasnif aldawly lil amrad',
 (SELECT id FROM terminology_categories WHERE category_code = 'ADMIN'), 'system',
 NULL, NULL,
 'ICD - Medical classification system',
 'التصنيف الدولي للأمراض - نظام تصنيف طبي',
 'Medical Coding', 95, 'intermediate'),

('Current Procedural Terminology', 'المصطلحات الإجرائية الحالية', 'almustalahat alijaraiya alhaaliya',
 (SELECT id FROM terminology_categories WHERE category_code = 'ADMIN'), 'system',
 NULL, NULL,
 'CPT - Medical procedural coding system',
 'رموز الإجراءات الطبية الحالية - نظام ترميز الإجراءات الطبية',
 'Medical Coding', 90, 'intermediate'),

-- Anatomical terms
('Heart', 'قلب', 'qalb',
 (SELECT id FROM terminology_categories WHERE category_code = 'ANAT'), 'anatomy',
 NULL, NULL,
 'Muscular organ that pumps blood',
 'العضو العضلي الذي يضخ الدم',
 'Anatomy', 100, 'beginner'),

('Liver', 'كبد', 'kabid',
 (SELECT id FROM terminology_categories WHERE category_code = 'ANAT'), 'anatomy',
 NULL, NULL,
 'Large organ that processes nutrients and toxins',
 'العضو الكبير الذي يعالج المواد الغذائية والسموم',
 'Anatomy', 95, 'beginner'),

('Kidney', 'كلية', 'kulya',
 (SELECT id FROM terminology_categories WHERE category_code = 'ANAT'), 'anatomy',
 NULL, NULL,
 'Organ that filters blood and produces urine',
 'العضو الذي يرشح الدم وينتج البول',
 'Anatomy', 95, 'beginner'),

-- Common symptoms
('Pain', 'ألم', 'alam',
 (SELECT id FROM terminology_categories WHERE category_code = 'ANAT'), 'symptom',
 'R52', 'R52',
 'Unpleasant sensory and emotional experience',
 'تجربة حسية وعاطفية غير سارة',
 'General Medicine', 100, 'beginner'),

('Fever', 'حمى', 'humma',
 (SELECT id FROM terminology_categories WHERE category_code = 'ANAT'), 'symptom',
 'R50.9', 'R50.9',
 'Elevated body temperature',
 'ارتفاع درجة حرارة الجسم',
 'General Medicine', 98, 'beginner'),

('Nausea', 'غثيان', 'ghathayan',
 (SELECT id FROM terminology_categories WHERE category_code = 'ANAT'), 'symptom',
 'R11.0', 'R11.0',
 'Feeling of sickness with urge to vomit',
 'الشعور بالمرض مع الرغبة في القيء',
 'General Medicine', 85, 'beginner');

-- Insert terminology translations (variations and synonyms)
INSERT INTO terminology_translations (base_term_id, translation_type, english_variant, arabic_variant, usage_context, formality_level, regional_preference) VALUES
-- Heart attack variations
((SELECT id FROM medical_terminology_enhanced WHERE english_term = 'Myocardial Infarction'), 'synonym', 'Heart Attack', 'نوبة قلبية', 'patient_education', 'informal', 'general_arabic'),
((SELECT id FROM medical_terminology_enhanced WHERE english_term = 'Myocardial Infarction'), 'synonym', 'MI', 'احتشاء', 'clinical_documentation', 'formal', 'general_arabic'),

-- Diabetes variations
((SELECT id FROM medical_terminology_enhanced WHERE english_term = 'Diabetes Mellitus'), 'synonym', 'Diabetes', 'السكري', 'general', 'informal', 'general_arabic'),
((SELECT id FROM medical_terminology_enhanced WHERE english_term = 'Diabetes Mellitus'), 'synonym', 'DM', 'س.د', 'clinical_documentation', 'formal', 'general_arabic'),

-- Pain variations
((SELECT id FROM medical_terminology_enhanced WHERE english_term = 'Pain'), 'synonym', 'Ache', 'وجع', 'patient_communication', 'informal', 'general_arabic'),
((SELECT id FROM medical_terminology_enhanced WHERE english_term = 'Pain'), 'synonym', 'Discomfort', 'إزعاج', 'patient_communication', 'formal', 'general_arabic'),

-- Saudi-specific variations
((SELECT id FROM medical_terminology_enhanced WHERE english_term = 'Ministry of Health'), 'abbreviation', 'MOH', 'و.ص', 'administrative', 'formal', 'saudi'),
((SELECT id FROM medical_terminology_enhanced WHERE english_term = 'NPHIES'), 'formal', 'National Platform for Health Information Exchange Services', 'المنصة الوطنية لتبادل المعلومات الصحية', 'official_documentation', 'formal', 'saudi');

-- Insert validation rules
INSERT INTO terminology_validation_rules (rule_name, rule_type, rule_pattern, error_message_en, error_message_ar, applies_to_categories, severity) VALUES
('Arabic Term Required', 'content', NULL, 'Arabic translation is required for all medical terms', 'الترجمة العربية مطلوبة لجميع المصطلحات الطبية', ARRAY['ANAT', 'CARD', 'RESP', 'GAST'], 'high'),
('ICD Code Format', 'format', '^[A-Z]\d{2}(\.\d{1,3})?$', 'ICD-10 code must follow proper format (e.g., I21.9)', 'رمز ICD-10 يجب أن يتبع التنسيق الصحيح', ARRAY['CARD', 'RESP', 'GAST', 'ENDO'], 'medium'),
('SCHI Code Format', 'format', '^SCHI-\d{4,6}$', 'SCHI code must follow format SCHI-XXXX', 'رمز SCHI يجب أن يتبع تنسيق SCHI-XXXX', ARRAY['SAUDI'], 'high'),
('Definition Required', 'content', NULL, 'Definition is required in both languages', 'التعريف مطلوب بكلا اللغتين', ARRAY['ANAT', 'CARD', 'RESP', 'GAST', 'ENDO', 'SURG'], 'medium');

-- Create indexes for performance
CREATE INDEX idx_terminology_english_term ON medical_terminology_enhanced(english_term);
CREATE INDEX idx_terminology_arabic_term ON medical_terminology_enhanced(arabic_term);
CREATE INDEX idx_terminology_category ON medical_terminology_enhanced(category_id);
CREATE INDEX idx_terminology_term_type ON medical_terminology_enhanced(term_type);
CREATE INDEX idx_terminology_icd10 ON medical_terminology_enhanced(icd10_code) WHERE icd10_code IS NOT NULL;
CREATE INDEX idx_terminology_schi ON medical_terminology_enhanced(schi_code) WHERE schi_code IS NOT NULL;
CREATE INDEX idx_terminology_frequency ON medical_terminology_enhanced(frequency_score DESC);
CREATE INDEX idx_terminology_difficulty ON medical_terminology_enhanced(difficulty_level);
CREATE INDEX idx_terminology_specialty ON medical_terminology_enhanced(clinical_specialty);

-- Full text search indexes
CREATE INDEX idx_terminology_search_en ON medical_terminology_enhanced USING gin(to_tsvector('english', english_term || ' ' || COALESCE(definition_en, '')));
CREATE INDEX idx_terminology_search_ar ON medical_terminology_enhanced USING gin(to_tsvector('arabic', arabic_term || ' ' || COALESCE(definition_ar, '')));

-- Compound indexes for common queries
CREATE INDEX idx_terminology_category_type ON medical_terminology_enhanced(category_id, term_type);
CREATE INDEX idx_terminology_frequency_difficulty ON medical_terminology_enhanced(frequency_score DESC, difficulty_level);

-- Update triggers
CREATE TRIGGER update_terminology_updated_at 
    BEFORE UPDATE ON medical_terminology_enhanced 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON terminology_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to search terminology
CREATE OR REPLACE FUNCTION search_medical_terminology(
    search_term TEXT,
    search_language VARCHAR(2) DEFAULT 'en',
    category_filter VARCHAR(20) DEFAULT NULL,
    limit_results INTEGER DEFAULT 20
) RETURNS TABLE (
    id UUID,
    english_term VARCHAR(255),
    arabic_term VARCHAR(255),
    transliteration VARCHAR(255),
    category_name_en VARCHAR(200),
    category_name_ar VARCHAR(200),
    definition_en TEXT,
    definition_ar TEXT,
    icd10_code VARCHAR(20),
    schi_code VARCHAR(50),
    frequency_score INTEGER,
    relevance_score REAL
) AS $$
BEGIN
    IF search_language = 'ar' THEN
        RETURN QUERY
        SELECT 
            t.id,
            t.english_term,
            t.arabic_term,
            t.transliteration,
            c.name_en,
            c.name_ar,
            t.definition_en,
            t.definition_ar,
            t.icd10_code,
            t.schi_code,
            t.frequency_score,
            ts_rank(to_tsvector('arabic', t.arabic_term || ' ' || COALESCE(t.definition_ar, '')), 
                   plainto_tsquery('arabic', search_term)) AS relevance_score
        FROM medical_terminology_enhanced t
        JOIN terminology_categories c ON t.category_id = c.id
        WHERE 
            (category_filter IS NULL OR c.category_code = category_filter)
            AND (
                t.arabic_term ILIKE '%' || search_term || '%'
                OR to_tsvector('arabic', t.arabic_term || ' ' || COALESCE(t.definition_ar, '')) 
                   @@ plainto_tsquery('arabic', search_term)
            )
        ORDER BY relevance_score DESC, t.frequency_score DESC
        LIMIT limit_results;
    ELSE
        RETURN QUERY
        SELECT 
            t.id,
            t.english_term,
            t.arabic_term,
            t.transliteration,
            c.name_en,
            c.name_ar,
            t.definition_en,
            t.definition_ar,
            t.icd10_code,
            t.schi_code,
            t.frequency_score,
            ts_rank(to_tsvector('english', t.english_term || ' ' || COALESCE(t.definition_en, '')), 
                   plainto_tsquery('english', search_term)) AS relevance_score
        FROM medical_terminology_enhanced t
        JOIN terminology_categories c ON t.category_id = c.id
        WHERE 
            (category_filter IS NULL OR c.category_code = category_filter)
            AND (
                t.english_term ILIKE '%' || search_term || '%'
                OR to_tsvector('english', t.english_term || ' ' || COALESCE(t.definition_en, '')) 
                   @@ plainto_tsquery('english', search_term)
            )
        ORDER BY relevance_score DESC, t.frequency_score DESC
        LIMIT limit_results;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get terminology by category
CREATE OR REPLACE FUNCTION get_terminology_by_category(
    category_code VARCHAR(20),
    difficulty_filter VARCHAR(20) DEFAULT NULL,
    limit_results INTEGER DEFAULT 50
) RETURNS TABLE (
    id UUID,
    english_term VARCHAR(255),
    arabic_term VARCHAR(255),
    transliteration VARCHAR(255),
    term_type VARCHAR(50),
    definition_en TEXT,
    definition_ar TEXT,
    icd10_code VARCHAR(20),
    schi_code VARCHAR(50),
    frequency_score INTEGER,
    difficulty_level VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.english_term,
        t.arabic_term,
        t.transliteration,
        t.term_type,
        t.definition_en,
        t.definition_ar,
        t.icd10_code,
        t.schi_code,
        t.frequency_score,
        t.difficulty_level
    FROM medical_terminology_enhanced t
    JOIN terminology_categories c ON t.category_id = c.id
    WHERE 
        c.category_code = get_terminology_by_category.category_code
        AND (difficulty_filter IS NULL OR t.difficulty_level = difficulty_filter)
    ORDER BY t.frequency_score DESC, t.english_term
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Function to update usage statistics
CREATE OR REPLACE FUNCTION update_terminology_usage(
    term_id UUID,
    usage_type VARCHAR(50), -- search, lookup, correct_usage, incorrect_usage
    user_context VARCHAR(100) DEFAULT 'general',
    user_level VARCHAR(20) DEFAULT 'intermediate'
) RETURNS VOID AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
BEGIN
    -- Insert or update usage stats
    INSERT INTO terminology_usage_stats (term_id, usage_date, search_count, lookup_count, correct_usage_count, incorrect_usage_count)
    VALUES (term_id, today_date, 
           CASE WHEN usage_type = 'search' THEN 1 ELSE 0 END,
           CASE WHEN usage_type = 'lookup' THEN 1 ELSE 0 END,
           CASE WHEN usage_type = 'correct_usage' THEN 1 ELSE 0 END,
           CASE WHEN usage_type = 'incorrect_usage' THEN 1 ELSE 0 END)
    ON CONFLICT (term_id, usage_date)
    DO UPDATE SET
        search_count = terminology_usage_stats.search_count + 
                      CASE WHEN usage_type = 'search' THEN 1 ELSE 0 END,
        lookup_count = terminology_usage_stats.lookup_count + 
                      CASE WHEN usage_type = 'lookup' THEN 1 ELSE 0 END,
        correct_usage_count = terminology_usage_stats.correct_usage_count + 
                             CASE WHEN usage_type = 'correct_usage' THEN 1 ELSE 0 END,
        incorrect_usage_count = terminology_usage_stats.incorrect_usage_count + 
                               CASE WHEN usage_type = 'incorrect_usage' THEN 1 ELSE 0 END;

    -- Update frequency score in main table (simplified scoring)
    UPDATE medical_terminology_enhanced 
    SET frequency_score = frequency_score + 1
    WHERE id = term_id;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE medical_terminology_enhanced IS 'Comprehensive Arabic-English medical terminology database for medical coding education';
COMMENT ON TABLE terminology_categories IS 'Hierarchical categorization of medical terminology';
COMMENT ON TABLE terminology_translations IS 'Alternative translations and variations of medical terms';
COMMENT ON TABLE terminology_synonyms IS 'Relationships between medical terms';
COMMENT ON TABLE terminology_usage_stats IS 'Usage analytics and performance tracking';
COMMENT ON TABLE terminology_validation_rules IS 'Validation rules for terminology quality assurance';

COMMENT ON FUNCTION search_medical_terminology IS 'Full-text search function supporting both Arabic and English with relevance ranking';
COMMENT ON FUNCTION get_terminology_by_category IS 'Retrieve terminology filtered by category and difficulty level';
COMMENT ON FUNCTION update_terminology_usage IS 'Track and update terminology usage statistics for analytics';