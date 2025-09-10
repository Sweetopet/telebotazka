const { Telegraf, Markup } = require("telegraf");
const moment = require("moment-timezone");
const fs = require("fs");
const config = require("./config");

// Token bot & ID admin
const bot = new Telegraf(config.TELEGRAM_TOKEN);
const ADMIN_ID = 7368279710; // ganti dengan chat_id admin kamu

// File JSON untuk simpan saldo
const SALDO_FILE = "./saldo.json";

// Load saldo dari file
let userCoins = {};
if (fs.existsSync(SALDO_FILE)) {
  userCoins = JSON.parse(fs.readFileSync(SALDO_FILE));
}

// Simpan saldo ke file
function saveSaldo() {
  fs.writeFileSync(SALDO_FILE, JSON.stringify(userCoins, null, 2));
}

// Simpan data sementara
let orders = {};
let ytStock = []; // simpan stok link YouTube Premium

// ===== Command /start =====
bot.start(async (ctx) => {
  // Balasan teks + tombol
  await ctx.reply(
    `👋 Halo ${ctx.from.first_name}!\n\n` +
      `Selamat datang di *YTpremium ID* 🎉\n` +
      `Dengan bot ini kamu bisa beli youtube premium otomatis.\n\n` +
      `Untuk melihat koin gunakan perintah:\n/koin atau /profile`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("💰 Topup Koin", "menu_topup")],
        [Markup.button.url("📞 Customer Service", "https://t.me/usernameCS")],
        [Markup.button.callback("🎵 Buy YT Premium", "buy_premium")],
      ]),
    }
  );

  // Kirim foto cover
  await ctx.replyWithPhoto(
    { source: "./cover.jpg" },
    { caption: "🔔 𝗣𝗔𝗡𝗗𝗨𝗔𝗡\n\n° ᵀⁱᵈᵃᵏ ᵇᵒˡᵉʰ ˢᵖᵃᵐ ᵇᵒᵗ\n° ᴶⁱᵏᵃ ᵐᵉⁿᵉᵐᵘᵏᵃⁿ ᵇᵘᵍ ᵃᵗᵃᵘ ᵉʳʳᵒʳ ˢᵉᵍᵉʳᵃ ˡᵃᵖᵒʳ\n°ᴾᵃᵗᵘʰⁱ ˢʸᵃʳᵃᵗ & ᵏᵉᵗᵉⁿᵗᵘᵃⁿ\n°ᴶⁱᵏᵃ ᵐᵉˡᵃⁿᵍᵍᵃʳ ᵍᵃʳᵃⁿˢⁱ ʰᵃⁿᵍᵘˢ" }
  );

  // Kirim audio
  await ctx.replyWithAudio(
    {
      source: "./welcome.m4a", // file audio
      filename: "Welcome_YTPremium.m4a",
    },
    {
      caption:
        "ᴴᵃˡˡᵒ ᵏᵉᵖᵃᵈᵃ ᵖᵉⁿᵍᵘⁿʲᵘⁿᵍ ʰᵃʳᵃᵖ\nˡᵘᵃⁿᵍᵏᵃⁿ ʷᵃᵏᵗᵘ ᵃⁿᵈᵃ ᵐᵉⁿᵈᵉⁿᵍᵃʳᵏᵃⁿ\nʰⁱᵐᵇᵃᵘᵃⁿ ᵏᵃᵐⁱ ⁱⁿⁱ ᵃᵍᵃʳ ᵗⁱᵈᵃᵏ ᵗᵉʳʲᵃᵈⁱ\nʰᵃˡ ʸᵃⁿᵍ ᵈⁱ ⁱⁿᵍⁱⁿᵏᵃⁿ ᵀᵉʳⁱᵐᵃ ᵏᵃˢⁱʰ",
      title: "𝐀𝐧𝐧𝐨𝐮𝐧𝐜𝐞𝐦𝐞𝐧𝐭 🔔",
      performer: "YTpremium Bot 🤖",
      parse_mode: "Markdown",
    }
  );
});

// ===== Command admin: /add link =====
bot.command("add", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply("❌ Kamu bukan admin!");
  }

  const text = ctx.message.text.split(" ");
  if (text.length < 2) {
    return ctx.reply("❌ Format salah!\nGunakan: /add <link_youtube_premium>");
  }

  const link = text[1];
  ytStock.push(link);

  let daftar = ytStock.map((v, i) => `${i + 1}. ${v}`).join("\n");
  ctx.reply(`✅ Stock link berhasil ditambahkan!\n\n📦 Daftar stock sekarang:\n${daftar}`);
});

// ===== Command /profile =====
bot.command("profile", (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;
  const saldo = userCoins[userId] || 0;
  const waktu = moment().tz("Asia/Jakarta").format("dddd, DD MMMM YYYY HH:mm:ss");

  ctx.reply(
    `👤 *Profile Kamu*\n\n` +
      `🆔 ID: ${userId}\n` +
      `👤 Nama: ${username}\n` +
      `📅 Waktu: ${waktu}\n` +
      `💰 Saldo: Rp${saldo}`,
    { parse_mode: "Markdown" }
  );
});

// ===== Command /koin =====
bot.command("koin", (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;
  const saldo = userCoins[userId] || 0;
  const waktu = moment().tz("Asia/Jakarta").format("dddd, DD MMMM YYYY HH:mm:ss");

  ctx.reply(
    `💰 *Saldo Koin*\n\n` +
      `👤 Nama: ${username}\n` +
      `🆔 ID: ${userId}\n` +
      `📅 Waktu: ${waktu}\n` +
      `💵 Sisa Saldo: Rp${saldo}`,
    {
      parse_mode: "Markdown",
      reply_markup: Markup.inlineKeyboard([
        [Markup.button.callback("🔼 Topup", "menu_topup")]
      ])
    }
  );
});

// ===== Menu Topup =====
bot.action("menu_topup", (ctx) => {
  ctx.reply(
    "💰 Silahkan pilih nominal topup koin anda",
    Markup.inlineKeyboard([
      [Markup.button.callback("Rp1.000", "topup_1000")],
      [Markup.button.callback("Rp5.000", "topup_5000")],
      [Markup.button.callback("Rp10.000", "topup_10000")],
    ])
  );
});

// ===== Proses Topup =====
bot.action(/topup_(\d+)/, async (ctx) => {
  const nominal = ctx.match[1];
  const username = ctx.from.username || ctx.from.first_name;
  const tanggal = moment().tz("Asia/Jakarta").format("DD-MM-YYYY");
  const jam = moment().tz("Asia/Jakarta").format("HH:mm:ss");

  const orderId = `ORD${Date.now()}`;
  const expireTime = Date.now() + 5 * 60 * 1000; // 5 menit expired
  orders[orderId] = {
    userId: ctx.from.id,
    username,
    nominal,
    tanggal,
    jam,
    status: "PENDING",
    expireTime,
  };

  await ctx.replyWithPhoto(
    { url: "https://files.catbox.moe/zk4pfd.jpg" }, // ganti QRIS asli
    {
      caption:
        `📌 Order Topup Koin\n\n` +
        `🆔 Order ID : ${orderId}\n` +
        `👤 User : ${username}\n` +
        `💰 Nominal : Rp${Number(nominal).toLocaleString("id-ID")}\n` +
        `📅 Tanggal : ${tanggal}\n` +
        `🕒 Jam : ${jam}\n` +
        `⏳ Expired dalam: 5 menit\n` +
        `📦 Status : ⏳ PENDING`,
    }
  );

  // Kirim notifikasi admin
  await ctx.telegram.sendMessage(
    ADMIN_ID,
    `🔔 Ada order topup baru!\n\n` +
      `🆔 Order ID : ${orderId}\n` +
      `👤 User : ${username}\n` +
      `💰 Nominal : Rp${Number(nominal).toLocaleString("id-ID")}\n` +
      `📅 Tanggal : ${tanggal}\n` +
      `🕒 Jam : ${jam}\n` +
      `📦 Status : ⏳ PENDING`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback("✅ Terima", `accept_${orderId}`),
        Markup.button.callback("❌ Tolak", `reject_${orderId}`),
      ],
    ])
  );

  // Auto expired setelah 5 menit
  setTimeout(async () => {
    if (orders[orderId] && orders[orderId].status === "PENDING") {
      orders[orderId].status = "EXPIRED";
      await ctx.reply(
        `⏰ Order ID ${orderId} sudah *EXPIRED* karena melewati batas waktu pembayaran.\nSilakan topup ulang.`
      );
    }
  }, 5 * 60 * 1000);
});

// ===== Admin Terima Topup =====
bot.action(/accept_(.+)/, async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply("❌ Kamu bukan admin!");

  const orderId = ctx.match[1];
  const order = orders[orderId];
  if (!order) return ctx.reply("❌ Order tidak ditemukan");
  if (order.status === "EXPIRED") return ctx.reply("⏰ Order ini sudah expired!");

  order.status = "SUKSES";
  if (!userCoins[order.userId]) userCoins[order.userId] = 0;
  userCoins[order.userId] += Number(order.nominal);
  saveSaldo();

  await ctx.telegram.sendMessage(
    order.userId,
    `✅ Topup Berhasil!\n\n` +
      `🆔 Order ID : ${orderId}\n` +
      `💰 Nominal : Rp${Number(order.nominal).toLocaleString("id-ID")}\n` +
      `📦 Status : ✅ SUKSES\n\n` +
      `💵 Saldo koin kamu sekarang: Rp${userCoins[order.userId]}`
  );

  await ctx.editMessageText(`✅ Order ID ${orderId} diterima dan user sudah mendapat koin!`);
});

// ===== Admin Tolak Topup =====
bot.action(/reject_(.+)/, async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply("❌ Kamu bukan admin!");

  const orderId = ctx.match[1];
  const order = orders[orderId];
  if (!order) return ctx.reply("❌ Order tidak ditemukan");

  order.status = "GAGAL";

  await ctx.telegram.sendMessage(
    order.userId,
    `❌ Topup Gagal!\n\n` +
      `🆔 Order ID : ${orderId}\n` +
      `💰 Nominal : Rp${Number(order.nominal).toLocaleString("id-ID")}\n` +
      `📦 Status : ❌ GAGAL`,
    Markup.inlineKeyboard([
      [Markup.button.url("📞 Lapor ke CS", "https://t.me/usernameCS")],
    ])
  );

  await ctx.editMessageText(`❌ Order ID ${orderId} ditolak!`);
});

// ===== Buy Premium =====
bot.action("buy_premium", (ctx) => {
  const tanggal = moment().tz("Asia/Jakarta").format("DD-MM-YYYY");
  const jam = moment().tz("Asia/Jakarta").format("HH:mm:ss");

  ctx.reply(
    `*YOUTUBE PREMIUM*\n\n` +
      `👤 User : ${ctx.from.username || ctx.from.first_name}\n` +
      `💰 Koin : Rp${userCoins[ctx.from.id] || 0}\n` +
      `📅 Tanggal : ${tanggal}\n` +
      `🕒 Jam : ${jam}\n\n` +
      `📌 Harga YouTube Premium\n` +
      `💵 Harga : Rp1.000\n` +
      `📅 Expired : 29/30 Hari\n` +
      `🛡️ Garansi : Aktif`,
    Markup.inlineKeyboard([[Markup.button.callback("🛒 BUY", "confirm_buy_premium")]])
  );
});

// ===== Confirm Buy Premium =====
bot.action("confirm_buy_premium", (ctx) => {
  const userId = ctx.from.id;
  const harga = 1000;
  const saldo = userCoins[userId] || 0;

  if (saldo < harga) {
    return ctx.reply("⚠️ Saldo koin kamu tidak cukup, silakan topup dulu 💰");
  }

  if (ytStock.length === 0) {
    return ctx.reply("❌ Maaf, stok YouTube Premium sedang kosong.");
  }

  userCoins[userId] -= harga;
  saveSaldo();
  const link = ytStock.shift(); // ambil link pertama lalu hapus

  ctx.reply(
    `✅ Pembelian Berhasil!\n\n` +
      `🔗 Link YouTube Premium : ${link}\n` +
      `💰 Sisa Koin : Rp${userCoins[userId]}\n` +
      `📦 Status : ✅ BERHASIL`
  );

  bot.telegram.sendMessage(
    ADMIN_ID,
    `🎵 User ${ctx.from.username || ctx.from.first_name} baru saja membeli YouTube Premium!\n` +
      `💵 Harga: Rp${harga}\n` +
      `💰 Sisa koin user: Rp${userCoins[userId]}\n` +
      `🔗 Link diberikan: ${link}`
  );
});

// ===== Run Bot =====
bot.launch();
console.log("✅ Bot Telegram jalan...");
