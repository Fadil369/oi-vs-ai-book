// Force static generation for Cloudflare Pages
export const dynamic = "force-static";

export default function ContactPage() {
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
              <li><a href="/contact" className="nav-link" style={{ color: 'var(--primary)' }}>Contact</a></li>
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
            <h1>Contact Us</h1>
            <p>
              Get in touch with our team. We're here to help you succeed 
              in your medical coding journey.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section">
          <div className="container">
            <div className="grid grid-2">
              {/* Contact Form */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Send us a Message</h2>
                  <p>We'll get back to you within 24 hours.</p>
                </div>
                
                <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
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
                      Subject *
                    </label>
                    <input 
                      type="text" 
                      required
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
                      Message *
                    </label>
                    <textarea 
                      required
                      rows="5"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '2px solid var(--gray-200)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-large">
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      backgroundColor: 'var(--primary)', 
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: 'var(--white)',
                      flexShrink: 0
                    }}>
                      📧
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        Email
                      </h3>
                      <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-1)' }}>
                        info@givcmedical.com
                      </p>
                      <p style={{ color: 'var(--gray-600)' }}>
                        support@givcmedical.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      backgroundColor: 'var(--secondary)', 
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: 'var(--white)',
                      flexShrink: 0
                    }}>
                      📞
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        Phone
                      </h3>
                      <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-1)' }}>
                        +1 (555) 123-4567
                      </p>
                      <p style={{ color: 'var(--gray-600)' }}>
                        +971 4 123 4567
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      backgroundColor: 'var(--accent)', 
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: 'var(--white)',
                      flexShrink: 0
                    }}>
                      📍
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        Office
                      </h3>
                      <p style={{ color: 'var(--gray-600)' }}>
                        123 Healthcare Plaza<br />
                        Dubai, UAE 12345
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      backgroundColor: 'var(--primary)', 
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: 'var(--white)',
                      flexShrink: 0
                    }}>
                      🕒
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        Office Hours
                      </h3>
                      <p style={{ color: 'var(--gray-600)' }}>
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section" style={{ backgroundColor: 'var(--gray-50)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
              <h2>Frequently Asked Questions</h2>
              <p>Quick answers to common questions</p>
            </div>

            <div className="grid grid-2">
              <div className="card">
                <h3 className="card-title">How long are the courses?</h3>
                <p>
                  Our courses range from 6 to 10 weeks, depending on the program. 
                  Each course is designed to fit around your schedule with flexible 
                  learning options.
                </p>
              </div>

              <div className="card">
                <h3 className="card-title">Do I need prior experience?</h3>
                <p>
                  No prior medical coding experience is required for our beginner 
                  courses. We offer programs for all skill levels, from complete 
                  beginners to advanced professionals.
                </p>
              </div>

              <div className="card">
                <h3 className="card-title">Are certifications included?</h3>
                <p>
                  Yes, all our courses include preparation for industry-recognized 
                  certifications. We also provide ongoing support for the 
                  certification exam process.
                </p>
              </div>

              <div className="card">
                <h3 className="card-title">What support do you provide?</h3>
                <p>
                  We offer comprehensive support including instructor guidance, 
                  peer forums, technical assistance, and career placement services 
                  for our graduates.
                </p>
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