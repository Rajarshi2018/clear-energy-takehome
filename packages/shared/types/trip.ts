// Mirrors components.schemas.TripStop in openapi.yaml
export type TripStopStatus = 'pending' | 'active' | 'done' | 'skipped';

export interface TripStop {
  /** Stop sequence in the day's route */
  seq: number;
  orderId: string;
  customerName: string;
  sku: string;
  address: string;
  distanceKm: number;
  status: TripStopStatus;
  etaMin: number | null;
}
