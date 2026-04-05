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
