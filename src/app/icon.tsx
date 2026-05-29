import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#2563eb',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            letterSpacing: -1,
          }}
        >
          T
        </span>
      </div>
    ),
    { ...size },
  );
}
