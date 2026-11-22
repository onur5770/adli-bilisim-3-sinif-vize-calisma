/* Sözdizimi kartı: tüm dersin tek sayfalık özeti */
(function (g) {
  const G = (baslik, satirlar) => ({ baslik, satirlar: satirlar.map(s => ({ soz: s[0], anlam: s[1] })) });
  const KART = [
    G('Temel yazım', [
      ['% yorum', 'Satır sonuna kadar MATLAB okumaz; insan için nottur.'],
      ['5 + 3', 'Sonda <code>;</code> yok: sonuç ekranda görünür (<code>ans = 8</code>).'],
      ['2 * 100;', 'Sonda <code>;</code> var: hesaplanır ama gösterilmez.'],
      ['ans', 'İsim verilmeyen son sonucun saklandığı kutu.'],
      ['figure, imshow(res)', 'Virgül: iki komutu aynı satıra yazar.'],
      ['vize1.m', 'Script dosyası; adında boşluk olmaz, rakamla başlamaz. Run / F5 ile çalışır.']
    ]),
    G('Temizlik', [
      ['clc', 'Komut penceresindeki yazıları siler (hafızaya dokunmaz).'],
      ['clear all', 'Hafızadaki bütün değişkenleri siler.'],
      ['close all', 'Açık resim pencerelerini kapatır.'],
      ['clc; clear all; close all;', 'Kodun en başına yazılan üçlü.']
    ]),
    G('Değişkenler ve işlemler', [
      ['x = 5;', '"Sağdakini hesapla, soldaki kutuya koy." Eşittir demek değildir.'],
      ['x = x + 10', 'Eski değere 10 ekler, kutuya geri yazar.'],
      ['+  -  *  /  ^', 'Toplama, çıkarma, çarpma, bölme, üs.'],
      ['(a + b) / 2', 'Önce parantez, sonra üs, sonra çarpma/bölme, en son toplama/çıkarma.'],
      ['Deger, deger', 'Büyük-küçük harf farklı isimdir. İsim harfle başlar; boşluk ve Türkçe karakter olmaz.']
    ]),
    G('Matris oluşturma', [
      ['[1 2 3]', 'Boşluk: aynı satırda yan sütuna geçer.'],
      ['[1 2; 3 4]', '<code>;</code> köşeli parantez içinde alt satıra geçirir.'],
      ['zeros(2,3)', '2 satır 3 sütun, hepsi 0 (siyah). Önce satır, sonra sütun.'],
      ['ones(2,3) * 255', 'Hepsi 1 olan matris × 255 → hepsi 255 (beyaz).'],
      ['1:4', '1 2 3 4'],
      ['1:2:9', 'başlangıç:adım:bitiş → 1 3 5 7 9']
    ]),
    G('İndeksleme (piksel seçme)', [
      ['A(2,3)', '2. satır, 3. sütun. Sayma 1\'den başlar; önce satır, sonra sütun.'],
      ['A(1:3,2:4)', '1-3. satırlar ile 2-4. sütunların kesişimi.'],
      ['A(2,:)', '2. satırın tamamı (<code>:</code> = hepsi).'],
      ['A(:,3)', '3. sütunun tamamı.'],
      ['A(:)', 'Matrisi sütun sütun okuyup tek sıra yapar.'],
      ['A(:,:,1)', 'Renkli resmin 1. katı (kırmızı); 2 yeşil, 3 mavi.'],
      ['J(i:i+2,j:j+2)', '(i,j)\'den başlayan 3×3 blok.']
    ]),
    G('Boyut', [
      ['size(A)', 'Satır ve sütun sayısı: <code>3 4</code>.'],
      ['[w,h] = size(A)', '<code>w</code> = satır sayısı, <code>h</code> = sütun sayısı (sıra belirler, isim değil).']
    ]),
    G('Çarpma türleri', [
      ['A .* B', 'Eleman eleman: aynı adresteki sayılar çarpılır.'],
      ['A * B', 'Matris çarpımı: satır × sütun, çarp ve topla.'],
      ['A * 2', 'Tek sayıyla çarpma: her piksel 2 katı (<code>.*</code> ile aynı).'],
      ['A ./ B,  A .^ 2', 'Eleman eleman bölme ve üs.']
    ]),
    G('Hazır hesap komutları', [
      ['sum(v)', 'Toplar.'],
      ['mean(v)', 'Ortalama: toplam / eleman sayısı. Sonuç double.'],
      ['median(v)', 'Sıralar, ortadakini alır (9 sayıda 5.; çift sayıda ortadaki ikisinin ortalaması).'],
      ['max(v), min(v)', 'En büyük, en küçük.'],
      ['abs(-5), sqrt(16)', 'Eksi işaretini atar → 5; karekök → 4.'],
      ['find(v > 100)', 'Şartı sağlayanların <strong>sırasını</strong> verir.'],
      ['mean(blok(:))', 'Matriste tek sonuç için önce <code>(:)</code>; yoksa sütun sütun hesaplar.']
    ]),
    G('Karşılaştırma ve mantık', [
      ['>  <  >=  <=', 'Büyük, küçük, büyük-eşit, küçük-eşit. Cevap 1 (doğru) ya da 0 (yanlış).'],
      ['p == 255', 'Eşit mi? (çift eşittir sorar)'],
      ['p ~= 0', 'Eşit değil mi?'],
      ['a && b', 've: ikisi de doğruysa 1.'],
      ['a || b', 'veya: en az biri doğruysa 1.'],
      ['p == 0 || p == 255', '"Piksel tuz ya da biber mi?"'],
      ['A > 100', 'Matriste her piksel ayrı sorulur → 0/1 tablosu. Matris koşullarını birleştirmek için <code>&amp;</code>, <code>|</code>.']
    ]),
    G('if', [
      ['if koşul … end', 'Koşul doğruysa içindekiler çalışır. <code>end</code> zorunlu.'],
      ['else', 'Değilse. Koşul almaz, zorunlu değil.'],
      ['elseif koşul', 'Değilse eğer. Yanına mutlaka koşul yazılır; ikiden fazla yol için.']
    ]),
    G('for', [
      ['for i = 1:3 … end', '<code>i</code> sırayla 1, 2, 3 olur; içindekiler her turda tekrarlanır.'],
      ['for i=1:w, for j=1:h', 'İç içe: dıştaki bir adım atarken içteki baştan sona döner. Önce <code>j</code> artar.'],
      ['yeni(i,j) = A(i,j) + 5;', 'Pikseli al, işle, aynı adrese yaz. Matris yoksa MATLAB büyüterek oluşturur.'],
      ['toplam = toplam + A(i,j);', 'Birikimli toplam: eski değerin üstüne ekler.'],
      ['for i=1:w-2', '3×3 pencere taşmasın diye son 2 satıra girilmez.']
    ]),
    G('Sayı türleri', [
      ['uint8(200)', '0–255 arası tam sayı. Fazlası 255\'e, eksisi 0\'a kesilir.'],
      ['uint8(200) + 100', '255 (taşma). <code>uint8(10) - 20</code> → 0.'],
      ['uint8(3.6)', '4 (yuvarlar). uint8 ile işlem sonucu yine uint8: 127.5 → 128.'],
      ['double(a)', 'Geniş kutuya çevirir: ondalık, negatif, büyük sayı tutar.'],
      ['(double(a) + double(b)) / 2', 'İki pikselin doğru ortalaması.']
    ]),
    G('Resim komutları', [
      ['res = imread("cameraman.tif");', 'Dosyayı okur, sayı matrisine çevirir (256×256, uint8). Ekranda bir şey göstermez.'],
      ['imshow(X)', 'Matrisi resim olarak gösterir. uint8: 0–255; double: 0–1 ölçeği.'],
      ['imshow(X,[])', 'En küçük sayı siyah, en büyük sayı beyaz.'],
      ['figure', 'Yeni boş pencere açar.'],
      ['subplot(2,3,5)', '2 satır 3 sütuna böl, 5. bölmeyi seç (kitap okur gibi numaralanır).'],
      ['imnoise(res,\'salt & pepper\',0.02)', 'Piksellerin %2\'sini 0 ya da 255 yapar (tuz-biber gürültüsü).'],
      ['plot(y),  plot(x,y)', 'Çizgi grafiği. Tek listede yatay eksen sıra numarasıdır.'],
      ['title(\'yazi\')', 'Grafiğe/resme başlık.']
    ]),
    G('Hocanın kodunun iskeleti', [
      ['[w,h]=size(J);', 'Boyutları al (256, 256).'],
      ['for i=1:w-2 / for j=1:h-2', 'Pencerenin sol üst köşesini gezdir (1…254).'],
      ['blok=J(i:i+2,j:j+2);', '3×3 parçayı kes.'],
      ['medyanli(i,j)=median(blok(:));', 'Ortancayı yeni resme yaz (parazitleri atar).'],
      ['ortalama(i,j)=mean(blok(:));', 'Ortalamayı yeni resme yaz (bulanıklaştırır).'],
      ['figure,imshow(uint8(ortalama))', 'double sonucu 0–255 ölçeğinde göster.'],
      ['5×5 pencere', '<code>w-4</code>, <code>h-4</code>, <code>i:i+4, j:j+4</code>; medyan 25 sayının 13.\'sü.']
    ]),
    G('Sık yapılan hatalar', [
      ['A[i;j]  →  A(i,j)', 'Piksel seçerken yuvarlak parantez ve virgül.'],
      ['elseif  →  else', '<code>elseif</code> koşulsuz yazılmaz.'],
      ['end unutmak', 'Her <code>if</code> ve her <code>for</code> kendi <code>end</code>\'ini ister.'],
      ['edn, unit8', 'Doğrusu <code>end</code>, <code>uint8</code>. Yanlış yazılan kelime tanınmaz.'],
      ['=  ile  ==', 'Tek eşittir koyar, çift eşittir sorar.'],
      ['4,5  →  4.5', 'Ondalık nokta ile yazılır.'],
      ['[2030]  →  [20 30]', 'Sayılar arasına boşluk.'],
      ['uint8(10) - 20 = -10 ?', 'Hayır, 0. uint8 sınırda keser; işareti atmak <code>abs</code>\'in işi.'],
      ['Unrecognized function or variable', 'Değişken hafızada yok: onu oluşturan satırlar çalışmamış ya da adı yanlış yazılmış.']
    ])
  ];
  g.KART = KART;
  if (typeof module !== 'undefined') module.exports = KART;
})(typeof window !== 'undefined' ? window : globalThis);
