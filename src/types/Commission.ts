export type CommissionStatus = 'pending' | 'approved' | 'paid';
export type CommissionType = 'referral' | 'bonus' | 'payout';
export type PaymentMethod = 'bank_transfer' | 'paypal' | 'crypto';

export interface Commission {
    id: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    status: CommissionStatus;
    type: CommissionType;
    paymentDate: string;
    createdAt: string;
}