import './globals.css'

export const metadata = {
  title: 'GIVC Medical Coding Academy - Professional Training Platform',
  description: 'Learn medical coding with expert instructors. Get certified in ICD-10, CPT, and HCPCS. Advance your healthcare career.',
  keywords: 'medical coding, ICD-10, CPT, HCPCS, healthcare training, medical certification',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0066cc" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}