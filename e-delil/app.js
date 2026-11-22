(function(){
  // ---------- tema ----------
  var root=document.documentElement;
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}
  var t=store('edelil-theme'); if(t) root.setAttribute('data-theme',t);
  document.getElementById('themeBtn').onclick=function(){
    var cur=root.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    var n=cur==='dark'?'light':'dark'; root.setAttribute('data-theme',n); store('edelil-theme',n);
  };
  var side=document.getElementById('side');
  document.getElementById('menuBtn').onclick=function(){side.classList.toggle('open');};
  side.addEventListener('click',function(e){if(e.target.tagName==='A')side.classList.remove('open');});

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  // ---------- regex ----------
  var rxPat=document.getElementById('rxPat'),rxText=document.getElementById('rxText'),rxI=document.getElementById('rxI');
  function runRx(){
    var out=document.getElementById('rxOut'),list=document.getElementById('rxList');
    var re; try{re=new RegExp(rxPat.value,'g'+(rxI.checked?'i':''));}catch(e){out.textContent='Kalıp hatalı: '+e.message;list.textContent='';return;}
    var s=rxText.value,html='',last=0,m,found=[],guard=0;
    while((m=re.exec(s))&&guard++<5000){ if(m[0]===''){re.lastIndex++;continue;}
      html+=esc(s.slice(last,m.index))+'<mark>'+esc(m[0])+'</mark>'; last=m.index+m[0].length; found.push(m[0]); }
    html+=esc(s.slice(last)); out.innerHTML=html;
    list.textContent=found.length? ('grep -Eo çıktısı ('+found.length+' eşleşme):\n'+found.join('\n')) : 'Eşleşme yok.';
  }
  [rxPat,rxText].forEach(function(el){el.addEventListener('input',runRx);}); rxI.addEventListener('change',runRx);
  document.querySelectorAll('[data-rx]').forEach(function(b){b.onclick=function(){rxPat.value=b.getAttribute('data-rx');runRx();};});
  runRx();

  // ---------- webkit zaman ----------
  var EPOCH_DIFF=11644473600;
  function pad(n){return (n<10?'0':'')+n;}
  function fmtUTC(d){return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate())+' '+pad(d.getUTCHours())+':'+pad(d.getUTCMinutes())+':'+pad(d.getUTCSeconds())+' UTC';}
  function wk(){
    var o=document.getElementById('wkOut'),v=document.getElementById('wkIn').value.trim(),r='';
    if(/^\d+$/.test(v)){
      var sec=Math.floor(Number(v)/1e6), unix=sec-EPOCH_DIFF, d=new Date(unix*1000);
      r+='WebKit '+v+'\n÷ 1 000 000 = '+sec+' sn (1601\'den beri)\n− 11 644 473 600 = '+unix+' (Unix zamanı)\n= '+fmtUTC(d)+'\n= '+d.toLocaleString('tr-TR')+' (yerel saat)';
    } else r+='WebKit değeri sadece rakam olmalı.';
    var dt=document.getElementById('dtIn').value.trim(), m=dt.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);
    if(m){var u=Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6])/1000; r+='\n\nTarih '+dt+' UTC\nUnix = '+u+'\nWebKit = ('+u+' + 11644473600) × 1 000 000 = '+((BigInt(u)+BigInt(EPOCH_DIFF))*1000000n).toString();}
    o.textContent=r;
  }
  document.getElementById('wkIn').addEventListener('input',wk); document.getElementById('dtIn').addEventListener('input',wk); wk();

  // ---------- transition ----------
  var CORE={0:'Link — bağlantıya tıklayarak geldi',1:'Typed — URL\'yi adres çubuğuna yazdı',2:'Auto Bookmark — arayüzdeki öneri/yer imi',3:'Auto Subframe — otomatik alt çerçeve (reklam vb.)',4:'Manual Subframe — kullanıcının istediği alt çerçeve',5:'Omnibar Generated — arama çubuğuna yazıp öneriden seçti',6:'Top Level / Start page — başlangıç sayfası',7:'Form Submit — form doldurup gönderdi',8:'Reload / Restore — sayfayı yeniledi',9:'Keyword — anahtar kelimeden üretildi',10:'Keyword Generated — anahtar kelime için üretilen ziyaret'};
  var QUAL=[[0x01000000,'Forward/Back'],[0x02000000,'From Address Bar'],[0x04000000,'Home Page'],[0x08000000,'From API'],[0x10000000,'Chain Start (zincirin başı)'],[0x20000000,'Chain End (zincirin sonu)'],[0x40000000,'Client Redirect / Refresh'],[0x80000000,'Server Redirect (sunucu yönlendirmesi)']];
  function hex(n){return '0x'+(n>>>0).toString(16).toUpperCase().padStart(8,'0');}
  function tr(){
    var o=document.getElementById('trOut'),v=document.getElementById('trIn').value.trim();
    if(!/^-?\d+$/.test(v)){o.textContent='Tam sayı gir.';return;}
    var n=Number(v),r='';
    if(n<-2147483648||n>4294967295){o.textContent='32 bit aralığı dışında.';return;}
    var u=n<0?n+4294967296:n;
    if(n<0) r+='Negatif → 2^32 ekle: '+n+' + 4294967296 = '+u+'\n';
    r+='1) Decimal → Hex: '+u+' = '+hex(u)+'\n';
    var core=u&0xFF;
    r+='2) '+hex(u)+' AND 0x000000FF = 0x'+core.toString(16).toUpperCase().padStart(2,'0')+' = '+core+'\n';
    r+='   (kontrol: '+u+' mod 256 = '+(u%256)+')\n';
    r+='3) Çekirdek tip '+core+': '+(CORE[core]||'tabloda yok')+'\n';
    var q=(u-core)>>>0; r+='4) Qualifier kısmı: '+hex(q);
    var parts=[]; QUAL.forEach(function(p){ if(((q&p[0])>>>0)===p[0]>>>0 && p[0]) parts.push(hex(p[0])+' '+p[1]); });
    r+=parts.length?'\n   = '+parts.join('\n   + '):' (bayrak yok)';
    r+='\n\nBash: echo $(('+n+' & 0xFF))  →  '+core;
    o.textContent=r;
  }
  document.getElementById('trIn').addEventListener('input',tr);
  document.querySelectorAll('[data-tr]').forEach(function(b){b.onclick=function(){document.getElementById('trIn').value=b.getAttribute('data-tr');tr();};});
  tr();

  // ---------- base64 ----------
  var b64In=document.getElementById('b64In'),b64Out=document.getElementById('b64Out');
  document.getElementById('b64Enc').onclick=function(){try{b64Out.textContent=btoa(unescape(encodeURIComponent(b64In.value)));}catch(e){b64Out.textContent='Hata';}};
  document.getElementById('b64Dec').onclick=function(){try{b64Out.textContent=decodeURIComponent(escape(atob(b64In.value.trim())));}catch(e){b64Out.textContent='Geçerli Base64 değil.';}};
  document.getElementById('b64Dec').click();

  // ---------- tanım kartları ----------
  var CARDS=[
    ['Regex (düzenli ifade)','Bir arama/eşleşme kalıbını tanımlayan özel karakter dizisi. Log, kaynak kod, belge ve ikili verilerden IP, e-posta, telefon, MAC gibi delilleri kalıpla bulmayı sağlar. Genelde grep ile kullanılır.'],
    ['grep','Dosya ya da metin akışında kalıp arayan Linux komutu. -E genişletilmiş regex, -o sadece eşleşen kısım, -i harf duyarsız, -n satır no, -c sayı, -v tersi, -A/-B sonraki/önceki satırlar, -P Perl regex (lookahead/behind).'],
    ['sed','Stream Editor. Metni satır satır okuyup arama, değiştirme ve silme yapar. s/eski/yeni/g biçimi. Örn. XML/HTML etiketlerini silmek: sed \'s/<[^>]*>//g\'.'],
    ['WebKit','HTML, CSS ve JavaScript\'i işleyip sayfayı ekranda gösteren açık kaynak tarayıcı motoru (Safari; Chrome\'un Blink\'i ondan türedi). Hızlı, düşük kaynak, mobil uyumlu, standartlara uygun. Adli açıdan: Chrome/Safari geçmişindeki zaman damgaları WebKit formatındadır (1601\'den beri mikrosaniye).'],
    ['WebKit zaman damgası','1 Ocak 1601 00:00 UTC\'den beri geçen mikrosaniye (64 bit). Unix = WebKit/1 000 000 − 11 644 473 600. Fark 369 yıl.'],
    ['Unix (Epoch) zamanı','1 Ocak 1970 00:00 UTC\'den beri geçen saniye.'],
    ['Chrome History','Chrome\'un web geçmişini tutan SQLite veritabanı dosyası. Önemli tablolar: urls (her adres bir kez), visits (her ziyaret), downloads (indirmeler).'],
    ['urls – visits ilişkisi','visits.url = urls.id (bire-çok). visits.from_visit = önceki ziyaretin visits.id\'si. JOIN ile URL, başlık ve ziyaret zamanı birlikte elde edilir.'],
    ['Transition','visits tablosunda sayfaya nasıl gelindiğini gösteren 32 bitlik kod. Alt 8 bit (& 0xFF) çekirdek tip (0 Link, 1 Typed, 5 Omnibar, 7 Form Submit, 8 Reload), üst bitler qualifier (Chain Start/End, Server Redirect).'],
    ['visit_duration = 0','Sayfada hiç kalınmamış, sadece yönlendirme (redirect) olmuş demektir. Segmentlere ayırırken kullanılır.'],
    ['SMTP','Simple Mail Transfer Protocol. E-posta GÖNDERME protokolü (istemci→sunucu, sunucu→sunucu). Uygulama katmanı, düz metin, komut-cevap. Port 25/587/465. Aşamalar: 220 → EHLO → AUTH → MAIL FROM → RCPT TO → DATA → . → 250 → QUIT → 221.'],
    ['ESMTP / EHLO','Extended SMTP. İstemci HELO yerine EHLO ile selam verip sunucunun desteklediği uzantıları (SIZE, AUTH, STARTTLS, PIPELINING) öğrenir.'],
    ['SMTP AUTH','SMTP\'nin kimlik doğrulama uzantısı. AUTH LOGIN\'de kullanıcı adı ve şifre Base64 ile kodlanır; 334 istem, 235 başarılı.'],
    ['IMAP / POP3','E-posta ALMA protokolleri. IMAP mailleri sunucuda tutup yönetir (993 güvenli), POP3 indirir (eski ve basit).'],
    ['SSL/TLS','İki uygulama arasındaki iletişimin gizliliğini ve bütünlüğünü sağlayan şifreleme protokolleri. TLS, SSL\'in güvenli halefidir. Üç görev: şifreleme, kimlik doğrulama (CA sertifikası), veri bütünlüğü. HTTPS, SMTPS, STARTTLS.'],
    ['STARTTLS / SMTPS','STARTTLS: düz başlayan bağlantıyı komutla TLS\'e yükseltir (25/587). SMTPS: baştan SSL/TLS ile şifreli SMTP (465).'],
    ['Base64','İkili veriyi yazdırılabilir 64 ASCII karakterine (A-Z a-z 0-9 + /, dolgu =) dönüştüren kodlama. 3 bayt → 4 karakter. Şifreleme DEĞİLDİR, herkes çözebilir (base64 -d).'],
    ['SYN Flood','Hedefe çok sayıda SYN gönderip üçlü el sıkışmayı tamamlamayan DoS/DDoS saldırısı. Yarım açık bağlantılar kaynakları tüketir, meşru kullanıcılar hizmet alamaz. hping3 -S --flood.'],
    ['ARP','Address Resolution Protocol. Yerel ağda IP adresini MAC adresine eşler; broadcast request, unicast reply. Eşlemeler ARP tablosunda (cache) tutulur.'],
    ['ARP Poisoning','Sahte ARP cevaplarıyla kurban ve gateway\'in ARP tablolarında saldırganın MAC\'ini ilgili IP\'lerle eşleştirmek → MITM. Spoofing kimliği taklit etmek, poisoning sonucu.'],
    ['DHCP Starvation','Sahte MAC\'lerle çok sayıda DHCP isteği gönderip havuzdaki tüm IP\'leri tüketmek → meşru kullanıcılar IP alamaz; genelde ardından sahte DHCP sunucusu (MITM).'],
    ['Cookie','Sunucunun tarayıcıya gönderdiği küçük veri; HTTP durumsuz olduğu için oturum yönetimi, kişiselleştirme ve takip için kullanılır. Adli açıdan MAC/IP\'yi kullanıcı kimliğine bağlamaya yarar.'],
    ['tshark','Wireshark\'ın komut satırı hali. -r dosya oku, -Y görüntü filtresi, -T fields -e alan ile sadece istenen alanları yazdırır.']
  ];
  var ch='';CARDS.forEach(function(c){ch+='<details><summary>'+esc(c[0])+'</summary><div class="ans"><p>'+esc(c[1])+'</p></div></details>';});
  document.getElementById('cards').innerHTML=ch;

  // ---------- örnek sorular ----------
  var QS=[
    {h:'Chrome History veritabanında aşağıdaki sorguyu açıklayınız.',p:30,
     body:'<pre><code>select id, title, datetime(last_visit_time/1000000+strftime(\'%s\',\'1601-01-01\'), \'unixepoch\', \'localtime\') from urls;</code></pre>',
     a:'<p><b>urls</b> tablosundan her URL kaydının <b>id</b>\'sini, sayfa başlığını (<b>title</b>) ve <b>son ziyaret zamanını</b> okunabilir biçimde getirir.</p><ul><li><code>last_visit_time</code>: WebKit zamanı, 1601\'den beri <b>mikrosaniye</b>.</li><li><code>/1000000</code>: mikrosaniye → saniye.</li><li><code>strftime(\'%s\',\'1601-01-01\')</code>: 1601-01-01\'in Unix saniyesi (−11644473600). Toplama ile 1601 tabanlı saniye → 1970 tabanlı Unix saniyesi.</li><li><code>datetime(…,\'unixepoch\',\'localtime\')</code>: Unix saniyesini YYYY-MM-DD HH:MM:SS biçimine, yerel saate çevirir.</li><li>Sonuç: kullanıcının hangi sayfayı en son ne zaman ziyaret ettiği.</li></ul>'},
    {h:'visits tablosunda: <code>9|url_ref_ID: 7|2022-04-19 09:55:03|From_visit: 8|Tran:268435456|Duration: 0</code>. Transition kodunu matematiksel olarak hesaplayıp yorumlayınız.',p:20,
     a:'<ol><li>268435456 → hex: 268435456 / 16 = 16777216 k0; /16 = 1048576 k0; … son bölüm 1 → <b>0x10000000</b>.</li><li><code>0x10000000 &amp; 0xFF = 0x00</code> = <b>0</b> → <b>Link</b>: kullanıcı bir bağlantıya tıklayarak geldi.</li><li>Kalan qualifier 0x10000000 = <b>Chain Start</b>: yeni bir gezinme/yönlendirme zincirinin ilk sayfası.</li><li>Duration 0 → sayfada kalınmadı, ardından yönlendirme oldu (craigslist.org → baltimore.craigslist.org).</li><li>From_visit 8 → 8 numaralı ziyaretteki sayfadan geldi.</li></ol>'},
    {h:'Aynı tabloda <code>Tran:-1610612736</code> değerini hesaplayıp yorumlayınız.',p:20,
     a:'<p>Sayı negatif → işaretli 32 bit. 2³² ekle: −1610612736 + 4294967296 = <b>2684354560</b> = <b>0xA0000000</b>.</p><p><code>0xA0000000 &amp; 0xFF = 0</code> → <b>Link</b>.</p><p>Qualifier 0xA0000000 = 0x80000000 (<b>Server Redirect</b>) + 0x20000000 (<b>Chain End</b>) → sunucu yönlendirmesiyle varılan, zincirin son (kullanıcının gördüğü) sayfası. Bash: <code>echo $((-1610612736 &amp; 0xFF))</code> → 0.</p>'},
    {h:'Bir adli incelemede şüphelinin bilgisayarından <code>log.txt</code> dosyası alınmıştır. Dosyadaki tüm <b>IP adreslerini</b> tekrarsız ve kaç kez geçtikleriyle listeleyen Linux komutunu yazınız ve kalıbı açıklayınız.',p:20,
     a:'<pre><code>grep -Eo "\\b([0-9]{1,3}\\.){3}[0-9]{1,3}\\b" log.txt | sort | uniq -c | sort -rn</code></pre><ul><li><code>-E</code> genişletilmiş regex, <code>-o</code> sadece eşleşen IP.</li><li><code>[0-9]{1,3}</code> 1–3 rakam, <code>\\.</code> gerçek nokta, <code>( ){3}</code> grubu 3 kez tekrarla, sonra son oktet.</li><li><code>\\b</code> kelime sınırı: daha uzun sayıların içinden yakalamayı önler.</li><li><code>sort | uniq -c</code> tekrarları sayar, <code>sort -rn</code> çoktan aza sıralar.</li><li>Eksik: 999.1.1.1 gibi geçersiz IP\'leri de yakalar; 0–255 kontrolü için <code>(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])</code> kullanılır.</li></ul>'},
    {h:'Şüphelinin <code>customers.docx</code> dosyasındaki tüm e-posta adreslerini çıkaran komutları yazınız. Neden doğrudan grep yeterli değildir?',p:20,
     a:'<p>.docx sıkıştırılmış (zip) bir dosyadır; metin <code>word/document.xml</code> içinde ve XML etiketleri arasındadır.</p><pre><code>unzip customers.docx -d customers\nsed \'s/&lt;[^&gt;]*&gt;/ /g\' customers/word/document.xml | grep -Eo "[a-zA-Z0-9.-]{2,15}@[a-zA-Z0-9]{1,15}\\.[a-zA-Z0-9]{3,4}"</code></pre><p>sed etiketleri boşlukla değiştirir, grep -Eo yalnızca e-postaları yazar.</p>'},
    {h:'Senaryo: Şüpheli "o gün o siteye hiç form göndermedim" diyor. History dosyasından <b>form gönderilen</b> tüm ziyaretleri URL ve zamanıyla listeleyen SQL sorgusunu yazınız.',p:20,
     a:'<pre><code>select v.id, u.url,\n  datetime(v.visit_time/1000000 + strftime(\'%s\',\'1601-01-01\'),\'unixepoch\',\'localtime\')\nfrom visits v join urls u on v.url = u.id\nwhere (v.transition &amp; 0xFF) = 7\norder by v.visit_time;</code></pre><p>visits ve urls <code>v.url = u.id</code> ile birleştirilir; transition\'ın alt 8 biti 7 (Form Submit) olanlar seçilir. Craigslist vakasında 8, 14–19 numaralı ziyaretler gelir → şüphelinin giriş yaptığı ve ilan formlarını adım adım (cat → edit → geoverify → editimage → preview → publish) gönderdiği kanıtlanır.</p>'},
    {h:'Aşağıdaki SMTP trafiğinde her satırın hangi aşamaya ait olduğunu ve ne yaptığını yazınız. Kullanıcının kimlik bilgilerini bulunuz.',p:30,
     body:'<pre><code>S: 220 mail.ornek.com ESMTP\nC: EHLO PC1\nS: 250-AUTH LOGIN PLAIN\nC: AUTH LOGIN\nS: 334 VXNlcm5hbWU6\nC: YWxpQG9ybmVrLmNvbQ==\nS: 334 UGFzc3dvcmQ6\nC: MTIzNDU2\nS: 235 Authentication succeeded\nC: MAIL FROM:&lt;ali@ornek.com&gt;\nC: RCPT TO:&lt;veli@test.com&gt;\nC: DATA\nS: 354 End data with &lt;CR&gt;&lt;LF&gt;.&lt;CR&gt;&lt;LF&gt;\nC: QUIT\nS: 221 Bye</code></pre>',
     a:'<ul><li>220: bağlantı kuruldu, sunucu hazır.</li><li>EHLO: istemci kendini tanıtır, uzantıları ister; 250: sunucu desteklediklerini sayar (AUTH).</li><li>AUTH LOGIN: kimlik doğrulama başlar. 334 VXNlcm5hbWU6 = "Username:", 334 UGFzc3dvcmQ6 = "Password:".</li><li><code>YWxpQG9ybmVrLmNvbQ==</code> → <b>ali@ornek.com</b>, <code>MTIzNDU2</code> → <b>123456</b> (<code>echo … | base64 -d</code>).</li><li>235: doğrulama başarılı.</li><li>MAIL FROM / RCPT TO: zarf bilgisi (gönderen/alıcı).</li><li>DATA → 354: içerik gönderilir, tek "." ile biter.</li><li>QUIT → 221: bağlantı kapanır.</li><li>Yorum: SMTP şifresiz ve Base64 şifreleme olmadığı için kimlik bilgileri trafikten açıkça elde edildi; TLS kullanılsaydı görülemezdi.</li></ul>'},
    {h:'SSL/TLS nedir? Üç temel görevini açıklayınız.',p:15,
     a:'<p>Ağ üzerindeki iki uygulama arasındaki iletişimin gizliliğini ve bütünlüğünü sağlayan şifreleme protokolleri; TLS, SSL\'in (SSL 3.0 1999\'da kaldırıldı) güvenli halefidir.</p><ol><li><b>Şifreleme</b>: veri şifreli metne çevrilir, araya giren okuyamaz.</li><li><b>Kimlik doğrulama</b>: sunucu CA\'nın verdiği dijital sertifikayı sunar; sahte siteye bağlanılmadığı anlaşılır.</li><li><b>Veri bütünlüğü</b>: hash/imza ile verinin yolda değişmediği doğrulanır.</li></ol><p>Kullanım: HTTPS, SMTPS (465), STARTTLS.</p>'},
    {h:'Base64 ile <code>"Hi!"</code> metnini elle kodlayınız.',p:10,
     a:'<pre><code>H=72=01001000  i=105=01101001  !=33=00100001\n010010 000110 100100 100001\n  18      6     36     33\n  S       G     k      h      → "SGkh"</code></pre><p>3 bayt tam 4 karaktere bölündüğü için dolgu (=) yok. Kontrol: <code>echo -n "Hi!" | base64</code> → SGkh.</p>'},
    {h:'Tanımlayınız: a) WebKit b) HTTP SYN Flood c) ARP Poisoning d) Base64 e) SMTP',p:30,
     a:'<p>Tanım kartları bölümündeki cevapları 3–5 cümleyle yaz. Her tanımda: <b>ne</b> olduğu, <b>nasıl çalıştığı</b>, <b>adli bilişimdeki önemi</b>. (WebKit: zaman damgası; SYN Flood: Wireshark\'ta cevapsız SYN yığını; ARP: gateway IP\'si saldırgan MAC\'iyle; Base64: SMTP AUTH bilgileri çözülebilir; SMTP: düz metin olduğu için içerik ve kimlik bilgisi okunabilir.)</p>'},
    {h:'Şüphelinin bilgisayarındaki bir metin dosyasında telefon numaraları <code>1234567890</code>, <code>123.456.7890</code>, <code>123-456-7890</code>, <code>123 456 7890</code> biçimlerinde yazılmış. Hepsini bulan grep komutunu yazıp açıklayınız.',p:20,
     a:'<pre><code>grep -Eo "\\b[0-9]{3}[. -]?[0-9]{3}[. -]?[0-9]{4}\\b" dosya.txt</code></pre><p><code>[0-9]{3}</code> ilk 3 rakam · <code>[. -]?</code> nokta, boşluk ya da tire; <b>opsiyonel</b> (? = 0 veya 1) · <code>[0-9]{3}</code> · ayraç · <code>[0-9]{4}</code> son 4 rakam · <code>\\b</code> daha uzun sayıları dışarıda bırakır. <code>(123)456-7890</code> için koşullu ifade gerekir: <code>grep -Po "(\\()?\\b[0-9]{3}(?(1)\\)|[. -]?)[0-9]{3}[. -]?[0-9]{4}\\b"</code>.</p>'},
    {h:'Senaryo: Craigslist vakasında şüphelinin kullandığı e-posta adresini ve Bitcoin işlem kimliğini web geçmişinden nasıl tespit edersiniz? Hangi tablolar ve hangi veriler kullanılır?',p:20,
     a:'<ul><li><b>urls</b> tablosundaki <code>url</code> ve <code>title</code> sütunları: Gmail sayfalarının başlığında hesap adı görünür → <b>unsub.fscs@gmail.com</b>. Regex ile de çekilebilir: <code>sqlite3 History "select title from urls" | grep -Eo "[a-zA-Z0-9._]+@gmail\\.com" | sort -u</code></li><li>"txid: 517b21…" konulu mail başlıkları ve <code>blockchain.com/btc/tx/&lt;TXID&gt;</code>, <code>mempool.space/tx/&lt;TXID&gt;</code> URL yapıları → TXID.</li><li><code>/btc/address/38Rcs…</code> → cüzdan adresi.</li><li><b>visits</b>: bu sayfaların ne zaman ve nasıl (transition) açıldığı, ne kadar kalındığı → zaman çizelgesi.</li><li><b>downloads</b>: proof_of_payment.png → makbuzun indirildiği konum ve zaman.</li></ul>'}
  ];
  var qh='';QS.forEach(function(q,i){qh+='<div class="q"><div class="qh">Soru '+(i+1)+') '+q.h+' <span class="pts">('+q.p+'P)</span></div>'+(q.body||'')+'<details><summary>Cevabı göster</summary><div class="ans">'+q.a+'</div></details></div>';});
  document.getElementById('qs').innerHTML=qh;

  // ---------- quiz ----------
  // her soru: [soru, [[şık, açıklama],...], doğru index]
  var QZ=[
[
"visits tablosundaki \"url\" sütunu neyi tutar?",
[
[
"Ziyaret edilen tam adresi",
"Hayır. Tam adres (https://...) urls tablosunun url sütunundadır, visits tablosunda değil."
],
[
"urls tablosundaki ilgili kaydın id'sini",
"Doğru. visits.url = urls.id. Bir sayı tutar; adresi görmek için iki tabloyu bu sütunla birleştiririz."
],
[
"Sayfa başlığını",
"Hayır. Sayfa başlığı urls tablosundaki title sütunundadır."
],
[
"Önceki ziyaretin id'sini",
"Hayır. Bunu from_visit sütunu tutar."
]
],
1
],
[
"from_visit neyi gösterir?",
[
[
"Sayfada kalma süresi",
"Hayır. Kalma süresi visit_duration sütunudur (mikrosaniye)."
],
[
"Bu sayfaya gelinen önceki ziyaretin visits.id'si",
"Doğru. Kullanıcının hangi ziyaretten buraya geldiğini gösterir. 0 ise öncesinde bir ziyaret yoktur."
],
[
"Ziyaret sayısı",
"Hayır. Ziyaret sayısı urls tablosundaki visit_count sütunudur."
],
[
"Geçiş tipi",
"Hayır. Geçiş tipi transition sütunudur."
]
],
1
],
[
"WebKit zamanının başlangıcı ve birimi?",
[
[
"1970, saniye",
"Hayır. Bu Unix zamanıdır (1 Ocak 1970, saniye)."
],
[
"1601, mikrosaniye",
"Doğru. WebKit zamanı 1 Ocak 1601 UTC'den beri geçen mikrosaniyedir. Saniyeye çevirmek için 1.000.000'a bölünür."
],
[
"1601, milisaniye",
"Hayır. Başlangıç doğru ama birim mikrosaniye (milyonda bir saniye), milisaniye değil."
],
[
"1970, mikrosaniye",
"Hayır. Birim doğru ama başlangıç 1601. 1970 Unix'in başlangıcıdır."
]
],
1
],
[
"WebKit ile Unix başlangıç farkı kaç saniye?",
[
[
"11644473600",
"Doğru. 1601 ile 1970 arası 369 yıl = 11.644.473.600 saniye. Unix = WebKit/1000000 − 11644473600."
],
[
"1000000",
"Hayır. 1.000.000 mikrosaniyeyi saniyeye çevirmek için bölünen sayıdır, iki başlangıç arasındaki fark değil."
],
[
"369",
"Hayır. 369 yıl sayısıdır; soru saniye cinsinden farkı soruyor."
],
[
"31536000",
"Hayır. Bu 1 yılın (365 gün) saniye karşılığıdır."
]
],
0
],
[
"805306375 & 0xFF = ?",
[
[
"5",
"Hayır. 5 Omnibar Generated tipidir; bu sayının son iki hex rakamı 07."
],
[
"0",
"Hayır. 0 Link tipidir. 805306375 = 0x30000007, son bayt 0 değil."
],
[
"7",
"Doğru. 805306375 = 0x30000007. & 0xFF son iki hex rakamını alır: 07 = Form Submit. 0x30000000 ise Chain Start + Chain End."
],
[
"8",
"Hayır. 8 Reload tipidir. Kestirme: 805306375 mod 256 = 7."
]
],
2
],
[
"Transition çekirdek tipi 5 ne demek?",
[
[
"Typed",
"Hayır. Typed 1'dir: adres çubuğuna tam adresi yazıp gitmek."
],
[
"Reload",
"Hayır. Reload 8'dir: sayfayı yenilemek."
],
[
"Omnibar Generated",
"Doğru. 5 = Generated: adres çubuğuna bir şey yazıp önerilerden (arama vb.) seçmek."
],
[
"Link",
"Hayır. Link 0'dır: sayfadaki bir bağlantıya tıklamak."
]
],
2
],
[
"0x80000000 qualifier'ı neyi gösterir?",
[
[
"Chain Start",
"Hayır. Chain Start 0x10000000'dır: yönlendirme zincirinin ilk sayfası."
],
[
"Server Redirect",
"Doğru. 0x80000000 = Server Redirect: sunucu kullanıcıyı başka bir adrese yönlendirdi (ör. HTTP 301/302)."
],
[
"Forward/Back",
"Hayır. Forward/Back 0x01000000’dır: tarayıcının geri/ileri tuşuyla gelmek."
],
[
"Chain End",
"Hayır. Chain End 0x20000000'dır: zincirin son sayfası."
]
],
1
],
[
"visit_duration = 0 ne anlama gelir?",
[
[
"Sayfa çok uzun açık kaldı",
"Hayır. Uzun kalınsaydı değer büyük olurdu; 0 tam tersini gösterir."
],
[
"Sadece yönlendirme oldu, sayfada gezinilmedi",
"Doğru. Süre 0 ise sayfa ekranda kalmadı; genelde bir yönlendirme (redirect) ara adımıdır."
],
[
"Kayıt silinmiş",
"Hayır. Silinmiş kayıt tabloda hiç görünmez; 0 süre silinme demek değildir."
],
[
"Form gönderildi",
"Hayır. Form gönderimi transition tipinden (7) anlaşılır, süreden değil."
]
],
1
],
[
"SQL'de || operatörü ne yapar?",
[
[
"Mantıksal VEYA",
"Hayır. SQL'de mantıksal VEYA \"OR\" ile yazılır."
],
[
"Metinleri birleştirir",
"Doğru. || iki metni yan yana ekler (concatenation). Ör. visit_duration/1000 || ' ms'."
],
[
"Yorum satırı",
"Hayır. SQL'de yorum satırı -- ile başlar."
],
[
"Bölme",
"Hayır. Bölme / işaretiyle yapılır."
]
],
1
],
[
"visit_duration/1000 sonucu hangi birimdedir?",
[
[
"Saniye",
"Hayır. Saniye için 1.000.000'a bölmek gerekir."
],
[
"Milisaniye",
"Doğru. visit_duration mikrosaniyedir; 1000'e bölünce milisaniye olur."
],
[
"Mikrosaniye",
"Hayır. Bölmeden önceki ham değer mikrosaniyedir."
],
[
"Dakika",
"Hayır. Dakika için 60.000.000'a bölmek gerekir."
]
],
1
],
[
"grep'te sadece eşleşen kısmı yazdıran seçenek?",
[
[
"-v",
"Hayır. -v tersini yapar: eşleşmeyen satırları yazdırır."
],
[
"-c",
"Hayır. -c eşleşen satırların sayısını yazdırır."
],
[
"-o",
"Doğru. -o (only-matching) satırın tamamını değil, sadece kalıba uyan parçayı yazdırır. IP/e-posta çıkarmada kullanılır."
],
[
"-n",
"Hayır. -n satır numarasını ekler."
]
],
2
],
[
"grep'te eşleşmeden sonraki 1 satırı da gösteren seçenek?",
[
[
"-B1",
"Hayır. -B (Before) eşleşmeden ÖNCEKİ satırları gösterir."
],
[
"-A1",
"Doğru. -A (After) eşleşmeden SONRAKİ satırları gösterir; -A1 bir satır."
],
[
"-C0",
"Hayır. -C hem önce hem sonra gösterir; 0 ise hiç ek satır göstermez."
],
[
"-n1",
"Hayır. -n satır numarası verir, sayı almaz."
]
],
1
],
[
"Lookahead/lookbehind için grep'te hangi seçenek gerekir?",
[
[
"-E",
"Hayır. -E genişletilmiş regex'tir ({}, +, ?, | için) ama lookahead/lookbehind desteklemez."
],
[
"-P",
"Doğru. -P Perl uyumlu regex'i açar; (?=...) ve (?<=...) gibi yapılar sadece bununla çalışır."
],
[
"-i",
"Hayır. -i büyük/küçük harf farkını yok sayar."
],
[
"-w",
"Hayır. -w sadece tam kelime eşleşmelerini bulur."
]
],
1
],
[
"[0-9]{10} kalıbı 1234567890123 içinde ne bulur?",
[
[
"Hiçbir şey",
"Hayır. İçinde 10 ardışık rakam olduğu için bir eşleşme bulur."
],
[
"İlk 10 rakamı",
"Doğru. Regex soldan başlar ve 10 rakam bulunca durur: 1234567890. Uzun sayıların içinden parça almasın diye \\b eklenir."
],
[
"Tamamını",
"Hayır. {10} tam 10 tane demek; 13 rakamın tamamını almaz."
],
[
"Son 10 rakamı",
"Hayır. Arama soldan sağa yapılır, ilk uygun yerde eşleşir."
]
],
1
],
[
"IP kalıbında nokta neden \\. yazılır?",
[
[
"Daha hızlı olsun",
"Hayır. Hızla ilgisi yok; anlam değişir."
],
[
". tek başına herhangi bir karakter demek",
"Doğru. Regex'te . her karakteri temsil eder. Gerçek nokta için \\ ile kaçırılır, yoksa 192x168 gibi şeyler de eşleşir."
],
[
"grep noktayı tanımaz",
"Hayır. Tanır, ama özel anlamıyla (herhangi bir karakter) tanır."
],
[
"Zorunlu değil",
"Hayır. Yazılmazsa yanlış eşleşmeler olur; doğru sonuç için gerekli."
]
],
1
],
[
"MAC adresi kalıbı?",
[
[
"([0-9]{1,3}\\.){3}[0-9]{1,3}",
"Hayır. Bu IP adresi kalıbıdır (4 sayı, aralarında nokta)."
],
[
"([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}",
"Doğru. MAC 6 grup, her grup 2 hex rakam, aralarında : veya -. Ör. 00:1A:2B:3C:4D:5E."
],
[
"[A-Z][a-z]+",
"Hayır. Bu büyük harfle başlayan bir kelimeyi (ör. isim) bulur."
],
[
"#[0-9a-f]{6}",
"Hayır. Bu bir HTML renk kodunu (#ff0000) bulur."
]
],
1
],
[
".docx içinde grep ile arama yapmadan önce ne yapılmalı?",
[
[
"base64 -d",
"Hayır. docx Base64 ile kodlanmış değildir."
],
[
"unzip ile açılmalı",
"Doğru. .docx aslında bir zip arşividir. unzip ile açılır, metin word/document.xml içindedir; sonra sed ile etiketler temizlenip grep yapılır."
],
[
"tshark ile çevrilmeli",
"Hayır. tshark ağ trafiği (pcap) için kullanılır."
],
[
"sqlite3 ile açılmalı",
"Hayır. sqlite3 veritabanı dosyaları (ör. Chrome History) içindir."
]
],
1
],
[
"SMTP ne için kullanılır?",
[
[
"E-posta almak",
"Hayır. E-postayı sunucudan almak IMAP veya POP3 ile yapılır."
],
[
"E-posta göndermek",
"Doğru. SMTP (Simple Mail Transfer Protocol) e-postayı gönderir ve sunucular arasında taşır."
],
[
"Web sayfası göstermek",
"Hayır. Bu HTTP/HTTPS'tir."
],
[
"IP dağıtmak",
"Hayır. Bu DHCP'dir."
]
],
1
],
[
"SMTP'de gönderen adresi hangi komutla bildirilir?",
[
[
"RCPT TO",
"Hayır. RCPT TO alıcının adresidir."
],
[
"HELO",
"Hayır. HELO istemcinin kendini tanıttığı selamlama komutudur."
],
[
"MAIL FROM",
"Doğru. MAIL FROM:<gonderen@...> gönderenin adresini bildirir."
],
[
"DATA",
"Hayır. DATA e-postanın içeriğini (başlık + gövde) göndermeye başlatır."
]
],
2
],
[
"354 kodu ne anlama gelir?",
[
[
"Servis hazır",
"Hayır. Servis hazır 220'dir."
],
[
"Veriyi gönder, \".\" ile bitir",
"Doğru. DATA komutundan sonra gelir: e-posta içeriğini gönder, tek başına bir \".\" satırıyla bitir."
],
[
"Doğrulama başarılı",
"Hayır. Doğrulama başarılı 235'tir."
],
[
"Bağlantı kapanıyor",
"Hayır. Kapanış 221'dir (QUIT sonrası)."
]
],
1
],
[
"220 kodu?",
[
[
"Servis hazır",
"Doğru. Bağlantı kurulunca sunucunun ilk cevabıdır: hizmet hazır."
],
[
"Kapanıyor",
"Hayır. Kapanış 221'dir."
],
[
"Hata",
"Hayır. Hatalar 4xx ve 5xx ile başlar."
],
[
"Doğrulandı",
"Hayır. Doğrulama başarılı 235'tir."
]
],
0
],
[
"VXNlcm5hbWU6 neyin Base64 halidir?",
[
[
"Password:",
"Hayır. \"Password:\" Base64 olarak UGFzc3dvcmQ6 yazılır."
],
[
"Username:",
"Doğru. AUTH LOGIN'den sonra sunucu 334 VXNlcm5hbWU6 ile kullanıcı adı ister."
],
[
"HELO",
"Hayır. HELO düz metin bir komuttur, kodlanmaz."
],
[
"admin",
"Hayır. \"admin\" Base64 olarak YWRtaW4= yazılır."
]
],
1
],
[
"EHLO ile HELO farkı?",
[
[
"EHLO şifrelidir",
"Hayır. EHLO da düz metindir; şifreleme STARTTLS veya SSL/TLS ile olur."
],
[
"EHLO sunucunun desteklediği uzantıları (ESMTP) öğrenir",
"Doğru. EHLO (Extended HELO) ile sunucu desteklediği özellikleri (AUTH, STARTTLS, SIZE...) 250 satırlarıyla listeler."
],
[
"HELO daha yenidir",
"Hayır. Tersi: HELO eski, EHLO genişletilmiş yeni sürüm."
],
[
"Fark yok",
"Hayır. EHLO uzantıları listeler, HELO listelemez."
]
],
1
],
[
"SSL/TLS'in üç görevi hangisinde doğru verilmiş?",
[
[
"Sıkıştırma, yönlendirme, önbellek",
"Hayır. Bunlar SSL/TLS'in görevleri değil."
],
[
"Şifreleme, kimlik doğrulama, veri bütünlüğü",
"Doğru. Şifreleme: dinleyen okuyamaz. Kimlik doğrulama: sertifika ile sunucu doğrulanır. Bütünlük: veri yolda değişirse fark edilir."
],
[
"Adresleme, yönlendirme, şifreleme",
"Hayır. Adresleme ve yönlendirme IP katmanının işidir."
],
[
"Kodlama, çözme, saklama",
"Hayır. Bu Base64 gibi kodlamaları anlatır, SSL/TLS'i değil."
]
],
1
],
[
"Base64 için hangisi doğru?",
[
[
"Güvenli bir şifreleme algoritmasıdır",
"Hayır. Base64 şifreleme değildir, anahtarı yoktur; herkes çözebilir."
],
[
"Anahtar olmadan çözülemez",
"Hayır. Anahtar gerekmez; base64 -d ile hemen çözülür."
],
[
"İkili veriyi yazdırılabilir ASCII'ye çeviren kodlamadır",
"Doğru. Base64 bir kodlamadır (encoding): veriyi A–Z, a–z, 0–9, + ve / karakterleriyle yazar."
],
[
"Sadece resimler için kullanılır",
"Hayır. Her türlü veri için kullanılır (ör. SMTP'de kullanıcı adı/parola, e-posta ekleri)."
]
],
2
],
[
"SMTP varsayılan portu?",
[
[
"80",
"Hayır. 80 HTTP portudur."
],
[
"25",
"Doğru. SMTP'nin varsayılan portu 25. 587 (STARTTLS ile gönderim) ve 465 (SMTPS) da kullanılır."
],
[
"443",
"Hayır. 443 HTTPS portudur."
],
[
"993",
"Hayır. 993 SSL'li IMAP (IMAPS) portudur."
]
],
1
],
[
"SYN Flood'da saldırgan neyi göndermez?",
[
[
"SYN",
"Hayır. Saldırı tam olarak çok sayıda SYN göndermektir."
],
[
"Son ACK",
"Doğru. Üçlü el sıkışmanın son adımı olan ACK gönderilmez; sunucu yarım açık bağlantılarla dolar."
],
[
"IP başlığı",
"Hayır. Her IP paketinde başlık vardır; kaynak IP sahte olabilir ama başlık yine vardır."
],
[
"Port numarası",
"Hayır. TCP paketi port numarası olmadan gönderilemez."
]
],
1
],
[
"ARP poisoning sonrası kurbanın ARP tablosunda gateway IP'si hangi MAC ile görünür?",
[
[
"Gateway'in MAC'i",
"Hayır. Normalde öyle olmalı; zehirleme bunu değiştirir."
],
[
"Saldırganın MAC'i",
"Doğru. Saldırgan sahte ARP cevaplarıyla \"gateway benim\" der. Kurbanın trafiği saldırgana gider (Man-in-the-Middle)."
],
[
"ff:ff:ff:ff:ff:ff",
"Hayır. Bu yayın (broadcast) adresidir; ARP isteğinde kullanılır, tabloya bu şekilde yazılmaz."
],
[
"Kurbanın kendi MAC'i",
"Hayır. Bu durumda trafik hiçbir yere gitmezdi; saldırganın amacı trafiği kendine çekmek."
]
],
1
],
[
"DHCP Starvation'ın amacı?",
[
[
"DNS kayıtlarını değiştirmek",
"Hayır. Bu DNS zehirlemesi (DNS spoofing) olur."
],
[
"IP havuzunu sahte isteklerle tüketmek",
"Doğru. Saldırgan sahte MAC adresleriyle çok sayıda DHCP isteği gönderir; havuz biter, gerçek cihazlar IP alamaz. Ardından sahte DHCP sunucusu kurulabilir."
],
[
"Şifre kırmak",
"Hayır. DHCP'nin şifreyle ilgisi yoktur."
],
[
"SYN göndermek",
"Hayır. Bu SYN Flood saldırısıdır."
]
],
1
]
];
  var score=0; document.getElementById('total').textContent=QZ.length;
  function buildQuiz(){
    score=0;document.getElementById('score').textContent=0;
    var h='';QZ.forEach(function(q,i){h+='<div class="q mcq" data-i="'+i+'"><div class="qh">'+(i+1)+'. '+esc(q[0])+'</div>';
      q[1].forEach(function(o,j){h+='<div class="optw"><button class="opt" data-j="'+j+'">'+esc(o[0])+'</button><div class="exp">'+esc(o[1])+'</div></div>';});
      h+='<div class="hint">Diğer şıklara da tıklayıp açıklamalarını okuyabilirsin.</div></div>';});
    document.getElementById('quiz').innerHTML=h;
  }
  document.getElementById('quiz').addEventListener('click',function(e){
    var b=e.target.closest('.opt'); if(!b)return; var box=b.closest('.mcq');
    var q=QZ[+box.getAttribute('data-i')],j=+b.getAttribute('data-j');
    b.classList.add('seen', j===q[2]?'right':'wrong');
    if(!box.classList.contains('done')){
      box.classList.add('done');
      if(j===q[2])score++; else box.querySelectorAll('.opt')[q[2]].classList.add('right');
      document.getElementById('score').textContent=score;
    }
  });
  document.getElementById('resetQuiz').onclick=buildQuiz; buildQuiz();
})();
