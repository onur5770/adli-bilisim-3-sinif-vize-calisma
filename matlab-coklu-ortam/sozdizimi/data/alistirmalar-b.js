/* Alıştırma ajanı B: konu-08 … konu-13, hoca-kodu, kagit, yeni-* */
(function (g) {
  const KONU = { k08: 'konu-08', k09: 'konu-09', k10: 'konu-10', k11: 'konu-11', k12: 'konu-12', k13: 'konu-13', hk: 'hoca-kodu', kg: 'kagit', yp: 'yeni-plot', yw: 'yeni-pencere', yb: 'yeni-baska-kodlar' };
  const veri = [];
  /* A(id, tur, zorluk, etiketler, soru, ipuclari, cozum, ekstra) */
  const A = (id, tur, zorluk, etiketler, soru, ipuclari, cozum, ekstra) => {
    veri.push(Object.assign({ id, konu: KONU[id.split('-')[0]], tur, zorluk, etiketler, soru, ipuclari, cozum }, ekstra || {}));
  };
  const CS = 'coktan-secmeli', CT = 'cikti-tahmin', KC = 'kisa-cevap', BD = 'bosluk-doldur', KY = 'kod-yaz', HB = 'hata-bul';

  /* ============================================================ konu-08 */
  A('k08-01', CT, 1, ['sohbet'], 'Ekranda hangi sayı görünür?',
    ['Ortalama: hepsini topla, kaç sayı varsa ona böl.', 'Toplam 120, sayı adedi 5.'],
    '2 + 100 + 4 + 6 + 8 = 120; 120 / 5 = <strong>24</strong>.',
    { kod: 'v = [2 100 4 6 8];\nmean(v)', beklenen: '24' });
  A('k08-02', CT, 1, ['sohbet'], 'Ekranda hangi sayı görünür?',
    ['<code>median</code> önce küçükten büyüğe sıralar.', 'Sıralı hâli: 2 4 6 8 100. Tam ortadaki kaçıncı sayı?'],
    'Sıralı hâli <code>2 4 6 8 100</code>; ortadaki (3.) sayı <strong>6</strong>.',
    { kod: 'v = [2 100 4 6 8];\nmedian(v)', beklenen: '6' });
  A('k08-03', CS, 1, ['sohbet'], '<code>v = [2 100 4 6 8]</code> için <code>mean(v)</code> = 24, <code>median(v)</code> = 6. Hangisi 100 parazitinden <strong>daha az</strong> etkilendi?',
    ['Parazit olmasaydı sayılar 2, 4, 6, 8 civarında olurdu. Hangi sonuç bu sayılara yakın?'],
    '<code>median</code>. 100 sıralamanın en ucuna gider ve ortadaki sayıyı değiştirmez; ortalamayı ise 24\'e çeker. Medyan filtresinin tuz-biber gürültüsünü temizlemesinin nedeni budur.',
    { secenekler: ['<code>mean</code>', '<code>median</code>', 'İkisi de aynı etkilendi', 'İkisi de hiç etkilenmedi'], dogru: 1 });
  A('k08-04', CT, 2, ['sohbet'], 'Ekranda hangi sayılar görünür? (Sırayla yaz.)',
    ['Matrise doğrudan verilen <code>mean</code> tek sayı vermez.', 'Her sütunu ayrı hesaplar: 1. sütun 1 ve 9, 2. sütun 5 ve 3.'],
    '<code>mean(M)</code> sütunları ayrı hesaplar: (1 + 9) / 2 = 5 ve (5 + 3) / 2 = 4 → <code>5 4</code>.',
    { kod: 'M = [1 5; 9 3];\nmean(M)', beklenen: '5 4' });
  A('k08-05', CT, 2, ['sohbet', 'hata-odakli'], 'Ekranda hangi sayı görünür?',
    ['Önce <code>M(:)</code> hangi sayıları sıralar, yaz.', 'Toplam 18. Burada kaç sayı var?', 'Ondalığı nokta ile yaz.'],
    '<code>M(:)</code> → 1, 9, 5, 3 (4 sayı). 18 / 4 = <strong>4.5</strong>. 2\'ye değil, eleman sayısına (4) bölünür.',
    { hata: 'H11', kod: 'M = [1 5; 9 3];\nmean(M(:))', beklenen: '4.5' });
  A('k08-06', CS, 1, ['hata-odakli'], '<code>K = [2 4 6; 8 10 12];</code> için <code>mean(K(:))</code> hesaplanırken toplam (42) kaça bölünür?',
    ['<code>K(:)</code> kaç sayıdan oluşur?', 'Satır sayısı da sütun sayısı da değil: eleman sayısı.'],
    '<code>K(:)</code> 6 sayı içerir; 42 / 6 = 7. Satır sayısına (2) ya da sütun sayısına (3) bölmek yanlıştır.',
    { hata: 'H11', secenekler: ['2 (satır sayısı)', '3 (sütun sayısı)', '6 (eleman sayısı)', '42'], dogru: 2 });
  A('k08-07', CS, 1, ['hata-odakli'], '"Dört buçuk" MATLAB\'da nasıl yazılır?',
    ['MATLAB\'da virgül ayırıcıdır.'],
    'Ondalık için <strong>nokta</strong> kullanılır: <code>4.5</code>. <code>4,5</code> yazarsan MATLAB bunu iki ayrı şey (4 ve 5) olarak görür.',
    { hata: 'H12', secenekler: ['<code>4,5</code>', '<code>4.5</code>', '<code>4;5</code>', '<code>4 5</code>'], dogru: 1 });
  A('k08-08', CT, 2, ['hata-odakli'], 'Bu matriste kaç sayı var? (Kodun gösterdiği sonucu yaz.)',
    ['Köşeli parantez içinde virgül, boşluk gibi "yan sütuna geç" demektir.', '<code>24,6</code> tek sayı değildir.'],
    'Virgül ayırıcıdır: <code>[24,6]</code> iki sayıdır (24 ve 6), sütun sayısı <strong>2</strong>. Ondalıklı 24.6 isteseydik nokta yazardık.',
    { hata: 'H12', kod: 'x = [24,6];\n[satir, sutun] = size(x);\nsutun', beklenen: '2' });
  A('k08-09', CT, 2, ['yeni'], 'Ekranda hangi sayılar görünür? (Sırayla yaz.)',
    ['<code>sum</code> da matriste sütun sütun çalışır.'],
    '1. sütun 1 + 9 = 10, 2. sütun 5 + 3 = 8 → <code>10 8</code>. Hepsinin toplamı için <code>sum(M(:))</code> = 18.',
    { kod: 'M = [1 5; 9 3];\nsum(M)', beklenen: '10 8' });
  A('k08-10', CT, 2, ['yeni'], 'Ekranda hangi sayılar görünür?',
    ['<code>find</code> değeri değil, sırayı verir.', '100\'den büyük olanlar 200 ve 255. Bunlar kaçıncı sırada?'],
    '200 ikinci, 255 dördüncü sırada → <code>2 4</code>.',
    { kod: 'v = [5 200 30 255 0];\nfind(v > 100)', beklenen: '2 4' });
  A('k08-11', CT, 2, ['yeni'], 'Eleman sayısı çift. Ekranda hangi sayı görünür?',
    ['Tam ortada tek sayı yok.', 'Ortadaki iki sayının ortalaması alınır.'],
    'Ortadaki iki sayı 4 ve 6; (4 + 6) / 2 = <strong>5</strong>.',
    { kod: 'median([2 4 6 8])', beklenen: '5' });
  A('k08-12', KY, 2, ['yeni'], '<code>blok</code> matrisi verildi. Bloğun en büyük pikselini <code>enb</code>, en küçük pikselini <code>enk</code> değişkenine al. Sonra <code>fark</code> değişkenine <code>abs</code> kullanarak <code>enk - enb</code> farkının işaretsiz hâlini yaz.',
    ['Bütün blok için tek sonuç: önce <code>(:)</code>.', '<code>enb = max(blok(:));</code> gibi.', '<code>fark = abs(enk - enb);</code>'],
    '<code>max(blok(:))</code> = 255, <code>min(blok(:))</code> = 0; 0 − 255 = −255, <code>abs</code> ile 255.',
    { baslangicKod: 'blok = [10 20 30; 40 255 60; 70 80 0];\n', cozumKod: 'blok = [10 20 30; 40 255 60; 70 80 0];\nenb = max(blok(:));\nenk = min(blok(:));\nfark = abs(enk - enb);', kontrol: { degiskenler: { enb: 255, enk: 0, fark: 255 }, icermeli: ['abs\\s*\\('] } });
  A('k08-13', HB, 2, ['hata-odakli'], 'Bu kod bütün bloğun ortalamasını <strong>tek sayı</strong> olarak <code>ort</code> değişkenine yazmalı, ama üç sayı veriyor. Düzelt.',
    ['Komut matrise doğrudan verilirse sütun sütun çalışır.', 'Bloğu önce tek sıra yap.'],
    '<code>mean(blok)</code> üç sütun ortalaması verir. <code>mean(blok(:))</code> → 565 / 9 = 62.7778.',
    { hata: 'H11', baslangicKod: 'blok = [10 20 30; 40 255 60; 70 80 0];\nort = mean(blok)', cozumKod: 'blok = [10 20 30; 40 255 60; 70 80 0];\nort = mean(blok(:))', kontrol: { degiskenler: { ort: 62.7778 } } });
  A('k08-14', BD, 2, ['sohbet'], 'Hocanın kodundaki satırı tamamla: bloğu tek sıra yapıp <strong>ortancasını</strong> al.',
    ['"Sıralar, ortadakini alır" komutu hangisiydi?', 'Tek sıra yapmak için parantez içine tek bir işaret yazılır.'],
    '<code>orta = median(blok(:));</code>',
    { kod: 'blok = [10 20 30; 40 255 60; 70 80 0];\norta = ___(blok(___));', bosluklar: [['median'], [':']] });

  /* ============================================================ konu-09 */
  A('k09-01', CT, 1, ['sohbet'], 'Sonuç 1 mi, 0 mı?',
    ['<code>||</code> "veya" demektir: biri doğruysa yeter.'],
    '<code>p == 0</code> doğru. "Veya" için biri yeterli → <strong>1</strong>.',
    { kod: 'p = 0;\np == 0 || p == 255', beklenen: '1' });
  A('k09-02', CT, 1, ['sohbet'], 'Sonuç 1 mi, 0 mı?',
    ['<code>&amp;&amp;</code> "ve" demektir: ikisi de doğru olmalı.', '0, 0\'dan büyük mü?'],
    '<code>p &gt; 0</code> yanlış (0, 0\'dan büyük değil). "Ve" için ikisi de doğru olmalı → <strong>0</strong>.',
    { kod: 'p = 0;\np > 0 && p < 255', beklenen: '0' });
  A('k09-03', CT, 2, ['sohbet'], 'Ekranda görünen 2×2 tabloyu yaz (satırları <code>;</code> ile ayırabilirsin).',
    ['Her piksel ayrı ayrı sorulur.', 'Tam 120 olan piksel için <code>&gt;=</code> ne der?'],
    '<code>[0 1; 1 0]</code>. 5 ve 40 küçük (0); 255 büyük (1); tam 120 olan piksel de eşitlik sayesinde 1 olur.',
    { kod: 'B = [5 120; 255 40];\nB >= 120', beklenen: '0 1; 1 0', otoDogrula: false });
  A('k09-04', CS, 1, ['yeni', 'hata-odakli'], '<code>p == 5</code> satırı ne yapar?',
    ['Tek eşittir ile çift eşittiri karşılaştır.'],
    'Çift <code>==</code> yalnızca <strong>sorar</strong>; cevap 1 ya da 0 olur, <code>p</code> değişmez. Kutuya koyan tek <code>=</code> işaretidir.',
    { secenekler: ['5\'i <code>p</code> kutusuna koyar', '"p, 5\'e eşit mi?" diye sorar; p değişmez', 'p\'yi 5 ile çarpar', 'Hata verir'], dogru: 1 });
  A('k09-05', CT, 1, ['yeni'], 'Sonuç 1 mi, 0 mı?',
    ['<code>~=</code> "eşit değil mi?" diye sorar.'],
    '120, 0\'a eşit değil; "eşit değil mi?" sorusunun cevabı evet → <strong>1</strong>.',
    { kod: 'p = 120;\np ~= 0', beklenen: '1' });
  A('k09-06', CT, 2, ['yeni'], 'İki satırın sonucunu sırayla yaz.',
    ['Sayı tam sınırda. <code>&lt;</code> ile <code>&lt;=</code> farkı tam burada ortaya çıkar.'],
    '128, 128\'den küçük değil → 0. 128, 128\'e eşit → <code>&lt;=</code> 1 verir. Cevap: <code>0 1</code>.',
    { kod: 'p = 128;\np < 128\np <= 128', beklenen: '0 1' });
  A('k09-07', BD, 1, ['sohbet'], '"Piksel tuz ya da biber mi?" sorusunu tamamla.',
    ['İki koşuldan birinin doğru olması yeterli.', '"veya" işareti iki dik çizgidir.'],
    '<code>p == 0 || p == 255</code>: tuz-biber gürültüsü pikselleri 0 veya 255 yapar.',
    { kod: 'p = 255;\nparazit = p == 0 ___ p == 255', bosluklar: [['||']] });
  A('k09-08', KY, 2, ['sohbet'], '<code>p</code> değişkeni verildi. <code>p</code> 100\'den büyük <strong>ve</strong> 250\'den küçükse 1, değilse 0 olan sonucu <code>aralikta</code> adlı değişkene yaz (tek satır, <code>if</code> kullanma).',
    ['İki karşılaştırmayı "ve" ile birleştir.', '<code>aralikta = p &gt; 100 &amp;&amp; ...</code>'],
    '<code>aralikta = p &gt; 100 &amp;&amp; p &lt; 250;</code> p = 200 için iki koşul da doğru → 1.',
    { baslangicKod: 'p = 200;\n', cozumKod: 'p = 200;\naralikta = p > 100 && p < 250;', kontrol: { degiskenler: { aralikta: 1 }, icermeli: ['&&'] } });
  A('k09-09', HB, 2, ['yeni', 'hata-odakli'], 'Bu kod "p, 255\'e eşit mi?" sorusunun cevabını <code>tuz</code> değişkenine yazmalı. Hatalı yeri düzelt.',
    ['Satırda iki tane tek eşittir var. Hangisi soru olmalı?', 'Sormak için çift eşittir.'],
    '<code>tuz = p == 255;</code> Soldaki <code>=</code> kutuya koyar, sağdaki <code>==</code> sorar. Sonuç 1.',
    { baslangicKod: 'p = 255;\ntuz = p = 255;', cozumKod: 'p = 255;\ntuz = p == 255;', kontrol: { degiskenler: { tuz: 1 }, icermeli: ['=='] } });
  A('k09-10', KY, 3, ['yeni'], '<code>A</code> matrisi verildi. 100\'den büyük pikselleri gösteren 0/1 tablosunu <code>maske</code> değişkenine, 100\'den büyük piksel <strong>sayısını</strong> <code>adet</code> değişkenine yaz.',
    ['<code>maske = A &gt; 100;</code>', '1\'leri toplamak saymak demektir. Tek sonuç için <code>(:)</code>.', '<code>adet = sum(maske(:));</code>'],
    '<code>A &gt; 100</code> → <code>[0 1; 1 0]</code>; içindeki 1\'lerin toplamı 2.',
    { baslangicKod: 'A = [10 200; 150 30];\n', cozumKod: 'A = [10 200; 150 30];\nmaske = A > 100;\nadet = sum(maske(:));', kontrol: { degiskenler: { maske: [[0, 1], [1, 0]], adet: 2 } } });

  /* ============================================================ konu-10 */
  A('k10-01', CT, 1, ['sohbet'], 'Bu kod çalışınca <code>durum</code> kaç olur?',
    ['Önce koşulun cevabını bul: 1 mi 0 mı?', '<code>p == 255</code> doğru; "veya" için biri yeter.'],
    'Koşul doğru olduğu için <code>durum = 1;</code> çalışır, <code>else</code> kısmı atlanır → <strong>1</strong>.',
    { kod: 'p = 255;\nif p == 0 || p == 255\n    durum = 1;\nelse\n    durum = 0;\nend\ndurum', beklenen: '1' });
  A('k10-02', KY, 2, ['sohbet'], 'Kodu sen yaz: <code>piksel</code> (hazır verildi, değeri 70) 100\'den küçükse <code>sonuc</code> 0 olsun, değilse <code>sonuc</code> piksel değerine eşit olsun.',
    ['İskelet: <code>if koşul</code> … <code>else</code> … <code>end</code>.', '"Değilse" için yeni bir koşul gerekmiyor; hangi kelime koşul istemez?', 'Son satır <code>end</code> olmalı.'],
    '<pre>if piksel &lt; 100\n    sonuc = 0;\nelse\n    sonuc = piksel;\nend</pre>',
    { onKod: 'piksel = 70;', baslangicKod: '', cozumKod: 'if piksel < 100\n    sonuc = 0;\nelse\n    sonuc = piksel;\nend', kontrol: { degiskenler: { sonuc: 0 }, icermeli: ['\\bif\\b', '\\belse\\b', '\\bend\\b'], icermemeli: ['elseif'] } });
  A('k10-03', BD, 1, ['sohbet', 'hata-odakli'], 'Sohbetteki iskelet: iki boşluğa hangi kelimeler gelir?',
    ['1. boşluk: "geri kalan her durumda" anlamına gelen, koşul istemeyen kelime.', '2. boşluk: MATLAB\'a "if yapısı burada bitti" diyen kelime.'],
    '<code>else</code> ve <code>end</code>. <code>elseif</code> olamaz, çünkü yanına yeni bir koşul yazılması gerekir.',
    { hata: 'H15', kod: 'if piksel < 100\n    sonuc = 0;\n___\n    sonuc = piksel;\n___', bosluklar: [['else'], ['end']] });
  A('k10-04', HB, 2, ['sohbet', 'hata-odakli'], 'İlk denemendeki hata: <code>piksel</code> (değeri 150) 100\'den küçükse <code>sonuc</code> 0, değilse piksel olmalı. Kodu düzelt.',
    ['<code>elseif</code> "değilse eğer" demektir; yanında ne olmalı?', 'Burada yeni koşul yok. Koşul istemeyen kelimeyi kullan.'],
    '<code>elseif</code> yerine <code>else</code>. piksel = 150 için koşul yanlış, <code>sonuc = 150</code>.',
    { hata: 'H13', onKod: 'piksel = 150;', baslangicKod: 'if piksel < 100\n    sonuc = 0\nelseif\n    sonuc = piksel\nend', cozumKod: 'if piksel < 100\n    sonuc = 0\nelse\n    sonuc = piksel\nend', kontrol: { degiskenler: { sonuc: 150 }, icermemeli: ['elseif'] } });
  A('k10-05', CS, 1, ['hata-odakli'], '<code>elseif</code> kelimesinin yanına ne yazılmak <strong>zorundadır</strong>?',
    ['"Değilse <em>eğer</em>…" Eğer ne?'],
    '<code>elseif</code> yeni bir <strong>koşul</strong> ister (ör. <code>elseif piksel &lt; 200</code>). Koşul yoksa <code>else</code> kullanılır.',
    { hata: 'H13', secenekler: ['Hiçbir şey', 'Yeni bir koşul', '<code>end</code>', 'Noktalı virgül'], dogru: 1 });
  A('k10-06', HB, 1, ['sohbet', 'hata-odakli'], 'Bu kod çalışmıyor: bir satır eksik. <code>piksel</code> değeri 70; <code>sonuc</code> doğru hesaplanmalı.',
    ['MATLAB, if yapısının bittiğini nasıl anlıyordu?', 'En sona tek kelimelik bir satır ekle.'],
    'Sona <code>end</code> eklenir. <code>end</code> zorunludur.',
    { hata: 'H14', onKod: 'piksel = 70;', baslangicKod: 'if piksel < 100\n    sonuc = 0;\nelse\n    sonuc = piksel;', cozumKod: 'if piksel < 100\n    sonuc = 0;\nelse\n    sonuc = piksel;\nend', kontrol: { degiskenler: { sonuc: 0 }, icermeli: ['\\bend\\b'] } });
  A('k10-07', CS, 1, ['hata-odakli'], 'Bir <code>if</code> yapısında hangisi <strong>zorunludur</strong>?',
    ['Biri "değilse", biri "değilse eğer", biri "bitti" demek.'],
    '<code>end</code> zorunludur. <code>else</code> ve <code>elseif</code> isteğe bağlıdır.',
    { hata: 'H14', secenekler: ['<code>else</code>', '<code>elseif</code>', '<code>end</code>', 'Üçü de'], dogru: 2 });
  A('k10-08', HB, 2, ['sohbet', 'hata-odakli'], 'İkinci denemen: noktalı virgüller eklenmiş ama iki hata aynen duruyor. İkisini de düzelt (<code>piksel</code> değeri 100).',
    ['Noktalı virgüller sorun değildi. Hatalı iki yer başka.', 'Birincisi: koşulsuz <code>elseif</code>.', 'İkincisi: yapı kapanmamış.'],
    '<code>elseif</code> → <code>else</code> ve sona <code>end</code>. piksel = 100, 100\'den küçük değildir → <code>sonuc = 100</code>.',
    { hata: 'H15', onKod: 'piksel = 100;', baslangicKod: 'if piksel <100\nsonuc=0;\nelseif\nsonuc=piksel;', cozumKod: 'if piksel <100\nsonuc=0;\nelse\nsonuc=piksel;\nend', kontrol: { degiskenler: { sonuc: 100 }, icermeli: ['\\bend\\b'], icermemeli: ['elseif'] } });
  A('k10-09', CS, 2, ['hata-odakli'], 'İlk denemede <code>sonuc=0</code> satırının sonunda <code>;</code> yoktu. Bu bir hata mıydı?',
    ['<code>;</code> ne işe yarıyordu?'],
    'Hayır. <code>;</code> yalnızca ekrana yazdırmayı bastırır. Asıl hatalar koşulsuz <code>elseif</code> ve eksik <code>end</code> idi; düzeltirken onlara odaklanmak gerekir.',
    { hata: 'H15', secenekler: ['Evet, kod bu yüzden çalışmıyordu', 'Hayır; yalnızca sonuç ekrana yazılırdı', 'Evet, if içinde ; zorunludur', 'Hayır, ama else satırına ; gerekir'], dogru: 1 });
  A('k10-10', CT, 2, ['sohbet'], 'Sınırdaki sayı: <code>yeni</code> kaç olur?',
    ['128, 128\'den <strong>büyük</strong> mü?'],
    '128, 128\'den büyük olmadığı için koşul yanlış; <code>else</code> yolu çalışır → <strong>0</strong>.',
    { kod: 'piksel = 128;\nif piksel > 128\n    yeni = 255;\nelse\n    yeni = 0;\nend\nyeni', beklenen: '0' });
  A('k10-11', CT, 2, ['yeni'], '<code>tur</code> kaç olur?',
    ['Yukarıdan aşağı bakılır; doğru olan <strong>ilk</strong> koşul çalışır.', '30 hem 50\'den hem 200\'den küçük. Hangisi önce geliyor?'],
    '<code>piksel &lt; 50</code> doğru; ilk yol çalışır ve gerisine bakılmaz → <strong>1</strong>.',
    { kod: 'piksel = 30;\nif piksel < 50\n    tur = 1;\nelseif piksel < 200\n    tur = 2;\nelse\n    tur = 3;\nend\ntur', beklenen: '1' });
  A('k10-12', KY, 3, ['yeni'], '<code>p</code> (hazır verildi) için: değeri 0 ise <code>tip</code> 1 olsun (biber), 255 ise <code>tip</code> 2 olsun (tuz), ikisi de değilse <code>tip</code> 3 olsun. <code>elseif</code> kullan.',
    ['Üç yol var: <code>if</code>, <code>elseif</code>, <code>else</code>.', '<code>elseif</code>\'in yanına koşulunu yaz: <code>elseif p == 255</code>.', 'Eşitlik sorusu çift eşittirle sorulur; sonda <code>end</code>.'],
    '<pre>if p == 0\n    tip = 1;\nelseif p == 255\n    tip = 2;\nelse\n    tip = 3;\nend</pre>',
    { onKod: 'p = 255;', cozumKod: 'if p == 0\n    tip = 1;\nelseif p == 255\n    tip = 2;\nelse\n    tip = 3;\nend', kontrol: { degiskenler: { tip: 2 }, icermeli: ['elseif\\s*\\(?\\s*p'] } });

  /* ============================================================ konu-11 */
  const K11 = 'A = [1 2; 3 4];\ntoplam = 0;\nfor i = 1:2\n    for j = 1:2\n        toplam = toplam + A(i,j);\n    end\nend\ntoplam';
  A('k11-01', CT, 1, ['sohbet'], 'Kod bitince <code>toplam</code> kaç olur?',
    ['Döngü 2 × 2 = 4 adım atar; her adımda bir piksel eklenir.'],
    '1 + 2 + 3 + 4 = <strong>10</strong>.',
    { kod: K11, beklenen: '10' });
  A('k11-02', CT, 2, ['sohbet', 'hata-odakli'], 'Aynı kodu tablo gibi takip et. <strong>3. adımdaki</strong> dört değeri sırayla yaz: <code>i</code>, <code>j</code>, <code>A(i,j)</code>, <code>toplam</code>. (1. adım: 1 1 1 1 · 2. adım: 1 2 2 3)',
    ['2. adımda <code>j</code> zaten 2 idi ve aralığı <code>1:2</code>. İç döngü bitince ne olur?', 'Dış döngü bir adım atar, iç döngü baştan başlar: i = 2, j = 1.', 'toplam, eski değerin (3) üstüne <code>A(2,1)</code> eklenerek bulunur.'],
    '<code>2 1 3 6</code>: i = 2, j = 1, A(2,1) = 3, toplam = 3 + 3 = 6. Tek sayı değil, dört değerin hepsi yazılmalı.',
    { hata: 'H20', kod: K11, beklenen: '2 1 3 6', otoDogrula: false });
  A('k11-03', CT, 2, ['sohbet', 'hata-odakli'], 'Aynı kodda 2. adımın sonunda <code>toplam</code> 3\'tü. 3. adımda <code>A(i,j)</code> = 3. <strong>3. adımın sonunda</strong> <code>toplam</code> kaç olur?',
    ['<code>toplam = toplam + A(i,j);</code> eski değere ekler.', 'İşlem: 3 + 3.'],
    '<strong>6</strong>. Kutudaki eski değer (3) silinmez; üstüne 3 eklenir. toplam 3\'te kalmaz.',
    { hata: 'H21', beklenen: '6' });
  A('k11-04', CT, 2, ['sohbet', 'hata-odakli'], 'Sohbette hiç yazılmayan <strong>4. adımı</strong> tamamla: <code>i</code>, <code>j</code>, <code>A(i,j)</code>, <code>toplam</code> (sırayla dört sayı).',
    ['3. adım i = 2, j = 1 idi. Önce hangisi artar?', 'j bir artar: j = 2. A(2,2) kaç?', '3. adımın sonunda toplam 6 idi.'],
    '<code>2 2 4 10</code>: j arttı, i aynı; A(2,2) = 4; toplam = 6 + 4 = 10.',
    { hata: 'H20', kod: K11, beklenen: '2 2 4 10', otoDogrula: false });
  A('k11-05', CT, 2, ['hata-odakli'], 'Kod bitince <code>t</code> kaç olur?',
    ['Başlangıç değeri 0 değil.', 'Turlar: 10 + 1, sonra üstüne 2, sonra üstüne 3.'],
    '10 + 1 = 11, 11 + 2 = 13, 13 + 3 = <strong>16</strong>. Her tur bir öncekinin sonucunun üstüne ekler.',
    { hata: 'H21', kod: 't = 10;\nfor i = 1:3\n    t = t + i;\nend\nt', beklenen: '16' });
  A('k11-06', KY, 2, ['sohbet'], 'Kodu sen yaz: <code>A = [10 20; 30 40];</code> için iç içe <code>for</code> kullanarak her pikseli 2 ile çarp, sonucu <code>yeni</code> adlı matrise kaydet.',
    ['Dış döngü satırlar (<code>i</code>), iç döngü sütunlar (<code>j</code>) için.', 'İçeride: <code>yeni(i,j) = A(i,j)*2;</code>', 'İki <code>for</code> için iki <code>end</code>.'],
    '<pre>A = [10 20; 30 40];\nfor i = 1:2\n    for j = 1:2\n        yeni(i,j) = A(i,j)*2;\n    end\nend</pre>Sonuç <code>[20 40; 60 80]</code>.',
    { baslangicKod: 'A = [10 20; 30 40];\n', cozumKod: 'A = [10 20; 30 40];\nfor i = 1:2\n    for j = 1:2\n        yeni(i,j) = A(i,j)*2;\n    end\nend', kontrol: { degiskenler: { yeni: [[20, 40], [60, 80]] }, icermeli: ['\\bfor\\b[\\s\\S]*\\bfor\\b'] } });
  A('k11-07', HB, 2, ['sohbet', 'hata-odakli'], 'İlk denemen. Piksel seçme yazımını ve eksik satırı düzelt; <code>yeni</code> = <code>[20 40; 60 80]</code> olmalı.',
    ['Matristen piksel seçerken hangi parantez ve hangi ayıraç kullanılıyordu? <code>A(2,3)</code> örneğine bak.', 'Kaç <code>for</code> var, kaç <code>end</code> var?'],
    '<code>yeni(i,j) = A(i,j)*2</code> (yuvarlak parantez, virgül) ve ikinci bir <code>end</code>.',
    { hata: 'H16', baslangicKod: 'A = [10 20; 30 40];\nfor i =1:2\nfor j=1:2\nyeni[i;j] = A[i;j]*2\nend', cozumKod: 'A = [10 20; 30 40];\nfor i =1:2\nfor j=1:2\nyeni(i,j) = A(i,j)*2;\nend\nend', kontrol: { degiskenler: { yeni: [[20, 40], [60, 80]] } } });
  A('k11-08', CS, 1, ['hata-odakli'], '<code>A</code> matrisinin 2. satır, 3. sütunundaki pikseli hangisi seçer?',
    ['Köşeli parantez ve <code>;</code> matris <strong>oluştururken</strong> kullanılır.'],
    '<code>A(2,3)</code>: yuvarlak parantez ve virgül.',
    { hata: 'H16', secenekler: ['<code>A[2;3]</code>', '<code>A[2,3]</code>', '<code>A(2,3)</code>', '<code>A(2;3)</code>'], dogru: 2 });
  A('k11-09', HB, 1, ['sohbet', 'hata-odakli'], 'Bu kodda parantezler doğru ama kod yine çalışmıyor. Eksiği tamamla.',
    ['<code>for</code>\'ları ve <code>end</code>\'leri say.', 'Her for kendi end\'ini ister.'],
    'İki <code>for</code> için iki <code>end</code> gerekir: ilki iç döngüyü, ikincisi dış döngüyü kapatır.',
    { hata: 'H17', baslangicKod: 'A = [10 20; 30 40];\nfor i = 1:2\n    for j = 1:2\n        yeni(i,j) = A(i,j)*2;\n    end', cozumKod: 'A = [10 20; 30 40];\nfor i = 1:2\n    for j = 1:2\n        yeni(i,j) = A(i,j)*2;\n    end\nend', kontrol: { degiskenler: { yeni: [[20, 40], [60, 80]] } } });
  A('k11-10', KC, 1, ['hata-odakli'], 'Bir kodda iç içe 2 <code>for</code> ve en içte 1 <code>if</code> var. Toplam kaç <code>end</code> gerekir? (Sayı yaz.)',
    ['Her <code>for</code> ve her <code>if</code> kendi <code>end</code>\'ini ister.'],
    '2 for + 1 if = <strong>3</strong> end.',
    { hata: 'H17', kabul: ['3', 'üç', 'uc'] });
  A('k11-11', HB, 1, ['sohbet', 'hata-odakli'], 'İkinci denemen: virgül ve <code>end</code> düzeldi, geriye tek bir karakter türü kaldı. Düzelt.',
    ['Matris oluştururken: <code>A = [10 20; 30 40]</code>. Matristen piksel seçerken: <code>A(2,3)</code>.', 'Hangi parantez türü gerekiyor?'],
    'Köşeli parantezler yuvarlak olmalı: <code>yeni(i,j) = A(i,j)*2</code>.',
    { hata: 'H18', baslangicKod: 'A = [10 20; 30 40];\nfor i =1:2\nfor j=1:2\nyeni[i,j] = A[i,j]*2\nend\nend\nyeni', cozumKod: 'A = [10 20; 30 40];\nfor i =1:2\nfor j=1:2\nyeni(i,j) = A(i,j)*2;\nend\nend\nyeni', kontrol: { degiskenler: { yeni: [[20, 40], [60, 80]] }, icermeli: ['yeni\\s*\\(\\s*i\\s*,\\s*j\\s*\\)'] } });
  A('k11-12', BD, 1, ['hata-odakli'], 'Dört boşluğa doğru parantezleri yaz.',
    ['Burada matris oluşturulmuyor, piksel seçiliyor.'],
    '<code>yeni(i,j) = A(i,j) + 5;</code> Piksel seçerken yuvarlak parantez.',
    { hata: 'H18', kod: 'yeni___i,j___ = A___i,j___ + 5;', bosluklar: [['('], [')'], ['('], [')']] });
  A('k11-13', CS, 1, ['sohbet', 'hata-odakli'], 'Döngü içindeki <code>yeni(i,j) = A(i,j)*2</code> satırının sonuna <code>;</code> koymazsan ne olur?',
    ['<code>;</code> yalnızca ekrana yazdırmayı bastırır.'],
    'Kod çalışır; hata değildir. Ama <code>yeni</code> matrisi <strong>her turda</strong> ekrana yazılır.',
    { hata: 'H19', secenekler: ['Kod hata verir', 'Kod çalışır ama matris her turda ekrana yazılır', 'Sonuç yanlış çıkar', 'Döngü yalnızca bir kez döner'], dogru: 1 });
  A('k11-14', KC, 2, ['hata-odakli'], 'Hocanın kodunda döngü 254 × 254 = 64.516 tur döner. 2×2\'lik <code>A</code> için yazdığın döngüde ise içerideki satırda <code>;</code> yoksa <code>yeni</code> matrisi döngü boyunca kaç kez ekrana yazılır? (Sayı yaz.)',
    ['Kaç tur dönüyor? Satır × sütun.'],
    '2 × 2 = <strong>4</strong> tur, her turda bir kez → 4 kez. Bu yüzden döngü içindeki satırlara <code>;</code> konur.',
    { hata: 'H19', kabul: ['4', 'dört', 'dort'] });
  A('k11-15', CT, 2, ['sohbet'], 'Bu kodda <strong>4. adımda</strong> <code>i</code> ve <code>j</code> kaçtır? (Sırayla iki sayı.)',
    ['İlk üç adım: (1,1), (1,2), (1,3).', '3. adımda j bitti. Sonra i artar, j başa döner.'],
    '<code>2 1</code>: j 3\'e ulaşınca iç döngü biter; i 2 olur, j 1\'e döner. O adımda <code>yeni(2,1) = 40 + 5 = 45</code>.',
    { kod: 'A = [10 20 30; 40 50 60];\n[w,h] = size(A);\nfor i = 1:w\n    for j = 1:h\n        yeni(i,j) = A(i,j) + 5;\n    end\nend', beklenen: '2 1', otoDogrula: false });
  A('k11-16', CS, 2, ['sohbet'], '<code>w = 256</code> iken <code>for i=1:w-2</code> döngüsünde <code>i</code> en fazla kaç olur ve neden?',
    ['<code>i:i+2</code> hangi satırları ister?', 'i = 255 olsaydı son satır 257 olurdu.'],
    '254. O zaman <code>i:i+2</code> = <code>254:256</code> olur ve pencere resimden taşmaz.',
    { secenekler: ['256; bütün satırlar gezilir', '255; son satır atlanır', '254; 3×3 pencere taşmasın diye', '2; w-2 = 2 demektir'], dogru: 2 });

  /* ============================================================ konu-12 */
  A('k12-01', CT, 1, ['sohbet'], 'Ekranda hangi sayı görünür?',
    ['Gerçek sonuç 260. uint8 kutusu en fazla kaç tutar?'],
    '250 + 10 = 260, üst sınırda kesilir → <strong>255</strong>.',
    { kod: 'x = uint8(250);\nx + 10', beklenen: '255' });
  A('k12-02', CT, 2, ['sohbet', 'hata-odakli'], 'Ekranda hangi sayı görünür?',
    ['uint8 hangi sayı aralığını tutabiliyordu?', 'Aralığın altına inen bir sonuç olursa MATLAB ne yapıyordu? 20\'nin düz yazılması sonucu değiştirmez.'],
    'Matematikte −10; ama sonuç uint8 kutusuna konur ve alt sınıra kesilir → <strong>0</strong>.',
    { hata: 'H22', kod: 'uint8(10) - 20', beklenen: '0' });
  A('k12-03', CS, 1, ['hata-odakli'], '<code>uint8(5) - 100</code> işleminin sonucu nedir?',
    ['uint8 negatif sayı tutabilir mi?'],
    '<strong>0</strong>. uint8 ile yapılan işlemin sonucu yine uint8\'dir; −95 alt sınıra, yani 0\'a kesilir.',
    { hata: 'H22', secenekler: ['−95', '95', '0', '255'], dogru: 2 });
  A('k12-04', CT, 2, ['sohbet', 'hata-odakli'], 'Ekranda hangi sayı görünür?',
    ['Önce toplama: 220 + 60 kutuya sığar mı?', '255 / 2 = 127.5. uint8 ondalıklı sayı tutabilir mi? <code>uint8(3.6)</code> örneğinde ne olmuştu?'],
    '280 → 255\'e kesilir; 255 / 2 = 127.5; sonuç yine uint8 olduğu için yukarı yuvarlanır → <strong>128</strong>.',
    { hata: 'H23', kod: 'a = uint8(220);\nb = uint8(60);\n(a + b) / 2', beklenen: '128' });
  A('k12-05', CT, 1, ['sohbet'], 'Ekranda hangi sayı görünür?',
    ['Önce <code>double</code>: artık taşma yok.'],
    '(220 + 60) / 2 = 280 / 2 = <strong>140</strong>. Gerçek ortalama budur; uint8 hesabı 128 vermişti.',
    { kod: 'a = uint8(220);\nb = uint8(60);\n(double(a) + double(b)) / 2', beklenen: '140' });
  A('k12-06', CT, 2, ['hata-odakli'], 'Ekranda hangi sayı görünür?',
    ['Matematikte 3.5. Sonucun türü ne?', 'uint8 ondalık tutmaz; buçuk yukarı yuvarlanır.'],
    '7 / 2 = 3.5; sonuç uint8 olduğu için yuvarlanır → <strong>4</strong>.',
    { hata: 'H23', kod: 'uint8(7) / 2', beklenen: '4' });
  A('k12-07', CS, 2, ['sohbet', 'hata-odakli'], '<code>uint8(10) - 20</code> neden <strong>10</strong> değildir?',
    ['Eksi işaretini atan komut hangisiydi?', 'Sayı doğrusu: −10 izin verilen bölgenin hangi tarafında, en yakın sınır hangisi?'],
    'uint8 işareti atmaz (o <code>abs</code>\'in işi); sonucu izin verilen aralığın en yakın sınırına çeker. −10 için en yakın sınır 0.',
    { hata: 'H24', secenekler: ['Çünkü uint8 eksi işaretini atar ve 10 olur', 'Çünkü uint8 işareti atmaz; sonucu en yakın sınıra (0) çeker', 'Çünkü sonuç 255 olur', 'Çünkü MATLAB hata verir'], dogru: 1 });
  A('k12-08', CT, 2, ['hata-odakli'], 'İki satırın sonucunu sırayla yaz.',
    ['İlki işareti atar.', 'İkincisi sınıra çeker.'],
    '<code>abs(10 - 20)</code> = 10 (işaret atıldı). <code>uint8(10) - 20</code> = 0 (alt sınıra kesildi). Cevap: <code>10 0</code>.',
    { hata: 'H24', kod: 'abs(10 - 20)\nuint8(10) - 20', beklenen: '10 0' });
  A('k12-09', HB, 1, ['hata-odakli'], 'Bu kod <code>Unrecognized function or variable</code> hatası veriyor. Yazım hatasını düzelt; <code>y</code> doğru hesaplanmalı.',
    ['Komutun adını harf harf oku.', 'u-int-8.'],
    '<code>unit8</code> değil <code>uint8</code>. Düzeltince y = 200 + 100 → 255 (taşma).',
    { hata: 'H25', baslangicKod: 'x = unit8(200);\ny = x + 100', cozumKod: 'x = uint8(200);\ny = x + 100', kontrol: { degiskenler: { y: 255 }, icermeli: ['uint8'] } });
  A('k12-10', CS, 1, ['hata-odakli'], '0–255 arası tam sayı türünün adı hangisidir?',
    ['"unsigned integer, 8 bit" sözünün kısaltması.'],
    '<code>uint8</code>. <code>unit8</code> yazılırsa MATLAB tanımaz ve hata verir.',
    { hata: 'H25', secenekler: ['<code>unit8</code>', '<code>uint8</code>', '<code>int8u</code>', '<code>uin8t</code>'], dogru: 1 });
  A('k12-11', KY, 2, ['sohbet'], '<code>a</code> ve <code>b</code> uint8 türünde iki piksel (hazır verildi: 200 ve 100). Gerçek ortalamalarını (150) <code>ort</code> değişkenine yaz.',
    ['<code>(a + b) / 2</code> yazarsan toplama taşar ve 128 çıkar.', 'Toplamadan önce ikisini de <code>double</code> yap.'],
    '<code>ort = (double(a) + double(b)) / 2;</code> → 300 / 2 = 150.',
    { onKod: 'a = uint8(200);\nb = uint8(100);', cozumKod: 'ort = (double(a) + double(b)) / 2;', kontrol: { degiskenler: { ort: 150 }, icermeli: ['double'] } });
  A('k12-12', CT, 1, ['yeni'], 'Ekranda hangi sayı görünür?',
    ['uint8 tam sayı tutar; en yakın tam sayıya yuvarlar.'],
    '3.6 → <strong>4</strong>.',
    { kod: 'uint8(3.6)', beklenen: '4' });
  A('k12-13', BD, 1, ['sohbet'], 'Boşlukları doldur: uint8 kutusunun tutabildiği en küçük ve en büyük sayı.',
    ['8 bit ile 256 farklı değer tutulur; sayma 0\'dan başlar.'],
    '0 ve 255. Aralığın dışına çıkan sonuçlar bu sınırlara kesilir.',
    { kod: 'en kucuk = ___\nen buyuk = ___', bosluklar: [['0'], ['255']] });
  A('k12-14', CS, 2, ['sohbet'], 'Hocanın kodunda <code>ortalama</code> matrisi neden <code>uint8(ortalama)</code> yapılarak gösteriliyor?',
    ['<code>mean</code> sonucu hangi türde verir?', '<code>imshow</code> double resmi hangi ölçekte bekler?'],
    '<code>mean</code> double verir; değerler 0–255 arasında ama <code>imshow</code> double resmi 0–1 ölçeğinde yorumlar ve çoğu pikseli beyaz gösterir. <code>uint8(...)</code> ölçeği 0–255\'e çevirir.',
    { secenekler: ['Resmi küçültmek için', 'double resim 0–1 ölçeğinde yorumlandığı için neredeyse bembeyaz görünürdü', 'Gürültüyü temizlemek için', '<code>imshow</code> double resim gösteremediği için'], dogru: 1 });

  /* ============================================================ konu-13 */
  A('k13-01', CS, 2, ['sohbet', 'hata-odakli'], '<code>subplot(2,3,5)</code> hangi bölmeyi seçer?',
    ['2 satır, 3 sütunluk bir kutu çiz ve 1\'den 6\'ya kadar numara ver.', 'Kitap okur gibi: üst satır 1 2 3. Alt satır hangi sayıyla başlar?'],
    'Üst satır 1 2 3, alt satır 4 5 6. 5 numara <strong>2. satır, 2. sütun</strong> (orta alt).',
    { hata: 'H26', secenekler: ['1. satır, 3. sütun', '2. satır, 2. sütun', '2. satır, 3. sütun', '3. satır, 2. sütun'], dogru: 1 });
  A('k13-02', CT, 1, ['sohbet', 'hata-odakli'], '<code>subplot(2,3,...)</code> düzeninde üst satırın numaraları 1 2 3. <strong>Alt satırdaki</strong> üç bölmenin numaralarını sırayla yaz.',
    ['Üst satırın son kutusunda zaten 3 var.', 'Aynı numara iki kutuya verilmez.'],
    '<code>4 5 6</code>. Alt satır, 3\'ten sonraki sayıyla başlar.',
    { hata: 'H26', beklenen: '4 5 6' });
  A('k13-03', KC, 1, ['sohbet'], 'Bu kod çalışınca kaç resim penceresi açılır? (Sayı yaz.)',
    ['Pencereyi açan komut hangisi? Kaç kez yazılmış?'],
    '<code>figure</code> iki kez yazıldığı için <strong>2</strong> pencere.',
    { kod: 'res = imread("cameraman.tif");\nres(1,1)\nfigure, imshow(res)\nfigure, imshow(res)', kabul: ['2', 'iki'] });
  A('k13-04', CS, 1, ['sohbet'], 'Yalnızca <code>res = imread("cameraman.tif");</code> yazıp bıraksaydık ekranda resim görünür müydü?',
    ['<code>imread</code> ne yapar, <code>imshow</code> ne yapar?'],
    'Hayır. <code>imread</code> resmi yalnızca okur ve hafızaya alır; göstermek için <code>imshow</code> gerekir.',
    { secenekler: ['Evet, imread resmi gösterir', 'Hayır; resim yalnızca okunur, göstermek için imshow gerekir', 'Evet, ama siyah beyaz görünür', 'Hayır, çünkü satır ; ile bitiyor'], dogru: 1 });
  A('k13-05', CS, 2, ['sohbet'], '<code>B = [10 20; 30 40];</code> için <code>imshow(B)</code> neden tamamen beyaz görünür?',
    ['Normal yazdığın sayılar hangi türdedir?', 'O türde <code>imshow</code> hangi ölçeği kullanır?'],
    'B double türündedir; ölçek 0–1\'dir. 10, 20, 30, 40 hepsi 1\'den büyük olduğu için dört piksel de beyaz görünür.',
    { secenekler: ['Çünkü B çok küçük bir resim', 'Çünkü B double; ölçek 0–1 ve bütün sayılar 1\'den büyük', 'Çünkü figure yazılmadı', 'Çünkü 40, 255\'ten küçük'], dogru: 1 });
  A('k13-06', CS, 2, ['sohbet', 'hata-odakli'], '<code>C = [0 50 100];</code> için <code>imshow(C,[])</code> üç pikseli sırayla nasıl gösterir?',
    ['<code>[]</code> yazınca MATLAB en küçük ve en büyük sayıya bakar.', 'En küçük siyah, en büyük beyaz, kalan arada.'],
    '0 → siyah (en küçük), 50 → gri (arada), 100 → beyaz (en büyük). Her pikseli tek tek söylemek gerekir.',
    { hata: 'H27', secenekler: ['siyah, beyaz, beyaz', 'siyah, gri, beyaz', 'siyah, siyah, gri', 'gri, gri, beyaz'], dogru: 1 });
  A('k13-07', CS, 2, ['hata-odakli'], '<code>D = [100 300 200];</code> için <code>imshow(D,[])</code> üç pikseli sırayla nasıl gösterir?',
    ['En küçük hangisi, en büyük hangisi?'],
    '100 en küçük → siyah; 300 en büyük → beyaz; 200 arada → gri.',
    { hata: 'H27', secenekler: ['beyaz, beyaz, beyaz', 'siyah, gri, beyaz', 'siyah, beyaz, gri', 'gri, beyaz, siyah'], dogru: 2 });
  A('k13-08', KC, 1, ['sohbet', 'hata-odakli'], '<code>B = [10 20; 30 40];</code> için <code>imshow(B,[])</code> yazınca <strong>beyaz</strong> görünen pikselin değeri kaçtır?',
    ['255 değil. Ölçek matrisin kendi sayılarına göre ayarlanır.'],
    '<strong>40</strong>: matristeki en büyük sayı beyaz olur.',
    { hata: 'H28', kabul: ['40'] });
  A('k13-09', CS, 1, ['hata-odakli'], '<code>imshow(X,[])</code> yazıldığında beyaz hangi değerdir?',
    ['Boş köşeli parantez "ölçeği kendin bul" demektir.'],
    'Matristeki <strong>en büyük sayı</strong>. 255 olmak zorunda değil; en küçük sayı da siyah olur.',
    { hata: 'H28', secenekler: ['Her zaman 255', 'Her zaman 1', 'Matristeki en büyük sayı', 'Matristeki ortalama'], dogru: 2 });
  A('k13-10', BD, 1, ['sohbet'], 'Üç resim tek pencerede yan yana: solda J, ortada medyanlı, sağda ortalamalı. Boşlukları doldur.',
    ['1 satır, 3 sütun. Bölmeler soldan sağa numaralanır.'],
    '1, 2, 3. J birinci, medyanlı ikinci, ortalamalı üçüncü bölmeye gider.',
    { kod: 'figure\nsubplot(1,3,___), imshow(J)\nsubplot(1,3,___), imshow(uint8(medyanli))\nsubplot(1,3,___), imshow(uint8(ortalama))', bosluklar: [['1'], ['2'], ['3']] });
  A('k13-11', KY, 2, ['sohbet'], '<code>medyanli</code> ve <code>ortalama</code> matrisleri hazır (hafızada). İkisini <strong>tek pencerede yan yana</strong> gösteren kodu yaz: önce <code>figure</code>, sonra solda <code>uint8(medyanli)</code>, sağda <code>uint8(ortalama)</code>.',
    ['Tek pencere: <code>figure</code> bir kez.', '1 satır, 2 sütun: <code>subplot(1,2,1)</code> ve <code>subplot(1,2,2)</code>.', 'Virgülle aynı satıra: <code>subplot(1,2,1), imshow(uint8(medyanli))</code>'],
    '<pre>figure\nsubplot(1,2,1), imshow(uint8(medyanli))\nsubplot(1,2,2), imshow(uint8(ortalama))</pre>',
    { onKod: 'medyanli = [50 60; 90 100];\nortalama = [66.1 73.9; 99.4 107.2];', cozumKod: 'figure\nsubplot(1,2,1), imshow(uint8(medyanli))\nsubplot(1,2,2), imshow(uint8(ortalama))', kontrol: { icermeli: ['figure', 'subplot\\s*\\(\\s*1\\s*,\\s*2\\s*,\\s*1\\s*\\)[\\s\\S]*medyanli', 'subplot\\s*\\(\\s*1\\s*,\\s*2\\s*,\\s*2\\s*\\)[\\s\\S]*ortalama', 'imshow'] } });
  A('k13-12', HB, 3, ['sohbet', 'hata-odakli'], 'Bu kod <code>Unrecognized function or variable \'medyanli\'</code> hatası veriyor, çünkü <code>medyanli</code>\'yi oluşturan satırlar yok. Gösterme satırından <strong>önce</strong> eksik döngüyü ekle (3×3 pencere, <code>median</code>).',
    ['Tarifin son adımı var, önceki adımlar yok.', 'Önce <code>[w,h]=size(J);</code>, sonra <code>for i=1:w-2</code> ve <code>for j=1:h-2</code>.', 'İçeride: <code>blok=J(i:i+2,j:j+2); medyanli(i,j)=median(blok(:));</code> ve iki <code>end</code>.'],
    '<pre>[w,h]=size(J);\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+2,j:j+2);\n        medyanli(i,j)=median(blok(:));\n    end\nend</pre>Bu satırlar gösterme satırından önce gelmeli. Sonuç <code>[50 60; 90 100]</code>.',
    { hata: 'H29', baslangicKod: 'J = [10 20 30 40; 50 255 60 70; 80 90 0 100; 110 120 130 140];\n\nfigure, imshow(uint8(medyanli))', cozumKod: 'J = [10 20 30 40; 50 255 60 70; 80 90 0 100; 110 120 130 140];\n[w,h]=size(J);\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+2,j:j+2);\n        medyanli(i,j)=median(blok(:));\n    end\nend\nfigure, imshow(uint8(medyanli))', kontrol: { degiskenler: { medyanli: [[50, 60], [90, 100]] }, icermeli: ['imshow'] } });
  A('k13-13', CS, 1, ['sohbet', 'hata-odakli'], '<code>Unrecognized function or variable \'medyanli\'.</code> mesajı ne demektir?',
    ['Konu 2\'de <code>clear all</code> sonrası <code>piksel</code> için aynı mesaj görülmüştü.'],
    '"medyanli diye bir şey tanımıyorum": hafızada o değişken yok. Onu oluşturan satırlar (for döngüleri) çalıştırılmamış.',
    { hata: 'H29', secenekler: ['Resim dosyası bulunamadı', 'Hafızada medyanli adında bir değişken yok; onu oluşturan satırlar çalışmamış', 'medyanli matrisi çok büyük', 'imshow komutu yanlış yazılmış'], dogru: 1 });
  A('k13-14', KY, 2, ['sohbet'], 'Kodu yaz: <code>"cameraman.tif"</code> resmini <code>res</code> değişkenine oku, boyutlarını <code>w</code> ve <code>h</code> değişkenlerine al. Sonra <strong>tek pencerede</strong> solda resmin kendisini, sağda negatifini (<code>255 - res</code>) göster.',
    ['<code>res = imread("cameraman.tif");</code> ve <code>[w,h] = size(res);</code>', '<code>figure</code>, sonra <code>subplot(1,2,1), imshow(res)</code>', 'Sağ bölme: <code>subplot(1,2,2), imshow(255 - res)</code>'],
    '<pre>res = imread("cameraman.tif");\n[w,h] = size(res);\nfigure\nsubplot(1,2,1), imshow(res)\nsubplot(1,2,2), imshow(255 - res)</pre>',
    { cozumKod: 'res = imread("cameraman.tif");\n[w,h] = size(res);\nfigure\nsubplot(1,2,1), imshow(res)\nsubplot(1,2,2), imshow(255 - res)', kontrol: { degiskenler: { w: 256, h: 256 }, icermeli: ['imread', 'subplot\\s*\\(\\s*1\\s*,\\s*2\\s*,\\s*1\\s*\\)', 'subplot\\s*\\(\\s*1\\s*,\\s*2\\s*,\\s*2\\s*\\)', '255\\s*-\\s*res'] } });

  /* ============================================================ hoca-kodu */
  const J5 = 'J = [10 20 30 40 50; 60 255 70 80 90; 100 110 0 120 130; 140 150 160 170 180; 190 200 210 220 230];';
  A('hk-01', CS, 2, ['sohbet', 'hata-odakli'], '<code>imnoise</code> satırında <code>0.02</code> yerine <code>0.10</code> yazsaydık 65.536 pikselin yaklaşık kaçı bozulurdu?',
    ['0.02 için 65.536 × 0.02 ≈ 1.300 yapılmıştı. Aynı çarpma.', '0.10 yüzde 10 demektir, yani sayının onda biri.'],
    '65.536 × 0.10 ≈ <strong>6.550</strong> piksel. Resim daha fazla kirlenir.',
    { hata: 'H30', secenekler: ['Yaklaşık 130', 'Yaklaşık 1.300', 'Yaklaşık 6.550', 'Yaklaşık 65.000'], dogru: 2 });
  A('hk-02', KC, 1, ['sohbet', 'hata-odakli'], '<code>0.10</code> gürültü oranı, <code>0.02</code>\'ye göre kaç kat daha fazla nokta demektir? (Sayı yaz.)',
    ['0.10 / 0.02'],
    '<strong>5</strong> kat (1.300 → 6.550).',
    { hata: 'H30', kabul: ['5', 'beş', 'bes', '5 kat'] });
  A('hk-03', KY, 2, ['sohbet'], '<code>p</code> adlı piksel hazır verildi. Değeri 0 veya 255 ise <code>gurultu = 1</code> olsun, değilse <code>gurultu = 0</code> olsun. <code>if</code> yapısının tamamını yaz.',
    ['Koşul: <code>p == 0 || p == 255</code>', 'İskelet: <code>if</code> … <code>else</code> … <code>end</code>', 'Değişkenin adı soruda verildi: <code>gurultu</code>.'],
    '<pre>if p == 0 || p == 255\n    gurultu = 1;\nelse\n    gurultu = 0;\nend</pre>',
    { onKod: 'p = 255;', cozumKod: 'if p == 0 || p == 255\n    gurultu = 1;\nelse\n    gurultu = 0;\nend', kontrol: { degiskenler: { gurultu: 1 }, icermeli: ['\\bif\\b', '\\bend\\b'] } });
  A('hk-04', HB, 1, ['sohbet', 'hata-odakli'], 'Senin yazdığın kod: koşul ve <code>else</code> doğru, ama bir satır eksik. Tamamla (<code>p</code> hazır verildi, değeri 0).',
    ['MATLAB, if yapısının bittiğini nasıl anlıyordu?', 'Bu hata Konu 10\'da da düzeltilmişti.'],
    'Sona <code>end</code> eklenir. p = 0 için <code>g = 1</code>.',
    { hata: 'H31', onKod: 'p = 0;', baslangicKod: 'if p==0 || p==255\ng=1\nelse\ng=0', cozumKod: 'if p==0 || p==255\ng=1\nelse\ng=0\nend', kontrol: { degiskenler: { g: 1 } } });
  A('hk-05', BD, 1, ['hata-odakli'], 'Eksik kelimeyi yaz.',
    ['Her <code>if</code> bu kelimeyle kapanır.'],
    '<code>end</code>.',
    { hata: 'H31', kod: 'if p==0 || p==255\n    g=1;\nelse\n    g=0;\n___', bosluklar: [['end']] });
  A('hk-06', HB, 1, ['sohbet', 'hata-odakli'], 'Bu kod hata veriyor: bir kelime yanlış yazılmış. Düzelt (<code>p</code> hazır verildi, değeri 100).',
    ['Son satırı harf harf oku.'],
    '<code>edn</code> değil <code>end</code>. p = 100 için <code>g = 0</code>.',
    { hata: 'H32', onKod: 'p = 100;', baslangicKod: 'if p==0 || p==255\ng=1\nelse\ng=0\nedn', cozumKod: 'if p==0 || p==255\ng=1\nelse\ng=0\nend', kontrol: { degiskenler: { g: 0 }, icermemeli: ['\\bedn\\b'] } });
  A('hk-07', CS, 1, ['hata-odakli'], '<code>end</code> yerine <code>edn</code> yazarsan ne olur?',
    ['MATLAB yazım hatasını kendisi düzeltir mi?'],
    'MATLAB yanlış yazılmış kelimeyi tanımaz ve hata verir.',
    { hata: 'H32', secenekler: ['MATLAB kendisi düzeltir', 'Kod çalışır ama yavaşlar', 'MATLAB kelimeyi tanımaz ve hata verir', 'if yapısı iki kez çalışır'], dogru: 2 });
  A('hk-08', CT, 2, ['sohbet', 'hata-odakli'], '5×5\'lik J\'de <code>i=1, j=2</code> iken <code>blok</code> hangi 9 sayıdan oluşur? Sayıları <strong>aralarında boşlukla</strong>, satır satır yaz.',
    ['<code>J(i:i+2, j:j+2)</code> içinde i ve j yerine sayıları koy: <code>J(1:3, 2:4)</code>.', '1-3. satırlar ile 2-4. sütunların kesişimi.'],
    '<code>20 30 40; 255 70 80; 110 0 120</code>. Bitişik yazma: <code>[20 30]</code> iki sayıdır, <code>[2030]</code> tek sayıdır.',
    { hata: 'H33', kod: J5 + '\ni = 1;\nj = 2;\nblok = J(i:i+2, j:j+2)', beklenen: '20 30 40; 255 70 80; 110 0 120' });
  A('hk-09', CT, 1, ['hata-odakli'], 'Ekranda hangi iki sayı görünür? (Her vektörün eleman sayısı.)',
    ['Boşluk iki sayıyı ayırır. Boşluk yoksa?'],
    '<code>[20 30]</code> iki sayıdır, <code>[2030]</code> tek sayıdır → <code>2 1</code>.',
    { hata: 'H33', kod: 'a = [20 30];\nb = [2030];\nnumel(a)\nnumel(b)', beklenen: '2 1' });
  A('hk-10', CT, 2, ['sohbet'], 'Aynı blok için <code>medyanli(1,2)</code> kaç olur?',
    ['9 sayıyı küçükten büyüğe sırala.', '5. sıradakini al.'],
    'Sıralı: <code>0 20 30 40 70 80 110 120 255</code>; 5. sayı <strong>70</strong>. İki parazit uçlara gitti. (Ortalama 725 / 9 ≈ 80.56 olurdu.)',
    { kod: J5 + '\nblok = J(1:3, 2:4);\nmedian(blok(:))', beklenen: '70' });
  A('hk-11', CS, 2, ['sohbet', 'hata-odakli'], '<code>uint8</code> yazmadan sadece <code>imshow(ortalama)</code> yazsaydık resim neden neredeyse bembeyaz görünürdü?',
    ['<code>ortalama</code> hangi türde?', 'O türde beyaz hangi sayı?'],
    '<code>ortalama</code> double\'dır; <code>imshow</code> 0–1 ölçeğini kullanır ve <strong>1 ile üstündeki</strong> her piksel beyaz görünür. Değerler 0–255 arasında olduğu için neredeyse hepsi beyazdır.',
    { hata: 'H35', secenekler: ['Çünkü ortalama filtresi resmi beyazlatır', 'Çünkü double resimde ölçek 0–1; 1 ve üstündeki her piksel beyaz görünür', 'Çünkü figure yazılmamış', 'Çünkü ortalama matrisi 254×254'], dogru: 1 });
  A('hk-12', CS, 2, ['hata-odakli'], 'double türünde bir resimde değeri <code>0.5</code> olan piksel <code>imshow</code> ile nasıl görünür?',
    ['double ölçeği: 0 siyah, 1 beyaz.'],
    '<strong>Gri</strong>. "0 hariç her şey beyaz" tam doğru değildir: 0 ile 1 arası gri, 1 ve üstü beyazdır.',
    { hata: 'H35', secenekler: ['Siyah', 'Gri', 'Beyaz', 'Görünmez'], dogru: 1 });
  A('hk-13', KC, 1, ['sohbet'], '5×5\'lik J resminde <code>medyanli</code> matrisi kaç satır, kaç sütun olur? (<code>3x3</code> biçiminde yaz.)',
    ['<code>w-2</code> kaç eder?'],
    '<code>w-2 = 3</code> ve <code>h-2 = 3</code> → <strong>3×3</strong>.',
    { kabul: ['3x3', '3×3', '3 3', '3*3', '3 x 3'], regex: '^3\\s*(x|×|\\*|,|e|\\s)\\s*3$' });
  A('hk-14', CS, 1, ['sohbet', 'hata-odakli'], 'Soruda değişken adı <code>gurultu</code> istenmişti; sen <code>g</code> yazdın. Kod çalışır mı?',
    ['MATLAB için değişken adı neyi değiştirir?'],
    'Çalışır; isim senin seçimin. Ama sınavda soru bir ad veriyorsa o adı kullanmak gerekir.',
    { hata: 'H34', secenekler: ['Çalışmaz; ad gurultu olmak zorunda', 'Çalışır; isim serbesttir, ama soruda ad verildiyse onu kullanmalısın', 'Çalışır ama sonuç yanlış olur', 'Yalnızca tek harfli adlar çalışır'], dogru: 1 });
  A('hk-15', CS, 1, ['hata-odakli'], '<code>g=1</code> satırının sonuna <code>;</code> koymazsan ne olur?',
    ['<code>;</code> yalnızca neyi bastırır?'],
    'Hata çıkmaz; sonuç yalnızca ekrana yazılır (<code>g = 1</code>).',
    { hata: 'H34', secenekler: ['Hata verir', 'Sonuç ekrana yazılır, hata çıkmaz', 'g değişkeni oluşmaz', 'if yapısı kapanmaz'], dogru: 1 });
  A('hk-16', BD, 2, ['sohbet'], 'Hocanın kodunun kalbi. Boşlukları doldur (3×3 pencere, önce ortanca sonra ortalama).',
    ['Pencere 3 satır alır: <code>i</code>, <code>i+1</code>, <code>i+?</code>', 'Aynı sayı döngü sınırında da var.', 'Ortanca: <code>median</code>; ortalama: <code>mean</code>.'],
    '<code>w-2</code>, <code>h-2</code>, <code>i+2</code>, <code>j+2</code>, <code>median</code>, <code>mean</code>.',
    { kod: 'for i=1:w-___\n    for j=1:h-___\n        blok=J(i:i+___,j:j+___);\n        medyanli(i,j)=___(blok(:));\n        ortalama(i,j)=___(blok(:));\n    end\nend', bosluklar: [['2'], ['2'], ['2'], ['2'], ['median'], ['mean']] });
  A('hk-17', CS, 1, ['yeni'], '<code>J = imnoise(res,\'salt &amp; pepper\', 0.02);</code> satırından sonra <code>res</code> değişir mi?',
    ['Sonuç hangi kutuya konuyor?'],
    'Hayır. Gürültülü resim <code>J</code> kutusuna konur; <code>res</code> değişmeden kalır.',
    { secenekler: ['Evet, res de gürültülü olur', 'Hayır; sonuç J\'ye konur, res aynı kalır', 'Evet, res silinir', 'res boyutu küçülür'], dogru: 1 });
  A('hk-18', CS, 2, ['sohbet'], 'Hocanın kodunda sonuç resmi neden 256×256 değil de 254×254 olur?',
    ['<code>j</code> 255 olsaydı <code>j:j+2</code> hangi sütunları isterdi?'],
    'Pencere taşmasın diye <code>i</code> ve <code>j</code> en fazla 254 olur (<code>1:w-2</code>). 254 × 254 adım → 254×254 sonuç.',
    { secenekler: ['imnoise resmi küçülttüğü için', '3×3 pencere taşmasın diye döngü 1:w-2 gittiği için', 'uint8 dönüşümü 2 satır sildiği için', 'median 2 pikseli attığı için'], dogru: 1 });

  /* ============================================================ kagit */
  const J4 = 'J = [10 20 30 40; 50 255 60 70; 80 90 0 100; 110 120 130 140];';
  A('kg-01', CT, 1, ['sohbet'], '4×4\'lük J için ekranda görünen <code>w</code> ve <code>h</code> değerlerini sırayla yaz.',
    ['<code>size</code> önce satır, sonra sütun sayısını verir.'],
    '<code>w = 4</code>, <code>h = 4</code>.',
    { kod: J4 + '\n[w,h]=size(J)', beklenen: '4 4' });
  A('kg-02', KC, 1, ['sohbet'], 'Bu resimde <code>for i=1:w-2</code> döngüsünde <code>i</code> en fazla kaç olur? (Sayı yaz.)',
    ['<code>w-2</code> = 4 − 2.'],
    '<code>1:w-2</code> = <code>1:2</code>; i ve j 1 ile 2 arasında gider → en fazla <strong>2</strong>. Toplam 2 × 2 = 4 adım.',
    { kabul: ['2', 'iki'] });
  A('kg-03', CT, 2, ['sohbet', 'hata-odakli'], '1. adım (<code>i=1, j=1</code>): <code>J(1:3, 1:3)</code> bloğundaki 9 sayıyı <strong>küçükten büyüğe sıralanmış</strong> hâliyle, aralarında boşlukla yaz. (Tarif etme, sayıları yaz.)',
    ['Blok: 10 20 30 / 50 255 60 / 80 90 0.', 'En küçük 0, en büyük 255.'],
    '<code>0 10 20 30 50 60 80 90 255</code>. 5. sayı 50, yani <code>medyanli(1,1) = 50</code>.',
    { hata: 'H36', beklenen: '0 10 20 30 50 60 80 90 255' });
  A('kg-04', CT, 1, ['sohbet'], '<code>medyanli(1,1)</code> kaç olur?',
    ['Sıralı hâli: 0 10 20 30 50 60 80 90 255. 5. sayı?'],
    '<strong>50</strong>.',
    { kod: J4 + '\nblok = J(1:3, 1:3);\nmedian(blok(:))', beklenen: '50' });
  A('kg-05', CT, 2, ['yeni', 'sohbet'], 'Sohbetin cevapsız kalan son sorusu: <strong>2. adımda</strong> <code>i</code> ve <code>j</code> kaç olur? (Sırayla iki sayı.)',
    ['Önce j artar, i sabit kalır.'],
    '<code>1 2</code>: i = 1, j = 2. Kesilen parça <code>J(1:3, 2:4)</code>.',
    { beklenen: '1 2' });
  A('kg-06', CT, 2, ['yeni', 'hata-odakli'], '2. adımda kesilen <code>J(1:3, 2:4)</code> bloğunun 9 sayısını satır satır, aralarında boşlukla yaz.',
    ['1-3. satırlar, 2-4. sütunlar.', 'İlk satırı: 20 30 40.'],
    '<code>20 30 40; 255 60 70; 90 0 100</code>.',
    { hata: 'H36', kod: J4 + '\nblok = J(1:3, 2:4)', beklenen: '20 30 40; 255 60 70; 90 0 100' });
  A('kg-07', CT, 2, ['yeni'], '2. adım: <code>medyanli(1,2)</code> kaç olur?',
    ['Sırala: 0 20 30 40 … 255.', '5. sayıyı al.'],
    'Sıralı: <code>0 20 30 40 60 70 90 100 255</code> → <strong>60</strong>.',
    { kod: J4 + '\nblok = J(1:3, 2:4);\nmedian(blok(:))', beklenen: '60' });
  A('kg-08', CT, 2, ['yeni'], '<strong>3. adım:</strong> <code>i</code>, <code>j</code> ve <code>medyanli(i,j)</code> değerlerini sırayla yaz (üç sayı).',
    ['2. adımda j = 2 idi; j bitti. Şimdi ne artar, ne başa döner?', 'i = 2, j = 1 → <code>J(2:4, 1:3)</code>: 50 255 60 / 80 90 0 / 110 120 130.', 'Sıralı: 0 50 60 80 ? 110 120 130 255.'],
    '<code>2 1 90</code>. Sıralı hâli <code>0 50 60 80 90 110 120 130 255</code>, 5. sayı 90.',
    { beklenen: '2 1 90' });
  A('kg-09', CT, 2, ['yeni'], '<strong>4. adım:</strong> <code>i=2, j=2</code> → <code>J(2:4, 2:4)</code>. <code>medyanli(2,2)</code> kaç olur?',
    ['Blok: 255 60 70 / 90 0 100 / 120 130 140.', 'Sıralı: 0 60 70 90 ? 120 130 140 255.'],
    'Sıralı: <code>0 60 70 90 100 120 130 140 255</code> → <strong>100</strong>.',
    { kod: J4 + '\nblok = J(2:4, 2:4);\nmedian(blok(:))', beklenen: '100' });
  A('kg-10', CT, 2, ['yeni'], 'Dört adım bitti. <code>medyanli</code> matrisini 2×2 tablo olarak yaz (satırları <code>;</code> ile ayırabilirsin).',
    ['Sonuçlar (i,j) adreslerine yazılır: (1,1), (1,2), (2,1), (2,2).', 'Adım sonuçları sırayla: 50, 60, 90, 100.'],
    '<code>[50 60; 90 100]</code>.',
    { beklenen: '50 60; 90 100' });
  A('kg-11', CT, 3, ['yeni'], 'Kağıt tablosunun hiç istenmeyen sütunu: <code>ortalama(1,1)</code> kaç olur? (İki ondalık yeter.)',
    ['1. bloğun toplamı: 10 + 20 + 30 + 50 + 255 + 60 + 80 + 90 + 0.', 'Toplam 595; 9\'a böl. Ondalığı nokta ile yaz.'],
    '595 / 9 = <strong>66.11</strong>. Diğerleri: 665 / 9 = 73.89, 895 / 9 = 99.44, 965 / 9 = 107.22.',
    { kod: J4 + '\nblok = J(1:3, 1:3);\nmean(blok(:))', beklenen: '66.11' });
  A('kg-12', KY, 3, ['yeni'], 'Şimdi kodun tamamını <strong>kendin yaz</strong>: verilen 4×4 <code>J</code> için 3×3 pencereyle <code>medyanli</code> ve <code>ortalama</code> matrislerini hesapla (hocanın kodundaki adlarla: <code>w</code>, <code>h</code>, <code>blok</code>, <code>medyanli</code>, <code>ortalama</code>).',
    ['Sıra: <code>[w,h]=size(J);</code> → iki <code>for</code> → blok → median → mean → iki <code>end</code>.', 'Döngüler <code>1:w-2</code> ve <code>1:h-2</code>.', '<code>blok=J(i:i+2,j:j+2);</code> ve <code>medyanli(i,j)=median(blok(:));</code>'],
    '<pre>[w,h]=size(J);\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+2,j:j+2);\n        medyanli(i,j)=median(blok(:));\n        ortalama(i,j)=mean(blok(:));\n    end\nend</pre>',
    { baslangicKod: J4 + '\n', cozumKod: J4 + '\n[w,h]=size(J);\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+2,j:j+2);\n        medyanli(i,j)=median(blok(:));\n        ortalama(i,j)=mean(blok(:));\n    end\nend', kontrol: { degiskenler: { w: 4, h: 4, medyanli: [[50, 60], [90, 100]], ortalama: [[66.1111, 73.8889], [99.4444, 107.2222]] }, icermeli: ['\\bfor\\b[\\s\\S]*\\bfor\\b', 'median', 'mean'] } });
  A('kg-13', CS, 2, ['yeni'], 'Kağıt kodunda <code>J</code> elle yazıldı. Bu durumda <code>medyanli</code> hangi türde olur?',
    ['Elle yazılan normal sayılar hangi türdedir?'],
    '<strong>double</strong>. Elle yazılan J double\'dır; medyanli de ortalama da double olur. (Hocanın asıl kodunda J uint8 olduğu için medyanli uint8, ortalama double olurdu.)',
    { secenekler: ['uint8', 'double', 'logical', 'Türü olmaz'], dogru: 1 });

  /* ============================================================ yeni-plot */
  A('yp-01', CS, 1, ['yeni'], '<code>plot(y)</code> yazınca yatay eksende ne olur?',
    ['Tek liste verdin; MATLAB yatay ekseni kendisi koyar.'],
    'Sıra numarası: 1, 2, 3, … Dikey eksen ise <code>y</code>\'nin değerleridir.',
    { secenekler: ['y\'nin değerleri', 'Sıra numarası (1, 2, 3, …)', 'Her zaman 0–255', 'Hiçbir şey'], dogru: 1 });
  A('yp-02', KC, 1, ['yeni'], '<code>y = [10 50 30 80]; plot(y)</code> grafiğinde yatay eksende 3\'ün üstündeki noktanın <strong>yüksekliği</strong> (dikey değeri) kaçtır?',
    ['3. sıradaki sayı hangisi?'],
    '<strong>30</strong>: yatay eksen sıra, dikey eksen değer.',
    { kabul: ['30'] });
  A('yp-03', CS, 1, ['yeni'], '<code>plot(x,y)</code> yazımında hangisi yatay eksendir?',
    ['Önce yazılan.'],
    'Birinci liste (<code>x</code>) yatay, ikinci liste (<code>y</code>) dikey eksendir. İkisi aynı uzunlukta olmalıdır.',
    { secenekler: ['x (birinci)', 'y (ikinci)', 'Hangisi büyükse o', 'İkisi de dikey'], dogru: 0 });
  A('yp-04', KY, 1, ['yeni'], '<code>y</code> adında <code>[5 15 10 40]</code> vektörünü oluştur, yeni bir pencere aç ve çizgi grafiğini çiz.',
    ['<code>y = [5 15 10 40];</code>', 'Yeni pencere: <code>figure</code>. Çizim: <code>plot(y)</code>.'],
    '<pre>y = [5 15 10 40];\nfigure, plot(y)</pre>',
    { cozumKod: 'y = [5 15 10 40];\nfigure, plot(y)', kontrol: { degiskenler: { y: [[5, 15, 10, 40]] }, icermeli: ['figure', 'plot\\s*\\(\\s*y\\s*\\)'] } });
  A('yp-05', KY, 2, ['yeni'], '<code>x = [0 10 20 30]</code> ve <code>y = [5 15 10 40]</code> vektörlerini oluştur; yatay eksen <code>x</code>, dikey eksen <code>y</code> olacak şekilde çiz ve grafiğe <code>\'Deneme\'</code> başlığını koy.',
    ['<code>plot(x,y)</code>: önce yatay, sonra dikey.', 'Başlık: <code>title(\'Deneme\')</code> (tek tırnak).'],
    '<pre>x = [0 10 20 30];\ny = [5 15 10 40];\nfigure, plot(x,y)\ntitle(\'Deneme\')</pre>',
    { cozumKod: "x = [0 10 20 30];\ny = [5 15 10 40];\nfigure, plot(x,y)\ntitle('Deneme')", kontrol: { degiskenler: { x: [[0, 10, 20, 30]], y: [[5, 15, 10, 40]] }, icermeli: ['plot\\s*\\(\\s*x\\s*,\\s*y\\s*\\)', 'title\\s*\\('] } });
  A('yp-06', CS, 2, ['yeni', 'sohbet'], '<code>figure, plot(res(100,:))</code> grafiğinde eksenler neyi gösterir?',
    ['<code>res(100,:)</code> = 100. satırın tüm sütunları.'],
    'Yatay eksen <strong>sütun numarası</strong>, dikey eksen o sütundaki pikselin <strong>parlaklığı</strong>.',
    { secenekler: ['Yatay: satır numarası, dikey: sütun numarası', 'Yatay: sütun numarası, dikey: parlaklık', 'Yatay: parlaklık, dikey: piksel sayısı', 'Yatay: 100, dikey: 256'], dogru: 1 });
  A('yp-07', BD, 2, ['yeni'], 'Resmin <strong>50. satırının</strong> parlaklık profilini çiz. Boşlukları doldur.',
    ['Önce satır, sonra sütun.', '"Tüm sütunlar" tek bir işaretle yazılır.'],
    '<code>plot(res(50,:))</code>.',
    { kod: 'res = imread("cameraman.tif");\nfigure, plot(res(___,___))', bosluklar: [['50'], [':']] });
  A('yp-08', HB, 1, ['yeni', 'hata-odakli'], 'Bu kod hata veriyor. Düzelt; grafik çizilmeli.',
    ['Komuta değer verirken hangi parantez kullanılır?'],
    'Komutlara değer <strong>yuvarlak parantezle</strong> verilir: <code>plot(y)</code>. Köşeli parantez matris oluşturmak içindir.',
    { baslangicKod: 'y = [10 50 30 80];\nfigure, plot[y]', cozumKod: 'y = [10 50 30 80];\nfigure, plot(y)', kontrol: { degiskenler: { y: [[10, 50, 30, 80]] }, icermeli: ['plot\\s*\\(\\s*y\\s*\\)'] } });
  A('yp-09', CT, 3, ['yeni'], 'Gürültülü satıra 3\'lük medyan uygulanıyor. Ekranda görünen <code>temiz</code> vektörünü yaz (5 sayı).',
    ['i=1: 50 52 255 → sıralı 50 52 255 → ortadaki?', 'i=2: 52 255 54 → sıralı 52 54 255.', 'Her üçlüyü sırala, ortadakini al.'],
    'Üçlüler: (50 52 255)→52, (52 255 54)→54, (255 54 55)→55, (54 55 0)→54, (55 0 57)→55. Sonuç <code>52 54 55 54 55</code>: dikenler (255 ve 0) yok oldu.',
    { kod: 'satir = [50 52 255 54 55 0 57];\nfor i = 1:5\n    blok = satir(i:i+2);\n    temiz(i) = median(blok);\nend\ntemiz', beklenen: '52 54 55 54 55' });
  A('yp-10', CS, 1, ['yeni'], 'Tuz-biber gürültülü bir satırın <code>plot</code> grafiğinde parazitler nasıl görünür?',
    ['Tuz 255, biber 0 değerindedir; komşuları ise birbirine yakın.'],
    '255\'e fırlayan ve 0\'a düşen <strong>sivri dikenler</strong> olarak. Medyan filtresinden sonra dikenler kaybolur.',
    { secenekler: ['Düz yatay çizgi olarak', 'Yukarı fırlayan ve aşağı düşen sivri dikenler olarak', 'Grafikte görünmezler', 'Yavaş yükselen bir eğim olarak'], dogru: 1 });
  A('yp-11', KY, 3, ['yeni'], '<code>a</code> ve <code>b</code> vektörleri hazır. <strong>Tek pencerede alt alta</strong> çiz: üst bölmede <code>a</code>, alt bölmede <code>b</code> (2 satır, 1 sütun).',
    ['<code>figure</code>, sonra <code>subplot(2,1,1)</code> ve <code>subplot(2,1,2)</code>.', '<code>subplot(2,1,1), plot(a)</code>'],
    '<pre>figure\nsubplot(2,1,1), plot(a)\nsubplot(2,1,2), plot(b)</pre>',
    { onKod: 'a = [50 52 255 54 55 0 57];\nb = [52 54 55 54 55];', cozumKod: 'figure\nsubplot(2,1,1), plot(a)\nsubplot(2,1,2), plot(b)', kontrol: { icermeli: ['subplot\\s*\\(\\s*2\\s*,\\s*1\\s*,\\s*1\\s*\\)[\\s\\S]*plot\\s*\\(\\s*a\\s*\\)', 'subplot\\s*\\(\\s*2\\s*,\\s*1\\s*,\\s*2\\s*\\)[\\s\\S]*plot\\s*\\(\\s*b\\s*\\)'] } });

  /* ============================================================ yeni-pencere */
  const J6 = 'J = [1 2 3 4 5 6; 7 8 9 10 11 12; 13 14 15 16 17 18; 19 20 21 22 23 24; 25 26 27 28 29 30; 31 32 33 34 35 36];';
  A('yw-01', CS, 2, ['yeni'], 'Hocanın kodunda 3×3 yerine 5×5 pencere kullanmak için hangi satırlar değişir?',
    ['Koddaki 2\'ler nerede geçiyor?', '2 = pencere boyutu − 1.'],
    'Üç satır: <code>for i=1:w-4</code>, <code>for j=1:h-4</code>, <code>blok=J(i:i+4,j:j+4);</code>. <code>median</code>/<code>mean</code> satırları aynen kalır.',
    { secenekler: ['Yalnızca blok satırı', 'İki for satırı ve blok satırı', 'median ve mean satırları', 'Yalnızca imshow satırları'], dogru: 1 });
  A('yw-02', BD, 2, ['yeni'], 'Kodu <strong>5×5 pencere</strong> için tamamla.',
    ['5 satır almak için: i, i+1, i+2, i+3, i+?', 'Aynı sayı döngü sınırlarında da kullanılır.'],
    'Hepsi 4: <code>w-4</code>, <code>h-4</code>, <code>i:i+4</code>, <code>j:j+4</code>.',
    { kod: 'for i=1:w-___\n    for j=1:h-___\n        blok=J(i:i+___,j:j+___);\n        medyanli(i,j)=median(blok(:));\n    end\nend', bosluklar: [['4'], ['4'], ['4'], ['4']] });
  A('yw-03', KC, 1, ['yeni'], '5×5 pencerede <code>blok</code> kaç elemanlıdır? (Sayı yaz.)',
    ['Satır × sütun.'],
    '5 × 5 = <strong>25</strong>.',
    { kabul: ['25'] });
  A('yw-04', KC, 2, ['yeni'], '25 elemanlı bloğun medyanı, sıralı dizinin kaçıncı sayısıdır? (Sayı yaz.)',
    ['9 elemanda 5. sayıydı: 4 küçük, 4 büyük.', '25 elemanda ortadakinin iki yanında 12\'şer sayı kalır.'],
    '<strong>13.</strong> sayı (12 küçük + ortadaki + 12 büyük).',
    { kabul: ['13', '13.'] });
  A('yw-05', KC, 2, ['yeni'], '256×256 resimde 5×5 pencere kullanılırsa <code>medyanli</code> kaç satır olur? (Sayı yaz.)',
    ['3×3\'te 256 − 2 = 254 idi.'],
    '256 − 4 = <strong>252</strong> (sonuç 252×252).',
    { kabul: ['252'] });
  A('yw-06', KY, 3, ['yeni'], '6×6\'lık <code>J</code> hazır verildi. <strong>5×5 pencere</strong> ile medyan filtresi uygula; sonucu <code>medyanli</code> matrisine yaz (2×2 çıkmalı).',
    ['<code>[w,h]=size(J);</code> sonra döngüler <code>1:w-4</code> ve <code>1:h-4</code>.', '<code>blok=J(i:i+4,j:j+4);</code>', '<code>medyanli(i,j)=median(blok(:));</code> ve iki <code>end</code>.'],
    '<pre>[w,h]=size(J);\nfor i=1:w-4\n    for j=1:h-4\n        blok=J(i:i+4,j:j+4);\n        medyanli(i,j)=median(blok(:));\n    end\nend</pre>Sonuç <code>[15 16; 21 22]</code>.',
    { onKod: J6, cozumKod: '[w,h]=size(J);\nfor i=1:w-4\n    for j=1:h-4\n        blok=J(i:i+4,j:j+4);\n        medyanli(i,j)=median(blok(:));\n    end\nend', kontrol: { degiskenler: { medyanli: [[15, 16], [21, 22]] } } });
  A('yw-07', HB, 3, ['yeni', 'hata-odakli'], 'Biri kodu 5×5\'e çevirirken yalnızca blok satırını değiştirmiş; kod "indeks sınır dışı" hatası veriyor (6×6\'lık <code>J</code> hazır). Düzelt.',
    ['<code>i</code> en fazla kaç oluyor? O zaman <code>i+4</code> kaç?', 'Üç satır birlikte değişir: iki döngü sınırı da 4 olmalı.'],
    'Döngüler <code>1:w-4</code> ve <code>1:h-4</code> olmalı. Yoksa i = 3 iken 7. satır istenir.',
    { onKod: J6, baslangicKod: '[w,h]=size(J);\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+4,j:j+4);\n        medyanli(i,j)=median(blok(:));\n    end\nend', cozumKod: '[w,h]=size(J);\nfor i=1:w-4\n    for j=1:h-4\n        blok=J(i:i+4,j:j+4);\n        medyanli(i,j)=median(blok(:));\n    end\nend', kontrol: { degiskenler: { medyanli: [[15, 16], [21, 22]] } } });
  A('yw-08', CS, 2, ['yeni'], '7×7 pencere için dış döngü satırı nasıl olur?',
    ['n×n pencere için <code>1:w-(n-1)</code>.'],
    '<code>for i=1:w-6</code>; blok da <code>J(i:i+6,j:j+6)</code> olur (49 eleman, medyan 25. sayı).',
    { secenekler: ['<code>for i=1:w-7</code>', '<code>for i=1:w-6</code>', '<code>for i=1:w-3</code>', '<code>for i=7:w</code>'], dogru: 1 });
  A('yw-09', KY, 3, ['yeni'], '4×4\'lük <code>J</code> hazır verildi. Hocanın kodunu <strong>max ve min filtresine</strong> çevir: 3×3 pencerenin en büyüğünü <code>enbuyuk</code>, en küçüğünü <code>enkucuk</code> matrisine yaz.',
    ['İskelet aynı; yalnızca komut adları değişir.', '<code>enbuyuk(i,j)=max(blok(:));</code>', '<code>enkucuk(i,j)=min(blok(:));</code>'],
    '<pre>[w,h]=size(J);\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+2,j:j+2);\n        enbuyuk(i,j)=max(blok(:));\n        enkucuk(i,j)=min(blok(:));\n    end\nend</pre>',
    { onKod: 'J = [1 2 3 4; 5 6 7 8; 9 10 11 12; 13 14 15 16];', cozumKod: '[w,h]=size(J);\nfor i=1:w-2\n    for j=1:h-2\n        blok=J(i:i+2,j:j+2);\n        enbuyuk(i,j)=max(blok(:));\n        enkucuk(i,j)=min(blok(:));\n    end\nend', kontrol: { degiskenler: { enbuyuk: [[11, 12], [15, 16]], enkucuk: [[1, 2], [5, 6]] } } });
  A('yw-10', CS, 2, ['yeni'], '"Yalnızca medyan filtresi uygulayan kod" istenirse hocanın kodundan hangi satırlar silinir?',
    ['Hesaplayan satır silinince onu gösteren satır ne olur?'],
    '<code>ortalama(i,j)=mean(blok(:));</code> <strong>ve</strong> <code>figure,imshow(uint8(ortalama))</code>. İkincisi kalırsa "Unrecognized function or variable \'ortalama\'" hatası çıkar.',
    { secenekler: ['Yalnızca <code>ortalama(i,j)=mean(blok(:));</code>', '<code>ortalama(i,j)=...</code> satırı ve <code>figure,imshow(uint8(ortalama))</code> satırı', 'İki for satırı', '<code>blok=...</code> satırı'], dogru: 1 });
  A('yw-11', CS, 1, ['yeni'], 'Gürültü oranını yüzde 5 yapmak için hangi satır değişir?',
    ['Gürültüyü ekleyen komut hangisi?'],
    '<code>J = imnoise(res,\'salt &amp; pepper\', 0.05);</code> Yaklaşık 65.536 × 0.05 ≈ 3.300 piksel bozulur.',
    { secenekler: ['<code>imread</code> satırı', '<code>imnoise</code> satırındaki son sayı: 0.05', '<code>size</code> satırı', '<code>for</code> satırları: <code>w-5</code>'], dogru: 1 });

  /* ============================================================ yeni-baska-kodlar */
  A('yb-01', CT, 1, ['yeni'], 'Negatif: ekranda görünen 2×2 tabloyu yaz.',
    ['Her piksel 255\'ten çıkarılır.'],
    '255 − 0 = 255, 255 − 100 = 155, 255 − 200 = 55, 255 − 255 = 0 → <code>[255 155; 55 0]</code>.',
    { kod: 'A = [0 100; 200 255];\n255 - A', beklenen: '255 155; 55 0' });
  A('yb-02', KY, 2, ['yeni'], '<code>A</code> hazır verildi. <strong>İç içe for</strong> kullanarak negatifini <code>neg</code> matrisine yaz (her piksel için 255 − piksel).',
    ['<code>[w,h] = size(A);</code>, döngüler <code>1:w</code> ve <code>1:h</code> (pencere yok).', '<code>neg(i,j) = 255 - A(i,j);</code>'],
    '<pre>[w,h] = size(A);\nfor i = 1:w\n    for j = 1:h\n        neg(i,j) = 255 - A(i,j);\n    end\nend</pre>',
    { onKod: 'A = [0 100 50; 200 255 30];', cozumKod: '[w,h] = size(A);\nfor i = 1:w\n    for j = 1:h\n        neg(i,j) = 255 - A(i,j);\n    end\nend', kontrol: { degiskenler: { neg: [[255, 155, 205], [55, 0, 225]] }, icermeli: ['\\bfor\\b[\\s\\S]*\\bfor\\b'] } });
  A('yb-03', KY, 3, ['yeni'], '<code>A</code> hazır verildi. <strong>Eşikleme</strong> yap: 128\'den büyük pikseller 255, diğerleri 0 olsun; sonucu <code>sb</code> matrisine yaz. İç içe <code>for</code> ve <code>if</code> kullan.',
    ['İki döngünün içine <code>if A(i,j) &gt; 128</code> koy.', '<code>sb(i,j) = 255;</code> … <code>else</code> … <code>sb(i,j) = 0;</code>', 'Üç yapı var (if, for, for): üç <code>end</code>.'],
    '<pre>[w,h] = size(A);\nfor i = 1:w\n    for j = 1:h\n        if A(i,j) &gt; 128\n            sb(i,j) = 255;\n        else\n            sb(i,j) = 0;\n        end\n    end\nend</pre>128 sınırda: büyük değil, 0 olur.',
    { onKod: 'A = [10 200; 128 129];', cozumKod: '[w,h] = size(A);\nfor i = 1:w\n    for j = 1:h\n        if A(i,j) > 128\n            sb(i,j) = 255;\n        else\n            sb(i,j) = 0;\n        end\n    end\nend', kontrol: { degiskenler: { sb: [[0, 255], [0, 255]] }, icermeli: ['\\bfor\\b', '\\bif\\b'] } });
  A('yb-04', HB, 2, ['yeni', 'hata-odakli'], 'Eşikleme kodu çalışmıyor (<code>A</code> hazır). Eksiği tamamla.',
    ['Kaç yapı açılmış (for, for, if)? Kaç <code>end</code> var?'],
    'Üç yapı için üç <code>end</code> gerekir; bir tane eksikti.',
    { onKod: 'A = [10 200; 128 129];', baslangicKod: 'for i = 1:2\n    for j = 1:2\n        if A(i,j) > 128\n            sb(i,j) = 255;\n        else\n            sb(i,j) = 0;\n        end\n    end', cozumKod: 'for i = 1:2\n    for j = 1:2\n        if A(i,j) > 128\n            sb(i,j) = 255;\n        else\n            sb(i,j) = 0;\n        end\n    end\nend', kontrol: { degiskenler: { sb: [[0, 255], [0, 255]] } } });
  A('yb-05', CT, 2, ['yeni'], 'Parlaklık artırma: ekranda görünen iki sayıyı yaz.',
    ['<code>A</code> uint8. 230 + 50 kutuya sığar mı?'],
    '100 + 50 = 150; 230 + 50 = 280 → 255\'te kesilir. Cevap: <code>150 255</code>.',
    { kod: 'A = uint8([100 230]);\nA + 50', beklenen: '150 255', otoDogrula: false });
  A('yb-06', CS, 2, ['yeni'], 'İki uint8 resmin ortalaması alınırken neden önce <code>double(...)</code> yazılır?',
    ['200 + 100 uint8\'de kaç eder?'],
    'uint8 toplaması 255\'te kesilir (200 + 100 → 255, yarısı 128); doğru ortalama 150\'dir. <code>double</code> ile taşma olmaz.',
    { secenekler: ['Resmi büyütmek için', 'uint8 toplaması 255\'te kesildiği için sonuç bozulur', 'imshow yalnızca double gösterdiği için', 'Kod daha hızlı çalışsın diye'], dogru: 1 });
  A('yb-07', KY, 2, ['yeni'], '<code>A</code> ve <code>B</code> uint8 türünde iki küçük resim (hazır). Piksel piksel <strong>doğru</strong> ortalamalarını <code>ort</code> matrisine yaz.',
    ['Önce ikisini de <code>double</code> yap, sonra topla ve 2\'ye böl.'],
    '<code>ort = (double(A) + double(B)) / 2;</code> → <code>[150 100; 100 250]</code>.',
    { onKod: 'A = uint8([200 100; 50 250]);\nB = uint8([100 100; 150 250]);', cozumKod: 'ort = (double(A) + double(B)) / 2;', kontrol: { degiskenler: { ort: [[150, 100], [100, 250]] }, icermeli: ['double'] } });
  A('yb-08', KY, 3, ['yeni'], '<code>J</code> hazır verildi. İç içe <code>for</code> ve <code>if</code> ile değeri 0 <strong>veya</strong> 255 olan (gürültülü) piksellerin sayısını <code>sayac</code> değişkeninde topla.',
    ['Önce <code>sayac = 0;</code>', 'Koşul: <code>J(i,j) == 0 || J(i,j) == 255</code>', 'Koşul doğruysa <code>sayac = sayac + 1;</code> (else gerekmez).'],
    '<pre>[w,h] = size(J);\nsayac = 0;\nfor i = 1:w\n    for j = 1:h\n        if J(i,j) == 0 || J(i,j) == 255\n            sayac = sayac + 1;\n        end\n    end\nend</pre>255, 0, 255 → 3.',
    { onKod: 'J = [10 20 30 40; 50 255 60 70; 80 90 0 100; 110 255 130 140];', cozumKod: '[w,h] = size(J);\nsayac = 0;\nfor i = 1:w\n    for j = 1:h\n        if J(i,j) == 0 || J(i,j) == 255\n            sayac = sayac + 1;\n        end\n    end\nend', kontrol: { degiskenler: { sayac: 3 } } });
  A('yb-09', CT, 2, ['yeni'], 'Tuz piksellerinin yeri: ekranda hangi sayılar görünür?',
    ['<code>find</code> değeri değil sırayı verir.'],
    '255 değerleri 2. ve 4. sırada → <code>2 4</code>.',
    { kod: 'v = [10 255 0 255];\nfind(v == 255)', beklenen: '2 4' });
  A('yb-10', BD, 2, ['yeni'], 'Renkli resmin <strong>kırmızı katmanını</strong> al. Boşlukları doldur.',
    ['Adres: satır, sütun, kat.', 'Tüm satırlar ve tüm sütunlar tek işaretle yazılır; kırmızı kaçıncı kat?'],
    '<code>kirmizi = renkli(:,:,1);</code> (2 yeşil, 3 mavi).',
    { kod: 'kirmizi = renkli(___,___,___);', bosluklar: [[':'], [':'], ['1']] });
  A('yb-11', CS, 2, ['yeni'], 'Tuz-biber gürültülü resme 3×3 <strong>max</strong> filtresi uygulanırsa ne olur?',
    ['Pencerede tek bir 255 varsa <code>max</code> ne verir?'],
    'Biber (0) noktaları silinir, ama her tuz (255) noktası 3×3\'lük beyaz kareye büyür ve resim aydınlanır.',
    { secenekler: ['Tuz da biber de silinir', 'Biber silinir, tuz noktaları büyür', 'Tuz silinir, biber noktaları büyür', 'Resim hiç değişmez'], dogru: 1 });

  g.ALISTIRMALAR = (g.ALISTIRMALAR || []).concat(veri);
  if (typeof module !== 'undefined') module.exports = veri;
})(typeof window !== 'undefined' ? window : globalThis);
