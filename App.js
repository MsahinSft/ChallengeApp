import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList,
  Dimensions, SafeAreaView, ScrollView, TextInput,
  ActivityIndicator, Alert, StatusBar, Linking, Animated, Image
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- TASARIM SİSTEMİ (HealthInsight Pro) ---
const COLORS = {
  primary: '#EF5350',   // Coral Red (Health Alerts)
  secondary: '#27AE60', // Emerald Green (Success/Exercise)
  info: '#3498DB',      // Sky Blue (Information)
  warning: '#F1C40F',   // Yellow (Goals/Warnings)
  bg: '#F0F4F8',        // Very Light Blue-Grey Background
  card: '#FFFFFF',
  text: '#2C3E50',      // Dark Blue-Grey Text
  subText: '#7F8C8D',   // Gray Text
  white: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.9)' // Semi-transparent white
};

const Stack = createStackNavigator();
const { width } = Dimensions.get('window');

// --- REUSABLE COMPONENTS ---

// Glassmorphism Card
const GlassCard = ({ children, style, onPress, delay = 0 }) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
      delay
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.glassCard, style, { transform: [{ scale }] }]}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Interactive Header
const HealthHeader = ({ navigation }) => {
  return (
    <View style={styles.heroHeader}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.greetingText}>Merhaba, Mustafa 👋</Text>
          <Text style={styles.statusText}>Bugün harika görünüyorsun!</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={{ fontSize: 24 }}>👨‍💻</Text>
        </TouchableOpacity>
      </View>
      {/* Interactive Status Banner */}
      <View style={styles.statusBanner}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Nabız</Text>
          <Text style={styles.statusValue}>72 bpm</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Uyku</Text>
          <Text style={styles.statusValue}>7s 30dk</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Kalori</Text>
          <Text style={styles.statusValue}>1.250</Text>
        </View>
      </View>
    </View>
  );
};

// --- SCREENS ---

// 1. DASHBOARD (Grid Layout)
function HomeScreen({ navigation }) {
  const TOOLS = [
    { id: '1', title: 'Kan Şekeri', icon: '🩸', screen: 'Forms', color: COLORS.primary, desc: 'Analiz & Takip' },
    { id: '2', title: 'KOAH Eğitim', icon: '🫁', screen: 'Exercise', color: COLORS.secondary, desc: 'Egzersizler' },
    { id: '3', title: 'Hedeflerim', icon: '🎯', screen: 'Goals', color: COLORS.warning, desc: 'İlerleme' },
    { id: '4', title: 'Mod Günlüğü', icon: '🎭', screen: 'Survey', color: '#9B59B6', desc: 'Duygu Durumu' },
    { id: '5', title: 'Acil Durum', icon: '🆘', screen: 'Emergency', color: COLORS.primary, desc: 'Hızlı Yardım' },
    { id: '6', title: 'Bildirimler', icon: '🔔', screen: 'Notifications', color: '#E67E22', desc: 'Duyurular' },
    { id: '7', title: 'Profil', icon: '👤', screen: 'Profile', color: COLORS.info, desc: 'Kişisel Bilgiler' },
    { id: '8', title: 'SSS', icon: '❓', screen: 'FAQ', color: COLORS.subText, desc: 'Yardım' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <HealthHeader navigation={navigation} />
        <View style={styles.gridContainer}>
          {TOOLS.map((item, index) => (
            <GlassCard
              key={item.id}
              style={[styles.gridItem, { borderLeftColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
              delay={index * 100}
            >
              <Text style={styles.toolIcon}>{item.icon}</Text>
              <Text style={styles.toolTitle}>{item.title}</Text>
              <Text style={styles.toolDesc}>{item.desc}</Text>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 2. FORMS (Kan Şekeri)
// Animated Chart Component
const BloodSugarChart = ({ history }) => {
  // Simple visualization: bars based on value relative to 200
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Son 7 Ölçüm Trendi</Text>
      <View style={styles.chartRow}>
        {history.slice(0, 7).map((item, index) => {
          const height = Math.min((item.val / 200) * 100, 100);
          const color = item.val > 130 ? COLORS.primary : item.val < 70 ? COLORS.warning : COLORS.secondary;
          return (
            <View key={index} style={styles.barContainer}>
              <View style={[styles.barFill, { height: `${height}%`, backgroundColor: color }]} />
              <Text style={styles.barLabel}>{item.val}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

function FormScreen() {
  const [val, setVal] = useState('');
  const [history, setHistory] = useState([
    { id: 1, val: 95, status: 'Normal', date: '19.02 08:30' },
    { id: 2, val: 145, status: 'Yüksek', date: '18.02 21:00' },
    { id: 3, val: 65, status: 'Düşük', date: '18.02 07:00' },
    { id: 4, val: 98, status: 'Normal', date: '17.02 08:30' },
    { id: 5, val: 105, status: 'Normal', date: '16.02 22:15' },
  ]);

  const save = () => {
    if (!val) return;
    const v = parseInt(val);
    let status = v < 70 ? 'Düşük' : v > 130 ? 'Yüksek' : 'Normal';
    setHistory([{ id: Date.now(), val: v, status, date: 'Bugün ' + new Date().getHours() + ':' + new Date().getMinutes() }, ...history]);
    setVal('');
    if (v < 70) Alert.alert("Dikkat!", "Şekeriniz düşük, meyve suyu alınız.");
    if (v > 130) Alert.alert("Uyarı", "Şekeriniz yüksek, lütfen dikkat edin.");
  };

  return (
    <View style={styles.container}>
      <BloodSugarChart history={history} />

      <GlassCard style={styles.inputCard}>
        <Text style={styles.sectionHeader}>Yeni Ölçüm Ekle</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.mainInput}
            placeholder="Örn: 98"
            keyboardType="numeric"
            value={val}
            onChangeText={setVal}
            placeholderTextColor="#BDC3C7"
          />
          <Text style={styles.unitText}>mg/dL</Text>
        </View>
        <TouchableOpacity style={styles.fabBtn} onPress={save}>
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      </GlassCard>

      <FlatList
        data={history}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <View style={[styles.historyRow, { borderLeftColor: item.status === 'Normal' ? COLORS.secondary : COLORS.primary }]}>
            <View>
              <Text style={styles.historyVal}>{item.val} mg/dL</Text>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'Normal' ? COLORS.secondary : COLORS.primary }]}>
              <Text style={styles.statusBadgeText}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// 3. EXERCISE (KOAH Eğitim - Video Library)
function ExerciseScreen() {
  const VIDEOS = [
    { id: '1', title: 'Derin Nefes Egzersizi', duration: '5 dk', videoId: '8VwufJrUhic' }, // Placeholder IDs
    { id: '2', title: 'KOAH İçin Yürüyüş', duration: '15 dk', videoId: '7wI2wQvB0Xg' },
    { id: '3', title: 'Üst Gövde Güçlendirme', duration: '10 dk', videoId: 'h7w_l0aM1I4' },
    { id: '4', title: 'Doğru Nefes Teknikleri', duration: '7 dk', videoId: 'Mg2_0yZkL9I' },
  ];

  const openVideo = (videoId) => {
    Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={VIDEOS}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <GlassCard style={styles.videoCard} onPress={() => openVideo(item.videoId)}>
            <Image
              source={{ uri: `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg` }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.playOverlay}>
              <View style={styles.playIconContainer}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <View style={{ flex: 1 }}>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.videoDuration}>⏱ {item.duration}</Text>
              </View>
              <Text style={styles.externalIcon}>↗</Text>
            </View>
          </GlassCard>
        )}
      />
    </View>
  );
}

// 4. GOALS (Hedeflerim - Interactive)
// Helper Component for Stepper
const Stepper = ({ value, onChange, unit }) => (
  <View style={styles.stepperContainer}>
    <TouchableOpacity style={styles.stepperBtn} onPress={() => onChange(value - 100)}>
      <Text style={styles.stepperText}>-</Text>
    </TouchableOpacity>
    <Text style={styles.stepperValue}>{value} <Text style={{ fontSize: 14 }}>{unit}</Text></Text>
    <TouchableOpacity style={styles.stepperBtn} onPress={() => onChange(value + 100)}>
      <Text style={styles.stepperText}>+</Text>
    </TouchableOpacity>
  </View>
);

const ProgressBar = ({ label, current, target, color, icon }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (current / target) * 100,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [current, target]);

  const widthInterp = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <GlassCard style={styles.goalCard}>
      <View style={styles.goalHeaderRow}>
        <Text style={styles.goalTitle}>{icon} {label}</Text>
        <Text style={styles.goalValue}>{current} / {target}</Text>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: widthInterp, backgroundColor: color }]} />
      </View>
    </GlassCard>
  );
};

function GoalScreen() {
  const [targetStep, setTargetStep] = useState(10000);
  const [todayStep, setTodayStep] = useState(8500);

  const saveGoal = () => {
    Alert.alert("Başarılı! 🎉", "Bugünkü hedefin güncellendi.");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 15 }}>
        {/* Set Today's Goal Card */}
        <GlassCard style={styles.setGoalCard}>
          <Text style={styles.setGoalTitle}>🚀 Bugünün Egzersiz Hedefini Belirle</Text>
          <View style={{ marginVertical: 15 }}>
            <Stepper value={targetStep} onChange={(v) => v > 0 && setTargetStep(v)} unit="Adım" />
          </View>
          <TouchableOpacity style={styles.saveGoalBtn} onPress={saveGoal}>
            <Text style={styles.btnText}>Hedefi Kaydet</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Existing Progress Bars */}
        <ProgressBar label="Adım Sayısı" current={todayStep} target={targetStep} color={COLORS.secondary} icon="👣" />
        <ProgressBar label="Su Tüketimi" current={1.2} target={2.5} color={COLORS.info} icon="💧" />
        <ProgressBar label="Kalori Yakımı" current={450} target={600} color={COLORS.primary} icon="🔥" />

        <Text style={styles.sectionTitle}>Rozetlerin</Text>
        <View style={styles.badgeRow}>
          <GlassCard style={styles.badgeCard}>
            <Text style={styles.badgeIcon}>🏆</Text>
            <Text style={styles.badgeText}>3 Gün Seri</Text>
          </GlassCard>
          <GlassCard style={styles.badgeCard}>
            <Text style={styles.badgeIcon}>🥇</Text>
            <Text style={styles.badgeText}>10K Adım</Text>
          </GlassCard>
          <GlassCard style={styles.badgeCard}>
            <Text style={styles.badgeIcon}>🥗</Text>
            <Text style={styles.badgeText}>Sağlıklı</Text>
          </GlassCard>
        </View>
      </View>
    </ScrollView>
  );
}

// 5. SURVEY (Mod Günlüğü)
function SurveyScreen() {
  const [note, setNote] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const moods = ['😔', '😐', '🙂', '😊', '🤩'];

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 15 }}>
        <GlassCard style={styles.moodCard}>
          <Text style={styles.sectionHeader}>Bugün nasıl hissediyorsun?</Text>
          <View style={styles.moodRow}>
            {moods.map((m, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedMood(m)}
                style={[styles.moodBtn, selectedMood === m && styles.moodSelected]}>
                <Text style={{ fontSize: 32 }}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.moodInput}
            placeholder="Düşüncelerini buraya yaz..."
            multiline
            value={note}
            onChangeText={setNote}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert("Kaydedildi", "Ruh halin günlüğe işlendi!")}>
            <Text style={styles.btnText}>Günlüğe Ekle</Text>
          </TouchableOpacity>
        </GlassCard>

        <Text style={styles.sectionTitle}>Geçmiş Kayıtlar</Text>
        <GlassCard style={styles.historyRow}>
          <Text style={{ fontSize: 30 }}>🤩</Text>
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.historyDate}>Bugün, 09:00</Text>
            <Text style={styles.listTitle}>Harika bir sabah!</Text>
          </View>
        </GlassCard>
      </View>
    </ScrollView>
  );
}

// 6. EMERGENCY (Acil Durum)
function EmergencyScreen() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.center, { backgroundColor: '#FFEBEE' }]}>
      <Text style={styles.emergencyTitle}>ACİL DURUM PANELİ</Text>
      <Text style={styles.emergencyDesc}>Acil bir durumda aşağıdaki butona basarak 112'yi arayabilirsiniz.</Text>

      <TouchableOpacity onPress={() => Linking.openURL('tel:112')}>
        <Animated.View style={[styles.sosBtn, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.sosText}>SOS</Text>
          <Text style={styles.subSosText}>112 ARA</Text>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.whatsappBtn} onPress={() => Linking.openURL('whatsapp://send?phone=905555555555')}>
        <Text style={styles.btnText}>💬 Doktorunla WhatsApp'tan Görüş</Text>
      </TouchableOpacity>
    </View>
  );
}

// 7. NOTIFICATIONS
const NotificationScreen = () => {
  const NOTS = [
    { id: 1, t: 'İlaç Hatırlatıcı', d: 'Akşam ilacınızı almayı unutmayın.', time: '10 dk önce', type: 'alert' },
    { id: 2, t: 'Harika İş!', d: 'Bugünkü adım hedefini tamamladın.', time: '1 saat önce', type: 'success' },
    { id: 3, t: 'Su İçme Vakti', d: 'Günlük hedefine ulaşmak için 2 bardak daha.', time: '2 saat önce', type: 'info' }
  ];
  return (
    <View style={styles.container}>
      <FlatList data={NOTS} contentContainerStyle={{ padding: 15 }} renderItem={({ item }) => (
        <GlassCard style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.type === 'alert' ? COLORS.primary : item.type === 'success' ? COLORS.secondary : COLORS.info, marginRight: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{item.t}</Text>
            <Text style={styles.gray}>{item.d}</Text>
          </View>
          <Text style={{ fontSize: 10, color: COLORS.subText }}>{item.time}</Text>
        </GlassCard>
      )} />
    </View>
  );
};

// 8. PROFILE (Editable)
const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Mustafa Şahin",
    age: "21",
    height: "180",
    weight: "75",
    blood: "A Rh(+)"
  });

  const handleCreate = (key, val) => {
    setUserInfo({ ...userInfo, [key]: val })
  }

  const toggleEdit = () => {
    if (isEditing) {
      Alert.alert("Kaydedildi", "Profil bilgileriniz güncellendi.");
    }
    setIsEditing(!isEditing);
  }

  const EditableRow = ({ label, valKey, suffix = "" }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
      <Text style={styles.gray}>{label}</Text>
      {isEditing ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: COLORS.primary }}>
          <TextInput
            value={userInfo[valKey]}
            onChangeText={(t) => handleCreate(valKey, t)}
            style={{ fontWeight: 'bold', color: COLORS.text, padding: 0, minWidth: 50, textAlign: 'right' }}
            keyboardType="numeric"
          />
          {suffix ? <Text style={styles.listTitle}>{suffix}</Text> : null}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.listTitle}>{userInfo[valKey]}{suffix}</Text>
          <Text style={{ fontSize: 10, marginLeft: 5, color: COLORS.primary }}>✎</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: 'center', padding: 30 }}>
        {/* Avatar area */}
        <View style={{ position: 'relative' }}>
          <GlassCard style={{ width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ fontSize: 50 }}>👨‍💻</Text>
          </GlassCard>
          <TouchableOpacity style={styles.editAvatarBtn} onPress={toggleEdit}>
            <Text style={{ fontSize: 12 }}>✏️</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.text }}>{userInfo.name}</Text>
        <Text style={{ color: COLORS.subText }}>Yazılım Mühendisliği</Text>

        <TouchableOpacity style={styles.editProfileBtn} onPress={toggleEdit}>
          <Text style={styles.editProfileText}>{isEditing ? "💾 Değişiklikleri Kaydet" : "⚙️ Profili Düzenle"}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 15 }}>
        <GlassCard style={{ padding: 20 }}>
          <EditableRow label="Yaş" valKey="age" />
          <EditableRow label="Boy" valKey="height" suffix=" cm" />
          <EditableRow label="Kilo" valKey="weight" suffix=" kg" />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            <Text style={styles.gray}>Kan Grubu</Text>
            <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>{userInfo.blood}</Text>
          </View>
        </GlassCard>
      </View>
    </ScrollView>
  );
};

// 9. FAQ
const FAQScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 15 }}>
      <GlassCard style={{ padding: 20, marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold', color: COLORS.info, marginBottom: 5 }}>❓ Verilerim güvende mi?</Text>
        <Text style={styles.gray}>Evet, tüm sağlık verileriniz cihazınızda şifreli olarak saklanır.</Text>
      </GlassCard>
      <GlassCard style={{ padding: 20 }}>
        <Text style={{ fontWeight: 'bold', color: COLORS.info, marginBottom: 5 }}>❓ Nasıl hedef belirlerim?</Text>
        <Text style={styles.gray}>Hedeflerim sayfasından günlük adım ve su hedeflerinizi düzenleyebilirsiniz.</Text>
      </GlassCard>
    </ScrollView>
  );
};


// --- NAVIGATION ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: COLORS.primary },
          cardStyle: { backgroundColor: COLORS.bg }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Forms" component={FormScreen} options={{ title: 'Şeker Analizi', headerStyle: { backgroundColor: COLORS.primary } }} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ title: 'KOAH Eğitim', headerStyle: { backgroundColor: COLORS.secondary } }} />
        <Stack.Screen name="Goals" component={GoalScreen} options={{ title: 'Hedeflerim', headerStyle: { backgroundColor: COLORS.warning } }} />
        <Stack.Screen name="Survey" component={SurveyScreen} options={{ title: 'Mod Günlüğü', headerStyle: { backgroundColor: '#9B59B6' } }} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Acil Durum' }} />
        <Stack.Screen name="Notifications" component={NotificationScreen} options={{ title: 'Bildirimler', headerStyle: { backgroundColor: '#E67E22' } }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profilim', headerStyle: { backgroundColor: COLORS.info } }} />
        <Stack.Screen name="FAQ" component={FAQScreen} options={{ title: 'SSS', headerStyle: { backgroundColor: COLORS.subText } }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 20
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statusText: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  profileBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  statusBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  statusItem: { alignItems: 'center' },
  statusLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 },
  statusValue: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  verticalDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  glassCard: {
    backgroundColor: COLORS.glass,
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#fff'
  },
  gridItem: {
    width: (width - 50) / 2,
    borderLeftWidth: 5,
    height: 140, // Fixed height
    justifyContent: 'center',
    alignItems: 'center'
  },
  toolIcon: { fontSize: 32, marginBottom: 10 },
  toolTitle: { fontWeight: 'bold', fontSize: 16, color: COLORS.text, textAlign: 'center' },
  toolDesc: { fontSize: 11, color: COLORS.subText, marginTop: 4, textAlign: 'center' },

  // Charts & Forms
  chartContainer: { height: 200, backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 20, elevation: 3 },
  chartTitle: { fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1 },
  barContainer: { alignItems: 'center', flex: 1 },
  barFill: { width: 12, borderRadius: 6 },
  barLabel: { fontSize: 10, color: COLORS.subText, marginTop: 5 },
  inputCard: { marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  sectionHeader: { fontWeight: 'bold', color: COLORS.text, position: 'absolute', top: 10, left: 20, fontSize: 12, color: COLORS.subText },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 15 },
  mainInput: { fontSize: 32, fontWeight: 'bold', color: COLORS.text, width: 120, borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  unitText: { marginBottom: 10, marginLeft: 10, color: COLORS.subText },
  fabBtn: { width: 50, height: 50, backgroundColor: COLORS.primary, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabIcon: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  historyRow: { backgroundColor: '#fff', padding: 15, marginVertical: 5, borderRadius: 15, borderLeftWidth: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  historyVal: { fontWeight: 'bold', fontSize: 16, color: COLORS.text },
  historyDate: { fontSize: 12, color: COLORS.subText },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  // Exercise & Goals
  exerciseCard: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  listTitle: { fontWeight: 'bold', fontSize: 16, color: COLORS.text },
  gray: { color: COLORS.subText, fontSize: 12, marginTop: 4 },
  playBtn: { padding: 10 },
  goalCard: { padding: 20 },
  goalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  goalTitle: { fontWeight: 'bold', fontSize: 16 },
  goalValue: { color: COLORS.subText },
  progressTrack: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  sectionTitle: { margin: 15, fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-around' },
  badgeCard: { alignItems: 'center', width: '30%', padding: 10 },
  badgeIcon: { fontSize: 30 },
  badgeText: { fontSize: 12, marginTop: 5, fontWeight: 'bold', color: COLORS.subText },

  // Mood
  moodCard: { padding: 20 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  moodBtn: { padding: 5, borderRadius: 10 },
  moodSelected: { backgroundColor: '#E8F5E9', transform: [{ scale: 1.2 }] },
  moodInput: { backgroundColor: '#F8F9F9', borderRadius: 15, padding: 15, height: 100, textAlignVertical: 'top', marginTop: 10 },
  saveBtn: { backgroundColor: COLORS.secondary, padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 15 },
  btnText: { color: '#fff', fontWeight: 'bold' },

  // Emergency
  emergencyTitle: { fontSize: 24, fontWeight: 'bold', color: '#D32F2F', marginBottom: 10 },
  emergencyDesc: { textAlign: 'center', color: '#555', marginBottom: 30, paddingHorizontal: 40 },
  sosBtn: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#D32F2F', justifyContent: 'center', alignItems: 'center', elevation: 20, shadowColor: '#D32F2F', shadowRadius: 20, shadowOpacity: 0.5 },
  sosText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  subSosText: { color: '#fff', fontSize: 16 },
  whatsappBtn: { backgroundColor: '#25D366', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 30, width: '80%', marginTop: 40, elevation: 5 },

  // New Video & Profile Styles
  videoCard: { padding: 0, overflow: 'hidden', height: 220 },
  thumbnail: { width: '100%', height: 150, backgroundColor: '#eee' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  playIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  playIcon: { fontSize: 20, color: COLORS.primary },
  videoInfo: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  videoTitle: { fontWeight: 'bold', color: COLORS.text, fontSize: 15 },
  videoDuration: { color: COLORS.subText, fontSize: 12, marginTop: 4 },
  externalIcon: { fontSize: 20, color: COLORS.subText },

  // Interactive Goals
  setGoalCard: { padding: 20, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: COLORS.secondary },
  setGoalTitle: { fontWeight: 'bold', fontSize: 16, color: COLORS.text },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F2F5', borderRadius: 15, padding: 5 },
  stepperBtn: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  stepperText: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  stepperValue: { marginHorizontal: 20, fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  saveGoalBtn: { backgroundColor: COLORS.secondary, padding: 15, borderRadius: 15, alignItems: 'center' },

  // Editable Profile
  editAvatarBtn: { position: 'absolute', bottom: 15, right: 0, backgroundColor: '#fff', padding: 5, borderRadius: 15, elevation: 3 },
  editProfileBtn: { marginTop: 10, paddingVertical: 8, paddingHorizontal: 20, backgroundColor: '#E3F2FD', borderRadius: 20 },
  editProfileText: { color: COLORS.info, fontWeight: 'bold' }
});