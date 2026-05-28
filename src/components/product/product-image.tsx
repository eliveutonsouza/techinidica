import { GRADIENTS } from '@/components/ui/styles';

export function ProductImage({
  categoria,
  imagemUrl,
  height = 200,
  rounded = 10,
}: {
  categoria: string | null;
  imagemUrl?: string | null;
  height?: number;
  rounded?: number;
}) {
  if (imagemUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imagemUrl}
        alt=""
        style={{
          width: '100%',
          height,
          objectFit: 'cover',
          borderRadius: rounded,
          display: 'block',
        }}
      />
    );
  }
  const [from, to] = GRADIENTS[categoria ?? 'fones'] ?? GRADIENTS.fones;
  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius: rounded,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.4)',
        fontFamily: 'Sora, system-ui, sans-serif',
        fontWeight: 700,
        fontSize: Math.max(14, height / 6),
      }}
    >
      {(categoria ?? 'tech').slice(0, 2).toUpperCase()}
    </div>
  );
}
