# Panduan Sistem Desain (Design System)
## DeepGuard AI - Web Specification

Sistem desain ini merinci spesifikasi visual untuk memastikan aplikasi web memiliki gaya estetika, konsistensi warna, dan responsivitas elemen yang sama persis dengan aplikasi mobile Flutter asli.

---

### 1. Token Warna (Color Tokens)

Aplikasi web mendukung tema Gelap (Dark Mode) dan tema Terang (Light Mode) yang diatur menggunakan variabel CSS pada `:root`.

#### 1.1 Tema Gelap (Dark Mode) - Default Utama
| Token Nama | Nilai Heksadesimal | Keterangan |
|---|---|---|
| Background | `#0B1326` | Warna latar belakang layar utama |
| Surface | `#0B1326` | Warna permukaan dasar |
| Card Container | `#171F33` | Latar belakang kartu kontainer glassmorphism |
| Card High | `#222A3D` | Latar belakang kartu dengan elevasi sedang |
| Card Highest | `#2D3449` | Latar belakang kartu dengan elevasi tinggi |
| Primary Accent | `#00DAF3` | Warna aksen utama (Sian Terang) |
| Secondary Accent (Success) | `#4EDEA3` | Warna status Autentik (Mint) |
| Error / Danger | `#FFB4AB` | Warna status Deepfake (Merah Muda Terang) |
| Text On Surface | `#DAE2FD` | Warna utama untuk judul & teks penting |
| Text On Surface Variant | `#BAC9CC` | Warna teks sekunder / deskripsi |

#### 1.2 Tema Terang (Light Mode)
| Token Nama | Nilai Heksadesimal | Keterangan |
|---|---|---|
| Background | `#F8F9FA` | Warna latar belakang layar utama |
| Surface | `#FFFFFF` | Permukaan bersih murni |
| Card Container | `#EDEEEF` | Latar belakang kartu kontainer abu-abu terang |
| Card High | `#E7E8E9` | Latar belakang kartu dengan elevasi sedang |
| Card Highest | `#E1E3E4` | Latar belakang kartu dengan elevasi tinggi |
| Primary Accent | `#0052FF` | Warna aksen utama (Biru Royal Terang) |
| Secondary Accent (Success) | `#705D00` / `#00A572` | Warna status Autentik (Hijau/Emas) |
| Error / Danger | `#BA1A1A` | Warna status Deepfake (Merah Tua) |
| Text On Surface | `#191C1D` | Warna teks utama |
| Text On Surface Variant | `#434656` | Warna teks sekunder |

---

### 2. Tipografi (Typography)

Sistem tipografi menggunakan Google Fonts yang dimuat secara dinamis melalui tag `<link>` HTML.

- **Tema Gelap**:
  - Judul / Display / Headline: **Inter** (Semibold / Bold)
  - Isi Teks / Body: **Inter** (Regular)
  - Label / Tombol / Kode: **Geist** (Medium / Semibold)
- **Tema Terang**:
  - Judul / Display / Headline: **Hanken Grotesk** (Semibold / Bold)
  - Isi Teks / Body: **Inter** (Regular)
  - Label / Tombol / Kode: **Geist** (Medium / Semibold)

---

### 3. Komponen Utama & Pola Desain (Core Components)

#### 3.1 Kartu Kaca (Glassmorphism Card)
Untuk memberikan kesan premium, seluruh kontainer utama dibungkus menggunakan kartu kaca transparan.
- **CSS Properties (Dark Mode)**:
  ```css
  background: rgba(23, 31, 51, 0.5);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 218, 243, 0.15); /* Aksen tipis sesuai warna primer */
  border-radius: 20px;
  ```
- **CSS Properties (Light Mode)**:
  ```css
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 82, 255, 0.1);
  border-radius: 20px;
  ```

#### 3.2 Tombol Aksi Utama (Elevated Primary Button)
Tombol utama yang menonjol dengan sudut melengkung halus dan transisi bayangan lembut.
- **Spesifikasi**:
  - Border radius: `12px`
  - Padding: `16px 24px`
  - Transisi: `all 0.3s ease`
  - Animasi hover: Skala naik sedikit (`transform: scale(1.02)`) dan intensitas bayangan meningkat.

#### 3.3 Kisi Bento (Bento Grid)
Tata letak modern asimetris untuk menyusun elemen-elemen informasi (seperti kartu deteksi, kartu statistik, dan grafik). Grid ini harus otomatis beradaptasi menjadi susunan satu kolom pada layar di bawah 650px.
