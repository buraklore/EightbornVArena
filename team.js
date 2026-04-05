// ═══════════════════════════════════════════════════
// EKİP KURMA — TEAM BUILDING GAME
// ═══════════════════════════════════════════════════
let tmState = null;

function teamStart() {
  const active = chars.filter(c => c.a);
  const sizes = [16, 32, 64, 128].filter(s => s <= active.length);
  
  const ag = document.getElementById('ag');
  ag.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0">
      <button class="btn bg bsm" onclick="bk()">← Geri</button>
      <div class="gi" style="background:linear-gradient(135deg,#3b82f6,#06b6d4);width:72px;height:72px;font-size:36px">👥</div>
      <h2 class="fd" style="font-weight:700;font-size:36px">Ekibini Kur</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg" style="text-align:center;padding:60px 40px;max-width:1100px;width:100%">
        <div style="font-size:120px;margin-bottom:20px">👥</div>
        <h3 class="fd" style="font-size:48px;font-weight:700;margin-bottom:14px">Ekibini Kur</h3>
        <p style="font-size:20px;color:var(--t2);margin-bottom:10px">Karakterler tek tek karşına çıkacak.<br><b style="color:var(--m)">Ekibine al</b> (maks ${TEAM_MAX} kişi) veya <b style="color:var(--pk)">CK ver</b>!<br>${TEAM_MAX} kişilik ekibini tamamla, gerisine CK ver!</p>
        <p style="font-size:18px;color:var(--t3);margin-bottom:32px">${active.length} aktif karakter mevcut</p>
        <div style="display:grid;grid-template-columns:repeat(${Math.min(sizes.length, 4)},1fr);gap:16px;max-width:1000px;margin:0 auto">
          ${sizes.map(s => `<div class="t-size-btn" onclick="initTeam(${s})">
              <div class="fd" style="font-size:80px;font-weight:700;color:var(--bl)">${s}</div>
              <div style="font-size:18px;color:var(--t2);margin-top:8px">karakter</div>
            </div>`).join('')}
        </div>
        ${active.length < 64 ? '<p style="font-size:14px;color:var(--pk);margin-top:16px">⚠️ En az 64 aktif karakter gerekli!</p>' : ''}
      </div>
    </div>`;
}

function initTeam(size) {
  const pool = shuf(chars.filter(c => c.a)).slice(0, size);
  tmState = {
    size,
    pool,
    remaining: [...pool],
    team: [],
    eliminated: [],
    index: 0,
    
  };
  renderTeamCard();
}

function renderTeamCard() {
  const s = tmState;
  if (!s || s.remaining.length === 0 || s.team.length >= TEAM_MAX) { 
    // Auto-CK all remaining if team is full
    if (s && s.remaining.length > 0) {
      s.eliminated = s.eliminated.concat(s.remaining);
      s.remaining = [];
    }
    renderTeamResult(); return; 
  }
  
  const c = s.remaining[0];
  const done = s.team.length + s.eliminated.length;
  const total = s.size;
  const progressPct = Math.round((done / total) * 100);
  const teamFull = s.team.length >= TEAM_MAX;
  const ag = document.getElementById('ag');
  
  ag.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 20px">
      <button class="btn bg bsm" onclick="bk()">← Çık</button>
      <div class="gi" style="background:linear-gradient(135deg,#3b82f6,#06b6d4);width:48px;height:48px;font-size:22px">👥</div>
      <div style="flex:1">
        <h2 class="fd" style="font-weight:700;font-size:28px">Ekibini Kur</h2>
        <p style="font-size:12px;color:var(--t3)">${done + 1}/${total} karakter</p>
      </div>
      <div style="text-align:right"><div class="fd" style="font-size:28px;font-weight:700;color:var(--m)">${s.team.length}/${TEAM_MAX} 👥</div></div>
    </div>
    <div style="margin:8px 20px 12px">
      <div style="height:8px;background:var(--bg3);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${progressPct}%;background:linear-gradient(90deg,#3b82f6,#06b6d4);border-radius:4px;transition:width .5s ease"></div>
      </div>
    </div>
    <div style="flex:1;display:flex;gap:24px;padding:0 20px">
      <!-- LEFT: Team list -->
      <div style="width:260px;flex-shrink:0;overflow-y:auto">
        <div style="background:var(--bg2);border:1px solid var(--b1);border-radius:16px;padding:16px;height:100%">
          <h3 class="fd" style="font-size:18px;font-weight:700;color:var(--m);margin-bottom:12px;display:flex;align-items:center;gap:8px">👥 Ekibin <span style="font-size:14px;color:var(--t3);font-weight:400">(${s.team.length})</span></h3>
          ${s.team.length === 0 ? '<p style="font-size:13px;color:var(--t3);text-align:center;padding:20px 0">Henüz kimse yok</p>' : 
            s.team.map((t, i) => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;background:var(--bg3);margin-bottom:6px">
                <div style="width:36px;height:36px;border-radius:8px;overflow:hidden;flex-shrink:0">${cp(t, 36)}</div>
                <div>
                  <div style="font-size:13px;font-weight:600">${t.n} ${t.s}</div>
                  
                </div>
              </div>
            `).join('')}
        </div>
      </div>
      
      <!-- CENTER: Character card -->
      <div style="flex:1;display:flex;align-items:center;justify-content:center">
        <div style="text-align:center" id="team-card-area">
          <div class="cg sci" style="padding:48px;display:inline-block;min-width:400px">
            <div style="max-width:600px;width:100%;border-radius:20px;margin:0 auto 20px;border:3px solid var(--b1);display:flex;align-items:center;justify-content:center">
              ${cp(c, 500)}
            </div>
            <h3 class="fd" style="font-size:36px;font-weight:700">${esc(c.n)} ${esc(c.s)}</h3>
            
            
            
            
            <div style="display:flex;gap:16px;margin-top:28px;justify-content:center">
              <button class="btn" style="background:#2dd4bf20;color:var(--m);border:2px solid #2dd4bf40;padding:16px 36px;font-size:18px;font-weight:600;border-radius:14px" onclick="teamPick('add','${c.id}')">
                👥 Ekibime Al
              </button>
              <button class="btn" style="background:#e8433e15;color:var(--pk);border:2px solid #e8433e30;padding:16px 36px;font-size:18px;font-weight:600;border-radius:14px" onclick="teamPick('ck','${c.id}')">
                💀 CK Ver
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- RIGHT: CK Sidebar -->
      <div style="width:260px;flex-shrink:0;overflow-y:auto">
        <div style="background:var(--bg2);border:1px solid var(--b1);border-radius:16px;padding:16px;height:100%">
          <h3 class="fd" style="font-size:18px;font-weight:700;color:var(--pk);margin-bottom:12px">☠️ CK Verilenler <span style="font-size:14px;color:var(--t3);font-weight:400">(${s.eliminated.length})</span></h3>
          ${s.eliminated.length === 0 ? '<p style="font-size:13px;color:var(--t3);text-align:center;padding:20px 0">Henüz kimse yok</p>' :
            s.eliminated.map(e => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;background:#e8433e08;border:1px solid #e8433e15;margin-bottom:6px">
                <div style="width:36px;height:36px;border-radius:8px;overflow:hidden;flex-shrink:0;filter:grayscale(1)">${cp(e, 36)}</div>
                <div style="font-size:13px;font-weight:600;color:var(--pk);text-decoration:line-through">${e.n} ${e.s}</div>
              </div>
            `).join('')}
        </div>
      </div>
    </div>`;
}

function teamPick(action, charId) {
  const s = tmState;
  if (!s || Date.now() - (s.lastPick||0) < 600) return;
  s.lastPick = Date.now();
  
  const c = s.remaining.find(x => x.id == charId);
  if (!c) return;
  s.remaining = s.remaining.filter(x => x.id != charId);
  
  if (action === 'add') {
    s.team.push(c);
    if (s.team.length >= TEAM_MAX) {
      showTeamNotif('👥', c.n + ' ekibine katıldı!', 'Ekip tamamlandı!', true);
    } else {
      showTeamNotif('👥', c.n + ' ekibine katıldı!', s.team.length + '/' + TEAM_MAX, true);
    }
  } else {
    s.eliminated.push(c);
    showTeamNotif('☠️', c.n + ' ' + c.s, 'CK yedi!', false);
  }
  
  s.cooldown = true;
  setTimeout(() => renderTeamCard(), 1500);
}

function showTeamNotif(emoji, name, sub, isGood) {
  var old = document.getElementById('team-notif');
  if (old) old.remove();
  var n = document.createElement('div');
  n.id = 'team-notif';
  var bg = isGood ? 'rgba(6,214,160,0.2)' : 'rgba(247,37,133,0.2)';
  var border = isGood ? 'rgba(6,214,160,0.4)' : 'rgba(247,37,133,0.4)';
  var color = isGood ? 'var(--m)' : '#e8433e';
  n.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;padding:28px 56px;border-radius:20px;background:'+bg+';border:2px solid '+border+';backdrop-filter:blur(12px)';
  n.innerHTML = '<div style="font-size:56px;margin-bottom:8px">'+emoji+'</div><div style="font-size:28px;font-weight:700;color:'+color+'">'+name+'</div><div style="font-size:18px;color:var(--t2);margin-top:4px">'+sub+'</div>';
  document.body.appendChild(n);
  setTimeout(function() { var el = document.getElementById('team-notif'); if (el) el.remove(); }, 1400);
}

function renderTeamResult() {
  const s = tmState;
  const ag = document.getElementById('ag');
  ag.innerHTML = `
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg sci" style="text-align:center;padding:60px 40px;max-width:1100px;width:100%;position:relative;overflow:hidden" id="team-box">
        <div style="font-size:120px;margin-bottom:16px;animation:crownDrop .6s ease both">👥</div>
        <h2 class="fd" style="font-size:48px;font-weight:700">Ekibin Hazır!</h2>
        <p style="font-size:20px;color:var(--t2);margin-top:8px">${s.size} karakterden <b style="color:var(--m)">${s.team.length}</b> kişilik ekip kurdun</p>
        
        
        
        <div style="margin-top:28px">
          <h3 class="fd" style="font-size:24px;font-weight:600;color:var(--m);margin-bottom:16px">👥 Ekibin (${s.team.length})</h3>
          <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
            ${s.team.map(c => `
              <div style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:12px;background:#2dd4bf10;border:1px solid #2dd4bf25;font-size:14px">
                <div style="width:32px;height:32px;border-radius:8px;overflow:hidden">${cp(c, 32)}</div>
                <span style="font-weight:500">${esc(c.n)} ${esc(c.s)}</span>
                
              </div>
            `).join('')}
          </div>
        </div>
        
        ${s.eliminated.length > 0 ? `
          <div style="margin-top:20px">
            <p style="font-size:14px;color:var(--pk);margin-bottom:10px">☠️ CK Verilenler (${s.eliminated.length})</p>
            <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">
              ${s.eliminated.map(c => `
                <div style="display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;background:var(--bg3);font-size:12px;opacity:.5">
                  <div style="width:20px;height:20px;border-radius:5px;overflow:hidden;filter:grayscale(.6)">${cp(c, 20)}</div>
                  <span style="text-decoration:line-through">${esc(c.n)}</span>
                </div>
              `).join('')}
            </div>
          </div>` : ''}
        
        <div style="display:flex;justify-content:center;gap:12px;margin-top:32px">
          <button class="btn bp" onclick="teamStart()">🔄 Yeni Oyun</button>
          <button class="btn bs" onclick="bk()">Oyunlara Dön</button>
        </div>
      </div>
    </div>`;
  
  var box = document.getElementById('team-box');
  var colors = ['#3b82f6','#2dd4bf','#06b6d4','#FFB800','#e8433e'];
  for (var i = 0; i < 30; i++) {
    var p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.cssText = 'left:'+Math.random()*100+'%;top:'+(60+Math.random()*30)+'%;background:'+colors[i%5]+';animation-delay:'+Math.random()*.5+'s;animation-duration:'+(1+Math.random())+'s;width:'+(4+Math.random()*6)+'px;height:'+(4+Math.random()*6)+'px;border-radius:'+(Math.random()>.5?'50%':'2px');
    box.appendChild(p);
  }
}
