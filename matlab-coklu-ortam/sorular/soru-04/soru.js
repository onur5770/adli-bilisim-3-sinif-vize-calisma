/* Soru 4 – Huffman kodlama: çözücü, adım adım uygulama, alıştırma, sınav cevabı.
   Sayfadaki bütün çözülmüş örnekler frekanslardan hesaplanır (elle yazılmış toplam yok). */
(function () {
  function $(id) { return document.getElementById(id); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  /* Huffman: en küçük iki düğümü birleştir. Eşitlikte listeye önce giren önce seçilir (kağıttaki cevap anahtarıyla aynı sıra).
     Küçük olan sola (0), büyük olan sağa (1) konur. */
  function coz(harfler) {
    var sira = 0, liste = harfler.map(function (h) { return { ad: h[0], f: h[1], sira: sira++, yaprak: true }; });
    var adimlar = [];
    function sirala() { liste.sort(function (a, b) { return a.f - b.f || a.sira - b.sira; }); }
    function etiket(n) { return (n.yaprak ? n.ad : '(' + n.ad + ')') + ':' + n.f; }
    sirala();
    var baslangic = liste.map(etiket).join('  ');
    while (liste.length > 1) {
      var a = liste.shift(), b = liste.shift();
      var n = { ad: a.ad + b.ad, f: a.f + b.f, sira: sira++, sol: a, sag: b };
      liste.push(n); sirala();
      adimlar.push({ a: etiket(a), b: etiket(b), toplam: n.f, kalan: liste.map(etiket).join('  '), kok: n });
    }
    var kok = liste[0], kodlar = {};
    (function gez(n, k) { if (n.yaprak) { kodlar[n.ad] = k || '0'; return; } gez(n.sol, k + '0'); gez(n.sag, k + '1'); })(kok, '');
    var toplamF = 0, huff = 0;
    harfler.forEach(function (h) { toplamF += h[1]; huff += h[1] * kodlar[h[0]].length; });
    var sabitBit = Math.max(1, Math.ceil(Math.log(harfler.length) / Math.LN2 - 1e-9));
    return { harfler: harfler, baslangic: baslangic, adimlar: adimlar, kok: kok, kodlar: kodlar, toplamF: toplamF, huff: huff, sabitBit: sabitBit, sabit: toplamF * sabitBit };
  }
  function adimMetni(c, kac) {
    var out = ['Başlangıç:  ' + c.baslangic, ''];
    c.adimlar.slice(0, kac == null ? c.adimlar.length : kac).forEach(function (s, i) {
      out.push((i + 1) + '. birleştirme:  ' + s.a + ' + ' + s.b + ' = ' + s.toplam);
      out.push('   Kalan liste:  ' + s.kalan + (i === c.adimlar.length - 1 ? '   (tek sayı kaldı, bitti)' : ''));
    });
    return out.join('\n');
  }
  function agacEl(kok) {
    function dugum(n, bit) {
      var li = el('li');
      if (bit != null) li.appendChild(el('span', 'dal', bit));
      var d = el('span', 'dugum' + (n.yaprak ? ' yaprak' : ''), n.yaprak ? n.ad + ':' + n.f : '(' + n.f + ')');
      li.appendChild(d);
      if (!n.yaprak) { var ul = el('ul'); ul.appendChild(dugum(n.sol, '0')); ul.appendChild(dugum(n.sag, '1')); li.appendChild(ul); }
      return li;
    }
    var ul = el('ul', 'agac'); ul.appendChild(dugum(kok, null)); return ul;
  }
  function tabloEl(c) {
    var sar = el('div', 'kaydir'), t = el('table', 't'), tb = el('tbody');
    function satir(h, hucreler) {
      var tr = el('tr');
      hucreler.forEach(function (x, i) { var td = el(h ? 'th' : 'td', i === 1 || i >= 3 ? 's' : null); if (i === 2 && !h && x) td.appendChild(el('code', null, x)); else td.textContent = x; tr.appendChild(td); });
      tb.appendChild(tr);
    }
    satir(true, ['Harf', 'Frekans', 'Kod', 'Uzunluk', 'Frekans × Uzunluk']);
    c.harfler.slice().sort(function (a, b) { return c.kodlar[a[0]].length - c.kodlar[b[0]].length || b[1] - a[1]; }).forEach(function (h) {
      var u = c.kodlar[h[0]].length;
      satir(false, [h[0], h[1], c.kodlar[h[0]], u, h[1] + ' × ' + u + ' = ' + h[1] * u]);
    });
    satir(true, ['Toplam', c.toplamF, '', '', c.huff + ' bit']);
    t.appendChild(tb); sar.appendChild(t); return sar;
  }
  function sonucEl(c) {
    var d = el('div', 'sonuc3');
    [['Sabit', c.toplamF + ' × ' + c.sabitBit + ' = ' + c.sabit + ' bit'], ['Huffman', c.huff + ' bit'], ['Tasarruf', c.sabit + ' − ' + c.huff + ' = ' + (c.sabit - c.huff) + ' bit']].forEach(function (x) {
      var s = el('span', null, x[0] + ': '); s.appendChild(el('b', null, x[1])); d.appendChild(s);
    });
    return d;
  }
  function koy(id) { var k = $(id); k.textContent = ''; for (var i = 1; i < arguments.length; i++) k.appendChild(arguments[i]); }

  /* ---------- Sayfadaki çözülmüş örnekler ---------- */
  var c1 = coz([['A', 10], ['B', 20], ['C', 30], ['D', 40]]);
  koy('fikirTablo', tabloEl(c1), sonucEl(c1));
  $('agacAdim1').textContent = adimMetni(c1);
  $('agacAdim2').textContent = adimMetni(coz([['A', 10], ['B', 12], ['C', 15], ['D', 20]]));
  var c3 = coz([['A', 5], ['B', 10], ['C', 20], ['D', 45]]);
  $('toplamAdim').textContent = adimMetni(c3); koy('toplamTablo', tabloEl(c3), sonucEl(c3));
  var c6 = coz([['A', 5], ['B', 9], ['C', 12], ['D', 13], ['E', 16], ['F', 45]]);
  $('altiAdim').textContent = adimMetni(c6); koy('altiAgac', agacEl(c6.kok)); koy('altiTablo', tabloEl(c6), sonucEl(c6));

  /* ---------- Sınav cevabı ---------- */
  var cs = coz([['A', 400], ['B', 1500], ['C', 700], ['D', 1600], ['E', 700], ['F', 900], ['G', 200], ['H', 2500]]);
  $('cAdim').textContent = adimMetni(cs); koy('cAgac', agacEl(cs.kok)); koy('cTablo', tabloEl(cs));
  var cson = $('cSonuc');
  cson.appendChild(el('b', 'bas', 'Cevap: ' + cs.sabit + ' bitten ' + cs.huff + ' bite düşer.'));
  cson.appendChild(sonucEl(cs));

  /* ---------- Uygulama ---------- */
  var harfler = cs.harfler.map(function (h) { return h.slice(); }), adim = 0, c;
  function girisKur() {
    var g = $('aGiris'); g.textContent = '';
    harfler.forEach(function (h, i) {
      var l = el('label', null, h[0] + ' '), inp = el('input'); inp.type = 'text'; inp.inputMode = 'numeric'; inp.value = h[1];
      inp.addEventListener('input', function () { var n = parseInt(inp.value, 10); harfler[i][1] = isFinite(n) && n > 0 ? n : 1; adim = 0; ciz(); });
      l.appendChild(inp); g.appendChild(l);
    });
  }
  function ciz() {
    c = coz(harfler);
    $('aAdim').textContent = adimMetni(c, adim);
    $('aSonraki').disabled = adim >= c.adimlar.length;
    var s = $('aSonuc'); s.textContent = '';
    if (adim > 0) s.appendChild(agacEl(c.adimlar[adim - 1].kok));
    if (adim >= c.adimlar.length) { s.appendChild(tabloEl(c)); s.appendChild(sonucEl(c)); }
  }
  function yukle(h) { harfler = h; adim = 0; girisKur(); ciz(); }
  function rastgele(n) {
    var h = [];
    for (var i = 0; i < n; i++) h.push([String.fromCharCode(65 + i), (1 + Math.floor(Math.random() * 30)) * 5]);
    return h;
  }
  Array.prototype.forEach.call(document.querySelectorAll('#aracA [data-f]'), function (b) {
    b.addEventListener('click', function () { yukle(b.getAttribute('data-f').split(' ').map(function (x) { return [x[0], +x.slice(1)]; })); });
  });
  $('aRastgele').addEventListener('click', function () { yukle(rastgele(5 + Math.floor(Math.random() * 4))); });
  $('aSonraki').addEventListener('click', function () { if (adim < c.adimlar.length) { adim++; ciz(); } });
  $('aHepsi').addEventListener('click', function () { adim = c.adimlar.length; ciz(); });
  $('aBasa').addEventListener('click', function () { adim = 0; ciz(); });
  girisKur(); ciz();

  /* ---------- Alıştırma ---------- */
  var q, dogru = 0, toplam = 0, bitti = false, hata = 0;
  function yeniSoru() {
    q = coz(rastgele(5 + Math.floor(Math.random() * 2))); bitti = false; hata = 0;
    $('qSoru').textContent = q.harfler.map(function (h) { return h[0] + '=' + h[1]; }).join('   ') + '\nHer harf ' + q.sabitBit + ' bit ile kodlanıyor. Huffman ile toplam kaç bit olur?';
    $('qCevap').value = ''; $('qSonuc').textContent = ''; $('qSonuc').className = 'sonuc'; $('qCozum').hidden = true; $('qKontrol').disabled = false;
  }
  function kontrol() {
    if (bitti) return;
    var ham = $('qCevap').value.replace(/bit/gi, '').replace(/\s+/g, ''), s = $('qSonuc');
    if (!ham) { s.className = 'sonuc'; s.textContent = 'Önce cevabını yaz.'; return; }
    if (/^\d{1,3}([.,]\d{3})+$/.test(ham)) ham = ham.replace(/[.,]/g, ''); /* 23.300 → 23300 */
    var v = Soru.sayiOku(ham);
    /* Okunamayan yazım deneme hakkı götürmez. */
    if (isNaN(v)) { s.className = 'sonuc no'; s.textContent = 'Bunu okuyamadım. Tek bir sayı yaz, örnek: 23300'; return; }
    var ok = v === q.huff;
    if (!ok && ++hata === 1) { s.className = 'sonuc no'; s.textContent = 'Yanlış. Bir hakkın daha var: her harfin kod uzunluğu × frekansını topla.'; return; }
    toplam++; if (ok && hata === 0) dogru++; bitti = true; $('qKontrol').disabled = true;
    $('qSonuc').textContent = ok ? 'Doğru: ' + q.huff + ' bit.' : 'Yanlış. Doğrusu ' + q.huff + ' bit.';
    $('qSonuc').className = 'sonuc ' + (ok ? 'ok' : 'no');
    var k = $('qCozum'); k.textContent = ''; var p = el('div', 'hesap', adimMetni(q)); k.appendChild(p); k.appendChild(agacEl(q.kok)); k.appendChild(tabloEl(q)); k.appendChild(sonucEl(q)); k.hidden = false;
    $('qSkor').textContent = 'Doğru: ' + dogru + ' / ' + toplam; $('qBar').style.width = (dogru / toplam * 100) + '%';
  }
  $('qKontrol').addEventListener('click', kontrol);
  $('qCevap').addEventListener('keydown', function (e) { if (e.key === 'Enter') { if (bitti) yeniSoru(); else kontrol(); } });
  $('qYeni').addEventListener('click', yeniSoru);
  yeniSoru();
})();
