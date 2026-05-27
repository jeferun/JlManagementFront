export type PaymentMethod = 'CASH' | 'TRANSFER' | 'CARD';
export type Status = 'ACTIVE' | 'INACTIVE';

export interface Contribution {
  id: number;
  affiliate_id: number;
  amount: number | string;
  contribution_date: string;
  payment_method: PaymentMethod;
  status: Status;
  created_at: string;
  updated_at: string;
}
