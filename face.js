function showGameNotif(emoji,text,isGood){var old=document.getElementById("game-notif");if(old)old.remove();var n=document.createElement("div");n.id="game-notif";var bg=isGood?"rgba(45,212,191,0.15)":"rgba(232,67,62,0.15)";var border=isGood?"rgba(45,212,191,0.3)":"rgba(232,67,62,0.3)";var color=isGood?"var(--m)":"#e8433e";n.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;padding:28px 56px;border-radius:20px;background:"+bg+";border:2px solid "+border+";backdrop-filter:blur(12px)";n.innerHTML='<div style="font-size:48px;margin-bottom:8px">'+emoji+'</div><div style="font-size:24px;font-weight:700;color:'+color+'">'+text+'</div>';document.body.appendChild(n);setTimeout(function(){var el=document.getElementById("game-notif");if(el)el.remove()},1500)}
function showGameNotif(emoji,text,isGood){var old=document.getElementById("game-notif");if(old)old.remove();var n=document.createElement("div");n.id="game-notif";var bg=isGood?"rgba(45,212,191,0.15)":"rgba(232,67,62,0.15)";var border=isGood?"rgba(45,212,191,0.3)":"rgba(232,67,62,0.3)";var color=isGood?"var(--m)":"#e8433e";n.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;padding:28px 56px;border-radius:20px;background:"+bg+";border:2px solid "+border+";backdrop-filter:blur(12px)";n.innerHTML='<div style="font-size:48px;margin-bottom:8px">'+emoji+'</div><div style="font-size:24px;font-weight:700;color:'+color+'">'+text+'</div>';document.body.appendChild(n);setTimeout(function(){var el=document.getElementById("game-notif");if(el)el.remove()},1500)}
// ═══════════════════════════════════════════════════
// YÜZDEN BİL — FACE GUESS GAME
// ═══════════════════════════════════════════════════
let fcState = null;

function faceStart() {
  if(typeof checkBanned==="function"&&checkBanned())return;

  const active = chars.filter(c => c.a);
  const sizes = [16, 32, 64, 128].filter(s => s <= active.length);
  const ag = document.getElementById('ag');
  ag.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0">
      
      <div class="gi" style="background:linear-gradient(135deg,#2dd4bf,#2dd4bf);width:72px;height:72px;font-size:36px">🤔</div>
      <h2 class="fd" style="font-weight:700;font-size:36px">Yüzden Bil</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg" style="text-align:center;padding:60px 40px;max-width:1100px;width:100%">
        <div style="font-size:120px;margin-bottom:20px">🤔</div>
        <h3 class="fd" style="font-size:48px;font-weight:700;margin-bottom:14px">Yüzden Bil</h3>
        <p style="font-size:20px;color:var(--t2);margin-bottom:10px">Bulanık fotoğrafa bakarak karakterin<br><b style="color:var(--m)">adını ve soyadını</b> tahmin et!</p>
        <p style="font-size:18px;color:var(--t3);margin-bottom:32px">${active.length} aktif karakter mevcut</p>
        <div style="display:grid;grid-template-columns:repeat(${Math.min(sizes.length, 4)},1fr);gap:16px;max-width:1000px;margin:0 auto">
          ${sizes.map(s => `<div class="t-size-btn" onclick="initFace(${s})">
              <div class="fd" style="font-size:80px;font-weight:700;color:#2dd4bf">${s}</div>
              <div style="font-size:18px;color:var(--t2);margin-top:8px">karakter</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

function initFace(size) {
  const pool = shuf(chars.filter(c => c.a)).slice(0, size);
  fcState = {
    size,
    pool,
    remaining: [...pool],
    correct: [],
    wrong: [],
    current: 0,
    picking: false,
  };
  renderFaceCard();
}

function renderFaceCard() {
  const s = fcState;
  if (!s || s.remaining.length === 0) { renderFaceResult(); return; }
  s.picking = false;
  
  const c = s.remaining[0];
  const done = s.correct.length + s.wrong.length;
  const total = s.size;
  const progressPct = Math.round((done / total) * 100);
  const av = (c.img && c.img.startsWith('/images/')) ? c.img : (c._av || mkAv(c));
  const ag = document.getElementById('ag');
  
  ag.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 20px">
      <button class="btn bg bsm" onclick="bk()">← Çık</button>
      <div class="gi" style="background:linear-gradient(135deg,#2dd4bf,#2dd4bf);width:48px;height:48px;font-size:22px">🤔</div>
      <div style="flex:1">
        <h2 class="fd" style="font-weight:700;font-size:28px">Yüzden Bil</h2>
        <p style="font-size:16px;color:var(--t3)">${done + 1}/${total} karakter</p>
      </div>
      <div style="text-align:right">
        <div style="font-size:24px;font-weight:700"><span style="color:var(--m)">${s.correct.length}✓</span> <span style="color:var(--pk)">${s.wrong.length}✗</span></div>
      </div>
    </div>
    <div style="margin:8px 20px 12px">
      <div style="height:8px;background:var(--bg3);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${progressPct}%;background:linear-gradient(90deg,#2dd4bf,#2dd4bf);border-radius:4px;transition:width .5s ease"></div>
      </div>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div style="text-align:center;width:100%;max-width:900px">
        <p style="font-size:18px;color:var(--t2);margin-bottom:20px">Bu kim?</p>
        <div id="face-photo" style="max-width:900px;width:100%;border-radius:20px;margin:0 auto 28px;border:3px solid var(--b1);display:flex;align-items:center;justify-content:center;position:relative">
          <img src="${av}" style="width:100%;height:auto;display:block;filter:blur(6px);transition:filter .8s ease" id="face-img">
        </div>
        <div style="display:flex;gap:12px;max-width:440px;margin:0 auto" id="face-input-area">
          <input class="inp" id="face-answer" placeholder="Ad Soyad yaz..." style="flex:1;font-size:18px;padding:16px 20px;text-align:center" onkeydown="if(event.key==='Enter')faceGuess()">
          <button class="btn bp" style="padding:16px 28px;font-size:18px" onclick="faceGuess()">Tahmin Et</button>
        </div>
        <p style="font-size:13px;color:var(--t3);margin-top:12px">Karakterin adını ve soyadını yaz</p>
      </div>
    </div>`;
  
  setTimeout(() => document.getElementById('face-answer')?.focus(), 100);
}

function faceGuess() {
  const s = fcState;
  if (!s || s.picking) return;
  
  const input = document.getElementById('face-answer');
  if (!input) return;
  const answer = input.value.trim().toLowerCase();
  if (!answer) { toast('Bir isim yaz!', false); return; }
  
  s.picking = true;
  const c = s.remaining[0];
  const correct = (c.n + ' ' + c.s).toLowerCase();
  const firstName = c.n.toLowerCase().trim();
  const isCorrect = answer === correct || answer.toLowerCase().trim() === firstName;
  
  // Reveal photo
  const img = document.getElementById('face-img');
  if (img) img.style.filter = 'blur(0px)';
  
  // Show result overlay
  const photo = document.getElementById('face-photo');
  if (photo) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:' + (isCorrect ? 'rgba(6,214,160,0.15)' : 'rgba(247,37,133,0.15)') + ';border-radius:28px;animation:sci .3s ease';
    overlay.innerHTML = '<div style="font-size:64px">' + (isCorrect ? '✅' : '❌') + '</div>';
    photo.appendChild(overlay);
  }
  
  // Show name
  const inputArea = document.getElementById('face-input-area');
  if (inputArea) {
    inputArea.innerHTML = '<div style="width:100%;text-align:center;padding:16px;border-radius:14px;background:' + (isCorrect ? '#2dd4bf15;border:1px solid #2dd4bf30' : '#e8433e15;border:1px solid #e8433e30') + '">' +
      '<div style="font-size:28px;font-weight:700;color:' + (isCorrect ? 'var(--m)' : 'var(--pk)') + '" class="fd">' + (isCorrect ? '✅ Doğru!' : '❌ Yanlış!') + '</div>' +
      '<div style="font-size:20px;margin-top:6px;color:var(--t1)">' + esc(c.n) + ' ' + esc(c.s) + '</div>' +
      
      '</div>';
  }
  
  if (isCorrect) { s.correct.push(c); showGameNotif('✅', 'Doğru! ' + c.n + ' ' + c.s, true); }
  else { s.wrong.push(c); showGameNotif('❌', 'Yanlış! Doğru: ' + c.n + ' ' + c.s, false); }
  
  s.remaining = s.remaining.filter(x => x.id !== c.id);
  
  setTimeout(() => { s.picking = false; renderFaceCard(); }, 2000);
}

function renderFaceResult() {
  const s = fcState;
  const ag = document.getElementById('ag');
  const pct = s.size > 0 ? Math.round((s.correct.length / s.size) * 100) : 0;
  if (curUser) { apiSaveScore('FACE', s.correct.length, s.size).then(function(r){ if(r.best_score!==undefined){curUser.best_score=r.best_score;renderNav()} }); }
  
  ag.innerHTML = `
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg sci" style="text-align:center;padding:48px 36px;max-width:1100px;width:100%;position:relative;overflow:hidden" id="face-box">
        <div style="font-size:100px;margin-bottom:12px;animation:crownDrop .6s ease both">${pct >= 70 ? '🏆' : pct >= 40 ? '👏' : '😅'}</div>
        <h2 class="fd" style="font-size:44px;font-weight:700">Sonuç</h2>
        <p style="font-size:22px;color:var(--t2);margin-top:8px">${s.size} karakterden <b style="color:var(--m)">${s.correct.length}</b> doğru, <b style="color:var(--pk)">${s.wrong.length}</b> yanlış</p>
        <div style="font-size:64px;font-weight:700;margin:20px 0;color:${pct >= 70 ? 'var(--m)' : pct >= 40 ? 'var(--g)' : 'var(--pk)'}" class="fd">%${pct}</div>
        
        ${s.correct.length > 0 ? '<div style="margin-top:20px"><p style="font-size:16px;color:var(--m);margin-bottom:12px">✅ Doğru Bilinenler</p><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">' +
          s.correct.map(c => '<div style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:10px;background:#2dd4bf10;border:1px solid #2dd4bf25;font-size:14px"><div style="width:32px;height:32px;border-radius:8px;overflow:hidden">' + cp(c, 32) + '</div>' + esc(c.n) + ' ' + esc(c.s) + '</div>').join('') +
          '</div></div>' : ''}
        
        ${s.wrong.length > 0 ? '<div style="margin-top:16px"><p style="font-size:16px;color:var(--pk);margin-bottom:12px">❌ Yanlış Bilinenler</p><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">' +
          s.wrong.map(c => '<div style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:10px;background:#e8433e10;border:1px solid #e8433e25;font-size:14px"><div style="width:32px;height:32px;border-radius:8px;overflow:hidden">' + cp(c, 32) + '</div>' + esc(c.n) + ' ' + esc(c.s) + '</div>').join('') +
          '</div></div>' : ''}
        
        <div style="display:flex;justify-content:center;gap:12px;margin-top:32px">
          <button class="btn bp" onclick="faceStart()">🔄 Tekrar Oyna</button>
          <button class="btn bs" onclick="bk()">Oyunlara Dön</button>
        </div>
      </div>
    </div>`;
  
  if (pct >= 70) {
    var box = document.getElementById('face-box');
    var colors = ['#2dd4bf','#2dd4bf','#2dd4bf','#FFB800','#e8433e'];
    for (var i = 0; i < 25; i++) {
      var p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.cssText = 'left:'+Math.random()*100+'%;top:'+(60+Math.random()*30)+'%;background:'+colors[i%5]+';animation-delay:'+Math.random()*.5+'s;animation-duration:'+(1+Math.random())+'s;width:'+(4+Math.random()*6)+'px;height:'+(4+Math.random()*6)+'px;border-radius:'+(Math.random()>.5?'50%':'2px');
      box.appendChild(p);
    }
  }
}
