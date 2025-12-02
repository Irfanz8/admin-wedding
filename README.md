# Admin Wedding Dashboard

Web admin untuk mengelola data wedding menggunakan React.js dan Tailwind CSS.

## Fitur

- 🔐 Login Admin
- 📊 Dashboard dengan statistik
- 👥 Manajemen Guests
- 💬 Manajemen RSVPs
- 🎨 UI Modern dengan Tailwind CSS
- 📱 Responsive Design

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Build untuk production:
```bash
npm run build
```

## Deploy

### Deploy ke Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

Atau langsung connect repository GitHub ke Vercel untuk auto-deploy.

### Deploy ke Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Build dan deploy:
```bash
npm run build
netlify deploy --prod
```

Atau drag & drop folder `dist` ke [Netlify Drop](https://app.netlify.com/drop).

## API Configuration

API endpoint sudah dikonfigurasi di `src/config/api.js`. Pastikan endpoint admin di API Anda sesuai dengan yang digunakan di aplikasi ini.

Base URL: `https://api-wedding.fanz8ap.workers.dev`

## Login

Untuk login, gunakan username dan password admin Anda. Jika API belum memiliki endpoint login, aplikasi akan menggunakan simple authentication.

