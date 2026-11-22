/* Soru 5 – LBP: 3x3 blok hesaplayıcı, 5x5 kaydırma (harita + histogram), rastgele alıştırma.
   Sayfadaki bütün hesaplar bloktan üretilir (elle yazılmış sonuç yok). */
(function () {
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function kisit(v) { v = Math.round(Number(v)); if (isNaN(v)) v = 0; return Math.max(0, Math.min(255, v)); }
  function kopya(M) { return JSON.parse(JSON.stringify(M)); }
  /* Koddaki bit sırası: bit(1)..bit(8) → blok(satır,sütun). Merkez (2,2) atlanır. */
  var SIRA = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]];
  var AGIRLIK = [128, 64, 32, 16, 8, 4, 2, 1];
  function lbp(b) {
    var m = b[1][1], kom = SIRA.map(function (p) { return b[p[0]][p[1]]; });
    var bit = kom.map(function (v) { return v >= m ? 1 : 0; });
    var deger = bit.reduce(function (t, x, k) { return t + x * AGIRLIK[k]; }, 0);
    return { merkez: m, komsu: kom, bit: bit, ikili: bit.join(''), deger: deger };
  }
  function sut(v) { v = String(v); while (v.length < 4) v = ' ' + v; return v; }
  function hesapMetni(b) {
    var s = lbp(b), top = AGIRLIK.filter(function (a, k) { return s.bit[k]; });
    return 'merkez = blok(2,2) = ' + s.merkez + '\n' +
      'bit no   ' + [1, 2, 3, 4, 5, 6, 7, 8].map(sut).join('') + '\n' +
      'komşu    ' + s.komsu.map(sut).join('') + '\n' +
      '>= ' + s.merkez + ' ?' + new Array(Math.max(1, 5 - String(s.merkez).length)).join(' ') + s.bit.map(sut).join('') + '\n' +
      'ağırlık  ' + AGIRLIK.map(sut).join('') + '\n' +
      'ikili = ' + s.ikili + '\n' +
      'LBP = ' + (top.length ? top.join(' + ') + (top.length > 1 ? ' = ' + s.deger : '') : '0') + '\n' +
      'histo(' + s.deger + '+1) = histo(' + (s.deger + 1) + ') 1 artar';
  }
  /* 3x3 bit görünümü: komşularda 0/1, ortada merkez. */
  function bitCiz(kutu, b) {
    var s = lbp(b); kutu.textContent = '';
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
      if (i === 1 && j === 1) { kutu.appendChild(el('span', 'simdi', s.merkez)); continue; }
      var k = SIRA.findIndex(function (p) { return p[0] === i && p[1] === j; });
      kutu.appendChild(el('span', s.bit[k] ? 'bir' : 'bos', s.bit[k]));
    }
  }
  function sabitMat(kutu, M, orta) {
    kutu.textContent = '';
    M.forEach(function (r, i) { r.forEach(function (v, j) { kutu.appendChild(el('span', orta && i === 1 && j === 1 ? 'simdi' : null, v)); }); });
  }

  /* ---------- Sabit örnekler (anlatım bölümleri) ---------- */
  var ORNEK = [[5, 9, 1], [4, 6, 7], [2, 6, 3]];
  sabitMat($('oBlok'), ORNEK, true); bitCiz($('oBit'), ORNEK);
  $('oHesap').textContent = hesapMetni(ORNEK);
  (function () {
    var s = lbp(ORNEK), t = '<tr><th>k</th><th>bit(k)</th><th>2^(8-k)</th><th>eklenen</th><th>harita(i,j)</th></tr>', top = 0;
    for (var k = 0; k < 8; k++) { top += s.bit[k] * AGIRLIK[k]; t += '<tr><td>' + (k + 1) + '</td><td>' + s.bit[k] + '</td><td>' + AGIRLIK[k] + '</td><td>' + s.bit[k] * AGIRLIK[k] + '</td><td><strong>' + top + '</strong></td></tr>'; }
    $('oDongu').innerHTML = t;
  })();
  [['esitDuz', [[7, 7, 7], [7, 7, 7], [7, 7, 7]]], ['esitTepe', [[3, 5, 2], [4, 9, 1], [6, 0, 8]]], ['esitCukur', [[3, 5, 2], [4, 0, 1], [6, 9, 8]]]].forEach(function (x) {
    var s = lbp(x[1]); $(x[0]).textContent = x[1].map(function (r) { return r.join(' '); }).join(' ; ') + '  →  ' + s.ikili + ' = ' + s.deger;
  });

  /* ---------- A: 3x3 blok hesaplayıcı ---------- */
  var HAZIR = {
    sinav: ORNEK,
    duz: [[20, 20, 20], [20, 20, 20], [20, 20, 20]],
    yatay: [[200, 200, 200], [10, 10, 10], [10, 10, 10]],
    dikey: [[10, 10, 200], [10, 10, 200], [10, 10, 200]],
    tepe: [[10, 20, 30], [40, 250, 50], [60, 70, 80]]
  };
  var A = kopya(HAZIR.sinav);
  function aCiz() { bitCiz($('aBit'), A); $('aHesap').textContent = hesapMetni(A); }
  function aKur() {
    var k = $('aBlok'); k.textContent = '';
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) (function (i, j) {
      var inp = el('input'); inp.type = 'number'; inp.min = 0; inp.max = 255; inp.value = A[i][j];
      inp.setAttribute('aria-label', 'blok(' + (i + 1) + ',' + (j + 1) + ')' + (i === 1 && j === 1 ? ' merkez' : ''));
      if (i === 1 && j === 1) inp.className = 'sec';
      inp.addEventListener('input', function () { A[i][j] = kisit(inp.value); aCiz(); });
      inp.addEventListener('change', function () { inp.value = A[i][j]; });
      k.appendChild(inp);
    })(i, j);
    aCiz();
  }
  Array.prototype.forEach.call(document.querySelectorAll('#aracA [data-ornek]'), function (b) {
    b.addEventListener('click', function () { A = kopya(HAZIR[b.getAttribute('data-ornek')]); aKur(); });
  });
  aKur();

  /* ---------- B: 5x5 kaydırma ---------- */
  var B0 = [[5, 9, 1, 7, 3], [4, 6, 7, 2, 8], [2, 6, 3, 6, 6], [9, 1, 6, 6, 4], [5, 8, 6, 2, 7]];
  var R5 = kopya(B0), adim = 0; /* adim: kaç konum hesaplandı (0..9) */
  function blokAl(i, j) { return [0, 1, 2].map(function (a) { return [0, 1, 2].map(function (b) { return R5[i + a][j + b]; }); }); }
  function bCiz() {
    var son = adim > 0 ? adim - 1 : -1, si = Math.floor(son / 3), sj = son % 3;
    var k = $('bR'); k.textContent = '';
    for (var i = 0; i < 5; i++) for (var j = 0; j < 5; j++) (function (i, j) {
      var inp = el('input'); inp.type = 'number'; inp.min = 0; inp.max = 255; inp.value = R5[i][j];
      inp.setAttribute('aria-label', 'res(' + (i + 1) + ',' + (j + 1) + ')');
      if (son >= 0 && i === si + 1 && j === sj + 1) inp.className = 'simdi';
      else if (son >= 0 && i >= si && i <= si + 2 && j >= sj && j <= sj + 2) inp.className = 'sec';
      inp.addEventListener('change', function () { R5[i][j] = kisit(inp.value); adim = 0; bCiz(); });
      k.appendChild(inp);
    })(i, j);
    var h = $('bH'), sayim = {}; h.textContent = '';
    for (var n = 0; n < 9; n++) {
      var s = n < adim ? lbp(blokAl(Math.floor(n / 3), n % 3)) : null;
      h.appendChild(el('span', n === son ? 'simdi' : (s ? null : 'bos'), s ? s.deger : '·'));
      if (s) sayim[s.deger] = (sayim[s.deger] || 0) + 1;
    }
    var anahtar = Object.keys(sayim).map(Number).sort(function (a, b) { return a - b; });
    $('bHisto').textContent = anahtar.length ? anahtar.map(function (v) { return 'histo(' + (v + 1) + ') = ' + sayim[v] + '   (LBP değeri ' + v + ')'; }).join('\n') + '\ndiğer elemanlar 0   |   toplam = ' + adim : 'histo = zeros(1,256)   (hepsi 0)';
    $('bHesap').textContent = son < 0 ? 'Başlamak için "Sonraki adım"a bas. Kare sol üstten başlar: i=1, j=1.' :
      'Adım ' + adim + ' / 9:  i=' + (si + 1) + ', j=' + (sj + 1) + '   blok = res(' + (si + 1) + ':' + (si + 3) + ', ' + (sj + 1) + ':' + (sj + 3) + ')\n' + hesapMetni(blokAl(si, sj)) + '\nharita(' + (si + 1) + ',' + (sj + 1) + ') = ' + lbp(blokAl(si, sj)).deger;
    $('bSonraki').disabled = adim >= 9;
  }
  $('bSonraki').addEventListener('click', function () { if (adim < 9) { adim++; bCiz(); } });
  $('bHepsi').addEventListener('click', function () { adim = 9; bCiz(); });
  $('bBasa').addEventListener('click', function () { adim = 0; bCiz(); });
  $('bYeni').addEventListener('click', function () {
    for (var i = 0; i < 5; i++) for (var j = 0; j < 5; j++) R5[i][j] = Math.floor(Math.random() * 10);
    adim = 0; bCiz();
  });
  bCiz();

  /* ---------- Q: rastgele alıştırma ---------- */
  var Q = null, dogru = 0, toplam = 0;
  function rnd(n) { return Math.floor(Math.random() * n); }
  function yeniSoru() {
    var b = [0, 1, 2].map(function () { return [0, 1, 2].map(function () { return rnd(10); }); });
    b[1][1] = 2 + rnd(6); /* merkez uçta olmasın: bitler hep 0 ya da hep 1 çıkmasın */
    var tip = rnd(3), s = lbp(b);
    Q = { blok: b, tip: tip, s: s, hata: 0 };
    sabitMat($('qBlok'), b, true);
    $('qSoru').textContent = tip === 0 ? 'Bu bloğun LBP değeri (harita(i,j)) kaçtır?' : tip === 1 ? '8 biti koddaki sırayla yaz (bit(1) … bit(8)). Örnek: 01001010' : 'histo\'nun kaçıncı elemanı 1 artar?';
    $('qCevap').value = ''; $('qSonuc').textContent = ''; $('qSonuc').className = 'sonuc'; $('qKontrol').disabled = false;
  }
  function kontrol() {
    if (!Q || $('qKontrol').disabled) return;
    var ham = $('qCevap').value.trim(), s = $('qSonuc'), ok, ipucu;
    if (!ham) { s.className = 'sonuc'; s.textContent = 'Önce cevabını yaz.'; return; }
    /* Okunamayan yazım deneme hakkı götürmez. */
    if (Q.tip === 1) {
      var bitler = ham.replace(/[\s,;.\-]/g, '');
      if (!/^[01]{8}$/.test(bitler)) { s.className = 'sonuc no'; s.textContent = 'Sadece 0 ve 1 ile tam 8 bit yaz, örnek: 01001010'; return; }
      ok = bitler === Q.s.ikili;
      ipucu = bitler === Q.s.ikili.split('').reverse().join('') ? 'Sıra ters: bit(1) sol üst köşedir, soldan sağa ve yukarıdan aşağıya git.' :
        bitler === Q.s.ikili.replace(/[01]/g, function (c) { return c === '1' ? '0' : '1'; }) ? '1 ile 0 yer değiştirmiş: komşu >= merkez ise 1.' :
          'Komşu >= merkez ise 1 (eşitlik de 1). Sıra: üst satır, orta sol, orta sağ, alt satır.';
    } else {
      var v = Soru.sayiOku(ham), bek = Q.tip === 0 ? Q.s.deger : Q.s.deger + 1;
      if (isNaN(v)) { s.className = 'sonuc no'; s.textContent = 'Tek bir sayı yaz, örnek: 74'; return; }
      ok = v === bek;
      ipucu = Q.tip === 2 && v === Q.s.deger ? 'LBP değerini doğru buldun ama indis değer + 1: histo(harita(i,j)+1).' :
        Q.tip === 0 && v === Q.s.deger + 1 ? 'Bu, histogramdaki sıra. LBP değeri bir eksiği.' :
          'Önce 8 biti çıkar (komşu >= merkez ise 1), sonra 128, 64, 32, 16, 8, 4, 2, 1 ile çarpıp topla.' + (Q.tip === 2 ? ' En sonda 1 ekle.' : '');
    }
    if (ok) {
      if (Q.hata === 0) dogru++; toplam++; $('qKontrol').disabled = true;
      s.className = 'sonuc ok'; s.textContent = 'Doğru.' + (Q.hata ? '' : ' İlk denemede!');
    } else {
      Q.hata++; s.className = 'sonuc no';
      if (Q.hata === 1) s.textContent = 'Yanlış. İpucu: ' + ipucu;
      else { toplam++; $('qKontrol').disabled = true; s.textContent = 'Yanlış. Çözüm:'; s.appendChild(el('div', 'hesap', hesapMetni(Q.blok))); }
    }
    $('qSkor').textContent = 'Doğru: ' + dogru + ' / ' + toplam; $('qBar').style.width = (toplam ? dogru / toplam * 100 : 0) + '%';
  }
  $('qKontrol').addEventListener('click', kontrol);
  $('qCevap').addEventListener('keydown', function (e) { if (e.key === 'Enter') { if ($('qKontrol').disabled) yeniSoru(); else kontrol(); } });
  $('qYeni').addEventListener('click', function () { yeniSoru(); $('qCevap').focus(); });
  yeniSoru();
})();
