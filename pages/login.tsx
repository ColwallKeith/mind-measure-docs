import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const ACCENT = '#204C4C';
const API_BASE = 'https://admin.mindmeasure.co.uk';
const REQUIRED_PERMISSION = 'docs_platform_access';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [challengeToken, setChallengeToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const codeInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'code') {
      setTimeout(() => codeInputs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-access-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send code');
        return;
      }
      setChallengeToken(data.challengeToken);
      setSuccess(`Code sent to ${email}`);
      setStep('code');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = useCallback(async (codeToVerify?: string[]) => {
    const digits = codeToVerify || code;
    const fullCode = digits.join('');
    if (fullCode.length !== 6) return;
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-access-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: fullCode, challengeToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed');
        setCode(['', '', '', '', '', '']);
        setTimeout(() => codeInputs.current[0]?.focus(), 100);
        return;
      }

      const permissions: string[] = data.permissions || [];
      if (!permissions.includes('super_admin') && !permissions.includes(REQUIRED_PERMISSION)) {
        setError('You do not have access to documentation. Please contact your administrator.');
        setCode(['', '', '', '', '', '']);
        return;
      }

      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: data.token }),
      });

      const from = (router.query.from as string) || '/';
      router.push(from);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [code, email, challengeToken, router]);

  const handleCodeInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError('');
    if (digit && index < 5) codeInputs.current[index + 1]?.focus();
    if (digit && index === 5 && newCode.every((d) => d !== '')) {
      setTimeout(() => handleVerifyCode(newCode), 150);
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) codeInputs.current[index - 1]?.focus();
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split('');
      setCode(newCode);
      codeInputs.current[5]?.focus();
      setTimeout(() => handleVerifyCode(newCode), 150);
    }
  };

  const resendCode = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-access-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setChallengeToken(data.challengeToken);
        setSuccess('New code sent!');
        setCode(['', '', '', '', '', '']);
        setTimeout(() => codeInputs.current[0]?.focus(), 100);
      } else {
        setError(data.error || 'Failed to resend code');
      }
    } catch {
      setError('Network error');
    }
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Login — Mind Measure Documentation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </Head>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          position: 'relative',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <img
          src="/images/login-bg-oxford.jpg"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Left branding panel */}
        <div
          style={{
            flex: '1 1 55%',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '3.5rem',
            color: 'white',
          }}
          className="branding-panel"
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.30)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: 16,
              padding: '2.5rem',
              maxWidth: 520,
            }}
          >
            <img src="/images/mm-logo-white.png" alt="Mind Measure" style={{ height: 40, marginBottom: '1.5rem' }} />
            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em',
              }}
            >
              Documentation
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, opacity: 0.85 }}>
              Technical documentation, architecture guides, and operational playbooks for the Mind Measure platform.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: 0.7,
                fontSize: '0.75rem',
                marginTop: '1.25rem',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Passwordless authentication &mdash; secure code sent to your email</span>
            </div>
          </div>
        </div>

        {/* Right login card */}
        <div
          style={{
            flex: '1 1 45%',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 420,
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 16,
              padding: '2.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: ACCENT, textAlign: 'center', marginBottom: 4 }}>
              Documentation Portal
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center', marginBottom: '1.75rem' }}>
              {step === 'email'
                ? 'Enter your email to receive a login code'
                : `Enter the 6-digit code sent to ${email}`}
            </p>

            {step === 'email' ? (
              <form onSubmit={handleSendCode}>
                <label
                  style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}
                >
                  Email Address
                </label>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: 10,
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                  />
                </div>

                {error && (
                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 10,
                      color: '#b91c1c',
                      fontSize: '0.8rem',
                      marginBottom: 16,
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    background: ACCENT,
                    color: 'white',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: isLoading ? 'wait' : 'pointer',
                    opacity: isLoading || !email.trim() ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Sending code...
                    </>
                  ) : (
                    <>
                      Send Login Code
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div>
                {success && (
                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: 10,
                      color: '#166534',
                      fontSize: '0.8rem',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="m9 11 3 3L22 4" />
                    </svg>
                    {success}
                  </div>
                )}

                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', textAlign: 'center', marginBottom: 12 }}>
                  Enter your 6-digit code
                </p>
                <div
                  style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}
                  onPaste={handleCodePaste}
                >
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { codeInputs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeInput(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      style={{
                        width: 48,
                        height: 56,
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        border: `2px solid ${digit ? ACCENT : '#e2e8f0'}`,
                        borderRadius: 10,
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = digit ? ACCENT : '#e2e8f0')}
                    />
                  ))}
                </div>

                {error && (
                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 10,
                      color: '#b91c1c',
                      fontSize: '0.8rem',
                      marginBottom: 16,
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  onClick={() => handleVerifyCode()}
                  disabled={isLoading || code.join('').length !== 6}
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    background: ACCENT,
                    color: 'white',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: isLoading ? 'wait' : 'pointer',
                    opacity: isLoading || code.join('').length !== 6 ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'opacity 0.2s',
                    marginBottom: 16,
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Verify &amp; Enter
                    </>
                  )}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setCode(['', '', '', '', '', '']); setError(''); setSuccess(''); }}
                    style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5m7-7-7 7 7 7" />
                    </svg>
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={resendCode}
                    style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: ACCENT, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Resend code
                  </button>
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #f1f5f9',
                textAlign: 'center',
                fontSize: '0.7rem',
                color: '#94a3b8',
              }}
            >
              &copy; {new Date().getFullYear()} Mind Measure. All access attempts are logged and monitored.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .branding-panel {
          display: none;
        }
        @media (min-width: 1024px) {
          .branding-panel {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

LoginPage.getLayout = (page: React.ReactNode) => page;
