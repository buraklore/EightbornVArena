function showGameNotif(emoji,text,isGood){var old=document.getElementById("game-notif");if(old)old.remove();var n=document.createElement("div");n.id="game-notif";var bg=isGood?"rgba(45,212,191,0.15)":"rgba(232,67,62,0.15)";var border=isGood?"rgba(45,212,191,0.3)":"rgba(232,67,62,0.3)";var color=isGood?"var(--m)":"#e8433e";n.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;padding:28px 56px;border-radius:20px;background:"+bg+";border:2px solid "+border+";backdrop-filter:blur(12px)";n.innerHTML='<div style="font-size:48px;margin-bottom:8px">'+emoji+'</div><div style="font-size:24px;font-weight:700;color:'+color+'">'+text+'</div>';document.body.appendChild(n);setTimeout(function(){var el=document.getElementById("game-notif");if(el)el.remove()},1500)}
// ═══════════════════════════════════════════════════
// KADERİNİ SEÇ — FATE GAME
// ═══════════════════════════════════════════════════
let ftState = null;
let FATES = [
  {id:'kill',name:'Öldür',emoji:'🗡️',color:'#e8433e'},
  {id:'marry',name:'Evlen',emoji:'💍',color:'#FFB800'},
  {id:'cheat',name:'İhanet Et',emoji:'🐍',color:'#e8433e'},
  {id:'flirt',name:'Flört Et',emoji:'😏',color:'#e8433e'},
  {id:'ghost',name:'Ghostla',emoji:'👻',color:'#6B7280'},
  {id:'kiss',name:'Öp',emoji:'💋',color:'#e8433e'},
  {id:'slap',name:'Tokat At',emoji:'👋',color:'#f97316'},
  {id:'run',name:'Kaç',emoji:'🏃',color:'#2dd4bf'},
];

function fateStart() {
  if(typeof checkBanned==="function"&&checkBanned())return;

  const ag = document.getElementById('ag');
  ag.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0">
      
      <div class="gi" style="background:linear-gradient(135deg,#e8433e,#e8433e);width:72px;height:72px;font-size:36px">🎭</div>
      <h2 class="fd" style="font-weight:700;font-size:36px">Kaderini Seç</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg" style="text-align:center;padding:60px 40px;max-width:700px;width:100%">
        <div style="font-size:100px;margin-bottom:20px">🎭</div>
        <h3 class="fd" style="font-size:42px;font-weight:700;margin-bottom:14px">Kaderini Seç</h3>
        <p style="font-size:20px;color:var(--t2);margin-bottom:36px">Karşına çıkacak karakterleri belirlemek için<br>cinsiyetini seç</p>
        <div style="display:flex;gap:20px;justify-content:center">
          <div class="t-size-btn" style="min-width:200px" onclick="initFate('M')">
            <div style="font-size:72px;margin-bottom:8px">👨</div>
            <div class="fd" style="font-size:28px;font-weight:700;color:var(--bl)">Erkeğim</div>
            <div style="font-size:13px;color:var(--t3);margin-top:4px">Kadın karakterler gelecek</div>
          </div>
          <div class="t-size-btn" style="min-width:200px" onclick="initFate('F')">
            <div style="font-size:72px;margin-bottom:8px">👩</div>
            <div class="fd" style="font-size:28px;font-weight:700;color:var(--pk)">Kadınım</div>
            <div style="font-size:13px;color:var(--t3);margin-top:4px">Erkek karakterler gelecek</div>
          </div>
        </div>
      </div>
    </div>`;
}

function initFate(myGender) {
  const opposite = myGender === 'M' ? 'F' : 'M';
  const pool = shuf(chars.filter(c => c.a && c.g === opposite)).slice(0, 16);
  
  if (pool.length < 8) {
    toast('Yeterli karşı cinsiyet karakter yok! (' + pool.length + '/8 min)', false);
    return;
  }
  
  ftState = {
    myGender,
    pool,
    remaining: [...pool],
    fates: FATES.map(f => ({...f, char: null})),
    passed: [],
    passesLeft: 3,
    lastPick: 0,
  };
  renderFateCard();
}

function fateAvailable() {
  return ftState.fates.filter(f => !f.char);
}

function fateAllDone() {
  return fateAvailable().length === 0;
}

function renderFateCard() {
  const s = ftState;
  if (!s) return;
  if (fateAllDone() || s.remaining.length === 0) { renderFateResult(); return; }
  
  const c = s.remaining[0];
  const usedCount = s.fates.filter(f => f.char).length;
  const available = fateAvailable();
  const ag = document.getElementById('ag');
  
  ag.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 20px">
      <button class="btn bg bsm" onclick="bk()">← Çık</button>
      <div class="gi" style="background:linear-gradient(135deg,#e8433e,#e8433e);width:48px;height:48px;font-size:22px">🎭</div>
      <div style="flex:1">
        <h2 class="fd" style="font-weight:700;font-size:28px">Kaderini Seç</h2>
        <p style="font-size:12px;color:var(--t3)">${usedCount}/8 kader atandı · ${s.passesLeft} pas hakkı</p>
      </div>
      <div style="text-align:right"><div class="fd" style="font-size:24px;font-weight:700;color:var(--pk)">${usedCount}/8 🎭</div></div>
    </div>
    <div style="flex:1;display:flex;gap:24px;padding:0 20px;overflow-y:auto">
      
      <!-- LEFT: Assigned fates -->
      <div style="width:400px;flex-shrink:0;overflow-y:auto">
        <div style="background:var(--bg2);border:1px solid var(--b1);border-radius:16px;padding:16px;height:100%">
          <h3 class="fd" style="font-size:16px;font-weight:700;color:var(--pk);margin-bottom:12px">🎭 Kaderler</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${s.fates.map(f => `
            <div style="padding:6px;border-radius:10px;background:${f.char ? f.color+'12' : 'var(--bg3)'};border:1px solid ${f.char ? f.color+'30' : 'transparent'};${!f.char?'opacity:.4':''}">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <span style="font-size:14px">${f.emoji}</span>
                <div style="font-size:11px;font-weight:600;color:${f.char ? f.color : 'var(--t3)'}">${f.name}</div>
              </div>
              ${f.char ? '<div style="border-radius:8px;overflow:hidden">' + cp(f.char, 200) + '</div><div style="font-size:10px;color:var(--t2);margin-top:2px">' + f.char.n + ' ' + f.char.s + '</div>' : '<div style="font-size:9px;color:var(--t3)">Boş</div>'}
            </div>
          `).join('')}
          </div>
          ${s.passed.length > 0 ? `
            <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--b1)">
              <p style="font-size:11px;color:var(--t3);margin-bottom:6px">⏭️ Pas geçilenler (${s.passed.length})</p>
              ${s.passed.map(p => '<div style="font-size:11px;color:var(--t3);padding:2px 0">• ' + p.n + ' ' + p.s + '</div>').join('')}
            </div>` : ''}
        </div>
      </div>
      
      <!-- RIGHT: Character + fate buttons -->
      <div style="flex:1;display:flex;align-items:center;justify-content:center">
        <div style="text-align:center;width:100%;max-width:700px">
          <div class="cg sci" style="padding:40px;display:inline-block;min-width:420px">
            <div style="max-width:500px;width:100%;max-height:400px;border-radius:24px;margin:0 auto 16px;border:3px solid var(--b1);overflow:hidden">
              ${cp(c, 500)}
            </div>
            <h3 class="fd" style="font-size:34px;font-weight:700">${esc(c.n)} ${esc(c.s)}</h3>
            
            
            
          </div>
          
          <div style="margin-top:24px">
            <p style="font-size:16px;color:var(--t2);margin-bottom:16px">${esc(c.n)} için kaderini seç:</p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
              ${available.map(f => `
                <button class="btn" style="background:${f.color}15;color:${f.color};border:2px solid ${f.color}40;padding:14px 24px;font-size:16px;font-weight:600;border-radius:12px;min-width:140px" onclick="fatePick('${f.id}','${c.id}')">
                  ${f.emoji} ${f.name}
                </button>
              `).join('')}
            </div>
            ${s.passesLeft > 0 ? `
              <button class="btn bg" style="margin-top:16px;font-size:14px;color:var(--t3);border:1px dashed var(--b2);padding:10px 28px;border-radius:10px" onclick="fatePas('${c.id}')">
                ⏭️ Pas Geç (${s.passesLeft} hak kaldı)
              </button>` : ''}
          </div>
        </div>
      </div>
    </div>`;
}

function fatePick(fateId, charId) {
  const s = ftState;
  if (!s || Date.now() - s.lastPick < 500) return;
  s.lastPick = Date.now();
  
  const c = s.remaining.find(x => x.id == charId);
  if (!c) return;
  
  const fate = s.fates.find(f => f.id === fateId);
  if (!fate || fate.char) return;
  
  fate.char = c;
  s.remaining = s.remaining.filter(x => x.id != charId);
  
  showGameNotif(fate.emoji, c.n + ' \u2192 ' + fate.name, true);
  
  setTimeout(() => renderFateCard(), 400);
}

function fatePas(charId) {
  const s = ftState;
  if (!s || Date.now() - s.lastPick < 500 || s.passesLeft <= 0) return;
  s.lastPick = Date.now();
  
  const c = s.remaining.find(x => x.id == charId);
  if (!c) return;
  
  s.passesLeft--;
  s.passed.push(c);
  s.remaining = s.remaining.filter(x => x.id != charId);
  
  showGameNotif('⏭️', c.n + ' pas geçildi! (' + s.passesLeft + ' hak kaldı)', true);
  
  setTimeout(() => renderFateCard(), 400);
}

function renderFateResult() {
  const s = ftState;
  const ag = document.getElementById('ag');
  
  ag.innerHTML = `
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg sci" style="text-align:center;padding:48px 36px;max-width:900px;width:100%;position:relative;overflow:hidden" id="fate-box">
        <div style="font-size:100px;margin-bottom:12px;animation:crownDrop .6s ease both">🎭</div>
        <h2 class="fd" style="font-size:44px;font-weight:700">Kaderler Belirlendi!</h2>
        <p style="font-size:18px;color:var(--t2);margin-top:8px">${s.fates.filter(f=>f.char).length} kader atandı${s.passed.length > 0 ? ' · ' + s.passed.length + ' pas' : ''}</p>
        
        <div style="margin-top:28px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px;max-width:700px;margin-left:auto;margin-right:auto">
          ${s.fates.filter(f => f.char).map(f => `
            <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;background:${f.color}10;border:1px solid ${f.color}25;text-align:left">
              <span style="font-size:32px">${f.emoji}</span>
              <div style="flex:1">
                <div style="font-size:16px;font-weight:700;color:${f.color}">${f.name}</div>
                <div style="font-size:14px;color:var(--t1);margin-top:2px">${f.char.n} ${f.char.s}</div>
                
              </div>
              <div style="width:100%;max-width:300px;border-radius:14px;overflow:hidden">${cp(f.char, 400)}</div>
            </div>
          `).join('')}
        </div>
        
        <div style="display:flex;justify-content:center;gap:12px;margin-top:32px">
          <button class="btn bp" onclick="fateStart()">🔄 Tekrar Oyna</button>
          <button class="btn bs" onclick="bk()">Oyunlara Dön</button>
        </div>
      </div>
    </div>`;
  
  var box = document.getElementById('fate-box');
  var colors = ['#e8433e','#e8433e','#FFB800','#e8433e','#2dd4bf'];
  for (var i = 0; i < 25; i++) {
    var p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.cssText = 'left:'+Math.random()*100+'%;top:'+(60+Math.random()*30)+'%;background:'+colors[i%5]+';animation-delay:'+Math.random()*.5+'s;animation-duration:'+(1+Math.random())+'s;width:'+(4+Math.random()*6)+'px;height:'+(4+Math.random()*6)+'px;border-radius:'+(Math.random()>.5?'50%':'2px');
    box.appendChild(p);
  }
}
