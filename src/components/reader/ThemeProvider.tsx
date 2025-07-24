'use client'

import { Theme } from './PDFReader'

interface ThemeProviderProps {
  theme: Theme
}

export function ThemeProvider({ theme }: ThemeProviderProps) {
  const renderTheme = () => {
    switch (theme) {
      case 'cozy-cabin':
        return <CozyCabinTheme />
      case 'midnight-library':
        return <MidnightLibraryTheme />
      case 'rainy-day':
        return <RainyDayTheme />
      default:
        return <CozyCabinTheme />
    }
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: -1
    }}>
      {renderTheme()}
    </div>
  )
}

function CozyCabinTheme() {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: `
        linear-gradient(180deg, 
          rgba(135, 206, 235, 0.3) 0%, 
          rgba(255, 255, 255, 0.4) 30%, 
          rgba(245, 245, 245, 0.8) 70%, 
          rgba(255, 255, 255, 0.95) 100%
        )
      `,
      overflow: 'hidden'
    }}>
      
      {/* Snowy Ground */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '35%',
        background: `
          linear-gradient(180deg, 
            rgba(255, 255, 255, 0.6) 0%, 
            rgba(255, 255, 255, 0.9) 50%, 
            rgba(255, 255, 255, 1) 100%
          )
        `,
        borderTop: '2px solid rgba(255, 255, 255, 0.8)'
      }} />

      {/* Mountain Silhouettes - adjusted to sit on snow */}
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: 0,
        right: 0,
        height: '45%',
        background: `
          radial-gradient(ellipse at 20% 100%, rgba(47, 79, 79, 0.8) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(47, 79, 79, 0.9) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 100%, rgba(47, 79, 79, 0.7) 0%, transparent 45%)
        `
      }} />

      {/* Cabin - adjusted position */}
      <div style={{
        position: 'absolute',
        bottom: '30%',
        left: '15%',
        width: '200px',
        height: '120px',
        background: 'rgba(101, 67, 33, 0.9)',
        borderRadius: '5px 5px 0 0',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Roof */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '-10px',
          width: 0,
          height: 0,
          borderLeft: '110px solid transparent',
          borderRight: '110px solid transparent',
          borderBottom: '40px solid rgba(139, 69, 19, 0.9)'
        }} />
        
        {/* Chimney smoke */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '40px',
          width: '20px',
          height: '40px',
          background: 'rgba(139, 69, 19, 0.8)',
          borderRadius: '2px'
        }} />
        
        {/* Windows */}
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          width: '40px',
          height: '40px',
          background: 'rgba(255, 220, 150, 0.9)',
          borderRadius: '3px',
          boxShadow: '0 0 30px rgba(255, 220, 150, 0.8)'
        }} />
        
        <div style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          width: '40px',
          height: '40px',
          background: 'rgba(255, 220, 150, 0.9)',
          borderRadius: '3px',
          boxShadow: '0 0 30px rgba(255, 220, 150, 0.8)'
        }} />
        
        {/* Door */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '35px',
          height: '55px',
          background: 'rgba(80, 50, 25, 0.9)',
          borderRadius: '3px 3px 0 0'
        }} />
      </div>

      {/* Snow drifts for added depth */}
      <div style={{
        position: 'absolute',
        bottom: '28%',
        left: 0,
        right: 0,
        height: '5%',
        background: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '50% 50% 0 0',
        filter: 'blur(8px)'
      }} />

      {/* Falling Snow */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none'
      }}>
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '-10px',
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              animation: `snowfall ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-100vh) translateX(0px);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(100px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}

function MidnightLibraryTheme() {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0033 30%, #2d1b69 60%, #0f0f23 100%)',
      overflow: 'hidden'
    }}>
      {/* Gothic Window Frame */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '200px',
        height: '300px',
        background: 'linear-gradient(180deg, rgba(30, 30, 60, 0.3) 0%, rgba(20, 20, 40, 0.5) 100%)',
        borderRadius: '100px 100px 0 0',
        border: '2px solid rgba(100, 100, 150, 0.3)',
        boxShadow: 'inset 0 0 30px rgba(100, 100, 200, 0.2)'
      }}>
        {/* Window panes */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '2px',
          height: '100%',
          background: 'rgba(100, 100, 150, 0.3)'
        }} />
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '0',
          width: '100%',
          height: '2px',
          background: 'rgba(100, 100, 150, 0.3)'
        }} />
      </div>

      {/* Detailed Bookshelves - Left Side */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '10%',
        bottom: 0,
        width: '25%',
        background: 'linear-gradient(90deg, rgba(10, 10, 20, 0.95) 0%, transparent 100%)',
      }}>
        {/* Bookshelf shelves */}
        {Array.from({ length: 6 }, (_, shelfIndex) => (
          <div key={`shelf-left-${shelfIndex}`} style={{
            position: 'absolute',
            top: `${15 + shelfIndex * 15}%`,
            left: '10%',
            right: '20%',
            height: '2px',
            background: 'rgba(80, 60, 40, 0.8)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Books on shelf */}
            {Array.from({ length: 5 + Math.floor(Math.random() * 3) }, (_, bookIndex) => {
              const bookHeight = 15 + Math.random() * 10
              const bookWidth = 8 + Math.random() * 6
              const bookColor = [
                'rgba(139, 69, 19, 0.8)',
                'rgba(25, 25, 112, 0.8)',
                'rgba(128, 0, 0, 0.8)',
                'rgba(0, 100, 0, 0.8)',
                'rgba(75, 0, 130, 0.8)'
              ][Math.floor(Math.random() * 5)]
              
              return (
                <div key={`book-${shelfIndex}-${bookIndex}`} style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: `${bookIndex * 12}%`,
                  width: `${bookWidth}%`,
                  height: `${bookHeight}px`,
                  background: bookColor,
                  borderRadius: '1px',
                  boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.3)',
                  transform: `rotate(${Math.random() * 4 - 2}deg)`
                }} />
              )
            })}
          </div>
        ))}
      </div>

      {/* Detailed Bookshelves - Right Side */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: '10%',
        bottom: 0,
        width: '25%',
        background: 'linear-gradient(-90deg, rgba(10, 10, 20, 0.95) 0%, transparent 100%)',
      }}>
        {/* Bookshelf shelves */}
        {Array.from({ length: 6 }, (_, shelfIndex) => (
          <div key={`shelf-right-${shelfIndex}`} style={{
            position: 'absolute',
            top: `${15 + shelfIndex * 15}%`,
            left: '20%',
            right: '10%',
            height: '2px',
            background: 'rgba(80, 60, 40, 0.8)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Books on shelf */}
            {Array.from({ length: 5 + Math.floor(Math.random() * 3) }, (_, bookIndex) => {
              const bookHeight = 15 + Math.random() * 10
              const bookWidth = 8 + Math.random() * 6
              const bookColor = [
                'rgba(139, 69, 19, 0.8)',
                'rgba(25, 25, 112, 0.8)',
                'rgba(128, 0, 0, 0.8)',
                'rgba(0, 100, 0, 0.8)',
                'rgba(75, 0, 130, 0.8)'
              ][Math.floor(Math.random() * 5)]
              
              return (
                <div key={`book-right-${shelfIndex}-${bookIndex}`} style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: `${bookIndex * 12}%`,
                  width: `${bookWidth}%`,
                  height: `${bookHeight}px`,
                  background: bookColor,
                  borderRadius: '1px',
                  boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.3)',
                  transform: `rotate(${Math.random() * 4 - 2}deg)`
                }} />
              )
            })}
          </div>
        ))}
      </div>

      {/* Floating Candles */}
      {Array.from({ length: 6 }, (_, i) => {
        const leftPosition = 15 + (i * 12) + (Math.random() * 5)
        const topPosition = 15 + (Math.random() * 15)
        const floatDelay = Math.random() * 5
        const flickerDelay = Math.random() * 2
        
        return (
          <div
            key={`candle-${i}`}
            style={{
              position: 'absolute',
              left: `${leftPosition}%`,
              top: `${topPosition}%`,
              animation: `float ${8 + Math.random() * 4}s ease-in-out infinite ${floatDelay}s`,
              zIndex: 5
            }}
          >
            {/* Candle body */}
            <div style={{
              width: '20px',
              height: '40px',
              background: 'linear-gradient(180deg, #f5f5dc 0%, #e6d4b1 100%)',
              borderRadius: '2px',
              position: 'relative',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Melted wax */}
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '0',
                width: '100%',
                height: '8px',
                background: '#f5f5dc',
                borderRadius: '50%',
                transform: 'translateY(-4px)'
              }} />
            </div>
            
            {/* Flame */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '15px',
              height: '20px',
              background: 'radial-gradient(ellipse at bottom, #ffeb3b 0%, #ff9800 40%, #ff5722 70%, transparent 100%)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animation: `flicker ${1 + Math.random()}s ease-in-out infinite ${flickerDelay}s`,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 20px #ff9800, 0 0 40px #ff5722'
            }} />
            
            {/* Glow */}
            <div style={{
              position: 'absolute',
              top: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, transparent 60%)',
              borderRadius: '50%',
              animation: `pulse ${2 + Math.random()}s ease-in-out infinite ${flickerDelay}s`
            }} />
          </div>
        )
      })}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          33% { transform: translateY(-20px) rotateZ(2deg); }
          66% { transform: translateY(10px) rotateZ(-2deg); }
        }
        
        @keyframes flicker {
          0%, 100% { transform: translateX(-50%) scale(1) rotateZ(0deg); opacity: 1; }
          25% { transform: translateX(-50%) scale(1.1) rotateZ(-2deg); opacity: 0.9; }
          50% { transform: translateX(-50%) scale(0.95) rotateZ(2deg); opacity: 1; }
          75% { transform: translateX(-50%) scale(1.05) rotateZ(-1deg); opacity: 0.95; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.4; transform: translateX(-50%) scale(1.1); }
        }
      `}</style>
    </div>
  )
}

function RainyDayTheme() {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(180deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
      overflow: 'hidden'
    }}>
      {/* Evergreen Forest Background */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 40, 20, 0.3) 100%)'
      }}>
        {/* Forest layers for depth */}
        {/* Far trees */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={`far-tree-${i}`}
            style={{
              position: 'absolute',
              bottom: '20%',
              left: `${i * 7 - 5}%`,
              width: '0',
              height: '0',
              borderLeft: '30px solid transparent',
              borderRight: '30px solid transparent',
              borderBottom: '80px solid rgba(0, 60, 30, 0.4)',
              filter: 'blur(2px)',
              transform: `scale(${0.8 + Math.random() * 0.2})`
            }}
          />
        ))}
        
        {/* Mid trees */}
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={`mid-tree-${i}`}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: `${i * 10}%`,
              width: '0',
              height: '0',
              borderLeft: '40px solid transparent',
              borderRight: '40px solid transparent',
              borderBottom: '120px solid rgba(0, 80, 40, 0.6)',
              filter: 'blur(1px)',
              transform: `scale(${0.9 + Math.random() * 0.2})`
            }}
          />
        ))}
        
        {/* Near trees */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`near-tree-${i}`}
            style={{
              position: 'absolute',
              bottom: 0,
              left: `${i * 13 - 3}%`,
              width: '0',
              height: '0',
              borderLeft: '50px solid transparent',
              borderRight: '50px solid transparent',
              borderBottom: '160px solid rgba(0, 100, 50, 0.8)',
              transform: `scale(${0.95 + Math.random() * 0.1})`
            }}
          >
            {/* Tree trunk */}
            <div style={{
              position: 'absolute',
              bottom: '-160px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '20px',
              height: '40px',
              background: 'rgba(60, 40, 20, 0.8)',
              borderRadius: '2px'
            }} />
          </div>
        ))}
      </div>

      {/* Fog effect */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(150, 150, 150, 0.2) 100%)',
        filter: 'blur(20px)'
      }} />

      {/* Rain Effect */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none'
      }}>
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={`rain-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '-10px',
              width: '2px',
              height: `${15 + Math.random() * 15}px`,
              background: 'linear-gradient(180deg, transparent 0%, rgba(200, 200, 255, 0.6) 50%, transparent 100%)',
              animation: `rainfall ${0.5 + Math.random() * 0.5}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* Lightning occasional flash */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(200, 200, 255, 0.0)',
        animation: 'lightning 15s infinite',
        pointerEvents: 'none'
      }} />

      <style jsx>{`
        @keyframes rainfall {
          0% {
            transform: translateY(-100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) translateX(20px);
            opacity: 0;
          }
        }
        
        @keyframes lightning {
          0%, 95%, 97%, 99%, 100% { 
            background: rgba(200, 200, 255, 0.0); 
          }
          96%, 98% { 
            background: rgba(200, 200, 255, 0.1); 
          }
        }
      `}</style>
    </div>
  )
}