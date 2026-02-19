import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList,
  Dimensions, SafeAreaView, ScrollView, TextInput,
  ActivityIndicator, Alert, StatusBar, Linking
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- TASARIM SİSTEMİ ---
const COLORS = {
  primary: '#EF5350',   // Sağlık
  secondary: '#27AE60', // Başarı/Egzersiz (KOAH Yeşili)
  blue: '#3498DB',      // Destek/Profil
  yellow: '#F1C40F',    // Hedefler
  bg: '#F8F9FA',
  card: '#FFFFFF',
  text: '#2D3436',
  gray: '#636E72',
  white: '#FFFFFF',
  purple: '#A29BFE'
};

const Stack = createStackNavigator();
const { width } = Dimensions.get('window');

// --- 1. ANA SAYFA (Dashboard) ---
function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 1200); }, []);

  const TOOLS = [
    { id: '1', title: 'Kan Şekeri', icon: '🩸', screen: 'Forms', color: COLORS.primary, desc: 'Analiz & Takip' },
    { id: '2', title: 'KOAH Eğitim', icon: '🫁', screen: 'Exercise', color: COLORS.secondary, desc: '3 Yeni Video' },
    { id: '3', title: 'Hedeflerim', icon: '🎯', screen: 'Goals', color: COLORS.yellow, desc: 'Detaylı İlerleme' },
    { id: '4', title: 'SSS', icon: '❓', screen: 'FAQ', color: COLORS.blue, desc: 'Bilgi Merkezi' },
    { id: '5', title: 'Bildirimler', icon: '🔔', screen: 'Notifications', color: '#E17055', desc: '4 Yeni Duyuru' },
    { id: '6', title: 'Mod Takibi', icon: '🎭', screen: 'Survey', color: COLORS.purple, desc: 'Günlük Analiz' },
    { id: '7', title: 'Acil Yardım', icon: '🚑', screen: 'WhatsApp', color: '#00B894', desc: 'Hızlı Erişim' },
    { id: '8', title: 'Profilim', icon: '👤', screen: 'Profile', color: COLORS.gray, desc: 'Mustafa Şahin' },
  ];

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /><Text style={styles.loaderText}>Sağlık Analizörü Başlatılıyor...</Text></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.heroHeader}>
        <TouchableOpacity style={styles.profileBadge} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatarMini}><Text style={{ fontSize: 24 }}>👨‍💻</Text></View>
          <View>
            <Text style={styles.helloText}>Merhaba Mustafa 👋</Text>
            <Text style={styles.statusText}>Bugün formundasın!</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={TOOLS}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.toolCard, { borderTopColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.toolIcon}>{item.icon}</Text>
            <Text style={styles.toolTitle}>{item.title}</Text>
            <Text style={styles.toolDesc}>{item.desc}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// --- 2. KOAH EĞİTİM (Filtreleme Özelliği) ---
function ExerciseScreen() {
  const [search, setSearch] = useState('');
  const EX_DATA = [
    { id: '1', t: 'Derin Nefes Egzersizi', d: 'KOAH • 5 Dakika', status: 'Tamamlandı' },
    { id: '2', t: 'Hafif Yürüyüş', d: 'Fiziksel • 20 Dakika', status: 'Bekliyor' },
    { id: '3', t: 'Üst Gövde Isınma', d: 'Esneme • 10 Dakika', status: 'Tamamlandı' },
    { id: '4', t: 'Merdiven Çıkma Teknikleri', d: 'Kardiyo • 15 Dakika', status: 'Yeni' },
  ];

  const filtered = EX_DATA.filter(i => i.t.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput style={styles.searchBar} placeholder="Eğitim veya egzersiz ara..." onChangeText={setSearch} />
      </View>
      <FlatList
        data={filtered}
        ListEmptyComponent={<View style={styles.center}><Text style={{ fontSize: 50 }}>🔍</Text><Text style={styles.gray}>Eşleşen eğitim bulunamadı.</Text></View>}
        renderItem={({ item }) => (
          <View style={styles.exerciseCard}>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'Tamamlandı' ? COLORS.secondary : COLORS.yellow }]}>
              <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>{item.t}</Text>
              <Text style={styles.gray}>{item.d}</Text>
            </View>
            <TouchableOpacity style={styles.playBtn}><Text>▶️</Text></TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// --- 3. PROFİLİM (Kişisel Analiz Merkezi) ---
function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.pHeader}>
        <View style={styles.pCircle}><Text style={{ fontSize: 50 }}>👨‍💻</Text></View>
        <Text style={styles.pName}>Mustafa ŞAHİN</Text>
        <Text style={styles.pSub}>Yazılım Mühendisliği | Samsun Üniversitesi</Text>
      </View>

      <View style={styles.pInfoBox}>
        <Text style={styles.sectionTitle}>Kişisel Detaylar</Text>
        <View style={styles.pRow}><Text style={styles.gray}>Yaş:</Text><Text style={styles.pBold}>21</Text></View>
        <View style={styles.pRow}><Text style={styles.gray}>Boy / Kilo:</Text><Text style={styles.pBold}>180 cm / 75 kg</Text></View>
        <View style={styles.pRow}><Text style={styles.gray}>Kan Grubu:</Text><Text style={[styles.pBold, { color: COLORS.primary }]}>A Rh(+)</Text></View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Akademik Durum</Text>
        <View style={styles.pRow}><Text style={styles.gray}>Üniversite:</Text><Text style={styles.pBold}>Samsun Üni.</Text></View>
        <View style={styles.pRow}><Text style={styles.gray}>Sınıf:</Text><Text style={styles.pBold}>Lisans</Text></View>
      </View>
    </ScrollView>
  );
}

// --- 4. KAN ŞEKERİ ANALİZİ ---
function FormScreen() {
  const [val, setVal] = useState('');
  const [history, setHistory] = useState([
    { id: 1, val: 95, status: 'Normal', date: '19.02.2026 08:30' },
    { id: 2, val: 65, status: 'Düşük', date: '18.02.2026 07:00' },
  ]);

  const save = () => {
    if (!val) return;
    const v = parseInt(val);
    let status = v < 70 ? 'Düşük' : v > 130 ? 'Yüksek' : 'Normal';
    setHistory([{ id: Date.now(), val: v, status, date: 'Bugün 11:00' }, ...history]);
    setVal('');
    if (v < 70) Alert.alert("Dikkat!", "Şekeriniz düşük, meyve suyu alınız.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputArea}>
        <Text style={styles.formLabel}>Yeni Ölçüm (mg/dL)</Text>
        <View style={styles.row}>
          <TextInput style={[styles.formInput, { flex: 1, marginRight: 10 }]} placeholder="95" keyboardType="numeric" value={val} onChangeText={setVal} />
          <TouchableOpacity style={styles.addSmallBtn} onPress={save}><Text style={styles.btnText}>Ekle</Text></TouchableOpacity>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Geçmiş Analizler</Text>
      <FlatList
        data={history}
        renderItem={({ item }) => (
          <View style={styles.analysisCard}>
            <View style={[styles.statusIndicator, { backgroundColor: item.status === 'Normal' ? COLORS.secondary : COLORS.primary }]} />
            <View style={{ flex: 1 }}><Text style={styles.listTitle}>{item.val} mg/dL - {item.status}</Text><Text style={styles.gray}>{item.date}</Text></View>
            <Text style={{ fontSize: 20 }}>{item.status === 'Normal' ? '✅' : '⚠️'}</Text>
          </View>
        )}
      />
    </View>
  );
}

// --- 5. HEDEFLERİM (Progress) ---
function GoalScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.goalDetailCard}>
        <Text style={styles.goalHeader}>🚶 Adım Sayısı</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBg}><View style={[styles.progressFill, { width: '85%' }]} /></View>
          <Text style={styles.percentText}>%85</Text>
        </View>
        <Text style={styles.gray}>8.500 / 10.000 Adım</Text>
      </View>
      <View style={[styles.goalDetailCard, { borderLeftColor: COLORS.blue }]}>
        <Text style={styles.goalHeader}>💧 Su Tüketimi</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBg}><View style={[styles.progressFill, { width: '40%', backgroundColor: COLORS.blue }]} /></View>
          <Text style={styles.percentText}>%40</Text>
        </View>
        <Text style={styles.gray}>1.2 L / 3.0 L</Text>
      </View>
      <View style={styles.achievementBox}>
        <Text style={styles.goalHeader}>🏆 Rozetlerin</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={{ fontSize: 24 }}>🔥</Text><Text style={styles.badgeText}>3 Gün Seri</Text></View>
          <View style={styles.badge}><Text style={{ fontSize: 24 }}>🥦</Text><Text style={styles.badgeText}>Sağlıklı</Text></View>
        </View>
      </View>
    </ScrollView>
  );
}

// --- 6. MOD TAKİBİ (Duygu Günlüğü) ---
function SurveyScreen() {
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([{ id: 1, mood: '🤩', note: 'Challenge projem harika gidiyor!', date: '19.02.2026' }]);

  const saveMood = (mood) => {
    if (!note) return Alert.alert("Not Ekle!", "Neler hissettiğini yazmalısın.");
    setHistory([{ id: Date.now(), mood, note, date: '19.02.2026' }, ...history]);
    setNote('');
    Alert.alert("Kaydedildi!", "Mod analizine eklendi.");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.moodFormCard}>
        <Text style={styles.goalHeader}>Modunu Seç ve Not Al:</Text>
        <View style={styles.moodRow}>
          {['😔', '😐', '🙂', '😊', '🤩'].map(m => (
            <TouchableOpacity key={m} style={styles.moodBtn} onPress={() => saveMood(m)}><Text style={{ fontSize: 30 }}>{m}</Text></TouchableOpacity>
          ))}
        </View>
        <TextInput style={styles.moodInput} placeholder="Duygularını buraya dök..." multiline value={note} onChangeText={setNote} />
      </View>
      {history.map(item => (
        <View key={item.id} style={styles.moodHistoryItem}>
          <Text style={{ fontSize: 35, marginRight: 15 }}>{item.mood}</Text>
          <View style={{ flex: 1 }}><Text style={styles.gray}>{item.date}</Text><Text style={styles.listTitle}>{item.note}</Text></View>
        </View>
      ))}
    </ScrollView>
  );
}

// --- 7. SSS & ACİL YARDIM & BİLDİRİMLER ---
function FAQScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.faqBox}><Text style={styles.faqQ}>❓ Uygulama nasıl çalışır?</Text><Text style={styles.faqA}>Sağlık verilerinizi girerek günlük analizler alabilirsiniz.</Text></View>
      <View style={styles.faqBox}><Text style={styles.faqQ}>❓ Verilerim güvende mi?</Text><Text style={styles.faqA}>Evet, tüm veriler şifreli olarak saklanmaktadır.</Text></View>
    </ScrollView>
  );
}

function NotificationScreen() {
  const NOTS = [
    { id: 1, t: 'İlaç Hatırlatıcı', d: 'Akşam ilacınızı almayı unutmayın.', time: '10 dk önce' },
    { id: 2, t: 'Başarı!', d: 'Adım hedefini geçmek üzeresin.', time: '1 saat önce' }
  ];
  return (
    <FlatList data={NOTS} style={styles.container} renderItem={({ item }) => (
      <View style={styles.notifCard}>
        <View style={[styles.statusIndicator, { backgroundColor: COLORS.blue, height: 40 }]} />
        <View><Text style={styles.listTitle}>{item.t}</Text><Text style={styles.gray}>{item.d}</Text><Text style={{ fontSize: 10 }}>{item.time}</Text></View>
      </View>
    )} />
  );
}

function WhatsAppScreen() {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 70 }}>🚑</Text>
      <Text style={styles.helloText}>Acil Durum Merkezi</Text>
      <TouchableOpacity style={styles.emergencyBtn} onPress={() => Linking.openURL('tel:112')}><Text style={styles.btnText}>Hemen 112'yi Ara</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.emergencyBtn, { backgroundColor: '#25D366' }]} onPress={() => Linking.openURL('whatsapp://send?phone=905555555555')}><Text style={styles.btnText}>Danışmana Yaz</Text></TouchableOpacity>
    </View>
  );
}

// --- NAVİGASYON ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center', headerTintColor: '#fff', headerShadowVisible: false }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'HealthInsight Pro', headerStyle: { backgroundColor: COLORS.primary } }} />
        <Stack.Screen name="Forms" component={FormScreen} options={{ title: 'Şeker Analizi', headerStyle: { backgroundColor: COLORS.primary } }} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ title: 'KOAH Eğitim', headerStyle: { backgroundColor: COLORS.secondary } }} />
        <Stack.Screen name="Goals" component={GoalScreen} options={{ title: 'Hedef Detayları', headerStyle: { backgroundColor: COLORS.yellow } }} />
        <Stack.Screen name="Notifications" component={NotificationScreen} options={{ title: 'Bildirimler', headerStyle: { backgroundColor: '#E17055' } }} />
        <Stack.Screen name="Survey" component={SurveyScreen} options={{ title: 'Mod Günlüğü', headerStyle: { backgroundColor: COLORS.purple } }} />
        <Stack.Screen name="FAQ" component={FAQScreen} options={{ title: 'Sık Sorulanlar', headerStyle: { backgroundColor: COLORS.blue } }} />
        <Stack.Screen name="WhatsApp" component={WhatsAppScreen} options={{ title: 'Acil Yardım', headerStyle: { backgroundColor: '#00B894' } }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profilim', headerStyle: { backgroundColor: COLORS.blue } }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- STİLLER ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heroHeader: { backgroundColor: COLORS.primary, paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, padding: 20 },
  profileBadge: { backgroundColor: '#fff', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 10 },
  avatarMini: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#F1F2F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  helloText: { fontWeight: 'bold', fontSize: 18, color: COLORS.text },
  statusText: { fontSize: 12, color: COLORS.gray },
  toolCard: { backgroundColor: '#fff', width: (width - 40) / 2, margin: 10, padding: 20, borderRadius: 25, borderTopWidth: 6, elevation: 4 },
  toolIcon: { fontSize: 35, marginBottom: 8 },
  toolTitle: { fontWeight: 'bold', fontSize: 15, color: COLORS.text },
  toolDesc: { fontSize: 10, color: COLORS.gray, marginTop: 4 },
  inputArea: { backgroundColor: '#fff', padding: 20, margin: 15, borderRadius: 20, elevation: 5 },
  formLabel: { fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  formInput: { borderBottomWidth: 2, borderBottomColor: COLORS.primary, padding: 10, fontSize: 18 },
  addSmallBtn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { margin: 15, fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  analysisCard: { backgroundColor: '#fff', marginHorizontal: 15, marginVertical: 5, padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  statusIndicator: { width: 8, height: 40, borderRadius: 4, marginRight: 15 },
  listTitle: { fontWeight: 'bold', fontSize: 16 },
  goalDetailCard: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 20, elevation: 3, borderLeftWidth: 8, borderLeftColor: COLORS.yellow },
  goalHeader: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  progressBg: { flex: 1, height: 10, backgroundColor: '#F1F2F6', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.secondary },
  percentText: { marginLeft: 10, fontWeight: 'bold', color: COLORS.text },
  achievementBox: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 20, elevation: 3 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  badge: { alignItems: 'center' },
  badgeText: { fontSize: 10, color: COLORS.gray, marginTop: 5 },
  pHeader: { alignItems: 'center', padding: 40, backgroundColor: COLORS.blue, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  pCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 15 },
  pName: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  pSub: { color: '#D1D5DB', marginTop: 5 },
  pInfoBox: { margin: 20, padding: 25, backgroundColor: '#fff', borderRadius: 25, elevation: 5 },
  pRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  pBold: { fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  searchWrapper: { padding: 15, backgroundColor: '#fff' },
  searchBar: { backgroundColor: COLORS.bg, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#DCDDE1' },
  exerciseCard: { marginHorizontal: 15, marginVertical: 6, padding: 18, backgroundColor: '#fff', borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 3 },
  statusBadge: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  playBtn: { padding: 10 },
  moodFormCard: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 25, elevation: 5 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 },
  moodBtn: { width: 50, height: 50, backgroundColor: COLORS.bg, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  moodInput: { backgroundColor: COLORS.bg, borderRadius: 15, padding: 15, height: 100, textAlignVertical: 'top' },
  moodHistoryItem: { backgroundColor: '#fff', marginHorizontal: 15, marginVertical: 5, padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  faqBox: { backgroundColor: '#fff', margin: 10, padding: 20, borderRadius: 15, elevation: 2 },
  faqQ: { fontWeight: 'bold', color: COLORS.blue, marginBottom: 8 },
  faqA: { color: COLORS.gray, lineHeight: 20 },
  emergencyBtn: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 20, width: '100%', alignItems: 'center', marginVertical: 10 },
  notifCard: { backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  gray: { color: COLORS.gray, fontSize: 12 },
  loaderText: { marginTop: 15, fontWeight: 'bold', color: COLORS.gray }
});