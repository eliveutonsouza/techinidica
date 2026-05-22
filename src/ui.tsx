import React from 'react';
// UI primitives: Badge, Tooltip, Modal, Toast (Sonner-style), Icon, ProductImage
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

// =============================================================================
// ICON — minimal Lucide-style line icons used throughout
// =============================================================================
function Icon({ name, size = 20, strokeWidth = 2, className = '', style = {} }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    className, style,
  };
  const paths = {
    watch:       <><circle cx="12" cy="12" r="6"/><polyline points="12,10 12,12 13,13"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></>,
    headphones:  <><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></>,
    laptop:      <><path d="M2 20h20"/><rect x="3" y="4" width="18" height="14" rx="2"/></>,
    monitor:     <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    tablet:      <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    smartphone:  <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    search:      <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    star:        <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    check:       <><polyline points="20 6 9 17 4 12"/></>,
    x:           <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    chevronRight:<><polyline points="9 18 15 12 9 6"/></>,
    chevronLeft: <><polyline points="15 18 9 12 15 6"/></>,
    chevronDown: <><polyline points="6 9 12 15 18 9"/></>,
    arrowRight:  <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    externalLink:<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    info:        <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    alert:       <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    refresh:     <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    settings:    <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    layoutGrid:  <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    package:     <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    zap:         <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    activity:    <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    eye:         <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff:      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    trash:       <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    edit:        <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    plus:        <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    filter:      <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    sparkles:    <><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14zM5 14l.75 2.25L8 17l-2.25.75L5 20l-.75-2.25L2 17l2.25-.75L5 14z"/></>,
    home:        <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    sun:         <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    play:        <><polygon points="5 3 19 12 5 21 5 3"/></>,
    lock:        <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    logout:      <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    menu:        <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    instagram:   <><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
    twitter:     <><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></>,
    youtube:     <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></>,
    download:    <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    barChart:    <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
    clock:       <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    fileText:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    key:         <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></>,
  };
  return <svg {...common}>{paths[name] || paths.info}</svg>;
}

// =============================================================================
// BADGE
// =============================================================================
function Badge({ kind = 'best', children, size = 'md', style = {} }) {
  const b = window.BADGES[kind] || { bg: '#e5e7eb', fg: '#374151', label: 'Badge' };
  const sizes = { sm: { fontSize: 10, padding: '3px 8px' }, md: { fontSize: 11, padding: '5px 10px' }, lg: { fontSize: 13, padding: '7px 14px' } };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: b.bg, color: b.fg,
      borderRadius: 99, fontWeight: 600, letterSpacing: 0.1,
      textTransform: 'uppercase', fontFamily: 'DM Sans, system-ui',
      whiteSpace: 'nowrap',
      ...sizes[size], ...style,
    }}>
      {children || b.label}
    </span>
  );
}

// =============================================================================
// TOOLTIP
// =============================================================================
function Tooltip({ children, content, side = 'top' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const placements = {
    top:    { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    left:   { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
    right:  { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
  };
  const arrow = {
    top:    { bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    bottom: { top: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    left:   { right: -4, top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    right:  { left: -4, top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
  };
  return (
    <span ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
      style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      {open && (
        <span style={{
          position: 'absolute', zIndex: 9999,
          background: '#0f172a', color: '#fff', fontSize: 12, fontFamily: 'DM Sans, system-ui',
          padding: '6px 10px', borderRadius: 6, whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          ...placements[side],
        }}>
          {content}
          <span style={{ position: 'absolute', width: 8, height: 8, background: '#0f172a', ...arrow[side] }} />
        </span>
      )}
    </span>
  );
}

// =============================================================================
// MODAL
// =============================================================================
function Modal({ open, onClose, title, children, footer, width = 480 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(2px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      animation: 'fadeIn 0.15s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: width,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        animation: 'slideUp 0.2s ease',
      }}>
        {title && (
          <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 18, color: '#0f172a' }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#64748b', display: 'flex' }}>
              <Icon name="x" size={20} />
            </button>
          </div>
        )}
        <div style={{ padding: '16px 24px 20px', fontFamily: 'DM Sans, system-ui', fontSize: 14, color: '#334155', lineHeight: 1.55 }}>
          {children}
        </div>
        {footer && (
          <div style={{ padding: '12px 24px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #f1f5f9' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// TOAST / SONNER
// =============================================================================
const ToastContext = createContext({ toast: () => {} });
let _toastIdCounter = 0;
function useToast() { return useContext(ToastContext); }

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback((opts) => {
    const id = ++_toastIdCounter;
    const t = { id, kind: 'info', duration: 4000, ...opts };
    setToasts((cur) => [...cur, t]);
    if (t.duration > 0) setTimeout(() => remove(id), t.duration);
    return id;
  }, [remove]);
  toast.success = (msg, opts = {}) => toast({ kind: 'success', message: msg, ...opts });
  toast.error   = (msg, opts = {}) => toast({ kind: 'error', message: msg, ...opts });
  toast.info    = (msg, opts = {}) => toast({ kind: 'info', message: msg, ...opts });
  toast.loading = (msg, opts = {}) => toast({ kind: 'loading', message: msg, duration: 0, ...opts });
  toast.dismiss = remove;

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 5000,
        display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        {toasts.map((t) => <ToastCard key={t.id} t={t} onClose={() => remove(t.id)} />)}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ t, onClose }) {
  const styles = {
    success: { bg: '#fff', border: '#86efac', icon: 'check', iconBg: '#16a34a', iconFg: '#fff' },
    error:   { bg: '#fff', border: '#fca5a5', icon: 'alert', iconBg: '#dc2626', iconFg: '#fff' },
    info:    { bg: '#fff', border: '#bfdbfe', icon: 'info', iconBg: '#2563eb', iconFg: '#fff' },
    loading: { bg: '#fff', border: '#e2e8f0', icon: 'refresh', iconBg: '#64748b', iconFg: '#fff' },
  };
  const s = styles[t.kind];
  return (
    <div style={{
      pointerEvents: 'auto',
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12,
      padding: '12px 14px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 280, maxWidth: 400,
      fontFamily: 'DM Sans, system-ui', fontSize: 14, color: '#0f172a',
      animation: 'slideInRight 0.25s ease',
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%',
        background: s.iconBg, color: s.iconFg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        animation: t.kind === 'loading' ? 'spin 1s linear infinite' : 'none',
      }}>
        <Icon name={s.icon} size={14} strokeWidth={3} />
      </span>
      <div style={{ flex: 1 }}>
        {t.title && <div style={{ fontWeight: 600, marginBottom: 2 }}>{t.title}</div>}
        <div>{t.message}</div>
        {t.description && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{t.description}</div>}
      </div>
      {t.duration > 0 && (
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'flex-start' }}>
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}

// =============================================================================
// PRODUCT IMAGE PLACEHOLDER
// =============================================================================
function ProductImage({ produto, height = 200, big = false, rounded = 12 }) {
  const gradKey = produto?.categoria || 'smartwatches';
  const grad = window.GRADIENTS[gradKey] || window.GRADIENTS.smartwatches;
  const seed = produto?.id || 0;
  // Simple "product silhouette" SVG, varies based on category
  const cat = produto?.categoria;
  const Shape = () => {
    if (cat === 'smartwatches') return (
      <g>
        <rect x="35%" y="20%" width="30%" height="60%" rx="14" fill="rgba(15,23,42,0.85)" />
        <rect x="38%" y="25%" width="24%" height="50%" rx="6" fill={grad[0]} opacity="0.9" />
        <rect x="42%" y="42%" width="16%" height="3%" fill="rgba(15,23,42,0.4)" />
        <rect x="42%" y="50%" width="12%" height="2%" fill="rgba(15,23,42,0.3)" />
      </g>
    );
    if (cat === 'fones') return (
      <g>
        <path d="M 30% 50% Q 30% 25% 50% 25% Q 70% 25% 70% 50%" stroke="rgba(15,23,42,0.85)" strokeWidth="6" fill="none" />
        <rect x="25%" y="48%" width="14%" height="28%" rx="6" fill="rgba(15,23,42,0.85)" />
        <rect x="61%" y="48%" width="14%" height="28%" rx="6" fill="rgba(15,23,42,0.85)" />
      </g>
    );
    if (cat === 'notebooks') return (
      <g>
        <rect x="18%" y="28%" width="64%" height="38%" rx="4" fill="rgba(15,23,42,0.85)" />
        <rect x="21%" y="31%" width="58%" height="32%" rx="2" fill={grad[0]} opacity="0.9" />
        <rect x="14%" y="64%" width="72%" height="6%" rx="2" fill="rgba(15,23,42,0.85)" />
      </g>
    );
    if (cat === 'monitores') return (
      <g>
        <rect x="14%" y="18%" width="72%" height="48%" rx="4" fill="rgba(15,23,42,0.85)" />
        <rect x="17%" y="21%" width="66%" height="42%" rx="2" fill={grad[0]} opacity="0.9" />
        <rect x="46%" y="66%" width="8%" height="10%" fill="rgba(15,23,42,0.85)" />
        <rect x="38%" y="76%" width="24%" height="3%" rx="1" fill="rgba(15,23,42,0.85)" />
      </g>
    );
    if (cat === 'tablets') return (
      <g>
        <rect x="28%" y="14%" width="44%" height="72%" rx="6" fill="rgba(15,23,42,0.85)" />
        <rect x="31%" y="18%" width="38%" height="64%" rx="2" fill={grad[0]} opacity="0.9" />
      </g>
    );
    if (cat === 'smartphones') return (
      <g>
        <rect x="36%" y="14%" width="28%" height="72%" rx="6" fill="rgba(15,23,42,0.85)" />
        <rect x="38%" y="18%" width="24%" height="64%" rx="3" fill={grad[0]} opacity="0.9" />
      </g>
    );
    return null;
  };
  return (
    <div style={{
      width: '100%', height,
      background: `linear-gradient(135deg, ${grad[0]} 0%, ${grad[1]} 60%, ${grad[2]} 100%)`,
      borderRadius: rounded, position: 'relative', overflow: 'hidden',
    }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
        <Shape />
      </svg>
      {big && (
        <div style={{
          position: 'absolute', bottom: 8, right: 10,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.7)',
          letterSpacing: 0.2,
        }}>
          product photo · shopee CDN
        </div>
      )}
    </div>
  );
}

// =============================================================================
// BUY BUTTONS
// =============================================================================
function BuyButtons({ link_shopee, link_mercadolivre, size = 'md', stacked = false, onClick }) {
  const sizes = {
    sm: { padding: '8px 12px', fontSize: 13, gap: 6 },
    md: { padding: '11px 16px', fontSize: 14, gap: 8 },
    lg: { padding: '14px 20px', fontSize: 15, gap: 10 },
  };
  const s = sizes[size];
  const btn = (kind) => {
    const isShopee = kind === 'shopee';
    const link = isShopee ? link_shopee : link_mercadolivre;
    const disabled = !link;
    const styles = isShopee
      ? { background: disabled ? '#fde0d0' : '#f05d23', color: '#fff' }
      : { background: disabled ? '#fef9c3' : '#fff159', color: '#333', border: '1px solid rgba(0,0,0,0.06)' };
    const inner = (
      <button
        disabled={disabled}
        onClick={(e) => { e.stopPropagation(); onClick?.(kind); }}
        style={{
          ...styles, ...s,
          border: styles.border || 'none', borderRadius: 8, fontWeight: 600,
          fontFamily: 'DM Sans, system-ui', cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
          flex: stacked ? 'none' : 1, width: stacked ? '100%' : 'auto',
          opacity: disabled ? 0.7 : 1, transition: 'transform 0.1s, filter 0.1s',
        }}
        onMouseEnter={(e) => !disabled && (e.currentTarget.style.filter = 'brightness(0.95)')}
        onMouseLeave={(e) => !disabled && (e.currentTarget.style.filter = 'brightness(1)')}
      >
        Ver na {isShopee ? 'Shopee' : 'Mercado Livre'}
        {!disabled && <Icon name="externalLink" size={s.fontSize - 1} />}
      </button>
    );
    return disabled
      ? <Tooltip content="Em breve">{inner}</Tooltip>
      : inner;
  };
  return (
    <div style={{ display: 'flex', gap: 8, flexDirection: stacked ? 'column' : 'row', width: '100%' }}>
      {btn('shopee')}
      {btn('ml')}
    </div>
  );
}

// =============================================================================
// PRODUCT CARD
// =============================================================================
function ProductCard({ produto, posicao, showSpecs = false, compact = false }) {
  const onCardClick = () => window.navigate(`/produto/${produto.id}`);
  const onBuyClick = (kind) => {
    // toast handled outside
    window.dispatchEvent(new CustomEvent('product:click', { detail: { kind, produto } }));
  };
  return (
    <article
      onClick={onCardClick}
      style={{
        background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.06)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
    >
      <div style={{ position: 'relative' }}>
        <ProductImage produto={produto} height={compact ? 170 : 200} rounded={0} />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
          {posicao != null && (
            <span style={{
              background: '#0f172a', color: '#fff', padding: '4px 10px', borderRadius: 99,
              fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 12,
            }}>#{posicao}</span>
          )}
          {produto.badge && <Badge kind={produto.badge} size="sm" />}
        </div>
        {produto.desconto_pct >= 15 && (
          <span style={{
            position: 'absolute', top: 12, right: 12,
            background: '#16a34a', color: '#fff', padding: '4px 10px', borderRadius: 99,
            fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 12,
          }}>−{produto.desconto_pct}%</span>
        )}
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Category + sales pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, color: '#475569' }}>
            {window.CATEGORIES.find((c) => c.slug === produto.categoria)?.nome}
          </span>
          {produto.sales > 0 && <span>{produto.sales.toLocaleString('pt-BR')} vendidos</span>}
        </div>

        {/* Title */}
        <h3 style={{
          margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 16,
          color: '#0f172a', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: '2.7em',
        }}>
          {produto.nome}
        </h3>

        {/* Nota + short desc */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: '#fef9c3', color: '#854d0e', padding: '3px 8px', borderRadius: 6,
            fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 13,
          }}>
            <Icon name="star" size={13} strokeWidth={0} style={{ fill: '#eab308' }} />
            {produto.nota?.toFixed(1)}
          </span>
          <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b' }}>/ 10</span>
        </div>

        <p style={{
          margin: 0, fontFamily: 'DM Sans, system-ui', fontSize: 13.5, color: '#475569', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {produto.descricao_curta}
        </p>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 'auto', paddingTop: 4 }}>
          {produto.preco_original > produto.preco_atual && (
            <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#94a3b8', textDecoration: 'line-through' }}>
              R$ {produto.preco_original.toFixed(2).replace('.', ',')}
            </span>
          )}
          <span style={{ fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 22, color: '#2563eb' }}>
            R$ {produto.preco_atual.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {!compact && (
          <div style={{ marginTop: 4 }}>
            <BuyButtons link_shopee={produto.link_shopee} link_mercadolivre={produto.link_mercadolivre} size="sm" onClick={onBuyClick} />
          </div>
        )}

        <a onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.navigate(`/produto/${produto.id}`); }}
          href={`#/produto/${produto.id}`}
          style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          Ver análise completa <Icon name="arrowRight" size={13} />
        </a>
      </div>
    </article>
  );
}

// =============================================================================
// AFFILIATE DISCLOSURE
// =============================================================================
function AffiliateDisclosure({ compact = false }) {
  return (
    <div style={{
      background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10,
      padding: compact ? '10px 14px' : '14px 18px',
      display: 'flex', alignItems: 'flex-start', gap: 10,
      fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#475569', lineHeight: 1.55,
    }}>
      <Icon name="info" size={16} style={{ color: '#64748b', flexShrink: 0, marginTop: 1 }} />
      <span>
        Este site contém <strong>links de afiliado</strong>. Ao comprar por eles, recebemos uma pequena comissão sem custo adicional pra você.
        Nossas recomendações são baseadas em análise técnica independente de acordos comerciais.
      </span>
    </div>
  );
}

Object.assign(window, {
  Icon, Badge, Tooltip, Modal, ToastProvider, useToast,
  ProductImage, BuyButtons, ProductCard, AffiliateDisclosure,
});
