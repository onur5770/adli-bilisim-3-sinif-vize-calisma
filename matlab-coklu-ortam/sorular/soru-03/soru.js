/* Soru 3 – Haar dalgacık: ağaç uygulaması, alıştırma, sınav çözümü. */
(function () {
  function $(id) { return document.getElementById(id); }
  /* Sayıyı kağıttaki gibi yazar: gereksiz sıfır yok, eksi işareti gerçek eksi. */
  function yaz(n) { var s = String(Math.round(n * 10000) / 10000); return s.replace('-', '−'); }
  function par(n) { return n < 0 ? '(' + yaz(n) + ')' : yaz(n); }
  function liste(d) { return d.map(yaz).join(', '); }

  /* Bir dizinin L'si ve H'si (tek seviye). */
  function bol(d) {
    var L = [], H = [];
    for (var i = 0; i + 1 < d.length; i += 2) { L.push((d[i] + d[i + 1]) / 2); H.push((d[i] - d[i + 1]) / 2); }
    return { L: L, H: H };
  }
  /* İsimden diziyi bulur: 'HHL' -> x'in H'sinin H'sinin L'si. */
  function dizi(x, ad) {
    var d = x;
    for (var i = 0; i < ad.length; i++) d = bol(d)[ad[i]];
    return d;
  }
  /* Bir dizinin hesabını satır satır yazar. */
  function hesapSatirlari(x, ad) {
    var ana = ad.slice(0, -1), kaynak = dizi(x, ana), harf = ad[ad.length - 1], out = [];
    var kaynakAd = ana || 'sinyal';
    out.push(ad + ' = ' + kaynakAd + ' dizisinin ' + (harf === 'L' ? 'ortalaması (topla, 2\'ye böl)' : 'farkı (ilk eksi ikinci, 2\'ye böl)'));
    out.push(kaynakAd + ' = ' + liste(kaynak));
    for (var i = 0; i + 1 < kaynak.length; i += 2) {
      var a = kaynak[i], b = kaynak[i + 1], s = harf === 'L' ? (a + b) / 2 : (a - b) / 2;
      out.push('  (' + par(a) + (harf === 'L' ? ' + ' : ' − ') + par(b) + ') / 2 = ' + yaz(s));
    }
    out.push(ad + ' = ' + liste(dizi(x, ad)));
    return out;
  }
  /* Hedef diziye giden yoldaki bütün ara dizileri sırayla yazar (kağıt düzeni). */
  function cozum(x, hedefler) {
    var gorulen = {}, sira = [];
    hedefler.forEach(function (h) { for (var i = 1; i <= h.length; i++) { var a = h.slice(0, i); if (!gorulen[a]) { gorulen[a] = 1; sira.push(a); } } });
    sira.sort(function (a, b) { return a.length - b.length; });
    var out = [], seviye = 0;
    sira.forEach(function (ad) {
      if (ad.length !== seviye) { seviye = ad.length; if (out.length) out.push(''); out.push(seviye + '. seviye'); }
      var ana = ad.slice(0, -1), kaynak = dizi(x, ana), harf = ad[ad.length - 1], par2 = [];
      for (var i = 0; i + 1 < kaynak.length; i += 2) par2.push('(' + par(kaynak[i]) + (harf === 'L' ? '+' : '−') + par(kaynak[i + 1]) + ')/2');
      out.push('  ' + (ad + '   ').slice(0, 4) + '= ' + par2.join(', ') + '  =  ' + liste(dizi(x, ad)));
    });
    return out.join('\n');
  }

  /* ---------- Uygulama: ağaç ---------- */
  var x = [8, 10, 16, 28, 32, 10, 16, 2], secili = 'L';
  var giris = $('aGiris');
  x.forEach(function (v, i) {
    if (i && i % 2 === 0) { var a = document.createElement('span'); a.className = 'ayrac'; giris.appendChild(a); }
    var inp = document.createElement('input'); inp.type = 'text'; inp.inputMode = 'decimal'; inp.value = v; inp.setAttribute('aria-label', (i + 1) + '. sayı');
    inp.addEventListener('input', function () { var n = parseFloat(inp.value.replace(',', '.')); x[i] = isFinite(n) ? n : 0; ciz(); });
    giris.appendChild(inp);
  });
  function tur() { return document.querySelector('input[name=aTur]:checked').value; }
  function dugum(ad) {
    var normalYok = tur() === 'normal' && ad.length > 1 && ad.slice(0, -1).indexOf('H') >= 0;
    var b = document.createElement('button'); b.type = 'button';
    b.className = 'dugum ' + (ad[ad.length - 1] === 'L' ? 'l' : 'h') + (ad === secili ? ' sec' : '') + (normalYok ? ' yok' : '');
    b.innerHTML = '<b>' + ad + '</b><span>' + liste(dizi(x, ad)) + '</span>';
    b.setAttribute('aria-pressed', ad === secili ? 'true' : 'false');
    b.addEventListener('click', function () { secili = ad; ciz(); });
    var li = document.createElement('li'); li.appendChild(b);
    if (normalYok && ad.length === 2) { var n = document.createElement('span'); n.className = 'ac'; n.textContent = 'normal dalgacıkta hesaplanmaz'; li.appendChild(n); }
    if (ad.length < 3) { var ul = document.createElement('ul'); ul.appendChild(dugum(ad + 'L')); ul.appendChild(dugum(ad + 'H')); li.appendChild(ul); }
    return li;
  }
  function ciz() {
    var kok = document.createElement('ul'); kok.className = 'agac';
    kok.appendChild(dugum('L')); kok.appendChild(dugum('H'));
    var k = $('aAgac'); k.textContent = ''; k.appendChild(kok);
    $('aHesap').textContent = hesapSatirlari(x, secili).join('\n');
    var top = x.reduce(function (a, b) { return a + b; }, 0);
    $('aSaglama').textContent = 'Sağlama: sekiz sayının toplamı ' + yaz(top) + ', ortalaması ' + yaz(top / 8) + '. LLL = ' + yaz(dizi(x, 'LLL')[0]) + '.';
  }
  function yukle(d) { d.forEach(function (v, i) { x[i] = v; }); Array.prototype.forEach.call(giris.querySelectorAll('input'), function (inp, i) { inp.value = x[i]; }); ciz(); }
  function rastgeleDizi() { var d = []; for (var i = 0; i < 8; i++) d.push(Math.floor(Math.random() * 16) * 2); return d; }
  Array.prototype.forEach.call(document.querySelectorAll('#aracA [data-dizi]'), function (b) {
    b.addEventListener('click', function () { yukle(b.getAttribute('data-dizi').split(' ').map(Number)); });
  });
  $('aRastgele').addEventListener('click', function () { yukle(rastgeleDizi()); });
  Array.prototype.forEach.call(document.querySelectorAll('input[name=aTur]'), function (r) { r.addEventListener('change', ciz); });
  ciz();

  /* ---------- Alıştırma ---------- */
  var ADLAR = ['L', 'H', 'LL', 'LH', 'HL', 'HH', 'LLL', 'LLH', 'LHL', 'LHH', 'HLL', 'HLH', 'HHL', 'HHH'];
  var qx, qad, dogru = 0, toplam = 0, bitti = false, hata = 0;
  function yeniSoru() {
    qx = rastgeleDizi(); qad = ADLAR[Math.floor(Math.random() * ADLAR.length)]; bitti = false; hata = 0;
    $('qSinyal').textContent = 'Sinyal: ' + qx.join('  ');
    $('qSoru').textContent = qad + ' dizisini bul (' + dizi(qx, qad).length + ' sayı).';
    $('qCevap').value = ''; $('qSonuc').textContent = ''; $('qSonuc').className = 'sonuc';
    $('qCozum').hidden = true; $('qKontrol').disabled = false;
  }
  function kontrol() {
    if (bitti) return;
    var ham = $('qCevap').value.trim(), s = $('qSonuc');
    if (!ham) { s.className = 'sonuc'; s.textContent = 'Önce cevabını yaz.'; return; }
    var beklenen = dizi(qx, qad), oku = Soru.sayilarOku(ham, beklenen.length);
    /* Okunamayan ya da eksik/fazla yazım deneme hakkı götürmez. */
    if (oku.hata) { s.className = 'sonuc no'; s.textContent = '"' + oku.hata + '" kısmını okuyamadım. Sayıları boşlukla ayır; -2.5, -2,5 ya da -5/2 yazabilirsin.'; return; }
    var verilen = oku.sayilar;
    if (verilen.length !== beklenen.length) { s.className = 'sonuc no'; s.textContent = beklenen.length + ' sayı bekleniyor, ' + verilen.length + ' sayı yazdın. Düzeltip tekrar dene.'; return; }
    var yanlis = verilen.filter(function (v, i) { return Math.abs(v - beklenen[i]) > 1e-9; }).length, ok = yanlis === 0;
    if (!ok && ++hata === 1) {
      s.className = 'sonuc no';
      s.textContent = 'Yanlış' + (beklenen.length > 1 ? ' (' + beklenen.length + ' sayıdan ' + yanlis + ' tanesi tutmuyor)' : '') + '. Bir hakkın daha var, düzeltip tekrar dene.';
      return;
    }
    toplam++; if (ok && hata === 0) dogru++;
    bitti = true; $('qKontrol').disabled = true;
    s.textContent = ok ? 'Doğru. ' + qad + ' = ' + liste(beklenen) : 'Yanlış. Doğrusu: ' + qad + ' = ' + liste(beklenen);
    s.className = 'sonuc ' + (ok ? 'ok' : 'no');
    $('qCozum').textContent = cozum(qx, [qad]); $('qCozum').hidden = false;
    $('qSkor').textContent = 'Doğru: ' + dogru + ' / ' + toplam; $('qBar').style.width = (dogru / toplam * 100) + '%';
  }
  $('qKontrol').addEventListener('click', kontrol);
  $('qCevap').addEventListener('keydown', function (e) { if (e.key === 'Enter') { if (bitti) yeniSoru(); else kontrol(); } });
  $('qYeni').addEventListener('click', yeniSoru);
  yeniSoru();

  /* ---------- Sınav cevabı ---------- */
  var sinav = [8, 10, 16, 28, 32, 10, 16, 2];
  $('cSinav').textContent = cozum(sinav, ['L', 'H', 'LL', 'LH', 'HL', 'HH', 'HHL']);
  var satir = [['L1', 'L'], ['L2', 'LL'], ['LH', 'LH'], ['HL', 'HL'], ['HHL', 'HHL']];
  $('cTablo').innerHTML = '<tr><th>İstenen</th><th>Cevap</th></tr>' + satir.map(function (s) {
    return '<tr><td>' + s[0] + (s[0] !== s[1] ? ' (' + s[1] + ')' : '') + '</td><td><strong>' + liste(dizi(sinav, s[1])) + '</strong></td></tr>';
  }).join('');
  $('cIki').textContent = cozum([24, 26, 16, 5, 6, 8, 23, 8], ['L', 'H', 'LL', 'LH', 'LHL', 'LHH']);
})();
