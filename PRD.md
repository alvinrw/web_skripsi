# Product Requirement Document (PRD)
## DeepGuard AI Web Application

### 1. Pendahuluan
#### 1.1 Latar Belakang
Manipulasi audio berbasis AI dan kecanggihan deepfake suara kini menjadi ancaman nyata dalam aspek keamanan siber, bukti hukum forensik, dan integritas informasi. Untuk mengatasi hal ini, dikembangkanlah **DeepGuard AI**, sebuah sistem deteksi audio forensik (khususnya re-recording / perekaman ulang audio) menggunakan algoritma pemelajaran mesin (Machine Learning) seperti K-Nearest Neighbors (KNN). Aplikasi mobile berbasis Flutter telah dikembangkan, dan dokumen ini merinci kebutuhan untuk porting sistem tersebut ke dalam aplikasi berbasis web (Web App).

#### 1.2 Tujuan
Membangun platform deteksi audio forensik berbasis web yang responsif, estetis, dan memiliki fungsionalitas yang setara dengan versi mobile Flutter, guna mempermudah analis forensik (investigator) menguji keaslian rekaman suara langsung dari browser mereka.

---

### 2. Fitur Utama & Kebutuhan Fungsional

#### 2.1 Alur Autentikasi (Authentication Gate)
- **Halaman Masuk (Login Screen)**:
  - Form input email dengan validasi format regex.
  - Form input kata sandi dengan panjang minimal 6 karakter.
  - Fitur toggle sembunyikan/tampilkan kata sandi.
  - Navigasi ke halaman pendaftaran.
- **Halaman Daftar (Register Screen)**:
  - Form pendaftaran akun baru dengan input Nama Lengkap, Email, Kata Sandi, dan Konfirmasi Kata Sandi.

#### 2.2 Shell Layar Utama & Navigasi Responsif
- **Tampilan Desktop (Lebar Layar > 650px)**:
  - Navigasi menggunakan **Sidebar (Navigation Rail)** di sebelah kiri.
  - Opsi navigasi: Beranda, Deteksi, Setelan.
  - Tombol logout terletak di bagian bawah sidebar.
- **Tampilan Mobile (Lebar Layar <= 650px)**:
  - Navigasi menggunakan **Bottom Navigation Bar** di bagian bawah.
  - Pilihan tab: Beranda (Home), Deteksi (Radar), Setelan (Settings).
- **Header Top Bar**:
  - Logo Shield dan tulisan "DeepGuard".
  - Tombol Toggle Tema (Terang / Gelap).
  - Profil Avatar analis.

#### 2.3 Dashboard (Beranda)
- **Tata Letak Bento Grid**:
  - Kartu Aksi Utama: "Mulai Deteksi" dengan latar belakang animasi kisi-kisi (grid) yang dinamis.
  - Kartu Statistik: Menampilkan metrik jumlah file yang dianalisis disertai progress bar interaktif.
- **Daftar Riwayat Deteksi Terbaru**:
  - Menampilkan hingga 5 riwayat analisis terakhir dengan indikasi status (AUTENTIK dalam warna hijau / DEEPFAKE dalam warna merah), nama file, dan keterangan waktu lampau (time ago).
  - Tombol "LIHAT SEMUA" untuk melihat daftar lengkap riwayat (History).

#### 2.4 Alur Deteksi Audio
- **Halaman Pilih Metode**:
  - **Perekam Audio Forensik (Direct Record)**: Dialog mikrofon interaktif dengan visualisasi gelombang audio dinamis saat merekam dan timer detik berjalan.
  - **Unggah Berkas Audio (File Upload)**: Komponen dropzone/file picker untuk memilih berkas WAV, MP3, atau M4A.
- **Halaman Pilih Model**:
  - Menampilkan informasi detail berkas audio yang terpilih (Nama, Format, Ukuran, Durasi).
  - Pilihan Model AI:
    - **Model Alvin (KNN)**: Model utama berbasis machine learning KNN yang dilatih untuk mendeteksi re-recording.
    - **Model Fawwas**: Model sekunder berbasis jaringan saraf tiruan (simulasi/pembanding).
- **Proses Analisis (Visual Scanning)**:
  - Menampilkan bar kemajuan (progress bar) forensik dari 0% ke 100%.
  - Konsol Log Forensik real-time yang memperlihatkan langkah-langkah teknis analisis (misal: memuat bobot, ekstraksi vokal, perhitungan noise floor, dll.).

#### 2.5 Halaman Laporan Hasil (Analysis Report)
- **Skor Kepercayaan Keaslian**:
  - Ditampilkan dalam format melingkar (Circular Gauge) dengan animasi pengisian persentase yang mulus.
- **Badge Status Keamanan**:
  - "AUTENTIK" (Hijau) jika terverifikasi asli.
  - "SUSPECTED DEEPFAKE" (Merah) jika terdeteksi manipulasi/re-recording.
- **Audio Waveform Player**:
  - Representasi grafis gelombang audio statis.
  - Fitur play/pause audio yang disinkronkan dengan durasi waktu audio aktual.
- **Metadata Detail & Rekomendasi**:
  - Tabel metadata file (Ukuran, Format, Durasi, Model AI).
  - Kartu rekomendasi investigasi berdasarkan tingkat keparahan anomali.
- **Aksi Laporan**:
  - Tombol unduh laporan forensik (.txt ringkasan forensik).
  - Tombol kembali ke Dashboard.

#### 2.6 Halaman Setelan (Settings)
- **Profil Investigator**: Nama lengkap investigator dan ID Investigator (DG-7782).
- **Threshold Sensitivitas AI**: Slider interaktif untuk menentukan sensitivitas peringatan AI (default 85%).
- **Informasi Sistem**: Versi rilis DeepGuard AI, detail engine model KNN, dan status lisensi lokal.

---

### 3. Kebutuhan Non-Fungsional (NFR)
1. **Responsivitas**: Tampilan wajib menyesuaikan diri dengan perangkat ponsel (mobile), tablet, maupun PC desktop dengan transisi yang mulus.
2. **Keindahan Visual (Aesthetic Appeal)**: Desain modern bertema glassmorphism, memanfaatkan gradasi radial, bayangan melayang (drop shadow), blur filter latar belakang, dan micro-animations pada setiap interaksi hover/klik.
3. **Kemandirian (Local Fallback)**:
   - Jika backend Python Flask menyala (`http://localhost:5001`), analisis forensik menggunakan model riil.
   - Jika backend mati/tidak terhubung, sistem secara otomatis beralih ke simulasi visual yang realistis agar presentasi demo/fungsionalitas lokal tetap berjalan tanpa crash.
4. **Penyimpanan Lokal (Persistence)**: Menggunakan `localStorage` browser untuk menyimpan data riwayat pengujian analis agar tidak hilang saat halaman dimuat ulang.
