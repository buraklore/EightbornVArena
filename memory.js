// ═══════════════════════════════════════════════════
// HAFIZA OYUNU — QUIZ GAME
// ═══════════════════════════════════════════════════
let mState = null;

function memStart() {
  if(typeof checkBanned==="function"&&checkBanned())return;

  const total = memQs.length;
  const ag = document.getElementById('ag');
  if (total < 1) {
    ag.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0">
        
        <div class="gi" style="background:linear-gradient(135deg,#e8433e,#3b82f6);width:72px;height:72px;font-size:36px">🧠</div>
        <h2 class="fd" style="font-weight:700;font-size:36px">Eightborn Moruq</h2>
      </div>
      <div style="flex:1;display:flex;align-items:center;justify-content:center">
        <div class="cg" style="text-align:center;padding:60px 40px;max-width:600px">
          <div style="font-size:80px;margin-bottom:16px">⚠️</div>
          <h3 class="fd" style="font-size:32px;font-weight:700">Soru Yok</h3>
          <p style="font-size:18px;color:var(--t2);margin-top:12px">Admin panelden soru ekleyin.</p>
        </div>
      </div>`;
    return;
  }
  ag.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0">
      
      <div class="gi" style="background:linear-gradient(135deg,#e8433e,#3b82f6);width:72px;height:72px;font-size:36px">🧠</div>
      <h2 class="fd" style="font-weight:700;font-size:36px">Eightborn Moruq</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg" style="text-align:center;padding:60px 40px;max-width:900px;width:100%">
        <div style="font-size:120px;margin-bottom:20px">🧠</div>
        <h3 class="fd" style="font-size:48px;font-weight:700;margin-bottom:14px">Eightborn Moruq</h3>
        <p style="font-size:20px;color:var(--t2);margin-bottom:12px">Toplam <b style="color:var(--bl)">${total}</b> soru seni bekliyor!</p>
        <p style="font-size:16px;color:var(--t3);margin-bottom:36px">Kaç tanesini doğru bileceksin?</p>
        <button class="btn bp" style="padding:20px 48px;font-size:22px;border-radius:16px" onclick="initMem()">🚀 Başla</button>
      </div>
    </div>`;
}

function initMem() {
  mState = {
    questions: shuf([...memQs].filter(function(q, i, arr) { return arr.findIndex(function(x) { return x.q === q.q; }) === i; })),
    current: 0,
    correct: 0,
    wrong: 0,
    answers: [],
    picking: false,
  };
  renderMemQ();
}

function renderMemQ() {
  var s = mState;
  if (!s || s.current >= s.questions.length) { renderMemResult(); return; }
  s.picking = false;
  
  var q = s.questions[s.current];
  var num = s.current + 1;
  var total = s.questions.length;
  var pct = Math.round((s.current / total) * 100);
  var ag = document.getElementById('ag');
  
  ag.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 20px">
      <button class="btn bg bsm" onclick="bk()">← Çık</button>
      <div class="gi" style="background:linear-gradient(135deg,#e8433e,#3b82f6);width:48px;height:48px;font-size:22px">🧠</div>
      <div style="flex:1">
        <h2 class="fd" style="font-weight:700;font-size:28px">Soru ${num}/${total}</h2>
      </div>
      <div style="text-align:right">
        <div style="font-size:24px;font-weight:700"><span style="color:var(--m)">${s.correct}✓</span> <span style="color:var(--pk)">${s.wrong}✗</span></div>
      </div>
    </div>
    <div style="margin:8px 20px 12px">
      <div style="height:8px;background:var(--bg3);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#e8433e,#3b82f6);border-radius:4px;transition:width .5s ease"></div>
      </div>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div style="text-align:center;width:100%;max-width:800px;padding:0 20px">
        <div style="background:var(--bg2);border:1px solid var(--b1);border-radius:20px;padding:36px 32px;margin-bottom:28px">
          <p style="font-size:28px;font-weight:600;color:var(--t1);line-height:1.4" class="fd">${esc(q.q)}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px" id="mem-opts">
          ${q.o.map(function(o, i) { return `
            <div class="card" id="mo-${i}" style="cursor:pointer;padding:20px;text-align:left;display:flex;align-items:center;gap:14px;transition:all .3s" onclick="memAnswer(${i})">
              <div style="width:44px;height:44px;border-radius:12px;background:var(--bg1);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:var(--bl);flex-shrink:0" class="fd">${String.fromCharCode(65 + i)}</div>
              <span style="font-size:18px;font-weight:500">${o}</span>
            </div>
          `; }).join('')}
        </div>
      </div>
    </div>`;
}

function showMemNotif(emoji, text, isGood) {
  var old = document.getElementById('mem-notif');
  if (old) old.remove();
  var n = document.createElement('div');
  n.id = 'mem-notif';
  var bg = isGood ? 'rgba(6,214,160,0.2)' : 'rgba(247,37,133,0.2)';
  var border = isGood ? 'rgba(6,214,160,0.4)' : 'rgba(247,37,133,0.4)';
  var color = isGood ? 'var(--m)' : '#e8433e';
  n.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;padding:24px 48px;border-radius:20px;background:'+bg+';border:2px solid '+border+';backdrop-filter:blur(12px)';
  n.innerHTML = '<div style="font-size:48px;margin-bottom:8px">'+emoji+'</div><div style="font-size:24px;font-weight:700;color:'+color+'">'+text+'</div>';
  document.body.appendChild(n);
  setTimeout(function() { var el = document.getElementById('mem-notif'); if (el) el.remove(); }, 1200);
}

function memAnswer(idx) {
  var s = mState;
  if (!s || s.picking) return;
  s.picking = true;
  
  var q = s.questions[s.current];
  var isCorrect = idx === q.ci;
  
  // Highlight all options
  q.o.forEach(function(o, i) {
    var el = document.getElementById('mo-' + i);
    if (!el) return;
    el.style.pointerEvents = 'none';
    if (i === q.ci) {
      el.style.borderColor = 'var(--m)';
      el.style.background = '#2dd4bf12';
    } else if (i === idx && !isCorrect) {
      el.style.borderColor = 'var(--pk)';
      el.style.background = '#e8433e12';
      el.style.opacity = '0.6';
    } else {
      el.style.opacity = '0.3';
    }
  });
  
  if (isCorrect) { s.correct++; showMemNotif('✅', 'Doğru!', true); }
  else { showMemNotif('❌', 'Yanlış! Doğru: ' + q.o[q.ci], false); }
  
  s.answers.push({ q: q, picked: idx, correct: isCorrect });
  s.current++;
  
  setTimeout(function() { s.picking = false; renderMemQ(); }, 1500);
}

function renderMemResult() {
  var s = mState;
  var total = s.questions.length;
  var pct = total > 0 ? Math.round((s.correct / total) * 100) : 0;
  
  // Save score to current user (keep best score)
  if(curUser){
    apiSaveScore('MEMORY', s.correct, total).then(function(r){ if(r.best_score!==undefined){curUser.best_score=r.best_score;curUser.games_played=r.games_played;renderNav()} })
  }
  var savedMsg = curUser ? (s.correct > (curUser.pt - s.correct + curUser.pt) ? '' : '') : '<p style="font-size:14px;color:var(--g);margin-top:12px">💡 Giriş yap ve skorun sıralamaya kaydedilsin!</p>';
  
  var ag = document.getElementById('ag');
  
  ag.innerHTML = `
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg sci" style="text-align:center;padding:48px 36px;max-width:900px;width:100%;position:relative;overflow:hidden" id="mem-box">
        <div style="font-size:100px;margin-bottom:12px;animation:crownDrop .6s ease both">${pct >= 70 ? '🏆' : pct >= 40 ? '👏' : '😅'}</div>
        <h2 class="fd" style="font-size:44px;font-weight:700">Sonuç</h2>
        <p style="font-size:22px;color:var(--t2);margin-top:8px">${total} sorudan <b style="color:var(--m)">${s.correct}</b> doğru, <b style="color:var(--pk)">${s.wrong}</b> yanlış</p>
        <div style="font-size:80px;font-weight:700;margin:24px 0;color:${pct >= 70 ? 'var(--m)' : pct >= 40 ? 'var(--g)' : 'var(--pk)'}" class="fd">%${pct}</div>
        
        <div style="margin-top:24px;max-height:300px;overflow-y:auto;text-align:left">
          ${s.answers.map(function(a, i) {
            return '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;margin-bottom:4px;background:' + (a.correct ? '#2dd4bf08' : '#e8433e08') + ';border:1px solid ' + (a.correct ? '#2dd4bf20' : '#e8433e20') + '"><span style="font-size:20px">' + (a.correct ? '✅' : '❌') + '</span><div style="flex:1"><div style="font-size:13px;font-weight:500">' + (i+1) + '. ' + a.q.q + '</div>' + (!a.correct ? '<div style="font-size:11px;color:var(--m);margin-top:2px">Doğru: ' + a.q.o[a.q.ci] + '</div>' : '') + '</div></div>';
          }).join('')}
        </div>
        
        <div style="display:flex;justify-content:center;gap:12px;margin-top:24px">
          ${curUser ? '<p style="font-size:14px;color:var(--m)">✅ Skorun kaydedildi! (En iyi: '+curUser.best_score+'/'+total+')</p>' : '<p style="font-size:14px;color:var(--g)">💡 Skorun kaydedilmedi — <a style="color:var(--v);cursor:pointer;text-decoration:underline" onclick="go(\'login\')">giriş yap</a> ve sıralamaya gir!</p>'}
        </div>
        <div style="display:flex;justify-content:center;gap:12px;margin-top:16px">
          <button class="btn bp" onclick="memStart()">🔄 Tekrar Oyna</button>
          <button class="btn bs" onclick="go('lb')">🏆 Sıralama</button>
          <button class="btn bs" onclick="bk()">Oyunlara Dön</button>
        </div>
      </div>
    </div>`;
  
  if (pct >= 70) {
    var box = document.getElementById('mem-box');
    var colors = ['#e8433e','#3b82f6','#2dd4bf','#FFB800','#e8433e'];
    for (var i = 0; i < 25; i++) {
      var p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.cssText = 'left:'+Math.random()*100+'%;top:'+(60+Math.random()*30)+'%;background:'+colors[i%5]+';animation-delay:'+Math.random()*.5+'s;animation-duration:'+(1+Math.random())+'s;width:'+(4+Math.random()*6)+'px;height:'+(4+Math.random()*6)+'px;border-radius:'+(Math.random()>.5?'50%':'2px');
      box.appendChild(p);
    }
  }
}
