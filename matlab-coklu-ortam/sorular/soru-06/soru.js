/* Soru 6 – LBP ile HOG farkları: 3x3 blokta LBP kodu ve gradyan (büyüklük, yön, kutu),
   ışık değişimi denemesi, "LBP mi HOG mu?" alıştırması. Bütün sayılar bloktan hesaplanır. */
(function () {
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function kisit(v) { v = Math.round(Number(v)); if (isNaN(v)) v = 0; return Math.max(0, Math.min(255, v)); }
  function kopya(M) { return JSON.parse(JSON.stringify(M)); }
  function yaz(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(1); }
  var SIRA = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]];
  function lbp(b) {
    var m = b[1][1], bit = SIRA.map(function (p) { return b[p[0]][p[1]] >= m ? 1 : 0; });
    return { ikili: bit.join(''), deger: parseInt(bit.join(''), 2) };
  }
  /* Merkez pikselin gradyanı: yatay fark (sağ − sol), dikey fark (alt − üst). Yön işaretsiz: 0–180°. */
  function hog(b) {
    var gx = b[1][2] - b[1][0], gy = b[2][1] - b[0][1], buy = Math.sqrt(gx * gx + gy * gy);
    var yon = buy ? Math.atan2(gy, gx) * 180 / Math.PI : 0; if (yon < 0) yon += 180; if (yon >= 180) yon -= 180;
    var kutu = Math.min(8, Math.floor(yon / 20));
    return { gx: gx, gy: gy, buy: buy, yon: yon, kutu: kutu };
  }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function lbpMetni(b) { var s = lbp(b); return 'merkez = ' + b[1][1] + '\nkomşu >= merkez → ' + s.ikili + '\nLBP kodu = ' + s.deger; }
  function hogMetni(b) {
    var s = hog(b);
    return 'Gx = sağ − sol = ' + b[1][2] + ' − ' + b[1][0] + ' = ' + s.gx + '\n' +
      'Gy = alt − üst = ' + b[2][1] + ' − ' + b[0][1] + ' = ' + s.gy + '\n' +
      'büyüklük = sqrt(' + par(s.gx) + '² + ' + par(s.gy) + '²) = ' + yaz(s.buy) + '\n' +
      (s.buy ? 'yön = ' + yaz(s.yon) + '°  →  ' + (s.kutu * 20) + '–' + (s.kutu * 20 + 20) + '° kutusu (9 kutudan ' + (s.kutu + 1) + '.)' : 'yön yok (gradyan 0: düz bölge, histograma katkı 0)');
  }
  function kutulariCiz(kutu, b) {
    var s = hog(b); kutu.textContent = '';
    for (var k = 0; k < 9; k++) kutu.appendChild(el('span', s.buy && k === s.kutu ? 'simdi' : 'bos', s.buy && k === s.kutu ? yaz(s.buy) : '0'));
  }

  /* ---------- A: aynı blok, iki yöntem ---------- */
  var HAZIR = {
    dikey: [[10, 10, 200], [10, 10, 200], [10, 10, 200]],
    yatay: [[200, 200, 200], [10, 10, 10], [10, 10, 10]],
    capraz: [[10, 10, 100], [10, 100, 200], [100, 200, 200]],
    duz: [[50, 50, 50], [50, 50, 50], [50, 50, 50]],
    doku: [[5, 9, 1], [4, 6, 7], [2, 6, 3]]
  };
  var A = kopya(HAZIR.dikey);
  function aCiz() { $('aLbp').textContent = lbpMetni(A); $('aHog').textContent = hogMetni(A); kutulariCiz($('aKutu'), A); }
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

  /* ---------- B: ışık değişimi ---------- */
  var B0 = [[20, 60, 30], [10, 40, 90], [50, 70, 25]];
  function bCiz() {
    var ek = $('bEk').checked ? 40 : 0, carp = $('bCarp').checked ? 2 : 1;
    var b = B0.map(function (r) { return r.map(function (v) { return v * carp + ek; }); });
    var k = $('bBlok'); k.textContent = '';
    b.forEach(function (r, i) { r.forEach(function (v, j) { k.appendChild(el('span', i === 1 && j === 1 ? 'simdi' : null, v)); }); });
    var l0 = lbp(B0), l1 = lbp(b), h0 = hog(B0), h1 = hog(b);
    function ayni(x) { return x ? 'aynı kaldı' : 'DEĞİŞTİ'; }
    $('bSonuc').textContent =
      'işlem: her piksel' + (carp > 1 ? ' × 2' : '') + (ek ? ' + 40' : '') + (carp === 1 && !ek ? ' olduğu gibi (değişiklik yok)' : '') + '\n' +
      'LBP kodu      ' + l0.ikili + ' = ' + l0.deger + '  →  ' + l1.ikili + ' = ' + l1.deger + '   ' + ayni(l0.deger === l1.deger) + '\n' +
      'HOG yön       ' + yaz(h0.yon) + '°  →  ' + yaz(h1.yon) + '°   ' + ayni(Math.abs(h0.yon - h1.yon) < 1e-9) + '\n' +
      'HOG büyüklük  ' + yaz(h0.buy) + '  →  ' + yaz(h1.buy) + '   ' + ayni(Math.abs(h0.buy - h1.buy) < 1e-9);
  }
  $('bEk').addEventListener('change', bCiz); $('bCarp').addEventListener('change', bCiz);
  bCiz();

  /* ---------- Q: LBP mi HOG mu? ---------- */
  var IFADE = [
    ['Dokuyu (yüzey desenini) yakalar.', 'L', 'Doku = LBP. HOG şekil ve kenar yapısını yakalar.'],
    ['Şekil ve kenar yapısını yakalar.', 'H', 'Şekil ve kenar = HOG. LBP dokuyu yakalar.'],
    ['Merkez piksel 8 komşusuyla karşılaştırılır.', 'L', 'Karşılaştırma (büyük/küçük) LBP\'nin işidir.'],
    ['Her pikselde gradyan büyüklüğü ve yönü hesaplanır.', 'H', 'Gradyan = HOG.'],
    ['Her piksel için 0–255 arası bir kod üretir.', 'L', '8 bit, 0–255: LBP kodu.'],
    ['Görüntü hücrelere bölünür (örneğin 8×8 piksel).', 'H', 'Hücre ve hücre başına yön histogramı HOG\'dur.'],
    ['Genelde 9 yön aralığı (kutu) kullanır.', 'H', '9 kutulu yön histogramı HOG\'dur. LBP histogramı 256 kutuludur.'],
    ['Histogramı 256 elemanlıdır.', 'L', '0–255 arası 256 değer: LBP.'],
    ['Bloklar halinde normalize edilir.', 'H', 'Blok normalizasyonu HOG\'un adımıdır; ışığa dayanıklılığı buradan gelir.'],
    ['Işık değişimine çok dayanıklıdır, çünkü yalnızca büyük/küçük ilişkisine bakar.', 'L', 'Büyük/küçük ilişkisi parlaklık değişse de bozulmaz: LBP.'],
    ['Daha hızlıdır, işlemleri basittir.', 'L', 'LBP sadece karşılaştırma yapar; HOG gradyan ve histogram hesabı ister.'],
    ['Binlerce boyutlu, büyük bir özellik vektörü üretir.', 'H', 'HOG vektörü büyüktür. LBP bölge başına 256 değer verir.'],
    ['Yüz tanıma ve doku sınıflandırmada kullanılır.', 'L', 'Yüz tanıma ve doku: LBP.'],
    ['Yaya tespiti ve nesne tespitinde kullanılır.', 'H', 'Yaya ve nesne tespiti: HOG.'],
    ['Elle tasarlanmış (klasik) bir öznitelik çıkarma yöntemidir.', 'I', 'İkisi de klasik öznitelik çıkarma yöntemidir.'],
    ['Sonucu histogram olarak verir.', 'I', 'LBP kod histogramı, HOG yön histogramı verir; ikisi de histogram.'],
    ['Yerel bölgelerden bilgi toplar, SVM gibi bir sınıflandırıcıyla kullanılır.', 'I', 'Bu, ikisinin ortak noktasıdır.'],
    ['Işığa dayanıklılığı orta düzeydedir.', 'H', 'HOG orta düzeyde; dayanıklılığı blok normalizasyonuna bağlı.']
  ];
  var AD = { L: 'LBP', H: 'HOG', I: 'İkisi de' };
  var sira = [], yer = 0, dogru = 0, toplam = 0, bitti = false;
  function karistir() { sira = IFADE.map(function (x, i) { return i; }); for (var i = sira.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = sira[i]; sira[i] = sira[j]; sira[j] = t; } yer = 0; }
  function secenekler(acik) { Array.prototype.forEach.call(document.querySelectorAll('#qSec button[data-c]'), function (b) { b.disabled = !acik; }); }
  function yeniSoru() {
    if (yer >= sira.length) karistir();
    bitti = false; $('qSoru').textContent = '"' + IFADE[sira[yer]][0] + '"';
    $('qSonuc').textContent = ''; $('qSonuc').className = 'sonuc'; secenekler(true);
  }
  function cevapla(c) {
    if (bitti) return;
    var x = IFADE[sira[yer]], ok = c === x[1], odak = document.activeElement;
    bitti = true; toplam++; if (ok) dogru++; yer++; secenekler(false);
    $('qSonuc').className = 'sonuc ' + (ok ? 'ok' : 'no');
    $('qSonuc').textContent = (ok ? 'Doğru: ' : 'Yanlış. Doğrusu: ') + AD[x[1]] + '. ' + x[2];
    $('qSkor').textContent = 'Doğru: ' + dogru + ' / ' + toplam; $('qBar').style.width = (dogru / toplam * 100) + '%';
    if (odak && odak.disabled) $('qYeni').focus(); /* odak kapanan düğmede kalmasın */
  }
  Array.prototype.forEach.call(document.querySelectorAll('#qSec button[data-c]'), function (b) { b.addEventListener('click', function () { cevapla(b.getAttribute('data-c')); }); });
  $('qYeni').addEventListener('click', yeniSoru);
  karistir(); yeniSoru();
})();
