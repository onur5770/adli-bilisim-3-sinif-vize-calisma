/* Soru 1 uygulamaları: 2x2x3 düzenleyici, football katman ayırıcı, rastgele alıştırma, histogram. */
(function () {
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function kisit(v) { v = Math.round(Number(v)); if (isNaN(v)) v = 0; return Math.max(0, Math.min(255, v)); }
  // Görüntülenecek 0-255 değeri: uint8 modunda olduğu gibi; double modunda 1 ve üstü tam parlak.
  function goster(v, uint8Mod) { return uint8Mod ? v : Math.min(v, 1) * 255; }
  var ADLAR = ['R', 'G', 'B'], ROZET = ['r', 'g', 'b'];

  /* ---------- A: 2x2x3 düzenleyici ---------- */
  var ORNEK = [[[255, 0, 0], [0, 255, 0]], [[0, 0, 255], [255, 255, 255]]];
  var P = JSON.parse(JSON.stringify(ORNEK));
  function swatchGrid(fn) {
    var g = el('div', 'pk'); g.style.gridTemplateColumns = 'repeat(2,1fr)';
    for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
      var t = fn(i, j), d = el('div', 'p');
      d.style.background = 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
      d.appendChild(el('span', null, '(' + (i + 1) + ',' + (j + 1) + ')'));
      d.appendChild(el('span', null, t.map(Math.round).join(',')));
      g.appendChild(d);
    }
    return g;
  }
  function matHtml(m) { return m.map(function (r) { return r.map(function (v) { return String(v).padStart(3, ' '); }).join(' '); }).join('\n'); }
  function ciziA() {
    var mod = $('aMod').checked, cik = $('aCikis'); cik.textContent = '';
    var h0 = el('div', 'hucre'); h0.appendChild(el('b', null, 'Orijinal (resim)'));
    h0.appendChild(swatchGrid(function (i, j) { return P[i][j].map(function (v) { return goster(v, true); }); })); cik.appendChild(h0);
    for (var k = 0; k < 3; k++) (function (k) {
      var h = el('div', 'hucre'), b = el('b', null, ADLAR[k] + ' resmi');
      var r = el('span', 'rozet ' + ROZET[k], ADLAR[k]); h.appendChild(r); h.appendChild(b);
      h.appendChild(swatchGrid(function (i, j) { var t = [0, 0, 0]; t[k] = goster(P[i][j][k], mod); return t; }));
      cik.appendChild(h);
    })(k);
    var m = $('aMat'); m.textContent = '';
    var tum = [['resim', null]].concat(ADLAR.map(function (a, k) { return [a, k]; }));
    tum.forEach(function (x) {
      var blok = el('div'); blok.appendChild(el('p', null, x[0] === 'resim' ? 'resim (orijinal)' : x[0] + ' (R(:,:,' + (x[1] + 1) + ')=resim(:,:,' + (x[1] + 1) + ') sonrası)'));
      for (var kat = 0; kat < 3; kat++) {
        var w = el('div', 'kat'), pre = el('div', 'mat');
        pre.textContent = matHtml([0, 1].map(function (i) { return [0, 1].map(function (j) { return (x[1] === null || x[1] === kat) ? P[i][j][kat] : 0; }); }));
        w.appendChild(pre); w.appendChild(el('div', null, 'Katman ' + (kat + 1) + ' (' + ADLAR[kat] + ')')); blok.appendChild(w);
      }
      m.appendChild(blok);
    });
  }
  function girisA() {
    var g = $('aGiris'); g.textContent = '';
    for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) (function (i, j) {
      var h = el('div', 'hucre'); h.appendChild(el('b', null, 'Piksel (' + (i + 1) + ',' + (j + 1) + ')'));
      var s = el('div', 'rgb3');
      for (var k = 0; k < 3; k++) (function (k) {
        var lab = el('label'); lab.appendChild(el('span', 'rozet ' + ROZET[k], ADLAR[k]));
        var inp = el('input'); inp.type = 'number'; inp.min = 0; inp.max = 255; inp.value = P[i][j][k];
        inp.setAttribute('aria-label', 'Piksel (' + (i + 1) + ',' + (j + 1) + ') ' + ADLAR[k]);
        inp.addEventListener('input', function () { P[i][j][k] = kisit(inp.value); ciziA(); });
        /* kutudan çıkınca gösterilen sayı, gerçekte kullanılan (0-255'e kırpılmış) değerle aynı olsun */
        inp.addEventListener('change', function () { inp.value = P[i][j][k]; });
        lab.appendChild(inp); s.appendChild(lab);
      })(k);
      h.appendChild(s); g.appendChild(h);
    })(i, j);
  }
  $('aMod').addEventListener('change', ciziA);
  $('aSifirla').addEventListener('click', function () { P = JSON.parse(JSON.stringify(ORNEK)); girisA(); ciziA(); });
  girisA(); ciziA();

  /* ---------- B: football ---------- */
  var F = window.FOOTBALL, px = null;
  if (F) {
    var bin = atob(F.b64); px = new Uint8Array(bin.length);
    for (var q = 0; q < bin.length; q++) px[q] = bin.charCodeAt(q);
  }
  var secim = { x: -1, y: -1 };
  function ciz(canvas, mask, uint8Mod) {
    var c = canvas.getContext('2d'), im = c.createImageData(F.w, F.h), d = im.data;
    for (var n = 0, p = 0; n < F.w * F.h; n++, p += 4) {
      for (var k = 0; k < 3; k++) d[p + k] = mask[k] ? goster(px[n * 3 + k], uint8Mod) : 0;
      d[p + 3] = 255;
    }
    c.putImageData(im, 0, 0);
  }
  function ciziB() {
    if (!px) return;
    var mod = $('bMod').checked;
    ciz($('bO'), [1, 1, 1], true); ciz($('bR'), [1, 0, 0], mod); ciz($('bG'), [0, 1, 0], mod); ciz($('bB'), [0, 0, 1], mod);
    var ks = document.querySelectorAll('.bk'), m = [0, 0, 0];
    ks.forEach(function (c) { m[+c.getAttribute('data-k')] = c.checked ? 1 : 0; });
    ciz($('bT'), m, true);
    if (secim.x >= 0) {
      var c = $('bO').getContext('2d'); c.strokeStyle = '#fff'; c.lineWidth = 2; c.strokeRect(secim.x - 5, secim.y - 5, 11, 11);
      c.strokeStyle = '#000'; c.lineWidth = 1; c.strokeRect(secim.x - 6, secim.y - 6, 13, 13);
    }
  }
  if (px) {
    $('bMod').addEventListener('change', ciziB);
    document.querySelectorAll('.bk').forEach(function (c) { c.addEventListener('change', ciziB); });
    $('bO').addEventListener('click', function (e) {
      var r = this.getBoundingClientRect();
      var x = Math.max(0, Math.min(F.w - 1, Math.floor((e.clientX - r.left) / r.width * F.w)));
      var y = Math.max(0, Math.min(F.h - 1, Math.floor((e.clientY - r.top) / r.height * F.h)));
      secim = { x: x, y: y }; var o = (y * F.w + x) * 3, v = [px[o], px[o + 1], px[o + 2]];
      $('bBilgi').textContent = 'Piksel (' + (y + 1) + ',' + (x + 1) + '):  resim(' + (y + 1) + ',' + (x + 1) + ',1)=' + v[0] + ',  resim(' + (y + 1) + ',' + (x + 1) + ',2)=' + v[1] + ',  resim(' + (y + 1) + ',' + (x + 1) + ',3)=' + v[2] + '   →  (R,G,B) = (' + v.join(', ') + ')';
      ciziB();
    });
    ciziB();
    /* histogram */
    var hist = new Array(256).fill(0), ust = 0;
    for (var n = 0; n < F.w * F.h; n++) {
      var g = Math.round(0.299 * px[n * 3] + 0.587 * px[n * 3 + 1] + 0.114 * px[n * 3 + 2]); hist[g]++;
    }
    hist.forEach(function (v) { if (v > ust) ust = v; });
    var hc = $('hC'), x = hc.getContext('2d');
    x.clearRect(0, 0, hc.width, hc.height); x.fillStyle = '#1d5fe0';
    for (var i = 0; i < 256; i++) { var bh = Math.round(hist[i] / ust * (hc.height - 10)); x.fillRect(i * 2, hc.height - bh, 2, bh); }
    $('hBilgi').textContent = 'Yatay: parlaklık 0–255 (histo(deger+1) ile 1–256. kutu). Dikey: o parlaklıkta kaç piksel var. En kalabalık kutu ' + hist.indexOf(ust) + ' değerinde, ' + ust + ' piksel.';
  } else { $('bBilgi').textContent = 'Resim verisi yüklenemedi (football.js).'; }

  /* ---------- Q: rastgele alıştırma ---------- */
  var DEG = [0, 10, 30, 50, 60, 80, 90, 120, 200, 240, 255];
  var Q = null, dogru = 0, toplam = 0, yanlisSayi = 0;
  function rnd(n) { return Math.floor(Math.random() * n); }
  function yeniSoru() {
    var M = [0, 1, 2].map(function () { return [0, 1].map(function () { return [0, 1].map(function () { return DEG[rnd(DEG.length)]; }); }); }); // M[k][i][j]
    var tip = rnd(4), i = rnd(2), j = rnd(2), k = rnd(3), s, ans, tipTxt = ['R', 'G', 'B'][k];
    if (tip === 0) { s = tipTxt + ' resminde (' + (i + 1) + ',' + (j + 1) + ') pikselinin (R,G,B) üçlüsü nedir? ( ' + tipTxt + '(:,:,' + (k + 1) + ')=resim(:,:,' + (k + 1) + ') çalışmış olsun )'; ans = [0, 0, 0]; ans[k] = M[k][i][j]; }
    else if (tip === 1) { s = 'resim(' + (i + 1) + ',' + (j + 1) + ',' + (k + 1) + ') kaçtır?'; ans = [M[k][i][j]]; }
    else if (tip === 2) { s = 'resim(' + (i + 1) + ',:,' + (k + 1) + ') ne verir? (soldan sağa)  Sözle: ' + (i + 1) + '. satır, tüm sütunlar, ' + (k + 1) + '. katman'; ans = [M[k][i][0], M[k][i][1]]; }
    else { s = 'resim(:,' + (j + 1) + ',' + (k + 1) + ') ne verir? (yukarıdan aşağıya)  Sözle: tüm satırlar, ' + (j + 1) + '. sütun, ' + (k + 1) + '. katman'; ans = [M[k][0][j], M[k][1][j]]; }
    Q = { M: M, s: s, ans: ans, hata: 0 };
    var g = $('qResim'); g.textContent = '';
    for (var kk = 0; kk < 3; kk++) {
      var w = el('div', 'kat'), pre = el('div', 'mat'); pre.textContent = matHtml(M[kk]);
      w.appendChild(pre); w.appendChild(el('div', null, 'Katman ' + (kk + 1) + ' (' + ADLAR[kk] + ')')); g.appendChild(w);
    }
    $('qSoru').textContent = s; $('qCevap').value = ''; $('qSonuc').textContent = ''; $('qSonuc').className = 'sonuc';

  }
  /* Soru bitti: "Kontrol et" kapanır; odak ondaysa kaybolmasın diye "Yeni soru"ya geçer. */
  function bitir() {
    var odakta = document.activeElement === $('qKontrol');
    $('qKontrol').disabled = true;
    if (odakta) $('qYeni').focus();
  }
  function kontrol() {
    if (!Q || $('qKontrol').disabled) return;
    var g = ($('qCevap').value.match(/-?\d+/g) || []).map(Number), s = $('qSonuc');
    var ok = g.length === Q.ans.length && g.every(function (v, n) { return v === Q.ans[n]; });
    if (ok) {
      if (Q.hata === 0) dogru++; toplam++;
      s.className = 'sonuc ok'; s.textContent = 'Doğru. ' + (Q.hata ? '' : 'İlk denemede!');
      bitir();
    } else if (g.length !== Q.ans.length) {
      /* Sayı adedi yanlışsa (boş bırakma dahil) deneme hakkı gitmez. */
      s.className = 'sonuc no'; s.textContent = 'Kaç sayı beklendiğine dikkat et (' + Q.ans.length + ' sayı).';
    } else {
      Q.hata++; s.className = 'sonuc no';
      s.textContent = Q.hata === 1 ? 'Yanlış. İpucu: doğru katmanın tablosuna bak, kaç numaralı satır/sütun olduğunu say (1\'den başlar).' :
        'Yanlış. Cevap: ' + Q.ans.join(' ') + ' (bir sonraki soruya geç).';
      if (Q.hata === 2) { toplam++; bitir(); }
    }
    $('qSkor').textContent = 'Doğru: ' + dogru + ' / ' + toplam; $('qBar').style.width = (toplam ? dogru / toplam * 100 : 0) + '%';
  }
  $('qKontrol').addEventListener('click', kontrol);
  $('qCevap').addEventListener('keydown', function (e) { if (e.key === 'Enter') { if ($('qKontrol').disabled) yeniSoru(), $('qKontrol').disabled = false; else kontrol(); } });
  $('qYeni').addEventListener('click', function () { $('qKontrol').disabled = false; yeniSoru(); $('qCevap').focus(); });
  yeniSoru();
})();
