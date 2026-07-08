import { apiRequest } from './client';
import { Order, TripStop, PendingAction } from '../types';

export function getOrders(customerId: string, signal?: AbortSignal): Promise<Order[]> {
  return apiRequest<Order[]>(`/orders?customerId=${encodeURIComponent(customerId)}`, { signal });
}

export function getTrips(driverId: string, signal?: AbortSignal): Promise<TripStop[]> {
  return apiRequest<TripStop[]>(`/trips?driverId=${encodeURIComponent(driverId)}`, { signal });
}

export function getPendingActions(adminId: string, signal?: AbortSignal): Promise<PendingAction[]> {
  return apiRequest<PendingAction[]>(`/pending-actions?adminId=${encodeURIComponent(adminId)}`, {
    signal,
  });
}
