import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '../../components/GlassCard';

const SelectMethodScreen = ({ onBack, onAudioSelected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [waveAmplitudes, setWaveAmplitudes] = useState(Array(30).fill(15));
  
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const fileBytes = new Uint8Array(arrayBuffer);

        const durationStr = formatTime(recordSeconds);
        const sizeStr = `${(fileBytes.length / (1024 * 1024)).toFixed(2)} MB`;
        const fileName = `rekaman_${Date.now()}.wav`;

        onAudioSelected(fileName, 'WAV', sizeStr, durationStr, fileBytes);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);

      animateWaveform();

    } catch (err) {
      alert('Izin mikrofon ditolak atau tidak didukung pada browser Anda.');
      setIsRecordModalOpen(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      audioChunksRef.current = [];
    }
    setIsRecording(false);
    setIsRecordModalOpen(false);
    clearInterval(timerRef.current);
    cancelAnimationFrame(animationRef.current);
  };

  const animateWaveform = () => {
    if (!isRecording) return;
    setWaveAmplitudes(
      Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 10)
    );
    animationRef.current = setTimeout(animateWaveform, 120);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    const extension = file.name.split('.').last?.() || file.name.split('.').pop() || '';
    const format = extension.toUpperCase();
    const allowed = ['WAV', 'MP3', 'M4A'];

    if (!allowed.includes(format)) {
      alert('Format berkas tidak didukung! Harap pilih berkas WAV, MP3, atau M4A.');
      return;
    }

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);

    let calculatedSeconds = Math.round(file.size / 24000);
    if (calculatedSeconds < 1) calculatedSeconds = 5;
    if (calculatedSeconds > 300) calculatedSeconds = 165;
    const durationStr = formatTime(calculatedSeconds);

    onAudioSelected(file.name, format, sizeStr, durationStr, fileBytes);
  };

  const formatTime = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
        <h2 style={styles.title}>Pilih Metode Deteksi</h2>
        <div style={{ width: '80px' }} />
      </header>

      <div style={styles.methodsRow} className="methods-layout">
        <div style={styles.optionBox}>
          <GlassCard 
            className={`dropzone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={styles.card}
            padding="40px 24px"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }}
              accept=".wav,.mp3,.m4a"
            />
            <div style={styles.iconContainer}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <h3 style={styles.methodTitle}>Unggah File Audio</h3>
            <p style={styles.methodDesc}>
              Tarik & lepaskan file audio Anda di sini, atau klik untuk memilih file dari perangkat.
            </p>
            <span style={styles.supportBadge}>Format: WAV, MP3, M4A (Maks. 25MB)</span>
          </GlassCard>
        </div>

        <div style={styles.optionBox}>
          <GlassCard 
            onClick={() => setIsRecordModalOpen(true)}
            style={styles.card}
            padding="40px 24px"
          >
            <div style={styles.iconContainer}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8"/>
              </svg>
            </div>
            <h3 style={styles.methodTitle}>Perekam Audio Forensik</h3>
            <p style={styles.methodDesc}>
              Rekam sampel suara secara langsung menggunakan mikrofon perangkat Anda untuk analisis real-time.
            </p>
            <span style={styles.supportBadge}>Rekam langsung via Browser</span>
          </GlassCard>
        </div>
      </div>

      {isRecordModalOpen && (
        <div style={styles.modalOverlay}>
          <div className="glass-container animate-fade-in" style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Perekam Audio Forensik</h3>
            <p style={styles.modalSubtitle}>Sistem menangkap sampel audio resolusi tinggi untuk pengujian.</p>
            
            <div style={styles.visualizerContainer}>
              <div style={styles.timer}>{formatTime(recordSeconds)}</div>
              
              <div style={styles.waveGroup}>
                {waveAmplitudes.map((amp, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      ...styles.waveBar,
                      height: `${isRecording ? amp : 4}px`,
                      background: isRecording ? 'var(--primary)' : 'var(--text-muted)',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={styles.modalActions}>
              {!isRecording ? (
                <>
                  <button onClick={cancelRecording} style={styles.cancelBtn}>Batal</button>
                  <button onClick={startRecording} className="btn-primary" style={styles.startBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--bg)" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Mulai Rekam</span>
                  </button>
                </>
              ) : (
                <button onClick={stopRecording} style={styles.stopBtn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                  </svg>
                  <span>Selesai & Analisis</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .methods-layout {
          display: flex;
          gap: 20px;
        }
        .methods-layout > div {
          flex: 1;
        }
        .dropzone {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .dropzone:hover, .dropzone.active {
          border-color: var(--primary) !important;
          box-shadow: 0 0 20px var(--primary-glow);
        }
        @media (max-width: 650px) {
          .methods-layout {
            flex-direction: column;
          }
          .methods-layout > div {
            width: 100%;
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
    marginBottom: '32px',
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
  methodsRow: {
    width: '100%',
  },
  optionBox: {
    display: 'flex',
  },
  card: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    minHeight: '260px',
    justifyContent: 'center',
  },
  iconContainer: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'var(--primary-glow)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    border: '1px solid var(--border)',
    transition: 'transform 0.3s ease',
  },
  methodTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '8px',
    fontFamily: 'var(--font-display)',
  },
  methodDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    marginBottom: '16px',
    maxWidth: '280px',
  },
  supportBadge: {
    fontSize: '0.7rem',
    fontWeight: '600',
    fontFamily: 'var(--font-label)',
    color: 'var(--primary)',
    background: 'var(--primary-glow)',
    border: '1px solid var(--border)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(11, 19, 38, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: '24px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '420px',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'var(--card-bg)',
    backdropFilter: 'blur(20px)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    marginBottom: '8px',
  },
  modalSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginBottom: '28px',
    lineHeight: '1.4',
  },
  visualizerContainer: {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '28px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  timer: {
    fontFamily: 'var(--font-label)',
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--primary)',
  },
  waveGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    height: '60px',
    width: '100%',
  },
  waveBar: {
    width: '4px',
    borderRadius: '2px',
    transition: 'height 0.1s ease, background 0.3s ease',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    width: '100%',
  },
  cancelBtn: {
    background: 'none',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '12px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'var(--font-label)',
  },
  startBtn: {
    flex: 1,
  },
  stopBtn: {
    background: '#FF4D4D',
    color: 'white',
    padding: '14px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    fontFamily: 'var(--font-label)',
    width: '100%',
    boxShadow: '0 4px 12px rgba(255, 77, 77, 0.3)',
  },
};

export default SelectMethodScreen;
