// ═══════════════════════════════════════════════════
// İLK KİM CK YER — 1v1 ELIMINATION FORMAT
// ═══════════════════════════════════════════════════
let dState = null;

function dieStart() {
  if(typeof checkBanned==="function"&&checkBanned())return;

  const active = chars.filter(c => c.a);
  const sizes = [16, 32, 64, 128].filter(s => s <= active.length);
  
  const ag = document.getElementById('ag');
  ag.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0">
      
      <div class="gi" style="background:linear-gradient(135deg,#e8433e,#e8433e);width:72px;height:72px;font-size:36px">💀</div>
      <h2 class="fd" style="font-weight:700;font-size:36px">Kim Hayatta Kalacak</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg" style="text-align:center;padding:60px 40px;max-width:1100px;width:100%">
        <div style="font-size:120px;margin-bottom:20px">💀</div>
        <h3 class="fd" style="font-size:48px;font-weight:700;margin-bottom:14px">Kim Hayatta Kalacak</h3>
        <p style="font-size:20px;color:var(--t2);margin-bottom:10px">Her seferde 2 karakter karşına çıkar. Birini CK'la, diğeri hayatta kalır.<br>Son 1 kişi kalana kadar devam!</p>
        <p style="font-size:18px;color:var(--t3);margin-bottom:32px">${active.length} aktif karakter mevcut</p>
        <div style="display:grid;grid-template-columns:repeat(${Math.min(sizes.length, 4)},1fr);gap:16px;max-width:1000px;margin:0 auto">
          ${sizes.map(s => `<div class="t-size-btn" onclick="initDie(${s})">
              <div class="fd" style="font-size:80px;font-weight:700;color:#e8433e">${s}</div>
              <div style="font-size:18px;color:var(--t2);margin-top:8px">karakter</div>
              <div style="font-size:16px;color:var(--t3);margin-top:4px">${s - 1} düello</div>
            </div>`).join('')}
        </div>
        ${active.length < 64 ? '<p style="font-size:14px;color:var(--pk);margin-top:16px">⚠️ En az 64 aktif karakter gerekli!</p>' : ''}
      </div>
    </div>`;
}

function initDie(size) {
  const pool = shuf(chars.filter(c => c.a)).slice(0, size);
  dState = {
    size,
    pool: [...pool],
    alive: [...pool],
    eliminated: [],
    matchIndex: 0,
    
  };
  nextDieMatch();
}

function nextDieMatch() {
  const s = dState;
  if (s.alive.length <= 1) { renderDieSurvivor(); return; }
  
  // Pick 2 random from alive
  const pair = pick(s.alive, 2);
  s.currentPair = pair;
  renderDieMatch();
}

function getDieStageName() {
  const rem = dState.alive.length;
  if (rem === 2) return '🏆 FİNAL — Son 2!';
  if (rem === 3) return '🔥 Son 3 kaldı!';
  if (rem === 4) return '⚡ Son 4';
  if (rem <= 8) return '💀 Son ' + rem;
  return '💀 ' + rem + ' karakter hayatta';
}

function renderDieMatch() {
  const s = dState;
  const [c1, c2] = s.currentPair;
  const rem = s.alive.length;
  const elimCount = s.eliminated.length;
  const total = s.size;
  const progressPct = Math.round((elimCount / (total - 1)) * 100);
  const ag = document.getElementById('ag');
  
  ag.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0">
      <button class="btn bg bsm" onclick="bk()">← Çık</button>
      <div class="gi" style="background:linear-gradient(135deg,#e8433e,#e8433e);width:72px;height:72px;font-size:36px">💀</div>
      <div style="flex:1">
        <h2 class="fd" style="font-weight:700;font-size:32px">${getDieStageName()}</h2>
        <p style="font-size:12px;color:var(--t3)">Eleme ${elimCount + 1}/${total - 1}</p>
      </div>
      
    </div>
    <div style="margin:8px 0 12px">
      <div style="height:10px;background:var(--bg3);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${progressPct}%;background:linear-gradient(90deg,#e8433e,#e8433e);border-radius:3px;transition:width .5s ease"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--t3);margin-top:4px">
        <span>${total} başladı</span><span>${rem} hayatta</span>
      </div>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div style="text-align:center;width:100%">
        <p style="font-size:26px;color:var(--pk);margin-bottom:28px;font-weight:500">☠️ Hangisi CK yiyecek? Tıkla ve ele!</p>
        <div style="display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:20px;flex-wrap:wrap" id="die-match">
          <div class="t-card sci" id="dc1" style="width:440px;padding:44px" onclick="dieKill('${c1.id}','${c2.id}')">
            <div style="max-width:600px;width:100%;border-radius:20px;margin:0 auto 14px;border:3px solid var(--b1);display:flex;align-items:center;justify-content:center;transition:all .3s">
              ${cp(c1, 500)}
            </div>
            <h3 class="fd" style="font-weight:700;font-size:34px">${esc(c1.n)} ${esc(c1.s)}</h3>
            
            
            <div style="margin-top:12px;font-size:18px;color:var(--pk);opacity:.5">☠️ CK'la</div>
          </div>
          <div class="t-vs fl fd" style="background:linear-gradient(135deg,#e8433e30,#e8433e10);border-color:#e8433e40">VS</div>
          <div class="t-card sci" id="dc2" style="width:440px;padding:44px;animation-delay:.1s" onclick="dieKill('${c2.id}','${c1.id}')">
            <div style="max-width:600px;width:100%;border-radius:20px;margin:0 auto 14px;border:3px solid var(--b1);display:flex;align-items:center;justify-content:center;transition:all .3s">
              ${cp(c2, 500)}
            </div>
            <h3 class="fd" style="font-weight:700;font-size:34px">${esc(c2.n)} ${esc(c2.s)}</h3>
            
            
            <div style="margin-top:12px;font-size:18px;color:var(--pk);opacity:.5">☠️ CK'la</div>
          </div>
        </div>
      </div>
    </div>`;
}

function dieKill(deadId, survivorId) {
  const s = dState;
  if (!s || Date.now() - (s.lastPick||0) < 600) return;
  s.lastPick = Date.now();
  
  const deadChar = s.alive.find(c => c.id == deadId);
  if (!deadChar) return;
  const survChar = s.alive.find(c => c.id == survivorId);
  

  
  // Animate dead card
  const deadEl = document.getElementById(deadId === s.currentPair[0].id ? 'dc1' : 'dc2');
  const survEl = document.getElementById(deadId === s.currentPair[0].id ? 'dc2' : 'dc1');
  
  if(deadEl) {
    deadEl.style.borderColor = 'var(--pk)';
    deadEl.style.background = '#e8433e12';
    deadEl.querySelector('div').style.borderColor = 'var(--pk)';
    deadEl.style.pointerEvents = 'none';
    const skull = document.createElement('div');
    skull.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:96px;background:rgba(10,10,15,.75);border-radius:20px;animation:sci .3s ease';
    skull.textContent = '💀';
    deadEl.appendChild(skull);
    setTimeout(() => { deadEl.style.opacity = '0'; deadEl.style.transform = 'scale(0.7) translateY(20px)'; }, 500);
  }
  if(survEl) {
    survEl.style.borderColor = 'var(--m)';
    survEl.style.background = '#2dd4bf08';
    survEl.style.pointerEvents = 'none';
    const crown = document.createElement('div');
    crown.style.cssText = 'position:absolute;top:-6px;left:50%;transform:translateX(-50%);font-size:24px;animation:crownDrop .4s ease both';
    crown.textContent = '✓'; crown.style.color = 'var(--m)';
    survEl.appendChild(crown);
  }
  
  // Remove existing CK notification
    var oldNotif = document.getElementById('ck-notif');
    if (oldNotif) oldNotif.remove();
    // Show centered CK notification - no movement, block clicks
    var oldNotif = document.getElementById('ck-notif');
    if (oldNotif) oldNotif.remove();
    var notif = document.createElement('div');
    notif.id = 'ck-notif';
    notif.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;padding:28px 56px;border-radius:20px;background:rgba(247,37,133,0.2);border:2px solid rgba(247,37,133,0.4);backdrop-filter:blur(12px)';
    notif.innerHTML = '<div style="font-size:56px;margin-bottom:8px">☠️</div><div style="font-size:32px;font-weight:700;color:#e8433e">' + deadChar.n + ' ' + deadChar.s + '</div><div style="font-size:22px;color:var(--t2);margin-top:4px">CK yedi!</div>';
    document.body.appendChild(notif);
    setTimeout(function() { var n = document.getElementById('ck-notif'); if (n) n.remove(); }, 1400);
  
  setTimeout(() => {
    s.alive = s.alive.filter(c => c.id != deadId);
    s.eliminated.push(deadChar);
    nextDieMatch();
  }, 1500);
}

function renderDieSurvivor() {
  const s = dState;
  const survivor = s.alive[0];
  const ag = document.getElementById('ag');
  ag.innerHTML = `
    <div style="flex:1;display:flex;align-items:center;justify-content:center"><div class="cg sci" style="text-align:center;padding:60px 32px;max-width:1100px;width:100%;position:relative;overflow:hidden" id="surv-box">
      <div style="font-size:120px;margin-bottom:16px;animation:crownDrop .6s ease both">🏆</div>
      <p style="font-size:14px;color:var(--m);margin-bottom:16px;font-weight:500">Tek hayatta kalan!</p>
      <div style="max-width:500px;width:100%;border-radius:20px;margin:0 auto 16px;border:3px solid var(--m);box-shadow:0 0 50px #2dd4bf30">
        ${cp(survivor, 300)}
      </div>
      <h2 class="fd" style="font-size:54px;font-weight:700">${esc(survivor.n)} ${esc(survivor.s)}</h2>
      
      
      
      
      <div style="margin-top:16px;display:flex;gap:16px;justify-content:center;font-size:13px;color:var(--t2)">
        <span>💀 ${s.size} karakter</span>
        <span>☠️ ${s.eliminated.length} düello</span>
        <span>🏆 1 hayatta kalan</span>
      </div>
      
      <div style="margin-top:24px">
        <p style="font-size:11px;color:var(--t3);margin-bottom:10px">Eleme sırası (ilk → son)</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center">
          ${s.eliminated.map((c, i) => `
            <div style="display:flex;align-items:center;gap:3px;padding:3px 8px;border-radius:8px;background:var(--bg3);font-size:10px;opacity:${0.3 + (i / s.eliminated.length) * 0.5}">
              <span style="color:var(--pk)">☠️</span>
              <div style="width:18px;height:18px;border-radius:5px;overflow:hidden;filter:grayscale(.6)">${cp(c, 18)}</div>
              ${esc(c.n)}
            </div>
            ${i < s.eliminated.length - 1 ? '<span style="color:var(--t3);font-size:10px">→</span>' : ''}
          `).join('')}
          <span style="color:var(--t3);font-size:10px">→</span>
          <div style="display:flex;align-items:center;gap:3px;padding:3px 10px;border-radius:8px;background:#2dd4bf15;border:1px solid #2dd4bf30;font-size:10px;color:var(--m);font-weight:600">
            <span>🏆</span>
            <div style="width:18px;height:18px;border-radius:5px;overflow:hidden">${cp(survivor, 18)}</div>
            ${survivor.n}
          </div>
        </div>
      </div>
      
      <div style="display:flex;justify-content:center;gap:10px;margin-top:28px">
        <button class="btn bp" onclick="dieStart()">🔄 Yeni Oyun</button>
        <button class="btn bs" onclick="bk()">Oyunlara Dön</button>
      </div>
    </div></div>`;
  
  var box = document.getElementById('surv-box');
  var colors = ['#e8433e','#2dd4bf','#e8433e','#FFB800','#e8433e'];
  for (var i = 0; i < 30; i++) {
    var p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.cssText = 'left:'+Math.random()*100+'%;top:'+(60+Math.random()*30)+'%;background:'+colors[i%5]+';animation-delay:'+Math.random()*.5+'s;animation-duration:'+(1+Math.random())+'s;width:'+(4+Math.random()*6)+'px;height:'+(4+Math.random()*6)+'px;border-radius:'+(Math.random()>.5?'50%':'2px');
    box.appendChild(p);
  }
}
