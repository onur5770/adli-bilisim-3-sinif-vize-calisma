/* İçerik ajanı B: konu-08 … konu-13, hoca-kodu, kagit, yeni-plot, yeni-pencere, yeni-baska-kodlar */
(function (g) {
  /* kısa yardımcılar (çıktı SEMA'daki blok nesneleridir) */
  const M = html => ({ tip: 'metin', html });
  const B = (metin, yeni) => (yeni ? { tip: 'baslik', metin, yeni: true } : { tip: 'baslik', metin });
  const K = (kod, cikti, calistir) => {
    const o = { tip: 'kod', kod };
    if (cikti) o.cikti = cikti;
    if (calistir !== false) o.calistir = true;
    return o;
  };
  const KA = (ad, kod, cikti, calistir) => Object.assign(K(kod, cikti, calistir), { ad }); /* uygulama alanı örnek listesinde görünen kısa ad */
  const KX = (kod, cikti) => K(kod, cikti, false); /* çalıştır düğmesi olmayan kod */
  const T = (basliklar, satirlar) => ({ tip: 'tablo', basliklar, satirlar });
  const SS = liste => ({ tip: 'satirsatir', maddeler: liste.map(x => ({ kod: x[0], aciklama: x[1] })) });
  const C = metin => ({ tip: 'cizim', metin });
  const H = (id, baslik, yanlis, dogru, neden) => ({ tip: 'hata', id, baslik, yanlis, dogru, neden });
  const S = (id, soru, cevap) => ({ tip: 'sss', id, soru, cevap });
  const N = (tip, html) => ({ tip, html });
  const O = maddeler => ({ tip: 'ozet', maddeler });

  const HOCA_KODU = `res=imread("cameraman.tif");
J = imnoise(res,'salt & pepper', 0.02);
[w,h]=size(J);
for i=1:w-2
    for j=1:h-2
        blok=J(i:i+2,j:j+2);
        medyanli(i,j)=median(blok(:));
        ortalama(i,j)=mean(blok(:));
    end
end
figure,imshow(uint8(medyanli))
figure,imshow(uint8(ortalama))`;

  const veri = [];

  /* ================================================================== konu-08 */
  veri.push({
    id: 'konu-08', no: 8, baslik: 'sum, mean, median, max, min, abs, sqrt, find',
    kisa: 'Hazır hesaplama komutları: topla, ortalama al, ortancayı bul, en büyüğü/en küçüğü bul, şartı sağlayanın yerini bul.',
    yeni: false,
    bloklar: [
      M(`<p>Bu komutlar <strong>hazır hesaplama araçlarıdır</strong>. Parantez içine verdiğin sayılar üzerinde çalışır ve sonucu döndürür.</p>`),
      T(['Komut', 'Görevi', 'Örnek sonuç'], [
        ['<code>sum</code>', 'Toplar', '<code>sum([1 2 3])</code> → 6'],
        ['<code>mean</code>', 'Ortalama alır', '<code>mean([1 2 6])</code> → 3'],
        ['<code>median</code>', 'Sıralar, ortadakini alır', '<code>median([1 2 6])</code> → 2'],
        ['<code>max</code>', 'En büyüğü bulur', '<code>max([1 2 6])</code> → 6'],
        ['<code>min</code>', 'En küçüğü bulur', '<code>min([1 2 6])</code> → 1'],
        ['<code>abs</code>', 'Eksi işaretini atar', '<code>abs(-5)</code> → 5'],
        ['<code>sqrt</code>', 'Karekök alır', '<code>sqrt(16)</code> → 4'],
        ['<code>find</code>', 'Şartı sağlayan elemanların yerini bulur', '<code>find([1 9 2] &gt; 5)</code> → 2']
      ]),
      B('Örnek: ortasına parazit düşmüş 3×3 blok'),
      M(`<p>Ortasına parazit (255) düşmüş 3×3'lük bir blok düşün.</p>`),
      KA('3×3 blokta mean, median, max, find', `blok = [10 20 30; 40 255 60; 70 80 0];
v = blok(:);
ort = mean(v)
orta = median(v)
enbuyuk = max(v)
yer = find(v > 100)`, `ort =
   62.7778

orta =
    40

enbuyuk =
   255

yer =
     5`),
      SS([
        ['blok = [10 20 30; 40 255 60; 70 80 0];', '9 piksellik resmi oluşturur.'],
        ['v = blok(:);', 'Sütun sütun okuyup tek sıra yapar: <code>10 40 70 20 255 80 30 60 0</code>.'],
        ['ort = mean(v)', 'Hepsini toplar, 9\'a böler: <strong>565 / 9 = 62.7778</strong>.'],
        ['orta = median(v)', 'Önce sıralar: <code>0 10 20 30 40 60 70 80 255</code>. Tam ortadaki <strong>5. sayıyı</strong> alır: <strong>40</strong>.'],
        ['enbuyuk = max(v)', 'En büyük değeri verir: <strong>255</strong>.'],
        ['yer = find(v > 100)', '100\'den büyük olan sayının <strong>sırasını</strong> verir. 255, <code>v</code> içinde 5. sırada olduğu için sonuç <strong>5</strong> olur. (<code>&gt;</code> işareti sonraki konuda.)']
      ]),
      B('Neden blok(:) yazılıyor?'),
      M(`<p>Bu komutlar matrise doğrudan verilirse <strong>her sütunu ayrı</strong> hesaplar. <code>mean(blok)</code> tek sayı değil, üç sayı verir. Bütün blok için tek sonuç istiyorsan önce <code>(:)</code> ile tek sıra yaparsın.</p>`),
      K(`blok = [10 20 30; 40 255 60; 70 80 0];
mean(blok)
mean(blok(:))`, `ans =
   40.0000  118.3333   30.0000

ans =
   62.7778`),
      N('baglanti', `<p><code>median(blok(:))</code> ve <code>mean(blok(:))</code> hocanın kodundaki satırların tam olarak kendisidir. Parazit olan 255 ortalamayı 62.78'e çekti, ama ortanca 40'ta kaldı. <strong>Medyan filtresinin tuz-biber gürültüsünü iyi temizlemesinin nedeni bu.</strong></p>`),
      B('Sıra sende (sohbetteki sorular)'),
      M(`<p>Önce kağıda yaz, sonra dene. Bu sorular Uygulama alanında da var.</p>
<ul><li><strong>Soru 1:</strong> <code>v = [2 100 4 6 8];</code> için <code>mean(v)</code> ve <code>median(v)</code> kaç olur? Hangisi 100 parazitinden daha az etkilendi? → mean = 120 / 5 = <strong>24</strong>; sıralı hâli <code>2 4 6 8 100</code>, median = <strong>6</strong>; daha az etkilenen <strong>median</strong>.</li>
<li><strong>Soru 2:</strong> <code>M = [1 5; 9 3];</code> için <code>mean(M)</code> ve <code>mean(M(:))</code> ne verir? → <code>mean(M)</code> sütunları ayrı hesaplar: <code>5 4</code>. <code>mean(M(:))</code> = 18 / 4 = <strong>4.5</strong>.</li></ul>`),
      H('H11', 'Ortalamada yanlış sayıya bölmek',
        `<code>mean(M(:))</code> = <strong>9</strong> (18'i 2'ye bölmek). Senin sözünle: "hee ben 2ye bölbüm pardon 4e bölecektim"`,
        `<code>M(:)</code> → 1, 9, 5, 3 (4 sayı). Toplam 18, <strong>18 / 4 = 4.5</strong>`,
        `Ortalama için toplam, <strong>eleman sayısına</strong> bölünür. <code>M(:)</code> 4 sayı içerir; 2, matrisin satır (ya da sütun) sayısıdır, eleman sayısı değil. İpucu: önce <code>M(:)</code> hangi sayıları sıralar yaz, sonra "burada kaç sayı var?" diye say.`),
      H('H12', 'Ondalığı virgülle, cevapları bitişik yazmak',
        `<code>24,6 median. 5,4,9</code>`,
        `mean = <code>24</code>, median = <code>6</code>; <code>mean(M)</code> = <code>5 4</code>; <code>mean(M(:))</code> = <code>4.5</code>`,
        `MATLAB'da <strong>ondalık için virgül değil nokta</strong> kullanılır: <code>4.5</code>. Virgül MATLAB'da ayırıcıdır. "24,6" yazınca Türkçede 24.6 gibi okunabilir; iki ayrı sayıyı boşlukla ya da ayrı satırda yaz.`),

      B('sum: toplama', true),
      M(`<p><code>sum</code> verilen sayıları toplar. Vektörde tek sayı verir. Matriste, tıpkı <code>mean</code> gibi, <strong>her sütunu ayrı</strong> toplar; bütün matrisin toplamı için yine <code>(:)</code> kullanılır.</p>`),
      K(`v = [10 20 30];
sum(v)
M = [1 5; 9 3];
sum(M)
sum(M(:))`, `ans =
    60

ans =
    10     8

ans =
    18`),
      SS([
        ['sum(v)', '10 + 20 + 30 = <strong>60</strong>.'],
        ['sum(M)', '1. sütun: 1 + 9 = 10, 2. sütun: 5 + 3 = 8 → <code>10 8</code>.'],
        ['sum(M(:))', 'Dört sayının hepsi: 1 + 9 + 5 + 3 = <strong>18</strong>.']
      ]),
      N('ipucu', `<p><code>mean</code> aslında "<code>sum</code> bölü eleman sayısı"dır: <code>sum(M(:)) / 4</code> = 18 / 4 = 4.5 = <code>mean(M(:))</code>.</p>`),

      B('max ve min: en parlak ve en koyu piksel', true),
      M(`<p><code>max</code> en büyük, <code>min</code> en küçük sayıyı bulur. Resimde bu, en parlak ve en koyu piksel demektir. Matrise doğrudan verilirse yine sütun sütun çalışırlar.</p>`),
      K(`blok = [10 20 30; 40 255 60; 70 80 0];
enbuyuk = max(blok(:))
enkucuk = min(blok(:))
fark = enbuyuk - enkucuk
max(blok)`, `enbuyuk =
   255

enkucuk =
     0

fark =
   255

ans =
    70   255    60`),
      M(`<p>Son satırda <code>max(blok)</code> her sütunun en büyüğünü ayrı verdi: 1. sütunda 70, 2. sütunda 255, 3. sütunda 60. Tuz-biber gürültüsünde <code>max</code> çoğunlukla tuzu (255), <code>min</code> çoğunlukla biberi (0) yakalar.</p>`),

      B('abs: eksi işaretini atmak', true),
      M(`<p><code>abs</code> sayının eksi işaretini atar (mutlak değer). İki pikselin birbirinden <strong>ne kadar farklı</strong> olduğunu bulurken işe yarar: hangisinin büyük olduğu önemli değildir, aradaki uzaklık önemlidir.</p>`),
      K(`abs(-5)
abs(7)
p1 = 40;
p2 = 100;
fark = abs(p1 - p2)
abs([-3 4 -10])`, `ans =
     5

ans =
     7

fark =
    60

ans =
     3     4    10`),
      M(`<p><code>p1 - p2</code> = −60 çıkar; <code>abs</code> bunu 60 yapar. Matrise verilirse her elemanın işaretini ayrı ayrı atar.</p>`),

      B('sqrt: karekök', true),
      K(`sqrt(16)
sqrt(2)
sqrt([4 9 25])`, `ans =
     4

ans =
    1.4142

ans =
     2     3     5`),
      M(`<p><code>sqrt(16)</code> = 4, çünkü 4 × 4 = 16. Sonuç tam sayı olmak zorunda değil: <code>sqrt(2)</code> = 1.4142. Matrise verilirse her elemanın karekökünü ayrı alır.</p>`),

      B('find: şartı sağlayanların yeri', true),
      M(`<p><code>find</code> değeri değil, <strong>sırayı (yeri)</strong> verir. Şartı birden çok eleman sağlıyorsa hepsinin sırasını verir; hiçbiri sağlamıyorsa sonuç boş olur.</p>`),
      K(`v = [5 200 30 255 0];
yerler = find(v > 100)
v(yerler)
find(v == 0)`, `yerler =
     2     4

ans =
   200   255

ans =
     5`),
      SS([
        ['yerler = find(v > 100)', '100\'den büyük sayılar 200 ve 255. Bunlar 2. ve 4. sırada → <code>2 4</code>.'],
        ['v(yerler)', 'Bulunan sıralardaki <strong>değerleri</strong> gösterir: <code>200 255</code>.'],
        ['find(v == 0)', 'Değeri 0 olan eleman 5. sırada → <strong>5</strong>. (Biber parazitinin yerini bulmak gibi.)']
      ]),
      N('dikkat', `<p>Matriste <code>find</code>, <code>A(:)</code> sırasına göre (sütun sütun) sayar. <code>A = [10 200; 150 30]</code> için <code>find(A &gt; 100)</code> → <code>2 3</code> (alt alta), çünkü sütun sütun okununca sıra 10, 150, 200, 30 olur.</p>`),

      B('Çift sayıda elemanda median', true),
      M(`<p>Sohbetteki bütün örneklerde eleman sayısı tekti (3, 5, 9), o yüzden hep tam ortada bir sayı vardı. Eleman sayısı <strong>çiftse</strong> tam ortada tek sayı olmaz; <code>median</code> ortadaki <strong>iki sayının ortalamasını</strong> alır.</p>`),
      K(`median([2 4 6 8])
median([10 0 255 20])`, `ans =
     5

ans =
    15`),
      M(`<p>İlkinde ortadaki iki sayı 4 ve 6 → (4 + 6) / 2 = 5. İkincisinde önce sıralanır: <code>0 10 20 255</code>; ortadakiler 10 ve 20 → 15. Hocanın kodunda blok hep 9 elemanlı olduğu için bu durum oluşmaz: medyan her zaman sıralı dizinin 5. sayısıdır.</p>`),

      O([
        '<code>sum</code> toplar, <code>mean</code> ortalama alır, <code>median</code> sıralayıp ortadakini alır, <code>max</code>/<code>min</code> en büyük/en küçüğü bulur.',
        '<code>abs</code> eksi işaretini atar, <code>sqrt</code> karekök alır, <code>find</code> şartı sağlayanların <strong>sırasını</strong> verir.',
        'Matrise doğrudan verilirse sütun sütun çalışırlar; tek sonuç için önce <code>(:)</code>: <code>mean(blok(:))</code>.',
        'Ortalama = toplam / <strong>eleman sayısı</strong>. Ondalık nokta ile yazılır: <code>4.5</code>.',
        'Parazit (0 ya da 255) ortalamayı çeker, medyanı pek etkilemez: medyan filtresinin sırrı budur.'
      ])
    ]
  });

  /* ================================================================== konu-09 */
  veri.push({
    id: 'konu-09', no: 9, baslik: 'Karşılaştırma ve mantık',
    kisa: 'MATLAB\'a evet-hayır sorusu sormak: >, <, >=, <=, ==, ~= ve iki soruyu birleştiren &&, ||.',
    yeni: false,
    bloklar: [
      M(`<p>Karşılaştırma, MATLAB'a <strong>evet-hayır sorusu</strong> sormaktır. Cevap <strong>1 (doğru)</strong> veya <strong>0 (yanlış)</strong> olarak gelir.</p><p>Aşağıdaki tabloda <code>piksel = 200</code> kabul edildi:</p>`),
      T(['İşaret', 'Anlamı', 'Örnek', 'Sonuç'], [
        ['<code>&gt;</code>', 'Büyük mü?', '<code>piksel &gt; 100</code>', '1'],
        ['<code>&lt;</code>', 'Küçük mü?', '<code>piksel &lt; 100</code>', '0'],
        ['<code>&gt;=</code>', 'Büyük veya eşit mi?', '<code>piksel &gt;= 200</code>', '1'],
        ['<code>&lt;=</code>', 'Küçük veya eşit mi?', '<code>piksel &lt;= 150</code>', '0'],
        ['<code>==</code>', 'Eşit mi?', '<code>piksel == 200</code>', '1'],
        ['<code>~=</code>', 'Eşit değil mi?', '<code>piksel ~= 200</code>', '0']
      ]),
      N('dikkat', `<p><strong>En sık yapılan hata:</strong> Tek <code>=</code> "kutuya koy", çift <code>==</code> ise "eşit mi diye sor" demektir.</p>`),
      B('İki soruyu birleştirmek: && ve ||'),
      M(`<ul><li><code>&amp;&amp;</code> <strong>ve</strong>: İki koşul da doğruysa sonuç 1 olur.</li><li><code>||</code> <strong>veya</strong>: En az bir koşul doğruysa sonuç 1 olur.</li></ul>`),
      K(`piksel = 255;
piksel == 255
piksel > 100 && piksel < 200
piksel == 0 || piksel == 255
A = [10 200; 150 30];
A > 100`, `ans =
  logical
   1

ans =
  logical
   0

ans =
  logical
   1

ans =
  2×2 logical array
   0   1
   1   0`),
      SS([
        ['piksel = 255;', '255 değerini kutuya koyar.'],
        ['piksel == 255', '"255\'e eşit mi?" diye sorar. Sonuç 1.'],
        ['piksel > 100 && piksel < 200', 'İlk koşul doğru (1), ikincisi yanlış (0). <strong>Ve</strong> için ikisi de doğru olmalı, sonuç 0.'],
        ['piksel == 0 || piksel == 255', 'İlk koşul yanlış, ikincisi doğru. <strong>Veya</strong> için biri yeterli, sonuç 1. Bu satır, <strong>"piksel tuz-biber paraziti olabilir mi?"</strong> sorusudur, çünkü bu gürültü pikselleri 0 veya 255 yapar.'],
        ['A = [10 200; 150 30];', '2×2\'lik resmi oluşturur.'],
        ['A > 100', 'Karşılaştırma matrise yapılırsa <strong>her piksel ayrı ayrı</strong> sorulur: sonuç 0 ve 1\'lerden oluşan aynı boyutta bir tablodur.']
      ]),
      N('not', `<p><code>&amp;&amp;</code> ve <code>||</code> <strong>tek bir evet-hayır cevabı</strong> olan koşullarda kullanılır. Bu yüzden yukarıdaki gibi tek piksellerde çalışırlar. MATLAB ekranda sonucu <code>ans = logical 1</code> gibi gösterebilir; "logical" evet-hayır değeri demektir.</p>`),
      B('Sıra sende (sohbetteki sorular)'),
      M(`<ul><li><strong>Soru 1:</strong> <code>p = 0;</code> iken <code>p == 0 || p == 255</code> ve <code>p &gt; 0 &amp;&amp; p &lt; 255</code> satırlarının sonucu nedir? → <strong>1</strong> ve <strong>0</strong>. Birinci koşulda ilk soru doğru; ikincide <code>p &gt; 0</code> yanlış olduğu için "ve" tutmaz.</li>
<li><strong>Soru 2:</strong> <code>B = [5 120; 255 40];</code> için <code>B &gt;= 120</code> ne verir? → <code>[0 1; 1 0]</code>. Tam 120 olan piksel de <strong>eşitlik sayesinde</strong> 1 olur.</li></ul>`),

      B('~= : eşit değil mi?', true),
      M(`<p><code>~=</code>, <code>==</code> işaretinin tersidir: iki değer <strong>farklıysa</strong> 1, aynıysa 0 verir. Klavyede <code>~</code> işareti "değil" anlamına gelir.</p>`),
      K(`p = 120;
p ~= 0
p ~= 120
B = [0 50; 255 0];
B ~= 0`, `ans =
  logical
   1

ans =
  logical
   0

ans =
  2×2 logical array
   0   1
   1   0`),
      M(`<p><code>B ~= 0</code> "siyah <em>olmayan</em> pikseller hangileri?" sorusudur. Aynı mantıkla <code>p ~= 0 &amp;&amp; p ~= 255</code>, "bu piksel parazit <em>değil</em> mi?" diye sorar.</p>`),

      B('<= ve >= : sınırdaki sayı', true),
      M(`<p><code>&lt;</code> ile <code>&lt;=</code> arasındaki tek fark <strong>sınırdaki sayıdır</strong>. Sayı sınıra tam eşitse <code>&lt;</code> 0 verir, <code>&lt;=</code> 1 verir.</p>`),
      K(`p = 128;
p < 128
p <= 128
p > 128
p >= 128`, `ans =
  logical
   0

ans =
  logical
   1

ans =
  logical
   0

ans =
  logical
   1`),

      B('Tek = ile çift == farkı', true),
      T(['Yazım', 'Ne yapar?', 'p ne olur?'], [
        ['<code>p = 5</code>', '5\'i <code>p</code> kutusuna <strong>koyar</strong>', 'p artık 5'],
        ['<code>p == 5</code>', '"p, 5\'e eşit mi?" diye <strong>sorar</strong>, cevap 1 ya da 0', 'p değişmez']
      ]),
      K(`p = 5;
p == 7
p`, `ans =
  logical
   0

p =
     5`),
      M(`<p><code>p == 7</code> yalnızca soru sordu: cevap 0 (eşit değil) ve <code>p</code> hâlâ 5. Koşul yazarken (<code>if</code> içinde) hep çift <code>==</code> kullanılır. <code>if p = 5</code> yazarsan MATLAB hata verir.</p>`),

      B('Matrislerde ve/veya: & ve |', true),
      M(`<p><code>&amp;&amp;</code> ve <code>||</code> yalnızca tek bir evet-hayır değeriyle çalışır. Karşılaştırma bir <strong>matrise</strong> yapılmışsa sonuç da matristir; bunları birleştirmek için tek işaretli hâlleri kullanılır: <code>&amp;</code> (ve), <code>|</code> (veya). Bunlar eleman eleman çalışır.</p>`),
      K(`A = [0 120; 255 40];
parazit = A == 0 | A == 255
orta = A > 30 & A < 200`, `parazit =
  2×2 logical array
   1   0
   1   0

orta =
  2×2 logical array
   0   1
   0   1`),
      N('not', `<p>Bu kısım sohbette anlatılmadı; hocanın kodunda da yok. Bilmen gereken tek şey: <strong>tek sayı için <code>&amp;&amp;</code> / <code>||</code>, matris için <code>&amp;</code> / <code>|</code></strong>.</p>`),
      N('baglanti', `<p>Hocanın kodunda karşılaştırma işareti yok; ama tuz-biber gürültüsünün ne olduğunu anlamak için <code>p == 0 || p == 255</code> sorusu çok işe yarar. Bir sonraki konuda bu soruları <code>if</code> içinde kullanacağız.</p>`),
      O([
        'Karşılaştırmanın cevabı 1 (doğru) ya da 0 (yanlış) olur.',
        '<code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>, <code>==</code> (eşit mi), <code>~=</code> (eşit değil mi).',
        'Tek <code>=</code> kutuya koyar, çift <code>==</code> sorar.',
        '<code>&amp;&amp;</code> = ve (ikisi de doğru olmalı), <code>||</code> = veya (biri yeter). Tek pikselde kullanılır.',
        'Matrise karşılaştırma yapılırsa her piksel ayrı sorulur: <code>A &gt; 100</code> → 0/1 tablosu.',
        '<code>p == 0 || p == 255</code> → "bu piksel tuz ya da biber mi?"'
      ])
    ]
  });

  /* ================================================================== konu-10 */
  veri.push({
    id: 'konu-10', no: 10, baslik: 'if / else / elseif',
    kisa: 'Koşula göre iş yapmak: eğer doğruysa şunu yap, değilse bunu yap; yapı her zaman end ile biter.',
    yeni: false,
    bloklar: [
      M(`<p><code>if</code>, "<strong>eğer</strong>" demektir. Bir koşula bakar; koşul doğruysa bir işi yapar, yanlışsa yapmaz veya başka bir işi yapar. Yapısı şöyledir:</p>`),
      C(`if koşul
    koşul doğruysa yapılacaklar
else
    koşul yanlışsa yapılacaklar
end`),
      M(`<ul><li><code>else</code>, "<strong>değilse</strong>" demektir ve kullanılması <strong>zorunlu değildir</strong>.</li><li><code>end</code> bloğun bittiğini gösterir ve <strong>zorunludur</strong>.</li><li>Soldaki boşluklar (girinti) sadece okumayı kolaylaştırır.</li></ul>`),
      B('Örnek: eşikleme'),
      M(`<p>Parlak pikseli beyaz, koyu pikseli siyah yapıyoruz.</p>`),
      KA('Eşikleme: if / else ile siyah-beyaz kararı', `piksel = 200;
if piksel > 128
    yeni = 255;
else
    yeni = 0;
end
yeni`, `yeni =
   255`),
      SS([
        ['piksel = 200;', '200 değerini kutuya koyar.'],
        ['if piksel > 128', '"200, 128\'den büyük mü?" diye sorar. Cevap evet.'],
        ['yeni = 255;', 'Koşul doğru olduğu için bu satır çalışır.'],
        ['else', 'Koşul doğru olduğu için buradan sonrası atlanır.'],
        ['yeni = 0;', 'Çalışmaz.'],
        ['end', 'if yapısı biter.'],
        ['yeni', 'Sonucu gösterir: 255.']
      ]),
      M(`<p><code>piksel</code> değişirse hangi yol çalışır?</p>`),
      T(['piksel', 'piksel &gt; 128', 'Çalışan satır', 'yeni'], [
        ['200', '1 (doğru)', '<code>yeni = 255;</code>', '255'],
        ['100', '0 (yanlış)', '<code>yeni = 0;</code>', '0'],
        ['128', '0 (yanlış)', '<code>yeni = 0;</code>', '0']
      ]),
      N('dikkat', `<p>128 tam sınırda. 128'den <strong>büyük olmadığı</strong> için koşul yanlış olur.</p>`),
      B('elseif: ikiden fazla yol'),
      M(`<p>İkiden fazla yol gerekiyorsa araya <code>elseif</code> ("<strong>değilse eğer</strong>") eklenir:</p>`),
      K(`piksel = 120;
if piksel < 50
    tur = 1;
elseif piksel < 200
    tur = 2;
else
    tur = 3;
end
tur`, `tur =
     2`),
      M(`<p>Yukarıdan aşağı bakılır, <strong>doğru olan ilk koşul</strong> çalışır ve gerisi atlanır. <code>piksel = 30</code> ise <code>tur</code> 1 olur, <code>piksel = 120</code> ise 2, <code>piksel = 220</code> ise 3.</p>`),
      N('not', `<p><strong>İnce ayrıntı:</strong> Sohbette bu cümle "üçten fazla yol gerekiyorsa" diye geçmişti. Doğrusu "<strong>ikiden fazla</strong> yol"dur: <code>if</code> + <code>else</code> iki yol verir; üçüncü yol için bile <code>elseif</code> gerekir (yukarıdaki örnek tam 3 yolludur).</p>`),
      B('Sıra sende (sohbetteki sorular)'),
      M(`<p><strong>Soru 1:</strong> Bu kod çalışınca <code>durum</code> kaç olur?</p>`),
      KA('Sıra sende cevabı: tuz ya da biber mi? (||)', `p = 255;
if p == 0 || p == 255
    durum = 1;
else
    durum = 0;
end
durum`),
      M(`<p>Cevap: <strong>1</strong>. <code>p == 255</code> doğru olduğu için "veya" koşulu tutar.</p>
<p><strong>Soru 2:</strong> Kodu sen yaz: <code>piksel</code> 100'den küçükse <code>sonuc</code> 0 olsun, değilse <code>sonuc</code> piksel değerine eşit olsun. (Çalıştıracaksan üst satıra <code>piksel = 70;</code> ekleyebilirsin.)</p>
<p>Bu soruda iki deneme yanlış çıktı; ikisi de aşağıdaki kutularda.</p>`),
      H('H13', 'else yerine koşulsuz elseif yazmak',
        `<pre><code>if piksel &lt;100
sonuc=0
elseif
sonuc=piksel</code></pre>`,
        `<pre><code>if piksel &lt; 100
    sonuc = 0;
else
    sonuc = piksel;
end</code></pre>`,
        `<code>elseif</code> "değilse eğer" demektir, bu yüzden yanında <strong>yeni bir koşul ister</strong>. Burada yeni bir koşul yok; kalan her durumda yapılacak işi söylüyoruz. Bunun kelimesi <code>else</code>'tir. İpucu: "Az önceki yapıda bu durum için hangi kelime vardı?"`),
      H('H14', 'if yapısını end ile kapatmamak',
        `<pre><code>if piksel &lt;100
sonuc=0
elseif
sonuc=piksel</code></pre> (hiç <code>end</code> yok)`,
        `Yapının son satırı <code>end</code> olmalı.`,
        `<code>end</code> zorunludur; MATLAB if yapısının bittiğini yalnızca bununla anlar. İpucu: "MATLAB, if yapısının bittiğini nasıl anlıyordu? Kodunda bunu söyleyen bir satır var mı?"`),
      H('H15', 'Düzeltirken asıl hatayı yerinde bırakmak',
        `<pre><code>if piksel &lt;100
sonuc=0;
elseif
sonuc=piksel;</code></pre> (2. deneme: yalnızca <code>;</code> eklendi)`,
        `<pre><code>if piksel &lt; 100
    sonuc = 0;
else
    sonuc = piksel;
end</code></pre>`,
        `Noktalı virgülleri eklemek güzel ama istenen o değildi (ilk denemede <code>;</code> olmaması hata değildi). Hatalı iki yer, yani <code>elseif</code> ve eksik <code>end</code>, aynen kaldı. İpucu olarak iskelet verildi; boşluklara <code>else</code> ve <code>end</code> geldi.`),
      M(`<p>Sohbette verilen iskelet (boşluk doldurma) ve karşılaştırma için eşikleme örneğinin iskeleti:</p>`),
      KX(`if piksel < 100
    sonuc = 0;
_______
    sonuc = piksel;
_______`),
      KX(`if piksel > 128
    yeni = 255;
else
    yeni = 0;
end`),
      M(`<ul><li><strong>1. boşluk:</strong> "Koşul doğru değilse, yani geri kalan her durumda" anlamına gelen tek kelime. <code>elseif</code> olamaz, çünkü o kelimenin yanına yeni bir koşul yazılması gerekir → <code>else</code></li><li><strong>2. boşluk:</strong> MATLAB'a "if yapısı burada bitti" diyen kelime → <code>end</code></li></ul><p>Kodun tamamı:</p>`),
      KA('Sıra sende cevabı: 100\'den küçükse sıfırla', `piksel = 70;
if piksel < 100
    sonuc = 0;
else
    sonuc = piksel;
end
sonuc`, `sonuc =
     0`),

      B('elseif\'i doğru yerde kullanmak', true),
      M(`<p><code>elseif</code>'in yanında <strong>her zaman bir koşul</strong> bulunur. İstediğin kadar <code>elseif</code> ekleyebilirsin; en sondaki <code>else</code> "hiçbiri tutmadıysa" demektir. Örnek: bir pikseli "biber / tuz / normal" diye sınıflandıralım.</p>`),
      K(`p = 255;
if p == 0
    tip = 1;      % biber
elseif p == 255
    tip = 2;      % tuz
else
    tip = 3;      % normal piksel
end
tip`, `tip =
     2`),
      T(['p', 'p == 0', 'p == 255', 'Çalışan yol', 'tip'], [
        ['0', '1', '(bakılmaz)', '<code>if</code>', '1'],
        ['255', '0', '1', '<code>elseif</code>', '2'],
        ['90', '0', '0', '<code>else</code>', '3']
      ]),
      N('dikkat', `<p>Sıra önemlidir: <strong>doğru olan ilk koşul</strong> çalışır, gerisine bakılmaz. Baştaki örnekte <code>piksel = 30</code> hem <code>&lt; 50</code> hem <code>&lt; 200</code> koşulunu sağlar, ama yalnızca ilki çalışır ve <code>tur</code> 1 olur.</p>`),
      B('else olmadan if', true),
      M(`<p><code>else</code> zorunlu değildi. Koşul yanlışsa hiçbir şey yapılmasını istemiyorsan yalnızca <code>if ... end</code> yazarsın. Örnek: piksel 255'i geçtiyse 255'e indir, geçmediyse dokunma.</p>`),
      K(`piksel = 300;
if piksel > 255
    piksel = 255;
end
piksel`, `piksel =
   255`),
      M(`<p><code>piksel = 100</code> olsaydı koşul yanlış olurdu, içerideki satır atlanırdı ve <code>piksel</code> 100 kalırdı.</p>`),
      N('baglanti', `<p>Hocanın kodunda <code>if</code> yok. Ama benzer sınav sorularında (eşikleme, "piksel parazit mi?" kontrolü) <code>for</code> döngüsünün içine <code>if</code> yazılır. Bunun örnekleri "Benzer kodlar" bölümünde.</p>`),
      O([
        '<code>if koşul … end</code>: koşul doğruysa içindeki satırlar çalışır.',
        '<code>else</code> = "değilse" (koşul almaz, zorunlu değil). <code>elseif koşul</code> = "değilse eğer" (yanına <strong>mutlaka koşul</strong> ister).',
        '<code>end</code> zorunludur; unutulursa kod çalışmaz.',
        'İkiden fazla yol için <code>elseif</code>; yukarıdan aşağı doğru olan ilk koşul çalışır.',
        'Sınırdaki sayıya dikkat: 128, <code>&gt; 128</code> koşulunu sağlamaz.'
      ])
    ]
  });

  /* ================================================================== konu-11 */
  veri.push({
    id: 'konu-11', no: 11, baslik: 'for ve iç içe for',
    kisa: 'Bir işi tekrar tekrar yaptırmak; iç içe iki for ile resmin her pikselini satır satır gezmek.',
    yeni: false,
    bloklar: [
      M(`<p><code>for</code>, bir işi <strong>tekrar tekrar</strong> yaptırır. Resimlerde her pikseli tek tek gezmek için kullanılır.</p>`),
      C(`for sayaç = başlangıç:bitiş
    tekrarlanacak işler
end`),
      B('1. Tek for'),
      K(`toplam = 0;
for i = 1:3
    toplam = toplam + i;
end
toplam`, `toplam =
     6`),
      SS([
        ['toplam = 0;', 'Toplamı 0\'dan başlatır.'],
        ['for i = 1:3', '<code>i</code> sırayla 1, 2, 3 olacak ve döngü üç tur dönecek.'],
        ['toplam = toplam + i;', 'Her turda <code>i</code> değerini toplama ekler.'],
        ['end', 'Turun sonu. Sıradaki <code>i</code> varsa başa döner, yoksa döngüden çıkar.'],
        ['toplam', 'Sonucu gösterir: 6.']
      ]),
      T(['Tur', 'i', 'İşlem', 'toplam'], [
        ['1', '1', '0 + 1', '1'],
        ['2', '2', '1 + 2', '3'],
        ['3', '3', '3 + 3', '6']
      ]),
      B('2. İç içe for'),
      M(`<p>Bir döngünün içine başka bir döngü koyarsan, <strong>dıştaki bir adım atarken içteki baştan sona tamamlanır</strong>.</p>
<p><strong>Saat gibi düşün:</strong> akrep bir ilerlemeden önce yelkovan tam turunu atar. Burada <code>i</code> satırı, <code>j</code> sütunu gezer. Yani resim soldan sağa, sonra bir alt satır şeklinde okunur.</p>
<p>Örnek: Resimdeki her pikseli 5 birim aydınlatıyoruz.</p>`),
      K(`A = [10 20 30; 40 50 60];
[w,h] = size(A);
for i = 1:w
    for j = 1:h
        yeni(i,j) = A(i,j) + 5;
    end
end
yeni`, `yeni =
    15    25    35
    45    55    65`),
      SS([
        ['A = [10 20 30; 40 50 60];', '2 satır, 3 sütunluk resmi oluşturur.'],
        ['[w,h] = size(A);', '<code>w=2</code>, <code>h=3</code> olur.'],
        ['for i = 1:w', '<code>i</code>, 1\'den 2\'ye gider (satırlar).'],
        ['for j = 1:h', 'Her <code>i</code> için <code>j</code>, 1\'den 3\'e gider (sütunlar).'],
        ['yeni(i,j) = A(i,j) + 5;', 'A\'daki pikseli alır, 5 ekler, <code>yeni</code> içinde aynı adrese yazar. <strong><code>yeni</code> önceden oluşturulmamışsa MATLAB onu büyüterek kendisi oluşturur.</strong>'],
        ['end', 'İlk <code>end</code> iç döngüyü kapatır.'],
        ['end', 'İkinci <code>end</code> dış döngüyü kapatır.'],
        ['yeni', 'Sonucu gösterir.']
      ]),
      B('Adım adım i ve j'),
      T(['Adım', 'i', 'j', 'A(i,j)', 'yeni(i,j)', 'Ne oldu?'], [
        ['1', '1', '1', '10', '15', '1. satır başladı'],
        ['2', '1', '2', '20', '25', 'j arttı, i aynı'],
        ['3', '1', '3', '30', '35', 'j bitti'],
        ['4', '2', '1', '40', '45', 'i arttı, j başa döndü'],
        ['5', '2', '2', '50', '55', 'j arttı, i aynı'],
        ['6', '2', '3', '60', '65', 'İkisi de bitti']
      ]),
      C(`Pikselleri gezme sırası (2 satır × 3 sütun):

      j=1   j=2   j=3
i=1 [  1 →   2 →   3 ]
i=2 [  4 →   5 →   6 ]

Önce j artar (sağa git). j bitince i bir artar (alt satıra in), j başa döner.`),
      M(`<p>Toplam adım sayısı <strong>satır × sütun</strong>, yani 2 × 3 = 6.</p>`),
      N('baglanti', `<p><code>for i=1:w-2</code> satırı, 3×3'lük pencerenin resimden <strong>taşmaması</strong> içindir. <code>w=256</code> iken <code>i</code> en fazla 254 olur ve <code>i:i+2</code> son olarak <code>254:256</code> satırlarını seçer. <code>i</code> 255 olsaydı 257. satır istenirdi, ama böyle bir satır yok.</p>`),
      B('Sıra sende, Soru 1: kodu tablo gibi takip et'),
      M(`<p>Her adım için <code>i</code>, <code>j</code>, <code>A(i,j)</code> ve <code>toplam</code> değerlerini yaz.</p>`),
      K(`A = [1 2; 3 4];
toplam = 0;
for i = 1:2
    for j = 1:2
        toplam = toplam + A(i,j);
    end
end
toplam`, `toplam =
    10`),
      T(['Adım', 'i', 'j', 'A(i,j)', 'toplam'], [
        ['1', '1', '1', '1', '1'],
        ['2', '1', '2', '2', '3'],
        ['3', '2', '1', '3', '6'],
        ['4', '2', '2', '4', '10']
      ]),
      M(`<p><strong>3. adım nasıl bulunur?</strong></p>
<ul><li><strong>j ne olur?</strong> 2. adımda <code>j</code> zaten 2 idi ve <code>j</code>'nin aralığı <code>1:2</code>. Yani iç döngü bitti. Bu durumda <strong>dış döngü bir adım atar ve iç döngü baştan başlar</strong>: <code>i=2</code>, <code>j=1</code>.</li>
<li><strong>toplam ne olur?</strong> 2. adımın sonunda <code>toplam</code> 3 idi. Bu adımda ona <code>A(i,j)</code> eklenir: <code>A(2,1)</code> = 3 → 3 + 3 = <strong>6</strong>.</li></ul>
<p>4. adım sohbette yazılmamıştı: <code>j</code> bir artar (<code>i=2</code>, <code>j=2</code>), <code>A(2,2)</code> = 4, toplam 6 + 4 = <strong>10</strong>.</p>`),
      H('H20', 'Tablo istenirken tek sayı yazmak',
        `<code>1-10</code> (tablo yerine yalnız sonuç) ve 3. adım sorulunca yalnızca <code>3</code>`,
        `Tablo: (i, j, A(i,j), toplam) → (1, 1, 1, 1), (1, 2, 2, 3), (2, 1, 3, 6), (2, 2, 4, 10). 3. adım: <code>i=2</code>, <code>j=1</code>, <code>A(i,j)=3</code>, <code>toplam=6</code>.`,
        `"3" değerini <code>A(i,j)</code> için yazdıysan doğru; ama tek sayı yazınca diğer değerler görünmüyor. Döngü sorularında sınavda da <strong>her adımın tüm değerleri</strong> istenir. İpucu: 2. adımda <code>j</code> zaten 2 idi, aralığı <code>1:2</code> → iç döngü bitti; dış döngü bir adım atar, iç döngü baştan başlar.`),
      H('H21', 'Birikimli toplamı unutmak',
        `3. adım: <code>2,1,3,3</code> (toplam = 3)`,
        `<code>i=2</code>, <code>j=1</code>, <code>A(i,j)=3</code>, <strong><code>toplam=6</code></strong>`,
        `<code>toplam = toplam + A(i,j);</code> kutudaki <strong>eski değere</strong> <code>A(i,j)</code> değerini ekleyip sonucu yeniden kutuya koyar. 2. adımın sonunda kutuda 3 vardı; 3. adımda <code>A(i,j)</code> de 3 → işlem <code>toplam = 3 + 3</code> = 6. Toplam 3'te kalmaz.`),
      B('Sıra sende, Soru 2: kodu sen yaz'),
      M(`<p><code>A = [10 20; 30 40];</code> için iç içe <code>for</code> kullanarak her pikseli 2 ile çarp, sonucu <code>yeni</code> adlı matrise kaydet. Doğru cevap:</p>`),
      K(`A = [10 20; 30 40];
for i = 1:2
    for j = 1:2
        yeni(i,j) = A(i,j)*2;
    end
end
yeni`, `yeni =
    20    40
    60    80`),
      H('H16', 'Piksel seçerken köşeli parantez ve ; kullanmak',
        `<pre><code>for i =1:2
for j=1:2
yeni[i;j] = A[i;j]*2
end</code></pre>`,
        `<code>yeni(i,j) = A(i,j)*2</code>`,
        `Bir matristen piksel seçerken <strong>yuvarlak parantez ve virgül</strong> kullanılır: <code>A(2,3)</code> (Konu 5). Köşeli parantez ve <code>;</code> matris <strong>oluştururken</strong> kullanılır: <code>A = [10 20; 30 40]</code>. ("ayı tanımladım" diyerek <code>A = [10 20; 30 40];</code> satırını yazmamıştın; kodda o satır da olmalı.)`),
      H('H17', 'İki for için tek end yazmak',
        `İki <code>for</code>, tek <code>end</code> (yukarıdaki kod)`,
        `İki <code>for</code> için iki <code>end</code>`,
        `<strong>Her for kendi end'ini ister.</strong> İlk <code>end</code> iç döngüyü, ikincisi dış döngüyü kapatır. Kontrol yöntemi: "Kodumda kaç tane for var, kaç tane end var?" diye say.`),
      H('H18', 'Virgül düzeldi ama parantez hâlâ köşeli',
        `<code>yeni[i,j] = A[i,j]*2</code> (2. deneme)`,
        `<code>yeni(i,j) = A(i,j)*2</code>`,
        `Virgül yerine oturdu, iki <code>for</code> için iki <code>end</code> var; geriye tek bir karakter türü kaldı. Karşılaştır: matris oluştururken <code>A = [10 20; 30 40]</code>, matristen piksel seçerken <code>A(2,3)</code>. Piksel seçmek için <strong>yuvarlak parantez</strong> gerekir.`),
      H('H19', 'Döngü içindeki satırın sonuna ; koymamak (hata değil)',
        `<code>yeni(i,j) = A(i,j)*2</code> (sonda <code>;</code> yok)`,
        `<code>yeni(i,j) = A(i,j)*2;</code>`,
        `Bu bir hata değil, kod çalışır. Ama <code>;</code> koymazsan matris <strong>her turda</strong> ekrana yazılır (4 turda 4 kez; hocanın kodunda 64.516 kez olurdu). Sondaki <code>yeni</code> satırı zaten son hâlini gösterir.`),
      N('ipucu', `<p>İç içe döngü yazarken şu sırayı izle: (1) dış <code>for</code> satırlar için, (2) iç <code>for</code> sütunlar için, (3) içeride <code>(i,j)</code> adresiyle iş yap, (4) iki <code>end</code>. Girinti yapmak hangi <code>end</code>'in hangi <code>for</code>'a ait olduğunu görmeni kolaylaştırır.</p>`),
      B('Aralık 1\'den başlamak zorunda değil', true),
      M(`<p><code>for</code> satırındaki aralık, Konu 5'te gördüğün <code>başlangıç:bitiş</code> ya da <code>başlangıç:adım:bitiş</code> yazımıdır. Aralığı değiştirince döngünün kaç tur döneceği de değişir.</p>`),
      K(`sayac = 0;
for i = 1:2:9
    sayac = sayac + 1;
end
sayac`, `sayac =
     5`),
      M(`<p><code>1:2:9</code> → 1, 3, 5, 7, 9: beş sayı, beş tur. Hocanın kodundaki <code>1:w-2</code> de böyle bir aralıktır: önce <code>w-2</code> hesaplanır (254), sonra <code>1:254</code> oluşur. Yani <code>1:w-2</code> ile <code>1:(w-2)</code> aynıdır.</p>`),
      O([
        '<code>for sayaç = başlangıç:bitiş … end</code>: sayaç sırayla her değeri alır, içerideki işler her turda tekrarlanır.',
        'İç içe for\'da dıştaki bir adım atarken içteki baştan sona döner (akrep-yelkovan).',
        'Önce <code>j</code> artar; <code>j</code> bitince <code>i</code> bir artar ve <code>j</code> başa döner.',
        'Toplam adım = dış tur sayısı × iç tur sayısı (2 × 3 = 6).',
        'Piksel seçmek: <code>A(i,j)</code> (yuvarlak parantez, virgül). Her <code>for</code> kendi <code>end</code>\'ini ister.',
        '<code>toplam = toplam + …</code> eski değerin üstüne ekler (birikimli).',
        'Döngü içindeki satıra <code>;</code> koy; yoksa her turda ekrana yazılır.'
      ])
    ]
  });

  /* ================================================================== konu-12 */
  veri.push({
    id: 'konu-12', no: 12, baslik: 'uint8 ile double, taşma',
    kisa: 'Sayının türü kutunun ne tutabildiğini belirler: uint8 yalnızca 0–255 arası tam sayı tutar, fazlası sınırda kesilir.',
    yeni: false,
    bloklar: [
      M(`<p>Her sayının bir <strong>türü</strong> vardır. Tür, kutunun hangi sayıları tutabildiğini belirler.</p>`),
      T(['', 'double', 'uint8'], [
        ['Ne tutar?', 'Ondalıklı, negatif, çok büyük sayılar', 'Sadece 0 ile 255 arası tam sayılar'],
        ['Nerede görülür?', 'MATLAB\'da normal yazdığın sayılar', '<code>imread</code> ile okunan çoğu resim'],
        ['Resim ölçeği', '0 siyah, 1 beyaz', '0 siyah, 255 beyaz']
      ]),
      M(`<p><code>uint8</code> adı, "8 bitlik işaretsiz tam sayı" demektir. 8 bit ile 2⁸ = 256 farklı değer tutulur, yani 0'dan 255'e kadar.</p>
<p><strong>200+100 neden 255 oluyor?</strong> uint8 kutusuna 255'ten büyük bir sayı sığmaz. MATLAB sonucu kapasitenin sınırında <strong>keser</strong>. <strong>Bardağa fazla su doldurmak gibi:</strong> bardak en fazla 255 alır, fazlası taşar. Aynı şekilde <strong>0'ın altı da 0 olur</strong>.</p>`),
      KA('uint8 taşması, yuvarlama ve double ile ortalama', `a = uint8(200);
b = uint8(100);
a + b
b - a
uint8(3.6)
(a + b) / 2
(double(a) + double(b)) / 2`, `ans =
  uint8
   255

ans =
  uint8
   0

ans =
  uint8
   4

ans =
  uint8
   128

ans =
   150`),
      SS([
        ['a = uint8(200);', '200 değerini uint8 türünde saklar.'],
        ['b = uint8(100);', '100 değerini uint8 türünde saklar.'],
        ['a + b', 'Gerçek sonuç 300, sınırda kesilir: <strong>255</strong>.'],
        ['b - a', 'Gerçek sonuç −100, sınırda kesilir: <strong>0</strong>.'],
        ['uint8(3.6)', 'Tam sayıya yuvarlar: <strong>4</strong>.'],
        ['(a + b) / 2', 'Önce 255 oluşur, sonra 255 / 2 = 127.5, yuvarlanınca <strong>128</strong>. Gerçek ortalama 150 olmalıydı.'],
        ['(double(a) + double(b)) / 2', 'Önce türü double yaptık, 300 / 2 = <strong>150</strong>. Doğru sonuç.']
      ]),
      N('dikkat', `<p>Resimlerde bu çok önemlidir: İki pikseli uint8 türünde toplarsan sonuç bozulabilir.</p>`),
      N('baglanti', `<p><code>mean</code>, uint8 sayılarla çalışsa da sonucu <strong>double</strong> verir. Bu yüzden <code>ortalama</code> matrisi double olur ama içindeki değerler 0–255 arasındadır. <code>imshow</code> ise double resmi 0–1 ölçeğinde bekler ve çoğu pikseli beyaz gösterir. Koddaki <code>uint8(ortalama)</code> bunu düzeltir.</p>`),
      B('Sıra sende (sohbetteki sorular)'),
      M(`<ul><li><strong>Soru 1:</strong> <code>x = uint8(250);</code> iken <code>x + 10</code> ve <code>uint8(10) - 20</code> ne verir? → <strong>255</strong> ve <strong>0</strong>.</li>
<li><strong>Soru 2:</strong> <code>a = uint8(220);</code> ve <code>b = uint8(60);</code> için <code>(a + b) / 2</code> ve <code>(double(a) + double(b)) / 2</code> kaç olur? → <strong>128</strong> (220 + 60 = 280 → 255; 255 / 2 = 127.5 → 128) ve <strong>140</strong>. Gerçek ortalama 140 iken uint8 hesabı 128 verdi: toplamadaki taşma sonucu bozdu.</li></ul>
<p><strong>Kural:</strong> uint8 bir sayıyla yapılan işlemin sonucu <strong>yine uint8</strong> olur. <code>uint8(10) - 20</code> işleminde 20'nin düz yazılması sonucu değiştirmez.</p>`),
      H('H22', 'uint8\'de sonucu eksi bırakmak',
        `<code>uint8(10) - 20</code> = <strong>−10</strong>`,
        `<strong>0</strong>`,
        `uint8 yalnızca 0–255 arasını tutar ve uint8 bir sayıyla yapılan işlemin sonucu yine uint8 olur. Aralığın altına inen sonuç <strong>0'a kesilir</strong>. İpucu: "uint8 hangi aralığı tutabiliyordu? Aralığın altına inen bir sonuç olursa MATLAB ne yapıyordu?"`),
      S('S08', `uint8(10) zaten 10 demek; 10 − 20 = −10 olmaz mı? <em>(senin sözünle: "ama unit8(10) = 10 işlemde 10 -20 eşittir -10 olmazmı.")</em>`,
        `<p>Haklısın, matematikte 10 − 20 = −10 olur. <code>uint8(10)</code> değeri de gerçekten 10'dur. Farkı oluşturan şey, <strong>sonucun yazılacağı kutunun türüdür</strong>.</p>
<p>MATLAB iki iş yapar:</p>
<ol><li><strong>Hesaplar:</strong> 10 − 20 = −10</li><li><strong>Sonucu kutuya koyar:</strong> İşleme uint8 bir sayı girdiği için sonuç da uint8 kutusuna konur.</li></ol>
<p>İkinci adımda sorun çıkar: uint8 kutusu sadece 0–255 arasını tutar ve −10 bu aralıkta değildir. Yani üstteki taşma mantığının aynısı, alt sınır için de geçerli.</p>
<table><tr><th>İşlem</th><th>Matematikteki sonuç</th><th>uint8 sonucu</th></tr>
<tr><td><code>a + b</code> (200 + 100)</td><td>300</td><td>255 (üst sınıra kesildi)</td></tr>
<tr><td><code>b - a</code> (100 − 200)</td><td>−100</td><td>0 (alt sınıra kesildi)</td></tr></table>
<p>Aynı mantıkla <code>uint8(10) - 20</code> = <strong>0</strong>.</p>`),
      H('H24', 'Taşmayı abs ile karıştırmak',
        `<code>uint8(10) - 20</code> = <strong>10</strong> (eksi işaretini atmak)`,
        `<strong>0</strong>`,
        `Eksi işaretini atmak <code>abs</code> komutunun işiydi. uint8 işareti atmaz; sonucu <strong>izin verilen aralığın sınırına</strong> getirir. Aşağıdaki sayı doğrusuna bak: −10 bölgenin solunda, en yakın sınır 0.`),
      C(`−10 ... [ izin verilen bölge: 0 ... 255 ] ... 300
  │       ↑                             ↑       │
  └──→ sol sınıra çekilir: 0   sağ sınıra çekilir: 255 ←──┘`),
      M(`<p><strong>Sayı doğrusu:</strong> −10 izin verilen bölgenin dışında, sol tarafında kalıyor. MATLAB onu bölgenin <strong>en yakın sınırına</strong> çeker. Bölgenin sağından çıkan 300, sağ sınır olan 255'e çekilmişti. Sol sınır 0'dır. Kısacası: <strong>uint8 değerleri 0–255 aralığının dışına çıkamaz.</strong></p>`),
      H('H23', 'uint8 bölmesinde ondalık bırakmak',
        `<code>(a + b) / 2</code> = <strong>127.5</strong> (a = 220, b = 60)`,
        `<strong>128</strong>`,
        `220 + 60 = 280 → 255'e kesilir; 255 / 2 = 127.5 hesabı doğru. Ama <code>a + b</code> uint8 olduğu için bölme sonucu da uint8 olur ve uint8 <strong>ondalık tutamaz</strong>: 127.5 yukarı yuvarlanır → 128. İpucu: <code>uint8(3.6)</code> örneğinde ne olmuştu?`),
      H('H25', 'Komut adını unit8 yazmak',
        `<code>unit8(10)</code>`,
        `<code>uint8(10)</code>`,
        `Komutun adı <strong>u-int-8</strong>: "unsigned integer" (işaretsiz tam sayı) sözünün kısaltması. <code>unit8</code> yazarsan MATLAB <code>Unrecognized function or variable 'unit8'</code> hatası verir; <code>edn</code>/<code>end</code> ile aynı tür yazım hatası. (Sohbette bu yazım düzeltilmemişti.)`),
      B('Yuvarlama, double() ve class()', true),
      M(`<p><code>uint8(...)</code> ondalıklı sayıyı <strong>en yakın tam sayıya</strong> yuvarlar; buçuklu sayılar yukarı gider. <code>double(...)</code> ise sayıyı geniş kutuya taşır: artık taşma olmaz. Bir değişkenin türünü <code>class</code> ile sorabilirsin.</p>`),
      K(`uint8(3.2)
uint8(3.5)
uint8(300)
uint8(-7)
x = uint8(200);
class(x)
y = double(x) + 100
class(y)`, `ans =
  uint8
   3

ans =
  uint8
   4

ans =
  uint8
   255

ans =
  uint8
   0

ans =
    'uint8'

y =
   300

ans =
    'double'`),
      N('ipucu', `<p>Güvenli tarif: <strong>hesaptan önce <code>double</code>'a çevir, göstermeden önce <code>uint8</code>'e geri çevir.</strong> Örneğin iki pikselin ortalaması: <code>uint8((double(a) + double(b)) / 2)</code>.</p>`),
      O([
        '<code>uint8</code>: yalnızca 0–255 arası tam sayı. <code>double</code>: ondalıklı, negatif, büyük sayılar.',
        'uint8\'de 255\'i aşan sonuç 255\'e, 0\'ın altına inen sonuç 0\'a kesilir (bardak taşması).',
        'uint8 ile yapılan işlemin sonucu yine uint8\'dir; ondalık yuvarlanır (127.5 → 128).',
        'uint8 işareti atmaz (o <code>abs</code>\'in işi), sınıra çeker.',
        'Doğru hesap için önce <code>double(...)</code>; <code>mean</code> sonucu zaten double verir.',
        '<code>imshow</code>: uint8\'de 0–255, double\'da 0–1 ölçeği kullanır. Komutun adı <code>uint8</code>, <code>unit8</code> değil.'
      ])
    ]
  });

  /* ================================================================== konu-13 */
  veri.push({
    id: 'konu-13', no: 13, baslik: 'imread, imshow, imshow(X,[]), figure, subplot',
    kisa: 'Resmi dosyadan okumak, pencerede göstermek, tek pencereyi bölmelere ayırmak ve ölçeği otomatik ayarlamak.',
    yeni: false,
    bloklar: [
      B('İlk anlatım: bütün komutlar bir arada'),
      T(['Komut', 'Görevi'], [
        ['<code>imread("dosya")</code>', 'Resim dosyasını okur, sayı matrisine çevirir'],
        ['<code>imshow(X)</code>', 'Matrisi resim olarak gösterir'],
        ['<code>imshow(X,[])</code>', 'En küçük değeri siyah, en büyüğü beyaz yaparak gösterir'],
        ['<code>figure</code>', 'Yeni, boş bir resim penceresi açar'],
        ['<code>subplot(satır,sütun,sıra)</code>', 'Pencereyi bölmelere ayırır, istenen bölmeyi seçer'],
        ['<code>plot(y)</code>', 'Sayıları çizgi grafiği olarak çizer']
      ]),
      M(`<p>Satırdaki <strong>virgül</strong>, iki komutu aynı satıra yazmayı sağlar. Hocanın <code>figure,imshow(...)</code> yazımı, "önce pencere aç, sonra göster" demektir.</p>`),
      K(`res = imread("cameraman.tif");
[w,h] = size(res)
koyu = double(res) / 2;
figure
subplot(1,3,1), imshow(res)
subplot(1,3,2), imshow(koyu)
subplot(1,3,3), imshow(koyu,[])
figure, plot(res(100,:))`),
      SS([
        ['res = imread("cameraman.tif");', 'Resmi uint8 türünde bir matrise okur.'],
        ['[w,h] = size(res)', '<code>w = 256</code>, <code>h = 256</code> verir.'],
        ['koyu = double(res) / 2;', 'Türü double yapar, her pikseli ikiye böler.'],
        ['figure', 'Yeni pencere açar.'],
        ['subplot(1,3,1), imshow(res)', 'Pencereyi 1 satır, 3 sütuna böler, 1. bölmede orijinal resmi gösterir.'],
        ['subplot(1,3,2), imshow(koyu)', '<code>koyu</code>, double olduğu için 0–1 ölçeğinde yorumlanır. 1\'in üstündeki her piksel beyaz görünür, yani resim neredeyse bembeyaz olur.'],
        ['subplot(1,3,3), imshow(koyu,[])', 'En küçük değeri siyah, en büyüğü beyaz yapar. Resim düzgün görünür.'],
        ['figure, plot(res(100,:))', '100. satırdaki piksellerin parlaklığını grafik olarak çizer. <strong>Yatay eksen sütun numarası, dikey eksen parlaklıktır.</strong> (Ayrıntısı "plot" konusunda.)']
      ]),
      M(`<p><strong><code>imshow(X,[])</code> sayılarla:</strong> <code>X = [10 20; 30 40]</code> olsun. En küçük 10 siyah, en büyük 40 beyaz olur. 20 ve 30 ise aradaki gri tonlar olur.</p>
<p><strong>subplot numaralandırması:</strong> soldan sağa, yukarıdan aşağı gider. <code>subplot(2,2,?)</code> için:</p>`),
      C(`1 2
3 4`),
      M(`<p><strong>İlk "Sıra sende" soruları</strong> (bunları cevaplamadan "daha güzel anlat" demiştin; cevapları aşağıdaki yeniden anlatımda):</p>
<ul><li>Soru 1: <code>subplot(2,3,5)</code> kaçıncı satır ve kaçıncı sütundaki bölmeyi seçer? → 2. satır, 2. sütun.</li>
<li>Soru 2: <code>B = [10 20; 30 40];</code> için a) <code>imshow(B)</code> neden tamamen beyaz görünür? → B double, ölçek 0–1, dört sayı da 1'den büyük. b) <code>imshow(B,[])</code> yazınca hangi piksel siyah, hangisi beyaz olur? → 10 siyah, 40 beyaz (20 koyu gri, 30 açık gri).</li></ul>`),

      B('Yeniden anlatım 1: imread, imshow, figure'),
      S('S09', `Konu 13'ü anlamadım, daha anlaşılır anlatır mısın? <em>("bu kısmı daha güzel anlat anlamadım")</em>`,
        `<p>Fazla komut tek seferde anlatılmıştı; parçalara bölelim. Önce sadece resmi açma ve gösterme. Üç komutun görevi, <strong>fotoğraf albümü</strong> gibi:</p>
<ul><li><code>imread</code>: Fotoğraf dosyasını alır, sayı tablosuna çevirir, bir kutuya koyar.</li>
<li><code>imshow</code>: Kutudaki sayı tablosunu tekrar fotoğraf olarak gösterir.</li>
<li><code>figure</code>: Yeni, boş bir çerçeve açar.</li></ul>
<p><code>imread</code>'den sonra ekranda henüz resim yoktur (sadece okuduk); <code>res(1,1)</code> tek pikselin sayısını gösterir; <code>figure</code> olmasaydı ikinci <code>imshow</code> ilkinin üzerine yazılırdı. <code>subplot</code> ve <code>imshow(X,[])</code> aşağıda ayrı ayrı anlatılıyor.</p>`),
      K(`res = imread("cameraman.tif");
res(1,1)
figure, imshow(res)
figure, imshow(res)`),
      SS([
        ['res = imread("cameraman.tif");', '<code>cameraman.tif</code> dosyasını okur. <code>res</code> artık 256 satır, 256 sütunluk bir sayı tablosudur. <strong>Ekranda henüz resim yok</strong>, çünkü sadece okuduk. <code>;</code> olduğu için sayılar da yazılmaz.'],
        ['res(1,1)', 'Sol üstteki tek pikselin parlaklığını sayı olarak gösterir. Yani resim sadece sayılardan oluşur.'],
        ['figure, imshow(res)', 'Yeni bir çerçeve açar, resmi içine koyar.'],
        ['figure, imshow(res)', 'Bir çerçeve daha açar ve aynı resmi onun içine koyar.']
      ]),
      M(`<p><code>figure</code> olmasaydı ikinci <code>imshow</code>, ilk resmin <strong>üzerine yazılırdı</strong> ve ekranda tek pencere görürdün. Hocanın kodunda iki farklı sonucu ayrı pencerelerde görmek için <code>figure</code> yazılmasının nedeni budur.</p>
<p><strong>Küçük deneme:</strong> Soru 1: Yukarıdaki kod çalışınca kaç resim penceresi açılır? → <strong>2</strong> (<code>figure</code> iki kez yazıldı). Soru 2: İlk satırdan sonra başka bir şey yazmasaydık resim görünür müydü? → <strong>Hayır</strong>; resim yalnızca okunur ve hafızaya alınır, göstermek için <code>imshow</code> gerekir. (Senin cevabın: "2, görünmezdi, resmi çağırmadan nasıl görünsün", doğru.)</p>`),
      N('not', `<p>Bu sitede <code>cameraman.tif</code> dosyası yok: <code>imread</code> hangi adı yazarsan yaz 256×256'lık, uint8 türünde örnek bir gri resim üretir. Boyut ve tür gerçek MATLAB'daki ile aynıdır; piksel değerleri farklı olabilir.</p>`),

      B('Yeniden anlatım 2: subplot'),
      S('S10', `subplot nedir? <em>("suplot ne")</em>`,
        `<p><code>figure</code> bir çerçeve açar. <code>subplot</code> ise o tek çerçeveyi <strong>küçük bölmelere ayırır</strong>. Böylece birkaç resmi yan yana görebilirsin. Bunu <strong>buzdolabı kapağına mıknatıslarla birkaç fotoğraf yapıştırmak</strong> gibi düşünebilirsin: kapak tek, fotoğraflar birden çok.</p>
<p>Yazımı: <code>subplot(kaç satır, kaç sütun, kaçıncı bölme)</code>. Bölmeler soldan sağa, sonra bir alt satır şeklinde numaralanır; yani iç içe for döngüsünün pikselleri gezme sırasıyla aynıdır. Hocanın kodu iki resmi <code>figure</code> ile iki ayrı pencerede gösteriyor; <code>subplot</code> kullansaydı ikisi tek pencerede yan yana olurdu.</p>`),
      C(`subplot(kaç satır, kaç sütun, kaçıncı bölme)

subplot(2,2,...) çerçeveyi 2 satır, 2 sütuna böler:
┌─────┬─────┐
│  1  │  2  │
├─────┼─────┤
│  3  │  4  │
└─────┴─────┘`),
      K(`res = imread("cameraman.tif");
figure
subplot(1,2,1), imshow(res)
subplot(1,2,2), imshow(255 - res)`),
      SS([
        ['res = imread("cameraman.tif");', 'Resmi okur.'],
        ['figure', 'Tek bir boş çerçeve açar.'],
        ['subplot(1,2,1), imshow(res)', 'Çerçeveyi 1 satır, 2 sütuna böler, 1. bölmeyi (sol taraf) seçer ve orijinal resmi oraya koyar.'],
        ['subplot(1,2,2), imshow(255 - res)', 'Aynı bölmelerden 2. bölmeyi (sağ taraf) seçer ve resmin <strong>negatifini</strong> koyar. Burada 0 olan piksel 255 olur, 255 olan 0 olur.']
      ]),
      C(`Tek pencere, iki resim yan yana:
┌──────────┬──────────┐
│ orijinal │ negatif  │
└──────────┴──────────┘`),

      B('figure ile subplot karşılaştırması'),
      S('S11', `Hocanın iki resmini subplot ile tek pencerede yan yana gösteren hâlini de yazar mısın? <em>("...subplot kullansaydı ikisi tek pencerede yan yana olurdu. bunu yapsana bide")</em>`,
        `<p>İki yazım aşağıda yan yana karşılaştırıldı: (1) hocanın yazımı <code>figure</code> iki kez → iki ayrı pencere; (2) <code>figure</code> + <code>subplot(1,2,1)</code> / <code>subplot(1,2,2)</code> → tek pencerede yan yana. Çizimler ve özet tablo hemen altta.</p>`),
      M(`<p><strong>1. Hocanın yazımı: figure ile iki ayrı pencere</strong></p>`),
      KX(`figure, imshow(uint8(medyanli))
figure, imshow(uint8(ortalama))`),
      M(`<ul><li><code>figure</code>: 1. pencereyi açar. <code>imshow</code> medyanlı resmi içine koyar.</li><li><code>figure</code>: Yeni bir pencere açar, yani 2. pencere. <code>imshow</code> ortalamalı resmi içine koyar.</li></ul><p>Ekranda iki ayrı pencere açılır, genellikle biri diğerinin üstünde durur. Karşılaştırmak için pencereleri sürükleyip yan yana koyman gerekir.</p>`),
      C(`┌──────────────┐ ┌──────────────┐
│   Figure 1   │ │   Figure 2   │
│              │ │              │
│   medyanlı   │ │  ortalamalı  │
│              │ │              │
└──────────────┘ └──────────────┘`),
      M(`<p><strong>2. subplot ile tek pencerede yan yana</strong></p>`),
      KX(`figure
subplot(1,2,1), imshow(uint8(medyanli))
subplot(1,2,2), imshow(uint8(ortalama))`),
      M(`<ul><li><code>figure</code>: Tek bir pencere açar.</li><li><code>subplot(1,2,1)</code>: Pencereyi 1 satır, 2 sütuna böler, sol bölmeyi seçer. <code>imshow</code> medyanlı resmi oraya koyar.</li><li><code>subplot(1,2,2)</code>: Aynı pencerede sağ bölmeyi seçer. <code>imshow</code> ortalamalı resmi oraya koyar.</li></ul><p>İki resim hemen yan yana görünür, bu da farkı kolayca görmeni sağlar.</p>`),
      C(`┌─────────────────────────────┐
│           Figure 1          │
│ ┌────────────┬────────────┐ │
│ │  medyanlı  │ ortalamalı │ │
│ └────────────┴────────────┘ │
└─────────────────────────────┘`),
      T(['', 'figure iki kez', 'figure + subplot'], [
        ['Kaç pencere?', '2', '1'],
        ['Resimler nerede?', 'Ayrı pencerelerde', 'Aynı pencerede yan yana']
      ]),
      H('H29', 'Yalnızca son satırları çalıştırmak (tanımsız değişken)',
        `Sadece <code>subplot(1,2,1), imshow(uint8(medyanli))</code> satırlarını çalıştırmak → <code>Unrecognized function or variable 'medyanli'.</code>`,
        `Önce <code>medyanli</code> ve <code>ortalama</code>'yı oluşturan döngüler çalışmalı: kodun <strong>tamamı</strong> script dosyasına yapıştırılıp çalıştırılır (aşağıda).`,
        `Hafızada <code>medyanli</code> diye bir şey yoktu, çünkü onu oluşturan for döngüleri çalışmamıştı. "Tarifin son adımını yapıp önceki adımları atlamak gibi."`),
      S('S12', `Kodu çalıştırınca <code>Unrecognized function or variable 'medyanli'</code> hatası verdi; neden, ne yapmalıyım? <em>("...dedi anlamadım bişe")</em>`,
        `<p>Bu hatayı Konu 2'de görmüştük: <code>piksel</code> değişkenini sildikten sonra sorduğumuzda aynı mesaj görülmüştü. Mesaj, "<strong>medyanli diye bir şey tanımıyorum</strong>" demek.</p>
<p><strong>Neden çıktı?</strong> Gösterilen iki satır hocanın kodunun sadece son kısmıydı. <code>medyanli</code> matrisini oluşturan kısım, yani for döngüleri, ondan önce gelir. Yalnızca son satırları çalıştırdığın için MATLAB'ın hafızasında <code>medyanli</code> yoktu. Tarifin son adımını yapıp önceki adımları atlamak gibi oldu.</p>
<p><strong>Çözüm:</strong> Önce <code>medyanli</code> ve <code>ortalama</code> oluşturulmalı. Aşağıdaki kodun tamamını bir script dosyasına yapıştırıp çalıştır. Bu, hocanın kodunun aynısı; tek fark, son iki satırda <code>subplot</code> kullanılması. Döngü 254 × 254 = <strong>64.516 tur</strong> döndüğü için çalışması birkaç saniye sürebilir, bu normal.</p>
<p>Çalışınca tek pencerede iki resim görürsün. <strong>Medyanlı resimde siyah-beyaz noktalar neredeyse yok olur. Ortalamalı resimde ise noktalar silinmez, gri lekelere dönüşür ve resim biraz bulanıklaşır.</strong></p>`),
      K(`clc; clear all; close all;

res = imread("cameraman.tif");
J = imnoise(res,'salt & pepper', 0.02);
[w,h] = size(J);
for i = 1:w-2
    for j = 1:h-2
        blok = J(i:i+2,j:j+2);
        medyanli(i,j) = median(blok(:));
        ortalama(i,j) = mean(blok(:));
    end
end

figure
subplot(1,2,1), imshow(uint8(medyanli))
subplot(1,2,2), imshow(uint8(ortalama))`),
      M(`<p>"Kod çalıştı mı, iki resim arasında ne fark gördün?" sorusuna cevabın: "<em>resim blurlu gibi oldu</em>". <strong>Doğru gözlem.</strong> Ortalama, parazit noktaları komşularıyla karıştırıp yaydığı için resim bulanıklaşır. Medyan ise parazit noktaları atar ve <strong>kenarları korur</strong>.</p>`),

      B('subplot(2,3,5) adım adım'),
      S('S13', `<code>subplot(2,3,5)</code> hangi bölmeyi seçer, bilmiyorum. <em>("resim blurlu gbi oldu, 2- iblmiyorum")</em>`,
        `<p><strong>1. adım:</strong> Önce ilk iki sayıya bak. <code>subplot(2,3,...)</code> çerçeveyi 2 satır, 3 sütuna böler, yani 6 bölme olur.</p>
<p><strong>2. adım:</strong> Bölmeleri numarala. Soldan sağa, satır bitince bir alt satıra geç. <strong>Kitap okur gibi</strong> düşün: üst satır 1 2 3, alt satır 4 5 6.</p>
<p><strong>3. adım:</strong> Son sayıyı bul. <code>subplot(2,3,5)</code> içindeki son sayı 5. Yani 5 numaralı bölme: <strong>2. satır, 2. sütun</strong> (ortada aşağıda).</p>`),
      C(`┌─────┬─────┬─────┐
│  1  │  2  │  3  │
├─────┼─────┼─────┤
│  4  │ [5] │  6  │
└─────┴─────┴─────┘`),
      H('H26', 'Alt satırı aynı numarayla başlatmak',
        `Alt satır <code>3, 4, 5</code>; 5 numara "sağ en altta"`,
        `Alt satır <code>4 5 6</code>; 5 numara <strong>2. satır, 2. sütun</strong> (orta alt)`,
        `Üst satırın son kutusunda zaten 3 var. Her kutunun kendi numarası olur, aynı numara iki kutuya verilmez. Alt satır, 3'ten sonraki sayıyla başlar.`),

      B('Üç resim yan yana'),
      M(`<p>Gürültülü resim <code>J</code>'yi de ekleyelim: solda J, ortada medyanlı, sağda ortalamalı. Kendine şu iki soruyu sor: <strong>Kaç satır, kaç sütun gerekiyor? Her resim kaç numaralı bölmeye gidiyor?</strong> <code>J</code> zaten uint8 olduğu için <code>imshow(J)</code> yazman yeterli.</p>`),
      C(`┌──────────┬──────────┬────────────┐
│    J     │ medyanlı │ ortalamalı │
└──────────┴──────────┴────────────┘`),
      S('S14', `Üç resmi tek pencerede yan yana gösteren kodu nasıl yazacağımı anlamadım. <em>("anlamadım ki")</em>`,
        `<p><strong>1. adım: Kaç satır, kaç sütun?</strong> Çizimde 1 satır, 3 sütun var. Yani her satır <code>subplot(1,3,...)</code> ile başlar. İki resimli kodda bu kısım <code>subplot(1,2,...)</code> idi; sadece 2 yerine 3 yazıyoruz.</p>
<p><strong>2. adım: Bölmelere numara ver.</strong> J 1 numaralı bölmeye, medyanlı resim 2 numaraya, ortalamalı resim 3 numaraya gider.</p>
<p><strong>3. adım: Boşlukları doldur.</strong> <code>subplot(1,3,__), imshow(J)</code> / <code>subplot(1,3,__), imshow(uint8(medyanli))</code> / <code>subplot(1,3,__), imshow(uint8(ortalama))</code> → cevap <strong>1, 2, 3</strong>.</p>`),
      KX(`figure
subplot(1,3,1), imshow(J)
subplot(1,3,2), imshow(uint8(medyanli))
subplot(1,3,3), imshow(uint8(ortalama))`),
      M(`<p>Script dosyasındaki son satırların yerine koyarsan üç resmi yan yana görürsün.</p>`),

      B('Yeniden anlatım 3: imshow(X,[]) ne işe yarar?'),
      M(`<p><code>imshow</code>, resmin <strong>türüne göre</strong> farklı bir ölçek kullanır:</p>`),
      T(['Tür', 'Siyah', 'Beyaz'], [['uint8', '0', '255'], ['double', '0', '1']]),
      M(`<p>Normal yazdığın sayılar double türündedir. Bu yüzden <code>imshow</code>, 1'in üstündeki her sayıyı beyaz gösterir.</p>`),
      K(`B = [10 20; 30 40];
figure, imshow(B)
figure, imshow(B,[])`),
      SS([
        ['B = [10 20; 30 40];', 'Bu sayılar double türünde.'],
        ['figure, imshow(B)', 'Ölçek 0–1 olduğu için 10, 20, 30 ve 40 sayılarının hepsi 1\'den büyüktür. Dört piksel de beyaz görünür.'],
        ['figure, imshow(B,[])', 'Boş köşeli parantez, "<strong>ölçeği kendin bul</strong>" demektir. MATLAB matrisin içine bakar: en küçük sayı 10 → siyah, en büyük sayı 40 → beyaz, aradaki 20 ve 30 → gri tonlar (20 koyu gri, 30 açık gri).']
      ]),
      C(`imshow(B)          imshow(B,[])
┌──────┬──────┐    ┌──────┬──────┐
│beyaz │beyaz │    │siyah │ koyu │
├──────┼──────┤    ├──────┼──────┤
│beyaz │beyaz │    │ açık │beyaz │
└──────┴──────┘    └──────┴──────┘`),
      N('baglanti', `<p>Sohbetteki anlatım: "<code>medyanli</code> ve <code>ortalama</code> matrisleri double türünde. Hoca bu sorunu <code>uint8(...)</code> ile çözüyor. <code>imshow(ortalama,[])</code> yazsaydı da resim düzgün görünürdü."</p>`),
      N('not', `<p><strong>İnce ayrıntı:</strong> Gerçek MATLAB'da hocanın kodunda <code>J</code> uint8 olduğu için <code>median</code> sonucu da uint8 çıkar; yani <code>medyanli</code> aslında <strong>uint8</strong>, <code>ortalama</code> ise <strong>double</strong> olur (<code>mean</code> hep double verir). <code>uint8(medyanli)</code> zararsız ama gereksizdir; asıl gerekli olan <code>uint8(ortalama)</code>'dır. Ayrıca ilk örnekteki <code>imshow(koyu)</code> "neredeyse" bembeyazdır: 0 ile 1 arasında kalan birkaç çok koyu piksel gri görünür.</p>`),
      M(`<p><strong>Sıra sende:</strong> <code>C = [0 50 100];</code> için a) <code>imshow(C)</code> nasıl görünür? → 0 siyah; 50 ve 100, 1'den büyük olduğu için beyaz: <strong>siyah, beyaz, beyaz</strong>. b) <code>imshow(C,[])</code>? → 0 en küçük: siyah; 100 en büyük: beyaz; 50 arada: gri → <strong>siyah, gri, beyaz</strong>.</p>`),
      H('H27', 'imshow(C,[]) sonucunu belirsiz söylemek',
        `"a- siyah beyaz beyaz olur, diğerinde siyahın tonu açılır"`,
        `a) siyah, beyaz, beyaz. b) 0 → <strong>siyah</strong>, 50 → <strong>gri</strong>, 100 → <strong>beyaz</strong>`,
        `Yön doğru (bir piksel artık gri olur), ama her pikselin tam olarak ne olduğu yazılmalı. <code>[]</code> yazınca MATLAB iki şeye bakar: en küçük sayı hangisi (siyah olur), en büyük sayı hangisi (beyaz olur); kalan sayı arada olduğu için gri olur.`),
      H('H28', 'Beyazın her zaman 255 olduğunu sanmak',
        `<code>imshow(X,[])</code>'de de beyaz = 255 varsaymak`,
        `<code>[]</code> ile beyaz, <strong>matristeki en büyük sayıdır</strong>; siyah da en küçük sayıdır.`,
        `Ölçek <code>[]</code> ile her resimde o resmin kendi sayılarına göre ayarlanır. <code>[10 20; 30 40]</code> matrisinde beyaz 40'tır; 255 hiç yoktur.`),
      S('S15', `Yani <code>imshow(X,[])</code> yazınca beyaz 255 değil de matristeki en büyük sayı mı oluyor? <em>("heeee yani 255 değil de o şeydeki en büyükmü beyaz")</em>`,
        `<p>Evet, aynen öyle. <code>[]</code> yazınca 255 değil, <strong>matristeki en büyük sayı beyaz</strong> olur. En küçük sayı da siyah olur. Yani ölçek her resimde o resmin kendi sayılarına göre ayarlanır.</p><p>Örneğin <code>[10 20; 30 40]</code> matrisinde beyaz 40 olur. Başka bir matriste ise en büyük sayı neyse beyaz o olur. <code>C = [0 50 100]</code> için: 0 → siyah, 50 → gri, 100 → beyaz.</p>`),
      M(`<p>Böylece 13 konunun hepsi bitti. <code>plot</code> hocanın kodunda geçmediği için sohbette ayrıca çalışılmadı; bu sitede "plot" başlıklı ayrı bir konu olarak sıfırdan anlatılıyor.</p>`),
      O([
        '<code>imread("dosya")</code> resmi sayı tablosuna çevirir (ekranda bir şey görünmez); <code>imshow(X)</code> gösterir.',
        '<code>figure</code> yeni pencere açar; yazılmazsa yeni resim eskisinin üzerine yazılır.',
        '<code>subplot(satır, sütun, sıra)</code> tek pencereyi bölmelere ayırır; numaralama kitap okur gibi (soldan sağa, sonra alt satır).',
        'Virgül iki komutu aynı satıra yazdırır: <code>figure, imshow(res)</code>.',
        '<code>imshow</code>: uint8\'de 0 siyah–255 beyaz; double\'da 0 siyah–1 beyaz.',
        '<code>imshow(X,[])</code>: en küçük sayı siyah, en büyük sayı beyaz (255 olmak zorunda değil).',
        '<code>Unrecognized function or variable</code> hatası: o değişkeni oluşturan satırlar çalışmamış demektir.'
      ])
    ]
  });

  /* ================================================================== hoca-kodu */
  veri.push({
    id: 'hoca-kodu', no: 14, baslik: 'Hocanın kodu satır satır',
    kisa: 'Resmi oku, tuz-biber gürültüsü ekle, 3×3 pencereyle gez, medyan ve ortalama filtresini uygula, iki sonucu göster.',
    yeni: false,
    bloklar: [
      M(`<p>Hedef kod bu. 13 konunun hepsi bu 12 satırı okuyabilmek içindi:</p>`),
      KA('Hocanın kodu (özgün hâli)', HOCA_KODU),
      N('not', `<p><strong>İnce ayrıntı:</strong> Sohbette "hocanın 11 satırlık kodu" denmişti; say bakalım, kod <strong>12 satır</strong>.</p>`),
      T(['Kodda geçen', 'Hangi konu?'], [
        ['<code>imread</code>, <code>figure</code>, <code>imshow</code>, virgül', 'Konu 13'],
        ['Kutuya koyma (<code>=</code>), <code>w-2</code>, <code>i+2</code>', 'Konu 3'],
        ['Satır sonundaki <code>;</code>', 'Konu 1'],
        ['<code>[w,h]=size(J)</code>', 'Konu 6'],
        ['<code>J(i:i+2,j:j+2)</code>, <code>blok(:)</code>', 'Konu 5'],
        ['<code>median</code>, <code>mean</code>', 'Konu 8'],
        ['<code>for</code> ve iç içe <code>for</code>', 'Konu 11'],
        ['<code>uint8(...)</code>', 'Konu 12']
      ]),

      B('1. bölüm: resmi hazırlayan satırlar'),
      KX(`res=imread("cameraman.tif");
J = imnoise(res,'salt & pepper', 0.02);
[w,h]=size(J);`),
      M(`<p><strong>1. satır: <code>res=imread("cameraman.tif");</code></strong></p>
<ul><li><code>imread</code>, <code>cameraman.tif</code> dosyasını okuyup sayı tablosuna çevirir. (Konu 13)</li>
<li>Tablo <code>res</code> kutusuna konur. (Konu 3)</li>
<li><code>res</code>, 256×256'lık ve uint8 türünde bir matristir. Her eleman 0–255 arası bir pikseldir. (Konu 12)</li>
<li>Sondaki <code>;</code> olmasaydı 65.536 sayı ekrana dökülürdü. (Konu 1)</li></ul>
<p><strong>2. satır: <code>J = imnoise(res,'salt &amp; pepper', 0.02);</code></strong></p>
<p>Bu komut derslerde yoktu, çünkü görevi kısa: <code>imnoise</code>, resme <strong>gürültü ekler</strong>. Yani resmi bilerek bozar, böylece sonra temizlemeyi deneyebiliriz.</p>`),
      T(['Parça', 'Anlamı'], [
        ['<code>res</code>', 'Bozulacak resim'],
        ['<code>\'salt &amp; pepper\'</code>', 'Gürültü türü: "tuz ve biber". Rastgele pikseller ya bembeyaz (255, tuz) ya simsiyah (0, biber) olur'],
        ['<code>0.02</code>', 'Piksellerin yüzde 2\'si bozulur']
      ]),
      M(`<p><strong>Hesaplayalım:</strong> 65.536 pikselin yüzde 2'si yaklaşık <strong>1.300 pikseldir</strong> (65.536 × 0.02 = 1.310,72). Yani resme 1.300 civarı siyah-beyaz nokta serpilir. Sonuç <code>J</code> kutusuna konur, <strong><code>res</code> ise değişmeden kalır</strong>.</p>
<p><strong>3. satır: <code>[w,h]=size(J);</code></strong></p>
<ul><li><code>J</code>'nin boyutunu iki ayrı kutuya alır. (Konu 6)</li><li><code>w = 256</code> olur (satır sayısı), <code>h = 256</code> olur (sütun sayısı).</li><li>Bu iki sayı, bir sonraki parçadaki döngülerde kullanılacak.</li></ul>`),
      N('not', `<p>Gürültü <strong>rastgeledir</strong>: her çalıştırmada başka pikseller bozulur, sayı da tam 1.310 değil "o civarda" olur. Tırnak içindeki yazı aynen böyle yazılmalıdır: <code>'salt &amp; pepper'</code> (tek tırnak, aralarda boşluk).</p>`),
      B('1. bölüm soruları: 0.02 yerine 0.10 ve gürültü kontrolü'),
      M(`<p><strong>Soru 1:</strong> <code>0.02</code> yerine <code>0.10</code> yazsaydık resim nasıl değişirdi? Yaklaşık kaç piksel bozulurdu? → Resim daha fazla kirlenir; 65.536 × 0.10 ≈ <strong>6.550 piksel</strong> bozulur, yani <strong>5 kat</strong> daha fazla nokta (0.10 / 0.02 = 5). İpucu: 0.10 yüzde 10 demektir, yani sayının onda biri.</p>`),
      H('H30', 'Sorunun sayı kısmını cevapsız bırakmak',
        `"daha fazla kirlenirdi resim." (kaç piksel? yok)`,
        `Daha fazla kirlenir <strong>ve</strong> yaklaşık 6.550 piksel bozulur (65.536 × 0.10); 0.02'ye göre 5 kat.`,
        `Soruda iki şey soruluyordu: nasıl değişir <em>ve</em> yaklaşık kaç piksel. 0.02 için 65.536 × 0.02 ≈ 1.300 yapılmıştı; 0.10 için aynı çarpma: sayının onda biri.`),
      S('S16', `0.10 için piksel sayısı hesabını geçelim; kısa not olarak değinmen yeterli. <em>("o matematik hesabını geç ya kısa not olaak değindin yeter")</em>`,
        `<p>Tamam, geçiyoruz. Kısa not olarak: <code>0.10</code> yazınca yaklaşık <strong>6.550 piksel</strong> bozulur, yani <strong>5 kat</strong> daha fazla nokta olur.</p>`),
      M(`<p><strong>Soru 2:</strong> <code>p</code> adlı bir pikselin değeri 0 veya 255 ise <code>gurultu = 1</code> olsun, değilse <code>gurultu = 0</code> olsun (Konu 9 ve 10). Kabul edilen cevap, senin adlandırmanla:</p>`),
      KA('1. bölüm sorusu: piksel gürültü mü? (if ve ||)', `p = 255;
if p==0 || p==255
    g=1
else
    g=0
end`, `g =
     1`),
      H('H31', 'end yine eksik',
        `<pre><code>if p==0 || p==255
g=1
else
g=0</code></pre>`,
        `Aynı kod + son satırda <code>end</code>`,
        `Koşul (<code>==</code>, <code>||</code>) ve <code>else</code> doğruydu; bir satır eksikti. <code>end</code> zorunludur. Bu hata Konu 10'da da yapılmıştı: if yazınca hemen altına <code>end</code> yazıp arasını sonra doldurmak iyi bir alışkanlıktır.`),
      H('H32', 'end yerine edn yazmak',
        `<code>edn</code>`,
        `<code>end</code>`,
        `MATLAB yanlış yazılmış kelimeyi tanımaz ve hata verir. Harf sırası: e-n-d.`),
      H('H34', 'Farklı değişken adı ve ; koymamak (hata değil)',
        `<code>g=1</code> / <code>g=0</code> (<code>gurultu</code> yerine <code>g</code>, sonda <code>;</code> yok)`,
        `İkisi de çalışır. Soruda istenen ad <code>gurultu</code> idi.`,
        `İsim senin seçimin, MATLAB için fark etmez; ama sınavda soru bir ad veriyorsa onu kullan. <code>;</code> koymazsan sonuç sadece ekrana yazılır, hata çıkmaz.`),
      S('S17', `Eksik olan sadece <code>end</code>, değil mi? <code>;</code> koymazsam sonuç ekrana yazılır, sorun olmaz mı? <em>("edn yazcam sadece, sonuç ekrana yazılabilir")</em>`,
        `<p>Evet, eksik olan <code>end</code>. Sadece yazımına dikkat et: <strong><code>edn</code> değil <code>end</code></strong>. MATLAB yanlış yazılmış kelimeyi tanımaz ve hata verir.</p><p><code>;</code> konusunda da haklısın. Koymazsan sonuç sadece ekrana yazılır, hata çıkmaz.</p>`),

      B('2. bölüm: döngüler (kodun kalbi)'),
      KX(`for i=1:w-2
    for j=1:h-2
        blok=J(i:i+2,j:j+2);
        medyanli(i,j)=median(blok(:));
        ortalama(i,j)=mean(blok(:));
    end
end`),
      M(`<p><strong>Fikir:</strong> Resmin üzerinde 3×3'lük küçük bir <strong>pencere</strong> gezdiriyoruz. Pencere her durduğunda içindeki 9 pikselin medyanını ve ortalamasını alıp yeni resme yazıyoruz.</p>`),
      SS([
        ['for i=1:w-2', '<code>i</code>, 1\'den 254\'e kadar gider. Pencerenin hangi <strong>satırdan</strong> başlayacağını belirler. (Konu 11)'],
        ['for j=1:h-2', '<code>j</code>, 1\'den 254\'e kadar gider. Pencerenin hangi <strong>sütundan</strong> başlayacağını belirler.'],
        ['blok=J(i:i+2,j:j+2);', '<code>i</code>\'den <code>i+2</code>\'ye satırları, <code>j</code>\'den <code>j+2</code>\'ye sütunları keser. Yani 3×3\'lük bir parça alır. (Konu 5)'],
        ['medyanli(i,j)=median(blok(:));', 'Bloğu tek sıra yapar ve ortancasını alır. Sonucu <code>medyanli</code> matrisinin (i,j) adresine yazar. (Konu 8)'],
        ['ortalama(i,j)=mean(blok(:));', 'Aynı bloğun ortalamasını alır, <code>ortalama</code> matrisine yazar.'],
        ['end', 'Önce iç döngü kapanır.'],
        ['end', 'Sonra dış döngü kapanır.']
      ]),
      B('Pencere nasıl gezer? 5×5\'lik resimde'),
      M(`<p>5×5'lik küçük bir resimde düşünelim. Bu durumda <code>w-2 = 3</code> olur, yani <code>i</code> ve <code>j</code> 1'den 3'e gider:</p>`),
      T(['Adım', 'i', 'j', 'Kesilen parça', 'Sonuç nereye yazılır?'], [
        ['1', '1', '1', 'J(1:3, 1:3)', '(1,1)'],
        ['2', '1', '2', 'J(1:3, 2:4)', '(1,2)'],
        ['3', '1', '3', 'J(1:3, 3:5)', '(1,3)'],
        ['4', '2', '1', 'J(2:4, 1:3)', '(2,1)'],
        ['5', '2', '2', 'J(2:4, 2:4)', '(2,2)'],
        ['6', '2', '3', 'J(2:4, 3:5)', '(2,3)'],
        ['7', '3', '1', 'J(3:5, 1:3)', '(3,1)'],
        ['8', '3', '2', 'J(3:5, 2:4)', '(3,2)'],
        ['9', '3', '3', 'J(3:5, 3:5)', '(3,3)']
      ]),
      C(`Adım 1 (i=1, j=1)      Adım 2 (i=1, j=2)      Adım 4 (i=2, j=1)
[■ ■ ■] · ·            · [■ ■ ■] ·            · · · · ·
[■ ■ ■] · ·            · [■ ■ ■] ·            [■ ■ ■] · ·
[■ ■ ■] · ·            · [■ ■ ■] ·            [■ ■ ■] · ·
 · · ·  · ·            ·  · · ·  ·            [■ ■ ■] · ·
 · · ·  · ·            ·  · · ·  ·            · · · · ·`),
      M(`<p>Pencere bir sağa kayar, satır bitince bir aşağı iner ve baştan başlar. 3 × 3 = 9 adım sonunda yeni resim 3×3 olur. (Sohbetteki tabloda 5-8. adımlar "..." ile geçilmişti; burada hepsi yazıldı.)</p>
<p><strong>Neden <code>w-2</code>?</strong> 3. adımda pencere <code>3:5</code> sütunlarını alıyor. <code>j</code> 4 olsaydı <code>4:6</code> istenirdi, ama 6. sütun yok ve <strong>hata çıkardı</strong>. Bu yüzden sonuç resmi de 2 satır ve 2 sütun küçük olur: <strong>256×256'dan 254×254</strong>.</p>`),
      B('2. bölüm soruları: 5×5 resimde blok ve medyan'),
      C(`J =
    10    20    30    40    50
    60   255    70    80    90
   100   110     0   120   130
   140   150   160   170   180
   190   200   210   220   230`),
      M(`<p><strong>Soru 1:</strong> <code>i=1, j=2</code> iken <code>blok</code> hangi 9 sayıdan oluşur? → <code>J(1:3, 2:4)</code>:</p>`),
      C(` 20    30    40
255    70    80
110     0   120`),
      M(`<p>Bu blokta iki parazit var: 255 (tuz) ve 0 (biber).</p>
<p><strong>Soru 2:</strong> <code>medyanli(1,2)</code> kaç olur? (9 sayıyı küçükten büyüğe sırala, 5.'yi al.) → Sıralayınca <code>0 20 30 40 70 80 110 120 255</code>, 5. sayı <strong>70</strong>.</p>
<p>İki parazit de sıralamanın <strong>en uçlarına</strong> gitti, medyan onları hiç kullanmadı. Aynı bloğun ortalaması ise 725 / 9 ≈ <strong>80.56</strong> olur. 255 ortalamayı yukarı çekti. Gördüğün bulanıklığın sebebi bu.</p>`),
      KA('2. bölüm sorusu: 5×5 resimde blok ve medyan', `J = [10 20 30 40 50; 60 255 70 80 90; 100 110 0 120 130; 140 150 160 170 180; 190 200 210 220 230];
blok = J(1:3, 2:4)
median(blok(:))
mean(blok(:))`, `blok =
    20    30    40
   255    70    80
   110     0   120

ans =
    70

ans =
   80.5556`),
      H('H33', 'Sayıları bitişik yazmak',
        `<code>20304025570801100120</code>`,
        `<code>20 30 40 255 70 80 110 0 120</code>, matris olarak <code>[20 30 40; 255 70 80; 110 0 120]</code>`,
        `İçerik doğruydu ama okunamıyordu. Sayıları ayırırken boşluk bırak. MATLAB'da <code>[20 30]</code> iki sayıdır, <code>[2030]</code> ise tek sayıdır.`),

      B('3. bölüm: gösterme'),
      KX(`figure,imshow(uint8(medyanli))
figure,imshow(uint8(ortalama))`),
      SS([
        ['figure,', 'Yeni pencere açar. Virgül, aynı satırda sıradaki komuta geçirir. (Konu 13)'],
        ['uint8(medyanli)', 'Sohbetteki anlatım: "<code>medyanli</code> matrisi double türünde, ama değerleri 0–255 arasında. uint8 türüne çevrilince ondalıklar yuvarlanır, örneğin 80.56 sayısı 81 olur." (Konu 12; aşağıdaki ince ayrıntıya bak.)'],
        ['imshow(...)', 'Artık türü uint8 olduğu için 0 siyah, 255 beyaz gösterilir.'],
        ['figure,imshow(uint8(ortalama))', 'Aynı işi <code>ortalama</code> matrisi için, ikinci bir pencerede yapar.']
      ]),
      N('not', `<p><strong>İnce ayrıntı (tür konusu):</strong> Gerçek MATLAB'da <code>J</code> uint8 olduğu için <code>median(blok(:))</code> de uint8 verir; <code>medyanli</code> ilk atamada bu türle oluşur, yani <strong><code>medyanli</code> aslında uint8'dir</strong>. <code>mean</code> ise her zaman double verir, yani <strong><code>ortalama</code> double'dır</strong>. Sonuç: <code>uint8(medyanli)</code> zararsız ama gereksizdir; asıl gerekli olan <code>uint8(ortalama)</code>'dır. "80.56 → 81" örneği de aslında <code>ortalama</code> için geçerlidir; 9 elemanlı bloğun medyanı zaten tam sayıdır. (Kağıt alıştırmasında <code>J</code> elle yazıldığı için double'dır; orada ikisi de double olur.)</p>`),
      M(`<p><strong>Soru 1:</strong> <code>uint8</code> yazmadan sadece <code>imshow(ortalama)</code> yazsaydık resim neden neredeyse bembeyaz görünürdü? → Resim double olduğu için <code>imshow</code> 0–1 ölçeğini kullanır ve <strong>1 ile üstündeki her piksel beyaz</strong> görünür.</p>
<p><strong>Soru 2:</strong> 5×5'lik <code>J</code> resminde <code>medyanli</code> kaç satır, kaç sütun olur? → <code>w-2 = 3</code> olduğu için <strong>3×3</strong>.</p>`),
      H('H35', '"0 hariç her şey beyaz" demek (yaklaşık doğru)',
        `"0 olan hariç her şey beyaz olacağı için"`,
        `Resim double olduğu için <code>imshow</code> 0–1 ölçeğini kullanır; <strong>1 ve üstündeki</strong> her piksel beyaz görünür.`,
        `Cevap kabul edilmişti ama kesin ifade şu: double resimde 0 siyah, 1 ve üstü beyaz, <strong>0 ile 1 arası gri</strong>. <code>ortalama</code>'da değerler 0–255 arasında olduğu için pratikte neredeyse her piksel 1'den büyüktür.`),

      B('Çalıştırılabilir tam script'),
      M(`<p>Hocanın kodu, başına temizlik satırı eklenmiş hâliyle. Döngü 254 × 254 = 64.516 tur döner; birkaç saniye sürebilir.</p>`),
      KA('Tam script: clc/clear/close + iki ayrı figure', `clc; clear all; close all;

` + HOCA_KODU),
      N('ipucu', `<p>Baştaki <code>clear all</code> burada gerçekten işe yarar: <code>medyanli</code> döngüde büyütülerek oluşturulduğu için, önceki çalıştırmadan daha büyük bir <code>medyanli</code> kalmışsa eski değerler içinde kalabilir.</p>`),
      M(`<p>Aynı kodun <strong>subplot'lu sürümü</strong>: gürültülü resim, medyanlı ve ortalamalı sonuç tek pencerede yan yana.</p>`),
      KA('Tam script: üç resim tek pencerede (subplot)', `clc; clear all; close all;

res = imread("cameraman.tif");
J = imnoise(res,'salt & pepper', 0.02);
[w,h] = size(J);
for i = 1:w-2
    for j = 1:h-2
        blok = J(i:i+2,j:j+2);
        medyanli(i,j) = median(blok(:));
        ortalama(i,j) = mean(blok(:));
    end
end

figure
subplot(1,3,1), imshow(J)
subplot(1,3,2), imshow(uint8(medyanli))
subplot(1,3,3), imshow(uint8(ortalama))`),
      M(`<p><strong>Ne görürsün?</strong> Medyanlı resimde siyah-beyaz noktalar neredeyse yok olur ve kenarlar korunur. Ortalamalı resimde noktalar silinmez, gri lekelere dönüşür ve resim biraz bulanıklaşır.</p>`),
      O([
        '<code>imread</code> resmi okur (256×256, uint8); <code>imnoise(res,\'salt &amp; pepper\',0.02)</code> piksellerin %2\'sini 0 ya da 255 yapar; <code>res</code> değişmez.',
        '<code>[w,h]=size(J)</code> → 256, 256. Döngüler <code>1:w-2</code> = 1\'den 254\'e gider.',
        '<code>blok=J(i:i+2,j:j+2)</code> 3×3 pencereyi keser; <code>median(blok(:))</code> ve <code>mean(blok(:))</code> sonucu (i,j) adresine yazar.',
        '<code>w-2</code>: pencere resimden taşmasın diye. Sonuç 254×254 olur.',
        'Medyan parazitleri sıralamanın ucuna atar; ortalama onları komşulara yayar (bulanıklık).',
        '<code>uint8(ortalama)</code>: double matrisi 0–255 ölçeğinde göstermek için. <code>figure</code> her resme ayrı pencere açar.',
        '0.02 → yaklaşık 1.300 piksel; 0.10 → yaklaşık 6.550 piksel (5 kat).'
      ])
    ]
  });

  /* ================================================================== kagit */
  const KAGIT_KODU = `clc; clear all; close all;

J = [10 20 30 40; 50 255 60 70; 80 90 0 100; 110 120 130 140];
[w,h]=size(J)
for i=1:w-2
    for j=1:h-2
        blok=J(i:i+2,j:j+2);
        medyanli(i,j)=median(blok(:));
        ortalama(i,j)=mean(blok(:));
    end
end
medyanli`;
  veri.push({
    id: 'kagit', no: 15, baslik: 'Kağıt üzerinde 4×4 uygulama',
    kisa: 'Hocanın kodunu küçük, gürültülü 4×4 resme elle uygula: dört adım, dört blok, 2×2 sonuç.',
    yeni: true,
    bloklar: [
      M(`<p>Son adım: hocanın kodunu bu küçük, gürültülü 4×4'lük resme <strong>kağıt üzerinde sen</strong> uygulayacaksın. Sohbet 1. adımda kalmıştı; 2., 3. ve 4. adımların tam çözümü bu sayfada.</p>`),
      C(`J =
    10    20    30    40
    50   255    60    70
    80    90     0   100
   110   120   130   140`),
      M(`<p>Kağıda şu tabloyu çiz (sayıları yazarken aralarına boşluk koymayı unutma):</p>`),
      T(['Adım', 'i', 'j', 'blok (9 sayı)', 'Sıralanmış hali', 'medyanli(i,j)'], [
        ['1', '', '', '', '', ''], ['2', '', '', '', '', ''], ['3', '', '', '', '', ''], ['4', '', '', '', '', '']
      ]),
      B('Uygulanacak kod'),
      S('S18', `Kağıt alıştırmasında uygulayacağım kodu da verir misin? <em>("uygulayacağım kodu da ver")</em>`,
        `<p>Bu kod, hocanın kodunun aynısı. Sadece <code>imread</code> ve <code>imnoise</code> yerine küçük matris elle yazıldı ve sonucu sayı olarak görebilmek için resim satırları kaldırıldı (kod hemen aşağıda). Değişen satırlar:</p>
<ul><li><code>J = [...]</code>: Resmi dosyadan okumak yerine 4×4 matrisi kendimiz yazdık. Gürültü noktaları (255 ve 0) zaten içinde.</li>
<li><code>[w,h]=size(J)</code>: Sonunda <code>;</code> yok, bu yüzden <code>w</code> ve <code>h</code> ekranda görünür.</li>
<li><code>medyanli</code>: Resim olarak göstermek yerine sayılarını ekrana yazar.</li></ul>
<p><strong>Öneri:</strong> Kodu hemen çalıştırma. Önce tabloyu kağıtta doldur, sonra çalıştırıp kendi sonucunla karşılaştır. Çalıştırırsan cevaplar ekrana gelir ve alıştırmanın faydası kalmaz.</p>`),
      KA('4×4 resimde hocanın kodu', KAGIT_KODU),
      N('not', `<p><strong>İnce ayrıntı:</strong> Burada <code>J</code> elle yazıldığı için <strong>double</strong> türündedir; bu yüzden <code>medyanli</code> da <code>ortalama</code> da double olur. (Hocanın asıl kodunda <code>J</code> uint8 olduğu için <code>medyanli</code> uint8, <code>ortalama</code> double olurdu.)</p>`),
      B('Hazırlık: w, h ve döngü aralıkları'),
      M(`<p><strong>Soru 1:</strong> <code>[w,h]=size(J)</code> için <code>w</code> ve <code>h</code> kaç olur? <code>i</code> ve <code>j</code> hangi sayılar arasında gider? → <code>w = 4</code>, <code>h = 4</code>. <code>1:w-2</code> = <code>1:2</code> olduğu için <code>i</code> ve <code>j</code> 1 ile 2 arasında gider. Yani 2 × 2 = <strong>4 adım</strong> var ve sonuç 2×2 olacak.</p>`),
      N('ipucu', `<p><code>1:w-2</code> yazımında önce çıkarma yapılır, sonra aralık kurulur: <code>1:(4-2)</code> = <code>1:2</code>.</p>`),
      B('1. adım (sohbette yapıldı)'),
      M(`<p><code>i=1</code>, <code>j=1</code> → <code>J(1:3, 1:3)</code>: ilk 3 satır ile ilk 3 sütunun kesişimi.</p>`),
      C(`blok =                 blok(:) → 10 50 80 20 255 90 30 60 0
    10    20    30     sıralı  →  0 10 20 30 [50] 60 80 90 255
    50   255    60     medyan  = 50   (5. sayı)
    80    90     0`),
      H('H36', 'Blok ve sıralı hâli sayılarla yazmamak',
        `"1. adım için sırayla = 1,1, ilk 3 satır ve ilk 3 sütun kesişimi, o kesişimin küçükten büyüğe sıralanmış hali. 50"`,
        `blok = <code>10 20 30; 50 255 60; 80 90 0</code> · sıralı: <code>0 10 20 30 50 60 80 90 255</code> · medyan <strong>50</strong>`,
        `Sonuç doğruydu, yani sıralamayı yaptığın belli; ama tabloda blok ve sıralı hâl <strong>sayılarla</strong> isteniyordu. Sınavda işlem adımları puan getirir; tarif etmek yerine sayıları yaz.`),
      B('2., 3. ve 4. adımların tam çözümü', true),
      M(`<p><strong>Hatırlatma:</strong> Önce <code>j</code> artar, <code>i</code> sabit kalır. <code>j</code> bitince <code>i</code> bir artar ve <code>j</code> başa döner.</p>
<p><strong>2. adım:</strong> <code>i=1</code>, <code>j=2</code> → <code>J(1:3, 2:4)</code> (pencere bir sağa kaydı).</p>`),
      C(`blok =                 blok(:) → 20 255 90 30 60 0 40 70 100
    20    30    40     sıralı  →  0 20 30 40 [60] 70 90 100 255
   255    60    70     medyan  = 60
    90     0   100     toplam  = 665 → ortalama = 665 / 9 = 73.8889`),
      M(`<p><strong>3. adım:</strong> <code>j</code> bitti (aralığı 1:2 idi). <code>i</code> bir artar, <code>j</code> başa döner: <code>i=2</code>, <code>j=1</code> → <code>J(2:4, 1:3)</code> (pencere bir aşağı indi, sola döndü).</p>`),
      C(`blok =                 blok(:) → 50 80 110 255 90 120 60 0 130
    50   255    60     sıralı  →  0 50 60 80 [90] 110 120 130 255
    80    90     0     medyan  = 90
   110   120   130     toplam  = 895 → ortalama = 895 / 9 = 99.4444`),
      M(`<p><strong>4. adım:</strong> <code>i=2</code>, <code>j=2</code> → <code>J(2:4, 2:4)</code>.</p>`),
      C(`blok =                 blok(:) → 255 90 120 60 0 130 70 100 140
   255    60    70     sıralı  →  0 60 70 90 [100] 120 130 140 255
    90     0   100     medyan  = 100
   120   130   140     toplam  = 965 → ortalama = 965 / 9 = 107.2222`),
      B('Adım adım tablo (tamamı)', true),
      T(['Adım', 'i', 'j', 'Kesilen parça', 'Sıralı hâli', 'Medyan', 'Toplam', 'Ortalama'], [
        ['1', '1', '1', 'J(1:3, 1:3)', '0 10 20 30 <strong>50</strong> 60 80 90 255', '<strong>50</strong>', '595', '66.1111'],
        ['2', '1', '2', 'J(1:3, 2:4)', '0 20 30 40 <strong>60</strong> 70 90 100 255', '<strong>60</strong>', '665', '73.8889'],
        ['3', '2', '1', 'J(2:4, 1:3)', '0 50 60 80 <strong>90</strong> 110 120 130 255', '<strong>90</strong>', '895', '99.4444'],
        ['4', '2', '2', 'J(2:4, 2:4)', '0 60 70 90 <strong>100</strong> 120 130 140 255', '<strong>100</strong>', '965', '107.2222']
      ]),
      M(`<p>Dört sonuç, bulundukları <code>(i,j)</code> adreslerine yazılınca:</p>`),
      C(`medyanli =              ortalama =                    uint8(ortalama) =
    50    60               66.1111    73.8889             66    74
    90   100               99.4444   107.2222             99   107`),
      M(`<p><strong>Gözlem:</strong> Her blokta iki parazit (255 ve 0) var; medyan ikisini de sıralamanın uçlarına attı ve hiç kullanmadı. Bu örnekte 0 ve 255 ortalamayı ters yönlere çektiği için ortalama ile medyan farkı görece küçük kaldı (ör. 66.11'e karşı 50). Şimdi kodu çalıştırıp kendi kağıdınla karşılaştır; sonuna <code>ortalama</code> satırı eklenmiş hâli:</p>`),
      KA('4×4 resimde hocanın kodu + uint8(ortalama)', KAGIT_KODU + `
ortalama
uint8(ortalama)`, `w =
     4

h =
     4

medyanli =
    50    60
    90   100

ortalama =
   66.1111   73.8889
   99.4444  107.2222

ans =
  2×2 uint8 matrix
   66   74
   99  107`),
      S('S19', `Bundan sonra yapacağımız bir şey kaldı mı? <em>("bundna sonra yapacağımız bir şey kaldımı")</em>`,
        `<p>Çok az kaldı. Planlanan her şey bitti, geriye sadece bu kağıt alıştırmasının 2., 3. ve 4. adımları kaldı. Bu da başta konan hedefin son parçası; bunu bitirince hocanın kodunda yeni bir şey kalmayacak. Vize öncesi faydalı olabilecekler:</p>
<ul><li><strong>Karışık tekrar soruları:</strong> Bütün konulardan, sınav sorusu tarzında kısa sorular. (Bu sitede: Tekrar modu.)</li>
<li><strong>Kodda değişiklik:</strong> Örneğin 3×3 yerine 5×5'lik pencere için hangi satırların değişmesi gerektiği. Hocalar sınavda bu tür sorular sorabiliyor. (Bu sitede: "Kodda değişiklik" konusu.)</li>
<li><strong>Hocanın başka kodları:</strong> Başka görüntü işleme kodları satır satır çözülebilir. (Bu sitede: "Benzer kodlar" konusu.)</li></ul>
<p>Sohbetin son sorusu cevapsız kalmıştı: "2. adımda i ve j kaç olur, hangi parça kesilir ve medyan kaç çıkar?" → <code>i=1</code>, <code>j=2</code>, <code>J(1:3, 2:4)</code>, medyan <strong>60</strong>.</p>`),
      O([
        '4×4 resimde <code>w=4</code>, <code>h=4</code>; <code>i</code> ve <code>j</code> 1\'den 2\'ye gider → 4 adım, sonuç 2×2.',
        'Sıra: (1,1) → (1,2) → (2,1) → (2,2). Önce <code>j</code> artar.',
        'Her adım: bloğu kes → 9 sayıyı sırala → 5. sayı medyan; toplam / 9 ortalama.',
        '<code>medyanli = [50 60; 90 100]</code>, <code>ortalama = [66.1111 73.8889; 99.4444 107.2222]</code>.',
        'Sayıları tarif etme, boşluklarla ayırarak yaz.'
      ])
    ]
  });

  /* ================================================================== yeni-plot */
  veri.push({
    id: 'yeni-plot', no: 16, baslik: 'plot: çizgi grafiği',
    kisa: 'Sayıları çizgi grafiğine dökmek: plot(y), plot(x,y), bir resim satırının parlaklık profili.',
    yeni: true,
    bloklar: [
      M(`<p>Sohbette <code>plot</code> için yalnızca tek cümle ("sayıları çizgi grafiği olarak çizer") ve tek örnek (<code>figure, plot(res(100,:))</code>) vardı; hiç soru çözülmedi. Burada sıfırdan anlatılıyor.</p>
<p><code>imshow</code> sayıları <strong>resim</strong> olarak gösterir; <code>plot</code> ise aynı sayıları <strong>çizgi grafiği</strong> olarak gösterir. Benzetme: hastanedeki ateş çizelgesi. Her ölçüm bir noktadır, noktalar çizgiyle birleştirilir; çizgi yukarı çıkıyorsa değer büyüyor demektir.</p>`),
      B('plot(y): tek liste vermek', true),
      K(`y = [10 50 30 80];
figure, plot(y)`),
      M(`<p>Tek bir liste verince MATLAB yatay ekseni kendisi koyar: <strong>1, 2, 3, 4</strong> (sıra numarası). Dikey eksen ise sayının kendisidir. Yani şu dört nokta işaretlenir ve çizgiyle birleştirilir:</p>`),
      T(['Nokta', 'Yatay (sıra)', 'Dikey (değer)'], [['1.', '1', '10'], ['2.', '2', '50'], ['3.', '3', '30'], ['4.', '4', '80']]),
      C(`değer
 80 |                 *
    |                /
 50 |      *        /
    |     / \\      /
 30 |    /    \\ * /
    |   /
 10 | *
    +--+-----+-----+-----+--  sıra
       1     2     3     4`.replace(/\\\\/g, '\\')),
      B('plot(x,y): yatay ekseni kendin vermek', true),
      M(`<p>İki liste verirsen birincisi <strong>yatay</strong>, ikincisi <strong>dikey</strong> eksendir. İki listenin eleman sayısı <strong>aynı</strong> olmalıdır; yoksa hata çıkar.</p>`),
      K(`x = [0 10 20 30];
y = [5 15 10 40];
figure, plot(x,y)
title('Ornek grafik')`),
      SS([
        ['x = [0 10 20 30];', 'Yatay eksendeki yerler.'],
        ['y = [5 15 10 40];', 'Her yerin dikey değeri. Noktalar: (0,5), (10,15), (20,10), (30,40).'],
        ['figure, plot(x,y)', 'Yeni pencere açar, noktaları sırayla çizgiyle birleştirir.'],
        ['title(\'Ornek grafik\')', 'Grafiğin üstüne başlık yazar. Yazı tek tırnak içinde verilir.']
      ]),
      N('dikkat', `<p>En sık karışan şey: <code>plot(y)</code> yazınca yatay eksen değer <strong>değil</strong>, sıra numarasıdır. <code>plot(x,y)</code>'de sıra önemlidir: önce yatay, sonra dikey.</p>`),
      B('Resimle bağlantısı: bir satırın parlaklık profili', true),
      M(`<p><code>res(100,:)</code> resmin 100. satırının tüm sütunlarıdır: 256 sayılık bir liste (Konu 5). Bunu <code>plot</code>'a verirsen o satır boyunca parlaklığın nasıl değiştiğini görürsün. <strong>Yatay eksen sütun numarası (1–256), dikey eksen parlaklık (0–255).</strong></p>`),
      K(`res = imread("cameraman.tif");
satir = res(100,:);
figure, plot(satir)
title('100. satirin parlaklik profili')`),
      M(`<p>Küçük bir örnekle: <code>satir = [10 10 200 200 10]</code> olsaydı grafik önce altta düz gider, 3. sütunda birden yukarı fırlar, 5. sütunda geri inerdi. Grafikteki <strong>ani sıçrama, resimde bir kenar</strong> demektir (koyudan açığa geçiş).</p>
<p>Tek sütunu çizmek için <code>plot(res(:,50))</code>, yani 50. sütunun tüm satırları.</p>`),
      B('Gürültülü ve filtrelenmiş satırın grafiği', true),
      M(`<p>Tuz-biber gürültüsü grafikte çok net görünür: tuz 255'e fırlayan, biber 0'a düşen <strong>sivri dikenler</strong> yapar. Medyan filtresinden sonra dikenler kaybolur.</p>`),
      K(`satir = [50 52 255 54 55 0 57 58 60];
for i = 1:7
    blok = satir(i:i+2);
    temiz(i) = median(blok);
end
figure
subplot(2,1,1), plot(satir), title('Gurultulu satir')
subplot(2,1,2), plot(temiz), title('Medyan sonrasi')
temiz`, `temiz =
    52    54    55    54    55    57    58`),
      SS([
        ['satir = [50 52 255 54 55 0 57 58 60];', '9 piksellik bir satır; 3. piksel tuz (255), 6. piksel biber (0).'],
        ['for i = 1:7', '3\'lük pencere 9 pikselde 7 yere sığar (9 − 2 = 7; hocanın kodundaki <code>w-2</code> ile aynı mantık).'],
        ['blok = satir(i:i+2);', 'Yan yana 3 pikseli keser.'],
        ['temiz(i) = median(blok);', 'Ortancayı yazar. Örn. i=1: 50 52 255 → sıralı 50 <strong>52</strong> 255 → 52. Diken atıldı.'],
        ['subplot(2,1,1), plot(satir), title(...)', 'Pencereyi 2 satır 1 sütuna böler; üst bölmeye gürültülü satırı çizer. <code>plot</code> da <code>imshow</code> gibi <code>subplot</code> bölmesine çizilebilir.'],
        ['subplot(2,1,2), plot(temiz), title(...)', 'Alt bölmeye temizlenmiş satırı çizer: dikenler yok.']
      ]),
      M(`<p>Aynı karşılaştırma hocanın koduyla: script çalıştıktan sonra <code>figure, plot(J(100,:))</code> gürültülü satırı, <code>figure, plot(medyanli(100,:))</code> temizlenmiş satırı çizer.</p>`),
      N('not', `<p>Gerçek MATLAB'da eksenlere yazı koymak için <code>xlabel('...')</code> ve <code>ylabel('...')</code> komutları da vardır. Bu sitedeki uygulama alanı yalnızca <code>plot</code> ve <code>title</code> komutlarını çalıştırır.</p>`),
      O([
        '<code>plot(y)</code>: yatay eksen sıra numarası (1, 2, 3…), dikey eksen değer.',
        '<code>plot(x,y)</code>: önce yatay, sonra dikey; iki liste aynı uzunlukta olmalı.',
        '<code>figure, plot(...)</code> yeni pencerede çizer; <code>subplot</code> ile bölmeye de çizilebilir; <code>title(\'...\')</code> başlık koyar.',
        '<code>plot(res(100,:))</code>: 100. satırın parlaklık profili (yatay: sütun no, dikey: parlaklık).',
        'Grafikte sivri diken = tuz/biber paraziti; ani basamak = kenar.'
      ])
    ]
  });

  /* ================================================================== yeni-pencere */
  veri.push({
    id: 'yeni-pencere', no: 17, baslik: 'Kodda değişiklik: 3×3 yerine 5×5 pencere ve diğerleri',
    kisa: 'Sınav tarzı "kodu değiştir" soruları: pencere boyutu, tek filtre, max/min filtre, gürültü oranı, subplot.',
    yeni: true,
    bloklar: [
      M(`<p>Sohbetin sonunda önerilmiş ama anlatılmamıştı: "3×3 yerine 5×5'lik pencere kullanmak için hangi satırların değişmesi gerektiği. Hocalar sınavda bu tür sorular sorabiliyor." Bu tür sorularda tek yapman gereken: <strong>hangi sayı neyi temsil ediyor</strong>, onu bilmek.</p>`),
      B('Koddaki 2\'ler nereden geliyor?', true),
      M(`<p>3×3 pencerede <code>i</code>. satırdan başlayıp 3 satır almak için <code>i</code>, <code>i+1</code>, <code>i+2</code> gerekir: son satır <code>i+2</code>. Yani koddaki <strong>2 = pencere boyutu − 1</strong>. Aynı 2, döngü sınırında da var: pencere taşmasın diye <code>i</code> en fazla <code>w-2</code> olabilir.</p>`),
      T(['Pencere', 'Son satır', 'Döngü sınırı', 'Blok', 'Eleman sayısı', 'Medyan sırası'], [
        ['3×3', '<code>i+2</code>', '<code>1:w-2</code>', '<code>J(i:i+2,j:j+2)</code>', '9', '5. sayı'],
        ['5×5', '<code>i+4</code>', '<code>1:w-4</code>', '<code>J(i:i+4,j:j+4)</code>', '25', '13. sayı'],
        ['7×7', '<code>i+6</code>', '<code>1:w-6</code>', '<code>J(i:i+6,j:j+6)</code>', '49', '25. sayı'],
        ['n×n', '<code>i+(n-1)</code>', '<code>1:w-(n-1)</code>', '<code>J(i:i+n-1,j:j+n-1)</code>', 'n×n', '(n×n+1)/2. sayı']
      ]),
      B('5×5 pencere: değişen 3 satır', true),
      K(`clc; clear all; close all;

res=imread("cameraman.tif");
J = imnoise(res,'salt & pepper', 0.02);
[w,h]=size(J);
for i=1:w-4
    for j=1:h-4
        blok=J(i:i+4,j:j+4);
        medyanli(i,j)=median(blok(:));
        ortalama(i,j)=mean(blok(:));
    end
end
figure,imshow(uint8(medyanli))
figure,imshow(uint8(ortalama))
size(medyanli)`, `ans =
   252   252`),
      T(['Satır', '3×3 hâli', '5×5 hâli'], [
        ['Dış döngü', '<code>for i=1:w-2</code>', '<code>for i=1:w-4</code>'],
        ['İç döngü', '<code>for j=1:h-2</code>', '<code>for j=1:h-4</code>'],
        ['Blok', '<code>blok=J(i:i+2,j:j+2);</code>', '<code>blok=J(i:i+4,j:j+4);</code>']
      ]),
      M(`<ul><li><strong>Değişmeyen satırlar:</strong> <code>median(blok(:))</code> ve <code>mean(blok(:))</code> aynen kalır; <code>blok(:)</code> kaç eleman varsa hepsini tek sıra yapar.</li>
<li>Blok artık <strong>25 elemanlıdır</strong>; medyan sıralı dizinin <strong>13. sayısıdır</strong> (12 küçük, 12 büyük); ortalama toplam / 25.</li>
<li>Sonuç boyutu: 256 − 4 = 252 → <strong>252×252</strong>.</li>
<li>Daha büyük pencere → daha güçlü temizlik, ama daha çok bulanıklık ve ayrıntı kaybı.</li></ul>`),
      N('dikkat', `<p>Sık hata: yalnızca blok satırını <code>i:i+4</code> yapıp döngüyü <code>1:w-2</code> bırakmak. O zaman <code>i=253</code> iken <code>253:257</code> istenir, 257. satır yok → hata. <strong>Üç satır birlikte değişir.</strong> Ayrıca 4×4'lük kağıt resmine 5×5 pencere sığmaz: <code>1:w-4</code> = <code>1:0</code> boş aralıktır, döngü hiç dönmez.</p>`),
      B('Genel n×n: pencere boyutunu değişkene bağlamak', true),
      K(`J = [10 20 30 40 50; 60 255 70 80 90; 100 110 0 120 130; 140 150 160 170 180; 190 200 210 220 230];
n = 3;
k = n - 1;
[w,h] = size(J);
for i = 1:w-k
    for j = 1:h-k
        blok = J(i:i+k, j:j+k);
        medyanli(i,j) = median(blok(:));
    end
end
medyanli`, `medyanli =
    60    70    70
   110   120   120
   150   160   170`),
      M(`<p><code>n = 5</code> yaparsan başka hiçbir satıra dokunmadan 5×5 pencere olur (bu 5×5 resimde tek adım kalır ve sonuç tek sayıdır: 25 sayının 13.'sü, 120).</p>`),
      B('Sadece medyan ya da sadece ortalama', true),
      M(`<p>"Yalnızca medyan filtresi uygulayan kodu yazın" denirse: <code>ortalama(i,j)=...</code> satırı <strong>ve</strong> onu gösteren <code>figure,imshow(uint8(ortalama))</code> satırı silinir. İkincisini unutursan <code>Unrecognized function or variable 'ortalama'</code> hatası alırsın. Sadece ortalama için tersi.</p>`),
      K(`res=imread("cameraman.tif");
J = imnoise(res,'salt & pepper', 0.02);
[w,h]=size(J);
for i=1:w-2
    for j=1:h-2
        blok=J(i:i+2,j:j+2);
        medyanli(i,j)=median(blok(:));
    end
end
figure,imshow(uint8(medyanli))`),
      B('max ve min filtresi', true),
      M(`<p>Komutun adı değişir, gerisi aynı kalır: <code>median</code> yerine <code>max</code> (pencerenin en parlağı) ya da <code>min</code> (en koyusu).</p>`),
      KX(`        enbuyuk(i,j)=max(blok(:));
        enkucuk(i,j)=min(blok(:));`),
      M(`<p><code>max</code> filtresi biberi (0) siler ama tuzu (255) büyütür: her beyaz nokta 3×3'lük beyaz kareye dönüşür. <code>min</code> filtresi tersini yapar. Tam kod "Benzer kodlar" konusunda.</p>`),
      B('Gürültü oranını değiştirmek', true),
      M(`<p>Yalnızca <code>imnoise</code> satırındaki son sayı değişir: <code>0.02</code> → <code>0.10</code>. Bozulan piksel sayısı = 65.536 × oran: 0.02 → ≈ 1.300, 0.05 → ≈ 3.300, 0.10 → ≈ 6.550. Oran arttıkça 3×3 pencereye birden çok parazit düşer ve medyan da zorlanmaya başlar.</p>`),
      KX(`J = imnoise(res,'salt & pepper', 0.10);`),
      B('Gösterme satırlarını değiştirmek', true),
      T(['İstenen', 'Yazılacak'], [
        ['İki sonuç tek pencerede yan yana', '<code>figure</code><br><code>subplot(1,2,1), imshow(uint8(medyanli))</code><br><code>subplot(1,2,2), imshow(uint8(ortalama))</code>'],
        ['J de eklensin: üç resim yan yana', '<code>subplot(1,3,1), imshow(J)</code> … <code>subplot(1,3,3), imshow(uint8(ortalama))</code>'],
        ['Dört resim 2×2 (res, J, medyanlı, ortalamalı)', '<code>subplot(2,2,1)</code> … <code>subplot(2,2,4)</code>'],
        ['<code>uint8</code> kullanmadan düzgün gösterme', '<code>figure,imshow(ortalama,[])</code>'],
        ['Resim yerine sayıları görmek', 'imshow satırları yerine <code>medyanli</code> (sonunda <code>;</code> yok)'],
        ['Dosyadan okumak yerine elle resim', '<code>J = [10 20 30 40; ...];</code> (imread ve imnoise satırları silinir)']
      ]),
      K(`res=imread("cameraman.tif");
J = imnoise(res,'salt & pepper', 0.02);
[w,h]=size(J);
for i=1:w-2
    for j=1:h-2
        blok=J(i:i+2,j:j+2);
        medyanli(i,j)=median(blok(:));
        ortalama(i,j)=mean(blok(:));
    end
end
figure
subplot(2,2,1), imshow(res), title('Orijinal')
subplot(2,2,2), imshow(J), title('Gurultulu')
subplot(2,2,3), imshow(uint8(medyanli)), title('Medyan')
subplot(2,2,4), imshow(uint8(ortalama)), title('Ortalama')`),
      O([
        'Koddaki 2 = pencere boyutu − 1. n×n pencere için üç yerde <code>n-1</code> yazılır: <code>1:w-(n-1)</code>, <code>1:h-(n-1)</code>, <code>J(i:i+n-1,j:j+n-1)</code>.',
        '5×5: <code>w-4</code>, <code>h-4</code>, <code>i:i+4, j:j+4</code>; blok 25 eleman, medyan 13. sayı, sonuç 252×252.',
        'Bir filtreyi silerken hem hesap satırını hem gösterme satırını sil.',
        'max/min filtre: yalnızca <code>median</code> kelimesi değişir.',
        'Gürültü oranı <code>imnoise</code>\'ın son sayısıdır; gösterme şekli son satırlarda değişir (<code>subplot</code>, <code>imshow(X,[])</code>).'
      ])
    ]
  });

  /* ================================================================== yeni-baska-kodlar */
  veri.push({
    id: 'yeni-baska-kodlar', no: 18, baslik: 'Benzer kodlar: hocanın sorabileceği diğer görüntü işleme kodları',
    kisa: 'Negatif, eşikleme, parlaklık, iki resmin ortalaması, max/min filtre, renk katmanı, gürültülü piksel sayma.',
    yeni: true,
    bloklar: [
      N('dikkat', `<p><strong>Bunlar hocanın kodu değil</strong>, benzer sınav tarzı örneklerdir. Sohbette "hocanın başka kodları varsa çözeriz" denmişti ama başka kod verilmedi. Aşağıdaki kodlar yalnızca derste öğrendiğin sözdizimiyle yazıldı; her biri hocanın koduyla aynı iskeleti kullanır: <strong>oku → (gez) → hesapla → göster</strong>.</p>`),

      B('1. Negatif', true),
      M(`<p>Her piksel 255'ten çıkarılır: siyah beyaz olur, beyaz siyah olur.</p>`),
      KA('Negatif: 255 - res (gerçek resim)', `res = imread("cameraman.tif");
neg = 255 - res;
figure
subplot(1,2,1), imshow(res)
subplot(1,2,2), imshow(neg)`),
      SS([
        ['res = imread("cameraman.tif");', 'Resmi okur (uint8).'],
        ['neg = 255 - res;', 'Matris tek sayıyla işleme girince her piksele ayrı uygulanır: 0 → 255, 255 → 0, 100 → 155. Sonuç 0–255 arasında kaldığı için taşma olmaz.'],
        ['subplot(1,2,1), imshow(res)', 'Solda orijinal.'],
        ['subplot(1,2,2), imshow(neg)', 'Sağda negatif.']
      ]),
      M(`<p>Aynı iş iç içe <code>for</code> ile (sınavda "döngüyle yazın" denebilir):</p>`),
      KA('Negatif: iç içe for ile 2×2 matris', `A = [0 100; 200 255];
[w,h] = size(A);
for i = 1:w
    for j = 1:h
        neg(i,j) = 255 - A(i,j);
    end
end
neg`, `neg =
   255   155
    55     0`),

      B('2. Eşikleme (if + iç içe for)', true),
      M(`<p>Parlak pikseller beyaz (255), koyu pikseller siyah (0) yapılır; resim iki renge iner. Konu 10'daki eşikleme <code>if</code>'i, Konu 11'deki iç içe <code>for</code>'un içine konur.</p>`),
      KA('Eşikleme: gerçek resim (if + iç içe for)', `res = imread("cameraman.tif");
[w,h] = size(res);
for i = 1:w
    for j = 1:h
        if res(i,j) > 128
            sb(i,j) = 255;
        else
            sb(i,j) = 0;
        end
    end
end
figure, imshow(uint8(sb))`),
      SS([
        ['[w,h] = size(res);', '256 ve 256.'],
        ['for i = 1:w / for j = 1:h', 'Pencere yok, tek tek piksel geziliyor; bu yüzden <code>w-2</code> değil <code>w</code>.'],
        ['if res(i,j) > 128', '"Bu piksel 128\'den parlak mı?"'],
        ['sb(i,j) = 255;', 'Evetse yeni resimde aynı adrese beyaz yazılır.'],
        ['else / sb(i,j) = 0;', 'Değilse siyah yazılır (128 dahil).'],
        ['end / end / end', 'Sırayla <code>if</code>, iç <code>for</code>, dış <code>for</code> kapanır: <strong>üç yapı, üç end</strong>.'],
        ['figure, imshow(uint8(sb))', '<code>sb</code> elle yazılan sayılarla oluştuğu için double\'dır; <code>uint8</code> ile 0–255 ölçeğinde gösterilir.']
      ]),
      KA('Eşikleme: 2×2 matris üzerinde', `A = [10 200; 128 129];
[w,h] = size(A);
for i = 1:w
    for j = 1:h
        if A(i,j) > 128
            sb(i,j) = 255;
        else
            sb(i,j) = 0;
        end
    end
end
sb`, `sb =
     0   255
     0   255`),

      B('3. Parlaklık artırma ve uint8 taşması', true),
      KA('Parlaklık ±50: gerçek resim', `res = imread("cameraman.tif");
parlak = res + 50;
koyu = res - 50;
figure
subplot(1,3,1), imshow(koyu)
subplot(1,3,2), imshow(res)
subplot(1,3,3), imshow(parlak)`),
      SS([
        ['parlak = res + 50;', 'Her piksele 50 eklenir. <code>res</code> uint8 olduğu için 255\'i geçen sonuçlar <strong>255\'te kesilir</strong> (Konu 12): 230 + 50 → 255. Burada taşma işimize yarar: piksel "bembeyaz"da kalır.'],
        ['koyu = res - 50;', 'Her pikselden 50 çıkarılır; 0\'ın altına inenler 0\'da kalır: 30 − 50 → 0.'],
        ['subplot(1,3,…)', 'Koyu, orijinal ve parlak hâl yan yana.']
      ]),
      KA('uint8 taşması: A + 50, A - 50, A * 2', `A = uint8([100 230; 30 250]);
A + 50
A - 50
A * 2`, `ans =
  2×2 uint8 matrix
   150   255
    80   255

ans =
  2×2 uint8 matrix
    50   180
     0   200

ans =
  2×2 uint8 matrix
   200   255
    60   255`),
      N('dikkat', `<p>Önce <code>double</code>'a çevirirsen taşma olmaz ama sayılar 255'i aşar: <code>double(230) + 50</code> = 280. Göstermeden önce <code>uint8(...)</code> ile geri çevirince yine 255'e kesilir.</p>`),

      B('4. İki resmin ortalaması (double\'a çevirme)', true),
      M(`<p>İki resmi üst üste bindirmek: aynı adresteki pikseller toplanır, ikiye bölünür. uint8 toplaması taşacağı için <strong>önce <code>double</code></strong>.</p>`),
      KA('İki resmin ortalaması: gerçek resim (double)', `res = imread("cameraman.tif");
J = imnoise(res,'salt & pepper', 0.10);
yanlis = (res + J) / 2;
dogru = (double(res) + double(J)) / 2;
figure
subplot(1,2,1), imshow(yanlis)
subplot(1,2,2), imshow(uint8(dogru))`),
      SS([
        ['yanlis = (res + J) / 2;', 'uint8 + uint8: 200 + 100 = 300 → 255, sonra 255 / 2 → 128. Parlak bölgeler yanlış çıkar (hepsi 128\'e yığılır).'],
        ['dogru = (double(res) + double(J)) / 2;', 'Önce geniş kutu: 300 / 2 = 150. Doğru ortalama.'],
        ['imshow(uint8(dogru))', '<code>dogru</code> double ve değerleri 0–255 arasında; hocanın <code>uint8(ortalama)</code> satırıyla aynı sebeple <code>uint8</code> gerekir.']
      ]),
      KA('İki resmin ortalaması: 2×2 matris (double)', `A = uint8([200 100; 50 250]);
B = uint8([100 100; 150 250]);
yanlis = (A + B) / 2
dogru = (double(A) + double(B)) / 2`, `yanlis =
  2×2 uint8 matrix
   128   100
   100   128

dogru =
   150   100
   100   250`),

      B('5. max / min filtresi', true),
      M(`<p>Hocanın kodunun birebir aynısı; yalnızca <code>median</code>/<code>mean</code> yerine <code>max</code>/<code>min</code>.</p>`),
      K(`res = imread("cameraman.tif");
J = imnoise(res,'salt & pepper', 0.02);
[w,h] = size(J);
for i = 1:w-2
    for j = 1:h-2
        blok = J(i:i+2,j:j+2);
        enbuyuk(i,j) = max(blok(:));
        enkucuk(i,j) = min(blok(:));
    end
end
figure
subplot(1,3,1), imshow(J)
subplot(1,3,2), imshow(uint8(enbuyuk))
subplot(1,3,3), imshow(uint8(enkucuk))`),
      SS([
        ['blok = J(i:i+2,j:j+2);', '3×3 pencere (aynı).'],
        ['enbuyuk(i,j) = max(blok(:));', 'Penceredeki en parlak piksel. Pencerede tek bir tuz (255) varsa sonuç 255 olur: biber silinir, tuz noktaları büyür, resim aydınlanır.'],
        ['enkucuk(i,j) = min(blok(:));', 'Penceredeki en koyu piksel. Tek bir biber (0) sonucu 0 yapar: tuz silinir, biber noktaları büyür, resim kararır.']
      ]),
      M(`<p>Kağıt örneğindeki 4×4 <code>J</code> ile sonuç: her blokta hem 255 hem 0 olduğu için <code>enbuyuk = [255 255; 255 255]</code>, <code>enkucuk = [0 0; 0 0]</code>.</p>`),

      B('6. Renkli resimden kırmızı katman', true),
      M(`<p>Renkli resim üst üste 3 tablodur (Konu 5): 1. kat kırmızı, 2. kat yeşil, 3. kat mavi. Bir katı almak için üçüncü adrese kat numarası yazılır.</p>`),
      K(`renkli(:,:,1) = [255 0; 200 10];
renkli(:,:,2) = [0 255; 200 20];
renkli(:,:,3) = [0 0; 0 30];
kirmizi = renkli(:,:,1)
yesil = renkli(:,:,2);
mavi = renkli(:,:,3);
gri = (kirmizi + yesil + mavi) / 3
figure, imshow(kirmizi,[])`, `kirmizi =
   255     0
   200    10

gri =
   85.0000   85.0000
  133.3333   20.0000`),
      SS([
        ['renkli(:,:,1) = [255 0; 200 10];', '1. kata (kırmızı) değer yazar; diğer iki satır yeşil ve mavi katı doldurur.'],
        ['kirmizi = renkli(:,:,1)', 'Tüm satırlar, tüm sütunlar, 1. kat: kırmızı katman tek başına 2×2 bir gri resimdir.'],
        ['gri = (kirmizi + yesil + mavi) / 3', 'Üç katın ortalaması = basit gri tonlama. (Bu sayılar double olduğu için taşma yok; uint8 resimde önce <code>double</code> gerekir.)'],
        ['figure, imshow(kirmizi,[])', 'Kırmızı katmanı gri resim olarak gösterir: kırmızısı çok olan piksel açık renk görünür.']
      ]),
      KX(`renkli = imread("peppers.png");
kirmizi = renkli(:,:,1);
figure
subplot(1,2,1), imshow(renkli)
subplot(1,2,2), imshow(kirmizi)`),
      N('not', `<p>Yukarıdaki son kod gerçek MATLAB içindir (gerçek bir renkli dosya ister). Bu sitedeki <code>imread</code> her zaman tek katlı gri resim ürettiği için burada çalıştırma düğmesi yok.</p>`),

      B('7. Gürültülü pikselleri saymak (find)', true),
      M(`<p>"Resimde kaç tuz, kaç biber pikseli var?" İki yol var: döngü + <code>if</code> ile saymak ya da <code>find</code> kullanmak.</p>`),
      KA('Gürültülü pikselleri saymak: for + if', `J = [10 20 30 40; 50 255 60 70; 80 90 0 100; 110 255 130 140];
[w,h] = size(J);
sayac = 0;
for i = 1:w
    for j = 1:h
        if J(i,j) == 0 || J(i,j) == 255
            sayac = sayac + 1;
        end
    end
end
sayac`, `sayac =
     3`),
      SS([
        ['sayac = 0;', 'Sayacı sıfırdan başlatır (Konu 11\'deki <code>toplam = 0</code> gibi).'],
        ['if J(i,j) == 0 || J(i,j) == 255', '"Bu piksel biber ya da tuz mu?" Tek piksel sorulduğu için <code>||</code> kullanılır.'],
        ['sayac = sayac + 1;', 'Evetse sayaç bir artar. <code>else</code> yok: değilse hiçbir şey yapılmaz.'],
        ['sayac', '255, 0, 255 → 3.']
      ]),
      KA('Gürültülü pikselleri saymak: find ve sum', `J = [10 20 30 40; 50 255 60 70; 80 90 0 100; 110 255 130 140];
v = J(:);
tuzYer = find(v == 255)
biberYer = find(v == 0)
[tuzSayisi, s1] = size(tuzYer);
[biberSayisi, s2] = size(biberYer);
toplam = tuzSayisi + biberSayisi
kisa = sum(v == 0) + sum(v == 255)`, `tuzYer =
     6
     8

biberYer =
    11

toplam =
     3

kisa =
     3`),
      SS([
        ['v = J(:);', 'Resmi sütun sütun tek sıra yapar (16 sayı).'],
        ['tuzYer = find(v == 255)', 'Değeri 255 olanların sırası: 6. ve 8. (2. sütunun 2. ve 4. elemanı).'],
        ['biberYer = find(v == 0)', 'Değeri 0 olanın sırası: 11.'],
        ['[tuzSayisi, s1] = size(tuzYer);', '<code>find</code> sonucu alt alta bir listedir; satır sayısı = bulunan piksel sayısı (2).'],
        ['kisa = sum(v == 0) + sum(v == 255)', 'Kısa yol: karşılaştırma 0/1 verir, 1\'leri toplamak saymak demektir.']
      ]),
      N('baglanti', `<p>Gerçek resimde: <code>J = imnoise(res,'salt &amp; pepper', 0.02);</code> sonrası <code>sum(J(:) == 0) + sum(J(:) == 255)</code> yaklaşık 1.300 çıkar (resmin kendi 0/255 pikselleri de sayıya girer).</p>`),
      O([
        'Negatif: <code>255 - res</code>. Parlaklık: <code>res + 50</code> (uint8 taşması 255\'te keser).',
        'Eşikleme: iç içe <code>for</code> içinde <code>if res(i,j) &gt; 128 … else … end</code>; üç yapı, üç <code>end</code>.',
        'İki resmi toplarken/ortalarken önce <code>double(...)</code>, göstermeden önce <code>uint8(...)</code>.',
        'max/min filtre: hocanın kodunda yalnızca <code>median</code> kelimesi değişir.',
        'Renk katmanı: <code>renkli(:,:,1)</code> kırmızı, <code>(:,:,2)</code> yeşil, <code>(:,:,3)</code> mavi.',
        'Sayma: <code>sayac = sayac + 1</code> ya da <code>sum(v == 255)</code>; yer bulma: <code>find(v == 255)</code>.'
      ])
    ]
  });

  g.KONULAR = (g.KONULAR || []).concat(veri);
  if (typeof module !== 'undefined') module.exports = veri;
})(typeof window !== 'undefined' ? window : globalThis);
