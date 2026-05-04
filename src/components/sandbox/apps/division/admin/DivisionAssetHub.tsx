import React from 'react';
import AssetHubTerminal from '@/components/sandbox/shared/AssetHubTerminal';
import { divisionConfig } from '@/config/clients/division';

interface DivisionAssetHubProps {
  onExit: () => void;
}

export default function DivisionAssetHub({ onExit }: DivisionAssetHubProps) {
  return (
    <AssetHubTerminal 
      clientConfig={divisionConfig} 
      onExit={onExit} 
    />
  );
}