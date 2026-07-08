// Mirrors components.schemas.PendingAction in openapi.yaml
export type PendingActionCategory =
  | 'mi_empty'
  | 'mi_full'
  | 'cash'
  | 'prior_delivery'
  | 'unassigned'
  | 'verification'
  | 'branch_assign'
  | 'kyc';

export type PendingActionPriority = 'low' | 'med' | 'high' | 'breached';

export type PendingActionType =
  | 'approve'
  | 'route'
  | 'decide'
  | 'assign'
  | 'remind'
  | 'review';

export interface PendingAction {
  id: string;
  adminId?: string;
  category: PendingActionCategory;
  summary: string;
  priority: PendingActionPriority;
  ageMinutes: number;
  slaMinutes?: number;
  action: PendingActionType;
}
