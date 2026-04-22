import { Tabs } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// 🎨 Colores de la app
const C = {
  primary:  '#e26a07',
  active:   '#ffffff',
  inactive: 'rgba(255,255,255,0.5)',
  bar:      '#e26a07',
  border:   '#111111',
}

// 🔹 Icono con puntito activo
function TabIcon({ name, focused, color }) {
  return (
    <View style={styles.iconWrap}>
      <Ionicons name={name} size={22} color={color} />

      {/* 🔥 Puntito cuando está activo */}
      {focused && <View style={styles.activeDot} />}
    </View>
  )
}

// 🔹 Layout principal de tabs
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // 🎨 colores iconos
        tabBarActiveTintColor: C.active,
        tabBarInactiveTintColor: C.inactive,

        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,

        // 🔥 Se oculta cuando escribes (chat IA)
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="workout"
        options={{
          title: 'Entreno',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'barbell' : 'barbell-outline'} focused={focused} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recetas',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'restaurant' : 'restaurant-outline'} focused={focused} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="trainer"
        options={{
          title: 'IA',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'sparkles' : 'sparkles-outline'} focused={focused} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="store"
        options={{
          title: 'Tienda',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'bag' : 'bag-outline'} focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
  position: typeof window !== 'undefined' ? 'fixed' : 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 70,
  backgroundColor: C.bar,
  borderTopWidth: 2,
  borderTopColor: C.border,
  zIndex: 999,
  elevation: 10,
},

  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },

  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },

  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    marginTop: 2,
  },
})