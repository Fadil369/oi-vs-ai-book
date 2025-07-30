// Force static generation for Cloudflare Pages
export const dynamic = "force-static";

export default function CoursesPage() {
  const courseModules = [
    {
      category: "Foundation Modules",
      courses: [
        {
          title: "Medical Terminology with Arabic SNOMED Integration",
          titleAr: "المصطلحات الطبية مع تكامل SNOMED العربي",
          description: "Master medical terminology with Saudi Arabia's SNOMED CT Arabic integration.",
          descriptionAr: "إتقان المصطلحات الطبية مع تكامل SNOMED CT العربي في المملكة العربية السعودية.",
          duration: "45 hours",
          level: "Beginner",
          features: [
            "SNOMED International Arabic standards",
            "NHIC (National Health Information Center) terminology",
            "25 regional Arabic dialect considerations",
            "Code-switching methodology (44.8% usage)",
            "WHO EMRO Global Arabic Programme",
            "Saudi medical terminology standardization"
          ]
        },
        {
          title: "Anatomy & Physiology",
          titleAr: "علم التشريح ووظائف الأعضاء",
          description: "Comprehensive understanding of human body systems essential for accurate coding.",
          descriptionAr: "فهم شامل لأجهزة الجسم البشري الضرورية للترميز الدقيق.",
          duration: "60 hours",
          level: "Beginner",
          features: [
            "All major body systems",
            "Anatomical positions and directions",
            "Organ functions and relationships",
            "Disease pathophysiology",
            "Virtual anatomy labs",
            "Interactive 3D models"
          ]
        },
        {
          title: "Saudi Healthcare Reimbursement & Vision 2030",
          titleAr: "تعويضات الرعاية الصحية السعودية ورؤية 2030",
          description: "Understanding Saudi healthcare payment systems and Vision 2030 transformation.",
          descriptionAr: "فهم أنظمة الدفع للرعاية الصحية السعودية وتحول رؤية 2030.",
          duration: "35 hours",
          level: "Beginner",
          features: [
            "CHI (Council of Health Insurance) regulations",
            "Saudi Billing System (SBS) workflows",
            "Vision 2030 digital health transformation",
            "CCHI unified insurance system",
            "Arabic documentation standards",
            "SCFHS professional requirements"
          ]
        }
      ]
    },
    {
      category: "Core Coding Systems",
      courses: [
        {
          title: "ICD-10-AM (Australian Modification) for Saudi Market",
          titleAr: "التصنيف الدولي للأمراض - التعديل الأسترالي للسوق السعودي",
          description: "Master ICD-10-AM system officially adopted by Saudi Arabia's healthcare system.",
          descriptionAr: "إتقان نظام ICD-10-AM المعتمد رسمياً في نظام الرعاية الصحية السعودي.",
          duration: "85 hours",
          level: "Intermediate",
          features: [
            "ICD-10-AM diagnosis coding (Saudi adaptation)",
            "Australian Coding Standards (ACS) 10th Edition",
            "Saudi Billing System (SBS) integration",
            "CHI-approved coding guidelines",
            "Arabic medical terminology mapping",
            "SCFHS certification alignment"
          ]
        },
        {
          title: "SCHI (Saudi Classification of Health Interventions)",
          titleAr: "التصنيف السعودي للتدخلات الصحية SCHI",
          description: "Master Saudi Arabia's official procedural coding system replacing CPT codes.",
          descriptionAr: "إتقان نظام الترميز الإجرائي الرسمي في المملكة العربية السعودية بديلاً عن CPT.",
          duration: "70 hours",
          level: "Intermediate",
          features: [
            "SCHI Category classification system",
            "Saudi Billing System integration",
            "CHI-approved coding guidelines",
            "Vision 2030 digital health alignment",
            "Arabic medical terminology standards",
            "SCFHS certification preparation"
          ]
        },
        {
          title: "SBSCS (Saudi Billing System Coding Standards)",
          titleAr: "معايير الترميز لنظام الفوترة السعودي SBSCS",
          description: "Master Saudi Arabia's unique billing system coding standards and CHI requirements.",
          descriptionAr: "إتقان معايير الترميز الفريدة لنظام الفوترة السعودي ومتطلبات مجلس الضمان الصحي.",
          duration: "50 hours",
          level: "Intermediate",
          features: [
            "62 SBSCS coding standards (latest update)",
            "CHI billing system compliance",
            "Saudi healthcare reimbursement models",
            "Vision 2030 digital health integration",
            "Arabic documentation requirements",
            "CCP-KSA certification preparation"
          ]
        },
        {
          title: "ICD-11 Preparation (Beta)",
          titleAr: "التحضير لـ ICD-11 (تجريبي)",
          description: "Next-generation coding system with 55,000+ unique codes and post-coordination.",
          descriptionAr: "نظام الترميز من الجيل التالي مع أكثر من 55,000 رمز فريد والتنسيق اللاحق.",
          duration: "60 hours",
          level: "Advanced",
          features: [
            "Post-coordination techniques",
            "Stem and extension codes",
            "ICD-11 Browser and Coding Tool",
            "5,500+ rare diseases coverage",
            "Sleep-wake disorders chapter",
            "Migration from ICD-10 strategies"
          ]
        }
      ]
    },
    {
      category: "Specialty Tracks",
      courses: [
        {
          title: "Behavioral Health Coding",
          titleAr: "ترميز الصحة النفسية",
          description: "Specialized coding for mental health and substance abuse services.",
          descriptionAr: "ترميز متخصص لخدمات الصحة النفسية وعلاج إدمان المواد.",
          duration: "45 hours",
          level: "Advanced",
          features: [
            "DSM-5-TR integration",
            "Telehealth coding guidelines",
            "Crisis intervention services",
            "Substance abuse treatment",
            "Group therapy coding",
            "Compliance and documentation"
          ]
        },
        {
          title: "Risk Adjustment Coding",
          titleAr: "ترميز تعديل المخاطر",
          description: "HCC and RAF score optimization for value-based care contracts.",
          descriptionAr: "تحسين نقاط HCC و RAF لعقود الرعاية القائمة على القيمة.",
          duration: "50 hours",
          level: "Advanced",
          features: [
            "Hierarchical Condition Categories",
            "Risk Adjustment Factor scoring",
            "CMS-HCC model updates",
            "Documentation improvement",
            "Audit preparation",
            "Quality measure reporting"
          ]
        },
        {
          title: "Oncology Coding",
          titleAr: "ترميز الأورام",
          description: "Complex cancer diagnosis and treatment coding with high accuracy requirements.",
          descriptionAr: "ترميز معقد لتشخيص وعلاج السرطان مع متطلبات دقة عالية.",
          duration: "55 hours",
          level: "Advanced",
          features: [
            "Cancer staging and grading",
            "Chemotherapy and radiation coding",
            "Surgical oncology procedures",
            "Tumor registry requirements",
            "Clinical trials documentation",
            "Precision medicine coding"
          ]
        },
        {
          title: "Cardiology Coding",
          titleAr: "ترميز أمراض القلب",
          description: "Cardiovascular procedures and diagnostics with elevated audit risk awareness.",
          descriptionAr: "إجراءات وتشخيصات القلب والأوعية الدموية مع الوعي بمخاطر التدقيق المرتفعة.",
          duration: "50 hours",
          level: "Advanced",
          features: [
            "Cardiac catheterization coding",
            "Electrophysiology procedures",
            "Heart failure management",
            "Valve replacement coding",
            "Pacemaker and ICD procedures",
            "Audit risk mitigation"
          ]
        },
        {
          title: "CCP-KSA Saudi Certification Pathway",
          titleAr: "مسار شهادة CCP-KSA السعودية",
          description: "Complete preparation for Saudi Arabia's official medical coding certification.",
          descriptionAr: "إعداد شامل للحصول على شهادة الترميز الطبي الرسمية في المملكة العربية السعودية.",
          duration: "120 hours",
          level: "Professional",
          features: [
            "AAPC CCP-KSA certification preparation",
            "CHI (Council of Health Insurance) endorsement",
            "SCFHS licensing requirements (30 CME hours)",
            "DataFlow certificate verification process",
            "Saudi healthcare system orientation",
            "Arabic medical coding proficiency"
          ]
        }
      ]
    },
    {
      category: "Compliance & Quality",
      courses: [
        {
          title: "Saudi Healthcare Data Security & Compliance",
          titleAr: "أمان البيانات الصحية والامتثال السعودي",
          description: "Saudi data residency, HIPAA compliance, and cybersecurity for healthcare.",
          descriptionAr: "إقامة البيانات السعودية والامتثال لـ HIPAA والأمن السيبراني للرعاية الصحية.",
          duration: "30 hours",
          level: "All Levels",
          features: [
            "Saudi data residency requirements",
            "HIPAA Security Rule for international standards",
            "Vision 2030 cybersecurity framework",
            "Arabic PHI protection protocols",
            "SCFHS data handling guidelines",
            "Cross-border data transfer compliance"
          ]
        },
        {
          title: "Medical Coding Auditing",
          titleAr: "تدقيق الترميز الطبي",
          description: "Professional auditing techniques and compliance monitoring.",
          descriptionAr: "تقنيات التدقيق المهنية ومراقبة الامتثال.",
          duration: "40 hours",
          level: "Advanced",
          features: [
            "Audit methodologies",
            "Statistical sampling techniques",
            "Compliance monitoring",
            "Corrective action planning",
            "OIG compliance programs",
            "Documentation improvement"
          ]
        },
        {
          title: "No Surprises Act Implementation",
          titleAr: "تطبيق قانون عدم المفاجآت",
          description: "Surprise billing prevention and price transparency requirements.",
          descriptionAr: "منع الفواتير المفاجئة ومتطلبات شفافية الأسعار.",
          duration: "20 hours",
          level: "Intermediate",
          features: [
            "Good faith estimates",
            "Independent dispute resolution",
            "Provider network requirements",
            "Emergency services billing",
            "Air ambulance protections",
            "Patient dispute processes"
          ]
        }
      ]
    }
  ];

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
              <li><a href="/courses" className="nav-link" style={{ color: 'var(--primary)' }}>Courses</a></li>
              <li><a href="/instructor-portal" className="nav-link">Instructors</a></li>
              <li><a href="/about" className="nav-link">About</a></li>
              <li><a href="/contact" className="nav-link">Contact</a></li>
              <li><a href="/register" className="btn btn-primary">Get Started</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1>Comprehensive Medical Coding Curriculum</h1>
            <p>
              Master medical coding with our complete bilingual training programs - 
              from foundation concepts to advanced specialty certification.
            </p>
          </div>
        </section>

        {/* Course Modules */}
        {courseModules.map((module, moduleIndex) => (
          <section key={moduleIndex} className={moduleIndex % 2 === 0 ? "section" : "section"} style={{ 
            backgroundColor: moduleIndex % 2 === 0 ? 'var(--white)' : 'var(--gray-50)' 
          }}>
            <div className="container">
              <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
                <h2>{module.category}</h2>
              </div>

              <div className="grid grid-2">
                {module.courses.map((course, index) => (
                  <div key={index} className="card">
                    <div className="card-header">
                      <div style={{ 
                        display: 'inline-block',
                        padding: 'var(--space-1) var(--space-3)',
                        backgroundColor: course.level === 'Beginner' ? 'var(--secondary)' : 
                                       course.level === 'Intermediate' ? 'var(--accent)' : 
                                       course.level === 'Advanced' ? 'var(--primary)' : 'var(--gray-500)',
                        color: 'var(--white)',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.875rem',
                        fontWeight: 'var(--font-weight-medium)',
                        marginBottom: 'var(--space-4)'
                      }}>
                        {course.level}
                      </div>
                      <h3 className="card-title">{course.title}</h3>
                      {course.titleAr && (
                        <h4 style={{ 
                          fontSize: '1.125rem', 
                          color: 'var(--gray-600)', 
                          fontWeight: 'var(--font-weight-medium)',
                          marginBottom: 'var(--space-3)',
                          direction: 'rtl'
                        }}>
                          {course.titleAr}
                        </h4>
                      )}
                      <p style={{ marginBottom: 'var(--space-4)' }}>{course.description}</p>
                      {course.descriptionAr && (
                        <p style={{ 
                          marginBottom: 'var(--space-4)', 
                          color: 'var(--gray-600)',
                          direction: 'rtl'
                        }}>
                          {course.descriptionAr}
                        </p>
                      )}
                    </div>

                    <div style={{ marginBottom: 'var(--space-6)' }}>
                      <div className="flex-between" style={{ marginBottom: 'var(--space-4)' }}>
                        <span style={{ color: 'var(--gray-600)' }}>Duration:</span>
                        <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{course.duration}</span>
                      </div>

                      <h4 style={{ 
                        fontSize: '1rem', 
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: 'var(--space-3)' 
                      }}>
                        Learning Outcomes:
                      </h4>
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0,
                        marginBottom: 'var(--space-6)' 
                      }}>
                        {course.features.map((feature, featureIndex) => (
                          <li key={featureIndex} style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            marginBottom: 'var(--space-2)' 
                          }}>
                            <span style={{ 
                              color: 'var(--secondary)', 
                              marginRight: 'var(--space-2)',
                              fontSize: '1.2rem'
                            }}>
                              ✓
                            </span>
                            <span style={{ color: 'var(--gray-600)' }}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a href="/register" className="btn btn-primary" style={{ width: '100%' }}>
                      Start Learning
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Technology Features */}
        <section className="section" style={{ backgroundColor: 'var(--primary)', color: 'var(--white)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
              <h2 style={{ color: 'var(--white)' }}>Advanced Learning Technology</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem' }}>
                AI-powered features and virtual labs for comprehensive medical coding education
              </p>
            </div>

            <div className="grid grid-3">
              <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                <div className="card-header">
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    fontSize: '24px',
                    color: 'var(--white)'
                  }}>
                    🤖
                  </div>
                  <h3 style={{ color: 'var(--white)', marginBottom: 'var(--space-3)' }}>AI Code Suggestions</h3>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  95%+ accuracy AI coding assistance with real-time suggestions and error detection.
                </p>
              </div>

              <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                <div className="card-header">
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    fontSize: '24px',
                    color: 'var(--white)'
                  }}>
                    🏥
                  </div>
                  <h3 style={{ color: 'var(--white)', marginBottom: 'var(--space-3)' }}>Saudi EHR Integration Lab</h3>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Practice with Cerner/Oracle and Epic systems used in Saudi hospitals with real medical charts.
                </p>
              </div>

              <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                <div className="card-header">
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    fontSize: '24px',
                    color: 'var(--white)'
                  }}>
                    🌍
                  </div>
                  <h3 style={{ color: 'var(--white)', marginBottom: 'var(--space-3)' }}>Bilingual Support</h3>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  SNOMED CT Arabic integration and code-switching support for 25 regional dialects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="container">
            <div className="text-center">
              <h2>Ready to Master Medical Coding?</h2>
              <p style={{ marginBottom: 'var(--space-8)', fontSize: '1.125rem' }}>
                Join healthcare professionals worldwide advancing their careers with comprehensive, 
                industry-aligned medical coding education.
              </p>
              <div className="flex-center" style={{ gap: 'var(--space-4)' }}>
                <a href="/register" className="btn btn-primary btn-large">
                  Start Your Journey
                </a>
                <a 
                  href="https://chatgpt.com/g/g-675e783e5464819187886b7cf9d1b082-ai-powered-claim-resubmission-assistant" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-large"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--white)' }}
                >
                  AI_MedCode_Assistant
                </a>
                <a href="/contact" className="btn btn-secondary btn-large">
                  Get Free Consultation
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
                Quick Links
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <a href="/courses" style={{ color: 'var(--gray-300)' }}>Courses</a>
                <a href="/about" style={{ color: 'var(--gray-300)' }}>About</a>
                <a href="/contact" style={{ color: 'var(--gray-300)' }}>Contact</a>
                <a href="/register" style={{ color: 'var(--gray-300)' }}>Register</a>
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