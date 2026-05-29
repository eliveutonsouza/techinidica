import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#2563eb',
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: 100,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            letterSpacing: -4,
          }}
        >
          T
        </span>
      </div>
    ),
    { ...size },
  );
}
