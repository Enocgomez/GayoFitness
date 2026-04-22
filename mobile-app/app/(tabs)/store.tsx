import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';

const API = "http://10.10.2.221:3000/api/products"; // tu IP

type Product = {
  id: string;
  name: string;
  price: number;
  stars: number;
  category: string;
  image: string;
};

const CATEGORIES = ['Todos', 'Suplementos', 'Equipamiento', 'Ropa'];

function formatPrice(n: number) {
  return '\u20AC' + n.toFixed(2).replace('.', ',');
}

function Stars({ count }: { count: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={i <= count ? styles.starFilled : styles.starEmpty}>★</Text>
      ))}
    </View>
  );
}

function ProductCard({ item, onToggleCart, inCart, onToggleFav, isFav }: any) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.heartBtn} onPress={() => onToggleFav(item.id)}>
        <Text style={[styles.heartIcon, isFav && styles.heartIconActive]}>
          {isFav ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>

      {/* 🔥 IMAGEN DESDE BACKEND */}
      <Image source={{ uri: item.image }} style={styles.productImage} />

      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <Stars count={item.stars} />

      <View style={styles.cardFooter}>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <TouchableOpacity
          style={[styles.addBtn, inCart && styles.addBtnActive]}
          onPress={() => onToggleCart(item.id)}
        >
          <Text style={[styles.addBtnText, inCart && styles.addBtnTextActive]}>
            {inCart ? '✓' : '+'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState<string[]>([]);
  const [favs, setFavs] = useState<string[]>([]);

  // 🔥 CARGAR PRODUCTOS
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      // 🔥 ADAPTAMOS BACKEND → FRONTEND
      const adapted = data.map((p: any) => ({
        id: p._id,
        name: p.nombre,
        price: p.precio,
        stars: 4,
        category: p.categoria,
        image: p.imagen,
      }));

      setProducts(adapted);
    } catch (err) {
      console.log('ERROR PRODUCTS:', err);
    }
  };

  const toggleCart = (id: string) =>
    setCart((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleFav = (id: string) =>
    setFavs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tienda</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView horizontal>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)}>
              <Text>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onToggleCart={toggleCart}
            inCart={cart.includes(item.id)}
            onToggleFav={toggleFav}
            isFav={favs.includes(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f2f4f7' },

  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#111827' },

  /* FIX: position:'relative' es necesario para que el badge absoluto funcione */
  cartBtn: { position: 'relative', padding: 4 },
  cartIcon: { fontSize: 24 },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  /* FIX: flexDirection:'row' para que el icono y el input queden en la misma fila */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f4f7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  searchEmoji: { fontSize: 15 },
  /* FIX: padding:0 elimina el padding interno de TextInput en Android */
  searchInput: { flex: 1, fontSize: 14, color: '#111827', padding: 0 },
  clearBtn: { fontSize: 13, color: '#9ca3af', paddingHorizontal: 4 },

  categoriesRow: { gap: 8, paddingRight: 4 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f2f4f7',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryChipActive: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  categoryText: { fontSize: 13, fontWeight: '500', color: '#6b7280' },
  categoryTextActive: { color: '#ffffff', fontWeight: '600' },

  grid: { padding: 12, paddingBottom: 32 },
  /* FIX: columnWrapperStyle faltaba — da espaciado entre columnas */
  columnWrapper: { gap: 10, marginBottom: 10 },

  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  heartBtn: { position: 'absolute', top: 10, right: 10, zIndex: 1, padding: 4 },
  heartIcon: { fontSize: 18, color: '#d1d5db' },
  heartIconActive: { color: '#ef4444' },
  productImage: { width: '100%', height: 110, resizeMode: 'contain', marginBottom: 8 },
  /* FIX: minHeight para tarjetas uniformes cuando el nombre es corto */
  productName: {
    fontSize: 12, fontWeight: '600', color: '#111827',
    marginBottom: 4, lineHeight: 17, minHeight: 34,
  },
  starsRow: { flexDirection: 'row', gap: 1, marginBottom: 8 },
  starFilled: { fontSize: 12, color: '#f59e0b' },
  starEmpty: { fontSize: 12, color: '#e5e7eb' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  price: { fontSize: 15, fontWeight: '700', color: '#ef4444' },
  addBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: '#f2f4f7', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  addBtnActive: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  addBtnText: { fontSize: 18, lineHeight: 22, color: '#6b7280', fontWeight: '500', textAlign: 'center' },
  addBtnTextActive: { color: '#ffffff', fontSize: 14 },

  cartModal: {
    backgroundColor: '#fff', marginHorizontal: 12, marginTop: 8,
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
  },
  cartModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cartModalTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  cartModalClose: { fontSize: 16, color: '#9ca3af', padding: 4 },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f2f4f7',
  },
  cartItemImage: { width: 40, height: 40, resizeMode: 'contain', borderRadius: 6, backgroundColor: '#f2f4f7' },
  cartItemName: { flex: 1, fontSize: 12, color: '#374151' },
  cartItemPrice: { fontSize: 13, fontWeight: '600', color: '#ef4444' },
  cartTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e5e7eb',
  },
  cartTotalLabel: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cartTotalValue: { fontSize: 16, fontWeight: '700', color: '#ef4444' },
  checkoutBtn: { backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  checkoutBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  emptyContainer: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 15, color: '#9ca3af' },
});