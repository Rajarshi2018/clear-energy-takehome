import React, { useMemo } from 'react';
import { View, Text, SectionList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { OrderCard, getPendingActions, useAsyncResource, PendingAction } from '@clear-energy/shared';

// Auth is out of scope for this task — hardcoded per brief.
const ADMIN_ID = 'a-201';

const CATEGORY_LABELS: Record<string, string> = {
  cash: 'Cash',
  mi_empty: 'MI Empty',
  mi_full: 'MI Full',
  unassigned: 'Unassigned orders',
  prior_delivery: 'Prior delivery',
  verification: 'Verification',
  branch_assign: 'Branch assign',
  kyc: 'KYC',
};

export default function PendingActionsScreen() {
  const resource = useAsyncResource<PendingAction[]>(
    (signal) => getPendingActions(ADMIN_ID, signal),
    []
  );

  const sections = useMemo(() => {
    if (resource.status !== 'success') return [];
    const grouped = new Map<string, PendingAction[]>();
    for (const item of resource.data) {
      const bucket = grouped.get(item.category) ?? [];
      bucket.push(item);
      grouped.set(item.category, bucket);
    }
    return Array.from(grouped.entries()).map(([category, data]) => ({
      title: CATEGORY_LABELS[category] ?? category,
      data,
    }));
  }, [resource]);

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
        <Text style={styles.errorTitle}>Couldn't load pending actions</Text>
        <Text style={styles.errorSubtext}>{resource.error.message}</Text>
        <Button title="Retry" onPress={resource.refetch} color="#0F766E" />
      </View>
    );
  }

  if (resource.data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>All caught up 🎉</Text>
        <Text style={styles.emptySubtext}>No pending actions right now.</Text>
      </View>
    );
  }

  return (
    <SectionList
      contentContainerStyle={styles.list}
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <OrderCard variant="admin" data={item} onAction={() => {}} />
      )}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
      stickySectionHeadersEnabled={false}
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
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginTop: 12, marginBottom: 6 },
});
