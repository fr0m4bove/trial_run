// src/app/page.tsx
import { Header } from '@/components/layout/Header'
import { BookGallery } from '@/components/books/BookGallery'

export default function HomePage() {
  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 50%, rgba(212, 186, 176, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(151, 118, 105, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(132, 99, 88, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #2c1810 0%, #43302b 25%, #5d4037 50%, #6d4c41 75%, #8d6e63 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        
        {/* Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(244, 180, 31, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(220, 152, 21, 0.05) 0%, transparent 50%)
          `,
          opacity: 0.8
        }}></div>

        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '60px',
          width: '120px',
          height: '120px',
          border: '3px solid rgba(244, 180, 31, 0.3)',
          borderRadius: '50%',
          opacity: 0.6
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '60px',
          right: '60px',
          width: '90px',
          height: '90px',
          border: '2px solid rgba(212, 186, 176, 0.4)',
          transform: 'rotate(45deg)',
          opacity: 0.5
        }}></div>

        {/* Corner Flourishes */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '2rem', color: 'rgba(244, 180, 31, 0.6)', fontFamily: 'serif' }}>❦</div>
        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '2rem', color: 'rgba(244, 180, 31, 0.6)', fontFamily: 'serif', transform: 'scaleX(-1)' }}>❦</div>
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '2rem', color: 'rgba(244, 180, 31, 0.6)', fontFamily: 'serif', transform: 'rotate(180deg)' }}>❦</div>
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '2rem', color: 'rgba(244, 180, 31, 0.6)', fontFamily: 'serif', transform: 'rotate(180deg) scaleX(-1)' }}>❦</div>

        {/* Main Content */}
        <div style={{ 
          position: 'relative',
          zIndex: 10,
          textAlign: 'center', 
          maxWidth: '900px'
        }}>
          
          <div style={{
            fontSize: '5rem',
            marginBottom: '2rem',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}>📚</div>
          
          <h1 style={{ 
            fontFamily: 'Crimson Text, Georgia, serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: '700',
            color: '#f4b41f',
            marginBottom: '1.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(244, 180, 31, 0.3)',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }}>
            Book Sanctuary
          </h1>
          
          <div style={{
            width: '200px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #f4b41f, transparent)',
            margin: '2rem auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '8px',
              height: '8px',
              background: '#f4b41f',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(244, 180, 31, 0.8)'
            }}></div>
          </div>
          
          <p style={{ 
            fontFamily: 'Crimson Text, Georgia, serif',
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: '#d2bab0',
            lineHeight: '1.6',
            marginBottom: '3rem',
            fontStyle: 'italic',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            Where stories come alive in an atmosphere of timeless elegance.<br />
            Your personal literary sanctuary awaits discovery.
          </p>
          
          <div style={{
            marginTop: '3rem',
            fontFamily: 'Crimson Text, Georgia, serif',
            fontSize: '1rem',
            color: 'rgba(212, 186, 176, 0.8)',
            fontStyle: 'italic',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            "A reader lives a thousand lives before he dies..."
          </div>
        </div>
      </section>

      {/* Book Gallery Section */}
      <BookGallery />
    </div>
  )
}