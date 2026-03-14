import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useCharacters } from '../hooks/useCharacters';
import { CharacterCard, CharacterCardSkeleton } from '../components/CharacterCard';
import type { RootNavigationProp } from '../types/navigation';

const STATUS_FILTERS = ['All', 'Alive', 'Dead', 'Unknown'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export function HomeScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<StatusFilter>('All');

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(timer);
  }, [search]); // For Debounce search

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCharacters(debouncedSearch, activeFilter);

  const allCharacters = React.useMemo(
    () => data?.pages.flatMap((page) => page.characters?.results ?? []) ?? [],
    [data],
  );

  const keyExtractor = React.useCallback(
    (item: (typeof allCharacters)[0]) => item?.id ?? '',
    [],
  );

  const handleCardPress = React.useCallback(
    (id: string) => {
      navigation.navigate('Detail', { id });
    },
    [navigation],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: (typeof allCharacters)[0] }) => {
      if (!item) return null;
      return (
        <CharacterCard
          id={item.id ?? ''}
          name={item.name ?? 'Unknown'}
          image={item.image ?? ''}
          status={item.status ?? 'unknown'}
          species={item.species ?? 'Unknown'}
          onPress={handleCardPress}
        />
      );
    },
    [handleCardPress],
  );

  const handleEndReached = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ListFooterComponent = React.useCallback(
    () =>
      isFetchingNextPage ? (
        <ActivityIndicator
          size="small"
          color="#888"
          style={styles.footerLoader}
        />
      ) : null,
    [isFetchingNextPage],
  );

  const ListEmptyComponent = React.useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No characters found.</Text>
        <Text style={styles.emptySubText}>
          Try adjusting your search or filters.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search characters..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="never"
        />
        {search.length > 0 && (
          <TouchableOpacity
            style={styles.clearSearchBtn}
            onPress={() => {
              setSearch('');
              setDebouncedSearch('');
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearSearchIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {STATUS_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === filter && styles.filterTabTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CharacterCardSkeleton key={i} />
            ))}
          </View>
        </ScrollView>
      ) : error && !data ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load characters.</Text>
        </View>
      ) : (
        <FlatList
          data={allCharacters}
          keyExtractor={keyExtractor}
          numColumns={2}
          renderItem={renderItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={[
            styles.listContent,
            allCharacters.length === 0 && styles.listContentEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          initialNumToRender={6}
          windowSize={5}
          updateCellsBatchingPeriod={50}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 40,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  clearSearchIcon: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterTabActive: {
    backgroundColor: '#6c63ff',
    borderColor: '#6c63ff',
  },
  filterTabText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  listContent: {
    paddingHorizontal: 5,
    paddingBottom: 24,
  },
  footerLoader: {
    marginVertical: 16,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  listContentEmpty: {
    flex: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
