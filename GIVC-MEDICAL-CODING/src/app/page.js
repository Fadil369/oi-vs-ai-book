// Force static generation for Cloudflare Pages
export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">GIVC Medical Coding Academy</div>
            <ul className="nav-links">
              <li><a href="/courses" className="nav-link">Courses</a></li>
              <li><a href="/instructor-portal" className="nav-link">Instructors</a></li>
              <li><a href="/investment-deck" className="nav-link">Investment</a></li>
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
            <h1>Master Medical Coding with Expert Training</h1>
            <p>
              Join thousands of healthcare professionals who have advanced their careers 
              with our comprehensive medical coding certification programs.
            </p>
            <div className="flex-center" style={{ gap: 'var(--space-4)' }}>
              <a href="/register" className="btn btn-primary btn-large">Start Learning Today</a>
              <a 
                href="https://chatgpt.com/g/g-675e783e5464819187886b7cf9d1b082-ai-powered-claim-resubmission-assistant" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary btn-large"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--white)' }}
              >
                AI_MedCode_Assistant
              </a>
              <a href="/courses" className="btn btn-secondary btn-large">View Courses</a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
              <h2>Why Choose GIVC Medical Coding?</h2>
              <p>Professional training designed for healthcare success</p>
            </div>
            
            <div className="grid grid-3">
              <div className="card">
                <div className="card-header">
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: 'var(--primary)', 
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    fontSize: '24px',
                    color: 'var(--white)'
                  }}>
                    📚
                  </div>
                  <h3 className="card-title">Comprehensive Curriculum</h3>
                </div>
                <p>
                  Master ICD-10, CPT, and HCPCS coding systems with our 
                  industry-leading curriculum designed by certified professionals.
                </p>
              </div>

              <div className="card">
                <div className="card-header">
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: 'var(--secondary)', 
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    fontSize: '24px',
                    color: 'var(--white)'
                  }}>
                    🎯
                  </div>
                  <h3 className="card-title">Expert Instructors</h3>
                </div>
                <p>
                  Learn from certified medical coding professionals with years 
                  of real-world experience in healthcare settings.
                </p>
              </div>

              <div className="card">
                <div className="card-header">
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: 'var(--accent)', 
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    fontSize: '24px',
                    color: 'var(--white)'
                  }}>
                    🏆
                  </div>
                  <h3 className="card-title">Industry Certification</h3>
                </div>
                <p>
                  Earn recognized credentials that open doors to better 
                  opportunities in the growing healthcare industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section" style={{ backgroundColor: 'var(--gray-50)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
              <h2>Trusted by Healthcare Professionals</h2>
            </div>
            
            <div className="grid grid-3">
              <div className="text-center">
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: 'var(--font-weight-bold)', 
                  color: 'var(--primary)',
                  marginBottom: 'var(--space-2)'
                }}>
                  10,000+
                </div>
                <p style={{ fontSize: '1.125rem', fontWeight: 'var(--font-weight-medium)' }}>
                  Students Trained
                </p>
              </div>
              
              <div className="text-center">
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: 'var(--font-weight-bold)', 
                  color: 'var(--primary)',
                  marginBottom: 'var(--space-2)'
                }}>
                  95%
                </div>
                <p style={{ fontSize: '1.125rem', fontWeight: 'var(--font-weight-medium)' }}>
                  Certification Success Rate
                </p>
              </div>
              
              <div className="text-center">
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: 'var(--font-weight-bold)', 
                  color: 'var(--primary)',
                  marginBottom: 'var(--space-2)'
                }}>
                  50+
                </div>
                <p style={{ fontSize: '1.125rem', fontWeight: 'var(--font-weight-medium)' }}>
                  Expert Instructors
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="container">
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: 'var(--white)',
              textAlign: 'center',
              padding: 'var(--space-12)'
            }}>
              <h2 style={{ color: 'var(--white)', marginBottom: 'var(--space-4)' }}>
                Ready to Start Your Medical Coding Career?
              </h2>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1.125rem',
                marginBottom: 'var(--space-8)',
                maxWidth: '600px',
                margin: '0 auto var(--space-8)'
              }}>
                Join our comprehensive training program and take the first step 
                toward a rewarding career in healthcare.
              </p>
              <a href="/register" className="btn btn-secondary btn-large">
                Get Started Today
              </a>
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
                GIVC Medical Coding Academy
              </h3>
              <p>
                Professional medical coding education for healthcare professionals.
              </p>
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
            <p style={{ marginBottom: 'var(--space-4)' }}>
              <a 
                href="https://care.brainsait.io" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--primary-light)', 
                  fontWeight: 'var(--font-weight-semibold)',
                  textDecoration: 'none',
                  fontSize: '1.1rem'
                }}
              >
                Global Integrated Virtual Care
              </a>{' '}
              <strong style={{ color: 'var(--accent)' }}>Powered</strong> by{' '}
              <a 
                href="https://care.brainsait.io" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--accent)', 
                  fontWeight: 'var(--font-weight-bold)',
                  textDecoration: 'none'
                }}
              >
                BRAINSAITبرينسايت
              </a>
              <br />
              <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                من الافكار الي الابتكار
              </span>
            </p>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              Created by{' '}
              <a 
                href="https://gp.thefadil.site" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--secondary-light)', 
                  fontWeight: 'var(--font-weight-semibold)',
                  textDecoration: 'none'
                }}
              >
                Dr. Mohamed El Fadil
              </a>
            </p>
            <p>&copy; 2024 GIVC Medical Coding Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}