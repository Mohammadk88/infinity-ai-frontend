'use client';

import { useEffect, useRef } from 'react';
import SwaggerUIBundle from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';

interface SwaggerUIProps {
  url: string;
  title?: string;
}

export function SwaggerUI({ url, title = 'API Documentation' }: SwaggerUIProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ui = SwaggerUIBundle({
      dom_id: '#swagger-ui',
      url,
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      layout: 'BaseLayout',
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      filter: true,
      withCredentials: true,
      requestInterceptor: (request) => {
        // You can add auth headers here if needed
        const token = localStorage.getItem('accessToken');
        if (token) {
          request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
      },
    });

    return () => {
      if (ui) {
        // Clean up on unmount if needed
      }
    };
  }, [url]);

  return (
    <div className="mt-4">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div ref={containerRef} id="swagger-ui" className="swagger-ui" />
    </div>
  );
}