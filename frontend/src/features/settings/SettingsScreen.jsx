import React from 'react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../../components/GlassCard';

const SettingsScreen = () => {
  const { user, sensitivity, setSensitivity, logout, theme } = useApp();
  const isDark = theme === 'dark';

  const handleSensitivityChange = (e) => {
    setSensitivity(parseFloat(e.target.value));
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <GlassCard padding="24px" style={styles.profileCard}>
        <div style={styles.profileWrapper}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={styles.editBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/>
              </svg>
            </div>
          </div>
          
          <div style={styles.profileInfo}>
            <h3 style={styles.profileName}>{user.name}</h3>
            <span style={styles.profileId}>ID Investigator: {user.id}</span>
            <span style={styles.profileEmail}>{user.email || 'investigator@deepguard.ai'}</span>
          </div>
        </div>
      </GlassCard>

      <div style={styles.settingsGrid} className="settings-layout">
        <div style={styles.gridItem}>
          <GlassCard padding="20px" style={styles.card}>
            <div style={styles.cardHeader}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"/>
                <line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/>
                <line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="2" y1="14" x2="6" y2="14"/>
                <line x1="10" y1="8" x2="14" y2="8"/>
                <line x1="18" y1="16" x2="22" y2="16"/>
              </svg>
              <h4 style={styles.cardTitle}>Ambang Batas Sensitivitas AI</h4>
            </div>
            
            <p style={styles.cardDesc}>
              Tentukan batas toleransi klasifikasi sintetis. File dengan nilai di atas batas ini akan dicurigai sebagai manipulasi AI.
            </p>

            <div style={styles.sliderContainer}>
              <div style={styles.sliderMeta}>
                <span style={styles.sliderVal}>{Math.round(sensitivity * 100)}%</span>
                <span style={styles.sliderLabel}>AI SENSITIVITY</span>
              </div>
              <input 
                type="range" 
                min="0.50" 
                max="0.99" 
                step="0.01" 
                value={sensitivity} 
                onChange={handleSensitivityChange}
                style={styles.slider}
              />
              <div style={styles.sliderTicks}>
                <span>Cepat (50%)</span>
                <span>Ketat (99%)</span>
              </div>
            </div>
          </GlassCard>
        </div>

        <div style={styles.gridItem}>
          <GlassCard padding="20px" style={styles.card}>
            <div style={styles.cardHeader}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <h4 style={styles.cardTitle}>Otorisasi Akses</h4>
            </div>

            <p style={styles.cardDesc}>
              Data sesi investigasi Anda diamankan secara lokal di peramban (browser) menggunakan standar enkripsi sandboxed.
            </p>

            <div style={styles.securityBox}>
              <div style={styles.securityLine}>
                <span style={styles.secLabel}>Status Lisensi</span>
                <span style={{ ...styles.secValue, color: 'var(--secondary)' }}>AKTIF / FORENSIK</span>
              </div>
              <div style={styles.securityLine}>
                <span style={styles.secLabel}>Koneksi API</span>
                <span style={styles.secValue}>Offline Fallback Enabled</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard padding="20px" style={styles.aboutCard}>
        <h4 style={styles.aboutTitle}>Tentang DeepGuard AI Web</h4>
        <p style={styles.aboutDesc}>
          DeepGuard AI adalah platform forensik audio digital untuk memverifikasi keaslian suara. Dikembangkan sebagai bagian dari riset deteksi manipulasi vokal elektro-mekanis (re-recording).
        </p>
        <div style={styles.aboutMetaRow}>
          <span>Versi Aplikasi: <strong>v1.2.0-stable</strong></span>
          <span>Mesin Analisis: <strong>KNN v1.0.4-onnx</strong></span>
        </div>
      </GlassCard>

      <button onClick={logout} style={styles.logoutBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        <span>KELUAR DARI INVESTIGASI</span>
      </button>

      <style>{`
        .settings-layout {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        .settings-layout > div {
          flex: 1;
        }
        @media (max-width: 650px) {
          .settings-layout {
            flex-direction: column;
          }
          .settings-layout > div {
            width: 100% !important;
            flex: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '680px',
    margin: '0 auto',
  },
  profileCard: {
    marginBottom: '24px',
    background: 'var(--card-bg)',
  },
  profileWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  avatarContainer: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'var(--primary-glow)',
    border: '2px solid var(--border)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: 'var(--bg)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: '2px solid var(--bg)',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  profileName: {
    fontSize: '1.25rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
  },
  profileId: {
    fontSize: '0.85rem',
    color: 'var(--text)',
    opacity: 0.8,
  },
  profileEmail: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  settingsGrid: {
    width: '100%',
  },
  gridItem: {
    display: 'flex',
  },
  card: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    color: 'var(--primary)',
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    color: 'var(--text)',
  },
  cardDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    marginBottom: '16px',
  },
  sliderContainer: {
    marginTop: 'auto',
    width: '100%',
  },
  sliderMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '6px',
  },
  sliderVal: {
    fontSize: '1.4rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    color: 'var(--primary)',
  },
  sliderLabel: {
    fontSize: '0.65rem',
    fontFamily: 'var(--font-label)',
    fontWeight: '700',
    color: 'var(--text-muted)',
  },
  slider: {
    width: '100%',
    WebkitAppearance: 'none',
    height: '6px',
    borderRadius: '3px',
    background: 'var(--card-highest)',
    outline: 'none',
    cursor: 'pointer',
  },
  sliderTicks: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    marginTop: '6px',
  },
  securityBox: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    background: 'rgba(0,0,0,0.15)',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  securityLine: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
  },
  secLabel: {
    color: 'var(--text-muted)',
  },
  secValue: {
    fontWeight: '600',
  },
  aboutCard: {
    width: '100%',
    background: 'var(--card-bg)',
    marginBottom: '24px',
  },
  aboutTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    marginBottom: '8px',
  },
  aboutDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: '1.45',
    marginBottom: '14px',
  },
  aboutMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border)',
    paddingTop: '10px',
  },
  logoutBtn: {
    width: '100%',
    padding: '14px 0',
    background: 'rgba(255, 77, 77, 0.1)',
    color: '#FF6B6B',
    border: '1px solid rgba(255, 77, 77, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '700',
    fontFamily: 'var(--font-label)',
    letterSpacing: '0.05em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
};

export default SettingsScreen;
