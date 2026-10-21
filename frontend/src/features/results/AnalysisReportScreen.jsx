import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../../components/GlassCard';

const AnalysisReportScreen = ({ 
  fileName, 
  fileFormat, 
  fileSize, 
  fileDuration, 
  aiModel, 
  isAuthentic, 
  score, 
  onBackToDashboard 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [gaugeProgress, setGaugeProgress] = useState(0);
  
  const timerRef = useRef(null);
  const totalSecondsRef = useRef(165);

  const waveformHeights = [
    20, 40, 35, 50, 60, 40, 30, 50, 70, 80, 65, 40,
    30, 50, 60, 45, 55, 70, 60, 40, 30, 50,
    85, 95, 90, 80, 75, 85, 90, 80, 70, 85, 95,
    50, 40, 30, 45, 60, 50, 35, 40, 50, 65, 70, 55,
    40, 30, 45, 50, 30, 25, 40, 50, 40, 30, 20, 15
  ];

  useEffect(() => {
    try {
      const parts = fileDuration.split(':');
      if (parts.length === 2) {
        totalSecondsRef.current = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      }
    } catch (e) {
      totalSecondsRef.current = 165;
    }
  }, [fileDuration]);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 0.02;
      if (current >= score) {
        setGaugeProgress(score);
        clearInterval(interval);
      } else {
        setGaugeProgress(current);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [score]);

  const togglePlayback = () => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        setCurrentSeconds(prev => {
          if (prev < totalSecondsRef.current) {
            const nextSec = prev + 1;
            setPlayProgress(nextSec / totalSecondsRef.current);
            return nextSec;
          } else {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            setPlayProgress(0);
            return 0;
          }
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatSeconds = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownloadReport = () => {
    const statusText = isAuthentic ? 'ASLI / AUTENTIK' : 'PALSU / SUSPECTED DEEPFAKE';
    const reportText = `=====================================================
            LAPORAN FORENSIK AUDIO DEEPGUARD AI
=====================================================
Tanggal Analisis : ${new Date().toLocaleString('id-ID')}
Nama Berkas      : ${fileName}
Format Berkas    : ${fileFormat}
Ukuran Berkas    : ${fileSize}
Durasi Berkas    : ${fileDuration}
Mesin Detektor   : ${aiModel}
-----------------------------------------------------
HASIL ANALISIS   : ${statusText}
Skor Kepercayaan : ${(score * 100).toFixed(1)}%
-----------------------------------------------------
REKOMENDASI INVESTIGASI:
${
  isAuthentic
    ? '- Berkas audio berhasil lolos verifikasi orisinalitas.\n- Noise floor dan struktur jeda pernapasan vokal konsisten.\n- Tidak ditemukan tanda perekaman ulang (re-recording) elektronik.'
    : '- Ditemukan anomali vokal dan respon spektral tidak alami.\n- Kontur amplitudo vokal terpotong kasar atau terdapat jeda tidak wajar.\n- Direkomendasikan melakukan pengujian manual menggunakan spektrum Fourier.'
}
=====================================================
      DeepGuard AI Forensic Lab - Verifikasi Mandiri
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan_forensik_${fileName.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusColor = isAuthentic ? 'var(--secondary)' : '#FF4D4D';
  const statusText = isAuthentic ? 'AUTENTIK' : 'SUSPECTED DEEPFAKE';
  
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (gaugeProgress * circumference);

  return (
    <div style={styles.container} className="animate-fade-in">
      <header style={styles.header}>
        <button onClick={onBackToDashboard} style={styles.backBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          <span>Beranda</span>
        </button>
        <h2 style={styles.title}>Laporan Analisis Forensik</h2>
        <div style={{ width: '80px' }} />
      </header>

      <div style={styles.fileNameRow}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
          <path d="M9 12h6M9 16h6M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18l-4-4-4 4-4-4-4 4z"/>
        </svg>
        <span style={styles.fileNameText} title={fileName}>{fileName}</span>
      </div>

      <div style={styles.grid} className="report-grid">
        <div style={styles.playerColumn}>
          <GlassCard padding="24px" borderColor={`${statusColor}33`} style={styles.playerCard}>
            <div style={{ ...styles.statusBanner, background: `${statusColor}14`, color: statusColor, borderColor: `${statusColor}33` }}>
              <span style={styles.statusLabel}>KLASIFIKASI: {statusText}</span>
            </div>

            <div style={styles.gaugeSection}>
              <div style={styles.gaugeWrapper}>
                <svg width="140" height="140" viewBox="0 0 120 120" style={styles.gaugeSvg}>
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    fill="none" 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    fill="none" 
                    stroke={statusColor} 
                    strokeWidth="10" 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.1s ease' }}
                  />
                </svg>
                <div style={styles.scoreTextWrapper}>
                  <span style={styles.scoreNumber}>{Math.round(gaugeProgress * 100)}%</span>
                  <span style={styles.scoreLabel}>AKURASI</span>
                </div>
              </div>
              <span style={styles.gaugeCaption}>Skor Kepercayaan Forensik AI</span>
            </div>

            <div style={styles.waveformPlayer}>
              <div style={styles.waveGraphic}>
                {waveformHeights.map((height, idx) => {
                  const barProgress = idx / waveformHeights.length;
                  const isPlayed = playProgress > barProgress;
                  const isAnomaly = idx >= 22 && idx <= 34;

                  let barColor = 'rgba(255,255,255,0.15)';
                  if (isPlayed) {
                    barColor = isAnomaly ? '#FFA500' : 'var(--primary)';
                  } else if (isAnomaly) {
                    barColor = 'rgba(255, 165, 0, 0.3)';
                  }

                  return (
                    <div 
                      key={idx} 
                      style={{
                        ...styles.waveBar,
                        height: `${height}%`,
                        backgroundColor: barColor,
                      }}
                      title={isAnomaly ? 'Deteksi anomali aneh frekuensi' : ''}
                    />
                  );
                })}
              </div>

              <div style={styles.playerControls}>
                <button onClick={togglePlayback} style={{ ...styles.playBtn, background: statusColor }}>
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--bg)" stroke="var(--bg)" strokeWidth="2">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--bg)" stroke="var(--bg)" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  )}
                </button>
                <div style={styles.playerTimeline}>
                  <span style={styles.timeText}>{formatSeconds(currentSeconds)}</span>
                  <div style={styles.timelineTrack}>
                    <div style={{ ...styles.timelineProgress, width: `${playProgress * 100}%` }} />
                  </div>
                  <span style={styles.timeText}>{fileDuration}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div style={styles.infoColumn}>
          <GlassCard padding="20px" style={styles.infoCard}>
            <h4 style={styles.sectionTitle}>Spesifikasi Berkas</h4>
            <div style={styles.metaTable}>
              <div style={styles.tableRow}>
                <span style={styles.tableLabel}>Ukuran File</span>
                <span style={styles.tableValue}>{fileSize}</span>
              </div>
              <div style={styles.tableRow}>
                <span style={styles.tableLabel}>Format Audio</span>
                <span style={styles.tableValue}>{fileFormat}</span>
              </div>
              <div style={styles.tableRow}>
                <span style={styles.tableLabel}>Durasi</span>
                <span style={styles.tableValue}>{fileDuration}</span>
              </div>
              <div style={styles.tableRow}>
                <span style={styles.tableLabel}>Mesin Deteksi</span>
                <span style={styles.tableValue}>{aiModel}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard padding="20px" style={{ ...styles.infoCard, marginTop: '16px' }}>
            <h4 style={styles.sectionTitle}>Rekomendasi Investigasi</h4>
            <div style={styles.recommendationContent}>
              {isAuthentic ? (
                <>
                  <div style={styles.recIconBoxGreen}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <polyline points="9 11 11 13 15 9"/>
                    </svg>
                  </div>
                  <p style={styles.recommendationText}>
                    <strong>Autentik:</strong> Berkas audio menunjukkan ciri akustik alamiah. Struktur jeda pernapasan dan tingkat noise konsisten. Aman disimpan sebagai bukti digital orisinal.
                  </p>
                </>
              ) : (
                <>
                  <div style={styles.recIconBoxRed}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" strokeWidth="2.5">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                    </svg>
                  </div>
                  <p style={styles.recommendationText}>
                    <strong>Perhatian:</strong> Terdeteksi anomali pada spektrum frekuensi audio (perekaman ulang / re-recording). Disarankan melakukan pemeriksaan manual visual spectrogram untuk memverifikasi.
                  </p>
                </>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      <footer style={styles.footerActions}>
        <button onClick={onBackToDashboard} style={styles.homeBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span>Kembali Ke Beranda</span>
        </button>

        <button onClick={handleDownloadReport} className="btn-primary" style={styles.downloadBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 3v12"/>
          </svg>
          <span>UNDUH LAPORAN FORENSIK</span>
        </button>
      </footer>

      <style>{`
        .report-grid {
          display: flex;
          gap: 20px;
        }
        .report-grid > div:first-child {
          flex: 1.5;
        }
        .report-grid > div:last-child {
          flex: 1;
        }
        @media (max-width: 650px) {
          .report-grid {
            flex-direction: column;
          }
          .report-grid > div {
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
  fileNameRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '24px',
    color: 'var(--text-muted)',
    width: '100%',
  },
  fileNameText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    maxWidth: '280px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  grid: {
    width: '100%',
  },
  playerColumn: {
    display: 'flex',
  },
  playerCard: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  statusBanner: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    borderWidth: '1px',
    borderStyle: 'solid',
    textAlign: 'center',
  },
  statusLabel: {
    fontSize: '0.8rem',
    fontWeight: '800',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-label)',
  },
  gaugeSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  gaugeWrapper: {
    position: 'relative',
    width: '140px',
    height: '140px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scoreTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: '2.2rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    lineHeight: '1',
  },
  scoreLabel: {
    fontSize: '0.6rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-label)',
  },
  gaugeCaption: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  waveformPlayer: {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '16px',
    padding: '20px 16px',
    border: '1px solid rgba(255, 255, 255, 0.03)',
  },
  waveGraphic: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px',
    width: '100%',
    marginBottom: '16px',
  },
  waveBar: {
    width: '2px',
    borderRadius: '1px',
    transition: 'background-color 0.15s ease',
  },
  playerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  playBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  playerTimeline: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  timeText: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-label)',
    color: 'var(--text-muted)',
    width: '36px',
  },
  timelineTrack: {
    flex: 1,
    height: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '2px',
    position: 'relative',
    overflow: 'hidden',
  },
  timelineProgress: {
    height: '100%',
    backgroundColor: 'var(--primary)',
    borderRadius: '2px',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoCard: {
    width: '100%',
    background: 'var(--card-bg)',
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    marginBottom: '16px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '8px',
  },
  metaTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  tableLabel: {
    color: 'var(--text-muted)',
  },
  tableValue: {
    fontWeight: '600',
    color: 'var(--text)',
    maxWidth: '140px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  recommendationContent: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  recIconBoxGreen: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'rgba(78, 222, 163, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  recIconBoxRed: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'rgba(255, 77, 77, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  recommendationText: {
    fontSize: '0.82rem',
    lineHeight: '1.45',
    color: 'var(--text-muted)',
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '32px',
    width: '100%',
    gap: '16px',
  },
  homeBtn: {
    background: 'none',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '14px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  downloadBtn: {
    flex: 1,
  },
};

export default AnalysisReportScreen;
