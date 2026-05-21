<h1 align="center">Tech & Business Article — Frontend</h1>

# Platform Overview

Tech & Business Article Hub adalah platform publikasi artikel teknologi dan bisnis yang dirancang khusus untuk mahasiswa dan praktisi yang ingin mengikuti perkembangan industri teknologi sekaligus dinamika bisnis global dalam satu tempat terintegrasi.

Frontend ini dibangun menggunakan Next.js 14 App Router dan TypeScript, menyajikan antarmuka pengguna untuk eksplorasi artikel, form submission, dan dashboard pengelolaan konten. Semua request ke backend dikelola melalui API client dengan autentikasi berbasis JWT. Sistem review editorial memastikan setiap artikel yang diajukan pengguna melalui proses verifikasi admin sebelum tampil ke publik, sehingga kualitas dan relevansi konten tetap terjaga.

Platform ini merupakan proyek akhir mata kuliah Sistem Basis Data (SBD) Kelompok 9.

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)

---

## Anggota Kelompok 9

| Nama | NIM | 
|------|-----|
| Steven | 2406359600 |
| Tubagus Dafa Izza Fariz | 2406350122 | 
| Vanesa Kayla Zahra | 2306161901 | 
| Salahuddin Zidane A | 2206028200 | 

---

## Struktur Proyek

```
frontendSBDKel9/
├── app/
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx                          # Landing page
│   ├── login/
│   │   └── page.tsx                      # Halaman login
│   ├── register/
│   │   └── page.tsx                      # Halaman registrasi
│   ├── articles/
│   │   ├── page.tsx                      # Daftar artikel
│   │   └── [id]/
│   │       └── page.tsx                  # Detail artikel
│   └── dashboard/
│       ├── page.tsx                      # Dashboard overview
│       ├── submit/
│       │   └── page.tsx                  # Form submission artikel
│       ├── review/
│       │   └── page.tsx                  # Review artikel (admin)
│       ├── articles/
│       │   ├── page.tsx                  # Manajemen artikel (admin)
│       │   ├── new/page.tsx              # Tambah artikel baru
│       │   └── [id]/edit/page.tsx        # Edit artikel
│       └── settings/
│           └── page.tsx                  # Pengaturan akun
├── components/
│   ├── article-card.tsx                  # Card artikel reusable
│   ├── article-card-skeleton.tsx         # Loading skeleton card
│   ├── article-form.tsx                  # Form artikel reusable
│   ├── dashboard-sidebar.tsx             # Sidebar navigasi dashboard
│   ├── delete-confirm-dialog.tsx         # Dialog konfirmasi hapus
│   ├── header.tsx                        # Navigasi global
│   └── ui/                              # Komponen shadcn/ui
├── hooks/
│   ├── use-auth.ts                       # Custom hook autentikasi
│   └── use-toast.ts                      # Custom hook notifikasi
├── lib/
│   ├── api.ts                            # API client (class APIClient)
│   ├── types.ts                          # TypeScript interfaces
│   └── utils.ts                          # Utility functions
├── next.config.ts
├── tailwind.config.js
└── package.json
```

---

## Features

### Autentikasi
- Register dan login dengan autentikasi berbasis JWT
- Token disimpan di localStorage dan dikirim via Authorization header pada setiap request
- Protected routes menggunakan custom hook `useAuth`; pengguna yang belum login otomatis diarahkan ke halaman login

### Eksplorasi Artikel
- Halaman daftar artikel menampilkan semua konten yang sudah disetujui admin
- Fitur pencarian dengan debounce 300ms untuk efisiensi request ke backend
- Filter artikel berdasarkan kategori
- Skeleton loading ditampilkan selama data masih diambil dari server

### Detail Artikel
- Menampilkan konten lengkap artikel beserta informasi author, tanggal publikasi, dan jumlah tampilan
- View counter otomatis bertambah setiap kali halaman detail dibuka

### Submission Artikel
- Form pengajuan artikel dengan field judul, ringkasan, konten, kategori, dan URL gambar
- Artikel yang disubmit masuk dengan status pending dan menunggu persetujuan admin
- Halaman ini hanya dapat diakses oleh pengguna yang sudah login

### Dashboard Admin
- Halaman review menampilkan seluruh artikel pending dengan tombol approve dan reject
- Halaman manajemen artikel memungkinkan admin melakukan CRUD konten secara langsung

---

## Application Flow

```
Register / Login
      |
      v
Landing Page (daftar artikel publik)
      |
      |-- Tanpa login  --> Browse artikel, baca detail
      |
      +-- Setelah login --> Submit artikel, dashboard pribadi
                                  |
                                  +-- Role admin --> Review artikel, manajemen konten
```

---

## Installation Guide

Clone repository ini:

```bash
git clone https://github.com/zidane06-sa/frontendSBDKel9.git
```

Masuk ke folder proyek dan install dependencies:

```bash
cd frontendSBDKel9
npm install
```

Buat file `.env.local` di root folder proyek dan tambahkan variabel berikut:

**Opsi 1: Menggunakan backend lokal**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_USE_MOCK_API=false
```

**Opsi 2: Menggunakan backend yang sudah deploy di Vercel**
```env
NEXT_PUBLIC_API_BASE_URL=https://miniproject-sbd-backend.vercel.app/api
NEXT_PUBLIC_USE_MOCK_API=false
```

Jalankan development server:

```bash
npm run dev
```

Frontend berjalan di `http://localhost:3000`.

Build untuk production:

```bash
npm run build
npm start
```

---

## Repositori Terkait

Backend: https://github.com/zidane06-sa/backendSBDKel9
