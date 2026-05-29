import { ImageResponse } from 'next/og';

export const alt = 'TechIndica — Melhores produtos de tecnologia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 88px',
          position: 'relative',
        }}
      >
        {/* Accent circle */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: 60,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              background: '#2563eb',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#fff', fontSize: 28, fontWeight: 800, fontFamily: 'sans-serif' }}>T</span>
          </div>
          <span
            style={{
              fontFamily: 'sans-serif',
              fontWeight: 700,
              fontSize: 32,
              color: '#fff',
              letterSpacing: -1,
            }}
          >
            Tech<span style={{ color: '#60a5fa' }}>Indica</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontWeight: 700,
            fontSize: 72,
            color: '#f8fafc',
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 860,
          }}
        >
          Melhores produtos de tecnologia
        </div>

        {/* Subtext */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: 28,
            color: '#94a3b8',
            marginTop: 24,
            lineHeight: 1.4,
          }}
        >
          Smartwatches, fones, notebooks e mais — com curadoria técnica honesta.
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 48,
          }}
        >
          {['Shopee', 'Mercado Livre', 'IA curadoria', 'Análise técnica'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 99,
                padding: '8px 18px',
                fontFamily: 'sans-serif',
                fontSize: 18,
                color: '#94a3b8',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
