
import React from 'react';
import { Zone } from '../types';

interface ZoneCardProps {
  zone: Zone;
  priceCategory: string;
  isCompact?: boolean;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone, priceCategory, isCompact = false }) => {
  const price = zone.prices[priceCategory];

  if (isCompact) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-sm flex-shrink-0 ${zone.color}`}></div>
            <div>
                <p className="font-semibold text-white text-sm leading-tight">{zone.name}</p>
                <p className="text-blue-300 text-xs">{price}€</p>
            </div>
        </div>
    );
  }

  return (
    <div className="h-full bg-brand-blue-900 p-4 rounded-lg border border-blue-700 hover:border-brand-gold-400 transition-all duration-200 shadow-md">
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 mt-1 rounded-sm flex-shrink-0 ${zone.color}`}></div>
        <div className="flex-grow">
          <p className="font-bold text-white leading-tight">{zone.name}</p>
          <p className="text-xl font-black text-brand-gold-400 mt-1">{price}€</p>
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;
