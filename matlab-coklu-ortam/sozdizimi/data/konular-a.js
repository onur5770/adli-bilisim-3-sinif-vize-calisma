/* konular-a.js — konu-01 … konu-07 (içerik ajanı A) */
(function (g) {
  'use strict';

  /* küçük yardımcılar: sss/hata kutularının html'i içinde tablo ve hizalı blok üretir */
  function T(basliklar, satirlar) {
    return '<table><thead><tr>' + basliklar.map(function (b) { return '<th>' + b + '</th>'; }).join('') +
      '</tr></thead><tbody>' + satirlar.map(function (s) {
        return '<tr>' + s.map(function (h) { return '<td>' + h + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  }
  function PRE(metin) { return '<pre>' + metin + '</pre>'; }

  var A4 = `    10    20    30    40
    50    60    70    80
    90   100   110   120
   130   140   150   160`;

  var KONULAR_A = [

    /* ================================================================ KONU 1 */
    {
      id: 'konu-01', no: 1, baslik: 'MATLAB ekranı ve ilk kod',
      kisa: 'Komut satırı, script dosyası, Run/F5, % ile yorum, ans ve satır sonundaki noktalı virgül.',
      yeni: false,
      bloklar: [
        { tip: 'not', html: `<p><strong>Önce kısa bir soru: Bilgisayarında MATLAB kurulu mu?</strong> Cevabın ne olursa olsun bu dersi takip edebilirsin. Kurulu değilse kodları kağıda yaz ve her satırın yanına ekranda ne çıkacağını tahmin et. Bu sitede ayrıca her kodu "Uygulama alanında dene" düğmesiyle çalıştırabilirsin.</p><p>Emin olmadığın yerde tahminini söylemen yeterli, yanlış yapman sorun değil.</p>` },
        { tip: 'baslik', metin: 'MATLAB nedir?' },
        { tip: 'metin', html: `<p>MATLAB'ı <strong>çok güçlü bir hesap makinesi</strong> gibi düşünebilirsin. En iyi yaptığı iş, sayı tablolarıyla (<strong>matrislerle</strong>) çalışmaktır.</p><p>Bilgisayar için siyah beyaz bir resim de bir sayı tablosudur: tablodaki her sayı bir <strong>pikseldir</strong>, yani resmin en küçük noktası. <strong>0 siyah, 255 beyaz</strong> demektir.</p>` },
        { tip: 'baslik', metin: 'Ekrandaki 4 önemli bölüm' },
        { tip: 'tablo', basliklar: ['Ekranda yazan', 'Ne işe yarar?', 'Günlük benzetme'], satirlar: [
          ['<strong>Command Window</strong> (komut satırı)', 'Yazıp Enter\'a basınca hemen çalışır, sonuç burada görünür', 'Hesap makinesi'],
          ['<strong>Editor</strong> (script dosyası)', 'Kodları dosyaya yazıp saklarsın, hepsi birlikte çalışır', 'Yemek tarifi defteri'],
          ['<strong>Workspace</strong>', 'MATLAB\'ın o an hafızasında tuttuklarını gösterir', 'Çalışma masası'],
          ['<strong>Current Folder</strong>', 'İçinde çalıştığın klasörü gösterir', 'Dosya dolabı']
        ] },
        { tip: 'baslik', metin: 'Script dosyası ve kodu çalıştırma' },
        { tip: 'metin', html: `<p><strong>Script</strong>, kodların kaydedildiği <code>.m</code> uzantılı dosyadır, örneğin <code>vize1.m</code>.</p><ul><li>Dosya adında <strong>boşluk olmamalı</strong>.</li><li>Dosya adı <strong>rakamla başlamamalı</strong>.</li></ul><p>Çalıştırmak için üstteki yeşil <strong>Run</strong> düğmesine veya <strong>F5</strong> tuşuna basarsın. MATLAB kodu <strong>yukarıdan aşağıya, satır satır</strong> okur.</p>` },
        { tip: 'baslik', metin: 'İlk örnek kod' },
        { tip: 'kod', calistir: true, kod: `% Bu satir bir yorumdur
5 + 3
2 * 100;
7 - 2 % Satirin sonuna da yorum yazilabilir`, cikti: `ans =
     8

ans =
     5` },
        { tip: 'satirsatir', maddeler: [
          { kod: '% Bu satir bir yorumdur', aciklama: '<code>%</code> işaretinden sonra satırın sonuna kadar yazılanları MATLAB <strong>görmezden gelir</strong>. Yorumlar, kodu okuyan insan için not niteliğindedir.' },
          { kod: '5 + 3', aciklama: 'MATLAB toplamı yapar. Sonda noktalı virgül olmadığı için sonucu <strong>gösterir</strong>. <code>ans</code>, "answer" yani "cevap" demektir; sonuca bir isim vermediğinde MATLAB onu bu isimle saklar.' },
          { kod: '2 * 100;', aciklama: '<code>*</code> çarpma işaretidir. MATLAB 200 sonucunu hesaplar ama <strong>göstermez</strong>, çünkü satır <code>;</code> ile bitiyor.' },
          { kod: '7 - 2 % Satirin sonuna da yorum yazilabilir', aciklama: 'MATLAB önce <code>7 - 2</code> işlemini yapıp 5 sonucunu gösterir, <code>%</code> işaretinden sonrasını okumaz.' }
        ] },
        { tip: 'ipucu', html: `<p><strong><code>ans</code> nedir?</strong> "answer" = "cevap". Bir sonuca isim vermezsen MATLAB onu <code>ans</code> adlı kutuda saklar ve ekranda <code>ans =</code> başlığıyla gösterir. Yukarıda ekranda iki tane <code>ans =</code> var; çünkü yalnızca iki satır sonucunu gösterdi (ortadaki satır <code>;</code> ile susturuldu).</p>` },
        { tip: 'baslik', metin: 'Noktalı virgül resimlerde neden önemli?' },
        { tip: 'baglanti', html: `<p>Hocanın kullandığı <code>cameraman.tif</code> resmi 256 satır ve 256 sütundan oluşur, yani 256 × 256 = <strong>65.536 piksel</strong>dir. Resmi bir satırda <code>;</code> koymadan işlersen, MATLAB 65.536 sayıyı ekrana dökmeye çalışabilir. Bu yüzden görüntü işleme kodlarında satır sonlarında çoğunlukla <code>;</code> görürsün. Hocanın kodunda da <code>res=imread("cameraman.tif");</code> satırı bu yüzden <code>;</code> ile biter.</p>` },

        { tip: 'baslik', metin: 'Sıra sende sorularının cevapları' },
        { tip: 'metin', html: `<p><strong>Soru 1</strong> (üç satırlık kod ekranda tam olarak ne gösterir?) için doğru cevap:</p>` },
        { tip: 'kod', ad: 'Sıra sende cevapları: yorum satırı ve ; ile gizleme', calistir: true, kod: `% 10 + 10
4 + 6;
3 * 3`, cikti: `ans =
     9` },
        { tip: 'satirsatir', maddeler: [
          { kod: '% 10 + 10', aciklama: 'Başında <code>%</code> olduğu için yorumdur, <strong>hesaplanmaz</strong>.' },
          { kod: '4 + 6;', aciklama: '10 hesaplanır ama sonda <code>;</code> olduğu için <strong>gösterilmez</strong>.' },
          { kod: '3 * 3', aciklama: '<code>;</code> olmadığı için sonuç ekranda görünür.' }
        ] },
        { tip: 'hata', id: 'H01', baslik: 'Sonucu yalnız sayı olarak yazmak ("9")',
          yanlis: `<p>Senin cevabın: <code>9</code></p><p>(Aynı mesajda Soru 2 ve "MATLAB kurulu mu?" sorusu da cevapsız kalmıştı.)</p>`,
          dogru: PRE('ans =\n     9') + `<p>Sayı doğru; ekranda başında <code>ans =</code> ile görünür.</p>`,
          neden: `<p>Sonuca isim vermediğin için MATLAB onu <code>ans</code> adıyla saklar ve böyle gösterir. "Ekranda <em>tam olarak</em> ne görünür?" diye sorulduğunda <code>ans =</code> satırını da yazmak gerekir. Bir de: soruda birden fazla parça varsa hepsine cevap ver; sınavda atlanan parça puan kaybıdır.</p>` },
        { tip: 'metin', html: `<p><strong>Soru 2</strong> (hocanın kodunu ileride tekrar tekrar çalıştırmak istiyorsun; Command Window'a mı, script dosyasına mı yazarsın, neden?):</p><p>İpucu şuydu: tablodaki benzetmeleri düşün; biri hesap makinesi, diğeri tarif defteri. Uzun bir işlemi yarın yeniden yapman gerekse hangisi işini kolaylaştırır?</p><p><strong>Cevap:</strong> "Tarif defterine", yani <strong>script dosyasına</strong> yazarsın. <strong>Neden:</strong> Kod dosyada saklandığı için her seferinde yeniden yazmadan Run ile çalıştırabilirsin.</p>` },
        { tip: 'hata', id: 'H02', baslik: '"Neden?" kısmını cevapsız bırakmak',
          yanlis: `<p>Senin cevabın: <code>tarif süzzenine</code></p>`,
          dogru: `<p>"Tarif defterine", yani <strong>script dosyasına</strong>. Çünkü kod dosyada saklanır; her seferinde yeniden yazmadan <strong>Run</strong> (veya F5) ile çalıştırılır.</p>`,
          neden: `<p>Seçimin doğruydu; eksik olan sorunun "Neden?" kısmıydı. Command Window hesap makinesi gibidir: yazdığın şey çalışır ve geçer. Script ise tarif defteri gibidir: kod kayıtlı kalır, yarın aynı kodu tek tuşla yeniden çalıştırırsın.</p>` },
        { tip: 'not', html: `<p>Küçük düzeltme: Sohbette hocanın kodu için "11 satırlık" denmişti; kod aslında <strong>12 satırdır</strong>. Sonucu değiştirmez: uzun ve tekrar çalıştırılacak kod script dosyasına yazılır.</p><p>Bu derste MATLAB'ın kurulu olup olmadığını yazmadığın için ilk konular kağıt üzerinden anlatıldı; sonra MATLAB'ı tarayıcıdan (MATLAB Online) açtığını söyledin.</p>` },

        { tip: 'baslik', metin: 'Ek: yorum, ans ve dosya adı üzerine birkaç örnek', yeni: true },
        { tip: 'metin', html: `<p>Bu ayrıntılar derste anlatıldı ama üzerlerinde ayrı soru çözülmedi. Kısa örneklerle pekiştirelim.</p><p><strong>1) Yorum, satırın neresinde başlarsa oradan sonrası okunmaz.</strong> Başına <code>%</code> koyduğun kod satırı da artık çalışmaz; kodu silmeden "kapatmak" için bu kullanılır.</p>` },
        { tip: 'kod', ad: 'Yorum: % işaretinden sonrası okunmaz', calistir: true, kod: `8 + 2      % bu kisim okunmaz
% 100 * 100
6 / 3`, cikti: `ans =
    10

ans =
     2` },
        { tip: 'metin', html: `<p><strong>2) <code>ans</code> tek bir kutudur; her yeni isimsiz sonuç öncekinin üzerine yazılır.</strong> Aşağıda son satırda <code>ans</code> yazınca en son hesaplanan isimsiz sonuç (6) gelir; <code>;</code> ile gizlenen satır da <code>ans</code>'ı değiştirir.</p>` },
        { tip: 'kod', ad: 'ans: isim verilmeyen son sonuç', calistir: true, kod: `1 + 1
2 * 3;
ans`, cikti: `ans =
     2

ans =
     6` },
        { tip: 'metin', html: `<p><strong>3) Dosya adı kuralları.</strong></p>` },
        { tip: 'tablo', basliklar: ['Dosya adı', 'Olur mu?', 'Neden?'], satirlar: [
          ['<code>vize1.m</code>', 'Olur', 'Harfle başlıyor, boşluk yok'],
          ['<code>vize 1.m</code>', 'Olmaz', 'İçinde boşluk var'],
          ['<code>1vize.m</code>', 'Olmaz', 'Rakamla başlıyor'],
          ['<code>medyan_filtre.m</code>', 'Olur', 'Boşluk yerine alt çizgi kullanılmış']
        ] },
        { tip: 'metin', html: `<p><strong>4) Çalıştırma.</strong> Command Window'da her satır <strong>Enter</strong> ile hemen çalışır. Script dosyasında ise yazdıkların beklemede kalır; <strong>Run</strong> düğmesine ya da <strong>F5</strong>'e bastığında dosyanın tamamı en üst satırdan başlayarak sırayla çalışır.</p>` },

        { tip: 'ozet', maddeler: [
          'MATLAB güçlü bir hesap makinesidir; en iyi yaptığı iş matrislerle (sayı tablolarıyla) çalışmaktır. Siyah beyaz resim = sayı tablosu, her sayı = piksel, 0 siyah, 255 beyaz.',
          'Command Window = hesap makinesi (hemen çalışır), Editor/script = tarif defteri (saklanır), Workspace = çalışma masası (hafıza), Current Folder = dosya dolabı.',
          'Script <code>.m</code> uzantılı dosyadır; adında boşluk olmaz, rakamla başlamaz. <strong>Run</strong> veya <strong>F5</strong> ile yukarıdan aşağıya satır satır çalışır.',
          '<code>%</code> işaretinden satır sonuna kadar olan kısım yorumdur, çalışmaz.',
          'Satır sonunda <code>;</code> varsa sonuç hesaplanır ama gösterilmez; yoksa gösterilir.',
          'İsim verilmeyen sonuç <code>ans</code> adıyla saklanır ve <code>ans =</code> başlığıyla gösterilir.',
          'Resimler on binlerce sayıdan oluştuğu için (256 × 256 = 65.536) görüntü işleme kodlarında satırlar çoğunlukla <code>;</code> ile biter.'
        ] }
      ]
    },

    /* ================================================================ KONU 2 */
    {
      id: 'konu-02', no: 2, baslik: 'clc, clear all, close all',
      kisa: 'Üç temizlik komutu: ekranı, hafızayı ve resim pencerelerini temizlemek.',
      yeni: false,
      bloklar: [
        { tip: 'metin', html: `<p>Bu üç komut, kod çalışmadan önce ortamı temizler ama <strong>her biri farklı bir yeri</strong> temizler:</p>` },
        { tip: 'tablo', basliklar: ['Komut', 'Neyi temizler?', 'Günlük benzetme'], satirlar: [
          ['<code>clc</code>', 'Command Window\'daki yazıları', 'Tahtayı silmek'],
          ['<code>clear all</code>', 'Workspace\'teki hafızayı', 'Çalışma masasını boşaltmak'],
          ['<code>close all</code>', 'Açık resim pencerelerini', 'Masadaki fotoğrafları kaldırmak']
        ] },
        { tip: 'metin', html: `<p>Hocaların çoğu kodun en başına şu satırı koyar. Böylece önceki çalıştırmadan kalan değerler yeni sonuçları bozmaz:</p>` },
        { tip: 'kod', kod: `clc; clear all; close all;` },
        { tip: 'baslik', metin: 'clc ile clear all farkını gösteren örnek' },
        { tip: 'metin', html: `<p>Burada <code>piksel = 200</code>, "200 sayısını <code>piksel</code> adıyla hafızada tut" demektir. Değişkenleri bir sonraki konuda ayrıntılı göreceğiz.</p>` },
        { tip: 'kod', calistir: true, kod: `piksel = 200
clc
piksel
clear all
piksel` },
        { tip: 'tablo', basliklar: ['Satır', 'Ne olur?', 'Ekranda', 'Hafızada piksel var mı?'], satirlar: [
          ['<code>piksel = 200</code>', 'Değer hafızaya yazılır, <code>;</code> olmadığı için gösterilir', '<code>piksel = 200</code>', 'Var'],
          ['<code>clc</code>', 'Ekrandaki yazılar silinir', 'Boş', 'Hâlâ var'],
          ['<code>piksel</code>', 'Hafızadaki değer sorulur', '<code>piksel = 200</code>', 'Var'],
          ['<code>clear all</code>', 'Hafıza boşaltılır', 'Değişmez', 'Yok'],
          ['<code>piksel</code>', 'Artık olmayan bir şey sorulur', 'Kırmızı hata mesajı', 'Yok']
        ] },
        { tip: 'dikkat', html: `<p>Son satırdaki hatada MATLAB şunu yazar:</p><pre>Unrecognized function or variable 'piksel'.</pre><p>Bu, "<strong>piksel diye bir şey tanımıyorum</strong>" demektir. Bu mesajı ileride de göreceksin: bir değişkeni oluşturmadan (veya sildikten sonra) kullanmaya çalıştığında çıkar.</p>` },
        { tip: 'baglanti', html: `<p><strong>Resimle bağlantısı:</strong> Hocanın kodunda <code>figure</code> komutları iki resim penceresi açar. Kodu tekrar tekrar çalıştırırsan pencereler birikir. <code>close all</code> bunları kapatır.</p><p>Ek bir yarar: Hocanın kodu <code>medyanli</code> ve <code>ortalama</code> matrislerini döngü içinde büyüterek oluşturur. Kodu yeniden çalıştırırken hafızada önceki çalıştırmadan kalmış daha büyük bir <code>medyanli</code> varsa eski değerler içinde kalabilir. Baştaki <code>clear all</code> bunu önler.</p>` },

        { tip: 'baslik', metin: 'Sıra sende sorularının cevapları' },
        { tip: 'metin', html: `<p><strong>Soru 1:</strong> Ekranda ne görünür?</p>` },
        { tip: 'kod', ad: 'Sıra sende cevabı: clc değişkeni silmez', calistir: true, kod: `piksel = 120;
clc
piksel`, cikti: `piksel =
   120` },
        { tip: 'metin', html: `<p>Ekranda <code>piksel = 120</code> görünür, çünkü <code>clc</code> yazıları siler ama <strong>hafızaya dokunmaz</strong>. (İlk satır <code>;</code> ile bittiği için zaten bir şey göstermemişti; <code>clc</code> boş ekranı siler, son satır değeri sorar.)</p>` },
        { tip: 'hata', id: 'H03', baslik: 'Çıktıyı değişken adı olmadan yazmak ("120")',
          yanlis: `<p>Senin cevabın: <code>1- 120. 2-kalır</code></p>`,
          dogru: PRE('piksel =\n   120') + `<p>ve 2. soru için: 3 pencere kapanır, <code>resim</code> hafızada kalır.</p>`,
          neden: `<p>İkisi de doğru sayıldı; yalnız biçim eksikti. Bir değişkenin adını yazıp Enter'a basınca MATLAB sadece sayıyı değil, <strong>değişkenin adıyla birlikte</strong> gösterir: <code>piksel = 120</code>. (İsim yoksa <code>ans =</code>, isim varsa o isim.) <code>clc</code> yalnız yazıları siler, hafızaya dokunmaz; <code>close all</code> yalnız pencereleri kapatır.</p>` },
        { tip: 'metin', html: `<p><strong>Soru 2:</strong> Ekranda 3 resim penceresi açık ve hafızada <code>resim</code> adında bir değişken var. Sadece <code>close all</code> yazarsan?</p><p><strong>Cevap:</strong> <code>close all</code> 3 pencereyi kapatır, <code>resim</code> hafızada <strong>kalır</strong>. Hafızayı yalnız <code>clear all</code> boşaltır.</p>` },
        { tip: 'ipucu', html: `<p>MATLAB'ı tarayıcıdan (MATLAB Online) açman çok iyi oldu. Artık şu yöntemi uygulayabilirsin: <strong>önce sonucu tahmin et, sonra kodu çalıştırıp kontrol et.</strong></p>` },

        { tip: 'baslik', metin: 'Ek: clear all üzerine pratik', yeni: true },
        { tip: 'metin', html: `<p>Derste sorular yalnız <code>clc</code> ve <code>close all</code> üzerineydi; <code>clear all</code> sonrası ne olduğunu ayrıca çalışalım.</p><p><code>clear all</code> hafızadaki <strong>bütün</strong> değişkenleri siler. Sildikten sonra o ismi kullanırsan hata alırsın; aynı isme yeniden değer verirsen sorun kalmaz.</p>` },
        { tip: 'kod', ad: 'clear all: değişkenler silinir (pratik)', calistir: true, kod: `a = 5;
b = 7;
clear all
a = 1;
a
b`, cikti: `a =
     1

Unrecognized function or variable 'b'.` },
        { tip: 'satirsatir', maddeler: [
          { kod: 'a = 5;  b = 7;', aciklama: 'İki kutu oluşur: a ve b.' },
          { kod: 'clear all', aciklama: 'İki kutu da silinir. Ekrandaki yazılara dokunmaz.' },
          { kod: 'a = 1;', aciklama: '<code>a</code> yeniden oluşturulur. Eski 5 değeri artık yok.' },
          { kod: 'a', aciklama: 'Yeni değer gösterilir: 1.' },
          { kod: 'b', aciklama: '<code>b</code> silindi ve yeniden oluşturulmadı: hata. Kod bu satırda <strong>durur</strong>; altında satır olsaydı çalışmazdı.' }
        ] },
        { tip: 'tablo', basliklar: ['Soru', 'clc', 'clear all', 'close all'], satirlar: [
          ['Ekrandaki yazılar silinir mi?', 'Evet', 'Hayır', 'Hayır'],
          ['Değişkenler silinir mi?', 'Hayır', 'Evet', 'Hayır'],
          ['Resim pencereleri kapanır mı?', 'Hayır', 'Hayır', 'Evet']
        ] },
        { tip: 'not', html: `<p>Yalnız tek bir değişkeni silmek istersen adını yazarsın: <code>clear a</code> yalnız <code>a</code>'yı siler, diğerleri kalır. <code>clear all</code> (veya tek başına <code>clear</code>) hepsini siler.</p>` },

        { tip: 'ozet', maddeler: [
          '<code>clc</code>: Command Window\'daki yazıları siler (tahtayı silmek). Hafızaya dokunmaz.',
          '<code>clear all</code>: Workspace\'teki değişkenleri siler (masayı boşaltmak). Ekrana dokunmaz.',
          '<code>close all</code>: açık resim pencerelerini kapatır (fotoğrafları kaldırmak). Değişkenlere dokunmaz.',
          'Kodun başına <code>clc; clear all; close all;</code> yazmak, önceki çalıştırmadan kalanların yeni sonuçları bozmasını önler.',
          'Silinmiş ya da hiç oluşturulmamış bir ismi kullanırsan: <code>Unrecognized function or variable \'...\'</code> = "bunu tanımıyorum".',
          'Bir değişkenin adını yazınca MATLAB onu adıyla birlikte gösterir: <code>piksel = 120</code>.'
        ] }
      ]
    },

    /* ================================================================ KONU 3 */
    {
      id: 'konu-03', no: 3, baslik: 'Değişkenler ve temel işlemler',
      kisa: 'Değişken = isimli kutu; = "koy" demektir; + - * / ^ ve işlem sırası.',
      yeni: false,
      bloklar: [
        { tip: 'metin', html: `<p><strong>Değişken</strong>, üzerinde isim yazan bir <strong>kutu</strong> gibidir. Kutuya bir değer koyar, sonra o değeri ismiyle kullanırsın.</p><p>MATLAB'da <code>=</code> işareti "eşittir" demek <strong>değildir</strong>. "<strong>Sağdakini hesapla, sonucu soldaki kutuya koy</strong>" demektir.</p>` },
        { tip: 'baslik', metin: 'Temel işlemler ve işlem sırası' },
        { tip: 'tablo', basliklar: ['İşaret', 'İşlem', 'Örnek', 'Sonuç'], satirlar: [
          ['<code>+</code>', 'Toplama', '<code>7 + 3</code>', '10'],
          ['<code>-</code>', 'Çıkarma', '<code>7 - 3</code>', '4'],
          ['<code>*</code>', 'Çarpma', '<code>7 * 3</code>', '21'],
          ['<code>/</code>', 'Bölme', '<code>6 / 3</code>', '2'],
          ['<code>^</code>', 'Üs alma', '<code>2 ^ 3</code>', '8']
        ] },
        { tip: 'metin', html: `<p>İşlem sırası matematikteki gibidir: <strong>önce parantez, sonra üs, sonra çarpma ve bölme, en son toplama ve çıkarma</strong>.</p>` },
        { tip: 'baslik', metin: 'İsim verme kuralları' },
        { tip: 'metin', html: `<ul><li>İsim <strong>harfle başlar</strong> ve <strong>boşluk içermez</strong>.</li><li><strong>Türkçe karakter kullanılmaz</strong>: ş, ı, ö gibi harfler hata verir.</li><li><strong>Büyük ve küçük harf farklı sayılır.</strong></li></ul>` },
        { tip: 'baslik', metin: 'Örnek: iki komşu pikselin ortalaması' },
        { tip: 'kod', ad: 'İki komşu pikselin ortalaması', calistir: true, kod: `piksel1 = 100;
piksel2 = 50;
ortalama = (piksel1 + piksel2) / 2
piksel1 = piksel1 + 10`, cikti: `ortalama =
    75

piksel1 =
   110` },
        { tip: 'tablo', basliklar: ['Satır', 'Ne olur?', 'piksel1', 'piksel2', 'ortalama'], satirlar: [
          ['<code>piksel1 = 100;</code>', '100 kutuya konur, <code>;</code> yüzünden gösterilmez', '100', '–', '–'],
          ['<code>piksel2 = 50;</code>', '50 kutuya konur, gösterilmez', '100', '50', '–'],
          ['<code>ortalama = (piksel1 + piksel2) / 2</code>', 'Önce parantez: 150, sonra 150 / 2 = 75', '100', '50', '75'],
          ['<code>piksel1 = piksel1 + 10</code>', 'Eski değer alınır: 100 + 10 = 110, kutuya geri yazılır', '110', '50', '75']
        ] },
        { tip: 'metin', html: `<p>Son satır matematikte imkânsız görünür, çünkü bir sayı kendisinin 10 fazlasına eşit olamaz. Ama <code>=</code> "eşittir" değil, "<strong>koy</strong>" demek olduğu için burada sorun yoktur. Eski değerin yerini yeni değer alır.</p>` },
        { tip: 'dikkat', html: `<p><strong>Parantezi unutsaydık</strong> <code>piksel1 + piksel2 / 2</code> önce bölmeyi yapardı: 100 + 25 = <strong>125</strong>. Yani yanlış sonuç çıkardı (doğrusu 75).</p>` },
        { tip: 'baglanti', html: `<p>Hocanın kodundaki <code>w-2</code> ve <code>i+2</code> tam olarak bu tür işlemlerdir. Örneğin <code>w</code> 256 ise <code>w-2</code> sonucu 254 olur.</p>` },

        { tip: 'baslik', metin: 'Sıra sende sorularının cevapları' },
        { tip: 'ipucu', html: `<p>Çalışma yöntemi: <strong>Önce kağıda tahminini yaz, sonra MATLAB'da (ya da buradaki uygulama alanında) dene.</strong></p>` },
        { tip: 'metin', html: `<p><strong>Soru 1:</strong> Ekranda ne görünür?</p>` },
        { tip: 'kod', ad: 'Sıra sende cevabı: a = a + 5 ve parantez', calistir: true, kod: `a = 10;
a = a + 5;
b = (a + 5) / 2`, cikti: `b =
    10` },
        { tip: 'metin', html: `<p>Birinci satırda <code>a</code> 10 olur. İkinci satırda <code>a</code> 15 olur (eski değer + 5). Üçüncü satırda <code>b = (15 + 5) / 2 = 10</code> çıkar. Yalnız son satır <code>;</code> ile bitmediği için ekranda yalnız <code>b = 10</code> görünür. Senin cevabın ("10") doğruydu.</p><p><strong>Soru 2:</strong> Bu kod çalışınca ne olur, neden?</p>` },
        { tip: 'kod', ad: 'Sıra sende cevabı: Deger ile deger farklı (hata verir)', calistir: true, kod: `Deger = 30;
deger`, cikti: `Unrecognized function or variable 'deger'.` },
        { tip: 'metin', html: `<p><strong>Hata</strong> alırsın, çünkü <code>Deger</code> ile <code>deger</code> MATLAB için <strong>iki farklı isimdir</strong> (büyük/küçük harf). Hafızada <code>Deger</code> var, <code>deger</code> yok. Senin cevabın ("hata") doğruydu.</p>` },

        { tip: 'baslik', metin: 'Ek: isim kuralları, işlem önceliği ve üs alma', yeni: true },
        { tip: 'metin', html: `<p>Derste bu başlıklardan yalnız büyük-küçük harf soruldu. Diğerlerini örneklerle açalım.</p><p><strong>1) Hangi isimler olur, hangileri olmaz?</strong></p>` },
        { tip: 'tablo', basliklar: ['İsim', 'Olur mu?', 'Neden?'], satirlar: [
          ['<code>piksel1</code>', 'Olur', 'Harfle başlıyor; içinde rakam olabilir'],
          ['<code>1piksel</code>', 'Olmaz', 'Rakamla başlıyor'],
          ['<code>sol piksel</code>', 'Olmaz', 'Boşluk içeriyor'],
          ['<code>sol_piksel</code>', 'Olur', 'Boşluk yerine alt çizgi kullanılabilir'],
          ['<code>gürültü</code>', 'Olmaz', 'Türkçe karakter (ü) içeriyor; <code>gurultu</code> yaz'],
          ['<code>ışık</code>', 'Olmaz', 'Türkçe karakter (ı, ş) içeriyor; <code>isik</code> yaz'],
          ['<code>Blok</code> ve <code>blok</code>', 'İkisi de olur', 'Ama bunlar iki <strong>ayrı</strong> kutudur']
        ] },
        { tip: 'baglanti', html: `<p>Hocanın kodundaki isimlere bak: <code>res</code>, <code>J</code>, <code>w</code>, <code>h</code>, <code>blok</code>, <code>medyanli</code>, <code>ortalama</code>. Hiçbirinde Türkçe karakter yok: "medyanlı" değil <code>medyanli</code>. Büyük <code>J</code> ile döngüdeki küçük <code>j</code> de <strong>iki ayrı değişkendir</strong>: <code>J</code> gürültülü resim, <code>j</code> sütun sayacı.</p>` },
        { tip: 'metin', html: `<p><strong>2) İşlem önceliği: adım adım.</strong> Sıra: parantez → üs → çarpma/bölme → toplama/çıkarma.</p>` },
        { tip: 'tablo', basliklar: ['Yazılan', 'MATLAB\'ın yaptığı', 'Sonuç'], satirlar: [
          ['<code>2 + 3 * 4</code>', 'Önce 3 × 4 = 12, sonra 2 + 12', '14'],
          ['<code>(2 + 3) * 4</code>', 'Önce parantez 5, sonra 5 × 4', '20'],
          ['<code>10 - 4 / 2</code>', 'Önce 4 / 2 = 2, sonra 10 − 2', '8'],
          ['<code>(10 - 4) / 2</code>', 'Önce parantez 6, sonra 6 / 2', '3'],
          ['<code>2 * 3 ^ 2</code>', 'Önce üs 3² = 9, sonra 2 × 9', '18'],
          ['<code>(2 * 3) ^ 2</code>', 'Önce parantez 6, sonra 6²', '36'],
          ['<code>(100 + 50 + 30) / 3</code>', 'Üç pikselin ortalaması: 180 / 3', '60'],
          ['<code>100 + 50 + 30 / 3</code>', 'Parantez yok: yalnız 30 bölünür, 100 + 50 + 10', '160']
        ] },
        { tip: 'metin', html: `<p><strong>3) Üs alma <code>^</code>.</strong> <code>5 ^ 2</code> = 5 × 5 = 25, <code>2 ^ 8</code> = 256. (Bir resimde bir pikselin alabileceği değer sayısı 2<sup>8</sup> = 256'dır: 0'dan 255'e.)</p>` },
        { tip: 'kod', ad: 'İşlem önceliği ve üs alma: ^ ve parantez', calistir: true, kod: `kenar = 4;
alan = kenar ^ 2
x = 2 + 3 * 4
y = (2 + 3) * 4`, cikti: `alan =
    16

x =
    14

y =
    20` },
        { tip: 'metin', html: `<p><strong>4) Kutuyu güncelleme.</strong> <code>sayac = sayac + 1</code> kalıbını döngülerde çok göreceksin: "kutudaki değeri al, 1 ekle, aynı kutuya geri koy".</p>` },
        { tip: 'kod', ad: 'Sayaç: değişkeni kendi üstüne yazmak', calistir: true, kod: `sayac = 0;
sayac = sayac + 1;
sayac = sayac + 1;
sayac = sayac * 10`, cikti: `sayac =
    20` },

        { tip: 'ozet', maddeler: [
          'Değişken = isimli kutu. <code>=</code> "eşittir" değil, "sağdakini hesapla, soldaki kutuya koy" demektir.',
          '<code>x = x + 10</code> geçerlidir: eski değer alınır, 10 eklenir, kutuya geri yazılır.',
          'İşlemler: <code>+</code> <code>-</code> <code>*</code> <code>/</code> <code>^</code>. Sıra: parantez → üs → çarpma/bölme → toplama/çıkarma.',
          'Ortalama alırken parantez şart: <code>(a + b) / 2</code>. Parantezsiz <code>a + b / 2</code> yalnız <code>b</code>\'yi böler.',
          'İsim harfle başlar, boşluk ve Türkçe karakter içermez.',
          'Büyük-küçük harf farklıdır: <code>Deger</code> ile <code>deger</code> iki ayrı isimdir.',
          'Hocanın kodundaki <code>w-2</code> ve <code>i+2</code> bu tür basit işlemlerdir (w = 256 ise w-2 = 254).'
        ] }
      ]
    },

    /* ================================================================ KONU 4 */
    {
      id: 'konu-04', no: 4, baslik: 'Vektör ve matris oluşturma',
      kisa: 'Köşeli parantez, boşluk ve ; ile matris yazmak; zeros ve ones.',
      yeni: false,
      bloklar: [
        { tip: 'metin', html: `<p><strong>Vektör</strong>, tek sıra halinde dizilmiş sayılardır. <strong>Matris</strong> ise satır ve sütunlardan oluşan sayı tablosudur. Siyah beyaz bir resim de bir matristir, içindeki her eleman bir pikseldir.</p>` },
        { tip: 'baslik', metin: 'Matris yazma kuralları' },
        { tip: 'metin', html: `<ul><li>Köşeli parantez <code>[ ]</code> içine yazılır.</li><li><strong>Boşluk</strong>, aynı satırda yan sütuna geçirir.</li><li><strong>Noktalı virgül</strong> <code>;</code>, alt satıra geçirir.</li><li>Her satırda <strong>aynı sayıda eleman</strong> olmalıdır. Yoksa hata alırsın, çünkü tablo düzgün olmaz.</li></ul>` },
        { tip: 'dikkat', html: `<p><code>;</code> köşeli parantezin <strong>içinde</strong> "alt satıra geç" demektir. Satırın <strong>sonunda</strong> ise "sonucu gösterme" demektir.</p>` },
        { tip: 'baslik', metin: 'Hazır matris üreten iki komut: zeros ve ones' },
        { tip: 'metin', html: `<ul><li><code>zeros(satır, sütun)</code>: Her elemanı 0 olan matris yapar. Bunu tamamen <strong>siyah bir resim</strong> gibi düşünebilirsin.</li><li><code>ones(satır, sütun)</code>: Her elemanı 1 olan matris yapar.</li></ul><p>Parantez içinde <strong>önce satır, sonra sütun</strong> sayısı yazılır.</p>` },
        { tip: 'kod', calistir: true, kod: `resim = [10 20 30; 40 50 60; 70 80 90]
siyah = zeros(2,3)
beyaz = ones(2,3) * 255`, cikti: `resim =
    10    20    30
    40    50    60
    70    80    90

siyah =
     0     0     0
     0     0     0

beyaz =
   255   255   255
   255   255   255` },
        { tip: 'satirsatir', maddeler: [
          { kod: 'resim = [10 20 30; 40 50 60; 70 80 90]', aciklama: 'İlk satıra 10, 20, 30 yazılır. <code>;</code> ile alt satıra geçilir ve 40, 50, 60 yazılır. Sonra aynı şekilde 70, 80, 90 yazılır. Sonuç 3 satır, 3 sütun, yani <strong>9 piksellik</strong> küçük bir resimdir. Sayılar arttıkça pikseller aydınlanır.' },
          { kod: 'siyah = zeros(2,3)', aciklama: '2 satır, 3 sütunluk, her elemanı 0 olan bir matris yapar. Yani 6 piksellik siyah bir resim.' },
          { kod: 'beyaz = ones(2,3) * 255', aciklama: 'Önce her elemanı 1 olan 2×3 matris oluşur. Sonra her eleman 255 ile çarpılır ve 6 piksellik beyaz bir resim elde edilir.' }
        ] },
        { tip: 'baglanti', html: `<p>Hocanın kodundaki <code>J</code>, 256 satır ve 256 sütunluk bir sayı tablosudur. <code>blok</code> ise o tablodan alınan 3×3'lük küçük bir parçadır.</p>` },

        { tip: 'baslik', metin: 'Sıra sende sorularının cevapları' },
        { tip: 'metin', html: `<p><strong>Soru 1:</strong> Sol üstü siyah, sağ üstü beyaz, sol altı beyaz, sağ altı siyah olan 2×2'lik resmi <code>dama</code> adıyla oluşturan kod:</p>` },
        { tip: 'kod', ad: 'Sıra sende cevabı: 2×2 dama tahtası', calistir: true, kod: `dama = [0 255; 255 0]`, cikti: `dama =
     0   255
   255     0` },
        { tip: 'hata', id: 'H04', baslik: 'Beyaz için 1 yazmak (0–255 ölçeğinde beyaz 255\'tir)',
          yanlis: `<p>Senin yazdığın: <code>dama = [0 1 ; 1 0]</code></p>`,
          dogru: `<p><code>dama = [0 255 ; 255 0]</code></p>`,
          neden: `<p>Yapı doğruydu: köşeli parantez, boşluk ve <code>;</code> kullanımın, siyah ve beyaz piksellerin yerleri doğru. Yalnız beyazın <strong>sayısı</strong> eksik kaldı. 0 ile 255 arasındaki ölçeğimizde 0 siyahtı; 1 değeri bu ölçekte siyaha çok yakındır (neredeyse siyah). Beyazı <strong>255</strong> gösterir.</p><p>İpucu şuydu: "1 bu ölçekte nereye düşer: beyaza mı yakın, siyaha mı? Beyazı hangi sayı gösteriyordu?"</p><p>Not: Yazdığın 1 her durumda yanlış değil. Resimler bazen 0 ile 1 arasındaki bir ölçekte de tutulur (<code>double</code> resimler; Konu 12). Bu konuda 0–255 ölçeğiyle çalışıyoruz.</p>` },
        { tip: 'metin', html: `<p><strong>Soru 2:</strong> <code>zeros(3,2)</code> ekranda nasıl görünür, bu resimde kaç piksel vardır?</p>` },
        { tip: 'kod', ad: 'Sıra sende cevabı: zeros(3,2)', calistir: true, kod: `zeros(3,2)`, cikti: `ans =
     0     0
     0     0
     0     0` },
        { tip: 'metin', html: `<p>3 satır, 2 sütun, her eleman 0 ve toplam 3 × 2 = <strong>6 piksel</strong>. Senin cevabın ("her satırda 2 tane 0 olan 3 satır, 6") doğruydu.</p>` },

        { tip: 'baslik', metin: 'Ek: vektörler, ones ve "satırlar eşit uzunlukta olmalı" hatası', yeni: true },
        { tip: 'metin', html: `<p>Derste bu üç başlık üzerine soru çözülmedi. Ayrıntılı bakalım.</p><p><strong>1) Satır vektörü ve sütun vektörü.</strong> Vektör, tek satırlı ya da tek sütunlu matristir. Elemanları boşlukla ayırırsan yan yana (satır vektörü), <code>;</code> ile ayırırsan alt alta (sütun vektörü) dizilir.</p>` },
        { tip: 'kod', ad: 'Yatay ve dikey vektör', calistir: true, kod: `yatay = [10 20 30]
dikey = [10; 20; 30]`, cikti: `yatay =
    10    20    30

dikey =
    10
    20
    30` },
        { tip: 'metin', html: `<p><code>yatay</code> 1 satır 3 sütundur (1×3), <code>dikey</code> 3 satır 1 sütundur (3×1). İkisinde de aynı üç sayı var ama şekilleri farklıdır. Elemanlar arasına boşluk yerine virgül de konabilir: <code>[10, 20, 30]</code> ile <code>[10 20 30]</code> aynıdır.</p><p><strong>2) <code>ones</code> ile istediğin parlaklıkta düz resim.</strong> <code>ones</code> tek başına 1'lerden oluşur; bir sayıyla çarparsan her piksel o sayı olur.</p>` },
        { tip: 'kod', ad: 'ones ile gri resim: ones(2,4) * 128', calistir: true, kod: `gri = ones(2,4) * 128
birler = ones(3,1)`, cikti: `gri =
   128   128   128   128
   128   128   128   128

birler =
     1
     1
     1` },
        { tip: 'tablo', basliklar: ['Yazılan', 'Boyut', 'İçerik', 'Resim olarak (0–255 ölçeği)'], satirlar: [
          ['<code>zeros(2,3)</code>', '2 satır, 3 sütun', 'Hepsi 0', 'Tamamen siyah'],
          ['<code>ones(2,3)</code>', '2 satır, 3 sütun', 'Hepsi 1', 'Neredeyse siyah (1, 0\'a çok yakın)'],
          ['<code>ones(2,3) * 255</code>', '2 satır, 3 sütun', 'Hepsi 255', 'Tamamen beyaz'],
          ['<code>ones(3,2) * 100</code>', '3 satır, 2 sütun', 'Hepsi 100', 'Koyu gri'],
          ['<code>zeros(1,5)</code>', '1 satır, 5 sütun', 'Hepsi 0', '5 piksellik siyah şerit (satır vektörü)']
        ] },
        { tip: 'dikkat', html: `<p><code>zeros(2,3)</code> ile <code>zeros(3,2)</code> aynı şey değildir: ilki 2 satır 3 sütun, ikincisi 3 satır 2 sütundur. Sıra hep <strong>önce satır, sonra sütun</strong>.</p>` },
        { tip: 'metin', html: `<p><strong>3) Her satırda aynı sayıda eleman olmalı.</strong> Aşağıdaki kodda ilk satırda 3, ikinci satırda 2 sayı var; tablo düzgün olmadığı için MATLAB hata verir:</p>` },
        { tip: 'kod', ad: 'Hata örneği: satırlar eşit uzunlukta değil', calistir: true, kod: `bozuk = [1 2 3; 4 5]`, cikti: `Dimensions of arrays being concatenated are not consistent.` },
        { tip: 'metin', html: `<p>Bu mesaj "birleştirilen parçaların boyutları birbirini tutmuyor" demektir. Düzeltmek için eksik elemanı tamamlarsın: <code>[1 2 3; 4 5 6]</code>.</p><p><strong>4) Elemanları saymak.</strong> Bir matris yazımına bakıp boyutunu söylemek için: <code>;</code> sayısı + 1 = satır sayısı; bir satırdaki sayı adedi = sütun sayısı. Örneğin <code>[5 6 7 8; 1 2 3 4]</code> içinde 1 tane <code>;</code> var → 2 satır; her satırda 4 sayı → 4 sütun; toplam 2 × 4 = 8 piksel.</p>` },

        { tip: 'ozet', maddeler: [
          'Vektör = tek sıra sayı; matris = satır ve sütunlardan oluşan sayı tablosu; siyah beyaz resim = matris, eleman = piksel.',
          'Matris <code>[ ]</code> içine yazılır; boşluk (veya virgül) yan sütuna, <code>;</code> alt satıra geçirir.',
          'Her satırda aynı sayıda eleman olmalı; yoksa hata.',
          '<code>;</code> parantez içinde "alt satır", satır sonunda "gösterme" demektir.',
          '<code>zeros(satır, sütun)</code> hepsi 0 (siyah), <code>ones(satır, sütun)</code> hepsi 1; önce satır, sonra sütun.',
          '<code>ones(2,3) * 255</code> her elemanı 255 yapar: beyaz resim.',
          '0–255 ölçeğinde 0 siyah, 255 beyazdır; 1 neredeyse siyahtır.',
          'Hocanın kodunda <code>J</code> 256×256\'lık tablo, <code>blok</code> ondan kesilen 3×3\'lük parçadır.'
        ] }
      ]
    },

    /* ================================================================ KONU 5 */
    {
      id: 'konu-05', no: 5, baslik: 'İndeksleme: matristen eleman seçmek',
      kisa: 'A(i,j), aralıkla parça kesme, tek başına :, A(:), katmanlar A(:,:,1) ve başlangıç:adım:bitiş.',
      yeni: false,
      bloklar: [
        { tip: 'metin', html: `<p><strong>İndeks</strong>, bir pikselin <strong>adresidir</strong>: "kaçıncı satır, kaçıncı sütun?" MATLAB'da <strong>sayma 1'den başlar</strong> ve <strong>önce satır, sonra sütun</strong> yazılır.</p><p>Örnek resmimiz (A):</p>` },
        { tip: 'tablo', basliklar: ['', '1. sütun', '2. sütun', '3. sütun', '4. sütun'], satirlar: [
          ['<strong>1. satır</strong>', '10', '20', '30', '40'],
          ['<strong>2. satır</strong>', '50', '60', '70', '80'],
          ['<strong>3. satır</strong>', '90', '100', '110', '120'],
          ['<strong>4. satır</strong>', '130', '140', '150', '160']
        ] },
        { tip: 'baslik', metin: 'İki nokta : ile sayı dizisi yazma' },
        { tip: 'metin', html: `<ul><li><code>1:4</code> → 1'den 4'e birer birer: <code>1 2 3 4</code></li><li><code>1:2:10</code> → 1'den başla, ikişer art, 10'u geçme: <code>1 3 5 7 9</code>. Yazım şekli <strong><code>başlangıç:adım:bitiş</code></strong> şeklindedir.</li></ul>` },
        { tip: 'baslik', metin: 'Örnek kod' },
        { tip: 'kod', ad: 'İndeksleme özeti: A(2,3), A(1:3,2:4), A(2,:), B(:)', calistir: true, kod: `A = [10 20 30 40; 50 60 70 80; 90 100 110 120; 130 140 150 160];
A(2,3)
A(1:3,2:4)
A(2,:)
B = [10 20; 30 40];
B(:)`, cikti: `ans =
    70

ans =
    20    30    40
    60    70    80
   100   110   120

ans =
    50    60    70    80

ans =
    10
    30
    20
    40` },
        { tip: 'satirsatir', maddeler: [
          { kod: 'A = [10 20 30 40; 50 60 70 80; 90 100 110 120; 130 140 150 160];', aciklama: 'Yukarıdaki 4×4\'lük resmi oluşturur.' },
          { kod: 'A(2,3)', aciklama: '2. satır ile 3. sütunun kesiştiği pikseli verir: <strong>70</strong>.' },
          { kod: 'A(1:3,2:4)', aciklama: '1, 2, 3. satırlar ile 2, 3, 4. sütunların kesişimini <strong>kesip alır</strong>:<pre>    20    30    40\n    60    70    80\n   100   110   120</pre>' },
          { kod: 'A(2,:)', aciklama: 'Tek başına <code>:</code> "<strong>hepsi</strong>" demektir. Yani 2. satırın tüm sütunları: <code>50 60 70 80</code>.' },
          { kod: 'B = [10 20; 30 40];', aciklama: '2×2\'lik yeni bir resim oluşturur.' },
          { kod: 'B(:)', aciklama: 'Matrisi <strong>sütun sütun</strong> okuyup alt alta tek sıra yapar. Önce 1. sütun, sonra 2. sütun gelir:<pre>    10\n    30\n    20\n    40</pre>' }
        ] },
        { tip: 'baslik', metin: 'A(:,:,1) nedir?' },
        { tip: 'metin', html: `<p>Renkli resim tek bir tablo değil, <strong>üst üste 3 tablodur</strong>: 1. kat kırmızı, 2. kat yeşil, 3. kat mavi. <code>A(:,:,1)</code> şu anlama gelir: tüm satırlar, tüm sütunlar, 1. kat. Yani resmin <strong>kırmızı katmanını</strong> alır. (Ayrıntısı aşağıda, "Sık Sorulan" kutusunda.)</p>` },
        { tip: 'baglanti', html: `<p>Hocanın kodundaki <code>blok=J(i:i+2,j:j+2)</code> satırı resimden 3×3'lük bir parça keser. Örneğin <code>i=1</code> ve <code>j=1</code> ise <code>J(1:3,1:3)</code> olur.</p>` },

        { tip: 'baslik', metin: 'Aralıkla parça kesme adım adım' },
        { tip: 'sss', id: 'S01',
          soru: `<code>A(1:3,2:4)</code> yazınca neden bu 3×3'lük sonuç çıkıyor, bu yazım ne demek? (Özgün mesajın: "A(1:3,2:4) / ans = 3×3 / 20 30 40 / 60 70 80 / 100 110 120 / bunu anlamadım")`,
          cevap: `<p>Hiç sorun değil, bu satırı adım adım açalım. Üstteki <code>ans = 3×3</code> yazısı da "sonuç 3 satır, 3 sütunlu bir matris" demektir (MATLAB Online böyle bir başlık gösterir).</p>
<p><strong>1. Parantezi virgülden ikiye böl.</strong> <code>A(1:3, 2:4)</code> ifadesinde virgülün <strong>solu satırları</strong>, <strong>sağı sütunları</strong> seçer:</p>
<ul><li><code>1:3</code> → 1, 2 ve 3. satırları al</li><li><code>2:4</code> → 2, 3 ve 4. sütunları al</li></ul>
<p><strong>2. Satırları seç.</strong> 4. satır istenmediği için atılır:</p>` +
            PRE('    10    20    30    40\n    50    60    70    80\n    90   100   110   120') +
            `<p><strong>3. Kalanlardan sütunları seç.</strong> 1. sütun istenmediği için (10, 50, 90) atılır:</p>` +
            PRE('    20    30    40\n    60    70    80\n   100   110   120') +
            `<p>Kalan parça, senin ekranda gördüğün sonuçtur. Bu işlem <strong>resmin üzerine dikdörtgen bir pencere koyup yalnızca pencerenin içini almaya</strong> benzer.</p>
<p><strong>Her sayı nereden geldi?</strong></p>` +
            T(['', '2. sütun', '3. sütun', '4. sütun'], [
              ['<strong>1. satır</strong>', 'A(1,2) = 20', 'A(1,3) = 30', 'A(1,4) = 40'],
              ['<strong>2. satır</strong>', 'A(2,2) = 60', 'A(2,3) = 70', 'A(2,4) = 80'],
              ['<strong>3. satır</strong>', 'A(3,2) = 100', 'A(3,3) = 110', 'A(3,4) = 120']
            ]) +
            `<p><strong>Küçük bir deneme:</strong> Aynı A matrisiyle <code>A(1:2, 3:4)</code> için bu üç adımı uygula. Hangi satırlar ve hangi sütunlar kalıyor, sonuç ne çıkıyor?</p>
<p><strong>Cevap:</strong> 1 ve 2. satırlar ile 3 ve 4. sütunlar kalıyor, yani sonuç 2×2'lik bir matris:</p>` +
            PRE('    30    40\n    70    80') },
        { tip: 'kod', calistir: true, kod: `A = [10 20 30 40; 50 60 70 80; 90 100 110 120; 130 140 150 160];
A(1:2, 3:4)`, cikti: `ans =
    30    40
    70    80` },
        { tip: 'hata', id: 'H05', baslik: 'Matris cevabını düz sıra hâlinde yazmak',
          yanlis: `<p>Senin cevapların: <code>30 40 70 80</code> · <code>50 60 70 90 100 110 130 140 150</code> · <code>a-0 255 200 20</code></p>`,
          dogru: `<p>Sonuçlar matristir, satır-sütun düzeniyle yazılır:</p>` + PRE('[30 40; 70 80]                           (2×2)\n[50 60 70; 90 100 110; 130 140 150]      (3×3)\n[0 255; 200 20]                          (2×2)'),
          neden: `<p>Sayıların hepsi doğruydu; eksik olan satırların nerede bittiğiydi. <code>30 40 70 80</code> tek satırlık bir vektör de olabilir, 2×2'lik bir matris de. Satır sınırları belirtilmezse sonuç belirsiz kalır. Kağıtta alt alta yaz ya da satırları <code>;</code> ile ayır: <code>[30 40; 70 80]</code>. Sınavda "sonuç matrisini yazınız" denirse boyut da cevabın parçasıdır.</p>` },

        { tip: 'baslik', metin: 'Sıra sende, Soru 1: blok = A(i:i+2, j:j+2)' },
        { tip: 'metin', html: `<p>İpucu şuydu: Önce <code>i</code> ve <code>j</code> yerine sayıları koy. <code>i:i+2</code>, "i'den i+2'ye kadar" demektir. Sonra az önceki adımları uygula. (Cevapta matris yazarken satırları <code>;</code> ile ayırabilirsin.)</p>` },
        { tip: 'kod', calistir: true, kod: `A = [10 20 30 40; 50 60 70 80; 90 100 110 120; 130 140 150 160];
i = 2;
j = 1;
blok = A(i:i+2, j:j+2)`, cikti: `blok =
    50    60    70
    90   100   110
   130   140   150` },
        { tip: 'metin', html: `<p><code>i=2</code> ve <code>j=1</code> olunca kod <code>A(2:4, 1:3)</code> olur ve 3×3'lük yukarıdaki parça çıkar. Senin cevabın ("50 60 70 90 100 110 130 140 150") doğruydu.</p>` },
        { tip: 'baglanti', html: `<p>Hocanın kodundaki <code>J(i:i+2,j:j+2)</code> satırı da <strong>tam olarak bunu</strong> yapıyor: <code>i</code>. satırdan başlayıp 3 satır, <code>j</code>. sütundan başlayıp 3 sütun alır.</p><p>Küçük ama önemli bir ayrıntı: MATLAB'da <code>:</code> işareti toplama ve çıkarmadan <strong>sonra</strong> işlenir. Yani <code>i:i+2</code> aslında <code>i:(i+2)</code> demektir; <code>1:w-2</code> de <code>1:(w-2)</code> demektir. Parantez yazmana gerek yoktur.</p>` },

        { tip: 'baslik', metin: 'Katmanlar: iki tane : bulunan A(:,:,1) yazımı' },
        { tip: 'sss', id: 'S02',
          soru: `İki tane <code>:</code> bulunan <code>A(:,:,1)</code> katman yazımını anlamadım, ne demek? (Özgün mesajın: "şu 2 tan : olan katman kısmın anlamadım")`,
          cevap: `<p>Bu yazımı ayrı ayrı açalım. Renkli resim, <strong>üst üste duran 3 şeffaf kağıt</strong> gibidir. Her kağıt aynı boyutta bir tablodur: 1. kat <strong>kırmızı</strong>, 2. kat <strong>yeşil</strong>, 3. kat <strong>mavi</strong> miktarını tutar.</p>
<p>Bu yüzden renkli bir pikselin adresinde 3 bilgi vardır: <strong>satır, sütun, kat</strong>.</p>
<p>2×2'lik renkli bir resim:</p>` +
            PRE('renkli(:,:,1) = [255 0; 200 10];\nrenkli(:,:,2) = [0 255; 200 20];\nrenkli(:,:,3) = [0 0; 0 30];\nkirmizi = renkli(:,:,1)') +
            `<ul><li>İlk satır, 1. katın (kırmızı) tüm piksellerine değer yazar.</li><li>İkinci satır, 2. katın (yeşil) tüm piksellerine değer yazar.</li><li>Üçüncü satır, 3. katın (mavi) tüm piksellerine değer yazar.</li><li>Son satır, 1. katın tamamını alır.</li></ul>
<p>Son satırı parçalayalım: <code>renkli(:, :, 1)</code></p>` +
            T(['Yer', 'Yazılan', 'Anlamı'], [
              ['1. kısım', '<code>:</code>', 'Tüm satırlar'],
              ['2. kısım', '<code>:</code>', 'Tüm sütunlar'],
              ['3. kısım', '<code>1</code>', 'Sadece 1. kat']
            ]) +
            `<p>Yani "<strong>1. kağıdı komple çıkar</strong>" demiş oluruz. Sonuç:</p>` +
            PRE('   255     0\n   200    10') +
            `<p>Tek bir pikselin rengi, 3 kattaki sayıların birleşimidir:</p>` +
            T(['Piksel', 'Kırmızı', 'Yeşil', 'Mavi', 'Görünen renk'], [
              ['Sol üst', '255', '0', '0', 'Kırmızı'],
              ['Sağ üst', '0', '255', '0', 'Yeşil'],
              ['Sol alt', '200', '200', '0', 'Sarıya yakın'],
              ['Sağ alt', '10', '20', '30', 'Neredeyse siyah']
            ]) +
            `<p>Hocanın kodundaki <code>cameraman.tif</code> siyah beyaz olduğu için <strong>tek katlıdır</strong>. Bu yüzden orada <code>J(i,j)</code> gibi iki adres yeterlidir.</p>
<p><strong>Küçük bir deneme</strong> (yukarıdaki <code>renkli</code> için): a) <code>renkli(:,:,2)</code> ne verir? b) <code>renkli(2,1,1)</code> ne verir?</p>
<p><strong>Cevap:</strong> a) 2. katın tamamı gelir, yani <code>[0 255; 200 20]</code> matrisi. b) 2. satır, 1. sütun, 1. kattaki değer: <strong>200</strong>.</p>` },
        { tip: 'kod', calistir: true, kod: `renkli(:,:,1) = [255 0; 200 10];
renkli(:,:,2) = [0 255; 200 20];
renkli(:,:,3) = [0 0; 0 30];
kirmizi = renkli(:,:,1)
yesil = renkli(:,:,2)
renkli(2,1,1)`, cikti: `kirmizi =
   255     0
   200    10

yesil =
     0   255
   200    20

ans =
   200` },

        { tip: 'baslik', metin: 'Sıra sende, Soru 2: 2:2:8 ve K(:)' },
        { tip: 'sss', id: 'S03',
          soru: `Ana matrisi verir misin, cevabı ona göre vereyim? (Özgün mesajın: "bana ana matrisi versene bi ona göre cevabı verim"; soru: a) <code>2:2:8</code> hangi sayıları üretir? b) <code>K = [5 6; 7 8];</code> ise <code>K(:)</code> hangi sırayla verir?)`,
          cevap: `<p><strong>a)</strong> şıkkı için matrise gerek yok, çünkü <code>2:2:8</code> tek başına bir <strong>sayı listesi</strong> üretir: 2'den başla, ikişer art, 8'i geçme.</p>
<p><strong>b)</strong> şıkkındaki ana matris <code>K</code>:</p>` +
            T(['', '1. sütun', '2. sütun'], [
              ['<strong>1. satır</strong>', '5', '6'],
              ['<strong>2. satır</strong>', '7', '8']
            ]) +
            `<p><code>K(:)</code> önce 1. sütunu yukarıdan aşağı okur, sonra 2. sütuna geçer. Sayıların çıkış sırası ne olur? (Cevap: 5, 7, 6, 8.)</p>` },
        { tip: 'hata', id: 'H06', baslik: '2:2:8 için matris aramak; K\'nin soruda verildiğini görmemek',
          yanlis: `<p>Senin mesajın: <code>bana ana matrisi versene bi ona göre cevabı verim</code></p>`,
          dogru: `<p><code>2:2:8</code> için matrise gerek yoktur; tek başına <code>2 4 6 8</code> listesini üretir. <code>K</code> ise zaten soruda verilmişti: <code>K = [5 6; 7 8];</code></p>`,
          neden: `<p><code>başlangıç:adım:bitiş</code> yazımı bir matristen eleman seçmez; <strong>bağımsız bir sayı dizisi</strong> üretir. Onu çoğu zaman parantez içinde indeks olarak görürsün (<code>A(1:3,2:4)</code>), o yüzden "hangi matris?" diye düşünmen doğal. Ama parantezsiz, tek başına yazıldığında yalnızca sayıları sıralar. İkinci nokta: <code>K = [5 6; 7 8];</code> satırı matrisi <strong>tanımlayan</strong> satırdır; köşeli parantez gördüğün yerde matris oradadır.</p>` },
        { tip: 'sss', id: 'S04',
          soru: `a şıkkını da b şıkkını da çözemedim; nasıl yapılır? (Özgün mesajın: "ayı çözemedim. b-yide çözemedim")`,
          cevap: `<p>Daha küçük adımlara bölelim. Önce benzer bir örneği birlikte çözelim, sonra aynısını sen yap.</p>
<p><strong>a) Sayı listesi.</strong> <code>3:2:9</code> yazımında 3 başlangıç, 2 adım, 9 bitiştir. İkişer ekleyerek ilerliyoruz:</p>` +
            T(['Adım', 'İşlem', 'Sonuç'], [
              ['Başlangıç', '–', '3'],
              ['1', '3 + 2', '5'],
              ['2', '5 + 2', '7'],
              ['3', '7 + 2', '9'],
              ['Dur', '9 + 2 = 11, bitişi geçti', '–']
            ]) +
            `<p>Yani sonuç: <code>3 5 7 9</code>.</p>
<p><strong>Senin sıran:</strong> <code>2:2:8</code> için aynı tabloyu düşün. İlk sayı 2. Sonra her seferinde 2 ekle ve 8'i geçince dur.</p>
<p><strong>b) Sütun sütun okuma.</strong> <code>M = [1 2; 3 4]</code> matrisi:</p>` +
            PRE('     1     2\n     3     4') +
            `<p><code>M(:)</code> şöyle okur:</p><ul><li>1. sütun, yukarıdan aşağı: önce 1, sonra 3</li><li>2. sütun, yukarıdan aşağı: önce 2, sonra 4</li></ul>
<p>Yani sıra: <strong>1, 3, 2, 4</strong>. Satır satır okumuyor, bu yüzden 2 üçüncü sırada geliyor.</p>
<p><strong>Senin sıran:</strong> K matrisi şöyleydi:</p>` +
            PRE('     5     6\n     7     8') +
            `<p>Boşlukları doldur: 1. sütun, yukarıdan aşağı: __, __ · 2. sütun, yukarıdan aşağı: __, __</p>
<p><strong>Cevaplar:</strong> <code>2:2:8</code> → <code>2 4 6 8</code>. <code>K(:)</code> → 1. sütun 5, 7; 2. sütun 6, 8 → <code>5 7 6 8</code> (alt alta).</p>` },
        { tip: 'hata', id: 'H07', baslik: 'başlangıç:adım:bitiş ve (:) sorularında takılmak',
          yanlis: `<p>Senin mesajın: <code>ayı çözemedim. b-yide çözemedim</code></p>`,
          dogru: `<p>a) <code>2:2:8</code> → <code>2 4 6 8</code> &nbsp; b) <code>K(:)</code> → <code>5 7 6 8</code> (alt alta, sütun vektörü)</p>`,
          neden: `<p>İkisi de küçük adımlara bölününce kolaylaşıyor. <strong>Sayı listesi için:</strong> başlangıcı yaz, adımı ekleye ekleye git, bitişi <strong>geçtiğin an</strong> dur (3:2:9 → 3, 5, 7, 9; bir sonraki 11 bitişi geçer). <strong><code>(:)</code> için:</strong> matrisi satır satır değil <strong>sütun sütun</strong> oku; önce 1. sütun yukarıdan aşağı, sonra 2. sütun (M = [1 2; 3 4] → 1, 3, 2, 4). Benzer örnekten sonra ikisini de doğru çözdün: "2 4 6 8" ve "5 7 6 8".</p>` },
        { tip: 'kod', calistir: true, kod: `2:2:8
K = [5 6; 7 8];
K(:)`, cikti: `ans =
     2     4     6     8

ans =
     5
     7
     6
     8` },
        { tip: 'baglanti', html: `<p>Hocanın kodundaki <code>median(blok(:))</code> ve <code>mean(blok(:))</code> içindeki <code>blok(:)</code> tam olarak budur: 3×3'lük bloğun 9 sayısını sütun sütun okuyup alt alta <strong>tek sıra</strong> yapar. Böylece medyan ve ortalama 9 sayının tamamı üzerinden hesaplanır.</p>` },

        { tip: 'baslik', metin: 'Tüm satır ve tüm sütun: A(2,:) ve A(:,k)', yeni: true },
        { tip: 'metin', html: `<p>Derste <code>A(2,:)</code> yalnız örnekte geçti; üzerine soru çözülmedi. Kural basit: parantezin içinde <strong>tek başına duran <code>:</code> "hepsi"</strong> demektir.</p><ul><li>Virgülün <strong>sağında</strong> <code>:</code> → o satırın <strong>tüm sütunları</strong> (yani satırın tamamı).</li><li>Virgülün <strong>solunda</strong> <code>:</code> → o sütunun <strong>tüm satırları</strong> (yani sütunun tamamı).</li></ul>` },
        { tip: 'tablo', basliklar: ['Yazılan', 'Okunuşu', 'Sonuç (yukarıdaki 4×4 A için)', 'Şekli'], satirlar: [
          ['<code>A(2,:)</code>', '2. satır, tüm sütunlar', '<code>50 60 70 80</code>', '1×4 (yatay)'],
          ['<code>A(4,:)</code>', '4. satır, tüm sütunlar', '<code>130 140 150 160</code>', '1×4 (yatay)'],
          ['<code>A(:,3)</code>', 'Tüm satırlar, 3. sütun', '30, 70, 110, 150 (alt alta)', '4×1 (dikey)'],
          ['<code>A(:,1)</code>', 'Tüm satırlar, 1. sütun', '10, 50, 90, 130 (alt alta)', '4×1 (dikey)'],
          ['<code>A(:,2:3)</code>', 'Tüm satırlar, 2 ve 3. sütunlar', 'Ortadaki iki sütun', '4×2'],
          ['<code>A(1:2,:)</code>', '1 ve 2. satırlar, tüm sütunlar', 'Resmin üst yarısı', '2×4'],
          ['<code>A(:,:)</code>', 'Tüm satırlar, tüm sütunlar', 'A\'nın kendisi', '4×4']
        ] },
        { tip: 'kod', ad: 'Tüm satır, tüm sütun: A(4,:) ve A(:,3)', calistir: true, kod: `A = [10 20 30 40; 50 60 70 80; 90 100 110 120; 130 140 150 160];
satir4 = A(4,:)
sutun3 = A(:,3)
ustYari = A(1:2,:)`, cikti: `satir4 =
   130   140   150   160

sutun3 =
    30
    70
   110
   150

ustYari =
    10    20    30    40
    50    60    70    80` },
        { tip: 'dikkat', html: `<p><code>A(:,3)</code> ile <code>A(:)</code> farklıdır. <code>A(:,3)</code> yalnız 3. sütunu (4 sayı) verir. <code>A(:)</code> ise <strong>bütün</strong> matrisi sütun sütun okuyup 16 sayıyı alt alta dizer. Bir de <code>A(3,:)</code> ile <code>A(:,3)</code>'ü karıştırma: virgülün solu her zaman satırdır.</p>` },
        { tip: 'metin', html: `<p><strong>Seçtiğin yere değer yazmak.</strong> Aynı yazım eşittirin solunda kullanılırsa o satırı ya da sütunu <strong>değiştirir</strong>. Örneğin resmin ilk satırını siyah, son sütununu beyaz yapalım:</p>` },
        { tip: 'kod', ad: 'Bir satırı ya da sütunu toptan değiştirmek', calistir: true, kod: `R = [10 20 30; 40 50 60; 70 80 90];
R(1,:) = 0;
R(:,3) = 255`, cikti: `R =
     0     0   255
    40    50   255
    70    80   255` },
        { tip: 'baglanti', html: `<p>Renkli resimdeki <code>renkli(:,:,1)</code> aynı fikrin üç adresli hâlidir: 1. <code>:</code> tüm satırlar, 2. <code>:</code> tüm sütunlar, <code>1</code> ise kat. Hocanın kodundaki <code>blok(:)</code> ise tek <code>:</code> ile "her şeyi tek sıraya diz" demektir.</p>` },

        { tip: 'baslik', metin: 'Tek eleman, adımlı indeks ve end', yeni: true },
        { tip: 'metin', html: `<p>Bu üç ayrıntı derste ya hiç anlatılmadı ya da üzerine soru çözülmedi. Sınavda kod okurken karşına çıkabilir.</p><p><strong>1) Tek eleman: <code>A(satır, sütun)</code>.</strong> Önce satır, sonra sütun. Sırayı karıştırırsan başka bir pikseli alırsın:</p>` },
        { tip: 'tablo', basliklar: ['Yazılan', 'Okunuşu', 'Sonuç'], satirlar: [
          ['<code>A(2,3)</code>', '2. satır, 3. sütun', '70'],
          ['<code>A(3,2)</code>', '3. satır, 2. sütun', '100'],
          ['<code>A(1,1)</code>', 'Sol üst köşe', '10'],
          ['<code>A(4,4)</code>', 'Sağ alt köşe', '160'],
          ['<code>A(1,4)</code>', 'Sağ üst köşe', '40'],
          ['<code>A(4,1)</code>', 'Sol alt köşe', '130']
        ] },
        { tip: 'dikkat', html: `<p>MATLAB'da sayma <strong>1'den</strong> başlar; 0. satır ya da 0. sütun yoktur. <code>A(0,1)</code> yazarsan şu hatayı alırsın: <code>Index in position 1 is invalid. Array indices must be positive integers or logical values.</code> Matriste olmayan bir adres istersen de hata alırsın: 4×4'lük A için <code>A(5,1)</code> → <code>Index in position 1 exceeds array bounds. Index must not exceed 4.</code> ("5. satır yok, en fazla 4").</p>` },
        { tip: 'baglanti', html: `<p>Hocanın döngüsünün <code>1:w-2</code> diye bitmesinin nedeni tam olarak bu ikinci hatadır: <code>i</code> en fazla <code>w-2</code> olursa <code>i+2</code> en fazla <code>w</code> olur ve <code>J(i:i+2, ...)</code> resmin dışına taşmaz.</p>` },
        { tip: 'metin', html: `<p><strong>2) Adımlı diziyi indeks olarak kullanmak.</strong> <code>1:2:4</code> tek başına <code>1 3</code> listesini üretir. Bunu parantezin içine koyarsan "1. ve 3. satırlar" anlamına gelir; yani satırları (ya da sütunları) <strong>birer atlayarak</strong> seçersin. Resim için bu, resmi küçültmek demektir.</p>` },
        { tip: 'kod', ad: 'Adımlı indeks: A(1:2:4, 1:2:4)', calistir: true, kod: `A = [10 20 30 40; 50 60 70 80; 90 100 110 120; 130 140 150 160];
A(1:2:4, :)
kucuk = A(1:2:4, 1:2:4)`, cikti: `ans =
    10    20    30    40
    90   100   110   120

kucuk =
    10    30
    90   110` },
        { tip: 'satirsatir', maddeler: [
          { kod: 'A(1:2:4, :)', aciklama: '<code>1:2:4</code> → 1, 3 (5 bitişi geçer). Yani 1. ve 3. satırlar, tüm sütunlar.' },
          { kod: 'kucuk = A(1:2:4, 1:2:4)', aciklama: '1. ve 3. satırlar ile 1. ve 3. sütunların kesişimi: A(1,1)=10, A(1,3)=30, A(3,1)=90, A(3,3)=110. 4×4\'lük resim 2×2\'ye küçüldü.' }
        ] },
        { tip: 'metin', html: `<p><strong>3) <code>end</code>: "sonuncu".</strong> Parantezin içinde <code>end</code> yazarsan MATLAB onun yerine o yöndeki <strong>son indeksi</strong> koyar. Matrisin boyutunu bilmesen de "son satır", "son sütun" diyebilirsin.</p>` },
        { tip: 'tablo', basliklar: ['Yazılan', '4×4 A için anlamı', 'Sonuç'], satirlar: [
          ['<code>A(end,end)</code>', '<code>A(4,4)</code>: sağ alt köşe', '160'],
          ['<code>A(end,1)</code>', '<code>A(4,1)</code>: son satır, 1. sütun', '130'],
          ['<code>A(end,:)</code>', '<code>A(4,:)</code>: son satırın tamamı', '<code>130 140 150 160</code>'],
          ['<code>A(2:end,1)</code>', '<code>A(2:4,1)</code>: 2. satırdan sona, 1. sütun', '50, 90, 130 (alt alta)'],
          ['<code>A(1:2:end,:)</code>', '<code>A(1:2:4,:)</code>: tek numaralı satırlar', '1. ve 3. satır'],
          ['<code>A(end-1,end)</code>', '<code>A(3,4)</code>: sondan bir önceki satır, son sütun', '120']
        ] },
        { tip: 'kod', ad: 'end ile son eleman: A(end,end)', calistir: true, kod: `A = [10 20 30 40; 50 60 70 80; 90 100 110 120; 130 140 150 160];
kose = A(end,end)
sonSatir = A(end,:)
A(end-2:end, end-2:end)`, cikti: `kose =
   160

sonSatir =
   130   140   150   160

ans =
    60    70    80
   100   110   120
   140   150   160` },
        { tip: 'not', html: `<p><code>end</code> sözcüğünün MATLAB'da iki ayrı görevi vardır: parantez içinde "son indeks", tek başına bir satırda ise <code>if</code> ve <code>for</code> bloklarını kapatır (Konu 10 ve 11). Hocanın kodundaki iki <code>end</code> ikinci türdendir.</p>` },

        { tip: 'ozet', maddeler: [
          'İndeks = adres. Sayma 1\'den başlar; önce satır, sonra sütun: <code>A(2,3)</code> = 2. satır, 3. sütun.',
          '<code>a:b</code> birer birer, <code>a:adım:b</code> adım adım sayı listesi üretir ve bitişi geçmez: <code>1:2:10</code> → 1 3 5 7 9. Tek başına bir sayı listesidir; matris gerektirmez.',
          '<code>A(1:3,2:4)</code>: virgülün solu satırları, sağı sütunları seçer; resmin üzerine pencere koyup içini almak gibidir.',
          'Tek başına <code>:</code> "hepsi" demektir: <code>A(2,:)</code> 2. satırın tamamı, <code>A(:,3)</code> 3. sütunun tamamı.',
          '<code>A(:)</code> matrisi sütun sütun okuyup alt alta tek sıra yapar: <code>[5 6; 7 8]</code> → 5, 7, 6, 8.',
          'Renkli resim üst üste 3 kattır (kırmızı, yeşil, mavi). <code>A(:,:,1)</code> = tüm satırlar, tüm sütunlar, 1. kat. Adres: satır, sütun, kat.',
          '<code>end</code> parantez içinde "son indeks" demektir: <code>A(end,end)</code> sağ alt köşe.',
          'Matris sonuçlarını satır-sütun düzeniyle yaz: <code>[30 40; 70 80]</code>.',
          'Hocanın kodu: <code>blok=J(i:i+2,j:j+2)</code> resimden 3×3 parça keser; <code>blok(:)</code> onu 9 sayılık tek sıraya çevirir.'
        ] }
      ]
    },

    /* ================================================================ KONU 6 */
    {
      id: 'konu-06', no: 6, baslik: 'size ve [w,h]=size(A)',
      kisa: 'Matrisin kaç satır, kaç sütun olduğunu öğrenmek ve iki ayrı kutuya almak.',
      yeni: false,
      bloklar: [
        { tip: 'metin', html: `<p><code>size</code>, bir matrisin <strong>kaç satır ve kaç sütundan</strong> oluştuğunu söyler. Resim için bu, boyutunu öğrenmek demektir. Sonucu <strong>önce satır, sonra sütun</strong> gelecek şekilde verir.</p><p>Sonucu <strong>iki ayrı kutuya</strong> almak için sol tarafta köşeli parantez kullanırız: <code>[w,h] = size(A)</code>. Birinci sayı <code>w</code> kutusuna, ikinci sayı <code>h</code> kutusuna gider.</p>` },
        { tip: 'baslik', metin: 'Örnek: 3 satır, 4 sütunluk bir resim' },
        { tip: 'kod', calistir: true, kod: `A = [10 20 30 40; 50 60 70 80; 90 100 110 120];
size(A)
[w,h] = size(A)
w - 2`, cikti: `ans =
     3     4

w =
     3

h =
     4

ans =
     1` },
        { tip: 'satirsatir', maddeler: [
          { kod: 'A = [10 20 30 40; 50 60 70 80; 90 100 110 120];', aciklama: '3 satır, 4 sütunluk matrisi oluşturur. <code>;</code> olduğu için gösterilmez.' },
          { kod: 'size(A)', aciklama: 'Boyutları <strong>tek sonuç</strong> halinde gösterir: 3 satır, 4 sütun.' },
          { kod: '[w,h] = size(A)', aciklama: '3 değerini <code>w</code> kutusuna, 4 değerini <code>h</code> kutusuna koyar.' },
          { kod: 'w - 2', aciklama: 'Artık <code>w</code> normal bir sayıdır: 3 − 2 = 1.' }
        ] },
        { tip: 'dikkat', html: `<p><strong>Dikkat, sınavda karışabilir:</strong> <code>w</code> İngilizcede genelde "genişlik" (width) için kullanılır, ama bu yazımda <code>w</code> <strong>satır sayısını</strong> tutar. Çünkü <code>size</code> önce satır sayısını verir. <strong>Değişkenin adı sonucu değiştirmez, sıralama belirler.</strong></p>` },
        { tip: 'baglanti', html: `<p><code>[w,h]=size(J);</code> satırında <code>J</code> 256×256 olduğu için <code>w=256</code>, <code>h=256</code> olur. Döngülerdeki <code>1:w-2</code> de bu sayede <code>1:254</code> anlamına gelir. Neden 254'te durduğunu <code>for</code> konusunda ve hocanın kodunu çözerken göreceksin (kısaca: 3×3'lük pencere resmin dışına taşmasın diye).</p>` },

        { tip: 'baslik', metin: 'Sıra sende sorularının cevapları' },
        { tip: 'metin', html: `<p><strong>Soru 1:</strong> <code>a</code> ve <code>b</code> kaç olur?</p>` },
        { tip: 'kod', ad: 'Sıra sende cevabı: [a,b] = size(zeros(5,2))', calistir: true, kod: `R = zeros(5,2);
[a,b] = size(R);
a
b`, cikti: `a =
     5

b =
     2` },
        { tip: 'metin', html: `<p><code>zeros(5,2)</code> 5 satır, 2 sütunluk bir matristir; <code>size</code> önce satırı verir: <strong>a = 5, b = 2</strong>. Senin cevabın ("5-2") doğruydu. (Sorudaki kodda son iki satır yoktu; değerleri görmek için eklendi.)</p><p><strong>Soru 2:</strong> <code>son</code> kaç olur?</p>` },
        { tip: 'kod', ad: 'Sıra sende cevabı: son eleman B(w,h)', calistir: true, kod: `B = [1 2 3; 4 5 6];
[w,h] = size(B);
son = B(w,h)`, cikti: `son =
     6` },
        { tip: 'sss', id: 'S05',
          soru: `w=2, h=3 buldum ama <code>son = B(w,h)</code> satırı ne yapıyor? (Özgün mesajın: "b- w=2 h=3 ama son = B(w,h) kısmını anlamadım")`,
          cevap: `<p><code>w=2</code> ve <code>h=3</code> değerlerini doğru buldun. Geriye tek bir adım kaldı.</p>
<p><code>son = B(w,h)</code> satırındaki <code>w</code> ve <code>h</code> artık <strong>sadece birer sayıdır</strong>. Bu yüzden satırı iki parçaya ayırabiliriz:</p>
<ul><li><strong>Sağ taraf:</strong> <code>B(w,h)</code>, B matrisinden bir piksel seçer. MATLAB <code>w</code> ve <code>h</code> yerine içlerindeki sayıları koyar.</li><li><strong>Sol taraf:</strong> <code>son =</code> seçilen sayıyı <code>son</code> adlı kutuya koyar.</li></ul>
<p><strong>Benzer bir örnek:</strong> Az önceki 3 satır, 4 sütunluk A matrisinde <code>w=3</code>, <code>h=4</code> idi.</p>` +
            PRE('    10    20    30    40\n    50    60    70    80\n    90   100   110   120') +
            `<p><code>x = A(w,h)</code> yazarsak:</p><ol><li>Sayıları yerine koyarız: <code>A(w,h)</code> → <code>A(3,4)</code></li><li>3. satır ile 4. sütunun kesiştiği yere bakarız: 120</li><li>120 değeri <code>x</code> kutusuna girer.</li></ol>
<p><strong>Senin sıran:</strong> B matrisi şöyle:</p>` +
            T(['', '1. sütun', '2. sütun', '3. sütun'], [
              ['<strong>1. satır</strong>', '1', '2', '3'],
              ['<strong>2. satır</strong>', '4', '5', '6']
            ]) +
            `<p>Bulduğun <code>w</code> ve <code>h</code> değerlerini <code>B(w,h)</code> içine koy. Hangi adres oluşuyor, o adreste hangi sayı var?</p>
<p><strong>Cevap:</strong> <code>B(w,h)</code> burada <code>B(2,3)</code> olur ve o adreste <strong>6</strong> vardır. <code>w</code> ve <code>h</code> boyutları tuttuğu için bu adres matrisin <strong>sağ alttaki son pikselidir</strong>.</p>` },
        { tip: 'hata', id: 'H08', baslik: 'B(w,h) içinde w ve h\'nin yerine sayı koymamak',
          yanlis: `<p>Senin cevabın: <code>a-5-2. b- w=2 h=3 ama son = B(w,h) kısmını anlamadım</code></p>`,
          dogru: `<p><code>son = B(w,h)</code> → <code>son = B(2,3)</code> → <code>son = 6</code></p>`,
          neden: `<p>İşin zor kısmını (w=2, h=3) zaten bulmuştun. Takıldığın yer, parantez içinde <strong>harf</strong> görmekti. Bir değişken adı gördüğün her yerde MATLAB onun yerine <strong>kutunun içindeki sayıyı</strong> koyar. Kağıtta da aynısını yap: harfin üstünü çiz, yerine değerini yaz, sonra satırı normal bir indeksleme gibi oku. <code>w</code> ve <code>h</code> boyutları tuttuğu için <code>B(w,h)</code> her zaman matrisin sağ alt (son) pikselidir.</p>` },

        { tip: 'baslik', metin: 'Ek: tek çıktılı size ve "w satırdır" tuzağı', yeni: true },
        { tip: 'metin', html: `<p>Derste bu iki nokta üzerine soru çözülmedi; kare olmayan bir resimde <code>w</code> ve <code>h</code>'nin karışması da hiç denenmedi. Oysa hocanın resmi 256×256 (kare) olduğu için tuzak orada görünmez; kare olmayan bir resimde hemen ortaya çıkar.</p><p><strong>1) Tek çıktılı <code>size</code>.</strong> Sol tarafa köşeli parantez koymazsan <code>size</code> iki sayıyı <strong>tek bir satır vektörü</strong> olarak verir. Bunu bir değişkene de koyabilirsin; o zaman değişken iki elemanlı bir vektör olur.</p>` },
        { tip: 'kod', ad: 'Tek çıktılı size: boyut(1) ve boyut(2)', calistir: true, kod: `A = zeros(2,5);
boyut = size(A)
boyut(1)
boyut(2)`, cikti: `boyut =
     2     5

ans =
     2

ans =
     5` },
        { tip: 'tablo', basliklar: ['Yazım', 'Sonuç (2×5\'lik A için)', 'Ne zaman kullanılır?'], satirlar: [
          ['<code>size(A)</code>', '<code>ans = 2 5</code> (tek sonuç, iki sayı yan yana)', 'Boyuta yalnızca bakmak için'],
          ['<code>boyut = size(A)</code>', '<code>boyut</code> = <code>[2 5]</code> vektörü', 'İki sayıyı tek kutuda tutmak için'],
          ['<code>[w,h] = size(A)</code>', '<code>w = 2</code>, <code>h = 5</code> (iki ayrı kutu)', 'Satır ve sütun sayısını ayrı ayrı kullanmak için (hocanın kodu)']
        ] },
        { tip: 'metin', html: `<p><strong>2) Kare olmayan resimde <code>w</code> ve <code>h</code>.</strong> 2 satır, 5 sütunluk "yatay" bir resim düşün. Genişliği 5, yüksekliği 2'dir. Ama:</p>` },
        { tip: 'kod', ad: '"w satırdır" tuzağı: 2×5 resimde w ve h', calistir: true, kod: `yatay = [1 2 3 4 5; 6 7 8 9 10];
[w,h] = size(yatay)`, cikti: `w =
     2

h =
     5` },
        { tip: 'dikkat', html: `<p><code>w = 2</code> çıktı: yani <code>w</code> genişlik (5) değil, <strong>satır sayısıdır</strong>. Kural tek: <strong>köşeli parantezdeki ilk isim satır sayısını, ikinci isim sütun sayısını alır</strong>; isim ne olursa olsun. <code>[h,w] = size(yatay)</code> yazsaydın bu kez <code>h = 2</code>, <code>w = 5</code> olurdu. <code>[satir,sutun] = size(yatay)</code> yazsaydın karışıklık hiç olmazdı.</p>` },
        { tip: 'metin', html: `<p><strong>3) Boyutlarla hesap.</strong> <code>w</code> ve <code>h</code> normal sayılar olduğu için her işlemde kullanılabilir:</p>` },
        { tip: 'tablo', basliklar: ['Yazılan', '2×5\'lik resim için (w=2, h=5)', 'Anlamı'], satirlar: [
          ['<code>w * h</code>', '10', 'Toplam piksel sayısı'],
          ['<code>yatay(w,h)</code>', '<code>yatay(2,5)</code> = 10', 'Sağ alttaki son piksel'],
          ['<code>yatay(1,h)</code>', '<code>yatay(1,5)</code> = 5', 'Sağ üst köşe'],
          ['<code>yatay(w,1)</code>', '<code>yatay(2,1)</code> = 6', 'Sol alt köşe'],
          ['<code>h - 2</code>', '3', 'Hocanın döngüsündeki <code>1:h-2</code> burada <code>1:3</code> olurdu']
        ] },
        { tip: 'baglanti', html: `<p>Hocanın kodunda dış döngü <code>i=1:w-2</code> satırları, iç döngü <code>j=1:h-2</code> sütunları gezer. <code>w</code> satır sayısı olduğu için bu eşleşme doğrudur: <code>J(i:i+2, j:j+2)</code> içinde <code>i</code> virgülün solunda (satır), <code>j</code> sağında (sütun) durur.</p>` },

        { tip: 'ozet', maddeler: [
          '<code>size(A)</code> matrisin boyutunu verir: önce satır sayısı, sonra sütun sayısı.',
          '<code>[w,h] = size(A)</code>: birinci sayı (satır) <code>w</code> kutusuna, ikinci sayı (sütun) <code>h</code> kutusuna gider.',
          'Köşeli parantez yoksa sonuç tek bir vektördür: <code>size(A)</code> → <code>3 4</code>.',
          '<code>w</code> burada genişlik değil satır sayısıdır. Adı değil, sıralama belirler.',
          '<code>w</code> ve <code>h</code> normal sayılardır: <code>w-2</code>, <code>w*h</code>, <code>B(w,h)</code> gibi her yerde kullanılır.',
          '<code>B(w,h)</code> matrisin sağ alttaki son pikselidir. Harf gördüğün yere içindeki sayıyı koy.',
          'Hocanın kodu: <code>J</code> 256×256 → <code>w=256</code>, <code>h=256</code>; <code>1:w-2</code> = <code>1:254</code>.'
        ] }
      ]
    },

    /* ================================================================ KONU 7 */
    {
      id: 'konu-07', no: 7, baslik: '* ile .* farkı',
      kisa: 'Eleman eleman çarpma (.*), matris çarpımı (*), tek sayıyla çarpma; ./ ve .^.',
      yeni: false,
      bloklar: [
        { tip: 'metin', html: `<p>İki matrisi çarparken iki farklı işaret kullanılır:</p><ul><li><code>.*</code> <strong>eleman eleman çarpar</strong>: aynı adresteki sayılar birbiriyle çarpılır. İki matris <strong>aynı boyutta</strong> olmalıdır.</li><li><code>*</code> <strong>matris çarpımı</strong> yapar: birinci matrisin satırları ile ikinci matrisin sütunları çarpılıp toplanır.</li></ul><p>Bir matrisi <strong>tek bir sayıyla</strong> çarparken ikisi de aynı sonucu verir. Görüntü işlemede pikselleri tek tek çarpmak istediğin için çoğunlukla <code>.*</code> kullanılır.</p>` },
        { tip: 'baslik', metin: 'Örnek: maske' },
        { tip: 'metin', html: `<p><code>M</code> matrisi bir <strong>maske</strong>, yani resmin üzerine konan bir kalıptır: <strong>1 olan yer kalır, 0 olan yer siyah olur</strong>.</p>` },
        { tip: 'kod', ad: 'Maske: A .* M ile A * M farkı', calistir: true, kod: `A = [10 20; 30 40];
M = [1 0; 1 0];
sonuc1 = A .* M
sonuc2 = A * M
parlak = A * 2`, cikti: `sonuc1 =
    10     0
    30     0

sonuc2 =
    30     0
    70     0

parlak =
    20    40
    60    80` },
        { tip: 'satirsatir', maddeler: [
          { kod: 'A = [10 20; 30 40];', aciklama: '2×2\'lik resmi oluşturur.' },
          { kod: 'M = [1 0; 1 0];', aciklama: 'Sol sütunu 1, sağ sütunu 0 olan maskeyi oluşturur.' },
          { kod: 'sonuc1 = A .* M', aciklama: 'Her pikseli maskedeki karşılığıyla çarpar (aşağıdaki ilk tablo). Sağ sütun siyah oldu.' },
          { kod: 'sonuc2 = A * M', aciklama: 'Bu kez A\'nın satırı ile M\'nin sütunu çarpılıp toplanır (aşağıdaki ikinci tablo). Sonuç farklı çıktı.' },
          { kod: 'parlak = A * 2', aciklama: 'Matris tek sayıyla çarpıldığı için her piksel 2 katına çıkar ve resim aydınlanır: <code>[20 40; 60 80]</code>.' }
        ] },
        { tip: 'metin', html: `<p><strong><code>sonuc1 = A .* M</code></strong> (eleman eleman):</p>` },
        { tip: 'tablo', basliklar: ['Adres', 'İşlem', 'Sonuç'], satirlar: [
          ['(1,1)', '10 × 1', '10'],
          ['(1,2)', '20 × 0', '0'],
          ['(2,1)', '30 × 1', '30'],
          ['(2,2)', '40 × 0', '0']
        ] },
        { tip: 'cizim', metin: `    10     0
    30     0      <- sag sutun siyah oldu` },
        { tip: 'metin', html: `<p><strong><code>sonuc2 = A * M</code></strong> (matris çarpımı; A'nın satırı ile M'nin sütunu çarpılıp toplanır):</p>` },
        { tip: 'tablo', basliklar: ['Adres', 'İşlem', 'Sonuç'], satirlar: [
          ['(1,1)', '10×1 + 20×1', '30'],
          ['(1,2)', '10×0 + 20×0', '0'],
          ['(2,1)', '30×1 + 40×1', '70'],
          ['(2,2)', '30×0 + 40×0', '0']
        ] },
        { tip: 'cizim', metin: `    30     0
    70     0      <- sonuc farkli cikti` },
        { tip: 'metin', html: `<p>Bölme ve üs almada da aynı nokta mantığı vardır: <code>./</code> ve <code>.^</code> <strong>eleman eleman</strong> çalışır. (Derste yalnız bu cümleyle geçti; aşağıda ayrıntılı anlatılıyor.)</p>` },

        { tip: 'baslik', metin: 'Yalnızca * : matris çarpımı nasıl çalışır?' },
        { tip: 'sss', id: 'S06',
          soru: `<code>.*</code>'ı anladım, sadece <code>*</code> (matris çarpımı) nasıl çalışıyor, anlamadım. (Özgün mesajın: "sadece *ı anlamadım ya")`,
          cevap: `<p>Sadece <code>*</code> kısmına odaklanalım. <strong>Hocanın hedef kodunda matris çarpımı yok</strong>, yani burada mantığını anlaman yeterli. Kuralı daha sade sayılarla gösterelim:</p>` +
            PRE('A = [1 2; 3 4];\nB = [5 6; 7 8];\nC = A * B') +
            `<p><strong>Kural:</strong> Sonucun her kutusu için A'dan bir <strong>satır</strong>, B'den bir <strong>sütun</strong> seçilir. Karşılıklı sayılar çarpılır ve sonuçlar <strong>toplanır</strong>.</p>
<p>Hangi satır ve sütunun seçileceğini <strong>kutunun adresi</strong> söyler. Örneğin (2,1) kutusu için A'nın 2. satırı ve B'nin 1. sütunu alınır.</p>` +
            PRE('   A             B\n   1   2         5   6\n   3   4         7   8') +
            T(['Sonuç kutusu', 'A\'dan', 'B\'den', 'İşlem', 'Sonuç'], [
              ['(1,1)', '1. satır: 1, 2', '1. sütun: 5, 7', '1×5 + 2×7', '19'],
              ['(1,2)', '1. satır: 1, 2', '2. sütun: 6, 8', '1×6 + 2×8', '22'],
              ['(2,1)', '2. satır: 3, 4', '1. sütun: 5, 7', '3×5 + 4×7', '43'],
              ['(2,2)', '2. satır: 3, 4', '2. sütun: 6, 8', '3×6 + 4×8', '50']
            ]) +
            `<p>Sonuç:</p>` + PRE('    19    22\n    43    50') +
            `<p><strong>Karşılaştırma için</strong> <code>A .* B</code> yazsaydık sadece aynı adresler çarpılırdı: 1×5, 2×6, 3×7, 4×8. Sonuç <code>[5 12; 21 32]</code> olurdu.</p>
<p><strong>Küçük bir deneme:</strong> <code>C = [1 2; 3 4];</code> ve <code>D = [2 0; 1 3];</code> için <code>C * D</code> işleminde sadece (1,1) kutusunu bul. C'nin hangi satırını, D'nin hangi sütununu aldın ve sonuç kaç çıktı?</p>
<p><strong>Cevap:</strong> C'nin 1. satırı (1, 2), D'nin 1. sütunu (2, 1): 1×2 + 2×1 = 2 + 2 = <strong>4</strong>.</p>` },
        { tip: 'kod', calistir: true, kod: `A = [1 2; 3 4];
B = [5 6; 7 8];
C = A * B
E = A .* B`, cikti: `C =
    19    22
    43    50

E =
     5    12
    21    32` },
        { tip: 'hata', id: 'H09', baslik: 'Matris çarpımında çarpıp toplamayı unutmak',
          yanlis: `<p>Senin cevabın: <code>2 2 -</code></p><p>(<code>C = [1 2; 3 4]</code>, <code>D = [2 0; 1 3]</code> için <code>C * D</code>'nin (1,1) kutusu soruluyordu.)</p>`,
          dogru: `<p>(1,1) kutusu = 1×2 + 2×1 = 2 + 2 = <strong>4</strong></p>`,
          neden: `<p>Doğru yoldaydın: C'nin 1. satırı (1, 2) ile D'nin 1. sütununu (2, 1) seçip iki çarpmayı doğru yaptın: 1×2 = 2 ve 2×1 = 2. Ama matris çarpımında <strong>iki iş</strong> vardır: karşılıklı sayıları çarp, <strong>sonra sonuçları topla</strong>. Bir kutuya tek bir sayı girer. Örnekteki (1,1) kutusu da böyleydi: 1×5 + 2×7 = 5 + 14 = 19. İpucundan sonra son adımı yapıp "4" dedin.</p>` },

        { tip: 'baslik', metin: 'Sıra sende sorularının cevapları' },
        { tip: 'not', html: `<p>Bu iki soruda <code>*</code> işaretinin satır-sütun hesabı gerekmiyor: birinde <code>.*</code> var, diğerinde matris tek bir sayıyla çarpılıyor.</p>` },
        { tip: 'metin', html: `<p><strong>Soru 1:</strong> <code>P .* Q</code> sonucu?</p>` },
        { tip: 'sss', id: 'S07',
          soru: `<code>P .* Q</code> sorusunda benden ne isteniyor, anlamadım. (Özgün mesajın: "soruyu anlamadım")`,
          cevap: `<p>Soruyu sadeleştirelim. Elimizde <strong>aynı boyutta iki küçük resim</strong> var. <code>.*</code> işareti, <strong>aynı konumdaki iki sayıyı çarpmak</strong> demektir. Senden yalnızca bu dört çarpmayı yapıp sonucu yine 2×2'lik tablo olarak yazman isteniyor.</p>` +
            PRE('   P             Q\n   2   3         1   0\n   4   5         0   2') +
            `<p>Eşleşmeler şöyle:</p>` +
            T(['Konum', 'P\'deki sayı', 'Q\'daki sayı', 'Çarpma', 'Sonuç'], [
              ['Sol üst', '2', '1', '2 × 1', '2'],
              ['Sağ üst', '3', '0', '3 × 0', '0'],
              ['Sol alt', '4', '0', '4 × 0', '0'],
              ['Sağ alt', '5', '2', '5 × 2', '10']
            ]) +
            `<p>Dört sonucu sırayla yazmak yeterli: sol üst, sağ üst, sol alt, sağ alt → <code>2 0 0 10</code>. Matris olarak: <code>[2 0; 0 10]</code>.</p>` },
        { tip: 'kod', ad: 'Sıra sende cevabı: P .* Q', calistir: true, kod: `P = [2 3; 4 5];
Q = [1 0; 0 2];
P .* Q`, cikti: `ans =
     2     0
     0    10` },
        { tip: 'metin', html: `<p><strong>Soru 2:</strong> <code>S = [1 2; 3 4];</code> için <code>S * 3</code> ne verir? <code>S .* 3</code> yazsaydık sonuç değişir miydi?</p><p>İpucu şuydu: Burada S, başka bir matrisle değil, <strong>tek bir sayıyla</strong> çarpılıyor.</p><p><strong>Cevap:</strong> <code>S * 3</code> sonucu <code>[3 6; 9 12]</code> olur. Tek bir sayıyla çarpımda <code>S .* 3</code> de aynı sonucu verir; yani <strong>değişmezdi</strong>.</p>` },
        { tip: 'kod', ad: 'Sıra sende cevabı: S * 3 ile S .* 3 aynı', calistir: true, kod: `S = [1 2; 3 4];
S * 3
S .* 3`, cikti: `ans =
     3     6
     9    12

ans =
     3     6
     9    12` },
        { tip: 'hata', id: 'H10', baslik: 'İki sorudan birini atlamak ve matrisi düz sıra yazmak',
          yanlis: `<p>Senin cevabın: <code>3 6 9 12. değişöezdi</code></p>`,
          dogru: `<p>Bu yalnız Soru 2'nin cevabıydı ve doğruydu: <code>S * 3</code> = <code>[3 6; 9 12]</code>, <code>S .* 3</code> ile değişmezdi. Soru 1 (<code>P .* Q</code>) cevapsız kalmıştı; doğrusu <code>[2 0; 0 10]</code>.</p>`,
          neden: `<p>Soru 1'i anlamadığın için atlamıştın; tabloyla sadeleştirilince "2 0 0 10" diyerek doğru çözdün. İki küçük alışkanlık işini kolaylaştırır: (1) Anlamadığın soruyu sessizce atlama; "şu kısmı anlamadım" diye yaz (ya da sınavda en azından eşleşme tablosunu kur). (2) Matris sonuçlarını satır sınırlarıyla yaz: <code>[3 6; 9 12]</code>.</p>` },

        { tip: 'baslik', metin: 'Eleman eleman bölme ve üs alma: ./ ve .^', yeni: true },
        { tip: 'metin', html: `<p>Derste tek cümleyle geçti, örnek ve soru yoktu. Mantık <code>.*</code> ile <strong>birebir aynıdır</strong>: işaretin başındaki nokta "bu işlemi <strong>aynı adresteki</strong> sayılar arasında, tek tek yap" demektir.</p>` },
        { tip: 'tablo', basliklar: ['İşaret', 'Ne yapar?', 'Örnek', 'Sonuç'], satirlar: [
          ['<code>.*</code>', 'Aynı adresteki sayıları çarpar', '<code>[2 3; 4 5] .* [1 0; 0 2]</code>', '<code>[2 0; 0 10]</code>'],
          ['<code>./</code>', 'Aynı adresteki sayıları böler (soldaki / sağdaki)', '<code>[10 20; 30 40] ./ [2 4; 5 8]</code>', '<code>[5 5; 6 5]</code>'],
          ['<code>.^</code>', 'Her elemanın üssünü alır', '<code>[1 2; 3 4] .^ 2</code>', '<code>[1 4; 9 16]</code>']
        ] },
        { tip: 'metin', html: `<p><strong>1) <code>./</code> : eleman eleman bölme.</strong></p>` },
        { tip: 'kod', ad: 'Eleman eleman bölme: A ./ B', calistir: true, kod: `A = [10 20; 30 40];
B = [2 4; 5 8];
bolum = A ./ B`, cikti: `bolum =
     5     5
     6     5` },
        { tip: 'tablo', basliklar: ['Adres', 'İşlem', 'Sonuç'], satirlar: [
          ['(1,1)', '10 / 2', '5'],
          ['(1,2)', '20 / 4', '5'],
          ['(2,1)', '30 / 5', '6'],
          ['(2,2)', '40 / 8', '5']
        ] },
        { tip: 'metin', html: `<p><strong>Tek bir sayıya bölerken</strong> çarpmadaki gibi nokta fark etmez: <code>A / 2</code> ile <code>A ./ 2</code> aynı sonucu verir; her piksel yarıya iner, resim koyulaşır.</p>` },
        { tip: 'kod', ad: 'Sayıya bölme: A / 2 ile A ./ 2 aynı', calistir: true, kod: `A = [10 20; 30 40];
koyu = A / 2
ayni = A ./ 2`, cikti: `koyu =
     5    10
    15    20

ayni =
     5    10
    15    20` },
        { tip: 'metin', html: `<p>Görüntü işlemede tipik kullanım: iki resmin <strong>piksel piksel ortalaması</strong>. Toplama zaten eleman eleman çalışır (<code>+</code> ve <code>-</code> için noktalı hâl yoktur), sonra tek sayıya bölünür:</p>` },
        { tip: 'kod', ad: 'İki resmin ortalaması: (X + Y) / 2', calistir: true, kod: `X = [100 200; 50 0];
Y = [50 100; 150 40];
orta = (X + Y) / 2`, cikti: `orta =
    75   150
   100    20` },
        { tip: 'metin', html: `<p><strong>2) <code>.^</code> : eleman eleman üs alma.</strong> <code>A .^ 2</code> her pikselin karesini alır.</p>` },
        { tip: 'kod', ad: 'Eleman eleman üs: A .^ 2', calistir: true, kod: `A = [1 2; 3 4];
kare = A .^ 2
kup = A .^ 3`, cikti: `kare =
     1     4
     9    16

kup =
     1     8
    27    64` },
        { tip: 'dikkat', html: `<p><strong>Noktasız <code>^</code> bambaşka bir iştir.</strong> <code>A ^ 2</code>, <code>A * A</code> demektir, yani <strong>matris çarpımı</strong>:</p><ul><li><code>[1 2; 3 4] .^ 2</code> → <code>[1 4; 9 16]</code> (her elemanın karesi)</li><li><code>[1 2; 3 4] ^ 2</code> → <code>[7 10; 15 22]</code> (çünkü (1,1) = 1×1 + 2×3 = 7, (1,2) = 1×2 + 2×4 = 10, (2,1) = 3×1 + 4×3 = 15, (2,2) = 3×2 + 4×4 = 22)</li></ul><p>Aynı şekilde iki matris arasında noktasız <code>/</code> de eleman eleman bölme değildir. Pikselleri tek tek işlemek istiyorsan iki matris arasında <strong>hep noktalı</strong> hâli yaz: <code>.*</code>, <code>./</code>, <code>.^</code>.</p>` },
        { tip: 'tablo', basliklar: ['Durum', 'Noktalı ve noktasız aynı mı?', 'Örnek'], satirlar: [
          ['Matris ile tek sayı, çarpma', 'Aynı', '<code>A * 2</code> = <code>A .* 2</code>'],
          ['Matris ile tek sayı, bölme', 'Aynı', '<code>A / 2</code> = <code>A ./ 2</code>'],
          ['Matris ile matris, çarpma', '<strong>Farklı</strong>', '<code>A * B</code> ≠ <code>A .* B</code>'],
          ['Matrisin üssü', '<strong>Farklı</strong>', '<code>A ^ 2</code> ≠ <code>A .^ 2</code>'],
          ['Toplama, çıkarma', 'Noktalı hâli yok; zaten eleman eleman', '<code>A + B</code>, <code>A - B</code>']
        ] },

        { tip: 'baslik', metin: 'Boyut kuralları ve matris çarpımının tamamı', yeni: true },
        { tip: 'metin', html: `<p>Derste iki nokta eksik kaldı: boyutlar tutmadığında ne olduğu ve <code>C * D</code>'nin (yalnız (1,1) kutusunu bulmuştun) tamamı.</p><p><strong>1) <code>.*</code> için kural: iki matris aynı boyutta olmalı.</strong> Her adresin karşılığı olmalı ki çarpılabilsin. 2×2'lik bir resmi 2×3'lük bir maskeyle eleman eleman çarpamazsın:</p>` },
        { tip: 'kod', ad: 'Boyut hatası: A .* M (boyutlar farklı)', calistir: true, kod: `A = [1 2; 3 4];
M = [1 0 1; 0 1 0];
A .* M`, cikti: `Arrays have incompatible sizes for this operation.` },
        { tip: 'metin', html: `<p>Mesaj "dizilerin boyutları bu işlem için uyumsuz" demektir. Aynı kural <code>./</code>, <code>+</code> ve <code>-</code> için de geçerlidir. (Tek istisna zaten bildiğin durumdur: taraflardan biri tek bir sayıysa o sayı her elemana uygulanır.)</p><p><strong>2) <code>*</code> için kural: soldakinin sütun sayısı = sağdakinin satır sayısı.</strong> Çünkü soldan bir satır, sağdan bir sütun alınıp karşılıklı çarpılır; ikisinde aynı sayıda eleman olmalı. Sonucun boyutu: soldakinin satır sayısı × sağdakinin sütun sayısı.</p>` },
        { tip: 'tablo', basliklar: ['Soldaki', 'Sağdaki', '<code>*</code> olur mu?', 'Sonucun boyutu'], satirlar: [
          ['2×2', '2×2', 'Olur (2 = 2)', '2×2'],
          ['2×3', '3×2', 'Olur (3 = 3)', '2×2'],
          ['2×3', '2×3', '<strong>Olmaz</strong> (3 ≠ 2)', 'Hata'],
          ['1×3', '3×1', 'Olur (3 = 3)', '1×1 (tek sayı)'],
          ['3×3', '3×1', 'Olur (3 = 3)', '3×1']
        ] },
        { tip: 'kod', ad: 'Boyut hatası: X * Y (2×3 ile 2×3 çarpılamaz)', calistir: true, kod: `X = [1 2 3; 4 5 6];
Y = [1 0 1; 0 1 0];
X * Y`, cikti: `Incorrect dimensions for matrix multiplication. Check that the number of
columns in the first matrix matches the number of rows in the second matrix.
To operate on each element of the matrix individually, use TIMES (.*) for
elementwise multiplication.` },
        { tip: 'ipucu', html: `<p>Bu uzun hata mesajının son cümlesine dikkat: MATLAB sana "her elemanı tek tek işlemek istiyorsan <code>.*</code> kullan" diyor. Görüntü işleme kodunda bu hatayı görürsen büyük olasılıkla <code>*</code> yerine <code>.*</code> yazman gerekiyordur. Yukarıdaki X ve Y aynı boyutta olduğu için <code>X .* Y</code> sorunsuz çalışır: <code>[1 0 3; 0 5 0]</code>.</p>` },
        { tip: 'metin', html: `<p><strong>3) <code>C * D</code>'nin tamamı.</strong> Derste yalnız (1,1) kutusunu (4) bulmuştun. Dört kutunun hepsi:</p>` },
        { tip: 'cizim', metin: `   C             D
   1   2         2   0
   3   4         1   3` },
        { tip: 'tablo', basliklar: ['Sonuç kutusu', 'C\'den', 'D\'den', 'İşlem', 'Sonuç'], satirlar: [
          ['(1,1)', '1. satır: 1, 2', '1. sütun: 2, 1', '1×2 + 2×1', '4'],
          ['(1,2)', '1. satır: 1, 2', '2. sütun: 0, 3', '1×0 + 2×3', '6'],
          ['(2,1)', '2. satır: 3, 4', '1. sütun: 2, 1', '3×2 + 4×1', '10'],
          ['(2,2)', '2. satır: 3, 4', '2. sütun: 0, 3', '3×0 + 4×3', '12']
        ] },
        { tip: 'kod', ad: 'C * D, D * C ve C .* D karşılaştırması', calistir: true, kod: `C = [1 2; 3 4];
D = [2 0; 1 3];
C * D
D * C
C .* D`, cikti: `ans =
     4     6
    10    12

ans =
     2     4
    10    14

ans =
     2     0
     3    12` },
        { tip: 'dikkat', html: `<p>Çıktıya bak: <code>C * D</code> ile <code>D * C</code> <strong>farklı</strong> çıktı. Matris çarpımında sıra önemlidir. <code>.*</code> için ise sıra fark etmez: <code>C .* D</code> ile <code>D .* C</code> aynıdır (2×1 ile 1×2 aynı sayıdır).</p>` },
        { tip: 'baglanti', html: `<p>Hocanın hedef kodunda ne <code>*</code> ne <code>.*</code> var; orada pikseller <code>median</code> ve <code>mean</code> ile işleniyor. Ama maskeleme, parlaklık değiştirme (<code>resim * 2</code>, <code>resim / 2</code>) ve iki resmin ortalaması gibi benzer sınav kodlarında bu işaretler çıkar. Kural: <strong>pikselleri tek tek işliyorsan noktalı hâl</strong>.</p>` },

        { tip: 'ozet', maddeler: [
          '<code>.*</code> eleman eleman çarpar: aynı adresteki sayılar çarpılır; iki matris aynı boyutta olmalı.',
          '<code>*</code> matris çarpımıdır: sonucun her kutusu için soldan bir satır, sağdan bir sütun alınır; karşılıklı çarpılır, <strong>sonra toplanır</strong>.',
          'Matris tek sayıyla çarpılırken <code>*</code> ile <code>.*</code> aynı sonucu verir: <code>S * 3</code> = <code>S .* 3</code>.',
          'Maske: 1 olan yer kalır, 0 olan yer siyah olur (<code>A .* M</code>).',
          '<code>./</code> eleman eleman böler, <code>.^</code> eleman eleman üs alır. <code>A .^ 2</code> her elemanın karesidir; <code>A ^ 2</code> ise <code>A * A</code> (matris çarpımı).',
          '<code>*</code> için soldakinin sütun sayısı sağdakinin satır sayısına eşit olmalı; <code>C * D</code> ile <code>D * C</code> genelde farklıdır.',
          'Görüntü işlemede pikselleri tek tek işlemek istediğin için çoğunlukla noktalı hâller kullanılır. Hocanın hedef kodunda matris çarpımı yoktur.'
        ] }
      ]
    }
  ];

  g.KONULAR = (g.KONULAR || []).concat(KONULAR_A);
  if (typeof module !== 'undefined' && module.exports) module.exports = KONULAR_A;
})(typeof window !== 'undefined' ? window : globalThis);
