// ═══════════════════════════════════════════════════
// REPLİK BİL — QUOTE GUESS GAME
// ═══════════════════════════════════════════════════
let rqState = null;

function quoteStart() {
  if(typeof checkBanned==="function"&&checkBanned())return;

  const withRep = chars.filter(c => c.a && c.rep && c.rep.trim());
  const sizes = [5, 10, 15, 20].filter(s => s <= withRep.length);
  const ag = document.getElementById('ag');
  
  if (withRep.length < 4) {
    ag.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0">
        <button class="btn bg bsm" onclick="bk()">← Geri</button>
        <div class="gi" style="background:linear-gradient(135deg,#f59e0b,#eab308);width:72px;height:72px;font-size:36px">💬</div>
        <h2 class="fd" style="font-weight:700;font-size:36px">Replik Bil</h2>
      </div>
      <div style="flex:1;display:flex;align-items:center;justify-content:center">
        <div class="cg" style="text-align:center;padding:60px 40px;max-width:600px">
          <div style="font-size:80px;margin-bottom:16px">⚠️</div>
          <h3 class="fd" style="font-size:32px;font-weight:700">Yetersiz Replik</h3>
          <p style="font-size:18px;color:var(--t2);margin-top:12px">En az 4 karakterin repliği olmalı. Admin panelden replik ekle.</p>
          <p style="font-size:16px;color:var(--t3);margin-top:8px">Şu an ${withRep.length} karakter replikli.</p>
        </div>
      </div>`;
    return;
  }
  
  ag.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0">
      <button class="btn bg bsm" onclick="bk()">← Geri</button>
      <div class="gi" style="background:linear-gradient(135deg,#f59e0b,#eab308);width:72px;height:72px;font-size:36px">💬</div>
      <h2 class="fd" style="font-weight:700;font-size:36px">Replik Bil</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg" style="text-align:center;padding:60px 40px;max-width:1100px;width:100%">
        <div style="font-size:120px;margin-bottom:20px">💬</div>
        <h3 class="fd" style="font-size:48px;font-weight:700;margin-bottom:14px">Replik Bil</h3>
        <p style="font-size:20px;color:var(--t2);margin-bottom:10px">Repliği oku, hangi karaktere ait olduğunu tahmin et!</p>
        <p style="font-size:18px;color:var(--t3);margin-bottom:32px">${withRep.length} replikli karakter mevcut</p>
        <div style="display:grid;grid-template-columns:repeat(${Math.min(sizes.length, 4)},1fr);gap:16px;max-width:1000px;margin:0 auto">
          ${sizes.map(s => `<div class="t-size-btn" onclick="initQuote(${s})">
              <div class="fd" style="font-size:80px;font-weight:700;color:#f59e0b">${s}</div>
              <div style="font-size:18px;color:var(--t2);margin-top:8px">soru</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

function initQuote(size) {
  const uniqueRep = chars.filter(c => c.a && c.rep && c.rep.trim()).filter((c, i, arr) => arr.findIndex(x => x.rep === c.rep) === i);
  const withRep = shuf(uniqueRep).slice(0, size);
  rqState = {
    size,
    questions: withRep,
    remaining: [...withRep],
    correct: [],
    wrong: [],
    picking: false,
  };
  renderQuoteCard();
}

function renderQuoteCard() {
  const s = rqState;
  if (!s || s.remaining.length === 0) { renderQuoteResult(); return; }
  s.picking = false;
  
  const c = s.remaining[0];
  const done = s.correct.length + s.wrong.length;
  const total = s.size;
  const progressPct = Math.round((done / total) * 100);
  
  // Build 4 options: 1 correct + 3 random wrong
  const others = shuf(chars.filter(x => x.a && x.id !== c.id)).slice(0, 3);
  const options = shuf([c, ...others]);
  
  const ag = document.getElementById('ag');
  ag.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 20px">
      <button class="btn bg bsm" onclick="bk()">← Çık</button>
      <div class="gi" style="background:linear-gradient(135deg,#f59e0b,#eab308);width:48px;height:48px;font-size:22px">💬</div>
      <div style="flex:1">
        <h2 class="fd" style="font-weight:700;font-size:28px">Replik Bil</h2>
        <p style="font-size:12px;color:var(--t3)">${done + 1}/${total} soru</p>
      </div>
      <div style="text-align:right">
        <div style="font-size:24px;font-weight:700"><span style="color:var(--m)">${s.correct.length}✓</span> <span style="color:var(--pk)">${s.wrong.length}✗</span></div>
      </div>
    </div>
    <div style="margin:8px 20px 12px">
      <div style="height:8px;background:var(--bg3);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${progressPct}%;background:linear-gradient(90deg,#f59e0b,#eab308);border-radius:4px;transition:width .5s ease"></div>
      </div>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div style="text-align:center;width:100%;max-width:800px;padding:0 20px">
        <div style="background:var(--bg2);border:1px solid var(--b1);border-radius:20px;padding:36px 32px;margin-bottom:28px">
          <div style="font-size:32px;margin-bottom:12px">💬</div>
          <p style="font-size:28px;font-weight:500;font-style:italic;color:var(--t1);line-height:1.4">"${esc(c.rep)}"</p>
        </div>
        <p style="font-size:18px;color:var(--t2);margin-bottom:20px">Bu replik kime ait?</p>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px" id="quote-opts">
          ${options.map(o => `
            <div class="card" id="qo-${o.id}" style="cursor:pointer;padding:20px;display:flex;align-items:center;gap:16px;transition:all .3s" onclick="quoteGuess('${o.id}','${c.id}')">
              <div style="width:64px;height:64px;border-radius:14px;overflow:hidden;flex-shrink:0">${cp(o, 64)}</div>
              <div style="text-align:left">
                <div class="fd" style="font-size:20px;font-weight:600">${o.n} ${o.s}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
}

function quoteGuess(guessId, correctId) {
  const s = rqState;
  if (!s || s.picking) return;
  s.picking = true;
  
  const c = s.remaining[0];
  const isCorrect = guessId === correctId;
  
  // Highlight correct and wrong
  document.querySelectorAll('[id^="qo-"]').forEach(el => {
    el.style.pointerEvents = 'none';
    const oid = el.id.replace('qo-', '');
    if (oid === correctId) {
      el.style.borderColor = 'var(--m)';
      el.style.background = '#2dd4bf12';
      el.innerHTML = '<div style="font-size:32px;margin-right:8px">✅</div>' + el.innerHTML;
    } else if (oid === guessId && !isCorrect) {
      el.style.borderColor = 'var(--pk)';
      el.style.background = '#e8433e12';
      el.style.opacity = '0.6';
      el.innerHTML = '<div style="font-size:32px;margin-right:8px">❌</div>' + el.innerHTML;
    } else {
      el.style.opacity = '0.3';
    }
  });
  
  if (isCorrect) { s.correct.push(c); toast('✅ Doğru! ' + c.n + ' ' + c.s); }
  else { s.wrong.push(c); toast('❌ Yanlış! Doğru: ' + c.n + ' ' + c.s, false); }
  
  s.remaining = s.remaining.filter(x => x.id !== c.id);
  
  setTimeout(() => { s.picking = false; renderQuoteCard(); }, 1800);
}

function renderQuoteResult() {
  const s = rqState;
  const pct = s.size > 0 ? Math.round((s.correct.length / s.size) * 100) : 0;
  const ag = document.getElementById('ag');
  if (curUser) { apiSaveScore('QUOTE', s.correct.length, s.size).then(function(r){ if(r.best_score!==undefined){curUser.best_score=r.best_score;renderNav()} }); }
  
  ag.innerHTML = `
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg sci" style="text-align:center;padding:48px 36px;max-width:1100px;width:100%;position:relative;overflow:hidden" id="quote-box">
        <div style="font-size:100px;margin-bottom:12px;animation:crownDrop .6s ease both">${pct >= 70 ? '🏆' : pct >= 40 ? '👏' : '😅'}</div>
        <h2 class="fd" style="font-size:44px;font-weight:700">Sonuç</h2>
        <p style="font-size:22px;color:var(--t2);margin-top:8px">${s.size} replikten <b style="color:var(--m)">${s.correct.length}</b> doğru, <b style="color:var(--pk)">${s.wrong.length}</b> yanlış</p>
        <div style="font-size:64px;font-weight:700;margin:20px 0;color:${pct >= 70 ? 'var(--m)' : pct >= 40 ? 'var(--g)' : 'var(--pk)'}" class="fd">%${pct}</div>
        
        ${s.correct.length > 0 ? '<div style="margin-top:20px"><p style="font-size:16px;color:var(--m);margin-bottom:12px">✅ Doğru</p><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">' +
          s.correct.map(c => '<div style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:10px;background:#2dd4bf10;border:1px solid #2dd4bf25;font-size:14px"><div style="width:32px;height:32px;border-radius:8px;overflow:hidden">' + cp(c, 32) + '</div>' + esc(c.n) + ' ' + esc(c.s) + '</div>').join('') +
          '</div></div>' : ''}
        
        ${s.wrong.length > 0 ? '<div style="margin-top:16px"><p style="font-size:16px;color:var(--pk);margin-bottom:12px">❌ Yanlış</p><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">' +
          s.wrong.map(c => '<div style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:10px;background:#e8433e10;border:1px solid #e8433e25;font-size:14px"><div style="width:32px;height:32px;border-radius:8px;overflow:hidden">' + cp(c, 32) + '</div>' + esc(c.n) + ' ' + esc(c.s) + '</div>').join('') +
          '</div></div>' : ''}
        
        <div style="display:flex;justify-content:center;gap:12px;margin-top:32px">
          <button class="btn bp" onclick="quoteStart()">🔄 Tekrar Oyna</button>
          <button class="btn bs" onclick="bk()">Oyunlara Dön</button>
        </div>
      </div>
    </div>`;
  
  if (pct >= 70) {
    var box = document.getElementById('quote-box');
    var colors = ['#f59e0b','#eab308','#FFB800','#2dd4bf','#e8433e'];
    for (var i = 0; i < 25; i++) {
      var p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.cssText = 'left:'+Math.random()*100+'%;top:'+(60+Math.random()*30)+'%;background:'+colors[i%5]+';animation-delay:'+Math.random()*.5+'s;animation-duration:'+(1+Math.random())+'s;width:'+(4+Math.random()*6)+'px;height:'+(4+Math.random()*6)+'px;border-radius:'+(Math.random()>.5?'50%':'2px');
      box.appendChild(p);
    }
  }
}
