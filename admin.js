// ═══ ADMIN (simplified for focus on tournament) ═══
const AT=[{k:'chars',l:'Karakterler',i:'⚔️'},{k:'questions',l:'Sorular',i:'❓'},{k:'games',l:'Oyunlar',i:'🎮'},{k:'ranking',l:'Sıralama',i:'🏆'},{k:'users',l:'Kullanıcılar',i:'👤'},{k:'ads',l:'Reklamlar',i:'📢'},{k:'msgs',l:'Mesajlar',i:'📨'},{k:'gameedit',l:'Oyun Düzenle',i:'✏️'},{k:'hero',l:'Hero Görseli',i:'🖼️'},{k:'discord',l:'Discord',i:'🎮'}];
function rAdm(){document.getElementById('adm-nav').innerHTML=AT.map(t=>'<button class="nl'+(aTab===t.k?' a':'')+'" style="justify-content:flex-start;width:100%;font-size:15px;padding:12px 16px" onclick="aTab=\''+t.k+'\';rAdm()">'+t.i+' '+t.l+'</button>').join('');const e=document.getElementById('adm-c');({chars:aChars,questions:aQuestions,games:aGames,ranking:aRanking,users:aUsers,ads:aAds,msgs:aMsgs,gameedit:aGameEdit,hero:aHero,discord:aDiscord})[aTab](e)}

function aChars(e){
  if(!window._dataLoaded){
    e.innerHTML='<div style="text-align:center;padding:40px;color:var(--t2)">Karakterler yükleniyor...</div>';
    setTimeout(function(){aChars(e);},500);
    return;
  }
  var noDbId=chars.filter(function(c){return !c.dbId && c.a;});
  if(noDbId.length>0){
    e.innerHTML='<div style="text-align:center;padding:40px;color:var(--t2)">Karakterler veritabanına aktarılıyor... ('+noDbId.length+')</div>';
    var done=0;
    noDbId.forEach(function(c){
      apiSaveCharacter({n:c.n,s:c.s||'',rep:c.rep||'',tip:c.tip||'',g:c.g||'M',a:c.a!==false,img:c.img||'',origName:c.n,origSurname:c.s||''}).then(function(r){
        if(r.id){c.dbId=r.id;}
        done++;if(done>=noDbId.length){toast(done+' karakter aktarıldı.');aChars(e);}
      }).catch(function(){done++;if(done>=noDbId.length)aChars(e);});
    });
    return;
  }
  var sortedChars=chars.slice().sort(function(a,b){return (a.n+' '+a.s).localeCompare(b.n+' '+b.s,'tr')});
  e.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 class="fd" style="font-weight:600;font-size:15px">⚔️ Karakterler <span class="badge bv">'+chars.length+'</span> <span style="font-size:11px;color:var(--t3);font-weight:400;margin-left:8px">👨 '+chars.filter(x=>x.g==="M").length+' erkek · 👩 '+chars.filter(x=>x.g==="F").length+' kadın</span></h3><button class="btn bp bsm" onclick="cMod()">+ Ekle</button></div><div class="card" style="padding:0;overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr style="border-bottom:1px solid var(--b1);font-size:11px;color:var(--t3)"><th style="text-align:left;padding:10px 14px">Foto</th><th style="text-align:left;padding:10px">Karakter</th><th style="text-align:center;padding:10px">Cinsiyet</th><th style="text-align:center;padding:10px">Durum</th><th style="text-align:right;padding:10px 14px;width:90px">İşlem</th></tr></thead><tbody>'+sortedChars.map(c=>'<tr style="border-bottom:1px solid #2a2a3a20" onmouseover="this.style.background=\'var(--bg3)\'" onmouseout="this.style.background=\'\'"><td style="padding:8px 14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden">'+cp(c,44)+'</div></td><td style="padding:8px 10px"><div style="font-size:13px;font-weight:500">'+esc(c.n)+' '+esc(c.s)+'</div>'+(c.rep?'<div style="font-size:11px;color:var(--t3);font-style:italic;margin-top:2px">\"'+esc(c.rep)+'\"</div>':'')+'</td><td style="padding:8px;text-align:center">'+(c.g==='F'?'<span style="font-size:13px;padding:4px 10px;border-radius:8px;background:#e8433e20;color:#e8433e">👩 Kadın</span>':'<span style="font-size:13px;padding:4px 10px;border-radius:8px;background:#3b82f620;color:#3b82f6">👨 Erkek</span>')+'</td><td style="padding:8px;text-align:center"><span class="badge '+(c.a?'bm2':'bpk')+'">'+(c.a?'Aktif':'Pasif')+'</span></td><td style="padding:8px 14px;text-align:right"><button class="btn bg bsm" style="padding:3px 6px" onclick="cMod(\''+(c.dbId||c.id)+'\')">✏️</button> <button class="btn bg bsm" style="padding:3px 6px;color:var(--pk)" onclick="delChar(\''+c.id+'\','+(c.dbId||'null')+')">🗑️</button></td></tr>').join('')+'</tbody></table></div>'}

function delChar(localId, dbId) {
  if (!confirm('Bu karakteri silmek istediğine emin misin?')) return;
  var c = chars.find(function(x){ return x.id == localId; });
  if (!c) return;
  
  if (dbId && dbId !== 'null') {
    // DB character — delete from DB then save as deleted
    apiDeleteCharacter(dbId).then(function(r) {
      // Also save to deleted list so data.js chars don't come back
      saveDeletedChar(c);
      chars = chars.filter(function(x) { return x.id != localId; });
      toast('Kalıcı olarak silindi.');
      aChars(document.getElementById('adm-c'));
    });
  } else {
    // data.js character — save to deleted list in DB
    saveDeletedChar(c);
    chars = chars.filter(function(x) { return x.id != localId; });
    toast('Kalıcı olarak silindi.');
    aChars(document.getElementById('adm-c'));
  }
}

function saveDeletedChar(c) {
  var key = (c.n||'') + '|' + (c.s||'');
  apiGet('/game-config').then(function(r) {
    var deleted = [];
    try { deleted = JSON.parse(r.deleted_chars || '[]'); } catch(e){}
    if (deleted.indexOf(key) === -1) deleted.push(key);
    apiPost('/game-config', {key:'deleted_chars', value:JSON.stringify(deleted)});
  });
}

function cMod(id){const c=id?chars.find(x=>x.dbId==id||x.id==id):null;
var avSrc=c?c._av||mkAv(c):'';
modal('<h3 class="fd">'+(c?'Düzenle':'Yeni Karakter')+'<button class="close" onclick="closeModal()">\u2715</button></h3>'+
'<div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">'+
'<div id="pbox" style="width:100px;height:100px;border-radius:16px;overflow:hidden;border:2px solid var(--b1);flex-shrink:0;background:var(--bg3)">'+(avSrc?'<img src="'+avSrc+'" style="width:100%;height:100%;object-fit:cover">':'<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--t3);font-size:11px">Fotoğraf\nyok</div>')+'</div>'+
'<div style="flex:1"><label class="lbl">Karakter Fotoğrafı</label><div style="display:flex;gap:8px"><button class="btn bs bsm" onclick="document.getElementById(\'cfile\').click()">📷 Dosya Seç</button><span style="font-size:10px;color:var(--t3);align-self:center">veya otomatik avatar</span></div><input type="file" id="cfile" accept="image/*" style="display:none" onchange="pvFile(this)"><input type="hidden" id="cimg" value="'+(c?.img||'')+'"></div></div>'+
'<div class="form-row"><div class="form-group"><label class="lbl">Ad *</label><input class="inp" id="cn" value="'+(c?.n||'')+'"></div><div class="form-group"><label class="lbl">Soyad</label><input class="inp" id="cs" value="'+(c?.s||'')+'"></div></div>'+
'<div class="form-row"><div class="form-group"><label class="lbl">Cinsiyet *</label><select class="inp" id="cg"><option value="M"'+(c?.g==='M'||!c?' selected':'')+'>\ud83d\udc68 Erkek</option><option value="F"'+(c?.g==='F'?' selected':'')+'>\ud83d\udc69 Kad\u0131n</option></select></div><div class="form-group"><label class="lbl">Kişilik Tipi</label><input class="inp" id="ctip" value="'+(c?.tip||'')+'" placeholder="örn: kavgacı, sinirli, araba seven..."></div></div>'+
'<div class="form-group"><label class="lbl">Replik</label><textarea class="inp" id="crep" placeholder="Karakterin ikonik repli\u011fi...">'+(c?.rep||'')+'</textarea></div>'+
'<div class="form-group"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" class="chk" id="ca" '+(c?.a!==false?'checked':'')+'> <span style="font-size:13px">Aktif</span></label></div>'+
'<button class="btn bp" style="width:100%" onclick="cSav(\''+(id||'')+'\')">'+(c?'\ud83d\udcbe G\u00fcncelle':'\u2795 Ekle')+'</button>')}
function pvUrl(v){document.getElementById('pbox').innerHTML=v?'<img src="'+v+'" style="width:100%;height:100%;object-fit:cover">':'<div style="color:var(--t3);font-size:12px;padding:16px;text-align:center">📷 Fotoğraf yükle</div>'}
function pvFile(i){if(!i.files[0])return;var file=i.files[0];var img=new Image();var reader=new FileReader();reader.onload=function(e){img.onload=function(){var canvas=document.createElement('canvas');var max=400;var w=img.width;var h=img.height;if(w>max){h=Math.round(h*(max/w));w=max}if(h>max){w=Math.round(w*(max/h));h=max}canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(img,0,0,w,h);var compressed=canvas.toDataURL('image/jpeg',0.75);document.getElementById('pbox').innerHTML='<img src="'+compressed+'" style="width:100%;height:100%;object-fit:cover">';document.getElementById('cimg').value=compressed};img.src=e.target.result};reader.readAsDataURL(file)}
function cSav(id){
  var n=document.getElementById('cn').value.trim();
  if(!n){toast('Ad zorunlu!',false);return}
  var origChar=id?chars.find(function(x){return String(x.dbId)==String(id)||String(x.id)==String(id)}):null;
  var numericId=null;
  if(origChar&&origChar.dbId)numericId=parseInt(origChar.dbId);
  if(!numericId&&id)numericId=parseInt(id);
  if(isNaN(numericId))numericId=null;
  
  var d={
    name:sanitize(n,30),
    surname:sanitize(document.getElementById('cs').value,30),
    rep:sanitize(document.getElementById('crep').value,200),
    tip:sanitize(document.getElementById('ctip').value,100),
    active:document.getElementById('ca').checked,
    img:document.getElementById('cimg').value.trim(),
    gender:document.getElementById('cg').value
  };
  if(numericId)d.id=numericId;
  if(origChar){d.origName=origChar.n;d.origSurname=origChar.s||'';}
  
  apiSaveCharacter(d).then(function(r){
    if(r.error){toast(r.error,false);return}
    if(origChar){
      origChar.n=d.name;origChar.s=d.surname;origChar.rep=d.rep;
      origChar.tip=d.tip;origChar.a=d.active;origChar.img=d.img;origChar.g=d.gender;
      if(r.id)origChar.dbId=r.id;
    }else{
      chars.push({id:r.id,dbId:r.id,n:d.name,s:d.surname,rep:d.rep,tip:d.tip,a:d.active,img:d.img,g:d.gender});
    }
    initAvatars();toast(origChar?'Güncellendi (ID:'+r.id+')':'Eklendi.');closeModal();aChars(document.getElementById('adm-c'));
  }).catch(function(){toast('Kayıt hatası',false)})
}

// ═══ ADMIN SORULAR ═══
function aQuestions(e){
  if(!window._dataLoaded){
    e.innerHTML='<div style="text-align:center;padding:40px;color:var(--t2)">Sorular yükleniyor...</div>';
    setTimeout(function(){aQuestions(e);},500);
    return;
  }
  renderQuestions(e);
}

function renderQuestions(e){
  e.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 class="fd" style="font-weight:600;font-size:15px">❓ Hafıza Oyunu Soruları <span class="badge bgl">'+memQs.length+'</span></h3><button class="btn bp bsm" onclick="mqMod()">+ Soru Ekle</button></div>'+
  memQs.map(function(q,i){return '<div class="card" style="margin-bottom:8px;padding:14px 16px"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="flex:1"><p style="font-size:14px;font-weight:500">'+(i+1)+'. '+esc(q.q)+'</p><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">'+q.o.map(function(o,oi){return '<span style="font-size:11px;padding:3px 8px;border-radius:6px;'+(oi===q.ci?'background:#2dd4bf15;color:var(--m);font-weight:600':'background:var(--bg3);color:var(--t3)')+'">'+String.fromCharCode(65+oi)+') '+o+'</span>'}).join('')+'</div></div><div style="display:flex;gap:4px;margin-left:8px"><button class="btn bg bsm" style="padding:3px 6px" onclick="mqMod(\''+(q.dbId||q.id)+'\')">✏️</button><button class="btn bg bsm" style="padding:3px 6px;color:var(--pk)" onclick="apiDeleteQuestion('+(q.dbId||q.id)+').then(function(){memQs=memQs.filter(function(x){return (x.dbId||x.id)!='+(q.dbId||q.id)+'});toast(\'Silindi.\');aQuestions(document.getElementById(\'adm-c\'))})">🗑️</button></div></div></div>'}).join('')+
  (memQs.length===0?'<div class="card" style="text-align:center;padding:40px;color:var(--t3)">Henüz soru yok. Soru ekleyin.</div>':'')+wqSection()
}

function mqMod(id){var q=id?memQs.find(function(x){return x.dbId==id||x.id===id}):null;
modal('<h3 class="fd">'+(q?'Soru Düzenle':'Yeni Soru')+'<button class="close" onclick="closeModal()">\u2715</button></h3>'+
'<div class="form-group"><label class="lbl">Soru *</label><textarea class="inp" id="mqq">'+(q?q.q:'')+'</textarea></div>'+
'<div class="form-group"><label class="lbl">Seçenekler (doğruyu işaretle)</label>'+
[0,1,2,3].map(function(i){return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><input type="radio" name="mqc" value="'+i+'" '+(q?i===q.ci?'checked':'':i===0?'checked':'')+' style="accent-color:var(--m)"><input class="inp" id="mqo'+i+'" placeholder="Seçenek '+String.fromCharCode(65+i)+'" value="'+(q&&q.o[i]?q.o[i]:'')+'" style="flex:1"></div>'}).join('')+'</div>'+
'<button class="btn bp" style="width:100%" onclick="mqSav(\''+(id||'')+'\')">'+(q?'\ud83d\udcbe Güncelle':'\u2795 Ekle')+'</button>')}

function mqSav(editId){
  var q=sanitize(document.getElementById('mqq').value,300);
  if(!q){toast('Soru zorunlu!',false);return}
  var os=[0,1,2,3].map(function(i){return document.getElementById('mqo'+i).value.trim()}).filter(Boolean);
  if(os.length<2){toast('En az 2 seçenek girin!',false);return}
  var ci=parseInt(document.querySelector('input[name="mqc"]:checked').value);
  ci=Math.min(ci,os.length-1);
  
  var existing = editId ? memQs.find(function(x){return String(x.dbId)==String(editId)||String(x.id)==String(editId)}) : null;
  var numId = existing && existing.dbId ? parseInt(existing.dbId) : null;
  
  var data={question:q,option_a:os[0]||'',option_b:os[1]||'',option_c:os[2]||'',option_d:os[3]||'',correct_index:ci};
  if(numId){data.id=numId}
  
  apiSaveQuestion(data).then(function(r){
    if(r.error){toast(r.error,false);return}
    if(existing){if(existing.id&&isNaN(parseInt(existing.id)))saveReplacedQ(existing.id);existing.q=q;existing.o=os;existing.ci=ci;if(r.id){existing.dbId=r.id;existing.id=r.id;}}
    else{memQs.push({id:r.id,dbId:r.id,q:q,o:os,ci:ci})}
    toast(existing?'Güncellendi.':'Eklendi.');closeModal();aQuestions(document.getElementById('adm-c'));
  }).catch(function(){toast('Kayıt hatası',false)});
}

function saveReplacedQ(localId){
  apiGet('/game-config').then(function(r){
    var list=[];
    try{list=JSON.parse(r.replaced_qs||'[]')}catch(e){}
    if(list.indexOf(localId)===-1)list.push(localId);
    apiPost('/game-config',{key:'replaced_qs',value:JSON.stringify(list)});
  });
}


function aGames(e){
  var ac=chars.filter(function(c){return c.a}).length;
  e.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 class="fd" style="font-weight:600;font-size:15px">🎮 Oyun Yönetimi <span class="badge bv">'+GD.length+' oyun</span></h3>'+
  '<p style="font-size:12px;color:var(--t3);margin-bottom:16px">Aktif karakter: <b style="color:var(--v)">'+ac+'</b> · Toplam soru: <b style="color:var(--bl)">'+memQs.length+'</b> · Kader seçeneği: <b style="color:var(--pk)">'+FATES.length+'</b> · Ekip maks: <b style="color:var(--m)">'+TEAM_MAX+'</b></p></div>'+
  GD.map(function(g){return '<div class="card" style="margin-bottom:10px;'+(g.on?'':'opacity:.45')+'"><div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;gap:12px"><div class="gi" style="background:'+g.gr+';width:44px;height:44px;font-size:20px">'+g.e+'</div><div><p style="font-size:15px;font-weight:600" class="fd">'+esc(GN[g.t])+'</p><p style="font-size:12px;color:var(--t3)">'+g.d+'</p></div></div><div style="display:flex;align-items:center;gap:8px"><button class="btn bg bsm" onclick="gameEdit(\''+g.t+'\')">✏️ Düzenle</button><div class="tgl '+(g.on?'on':'off')+'" onclick="GD.find(function(x){return x.t===\''+g.t+'\'}).on=!GD.find(function(x){return x.t===\''+g.t+'\'}).on;rfCards();saveData();aGames(document.getElementById(\'adm-c\'))"></div></div></div></div>'}).join('')+
  '<div class="card" style="margin-top:16px"><h4 class="fd" style="font-size:14px;font-weight:600;margin-bottom:10px">⚙️ Genel Ayarlar</h4>'+
  '<div style="display:flex;gap:12px;flex-wrap:wrap">'+
  '<div style="flex:1;min-width:150px"><label class="lbl">Ekip Maks Kişi</label><input class="inp" type="number" value="'+TEAM_MAX+'" min="2" max="20" style="width:100px" onchange="TEAM_MAX=parseInt(this.value)||8;toast(\'Ekip maks: \'+TEAM_MAX)"></div>'+
  '</div></div>'
}

function rfCards(){var h=gcH();var hg=document.getElementById('hg');var gg=document.getElementById('gg');if(hg&&hg.innerHTML!==h)hg.innerHTML=h;if(gg&&gg.innerHTML!==h)gg.innerHTML=h}

function gameEdit(t){
  var g=GD.find(function(x){return x.t===t});
  var name=GN[t];
  var extra='';
  if(t==='FATE'){
    extra='<div class="form-group"><label class="lbl">Kader Seçenekleri</label>'+
    FATES.map(function(f,i){return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><input class="inp" id="fe'+i+'" value="'+f.name+'" style="flex:1"><input class="inp" id="fi'+i+'" value="'+f.emoji+'" style="width:60px;text-align:center" placeholder="emoji"></div>'}).join('')+
    '<button class="btn bs bsm" style="width:100%;margin-top:4px" onclick="addFate()">+ Kader Ekle</button></div>';
  }
  if(t==='MEM'){
    extra='<div style="padding:12px;background:var(--bg1);border-radius:10px;margin-bottom:14px"><p style="font-size:12px;color:var(--t2)">🧠 Hafıza Oyunu soruları "Sorular" sekmesinden yönetilir.</p><p style="font-size:12px;color:var(--t3);margin-top:4px">Şu an '+memQs.length+' soru mevcut.</p></div>';
  }
  modal('<h3 class="fd">'+g.e+' '+name+' Düzenle<button class="close" onclick="closeModal()">\u2715</button></h3>'+
  '<div class="form-group"><label class="lbl">Oyun Adı</label><input class="inp" id="ge-n" value="'+name+'"></div>'+
  '<div class="form-group"><label class="lbl">Açıklama</label><input class="inp" id="ge-d" value="'+g.d+'"></div>'+
  '<div class="form-row"><div class="form-group"><label class="lbl">Emoji</label><input class="inp" id="ge-e" value="'+g.e+'" style="text-align:center;font-size:24px"></div><div class="form-group"><label class="lbl">Durum</label><select class="inp" id="ge-on"><option value="1"'+(g.on?' selected':'')+'>Açık</option><option value="0"'+(!g.on?' selected':'')+'>Kapalı</option></select></div></div>'+
  extra+
  '<button class="btn bp" style="width:100%" onclick="gameSave(\''+t+'\')">\ud83d\udcbe Kaydet</button>')
}

function gameSave(t){
  var g=GD.find(function(x){return x.t===t});
  GN[t]=document.getElementById('ge-n').value.trim()||GN[t];
  g.d=document.getElementById('ge-d').value.trim()||g.d;
  g.e=document.getElementById('ge-e').value.trim()||g.e;
  g.on=document.getElementById('ge-on').value==='1';
  if(t==='FATE'){
    FATES.forEach(function(f,i){
      var ne=document.getElementById('fe'+i);
      var ni=document.getElementById('fi'+i);
      if(ne)f.name=ne.value.trim()||f.name;
      if(ni)f.emoji=ni.value.trim()||f.emoji;
    });
  }
  rfCards();saveData();closeModal();toast('Oyun güncellendi.');aGames(document.getElementById('adm-c'))
}

function addFate(){
  FATES.push({id:'f'+uid(),name:'Yeni Seçenek',emoji:'❓',color:'#'+Math.floor(Math.random()*16777215).toString(16)});
  saveData();closeModal();gameEdit('FATE');toast('Kader seçeneği eklendi.')
}

function aRanking(e){
  e.innerHTML='<div style="text-align:center;padding:20px;color:var(--t2)">Yükleniyor...</div>';
  apiGetLeaderboard().then(function(data){
    var lb=data.leaderboard||[];
    e.innerHTML='<div style="margin-bottom:16px"><h3 class="fd" style="font-weight:600;font-size:15px">🏆 Sıralama <span class="badge bgl">'+lb.length+'</span></h3></div>'+
    (lb.length===0?'<div class="card" style="text-align:center;padding:40px;color:var(--t3)">Henüz skor yok.</div>':
    '<div class="card" style="padding:0;overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr style="border-bottom:1px solid var(--b1);font-size:11px;color:var(--t3)"><th style="text-align:left;padding:10px">#</th><th style="text-align:left;padding:10px">Kullanıcı</th><th style="text-align:center;padding:10px">Puan</th><th style="text-align:center;padding:10px">Oyun</th><th style="text-align:right;padding:10px">İşlem</th></tr></thead><tbody>'+
    lb.map(function(u,i){return '<tr style="border-bottom:1px solid #2a2a3a20"><td style="padding:8px 10px;font-weight:600;color:var(--m)">'+(i+1)+'</td><td style="padding:8px 10px;font-weight:500">'+esc(u.username)+'</td><td style="padding:8px;text-align:center"><span class="badge bv">'+u.best_score+'</span></td><td style="padding:8px;text-align:center;color:var(--t3)">'+u.games_played+'</td><td style="padding:8px 10px;text-align:right"><button class="btn bg bsm" style="padding:3px 8px;font-size:11px" onclick="editScore('+u.id+',\''+esc(u.username)+'\','+u.best_score+')">✏️ Puan</button></td></tr>'}).join('')+
    '</tbody></table></div>');
  });
}


function wqSection(){
  var h='<div style="margin-top:32px;border-top:1px solid var(--b1);padding-top:24px">';
  h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">';
  h+='<h3 class="fd" style="font-weight:600;font-size:15px">\ud83e\ude9e Sen Kimsin? Soruları <span class="badge bv">'+whoQs.length+'</span></h3>';
  h+='<button class="btn bp bsm" onclick="wqMod()">+ Soru Ekle</button></div>';
  for(var i=0;i<whoQs.length;i++){
    var q=whoQs[i];
    h+='<div class="card" style="margin-bottom:8px;padding:14px 16px"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="flex:1">';
    h+='<p style="font-size:14px;font-weight:500">'+(i+1)+'. '+esc(q.q)+'</p>';
    h+='<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">';
    for(var oi=0;oi<q.o.length;oi++){
      h+='<span style="font-size:11px;padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--t3)">'+String.fromCharCode(65+oi)+') '+esc(q.o[oi])+'</span>';
    }
    h+='</div></div><div style="display:flex;gap:4px;margin-left:8px">';
    h+='<button class="btn bg bsm" style="padding:3px 6px" onclick="wqMod(\''+(q.dbId||q.id)+'\')">\u270f\ufe0f</button>';
    h+='<button class="btn bg bsm" style="padding:3px 6px;color:var(--pk)" onclick="apiDeleteWhoQuestion('+(q.dbId||q.id)+').then(function(){whoQs=whoQs.filter(function(x){return (x.dbId||x.id)!='+(q.dbId||q.id)+'});toast(\'Silindi.\');aQuestions(document.getElementById(\'adm-c\'))})">\ud83d\uddd1\ufe0f</button>';
    h+='</div></div></div>';
  }
  if(whoQs.length===0) h+='<div class="card" style="text-align:center;padding:40px;color:var(--t3)">Henüz soru yok.</div>';
  h+='</div>';
  return h;
}

function editScore(uid,name,current){
  var score=prompt(name+' için yeni puan (şu an: '+current+'):');
  if(score===null)return;
  score=parseInt(score);
  if(isNaN(score)||score<0){toast('Geçersiz puan!',false);return}
  apiPost('/admin/update-score',{user_id:uid,score:score}).then(function(r){
    if(r.error){toast(r.error,false);return}
    toast(name+' puanı '+score+' yapıldı.');
    aRanking(document.getElementById('adm-c'));
  });
}

function aUsers(e){
  e.innerHTML='<div style="text-align:center;padding:40px;color:var(--t3)">Y\u00fckleniyor...</div>';
  Promise.all([apiGetUsers(), apiGetStreamerRequests()]).then(function(results){
    var data = results[0];
    var reqData = results[1];
    if(data.error){e.innerHTML='<div class="card" style="padding:20px;color:var(--pk)">'+esc(data.error)+'</div>';return}
    var uu=data.users||[];
    var reqs=reqData.requests||[];
    
    var h='';
    
    // Streamer requests section
    if(reqs.length>0){
      h+='<div style="margin-bottom:24px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><h3 class="fd" style="font-weight:600;font-size:15px">\ud83c\udfa5 Yay\u0131nc\u0131 Ba\u015fvurular\u0131 <span class="badge" style="background:#ff000020;color:#ff4444">'+reqs.length+'</span></h3></div>';
      h+='<div class="card" style="padding:0;overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr style="border-bottom:1px solid var(--b1);font-size:11px;color:var(--t3)"><th style="text-align:left;padding:10px 14px">Kullan\u0131c\u0131</th><th style="text-align:left;padding:10px">E-posta</th><th style="text-align:center;padding:10px">Tarih</th><th style="text-align:right;padding:10px 14px">\u0130\u015flem</th></tr></thead><tbody>';
      for(var ri=0;ri<reqs.length;ri++){
        var rq=reqs[ri];
        var rd=new Date(rq.created_at);
        h+='<tr style="border-bottom:1px solid #2a2a3a20"><td style="padding:10px 14px;font-weight:500">'+esc(rq.username)+'</td><td style="padding:10px;font-size:12px;color:var(--t2)">'+esc(rq.email)+'</td><td style="padding:10px;text-align:center;font-size:12px;color:var(--t3)">'+rd.toLocaleDateString('tr-TR')+'</td><td style="padding:10px 14px;text-align:right"><button class="btn bg bsm" style="color:var(--m)" onclick="approveStreamer('+rq.id+')">\u2705 Onayla</button> <button class="btn bg bsm" style="color:var(--pk)" onclick="rejectStreamer('+rq.id+')">\u274c Reddet</button></td></tr>';
      }
      h+='</tbody></table></div></div>';
    }
    
    // Users section
    h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 class="fd" style="font-weight:600;font-size:15px">\ud83d\udc64 Kullan\u0131c\u0131 Y\u00f6netimi <span class="badge bv">'+uu.length+' kullan\u0131c\u0131</span></h3></div>';
    if(uu.length>0){
      h+='<div class="card" style="padding:0;overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr style="border-bottom:1px solid var(--b1);font-size:11px;color:var(--t3)"><th style="text-align:left;padding:10px 14px">#</th><th style="text-align:left;padding:10px">Kullan\u0131c\u0131</th><th style="text-align:left;padding:10px">E-posta</th><th style="text-align:center;padding:10px">Rol</th><th style="text-align:center;padding:10px">Durum</th><th style="text-align:center;padding:10px">Kay\u0131t</th><th style="text-align:right;padding:10px 14px">\u0130\u015flem</th></tr></thead><tbody>';
      for(var i=0;i<uu.length;i++){
        var u=uu[i];
        var d=new Date(u.created_at);
        var tarih=d.toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'});
        h+='<tr style="border-bottom:1px solid #2a2a3a20">';
        h+='<td style="padding:10px 14px;font-weight:700">'+(i+1)+'</td>';
        h+='<td style="padding:10px"><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:8px;background:'+(u.role==='ADMIN'?'#e8433e20':'#3b82f620')+';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:'+(u.role==='ADMIN'?'var(--v)':'var(--bl)')+'">'+(u.username?u.username[0].toUpperCase():'-')+'</div><span style="font-weight:500">'+esc(u.username)+'</span>'+(u.streamer?' <span class="badge" style="background:#ff000020;color:#ff4444;font-size:9px">\ud83c\udfa5</span>':'')+'</div></td>';
        h+='<td style="padding:10px;font-size:12px;color:var(--t2)">'+esc(u.email)+'</td>';
        h+='<td style="padding:10px;text-align:center">'+(u.role==='ADMIN'?'<span class="badge bv">Admin</span>':'<span class="badge bgl">\u00dcye</span>')+'</td>';
        h+='<td style="padding:10px;text-align:center">';
        var isOnline = u.last_active && (Date.now() - new Date(u.last_active).getTime()) < 120000;
        if(u.banned){h+='<span style="font-size:12px;padding:3px 10px;border-radius:6px;background:#e8433e20;color:#e8433e;font-weight:600">Yasakl\u0131</span>';}
        else{h+='<span style="font-size:12px;padding:3px 10px;border-radius:6px;background:'+(isOnline?'#2dd4bf15':'#ff980020')+';color:'+(isOnline?'var(--m)':'#ff9800')+';font-weight:600">'+(isOnline?'\ud83d\udfe2 Online':'\u26aa Offline')+'</span>';}
        h+='</td>';
        h+='<td style="padding:10px;text-align:center;font-size:12px;color:var(--t3)">'+tarih+'</td>';
        h+='<td style="padding:10px 14px;text-align:right">';
        if(u.role!=='ADMIN'){
          h+='<button class="btn bg bsm" style="color:'+(u.streamer?'var(--t3)':'#ff4444')+';margin-right:4px" onclick="toggleStreamerPerm('+u.id+',this)">'+(u.streamer?'\ud83c\udfa5 Yay\u0131nc\u0131 Kald\u0131r':'\ud83c\udfa5 Yay\u0131nc\u0131 Yap')+'</button>';
          h+='<button class="btn bg bsm" style="color:'+(u.banned?'var(--m)':'var(--pk)')+';margin-right:4px" onclick="toggleBan('+u.id+',this)">'+(u.banned?'\u2705 Yasa\u011f\u0131 Kald\u0131r':'\ud83d\udeab Yasakla')+'</button>';
          h+='<button class="btn bg bsm" style="color:var(--v);margin-right:4px" onclick="sendNotif('+u.id+',\''+u.username+'\')">\ud83d\udce8 Bildirim</button>';
          h+='<button class="btn bg bsm" style="color:#ff0000" onclick="deleteUser('+u.id+',\''+u.username+'\')">\ud83d\uddd1 Sil</button>';
        } else {
          h+='<span style="font-size:11px;color:var(--t3)">\u2014</span>';
        }
        h+='</td></tr>';
      }
      h+='</tbody></table></div>';
    }
    e.innerHTML=h;
  });
}

function toggleStreamerPerm(userId, btn){
  apiToggleStreamer(userId).then(function(r){
    if(r.error){toast(r.error,false);return}
    toast(r.streamer?'Yay\u0131nc\u0131 yetkisi verildi.':'Yay\u0131nc\u0131 yetkisi kald\u0131r\u0131ld\u0131.');
    aUsers(document.getElementById('adm-c'));
  });
}

function approveStreamer(reqId){
  apiApproveStreamer(reqId).then(function(r){
    if(r.error){toast(r.error,false);return}
    toast('Ba\u015fvuru onayland\u0131!');
    aUsers(document.getElementById('adm-c'));
  });
}

function rejectStreamer(reqId){
  apiRejectStreamer(reqId).then(function(r){
    if(r.error){toast(r.error,false);return}
    toast('Ba\u015fvuru reddedildi.');
    aUsers(document.getElementById('adm-c'));
  });
}

function toggleBan(userId,btn){
  if(!confirm(btn.textContent.indexOf('Yasakla')>=0?'Bu kullan\u0131c\u0131y\u0131 yasaklamak istedi\u011fine emin misin?':'Yasa\u011f\u0131 kald\u0131rmak istedi\u011fine emin misin?')) return;
  apiPost('/admin/ban-user/'+userId,{}).then(function(r){
    if(r.error){toast(r.error,false);return}
    toast(r.banned?'Kullan\u0131c\u0131 yasakland\u0131.':'Yasak kald\u0131r\u0131ld\u0131.');
    aUsers(document.getElementById('adm-c'));
  });
}

var adConfig = {left:{active:false,code:''},right:{active:false,code:''},footer:{active:false,code:''}};

function aAds(e) {
  apiGet('/game-config').then(function(r){
    if(r.ads_config) { try { adConfig = JSON.parse(r.ads_config); } catch(ex){} }
    renderAdsPanel(e);
  });
}

function renderAdsPanel(e) {
  var areas = [
    {key:'left',name:'Sol Kenar',icon:'◀️',desc:'Sayfanın sol tarafında sabit reklam alanı (160px genişlik)'},
    {key:'right',name:'Sağ Kenar',icon:'▶️',desc:'Sayfanın sağ tarafında sabit reklam alanı (160px genişlik)'},
    {key:'footer',name:'Footer',icon:'⬇️',desc:'Sayfanın alt kısmında footer üstü reklam alanı'}
  ];
  
  e.innerHTML = '<div style="margin-bottom:16px"><h3 class="fd" style="font-weight:600;font-size:15px">📢 Reklam Yönetimi</h3><p style="font-size:12px;color:var(--t3);margin-top:4px">Google AdSense veya özel reklam kodlarını buradan yönetin</p></div>' +
    areas.map(function(a) {
      var cfg = adConfig[a.key] || {active:false,code:''};
      return '<div class="card" style="padding:20px;margin-bottom:16px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
          '<div><h4 class="fd" style="font-size:16px;font-weight:600">' + a.icon + ' ' + a.name + '</h4><p style="font-size:12px;color:var(--t3);margin-top:2px">' + a.desc + '</p></div>' +
          '<label style="display:flex;align-items:center;gap:8px;cursor:pointer"><span style="font-size:13px;color:' + (cfg.active ? 'var(--m)' : 'var(--t3)') + '">' + (cfg.active ? 'Aktif' : 'Pasif') + '</span>' +
          '<div onclick="toggleAd(\'' + a.key + '\')" style="width:48px;height:26px;border-radius:13px;background:' + (cfg.active ? 'var(--m)' : 'var(--bg3)') + ';position:relative;cursor:pointer;transition:all .3s"><div style="width:22px;height:22px;border-radius:11px;background:#fff;position:absolute;top:2px;' + (cfg.active ? 'right:2px' : 'left:2px') + ';transition:all .3s"></div></div></label>' +
        '</div>' +
        '<div style="margin-bottom:12px"><label class="lbl" style="font-size:12px">Reklam Kodu (HTML/JS)</label>' +
        '<textarea class="inp" id="ad-code-' + a.key + '" rows="4" style="font-family:monospace;font-size:12px;resize:vertical" placeholder="Google AdSense veya özel reklam kodunu buraya yapıştırın...">' + esc(cfg.code || '') + '</textarea></div>' +
        '<button class="btn bp bsm" onclick="saveAd(\'' + a.key + '\')">💾 Kaydet</button>' +
        '<div style="margin-top:12px;padding:12px;border-radius:10px;background:var(--bg3);text-align:center"><p style="font-size:11px;color:var(--t3);margin-bottom:8px">Önizleme:</p>' +
        (cfg.active && !cfg.code ? '<div style="padding:20px;border:2px dashed var(--v);border-radius:12px;background:linear-gradient(135deg,#e8433e08,#6366f108)"><p style="font-size:14px;font-weight:600;color:var(--v)">📢 Buraya reklam verebilirsiniz</p><p style="font-size:11px;color:var(--t3);margin-top:4px">Bu alan reklam için ayrılmıştır</p></div>' :
         cfg.active && cfg.code ? '<div style="padding:8px;border:1px solid var(--m);border-radius:8px"><span style="font-size:11px;color:var(--m)">✅ Reklam kodu aktif</span></div>' :
         '<div style="padding:8px;border:1px solid var(--t3);border-radius:8px;opacity:.5"><span style="font-size:11px;color:var(--t3)">⏸️ Alan pasif</span></div>') +
        '</div></div>';
    }).join('');
}

function toggleAd(key) {
  adConfig[key] = adConfig[key] || {active:false,code:''};
  adConfig[key].active = !adConfig[key].active;
  saveAdConfig();
}

function saveAd(key) {
  adConfig[key] = adConfig[key] || {active:false,code:''};
  adConfig[key].code = document.getElementById('ad-code-' + key).value;
  saveAdConfig();
}

function saveAdConfig() {
  apiPost('/game-config', {key:'ads_config', value:JSON.stringify(adConfig)}).then(function(){
    toast('Reklam ayarları kaydedildi!');
    aAds(document.getElementById('adm-c'));
    applyAds();
  });
}

function applyAds() {
  ['left','right','footer'].forEach(function(key){
    var el = document.getElementById('ad-' + key);
    if (!el) return;
    var cfg = adConfig[key] || {active:false,code:''};
    if (!cfg.active) { el.style.display = 'none'; return; }
    if (el.style.display === 'block' && el.style.opacity === '1') return;
    el.style.display = 'block';
    el.style.opacity = '1';
    if (cfg.code) {
      el.innerHTML = cfg.code;
      var scripts = el.querySelectorAll('script');
      scripts.forEach(function(s){
        var ns = document.createElement('script');
        if(s.src) ns.src = s.src; else ns.textContent = s.textContent;
        s.parentNode.replaceChild(ns, s);
      });
    } else if (key === 'footer') {
      el.innerHTML = '<div style="max-width:970px;margin:24px auto"><div style="text-align:center;border:2px dashed var(--v);border-radius:16px;background:linear-gradient(135deg,rgba(168,85,247,0.05),rgba(99,102,241,0.05));padding:20px;height:90px;display:flex;align-items:center;justify-content:center;gap:16px"><span style="font-size:32px">📢</span><h4 style="font-size:16px;font-weight:700;color:var(--v)">Buraya reklam verebilirsiniz</h4><p style="font-size:12px;color:var(--t3)">Bu alan reklam için ayrılmıştır</p><span style="font-size:11px;color:var(--t3);padding:4px 12px;border:1px solid var(--b1);border-radius:20px">970 × 90</span></div></div>';
    } else {
      el.innerHTML = '<div style="text-align:center;border:2px dashed var(--v);border-radius:16px;background:linear-gradient(135deg,rgba(168,85,247,0.05),rgba(99,102,241,0.05));padding:16px 12px;min-height:600px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px"><span style="font-size:48px">📢</span><h4 style="font-size:15px;font-weight:700;color:var(--v)">Buraya reklam verebilirsiniz</h4><p style="font-size:12px;color:var(--t3)">Bu alan reklam için ayrılmıştır</p><span style="font-size:11px;color:var(--t3);padding:4px 12px;border:1px solid var(--b1);border-radius:20px">200 × 600</span></div>';
    }
  });
}

// Ads loaded via initData in api.js

function sendNotif(uid,name){
  modal('<h3 class="fd">📢 Bildirim Gönder — '+esc(name)+'<button class="close" onclick="closeModal()">✕</button></h3>'+
  '<div class="form-group"><label class="lbl">Mesaj *</label><textarea class="inp" id="notif-msg" rows="3" placeholder="Kullanıcının göreceği bildirim mesajı..."></textarea></div>'+
  '<button class="btn bp" style="width:100%" onclick="doSendNotif('+uid+')">📢 Gönder</button>');
}

function doSendNotif(uid){
  var msg=document.getElementById('notif-msg').value.trim();
  if(!msg){toast('Mesaj gerekli!',false);return}
  apiPost('/notifications/send',{user_id:uid,message:msg}).then(function(r){
    if(r.error){toast(r.error,false);return}
    toast('Bildirim gönderildi!');closeModal();
  });
}

function aMsgs(e){
  e.innerHTML='<div style="text-align:center;padding:20px;color:var(--t2)">Yükleniyor...</div>';
  apiGet('/contact/messages').then(function(r){
    var msgs=r.messages||[];
    e.innerHTML='<div style="margin-bottom:16px"><h3 class="fd" style="font-weight:600;font-size:15px">📨 Gelen Mesajlar <span class="badge bgl">'+msgs.length+'</span></h3></div>'+
    (msgs.length===0?'<div class="card" style="text-align:center;padding:40px;color:var(--t3)">Henüz mesaj yok.</div>':
    msgs.map(function(m){
      var d=new Date(m.created_at);
      var tarih=d.toLocaleDateString('tr-TR')+' '+d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
      return '<div class="card" style="margin-bottom:10px;padding:16px"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="flex:1"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span class="badge bv" style="font-size:11px">'+esc(m.username||'Anonim')+'</span><span style="font-size:11px;color:var(--t3)">'+tarih+'</span></div><h4 style="font-size:15px;font-weight:600;margin-bottom:4px">'+esc(m.title)+'</h4><p style="font-size:13px;color:var(--t2)">'+esc(m.description)+'</p></div><button class="btn bg bsm" style="padding:4px 8px;color:var(--pk);margin-left:12px" onclick="delMsg('+m.id+')">🗑️</button></div></div>'
    }).join(''));
  });
}

function delMsg(id){
  if(!confirm('Bu mesajı silmek istediğine emin misin?'))return;
  apiDelete('/contact/'+id).then(function(){toast('Silindi.');aMsgs(document.getElementById('adm-c'));});
}

function wqMod(id){var q=id?whoQs.find(function(x){return x.dbId==id||x.id==id}):null;
modal('<h3 class="fd">'+(q?'Soru Düzenle':'Yeni Sen Kimsin Sorusu')+'<button class="close" onclick="closeModal()">\u2715</button></h3>'+
'<div class="form-group"><label class="lbl">Soru *</label><textarea class="inp" id="wqq">'+(q?q.q:'')+'</textarea></div>'+
'<div class="form-group"><label class="lbl">Seçenekler (4 adet)</label>'+
[0,1,2,3].map(function(i){return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="color:var(--t3);font-size:12px;min-width:20px">'+String.fromCharCode(65+i)+')</span><input class="inp" id="wqo'+i+'" placeholder="Seçenek '+String.fromCharCode(65+i)+'" value="'+(q&&q.o[i]?q.o[i]:'')+'" style="flex:1"></div>'}).join('')+'</div>'+
'<button class="btn bp" style="width:100%" onclick="wqSav(\''+(q&&q.dbId?q.dbId:id||'')+'\')">\ud83d\udcbe '+(q?'Güncelle':'Ekle')+'</button>')}

function wqSav(id){var q=sanitize(document.getElementById('wqq').value,300);if(!q){toast('Soru zorunlu!',false);return}
var os=[0,1,2,3].map(function(i){return document.getElementById('wqo'+i).value.trim()}).filter(Boolean);
if(os.length<2){toast('En az 2 seçenek girin!',false);return}
var existing=id?whoQs.find(function(x){return x.dbId==id||x.id==id}):null;
var numId=existing&&existing.dbId?parseInt(existing.dbId):null;
var data={question:q,option_a:os[0]||'',option_b:os[1]||'',option_c:os[2]||'',option_d:os[3]||''};
if(numId){data.id=numId}
apiSaveWhoQuestion(data).then(function(r){
  if(r.error){toast(r.error,false);return}
  if(existing){existing.q=q;existing.o=os;if(r.id)existing.dbId=r.id;}
  else{whoQs.push({id:r.id,dbId:r.id,q:q,o:os})}
  toast(existing?'Güncellendi.':'Eklendi.');closeModal();aQuestions(document.getElementById('adm-c'));
}).catch(function(){toast('Kayıt hatası',false)})}

function deleteUser(uid,name){
  if(!confirm(name+' kullanıcısını silmek istediğine emin misin?\n\nBu işlem geri alınamaz! Tüm verileri silinecek.'))return;
  if(!confirm('EMIN MISIN? '+name+' kalıcı olarak silinecek!'))return;
  apiDelete('/admin/users/'+uid).then(function(r){
    if(r.error){toast(r.error,false);return}
    toast(name+' silindi.');
    aUsers(document.getElementById('adm-c'));
  });
}

function aDiscord(e){
  apiGet('/discord').then(function(r){
    var link=r.link||'';
    e.innerHTML='<div style="margin-bottom:16px"><h3 class="fd" style="font-weight:600;font-size:15px">🎮 Discord Ayarları</h3></div>'+
    '<div class="card" style="padding:24px">'+
    '<div class="form-group"><label class="lbl">Discord Linki</label><input class="inp" id="discord-input" value="'+link+'" placeholder="https://discord.gg/..."></div>'+
    '<button class="btn bp" style="width:100%" onclick="saveDiscord()">💾 Kaydet</button>'+
    '</div>';
  });
}

function saveDiscord(){
  var link=document.getElementById('discord-input').value.trim();
  apiPost('/discord',{link:link}).then(function(r){
    if(r.error){toast(r.error,false);return}
    window._discordLink=link;
    var dl=document.getElementById('discord-link');
    if(dl){if(link){dl.href=link;dl.style.display='inline-flex';}else{dl.style.display='none';}}
    toast('Discord linki kaydedildi!');
  });
}

function aHero(e){
  apiGet('/discord').then(function(r){
    var heroImg = window._heroImage || '';
    e.innerHTML='<div style="margin-bottom:16px"><h3 class="fd" style="font-weight:600;font-size:15px">🖼️ Hero Görseli Ayarları</h3></div>'+
    '<div class="card" style="padding:24px">'+
    '<p style="font-size:13px;color:var(--t2);margin-bottom:16px">Ana sayfada sağ üstte görünen büyük görsel. Önerilen boyut: <b>1920×1080px</b> (16:9 oran), max 2MB.</p>'+
    '<div class="form-group"><label class="lbl">Görsel URL veya Base64</label><textarea class="inp" id="hero-img-input" rows="3" placeholder="https://... veya dosya yükle">'+(heroImg||'')+'</textarea></div>'+
    '<div style="display:flex;gap:8px"><button class="btn bp" onclick="saveHeroImage()">💾 Kaydet</button><button class="btn bs" onclick="document.getElementById(&quot;hero-file&quot;).click()">📷 Dosya Seç</button></div>'+
    '<input type="file" id="hero-file" accept="image/*" style="display:none" onchange="uploadHeroFile(this)">'+
    (heroImg?'<div style="margin-top:16px;border-radius:12px;overflow:hidden;border:1px solid #ffffff08"><img src="'+heroImg+'" style="width:100%;max-height:300px;object-fit:cover"></div>':'')+
    '</div>';
  });
}

function uploadHeroFile(input){
  if(!input.files[0])return;
  var reader=new FileReader();
  reader.onload=function(e){
    var img=new Image();
    img.onload=function(){
      var canvas=document.createElement('canvas');
      var max=1920;var w=img.width;var h=img.height;
      if(w>max){h=Math.round(h*(max/w));w=max}
      canvas.width=w;canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      var compressed=canvas.toDataURL('image/jpeg',0.8);
      document.getElementById('hero-img-input').value=compressed;
      toast('Görsel yüklendi, Kaydet butonuna bas.');
    };img.src=e.target.result;
  };reader.readAsDataURL(input.files[0]);
}

function saveHeroImage(){
  var img=document.getElementById('hero-img-input').value.trim();
  apiPost('/hero-image',{image:img}).then(function(r){
    if(r.error){toast(r.error,false);return}
    window._heroImage=img;
    toast('Hero görseli kaydedildi!');
    aHero(document.getElementById('adm-c'));
  });
}

function aGameEdit(e){
  var gameTypes = [
    {t:'DIE',n:'Kim Hayatta Kalacak',d:'Son hayatta kalan kim?'},
    {t:'TEAM',n:'Ekibini Kur',d:'8 kişilik ekibini oluştur'},
    {t:'QUOTE',n:'Replik Bil',d:'Bu repliğin hangi karaktere ait?'},
    {t:'FATE',n:'Kaderini Seç',d:'Öldür, evlen, ghostla, kaç'},
    {t:'FACE',n:'Yüzden Bil',d:'Bulanık fotoğraftan tanı'},
    {t:'MEM',n:'Eightborn Moruq',d:'Sunucu bilgi yarışması'},
    {t:'WHO',n:'Sen Kimsin?',d:'Hangi karaktere benziyorsun?'},
    {t:'STREAM',n:'Yayıncı Oyunları',d:'Chat ile interaktif oyunlar'}
  ];
  
  // Load saved names from config
  apiGet('/game-names').then(function(r){
    var saved = r.games || {};
    var h = '<div style="margin-bottom:16px"><h3 class="fd" style="font-size:15px">✏️ Oyun İsim ve Açıklamalarını Düzenle</h3><p style="font-size:12px;color:var(--t2);margin-top:4px">Ana sayfa ve Yayıncı Oyunları sayfasında görünen isim ve açıklamalar</p></div>';
    
    gameTypes.forEach(function(g){
      var sn = saved[g.t+'_name'] || g.n;
      var sd = saved[g.t+'_desc'] || g.d;
      h += '<div class="card" style="padding:16px;margin-bottom:8px"><div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><span style="font-size:20px">' + (GD.find(function(x){return x.t===g.t})||{e:'🎮'}).e + '</span><strong style="font-size:14px">' + g.t + '</strong></div>' +
        '<div class="form-row"><div class="form-group"><label class="lbl">Oyun Adı</label><input class="inp" id="gn-'+g.t+'" value="'+sn.replace(/"/g,'&quot;')+'" placeholder="'+g.n+'"></div>' +
        '<div class="form-group"><label class="lbl">Açıklama</label><input class="inp" id="gd-'+g.t+'" value="'+sd.replace(/"/g,'&quot;')+'" placeholder="'+g.d+'"></div></div></div>';
    });
    
    h += '<button class="btn bp" style="margin-top:12px;width:100%;padding:14px" onclick="saveGameNames()">💾 Tümünü Kaydet</button>';
    e.innerHTML = h;
  }).catch(function(){
    e.innerHTML = '<div class="card" style="padding:24px;text-align:center;color:var(--pk)">Yüklenemedi</div>';
  });
}

function saveGameNames(){
  var types = ['DIE','TEAM','QUOTE','FATE','FACE','MEM','WHO','STREAM'];
  var data = {};
  types.forEach(function(t){
    var nameEl = document.getElementById('gn-'+t);
    var descEl = document.getElementById('gd-'+t);
    if(nameEl && nameEl.value.trim()) data[t+'_name'] = nameEl.value.trim();
    if(descEl && descEl.value.trim()) data[t+'_desc'] = descEl.value.trim();
  });
  apiPost('/game-names', {games:data}).then(function(r){
    if(r.error){toast(r.error,false);return}
    toast('Oyun isimleri kaydedildi! Sayfa yenilenince uygulanır.');
  }).catch(function(){toast('Kaydedilemedi!',false)});
}
