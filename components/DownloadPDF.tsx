import { useCallback } from 'react';

export function DownloadPDF() {
  const handleDownload = useCallback(() => {
    window.print();
  }, []);

  return (
    <button
      onClick={handleDownload}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: 600,
        color: '#2D4C4C',
        background: 'rgba(45,76,76,0.06)',
        border: '1px solid rgba(45,76,76,0.1)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(45,76,76,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(45,76,76,0.06)';
      }}
      title="Download this page as PDF"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download PDF
    </button>
  );
}
