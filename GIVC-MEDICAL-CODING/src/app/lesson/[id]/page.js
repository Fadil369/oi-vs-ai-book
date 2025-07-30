// Force static generation for Cloudflare Pages
export const dynamic = "force-static";

// Generate static params for all lesson IDs
export async function generateStaticParams() {
  // Return empty array for now - in production this would come from your content management system
  return [
    { id: 'mt-001-01' },
    { id: 'mt-001-02' },
    { id: 'demo-lesson' }
  ];
}

// This would normally come from a database/CMS
const sampleLesson = {
  id: "mt-001-01",
  courseTitle: "Medical Terminology with Arabic SNOMED Integration",
  courseTitleAr: "المصطلحات الطبية مع تكامل SNOMED العربي",
  moduleTitle: "Foundation of Medical Language",
  moduleTitleAr: "أساسيات اللغة الطبية",
  lessonTitle: "Introduction to Medical Language",
  lessonTitleAr: "مقدمة في اللغة الطبية",
  duration: "60 minutes",
  instructor: "Dr. Sarah Al-Mansouri",
  objectives: [
    "Identify the four fundamental word parts in medical terminology",
    "Recognize common Greek and Latin roots in medical terms",
    "Apply basic word-building rules to construct medical terms"
  ],
  objectivesAr: [
    "تحديد الأجزاء الأساسية الأربعة في المصطلحات الطبية",
    "التعرف على الجذور اليونانية واللاتينية الشائعة في المصطلحات الطبية",
    "تطبيق قواعد بناء الكلمات الأساسية لتكوين المصطلحات الطبية"
  ],
  hookScenario: {
    en: "A patient arrives at King Fahd Medical City emergency department with 'ألم في الصدر' (chest pain). The triage nurse must document this accurately in both Arabic and English for the international medical team. How do we ensure accurate communication across languages?",
    ar: "يصل مريض إلى قسم الطوارئ في مدينة الملك فهد الطبية مع 'ألم في الصدر'. يجب على ممرضة الفرز توثيق هذا بدقة باللغتين العربية والإنجليزية للفريق الطبي الدولي. كيف نضمن التواصل الدقيق عبر اللغات؟"
  },
  contentSegments: [
    {
      title: "History of Medical Language",
      titleAr: "تاريخ اللغة الطبية",
      duration: 60,
      type: "video",
      content: {
        videoUrl: "/videos/medical-language-history.mp4",
        slides: "/slides/segment1-history.pdf",
        keyPoints: [
          "Greek and Latin origins in medical terminology",
          "Arabic contributions to medical vocabulary", 
          "Evolution of medical language in the GCC region"
        ],
        keyPointsAr: [
          "الأصول اليونانية واللاتينية في المصطلحات الطبية",
          "المساهمات العربية في المفردات الطبية",
          "تطور اللغة الطبية في منطقة دول مجلس التعاون الخليجي"
        ]
      }
    },
    {
      title: "Word Building Fundamentals",
      titleAr: "أساسيات بناء الكلمات",
      duration: 120,
      type: "interactive",
      content: {
        concepts: [
          {
            term: "Root Words",
            termAr: "الجذور",
            definition: "The foundation of medical terms, usually derived from Greek or Latin",
            definitionAr: "أساس المصطلحات الطبية، مستمدة عادة من اليونانية أو اللاتينية",
            examples: ["cardio- (heart/قلب)", "gastro- (stomach/معدة)", "nephro- (kidney/كلية)"]
          },
          {
            term: "Prefixes",
            termAr: "البادئات",
            definition: "Word parts added to the beginning of root words to modify meaning",
            definitionAr: "أجزاء كلمات تضاف إلى بداية الجذور لتعديل المعنى",
            examples: ["pre- (before/قبل)", "post- (after/بعد)", "hyper- (excessive/مفرط)"]
          },
          {
            term: "Suffixes", 
            termAr: "اللاحقات",
            definition: "Word parts added to the end of root words to complete the term",
            definitionAr: "أجزاء كلمات تضاف إلى نهاية الجذور لإكمال المصطلح",
            examples: ["-itis (inflammation/التهاب)", "-osis (condition/حالة)", "-ectomy (removal/استئصال)"]
          }
        ]
      }
    }
  ],
  activities: [
    {
      type: "poll",
      question: "Which word part typically indicates a surgical removal procedure?",
      questionAr: "أي جزء من الكلمة يشير عادة إلى إجراء الإزالة الجراحية؟",
      options: ["-itis", "-ectomy", "-osis", "-otomy"],
      correct: 1,
      explanation: "-ectomy means surgical removal, from Greek 'ektome' meaning excision",
      explanationAr: "-ectomy تعني الإزالة الجراحية، من اليونانية 'ektome' التي تعني الاستئصال"
    },
    {
      type: "matching",
      instruction: "Match the medical terms with their meanings:",
      instructionAr: "طابق المصطلحات الطبية مع معانيها:",
      pairs: [
        { term: "Cardiology", termAr: "طب القلب", meaning: "Study of the heart", meaningAr: "دراسة القلب" },
        { term: "Gastritis", termAr: "التهاب المعدة", meaning: "Inflammation of stomach", meaningAr: "التهاب المعدة" },
        { term: "Nephrology", termAr: "طب الكلى", meaning: "Study of kidneys", meaningAr: "دراسة الكلى" }
      ]
    }
  ],
  practicalExercise: {
    title: "Word Building Challenge",
    titleAr: "تحدي بناء الكلمات",
    instruction: "Using the word parts provided, construct medical terms for the following scenarios:",
    instructionAr: "باستخدام أجزاء الكلمات المقدمة، قم ببناء مصطلحات طبية للسيناريوهات التالية:",
    scenarios: [
      {
        scenario: "Inflammation of the heart muscle",
        scenarioAr: "التهاب عضلة القلب",
        wordParts: ["cardio-", "myo-", "-itis", "-osis"],
        correctAnswer: "myocarditis",
        rationale: "myo- (muscle) + cardio- (heart) + -itis (inflammation)"
      },
      {
        scenario: "Surgical removal of the stomach",
        scenarioAr: "الاستئصال الجراحي للمعدة", 
        wordParts: ["gastro-", "entero-", "-ectomy", "-otomy"],
        correctAnswer: "gastrectomy",
        rationale: "gastro- (stomach) + -ectomy (surgical removal)"
      }
    ]
  },
  assessment: {
    questions: [
      {
        type: "multiple-choice",
        question: "The prefix 'hyper-' means:",
        questionAr: "البادئة 'hyper-' تعني:",
        options: ["Under/تحت", "Above/فوق", "Excessive/مفرط", "Normal/طبيعي"],
        correct: 2,
        explanation: "Hyper- is a Greek prefix meaning 'over' or 'excessive'",
        explanationAr: "Hyper- بادئة يونانية تعني 'فوق' أو 'مفرط'"
      },
      {
        type: "construction",
        question: "Build a term meaning 'inflammation of the kidney':",
        questionAr: "ابن مصطلحاً يعني 'التهاب الكلية':",
        components: ["nephro-", "reno-", "-itis", "-osis"],
        correctAnswer: "nephritis",
        rationale: "nephro- (kidney) + -itis (inflammation) = nephritis"
      }
    ]
  },
  resources: [
    { title: "Medical Etymology Dictionary", titleAr: "قاموس أصول الكلمات الطبية", url: "/resources/etymology-dictionary.pdf" },
    { title: "SNOMED CT Arabic Browser", titleAr: "متصفح SNOMED CT العربي", url: "https://browser.ihtsdotools.org/" },
    { title: "Word Building Practice App", titleAr: "تطبيق ممارسة بناء الكلمات", url: "/apps/word-builder" }
  ]
};

export default function LessonPage() {
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

      {/* Lesson Content */}
      <main id="main-content">
        {/* Lesson Header */}
        <section className="section" style={{ backgroundColor: 'var(--gray-50)', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <nav style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 'var(--space-4)' }}>
                <a href="/courses" style={{ color: 'var(--primary)' }}>Courses</a> 
                <span style={{ margin: '0 var(--space-2)' }}>›</span>
                <a href="/course/mt-001" style={{ color: 'var(--primary)' }}>{sampleLesson.courseTitle}</a>
                <span style={{ margin: '0 var(--space-2)' }}>›</span>
                <span>{sampleLesson.lessonTitle}</span>
              </nav>
              
              <h1 style={{ marginBottom: 'var(--space-2)' }}>{sampleLesson.lessonTitle}</h1>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: 'var(--gray-600)', 
                fontWeight: 'var(--font-weight-medium)',
                direction: 'rtl',
                marginBottom: 'var(--space-4)'
              }}>
                {sampleLesson.lessonTitleAr}
              </h2>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', color: 'var(--gray-600)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                  <span>{sampleLesson.duration}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.2rem' }}>👨‍🏫</span>
                  <span>{sampleLesson.instructor}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.2rem' }}>📚</span>
                  <span>{sampleLesson.moduleTitle}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: 'var(--gray-200)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ 
                width: '25%', 
                height: '100%', 
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>

            {/* Language Toggle */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
              <div style={{ 
                display: 'flex', 
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius)',
                padding: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <button style={{ 
                  padding: 'var(--space-2) var(--space-3)',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--white)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  English
                </button>
                <button style={{ 
                  padding: 'var(--space-2) var(--space-3)',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--gray-600)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  العربية
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Objectives */}
        <section className="section">
          <div className="container">
            <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '1.5rem' }}>🎯</span>
                Learning Objectives
              </h3>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <p style={{ marginBottom: 'var(--space-3)', fontWeight: 'var(--font-weight-medium)' }}>
                  By the end of this lesson, you will be able to:
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {sampleLesson.objectives.map((objective, index) => (
                    <li key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-2)',
                      gap: 'var(--space-2)'
                    }}>
                      <span style={{ 
                        color: 'var(--primary)', 
                        fontWeight: 'var(--font-weight-bold)',
                        minWidth: '20px'
                      }}>
                        {index + 1}.
                      </span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ 
                backgroundColor: 'var(--gray-50)', 
                padding: 'var(--space-4)', 
                borderRadius: 'var(--radius)',
                direction: 'rtl'
              }}>
                <p style={{ marginBottom: 'var(--space-3)', fontWeight: 'var(--font-weight-medium)' }}>
                  بنهاية هذا الدرس، ستكون قادراً على:
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {sampleLesson.objectivesAr.map((objective, index) => (
                    <li key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-2)',
                      gap: 'var(--space-2)'
                    }}>
                      <span style={{ 
                        color: 'var(--primary)', 
                        fontWeight: 'var(--font-weight-bold)',
                        minWidth: '20px'
                      }}>
                        {index + 1}.
                      </span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Hook Scenario */}
        <section className="section" style={{ backgroundColor: 'var(--accent)', color: 'var(--white)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '1.5rem' }}>🏥</span>
                Clinical Scenario
              </h3>
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                padding: 'var(--space-6)', 
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-4)'
              }}>
                <p style={{ 
                  fontSize: '1.125rem', 
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.95)'
                }}>
                  {sampleLesson.hookScenario.en}
                </p>
              </div>
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                padding: 'var(--space-6)', 
                borderRadius: 'var(--radius-lg)',
                direction: 'rtl'
              }}>
                <p style={{ 
                  fontSize: '1.125rem', 
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.95)'
                }}>
                  {sampleLesson.hookScenario.ar}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Segments */}
        <section className="section">
          <div className="container">
            <h3 style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
              Lesson Content
            </h3>
            
            {sampleLesson.contentSegments.map((segment, index) => (
              <div key={index} className="card" style={{ marginBottom: 'var(--space-8)' }}>
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <div style={{ 
                      width: '40px',
                      height: '40px',
                      backgroundColor: segment.type === 'video' ? 'var(--primary)' : 'var(--secondary)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--white)',
                      fontSize: '1.2rem'
                    }}>
                      {segment.type === 'video' ? '🎥' : '⚡'}
                    </div>
                    <div>
                      <h4 style={{ marginBottom: 'var(--space-1)' }}>{segment.title}</h4>
                      <p style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--gray-600)',
                        direction: 'rtl'
                      }}>
                        {segment.titleAr}
                      </p>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        {segment.duration} minutes • {segment.type === 'video' ? 'Video Lecture' : 'Interactive Content'}
                      </div>
                    </div>
                  </div>
                </div>

                {segment.type === 'video' && (
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <div style={{ 
                      width: '100%', 
                      height: '400px', 
                      backgroundColor: 'var(--gray-900)',
                      borderRadius: 'var(--radius)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--white)',
                      marginBottom: 'var(--space-4)'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-2)' }}>▶️</div>
                        <p>Video: {segment.title}</p>
                        <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Click to play</p>
                      </div>
                    </div>
                    
                    {/* Video Controls */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: 'var(--space-3)',
                      backgroundColor: 'var(--gray-50)',
                      borderRadius: 'var(--radius)'
                    }}>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-primary" style={{ fontSize: '0.875rem' }}>▶️ Play</button>
                        <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>📄 Transcript</button>
                        <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>📊 Slides</button>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        Speed: 1x | Quality: HD
                      </div>
                    </div>
                  </div>
                )}

                {segment.type === 'interactive' && (
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    {segment.content.concepts && segment.content.concepts.map((concept, conceptIndex) => (
                      <div key={conceptIndex} style={{ 
                        border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--radius)',
                        padding: 'var(--space-4)',
                        marginBottom: 'var(--space-4)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                          <div>
                            <h5 style={{ marginBottom: 'var(--space-1)', color: 'var(--primary)' }}>
                              {concept.term}
                            </h5>
                            <p style={{ 
                              fontSize: '0.9rem', 
                              color: 'var(--gray-600)',
                              direction: 'rtl'
                            }}>
                              {concept.termAr}
                            </p>
                          </div>
                        </div>
                        
                        <p style={{ marginBottom: 'var(--space-3)' }}>{concept.definition}</p>
                        <p style={{ 
                          fontSize: '0.9rem', 
                          color: 'var(--gray-600)',
                          marginBottom: 'var(--space-3)',
                          direction: 'rtl'
                        }}>
                          {concept.definitionAr}
                        </p>
                        
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>Examples:</strong>
                          <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 'var(--space-2)',
                            marginTop: 'var(--space-2)'
                          }}>
                            {concept.examples.map((example, exampleIndex) => (
                              <span key={exampleIndex} style={{ 
                                padding: 'var(--space-1) var(--space-2)',
                                backgroundColor: 'var(--primary)',
                                color: 'var(--white)',
                                borderRadius: 'var(--radius)',
                                fontSize: '0.875rem'
                              }}>
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Points */}
                {segment.content.keyPoints && (
                  <div>
                    <h5 style={{ marginBottom: 'var(--space-3)' }}>Key Learning Points:</h5>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: 'var(--space-4)' }}>
                      {segment.content.keyPoints.map((point, pointIndex) => (
                        <li key={pointIndex} style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start',
                          marginBottom: 'var(--space-2)',
                          gap: 'var(--space-2)'
                        }}>
                          <span style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}>✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div style={{ 
                      backgroundColor: 'var(--gray-50)', 
                      padding: 'var(--space-4)', 
                      borderRadius: 'var(--radius)',
                      direction: 'rtl'
                    }}>
                      <h6 style={{ marginBottom: 'var(--space-3)' }}>النقاط التعليمية الرئيسية:</h6>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {segment.content.keyPointsAr && segment.content.keyPointsAr.map((point, pointIndex) => (
                          <li key={pointIndex} style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            marginBottom: 'var(--space-2)',
                            gap: 'var(--space-2)'
                          }}>
                            <span style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}>✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Activities */}
        <section className="section" style={{ backgroundColor: 'var(--gray-50)' }}>
          <div className="container">
            <h3 style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
              Interactive Activities
            </h3>
            
            {sampleLesson.activities.map((activity, index) => (
              <div key={index} className="card" style={{ marginBottom: 'var(--space-6)' }}>
                {activity.type === 'poll' && (
                  <div>
                    <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: '1.5rem' }}>📊</span>
                      Quick Poll
                    </h4>
                    
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>
                        {activity.question}
                      </p>
                      <p style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--gray-600)',
                        direction: 'rtl'
                      }}>
                        {activity.questionAr}
                      </p>
                    </div>
                    
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      {activity.options.map((option, optionIndex) => (
                        <div key={optionIndex} style={{ 
                          padding: 'var(--space-3)',
                          border: '2px solid var(--gray-200)',
                          borderRadius: 'var(--radius)',
                          marginBottom: 'var(--space-2)',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s ease',
                          backgroundColor: optionIndex === activity.correct ? 'var(--secondary-light)' : 'var(--white)'
                        }}>
                          <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </span>
                          {optionIndex === activity.correct && (
                            <span style={{ color: 'var(--secondary)', marginLeft: 'var(--space-2)' }}>✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ 
                      backgroundColor: 'var(--primary-light)', 
                      padding: 'var(--space-4)', 
                      borderRadius: 'var(--radius)'
                    }}>
                      <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>
                        Explanation:
                      </p>
                      <p style={{ marginBottom: 'var(--space-2)' }}>{activity.explanation}</p>
                      <p style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--gray-600)',
                        direction: 'rtl'
                      }}>
                        {activity.explanationAr}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Practical Exercise */}
        <section className="section">
          <div className="container">
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '1.5rem' }}>🛠️</span>
                {sampleLesson.practicalExercise.title}
              </h3>
              <p style={{ 
                fontSize: '0.9rem', 
                color: 'var(--gray-600)',
                marginBottom: 'var(--space-4)',
                direction: 'rtl'
              }}>
                {sampleLesson.practicalExercise.titleAr}
              </p>
              
              <p style={{ marginBottom: 'var(--space-6)' }}>
                {sampleLesson.practicalExercise.instruction}
              </p>
              
              {sampleLesson.practicalExercise.scenarios.map((scenario, index) => (
                <div key={index} style={{ 
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--space-4)',
                  marginBottom: 'var(--space-4)'
                }}>
                  <h5 style={{ marginBottom: 'var(--space-2)' }}>
                    Scenario {index + 1}: {scenario.scenario}
                  </h5>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--gray-600)',
                    marginBottom: 'var(--space-3)',
                    direction: 'rtl'
                  }}>
                    {scenario.scenarioAr}
                  </p>
                  
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <strong style={{ fontSize: '0.875rem' }}>Available word parts:</strong>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 'var(--space-2)',
                      marginTop: 'var(--space-2)'
                    }}>
                      {scenario.wordParts.map((part, partIndex) => (
                        <span key={partIndex} style={{ 
                          padding: 'var(--space-1) var(--space-2)',
                          backgroundColor: 'var(--gray-200)',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}>
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: 'var(--secondary-light)', 
                    padding: 'var(--space-3)', 
                    borderRadius: 'var(--radius)'
                  }}>
                    <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-1)' }}>
                      Answer: {scenario.correctAnswer}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      {scenario.rationale}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lesson Summary */}
        <section className="section" style={{ backgroundColor: 'var(--primary)', color: 'var(--white)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--space-6)' }}>
                Lesson Summary
              </h3>
              
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                padding: 'var(--space-6)', 
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-6)'
              }}>
                <h4 style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
                  Key Takeaways:
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                  <li style={{ marginBottom: 'var(--space-2)' }}>
                    ✓ Medical terms are built from Greek and Latin word parts
                  </li>
                  <li style={{ marginBottom: 'var(--space-2)' }}>
                    ✓ Understanding root words, prefixes, and suffixes enables term construction
                  </li>
                  <li style={{ marginBottom: 'var(--space-2)' }}>
                    ✓ Arabic medical terminology integrates with international standards
                  </li>
                </ul>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
                <a href="/lesson/mt-001-02" className="btn btn-secondary btn-large">
                  Next Lesson
                </a>
                <a href="/course/mt-001" className="btn" style={{ 
                  backgroundColor: 'transparent', 
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'var(--white)'
                }}>
                  Back to Course
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="section">
          <div className="container">
            <h3 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
              Additional Resources
            </h3>
            
            <div className="grid grid-3">
              {sampleLesson.resources.map((resource, index) => (
                <div key={index} className="card">
                  <h4 style={{ marginBottom: 'var(--space-2)' }}>{resource.title}</h4>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--gray-600)',
                    marginBottom: 'var(--space-4)',
                    direction: 'rtl'
                  }}>
                    {resource.titleAr}
                  </p>
                  <a href={resource.url} className="btn btn-primary" style={{ width: '100%' }}>
                    Access Resource
                  </a>
                </div>
              ))}
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
                Learning Support
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <a href="/help" style={{ color: 'var(--gray-300)' }}>Help Center</a>
                <a href="/resources" style={{ color: 'var(--gray-300)' }}>Study Resources</a>
                <a href="/community" style={{ color: 'var(--gray-300)' }}>Student Community</a>
                <a href="/support" style={{ color: 'var(--gray-300)' }}>Technical Support</a>
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