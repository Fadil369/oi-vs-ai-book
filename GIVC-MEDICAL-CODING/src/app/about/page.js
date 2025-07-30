// Force static generation for Cloudflare Pages
export const dynamic = "force-static";

export default function AboutPage() {
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
              <li><a href="/about" className="nav-link" style={{ color: 'var(--primary)' }}>About</a></li>
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
            <h1>About GIVC Medical Coding</h1>
            <p>
              Empowering healthcare professionals with world-class medical coding 
              education and certification programs.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section">
          <div className="container">
            <div className="grid grid-2">
              <div>
                <h2>Our Mission</h2>
                <p>
                  At GIVC Medical Coding, we are dedicated to providing comprehensive, 
                  high-quality medical coding education that prepares healthcare 
                  professionals for successful careers in this critical field.
                </p>
                <p>
                  We believe that proper medical coding is essential for accurate 
                  healthcare documentation, billing, and patient care. Our programs 
                  are designed to meet industry standards while providing practical, 
                  hands-on training.
                </p>
              </div>
              <div className="card">
                <h3 className="card-title">Why Medical Coding Matters</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    marginBottom: 'var(--space-3)' 
                  }}>
                    <span style={{ 
                      color: 'var(--primary)', 
                      marginRight: 'var(--space-2)',
                      fontSize: '1.2rem'
                    }}>
                      🏥
                    </span>
                    <span>Ensures accurate patient records</span>
                  </li>
                  <li style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    marginBottom: 'var(--space-3)' 
                  }}>
                    <span style={{ 
                      color: 'var(--primary)', 
                      marginRight: 'var(--space-2)',
                      fontSize: '1.2rem'
                    }}>
                      💰
                    </span>
                    <span>Facilitates proper billing and reimbursement</span>
                  </li>
                  <li style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    marginBottom: 'var(--space-3)' 
                  }}>
                    <span style={{ 
                      color: 'var(--primary)', 
                      marginRight: 'var(--space-2)',
                      fontSize: '1.2rem'
                    }}>
                      📊
                    </span>
                    <span>Supports healthcare research and statistics</span>
                  </li>
                  <li style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start'
                  }}>
                    <span style={{ 
                      color: 'var(--primary)', 
                      marginRight: 'var(--space-2)',
                      fontSize: '1.2rem'
                    }}>
                      ⚖️
                    </span>
                    <span>Ensures compliance with regulations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section" style={{ backgroundColor: 'var(--gray-50)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
              <h2>Our Impact</h2>
              <p>Trusted by healthcare professionals worldwide</p>
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
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-2)' }}>
                  Students Trained
                </h3>
                <p style={{ color: 'var(--gray-600)' }}>
                  Healthcare professionals who have completed our programs
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
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-2)' }}>
                  Certification Success Rate
                </h3>
                <p style={{ color: 'var(--gray-600)' }}>
                  Students who pass their certification exams
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
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-2)' }}>
                  Expert Instructors
                </h3>
                <p style={{ color: 'var(--gray-600)' }}>
                  Certified professionals with real-world experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
              <h2>Our Approach</h2>
              <p>What makes our training programs effective</p>
            </div>

            <div className="grid grid-2">
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
                    👨‍🏫
                  </div>
                  <h3 className="card-title">Expert-Led Training</h3>
                </div>
                <p>
                  Our instructors are certified medical coding professionals 
                  with years of experience in healthcare settings. They bring 
                  real-world knowledge to every lesson.
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
                    💻
                  </div>
                  <h3 className="card-title">Hands-On Practice</h3>
                </div>
                <p>
                  Practice with real medical records and coding scenarios. 
                  Our interactive platform provides immediate feedback 
                  and guidance.
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
                    📋
                  </div>
                  <h3 className="card-title">Industry Standards</h3>
                </div>
                <p>
                  Our curriculum is aligned with current industry standards 
                  and regularly updated to reflect the latest coding guidelines 
                  and regulations.
                </p>
              </div>

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
                    🤝
                  </div>
                  <h3 className="card-title">Career Support</h3>
                </div>
                <p>
                  We provide ongoing support including job placement assistance, 
                  resume reviews, and interview preparation to help you succeed 
                  in your career.
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
                Ready to Join Our Community?
              </h2>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1.125rem',
                marginBottom: 'var(--space-8)',
                maxWidth: '600px',
                margin: '0 auto var(--space-8)'
              }}>
                Become part of a growing community of healthcare professionals 
                advancing their careers through medical coding expertise.
              </p>
              <div className="flex-center" style={{ gap: 'var(--space-4)' }}>
                <a href="/register" className="btn btn-secondary btn-large">
                  Start Your Journey
                </a>
                <a href="/contact" className="btn" style={{ 
                  backgroundColor: 'transparent',
                  color: 'var(--white)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  padding: 'var(--space-4) var(--space-8)',
                  fontSize: '1.125rem',
                  fontWeight: 'var(--font-weight-medium)',
                  borderRadius: 'var(--radius)',
                  textDecoration: 'none'
                }}>
                  Contact Us
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
              <p>Professional medical coding education for healthcare professionals.</p>
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