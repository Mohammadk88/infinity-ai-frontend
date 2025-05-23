'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function AIProvidersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { toast } = useToast();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error in AI Providers page:', error);
    
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'There was a problem loading the AI Providers page.',
    });
  }, [error, toast]);

  return (
    <div className="container mx-auto py-12">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was a problem loading the AI Providers page.
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={reset}>
          Try Again
        </Button>
        
        <Button asChild>
          <Link href="/dashboard">Go back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
