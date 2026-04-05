// ═══════════════════════════════════════════════════
// SEN KİMSİN? — PERSONALITY QUIZ (AI-POWERED)
// ═══════════════════════════════════════════════════
let whState = null;

function whoStart() {
  if(typeof checkBanned==="function"&&checkBanned())return;

  var ag = document.getElementById('ag');
  ag.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 0">
      <button class="btn bg bsm" onclick="bk()">← Geri</button>
      <div class="gi" style="background:linear-gradient(135deg,#e8433e,#e8433e);width:72px;height:72px;font-size:36px">🪞</div>
      <h2 class="fd" style="font-weight:700;font-size:36px">Hangi Eightborn Karakterisin?</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg" style="text-align:center;padding:60px 40px;max-width:900px;width:100%">
        <div style="font-size:120px;margin-bottom:20px">🪞</div>
        <h3 class="fd" style="font-size:48px;font-weight:700;margin-bottom:14px">Hangi EightBornV Karakterisin?</h3>
        <p style="font-size:20px;color:var(--t2);margin-bottom:12px">20 soruya cevap ver, yapay zeka sana en yakın karakteri bulsun!</p>
        <p style="font-size:16px;color:var(--t3);margin-bottom:36px">201 karakterden biri olabilirsin...</p>
        <button class="btn bp" style="padding:20px 48px;font-size:22px;border-radius:16px" onclick="initWho()">🚀 Teste Başla</button>
      </div>
    </div>`;
}

function initWho() {
  whState = {
    questions: shuf([...whoQs].filter(function(q, i, arr) { return arr.findIndex(function(x) { return x.q === q.q; }) === i; })),
    current: 0,
    answers: [],
    lastPick: 0,
  };
  renderWhoQ();
}

function renderWhoQ() {
  var s = whState;
  if (!s || s.current >= s.questions.length) { analyzeWho(); return; }
  var q = s.questions[s.current];
  var num = s.current + 1;
  var total = s.questions.length;
  var pct = Math.round((s.current / total) * 100);
  var ag = document.getElementById('ag');

  ag.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 20px">
      <button class="btn bg bsm" onclick="bk()">← Çık</button>
      <div class="gi" style="background:linear-gradient(135deg,#e8433e,#e8433e);width:48px;height:48px;font-size:22px">🪞</div>
      <div style="flex:1">
        <h2 class="fd" style="font-weight:700;font-size:28px">Soru ${num}/${total}</h2>
      </div>
    </div>
    <div style="margin:8px 20px 12px">
      <div style="height:8px;background:var(--bg3);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#e8433e,#e8433e);border-radius:4px;transition:width .5s ease"></div>
      </div>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div style="text-align:center;width:100%;max-width:800px;padding:0 20px">
        <div style="background:var(--bg2);border:1px solid var(--b1);border-radius:20px;padding:36px 32px;margin-bottom:28px">
          <p style="font-size:28px;font-weight:600;color:var(--t1);line-height:1.4" class="fd">${esc(q.q)}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          ${q.o.map(function(o, i) { return '<div class="card" style="cursor:pointer;padding:20px;text-align:left;display:flex;align-items:center;gap:14px;transition:all .3s" onclick="whoAnswer('+i+')"><div style="width:44px;height:44px;border-radius:12px;background:var(--bg1);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#e8433e;flex-shrink:0" class="fd">' + String.fromCharCode(65+i) + '</div><span style="font-size:18px;font-weight:500">' + o + '</span></div>'; }).join('')}
        </div>
      </div>
    </div>`;
}

function whoAnswer(idx) {
  var s = whState;
  if (!s || Date.now() - (s.lastPick||0) < 400) return;
  s.lastPick = Date.now();
  var q = s.questions[s.current];
  s.answers.push({ q: q.q, a: q.o[idx] });
  s.current++;
  setTimeout(function() { renderWhoQ(); }, 300);
}

async function analyzeWho() {
  var s = whState;
  var ag = document.getElementById('ag');
  
  ag.innerHTML = `
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="cg" style="text-align:center;padding:60px 40px;max-width:600px">
        <div style="font-size:80px;margin-bottom:16px;animation:crownDrop .6s ease infinite alternate">🪞</div>
        <h2 class="fd" style="font-size:32px;font-weight:700;margin-bottom:12px">Analiz Ediliyor...</h2>
        <p style="font-size:18px;color:var(--t2)">Cevapların analiz ediliyor, sana en uygun karakter bulunuyor.</p>
        <div style="margin-top:24px"><div style="width:200px;height:4px;background:var(--bg3);border-radius:2px;margin:0 auto;overflow:hidden"><div style="height:100%;width:100%;background:linear-gradient(90deg,#e8433e,#e8433e);border-radius:2px;animation:loading 1.5s ease infinite"></div></div></div>
      </div>
    </div>
    <style>@keyframes loading{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}</style>`;
  
  // Trait keywords for each answer
  var traitMap = {
    'Mezara kadar saklarım':'sadık,güvenilir,sırdaş',
    'Bi kişiye söylerim sadece...':'dedikoducu,meraklı,geveze',
    'İleride lazım olur, not alırım':'hesapçı,kurnaz,manipülatif',
    'Umurumda olmaz':'soğukkanlı,umursamaz,sakin',
    'Dalıyorum tabii':'kavgacı,cesur,savaşçı',
    'Sessizce uzaklaşırım':'korkak,temkinli,sakin',
    'İzlerim, gerekirse müdahale ederim':'soğukkanlı,lider,stratejist',
    'Video çekerim':'meraklı,modern,kurnaz',
    'Zaten güvenmiyordum kimseye':'şüpheci,paranoyak,temkinli',
    'Yüzüne söylerim hemen':'sinirli,dürüst,cesur',
    'Ben de daha büyük yalan söylerim':'yalancı,kurnaz,manipülatif',
    'Umursamam, herkes yalan söyler':'soğukkanlı,umursamaz,pesimist',
    'V8 motor, tam gaz!':'araba delisi,hızlı,maceracı',
    'En pahalısı hangisiyse':'paracı,gösterişçi,lüks',
    'Beni götürsün yeter':'tembel,pratik,sakin',
    'Motor tercihimdir':'asi,özgür,maceracı',
    'Koleksiyon yapıyorum':'silah delisi,tutkulu,koleksiyoncu',
    'Yakınında bile durmam':'korkak,barışçı,temkinli',
    'Gerekirse kullanırım':'cesur,pratik,soğukkanlı',
    'Şiddet çözüm değil':'vicdanlı,barışçı,olgun',
    'Tamam, yaparım sorunsuz':'çalışkan,uyumlu,disiplinli',
    'Bahane uydurup kaçarım':'tembel,kurnaz,kaçkın',
    'Hakkım değilse yapmam':'asi,onurlu,dik',
    'Karşılığında ne var?':'hesapçı,paracı,pragmatik',
    'Deliye dönerim':'kıskanç,tutkulu,sinirli',
    'Kalbim kırılır ama konuşurum':'romantik,duygusal,olgun',
    'Ben de başkasını bulurum':'bencil,pragmatik,soğukkanlı',
    'Önce kanıt toplarım':'şüpheci,stratejist,hesapçı',
    'Biriktiririm':'cimri,tutumlu,hesapçı',
    'Arkadaşlara ısmarlarm':'hovarda,cömert,sosyal',
    'Yatırım yaparım':'paracı,stratejist,zeki',
    'Şansımı denerim':'maceracı,aptal,riskçi',
    'Herkesle hemen kaynaşırım':'karizmatik,sosyal,enerjik',
    'Uzaktan gözlemlerim önce':'şüpheci,temkinli,stratejist',
    'Kendimi kanıtlarım':'lider,hırslı,cesur',
    'Kim kimle ne yapmış öğrenirim':'dedikoducu,meraklı,sosyal',
    'Son paramı bile veririm':'fedakar,cömert,sadık',
    'Yok diyip geçiştiririm':'cimri,bencil,hesapçı',
    'Ne zaman ödeyeceğini sorarım':'hesapçı,pragmatik,tutumlu',
    'Param yoksa bile çözüm bulurum':'sadık,yaratıcı,fedakar',
    'Döverim':'kavgacı,sinirli,saldırgan',
    'Onun hakkında daha büyük şeyler ortaya çıkarırım':'manipülatif,kurnaz,intikamcı',
    'Gerçeği sakinçe açıklarım':'vicdanlı,olgun,soğukkanlı',
    'Bağırır çağırırım':'sinirli,kontrolsüz,duygusal',
    'Aşk ve sevgi':'romantik,duygusal,şefkatli',
    'Para ve güç':'paracı,hırslı,lider',
    'Özgürlük ve deneyim':'maceracı,asi,özgür',
    'Dostluk ve güven':'sadık,güvenilir,sosyal',
    'Plan yapar, disiplinli çalışırım':'çalışkan,stratejist,disiplinli',
    'Son dakikaya bırakırım':'tembel,rahat,stresli',
    'Düşünmeden atlarım':'aptal,cesur,düşüncesiz',
    'Ekip kurar, dağıtırım':'lider,organizatör,yönetici',
    'Açarım, kim olursa olsun':'cesur,korkusuz,meraklı',
    'Saklanırım, açmam':'korkak,temkinli,paranoyak',
    'Kim olduğunu sorarım':'şüpheci,temkinli,akıllı',
    'Yanıma bir şey alıp açarım':'silah delisi,temkinli,cesur',
    'Kurallar çiğnenmek için var':'asi,isyankar,özgür',
    'Doğru kurallara uyarım':'vicdanlı,dengeli,olgun',
    'Kurallar benim için geçerli değil':'psikopat,narsist,bencil',
    'Düzen şart, uyarım':'çalışkan,disiplinli,uyumlu',
    'Anında patlarım':'sinirli,kontrolsüz,duygusal',
    'Hiç belli etmem':'soğukkanlı,gizemli,kontrollü',
    'İntikamımı soğuk yerim':'hain,kurnaz,sabırlı',
    'Affederim genellikle':'fedakar,vicdanlı,olgun',
    'Lüks hayat, araba, ev':'hovarda,gösterişçi,paracı',
    'Garajı arabalarla doldururum':'araba delisi,tutkulu,koleksiyoncu',
    'Ailem ve dostlarıma yardım':'fedakar,sadık,şefkatli',
    'Sadece kendime harcarım':'bencil,pragmatik,bireyci',
    'Kabul, risk benim işim':'cesur,maceracı,korkusuz',
    'Kesinlikle hayır':'korkak,temkinli,akıllı',
    'Detaylara bağlı ama heyecanlıyım':'maceracı,stratejist,meraklı',
    'Kazancı neyse ona göre':'hesapçı,paracı,pragmatik',
    'Eğlenceli ve çekici':'karizmatik,sosyal,enerjik',
    'Tahmin edilemez':'psikopat,gizemli,değişken',
    'Her şeyi bilen':'dedikoducu,bilgili,meraklı',
    'Sahiplenici ve kıskanç':'kıskanç,tutkulu,sahiplenici',
    'Ben yapmadım!':'yalancı,kurnaz,kaçkın',
    'Bir daha deneyelim!':'kavgacı,cesur,inatçı',
    'Seni seviyorum':'romantik,duygusal,şefkatli',
    'Eee şimdi ne olacak?':'aptal,meraklı,sakin',
  };
  
  // Build user trait profile
  var userTraits = {};
  s.answers.forEach(function(a) {
    var traits = traitMap[a.a] || '';
    traits.split(',').forEach(function(t) {
      t = t.trim().toLowerCase();
      if (t) userTraits[t] = (userTraits[t] || 0) + 1;
    });
  });
  
  // Score each character
  var scored = chars.filter(function(c) { return c.a && c.tip; }).map(function(c) {
    var tipFull = c.tip.toLowerCase().trim();
    var score = 0;
    
    // Direct full match (e.g. "araba delisi" matches trait "araba delisi")
    if (userTraits[tipFull]) score += userTraits[tipFull] * 5;
    
    // Check each user trait against character tip
    Object.keys(userTraits).forEach(function(trait) {
      if (trait === tipFull) return; // already counted
      // Trait contains tip or tip contains trait
      if (tipFull.includes(trait) || trait.includes(tipFull)) {
        score += userTraits[trait] * 3;
      }
      // Partial word overlap
      var tipWords = tipFull.split(/\s+/);
      tipWords.forEach(function(tw) {
        if (tw.length > 2 && trait.includes(tw)) score += userTraits[trait];
      });
    });
    
    // Small randomness for variety (0-1, not 0-2)
    score += Math.random() * 0.5;
    return { c: c, score: score };
  });
  
  scored.sort(function(a, b) { return b.score - a.score; });
  
  var matched = scored.length > 0 && scored[0].score > 0 ? scored[0].c : null;
  
  // Fallback: random active character
  if (!matched) {
    var active = chars.filter(function(c) { return c.a; });
    matched = active[Math.floor(Math.random() * active.length)];
  }
  
  // Small delay for UX
  setTimeout(function() { renderWhoResult(matched, ''); }, 1500);
}

function renderWhoResult(result, reason) {
  var ag = document.getElementById('ag');
  
  ag.innerHTML = `
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div style="text-align:center;width:100%;max-width:480px;position:relative;overflow:hidden" id="who-box">
        
        <p class="fd" style="font-size:22px;font-weight:500;color:var(--t2);margin-bottom:16px;animation:fu .5s ease both">Sen tam olarak</p>
        
        <div style="max-width:500px;width:100%;border-radius:32px;overflow:hidden;margin:0 auto 20px;border:3px solid #e8433e40;animation:fu .6s ease .1s both">
          ${cp(result, 500)}
        </div>
        
        <h2 class="fd" style="font-size:48px;font-weight:800;line-height:1.1;animation:fu .6s ease .2s both"><span style="color:#e8433e">${esc(result.n)} ${esc(result.s)}</span>'sın!</h2>
        
        <div style="display:flex;justify-content:center;gap:12px;margin-top:36px;animation:fu .6s ease .4s both">
          <button class="btn bp" onclick="whoStart()">🔄 Tekrar Test</button>
          <button class="btn bs" onclick="bk()">Oyunlara Dön</button>
        </div>
      </div>
    </div>`;

  var box = document.getElementById('who-box');
  var colors = ['#e8433e','#e8433e','#2dd4bf','#FFB800','#3b82f6'];
  for (var i = 0; i < 30; i++) {
    var p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.cssText = 'left:'+Math.random()*100+'%;top:'+(60+Math.random()*30)+'%;background:'+colors[i%5]+';animation-delay:'+Math.random()*.5+'s;animation-duration:'+(1+Math.random())+'s;width:'+(4+Math.random()*6)+'px;height:'+(4+Math.random()*6)+'px;border-radius:'+(Math.random()>.5?'50%':'2px');
    box.appendChild(p);
  }
}
