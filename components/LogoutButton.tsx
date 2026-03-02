import { useCallback } from 'react';

export function LogoutButton() {
  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    document.cookie = 'mm_auth=; Path=/; Max-Age=0';
    window.location.href = '/login';
  }, []);

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#64748b',
        background: 'transparent',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#cbd5e1';
        e.currentTarget.style.color = '#334155';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.color = '#64748b';
      }}
      title="Sign out"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Sign out
    </button>
  );
}
