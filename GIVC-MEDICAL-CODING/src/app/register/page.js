// Force static generation for Cloudflare Pages
export const dynamic = "force-static";

export default function RegisterPage() {
  const programs = [
    {
      name: "Foundation Program",
      description: "Perfect for getting started with medical coding",
      features: [
        "Introduction to medical terminology",
        "Basic anatomy and physiology",
        "Healthcare documentation",
        "ICD-10-CM basics",
        "CPT fundamentals",
        "Certificate of completion"
      ],
      popular: false
    },
    {
      name: "Professional Certification", 
      description: "Complete training for serious professionals",
      features: [
        "All foundation topics",
        "Advanced ICD-10-CM/PCS",
        "CPT advanced procedures",
        "HCPCS Level II coding",
        "Real-world case studies",
        "Industry certification prep",
        "Job placement assistance"
      ],
      popular: true
    },
    {
      name: "Specialized Training",
      description: "Advanced specialization tracks",
      features: [
        "Everything in Professional",
        "Specialty coding (Cardiology, Oncology, etc.)",
        "Risk adjustment coding",
        "Auditing and compliance",
        "Leadership in coding",
        "Continuing education credits"
      ],
      popular: false
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
              <li><a href="/courses" className="nav-link">Courses</a></li>
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
            <h1>Start Your Medical Coding Journey</h1>
            <p>
              Join thousands of healthcare professionals advancing their careers 
              with our comprehensive certification programs.
            </p>
          </div>
        </section>

        {/* Training Programs */}
        <section className="section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
              <h2>Choose Your Program</h2>
              <p>Select the perfect program for your medical coding education journey</p>
            </div>

            <div className="grid grid-3">
              {programs.map((program, index) => (
                <div 
                  key={index} 
                  className="card" 
                  style={{
                    position: 'relative',
                    border: program.popular ? '3px solid var(--primary)' : 'none',
                    transform: program.popular ? 'scale(1.05)' : 'none'
                  }}
                >
                  {program.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--white)',
                      padding: 'var(--space-2) var(--space-6)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.875rem',
                      fontWeight: 'var(--font-weight-semibold)'
                    }}>
                      Most Popular
                    </div>
                  )}
                  
                  <div className="card-header" style={{ textAlign: 'center' }}>
                    <h3 className="card-title" style={{ fontSize: '1.5rem' }}>{program.name}</h3>
                    <p style={{ color: 'var(--gray-600)', marginTop: 'var(--space-4)' }}>{program.description}</p>
                  </div>

                  <div style={{ marginBottom: 'var(--space-8)' }}>
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0,
                      marginBottom: 'var(--space-6)' 
                    }}>
                      {program.features.map((feature, featureIndex) => (
                        <li key={featureIndex} style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start',
                          marginBottom: 'var(--space-3)' 
                        }}>
                          <span style={{ 
                            color: 'var(--secondary)', 
                            marginRight: 'var(--space-2)',
                            fontSize: '1.2rem'
                          }}>
                            ✓
                          </span>
                          <span style={{ color: 'var(--gray-700)' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    className={`btn ${program.popular ? 'btn-primary' : 'btn-secondary'} btn-large`}
                    style={{ width: '100%' }}
                  >
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="section" style={{ backgroundColor: 'var(--gray-50)' }}>
          <div className="container">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="card">
                <div className="card-header" style={{ textAlign: 'center' }}>
                  <h2 className="card-title" style={{ fontSize: '2rem' }}>Create Your Account</h2>
                  <p>Start your medical coding journey today. Get instant access to our platform.</p>
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div className="grid grid-2">
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--gray-700)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        First Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter your first name"
                        style={{
                          width: '100%',
                          padding: 'var(--space-3)',
                          border: '2px solid var(--gray-200)',
                          borderRadius: 'var(--radius)',
                          fontSize: '1rem',
                          }}
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--gray-700)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        Last Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter your last name"
                        style={{
                          width: '100%',
                          padding: 'var(--space-3)',
                          border: '2px solid var(--gray-200)',
                          borderRadius: 'var(--radius)',
                          fontSize: '1rem',
                          }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--gray-700)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '2px solid var(--gray-200)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--gray-700)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      Password *
                    </label>
                    <input 
                      type="password" 
                      required
                      placeholder="Create a strong password"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '2px solid var(--gray-200)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--gray-700)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      Confirm Password *
                    </label>
                    <input 
                      type="password" 
                      required
                      placeholder="Confirm your password"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '2px solid var(--gray-200)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      style={{
                        marginTop: 'var(--space-1)',
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--primary)'
                      }}
                    />
                    <label htmlFor="terms" style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      I agree to the{" "}
                      <a href="#" style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-medium)' }}>
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-medium)' }}>
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-large">
                    Create Account
                  </button>
                </form>

                <div style={{ 
                  marginTop: 'var(--space-8)', 
                  paddingTop: 'var(--space-6)',
                  borderTop: '1px solid var(--gray-200)',
                  textAlign: 'center' 
                }}>
                  <p style={{ color: 'var(--gray-600)' }}>
                    Already have an account?{" "}
                    <a href="#" style={{ 
                      color: 'var(--primary)', 
                      fontWeight: 'var(--font-weight-semibold)',
                      textDecoration: 'none'
                    }}>
                      Sign in here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="section">
          <div className="container">
            <div className="text-center">
              <h2>Join Our Growing Community</h2>
              <p style={{ marginBottom: 'var(--space-8)' }}>
                Trusted by healthcare professionals worldwide
              </p>
              <div className="grid grid-3">
                <div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'var(--font-weight-bold)', 
                    color: 'var(--primary)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    10,000+
                  </div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Students Trained</p>
                </div>
                <div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'var(--font-weight-bold)', 
                    color: 'var(--primary)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    95%
                  </div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Success Rate</p>
                </div>
                <div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'var(--font-weight-bold)', 
                    color: 'var(--primary)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    50+
                  </div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Expert Instructors</p>
                </div>
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