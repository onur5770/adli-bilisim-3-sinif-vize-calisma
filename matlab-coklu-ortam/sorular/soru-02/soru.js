/* Soru 2 uygulamaları: 3x3 blok hesaplayıcı, 5x5 kaydırma, football üzerinde Sobel, rastgele alıştırma. */
(function () {
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function kisit(v) { v = Math.round(Number(v)); if (isNaN(v)) v = 0; return Math.max(0, Math.min(255, v)); }
  var GX = [[1, 2, 1], [0, 0, 0], [-1, -2, -1]], GY = [[1, 0, -1], [2, 0, -2], [1, 0, -1]];
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function sobel(b) {
    var ust = b[0][0] + 2 * b[0][1] + b[0][2], alt = b[2][0] + 2 * b[2][1] + b[2][2];
    var sol = b[0][0] + 2 * b[1][0] + b[2][0], sag = b[0][2] + 2 * b[1][2] + b[2][2];
    var X = ust - alt, Y = sol - sag, G = Math.sqrt(X * X + Y * Y);
    return { ust: ust, alt: alt, sol: sol, sag: sag, X: X, Y: Y, G: G, kenar: G > 255 ? 1 : 0 };
  }
  function gYaz(G) { return Math.abs(G - Math.round(G)) < 1e-9 ? String(Math.round(G)) : '≈ ' + G.toFixed(1); }
  function hesapMetni(b) {
    var s = sobel(b);
    return 'X = üst − alt\n' +
      '  üst = ' + b[0][0] + '·1 + ' + b[0][1] + '·2 + ' + b[0][2] + '·1 = ' + s.ust + '\n' +
      '  alt = ' + b[2][0] + '·1 + ' + b[2][1] + '·2 + ' + b[2][2] + '·1 = ' + s.alt + '\n' +
      '  X = ' + s.ust + ' − ' + s.alt + ' = ' + s.X + '\n' +
      'Y = sol − sağ\n' +
      '  sol = ' + b[0][0] + '·1 + ' + b[1][0] + '·2 + ' + b[2][0] + '·1 = ' + s.sol + '\n' +
      '  sağ = ' + b[0][2] + '·1 + ' + b[1][2] + '·2 + ' + b[2][2] + '·1 = ' + s.sag + '\n' +
      '  Y = ' + s.sol + ' − ' + s.sag + ' = ' + s.Y + '\n' +
      'G = sqrt(' + par(s.X) + '² + ' + par(s.Y) + '²) = sqrt(' + (s.X * s.X + s.Y * s.Y) + ') ' + (gYaz(s.G).charAt(0) === '≈' ? '' : '= ') + gYaz(s.G) + '\n' +
      'kenar = G > 255 → ' + (s.kenar ? 'evet → 1' : 'hayır → 0');
  }
  function sabitMat(kutu, M) { kutu.textContent = ''; M.forEach(function (r) { r.forEach(function (v) { kutu.appendChild(el('span', null, v)); }); }); }

  /* ---------- A: 3x3 blok hesaplayıcı ---------- */
  var ORNEK = {
    duz: [[20, 20, 20], [20, 20, 20], [20, 20, 20]],
    yatay: [[10, 10, 10], [10, 10, 10], [200, 200, 200]],
    dikey: [[10, 10, 200], [10, 10, 200], [10, 10, 200]],
    capraz: [[10, 10, 10], [10, 10, 200], [10, 200, 200]]
  };
  var A = JSON.parse(JSON.stringify(ORNEK.yatay));
  function aCiz() { $('aHesap').textContent = hesapMetni(A); }
  function aKur() {
    var k = $('aBlok'); k.textContent = '';
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) (function (i, j) {
      var inp = el('input'); inp.type = 'number'; inp.min = 0; inp.max = 255; inp.value = A[i][j];
      inp.setAttribute('aria-label', 'blok(' + (i + 1) + ',' + (j + 1) + ')');
      inp.addEventListener('input', function () { A[i][j] = kisit(inp.value); aCiz(); });
      k.appendChild(inp);
    })(i, j);
    aCiz();
  }
  sabitMat($('aGx'), GX); sabitMat($('aGy'), GY);
  document.querySelectorAll('#aracA [data-ornek]').forEach(function (b) {
    b.addEventListener('click', function () { A = JSON.parse(JSON.stringify(ORNEK[b.getAttribute('data-ornek')])); aKur(); });
  });
  aKur();

  /* ---------- B: 5x5 kaydırma ---------- */
  var B0 = [[10, 10, 10, 10, 10], [10, 10, 10, 10, 10], [10, 10, 200, 200, 200], [10, 10, 200, 200, 200], [10, 10, 200, 200, 200]];
  var R5 = JSON.parse(JSON.stringify(B0)), adim = 0; // adim: kaç konum hesaplandı (0..9)
  function blokAl(i, j) { return [0, 1, 2].map(function (a) { return [0, 1, 2].map(function (b) { return R5[i + a][j + b]; }); }); }
  function bCiz() {
    var son = adim > 0 ? adim - 1 : -1, si = Math.floor(son / 3), sj = son % 3;
    var k = $('bR'); k.textContent = '';
    for (var i = 0; i < 5; i++) for (var j = 0; j < 5; j++) (function (i, j) {
      var inp = el('input'); inp.type = 'number'; inp.min = 0; inp.max = 255; inp.value = R5[i][j];
      inp.setAttribute('aria-label', 'R(' + (i + 1) + ',' + (j + 1) + ')');
      if (son >= 0 && i >= si && i <= si + 2 && j >= sj && j <= sj + 2) inp.className = 'sec';
      inp.addEventListener('change', function () { R5[i][j] = kisit(inp.value); adim = 0; bCiz(); });
      k.appendChild(inp);
    })(i, j);
    ['bX', 'bY', 'bG', 'bK'].forEach(function (id) { $(id).textContent = ''; });
    for (var n = 0; n < 9; n++) {
      var s = n < adim ? sobel(blokAl(Math.floor(n / 3), n % 3)) : null, cls = n === son ? 'simdi' : (s ? null : 'bos');
      $('bX').appendChild(el('span', cls, s ? s.X : '·'));
      $('bY').appendChild(el('span', cls, s ? s.Y : '·'));
      $('bG').appendChild(el('span', cls, s ? Math.round(s.G) : '·'));
      $('bK').appendChild(el('span', s && s.kenar && n !== son ? 'bir' : cls, s ? s.kenar : '·'));
    }
    $('bHesap').textContent = son < 0 ? 'Başlamak için "Sonraki adım"a bas. Kare sol üstten başlar: i=1, j=1.' :
      'Adım ' + adim + ' / 9:  i=' + (si + 1) + ', j=' + (sj + 1) + '   blok = R(' + (si + 1) + ':' + (si + 3) + ', ' + (sj + 1) + ':' + (sj + 3) + ')\n' + hesapMetni(blokAl(si, sj));
    $('bSonraki').disabled = adim >= 9;
  }
  $('bSonraki').addEventListener('click', function () { if (adim < 9) { adim++; bCiz(); } });
  $('bHepsi').addEventListener('click', function () { adim = 9; bCiz(); });
  $('bBasa').addEventListener('click', function () { adim = 0; bCiz(); });
  $('bYeni').addEventListener('click', function () {
    var D = [0, 10, 20, 50, 100, 150, 200, 250], a = D[Math.floor(Math.random() * 4)], b = D[4 + Math.floor(Math.random() * 4)], tip = Math.floor(Math.random() * 3), kes = 1 + Math.floor(Math.random() * 3);
    for (var i = 0; i < 5; i++) for (var j = 0; j < 5; j++) R5[i][j] = (tip === 0 ? i >= kes : tip === 1 ? j >= kes : i + j >= kes + 2) ? b : a;
    adim = 0; bCiz();
  });
  bCiz();

  /* ---------- C: football üzerinde Sobel ---------- */
  var F = window.FOOTBALL;
  if (F && F.b64) {
    var bin = atob(F.b64), w = F.h, h = F.w, Rk = new Float32Array(w * h); // w: satır, h: sütun (koddaki adlarla)
    for (var n = 0; n < w * h; n++) Rk[n] = bin.charCodeAt(n * 3);
    var ow = w - 2, oh = h - 2, X = new Float32Array(ow * oh), Y = new Float32Array(ow * oh), G = new Float32Array(ow * oh);
    for (var i = 0; i < ow; i++) for (var j = 0; j < oh; j++) {
      var p = function (a, b) { return Rk[(i + a) * h + (j + b)]; };
      var x = p(0, 0) + 2 * p(0, 1) + p(0, 2) - p(2, 0) - 2 * p(2, 1) - p(2, 2);
      var y = p(0, 0) + 2 * p(1, 0) + p(2, 0) - p(0, 2) - 2 * p(1, 2) - p(2, 2);
      X[i * oh + j] = x; Y[i * oh + j] = y; G[i * oh + j] = Math.sqrt(x * x + y * y);
    }
    var boya = function (canvas, cw, ch, fn) {
      var c = canvas.getContext('2d'), im = c.createImageData(cw, ch), d = im.data;
      for (var n = 0, q = 0; n < cw * ch; n++, q += 4) { var v = fn(n); d[q] = d[q + 1] = d[q + 2] = v; d[q + 3] = 255; }
      c.putImageData(im, 0, 0);
    };
    var olcekli = function (canvas, M) { // imshow(M,[]): en küçük siyah, en büyük beyaz
      var mn = Infinity, mx = -Infinity; for (var n = 0; n < M.length; n++) { if (M[n] < mn) mn = M[n]; if (M[n] > mx) mx = M[n]; }
      boya(canvas, oh, ow, function (n) { return (M[n] - mn) / (mx - mn || 1) * 255; });
    };
    boya($('cR'), h, w, function (n) { return Rk[n]; });
    olcekli($('cX'), X); olcekli($('cY'), Y);
    var kCiz = function () {
      var e = Number($('cEsik').value), say = 0;
      boya($('cK'), oh, ow, function (n) { if (G[n] > e) { say++; return 255; } return 0; });
      $('cEsikYazi').textContent = e;
      $('cBilgi').textContent = 'Çıktı boyutu ' + ow + '×' + oh + ' (giriş ' + w + '×' + h + ', her yönden 2 küçük). Eşik ' + e + ' iken ' + say + ' piksel kenar (1), yani %' + (say / (ow * oh) * 100).toFixed(1) + '.';
    };
    $('cEsik').addEventListener('input', kCiz);
    $('cSifirla').addEventListener('click', function () { $('cEsik').value = 255; kCiz(); });
    kCiz();
  } else { $('cBilgi').textContent = 'Resim verisi yüklenemedi (../soru-01/football.js).'; }

  /* ---------- Q: rastgele alıştırma ---------- */
  var Q = null, dogru = 0, toplam = 0;
  function rnd(n) { return Math.floor(Math.random() * n); }
  function yeniSoru() {
    var D = [0, 10, 20, 30, 50, 100], a = D[rnd(D.length)], b = D[rnd(D.length)], tip = rnd(3), kes = 1 + rnd(2), blok = [];
    if (a === b) b = a + 40;
    for (var i = 0; i < 3; i++) { blok.push([]); for (var j = 0; j < 3; j++) blok[i].push((tip === 0 ? i >= kes : tip === 1 ? j >= kes : i + j >= kes + 1) ? b : a); }
    var s = sobel(blok), ne = ['X', 'Y', 'kenar'][rnd(3)];
    Q = { ans: s[ne], ne: ne, blok: blok, hata: 0 };
    sabitMat($('qBlok'), blok);
    $('qSoru').textContent = ne === 'X' ? 'Bu blok için X (Gx ile, üst − alt) kaçtır?' : ne === 'Y' ? 'Bu blok için Y (Gy ile, sol − sağ) kaçtır?' : 'Bu blok için kenar değeri kaçtır? (G > 255 ise 1, değilse 0)';
    $('qCevap').value = ''; $('qSonuc').textContent = ''; $('qSonuc').className = 'sonuc'; $('qKontrol').disabled = false;
  }
  function kontrol() {
    if (!Q || $('qKontrol').disabled) return;
    var ham = Soru.sayiOku($('qCevap').value), s = $('qSonuc');
    if (isNaN(ham)) { s.className = 'sonuc no'; s.textContent = 'Tek bir sayı yaz (eksi olabilir), örnek: -120'; return; }
    if (ham === Q.ans) {
      if (Q.hata === 0) dogru++; toplam++; $('qKontrol').disabled = true;
      s.className = 'sonuc ok'; s.textContent = 'Doğru.' + (Q.hata ? '' : ' İlk denemede!');
    } else {
      Q.hata++; s.className = 'sonuc no';
      if (Q.hata === 1) s.textContent = ham === -Q.ans && Q.ans !== 0 ? 'Yanlış. İşarete dikkat: ' + (Q.ne === 'X' ? 'üst − alt' : 'sol − sağ') + ' (çıkarma sırası).' :
        'Yanlış. İpucu: ' + (Q.ne === 'X' ? 'üst satır (a + 2b + c) eksi alt satır (a + 2b + c). Orta satır 0.' : Q.ne === 'Y' ? 'sol sütun (a + 2b + c) eksi sağ sütun (a + 2b + c). Orta sütun 0.' : 'önce X ve Y, sonra X² + Y² 65025\'ten (255²) büyük mü diye bak.');
      else { toplam++; $('qKontrol').disabled = true; s.textContent = 'Yanlış. Çözüm:'; var pre = el('div', 'hesap', hesapMetni(Q.blok)); s.appendChild(pre); }
    }
    $('qSkor').textContent = 'Doğru: ' + dogru + ' / ' + toplam; $('qBar').style.width = (toplam ? dogru / toplam * 100 : 0) + '%';
  }
  $('qKontrol').addEventListener('click', kontrol);
  $('qCevap').addEventListener('keydown', function (e) { if (e.key === 'Enter') { if ($('qKontrol').disabled) yeniSoru(); else kontrol(); } });
  $('qYeni').addEventListener('click', yeniSoru);
  yeniSoru();
})();
