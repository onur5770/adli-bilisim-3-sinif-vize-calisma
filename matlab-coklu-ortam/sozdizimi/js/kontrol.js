/* kontrol.js — alıştırma cevap denetimi (UMD)
 * Kontrol.kontrolEt(alistirma, cevap) → {dogru, mesaj, ayrinti?}
 *   cevap: coktan-secmeli → indeks (sayı) | cikti-tahmin, kisa-cevap → metin |
 *          bosluk-doldur → metin dizisi | kod-yaz, hata-bul → kod metni
 * Kontrol.dogrula(alistirma) → {id, gecerli, hatalar:[], uyarilar:[]}
 * Kontrol.dogrulaHepsi(liste, konular?) → {gecerli, toplam, sorunlu:[...], hatalar:[...]}
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.Kontrol = api;
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  var TOLERANS = 0.01;
  var TURLER = ['coktan-secmeli', 'cikti-tahmin', 'kisa-cevap', 'bosluk-doldur', 'kod-yaz', 'hata-bul'];
  var enjekte = null;

  /* ---------- yorumlayıcıya erişim ---------- */

  function yorumlayiciSinifi() {
    if (enjekte) return enjekte;
    var M = root && root.MiniMatlab;
    if (!M && typeof require === 'function' && typeof module !== 'undefined') {
      try { M = require('./matlab.js'); } catch (e) { M = null; }
    }
    if (M && typeof M !== 'function' && typeof M.MiniMatlab === 'function') M = M.MiniMatlab;
    return typeof M === 'function' ? M : null;
  }

  function calistir(onKod, kod) {
    var M = yorumlayiciSinifi();
    if (!M) return { yok: true };
    var m;
    try {
      m = new M();
      if (onKod && String(onKod).trim()) {
        var r0 = m.run(String(onKod));
        if (r0 && r0.error) return { onHata: r0.error, sonuc: r0 };
      }
      return { sonuc: m.run(String(kod)) || {} };
    } catch (e) {
      return { sonuc: { output: '', vars: {}, error: { message: String(e && e.message || e), mesajTr: 'Yorumlayıcı beklenmedik bir hatayla durdu.' } } };
    }
  }

  /* ---------- metin yardımcıları ---------- */

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function kodEt(s) { return '<code>' + esc(s) + '</code>'; }

  function htmlSil(s) {
    return String(s == null ? '' : s).replace(/<[^>]*>/g, '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  }

  var TR = { 'ı': 'i', 'İ': 'i', 'I': 'i', 'ş': 's', 'Ş': 's', 'ğ': 'g', 'Ğ': 'g', 'ü': 'u', 'Ü': 'u', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c', 'â': 'a', 'î': 'i', 'û': 'u' };

  /* büyük/küçük harf, Türkçe karakter ve boşluk farklarını giderir */
  function normMetin(s) {
    return String(s == null ? '' : s)
      .replace(/[ıİIşŞğĞüÜöÖçÇâîû]/g, function (c) { return TR[c]; })
      .toLowerCase()
      .replace(/[‘’ʼ`´]/g, "'").replace(/[“”]/g, '"')
      .replace(/×/g, 'x')
      .replace(/\s+/g, ' ').trim();
  }
  function sikiMetin(s) { return normMetin(s).replace(/\s+/g, ''); }

  /* Yorum satırlarını ayıklar; dizgi içindeki % korunur, devrik ' dizgi sanılmaz. */
  function yorumsuz(kod) {
    return String(kod == null ? '' : kod).replace(/\r\n?/g, '\n').split('\n').map(function (s) {
      var devrik = false;
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        if (c === '%') return s.slice(0, i).replace(/\s+$/, '');
        if (c === '"' || (c === "'" && !devrik)) {
          var k = i + 1;
          while (k < s.length) {
            if (s[k] === c) { if (s[k + 1] === c) { k += 2; continue; } break; }
            k++;
          }
          i = k; devrik = true; continue;
        }
        devrik = /[A-Za-z0-9_)\]}'.]/.test(c);
      }
      return s;
    }).join('\n');
  }

  /* ---------- sayı çıkarma ---------- */

  /* Metindeki sayıları sırayla çıkarır. "ans =", "x2 =" gibi ekler, köşeli parantez, virgül,
   * noktalı virgül ve satır sonları yok sayılır. MATLAB çıktısındaki "Columns 1 through 8"
   * başlıkları atlanır, "1.0e+03 *" ölçek satırı izleyen sayılara uygulanır. */
  function sayilar(metin) {
    var s = htmlSil(metin).replace(/\r\n?/g, '\n').replace(/−/g, '-');
    var out = [];
    var olcek = 1;
    var satirlar = s.split('\n');
    for (var si = 0; si < satirlar.length; si++) {
      var satir = satirlar[si];
      if (/^\s*Columns?\s+\d+(\s+(through|and)\s+\d+)?\s*:?\s*$/i.test(satir)) continue;
      var om = /^\s*1\.0+e([+-]?\d+)\s*\*\s*$/i.exec(satir);
      if (om) { olcek = Math.pow(10, parseInt(om[1], 10)); continue; }
      if (/^\s*[A-Za-z_]\w*(\(:,:,\d+\))?\s*=\s*$/.test(satir)) olcek = 1;
      satir = satir.replace(/^\s*[A-Za-z_]\w*(\([^)]*\))?\s*=(?!=)/, ' ');
      satir = satir.replace(/(\d)\s*[xX\u00D7]\s*(?=\d)/g, '$1 '); /* 3x3, 3×3 → 3 3 */
      var re = /(^|[^A-Za-z0-9_.])([-+]?)((?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?|Inf\b|NaN\b|true\b|false\b)/g;
      var m;
      while ((m = re.exec(satir))) {
        var ham = m[3], v;
        if (ham === 'Inf') v = Infinity;
        else if (ham === 'NaN') v = NaN;
        else if (ham === 'true') v = 1;
        else if (ham === 'false') v = 0;
        else v = parseFloat(ham) * olcek;
        if (m[2] === '-') v = -v;
        out.push(v);
      }
    }
    return out;
  }

  function sayiEsit(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') return false;
    if (isNaN(a) || isNaN(b)) return isNaN(a) && isNaN(b);
    if (!isFinite(a) || !isFinite(b)) return a === b;
    return Math.abs(a - b) <= TOLERANS + 1e-9;
  }

  function diziEsit(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (!sayiEsit(a[i], b[i])) return false;
    return true;
  }

  /* Türkçe ondalık virgül: "4,5" → "4.5" (yalnızca tek sayı beklenirken) */
  function ondalikVirgul(s) { return String(s).replace(/(\d),(\d)/g, '$1.$2'); }

  function sayisalEsit(cevap, beklenen) {
    var b = sayilar(beklenen);
    if (!b.length) return null; /* sayısal karşılaştırma yapılamaz */
    var c = sayilar(cevap);
    if (diziEsit(c, b)) return true;
    if (b.length === 1) {
      var c2 = sayilar(ondalikVirgul(cevap));
      if (diziEsit(c2, b)) return true;
    }
    return false;
  }

  function metinEsit(cevap, beklenen) {
    var c = sikiMetin(cevap), b = sikiMetin(htmlSil(beklenen));
    if (!c) return false;
    if (c === b) return true;
    /* baştaki "ans =" eki ve çevreleyen tırnaklar hoş görülür */
    var soy = function (x) { return x.replace(/^ans=/, '').replace(/^['"]|['"]$/g, '').replace(/[.;]+$/, ''); };
    return soy(c) === soy(b) && soy(c) !== '';
  }

  /* ---------- türlere göre denetim ---------- */

  function sonuc(dogru, mesaj, ayrinti) {
    var r = { dogru: !!dogru, mesaj: mesaj };
    if (ayrinti) r.ayrinti = ayrinti;
    return r;
  }

  function bosMu(c) { return c == null || (typeof c === 'string' && !c.trim()); }

  function coktanSecmeli(a, cevap) {
    if (cevap == null || cevap === '' || isNaN(Number(cevap))) return sonuc(false, 'Önce bir seçenek işaretle.', { bos: true });
    var d = Number(cevap) === Number(a.dogru);
    return sonuc(d, d ? 'Doğru.' : 'Bu seçenek doğru değil.');
  }

  function ciktiTahmin(a, cevap) {
    if (bosMu(cevap)) return sonuc(false, 'Önce cevabını yaz.', { bos: true });
    var adaylar = [a.beklenen].concat(Array.isArray(a.kabul) ? a.kabul : []);
    var metinModu = a.karsilastirma === 'metin';
    for (var i = 0; i < adaylar.length; i++) {
      var b = adaylar[i];
      if (b == null) continue;
      b = String(b);
      if (!metinModu) {
        var se = sayisalEsit(cevap, b);
        if (se === true) return sonuc(true, 'Doğru.');
        if (se === null && metinEsit(cevap, b)) return sonuc(true, 'Doğru.');
      } else if (metinEsit(cevap, b)) return sonuc(true, 'Doğru.');
    }
    /* yanlış: cevabı ele vermeden yön göster */
    var mesaj = 'Yanlış.';
    if (!metinModu) {
      var bs = sayilar(String(a.beklenen)), cs = sayilar(String(cevap));
      if (bs.length) {
        if (!cs.length) mesaj = 'Cevabında sayı bulamadım. Ekranda görünecek sayıları yaz.';
        else if (cs.length !== bs.length) mesaj = 'Yanlış. Sen ' + cs.length + ' sayı yazdın; ekranda ' + bs.length + ' sayı görünmeli.';
        else {
          var fark = 0;
          for (var k = 0; k < bs.length; k++) if (!sayiEsit(cs[k], bs[k])) fark++;
          mesaj = bs.length === 1 ? 'Yanlış. Sayı tutmuyor.' : 'Yanlış. ' + bs.length + ' sayıdan ' + fark + ' tanesi tutmuyor.';
        }
      }
    }
    return sonuc(false, mesaj);
  }

  function tekCevapUyar(cevap, kabul) {
    var c = normMetin(cevap), cs = sikiMetin(cevap);
    for (var i = 0; i < kabul.length; i++) {
      var k = String(kabul[i]);
      if (c === normMetin(k) || cs === sikiMetin(k)) return true;
      /* ikisi de yalın sayıysa sayısal karşılaştır (4,5 = 4.5) */
      var ks = k.trim(), cv = String(cevap).trim();
      if (/^[-+]?\d+([.,]\d+)?$/.test(ks) && /^[-+]?\d+([.,]\d+)?$/.test(cv)) {
        if (sayiEsit(parseFloat(ks.replace(',', '.')), parseFloat(cv.replace(',', '.')))) return true;
      }
    }
    return false;
  }

  function regexUyar(desen, cevap) {
    var re;
    try { re = new RegExp(desen, 'i'); } catch (e) { return false; }
    var ham = String(cevap).trim();
    return re.test(ham) || re.test(normMetin(ham));
  }

  function kisaCevap(a, cevap) {
    if (bosMu(cevap)) return sonuc(false, 'Önce cevabını yaz.', { bos: true });
    var d = false;
    if (Array.isArray(a.kabul) && tekCevapUyar(cevap, a.kabul)) d = true;
    if (!d && a.regex && regexUyar(a.regex, cevap)) d = true;
    return sonuc(d, d ? 'Doğru.' : 'Yanlış.');
  }

  function boslukDoldur(a, cevap) {
    var bosluklar = Array.isArray(a.bosluklar) ? a.bosluklar : [];
    var c = Array.isArray(cevap) ? cevap : [cevap];
    var hepsiBos = true, yanlis = [];
    for (var i = 0; i < bosluklar.length; i++) {
      var v = c[i] == null ? '' : String(c[i]);
      if (v.trim()) hepsiBos = false;
      var kabul = Array.isArray(bosluklar[i]) ? bosluklar[i] : [bosluklar[i]];
      if (!v.trim() || !tekCevapUyar(v, kabul)) yanlis.push(i);
    }
    if (hepsiBos) return sonuc(false, 'Önce boşlukları doldur.', { bos: true, yanlisBosluklar: yanlis });
    if (!yanlis.length) return sonuc(true, 'Doğru.', { yanlisBosluklar: [] });
    var mesaj = bosluklar.length === 1 ? 'Yanlış.' :
      'Yanlış. Tutmayan boşluk: ' + yanlis.map(function (x) { return (x + 1) + '.'; }).join(', ') + ' (soldan sağa, yukarıdan aşağıya sayılır).';
    return sonuc(false, mesaj, { yanlisBosluklar: yanlis });
  }

  /* ----- değişken karşılaştırma ----- */

  function duzlestir(v, out) {
    if (Array.isArray(v)) for (var i = 0; i < v.length; i++) duzlestir(v[i], out);
    else if (typeof v === 'boolean') out.push(v ? 1 : 0);
    else if (typeof v === 'number') out.push(v);
    else if (v == null) out.push(NaN);
    else out.push(Number(v));
    return out;
  }

  /* beklenen değerin boyutu: sayı → 1×1, [..] → 1×n, [[..],..] → r×c, 3 katlı → r×c×p (sayfa dizisi) */
  function beklenenBoyut(v) {
    if (!Array.isArray(v)) return [1, 1];
    if (!v.length) return [0, 0];
    if (!Array.isArray(v[0])) return [1, v.length];
    if (!Array.isArray(v[0][0])) return [v.length, v[0].length];
    return [v[0].length, v[0][0].length, v.length];
  }

  function gercekBoyut(d) {
    if (d && Array.isArray(d.size) && d.size.length >= 2) return d.size.slice();
    return beklenenBoyut(d ? d.data : null);
  }

  function boyutKirp(b) {
    b = b.slice();
    while (b.length > 2 && b[b.length - 1] === 1) b.pop();
    return b;
  }

  function boyutYaz(b) { return boyutKirp(b).join('×'); }

  function sayiYaz(x) {
    if (typeof x !== 'number') return String(x);
    if (isNaN(x)) return 'NaN';
    if (!isFinite(x)) return x > 0 ? 'Inf' : '-Inf';
    if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x));
    return String(Math.round(x * 10000) / 10000);
  }

  /* küçük değişkenleri MATLAB yazımıyla gösterir: [1 2; 3 4] */
  function degerYaz(d) {
    if (!d) return '';
    if (typeof d.data === 'string') return "'" + d.data + "'";
    var b = boyutKirp(gercekBoyut(d));
    var duz = duzlestir(d.data, []);
    if (b.length > 2 || duz.length > 16) return '';
    if (duz.length === 1) return sayiYaz(duz[0]);
    var veri = d.data;
    if (Array.isArray(veri) && veri.length && !Array.isArray(veri[0])) veri = [veri];
    if (!Array.isArray(veri)) return '';
    return '[' + veri.map(function (s) { return s.map(sayiYaz).join(' '); }).join('; ') + ']';
  }

  function degiskenKarsilastir(ad, beklenen, vars) {
    var d = vars ? vars[ad] : null;
    if (!d) {
      var benzer = null;
      if (vars) Object.keys(vars).forEach(function (k) { if (k !== ad && k.toLowerCase() === ad.toLowerCase()) benzer = k; });
      var m = kodEt(ad) + ' adında bir değişken oluşmadı.';
      if (benzer) m += ' Sen ' + kodEt(benzer) + ' yazmışsın; MATLAB büyük-küçük harfi ayırır.';
      else m += ' Sonucu tam bu isimle bir değişkene atamalısın.';
      return m;
    }
    if (typeof beklenen === 'string') {
      if (typeof d.data === 'string' ? d.data === beklenen : false) return null;
      return kodEt(ad) + ' değişkeni beklenen metni içermiyor' + (typeof d.data === 'string' ? ': senin sonucun ' + kodEt("'" + d.data + "'") + '.' : '; metin (char) olmalı, seninki ' + esc(d.cls || 'sayı') + '.');
    }
    if (typeof d.data === 'string') {
      return kodEt(ad) + ' değişkeni sayı olmalı; seninki metin (char): ' + kodEt("'" + d.data + "'") + '.';
    }
    var bb = boyutKirp(beklenenBoyut(beklenen)), gb = boyutKirp(gercekBoyut(d));
    var bd = duzlestir(beklenen, []), gd = duzlestir(d.data, []);
    if (bb.join('x') !== gb.join('x') || bd.length !== gd.length) {
      var ek = '';
      if (bb.length === 2 && gb.length === 2 && bb[0] === gb[1] && bb[1] === gb[0] && bb[0] !== bb[1]) ek = ' Satır ve sütun yer değiştirmiş olabilir.';
      return kodEt(ad) + ' değişkeninin boyutu beklenenden farklı: seninki ' + boyutYaz(gb) + ', beklenen ' + boyutYaz(bb) + '.' + ek;
    }
    var farkli = [];
    for (var i = 0; i < bd.length; i++) if (!sayiEsit(gd[i], bd[i])) farkli.push(i);
    if (!farkli.length) return null;
    var yazi = degerYaz(d);
    var mesaj = kodEt(ad) + ' değişkeni beklenen değerde değil';
    if (yazi) mesaj += ': senin sonucun ' + kodEt(yazi);
    if (bd.length > 1) {
      mesaj += (yazi ? ', ' : ': ') + 'beklenen boyut ' + boyutYaz(bb) + ' (boyut doğru)';
      mesaj += '; ' + bd.length + ' elemandan ' + farkli.length + ' tanesi farklı';
      if (bb.length === 2) {
        var ilk = farkli[0], c = bb[1];
        mesaj += ', ilk fark (' + (Math.floor(ilk / c) + 1) + ',' + (ilk % c + 1) + ') konumunda';
      }
    }
    return mesaj + '.';
  }

  /* regex'i öğrenciye gösterilebilir hâle getirir */
  function desenOku(d) {
    return String(d).replace(/\\b/g, '').replace(/\\s[*+]?/g, ' ').replace(/\(\?:/g, '(')
      .replace(/\\([.()\[\]*+^$|\\\/{}?-])/g, '$1').replace(/^\^|\$$/g, '').replace(/\s+/g, ' ').trim();
  }

  function hataMesaji(err) {
    var m = '';
    if (err.line != null) m += '<strong>' + esc(err.line) + '. satırda hata.</strong> ';
    else m += '<strong>Kod hata verdi.</strong> ';
    if (err.mesajTr) m += esc(err.mesajTr) + ' ';
    if (err.message) m += '<span class="k-ing">(' + esc(err.message) + ')</span>';
    return m;
  }

  function kodYaz(a, cevap) {
    var kod = String(cevap == null ? '' : cevap);
    if (!yorumsuz(kod).trim()) return sonuc(false, 'Önce kodunu yaz.', { bos: true });
    var k = a.kontrol || {};
    var c = calistir(a.onKod, kod);
    if (c.yok) return sonuc(false, 'Yorumlayıcı (<code>js/matlab.js</code>) yüklenemediği için kod çalıştırılamadı.', { sistem: true });
    if (c.onHata) return sonuc(false, 'Sorunun hazırlık kodu çalışmadı: ' + esc(c.onHata.message || ''), { sistem: true });
    var r = c.sonuc;
    var ayr = { cikti: r.output || '', hata: r.error || null, figurler: r.figures || [], sorunlar: [] };

    if (r.error) return sonuc(false, hataMesaji(r.error), ayr);

    var sorunlar = [];
    var temiz = yorumsuz(kod);

    (Array.isArray(k.icermeli) ? k.icermeli : []).forEach(function (d) {
      var re; try { re = new RegExp(d); } catch (e) { return; }
      if (!re.test(temiz)) sorunlar.push('Kodunda beklenen bir yapı yok: ' + kodEt(desenOku(d)) + '. Soru bunun kullanılmasını istiyor.');
    });
    (Array.isArray(k.icermemeli) ? k.icermemeli : []).forEach(function (d) {
      var re; try { re = new RegExp(d); } catch (e) { return; }
      if (re.test(temiz)) sorunlar.push('Kodunda bu soruda kullanılmaması gereken bir şey var: ' + kodEt(desenOku(d)) + '.');
    });

    if (k.degiskenler && typeof k.degiskenler === 'object') {
      Object.keys(k.degiskenler).forEach(function (ad) {
        var m = degiskenKarsilastir(ad, k.degiskenler[ad], r.vars || {});
        if (m) sorunlar.push(m);
      });
    }

    if (k.cikti != null && String(k.cikti) !== '') {
      var bs = sayilar(String(k.cikti));
      if (bs.length) {
        var cs = sayilar(r.output || '');
        if (!diziEsit(cs, bs)) {
          if (!cs.length) sorunlar.push('Kodun ekrana sayı yazdırmadı. Sonucu gösteren satırın sonundaki <code>;</code> işaretini kaldırmayı ya da <code>disp</code> kullanmayı dene.');
          else if (cs.length !== bs.length) sorunlar.push('Ekran çıktısı beklenenle uyuşmuyor: ' + cs.length + ' sayı yazdırdın, ' + bs.length + ' sayı bekleniyordu. Fazladan ya da eksik gösterilen satır olabilir (<code>;</code> işaretlerine bak).');
          else sorunlar.push('Ekran çıktısındaki sayılar beklenenle uyuşmuyor.');
        }
      } else if (sikiMetin(r.output || '').indexOf(sikiMetin(k.cikti)) < 0) {
        sorunlar.push('Ekran çıktısı beklenen metni içermiyor.');
      }
    }

    ayr.sorunlar = sorunlar;
    if (!sorunlar.length) return sonuc(true, 'Doğru. Kodun çalıştı ve bütün koşulları sağladı.', ayr);
    var mesaj = sorunlar.length === 1 ? sorunlar[0] :
      'Kod hatasız çalıştı ama ' + sorunlar.length + ' koşul tutmadı:<ul>' + sorunlar.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>';
    return sonuc(false, mesaj, ayr);
  }

  function kontrolEt(a, cevap) {
    if (!a || typeof a !== 'object') return sonuc(false, 'Alıştırma verisi okunamadı.', { sistem: true });
    try {
      switch (a.tur) {
        case 'coktan-secmeli': return coktanSecmeli(a, cevap);
        case 'cikti-tahmin': return ciktiTahmin(a, cevap);
        case 'kisa-cevap': return kisaCevap(a, cevap);
        case 'bosluk-doldur': return boslukDoldur(a, cevap);
        case 'kod-yaz':
        case 'hata-bul': return kodYaz(a, cevap);
        default: return sonuc(false, 'Bilinmeyen alıştırma türü: ' + esc(a.tur), { sistem: true });
      }
    } catch (e) {
      return sonuc(false, 'Kontrol sırasında beklenmedik bir sorun oluştu: ' + esc(e && e.message || e), { sistem: true });
    }
  }

  /* ---------- şema doğrulama (test ajanı için) ---------- */

  function dogrula(a) {
    var hatalar = [], uyarilar = [];
    var id = a && a.id;
    function h(m) { hatalar.push(m); }
    function u(m) { uyarilar.push(m); }
    function dolu(x) { return typeof x === 'string' && x.trim() !== ''; }

    if (!a || typeof a !== 'object') return { id: id, gecerli: false, hatalar: ['alıştırma bir nesne değil'], uyarilar: [] };
    if (!dolu(a.id)) h('id eksik');
    if (!dolu(a.konu)) h('konu eksik');
    if (TURLER.indexOf(a.tur) < 0) h('tur geçersiz: ' + a.tur);
    if ([1, 2, 3].indexOf(a.zorluk) < 0) h('zorluk 1, 2 veya 3 olmalı: ' + a.zorluk);
    if (!dolu(a.soru)) h('soru eksik');
    if (!Array.isArray(a.ipuclari) || a.ipuclari.length < 1 || !a.ipuclari.every(dolu)) h('ipuclari en az bir dolu metin içermeli');
    if (!dolu(a.cozum)) h('cozum eksik');
    if (a.etiketler != null && !Array.isArray(a.etiketler)) h('etiketler dizi olmalı');
    if (a.etiketler == null) u('etiketler alanı yok');

    if (a.tur === 'coktan-secmeli') {
      if (!Array.isArray(a.secenekler) || a.secenekler.length < 2) h('secenekler en az 2 öğe içermeli');
      else if (!(Number.isInteger(a.dogru) && a.dogru >= 0 && a.dogru < a.secenekler.length)) h('dogru, secenekler içinde 0-tabanlı bir indeks olmalı: ' + a.dogru);
    }

    if (a.tur === 'cikti-tahmin') {
      if (a.beklenen == null || String(a.beklenen).trim() === '') h('beklenen eksik');
      if (a.karsilastirma != null && a.karsilastirma !== 'sayisal' && a.karsilastirma !== 'metin') h('karsilastirma "sayisal" veya "metin" olmalı');
      if (a.kabul != null && !Array.isArray(a.kabul)) h('kabul dizi olmalı');
      if (!hatalar.length) {
        var kendi = kontrolEt(a, String(a.beklenen));
        if (!kendi.dogru) h('beklenen değer kendi kontrolünü geçmiyor');
        if (dolu(a.kod) && a.otoDogrula !== false) {
          var c = calistir(a.onKod, a.kod);
          if (c.yok) u('yorumlayıcı bulunamadı; kod çıktısı doğrulanamadı');
          else if (c.onHata) h('onKod hata veriyor: ' + c.onHata.message);
          else if (c.sonuc.error) h('kod yorumlayıcıda hata veriyor: ' + c.sonuc.error.message + (c.sonuc.error.line != null ? ' (satır ' + c.sonuc.error.line + ')' : ''));
          else if (a.karsilastirma !== 'metin' && sayilar(String(a.beklenen)).length) {
            var cs = sayilar(c.sonuc.output || ''), bs = sayilar(String(a.beklenen));
            if (!diziEsit(cs, bs)) h('yorumlayıcı çıktısındaki sayılar beklenen ile uyuşmuyor: çıktı [' + cs.map(sayiYaz).join(' ') + '], beklenen [' + bs.map(sayiYaz).join(' ') + ']');
          } else if (sikiMetin(c.sonuc.output || '').indexOf(sikiMetin(htmlSil(String(a.beklenen))).replace(/^ans=/, '')) < 0) {
            u('yorumlayıcı çıktısı beklenen metni içermiyor: ' + JSON.stringify((c.sonuc.output || '').trim()));
          }
        }
      }
    }

    if (a.tur === 'kisa-cevap') {
      var kabulVar = Array.isArray(a.kabul) && a.kabul.length > 0;
      if (!kabulVar && !dolu(a.regex)) h('kabul listesi veya regex gerekli');
      if (a.kabul != null && !Array.isArray(a.kabul)) h('kabul dizi olmalı');
      if (a.regex != null) { try { new RegExp(a.regex); } catch (e) { h('regex derlenemiyor: ' + e.message); } }
      if (kabulVar && !hatalar.length && !kontrolEt(a, String(a.kabul[0])).dogru) h('kabul[0] kendi kontrolünü geçmiyor');
    }

    if (a.tur === 'bosluk-doldur') {
      if (!dolu(a.kod)) h('kod eksik');
      if (!Array.isArray(a.bosluklar) || !a.bosluklar.length) h('bosluklar eksik');
      else {
        if (!a.bosluklar.every(function (b) { return Array.isArray(b) && b.length > 0; })) h('her boşluk için dolu bir kabul listesi olmalı');
        var adet = dolu(a.kod) ? (a.kod.match(/_{3,}/g) || []).length : 0;
        if (adet !== a.bosluklar.length) h('kod içindeki ___ sayısı (' + adet + ') bosluklar uzunluğuyla (' + a.bosluklar.length + ') aynı değil');
        else if (!hatalar.length && !kontrolEt(a, a.bosluklar.map(function (b) { return String(b[0]); })).dogru) h('ilk kabul değerleri kendi kontrolünü geçmiyor');
      }
    }

    if (a.tur === 'kod-yaz' || a.tur === 'hata-bul') {
      var k = a.kontrol;
      if (!dolu(a.cozumKod)) h('cozumKod eksik');
      if (!k || typeof k !== 'object') h('kontrol eksik');
      else {
        var olcut = (k.degiskenler && Object.keys(k.degiskenler).length) || (k.cikti != null && String(k.cikti) !== '') ||
          (Array.isArray(k.icermeli) && k.icermeli.length) || (Array.isArray(k.icermemeli) && k.icermemeli.length);
        if (!olcut) h('kontrol içinde en az bir ölçüt olmalı (degiskenler, cikti, icermeli, icermemeli)');
        ['icermeli', 'icermemeli'].forEach(function (alan) {
          if (k[alan] == null) return;
          if (!Array.isArray(k[alan])) { h('kontrol.' + alan + ' dizi olmalı'); return; }
          k[alan].forEach(function (d) { try { new RegExp(d); } catch (e) { h('kontrol.' + alan + ' regex derlenemiyor: ' + d); } });
        });
      }
      if (a.tur === 'hata-bul' && !dolu(a.baslangicKod)) h('hata-bul için baslangicKod (hatalı kod) gerekli');
      if (!hatalar.length) {
        if (!yorumlayiciSinifi()) u('yorumlayıcı bulunamadı; cozumKod doğrulanamadı');
        else {
          var rc = kontrolEt(a, a.cozumKod);
          if (!rc.dogru) h('cozumKod kontrolü geçmiyor: ' + htmlSil(rc.mesaj));
          if (dolu(a.baslangicKod) && yorumsuz(a.baslangicKod).trim() && kontrolEt(a, a.baslangicKod).dogru) {
            u('baslangicKod değiştirilmeden kontrolü geçiyor');
          }
        }
      }
    }

    return { id: id, gecerli: hatalar.length === 0, hatalar: hatalar, uyarilar: uyarilar };
  }

  function dogrulaHepsi(liste, konular) {
    var sorunlu = [], hatalar = [], gorulen = {};
    var konuIdleri = Array.isArray(konular) ? konular.map(function (k) { return k && k.id; }) : null;
    (Array.isArray(liste) ? liste : []).forEach(function (a) {
      var r = dogrula(a);
      if (a && a.id) {
        if (gorulen[a.id]) r.hatalar.push('id tekrar ediyor');
        gorulen[a.id] = true;
      }
      if (konuIdleri && a && konuIdleri.indexOf(a.konu) < 0) r.hatalar.push('konu bulunamadı: ' + a.konu);
      r.gecerli = r.hatalar.length === 0;
      if (!r.gecerli || r.uyarilar.length) sorunlu.push(r);
      r.hatalar.forEach(function (m) { hatalar.push((r.id || '?') + ': ' + m); });
    });
    return { gecerli: hatalar.length === 0, toplam: Array.isArray(liste) ? liste.length : 0, sorunlu: sorunlu, hatalar: hatalar };
  }

  return {
    kontrolEt: kontrolEt,
    dogrula: dogrula,
    dogrulaHepsi: dogrulaHepsi,
    ayarla: function (ayar) { if (ayar && 'MiniMatlab' in ayar) enjekte = ayar.MiniMatlab; },
    TURLER: TURLER,
    TOLERANS: TOLERANS,
    /* test ve arayüz için yardımcılar */
    sayilar: sayilar,
    normMetin: normMetin,
    yorumsuz: yorumsuz,
    degerYaz: degerYaz,
    boyutYaz: boyutYaz,
    calistir: calistir
  };
});
