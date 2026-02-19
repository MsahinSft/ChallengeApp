# 🏥 HealthInsight Pro: Akıllı Sağlık Asistanı

Samsun Üniversitesi Yazılım Mühendisliği - Mobil Challenge Projesi kapsamında geliştirilen, Pinterest **#836021** nolu panodan ilham alan profesyonel sağlık takip uygulamasıdır.

## 🚀 Proje Vizyonu
HealthInsight Pro, geleneksel sağlık takip yöntemlerini modern bir kullanıcı deneyimi (UX) ile birleştirir. Sadece veri kaydeden bir uygulama değil, verileri analiz ederek kullanıcıya (Mustafa Şahin) aksiyon aldırabilen bir sağlık asistanıdır.

## ✨ Öne Çıkan Özellikler & Teknik Çözümler

### 📊 Akıllı Analiz Panelleri
- **Kan Şekeri Analizi:** Girilen değerleri (Normal/Düşük/Yüksek) olarak sınıflandırır. Düşük değerlerde anında tıbbi uyarı mekanizmasını tetikler.
- **Dinamik Eğitim Listesi:** KOAH egzersizleri ve eğitimleri için gerçek zamanlı arama ve filtreleme özelliği.
- **Analitik Mod Takibi:** Kullanıcının psikolojik durumunu tarih bazlı notlarla takip eden interaktif günlük sistemi.

### 🎯 Hedef ve İlerleme Takibi
- **Görsel Progress Bar:** Adım ve su tüketimi için doluluk oranlarını gösteren modern grafikler.
- **Rozet Sistemi:** Kullanıcı motivasyonunu artırmak için haftalık başarı rozetleri.

### 🚨 Güvenlik ve İletişim
- **Acil Durum Entegrasyonu:** Tek tıkla 112 arama ve WhatsApp üzerinden sağlık danışmanına hızlı erişim (Linking API).

## 🧪 Teknik Şartname Uyumluluğu
- **Navigasyon:** 8+ ekran içeren kompleks Stack Navigation yapısı kullanıldı.
- **Hata Yönetimi:** Veri bulunamadığında "Empty State" ve yükleme süreçlerinde "Loading" ekranları ile kullanıcı deneyimi kesintisiz hale getirildi.
- **State Yönetimi:** `useState` ve `useEffect` hook'ları ile akışkan veri yönetimi sağlandı.

## 🛠 Kurulum ve Çalıştırma
1. Projeyi klonlayın.
2. `npm install` komutu ile bağımlılıkları yükleyin.
3. `npx expo start` ile uygulamayı başlatın.

---
**Geliştiren:** Mustafa ŞAHİN  
**Teknoloji:** React Native + Expo ⚛️📱