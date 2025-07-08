
import React, { useState, useMemo } from 'react';
import { Voter } from '../types';

interface VoterSetupProps {
  onSubmit: (voters: Voter[], numOptions: number) => void;
}

const VoterSetup: React.FC<VoterSetupProps> = ({ onSubmit }) => {
  const [numVoters, setNumVoters] = useState<number>(3);
  const [numOptions, setNumOptions] = useState<number>(6);
  const [voterNames, setVoterNames] = useState<Record<number, string>>({
    0: 'Votante 1',
    1: 'Votante 2',
    2: 'Votante 3',
  });
  
  const handleNumVotersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    setNumVoters(num);
    const newNames = { ...voterNames };
    for (let i = 0; i < num; i++) {
      if (!newNames[i]) {
        newNames[i] = `Votante ${i + 1}`;
      }
    }
    setVoterNames(newNames);
  };
  
  const handleNameChange = (index: number, name: string) => {
    setVoterNames({ ...voterNames, [index]: name });
  };
  
  const isFormValid = useMemo(() => {
    for (let i = 0; i < numVoters; i++) {
      if (!voterNames[i]?.trim()) {
        return false;
      }
    }
    return true;
  }, [numVoters, voterNames]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    const voters: Voter[] = Array.from({ length: numVoters }, (_, i) => ({
      id: i,
      name: voterNames[i],
    }));
    onSubmit(voters, numOptions);
  };

  return (
    <div className="w-full max-w-2xl bg-brand-blue-800 p-8 rounded-2xl shadow-2xl border border-blue-700">
      <h2 className="text-3xl font-bold text-center text-brand-gold-400 mb-2">Configuración de la Votación</h2>
      <p className="text-center text-blue-200 mb-8">Define quiénes y cómo participarán en la votación.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="numVoters" className="block text-lg font-semibold text-blue-100 mb-3">1. Indica el Número de Votantes ({numVoters})</label>
          <input 
            type="range" 
            id="numVoters" 
            min="1" 
            max="24" 
            value={numVoters}
            onChange={handleNumVotersChange}
            className="w-full h-2 bg-blue-700 rounded-lg appearance-none cursor-pointer accent-brand-gold-400"
          />
        </div>

        <div>
           <label htmlFor="numOptions" className="block text-lg font-semibold text-blue-100 mb-3">2. Número de Opciones a Votar ({numOptions})</label>
          <input 
            type="range" 
            id="numOptions" 
            min="3" 
            max="10" 
            value={numOptions}
            onChange={(e) => setNumOptions(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-blue-700 rounded-lg appearance-none cursor-pointer accent-brand-gold-400"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-blue-100 mb-3">3. Nombres de los Votantes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
            {Array.from({ length: numVoters }, (_, i) => (
              <div key={i}>
                <input 
                  type="text"
                  value={voterNames[i] || ''}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  placeholder={`Nombre Votante ${i + 1}`}
                  className="w-full bg-brand-blue-900 border border-blue-600 text-white text-sm rounded-lg focus:ring-brand-gold-500 focus:border-brand-gold-500 block p-2.5 transition"
                />
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!isFormValid}
          className="w-full text-white bg-brand-gold-500 hover:bg-brand-gold-400 focus:ring-4 focus:outline-none focus:ring-amber-300 font-bold rounded-lg text-lg px-5 py-3 text-center transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          Comenzar Votación
        </button>
      </form>
    </div>
  );
};

export default VoterSetup;
