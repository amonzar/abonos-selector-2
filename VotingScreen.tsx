
import React, { useState, useMemo } from 'react';
import { Voter, Zone } from '../types';
import ZoneCard from './ZoneCard';

interface VotingScreenProps {
  voter: Voter;
  allZones: Zone[];
  onSubmit: (voterId: number, selectedZoneIds: string[]) => void;
  priceCategory: string;
  numOptions: number;
}

const VotingScreen: React.FC<VotingScreenProps> = ({ voter, allZones, onSubmit, priceCategory, numOptions }) => {
  const [selectedZones, setSelectedZones] = useState<Zone[]>([]);

  const availableZones = useMemo(() => {
    const selectedIds = new Set(selectedZones.map(z => z.id));
    return allZones.filter(z => !selectedIds.has(z.id));
  }, [allZones, selectedZones]);

  const handleSelectZone = (zone: Zone) => {
    if (selectedZones.length < numOptions) {
      setSelectedZones([...selectedZones, zone]);
    }
  };
  
  const handleRemoveZone = (zoneToRemove: Zone) => {
    setSelectedZones(selectedZones.filter(z => z.id !== zoneToRemove.id));
  };

  const handleSubmit = () => {
    if (selectedZones.length === numOptions) {
      onSubmit(voter.id, selectedZones.map(z => z.id));
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-3xl font-bold text-brand-gold-400 mb-2">Turno de: <span className="text-white">{voter.name}</span></h2>
      <p className="text-blue-200 mb-6 text-center">Selecciona {numOptions} zonas en orden de preferencia. La primera que elijas será tu favorita.</p>
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ranked Selection */}
        <div className="bg-brand-blue-800 p-6 rounded-2xl border border-blue-700">
            <h3 className="text-xl font-bold text-white mb-4">Tu Ranking ({selectedZones.length}/{numOptions})</h3>
            {selectedZones.length > 0 ? (
                <div className="space-y-3">
                    {selectedZones.map((zone, index) => (
                         <div key={zone.id} className="flex items-center gap-4 bg-brand-blue-900 p-2 rounded-lg">
                            <span className="flex-none text-xl font-black text-brand-gold-400 w-8 text-center">{index + 1}</span>
                            <div className="flex-grow">
                                <ZoneCard 
                                    zone={zone} 
                                    priceCategory={priceCategory} 
                                    isCompact={true}
                                />
                            </div>
                            <button onClick={() => handleRemoveZone(zone)} className="flex-none p-2 rounded-full bg-red-600 hover:bg-red-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="min-h-80 flex items-center justify-center text-center p-8 border-2 border-dashed border-blue-600 rounded-lg">
                    <p className="text-blue-300">Haz clic en las zonas de la derecha para añadirlas a tu ranking.</p>
                </div>
            )}
            {selectedZones.length === numOptions && (
                <button onClick={handleSubmit} className="mt-6 w-full text-white bg-brand-gold-500 hover:bg-brand-gold-400 focus:ring-4 focus:outline-none focus:ring-amber-300 font-bold rounded-lg text-lg px-5 py-3 text-center transition-all duration-300">
                    Confirmar Voto
                </button>
            )}
        </div>

        {/* Available Zones */}
        <div className="bg-brand-blue-800 p-6 rounded-2xl border border-blue-700 max-h-[70vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-4">Zonas Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableZones.map(zone => (
              <button key={zone.id} onClick={() => handleSelectZone(zone)} className="text-left w-full h-full transition transform hover:scale-105">
                <ZoneCard zone={zone} priceCategory={priceCategory} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingScreen;
