/* highlight.js — MATLAB sözdizimi renklendirme (UMD)
 * Highlight.matlab(kod) → html  (span sınıfları: hl-k anahtar kelime, hl-f yerleşik fonksiyon,
 * hl-n sayı, hl-s dizgi, hl-c yorum, hl-o operatör)
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.Highlight = api;
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  var ANAHTAR = sozluk(['if', 'else', 'elseif', 'end', 'for', 'while', 'function', 'break', 'continue',
    'return', 'switch', 'case', 'otherwise', 'try', 'catch', 'global', 'persistent', 'parfor']);

  var YERLESIK_VARSAYILAN = ['size', 'numel', 'length', 'zeros', 'ones', 'sum', 'mean', 'median', 'max', 'min',
    'abs', 'sqrt', 'find', 'round', 'floor', 'ceil', 'mod', 'sort', 'disp', 'double', 'uint8', 'class',
    'clc', 'clear', 'close', 'imread', 'imnoise', 'imshow', 'figure', 'subplot', 'plot', 'title',
    'true', 'false', 'pi', 'ans', 'all', 'any', 'rand', 'eye', 'numel', 'fprintf', 'logical', 'rem',
    'xlabel', 'ylabel', 'hold', 'grid', 'rgb2gray', 'imwrite', 'medfilt2', 'linspace', 'isempty', 'prod'];

  var yerlesik = null;

  function sozluk(liste) {
    var o = Object.create(null);
    for (var i = 0; i < liste.length; i++) o[liste[i]] = true;
    return o;
  }

  /* MiniMatlab.SUPPORTED (dizi, Set veya nesne olabilir) varsa yerleşik listesine eklenir. */
  function yerlesikler() {
    if (yerlesik) return yerlesik;
    var liste = YERLESIK_VARSAYILAN.slice();
    try {
      var M = root && root.MiniMatlab;
      var s = M && (M.SUPPORTED || (M.MiniMatlab && M.MiniMatlab.SUPPORTED));
      if (s) {
        if (Array.isArray(s)) liste = liste.concat(s);
        else if (typeof s.forEach === 'function') s.forEach(function (v) { liste.push(v); });
        else if (typeof s === 'object') liste = liste.concat(Object.keys(s));
      }
    } catch (e) { /* yok say */ }
    var o = Object.create(null);
    for (var i = 0; i < liste.length; i++) {
      var ad = String(liste[i]);
      if (/^[A-Za-z_]\w*$/.test(ad) && !ANAHTAR[ad]) o[ad] = true;
    }
    yerlesik = o;
    return o;
  }

  function escape(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function sar(sinif, metin) {
    return '<span class="hl-' + sinif + '">' + escape(metin) + '</span>';
  }

  var HARF = /[A-Za-z_]/, AD = /[A-Za-z0-9_]/, RAKAM = /[0-9]/;
  var OPERATOR = '+-*/\\^=<>~&|:.,;()[]{}@!';

  function matlab(kod) {
    kod = String(kod == null ? '' : kod).replace(/\r\n?/g, '\n');
    var fn = yerlesikler();
    var out = '';
    var i = 0, n = kod.length;
    /* devrik mi dizgi mi: bir önceki karakter (boşluksuz) ad, sayı, ) ] } ' veya . ise devriktir */
    var devrikOlabilir = false;

    while (i < n) {
      var c = kod[i];

      if (c === '\n') { out += '\n'; i++; devrikOlabilir = false; continue; }

      if (c === ' ' || c === '\t') { out += c; i++; devrikOlabilir = false; continue; }

      if (c === '%') {
        var j = kod.indexOf('\n', i);
        if (j < 0) j = n;
        out += sar('c', kod.slice(i, j));
        i = j; devrikOlabilir = false; continue;
      }

      /* satır devamı: ... sonrası yorumdur */
      if (c === '.' && kod.substr(i, 3) === '...') {
        var j2 = kod.indexOf('\n', i);
        if (j2 < 0) j2 = n;
        out += sar('o', '...');
        if (j2 > i + 3) out += sar('c', kod.slice(i + 3, j2));
        i = j2; devrikOlabilir = false; continue;
      }

      if (c === '"' || (c === "'" && !devrikOlabilir)) {
        var k = i + 1;
        while (k < n && kod[k] !== '\n') {
          if (kod[k] === c) {
            if (kod[k + 1] === c) { k += 2; continue; }
            break;
          }
          k++;
        }
        var son = (k < n && kod[k] === c) ? k + 1 : k;
        out += sar('s', kod.slice(i, son));
        i = son; devrikOlabilir = true; continue;
      }

      if (c === "'") { out += sar('o', "'"); i++; devrikOlabilir = true; continue; }

      if (RAKAM.test(c) || (c === '.' && RAKAM.test(kod[i + 1] || ''))) {
        var m = /^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/.exec(kod.slice(i, i + 40));
        var sayi = m ? m[0] : c;
        /* "1:3" içindeki "1." gibi durumlar: nokta bir operatörün parçasıysa sayıya katma */
        if (/\.$/.test(sayi) && /[*\/^']/.test(kod[i + sayi.length] || '')) sayi = sayi.slice(0, -1);
        out += sar('n', sayi);
        i += sayi.length; devrikOlabilir = true; continue;
      }

      if (HARF.test(c)) {
        var e = i + 1;
        while (e < n && AD.test(kod[e])) e++;
        var ad = kod.slice(i, e);
        /* A(end) gibi indeks içindeki end de anahtar kelime renginde kalır (MATLAB editörü gibi) */
        if (ANAHTAR[ad]) out += sar('k', ad);
        else if (fn[ad]) out += sar('f', ad);
        else out += escape(ad);
        i = e; devrikOlabilir = !ANAHTAR[ad] || ad === 'end'; continue;
      }

      if (OPERATOR.indexOf(c) >= 0) {
        var op = c;
        var iki = kod.substr(i, 2);
        if (iki === '==' || iki === '~=' || iki === '<=' || iki === '>=' || iki === '&&' || iki === '||' ||
            iki === '.*' || iki === './' || iki === '.^' || iki === ".'" || iki === '.\\') op = iki;
        out += sar('o', op);
        i += op.length;
        devrikOlabilir = (c === ')' || c === ']' || c === '}' || op === ".'");
        continue;
      }

      out += escape(c); i++; devrikOlabilir = false;
    }
    return out;
  }

  /* Yorumları ayıklar (dizgi içindeki % korunur). kontrol.js de kullanır. */
  function yorumsuz(kod) {
    var satirlar = String(kod == null ? '' : kod).replace(/\r\n?/g, '\n').split('\n');
    return satirlar.map(function (s) {
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

  return { matlab: matlab, escape: escape, yorumsuz: yorumsuz, sifirla: function () { yerlesik = null; } };
});
