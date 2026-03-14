import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';

import { gqlFetcher } from '../api/client';
import { GET_CHARACTER } from '../api/queries';
import { useWishlistStore } from '../store/wishlistStore';

export function DetailScreen() {
  const route = useRoute();
  const { id } = (route.params ?? {}) as { id: string };

  const toggle = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.isWishlisted(id));
  const [heroLoaded, setHeroLoaded] = React.useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['character', id],
    queryFn: () => gqlFetcher(GET_CHARACTER, { characterId: id }),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

  const character = data?.character;

  const statusColor =
    character?.status === 'Alive'
      ? '#4caf50'
      : character?.status === 'Dead'
        ? '#e53935'
        : '#9e9e9e';

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  if (error || !character) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load character.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Hero image with skeleton */}
      <View style={styles.heroContainer}>
        {!heroLoaded && (
          <View style={styles.heroSkeleton}>
            <ActivityIndicator size="large" color="#888" />
          </View>
        )}
        <Image
          source={{ uri: character.image ?? undefined }}
          style={[styles.heroImage, !heroLoaded && styles.imageHidden]}
          contentFit="cover"
          cachePolicy="memory-disk"
          onLoad={() => setHeroLoaded(true)}
        />
      </View>

      {/* Name + status + wishlist */}
      <View style={styles.nameRow}>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{character.name}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={styles.statusText}>
              {character.status} · {character.species}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => toggle(id)}
          style={styles.heartBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.heartIcon, wishlisted && styles.heartActive]}>
            {wishlisted ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info rows */}
      <View style={styles.infoCard}>
        <InfoRow label="Gender" value={character.gender ?? '—'} />
        <InfoRow label="Origin" value={character.origin?.name ?? '—'} />
        <InfoRow label="Location" value={character.location?.name ?? '—'} />
      </View>

      {/* Episodes */}
      {character.episode && character.episode.length > 0 && (
        <View style={styles.episodeSection}>
          <Text style={styles.episodeTitle}>
            Episodes ({character.episode.length})
          </Text>
          {character.episode.map((ep: { id?: string | null; episode?: string | null; name?: string | null } | null) =>
            ep ? (
              <View key={ep.id} style={styles.episodeRow}>
                <Text style={styles.episodeCode}>{ep.episode}</Text>
                <Text style={styles.episodeName}>{ep.name}</Text>
              </View>
            ) : null,
          )}
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#e53935',
    fontSize: 16,
  },

  heroContainer: {
    width: '100%',
    height: 340,
  },
  heroImage: {
    width: '100%',
    height: 340,
  },
  heroSkeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHidden: {
    opacity: 0,
  },

  // Name row
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
  },
  nameBlock: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#555',
  },
  heartBtn: {
    marginTop: 4,
  },
  heartIcon: {
    fontSize: 24,
    color: '#ccc',
  },
  heartActive: {
    color: '#e53935',
  },

  // Info card
  infoCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#9e9e9e',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'right',
    flex: 1,
    paddingLeft: 16,
  },

  // Episodes
  episodeSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  episodeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  episodeCode: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6c63ff',
    width: 60,
  },
  episodeName: {
    fontSize: 13,
    color: '#444',
    flex: 1,
  },

  bottomPadding: {
    height: 40,
  },
});
