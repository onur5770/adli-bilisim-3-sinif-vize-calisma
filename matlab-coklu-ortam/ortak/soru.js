/* Soru sayfaları için ortak betik: kod renklendirme + kopyala düğmesi. */
(function () {
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var KW = /^(for|end|if|else|elseif|while|function|break|continue|return)$/;
  function boya(src) {
    return src.split('\n').map(function (ln) {
      var i = ln.indexOf('%'), yor = '';
      if (i >= 0) { yor = ln.slice(i); ln = ln.slice(0, i); }
      var o = esc(ln).replace(/("[^"]*"|'[^']*')|([A-Za-z_]\w*)(\s*\()?|(\b\d+(?:\.\d+)?\b)/g, function (m, str, id, par, num) {
        if (str) return '<span class="k-s">' + str + '</span>';
        if (num) return '<span class="k-n">' + num + '</span>';
        if (id && KW.test(id)) return '<span class="k-k">' + id + '</span>' + (par || '');
        if (id && par) return '<span class="k-f">' + id + '</span>' + par;
        return m;
      });
      return o + (yor ? '<span class="k-y">' + esc(yor) + '</span>' : '');
    }).join('\n');
  }
  /* Panoya kopyalar; navigator.clipboard yoksa ya da reddederse (http, eski tarayıcı) eski yönteme düşer. */
  function kopyala(metin, bitti) {
    function eski() {
      var oldu = false;
      try {
        var t = document.createElement('textarea'); t.value = metin; t.setAttribute('readonly', '');
        t.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
        document.body.appendChild(t); t.select(); t.setSelectionRange(0, metin.length);
        oldu = document.execCommand('copy'); document.body.removeChild(t);
      } catch (e) { oldu = false; }
      bitti(oldu);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(metin).then(function () { bitti(true); }, eski);
      else eski();
    } catch (e) { eski(); }
  }
  /* Tek sayı okur: -2.5, -2,5, −5/2, +3, 1.250 değil. Okunamıyorsa NaN. */
  function sayiOku(s) {
    s = String(s).replace(/[−–—]/g, '-').replace(/\s+/g, '').replace(/,/g, '.');
    var m = /^([-+]?(?:\d+\.?\d*|\.\d+))(?:\/([-+]?(?:\d+\.?\d*|\.\d+)))?$/.exec(s);
    if (!m) return NaN;
    var v = parseFloat(m[1]);
    if (m[2] !== undefined) { var p = parseFloat(m[2]); if (!p) return NaN; v /= p; }
    return v;
  }
  /* Sayı listesi okur ("LH = [-5/2; 3]", "9, 13", "2,5 3"). n verilirse virgülün ondalık mı ayraç mı olduğuna
     adede bakarak karar verir. Dönen: { sayilar: [...] } ya da { hata: 'okunamayan parça' }. */
  function sayilarOku(ham, n) {
    var s = String(ham).replace(/[−–—]/g, '-').replace(/^[^=]*=/, '').replace(/[\[\](){}]/g, ' ').replace(/\s*\/\s*/g, '/').trim();
    function dene(ayrac) {
      var p = s.split(ayrac).filter(Boolean), o = [];
      for (var i = 0; i < p.length; i++) { var v = sayiOku(p[i]); if (isNaN(v)) return { hata: p[i] }; o.push(v); }
      return { sayilar: o };
    }
    var a = dene(/[\s;]+|,(?=\s)|,$/), b = dene(/[\s;,]+/);
    if (a.sayilar && (n === undefined || a.sayilar.length === n)) return a;
    if (b.sayilar && (a.hata || b.sayilar.length === n)) return b;
    return a;
  }
  window.Soru = { boya: boya, esc: esc, kopyala: kopyala, sayiOku: sayiOku, sayilarOku: sayilarOku };
  /* Üst çubuk: sayfa adı ve (soru sayfalarında) önceki / sonraki soru bağlantıları. */
  (function () {
    var g = document.querySelector('.gezin'); if (!g) return;
    if (!g.querySelector('.yer')) { var y = document.createElement('span'); y.className = 'yer'; y.textContent = document.title.replace(' – ', ' · '); g.appendChild(y); }
    var m = /soru-(\d\d)\//.exec(location.pathname); if (!m) return;
    var no = +m[1], k = document.createElement('span'); k.className = 'komsu';
    [[no - 1, '‹ Soru '], [no + 1, 'Soru ']].forEach(function (x) {
      if (x[0] < 1 || x[0] > 10) return;
      var a = document.createElement('a'); a.href = '../soru-' + ('0' + x[0]).slice(-2) + '/index.html';
      a.textContent = x[1] + x[0] + (x[0] > no ? ' ›' : ''); k.appendChild(a);
    });
    g.appendChild(k);
  })();
  document.querySelectorAll('pre.kod').forEach(function (pre) {
    var ham = pre.textContent.replace(/^\n/, '').replace(/\s+$/, '');
    var c = document.createElement('code'); c.innerHTML = boya(ham);
    pre.textContent = ''; pre.appendChild(c);
    if (pre.hasAttribute('data-kopya')) {
      /* Düğme, yatay kaydırılan <pre>'nin içinde değil onu saran kutuda durur (kodla birlikte kaymasın). */
      var sar = document.createElement('div'); sar.className = 'kod-sar';
      pre.parentNode.insertBefore(sar, pre); sar.appendChild(pre);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'kopya'; b.textContent = 'Kopyala';
      b.addEventListener('click', function () {
        kopyala(ham, function (oldu) {
          b.textContent = oldu ? 'Kopyalandı' : 'Kopyalanamadı';
          setTimeout(function () { b.textContent = 'Kopyala'; }, 1500);
        });
      });
      sar.appendChild(b);
    }
  });
})();
