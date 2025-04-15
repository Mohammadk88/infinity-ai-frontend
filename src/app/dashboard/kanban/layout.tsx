'use client';

// import { useTranslation } from 'react-i18next';

export default function KanbanLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
}