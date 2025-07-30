// Force static generation for Cloudflare Pages
export const dynamic = "force-static";

// Generate static params for all assessment IDs
export async function generateStaticParams() {
  return [
    { id: 'mt-001-quiz-01' },
    { id: 'mt-001-quiz-02' },
    { id: 'demo-assessment' }
  ];
}

// Sample assessment data - would normally come from database/CMS
const sampleAssessment = {
  id: "mt-001-quiz-01",
  title: "Medical Terminology Fundamentals Assessment",
  titleAr: "تقييم أساسيات المصطلحات الطبية",
  courseTitle: "Medical Terminology with Arabic SNOMED Integration",
  lessonTitle: "Introduction to Medical Language",
  duration: "20 minutes",
  totalQuestions: 15,
  passingScore: 80,
  attempts: 3,
  currentAttempt: 1,
  instructions: {
    en: "This assessment evaluates your understanding of medical terminology fundamentals. You have 20 minutes to complete 15 questions. A passing score of 80% is required.",
    ar: "يقيم هذا التقييم فهمك لأساسيات المصطلحات الطبية. لديك 20 دقيقة لإكمال 15 سؤالاً. النجاح يتطلب درجة 80%."
  },
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      question: "Which word part typically appears at the beginning of a medical term to modify its meaning?",
      questionAr: "أي جزء من الكلمة يظهر عادة في بداية المصطلح الطبي لتعديل معناه؟",
      options: ["Root word / الجذر", "Prefix / البادئة", "Suffix / اللاحقة", "Combining vowel / حرف العلة الرابط"],
      correct: 1,
      explanation: "A prefix is a word part added to the beginning of a root word to modify its meaning. For example, 'pre-' means before.",
      explanationAr: "البادئة هي جزء من الكلمة يضاف إلى بداية الجذر لتعديل معناه. على سبيل المثال، 'pre-' تعني قبل.",
      points: 2,
      difficulty: "beginner"
    },
    {
      id: 2,
      type: "multiple-choice", 
      question: "What does the Arabic medical term 'التهاب' mean in English?",
      questionAr: "ماذا يعني المصطلح الطبي العربي 'التهاب' بالإنجليزية؟",
      options: ["Infection", "Inflammation", "Incision", "Injection"],
      correct: 1,
      explanation: "'التهاب' (iltihab) means inflammation, which corresponds to the English suffix '-itis'.",
      explanationAr: "'التهاب' يعني inflammation، والذي يقابل اللاحقة الإنجليزية '-itis'.",
      points: 2,
      difficulty: "beginner"
    },
    {
      id: 3,
      type: "word-construction",
      question: "Build a medical term meaning 'inflammation of the heart muscle' using the provided word parts.",
      questionAr: "ابن مصطلحاً طبياً يعني 'التهاب عضلة القلب' باستخدام أجزاء الكلمات المقدمة.",
      wordParts: ["cardio-", "myo-", "gastro-", "-itis", "-osis", "-ectomy"],
      correctAnswer: "myocarditis",
      correctConstruction: ["myo-", "cardio-", "-itis"],
      explanation: "Myocarditis = myo- (muscle) + cardio- (heart) + -itis (inflammation)",
      explanationAr: "Myocarditis = myo- (عضلة) + cardio- (قلب) + -itis (التهاب)",
      points: 3,
      difficulty: "intermediate"
    },
    {
      id: 4,
      type: "matching",
      question: "Match each Greek/Latin root with its correct meaning:",
      questionAr: "طابق كل جذر يوناني/لاتيني مع معناه الصحيح:",
      pairs: [
        { left: "nephro-", leftAr: "nephro-", right: "kidney", rightAr: "كلية" },
        { left: "gastro-", leftAr: "gastro-", right: "stomach", rightAr: "معدة" },
        { left: "hepato-", leftAr: "hepato-", right: "liver", rightAr: "كبد" },
        { left: "pneumo-", leftAr: "pneumo-", right: "lung", rightAr: "رئة" }
      ],
      points: 4,
      difficulty: "intermediate"
    },
    {
      id: 5,
      type: "scenario-based",
      question: "A patient's medical record states: 'Patient underwent cholecystectomy for acute cholecystitis.' Analyze this statement:",
      questionAr: "ينص السجل الطبي للمريض على: 'خضع المريض لاستئصال المرارة بسبب التهاب المرارة الحاد.' حلل هذا البيان:",
      scenario: {
        patientAge: 45,
        symptoms: ["Right upper quadrant pain", "Nausea", "Fever"],
        procedure: "cholecystectomy",
        diagnosis: "acute cholecystitis"
      },
      subQuestions: [
        {
          question: "What does 'cholecystectomy' mean?",
          questionAr: "ماذا تعني 'cholecystectomy'؟",
          options: ["Gallbladder inflammation", "Gallbladder removal", "Gallbladder infection", "Gallbladder examination"],
          correct: 1,
          explanation: "Cholecystectomy = cholecyst (gallbladder) + -ectomy (surgical removal)"
        },
        {
          question: "Break down 'cholecystitis' into its word parts:",
          questionAr: "قسم 'cholecystitis' إلى أجزاء الكلمة:",
          answer: "cholecyst- + -itis",
          explanation: "cholecyst- (gallbladder) + -itis (inflammation) = inflammation of the gallbladder"
        }
      ],
      points: 5,
      difficulty: "advanced"
    }
  ],
  rubric: {
    excellent: { min: 90, max: 100, description: "Exceptional understanding of medical terminology", descriptionAr: "فهم استثنائي للمصطلحات الطبية" },
    good: { min: 80, max: 89, description: "Good grasp of fundamental concepts", descriptionAr: "إدراك جيد للمفاهيم الأساسية" },
    satisfactory: { min: 70, max: 79, description: "Basic understanding with some gaps", descriptionAr: "فهم أساسي مع بعض الثغرات" },
    needsImprovement: { min: 0, max: 69, description: "Requires additional study and practice", descriptionAr: "يتطلب دراسة وممارسة إضافية" }
  }
};

export default function AssessmentPage() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">
              <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>GIVC Medical</a>
            </div>
            <ul className="nav-links">
              <li><a href="/courses" className="nav-link">Courses</a></li>
              <li><a href="/about" className="nav-link">About</a></li>
              <li><a href="/contact" className="nav-link">Contact</a></li>
              <li><a href="/register" className="btn btn-primary">Get Started</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Assessment Content */}  
      <main id="main-content">
        {/* Assessment Header */}
        <section className="section" style={{ backgroundColor: 'var(--gray-50)', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <nav style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 'var(--space-4)' }}>
                <a href="/courses" style={{ color: 'var(--primary)' }}>Courses</a> 
                <span style={{ margin: '0 var(--space-2)' }}>›</span>
                <a href="/course/mt-001" style={{ color: 'var(--primary)' }}>{sampleAssessment.courseTitle}</a>
                <span style={{ margin: '0 var(--space-2)' }}>›</span>
                <span>Assessment</span>
              </nav>
              
              <h1 style={{ marginBottom: 'var(--space-2)' }}>{sampleAssessment.title}</h1>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: 'var(--gray-600)', 
                fontWeight: 'var(--font-weight-medium)',
                direction: 'rtl',
                marginBottom: 'var(--space-6)'
              }}>
                {sampleAssessment.titleAr}
              </h2>
              
              {/* Assessment Info Grid */}
              <div className="grid grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
                      ⏱️
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>
                      {sampleAssessment.duration}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Time Limit
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: 'var(--space-2)' }}>
                      📝
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>
                      {sampleAssessment.totalQuestions}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Questions
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: 'var(--space-2)' }}>
                      🎯
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>
                      {sampleAssessment.passingScore}%
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Passing Score
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
                      🔄
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>
                      {sampleAssessment.currentAttempt}/{sampleAssessment.attempts}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Attempts
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.5rem' }}>📋</span>
                  Assessment Instructions
                </h3>
                
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: 'var(--space-3)' }}>
                    {sampleAssessment.instructions.en}
                  </p>
                  <div style={{ 
                    backgroundColor: 'var(--gray-50)', 
                    padding: 'var(--space-4)', 
                    borderRadius: 'var(--radius)',
                    direction: 'rtl'
                  }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                      {sampleAssessment.instructions.ar}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: 'var(--primary-light)', 
                  padding: 'var(--space-4)', 
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--primary)'
                }}>
                  <h4 style={{ marginBottom: 'var(--space-3)', color: 'var(--primary)' }}>
                    Important Guidelines:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}>
                      Read each question carefully before selecting your answer
                    </li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>
                      You can change your answers before submitting
                    </li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>
                      Use the language toggle to switch between English and Arabic
                    </li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>
                      The timer will start when you click "Begin Assessment"
                    </li>
                    <li>
                      Your progress is automatically saved every 30 seconds
                    </li>
                  </ul>
                </div>
              </div>

              {/* Start Assessment Button */}
              <div style={{ textAlign: 'center' }}>
                <button className="btn btn-primary btn-large" style={{ 
                  fontSize: '1.125rem',
                  padding: 'var(--space-4) var(--space-8)'
                }}>
                  Begin Assessment
                </button>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--gray-600)', 
                  marginTop: 'var(--space-2)' 
                }}>
                  The timer will start immediately after clicking
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Assessment Interface (Hidden initially, shown after starting) */}
        <section className="section" style={{ display: 'none' }} id="assessment-interface">
          <div className="container">
            {/* Assessment Progress */}
            <div style={{ 
              position: 'sticky',
              top: '80px',
              backgroundColor: 'var(--white)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: 'var(--space-6)',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'var(--font-weight-medium)' }}>
                    Question 1 of {sampleAssessment.totalQuestions}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'var(--font-weight-medium)', color: 'var(--primary)' }}>
                      18:45
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    backgroundColor: 'var(--gray-100)',
                    borderRadius: 'var(--radius)',
                    padding: '2px'
                  }}>
                    <button style={{ 
                      padding: 'var(--space-1) var(--space-2)',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--white)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.875rem'
                    }}>
                      EN
                    </button>
                    <button style={{ 
                      padding: 'var(--space-1) var(--space-2)',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--gray-600)',
                      fontSize: '0.875rem'
                    }}>
                      عربي
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: 'var(--gray-200)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: '6.67%', 
                  height: '100%', 
                  backgroundColor: 'var(--primary)',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            {/* Sample Question Display */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-4)'
                }}>
                  <div style={{ 
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--white)',
                    fontWeight: 'var(--font-weight-bold)'
                  }}>
                    1
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--gray-600)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      Multiple Choice • 2 points • Beginner
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
                      Medical Terminology Fundamentals
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  lineHeight: '1.5',
                  marginBottom: 'var(--space-3)'
                }}>
                  {sampleAssessment.questions[0].question}
                </h3>
                <div style={{ 
                  backgroundColor: 'var(--gray-50)', 
                  padding: 'var(--space-4)', 
                  borderRadius: 'var(--radius)',
                  direction: 'rtl'
                }}>
                  <p style={{ fontSize: '1.1rem', color: 'var(--gray-700)' }}>
                    {sampleAssessment.questions[0].questionAr}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                {sampleAssessment.questions[0].options.map((option, index) => (
                  <div key={index} style={{ 
                    border: '2px solid var(--gray-200)',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--space-4)',
                    marginBottom: 'var(--space-3)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease, backgroundColor 0.2s ease',
                    backgroundColor: index === 1 ? 'var(--primary-light)' : 'var(--white)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{ 
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid var(--gray-300)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: index === 1 ? 'var(--primary)' : 'transparent'
                      }}>
                        {index === 1 && (
                          <div style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--white)' 
                          }}></div>
                        )}
                      </div>
                      <div>
                        <div style={{ 
                          fontSize: '1rem', 
                          fontWeight: 'var(--font-weight-medium)',
                          marginBottom: 'var(--space-1)'
                        }}>
                          {String.fromCharCode(65 + index)}. {option.split(' / ')[0]}
                        </div>
                        <div style={{ 
                          fontSize: '0.9rem', 
                          color: 'var(--gray-600)',
                          direction: 'rtl'
                        }}>
                          {option.split(' / ')[1]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Question Navigation */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--gray-200)'
              }}>
                <button className="btn btn-secondary" disabled style={{ opacity: 0.5 }}>
                  ← Previous
                </button>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-secondary">
                    Save & Review Later
                  </button>
                  <button className="btn btn-primary">
                    Next Question →
                  </button>
                </div>
              </div>
            </div>

            {/* Question Navigation Grid */}
            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-4)' }}>
                Question Navigation
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-4)'
              }}>
                {Array.from({ length: sampleAssessment.totalQuestions }, (_, index) => (
                  <div key={index} style={{ 
                    width: '50px',
                    height: '50px',
                    border: '2px solid var(--gray-300)',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 'var(--font-weight-medium)',
                    backgroundColor: index === 0 ? 'var(--primary)' : 
                                   index < 3 ? 'var(--secondary)' : 'var(--white)',
                    color: index === 0 ? 'var(--white)' : 
                           index < 3 ? 'var(--white)' : 'var(--gray-600)',
                    transition: 'all 0.2s ease'
                  }}>
                    {index + 1}
                  </div>
                ))}
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                color: 'var(--gray-600)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    backgroundColor: 'var(--primary)', 
                    borderRadius: '2px' 
                  }}></div>
                  <span>Current</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    backgroundColor: 'var(--secondary)', 
                    borderRadius: '2px' 
                  }}></div>
                  <span>Answered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid var(--gray-300)', 
                    borderRadius: '2px' 
                  }}></div>
                  <span>Not Answered</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Assessment Review Section */}
        <section className="section" style={{ backgroundColor: 'var(--gray-50)', display: 'none' }} id="assessment-review">
          <div className="container">
            <div className="card" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>
                Review Your Assessment
              </h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', marginBottom: 'var(--space-6)' }}>
                Please review your answers before submitting. You can go back to change any answer.
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 'var(--space-8)',
                marginBottom: 'var(--space-8)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--secondary)' }}>
                    12
                  </div>
                  <p style={{ color: 'var(--gray-600)' }}>Answered</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)' }}>
                    3
                  </div>
                  <p style={{ color: 'var(--gray-600)' }}>Remaining</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)' }}>
                    05:23
                  </div>
                  <p style={{ color: 'var(--gray-600)' }}>Time Left</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
                <button className="btn btn-secondary btn-large">
                  Continue Reviewing
                </button>
                <button className="btn btn-primary btn-large">
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="section" style={{ display: 'none' }} id="assessment-results">
          <div className="container">
            <div className="card" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: 'var(--secondary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                fontSize: '2rem'
              }}>
                🎉
              </div>
              
              <h2 style={{ marginBottom: 'var(--space-4)', color: 'var(--secondary)' }}>
                Assessment Completed!
              </h2>
              
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--secondary)',
                marginBottom: 'var(--space-2)'
              }}>
                85%
              </div>
              <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', marginBottom: 'var(--space-6)' }}>
                Good - You have passed this assessment
              </p>

              {/* Score Breakdown */}
              <div className="grid grid-4" style={{ marginBottom: 'var(--space-8)' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)' }}>
                    13/15
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Correct Answers</p>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--secondary)' }}>
                    18:34
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Time Taken</p>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)' }}>
                    1/3
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Attempts Used</p>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)' }}>
                    85%
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Final Score</p>
                </div>
              </div>

              {/* Performance by Category */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Performance by Topic</h3>
                <div className="grid grid-3">
                  <div className="card" style={{ backgroundColor: 'var(--secondary-light)' }}>
                    <h4 style={{ marginBottom: 'var(--space-2)' }}>Word Parts</h4>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--secondary)' }}>
                      5/6
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>83% Correct</p>
                  </div>
                  <div className="card" style={{ backgroundColor: 'var(--primary-light)' }}>
                    <h4 style={{ marginBottom: 'var(--space-2)' }}>Word Construction</h4>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary)' }}>
                      4/4
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>100% Correct</p>
                  </div>
                  <div className="card" style={{ backgroundColor: 'var(--accent-light)' }}>
                    <h4 style={{ marginBottom: 'var(--space-2)' }}>Applied Scenarios</h4>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)' }}>
                      4/5
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>80% Correct</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
                <a href="/assessment/mt-001-quiz-01/review" className="btn btn-secondary btn-large">
                  Review Answers
                </a>
                <a href="/lesson/mt-001-02" className="btn btn-primary btn-large">
                  Continue to Next Lesson
                </a>
              </div>
            </div>

            {/* Feedback and Recommendations */}
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-4)' }}>
                Personalized Feedback & Recommendations
              </h3>
              
              <div style={{ 
                backgroundColor: 'var(--secondary-light)', 
                padding: 'var(--space-4)', 
                borderRadius: 'var(--radius)',
                marginBottom: 'var(--space-4)'
              }}>
                <h4 style={{ color: 'var(--secondary)', marginBottom: 'var(--space-2)' }}>
                  Strengths
                </h4>
                <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                  <li>Excellent understanding of word construction principles</li>
                  <li>Strong performance in basic terminology identification</li>
                  <li>Good application of Arabic-English medical term correlation</li>
                </ul>
              </div>

              <div style={{ 
                backgroundColor: 'var(--accent-light)', 
                padding: 'var(--space-4)', 
                borderRadius: 'var(--radius)',
                marginBottom: 'var(--space-6)'
              }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: 'var(--space-2)' }}>
                  Areas for Improvement
                </h4>
                <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                  <li>Review complex scenario-based terminology applications</li>
                  <li>Practice more with prefix and suffix combinations</li>
                </ul>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                  <strong>Recommended Study Time:</strong> 2-3 hours additional practice
                </p>
              </div>

              <h4 style={{ marginBottom: 'var(--space-3)' }}>Recommended Resources:</h4>
              <div className="grid grid-3">
                <a href="/resources/word-parts-practice" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h5>Word Parts Practice</h5>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    Interactive exercises for prefixes and suffixes
                  </p>
                </a>
                <a href="/resources/scenario-builder" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h5>Clinical Scenario Builder</h5>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    Practice with real medical cases
                  </p>
                </a>
                <a href="/resources/arabic-terminology" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h5>Arabic Medical Terms</h5>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    Comprehensive Arabic-English dictionary
                  </p>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="grid grid-2" style={{ marginBottom: 'var(--space-8)' }}>
            <div>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
                GIVC Medical Coding
              </h3>
              <p>Professional medical coding education for healthcare professionals worldwide.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
                Assessment Support
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <a href="/help/assessments" style={{ color: 'var(--gray-300)' }}>Assessment Help</a>
                <a href="/resources/study-guides" style={{ color: 'var(--gray-300)' }}>Study Guides</a>
                <a href="/support/technical" style={{ color: 'var(--gray-300)' }}>Technical Support</a>
                <a href="/policies/assessment" style={{ color: 'var(--gray-300)' }}>Assessment Policies</a>
              </div>
            </div>
          </div>
          <div style={{ 
            textAlign: 'center', 
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--gray-700)'
          }}>
            <p>&copy; 2024 GIVC Medical Coding. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}