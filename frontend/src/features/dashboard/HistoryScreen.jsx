import React from 'react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../../components/GlassCard';

const HistoryScreen = ({ onBack, onViewReport }) => {
  const { history, clearHistory, theme } = useApp();
  const isDark = theme === 'dark';

  const formatFullDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <header style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          <span>Kembali</span>
        </button>
        
        <h2 style={styles.title}>Semua Riwayat Analisis</h2>

        {history.length > 0 ? (
          <button onClick={clearHistory} style={styles.clearBtn}>
            HAPUS SEMUA
          </button>
        ) : (
          <div style={{ width: '80px' }} />
        )}
      </header>

      <div style={styles.list}>
        {history.length === 0 ? (
          <div style={styles.emptyContainer} className="glass-container">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ opacity: 0.5 }}>
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <h3 style={styles.emptyTitle}>Riwayat Kosong</h3>
            <p style={styles.emptyDesc}>Tidak ada riwayat analisis forensik yang tersimpan saat ini.</p>
          </div>
        ) : (
          history.map((item) => {
            const statusColor = item.isAuthentic
              ? (isDark ? '#4EDEA3' : '#00A572')
              : 'red';
            const cardBorder = item.isAuthentic
              ? 'rgba(78, 222, 163, 0.15)'
              : 'rgba(255, 0, 0, 0.15)';

            return (
              <GlassCard 
                key={item.id} 
                padding="16px 20px" 
                borderColor={cardBorder}
                onClick={() => onViewReport(item)}
                style={styles.card}
              >
                <div style={styles.cardMain}>
                  <div style={{ ...styles.iconBox, background: `${statusColor}1A`, border: `1px solid ${statusColor}33` }}>
                    {item.isAuthentic ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={statusColor} strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={statusColor} strokeWidth="2.5">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    )}
                  </div>
                  <div style={styles.cardDetails}>
                    <span style={styles.fileName}>{item.fileName}</span>
                    <span style={styles.fileMeta}>
                      {item.fileFormat} • {item.fileSize} • {item.fileDuration} • {item.aiModel}
                    </span>
                    <span style={styles.date}>{formatFullDate(item.analyzedAt)}</span>
                  </div>
                </div>
                <div style={{ ...styles.badge, color: statusColor, background: `${statusColor}1A`, borderColor: `${statusColor}4D` }}>
                  {item.isAuthentic ? 'AUTENTIK' : 'DEEPFAKE'}
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '820px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '1.25rem',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#FF6B6B',
    fontFamily: 'var(--font-label)',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    cursor: 'pointer',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyContainer: {
    padding: '48px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    background: 'rgba(23, 31, 51, 0.2)',
  },
  emptyTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginTop: '16px',
    marginBottom: '4px',
  },
  emptyDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  card: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    minWidth: 0,
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
  },
  fileName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  fileMeta: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  date: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    opacity: 0.8,
  },
  badge: {
    fontSize: '0.65rem',
    fontWeight: '800',
    fontFamily: 'var(--font-label)',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid currentColor',
    flexShrink: 0,
    letterSpacing: '0.05em',
  },
};

export default HistoryScreen;
