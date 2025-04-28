'use client';

import { useState } from 'react';
import { SwaggerUI } from '@/components/features/swagger-ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export default function ApiDocsPage() {
  // Default to backend API URL or let user customize it
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4040');
  const [swaggerUrl, setSwaggerUrl] = useState(`${apiUrl}/api/docs-json`);

  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(e.target.value);
  };

  const loadSwaggerDoc = () => {
    setSwaggerUrl(`${apiUrl}/api/docs-json`);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">API Documentation</h1>
      
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          This interactive documentation is powered by Swagger UI and connects directly to your API endpoints.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Customize the API URL to connect to different environments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              value={apiUrl} 
              onChange={handleApiUrlChange} 
              placeholder="API URL (e.g. http://localhost:3001)" 
              className="max-w-md"
            />
            <Button onClick={loadSwaggerDoc}>Load API Docs</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <SwaggerUI url={swaggerUrl} title="Company Management API" />
        </CardContent>
      </Card>
    </div>
  );
}