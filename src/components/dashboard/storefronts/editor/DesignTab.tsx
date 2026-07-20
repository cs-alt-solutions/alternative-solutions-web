'use client';

import React from 'react';
import VisualArchitecture from './core/VisualArchitecture';

export default function DesignTab({ formData, setFormData }: { formData: any, setFormData: any }) {
  
  // 🚨 THE FIX: Use an explicit mapping to ensure the database 
  // column name (left) always matches the UI selection (right).
  const handleVisualSelect = (dbColumn: string, value: string) => {
    setFormData((prev: any) => ({ 
      ...prev, 
      [dbColumn]: value 
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-2 pt-6 relative">
      <VisualArchitecture 
        formData={formData} 
        handleVisualSelect={handleVisualSelect} 
        setFormData={setFormData} 
      />
    </div>
  );
}