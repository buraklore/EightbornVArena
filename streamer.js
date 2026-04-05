// ═══ STREAMER GAME — Live Chat Game Mode ═══
var streamState = null;
var gameTimers = [];
window.addEventListener("load", function(){ if(typeof streamCleanup==="function") streamCleanup(); });
var chatPollTimer = null;
var roundTimer = null;
var lastChatTs = '';

function streamStart() {
  var ag = document.getElementById('ag');
  
  // Permission check
  if (!curUser) {
    ag.innerHTML = '<div style="flex:1;display:flex;align-items:center;justify-content:center"><div class="cg" style="text-align:center;padding:60px 40px;max-width:800px"><div style="font-size:80px;margin-bottom:16px">\ud83d\udd12</div><h3 class="fd" style="font-size:28px;font-weight:700;margin-bottom:12px">Giri\u015f Gerekli</h3><p style="font-size:16px;color:var(--t2);margin-bottom:20px">Streamer Game i\u00e7in giri\u015f yapmal\u0131s\u0131n.</p><button class="btn bp" style="font-size:16px;padding:12px 28px" onclick="go(\'login\')">' + 'Giri\u015f Yap</button></div></div>';
    return;
  }
  
  if (curUser.role !== 'ADMIN' && !curUser.streamer) {
    ag.innerHTML = '<div style="flex:1;display:flex;align-items:center;justify-content:center"><div class="cg" style="text-align:center;padding:60px 40px;max-width:800px"><div style="font-size:80px;margin-bottom:16px">\ud83c\udfa5</div><h3 class="fd" style="font-size:28px;font-weight:700;margin-bottom:12px">Yay\u0131nc\u0131 Yetkisi Gerekli</h3><p style="font-size:16px;color:var(--t2);margin-bottom:20px">Bu oyunu sadece yay\u0131nc\u0131 yetkisine sahip kullan\u0131c\u0131lar a\u00e7abilir.</p><button class="btn bp" style="font-size:16px;padding:12px 28px" onclick="streamerApply()">\ud83d\udce8 Yay\u0131nc\u0131 Ba\u015fvurusu Yap</button></div></div>';
    return;
  }
  ag.innerHTML = 
    '<div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0">' +
    '' +
    '<div style="width:80px;height:80px;border-radius:18px;background:rgba(232,67,62,.12);display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 12px">\ud83c\udfa5</div>' +
    '<h2 class="fd" style="font-weight:700;font-size:64px">Yay\u0131nc\u0131 Oyunlar\u0131</h2></div>' +
    '<div style="text-align:center;padding:40px 0">' +
    '<p style="font-size:18px;color:var(--t2);margin-bottom:32px">Bir oyun se\u00e7 ve canl\u0131 yay\u0131nda chat ile oyna!</p>' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:28px">' +
    '<div style="background:linear-gradient(180deg,#1e1e2a,#16161f);border:1px solid #ffffff14;border-radius:18px;padding:40px 28px;text-align:center;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.3)" onclick="streamSetup(\'QUOTE\')" onmouseover="this.style.transform=\'translateY(-6px)\';this.style.boxShadow=\'0 12px 40px #f59e0b25\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'"><div style="position:absolute;top:10px;right:10px;background:#e8433e;color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:8px;letter-spacing:.5px">\u0130NTERAKT\u0130F</div><div style="width:100px;height:100px;border-radius:20px;background:linear-gradient(135deg,#f59e0b,#eab308);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:64px">\ud83d\udcac</div><h3 style="font-size:20px;font-weight:800;margin-bottom:8px;color:#fff">Replik Bil</h3><p style="font-size:15px;color:var(--t3)">Repli\u011fi kime ait?</p></div>' +
    '<div style="background:linear-gradient(180deg,#1e1e2a,#16161f);border:1px solid #ffffff14;border-radius:18px;padding:40px 28px;text-align:center;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.3)" onclick="streamSetup(\'FACE\')" onmouseover="this.style.transform=\'translateY(-6px)\';this.style.boxShadow=\'0 12px 40px #2dd4bf25\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'"><div style="position:absolute;top:10px;right:10px;background:#e8433e;color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:8px;letter-spacing:.5px">\u0130NTERAKT\u0130F</div><div style="width:100px;height:100px;border-radius:20px;background:linear-gradient(135deg,#2dd4bf,#2dd4bf);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:64px">\ud83e\udd14</div><h3 style="font-size:20px;font-weight:800;margin-bottom:8px;color:#fff">Y\u00fczden Bil</h3><p style="font-size:15px;color:var(--t3)">Karakteri tan\u0131!</p></div>' +
    '<div style="background:linear-gradient(180deg,#1e1e2a,#16161f);border:1px solid #ffffff14;border-radius:18px;padding:40px 28px;text-align:center;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.3)" onclick="streamSetup(\'MEMORY\')" onmouseover="this.style.transform=\'translateY(-6px)\';this.style.boxShadow=\'0 12px 40px #e8433e25\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'"><div style="position:absolute;top:10px;right:10px;background:#e8433e;color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:8px;letter-spacing:.5px">\u0130NTERAKT\u0130F</div><div style="width:100px;height:100px;border-radius:20px;background:linear-gradient(135deg,#e8433e,#3b82f6);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:64px">\ud83e\udde0</div><h3 style="font-size:20px;font-weight:800;margin-bottom:8px;color:#fff">Eightborn Moruq</h3><p style="font-size:15px;color:var(--t3)">EightbornV hakk\u0131nda ne kadar bilgilisin?</p></div>' +
    '<div style="background:linear-gradient(180deg,#1e1e2a,#16161f);border:1px solid #ffffff14;border-radius:18px;padding:40px 28px;text-align:center;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.3)" onclick="streamSetup(\'STORY\')" onmouseover="this.style.transform=\'translateY(-6px)\';this.style.boxShadow=\'0 12px 40px #e8433e25\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'"><div style="position:absolute;top:10px;right:10px;background:#e8433e;color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:8px;letter-spacing:.5px">\u0130NTERAKT\u0130F</div><div style="width:100px;height:100px;border-radius:20px;background:linear-gradient(135deg,#e8433e,#e8433e);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:64px">\ud83c\udfac</div><h3 style="font-size:20px;font-weight:800;margin-bottom:8px;color:#fff">Chat Kaderini Belirler</h3><p style="font-size:15px;color:var(--t3)">Hikayeni chat belirler!</p></div>' +
    '<div style="background:linear-gradient(180deg,#1e1e2a,#16161f);border:1px solid #ffffff14;border-radius:18px;padding:40px 28px;text-align:center;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.3)" onclick="streamSetup(\'CDIE\')" onmouseover="this.style.transform=\'translateY(-6px)\';this.style.boxShadow=\'0 12px 40px #e8433e25\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'"><div style="position:absolute;top:10px;right:10px;background:#e8433e;color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:8px;letter-spacing:.5px">\u0130NTERAKT\u0130F</div><div style="width:100px;height:100px;border-radius:20px;background:linear-gradient(135deg,#e8433e,#e8433e);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:64px">\ud83d\udc80</div><h3 style="font-size:20px;font-weight:800;margin-bottom:8px;color:#fff">Kim Hayatta Kalacak</h3><p style="font-size:15px;color:var(--t3)">Chat CK\'y\u0131 belirler!</p></div>' +
    '<div style="background:linear-gradient(180deg,#1e1e2a,#16161f);border:1px solid #ffffff14;border-radius:18px;padding:40px 28px;text-align:center;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.3)" onclick="streamSetup(\'CTEAM\')" onmouseover="this.style.transform=\'translateY(-6px)\';this.style.boxShadow=\'0 12px 40px #3b82f625\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'"><div style="position:absolute;top:10px;right:10px;background:#e8433e;color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:8px;letter-spacing:.5px">\u0130NTERAKT\u0130F</div><div style="width:100px;height:100px;border-radius:20px;background:linear-gradient(135deg,#3b82f6,#06b6d4);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:64px">\ud83d\udc65</div><h3 style="font-size:20px;font-weight:800;margin-bottom:8px;color:#fff">Ekibini Kur</h3><p style="font-size:15px;color:var(--t3)">Ekibi chat belirler!</p></div>' +
    '<div style="background:linear-gradient(180deg,#1e1e2a,#16161f);border:1px solid #ffffff14;border-radius:18px;padding:40px 28px;text-align:center;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.3)" onclick="streamSetup(\'CFATE\')" onmouseover="this.style.transform=\'translateY(-6px)\';this.style.boxShadow=\'0 12px 40px #f4384825\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'"><div style="position:absolute;top:10px;right:10px;background:#e8433e;color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:8px;letter-spacing:.5px">\u0130NTERAKT\u0130F</div><div style="width:100px;height:100px;border-radius:20px;background:linear-gradient(135deg,#e8433e,#e8433e);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:64px">\ud83c\udfad</div><h3 style="font-size:20px;font-weight:800;margin-bottom:8px;color:#fff">Kaderini Se\u00e7</h3><p style="font-size:15px;color:var(--t3)">Kaderi chat belirler!</p></div>' +
    '<div class="game-card" style="border:1px solid #ffffff20;border-radius:20px;background:var(--bg2);padding:48px 40px;text-align:center;position:relative;opacity:.6"><div style="position:absolute;top:10px;right:10px;background:linear-gradient(135deg,#666,#999);color:#fff;font-size:10px;font-weight:800;padding:3px 10px;border-radius:20px">YAKINDA</div><div style="width:100px;height:100px;border-radius:20px;background:linear-gradient(135deg,#666,#444);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:64px">\ud83c\udfae</div><h3 style="font-size:20px;font-weight:800;margin-bottom:8px;color:#fff">Yay\u0131nc\u0131 Vs Chat</h3><p style="font-size:15px;color:var(--t3)">\u00c7ok yak\u0131nda!</p></div>' +
    '</div></div>';
}

function streamSetup(mode) {
  var ag = document.getElementById('ag');
  var isStory = mode === 'STORY';
  var modeNames = {QUOTE:'Replik Bil',FACE:'Yüzden Bil',MEMORY:'Eightborn Moruq',STORY:'Chat Kaderini Belirler',CDIE:'Kim Hayatta Kalacak',CTEAM:'Ekibini Kur',CFATE:'Kaderini Seç'};
  
  // Calculate max counts for dynamic options
  var repCount = chars.filter(function(c){return c.a && c.rep && c.rep.trim()}).length;
  var photoCount = chars.filter(function(c){return c.a && c.img && (c.img.startsWith('/images/')||c.img.startsWith('data:image'))}).length;
  var quizCount = memQs.length;
  var totalChars = chars.filter(function(c){return c.a}).length;
  
  var extraField = '';
  
  if (isStory) {
    extraField = '<div class="form-group" style="margin-bottom:28px"><label class="lbl" style="font-size:20px;margin-bottom:10px">👤 Karakter İsmi</label><input class="inp" style="font-size:22px;padding:20px;border-radius:16px" id="story-name" placeholder="Örn: Burak"></div>';
  } else if (mode === 'QUOTE') {
    var opts = '';
    if(repCount>=10) opts+='<option value="10">10 Replik</option>';
    if(repCount>=20) opts+='<option value="20">20 Replik</option>';
    opts+='<option value="'+repCount+'">Tümü ('+repCount+' Replik)</option>';
    extraField = '<div class="form-group" style="margin-bottom:28px"><label class="lbl" style="font-size:20px;margin-bottom:10px">💬 Replik Sayısı</label><select class="inp" style="font-size:22px;padding:20px;border-radius:16px" id="stream-count">'+opts+'</select></div>';
  } else if (mode === 'FACE') {
    var opts = '';
    if(photoCount>=10) opts+='<option value="10">10 Karakter</option>';
    if(photoCount>=20) opts+='<option value="20">20 Karakter</option>';
    opts+='<option value="'+photoCount+'">Tümü ('+photoCount+' Fotoğraf)</option>';
    extraField = '<div class="form-group" style="margin-bottom:28px"><label class="lbl" style="font-size:20px;margin-bottom:10px">🤔 Karakter Sayısı</label><select class="inp" style="font-size:22px;padding:20px;border-radius:16px" id="stream-count">'+opts+'</select></div>';
  } else if (mode === 'MEMORY') {
    var opts = '';
    if(quizCount>=10) opts+='<option value="10">10 Soru</option>';
    if(quizCount>=20) opts+='<option value="20">20 Soru</option>';
    opts+='<option value="'+quizCount+'">Tümü ('+quizCount+' Soru)</option>';
    extraField = '<div class="form-group" style="margin-bottom:28px"><label class="lbl" style="font-size:20px;margin-bottom:10px">🧠 Soru Sayısı</label><select class="inp" style="font-size:22px;padding:20px;border-radius:16px" id="stream-count">'+opts+'</select></div>';
  } else if (mode === 'CDIE' || mode === 'CTEAM') {
    var opts = '';
    if(totalChars>=16) opts+='<option value="16">16 Karakter</option>';
    if(totalChars>=32) opts+='<option value="32">32 Karakter</option>';
    if(totalChars>=64) opts+='<option value="64">64 Karakter</option>';
    opts+='<option value="'+totalChars+'">Tüm Karakterler ('+totalChars+')</option>';
    extraField = '<div class="form-group" style="margin-bottom:28px"><label class="lbl" style="font-size:20px;margin-bottom:10px">👥 Karakter Sayısı</label><select class="inp" style="font-size:22px;padding:20px;border-radius:16px" id="stream-count">'+opts+'</select></div>';
  } else if (mode === 'CFATE') {
    extraField = '<div class="form-group" style="margin-bottom:28px"><label class="lbl" style="font-size:20px;margin-bottom:10px">⚧ Cinsiyetiniz</label><select class="inp" style="font-size:22px;padding:20px;border-radius:16px" id="stream-count"><option value="M">Erkek (Karşınıza Kadın Karakterler Çıkar)</option><option value="F">Kadın (Karşınıza Erkek Karakterler Çıkar)</option></select></div>';
  }
  
  ag.innerHTML = 
    '<div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0">' +
    '' +
    '<h2 class="fd" style="font-weight:700;font-size:28px">' + modeNames[mode] + '</h2></div>' +
    '<div style="flex:1;display:flex;align-items:center;justify-content:center">' +
    '<div class="cg" style="text-align:center;padding:48px 40px;max-width:1100px;width:100%;border-radius:24px">' +
    '<div style="text-align:left;max-width:1000px;margin:0 auto">' +
    '<input type="hidden" id="stream-mode" value="' + mode + '">' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px">' +
      '<div class="form-group"><label class="lbl" style="font-size:20px;margin-bottom:10px">🌐 Platform</label>' +
      '<select class="inp" style="font-size:22px;padding:20px;border-radius:16px" id="stream-platform"><option value="youtube">▶️ YouTube</option><option value="kick">🟢 Kick</option></select></div>' +
      '<div class="form-group"><label class="lbl" style="font-size:20px;margin-bottom:10px">🔗 Yayın Linki veya Kanal Adı</label>' +
      '<input class="inp" style="font-size:22px;padding:20px;border-radius:16px" id="stream-url" placeholder="https://youtube.com/watch?v=... veya kanal adı"></div>' +
    '</div>' +
    extraField +
    '<button class="btn bp" style="width:100%;font-size:26px;padding:22px;border-radius:16px;margin-top:12px;background:linear-gradient(135deg,#e8433e,#e8433e);box-shadow:0 8px 32px #e8433e40" onclick="streamConnect()">🚀 Oyunu Başlat</button>' +
    '</div></div>';
}

async function streamConnect() {
  if(typeof checkBanned==="function"&&checkBanned())return;
  var platform = document.getElementById('stream-platform').value;
  var url = document.getElementById('stream-url').value.trim();
  var mode = document.getElementById('stream-mode').value;
  var countEl = document.getElementById('stream-count'); var count = countEl ? parseInt(countEl.value) : 10;
  
  if (!url) { toast('Yay\u0131n linki gerekli!', false); return; }
  
  // Extract channel/video info
  var channelId = '';
  if (platform === 'youtube') {
    var match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/) || url.match(/live\/([^?]+)/);
    if (match) channelId = match[1];
    else channelId = url;
  } else {
    channelId = url.replace(/https?:\/\/(www\.)?kick\.com\/?/i, '').replace(/\//g, '');
  }
  
  if (!channelId) { toast('Ge\u00e7erli bir link gir!', false); return; }
  
  // Prepare questions based on mode
  var questions = [];
  if (mode === 'QUOTE') {
    var withRep = chars.filter(function(c) { return c.a && c.rep && c.rep.trim(); });
    if (withRep.length < 4) { toast('En az 4 replikli karakter gerekli!', false); return; }
    questions = shuf(withRep).slice(0, count).map(function(c) {
      return { type: 'QUOTE', display: c.rep, answer: (c.n + ' ' + c.s).trim().toLowerCase(), answerDisplay: c.n + ' ' + c.s, character: c };
    });
  } else if (mode === 'FACE') {
    var active = chars.filter(function(c) { return c.a && c.img && (c.img.startsWith('/images/')||c.img.startsWith('data:image')); });
    if (active.length < 4) { toast('En az 4 aktif karakter gerekli!', false); return; }
    questions = shuf(active).slice(0, count).map(function(c) {
      return { type: 'FACE', display: c, answer: (c.n + ' ' + c.s).trim().toLowerCase(), answerDisplay: c.n + ' ' + c.s, character: c };
    });
  } else if (mode === 'MEMORY') {
    if (memQs.length < 4) { toast('En az 4 soru gerekli!', false); return; }
    questions = shuf([].concat(memQs)).slice(0, count).map(function(q) {
      var correctLetter = String.fromCharCode(65 + q.ci);
      return { type: 'MEMORY', display: q.q, options: q.o, correctIndex: q.ci, answer: correctLetter.toLowerCase(), answerDisplay: correctLetter + ') ' + q.o[q.ci] };
    });
  }
  
  if (mode === 'CDIE' || mode === 'CTEAM' || mode === 'CFATE') {
    var countVal = document.getElementById('stream-count').value;
    var pool = [];
    if (mode === 'CFATE') {
      var opposite = countVal === 'M' ? 'F' : 'M';
      pool = shuf(chars.filter(function(c){return c.a && c.g === opposite})).slice(0,8);
    } else {
      pool = shuf(chars.filter(function(c){return c.a})).slice(0, parseInt(countVal));
    }
    streamState = { platform:platform, channelId:channelId, mode:mode, active:true, pool:pool, alive:[].concat(pool), eliminated:[], team:[], currentPair:null, currentChar:null, votes:{}, voters:{}, voteTimer:null, phase:'READY', chatMessages:[], fates:[{id:'f1',name:'\u00d6ld\u00fcr',emoji:'\ud83d\udd2a',color:'#e8433e',chars:[]},{id:'f2',name:'Evlen',emoji:'\ud83d\udc8d',color:'#2dd4bf',chars:[]},{id:'f3',name:'\u0130hanet Et',emoji:'\ud83d\udc94',color:'#ff6b6b',chars:[]},{id:'f4',name:'Fl\u00f6rt Et',emoji:'\ud83d\ude18',color:'#ffa07a',chars:[]},{id:'f5',name:'Ghostla',emoji:'\ud83d\udc7b',color:'#888',chars:[]},{id:'f6',name:'\u00d6p',emoji:'\ud83d\udc8b',color:'#e91e90',chars:[]},{id:'f7',name:'Tokat At',emoji:'\ud83e\udd4a',color:'#ff4444',chars:[]},{id:'f8',name:'Ka\u00e7',emoji:'\ud83c\udfc3',color:'#4ecdc4',chars:[]}],passFate:{id:'f9',name:'Pas',emoji:'\u23ed\ufe0f',color:'#666',chars:[],maxUses:3,used:0},usedFates:[] };
    if (platform === 'youtube') {
      var initRes = await apiPost('/stream/youtube-init', { videoId: channelId });
      if (initRes.error) { toast('YouTube ba\u011flant\u0131 hatas\u0131: ' + initRes.error, false); return; }
      streamState.liveChatId = initRes.liveChatId;
      startChatPolling();
    } else { startKickChat(channelId); }
    if (mode==='CDIE') nextCDieRound();
    else if (mode==='CTEAM') nextCTeamRound();
    else nextCFateRound();
    return;
  }

  if (mode === 'STORY') {
    // Story mode - different flow
    streamState = { platform: platform, channelId: channelId, mode: 'STORY', active: true };
    if (platform === 'youtube') {
      var initRes = await apiPost('/stream/youtube-init', { videoId: channelId });
      if (initRes.error) { toast('YouTube ba\u011flant\u0131 hatas\u0131: ' + initRes.error, false); return; }
      streamState.liveChatId = initRes.liveChatId;
      startChatPolling();
    } else {
      startKickChat(channelId);
    }
    startStoryMode(platform, channelId);
    return;
  }
  if (questions.length === 0) { toast('Yeterli soru yok!', false); return; }
  
  streamState = {
    platform: platform,
    channelId: channelId,
    mode: mode,
    questions: questions,
    current: 0,
    scores: {},
    chatMessages: [],
    roundWinner: null,
    active: true,
    startedAt: Date.now()
  };
  
  // Connect to chat
  if (platform === 'youtube') {
    var initRes = await apiPost('/stream/youtube-init', { videoId: channelId });
    if (initRes.error) { toast('YouTube ba\u011flant\u0131 hatas\u0131: ' + initRes.error, false); return; }
    streamState.liveChatId = initRes.liveChatId;
    startChatPolling();
  } else {
    startKickChat(channelId);
  }
  
  renderStreamRound();
}

function startChatPolling() {
  if (chatPollTimer) clearInterval(chatPollTimer);
  chatPollTimer = setInterval(async function() {
    if (!streamState || !streamState.active) return;
    
    if (streamState.platform === 'youtube' && streamState.liveChatId) {
      var res = await apiGet('/stream/youtube-chat?chatId=' + streamState.liveChatId + '&after=' + encodeURIComponent(lastChatTs));
      if (res.messages) {
        res.messages.forEach(function(m) { processStreamMessage(m.author, m.text); });
        if (res.nextPageToken) lastChatTs = res.nextPageToken;
      }
    }
  }, 2000);
}

function startKickChat(channelName) {
  // Kick uses Pusher WebSocket
  var ws = new WebSocket('wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=7.6.0&flash=false');
  streamState.kickWs = ws;
  
  ws.onopen = function() {
    // First get chatroom ID
    fetch('https://kick.com/api/v2/channels/' + channelName)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.chatroom && data.chatroom.id) {
          var subMsg = JSON.stringify({ event: 'pusher:subscribe', data: { channel: 'chatrooms.' + data.chatroom.id + '.v2' } });
          ws.send(subMsg);
          streamState.kickChatroomId = data.chatroom.id;
          toast('\u2705 Kick chat ba\u011fland\u0131!');
        }
      }).catch(function() { toast('Kick kanal bulunamad\u0131', false); });
  };
  
  ws.onmessage = function(event) {
    try {
      var data = JSON.parse(event.data);
      if (data.event === 'App\\Events\\ChatMessageEvent') {
        var msgData = JSON.parse(data.data);
        processStreamMessage(msgData.sender.username, msgData.content);
      }
    } catch (e) {}
  };
  
  ws.onerror = function() { toast('Kick WebSocket hatas\u0131', false); };
}

function processStreamMessage(author, text) {
  if (!streamState || !streamState.active) return;
  if (streamState.mode === 'STORY') { processStoryChatMessage(author, text); return; }
  if (streamState.mode === 'CDIE' || streamState.mode === 'CTEAM' || streamState.mode === 'CFATE') { processChatVote(author, text); return; }
  if (streamState.roundWinner) return;
  
  var q = streamState.questions[streamState.current];
  if (!q) return;
  
  text = text.trim().toLowerCase();
  author = author.trim();
  
  // Add to visible chat
  streamState.chatMessages.push({ author: author, text: text, time: Date.now() });
  if (streamState.chatMessages.length > 30) streamState.chatMessages.shift();
  updateStreamChat();
  
  // Check answer
  var isCorrect = false;
  if (q.type === 'MEMORY') {
    isCorrect = text === q.answer;
  } else {
    // For QUOTE and FACE: check if message contains the character name
    var ans = q.answer;
    var nameParts = ans.split(' ');
    isCorrect = text === ans || (nameParts.length > 1 && text.indexOf(nameParts[0]) >= 0 && text.indexOf(nameParts[nameParts.length - 1]) >= 0);
    // Also check first name only
    if (!isCorrect && nameParts[0].length > 2) isCorrect = text === nameParts[0];
  }
  
  if (isCorrect) {
    streamState.roundWinner = author;
    if (!streamState.scores[author]) streamState.scores[author] = 0;
    streamState.scores[author]++;
    renderStreamRound();
    
    // Next round after 10 seconds
    roundTimer = setTimeout(function() {
      streamState.current++;
      streamState.roundWinner = null;
      if (streamState.current >= streamState.questions.length) {
        renderStreamFinal();
      } else {
        renderStreamRound();
      }
    }, 10000);
  }
}

function updateStreamChat() {
  var chatEl = document.getElementById('stream-chat');
  if (!chatEl) return;
  var h = '';
  var msgs = streamState.chatMessages.slice(-15);
  for (var i = 0; i < msgs.length; i++) {
    var m = msgs[i];
    var isWinner = streamState.roundWinner && m.author === streamState.roundWinner;
    h += '<div style="padding:4px 8px;font-size:13px;' + (isWinner ? 'background:#2dd4bf15;border-radius:6px' : '') + '"><b style="color:var(--v)">' + esc(m.author) + ':</b> <span style="color:var(--t2)">' + esc(m.text) + '</span>' + (isWinner ? ' <span style="color:var(--m)">\u2705</span>' : '') + '</div>';
  }
  chatEl.innerHTML = h;
  chatEl.scrollTop = chatEl.scrollHeight;
}

function renderStreamRound() {
  var s = streamState;
  var q = s.questions[s.current];
  var ag = document.getElementById('ag');
  
  var questionHtml = '';
  if (q.type === 'QUOTE') {
    var qOpts = [q.character];
    var others = chars.filter(function(c) { return c.a && c.n !== q.character.n; });
    var shuffled = shuf(others).slice(0, 3);
    qOpts = shuf(qOpts.concat(shuffled));
    questionHtml = '<div style="font-size:64px;margin-bottom:24px">\ud83d\udcac</div>' +
      '<p style="font-size:28px;font-weight:500;font-style:italic;color:var(--t1);line-height:1.5">"' + esc(q.display) + '"</p>' +
      '<p style="font-size:16px;color:var(--t3);margin-top:16px;margin-bottom:16px">Bu replik kime ait? Chat\'e yaz\u0131n!</p>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:800px;margin:0 auto">' +
      qOpts.map(function(c) { return '<div style="padding:14px;border-radius:12px;background:var(--bg3);border:1px solid var(--b1);font-size:16px;display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;border-radius:10px;overflow:hidden">' + cp(c, 36) + '</div>' + esc(c.n) + ' ' + esc(c.s) + '</div>'; }).join('') +
      '</div>';
  } else if (q.type === 'FACE') {
    var c = q.display;
    var fOpts = [c];
    var fOthers = chars.filter(function(x) { return x.a && x.n !== c.n; });
    fOpts = shuf(fOpts.concat(shuf(fOthers).slice(0, 3)));
    questionHtml = '<div style="width:500px;height:500px;border-radius:24px;overflow:hidden;margin:0 auto 20px;border:3px solid var(--b1);filter:blur(12px)">' + cp(c, 500) + '</div>' +
      '<p style="font-size:16px;color:var(--t3);margin-bottom:16px">Bu karakter kim? Chat\'e yaz\u0131n!</p>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:800px;margin:0 auto">' +
      fOpts.map(function(x) { return '<div style="padding:14px;border-radius:12px;background:var(--bg3);border:1px solid var(--b1);font-size:16px">' + esc(x.n) + ' ' + esc(x.s) + '</div>'; }).join('') +
      '</div>';
  } else if (q.type === 'MEMORY') {
    questionHtml = '<div style="font-size:64px;margin-bottom:24px">\ud83e\udde0</div>' +
      '<p style="font-size:24px;font-weight:600;color:var(--t1);margin-bottom:20px">' + esc(q.display) + '</p>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:800px;margin:0 auto">' +
      q.options.map(function(o, i) { return '<div style="padding:14px;border-radius:12px;background:var(--bg3);border:1px solid var(--b1);font-size:16px"><b style="color:var(--v)">' + String.fromCharCode(65 + i) + ')</b> ' + esc(o) + '</div>'; }).join('') +
      '</div><p style="font-size:16px;color:var(--t3);margin-top:16px">Do\u011fru \u015f\u0131kk\u0131n harfini chat\'e yaz\u0131n! (A, B, C veya D)</p>';
  }
  
  var winnerHtml = '';
  if (s.roundWinner) {
    winnerHtml = '<div style="margin-top:20px;padding:16px;border-radius:14px;background:#2dd4bf15;border:1px solid #2dd4bf30">' +
      '<div style="font-size:32px;margin-bottom:8px">\ud83c\udfc6</div>' +
      '<p style="font-size:20px;font-weight:700;color:var(--m)">' + esc(s.roundWinner) + ' kazand\u0131!</p>' +
      '<p style="font-size:16px;color:var(--t2)">Do\u011fru cevap: ' + esc(q.answerDisplay) + '</p>' +
      '<p style="font-size:14px;color:var(--t3);margin-top:8px">Yeni soru 10 saniye sonra...</p></div>';
  }
  
  // Build scoreboard
  var sorted = Object.keys(s.scores).sort(function(a, b) { return s.scores[b] - s.scores[a]; });
  var scoreHtml = '<div style="font-size:14px;font-weight:700;color:var(--t2);margin-bottom:8px">\ud83c\udfc6 Skor Tablosu</div>';
  if (sorted.length === 0) {
    scoreHtml += '<p style="font-size:15px;color:var(--t3)">Hen\u00fcz kimse puan almad\u0131</p>';
  } else {
    for (var i = 0; i < Math.min(sorted.length, 10); i++) {
      var medal = i < 3 ? ['\ud83e\udd47', '\ud83e\udd48', '\ud83e\udd49'][i] : (i + 1) + '.';
      scoreHtml += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px"><span>' + medal + ' ' + esc(sorted[i]) + '</span><span style="color:var(--m);font-weight:700">' + s.scores[sorted[i]] + '</span></div>';
    }
  }
  
  ag.innerHTML = 
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 20px">' +
    '<div style="display:flex;align-items:center;gap:12px"><button class="btn bg bsm" onclick="streamStop()">\u2190 Bitir</button>' +
    '<div class="gi" style="background:linear-gradient(135deg,#ff0000,#cc0000);width:44px;height:44px;font-size:20px">\ud83c\udfa5</div>' +
    '<span class="fd" style="font-weight:700;font-size:20px">Streamer Game</span></div>' +
    '<div style="display:flex;align-items:center;gap:8px"><span style="font-size:14px;color:var(--t3)">Soru</span><span class="badge bv" style="font-size:16px">' + (s.current + 1) + '/' + s.questions.length + '</span>' +
    '<span class="badge" style="background:#ff000020;color:#ff4444;font-size:12px">\ud83d\udd34 CANLI</span></div></div>' +
    
    '<div style="display:flex;gap:16px;padding:0 20px;flex:1;min-height:0">' +
    
    // Left: Question area
    '<div style="flex:1;display:flex;align-items:center;justify-content:center">' +
    '<div class="cg" style="text-align:center;padding:40px;width:100%">' +
    questionHtml + winnerHtml +
    '</div></div>' +
    
    // Right: Chat + Scoreboard side by side
    '<div style="width:580px;display:flex;gap:12px;flex-shrink:0">' +
    '<div style="flex:1;background:var(--bg2);border-radius:14px;border:1px solid var(--b1);display:flex;flex-direction:column;overflow:hidden">' +
    '<div style="padding:10px 14px;border-bottom:1px solid var(--b1);font-size:13px;font-weight:600;color:var(--t2)">\ud83d\udcac Canl\u0131 Chat</div>' +
    '<div id="stream-chat" style="flex:1;overflow-y:auto;padding:8px;max-height:400px"></div></div>' +
    '<div style="width:210px;background:var(--bg2);border-radius:14px;border:1px solid var(--b1);padding:14px;flex-shrink:0">' +
    scoreHtml + '</div></div>' +
    
    '</div>';
  
  updateStreamChat();
}

function renderStreamFinal() {
  var s = streamState;
  var ag = document.getElementById('ag');
  
  var sorted = Object.keys(s.scores).sort(function(a, b) { return s.scores[b] - s.scores[a]; });
  
  var podium = '';
  for (var i = 0; i < Math.min(sorted.length, 10); i++) {
    var medals = ['\ud83e\udd47', '\ud83e\udd48', '\ud83e\udd49'];
    var colors = ['var(--g)', '#d1d5db', '#b45309'];
    podium += '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-radius:12px;margin-bottom:8px;background:' + (i < 3 ? 'var(--bg3)' : 'transparent') + ';border:1px solid var(--b1)">' +
      '<div style="display:flex;align-items:center;gap:12px"><span style="font-size:' + (i < 3 ? '28px' : '18px') + '">' + (i < 3 ? medals[i] : (i + 1) + '.') + '</span><span style="font-size:' + (i < 3 ? '20px' : '16px') + ';font-weight:' + (i < 3 ? '700' : '500') + '">' + esc(sorted[i]) + '</span></div>' +
      '<span style="font-size:' + (i < 3 ? '24px' : '18px') + ';font-weight:700;color:var(--m)">' + s.scores[sorted[i]] + ' puan</span></div>';
  }
  
  ag.innerHTML = 
    '<div style="flex:1;display:flex;align-items:center;justify-content:center">' +
    '<div class="cg" style="text-align:center;padding:40px;max-width:700px;width:100%">' +
    '<div style="font-size:80px;margin-bottom:16px">\ud83c\udfc6</div>' +
    '<h2 class="fd" style="font-size:64px;font-weight:700;margin-bottom:8px">Oyun Bitti!</h2>' +
    '<p style="font-size:18px;color:var(--t2);margin-bottom:24px">' + s.questions.length + ' soru tamamland\u0131</p>' +
    (sorted.length > 0 ? '<div style="text-align:left;max-width:800px;margin:0 auto">' + podium + '</div>' : '<p style="font-size:16px;color:var(--t3)">Kimse puan alamad\u0131</p>') +
    '<button class="btn bp" style="margin-top:24px;font-size:16px;padding:12px 28px" onclick="streamStop()">Ana Sayfaya D\u00f6n</button>' +
    '</div></div>';
  
  streamCleanup();
}

function streamStop() {
  streamCleanup();
  bk();
}

function streamCleanup() {
  gameTimers.forEach(function(t){clearTimeout(t);}); gameTimers=[];
  if (chatPollTimer) { clearInterval(chatPollTimer); chatPollTimer = null; }
  if (typeof storyTimer!=='undefined'&&storyTimer) { clearInterval(storyTimer); storyTimer=null; }
  if (typeof storyVoteTimer!=='undefined'&&storyVoteTimer) { clearInterval(storyVoteTimer); storyVoteTimer=null; }
  if (typeof roundTimer!=='undefined'&&roundTimer) { clearTimeout(roundTimer); roundTimer=null; }
  if (roundTimer) { clearTimeout(roundTimer); roundTimer = null; }
  if (streamState && streamState.kickWs) { streamState.kickWs.close(); }
  if (streamState && streamState.voteTimer) { clearInterval(streamState.voteTimer); }
  if (streamState) streamState.active = false;
  streamState = null;
  lastChatTs = '';
}


function streamerApply() {
  apiRequestStreamer().then(function(r) {
    if (r.error) { toast(r.error, false); return; }
    toast('Ba\u015fvurun g\u00f6nderildi! Admin onay\u0131 bekleniyor.');
    var ag = document.getElementById('ag');
    ag.innerHTML = '<div style="flex:1;display:flex;align-items:center;justify-content:center"><div class="cg" style="text-align:center;padding:60px 40px;max-width:800px"><div style="font-size:80px;margin-bottom:16px">\u2705</div><h3 class="fd" style="font-size:28px;font-weight:700;margin-bottom:12px">Ba\u015fvuru G\u00f6nderildi</h3><p style="font-size:16px;color:var(--t2)">Admin onaylad\u0131\u011f\u0131nda Streamer Game\u2019i a\u00e7abileceksin.</p></div></div>';
  });
}

// ═══ CHAT VOTE PROCESSING ═══
function processChatVote(author, text) {
  var s = streamState;
  if (!s || !s.active || s.phase !== 'VOTING') return;
  text = text.trim().toUpperCase();
  s.chatMessages.push({author:author,text:text,time:Date.now()});
  if (s.chatMessages.length > 50) s.chatMessages.shift();
  updateChatPanel();
  if (s.voters[author]) return; // already voted

  if (s.mode === 'CDIE') {
    if (text === 'A' || text === 'B') { s.voters[author] = text; s.votes[text] = (s.votes[text]||0)+1; updateCVoteBar(); }
  } else if (s.mode === 'CTEAM') {
    if (text === 'A' || text === 'B') { s.voters[author] = text; s.votes[text] = (s.votes[text]||0)+1; updateCVoteBar(); }
  } else if (s.mode === 'CFATE') {
    var fateMap = {};
    s.fates.forEach(function(f,i){ fateMap[String(i+1)] = f.id; });
    var nameMap = {'OLDUR':'Öldür','EVLEN':'Evlen','IHANET':'İhanet Et','FLORT':'Flört Et','GHOST':'Ghostla','OP':'Öp','TOKAT':'Tokat At','KAC':'Kaç','ÖLDÜR':'Öldür','İHANET':'İhanet Et','FLÖRT':'Flört Et','GHOSTLA':'Ghostla','ÖP':'Öp','KAÇ':'Kaç','PAS':'Pas'};
    // Add Pas as last option
    var pasAvail = s.passFate && s.passFate.used < s.passFate.maxUses;
    if (pasAvail) fateMap[String(s.fates.length+1)] = 'f9';
    var fName = nameMap[text];
    if (fName === 'Pas' && pasAvail) { fateMap[text] = 'f9'; }
    else if (fName) { var mf = s.fates.find(function(f){return f.name === fName}); if(mf) fateMap[text] = mf.id; }
    var key = fateMap[text];
    var validKeys = s.fates.map(function(f){return f.id});
    if (pasAvail) validKeys.push('f9');
    if (key && validKeys.indexOf(key) >= 0) { s.voters[author] = key; s.votes[key] = (s.votes[key]||0)+1; updateCFateVoteBar(); }
  }
}

function updateCVoteBar() {
  var s = streamState;
  var a = s.votes['A']||0, b = s.votes['B']||0, total = a+b||1;
  var pA = Math.round(a/total*100), pB = Math.round(b/total*100);
  var bar = document.getElementById('cvote-bar');
  if (bar) bar.innerHTML = '<div style="display:flex;border-radius:12px;overflow:hidden;height:48px;font-weight:700;font-size:20px"><div style="background:#3b82f6;width:'+Math.max(pA,5)+'%;display:flex;align-items:center;justify-content:center;color:#fff;transition:width .3s">A '+pA+'%</div><div style="background:#f59e0b;width:'+Math.max(pB,5)+'%;display:flex;align-items:center;justify-content:center;color:#fff;transition:width .3s">B '+pB+'%</div></div><div style="text-align:center;font-size:14px;color:var(--t3);margin-top:6px">Toplam: '+total+' oy</div>';
  var stats = document.getElementById('cvote-stats');
  if (stats) stats.innerHTML = '<div style="padding:12px;border-radius:10px;background:#3b82f615;border:1px solid #3b82f630;margin-bottom:8px"><div style="font-size:16px;font-weight:700;color:#3b82f6">A) '+pA+'%</div><div style="height:6px;background:var(--bg3);border-radius:3px;margin-top:6px"><div style="height:100%;background:#3b82f6;border-radius:3px;width:'+pA+'%;transition:width .3s"></div></div><div style="font-size:12px;color:var(--t3);margin-top:4px">'+a+' oy</div></div><div style="padding:12px;border-radius:10px;background:#f59e0b15;border:1px solid #f59e0b30"><div style="font-size:16px;font-weight:700;color:#f59e0b">B) '+pB+'%</div><div style="height:6px;background:var(--bg3);border-radius:3px;margin-top:6px"><div style="height:100%;background:#f59e0b;border-radius:3px;width:'+pB+'%;transition:width .3s"></div></div><div style="font-size:12px;color:var(--t3);margin-top:4px">'+b+' oy</div></div>';
}

function updateCFateVoteBar() {
  var s = streamState;
  var bar = document.getElementById('cvote-bar');
  var stats = document.getElementById('cvote-stats');
  if (!bar && !stats) return;
  var fates = s.fates.concat(s.passFate && s.passFate.used < s.passFate.maxUses ? [s.passFate] : []);
  var total = 0;
  fates.forEach(function(f){ total += (s.votes[f.id]||0); });
  if (total === 0) total = 1;
  if (bar) {
    var html = '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">';
    fates.forEach(function(f){
      var count = s.votes[f.id]||0;
      var pct = Math.round(count/total*100);
      html += '<div style="padding:6px 12px;border-radius:8px;background:'+f.color+'20;border:2px solid '+f.color+'40;font-size:14px;font-weight:600;color:'+f.color+'">'+f.emoji+' '+pct+'%</div>';
    });
    html += '</div><div style="text-align:center;font-size:13px;color:var(--t3);margin-top:6px">Toplam: '+(total===1?0:total)+' oy</div>';
    bar.innerHTML = html;
  }
  if (stats) {
    var shtml = '';
    fates.forEach(function(f){
      var count = s.votes[f.id]||0;
      var pct = Math.round(count/total*100);
      shtml += '<div style="padding:8px;border-radius:8px;background:'+f.color+'10;border:1px solid '+f.color+'25;margin-bottom:6px"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;color:'+f.color+'"><span>'+f.emoji+' '+f.name+'</span><span>'+pct+'%</span></div><div style="height:4px;background:var(--bg3);border-radius:2px;margin-top:4px"><div style="height:100%;background:'+f.color+';border-radius:2px;width:'+pct+'%;transition:width .3s"></div></div></div>';
    });
    stats.innerHTML = shtml;
  }
}

function startCVoteTimer(seconds, callback) {
  var s = streamState;
  s.phase = 'VOTING';
  s.votes = {};
  s.voters = {};
  var remaining = seconds;
  var timerEl = document.getElementById('cvote-timer');
  if (s.voteTimer) clearInterval(s.voteTimer);
  s.voteTimer = setInterval(function(){
    remaining--;
    if (timerEl) timerEl.textContent = remaining + 's';
    if (remaining <= 0) {
      clearInterval(s.voteTimer);
      s.phase = 'RESULT';
      callback();
    }
  }, 1000);
}

// ═══ KIM HAYATTA KALACAK (CHAT) ═══
function nextCDieRound() {
  var s = streamState;
  if (!s || !s.active) return;
  if (s.alive.length <= 1) { renderCDieWinner(); return; }
  var pair = s.alive.splice(0, 2);
  if (pair.length < 2) { s.alive = s.alive.concat(pair); renderCDieWinner(); return; }
  s.currentPair = pair;
  s.chatMessages = [];
  var c1 = pair[0], c2 = pair[1];
  var ag = document.getElementById('ag');
  ag.innerHTML =
    '<div style="display:flex;gap:20px;padding:20px">'+
    '<div style="flex:1">'+
      '<h2 class="fd" style="font-size:28px;margin-bottom:6px;text-align:center">💀 Kim Hayatta Kalacak</h2>'+
      '<p style="color:var(--t2);font-size:16px;text-align:center;margin-bottom:6px">'+(s.alive.length+2)+' karakter · Eleme '+(s.eliminated.length+1)+'</p>'+
      '<p style="color:var(--pk);font-size:18px;font-weight:700;text-align:center;margin-bottom:16px">A veya B yaz!</p>'+
      '<div style="display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:16px">'+
        '<div class="cg sci" style="width:380px;padding:24px;text-align:center"><div style="font-size:24px;color:#3b82f6;font-weight:800;margin-bottom:8px">A) CK\'la</div><div style="max-width:350px;border-radius:14px;overflow:hidden;margin:0 auto 10px">'+cp(c1,350)+'</div><h3 class="fd" style="font-size:24px">'+esc(c1.n)+' '+esc(c1.s)+'</h3></div>'+
        '<div class="t-vs fl fd" style="background:linear-gradient(135deg,#e8433e30,#e8433e10);border-color:#e8433e40;font-size:20px">VS</div>'+
        '<div class="cg sci" style="width:380px;padding:24px;text-align:center"><div style="font-size:24px;color:#f59e0b;font-weight:800;margin-bottom:8px">B) CK\'la</div><div style="max-width:350px;border-radius:14px;overflow:hidden;margin:0 auto 10px">'+cp(c2,350)+'</div><h3 class="fd" style="font-size:24px">'+esc(c2.n)+' '+esc(c2.s)+'</h3></div>'+
      '</div>'+
      '<div id="cvote-bar" style="max-width:500px;margin:0 auto 12px"></div>'+
      '<div style="font-size:40px;font-weight:800;color:var(--pk);text-align:center" id="cvote-timer">20s</div>'+
    '</div>'+
    '<div style="width:300px;flex-shrink:0">'+
      '<div class="cg" style="margin-bottom:12px;padding:16px"><h4 style="font-size:14px;color:var(--m);margin-bottom:10px">📊 Oy Dağılımı</h4><div id="cvote-stats"></div></div>'+
      '<div class="cg" style="padding:16px" id="chat-panel"><h4 style="font-size:14px;color:var(--pk);margin-bottom:8px">💬 Chat</h4><div id="chat-msgs" style="height:300px;overflow-y:auto;font-size:13px"></div></div>'+
    '</div>'+
    '</div>';
  startCVoteTimer(20, function(){ resolveCDieVote(); });
}

function resolveCDieVote() {
  var s = streamState;
  if (!s || !s.active) return;
  var a = s.votes['A']||0, b = s.votes['B']||0;
  var deadIdx = (a >= b) ? 0 : 1;
  if (a === 0 && b === 0) deadIdx = Math.random() < 0.5 ? 0 : 1;
  var dead = s.currentPair[deadIdx];
  var alive = s.currentPair[1-deadIdx];
  s.eliminated.push(dead);
  s.alive.push(alive);
  s.alive = shuf(s.alive);

  var ag = document.getElementById('ag');
  ag.innerHTML = '<div style="text-align:center;padding:60px"><div style="font-size:64px;margin-bottom:16px">💀</div><h2 class="fd" style="font-size:40px;color:var(--pk)">'+esc(dead.n)+' '+esc(dead.s)+' CK yedi!</h2><p style="font-size:20px;color:var(--t2);margin-top:12px">A: '+(s.votes['A']||0)+' oy — B: '+(s.votes['B']||0)+' oy</p><p style="color:var(--m);font-size:18px;margin-top:8px">'+s.alive.length+' karakter kaldı</p></div>';
  gameTimers.push(setTimeout(function(){ if(streamState&&streamState.active) nextCDieRound(); }, 3000));
}

function renderCDieWinner() {
  var s = streamState;
  s.active = false;
  var w = s.alive[0] || s.pool[0];
  var ag = document.getElementById('ag');
  ag.innerHTML = '<div style="text-align:center;padding:40px"><div style="font-size:80px;margin-bottom:16px">🏆</div><h2 class="fd" style="font-size:48px;color:var(--m)">Son Hayatta Kalan!</h2><div style="max-width:500px;border-radius:20px;overflow:hidden;margin:20px auto;border:3px solid var(--m)">'+cp(w,500)+'</div><h3 class="fd" style="font-size:40px;margin-top:16px">'+esc(w.n)+' '+esc(w.s)+'</h3><p style="color:var(--t2);font-size:20px;margin-top:12px">'+s.pool.length+' karakterden chat\'in seçtiği hayatta kalan!</p><button class="btn bp" style="margin-top:24px;font-size:20px;padding:16px 40px" onclick="streamStart()">🔄 Ana Menü</button></div>';
}

// ═══ EKİBİNİ KUR (CHAT) ═══
function nextCTeamRound() {
  var s = streamState;
  if (!s || !s.active) return;
  if (s.team.length >= 8 || s.alive.length === 0) { renderCTeamResult(); return; }
  s.currentChar = s.alive.shift();
  s.chatMessages = [];
  var c = s.currentChar;
  var ag = document.getElementById('ag');
  ag.innerHTML =
    '<div style="display:flex;gap:16px;padding:20px">'+
    '<div style="width:220px;flex-shrink:0" class="cg"><h4 style="font-size:14px;color:var(--m);margin-bottom:10px">✅ Ekip ('+s.team.length+'/8)</h4>'+
      (s.team.length > 0 ? s.team.map(function(t){return '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><div style="width:32px;height:32px;border-radius:6px;overflow:hidden">'+cp(t,32)+'</div><span style="font-size:12px">'+esc(t.n)+'</span></div>';}).join('') : '<p style="font-size:12px;color:var(--t3)">Henüz kimse yok</p>')+
      '<div style="border-top:1px solid var(--b1);margin-top:10px;padding-top:10px"><h4 style="font-size:14px;color:var(--pk);margin-bottom:10px">💀 CK Yiyenler ('+s.eliminated.length+')</h4>'+
      (s.eliminated.length > 0 ? s.eliminated.slice(-8).map(function(t){return '<div style="font-size:11px;color:var(--t3);margin-bottom:4px;opacity:.6">☠️ '+esc(t.n)+'</div>';}).join('') : '<p style="font-size:12px;color:var(--t3)">-</p>')+
    '</div></div>'+
    '<div style="flex:1;text-align:center">'+
      '<h2 class="fd" style="font-size:28px;margin-bottom:6px">👥 Ekibini Kur — Chat</h2>'+
      '<p style="color:var(--m);font-size:18px;font-weight:700;margin-bottom:16px">A = Ekibe Al ✅ · B = CK Ver 💀</p>'+
      '<div class="cg sci" style="max-width:500px;margin:0 auto;padding:24px">'+
        '<div style="max-width:400px;border-radius:14px;overflow:hidden;margin:0 auto 12px">'+cp(c,400)+'</div>'+
        '<h3 class="fd" style="font-size:28px">'+esc(c.n)+' '+esc(c.s)+'</h3>'+
      '</div>'+
      '<div style="display:flex;gap:16px;justify-content:center;margin:16px 0"><div style="padding:12px 32px;border-radius:12px;background:#2dd4bf20;border:2px solid #2dd4bf40;font-size:20px;font-weight:700;color:var(--m)">A) Ekibe Al ✅</div><div style="padding:12px 32px;border-radius:12px;background:#e8433e20;border:2px solid #e8433e40;font-size:20px;font-weight:700;color:var(--pk)">B) CK Ver 💀</div></div>'+
      '<div id="cvote-bar" style="max-width:500px;margin:0 auto 12px"></div>'+
      '<div style="font-size:40px;font-weight:800;color:var(--pk)" id="cvote-timer">20s</div>'+
    '</div>'+
    '<div style="width:280px;flex-shrink:0">'+
      '<div class="cg" style="margin-bottom:12px;padding:16px"><h4 style="font-size:14px;color:var(--m);margin-bottom:10px">📊 Oy Dağılımı</h4><div id="cvote-stats"></div></div>'+
      '<div class="cg" style="padding:16px" id="chat-panel"><h4 style="font-size:14px;color:var(--pk);margin-bottom:8px">💬 Chat</h4><div id="chat-msgs" style="height:250px;overflow-y:auto;font-size:13px"></div></div>'+
    '</div>'+
    '</div>';
  startCVoteTimer(20, function(){ resolveCTeamVote(); });
}

function resolveCTeamVote() {
  var s = streamState;
  if (!s || !s.active) return;
  var a = s.votes['A']||0, b = s.votes['B']||0;
  var action = (a >= b) ? 'TEAM' : 'CK';
  if (a === 0 && b === 0) action = Math.random() < 0.5 ? 'TEAM' : 'CK';
  
  if (action === 'TEAM' && s.team.length < 8) {
    s.team.push(s.currentChar);
    showCNotif('✅', esc(s.currentChar.n)+' ekibe katıldı!', true);
  } else {
    s.eliminated.push(s.currentChar);
    showCNotif('💀', esc(s.currentChar.n)+' CK yedi!', false);
  }
  gameTimers.push(setTimeout(function(){ if(streamState&&streamState.active) nextCTeamRound(); }, 2500));
}

function renderCTeamResult() {
  var s = streamState;
  s.active = false;
  var ag = document.getElementById('ag');
  ag.innerHTML = '<div style="text-align:center;padding:40px"><div style="font-size:80px;margin-bottom:16px">🏆</div><h2 class="fd" style="font-size:44px;color:var(--m)">Chat\'in Seçtiği Ekip!</h2><div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin:24px auto;max-width:1200px">'+s.team.map(function(c){return '<div class="cg" style="width:250px;padding:16px;text-align:center"><div style="border-radius:12px;overflow:hidden;margin-bottom:8px">'+cp(c,250)+'</div><h4 class="fd" style="font-size:18px">'+esc(c.n)+' '+esc(c.s)+'</h4></div>';}).join('')+'</div><p style="color:var(--t2);font-size:18px;margin-top:16px">'+s.eliminated.length+' karakter CK yedi!</p><button class="btn bp" style="margin-top:24px;font-size:20px;padding:16px 40px" onclick="streamStart()">🔄 Ana Menü</button></div>';
}

// ═══ KADERİNİ SEÇ (CHAT) ═══
function nextCFateRound() {
  var s = streamState;
  if (!s || !s.active) return;
  if (s.alive.length === 0) { renderCFateResult(); return; }
  s.currentChar = s.alive.shift();
  s.chatMessages = [];
  var c = s.currentChar;
  var ag = document.getElementById('ag');
  ag.innerHTML =
    '<div style="display:flex;gap:20px;padding:20px">'+
    '<div style="flex:1;text-align:center">'+
      '<h2 class="fd" style="font-size:28px;margin-bottom:6px">🎭 Kaderini Seç — Chat</h2>'+
      '<p style="color:var(--t2);font-size:16px;margin-bottom:6px">'+(s.pool.length - s.alive.length)+'/'+s.pool.length+' kader belirlendi</p>'+
      '<p style="color:var(--pk);font-size:16px;font-weight:700;margin-bottom:16px">1-8 arası yaz veya kader adını yaz!</p>'+
      '<div class="cg sci" style="max-width:500px;margin:0 auto;padding:24px">'+
        '<div style="max-width:400px;border-radius:14px;overflow:hidden;margin:0 auto 12px">'+cp(c,400)+'</div>'+
        '<h3 class="fd" style="font-size:28px">'+esc(c.n)+' '+esc(c.s)+'</h3>'+
      '</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:16px 0">'+
      s.fates.map(function(f,i){return '<div style="padding:8px 14px;border-radius:8px;background:'+f.color+'15;border:2px solid '+f.color+'30;font-size:15px;font-weight:600;color:'+f.color+'">'+(i+1)+') '+f.emoji+' '+f.name+'</div>';}).join('')+(s.passFate&&s.passFate.used<s.passFate.maxUses?'<div style="padding:8px 14px;border-radius:8px;background:#66615;border:2px solid #66630;font-size:15px;font-weight:600;color:#666">'+(s.fates.length+1)+') ⏭️ Pas ('+s.passFate.used+'/'+s.passFate.maxUses+')</div>':'')+
    (s.usedFates&&s.usedFates.length>0?'<div style="margin-top:8px;font-size:12px;color:var(--t3)">Kullanılan: '+s.usedFates.map(function(f){return f.emoji+' '+f.name}).join(', ')+'</div>':'')+
      '</div>'+
      '<div id="cvote-bar" style="max-width:700px;margin:0 auto 12px"></div>'+
      '<div style="font-size:40px;font-weight:800;color:var(--pk)" id="cvote-timer">20s</div>'+
    '</div>'+
    '<div style="width:300px;flex-shrink:0">'+
      '<div class="cg" style="margin-bottom:12px;padding:16px"><h4 style="font-size:14px;color:var(--m);margin-bottom:10px">📊 Oy Dağılımı</h4><div id="cvote-stats"></div></div>'+
      '<div class="cg" style="padding:16px" id="chat-panel"><h4 style="font-size:14px;color:var(--pk);margin-bottom:8px">💬 Chat</h4><div id="chat-msgs" style="height:250px;overflow-y:auto;font-size:13px"></div></div>'+
    '</div>'+
    '</div>';
  startCVoteTimer(20, function(){ resolveCFateVote(); });
}

function resolveCFateVote() {
  var s = streamState;
  if (!s || !s.active) return;
  // Include Pas in voting if still available
  var allOpts = s.fates.slice();
  if (s.passFate && s.passFate.used < s.passFate.maxUses) allOpts.push(s.passFate);
  var maxVote = 0, maxFate = allOpts[0];
  allOpts.forEach(function(f){
    var v = s.votes[f.id]||0;
    if (v > maxVote) { maxVote = v; maxFate = f; }
  });
  if (maxVote === 0) maxFate = allOpts[Math.floor(Math.random()*allOpts.length)];
  
  if (maxFate.id === 'f9') {
    s.passFate.used++;
    s.passFate.chars.push(s.currentChar);
    showCNotif('⏭️', esc(s.currentChar.n)+' pas geçildi! ('+s.passFate.used+'/'+s.passFate.maxUses+')', true);
  } else {
    maxFate.chars.push(s.currentChar);
    s.usedFates.push({id:maxFate.id, name:maxFate.name, emoji:maxFate.emoji, color:maxFate.color, chars:maxFate.chars.slice()});
    s.fates = s.fates.filter(function(f){ return f.id !== maxFate.id; });
    showCNotif(maxFate.emoji, esc(s.currentChar.n)+' → '+maxFate.name+'!', true);
  }
  gameTimers.push(setTimeout(function(){ if(streamState&&streamState.active) nextCFateRound(); }, 2500));
}

function renderCFateResult() {
  var s = streamState;
  s.active = false;
  var ag = document.getElementById('ag');
  var allFates = s.usedFates.concat(s.fates);
  var assignedCount = s.usedFates.filter(function(f){return f.chars.length > 0}).length;
  var pasCount = s.passFate ? s.passFate.chars.length : 0;
  
  var html = '<div style="flex:1;display:flex;align-items:center;justify-content:center">' +
    '<div class="cg" style="text-align:center;padding:48px 36px;max-width:1000px;width:100%;position:relative;overflow:hidden">' +
    '<div style="font-size:100px;margin-bottom:12px">🎭</div>' +
    '<h2 class="fd" style="font-size:44px;font-weight:700">Chat\'in Belirlediği Kaderler!</h2>' +
    '<p style="font-size:18px;color:var(--t2);margin-top:8px">'+assignedCount+' kader atandı'+(pasCount > 0 ? ' · '+pasCount+' pas' : '')+'</p>' +
    '<div style="margin-top:28px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px;max-width:800px;margin-left:auto;margin-right:auto">';
  
  s.usedFates.forEach(function(f){
    if (f.chars.length > 0) {
      f.chars.forEach(function(c){
        html += '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;background:'+f.color+'10;border:1px solid '+f.color+'25;text-align:left">' +
          '<span style="font-size:32px">'+f.emoji+'</span>' +
          '<div style="flex:1"><div style="font-size:16px;font-weight:700;color:'+f.color+'">'+f.name+'</div>' +
          '<div style="font-size:14px;color:var(--t1);margin-top:2px">'+esc(c.n)+' '+esc(c.s)+'</div></div>' +
          '<div style="width:60px;height:60px;border-radius:12px;overflow:hidden">'+cp(c,60)+'</div></div>';
      });
    }
  });
  
  if (pasCount > 0) {
    s.passFate.chars.forEach(function(c){
      html += '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;background:#66610;border:1px solid #66625;text-align:left">' +
        '<span style="font-size:32px">⏭️</span>' +
        '<div style="flex:1"><div style="font-size:16px;font-weight:700;color:#666">Pas</div>' +
        '<div style="font-size:14px;color:var(--t1);margin-top:2px">'+esc(c.n)+' '+esc(c.s)+'</div></div>' +
        '<div style="width:60px;height:60px;border-radius:12px;overflow:hidden">'+cp(c,60)+'</div></div>';
    });
  }
  
  html += '</div><div style="display:flex;justify-content:center;gap:12px;margin-top:32px">' +
    '<button class="btn bp" style="font-size:20px;padding:16px 40px" onclick="streamStart()">🔄 Ana Menü</button></div></div></div>';
  ag.innerHTML = html;
}

// ═══ CHAT PANEL UPDATE ═══
function updateChatPanel() {
  var s = streamState;
  if (!s) return;
  var el = document.getElementById('chat-msgs');
  if (!el) return;
  var msgs = s.chatMessages.slice(-20);
  el.innerHTML = msgs.map(function(m){
    var color = '#fff';
    if (m.text === 'A') color = '#3b82f6';
    else if (m.text === 'B') color = '#f59e0b';
    else color = '#e8433e';
    return '<div style="padding:4px 0;border-bottom:1px solid #ffffff08"><span style="color:var(--t3);font-weight:600">'+esc(m.author)+':</span> <span style="color:'+color+';font-weight:700">'+esc(m.text)+'</span></div>';
  }).join('');
  el.scrollTop = el.scrollHeight;
}

// ═══ NOTIFICATION ═══
function showCNotif(emoji, text, isGood) {
  var old = document.getElementById('c-notif');
  if (old) old.remove();
  var n = document.createElement('div');
  n.id = 'c-notif';
  var bg = isGood ? 'rgba(6,214,160,0.2)' : 'rgba(247,37,133,0.2)';
  var border = isGood ? 'rgba(6,214,160,0.4)' : 'rgba(247,37,133,0.4)';
  var color = isGood ? '#2dd4bf' : '#e8433e';
  n.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;padding:24px 48px;border-radius:20px;background:'+bg+';border:2px solid '+border+';backdrop-filter:blur(12px)';
  n.innerHTML = '<div style="font-size:56px;margin-bottom:8px">'+emoji+'</div><div style="font-size:28px;font-weight:700;color:'+color+'">'+text+'</div>';
  document.body.appendChild(n);
  gameTimers.push(setTimeout(function(){ var el = document.getElementById('c-notif'); if (el) el.remove(); }, 2000));
}
