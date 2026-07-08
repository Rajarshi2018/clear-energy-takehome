import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '../types/order';
import { TripStop } from '../types/trip';
import { PendingAction } from '../types/pendingAction';
import { formatPricePaise } from '../utils/formatPrice';

/**
 * ONE card, THREE rendering modes — discriminated by `variant`.
 *
 * - customer: shows customer-facing order (SKU, status pill, amount)
 * - driver:   shows a trip stop (stop number, address, ETA badge)
 * - admin:    shows a pending-action inbox item (priority chip, action CTA)
 *
 * This is the component all three apps import from @clear-energy/shared —
 * if a field gets added to a type, all three apps pick it up without
 * touching this file three separate times.
 */

interface CustomerCardProps {
  variant: 'customer';
  data: Order;
  onPress?: (order: Order) => void;
}

interface DriverCardProps {
  variant: 'driver';
  data: TripStop;
  onPress?: (stop: TripStop) => void;
}

interface AdminCardProps {
  variant: 'admin';
  data: PendingAction;
  onPress?: (action: PendingAction) => void;
  /** Renders the trailing action chip (Approve / Assign → / etc) when provided. */
  onAction?: (action: PendingAction) => void;
}

export type OrderCardProps = CustomerCardProps | DriverCardProps | AdminCardProps;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  placed: { bg: '#FEF3C7', text: '#B45309' },
  assigned: { bg: '#DBEAFE', text: '#1D4ED8' },
  out_for_delivery: { bg: '#D1FAE5', text: '#047857' },
  delivered: { bg: '#F1F5F9', text: '#475569' },
  cancelled: { bg: '#FFE4E6', text: '#BE123C' },
  returned: { bg: '#FFE4E6', text: '#BE123C' },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  low: { bg: '#F1F5F9', text: '#475569' },
  med: { bg: '#FEF3C7', text: '#B45309' },
  high: { bg: '#FFE4E6', text: '#BE123C' },
  breached: { bg: '#FECACA', text: '#991B1B' },
};

const ACTION_LABELS: Record<PendingAction['action'], string> = {
  approve: 'Approve',
  assign: 'Assign →',
  decide: 'Decide',
  review: 'Review',
  remind: 'Remind',
  route: 'Route',
};

export function OrderCard(props: OrderCardProps) {
  switch (props.variant) {
    case 'customer':
      return <CustomerVariant {...props} />;
    case 'driver':
      return <DriverVariant {...props} />;
    case 'admin':
      return <AdminVariant {...props} />;
  }
}

function CardShell({
  children,
  onPress,
  emphasized,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  emphasized?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, emphasized && styles.cardEmphasized]}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

function CustomerVariant({ data, onPress }: CustomerCardProps) {
  const colors = STATUS_COLORS[data.status] ?? STATUS_COLORS.placed;
  return (
    <CardShell onPress={onPress ? () => onPress(data) : undefined}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Text style={styles.iconGlyph}>⛽</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.idText}>{data.id}</Text>
          <Text style={styles.titleText}>{data.sku.name}</Text>
          <View style={[styles.pill, { backgroundColor: colors.bg }]}>
            <Text style={[styles.pillText, { color: colors.text }]}>
              {data.status.replace(/_/g, ' ')}
            </Text>
          </View>
        </View>
        <Text style={styles.amountText}>{formatPricePaise(data.amountPaise)}</Text>
      </View>
    </CardShell>
  );
}

function DriverVariant({ data, onPress }: DriverCardProps) {
  const isDone = data.status === 'done';
  const isActive = data.status === 'active';
  return (
    <CardShell onPress={onPress ? () => onPress(data) : undefined} emphasized={isActive}>
      <View style={styles.row}>
        <View style={[styles.badge, isDone && styles.badgeDone, isActive && styles.badgeActive]}>
          <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
            {isDone ? '✓' : data.seq}
          </Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.idText}>{data.orderId}</Text>
          <Text style={styles.titleText}>
            {data.customerName} · {data.sku}
          </Text>
          <Text style={styles.subtleText} numberOfLines={1}>
            {data.address}
          </Text>
        </View>
        {isActive && data.etaMin != null && (
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>{data.etaMin} min</Text>
          </View>
        )}
      </View>
    </CardShell>
  );
}

function AdminVariant({ data, onPress, onAction }: AdminCardProps) {
  const colors = PRIORITY_COLORS[data.priority] ?? PRIORITY_COLORS.low;
  const breached = data.slaMinutes != null && data.ageMinutes > data.slaMinutes;
  return (
    <CardShell onPress={onPress ? () => onPress(data) : undefined}>
      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.idText}>{data.id}</Text>
          <Text style={styles.titleText} numberOfLines={2}>
            {data.summary}
          </Text>
          <View style={styles.rowGap}>
            <View style={[styles.pill, { backgroundColor: colors.bg }]}>
              <Text style={[styles.pillText, { color: colors.text }]}>{data.priority}</Text>
            </View>
            <Text style={[styles.ageText, breached && styles.ageBreached]}>
              {data.ageMinutes}m{breached ? ' ⚠' : ''}
            </Text>
          </View>
        </View>
        {onAction && (
          <TouchableOpacity style={styles.actionChip} onPress={() => onAction(data)}>
            <Text style={styles.actionChipText}>{ACTION_LABELS[data.action]}</Text>
          </TouchableOpacity>
        )}
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  cardEmphasized: {
    borderWidth: 2,
    borderColor: '#0F766E',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  flex1: { flex: 1, marginLeft: 12, marginRight: 8 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: { fontSize: 20 },
  idText: { fontSize: 11, color: '#64748B' },
  titleText: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 1 },
  subtleText: { fontSize: 11, color: '#64748B', marginTop: 1 },
  amountText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 4,
  },
  pillText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDone: { backgroundColor: '#D1FAE5' },
  badgeActive: { backgroundColor: '#0F766E' },
  badgeText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  badgeTextActive: { color: '#FFFFFF' },
  etaBadge: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  etaText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  ageText: { fontSize: 10, color: '#94A3B8' },
  ageBreached: { color: '#E11D48', fontWeight: '700' },
  actionChip: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionChipText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
});
