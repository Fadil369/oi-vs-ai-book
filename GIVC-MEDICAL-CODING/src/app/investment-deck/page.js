export const dynamic = 'force-static';

export default function InvestmentDeck() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BRAINSAIT برينسايت - Investment Deck 2025</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap");

      :root {
        --primary-color: #0066cc;
        --secondary-color: #00a651;
        --accent-color: #ff6b35;
        --text-dark: #1a1a1a;
        --text-light: #666666;
        --bg-light: #f8fafc;
        --border-color: #e2e8f0;
        --gradient-primary: linear-gradient(135deg, #0066cc 0%, #004499 100%);
        --gradient-secondary: linear-gradient(135deg, #00a651 0%, #007a3d 100%);
        --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --shadow-large: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Inter", sans-serif;
        line-height: 1.6;
        color: var(--text-dark);
        background: white;
      }

      .arabic {
        font-family: "Amiri", serif;
        direction: rtl;
        text-align: right;
      }

      /* Print Styles */
      @media print {
        body {
          margin: 0;
          font-size: 12px;
          line-height: 1.4;
        }
        .page-break {
          page-break-before: always;
        }
        .no-print {
          display: none !important;
        }
        .chart-container {
          break-inside: avoid;
        }
      }

      /* Container */
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      /* Header */
      .header {
        background: var(--gradient-primary);
        color: white;
        padding: 60px 0;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      .header::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="rgba(255,255,255,0.1)"><polygon points="0,0 1000,0 1000,60 0,100"/></svg>');
        background-size: cover;
      }

      .header-content {
        position: relative;
        z-index: 2;
      }

      .logo {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }

      .tagline {
        font-size: 1.2rem;
        margin-bottom: 30px;
        opacity: 0.9;
      }

      .investment-highlight {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 20px;
        display: inline-block;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      /* Navigation */
      .nav-pills {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 40px 0;
        flex-wrap: wrap;
      }

      .nav-pill {
        background: var(--bg-light);
        border: 2px solid var(--border-color);
        border-radius: 25px;
        padding: 12px 24px;
        text-decoration: none;
        color: var(--text-dark);
        font-weight: 500;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .nav-pill:hover,
      .nav-pill.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: var(--shadow-card);
      }

      /* Cards */
      .card {
        background: white;
        border-radius: 15px;
        padding: 30px;
        margin-bottom: 30px;
        box-shadow: var(--shadow-card);
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-large);
      }

      .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid var(--bg-light);
      }

      .card-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        font-size: 1.5rem;
      }

      .card-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-dark);
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 30px 0;
      }

      .stat-card {
        background: var(--gradient-primary);
        color: white;
        padding: 25px;
        border-radius: 15px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      .stat-card::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transform: translate(30px, -30px);
      }

      .stat-number {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 5px;
        position: relative;
        z-index: 2;
      }

      .stat-label {
        font-size: 0.9rem;
        opacity: 0.9;
        position: relative;
        z-index: 2;
      }

      .stat-card.secondary {
        background: var(--gradient-secondary);
      }

      .stat-card.accent {
        background: linear-gradient(
          135deg,
          var(--accent-color) 0%,
          #e55a2b 100%
        );
      }

      /* Charts */
      .chart-container {
        position: relative;
        height: 400px;
        margin: 30px 0;
        background: white;
        border-radius: 15px;
        padding: 20px;
        box-shadow: var(--shadow-card);
      }

      .chart-title {
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 20px;
        color: var(--text-dark);
      }

      /* Timeline */
      .timeline {
        position: relative;
        padding-left: 30px;
      }

      .timeline::before {
        content: "";
        position: absolute;
        left: 15px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--primary-color);
      }

      .timeline-item {
        position: relative;
        margin-bottom: 30px;
        padding-left: 40px;
      }

      .timeline-item::before {
        content: "";
        position: absolute;
        left: -8px;
        top: 5px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--primary-color);
        border: 3px solid white;
        box-shadow: 0 0 0 3px var(--primary-color);
      }

      .timeline-date {
        font-weight: 600;
        color: var(--primary-color);
        margin-bottom: 5px;
      }

      .timeline-content {
        background: var(--bg-light);
        padding: 15px;
        border-radius: 10px;
        border-left: 4px solid var(--primary-color);
      }

      /* Risk Matrix */
      .risk-matrix {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin: 20px 0;
      }

      .risk-item {
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        font-weight: 500;
      }

      .risk-low {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      .risk-medium {
        background: #fff3cd;
        color: #856404;
        border: 1px solid #ffeaa7;
      }

      .risk-high {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }

      /* Financial Tables */
      .financial-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: var(--shadow-card);
      }

      .financial-table th {
        background: var(--gradient-primary);
        color: white;
        padding: 15px;
        text-align: left;
        font-weight: 600;
      }

      .financial-table td {
        padding: 12px 15px;
        border-bottom: 1px solid var(--border-color);
      }

      .financial-table tbody tr:hover {
        background: var(--bg-light);
      }

      .financial-table .number {
        text-align: right;
        font-weight: 500;
        font-family: "Monaco", monospace;
      }

      /* Competitive Analysis */
      .competitive-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin: 30px 0;
      }

      .competitor-card {
        background: white;
        border-radius: 15px;
        padding: 20px;
        border: 2px solid var(--border-color);
        position: relative;
      }

      .competitor-card.brainsait {
        border-color: var(--primary-color);
        background: linear-gradient(
          135deg,
          rgba(0, 102, 204, 0.05) 0%,
          rgba(0, 68, 153, 0.05) 100%
        );
      }

      .competitor-card.brainsait::before {
        content: "👑 BRAINSAIT";
        position: absolute;
        top: -10px;
        left: 20px;
        background: var(--primary-color);
        color: white;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      /* Action Buttons */
      .action-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin: 40px 0;
        flex-wrap: wrap;
      }

      .btn {
        padding: 15px 30px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
        cursor: pointer;
        border: none;
        font-size: 1rem;
      }

      .btn-primary {
        background: var(--gradient-primary);
        color: white;
      }

      .btn-secondary {
        background: var(--gradient-secondary);
        color: white;
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-card);
      }

      /* Section Headers */
      .section-header {
        text-align: center;
        margin: 60px 0 40px;
      }

      .section-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--text-dark);
        margin-bottom: 15px;
      }

      .section-subtitle {
        font-size: 1.2rem;
        color: var(--text-light);
        max-width: 600px;
        margin: 0 auto;
      }

      /* Footer */
      .footer {
        background: var(--text-dark);
        color: white;
        padding: 40px 0;
        text-align: center;
        margin-top: 60px;
      }
    </style>
  </head>
  <body>
    <!-- Investment Deck Content Embedded -->
    <div class="container">
      <h1 style="color: #0066cc; text-align: center; margin: 40px 0;">
        BRAINSAIT Investment Deck 2025
      </h1>
      <p style="text-align: center; font-size: 1.2rem; margin-bottom: 40px;">
        Access the complete investment presentation through the links below
      </p>
      <div style="display: grid; gap: 30px; margin: 40px 0;">
        <div style="background: #f8fafc; padding: 30px; border-radius: 15px; text-align: center;">
          <h3 style="color: #0066cc; margin-bottom: 20px;">📄 Investment Deck</h3>
          <p style="margin-bottom: 20px;">Comprehensive business plan and market analysis</p>
          <a href="/presentation-slides/" style="background: #0066cc; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            View Presentation Slides
          </a>
        </div>
        <div style="background: linear-gradient(135deg, #0066cc 0%, #004499 100%); color: white; padding: 30px; border-radius: 15px; text-align: center;">
          <h3 style="margin-bottom: 20px;">🚀 Series A Opportunity</h3>
          <div style="font-size: 2.5rem; font-weight: 800; margin: 20px 0;">SAR 94M</div>
          <p>Transforming Saudi Arabia's Healthcare Revenue Cycle</p>
        </div>
      </div>
    </div>
  </body>
</html>`
    }} />
  );
}