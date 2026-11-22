/* Tema: sözdizimi sitesiyle aynı kayıt (localStorage 'matlab-calisma-v1' → tema: 'acik' | 'koyu').
   Kayıtlı seçim varsa o, yoksa sistem teması. <head> içinde, stil dosyasından ÖNCE yüklenir ki
   sayfa yanlış temayla bir an bile boyanmasın. Renkler tek yerde: ortak/tema.css ([data-theme="dark"]). */
(function () {
  var KOK = document.documentElement, ANAHTAR = 'matlab-calisma-v1', mq = null;
  try { mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null; } catch (e) { mq = null; }
  function kayitli() {
    try {
      var v = JSON.parse(window.localStorage.getItem(ANAHTAR) || 'null');
      if (v && (v.tema === 'koyu' || v.tema === 'acik')) return v.tema;
    } catch (e) { /* kayıt yok, bozuk ya da erişilemiyor: sistem teması */ }
    return null;
  }
  function uygula() {
    var t = kayitli(), koyu = t ? t === 'koyu' : !!(mq && mq.matches);
    KOK.setAttribute('data-theme', koyu ? 'dark' : 'light');
  }
  uygula();
  /* Geri tuşuyla (bfcache) dönünce, başka sekmede tema değişince ya da sistem teması değişince yeniden uygula. */
  window.addEventListener('pageshow', uygula);
  window.addEventListener('storage', uygula);
  if (mq) { if (mq.addEventListener) mq.addEventListener('change', uygula); else if (mq.addListener) mq.addListener(uygula); }
})();
