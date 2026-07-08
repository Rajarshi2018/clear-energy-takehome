import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { OrderCard, getOrders, useAsyncResource, Order } from '@clear-energy/shared';

// Auth is out of scope for this task — hardcoded per brief (§5, "assume hardcoded userId in headers").
const CUSTOMER_ID = 'c-001';

export default function OrdersScreen() {
  const resource = useAsyncResource<Order[]>((signal) => getOrders(CUSTOMER_ID, signal), []);

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
        <Text style={styles.errorTitle}>Couldn't load your orders</Text>
        <Text style={styles.errorSubtext}>{resource.error.message}</Text>
        <Button title="Retry" onPress={resource.refetch} color="#0F766E" />
      </View>
    );
  }

  if (resource.data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptySubtext}>
          Your LPG orders will show up here once you place one.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={resource.data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <OrderCard variant="customer" data={item} />}
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
