import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { Image } from 'expo-image';
import { useWishlistStore } from '../store/wishlistStore';

const CARD_MARGIN = 5;
const NUM_COLUMNS = 2;

type Props = {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
  onPress: (id: string) => void;
};

export const CharacterCardSkeleton = React.memo(function CharacterCardSkeleton() {
  const { width: screenWidth } = useWindowDimensions();
  const CARD_WIDTH = (screenWidth - 2 * 5 - CARD_MARGIN * 4) / NUM_COLUMNS;

  return (
    <View style={[styles.card, { width: CARD_WIDTH, height: CARD_WIDTH + 64 }]}>
      <View style={[styles.imageSkeleton, { height: CARD_WIDTH }]} />
      <View style={styles.info}>
        <View style={styles.skeletonTextLineId} />
        <View style={styles.skeletonTextLineSub} />
      </View>
    </View>
  );
});

export const CharacterCard = React.memo(function CharacterCard({
  id,
  name,
  image,
  status,
  species,
  onPress,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const CARD_WIDTH = (screenWidth - 2 * 5 - CARD_MARGIN * 4) / NUM_COLUMNS;

  const MAX_RETRIES = 3;
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [retryKey, setRetryKey] = React.useState(0);
  const retryCount = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleImageError = useCallback(() => {
    if (retryCount.current < MAX_RETRIES) {
      retryCount.current += 1;
      retryTimer.current = setTimeout(() => {
        setRetryKey((k) => k + 1);
      }, 2000 * retryCount.current);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);
  const [wishlisted, toggle] = useWishlistStore(
    useShallow((s) => [!!s.ids[id], s.toggle] as const),
  );

  const statusColor =
    status === 'Alive' ? '#4caf50' : status === 'Dead' ? '#e53935' : '#9e9e9e';

  const toggleWishlist = useCallback(() => toggle(id), [toggle, id]);

  const handlePress = useCallback(() => onPress(id), [onPress, id]);

  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {!imageLoaded && (
        <View style={[styles.imageSkeleton, { height: CARD_WIDTH }]}>
          {retryCount.current >= MAX_RETRIES ? (
            <Text style={styles.errorIcon}>🖼️</Text>
          ) : (
            <ActivityIndicator size="small" color="#999" />
          )}
        </View>
      )}
      <Image
        key={retryKey}
        source={{ uri: image }}
        style={[styles.image, { height: CARD_WIDTH }, !imageLoaded && styles.imageHidden]}
        contentFit="cover"
        cachePolicy="memory-disk"
        onLoad={() => setImageLoaded(true)}
        onError={handleImageError}
      />
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={toggleWishlist}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.heartIcon, wishlisted && styles.heartActive]}>
          {wishlisted ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText} numberOfLines={1}>
            {status} · {species}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    margin: CARD_MARGIN,
    borderRadius: 14,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
  },
  imageHidden: {
    opacity: 0,
    position: 'absolute',
  },
  imageSkeleton: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 18,
    color: '#aaa',
  },
  heartActive: {
    color: '#e53935',
  },
  info: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    flexShrink: 1,
  },
  errorIcon: {
    fontSize: 28,
    opacity: 0.45,
  },
  // Skeleton specifics
  skeletonTextLineId: {
    width: '70%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
    marginTop: 2,
  },
  skeletonTextLineSub: {
    width: '40%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});
