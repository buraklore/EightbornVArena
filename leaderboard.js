var lbPeriod = 'alltime';

async function rLB(){
  var lbt = document.getElementById('lbt');
  lbt.innerHTML = '<div style="max-width:100%;margin:0 auto">' +
    '<h2 class="fd" style="text-align:center;font-size:48px;font-weight:700;margin-bottom:28px">\ud83c\udfc6 SIRALAMA</h2>' +
    '<div style="display:flex;gap:6px;justify-content:center;margin-bottom:24px;flex-wrap:wrap">' +
    lbPeriodBtn('daily', 'Günlük') +
    lbPeriodBtn('weekly', 'Haftalık') +
    lbPeriodBtn('monthly', 'Aylık') +
    lbPeriodBtn('alltime', 'Tüm Zamanlar') +
    '</div>' +
    '<div id="lb-content" style="min-height:200px"><div style="text-align:center;padding:40px;color:var(--t3)">Yükleniyor...</div></div>' +
    '</div>';
  loadLbPeriod(lbPeriod);
}

function lbPeriodBtn(period, label) {
  var active = lbPeriod === period;
  return '<button onclick="lbPeriod=\'' + period + '\';loadLbPeriod(\'' + period + '\');document.querySelectorAll(\'.lb-tab\').forEach(function(b){b.classList.remove(\'on\')});this.classList.add(\'on\')" class="lb-tab' + (active ? ' on' : '') + '">' + label + '</button>';
}

async function loadLbPeriod(period) {
  var el = document.getElementById('lb-content');
  el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--t3)">Yükleniyor...</div>';

  var data = await apiGetTimedLeaderboard(period);
  if (data.error) { el.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:var(--pk)">' + esc(data.error) + '</div>'; return; }

  var lb = data.leaderboard || [];
  if (lb.length === 0) {
    el.innerHTML = '<div class="card" style="text-align:center;padding:48px;color:var(--t3);font-size:16px">' +
      '<div style="font-size:48px;margin-bottom:12px">\ud83c\udfc6</div>' +
      'Bu dönemde henüz skor yok.</div>';
    return;
  }

  var h = '<div style="background:var(--bg2);border:1px solid #ffffff06;border-radius:16px;overflow:hidden">';
  h += '<div style="display:grid;grid-template-columns:56px 1fr 100px 70px;padding:14px 22px;font-size:13px;font-weight:700;color:var(--t3);background:var(--bg3)">';
  h += '<span style="text-align:center">#</span><span>Oyuncu</span><span style="text-align:right">Puan</span><span style="text-align:right">Oyun</span></div>';

  lb.forEach(function(u, i) {
    var rankClass = i === 0 ? 'color:#f59e0b' : i === 1 ? 'color:#94a3b8' : i === 2 ? 'color:#d97706' : 'color:var(--t3)';
    var avStyle = i === 0 ? 'background:rgba(245,158,11,.08);color:#f59e0b' : i === 2 ? 'background:rgba(217,119,6,.06);color:#d97706' : 'background:var(--bg4);color:var(--t2)';
    var score = parseInt(u.total_score || u.best_score || 0);
    var games = parseInt(u.games_played || 0);

    h += '<div style="display:grid;grid-template-columns:56px 1fr 100px 70px;align-items:center;padding:14px 22px;border-top:1px solid #ffffff04;transition:.1s" onmouseover="this.style.background=\'#ffffff03\'" onmouseout="this.style.background=\'\'">';
    h += '<div style="font-family:Bebas Neue,sans-serif;font-size:24px;text-align:center;' + rankClass + '">' + (i + 1) + '</div>';
    h += '<div style="display:flex;align-items:center;gap:12px"><div style="width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;' + avStyle + '">' + (u.username ? u.username[0].toUpperCase() : '?') + '</div>';
    h += '<span style="font-size:16px;font-weight:600">' + esc(u.username) + '</span></div>';
    h += '<div style="font-family:Bebas Neue,sans-serif;font-size:22px;color:var(--m);text-align:right">' + score.toLocaleString() + '</div>';
    h += '<div style="font-size:14px;color:var(--t3);text-align:right">' + games + '</div>';
    h += '</div>';
  });

  h += '</div>';
  el.innerHTML = h;
}
