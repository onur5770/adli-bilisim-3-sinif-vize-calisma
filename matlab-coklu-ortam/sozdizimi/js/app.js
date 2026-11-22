/* app.js — MATLAB Çalışma Defteri arayüzü (vanilla JS, hash yönlendirme)
 * Bölümler: 1 yardımcılar · 2 veri · 3 kayıt (localStorage) · 4 ortak bileşenler · 5 editör
 *           6 alıştırma bileşeni · 7 figür/workspace · 8 sayfalar · 9 kabuk ve yönlendirici
 */
(function () {
  'use strict';

  /* ================= 1. Yardımcılar ================= */

  function h(etiket, ozellik) {
    var el = document.createElement(etiket);
    if (ozellik) {
      for (var k in ozellik) {
        if (!Object.prototype.hasOwnProperty.call(ozellik, k)) continue;
        var v = ozellik[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      }
    }
    for (var i = 2; i < arguments.length; i++) ekle(el, arguments[i]);
    return el;
  }

  function ekle(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { for (var i = 0; i < c.length; i++) ekle(el, c[i]); return; }
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function duzMetin(html) {
    var d = document.createElement('div');
    d.innerHTML = String(html == null ? '' : html);
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function kisalt(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; }

  function renklendir(kod) {
    try { if (window.Highlight) return window.Highlight.matlab(kod); } catch (e) { /* düz metne düş */ }
    return esc(kod);
  }

  function aramaNorm(s) {
    if (window.Kontrol && window.Kontrol.normMetin) return window.Kontrol.normMetin(s);
    return String(s || '').toLowerCase();
  }

  function karistir(dizi) {
    var a = dizi.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function tarihYaz(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    var iki = function (n) { return (n < 10 ? '0' : '') + n; };
    return iki(d.getDate()) + '.' + iki(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + iki(d.getHours()) + ':' + iki(d.getMinutes());
  }

  function yuzde(a, b) { return b > 0 ? Math.round(100 * a / b) : null; }
  function yuzdeYaz(a, b) { var y = yuzde(a, b); return y == null ? '—' : '%' + y; }

  var sayac = 0;
  function kimlik(on) { sayac++; return (on || 'k') + '-' + sayac; }

  function ikon(ad) {
    var yollar = {
      gunes: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      ay: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      kapat: '<path d="M6 6l12 12M18 6L6 18"/>',
      tik: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
      ok: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      geri: '<path d="M19 12H5M11 6l-6 6 6 6"/>'
    };
    return '<svg class="ikon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (yollar[ad] || '') + '</svg>';
  }

  /* ================= 2. Veri ================= */

  var KONU_SIRASI = ['konu-01', 'konu-02', 'konu-03', 'konu-04', 'konu-05', 'konu-06', 'konu-07', 'konu-08', 'konu-09',
    'konu-10', 'konu-11', 'konu-12', 'konu-13', 'hoca-kodu', 'kagit', 'yeni-plot', 'yeni-pencere', 'yeni-baska-kodlar'];

  function guvenliDizi(x) { return Array.isArray(x) ? x.filter(function (o) { return o && typeof o === 'object'; }) : []; }

  var KONULAR = (function () {
    var gorulen = {};
    var liste = guvenliDizi(window.KONULAR).filter(function (k) {
      if (!k.id || gorulen[k.id]) return false;
      gorulen[k.id] = true;
      if (!Array.isArray(k.bloklar)) k.bloklar = [];
      return true;
    });
    var sira = function (k) { var i = KONU_SIRASI.indexOf(k.id); return i < 0 ? 999 : i; };
    return liste.map(function (k, i) { return { k: k, i: i }; })
      .sort(function (a, b) { return sira(a.k) - sira(b.k) || a.i - b.i; })
      .map(function (x) { return x.k; });
  })();

  var ALISTIRMALAR = (function () {
    var gorulen = {};
    return guvenliDizi(window.ALISTIRMALAR).filter(function (a) {
      if (!a.id || !a.tur || gorulen[a.id]) return false;
      gorulen[a.id] = true;
      return true;
    });
  })();

  var KART = guvenliDizi(window.KART);

  var konuHarita = {}; KONULAR.forEach(function (k) { konuHarita[k.id] = k; });
  var alisHarita = {}; ALISTIRMALAR.forEach(function (a) { alisHarita[a.id] = a; });

  function konuAlistirmalari(konuId) {
    return ALISTIRMALAR.map(function (a, i) { return { a: a, i: i }; })
      .filter(function (x) { return x.a.konu === konuId; })
      .sort(function (x, y) { return (x.a.zorluk || 2) - (y.a.zorluk || 2) || x.i - y.i; })
      .map(function (x) { return x.a; });
  }

  function etiketli(a, e) { return Array.isArray(a.etiketler) && a.etiketler.indexOf(e) >= 0; }

  function konuEtiketi(k) {
    if (!k) return '';
    return (typeof k.no === 'number' && /^konu-/.test(k.id) ? k.no + '. ' : '') + (k.baslik || k.id);
  }

  function yorumlayiciSinifi() {
    var M = window.MiniMatlab;
    if (M && typeof M !== 'function' && typeof M.MiniMatlab === 'function') M = M.MiniMatlab;
    return typeof M === 'function' ? M : null;
  }

  /* ================= 3. Kayıt (localStorage) ================= */

  var ANAHTAR = 'matlab-calisma-v1';
  var durum = kayitOku();

  function bosDurum() {
    return { tema: null, tamamlananKonular: {}, alistirma: {}, yanlisHavuzu: [], sinavlar: [] };
  }

  function kayitOku() {
    var d = bosDurum();
    try {
      var v = JSON.parse(window.localStorage.getItem(ANAHTAR) || 'null');
      if (v && typeof v === 'object') {
        if (v.tema === 'acik' || v.tema === 'koyu') d.tema = v.tema;
        if (v.tamamlananKonular && typeof v.tamamlananKonular === 'object') d.tamamlananKonular = v.tamamlananKonular;
        if (v.alistirma && typeof v.alistirma === 'object') d.alistirma = v.alistirma;
        if (Array.isArray(v.yanlisHavuzu)) d.yanlisHavuzu = v.yanlisHavuzu.filter(function (x) { return typeof x === 'string'; });
        if (Array.isArray(v.sinavlar)) d.sinavlar = v.sinavlar.filter(function (x) { return x && typeof x === 'object'; });
        if (typeof v.sonKonu === 'string') d.sonKonu = v.sonKonu;
        if (typeof v.uygulamaKod === 'string') d.uygulamaKod = v.uygulamaKod;
      }
    } catch (e) { /* bozuk ya da erişilemeyen kayıt: boş başla */ }
    return d;
  }

  function kayitYaz() {
    try { window.localStorage.setItem(ANAHTAR, JSON.stringify(durum)); } catch (e) { /* özel pencere vb.: yalnızca bellekte */ }
  }

  function alistirmaKaydet(id, dogru, mod) {
    var k = durum.alistirma[id] || { deneme: 0, dogru: false, dogruDeneme: 0 };
    k.deneme = (k.deneme || 0) + 1;
    k.dogruDeneme = (k.dogruDeneme || 0) + (dogru ? 1 : 0);
    k.dogru = !!dogru;
    k.sonTarih = new Date().toISOString();
    durum.alistirma[id] = k;
    var i = durum.yanlisHavuzu.indexOf(id);
    if (!dogru && i < 0) durum.yanlisHavuzu.push(id);
    if (dogru && i >= 0 && mod === 'yanlislar') durum.yanlisHavuzu.splice(i, 1);
    kayitYaz();
  }

  function yanlisHavuzu() { return durum.yanlisHavuzu.filter(function (id) { return alisHarita[id]; }); }

  function konuIstatistik(konuId) {
    var liste = konuAlistirmalari(konuId);
    var s = { toplam: liste.length, cozulen: 0, deneme: 0, dogruDeneme: 0 };
    liste.forEach(function (a) {
      var k = durum.alistirma[a.id];
      if (!k) return;
      if (k.dogru) s.cozulen++;
      s.deneme += k.deneme || 0;
      s.dogruDeneme += k.dogruDeneme != null ? k.dogruDeneme : (k.dogru ? 1 : 0);
    });
    return s;
  }

  function genelIstatistik() {
    var s = { konu: KONULAR.length, tamam: 0, toplam: ALISTIRMALAR.length, cozulen: 0, deneme: 0, dogruDeneme: 0 };
    KONULAR.forEach(function (k) { if (durum.tamamlananKonular[k.id]) s.tamam++; });
    ALISTIRMALAR.forEach(function (a) {
      var k = durum.alistirma[a.id];
      if (!k) return;
      if (k.dogru) s.cozulen++;
      s.deneme += k.deneme || 0;
      s.dogruDeneme += k.dogruDeneme != null ? k.dogruDeneme : (k.dogru ? 1 : 0);
    });
    return s;
  }

  /* ----- tema ----- */

  function koyuMu() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t === 'dark';
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function temaUygula() {
    if (durum.tema) document.documentElement.setAttribute('data-theme', durum.tema === 'koyu' ? 'dark' : 'light');
    else document.documentElement.removeAttribute('data-theme');
  }

  /* ================= 4. Ortak bileşenler ================= */

  function rozet(metin, tur) { return h('span', { class: 'rozet rozet-' + (tur || 'notr') }, metin); }
  function yeniRozet(uzun) { return rozet(uzun ? 'Yeni · henüz pratik yapılmadı' : 'Yeni', 'yeni'); }

  function bosDurumKutusu(baslik, aciklama) {
    return h('div', { class: 'bos' }, h('p', { class: 'bos-baslik' }, baslik), aciklama ? h('p', { html: aciklama }) : null);
  }

  /* html içine gömülü <pre> bloklarını da renklendirir */
  function icerik(html, sinif) {
    var d = h('div', { class: sinif || 'metin', html: String(html == null ? '' : html) });
    var preler = d.querySelectorAll('pre');
    for (var i = 0; i < preler.length; i++) {
      var p = preler[i];
      if (p.querySelector('span')) continue;
      p.classList.add('kod');
      p.innerHTML = renklendir(p.textContent);
    }
    return d;
  }

  var HTML_IZI = /<\/?(code|p|br|strong|em|ul|ol|li|pre|span|b|i|div|kbd|sub|sup|a|table)\b[^>]*>/i;

  /* hata bloklarında 'yanlis' / 'dogru' alanı html de olabilir, çıplak kod da */
  function htmlVeyaKod(s) {
    s = String(s == null ? '' : s);
    if (HTML_IZI.test(s)) return icerik(s);
    return h('pre', { class: 'kod', html: renklendir(s) });
  }

  function uygulamadaAc(kod) {
    Uyg.kod = String(kod || '');
    Uyg.duyuru = 'Kod editöre taşındı. Çalıştırmak için “Çalıştır” düğmesine ya da Ctrl+Enter’a bas.';
    durum.uygulamaKod = Uyg.kod; kayitYaz();
    if (location.hash === '#/uygulama') ciz(); else location.hash = '#/uygulama';
  }

  function kodBlok(kod, sec) {
    sec = sec || {};
    var kutu = h('div', { class: 'kodblok' });
    kutu.appendChild(h('pre', { class: 'kod', tabindex: '0', 'aria-label': 'MATLAB kodu', html: renklendir(kod) }));
    if (sec.cikti != null && String(sec.cikti) !== '') {
      kutu.appendChild(h('div', { class: 'cikti' },
        h('span', { class: 'cikti-etiket' }, 'Ekranda görünen'),
        h('pre', { tabindex: '0', text: String(sec.cikti) })));
    }
    if (sec.calistir) {
      kutu.appendChild(h('div', { class: 'kodblok-alt' },
        h('button', { type: 'button', class: 'dugme dugme-kucuk', onclick: function () { uygulamadaAc(kod); } }, 'Uygulama alanında dene')));
    }
    return kutu;
  }

  function ilerlemeCubugu(deger, toplam, etiket) {
    var y = toplam > 0 ? Math.round(100 * deger / toplam) : 0;
    return h('span', { class: 'cubuk', role: 'img', 'aria-label': (etiket || 'İlerleme') + ': ' + deger + ' / ' + toplam },
      h('span', { class: 'cubuk-dolu', style: 'width:' + y + '%' }));
  }

  /* sayfa içi onay kutusu (alert/confirm yerine) */
  function onayKutusu(metin, onayEtiket, onay) {
    var kutu = h('div', { class: 'onay', role: 'alertdialog', 'aria-label': 'Onay' });
    var evet = h('button', { type: 'button', class: 'dugme dugme-tehlike', onclick: function () { kutu.remove(); onay(); } }, onayEtiket);
    var hayir = h('button', { type: 'button', class: 'dugme', onclick: function () { kutu.remove(); } }, 'Vazgeç');
    ekle(kutu, [h('p', null, metin), h('div', { class: 'dugmeler' }, evet, hayir)]);
    setTimeout(function () { hayir.focus(); }, 0);
    return kutu;
  }

  /* ================= 5. Editör ================= */

  function editorOlustur(sec) {
    sec = sec || {};
    var ipucuId = kimlik('ed-ipucu');
    var ta = h('textarea', {
      class: 'ed-ta', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', wrap: 'off',
      'aria-label': sec.etiket || 'MATLAB kodu', 'aria-describedby': ipucuId
    });
    var pre = h('pre', { class: 'ed-hl', 'aria-hidden': 'true' });
    var no = h('div', { class: 'ed-no', 'aria-hidden': 'true' });
    var kok = h('div', { class: 'editor' + (sec.kucuk ? ' editor-kucuk' : '') },
      h('div', { class: 'ed-kaydir' }, no, h('div', { class: 'ed-yigin' }, pre, ta)),
      h('p', { class: 'gizli', id: ipucuId }, 'Tab girinti ekler. Editörden klavyeyle çıkmak için önce Esc, sonra Tab. Ctrl+Enter kodu çalıştırır.'));
    var tabSerbest = false;

    function boya() {
      var v = ta.value;
      pre.innerHTML = renklendir(v) + '\n';
      var n = v.split('\n').length, s = '';
      for (var i = 1; i <= n; i++) s += (i > 1 ? '\n' : '') + i;
      no.textContent = s;
      if (sec.onDegis) sec.onDegis(v);
    }

    function yaz(metin) {
      var ok = false;
      try { ok = document.execCommand('insertText', false, metin); } catch (e) { ok = false; }
      if (!ok) ta.setRangeText(metin, ta.selectionStart, ta.selectionEnd, 'end');
      boya();
    }

    function girinti(geri) {
      var v = ta.value, a = ta.selectionStart, b = ta.selectionEnd;
      if (!geri && a === b) { yaz('    '); return; }
      var bas = v.lastIndexOf('\n', a - 1) + 1;
      var son = v.indexOf('\n', b > a && v[b - 1] === '\n' ? b - 1 : b);
      if (son < 0) son = v.length;
      var satirlar = v.slice(bas, son).split('\n');
      var yeni = satirlar.map(function (s) { return geri ? s.replace(/^( {1,4}|\t)/, '') : '    ' + s; }).join('\n');
      ta.setSelectionRange(bas, son);
      yaz(yeni);
      ta.setSelectionRange(bas, bas + yeni.length);
    }

    ta.addEventListener('input', boya);
    ta.addEventListener('blur', function () { tabSerbest = false; });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { tabSerbest = true; return; }
      if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (tabSerbest) return;
        e.preventDefault(); girinti(e.shiftKey); return;
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (sec.onCalistir) sec.onCalistir();
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
        var v = ta.value, a = ta.selectionStart;
        var bas = v.lastIndexOf('\n', a - 1) + 1;
        var bosluk = /^[ \t]*/.exec(v.slice(bas, a))[0];
        if (bosluk) { e.preventDefault(); yaz('\n' + bosluk); }
      }
      if (e.key !== 'Shift') tabSerbest = false;
    });

    ta.value = sec.deger || '';
    boya();

    return {
      el: kok,
      deger: function () { return ta.value; },
      ayarla: function (v) { ta.value = String(v == null ? '' : v); boya(); },
      odak: function () { ta.focus(); }
    };
  }

  /* ================= 6. Alıştırma bileşeni ================= */

  var TUR_ADI = {
    'coktan-secmeli': 'Çoktan seçmeli', 'cikti-tahmin': 'Çıktıyı tahmin et', 'kisa-cevap': 'Kısa cevap',
    'bosluk-doldur': 'Boşluk doldur', 'kod-yaz': 'Kod yaz', 'hata-bul': 'Hatayı bul ve düzelt'
  };
  var ZORLUK_ADI = { 1: 'Kolay', 2: 'Orta', 3: 'Zor' };

  function zorlukGosterge(z) {
    z = [1, 2, 3].indexOf(z) >= 0 ? z : 2;
    var s = h('span', { class: 'zorluk', role: 'img', 'aria-label': 'Zorluk: ' + ZORLUK_ADI[z] });
    for (var i = 1; i <= 3; i++) s.appendChild(h('span', { class: 'zorluk-nokta' + (i <= z ? ' dolu' : '') }));
    s.appendChild(h('span', { class: 'zorluk-ad' }, ZORLUK_ADI[z]));
    return s;
  }

  function etiketRozetleri(a) {
    var r = [];
    if (etiketli(a, 'sohbet')) r.push(rozet('Sohbetten', 'notr'));
    if (etiketli(a, 'hata-odakli')) r.push(rozet('Hata odaklı', 'hata'));
    if (etiketli(a, 'yeni')) r.push(yeniRozet());
    return r;
  }

  function durumRozeti(id) {
    var k = durum.alistirma[id];
    if (!k) return null;
    return k.dogru ? rozet('Çözüldü', 'olumlu') : rozet('Son deneme yanlış', 'hata');
  }

  function ciktiKutusu(r) {
    var kutu = h('div', { class: 'mini-cikti' });
    kutu.appendChild(h('span', { class: 'cikti-etiket' }, 'Command Window'));
    var cikti = r && r.output != null ? String(r.output) : '';
    if (cikti.trim()) kutu.appendChild(h('pre', { tabindex: '0', text: cikti.replace(/\n+$/, '') }));
    if (r && r.error) kutu.appendChild(hataSatiri(r.error));
    if (!cikti.trim() && !(r && r.error)) kutu.appendChild(h('p', { class: 'soluk' }, 'Kod çalıştı; ekrana bir şey yazdırmadı.'));
    if (r && Array.isArray(r.figures) && r.figures.length) kutu.appendChild(figurleriCiz(r.figures));
    return kutu;
  }

  function hataSatiri(err) {
    return h('div', { class: 'cw-hata' },
      h('div', { class: 'cw-hata-ing' }, (err.message || 'Error') + (err.line != null ? '  (satır ' + err.line + ')' : '')),
      err.mesajTr ? h('div', { class: 'cw-hata-tr' }, err.mesajTr) : null);
  }

  /* sec: { mod: 'yanlislar'|..., onIlk(dogru), baslikSeviye } */
  function alistirmaBilesen(a, sec) {
    sec = sec || {};
    var deneme = 0, ipucuSayisi = 0;
    var ipuclari = Array.isArray(a.ipuclari) ? a.ipuclari : [];
    var kodTuru = a.tur === 'kod-yaz' || a.tur === 'hata-bul';
    var kok = h('article', { class: 'alis', 'data-id': a.id });

    var durumYeri = h('span', { class: 'alis-durum' }, durumRozeti(a.id));
    kok.appendChild(h('header', { class: 'alis-ust' },
      h('span', { class: 'alis-tur' }, TUR_ADI[a.tur] || a.tur), zorlukGosterge(a.zorluk),
      h('span', { class: 'alis-rozetler' }, etiketRozetleri(a), durumYeri)));

    kok.appendChild(icerik(a.soru, 'alis-soru metin'));
    if (a.kod && a.tur !== 'bosluk-doldur') kok.appendChild(kodBlok(a.kod));

    var geri = h('div', { class: 'alis-geri', role: 'status', 'aria-live': 'polite' });
    var ipucuListe = h('ol', { class: 'alis-ipuclari', 'aria-label': 'İpuçları' });
    var cozumYeri = h('div', { class: 'alis-cozum' });
    var calismaYeri = kodTuru ? h('div', { class: 'alis-calisma', 'aria-live': 'polite' }) : null;
    var cevapAl, isaretle = function () {}, editor = null;

    /* ----- türe göre giriş ----- */
    var giris = h('div', { class: 'alis-giris' });
    if (a.tur === 'coktan-secmeli') {
      var grupAdi = kimlik('sec');
      var secenekler = Array.isArray(a.secenekler) ? a.secenekler : [];
      var alan = h('fieldset', { class: 'secenekler' }, h('legend', { class: 'gizli' }, 'Seçenekler'));
      var kutular = secenekler.map(function (s, i) {
        var radyo = h('input', { type: 'radio', name: grupAdi, value: String(i) });
        var etiket = h('label', { class: 'secenek' }, radyo, h('span', { class: 'secenek-harf', 'aria-hidden': 'true' }, String.fromCharCode(65 + i)), h('span', { class: 'secenek-metin', html: s }));
        radyo.addEventListener('change', function () { kutular.forEach(function (k) { k.etiket.classList.remove('dogru', 'yanlis'); }); });
        alan.appendChild(etiket);
        return { radyo: radyo, etiket: etiket };
      });
      giris.appendChild(alan);
      cevapAl = function () { for (var i = 0; i < kutular.length; i++) if (kutular[i].radyo.checked) return i; return null; };
      isaretle = function (r, cevap) { if (kutular[cevap]) kutular[cevap].etiket.classList.add(r.dogru ? 'dogru' : 'yanlis'); };
    } else if (a.tur === 'cikti-tahmin' || a.tur === 'kisa-cevap') {
      var cokSatir = a.tur === 'cikti-tahmin' && /[;\n]/.test(String(a.beklenen || ''));
      var gid = kimlik('cevap');
      var kutu = cokSatir
        ? h('textarea', { id: gid, class: 'girdi girdi-kod', rows: '3', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', placeholder: 'Örn: 1 2; 3 4' })
        : h('input', { id: gid, class: 'girdi girdi-kod', type: 'text', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off' });
      kutu.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && (!cokSatir || e.ctrlKey || e.metaKey)) { e.preventDefault(); kontrol(); }
      });
      ekle(giris, [h('label', { class: 'girdi-etiket', for: gid }, a.tur === 'cikti-tahmin' ? 'Ekranda ne görünür?' : 'Cevabın'), kutu,
        cokSatir ? h('p', { class: 'soluk kucuk' }, 'Matrisi satır satır ya da tek satırda yazabilirsin; köşeli parantez ve noktalı virgül isteğe bağlı.') : null]);
      cevapAl = function () { return kutu.value; };
    } else if (a.tur === 'bosluk-doldur') {
      var IM = '';
      var parcali = String(a.kod || '').replace(/_{3,}/g, IM);
      var html = renklendir(parcali);
      var bosluklar = Array.isArray(a.bosluklar) ? a.bosluklar : [];
      var bi = 0;
      html = html.replace(//g, function () {
        var kabul = Array.isArray(bosluklar[bi]) ? bosluklar[bi] : [];
        var uz = kabul.reduce(function (m, k) { return Math.max(m, String(k).length); }, 0);
        bi++;
        return '<input class="bosluk" type="text" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="' + bi + '. boşluk" style="width:' + Math.max(5, Math.min(24, uz + 3)) + 'ch">';
      });
      var pre = h('pre', { class: 'kod kod-bosluklu', html: html });
      var girdiler = Array.prototype.slice.call(pre.querySelectorAll('input.bosluk'));
      girdiler.forEach(function (g) {
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); kontrol(); } });
        g.addEventListener('input', function () { g.classList.remove('dogru', 'yanlis'); });
      });
      giris.appendChild(h('div', { class: 'kodblok' }, pre));
      cevapAl = function () { return girdiler.map(function (g) { return g.value; }); };
      isaretle = function (r) {
        var y = (r.ayrinti && r.ayrinti.yanlisBosluklar) || [];
        girdiler.forEach(function (g, i) { g.classList.remove('dogru', 'yanlis'); g.classList.add(y.indexOf(i) >= 0 ? 'yanlis' : 'dogru'); });
      };
    } else if (kodTuru) {
      editor = editorOlustur({ deger: a.baslangicKod || '', kucuk: true, etiket: 'Kodunu buraya yaz', onCalistir: function () { calistir(); } });
      giris.appendChild(editor.el);
      cevapAl = function () { return editor.deger(); };
    } else {
      giris.appendChild(h('p', { class: 'soluk' }, 'Bu alıştırma türü tanınmıyor.'));
      cevapAl = function () { return null; };
    }
    kok.appendChild(giris);

    /* ----- eylemler ----- */
    var kontrolDugme = h('button', { type: 'button', class: 'dugme dugme-ana', onclick: function () { kontrol(); } }, 'Kontrol et');
    var ipucuDugme = h('button', { type: 'button', class: 'dugme', onclick: function () { ipucuAc(true); } }, 'İpucu al');
    var cozumDugme = h('button', { type: 'button', class: 'dugme', disabled: true, 'aria-expanded': 'false', title: 'En az bir denemeden sonra açılır', onclick: function () { cozumGoster(); } }, 'Çözümü göster');
    var dugmeler = h('div', { class: 'dugmeler alis-eylem' });
    if (kodTuru) {
      dugmeler.appendChild(h('button', { type: 'button', class: 'dugme', onclick: function () { calistir(); } }, 'Çalıştır'));
    }
    ekle(dugmeler, [kontrolDugme, ipuclari.length ? ipucuDugme : null, cozumDugme]);
    if (kodTuru && a.baslangicKod != null) {
      dugmeler.appendChild(h('button', { type: 'button', class: 'dugme dugme-yazi', onclick: function () { editor.ayarla(a.baslangicKod || ''); editor.odak(); } }, 'Başlangıç koduna dön'));
    }
    ekle(kok, [dugmeler, geri, calismaYeri, ipucuListe, cozumYeri]);

    function mesaj(tur, html) {
      geri.className = 'alis-geri ' + tur;
      geri.innerHTML = '';
      var bas = tur === 'dogru' ? 'Doğru' : tur === 'yanlis' ? 'Yanlış' : '';
      if (bas) geri.appendChild(h('strong', { class: 'geri-bas' }, bas));
      /* başlık zaten 'Doğru' / 'Yanlış' diyor; metnin başındaki tekrarı at */
      html = String(html == null ? '' : html).replace(/^\s*(Doğru|Yanlış)\s*[.!:]\s*/i, '');
      if (html) html = html.charAt(0).toLocaleUpperCase('tr') + html.slice(1);
      geri.appendChild(h('div', { class: 'geri-metin', html: html }));
    }

    function ipucuAc(elle) {
      if (ipucuSayisi >= ipuclari.length) return;
      ipucuListe.appendChild(h('li', { class: 'ipucu-madde' }, h('span', { class: 'ipucu-no' }, 'İpucu ' + (ipucuSayisi + 1)), icerik(ipuclari[ipucuSayisi], 'metin')));
      ipucuSayisi++;
      if (ipucuSayisi >= ipuclari.length) { ipucuDugme.disabled = true; ipucuDugme.textContent = 'İpuçları bitti'; }
      else ipucuDugme.textContent = 'Sıradaki ipucu (' + (ipuclari.length - ipucuSayisi) + ')';
      if (elle && ipucuListe.lastChild && ipucuListe.lastChild.scrollIntoView) ipucuListe.lastChild.scrollIntoView({ block: 'nearest' });
    }

    function cozumGoster() {
      if (cozumYeri.firstChild) { cozumYeri.innerHTML = ''; cozumDugme.textContent = 'Çözümü göster'; cozumDugme.setAttribute('aria-expanded', 'false'); return; }
      cozumYeri.appendChild(cozumIcerik(a));
      cozumDugme.textContent = 'Çözümü gizle';
      cozumDugme.setAttribute('aria-expanded', 'true');
    }

    function calistir() {
      if (!calismaYeri) return;
      var K = window.Kontrol;
      calismaYeri.innerHTML = '';
      calismaYeri.appendChild(h('p', { class: 'soluk' }, 'Çalışıyor…'));
      setTimeout(function () {
        calismaYeri.innerHTML = '';
        var c = K && K.calistir ? K.calistir(a.onKod, editor.deger()) : { yok: true };
        if (c.yok) { calismaYeri.appendChild(h('p', { class: 'cw-hata' }, 'Yorumlayıcı (js/matlab.js) yüklenemedi; kod çalıştırılamıyor.')); return; }
        if (c.onHata) { calismaYeri.appendChild(h('p', { class: 'cw-hata' }, 'Sorunun hazırlık kodu çalışmadı: ' + (c.onHata.message || ''))); return; }
        calismaYeri.appendChild(ciktiKutusu(c.sonuc));
      }, 30);
    }

    function kontrol() {
      var K = window.Kontrol;
      if (!K) { mesaj('bilgi', 'Kontrol modülü (js/kontrol.js) yüklenemedi.'); return; }
      var cevap = cevapAl();
      var bitir = function () {
        var r = K.kontrolEt(a, cevap);
        kontrolDugme.disabled = false;
        if (r.ayrinti && (r.ayrinti.bos || r.ayrinti.sistem)) { mesaj('bilgi', r.mesaj); return; }
        deneme++;
        alistirmaKaydet(a.id, r.dogru, sec.mod);
        isaretle(r, cevap);
        mesaj(r.dogru ? 'dogru' : 'yanlis', r.mesaj);
        if (kodTuru && r.ayrinti && calismaYeri) {
          calismaYeri.innerHTML = '';
          calismaYeri.appendChild(ciktiKutusu({ output: r.ayrinti.cikti, error: null, figures: r.ayrinti.figurler }));
        }
        if (!r.dogru) ipucuAc(false);
        cozumDugme.disabled = false; cozumDugme.removeAttribute('title');
        durumYeri.innerHTML = ''; ekle(durumYeri, durumRozeti(a.id));
        if (deneme === 1 && sec.onIlk) sec.onIlk(r.dogru);
        if (sec.onHer) sec.onHer(r.dogru);
      };
      if (kodTuru) {
        kontrolDugme.disabled = true;
        mesaj('bilgi', 'Çalışıyor…');
        setTimeout(bitir, 30);
      } else bitir();
    }

    return kok;
  }

  function cozumIcerik(a) {
    var kutu = h('div', { class: 'cozum-kutu' }, h('span', { class: 'kutu-etiket' }, 'Çözüm'));
    if (a.tur === 'coktan-secmeli' && Array.isArray(a.secenekler) && a.secenekler[a.dogru] != null) {
      kutu.appendChild(h('p', { class: 'cozum-cevap' }, 'Doğru seçenek: ', h('strong', null, String.fromCharCode(65 + a.dogru)), ' — ', h('span', { html: a.secenekler[a.dogru] })));
    } else if (a.tur === 'cikti-tahmin' && a.beklenen != null) {
      kutu.appendChild(h('div', { class: 'cozum-cevap' }, 'Beklenen cevap: ', h('code', null, String(a.beklenen))));
    } else if (a.tur === 'kisa-cevap' && Array.isArray(a.kabul) && a.kabul.length) {
      kutu.appendChild(h('div', { class: 'cozum-cevap' }, 'Kabul edilen cevap: ', h('code', null, String(a.kabul[0]))));
    } else if (a.tur === 'bosluk-doldur' && Array.isArray(a.bosluklar)) {
      var i = 0;
      var dolu = String(a.kod || '').replace(/_{3,}/g, function () { var b = a.bosluklar[i++]; return Array.isArray(b) && b.length ? String(b[0]) : '___'; });
      kutu.appendChild(kodBlok(dolu));
    }
    if (a.cozumKod) kutu.appendChild(kodBlok(a.cozumKod, { calistir: true }));
    kutu.appendChild(icerik(a.cozum || ''));
    return kutu;
  }

  /* kapalı satır: tıklanınca bileşen kurulur (uzun listeler için) */
  function alistirmaSatiri(a, sec) {
    var kuruldu = false;
    var govde = h('div', { class: 'alis-kapali-govde' });
    var k = konuHarita[a.konu];
    var d = h('details', { class: 'alis-kapali' },
      h('summary', null,
        h('span', { class: 'alis-kapali-soru' }, kisalt(duzMetin(a.soru), 110)),
        h('span', { class: 'alis-kapali-meta' }, k && !(sec && sec.konusuz) ? h('span', { class: 'soluk' }, konuEtiketi(k)) : null,
          h('span', { class: 'soluk' }, TUR_ADI[a.tur] || a.tur), zorlukGosterge(a.zorluk), durumRozeti(a.id))),
      govde);
    d.addEventListener('toggle', function () {
      if (d.open && !kuruldu) { kuruldu = true; govde.appendChild(alistirmaBilesen(a, sec)); }
    });
    return d;
  }

  /* ================= 7. Figürler ve Workspace ================= */

  function goruntuCiz(ax) {
    var w = Math.max(1, ax.width | 0), ht = Math.max(1, ax.height | 0);
    var c = h('canvas', { class: 'fig-goruntu', width: String(w), height: String(ht), role: 'img', 'aria-label': 'Gri tonlamalı görüntü, ' + ht + ' satır × ' + w + ' sütun' });
    c.style.width = Math.max(w, 180) + 'px';
    c.style.aspectRatio = w + ' / ' + ht;
    try {
      var ctx = c.getContext('2d');
      var img = ctx.createImageData(w, ht);
      var g = ax.gray || [];
      for (var i = 0, n = w * ht; i < n; i++) {
        var v = g[i]; v = v == null || isNaN(v) ? 0 : v < 0 ? 0 : v > 255 ? 255 : v;
        if (ax.rgb && ax.rgb.length >= n * 3) { img.data[i * 4] = ax.rgb[i * 3]; img.data[i * 4 + 1] = ax.rgb[i * 3 + 1]; img.data[i * 4 + 2] = ax.rgb[i * 3 + 2]; }
        else { img.data[i * 4] = v; img.data[i * 4 + 1] = v; img.data[i * 4 + 2] = v; }
        img.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    } catch (e) { /* canvas yoksa boş kalır */ }
    return c;
  }

  function guzelAralik(min, max, adet) {
    if (!isFinite(min) || !isFinite(max)) { min = 0; max = 1; }
    if (min === max) { min -= 1; max += 1; }
    var ham = (max - min) / Math.max(1, adet);
    var us = Math.pow(10, Math.floor(Math.log(ham) / Math.LN10));
    var oran = ham / us;
    var adim = (oran <= 1 ? 1 : oran <= 2 ? 2 : oran <= 5 ? 5 : 10) * us;
    var a = Math.floor(min / adim) * adim, b = Math.ceil(max / adim) * adim;
    var t = [];
    for (var v = a; v <= b + adim * 1e-6; v += adim) t.push(Math.abs(v) < adim * 1e-9 ? 0 : +v.toPrecision(12));
    return { min: a, max: b, isaretler: t };
  }

  function grafikCiz(ax) {
    var seriler = (Array.isArray(ax.series) ? ax.series : []).map(function (s) {
      var y = Array.isArray(s && s.y) ? s.y : [];
      var x = Array.isArray(s && s.x) && s.x.length === y.length ? s.x : y.map(function (_, i) { return i + 1; });
      var nok = [];
      for (var i = 0; i < y.length; i++) if (isFinite(x[i]) && isFinite(y[i])) nok.push([Number(x[i]), Number(y[i])]);
      return nok;
    }).filter(function (n) { return n.length; });
    var W = 380, H = 260, sol = 46, sag = 14, ust = 12, alt = 30;
    var svg = '<svg class="fig-grafik" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Çizgi grafiği' + (ax.title ? ': ' + esc(ax.title) : '') + '">';
    if (!seriler.length) {
      svg += '<text class="g-yazi" x="' + W / 2 + '" y="' + H / 2 + '" text-anchor="middle">Çizilecek veri yok</text></svg>';
      return h('div', { class: 'fig-grafik-kap', html: svg });
    }
    var xs = [], ys = [];
    seriler.forEach(function (n) { n.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
    var X = guzelAralik(Math.min.apply(null, xs), Math.max.apply(null, xs), 6);
    var Y = guzelAralik(Math.min.apply(null, ys), Math.max.apply(null, ys), 5);
    var px = function (x) { return sol + (x - X.min) / (X.max - X.min) * (W - sol - sag); };
    var py = function (y) { return H - alt - (y - Y.min) / (Y.max - Y.min) * (H - ust - alt); };
    var yaz = function (v) { return String(+v.toPrecision(6)); };
    Y.isaretler.forEach(function (t) {
      svg += '<line class="g-izgara" x1="' + sol + '" x2="' + (W - sag) + '" y1="' + py(t).toFixed(1) + '" y2="' + py(t).toFixed(1) + '"/>';
      svg += '<text class="g-yazi" x="' + (sol - 6) + '" y="' + (py(t) + 4).toFixed(1) + '" text-anchor="end">' + yaz(t) + '</text>';
    });
    X.isaretler.forEach(function (t) {
      svg += '<line class="g-eksen" x1="' + px(t).toFixed(1) + '" x2="' + px(t).toFixed(1) + '" y1="' + (H - alt) + '" y2="' + (H - alt + 4) + '"/>';
      svg += '<text class="g-yazi" x="' + px(t).toFixed(1) + '" y="' + (H - alt + 17) + '" text-anchor="middle">' + yaz(t) + '</text>';
    });
    svg += '<path class="g-eksen" fill="none" d="M' + sol + ' ' + ust + 'V' + (H - alt) + 'H' + (W - sag) + '"/>';
    seriler.forEach(function (n, i) {
      var sinif = 'g-seri g-seri-' + (i % 4);
      if (n.length === 1) svg += '<circle class="' + sinif + ' g-nokta" cx="' + px(n[0][0]).toFixed(1) + '" cy="' + py(n[0][1]).toFixed(1) + '" r="3"/>';
      else svg += '<polyline class="' + sinif + '" fill="none" points="' + n.map(function (p) { return px(p[0]).toFixed(1) + ',' + py(p[1]).toFixed(1); }).join(' ') + '"/>';
      if (n.length > 1 && n.length <= 12) n.forEach(function (p) { svg += '<circle class="' + sinif + ' g-nokta" cx="' + px(p[0]).toFixed(1) + '" cy="' + py(p[1]).toFixed(1) + '" r="2.5"/>'; });
    });
    svg += '</svg>';
    return h('div', { class: 'fig-grafik-kap', html: svg });
  }

  function figurleriCiz(figurler) {
    var kap = h('div', { class: 'figurler' });
    (Array.isArray(figurler) ? figurler : []).forEach(function (f, fi) {
      if (!f) return;
      var eksenler = Array.isArray(f.axes) ? f.axes.filter(Boolean) : [];
      var satir = 1, sutun = 1;
      eksenler.forEach(function (ax) { satir = Math.max(satir, ax.rows | 0 || 1); sutun = Math.max(sutun, ax.cols | 0 || 1); });
      var izgara = h('div', { class: 'fig-izgara', style: 'grid-template-columns:repeat(' + sutun + ',minmax(0,1fr))' });
      eksenler.forEach(function (ax) {
        var c = ax.cols | 0 || sutun, idx = (ax.index | 0 || 1) - 1;
        var hucre = h('figure', { class: 'fig-eksen', style: 'grid-column:' + (idx % c + 1) + ';grid-row:' + (Math.floor(idx / c) + 1) });
        if (ax.title) hucre.appendChild(h('figcaption', { class: 'fig-baslik' }, String(ax.title)));
        if (ax.type === 'plot') hucre.appendChild(grafikCiz(ax));
        else if (ax.type === 'image' && ax.width > 0 && ax.height > 0) {
          hucre.appendChild(goruntuCiz(ax));
          hucre.appendChild(h('span', { class: 'fig-not' }, (ax.height | 0) + '×' + (ax.width | 0)));
        } else hucre.appendChild(h('div', { class: 'fig-bos', role: 'img', 'aria-label': 'Boş eksen' }, 'Boş eksen (henüz çizim yok)'));
        izgara.appendChild(hucre);
      });
      kap.appendChild(h('section', { class: 'figur', 'aria-label': 'Figure ' + (f.no != null ? f.no : fi + 1) },
        h('h3', { class: 'figur-ad' }, 'Figure ' + (f.no != null ? f.no : fi + 1)),
        eksenler.length ? izgara : h('p', { class: 'soluk' }, 'Boş figür penceresi.')));
    });
    return kap;
  }

  function boyutYaz(d) {
    var b = d && Array.isArray(d.size) ? d.size : null;
    if (!b) return '—';
    return b.join('×');
  }

  function sayiYaz(x) {
    if (typeof x === 'boolean') return x ? '1' : '0';
    if (typeof x !== 'number') return String(x);
    if (isNaN(x)) return 'NaN';
    if (!isFinite(x)) return x > 0 ? 'Inf' : '-Inf';
    if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x));
    return String(Math.round(x * 10000) / 10000);
  }

  function matris2B(d, sayfa) {
    var v = d ? d.data : null;
    if (typeof v === 'number' || typeof v === 'boolean') return [[v]];
    if (!Array.isArray(v)) return [];
    if (d.size && d.size.length >= 3 && Array.isArray(v[0]) && Array.isArray(v[0][0])) v = v[sayfa || 0] || [];
    if (v.length && !Array.isArray(v[0])) return [v];
    return v;
  }

  function degiskenDetay(ad, d) {
    var kutu = h('div', { class: 'ws-detay' });
    var baslik = h('div', { class: 'ws-detay-ust' }, h('strong', null, ad), h('span', { class: 'soluk' }, boyutYaz(d) + ' ' + (d.cls || '')));
    kutu.appendChild(baslik);
    if (typeof d.data === 'string') { kutu.appendChild(h('pre', { class: 'kod', text: "'" + d.data + "'" })); return kutu; }
    var sayfaSayisi = d.size && d.size.length >= 3 ? d.size[2] : 1;
    var tabloYeri = h('div', { class: 'tablo-kaydir ws-matris-kap', tabindex: '0' });
    var SINIR = 30;
    function ciz(sayfa) {
      tabloYeri.innerHTML = '';
      var m = matris2B(d, sayfa);
      if (!m.length || !m[0] || !m[0].length) { tabloYeri.appendChild(h('p', { class: 'soluk' }, 'Boş matris.')); return; }
      var t = h('table', { class: 'ws-matris' });
      var bas = h('tr', null, h('th', null));
      var sut = Math.min(m[0].length, SINIR), sat = Math.min(m.length, SINIR);
      for (var j = 0; j < sut; j++) bas.appendChild(h('th', { scope: 'col' }, String(j + 1)));
      t.appendChild(h('thead', null, bas));
      var tb = h('tbody');
      for (var i = 0; i < sat; i++) {
        var tr = h('tr', null, h('th', { scope: 'row' }, String(i + 1)));
        for (var jj = 0; jj < sut; jj++) tr.appendChild(h('td', null, sayiYaz(m[i][jj])));
        tb.appendChild(tr);
      }
      t.appendChild(tb);
      tabloYeri.appendChild(t);
      if (m.length > SINIR || m[0].length > SINIR) tabloYeri.appendChild(h('p', { class: 'soluk kucuk' }, 'Yalnızca ilk ' + SINIR + ' satır ve sütun gösteriliyor (tamamı ' + m.length + '×' + m[0].length + ').'));
    }
    if (sayfaSayisi > 1) {
      var sec = h('select', { class: 'girdi', 'aria-label': 'Katman (3. boyut)', onchange: function () { ciz(Number(sec.value)); } });
      for (var s = 0; s < sayfaSayisi; s++) sec.appendChild(h('option', { value: String(s) }, ad + '(:,:,' + (s + 1) + ')'));
      baslik.appendChild(sec);
    }
    ciz(0);
    kutu.appendChild(tabloYeri);
    return kutu;
  }

  /* ================= 8. Sayfalar ================= */

  function sayfa(baslik, altMetin) {
    var s = h('div', { class: 'sayfa' });
    s.appendChild(h('header', { class: 'sayfa-ust' }, h('h1', { tabindex: '-1' }, baslik), altMetin ? h('p', { class: 'sayfa-alt', html: altMetin }) : null));
    return s;
  }

  /* ----- Ana sayfa ----- */

  function istatistikSeridi(g) {
    var hucre = function (etiket, deger, alt) {
      return h('div', { class: 'ist' }, h('span', { class: 'ist-etiket' }, etiket), h('span', { class: 'ist-deger' }, deger), alt ? h('span', { class: 'ist-alt' }, alt) : null);
    };
    return h('div', { class: 'ist-serit', role: 'group', 'aria-label': 'Genel ilerleme' },
      hucre('Tamamlanan konu', g.tamam + ' / ' + g.konu),
      hucre('Çözülen alıştırma', g.cozulen + ' / ' + g.toplam),
      hucre('Doğruluk', yuzdeYaz(g.dogruDeneme, g.deneme), g.deneme ? g.deneme + ' denemede' : 'henüz deneme yok'),
      hucre('Yanlışlarım havuzu', String(yanlisHavuzu().length), yanlisHavuzu().length ? 'tekrar bekliyor' : 'boş'));
  }

  /* İlerleme, dersin benzetmesiyle çizilir: her alıştırma bir piksel. */
  function pikselSeridi(konuId, s) {
    var liste = konuAlistirmalari(konuId);
    return h('span', { class: 'pikseller', role: 'img', 'aria-label': 'Çözülen alıştırma: ' + s.cozulen + ' / ' + s.toplam },
      liste.map(function (a) {
        var k = durum.alistirma[a.id];
        return h('span', { class: 'piksel' + (k ? (k.dogru ? ' p-dogru' : ' p-yanlis') : '') });
      }));
  }

  function konuSatiri(k) {
    var s = konuIstatistik(k.id);
    var tamam = !!durum.tamamlananKonular[k.id];
    return h('li', null, h('a', { class: 'konu-satir', href: '#/konu/' + encodeURIComponent(k.id) },
      h('span', { class: 'konu-no' + (tamam ? ' tamam' : ''), 'aria-hidden': 'true', html: tamam ? ikon('tik') : (typeof k.no === 'number' ? String(k.no) : '·') }),
      h('span', { class: 'konu-govde' },
        h('span', { class: 'konu-ad' }, k.baslik || k.id, k.yeni ? yeniRozet(true) : null, tamam ? h('span', { class: 'gizli' }, ' (tamamlandı)') : null),
        k.kisa ? h('span', { class: 'konu-kisa', html: k.kisa }) : null),
      h('span', { class: 'konu-ilerleme' }, s.toplam ? [pikselSeridi(k.id, s), h('span', { class: 'konu-sayi' }, s.cozulen + ' / ' + s.toplam)] : h('span', { class: 'konu-sayi soluk' }, 'alıştırma yok'))));
  }

  /* Ana sayfa süsü: dersin benzetmesi — matris = resim, sayı = piksel. */
  function matrisSusu() {
    var v = [[12, 40, 90, 130, 160, 200, 240], [30, 255, 100, 140, 180, 220, 250], [60, 80, 0, 150, 190, 230, 255], [90, 120, 160, 170, 210, 240, 255], [110, 150, 190, 200, 230, 250, 255]];
    var kap = h('div', { class: 'matris-susu', 'aria-hidden': 'true' });
    v.forEach(function (satir) { satir.forEach(function (n) {
      var koyu = n < 130;
      kap.appendChild(h('span', { class: 'mh', style: 'background:rgb(' + n + ',' + n + ',' + n + ');color:' + (koyu ? '#fff' : '#111') }, String(n)));
    }); });
    return h('div', { class: 'vitrin' }, kap, h('p', { class: 'vit-alt' }, 'Bilgisayar için resim, sayı tablosudur. Her sayı bir piksel: ', h('strong', null, '0 siyah, 255 beyaz.')));
  }

  function anaSayfa() {
    var s = sayfa('MATLAB çalışma defteri', 'Çoklu Ortam vizesi için: dersteki 13 konu, hocanın medyan filtresi kodu ve bolca alıştırma. Kod yazıp tarayıcıda çalıştırabilirsin.');
    (function () {
      var ust = s.querySelector('.sayfa-ust'), vit = KONULAR.length ? matrisSusu() : null;
      if (!ust || !vit) return;
      ust.classList.add('kahraman');
      var ic = h('div', { class: 'kah-metin' }, h('p', { class: 'kah-etiket' }, 'Çoklu Ortam · vize hazırlığı'), ust.querySelector('h1'), ust.querySelector('.sayfa-alt'),
        h('div', { class: 'dugmeler' }, h('a', { class: 'dugme dugme-ana', href: '#/konu/konu-01' }, 'Baştan başla'), h('a', { class: 'dugme dugme-cam', href: '#/uygulama' }, 'Kodu dene')));
      ust.innerHTML = ''; ust.appendChild(ic); ust.appendChild(vit);
    })();
    if (!KONULAR.length) {
      s.appendChild(bosDurumKutusu('Konu verisi yüklenemedi', '<code>data/konular-a.js</code> ve <code>data/konular-b.js</code> dosyalarının <code>index.html</code> ile aynı klasör yapısında durduğundan emin ol.'));
      if (yorumlayiciSinifi()) s.appendChild(h('p', null, h('a', { class: 'dugme', href: '#/uygulama' }, 'Uygulama alanını aç')));
      return s;
    }
    s.classList.add('sayfa-ana');
    s.appendChild(istatistikSeridi(genelIstatistik()));

    var devam = konuHarita[durum.sonKonu] || KONULAR.filter(function (k) { return !durum.tamamlananKonular[k.id]; })[0] || KONULAR[0];
    var basladi = !!durum.sonKonu || Object.keys(durum.alistirma).length > 0;
    s.appendChild(h('section', { class: 'devam', 'aria-label': 'Kaldığın yerden devam' },
      h('div', { class: 'devam-metin' },
        h('h2', null, basladi ? 'Kaldığın yerden devam' : 'Buradan başla'),
        h('p', null, konuEtiketi(devam), devam.kisa ? h('span', { class: 'soluk', html: ' — ' + devam.kisa }) : null)),
      h('div', { class: 'dugmeler' },
        h('a', { class: 'dugme dugme-ana', href: '#/konu/' + encodeURIComponent(devam.id) }, basladi ? 'Konuya dön' : 'İlk konuyu aç'),
        yanlisHavuzu().length ? h('a', { class: 'dugme', href: '#/tekrar' }, 'Yanlışlarımı tekrar et (' + yanlisHavuzu().length + ')') : null,
        h('a', { class: 'dugme', href: '#/uygulama' }, 'Uygulama alanı'))));

    if (konuHarita['hoca-kodu']) {
      var hedefKod = 'res=imread("cameraman.tif");\nJ = imnoise(res,\'salt & pepper\', 0.02);\n[w,h]=size(J);\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+2,j:j+2);\n        medyanli(i,j)=median(blok(:));\n        ortalama(i,j)=mean(blok(:));\n    end\nend\nfigure,imshow(uint8(medyanli))\nfigure,imshow(uint8(ortalama))';
      s.appendChild(h('section', { class: 'hedef', 'aria-label': 'Hedef kod' },
        h('h2', null, 'Hedef: bu kodun her satırını okuyabilmek'),
        h('pre', { class: 'kod hedef-kod', html: renklendir(hedefKod) }),
        h('div', { class: 'dugmeler' },
          h('a', { class: 'dugme dugme-kucuk', href: '#/konu/hoca-kodu' }, 'Satır satır çöz'),
          h('a', { class: 'dugme dugme-kucuk', href: '#/konu/kagit' }, 'Kağıt üzerinde dene'))));
    }
    s.appendChild(h('h2', { class: 'bolum-baslik' }, 'Konular'));
    s.appendChild(h('ol', { class: 'konu-liste' }, KONULAR.map(konuSatiri)));
    return s;
  }

  /* ----- Konu sayfası ----- */

  var KUTU_ADI = { not: 'Not', ipucu: 'İpucu', dikkat: 'Dikkat', baglanti: 'Hocanın koduyla bağlantısı' };

  function hataKutusu(b, baslikEtiket) {
    return h('section', { class: 'kutu kutu-hata' },
      h('div', { class: 'kutu-ust' }, h('span', { class: 'kutu-etiket' }, 'Yaygın hata'), b.yeni ? yeniRozet() : null),
      h(baslikEtiket || 'h3', { class: 'kutu-baslik' }, b.baslik || 'Hata'),
      h('div', { class: 'hata-uclu' },
        h('div', { class: 'hata-bolum hata-yanlis' }, h('span', { class: 'hata-ad' }, 'Yanlış'), htmlVeyaKod(b.yanlis)),
        h('div', { class: 'hata-bolum hata-dogru' }, h('span', { class: 'hata-ad' }, 'Doğrusu'), htmlVeyaKod(b.dogru)),
        h('div', { class: 'hata-bolum hata-neden' }, h('span', { class: 'hata-ad' }, 'Neden?'), icerik(b.neden))));
  }

  function sssKutusu(b) {
    return h('section', { class: 'kutu kutu-sss' },
      h('div', { class: 'kutu-ust' }, h('span', { class: 'kutu-etiket' }, 'Sık sorulan'), b.yeni ? yeniRozet() : null),
      h('div', { class: 'sss-soru', html: b.soru || '' }),
      icerik(b.cevap));
  }

  function blokCiz(b, i) {
    var el = null;
    switch (b.tip) {
      case 'metin': el = icerik(b.html); break;
      case 'baslik': el = h('h2', { class: 'blok-baslik' }, b.metin || '', b.yeni ? yeniRozet() : null); break;
      case 'kod': el = kodBlok(b.kod || '', { cikti: b.cikti, calistir: b.calistir }); break;
      case 'tablo':
        el = h('div', { class: 'tablo-kaydir', tabindex: '0', role: 'region', 'aria-label': 'Tablo' },
          h('table', { class: 'tablo' },
            Array.isArray(b.basliklar) && b.basliklar.length ? h('thead', null, h('tr', null, b.basliklar.map(function (x) { return h('th', { scope: 'col', html: x }); }))) : null,
            h('tbody', null, (Array.isArray(b.satirlar) ? b.satirlar : []).map(function (sat) {
              return h('tr', null, (Array.isArray(sat) ? sat : [sat]).map(function (x) { return h('td', { html: x == null ? '' : String(x) }); }));
            }))));
        break;
      case 'satirsatir':
        el = h('ol', { class: 'satirsatir' }, (Array.isArray(b.maddeler) ? b.maddeler : []).map(function (m) {
          return h('li', null, h('pre', { class: 'kod', html: renklendir(m.kod || '') }), icerik(m.aciklama, 'metin ss-aciklama'));
        }));
        break;
      case 'cizim': el = h('pre', { class: 'cizim', tabindex: '0', text: b.metin || '' }); break;
      case 'hata': el = hataKutusu(b); break;
      case 'sss': el = sssKutusu(b); break;
      case 'not': case 'ipucu': case 'dikkat': case 'baglanti':
        el = h('aside', { class: 'kutu kutu-' + b.tip }, h('div', { class: 'kutu-ust' }, h('span', { class: 'kutu-etiket' }, KUTU_ADI[b.tip]), b.yeni ? yeniRozet() : null), icerik(b.html));
        break;
      case 'ozet':
        el = h('section', { class: 'kutu kutu-ozet' }, h('div', { class: 'kutu-ust' }, h('span', { class: 'kutu-etiket' }, 'Özet')),
          h('ul', null, (Array.isArray(b.maddeler) ? b.maddeler : []).map(function (m) { return h('li', { html: m }); })));
        break;
      default:
        if (b.html) el = icerik(b.html);
    }
    if (!el) return null;
    el.id = 'b' + i;
    if (b.yeni && ['metin', 'kod', 'tablo', 'satirsatir', 'cizim'].indexOf(b.tip) >= 0) {
      return h('div', { class: 'yeni-sarma', id: 'b' + i }, yeniRozet(true), (el.removeAttribute('id'), el));
    }
    return el;
  }

  function konuSayfasi(id) {
    var k = konuHarita[id];
    if (!k) {
      var s0 = sayfa('Konu bulunamadı');
      s0.appendChild(bosDurumKutusu('Bu adreste bir konu yok', '<a href="#/">Konu listesine dön</a>'));
      return s0;
    }
    durum.sonKonu = k.id; kayitYaz();
    var sira = KONULAR.indexOf(k);
    var alis = konuAlistirmalari(k.id);

    var s = h('div', { class: 'sayfa sayfa-konu' });
    var ana = h('div', { class: 'konu-ana' });
    ana.appendChild(h('header', { class: 'sayfa-ust' },
      h('p', { class: 'ekmek' }, h('a', { href: '#/' }, 'Konular'), ' / ', typeof k.no === 'number' && /^konu-/.test(k.id) ? 'Konu ' + k.no : 'Ek konu'),
      h('h1', { tabindex: '-1' }, k.baslik || k.id, k.yeni ? yeniRozet(true) : null),
      k.kisa ? h('p', { class: 'sayfa-alt', html: k.kisa }) : null));

    var icindekiler = [];
    var govde = h('div', { class: 'konu-govde-metin' });
    k.bloklar.forEach(function (b, i) {
      if (!b || typeof b !== 'object') return;
      var el;
      try { el = blokCiz(b, i); } catch (e) { el = null; }
      if (!el) return;
      if (b.tip === 'baslik') icindekiler.push({ id: 'b' + i, metin: b.metin || '', yeni: !!b.yeni });
      govde.appendChild(el);
    });
    if (!k.bloklar.length) govde.appendChild(bosDurumKutusu('Bu konunun içeriği henüz yok'));
    ana.appendChild(govde);

    /* alıştırmalar */
    var alisBolum = h('section', { class: 'konu-alis', id: 'alistirmalar' });
    var st = konuIstatistik(k.id);
    alisBolum.appendChild(h('h2', { class: 'blok-baslik' }, 'Alıştırmalar', alis.length ? h('span', { class: 'baslik-sayi' }, st.cozulen + ' / ' + alis.length + ' çözüldü') : null));
    if (!alis.length) alisBolum.appendChild(bosDurumKutusu('Bu konu için alıştırma yok'));
    else {
      alisBolum.appendChild(h('p', { class: 'soluk' }, 'Kolaydan zora sıralı. Yanlış cevapta sıradaki ipucu açılır; yanlışlar “Tekrar” bölümündeki havuza eklenir.'));
      alis.forEach(function (a) { alisBolum.appendChild(alistirmaBilesen(a)); });
    }
    ana.appendChild(alisBolum);
    icindekiler.push({ id: 'alistirmalar', metin: 'Alıştırmalar' });

    /* tamamlama */
    var tamamKutu = h('input', { type: 'checkbox', id: 'konu-tamam' });
    tamamKutu.checked = !!durum.tamamlananKonular[k.id];
    tamamKutu.addEventListener('change', function () {
      if (tamamKutu.checked) durum.tamamlananKonular[k.id] = true; else delete durum.tamamlananKonular[k.id];
      kayitYaz();
    });
    ana.appendChild(h('div', { class: 'tamamla' }, h('label', { class: 'onay-etiket', for: 'konu-tamam' }, tamamKutu, h('span', null, 'Konuyu tamamladım'))));

    /* önceki / sonraki */
    var onceki = KONULAR[sira - 1], sonraki = KONULAR[sira + 1];
    ana.appendChild(h('nav', { class: 'konu-gezin', 'aria-label': 'Önceki ve sonraki konu' },
      onceki ? h('a', { class: 'gezin gezin-onceki', href: '#/konu/' + encodeURIComponent(onceki.id) }, h('span', { class: 'gezin-yon', html: ikon('geri') + ' Önceki konu' }), h('span', { class: 'gezin-ad' }, konuEtiketi(onceki))) : h('span'),
      sonraki ? h('a', { class: 'gezin gezin-sonraki', href: '#/konu/' + encodeURIComponent(sonraki.id) }, h('span', { class: 'gezin-yon', html: 'Sonraki konu ' + ikon('ok') }), h('span', { class: 'gezin-ad' }, konuEtiketi(sonraki))) : h('span')));

    s.appendChild(ana);

    if (icindekiler.length >= 3) {
      var genis = !window.matchMedia || window.matchMedia('(min-width: 1080px)').matches;
      var det = h('details', { class: 'icindekiler' }, h('summary', null, 'Bu konuda'),
        h('ul', null, icindekiler.map(function (m) {
          return h('li', null, h('a', { href: '#/konu/' + encodeURIComponent(k.id) + '/' + m.id }, m.metin, m.yeni ? yeniRozet() : null));
        })));
      if (genis) det.setAttribute('open', '');
      s.insertBefore(h('nav', { class: 'konu-yan', 'aria-label': 'Sayfa içindekiler' }, det), ana);
    }
    return s;
  }

  /* ----- toplu listeler: hatalar, sorular, yeni ----- */

  function bloklariTopla(tip) {
    var out = [];
    KONULAR.forEach(function (k) {
      k.bloklar.forEach(function (b, i) { if (b && b.tip === tip) out.push({ konu: k, blok: b, i: i }); });
    });
    return out;
  }

  function konuBaglantisi(k, i, metin) {
    return h('a', { class: 'kaynak', href: '#/konu/' + encodeURIComponent(k.id) + (i != null ? '/b' + i : '') }, metin || konuEtiketi(k));
  }

  function hatalarimSayfasi() {
    var s = sayfa('Benim hatalarım', 'Sohbette yaptığın ve sık yapılan hatalar tek yerde. Her kutu: yanlış yazım, doğrusu ve nedeni.');
    var hatalar = bloklariTopla('hata');
    var set = ALISTIRMALAR.filter(function (a) { return etiketli(a, 'hata-odakli'); });
    if (!hatalar.length && !set.length) { s.appendChild(bosDurumKutusu('Henüz hata kaydı yok', 'Konu verisi yüklenince hata kutuları burada listelenir.')); return s; }

    if (set.length) {
      var cozulen = set.filter(function (a) { return durum.alistirma[a.id] && durum.alistirma[a.id].dogru; }).length;
      s.appendChild(h('section', { class: 'devam' },
        h('div', { class: 'devam-metin' }, h('h2', null, 'Hata odaklı çalışma seti'),
          h('p', null, set.length + ' alıştırma, tam bu hataları hedefliyor. ', h('span', { class: 'soluk' }, cozulen + ' / ' + set.length + ' çözüldü.'))),
        h('div', { class: 'dugmeler' },
          h('button', { type: 'button', class: 'dugme dugme-ana', onclick: function () { oturumBaslat({ tur: 'ozel', ad: 'Hata odaklı set', sorular: karistir(set) }); } }, 'Seti karışık çalış'),
          h('a', { class: 'dugme', href: '#hata-seti', onclick: function (e) { e.preventDefault(); var el = document.getElementById('hata-seti'); if (el) { el.scrollIntoView(); } } }, 'Listeyi gör'))));
    }

    var grup = null, sonKonu = null;
    hatalar.forEach(function (x) {
      if (x.konu !== sonKonu) {
        sonKonu = x.konu;
        grup = h('section', { class: 'toplu-grup' }, h('h2', { class: 'bolum-baslik' }, konuBaglantisi(x.konu)));
        s.appendChild(grup);
      }
      var kutu = hataKutusu(x.blok, 'h3');
      kutu.appendChild(h('p', { class: 'kutu-kaynak' }, konuBaglantisi(x.konu, x.i, 'Konudaki yerine git')));
      grup.appendChild(kutu);
    });

    if (set.length) {
      var bolum = h('section', { class: 'toplu-grup', id: 'hata-seti' }, h('h2', { class: 'bolum-baslik' }, 'Hata odaklı alıştırmalar'));
      set.forEach(function (a) { bolum.appendChild(alistirmaSatiri(a)); });
      s.appendChild(bolum);
    }
    return s;
  }

  function sorularimSayfasi() {
    var s = sayfa('Sorduğum sorular', 'Ders sırasında sorduğun sorular ve cevapları. Kelimeyle arayabilirsin.');
    var sorular = bloklariTopla('sss');
    if (!sorular.length) { s.appendChild(bosDurumKutusu('Henüz soru yok', 'Konu verisi yüklenince “Sık sorulan” kutuları burada listelenir.')); return s; }
    var aid = kimlik('ara');
    var sayi = h('p', { class: 'soluk', role: 'status', 'aria-live': 'polite' });
    var liste = h('div', { class: 'toplu-liste' });
    var ogeler = sorular.map(function (x) {
      var kutu = sssKutusu(x.blok);
      kutu.appendChild(h('p', { class: 'kutu-kaynak' }, konuBaglantisi(x.konu, x.i, konuEtiketi(x.konu))));
      liste.appendChild(kutu);
      return { el: kutu, metin: aramaNorm(duzMetin(x.blok.soru) + ' ' + duzMetin(x.blok.cevap) + ' ' + konuEtiketi(x.konu)) };
    });
    var bos = bosDurumKutusu('Aramayla eşleşen soru yok', 'Başka bir kelime dene; örneğin <code>end</code>, <code>size</code> ya da “virgül”.');
    bos.hidden = true;
    function suz(q) {
      var kelimeler = aramaNorm(q).split(' ').filter(Boolean), gorunen = 0;
      ogeler.forEach(function (o) {
        var uy = kelimeler.every(function (w) { return o.metin.indexOf(w) >= 0; });
        o.el.hidden = !uy; if (uy) gorunen++;
      });
      sayi.textContent = kelimeler.length ? gorunen + ' / ' + ogeler.length + ' soru gösteriliyor' : ogeler.length + ' soru';
      bos.hidden = gorunen > 0;
    }
    var kutuAra = h('input', { id: aid, class: 'girdi', type: 'search', autocomplete: 'off', placeholder: 'Örn: end, iki nokta, uint8', oninput: function () { suz(kutuAra.value); } });
    s.appendChild(h('div', { class: 'arama' }, h('label', { class: 'girdi-etiket', for: aid }, 'Sorularda ara'), kutuAra, sayi));
    ekle(s, [liste, bos]);
    suz('');
    return s;
  }

  function yeniSayfasi() {
    var s = sayfa('Yeni / henüz pratik yapılmadı', 'Sohbette anlatılıp üzerinde hiç soru çözmediğin ya da hiç çalışılmamış kısımlar. Vizeden önce buraya öncelik ver.');
    var konular = KONULAR.filter(function (k) { return k.yeni; });
    var bloklar = [];
    KONULAR.forEach(function (k) {
      if (k.yeni) return;
      k.bloklar.forEach(function (b, i) { if (b && b.yeni) bloklar.push({ konu: k, blok: b, i: i }); });
    });
    var alis = ALISTIRMALAR.filter(function (a) { return etiketli(a, 'yeni') || (konuHarita[a.konu] && konuHarita[a.konu].yeni); });
    if (!konular.length && !bloklar.length && !alis.length) { s.appendChild(bosDurumKutusu('Yeni işaretli içerik yok')); return s; }

    if (konular.length) {
      s.appendChild(h('h2', { class: 'bolum-baslik' }, 'Yeni konular'));
      s.appendChild(h('ol', { class: 'konu-liste' }, konular.map(konuSatiri)));
    }
    if (bloklar.length) {
      s.appendChild(h('h2', { class: 'bolum-baslik' }, 'Diğer konulardaki yeni alt başlıklar'));
      var ul = h('ul', { class: 'yeni-liste' });
      bloklar.forEach(function (x) {
        var b = x.blok;
        var ad = b.tip === 'baslik' ? b.metin : b.baslik || (b.tip === 'sss' ? duzMetin(b.soru) : b.tip === 'kod' ? String(b.kod || '').split('\n')[0] : duzMetin(b.html || b.metin || (b.maddeler && b.maddeler[0] && (b.maddeler[0].kod || b.maddeler[0])) || b.tip));
        ul.appendChild(h('li', null, konuBaglantisi(x.konu, x.i, kisalt(ad || b.tip, 90)), h('span', { class: 'soluk' }, konuEtiketi(x.konu))));
      });
      s.appendChild(ul);
    }
    if (alis.length) {
      var coz = alis.filter(function (a) { return durum.alistirma[a.id] && durum.alistirma[a.id].dogru; }).length;
      s.appendChild(h('h2', { class: 'bolum-baslik' }, 'Yeni alıştırmalar', h('span', { class: 'baslik-sayi' }, coz + ' / ' + alis.length + ' çözüldü')));
      s.appendChild(h('div', { class: 'dugmeler bosluk-alt' }, h('button', { type: 'button', class: 'dugme dugme-ana', onclick: function () { oturumBaslat({ tur: 'ozel', ad: 'Yeni alıştırmalar', sorular: karistir(alis).slice(0, 10) }); } }, 'Karışık 10 soru çalış')));
      var kap = h('div', { class: 'toplu-grup' });
      alis.forEach(function (a) { kap.appendChild(alistirmaSatiri(a)); });
      s.appendChild(kap);
    }
    return s;
  }

  /* ----- Uygulama alanı ----- */

  var HOCA_KODU = 'res=imread("cameraman.tif");\nJ = imnoise(res,\'salt & pepper\', 0.02);\n[w,h]=size(J);\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+2,j:j+2);\n        medyanli(i,j)=median(blok(:));\n        ortalama(i,j)=mean(blok(:));\n    end\nend\nfigure,imshow(uint8(medyanli))\nfigure,imshow(uint8(ortalama))';

  var ORNEKLER = [
    { grup: 'hoca', ad: 'RGB görüntü analizi (R, G, B katmanlarını ayır)', kod: 'clc,clear all,close all\nresim=imread("football.jpg");\n[w,h,l]=size(resim);\nR=zeros(w,h,l);\nG=zeros(w,h,l);\nB=zeros(w,h,l);\nR(:,:,1)=resim(:,:,1);\nG(:,:,2)=resim(:,:,2);\nB(:,:,3)=resim(:,:,3);\nsubplot(3,1,1),imshow(uint8(R))\nsubplot(3,1,2),imshow(uint8(G))\nsubplot(3,1,3),imshow(uint8(B))' },
    { grup: 'hoca', ad: 'Medyan ve ortalama filtresi (gürültü temizleme)', kod: HOCA_KODU },
    { grup: 'hoca', ad: 'Medyan ve ortalama filtresi: üç resim yan yana', kod: 'res=imread("cameraman.tif");\nJ = imnoise(res,\'salt & pepper\', 0.02);\n[w,h]=size(J);\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+2,j:j+2);\n        medyanli(i,j)=median(blok(:));\n        ortalama(i,j)=mean(blok(:));\n    end\nend\nfigure\nsubplot(1,3,1), imshow(J), title(\'Gurultulu\')\nsubplot(1,3,2), imshow(uint8(medyanli)), title(\'Medyan\')\nsubplot(1,3,3), imshow(uint8(ortalama)), title(\'Ortalama\')' },
    { grup: 'hoca', ad: 'Sobel kenar çıkarma (X, Y ve kenar resmi)', kod: 'clc,clear all,close all\nresim=imread("football.jpg");\nR=resim(:,:,1);\nGx=[1 2 1;0 0 0;-1 -2 -1];\nGy=Gx\';\n[w,h]=size(R(:,:,1));\nfor i=1:w-2\n    for j=1:h-2\n        blok=R(i:i+2,j:j+2);\n        blok=double(blok);\n        deger_x=blok.*Gx;\n        deger_y=blok.*Gy;\n        X(i,j)=sum(deger_x(:));\n        Y(i,j)=sum(deger_y(:));\n        kenar(i,j)=(sqrt(X(i,j)^2+Y(i,j)^2))>255;\n    end\nend\nsubplot(3,1,1),imshow(X,[])\nsubplot(3,1,2),imshow(Y,[])\nsubplot(3,1,3),imshow(kenar,[])' },
    { grup: 'hoca', ad: 'LBP (harita ve 256\'lık histogram)', kod: 'res=imread("cameraman.tif");\n[w,h]=size(res);\nhisto=zeros(1,256);\nfor i=1:w-2\n    for j=1:h-2\n        blok=double(res(i:i+2,j:j+2));\n        merkez=blok(2,2);\n        bit(1)=blok(1,1)>=merkez; bit(2)=blok(1,2)>=merkez;\n        bit(3)=blok(1,3)>=merkez; bit(4)=blok(2,1)>=merkez;\n        bit(5)=blok(2,3)>=merkez; bit(6)=blok(3,1)>=merkez;\n        bit(7)=blok(3,2)>=merkez; bit(8)=blok(3,3)>=merkez;\n        harita(i,j)=0;\n        for k=1:8\n            harita(i,j)=harita(i,j)+double(bit(k))*2^(8-k);\n        end\n        histo(harita(i,j)+1)=histo(harita(i,j)+1)+1;\n    end\nend\n% Hocanin fonksiyonunun (function histo=LBP_ABM(res)) govdesi; burada duz betik olarak calisir.\nsubplot(1,2,1),imshow(harita,[]),title(\'LBP haritasi\')\nsubplot(1,2,2),plot(0:255,histo),title(\'histo\')\ntoplam=sum(histo)' },
    { ad: 'Kağıt üzerinde 4×4 uygulama', kod: 'clc; clear all; close all;\n\nJ = [10 20 30 40; 50 255 60 70; 80 90 0 100; 110 120 130 140];\n[w,h]=size(J)\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+2,j:j+2);\n        medyanli(i,j)=median(blok(:));\n        ortalama(i,j)=mean(blok(:));\n    end\nend\nmedyanli\nortalama' },
    { ad: 'Matris ve indeksleme', kod: 'A = [10 20 30; 40 50 60; 70 80 90]\nA(2,3)\nA(1:2, 2:3)\nA(:, 1)\nA(:)\'\n1:2:10' },
    { ad: '* ile .* farkı', kod: 'A = [1 2; 3 4];\nB = [10 20; 30 40];\nA * B     % matris carpimi\nA .* B    % eleman eleman carpim' },
    { ad: 'İç içe for: i ve j nasıl değişir?', kod: 'for i=1:2\n    for j=1:3\n        disp([i j])\n    end\nend' },
    { ad: 'uint8 taşması', kod: 'a = uint8(200);\nb = uint8(100);\na + b            % 255: tavana yapisir\na - b - b - b    % 0: tabana yapisir\ndouble(a) + double(b)' },
    { ad: 'if / elseif / else', kod: 'piksel = 180;\nif piksel > 200\n    disp(\'cok parlak\')\nelseif piksel > 100\n    disp(\'orta\')\nelse\n    disp(\'koyu\')\nend' },
    { ad: 'imshow(X) ile imshow(X,[]) farkı', kod: 'X = [0 50; 75 100];\nfigure\nsubplot(1,2,1), imshow(uint8(X)), title(\'imshow(uint8(X))\')\nsubplot(1,2,2), imshow(X,[]), title(\'imshow(X,[])\')' },
    { ad: 'plot ile çizgi grafiği', kod: 'x = 1:10;\ny = x.^2;\nfigure\nplot(x, y)\ntitle(\'y = x.^2\')' }
  ];

  var Uyg = { m: null, kod: null, cikti: [], gecmis: [], vars: {}, figurler: [], secili: null, duyuru: null };

  function uygYorumlayici() {
    if (Uyg.m) return Uyg.m;
    var M = yorumlayiciSinifi();
    if (!M) return null;
    try { Uyg.m = new M(); } catch (e) { Uyg.m = null; }
    return Uyg.m;
  }

  function uygulamaSayfasi() {
    var s = sayfa('Uygulama alanı', 'MATLAB’a benzeyen küçük bir ortam. Kod tarayıcında çalışır; Hazır resimler: <code>imread("cameraman.tif")</code> (256×256 gri) ve <code>imread("football.jpg")</code> (256×320 renkli). Başka bir resimle çalışmak için <strong>Resim yükle</strong>’ye bas.');
    s.classList.add('sayfa-genis');
    if (Uyg.kod == null) Uyg.kod = typeof durum.uygulamaKod === 'string' ? durum.uygulamaKod : ORNEKLER.filter(function (o) { return /Kağıt/.test(o.ad); })[0].kod;

    var yok = !yorumlayiciSinifi();
    if (yok) s.appendChild(h('div', { class: 'kutu kutu-dikkat' }, h('div', { class: 'kutu-ust' }, h('span', { class: 'kutu-etiket' }, 'Yorumlayıcı yüklenemedi')), h('p', { html: '<code>js/matlab.js</code> dosyası bulunamadı. Kodu yazabilirsin ama çalıştıramazsın.' })));
    if (Uyg.duyuru) { s.appendChild(h('p', { class: 'duyuru', role: 'status' }, Uyg.duyuru)); Uyg.duyuru = null; }

    var kayitZamani = null;
    var editor = editorOlustur({
      deger: Uyg.kod, etiket: 'Kod editörü', onCalistir: function () { calistir(); },
      onDegis: function (v) {
        Uyg.kod = v;
        clearTimeout(kayitZamani);
        kayitZamani = setTimeout(function () { durum.uygulamaKod = v.length < 20000 ? v : ''; kayitYaz(); }, 600);
      }
    });

    /* örnek seçici */
    var secId = kimlik('ornek');
    var sec = h('select', { id: secId, class: 'girdi' }, h('option', { value: '' }, 'Örnek kod seç…'));
    var kodlar = [];
    var gHoca = h('optgroup', { label: 'Hoca soruları' });
    var g1 = h('optgroup', { label: 'Kısa dersten örnekler' });
    ORNEKLER.forEach(function (o) { kodlar.push(o.kod); (o.grup === 'hoca' ? gHoca : g1).appendChild(h('option', { value: String(kodlar.length - 1) }, o.ad)); });
    sec.appendChild(gHoca);
    sec.appendChild(g1);
    KONULAR.forEach(function (k) {
      var g = h('optgroup', { label: konuEtiketi(k) }), son = '', say = {}, var_ = false;
      k.bloklar.forEach(function (b) {
        if (!b) return;
        if (b.tip === 'baslik') { son = b.metin || ''; return; }
        if (b.tip !== 'kod' || !b.calistir || !b.kod) return;
        /* ad: önce bloğun kendi kısa adı (b.ad), yoksa üstündeki alt başlık. Aynı başlık altında birden çok
           çalıştırılabilir blok varsa her birine veride `ad` verilir (test/veri.test.js bunu zorunlu tutar). */
        var ad = b.ad || son.replace(/^Ek:\s*/i, '').replace(/^\d+\.\s*/, '').replace(/^Örnek:\s*/i, '') || 'Örnek kod';
        ad = kisalt(ad, 60);
        say[ad] = (say[ad] || 0) + 1; if (say[ad] > 1) ad += ' (' + say[ad] + ')';
        kodlar.push(b.kod); var_ = true;
        g.appendChild(h('option', { value: String(kodlar.length - 1) }, ad));
      });
      if (var_) sec.appendChild(g);
    });
    sec.addEventListener('change', function () {
      if (sec.value === '') return;
      editor.ayarla(kodlar[Number(sec.value)]);
      sec.value = '';
      editor.odak();
    });

    var calDugme = h('button', { type: 'button', class: 'dugme dugme-ana', disabled: yok, title: 'Ctrl+Enter', onclick: function () { calistir(); } }, 'Çalıştır');
    var durumYazi = h('span', { class: 'soluk calisma-durum', role: 'status', 'aria-live': 'polite' });
    var cw = h('div', { class: 'cw', role: 'log', 'aria-label': 'Command Window çıktısı', tabindex: '0' });
    var wsYeri = h('div', { class: 'ws-yer' });
    var figYeri = h('div', { class: 'fig-yer' });

    function cwEkle(tip, metin, err) {
      Uyg.cikti.push({ tip: tip, metin: metin, err: err || null });
      if (Uyg.cikti.length > 400) Uyg.cikti.splice(0, Uyg.cikti.length - 400);
    }

    function cwCiz() {
      cw.innerHTML = '';
      if (!Uyg.cikti.length) cw.appendChild(h('p', { class: 'cw-bos' }, 'Çıktı burada görünür. Kodu çalıştır ya da aşağıya bir komut yaz.'));
      Uyg.cikti.forEach(function (c) {
        if (c.tip === 'hata') cw.appendChild(hataSatiri(c.err));
        else cw.appendChild(h('pre', { class: 'cw-' + c.tip, text: c.metin }));
      });
      cw.scrollTop = cw.scrollHeight;
    }

    function wsCiz() {
      wsYeri.innerHTML = '';
      var adlar = Object.keys(Uyg.vars || {}).sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
      if (!adlar.length) { wsYeri.appendChild(h('p', { class: 'soluk ws-bos' }, 'Henüz değişken yok.')); return; }
      var detayYeri = h('div');
      var tb = h('tbody');
      adlar.forEach(function (ad) {
        var d = Uyg.vars[ad] || {};
        var deger = '';
        try { deger = window.Kontrol ? window.Kontrol.degerYaz(d) : ''; } catch (e) { deger = ''; }
        var dugme = h('button', { type: 'button', class: 'ws-ad', 'aria-expanded': Uyg.secili === ad ? 'true' : 'false', title: 'Değeri tablo olarak göster', onclick: function () { Uyg.secili = Uyg.secili === ad ? null : ad; wsCiz(); } }, ad);
        tb.appendChild(h('tr', { class: Uyg.secili === ad ? 'secili' : null }, h('th', { scope: 'row' }, dugme), h('td', { class: 'sayi' }, boyutYaz(d)), h('td', null, d.cls || ''), h('td', { class: 'ws-deger' }, deger || '…')));
      });
      wsYeri.appendChild(h('div', { class: 'tablo-kaydir' }, h('table', { class: 'ws-tablo' },
        h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Ad'), h('th', { scope: 'col', class: 'sayi' }, 'Boyut'), h('th', { scope: 'col' }, 'Sınıf'), h('th', { scope: 'col' }, 'Değer'))), tb)));
      if (Uyg.secili && Uyg.vars[Uyg.secili]) detayYeri.appendChild(degiskenDetay(Uyg.secili, Uyg.vars[Uyg.secili]));
      wsYeri.appendChild(detayYeri);
    }

    function figCiz() {
      figYeri.innerHTML = '';
      if (!Uyg.figurler || !Uyg.figurler.length) { figYeri.appendChild(h('p', { class: 'soluk' }, 'Açık figür yok. imshow ya da plot kullanınca burada görünür.')); return; }
      figYeri.appendChild(figurleriCiz(Uyg.figurler));
    }

    function sonucIsle(r) {
      r = r || {};
      if (r.cleared) Uyg.cikti = [];
      var out = r.output != null ? String(r.output).replace(/\n+$/, '') : '';
      if (out) cwEkle('cikti', out);
      if (r.error) cwEkle('hata', '', r.error);
      if (r.vars && typeof r.vars === 'object') Uyg.vars = r.vars;
      if (Array.isArray(r.figures)) Uyg.figurler = r.figures;
      if (Uyg.secili && !Uyg.vars[Uyg.secili]) Uyg.secili = null;
      cwCiz(); wsCiz(); figCiz();
    }

    function yurut(kod, bitince) {
      var m = uygYorumlayici();
      if (!m) { cwEkle('hata', '', { message: 'MiniMatlab is not loaded.', mesajTr: 'Yorumlayıcı (js/matlab.js) yüklenemedi.' }); cwCiz(); return; }
      calDugme.disabled = true;
      durumYazi.textContent = 'Çalışıyor…';
      setTimeout(function () {
        var r, t0 = Date.now();
        try { r = m.run(kod); }
        catch (e) { r = { output: '', error: { message: String(e && e.message || e), mesajTr: 'Yorumlayıcı beklenmedik bir hatayla durdu.' } }; }
        sonucIsle(r);
        calDugme.disabled = false;
        durumYazi.textContent = r && r.error ? 'Hata ile durdu.' : 'Bitti (' + (Date.now() - t0) + ' ms).';
        if (bitince) bitince();
      }, 30);
    }

    function calistir() {
      var kod = editor.deger();
      if (!kod.trim()) { durumYazi.textContent = 'Editör boş.'; return; }
      cwEkle('komut', '>> % editördeki kod çalıştırıldı');
      yurut(kod);
    }

    /* komut satırı */
    var gecmisYer = Uyg.gecmis.length, taslak = '';
    var komut = h('input', { class: 'cw-girdi', type: 'text', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Komut satırı. Enter çalıştırır, yukarı ve aşağı oklar geçmişte gezer.', placeholder: 'komut yaz, Enter’a bas', disabled: yok });
    komut.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var k = komut.value;
        if (!k.trim()) return;
        if (Uyg.gecmis[Uyg.gecmis.length - 1] !== k) Uyg.gecmis.push(k);
        gecmisYer = Uyg.gecmis.length; taslak = '';
        komut.value = '';
        cwEkle('komut', '>> ' + k);
        yurut(k, function () { komut.focus(); });
      } else if (e.key === 'ArrowUp') {
        if (!Uyg.gecmis.length) return;
        e.preventDefault();
        if (gecmisYer === Uyg.gecmis.length) taslak = komut.value;
        gecmisYer = Math.max(0, gecmisYer - 1);
        komut.value = Uyg.gecmis[gecmisYer];
      } else if (e.key === 'ArrowDown') {
        if (gecmisYer >= Uyg.gecmis.length) return;
        e.preventDefault();
        gecmisYer++;
        komut.value = gecmisYer === Uyg.gecmis.length ? taslak : Uyg.gecmis[gecmisYer];
      }
    });

    /* Kendi resmini yükle: dosya yalnızca bu tarayıcıda işlenir, hiçbir yere gönderilmez. */
    var resimGirdi = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/bmp,image/gif,image/webp', class: 'gizli', tabindex: '-1', 'aria-hidden': 'true' });
    var resimDugme = h('button', { type: 'button', class: 'dugme', title: 'imread bundan sonra senin resmini okur (256×256 gri tona çevrilir). Dosya bilgisayarından çıkmaz.', onclick: function () { resimGirdi.click(); } }, 'Resim yükle');
    var resimBirak = h('button', { type: 'button', class: 'dugme', hidden: true, onclick: function () {
      var S = yorumlayiciSinifi(); if (S && S.setUserImage) S.setUserImage(null);
      resimBirak.hidden = true; durumYazi.textContent = 'Örnek resme dönüldü.';
    } }, 'Örnek resme dön');
    resimGirdi.addEventListener('change', function () {
      var dosya = resimGirdi.files && resimGirdi.files[0]; resimGirdi.value = '';
      var S = yorumlayiciSinifi();
      if (!dosya || !S || !S.setUserImage) return;
      var okuyucu = new FileReader();
      okuyucu.onerror = function () { durumYazi.textContent = 'Dosya okunamadı.'; };
      okuyucu.onload = function () {
        var im = new Image();
        im.onerror = function () { durumYazi.textContent = 'Bu dosya resim olarak açılamadı. PNG ya da JPG dene (tarayıcılar .tif dosyasını açamaz).'; };
        im.onload = function () {
          try {
            var c = document.createElement('canvas'); c.width = 256; c.height = 256;
            var x = c.getContext('2d'), k = Math.min(im.naturalWidth, im.naturalHeight);
            x.drawImage(im, (im.naturalWidth - k) / 2, (im.naturalHeight - k) / 2, k, k, 0, 0, 256, 256);
            var p = x.getImageData(0, 0, 256, 256).data, g = new Array(65536);
            for (var i = 0; i < 65536; i++) g[i] = Math.round(0.299 * p[i * 4] + 0.587 * p[i * 4 + 1] + 0.114 * p[i * 4 + 2]);
            S.setUserImage(g);
            resimBirak.hidden = false;
            durumYazi.textContent = 'Resmin yüklendi: imread artık onu okur (ortadan kare kesilip 256×256 gri tona çevrildi).';
          } catch (e) { durumYazi.textContent = 'Resim işlenemedi.'; }
        };
        im.src = okuyucu.result;
      };
      okuyucu.readAsDataURL(dosya);
    });
    (function () { var S = yorumlayiciSinifi(); if (S && S.hasUserImage && S.hasUserImage()) resimBirak.hidden = false; })();

    var arac = h('div', { class: 'uyg-arac' },
      h('div', { class: 'dugmeler' }, calDugme, resimDugme, resimBirak, resimGirdi,
        h('button', { type: 'button', class: 'dugme', onclick: function () { Uyg.cikti = []; cwCiz(); durumYazi.textContent = ''; } }, 'Çıktıyı temizle'),
        h('button', { type: 'button', class: 'dugme', title: 'Değişkenleri ve figürleri siler (clear all, close all gibi)', onclick: function () {
          var m = uygYorumlayici();
          try { if (m && m.reset) m.reset(); else Uyg.m = null; } catch (e) { Uyg.m = null; }
          Uyg.vars = {}; Uyg.figurler = []; Uyg.secili = null; wsCiz(); figCiz(); durumYazi.textContent = 'Workspace sıfırlandı.';
        } }, 'Workspace’i sıfırla'),
        durumYazi),
      h('div', { class: 'uyg-ornek' }, h('label', { class: 'gizli', for: secId }, 'Örnek kod'), sec));

    var solSutun = h('div', { class: 'uyg-sol' },
      h('section', { class: 'panel', 'aria-label': 'Editör' }, h('div', { class: 'panel-ust' }, h('h2', null, 'Editör'), h('span', { class: 'soluk kucuk' }, 'Ctrl+Enter çalıştırır')), arac, editor.el),
      h('section', { class: 'panel', 'aria-label': 'Command Window' }, h('div', { class: 'panel-ust' }, h('h2', null, 'Command Window')), cw,
        h('div', { class: 'cw-satir' }, h('span', { class: 'cw-istem', 'aria-hidden': 'true' }, '>>'), komut)));
    var sagSutun = h('div', { class: 'uyg-sag' },
      h('section', { class: 'panel', 'aria-label': 'Workspace' }, h('div', { class: 'panel-ust' }, h('h2', null, 'Workspace'), h('span', { class: 'soluk kucuk' }, 'ada tıkla: tablo')), wsYeri),
      h('section', { class: 'panel', 'aria-label': 'Figürler' }, h('div', { class: 'panel-ust' }, h('h2', null, 'Figürler')), figYeri));
    s.appendChild(h('div', { class: 'uyg' }, solSutun, sagSutun));

    cwCiz(); wsCiz(); figCiz();
    return s;
  }

  /* ----- Tekrar modu ----- */

  var Oturum = null; /* {tur, ad, konu, kuyruk:[a], sira, ilkSonuc:{id:bool}, tekrarSayisi, bitti} */

  function oturumBaslat(o) {
    if (!o.sorular || !o.sorular.length) return;
    Oturum = { tur: o.tur, ad: o.ad, konu: o.konu || null, kuyruk: o.sorular.slice(), sira: 0, ilkSonuc: {}, bos: {}, sorulan: 0, bitti: false, kaydedildi: false };
    if (location.hash === '#/tekrar') ciz(); else location.hash = '#/tekrar';
  }

  function oturumBitir() {
    if (!Oturum) return;
    Oturum.bitti = true;
    if (!Oturum.kaydedildi && (Oturum.tur === 'karisik' || Oturum.tur === 'konu')) {
      var idler = oturumSorulari();
      var skor = idler.filter(function (id) { return Oturum.ilkSonuc[id] === true; }).length;
      if (Object.keys(Oturum.ilkSonuc).length) {
        durum.sinavlar.push({ konu: Oturum.tur === 'konu' ? Oturum.konu : 'karisik', skor: skor, toplam: idler.length, tarih: new Date().toISOString() });
        if (durum.sinavlar.length > 200) durum.sinavlar.splice(0, durum.sinavlar.length - 200);
        kayitYaz();
      }
    }
    Oturum.kaydedildi = true;
    ciz();
  }

  function oturumSorulari() {
    var gorulen = {}, out = [];
    Oturum.kuyruk.forEach(function (a) { if (!gorulen[a.id]) { gorulen[a.id] = true; out.push(a.id); } });
    return out;
  }

  function tekrarSayfasi() {
    if (Oturum && !Oturum.bitti) return oturumSayfasi();
    if (Oturum && Oturum.bitti) return ozetSayfasi();
    return tekrarKurulum();
  }

  function secimGrubu(ad, etiket, secenekler, varsayilan) {
    var alan = h('fieldset', { class: 'secim' }, h('legend', null, etiket));
    var kap = h('div', { class: 'secim-kap' });
    secenekler.forEach(function (o) {
      var r = h('input', { type: 'radio', name: ad, value: String(o.deger) });
      if (o.deger === varsayilan) r.checked = true;
      kap.appendChild(h('label', { class: 'secim-oge' }, r, h('span', null, o.ad)));
    });
    alan.appendChild(kap);
    alan.deger = function () { var s = alan.querySelector('input:checked'); return s ? s.value : String(varsayilan); };
    return alan;
  }

  function tekrarKurulum() {
    var s = sayfa('Tekrar', 'Üç çalışma biçimi var. Sonuçlar kaydedilir; yanlışların havuza eklenir.');
    if (!ALISTIRMALAR.length) { s.appendChild(bosDurumKutusu('Alıştırma verisi yüklenemedi', '<code>data/alistirmalar-a.js</code> ve <code>data/alistirmalar-b.js</code> dosyalarını kontrol et.')); return s; }

    /* 1) karışık */
    var adet = secimGrubu('adet', 'Soru sayısı', [{ deger: 5, ad: '5' }, { deger: 10, ad: '10' }, { deger: 15, ad: '15' }, { deger: 20, ad: '20' }], 10);
    var zor = secimGrubu('zorluk', 'Zorluk', [{ deger: 0, ad: 'Hepsi' }, { deger: 1, ad: 'Kolay' }, { deger: 2, ad: 'Orta' }, { deger: 3, ad: 'Zor' }], 0);
    var uyari1 = h('p', { class: 'soluk', role: 'status' });
    s.appendChild(h('section', { class: 'panel panel-dolgu' },
      h('h2', null, 'Karışık soru seti'), h('p', { class: 'soluk' }, 'Bütün konulardan rastgele sorular.'), adet, zor,
      h('div', { class: 'dugmeler' }, h('button', { type: 'button', class: 'dugme dugme-ana', onclick: function () {
        var z = Number(zor.deger());
        var havuz = ALISTIRMALAR.filter(function (a) { return !z || a.zorluk === z; });
        if (!havuz.length) { uyari1.textContent = 'Bu zorlukta soru yok.'; return; }
        oturumBaslat({ tur: 'karisik', ad: 'Karışık set', sorular: karistir(havuz).slice(0, Number(adet.deger())) });
      } }, 'Seti başlat'), uyari1)));

    /* 2) yanlışlarım */
    var havuz = yanlisHavuzu();
    s.appendChild(h('section', { class: 'panel panel-dolgu' },
      h('h2', null, 'Yanlışlarım'),
      h('p', { class: 'soluk' }, havuz.length ? 'Havuzda ' + havuz.length + ' soru var. Yanlış bildiğin soru aynı oturumda tekrar sorulur; doğru bilince havuzdan çıkar.' : 'Havuz boş. Bir soruyu yanlış cevapladığında buraya eklenir.'),
      h('div', { class: 'dugmeler' }, h('button', { type: 'button', class: 'dugme dugme-ana', disabled: !havuz.length, onclick: function () {
        oturumBaslat({ tur: 'yanlislar', ad: 'Yanlışlarım', sorular: karistir(yanlisHavuzu().map(function (id) { return alisHarita[id]; })) });
      } }, 'Yanlışlarımı çalış'))));

    /* 3) konu bazlı mini sınav */
    var kid = kimlik('konu');
    var konuSec = h('select', { id: kid, class: 'girdi' });
    KONULAR.forEach(function (k) {
      var n = konuAlistirmalari(k.id).length;
      if (n) konuSec.appendChild(h('option', { value: k.id }, konuEtiketi(k) + ' (' + n + ' soru)'));
    });
    if (durum.sonKonu && konuAlistirmalari(durum.sonKonu).length) konuSec.value = durum.sonKonu;
    var sinavAdet = secimGrubu('sinav-adet', 'Soru sayısı', [{ deger: 5, ad: '5' }, { deger: 7, ad: '7' }, { deger: 10, ad: '10' }], 5);
    s.appendChild(h('section', { class: 'panel panel-dolgu' },
      h('h2', null, 'Konu bazlı mini sınav'), h('p', { class: 'soluk' }, 'Bir konu seç; sonunda skorunu ve yanlışlarının çözümünü gör. Konuda daha az soru varsa hepsi sorulur.'),
      konuSec.options.length ? [h('div', { class: 'alan' }, h('label', { class: 'girdi-etiket', for: kid }, 'Konu'), konuSec), sinavAdet,
        h('div', { class: 'dugmeler' }, h('button', { type: 'button', class: 'dugme dugme-ana', onclick: function () {
          var k = konuHarita[konuSec.value];
          oturumBaslat({ tur: 'konu', ad: 'Mini sınav: ' + konuEtiketi(k), konu: konuSec.value, sorular: karistir(konuAlistirmalari(konuSec.value)).slice(0, Number(sinavAdet.deger())) });
        } }, 'Sınavı başlat'))] : h('p', { class: 'soluk' }, 'Alıştırması olan konu yok.')));
    return s;
  }

  function oturumSayfasi() {
    var o = Oturum;
    var a = o.kuyruk[o.sira];
    var s = sayfa(o.ad);
    var benzersiz = oturumSorulari().length;
    var k = konuHarita[a.konu];
    s.appendChild(h('div', { class: 'oturum-ust' },
      h('span', { class: 'oturum-sayi' }, 'Soru ' + (o.sira + 1) + ' / ' + o.kuyruk.length, o.kuyruk.length > benzersiz ? h('span', { class: 'soluk' }, ' (yanlışlar tekrar soruluyor)') : null),
      ilerlemeCubugu(o.sira, o.kuyruk.length, 'Oturum ilerlemesi'),
      k ? h('a', { class: 'kaynak', href: '#/konu/' + encodeURIComponent(k.id) }, konuEtiketi(k)) : null));

    var cevaplandi = false;
    var sonraki = h('button', { type: 'button', class: 'dugme dugme-ana', onclick: function () { ilerle(); } }, o.sira + 1 >= o.kuyruk.length ? 'Bitir ve özeti gör' : 'Soruyu geç');
    function ilerle() {
      if (!cevaplandi && !(a.id in o.ilkSonuc)) o.bos[a.id] = true;
      if (o.sira + 1 >= o.kuyruk.length) { oturumBitir(); return; }
      o.sira++; ciz();
    }
    s.appendChild(alistirmaBilesen(a, {
      mod: o.tur === 'yanlislar' ? 'yanlislar' : null,
      onIlk: function (dogru) {
        cevaplandi = true;
        if (!(a.id in o.ilkSonuc)) o.ilkSonuc[a.id] = dogru;
        delete o.bos[a.id];
        if (o.tur === 'yanlislar' && !dogru && o.kuyruk.lastIndexOf(a) <= o.sira && o.kuyruk.length < 60) o.kuyruk.push(a);
        if (o.tur === 'yanlislar' && dogru) o.ilkSonuc[a.id] = o.ilkSonuc[a.id] === false ? 'sonra' : true;
        sonraki.textContent = o.sira + 1 >= o.kuyruk.length ? 'Bitir ve özeti gör' : 'Sonraki soru';
      }
    }));
    s.appendChild(h('div', { class: 'dugmeler oturum-alt' }, sonraki,
      h('button', { type: 'button', class: 'dugme dugme-yazi', onclick: function () { oturumBitir(); } }, 'Oturumu bitir')));
    return s;
  }

  function ozetSayfasi() {
    var o = Oturum;
    var idler = oturumSorulari();
    var dogru = idler.filter(function (id) { return o.ilkSonuc[id] === true; }).length;
    var s = sayfa('Oturum özeti', esc(o.ad));
    var y = yuzde(dogru, idler.length);
    s.appendChild(h('div', { class: 'ist-serit', role: 'group', 'aria-label': 'Skor' },
      h('div', { class: 'ist' }, h('span', { class: 'ist-etiket' }, 'İlk denemede doğru'), h('span', { class: 'ist-deger' }, dogru + ' / ' + idler.length)),
      h('div', { class: 'ist' }, h('span', { class: 'ist-etiket' }, 'Başarı'), h('span', { class: 'ist-deger' }, y == null ? '—' : '%' + y)),
      h('div', { class: 'ist' }, h('span', { class: 'ist-etiket' }, 'Yanlışlarım havuzu'), h('span', { class: 'ist-deger' }, String(yanlisHavuzu().length)), h('span', { class: 'ist-alt' }, 'soru bekliyor'))));

    var liste = h('ol', { class: 'ozet-liste' });
    idler.forEach(function (id) {
      var a = alisHarita[id] || o.kuyruk.filter(function (x) { return x.id === id; })[0];
      var r = o.ilkSonuc[id];
      var etiket = r === true ? rozet('Doğru', 'olumlu') : r === 'sonra' ? rozet('Tekrarda doğru', 'notr') : r === false ? rozet('Yanlış', 'hata') : rozet('Boş', 'notr');
      var li = h('li', null, h('div', { class: 'ozet-satir' }, h('span', { class: 'ozet-soru' }, kisalt(duzMetin(a.soru), 120)), etiket));
      if (r !== true) {
        var govde = h('div');
        var det = h('details', { class: 'ozet-cozum' }, h('summary', null, 'Çözümü gör'), govde);
        det.addEventListener('toggle', function () { if (det.open && !govde.firstChild) { if (a.kod && a.tur !== 'bosluk-doldur') govde.appendChild(kodBlok(a.kod)); govde.appendChild(cozumIcerik(a)); } });
        li.appendChild(det);
      }
      liste.appendChild(li);
    });
    s.appendChild(h('h2', { class: 'bolum-baslik' }, 'Sorular'));
    s.appendChild(liste);
    s.appendChild(h('div', { class: 'dugmeler' },
      h('button', { type: 'button', class: 'dugme dugme-ana', onclick: function () { Oturum = null; ciz(); } }, 'Yeni oturum kur'),
      yanlisHavuzu().length ? h('button', { type: 'button', class: 'dugme', onclick: function () { oturumBaslat({ tur: 'yanlislar', ad: 'Yanlışlarım', sorular: karistir(yanlisHavuzu().map(function (id) { return alisHarita[id]; })) }); } }, 'Yanlışlarımı çalış (' + yanlisHavuzu().length + ')') : null,
      h('a', { class: 'dugme', href: '#/', onclick: function () { Oturum = null; } }, 'Ana sayfa')));
    return s;
  }

  /* ----- Hızlı başvuru kartı ----- */

  function kartSayfasi() {
    var s = sayfa('Hızlı başvuru kartı', 'Dersteki bütün sözdizimi tek sayfada. Yazdırıp sınavdan önce göz atabilirsin.');
    s.classList.add('sayfa-genis', 'sayfa-kart');
    if (!KART.length) { s.appendChild(bosDurumKutusu('Kart verisi yüklenemedi', '<code>data/kart.js</code> dosyasını kontrol et.')); return s; }
    s.querySelector('.sayfa-ust').appendChild(h('div', { class: 'dugmeler yazdirma-gizle' }, h('button', { type: 'button', class: 'dugme dugme-ana', onclick: function () { window.print(); } }, 'Yazdır')));
    var kap = h('div', { class: 'kart-izgara' });
    KART.forEach(function (b) {
      var satirlar = Array.isArray(b.satirlar) ? b.satirlar : [];
      kap.appendChild(h('section', { class: 'kart-bolum' }, h('h2', null, b.baslik || ''),
        h('table', { class: 'kart-tablo' }, h('tbody', null, satirlar.map(function (r) {
          return h('tr', null, h('th', { scope: 'row' }, h('code', { class: 'kod-satir', html: renklendir(r && r.soz != null ? r.soz : '') })), h('td', { html: r && r.anlam != null ? r.anlam : '' }));
        })))));
    });
    s.appendChild(kap);
    return s;
  }

  /* ----- İlerleme ----- */

  function ilerlemeSayfasi() {
    var s = sayfa('İlerleme', 'Kayıtlar yalnızca bu tarayıcıda tutulur.');
    s.appendChild(istatistikSeridi(genelIstatistik()));

    s.appendChild(h('h2', { class: 'bolum-baslik' }, 'Konu konu'));
    if (!KONULAR.length) s.appendChild(bosDurumKutusu('Konu verisi yok'));
    else {
      s.appendChild(h('div', { class: 'tablo-kaydir', tabindex: '0', role: 'region', 'aria-label': 'Konu ilerleme tablosu' }, h('table', { class: 'tablo tablo-veri' },
        h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Konu'), h('th', { scope: 'col' }, 'Durum'), h('th', { scope: 'col', class: 'sayi' }, 'Çözülen'), h('th', { scope: 'col', class: 'sayi' }, 'Deneme'), h('th', { scope: 'col', class: 'sayi' }, 'Doğruluk'))),
        h('tbody', null, KONULAR.map(function (k) {
          var st = konuIstatistik(k.id);
          return h('tr', null,
            h('th', { scope: 'row' }, h('a', { href: '#/konu/' + encodeURIComponent(k.id) }, konuEtiketi(k))),
            h('td', null, durum.tamamlananKonular[k.id] ? rozet('Tamamlandı', 'olumlu') : h('span', { class: 'soluk' }, st.deneme ? 'Sürüyor' : 'Başlanmadı')),
            h('td', { class: 'sayi' }, st.toplam ? st.cozulen + ' / ' + st.toplam : '—'),
            h('td', { class: 'sayi' }, String(st.deneme)),
            h('td', { class: 'sayi' }, yuzdeYaz(st.dogruDeneme, st.deneme)));
        })))));
    }

    s.appendChild(h('h2', { class: 'bolum-baslik' }, 'Sınav ve set geçmişi'));
    if (!durum.sinavlar.length) s.appendChild(h('p', { class: 'soluk' }, 'Henüz tamamlanmış bir mini sınav ya da karışık set yok. “Tekrar” bölümünden başlatabilirsin.'));
    else {
      s.appendChild(h('div', { class: 'tablo-kaydir', tabindex: '0', role: 'region', 'aria-label': 'Sınav geçmişi' }, h('table', { class: 'tablo tablo-veri' },
        h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Tarih'), h('th', { scope: 'col' }, 'Tür'), h('th', { scope: 'col', class: 'sayi' }, 'Skor'), h('th', { scope: 'col', class: 'sayi' }, 'Başarı'))),
        h('tbody', null, durum.sinavlar.slice().reverse().slice(0, 30).map(function (x) {
          var k = konuHarita[x.konu];
          return h('tr', null, h('td', null, tarihYaz(x.tarih)), h('td', null, x.konu === 'karisik' ? 'Karışık set' : k ? konuEtiketi(k) : String(x.konu || '')),
            h('td', { class: 'sayi' }, (x.skor | 0) + ' / ' + (x.toplam | 0)), h('td', { class: 'sayi' }, yuzdeYaz(x.skor | 0, x.toplam | 0)));
        })))));
    }

    s.appendChild(h('h2', { class: 'bolum-baslik' }, 'Sıfırlama'));
    var onayYeri = h('div');
    var bilgi = h('p', { class: 'soluk', role: 'status' });
    s.appendChild(h('p', { class: 'soluk' }, 'Tamamlanan konular, alıştırma sonuçları, yanlış havuzu ve sınav geçmişi silinir. Tema tercihin kalır.'));
    s.appendChild(h('div', { class: 'dugmeler' }, h('button', { type: 'button', class: 'dugme', onclick: function () {
      if (onayYeri.firstChild) return;
      onayYeri.appendChild(onayKutusu('Bütün ilerleme kaydı silinsin mi? Bu işlem geri alınamaz.', 'Evet, sıfırla', function () {
        var tema = durum.tema;
        durum = bosDurum(); durum.tema = tema; kayitYaz();
        Oturum = null;
        ciz();
        var b = document.querySelector('.sifir-bilgi'); if (b) b.textContent = 'İlerleme sıfırlandı.';
      }));
    } }, 'İlerlemeyi sıfırla')));
    bilgi.classList.add('sifir-bilgi');
    ekle(s, [onayYeri, bilgi]);
    return s;
  }

  /* ================= 9. Kabuk ve yönlendirici ================= */

  var GEZINME = [
    { yol: '', ad: 'Konular' },
    { yol: 'uygulama', ad: 'Uygulama alanı' },
    { yol: 'tekrar', ad: 'Tekrar' },
    { yol: 'hatalarim', ad: 'Hatalarım' },
    { yol: 'sorularim', ad: 'Sorularım' },
    { yol: 'yeni', ad: 'Yeni' },
    { yol: 'kart', ad: 'Kart' },
    { yol: 'ilerleme', ad: 'İlerleme' }
  ];

  var kok = document.getElementById('app');
  var anaEl, navEl, menuDugme, temaDugme;
  var mevcutKonu = null;

  function kabukKur() {
    kok.innerHTML = '';
    navEl = h('nav', { class: 'ust-nav', id: 'ust-nav', 'aria-label': 'Ana gezinme' },
      h('ul', null, GEZINME.map(function (g) { return h('li', null, h('a', { href: '#/' + g.yol, 'data-yol': g.yol }, g.ad)); })));
    menuDugme = h('button', { type: 'button', class: 'dugme dugme-ikon menu-dugme', 'aria-expanded': 'false', 'aria-controls': 'ust-nav', onclick: function () { menuAyarla(!navEl.classList.contains('acik')); } });
    temaDugme = h('button', { type: 'button', class: 'dugme dugme-ikon tema-dugme', onclick: function () {
      durum.tema = koyuMu() ? 'acik' : 'koyu'; kayitYaz(); temaUygula(); temaDugmeGuncelle();
    } });
    anaEl = h('main', { id: 'icerik', tabindex: '-1' });
    var anaBag = h('p', { class: 'alt-ana' }, h('a', { href: '../index.html' }, '← Ana sayfa'));
    ekle(kok, [
      h('header', { class: 'ust' }, h('div', { class: 'ust-ic' },
        h('a', { class: 'marka', href: '#/' }, h('span', { class: 'marka-isaret', 'aria-hidden': 'true' }, '>>'), h('span', null, 'MATLAB çalışma defteri')),
        navEl, h('div', { class: 'ust-sag' }, temaDugme, menuDugme))),
      anaEl,
      h('footer', { class: 'alt' }, anaBag, h('p', null, 'İlerlemen yalnızca bu tarayıcıda saklanır. Site internet olmadan çalışır.'))
    ]);
    anaSayfaBagiDenetle(anaBag);
    menuAyarla(false);
    temaDugmeGuncelle();
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && navEl.classList.contains('acik')) { menuAyarla(false); menuDugme.focus(); } });
    navEl.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) menuAyarla(false); });
  }

  /* "← Ana sayfa" (../index.html) yalnızca site ana sayfanın altında (yayındaki /sozdizimi/ düzeni) dururken vardır.
     http(s) üzerinde düzen derle.sh ile sabittir, bağlantı hep görünür. Dosyadan (file://) açılınca üst klasörde ana sayfa
     olmayabilir (yalnız bu klasör açılmışsa): bağlantı gizli başlar, ../index.html gerçekten varsa gösterilir.
     Yoklama <link rel="preload"> ile yapılır: dosya yalnızca indirilir (çalıştırılmaz/uygulanmaz), varsa load, yoksa error
     tetiklenir. Olay hiç gelmezse (preload desteklemeyen tarayıcı) bağlantı gizli kalır; kırık bağlantı gösterilmez. */
  function anaSayfaBagiDenetle(el) {
    if (location.protocol !== 'file:') return;
    el.hidden = true;
    var yokla = document.createElement('link');
    yokla.rel = 'preload'; yokla.as = 'fetch'; yokla.href = el.querySelector('a').getAttribute('href');
    yokla.onload = function () { el.hidden = false; yokla.remove(); };
    yokla.onerror = function () { yokla.remove(); };
    document.head.appendChild(yokla);
  }

  function menuAyarla(acik) {
    navEl.classList.toggle('acik', acik);
    menuDugme.setAttribute('aria-expanded', acik ? 'true' : 'false');
    menuDugme.setAttribute('aria-label', acik ? 'Menüyü kapat' : 'Menüyü aç');
    menuDugme.innerHTML = ikon(acik ? 'kapat' : 'menu');
  }

  function temaDugmeGuncelle() {
    var koyu = koyuMu();
    temaDugme.innerHTML = ikon(koyu ? 'gunes' : 'ay');
    temaDugme.setAttribute('aria-label', koyu ? 'Açık temaya geç' : 'Koyu temaya geç');
    temaDugme.setAttribute('title', koyu ? 'Açık tema' : 'Koyu tema');
  }

  function rotaOku() {
    var ham = (location.hash || '').replace(/^#\/?/, '');
    return ham.split('/').filter(Boolean).map(function (p) { try { return decodeURIComponent(p); } catch (e) { return p; } });
  }

  function capayaKay(id) {
    var el = id ? document.getElementById(id) : null;
    if (!el) return false;
    el.scrollIntoView({ block: 'start' });
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    try { el.focus({ preventScroll: true }); } catch (e) { /* eski tarayıcı */ }
    return true;
  }

  function ciz() {
    var p = rotaOku();
    var yol = p[0] || '';
    var sayfaEl, baslik, navYol = yol;

    /* aynı konuda yalnızca çapa değiştiyse yeniden çizme */
    if (yol === 'konu' && mevcutKonu === p[1] && p[2] && anaEl.firstChild) { capayaKay(p[2]); return; }
    mevcutKonu = null;

    try {
      switch (yol) {
        case '': sayfaEl = anaSayfa(); baslik = null; break;
        case 'konu': sayfaEl = konuSayfasi(p[1]); baslik = konuHarita[p[1]] ? konuHarita[p[1]].baslik : 'Konu'; navYol = ''; mevcutKonu = p[1]; break;
        case 'hatalarim': sayfaEl = hatalarimSayfasi(); baslik = 'Benim hatalarım'; break;
        case 'sorularim': sayfaEl = sorularimSayfasi(); baslik = 'Sorduğum sorular'; break;
        case 'yeni': sayfaEl = yeniSayfasi(); baslik = 'Yeni'; break;
        case 'uygulama': sayfaEl = uygulamaSayfasi(); baslik = 'Uygulama alanı'; break;
        case 'tekrar': sayfaEl = tekrarSayfasi(); baslik = 'Tekrar'; break;
        case 'kart': sayfaEl = kartSayfasi(); baslik = 'Hızlı başvuru kartı'; break;
        case 'ilerleme': sayfaEl = ilerlemeSayfasi(); baslik = 'İlerleme'; break;
        default:
          sayfaEl = sayfa('Sayfa bulunamadı');
          sayfaEl.appendChild(bosDurumKutusu('Bu adreste bir sayfa yok', '<a href="#/">Ana sayfaya dön</a>'));
          baslik = 'Sayfa bulunamadı';
      }
    } catch (e) {
      sayfaEl = sayfa('Bir şeyler ters gitti');
      sayfaEl.appendChild(bosDurumKutusu('Sayfa çizilirken hata oluştu', esc(e && e.message || e) + ' — <a href="#/">Ana sayfaya dön</a>'));
      baslik = 'Hata';
    }

    anaEl.innerHTML = '';
    anaEl.appendChild(sayfaEl);
    document.title = (baslik ? baslik + ' · ' : '') + 'MATLAB Çalışma Defteri';
    var baglar = navEl.querySelectorAll('a');
    for (var i = 0; i < baglar.length; i++) {
      if (baglar[i].getAttribute('data-yol') === navYol) baglar[i].setAttribute('aria-current', 'page');
      else baglar[i].removeAttribute('aria-current');
    }
    if (!(yol === 'konu' && p[2] && capayaKay(p[2]))) {
      window.scrollTo(0, 0);
      if (!ilkCizim) { var h1 = anaEl.querySelector('h1'); if (h1) { try { h1.focus({ preventScroll: true }); } catch (e2) { /* yok say */ } } }
    }
    ilkCizim = false;
  }

  var ilkCizim = true;

  if (!kok) return;
  temaUygula();
  kabukKur();
  window.addEventListener('hashchange', function () {
    /* tekrar oturumu sürerken başka sayfaya gidilirse oturum bellekte kalır; geri dönünce sürer */
    ciz();
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var dinle = function () { temaDugmeGuncelle(); };
    if (mq.addEventListener) mq.addEventListener('change', dinle); else if (mq.addListener) mq.addListener(dinle);
  }
  ciz();
})();
