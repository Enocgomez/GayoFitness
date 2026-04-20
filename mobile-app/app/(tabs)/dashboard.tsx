
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import {
  getLocalUser,
  getTodayStats,
  getWeeklyStats,
  getRecommendations,
} from '@/services/api';

// 🔴 PROGRESS RING
function ProgressRing({ percent }: { percent: number }) {
  const SIZE = 120;
  const BORDER = 10;

  return (
    <View style={{ alignItems: 'center', marginBottom: 16 }}>
      <View
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: BORDER,
          borderColor: '#e5e7eb',
          borderTopColor: '#ef4444',
          borderRightColor: '#ef4444',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThemedText style={styles.ringPercent}>{percent}%</ThemedText>
        <ThemedText style={styles.ringLabel}>completado</ThemedText>
      </View>
    </View>
  );
}

// 🔴 WEEKLY BARS DINÁMICO
function WeeklyBars({ data }: { data: number[] }) {
  const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  const values = data.length ? data : [0, 0, 0, 0, 0, 0, 0];

  const maxVal = Math.max(...values, 1);
  const BAR_MAX_HEIGHT = 140;
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <View style={styles.barContainer}>
      {days.map((day, i) => {
        const barHeight = Math.max(
          8,
          Math.round((values[i] / maxVal) * BAR_MAX_HEIGHT)
        );
        const isToday = i === todayIndex;

        return (
          <View key={i} style={styles.barItem}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { height: barHeight },
                  isToday ? styles.barActive : styles.barInactive,
                ]}
              />
            </View>
            <ThemedText
              style={[styles.barLabel, isToday && styles.barLabelActive]}
            >
              {day}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

// 🔴 STAT BOX
function StatBox({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statBox}>
      <ThemedText style={styles.statIcon}>{icon}</ThemedText>
      <ThemedText style={styles.statNumber}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

// 🔴 QUICK CARD
function QuickCard({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickCard} onPress={onPress}>
      <ThemedText style={styles.quickIcon}>{icon}</ThemedText>
      <ThemedText style={styles.quickText}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

// 🔴 RECOMMEND CARD
function RecommendCard({ item }: { item: any }) {
  return (
    <View style={styles.recommendCard}>
      <View style={styles.recommendImagePlaceholder}>
        <ThemedText style={styles.recommendEmoji}>
          {item?.emoji || '🔥'}
        </ThemedText>
      </View>
      <ThemedText style={styles.recommendType}>
        {item?.type || 'Fitness'}
      </ThemedText>
      <ThemedText style={styles.recommendTitle}>
        {item?.title || 'Recomendación'}
      </ThemedText>
      <ThemedText style={styles.recommendKcal}>
        {item?.kcal || ''}
      </ThemedText>
    </View>
  );
}

// 🔥 DASHBOARD PRINCIPAL
export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState({ name: '', goal: '' });
  const [todayStats, setTodayStats] = useState<any>(null);
  const [weeklyStats, setWeeklyStats] = useState<number[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, today, weekly, recs] = await Promise.all([
        getLocalUser(),
        getTodayStats(),
        getWeeklyStats(),
        getRecommendations(),
      ]);

      setUser(userData);
      setTodayStats(today);
      setWeeklyStats(weekly.map((d: any) => d.progress));
      setRecommendations(recs);
    } catch (err) {
      console.log('ERROR LOAD DATA:', err);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText style={styles.greeting}>¡Buenos días,</ThemedText>
        <ThemedText style={styles.name}>{user.name}</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ACTIVIDAD */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Actividad diaria</ThemedText>

          <ProgressRing percent={todayStats?.progress || 0} />

          <View style={styles.statsRow}>
            <StatBox
              icon="🔥"
              value={todayStats?.calories || '0'}
              label="kcal"
            />
            <View style={styles.statDivider} />
            <StatBox
              icon="👟"
              value={todayStats?.steps || '0'}
              label="pasos"
            />
            <View style={styles.statDivider} />
            <StatBox
              icon="⏱"
              value={todayStats?.activeMinutes || '0'}
              label="activo"
            />
          </View>
        </View>

        {/* WEEKLY */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>
            Progreso semanal
          </ThemedText>

          <WeeklyBars data={weeklyStats} />
        </View>

        {/* QUICK */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>
            Acceso rápido
          </ThemedText>

          <View style={styles.quickGrid}>
            <QuickCard
              icon="🏋️"
              label="Entrenamientos"
              onPress={() => router.replace('/workout')}
            />
            <QuickCard
              icon="🍽️"
              label="Recetas"
              onPress={() => router.replace('/recipes')}
            />
            <QuickCard
              icon="🛒"
              label="Carrito"
              onPress={() => router.replace('/store')}
            />
          </View>
        </View>

        {/* RECOMMEND */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>
            Recomendado para ti
          </ThemedText>

          <ScrollView horizontal>
            {recommendations.map((item, i) => (
              <RecommendCard key={i} item={item} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 13,
    color: '#6b7280',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 2,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },

  // Card base
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 14,
  },

  // Anillo
  ringPercent: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ef4444',
  },
  ringLabel: {
    fontSize: 15,
    color: '#94a3b8',
    marginTop: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  statDivider: {
    width: 8,
  },
  statIcon: {
    fontSize: 23,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 2,
  },

  // Barras semanales
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  barTrack: {
    width: '100%',
    height: 150,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 3,
  },
  barFill: {
    width: '100%',
    borderRadius: 18,
  },
  barActive: {
    backgroundColor: '#ef4444',
  },
  barInactive: {
    backgroundColor: '#cbd5e1',
  },
  barLabel: {
    fontSize: 15,
    color: '#9ca3af',
  },
  barLabelActive: {
    color: '#ef4444',
    fontWeight: '600',
  },

  // Acceso rápido
  quickGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    gap: 6,
  },
  quickIcon: {
    fontSize: 30,
  },
  quickText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6b7280',
  },

  // Recomendaciones
  recommendCard: {
    width: 280,
    marginRight: 12,
  },
  recommendImagePlaceholder: {
    height: 180,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recommendEmoji: {
    fontSize: 32,
  },
  recommendType: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 2,
  },
  recommendTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  recommendKcal: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Utilidades
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  redText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '500',
  },
});