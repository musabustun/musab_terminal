## Musab Ustun — Portfolio Terminal

Modern, terminal tarzı etkileşimli kişisel site. React + TypeScript + TailwindCSS ile inşa edildi; gerçek bir shell deneyimini taklit eden komutlar, tema yönetimi ve klavye kısayolları içerir.

### Özellikler
- **Terminal arayüzü**: Gerçek terminal görünümü ve deneyimi, yazı/satır animasyonları
- **Komut seti**: CV, projeler, iletişim vb. için hazır komutlar; dosya/dizin simülasyonu
- **Dark mode**: Varsayılan olarak koyu tema; sınıf tabanlı (Tailwind) tema geçişi
- **Otomatik tamamlama (Tab)**: Komut ve yol tamamlama, ortak prefix genişletme ve aday listeleme
- **Sudo simülasyonu**: Parola ekranı ve deneme sınırı (eğlencelik simülasyon)
- **Erişilebilirlik**: Klavye odak yönetimi, görsel ipuçları

### Ekran Alıntısı
- Açılışta ASCII banner ve yardım yönlendirmesi görünür.
- Komut geçmişi, prompt ve canlı satır sayacı mevcuttur.

### Komutlar
- Genel
  - `help`: Komutları ve kısa açıklamaları gösterir
  - `banner`: ASCII banner’ı yeniden yazdırır
  - `theme [dark|light|toggle]`: Tema değiştirir (varsayılan: dark)
  - `echo <text>`: Metni yazdırır
  - `date`, `whoami`
  - `open <url>`: URL’i yeni sekmede açar
  - `clear`: Ekranı temizler
- Portföy
  - `about`, `skills`, `projects`, `experience`, `contact`
  - `resume`, `github`, `linkedin`
- Dosya sistemi (simülasyon)
  - `pwd`: Mevcut dizin (ör. `/home/musab/portfolio/...`)
  - `ls [path]`: Dizin içeriğini listeler
  - `cd [path]`: Dizin değiştirir (`/`, `~`, `.`, `..` destekli)
  - `cat <file>`: Metin dosyası içeriğini yazdırır (`.txt`/`.md`)
  - `sudo <cmd>`: Parola ister; 3 yanlış denemeden sonra engeller (simülasyon)

### Klavye ve Otomatik Tamamlama
- `Tab` ile tamamla:
  - Komut adı yazarken: tek eşleşmede tamamlar, çoklu eşleşmede ortak prefix’e genişletir, tekrar `Tab` basıldığında adayları listeler
  - Yol tamamlama (ls/cd/cat/open): klasörler için `/` son ekiyle gösterim, ortak prefix genişletme, ikinci `Tab` ile aday liste
- `Enter`: Komutu çalıştırır; yazma animasyonu aktifken giriş kilitlenir

### Teknolojiler
- Vite 5, React 18, TypeScript, TailwindCSS 3
- İkonlar: `lucide-react`
- Lint: ESLint (TS + React Hooks kuralları)

### Başlangıç
Önkoşullar: Node.js 18+ önerilir.

Kurulum ve geliştirme:

```bash
npm install
npm run dev
```

Üretim derlemesi ve önizleme:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

### Proje Yapısı (özet)
```
musab_terminal/
  public/                 # statik varlıklar (favicon vb.)
  src/
    App.tsx              # terminal UI, komut işleyicileri, tip yazıcı
    main.tsx             # uygulama girişi
    index.css            # global stiller (Tailwind + özelleştirmeler)
  index.html             # HTML giriş, meta/SEO ve font yüklemesi
  tailwind.config.js     # Tailwind yapılandırması (darkMode: 'class')
  vite.config.ts         # Vite ayarları
  eslint.config.js       # ESLint kuralları
  package.json           # scriptler ve bağımlılıklar
```

### Tema
- Varsayılan: Dark. `index.html` üzerindeki `html` elemanına `class="dark"` uygulanır.
- Uygulama açılışında localStorage kontrol edilir; `theme` anahtarı yoksa dark başlar.
- Uygulama içinden `theme` komutuyla değiştirilebilir.

### Simüle Dosya Sistemi
- Kök: `~/` (gerçekte `/home/musab/portfolio` eşleniği)
- Örnek içerikler: `contact.txt`, `README.md`; `projects/` altında örnek klasörler
- `cat` yalnızca metin dosyalarını gösterir; ikili dosyalara (örn. `.pdf`) uyarı verir

### Özelleştirme İpuçları
- Yeni komut eklemek için `src/App.tsx` içindeki `executeCommand` fonksiyonuna bir case ekleyin.
- Dosya sistemi için `directoryListings` ve `fileContents` yapılarını genişletin.
- Tip yazım hızını `typeWriter` fonksiyonundaki `charDelayMs` ve `lineDelayMs` parametreleriyle ayarlayın.

### Güvenlik Notu
Bu proje eğitim/portföy amaçlıdır. `sudo` gibi komutlar yalnızca simülasyondur; gerçek bir ayrıcalık yükseltme yapılmaz.

### Lisans
Kişisel portföy projesi. Dilediğiniz gibi fork’layıp kendinize uyarlayabilirsiniz.


