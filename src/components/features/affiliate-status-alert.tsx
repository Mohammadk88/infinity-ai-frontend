'use client';

import { useUserStore } from '@/store/useUserStore';
import { AlertTriangle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type AffiliateStatus = 'pending' | 'active' | string | null | undefined;

interface AffiliateStatusAlertProps {
  status: AffiliateStatus;
}
export default function AffiliateStatusAlert({status}: AffiliateStatusAlertProps = {status: null}) {
  const { t } = useTranslation();
  const { user } = useUserStore() ;
  // If user is not an affiliate or is active, don't show anything
//   if (user?.affiliateId === null) { {
//     console.log('AffiliateStatusAlert: No affiliateId');
//     return null;
//   }

  const isPending = user?.affiliate?.status === 'pending' || null;
  const isRejected = user?.affiliate?.status === 'rejected' || null;
  
  let alertClass = "w-full border-b py-3 px-4 md:px-6";
  let alertIcon = <AlertTriangle className="h-5 w-5 flex-shrink-0" />;
  let alertMessage = '';


  if(status !== null) {
    if (status === 'pending') {
      alertClass += " bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800/30";
      alertIcon = <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />;
      alertMessage = t('affiliate.pendingApprovalAlert', 
        'Your affiliate account is pending approval. You can continue using the platform as a regular user until your affiliate status is activated.');
    } else if (status === 'rejected') {
      alertClass += " bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30";
      alertIcon = <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0" />;
      alertMessage = t('affiliate.rejectedAlert', 
        'Your affiliate application has been rejected. Please contact support for more information or to reapply.');
    }
    /* else if (status === 'approved') {
      alertClass += " bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30";
      alertIcon = <AlertTriangle className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />;
      alertMessage = t('affiliate.approvedAlert', 
        'Your affiliate application has been approved. You can now start earning rewards by sharing your referral link.');
    } */
  }
  else if (isPending){
    alertClass += " bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800/30";
    alertIcon = <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />;
    alertMessage = t('affiliate.pendingApprovalAlert', 
      'Your affiliate account is pending approval. You can continue using the platform as a regular user until your affiliate status is activated.');
  } else if (isRejected) {
    alertClass += " bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30";
    alertIcon = <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0" />;
    alertMessage = t('affiliate.rejectedAlert', 
      'Your affiliate application has been rejected. Please contact support for more information or to reapply.');
  }

  if (!alertMessage) return null;

  return (
    <div className={alertClass}>
      <div className="flex items-center gap-3 max-w-screen-xl mx-auto">
        {alertIcon}
        <p className={`text-sm ${isPending ? 'text-yellow-800 dark:text-yellow-200' : 'text-red-800 dark:text-red-200'}`}>
          {alertMessage}
        </p>
      </div>
    </div>
  );
}

