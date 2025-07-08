
import React, { useState, useCallback } from 'react';
import { AppState, Voter, BordaResult } from './types';
import { ZONES_DATA } from './constants';
import VoterSetup from './components/VoterSetup';
import VotingScreen from './components/VotingScreen';
import ResultsScreen from './components/ResultsScreen';
import StadiumMapView from './components/StadiumMapView';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [votes, setVotes] = useState<Record<number, string[]>>({});
  const [currentVoterIndex, setCurrentVoterIndex] = useState<number>(0);
  const [results, setResults] = useState<BordaResult[]>([]);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [numOptions, setNumOptions] = useState<number>(6);

  const handleVoterSetupSubmit = useCallback((newVoters: Voter[], newNumOptions: number) => {
    setVoters(newVoters);
    setNumOptions(newNumOptions);
    setAppState(AppState.VOTING);
  }, []);

  const handleVoteSubmit = useCallback((voterId: number, selectedZoneIds: string[]) => {
    const newVotes = { ...votes, [voterId]: selectedZoneIds };
    setVotes(newVotes);

    if (currentVoterIndex < voters.length - 1) {
      setCurrentVoterIndex(currentVoterIndex + 1);
    } else {
      const scores: { [zoneId: string]: number } = {};
      ZONES_DATA.forEach(zone => (scores[zone.id] = 0));

      const points = Array.from({ length: numOptions }, (_, i) => numOptions - i);

      Object.values(newVotes).forEach(voterRanking => {
        voterRanking.forEach((zoneId, index) => {
          if (points[index] !== undefined) {
            scores[zoneId] += points[index];
          }
        });
      });

      const sortedResults: BordaResult[] = Object.entries(scores)
        .map(([zoneId, score]) => ({
          zone: ZONES_DATA.find(z => z.id === zoneId)!,
          score,
        }))
        .sort((a, b) => b.score - a.score);

      setResults(sortedResults);
      setAppState(AppState.RESULTS);
    }
  }, [votes, currentVoterIndex, voters.length, numOptions]);

  const handleReset = useCallback(() => {
    setAppState(AppState.SETUP);
    setVoters([]);
    setVotes({});
    setCurrentVoterIndex(0);
    setResults([]);
    setIsMapVisible(true);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.VOTING:
        return (
          <VotingScreen
            key={voters[currentVoterIndex].id}
            voter={voters[currentVoterIndex]}
            allZones={ZONES_DATA}
            onSubmit={handleVoteSubmit}
            priceCategory={'general'}
            numOptions={numOptions}
          />
        );
      case AppState.RESULTS:
        return (
          <ResultsScreen 
            results={results} 
            onReset={handleReset} 
            priceCategory={'general'}
            voters={voters}
            votes={votes}
            allZones={ZONES_DATA}
            numOptions={numOptions}
          />
        );
      case AppState.SETUP:
      default:
        return (
          <VoterSetup 
            onSubmit={handleVoterSetupSubmit} 
          />
        );
    }
  };
  
  const progress = appState === AppState.SETUP ? 0 : appState === AppState.VOTING ? ((currentVoterIndex + 1) / voters.length) * 100 : 100;

  return (
    <div className="min-h-screen bg-brand-blue-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <img src="https://i.ibb.co/hxMM1p0L/mat.jpg" alt="Logo Matracos" className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-brand-gold-400" />
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">Selector Zona Abonos</h1>
            <p className="text-sm sm:text-base text-brand-gold-400 font-semibold">Ibercaja Estadio</p>
          </div>
        </div>
        <div className='flex flex-col items-center gap-4 sm:flex-row'>
           <button 
              onClick={() => setIsMapVisible(!isMapVisible)}
              className="order-2 sm:order-1 text-white bg-brand-blue-800 hover:bg-brand-blue-700 border border-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 font-semibold rounded-lg text-sm px-4 py-2 text-center transition-colors duration-300"
            >
              {isMapVisible ? 'Ocultar Plano' : 'Ver Plano del Estadio'}
            </button>
           {appState !== AppState.SETUP && (
            <div className="w-full sm:w-64 order-1 sm:order-2">
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-100">Progreso</span>
                <span className="text-sm font-medium text-blue-100">{appState === AppState.VOTING ? `Votante ${currentVoterIndex + 1} de ${voters.length}` : 'Completado'}</span>
              </div>
              <div className="w-full bg-brand-blue-800 rounded-full h-2.5">
                <div className="bg-brand-gold-400 h-2.5 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
              </div>
            </div>
          )}
        </div>
      </header>
      
       {isMapVisible && <StadiumMapView />}

      <main className="w-full max-w-6xl flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
      <footer className="w-full max-w-6xl text-center mt-8 text-xs text-gray-400">
        <p>Aplicación creada por Matracos del León para facilitar la toma de decisiones en grupo. Los precios y zonas se basan en la información pública del Real Zaragoza para la temporada de referencia.</p>
      </footer>
    </div>
  );
};

export default App;
