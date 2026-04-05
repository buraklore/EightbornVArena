// ═══ GAME CARDS ═══
let GD=[{t:'STREAM',e:'🎬',d:'Chatinizle oynayabileceğiniz interaktif oyunlar',gr:'linear-gradient(135deg,#ff0000,#cc0000)',on:true,isNew:true},{t:'DIE',e:'⚔️',d:'Son hayatta kalan kim?',gr:'linear-gradient(135deg,#e8433e,#e8433e)',on:true},{t:'TEAM',e:'👥',d:'8 kişilik ekibini oluştur ve geri kalan herkesi CK\'la!',gr:'linear-gradient(135deg,#3b82f6,#06b6d4)',on:true},{t:'FATE',e:'🎲',d:'Flört mü edeceksin yoksa ihanet mi?',gr:'linear-gradient(135deg,#ec4899,#e8433e)',on:true},{t:'FACE',e:'🤔',d:'Karakterlerin fotoğraflarından isimlerini tahmin et!',gr:'linear-gradient(135deg,#2dd4bf,#14b8a6)',on:true},{t:'QUOTE',e:'💬',d:'Bu repliğin hangi karaktere ait olduğunu bilebilecek misin?',gr:'linear-gradient(135deg,#f59e0b,#eab308)',on:true},{t:'MEM',e:'🧠',d:'Eightborn hakkında ne kadar bilgilisin?',gr:'linear-gradient(135deg,#6366f1,#3b82f6)',on:true},{t:'WHO',e:'❓',d:'Hangi Eightborn karakterine benzediğini bul!',gr:'linear-gradient(135deg,#f472b6,#e8433e)',on:true}];
let TEAM_MAX=8;
let CHAR_TYPES=['Lider', 'Yalancı', 'Dedikoducu', 'Korkak', 'Cesur', 'Aptal', 'Kavgacı', 'Araba Delisi', 'Silah Delisi', 'Sadık', 'Hain', 'Cimri', 'Hovarda', 'Soğukkanlı', 'Sinirli', 'Tembel', 'Çalışkan', 'Romantik', 'Kıskanç', 'Şüpheci', 'Maceracı', 'Karizmatik', 'Manipülatif', 'Fedakar', 'Bencil', 'Asi', 'Paracı', 'Hesapçı', 'Vicdanlı', 'Psikopat'];
let GN={DIE:'Kim Hayatta Kalacak',TEAM:'Ekibini Kur',FATE:'Kaderini Seç',FACE:'Yüzden Bil',QUOTE:'Replik Bil',MEM:'Eightborn Moruq',WHO:'Sen Kimsin?',STREAM:'Yayıncı Oyunları'};
function gcH(){
  var diffs = {STREAM:'İNTERAKTİF !',DIE:'Kolay',TEAM:'Kolay',FATE:'Kolay',FACE:'Zor',QUOTE:'Zor',MEM:'Çok Zor',WHO:'KEŞFET!'};
  var diffColors = {STREAM:'rgba(232,67,62,.08);color:#e8433e',DIE:'rgba(45,212,191,.08);color:#2dd4bf',TEAM:'rgba(45,212,191,.08);color:#2dd4bf',FATE:'rgba(45,212,191,.08);color:#2dd4bf',FACE:'rgba(232,67,62,.08);color:#e8433e',QUOTE:'rgba(232,67,62,.08);color:#e8433e',MEM:'rgba(232,67,62,.08);color:#e8433e',WHO:'rgba(139,92,246,.08);color:#e8433e'};
  var iconBg = {STREAM:'rgba(232,67,62,.12)',DIE:'rgba(245,158,11,.1)',TEAM:'rgba(139,92,246,.1)',FATE:'rgba(232,67,62,.1)',FACE:'rgba(45,212,191,.1)',QUOTE:'rgba(245,158,11,.1)',MEM:'rgba(96,165,250,.1)',WHO:'rgba(139,92,246,.1)'};
  
  return '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1400px;margin:0 auto;padding:0 24px">' + GD.filter(function(g){return g.on}).map(function(g,i){
    var isStreamer = g.t === 'STREAM';
    var streamerClass = isStreamer ? 'background:linear-gradient(135deg,rgba(232,67,62,.05),rgba(139,92,246,.05));border-color:rgba(232,67,62,.15)' : '';
    
    return '<div style="background:var(--bg2);border:1px solid #ffffff06;border-radius:16px;padding:32px 24px;text-align:center;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;' + streamerClass + '" onclick="playDirect(\''+g.t+'\')" onmouseover="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 16px 48px rgba(0,0,0,.35)\';this.style.borderColor=\'' + (isStreamer ? '#e8433e' : '#ffffff14') + '\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\';this.style.borderColor=\'' + (isStreamer ? 'rgba(232,67,62,.15)' : '#ffffff06') + '\'">' +
    (isStreamer ? '<div style="position:absolute;top:12px;right:12px;font-size:11px;font-weight:800;letter-spacing:.5px;padding:4px 10px;border-radius:6px;background:#e8433e;color:#fff">CANLI YAYIN</div>' : '') +
    '<div style="width:68px;height:68px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 16px;background:' + (iconBg[g.t]||'rgba(139,92,246,.1)') + '">' + g.e + '</div>' +
    '<h3 style="font-size:17px;font-weight:700;margin-bottom:6px">' + GN[g.t] + '</h3>' +
    '<p style="font-size:14px;color:var(--t2);line-height:1.5;margin-bottom:12px">' + g.d + '</p>' +
    '<span style="display:inline-block;font-size:12px;font-weight:700;padding:4px 12px;border-radius:6px;background:' + (diffColors[g.t]||'rgba(45,212,191,.08);color:#2dd4bf') + '">' + (diffs[g.t]||'') + '</span>' +
    '</div>';
  }).join('') + '</div>';
}
document.getElementById('hg').innerHTML=gcH();document.getElementById('gg').innerHTML=gcH();

// Play from any page
function playDirect(t){
  document.querySelectorAll('[id^="p-"]').forEach(e=>e.classList.add('hid'));
  document.getElementById('p-games').classList.remove('hid');
  document.querySelectorAll('.nl').forEach(l=>l.classList.remove('a'));
  document.querySelectorAll('.mob-nav a').forEach(function(a){a.classList.remove('on')});
  var ma=document.querySelectorAll('.mob-nav a');if(ma[1])ma[1].classList.add('on');
  window.scrollTo({top:0,behavior:'smooth'});
  play(t);
}

function play(t){
  document.getElementById('ag').classList.remove('hid');
  document.getElementById('gg').style.display='none';
  document.getElementById('games-hdr').style.display='none';
  var gc=document.getElementById('games-con');gc.style.maxWidth='none';gc.style.padding='0';
  if(t==='DIE')dieStart();else if(t==='TEAM')teamStart();else if(t==='FATE')fateStart();else if(t==='FACE')faceStart();else if(t==='QUOTE')quoteStart();else if(t==='MEM')memStart();else if(t==='WHO')whoStart();else if(t==='STREAM')streamStart();else genericGame(t);
}
function bk(){
  document.getElementById('ag').classList.add('hid');
  document.getElementById('gg').style.display='';
  document.getElementById('games-hdr').style.display='';
  var gc=document.getElementById('games-con');gc.style.maxWidth='';gc.style.padding='';
  tState=null;dState=null;tmState=null;ftState=null;fcState=null;rqState=null;mState=null;whState=null;
}

function genericGame(t){const cs=pick(chars.filter(c=>c.a),4);const g=GD.find(x=>x.t===t);
document.getElementById('ag').innerHTML='<div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0"><button class="btn bg bsm" onclick="bk()">← Geri</button><div class="gi" style="background:'+g.gr+';width:72px;height:72px;font-size:36px">'+g.e+'</div><h2 class="fd" style="font-weight:700;font-size:24px">'+GN[t]+'</h2></div><div style="flex:1;display:flex;align-items:center;justify-content:center"><div style="width:100%;text-align:center"><p style="color:var(--t2);font-size:18px;margin-bottom:20px">'+g.d+'</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+cs.map(c=>'<div class="card" style="text-align:center;cursor:pointer;padding:36px 24px" onclick="gW()"><div style="width:220px;height:220px;border-radius:28px;overflow:hidden;margin:0 auto 16px;border:2px solid var(--b1)">'+cp(c,220)+'</div><h4 class="fd" style="font-size:32px;font-weight:600">'+esc(c.n)+' '+esc(c.s)+'</h4></div>').join('')+'</div></div></div>'}
function gW(){toast('Seçildi!');bk()}


// ═══ NEW HOMEPAGE OVERRIDE ═══
// Runs after auth.js loads, overrides layout
window.addEventListener('load', function() {
  
  // Override renderNav with new design
  var _origRenderNav = typeof renderNav === 'function' ? renderNav : null;
  window.renderNav = function() {
    var navEl = document.getElementById('nav-root') || document.getElementById('main-nav');
    if (!navEl) return;
    navEl.innerHTML = '<nav><div style="max-width:1400px;margin:auto;padding:0 32px;display:flex;align-items:center;height:68px">' +
      '<a onclick="goSec(\'home\')" style="cursor:pointer;text-decoration:none;flex-shrink:0"><span class="fd" style="font-size:34px;letter-spacing:2px">EIGHTBORN<b style=\'color:var(--v)\'>V</b></span></a>' +
      '<div class="nls" style="display:flex;gap:4px;margin-left:48px">' +
        '<button class="nl" data-p="home" onclick="goSec(\'home\')">Ana Sayfa</button>' +
        '<button class="nl" data-p="games" onclick="goSec(\'games\')">Oyunlar</button>' +
        '<button class="nl" data-p="lb" onclick="goSec(\'lb\')">Sıralama</button>' +
        '<button class="nl" data-p="contact" onclick="goSec(\'contact\')">Bize Ulaşın</button>' +
        (typeof curUser!=='undefined'&&curUser&&curUser.role==='ADMIN'?'<button class="nl" data-p="admin" onclick="go(\'admin\')" style="color:var(--pk)">Admin</button>':'') +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:10px;margin-left:auto">' +
        '<a id="discord-link" href="#" target="_blank" style="display:none;font-size:14px;font-weight:700;padding:10px 22px;border-radius:10px;background:#5865F2;color:#fff;text-decoration:none;margin-right:12px">Discord</a>' +
        (typeof curUser!=='undefined'&&curUser?
          '<div style="display:flex;align-items:center;gap:10px;padding:8px 16px;border-radius:12px;background:var(--bg3)"><div style="width:36px;height:36px;border-radius:8px;background:rgba(232,67,62,.1);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--v)">'+(typeof esc==='function'?esc(curUser.username):'?')[0].toUpperCase()+'</div><span style="font-size:14px;font-weight:600">'+(typeof esc==='function'?esc(curUser.username):'')+'</span><button class="btn bg bsm" style="color:var(--pk);border:1px solid rgba(232,67,62,.2)" onclick="doLogout()">Çıkış</button></div>'
        :
          '<button class="btn bs" style="padding:10px 22px" onclick="go(\'login\')">Giriş</button><button class="btn bp" style="padding:10px 22px" onclick="go(\'register\')">Kayıt Ol</button>'
        ) +
      '</div>' +
    '</div></nav>';
    if(typeof loadDiscord==='function') loadDiscord();
  };

  // goSec - scroll to section on home page
  window.goSec = function(sec) {
    _buildHome();
    document.querySelectorAll('[id^="p-"]').forEach(function(e){e.classList.add('hid')});
    document.getElementById('p-home').classList.remove('hid');
    document.querySelectorAll('.nl').forEach(function(l){l.classList.remove('a')});
    document.querySelectorAll('.mob-nav a').forEach(function(a){a.classList.remove('on')});
    var mobMap={home:0,games:1,lb:2,contact:3};
    var idx=mobMap[sec];if(idx!==undefined){var ma=document.querySelectorAll('.mob-nav a');if(ma[idx])ma[idx].classList.add('on');}
    setTimeout(function(){
      var el=document.getElementById('sec-'+sec);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      else window.scrollTo({top:0,behavior:'smooth'});
    },80);
    if(sec==='lb'&&typeof rLB==='function') rLB();
  };

  // Build home page content
  function _buildHome() {
    var ph=document.getElementById('p-home');
    if(!ph||ph.dataset.built) return;
    ph.dataset.built='1';
    ph.className='pg';
    ph.style.cssText='';

    ph.innerHTML =
    '<div style="max-width:1400px;margin:auto;padding:80px 32px 64px;display:flex;align-items:center;gap:40px" id="sec-home">' +
      '<div style="flex:0 0 38%;min-width:280px">' +
        '<div style="display:inline-block;font-size:13px;font-weight:700;letter-spacing:.5px;color:var(--m);background:rgba(45,212,191,.08);padding:6px 16px;border-radius:8px;margin-bottom:20px">FiveM Roleplay Arenası</div>' +
        '<h1 class="fd" style="font-size:clamp(52px,7vw,84px);line-height:.95;letter-spacing:2px;margin-bottom:18px">EIGHTBORN<span style="color:var(--v)">V</span><br>ARENA</h1>' +
        '<p style="font-size:17px;color:var(--t2);line-height:1.7;max-width:460px;margin-bottom:28px">Karakterlerini ne kadar tanıyorsun? 8 farklı oyun modunda yeteneklerini test et, sıralamaya gir, chat ile yarış.</p>' +
        '<div style="display:flex;gap:10px">' +
          '<button class="btn bp" style="padding:14px 32px;font-size:16px;border-radius:12px" onclick="document.getElementById(\'sec-games\').scrollIntoView({behavior:\'smooth\'})">Oynamaya Başla</button>' +
          '<button class="btn bs" style="padding:14px 32px;font-size:16px;border-radius:12px" onclick="document.getElementById(\'sec-games\').scrollIntoView({behavior:\'smooth\'})">Oyunlara Göz At</button>' +
        '</div>' +
      '</div>' +
      '<div id="hero-img-container" style="flex:1;min-width:0;aspect-ratio:16/9;border-radius:18px;overflow:hidden;border:1px solid #ffffff08;position:relative;background:var(--bg2)">' +
        '<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block"><defs><filter id="bl"><feGaussianBlur stdDeviation="6"/></filter><filter id="bl2"><feGaussianBlur stdDeviation="3"/></filter><linearGradient id="hg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#12101a"/><stop offset="100%" stop-color="#0e0c16"/></linearGradient><linearGradient id="gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#2dd4bf"/><stop offset="100%" stop-color="#2dd4bf00"/></linearGradient><linearGradient id="rr" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#e8433e00"/><stop offset="100%" stop-color="#e8433e"/></linearGradient><clipPath id="cp1"><rect x="62" y="100" width="196" height="120" rx="12"/></clipPath><clipPath id="cp2"><rect x="382" y="100" width="196" height="120" rx="12"/></clipPath></defs><rect width="640" height="360" fill="url(#hg1)"/><rect x="16" y="12" width="608" height="36" rx="10" fill="#ffffff05" stroke="#ffffff08" stroke-width=".5"/><text x="32" y="35" font-family="Bebas Neue,sans-serif" font-size="16" fill="#f59e0b" letter-spacing="2">KIM HAYATTA KALACAK</text><rect x="490" y="18" width="56" height="24" rx="6" fill="#e8433e15" stroke="#e8433e40" stroke-width=".5"/><circle cx="502" cy="30" r="3.5" fill="#e8433e"><animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/></circle><text x="514" y="34" font-family="Plus Jakarta Sans,sans-serif" font-size="10" font-weight="700" fill="#e8433e">TUR 5</text><rect x="556" y="18" width="56" height="24" rx="6" fill="#ffffff06"/><text x="584" y="34" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-size="10" font-weight="600" fill="#8a8898">4 / 8</text><text x="320" y="72" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-size="11" font-weight="600" fill="#4e4d5a" letter-spacing="3">SIRA KIMDE?</text><rect x="40" y="86" width="240" height="210" rx="16" fill="#18181e" stroke="#ffffff06" stroke-width=".5"/><image href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAAAAAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAuAFADASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAABAUDAgEA/8QALBAAAgIBAwMCBQQDAAAAAAAAAQIDEQAEEiExQVETIgUjMmFxFGKBobHR8P/EABcBAQEBAQAAAAAAAAAAAAAAAAIBAAP/xAAdEQADAAMAAwEAAAAAAAAAAAAAARECITESIkFh/9oADAMBAAIRAxEAPwCD60sddHGP0oecUiFmI+lRZwBQKxroTjNNYjBRip8g0RnHKHfGg5kZdRIrqVIPQgjON9ciNAPBN5Uljjl1G6QFrQEk9z5wkukUudpCLXXEmgOhvUfbW5R4rOWdmNs5OIMJhsGyB3BzZNJK4BEUp4u664lAv9ZPQAuBzzxiGpgFo2DWay6doZUEiMrHkbqzmNPnn7thyYsTxNK8gsUM3T4c56v/AFjIUAVg3tAPPas1jm00Vj1R9++amdpE3lgAexOL0xqLAkFSeeCeMTC9IMmQsGJnmcToFdK9MDr/ANznFs7llO8r1rjCTAq11w3fKPwRqWU1ZoDGkoc24w97mIKi8r6f4lBEu0kn27T7ehyI85RwOxPOes6hj7Fzc+m1lpoVr50mmRksgIQScOlFwe2cl1N+xf8AWfep9ICgUO2B7Hgpo1mchaBO3r+cl7vmDpW3sMc7koRhGo+bI44xLgX0eEnPSMKCe/GZx6YiYxluQl9KH4vPm1iSMWp1+wo/3nB1LxhmjJUkVZ5OVtESZ1qoZEUM3Cf4vGfAx8uU+SBklpne9zkk+TeL0evOkjKLEGs3ZNYkGQPMtsR+7Ffo9QQGWNipHGYxSqdQrulqDdZc086zoWQEAHvkZU4Rzp5x1jYfxmungBa5tu2uhajlZW3rY4z0nzzhiF5MnvpoBGzAXQvh8Dthv6Tf5yvqUX0JG2iwp7YTS6SDUaaOUqwZhRpsul0Ps+H/2Q==" x="62" y="90" width="196" height="140" clip-path="url(#cp1)" filter="url(#bl)" preserveAspectRatio="xMidYMid slice"/><rect x="120" y="230" width="80" height="12" rx="4" fill="#2a2a36" filter="url(#bl2)"/><rect x="100" y="250" width="120" height="8" rx="3" fill="#ffffff06"/><rect x="100" y="250" width="78" height="8" rx="3" fill="url(#gr)"/><text x="108" y="257" font-family="Plus Jakarta Sans,sans-serif" font-size="7" font-weight="700" fill="#000">%65</text><rect x="64" y="270" width="86" height="18" rx="5" fill="#2dd4bf12" stroke="#2dd4bf25" stroke-width=".5"/><text x="107" y="282" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-size="9" font-weight="700" fill="#2dd4bf">HAYATTA</text><rect x="302" y="162" width="36" height="36" rx="18" fill="#e8433e"/><text x="320" y="185" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="16" fill="#fff">VS</text><rect x="360" y="86" width="240" height="210" rx="16" fill="#18181e" stroke="#ffffff06" stroke-width=".5"/><image href="data:image/jpeg;base64,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" x="382" y="90" width="196" height="140" clip-path="url(#cp2)" filter="url(#bl)" preserveAspectRatio="xMidYMid slice"/><rect x="440" y="230" width="80" height="12" rx="4" fill="#2a2a36" filter="url(#bl2)"/><rect x="420" y="250" width="120" height="8" rx="3" fill="#ffffff06"/><rect x="498" y="250" width="42" height="8" rx="3" fill="url(#rr)"/><text x="532" y="257" text-anchor="end" font-family="Plus Jakarta Sans,sans-serif" font-size="7" font-weight="700" fill="#e8433e">%35</text><rect x="450" y="270" width="86" height="18" rx="5" fill="#e8433e10" stroke="#e8433e25" stroke-width=".5"/><text x="493" y="282" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-size="9" font-weight="700" fill="#e8433e">TEHLiKEDE</text><rect x="16" y="310" width="608" height="38" rx="10" fill="#ffffff04" stroke="#ffffff06" stroke-width=".5"/><rect x="26" y="318" width="280" height="22" rx="6" fill="#2dd4bf10"/><rect x="26" y="318" width="182" height="22" rx="6" fill="#2dd4bf"/><text x="36" y="333" font-family="Plus Jakarta Sans,sans-serif" font-size="10" font-weight="700" fill="#000">%65 OY</text><rect x="316" y="318" width="98" height="22" rx="6" fill="#e8433e"/><text x="370" y="333" font-family="Plus Jakarta Sans,sans-serif" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">%35 OY</text><text x="440" y="333" font-family="Plus Jakarta Sans,sans-serif" font-size="10" font-weight="600" fill="#4e4d5a">4 karakter kaldi</text><rect x="546" y="318" width="68" height="22" rx="6" fill="#e8433e"/><text x="580" y="333" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-size="11" font-weight="700" fill="#fff">OYNA</text></svg>' +
        '<div style="position:absolute;top:14px;left:14px;display:flex;align-items:center;gap:6px"><div style="display:flex;align-items:center;gap:5px;background:#e8433e;padding:5px 10px;border-radius:6px"><div style="width:7px;height:7px;border-radius:50%;background:#fff;animation:blink 1.5s infinite"></div><span style="font-size:11px;font-weight:800;color:#fff;letter-spacing:1px">LIVE</span></div><div style="background:rgba(0,0,0,.7);padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;color:#fff">\ud83d\udc41 1.2K izliyor</div></div>' +
        '<div style="position:absolute;top:14px;right:14px;display:flex;align-items:center;gap:6px"><div style="background:rgba(0,0,0,.7);padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;color:#fff">\ud83c\udfac Yayıncı Oyunu</div><div style="background:rgba(0,0,0,.7);padding:5px 10px;border-radius:6px;font-size:11px;color:#e8433e;font-weight:700">REC \u25cf</div></div>' +
        '<div style="position:absolute;bottom:12px;left:14px;display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.75);padding:8px 14px;border-radius:8px"><div style="width:28px;height:28px;border-radius:6px;background:linear-gradient(135deg,#e8433e,#ff6b4a);display:flex;align-items:center;justify-content:center;font-size:14px">\ud83c\udfae</div><div style="font-size:12px;font-weight:700;color:#fff">EightbornV Arena</div></div>' +
        '<div style="position:absolute;bottom:12px;right:14px;background:rgba(0,0,0,.75);padding:8px 14px;border-radius:8px;font-size:11px;font-weight:600;color:#2dd4bf">\ud83d\udcac Chat Aktif — 342 mesaj</div>' +
      '</div>' +
    '</div>' +

    '<div style="max-width:1400px;margin:0 auto;padding:16px 32px 0"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px" id="stats-bar">' +
      '<div class="card" style="padding:24px 26px;display:flex;align-items:center;gap:16px"><div style="width:52px;height:52px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(232,67,62,.1);color:var(--v);flex-shrink:0">\u2694\ufe0f</div><div><div class="fd" style="font-size:36px;line-height:1">218+</div><div style="font-size:14px;color:var(--t2);margin-top:2px">Toplam Karakter</div></div></div>' +
      '<div class="card" style="padding:24px 26px;display:flex;align-items:center;gap:16px"><div style="width:52px;height:52px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(45,212,191,.1);color:var(--m);flex-shrink:0">\ud83c\udfae</div><div><div class="fd" style="font-size:36px;line-height:1">2,500+</div><div style="font-size:14px;color:var(--t2);margin-top:2px">Toplam Oynama</div></div></div>' +
      '<div class="card" style="padding:24px 26px;display:flex;align-items:center;gap:16px"><div style="width:52px;height:52px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(245,158,11,.1);color:#f59e0b;flex-shrink:0">\ud83c\udfc6</div><div><div class="fd" style="font-size:36px;line-height:1">45,000+</div><div style="font-size:14px;color:var(--t2);margin-top:2px">Kazanılan Puan</div></div></div>' +
      '<div class="card" style="padding:24px 26px;display:flex;align-items:center;gap:16px"><div style="width:52px;height:52px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(139,92,246,.1);color:#8b5cf6;flex-shrink:0">\ud83d\udcca</div><div><div class="fd" style="font-size:36px;line-height:1">8</div><div style="font-size:14px;color:var(--t2);margin-top:2px">Oyun Modu</div></div></div>' +
    '</div></div>' +

    '<div style="max-width:1400px;margin:auto;padding:56px 32px" id="sec-games"><div style="display:flex;align-items:center;gap:14px;margin-bottom:28px"><h2 class="fd" style="font-size:34px;letter-spacing:2px">OYUNLAR</h2><div style="flex:1;height:1px;background:#ffffff06"></div><div style="font-size:14px;font-weight:700;color:var(--t3);background:var(--bg3);padding:6px 14px;border-radius:8px">8 mod</div></div><div id="hg2"></div></div>' +

    '<div style="max-width:1400px;margin:auto;padding:56px 32px" id="sec-lb"><div id="lbt"></div></div>' +

    '<div style="max-width:1400px;margin:auto;padding:48px 24px" id="sec-contact"><div style="background:var(--bg2);border:1px solid #ffffff06;border-radius:20px;padding:60px;display:flex;gap:60px;align-items:flex-start"><div style="flex:1"><h2 class="fd" style="font-size:52px;letter-spacing:2px;margin-bottom:12px">BİZE ULAŞIN</h2><p style="font-size:17px;color:var(--t2);line-height:1.7">Sorularınız, önerileriniz veya hata bildirimleri için bize yazabilirsiniz. En kısa sürede dönüş yapacağız.</p></div><div style="flex:1;max-width:480px"><label class="lbl">Konu Başlığı</label><input class="inp" id="contact-title" placeholder="Örn: Karakter Fotoğrafı Hatası" maxlength="100"><label class="lbl" style="margin-top:4px">Açıklama</label><textarea class="inp" id="contact-desc" rows="5" placeholder="Detaylandırın..." maxlength="1000" style="min-height:150px"></textarea><button class="btn bp" style="width:100%;padding:16px;font-size:16px;border-radius:12px;margin-top:8px" onclick="sendContact()">Gönder</button></div></div></div>';

    // Fill game cards
    if(typeof gcH==='function'){var hg2=document.getElementById('hg2');if(hg2)hg2.innerHTML=gcH();}
    // Load leaderboard
    if(typeof rLB==='function') setTimeout(rLB,500);
  }

  // Inject responsive CSS
  var rs=document.createElement('style');
  rs.textContent='@media(max-width:900px){#sec-home{flex-direction:column!important;padding:48px 24px 32px!important;text-align:center;gap:32px!important}#sec-home>div:first-child p{margin:0 auto 24px}#sec-home>div:first-child>div:last-child{justify-content:center}#hero-img-container{min-width:0!important;width:100%!important;flex:none!important}#stats-bar{grid-template-columns:1fr 1fr!important}#sec-contact>div{flex-direction:column!important;padding:36px!important;gap:28px!important}#sec-contact>div>div:last-child{max-width:100%!important;width:100%!important}.nls{display:none!important}}@media(max-width:500px){#stats-bar{grid-template-columns:1fr!important}#sec-home h1{font-size:44px!important}}';
  document.head.appendChild(rs);

  // Inject mobile nav
  if(!document.querySelector('.mob-nav')){var mn=document.createElement('div');mn.className='mob-nav';mn.innerHTML='<div class="mob-nav-inner"><a href="#" class="on" onclick="goSec(\'home\');return false"><span>\u26a1</span>Anasayfa</a><a href="#" onclick="goSec(\'games\');return false"><span>\ud83c\udfae</span>Oyunlar</a><a href="#" onclick="goSec(\'lb\');return false"><span>\ud83c\udfc6</span>Sıralama</a><a href="#" onclick="goSec(\'contact\');return false"><span>\ud83d\udcec</span>İletişim</a><a href="#" onclick="go(\'login\');return false"><span>\ud83d\udc64</span>Profil</a></div>';document.body.appendChild(mn);}

  // Override go to redirect home/lb/contact to goSec
  var _origGo = window.go;
  window.go = function(pg) {
    if(pg==='home'||pg==='lb'||pg==='contact') { goSec(pg); return; }
    if(typeof _origGo==='function') _origGo(pg);
  };

  // Build and render
  renderNav();
  _buildHome();
});
