var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var db = require('./db');

var app = express();
var JWT_SECRET = process.env.JWT_SECRET || 'ebv_dev_secret';
var dbReady = false;
async function ensureDb() { if (!dbReady) { await db.init(); dbReady = true; } }

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

function generateToken(user) { return jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' }); }
function auth(req, res, next) { var token = null; if (req.cookies && req.cookies.ebv_token) token = req.cookies.ebv_token; if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1]; if (!token) return res.status(401).json({ error: 'Giris yapmalsin.' }); try { req.user = jwt.verify(token, JWT_SECRET); next(); } catch (e) { res.status(401).json({ error: 'Oturum suresi doldu.' }); } }
function adm(req, res, next) { if (!req.user || req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin yetkisi gerekli.' }); next(); }
function setCookie(res, user) { res.cookie('ebv_token', generateToken(user), { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 604800000 }); }

app.get('/api/init', async function(req, res) { try { await ensureDb(); var ch = await db.getAllCharacters(false); var qq = await db.getAllQuestions(); var wq = await db.getAllWhoQuestions(); var gc = await db.getConfig('games'); var del = await db.getConfig('deleted_chars'); var ads = await db.getConfig('ads_config'); var rqs = await db.getConfig('replaced_qs'); var discord = await db.getDiscordLink(); var heroImg = await db.getConfig("hero_image");
    var gnR = await db.query("SELECT key, value FROM game_config WHERE key LIKE 'game_%'"); var gameNames = {}; gnR.rows.forEach(function(r){ gameNames[r.key.replace('game_','')] = r.value; }); res.json({ characters: ch, quizQuestions: qq, whoQuestions: wq, gameConfig: gc ? JSON.parse(gc) : null, deleted_chars: del || null, ads_config: ads || null, replaced_qs: rqs || null, discord: discord || "", hero_image: heroImg || "", game_names: gameNames || {} }); } catch (e) { console.error(e.message); res.status(500).json({ error: 'Init failed.' }); } });

app.post('/api/auth/register', async function(req, res) { try { await ensureDb(); var username = (req.body.username || '').trim().substring(0, 20); var email = (req.body.email || '').trim().substring(0, 100).toLowerCase(); var password = (req.body.password || '').trim(); if (!username || !email || !password) return res.status(400).json({ error: 'Tum alanlari doldur.' }); if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) return res.status(400).json({ error: 'Kullanici adi 3-20 karakter.' }); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Gecerli e-posta gir.' }); if (password.length < 4 || password.length > 50) return res.status(400).json({ error: 'Sifre 4-50 karakter.' }); if (await db.findUserByEmail(email) || await db.findUserByUsername(username)) return res.status(400).json({ error: 'Bu bilgilerle kayit yapilamiyor.' }); var userId = await db.createUser(username, email, password); var user = await db.findUserById(userId); setCookie(res, user); res.json({ user: { id: user.id, username: user.username, role: user.role, best_score: 0, games_played: 0 } }); } catch (e) { console.error(e.message); res.status(500).json({ error: 'Kayit basarisiz.' }); } });
app.post('/api/auth/login', async function(req, res) { try { await ensureDb(); var email = (req.body.email || '').trim().toLowerCase(); var password = (req.body.password || '').trim(); if (!email || !password) return res.status(400).json({ error: 'E-posta ve sifre gerekli.' }); var user = await db.findUserByEmail(email); if (!user) user = await db.findUserByUsername(email); if (!user || !db.verifyPassword(password, user.password)) return res.status(401).json({ error: 'E-posta veya sifre hatali.' }); if (user.banned) return res.status(403).json({ error: 'Hesabiniz yasaklanmistir.' }); setCookie(res, user); res.json({ user: { id: user.id, username: user.username, role: user.role, best_score: user.best_score, games_played: user.games_played } }); } catch (e) { console.error(e.message); res.status(500).json({ error: 'Giris basarisiz.' }); } });
app.get('/api/auth/me', auth, async function(req, res) { try { await ensureDb(); var user = await db.findUserById(req.user.id); if (!user) return res.status(404).json({ error: 'Bulunamadi.' }); if (user.banned) return res.status(403).json({ error: 'Hesabiniz yasaklanmistir.' }); res.json({ user: user }); } catch (e) { res.status(500).json({ error: 'Hata.' }); } });
app.post('/api/auth/logout', function(req, res) { res.clearCookie('ebv_token'); res.json({ success: true }); });

app.post('/api/scores/save', auth, async function(req, res) { try { await ensureDb(); var score = req.body.score; var validGames = ['MEMORY','FACE','QUOTE']; if (!validGames.includes(req.body.game_type) || typeof score !== 'number' || score < 0) return res.status(400).json({ error: 'Gecersiz.' }); var total = req.body.game_type === "MEMORY" ? await db.getQuestionCount() : (req.body.total || score); if (score > total) return res.status(400).json({ error: 'Gecersiz skor.' }); await db.saveScore(req.user.id, req.body.game_type, score, total); var user = await db.findUserById(req.user.id); res.json({ success: true, best_score: user.best_score, games_played: user.games_played }); } catch (e) { res.status(500).json({ error: 'Kaydedilemedi.' }); } });
app.get('/api/scores/game-leaderboard', async function(req, res) {
  try { await ensureDb(); var gt = req.query.game || 'MEMORY'; var lb = await db.getGameLeaderboard(gt); res.json({ leaderboard: lb, game_type: gt }); }
  catch (e) { res.status(500).json({ error: 'Yuklenemedi.' }); }
});

app.get('/api/scores/leaderboard', async function(req, res) { try { await ensureDb(); res.json({ leaderboard: await db.getLeaderboard(), total_questions: await db.getQuestionCount() }); } catch (e) { res.status(500).json({ error: 'Yuklenemedi.' }); } });

app.get('/api/characters', async function(req, res) { try { await ensureDb(); res.json({ characters: await db.getAllCharacters(false) }); } catch (e) { res.status(500).json({ error: 'Yuklenemedi.' }); } });
app.get('/api/characters/admin', auth, adm, async function(req, res) { try { await ensureDb(); res.json({ characters: await db.getAllCharacters(true) }); } catch (e) { res.status(500).json({ error: 'Yuklenemedi.' }); } });
app.post('/api/characters', auth, adm, async function(req, res) { try { await ensureDb(); var d = req.body; var name = (d.name || d.n || '').trim().substring(0, 30); if (!name) return res.status(400).json({ error: 'Ad zorunlu.' }); var cid = await db.upsertCharacter({ id: d.id, origName: d.origName, origSurname: d.origSurname, name: name, surname: (d.surname || d.s || '').trim().substring(0, 50), gender: (d.gender || d.g) === 'F' ? 'F' : 'M', rep: (d.rep || '').trim().substring(0, 200), tip: (d.tip || '').trim().substring(0, 100), img: d.img || '', active: d.active !== false && d.a !== false }); res.json({ success: true, id: cid }); } catch (e) { console.error(e.message); res.status(500).json({ error: 'Kaydedilemedi.' }); } });
app.delete('/api/characters/:id', auth, adm, async function(req, res) { try { await ensureDb(); await db.deleteCharacter(parseInt(req.params.id)); res.json({ success: true }); } catch (e) { res.status(500).json({ error: 'Silinemedi.' }); } });

app.get('/api/questions', async function(req, res) { try { await ensureDb(); res.json({ questions: await db.getAllQuestions() }); } catch (e) { res.status(500).json({ error: 'Yuklenemedi.' }); } });
app.post('/api/questions', auth, adm, async function(req, res) { try { await ensureDb(); var d = req.body; var q = (d.question || '').trim().substring(0, 300); if (!q) return res.status(400).json({ error: 'Soru zorunlu.' }); var qid = await db.upsertQuestion({ id: d.id, question: q, option_a: (d.option_a || '').substring(0, 100), option_b: (d.option_b || '').substring(0, 100), option_c: (d.option_c || '').substring(0, 100), option_d: (d.option_d || '').substring(0, 100), correct_index: d.correct_index || 0 }); res.json({ success: true, id: qid }); } catch (e) { res.status(500).json({ error: 'Kaydedilemedi.' }); } });
app.delete('/api/questions/:id', auth, adm, async function(req, res) { try { await ensureDb(); await db.deleteQuestion(parseInt(req.params.id)); res.json({ success: true }); } catch (e) { res.status(500).json({ error: 'Silinemedi.' }); } });

app.get('/api/who-questions', async function(req, res) { try { await ensureDb(); res.json({ questions: await db.getAllWhoQuestions() }); } catch (e) { res.status(500).json({ error: 'Yuklenemedi.' }); } });
app.post('/api/who-questions', auth, adm, async function(req, res) { try { await ensureDb(); var d = req.body; var q = (d.question || '').trim().substring(0, 300); if (!q) return res.status(400).json({ error: 'Soru zorunlu.' }); var qid = await db.upsertWhoQuestion({ id: d.id, question: q, option_a: (d.option_a || '').substring(0, 100), option_b: (d.option_b || '').substring(0, 100), option_c: (d.option_c || '').substring(0, 100), option_d: (d.option_d || '').substring(0, 100) }); res.json({ success: true, id: qid }); } catch (e) { res.status(500).json({ error: 'Kaydedilemedi.' }); } });
app.delete('/api/who-questions/:id', auth, adm, async function(req, res) { try { await ensureDb(); await db.deleteWhoQuestion(parseInt(req.params.id)); res.json({ success: true }); } catch (e) { res.status(500).json({ error: 'Silinemedi.' }); } });

app.get('/api/game-config', async function(req, res) { try { await ensureDb(); var v = await db.getConfig('games'); var ads = await db.getConfig('ads_config'); var del = await db.getConfig('deleted_chars'); var rqs2 = await db.getConfig('replaced_qs'); res.json({ config: v ? JSON.parse(v) : null, ads_config: ads || null, deleted_chars: del || null, replaced_qs: rqs2 || null }); } catch (e) { res.status(500).json({ error: 'Yuklenemedi.' }); } });
app.post('/api/game-config', auth, adm, async function(req, res) { try { await ensureDb(); if (req.body.key === 'ads_config') { await db.setConfig('ads_config', req.body.value); } else if (req.body.key === 'deleted_chars') { await db.setConfig('deleted_chars', req.body.value); } else if (req.body.key === 'replaced_qs') { await db.setConfig('replaced_qs', req.body.value); } else { await db.setConfig('games', JSON.stringify(req.body.config)); } res.json({ success: true }); } catch (e) { res.status(500).json({ error: 'Kaydedilemedi.' }); } });

app.get('/api/admin/users', auth, adm, async function(req, res) { try { await ensureDb(); res.json({ users: await db.getAllUsers() }); } catch (e) { res.status(500).json({ error: 'Yuklenemedi.' }); } });
app.post('/api/admin/ban-user/:id', auth, adm, async function(req, res) { try { await ensureDb(); var userId = parseInt(req.params.id); var user = await db.findUserById(userId); if (!user) return res.status(404).json({ error: 'Bulunamadi.' }); if (user.role === 'ADMIN') return res.status(403).json({ error: 'Admin yasaklanamaz.' }); var nb = !user.banned; await db.banUser(userId, nb); res.json({ success: true, banned: nb }); } catch (e) { res.status(500).json({ error: 'Basarisiz.' }); } });
app.post('/api/admin/reset-leaderboard', auth, adm, async function(req, res) { try { await ensureDb(); await db.resetLeaderboard(); res.json({ success: true }); } catch (e) { res.status(500).json({ error: 'Sifirlanamadi.' }); } });
app.post('/api/admin/reset-user/:id', auth, adm, async function(req, res) { try { await ensureDb(); await db.resetUserScore(parseInt(req.params.id)); res.json({ success: true }); } catch (e) { res.status(500).json({ error: 'Sifirlanamadi.' }); } });



app.post('/api/admin/toggle-streamer/:id', auth, adm, async function(req, res) {
  try { await ensureDb(); var newVal = await db.toggleStreamer(parseInt(req.params.id)); res.json({ success: true, streamer: newVal }); }
  catch (e) { res.status(500).json({ error: 'Basarisiz.' }); }
});

app.post('/api/stream/request', auth, async function(req, res) {
  try { await ensureDb(); var result = await db.requestStreamer(req.user.id, req.user.username); if (result.error === 'already_pending') return res.status(400).json({ error: 'Zaten bekleyen basvurunuz var.' }); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: 'Basvuru gonderilemedi.' }); }
});

app.get('/api/admin/streamer-requests', auth, adm, async function(req, res) {
  try { await ensureDb(); res.json({ requests: await db.getStreamerRequests() }); }
  catch (e) { res.status(500).json({ error: 'Yuklenemedi.' }); }
});

app.post('/api/admin/approve-streamer/:id', auth, adm, async function(req, res) {
  try { await ensureDb(); await db.handleStreamerRequest(parseInt(req.params.id), true); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: 'Basarisiz.' }); }
});

app.post('/api/admin/reject-streamer/:id', auth, adm, async function(req, res) {
  try { await ensureDb(); await db.handleStreamerRequest(parseInt(req.params.id), false); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: 'Basarisiz.' }); }
});

app.post('/api/stream/youtube-init', async function(req, res) {
  try {
    var apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return res.status(400).json({ error: 'YouTube API key ayarlanmamis. Vercel env YOUTUBE_API_KEY ekleyin.' });
    var videoId = req.body.videoId;
    var r = await fetch('https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=' + videoId + '&key=' + apiKey);
    var data = await r.json();
    if (!data.items || !data.items[0] || !data.items[0].liveStreamingDetails) return res.status(400).json({ error: 'Canli yayin bulunamadi.' });
    var chatId = data.items[0].liveStreamingDetails.activeLiveChatId;
    if (!chatId) return res.status(400).json({ error: 'Chat aktif degil.' });
    res.json({ liveChatId: chatId });
  } catch (e) { res.status(500).json({ error: 'YouTube baglanti hatasi.' }); }
});

app.get('/api/stream/youtube-chat', async function(req, res) {
  try {
    var apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return res.status(400).json({ error: 'API key yok.' });
    var chatId = req.query.chatId;
    var pageToken = req.query.after || '';
    var url = 'https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=' + chatId + '&part=snippet,authorDetails&maxResults=200&key=' + apiKey;
    if (pageToken) url += '&pageToken=' + pageToken;
    var r = await fetch(url);
    var data = await r.json();
    var messages = (data.items || []).map(function(m) { return { author: m.authorDetails.displayName, text: m.snippet.displayMessage }; });
    res.json({ messages: messages, nextPageToken: data.nextPageToken || '' });
  } catch (e) { res.status(500).json({ error: 'Chat okunamadi.' }); }
});

module.exports = app;

// Notifications
app.post('/api/notifications/send', auth, adm, async function(req, res) { try { await ensureDb(); var uid = req.body.user_id; var msg = (req.body.message || '').trim(); if (!uid || !msg) return res.status(400).json({ error: 'Kullanıcı ve mesaj gerekli.' }); var id = await db.createNotification(uid, msg); res.json({ success: true, id: id }); } catch (e) { res.status(500).json({ error: 'Gönderilemedi.' }); } });
app.get('/api/notifications', auth, async function(req, res) { try { await ensureDb(); var notifs = await db.getUserNotifications(req.user.id); res.json({ notifications: notifs }); } catch (e) { res.json({ notifications: [] }); } });
app.post('/api/notifications/read', auth, async function(req, res) { try { await ensureDb(); await db.markNotificationRead(req.body.id); res.json({ success: true }); } catch (e) { res.json({ success: false }); } });

// Contact Messages
app.post('/api/contact', async function(req, res) { try { await ensureDb(); var title = (req.body.title || '').trim().substring(0, 100); var desc = (req.body.description || '').trim().substring(0, 1000); if (!title || !desc) return res.status(400).json({ error: 'Başlık ve açıklama gerekli.' }); var uid = null; var uname = 'Anonim'; try { var token = req.cookies && req.cookies.ebv_token; if (token) { var decoded = jwt.verify(token, JWT_SECRET); uid = decoded.id; uname = decoded.username; } } catch(e){} var id = await db.createContactMessage(uid, uname, title, desc); res.json({ success: true, id: id }); } catch (e) { res.status(500).json({ error: 'Gönderilemedi.' }); } });
app.get('/api/contact/messages', auth, adm, async function(req, res) { try { await ensureDb(); var msgs = await db.getAllContactMessages(); res.json({ messages: msgs }); } catch (e) { res.json({ messages: [] }); } });
app.delete('/api/contact/:id', auth, adm, async function(req, res) { try { await ensureDb(); await db.deleteContactMessage(parseInt(req.params.id)); res.json({ success: true }); } catch (e) { res.status(500).json({ error: 'Silinemedi.' }); } });

// Update user score
app.post('/api/admin/update-score', auth, adm, async function(req, res) { try { await ensureDb(); await db.updateUserScore(req.body.user_id, parseInt(req.body.score) || 0); res.json({ success: true }); } catch (e) { res.status(500).json({ error: 'Güncellenemedi.' }); } });


// Heartbeat
app.post('/api/heartbeat', auth, async function(req, res) { try { await ensureDb(); await db.updateLastActive(req.user.id); res.json({ ok: true }); } catch (e) { res.json({ ok: false }); } });

app.delete('/api/admin/users/:id', auth, adm, async function(req, res) { try { await ensureDb(); await db.deleteUser(parseInt(req.params.id)); res.json({ success: true }); } catch (e) { res.status(500).json({ error: 'Silinemedi.' }); } });

app.get('/api/discord', async function(req, res) { try { await ensureDb(); var link = await db.getDiscordLink(); res.json({ link: link }); } catch(e) { res.json({ link: '' }); } });
app.post('/api/discord', auth, adm, async function(req, res) { try { await ensureDb(); await db.setDiscordLink(req.body.link || ''); res.json({ success: true }); } catch(e) { res.status(500).json({ error: 'Kaydedilemedi.' }); } });

app.get('/api/scores/timed-leaderboard', async function(req, res) { try { await ensureDb(); var period = req.query.period || 'alltime'; var lb = await db.getTimedLeaderboard(period); res.json({ leaderboard: lb, period: period }); } catch (e) { res.status(500).json({ error: 'Yuklenemedi.' }); } });

app.get('/api/hero-image', async function(req, res) { try { await ensureDb(); var img = await db.getConfig('hero_image'); res.json({ image: img || '' }); } catch(e) { res.json({ image: '' }); } });
app.post('/api/hero-image', auth, adm, async function(req, res) { try { await ensureDb(); await db.setConfig('hero_image', req.body.image || ''); res.json({ success: true }); } catch(e) { res.status(500).json({ error: 'Kaydedilemedi.' }); } });

app.get('/api/game-names', async function(req, res) {
  try {
    await ensureDb();
    var r = await db.query("SELECT key, value FROM game_config WHERE key LIKE 'game_%'");
    var games = {};
    r.rows.forEach(function(row){ games[row.key.replace('game_','')] = row.value; });
    res.json({ games: games });
  } catch(e) { res.json({ games: {} }); }
});

app.post('/api/game-names', auth, adm, async function(req, res) {
  try {
    await ensureDb();
    var games = req.body.games || {};
    for (var key in games) {
      await db.setConfig('game_' + key, games[key]);
    }
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Kaydedilemedi.' }); }
});
