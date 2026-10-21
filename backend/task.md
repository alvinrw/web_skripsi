# Daftar Tugas Pengembangan - Backend DeepGuard AI Web App

- [x] Pengaturan Awal
  - [x] Buat struktur folder `backend/`
  - [x] Dokumentasikan petunjuk instalasi dependensi (Python, Flask, Librosa, Scipy, Joblib, Numpy)
- [x] Porting Kode & Model AI
  - [x] Porting `server.py` dari `APP/server.py`
  - [x] Salin file model `rerec_KNN_N=5.pkl` dari folder `APP/`
  - [x] Salin file scaler `knn_rerec_scaler.joblib` dari folder `APP/`
- [x] Integrasi & CORS
  - [x] Pastikan Flask mengembalikan header CORS (Access-Control-Allow-Origin) agar React frontend dapat memanggil API di port 5001
  - [x] Uji fungsionalitas endpoint `/health` dan `/detect`
