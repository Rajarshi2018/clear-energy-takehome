import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { OrderCard, getTrips, useAsyncResource, TripStop } from '@clear-energy/shared';

// Auth is out of scope for this task — hardcoded per brief.
const DRIVER_ID = 'd-101';

export default function TripScreen() {
  const resource = useAsyncResource<TripStop[]>((signal) => getTrips(DRIVER_ID, signal), []);

  if (resource.status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  if (resource.status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Couldn't load today's trip</Text>
        <Text style={styles.errorSubtext}>{resource.error.message}</Text>
        <Button title="Retry" onPress={resource.refetch} color="#0F766E" />
      </View>
    );
  }

  if (resource.data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No trip assigned today</Text>
        <Text style={styles.emptySubtext}>
          Check back once dispatch assigns your route.
        </Text>
      </View>
    );
  }

  const sortedStops = [...resource.data].sort((a, b) => a.seq - b.seq);

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={sortedStops}
      keyExtractor={(item) => item.orderId}
      renderItem={({ item }) => <OrderCard variant="driver" data={item} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  errorTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  errorSubtext: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  emptySubtext: { fontSize: 12, color: '#64748B', textAlign: 'center' },
});
