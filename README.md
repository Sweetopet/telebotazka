# Telebotazka 🤖

Bot Telegram untuk topup koin otomatis dengan sistem saldo JSON.  
Dibuat menggunakan **Node.js** + **Telegraf**.

## Fitur
- /start → Sapa user
- /profile → Lihat info user & saldo
- /koin → Cek saldo + tombol topup
- /topup → QRIS pembayaran + timer expired
- Saldo tersimpan di `saldo.json`

## Instalasi
```bash
git clone https://github.com/Sweetopet/telebotazka.git
cd telebotazka
npm install
node index.js

Versi

Node.js: v18+

Telegraf: v4

Platform: Termux / VPS


Simpan di nano:
- `CTRL + O` → Enter → `CTRL + X`

---

### 2. Tambahkan ke Git
```bash
git add README.md
git commit -m "Tambah dokumentasi README"
git push origin main
