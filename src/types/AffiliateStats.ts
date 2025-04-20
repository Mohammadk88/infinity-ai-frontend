

  export interface AffiliateStats {
    referralCode: string;
    totalEarnings: number;
    pendingEarnings: number;
    referralCount: number;
    convertedCount: number;
    commissionRate: number;
    currency: string;
    totalApprovedEarnings: number;
    totalPendingEarnings: number;
    totalRejectedEarnings: number;
    totalConvertedReferrals: number;
    totalApprovedReferrals: number;
    totalRejectedReferrals: number;
  }

  export interface Referral {
    id: string
    referredUser: {
      id: string
      name: string
      email: string
    }
    status: 'pending' | 'approved' | 'rejected'
    reward?: number
    createdAt: string
  }