
import React, { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { BordaResult, Voter, Zone } from '../types';
import TrophyIcon from './icons/TrophyIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsScreenProps {
  results: BordaResult[];
  onReset: () => void;
  priceCategory: string;
  voters: Voter[];
  votes: Record<number, string[]>;
  allZones: Zone[];
  numOptions: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-brand-blue-900 border border-blue-700 p-3 rounded-lg shadow-lg text-sm max-w-xs">
        <p className="font-bold text-white mb-2">{`${data.name}`}</p>
        <p className="text-brand-gold-400 font-bold text-base mb-2">{`Puntuación Total: ${data.score}`}</p>
        {data.contributions && data.contributions.length > 0 && (
          <div>
            <p className="font-semibold text-blue-200 mb-1">Desglose de votos:</p>
            <ul className="space-y-1 text-blue-300">
              {data.contributions.map((c: {name: string, points: number}, index: number) => (
                <li key={index}>{`- ${c.name}: ${c.points} pts`}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return null;
};


const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onReset, priceCategory, voters, votes, allZones, numOptions }) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const winner = results[0];
  const priceCategoryLabel = 'General';
  
  const positiveResults = results.filter(r => r.score > 0);
  const chartHeight = Math.max(384, positiveResults.length * 40);

  const chartData = positiveResults.map(r => {
    const voterContributions: { name: string; points: number }[] = [];
    voters.forEach(voter => {
      const voterRanking = votes[voter.id];
      if (voterRanking) {
        const rankIndex = voterRanking.indexOf(r.zone.id);
        if (rankIndex !== -1) {
          const points = numOptions - rankIndex;
          voterContributions.push({ name: voter.name, points });
        }
      }
    });
    voterContributions.sort((a, b) => b.points - a.points);
    return {
      name: r.zone.name,
      score: r.score,
      color: r.zone.color,
      contributions: voterContributions
    };
  });

  const handleExport = useCallback(() => {
    if (resultsRef.current === null) return;
    setIsExporting(true);
    toPng(resultsRef.current, { 
      cacheBust: true, 
      backgroundColor: '#102450',
      pixelRatio: 2, // Aumenta la resolución
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'resultados-votacion-zonas.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error al exportar la imagen:', err);
      })
      .finally(() => {
        setIsExporting(false);
      });
  }, []);

  return (
    <div className="w-full max-w-6xl flex flex-col items-center">
      <div ref={resultsRef} className="w-full bg-brand-blue-800 p-4 sm:p-8 rounded-2xl shadow-2xl border border-blue-700">
        <h2 className="text-4xl font-black text-brand-gold-400 mb-2 text-center">¡Resultados Finales!</h2>
        <p className="text-blue-200 mb-8 text-lg text-center">La opción preferida por el grupo, según el Método Borda, es:</p>

        {winner && (
          <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-brand-gold-500 to-amber-600 p-6 mb-10 rounded-xl shadow-2xl text-center text-brand-blue-900 ring-4 ring-offset-4 ring-offset-brand-blue-800 ring-brand-gold-400">
            <TrophyIcon className="w-16 h-16 mx-auto mb-3 text-white opacity-80" />
            <h3 className="text-3xl font-black uppercase tracking-wide">{winner.zone.name}</h3>
            <p className="text-xl font-semibold mt-2">Puntuación Total: {winner.score}</p>
            <p className="mt-4 text-2xl font-bold bg-white/30 rounded-lg py-2">
              {winner.zone.prices[priceCategory]}€
              <span className="text-sm font-medium ml-2">({priceCategoryLabel})</span>
            </p>
          </div>
        )}

        <div className="w-full flex flex-col gap-10">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Ranking Completo</h3>
            <div className="space-y-2">
                {results.map((result, index) => (
                    <div key={result.zone.id} className={`p-3 rounded-lg flex items-center justify-between ${index === 0 ? 'bg-brand-gold-500 text-brand-blue-900' : 'bg-brand-blue-900'}`}>
                        <div className="flex items-center gap-3">
                            <span className={`text-xl font-bold w-6 text-center ${index === 0 ? 'text-white' : 'text-brand-gold-400'}`}>{index + 1}</span>
                            <div className={`w-4 h-4 rounded-sm flex-shrink-0 ${result.zone.color}`}></div>
                            <div>
                                <p className={`font-semibold ${index === 0 ? 'text-brand-blue-900' : 'text-white'}`}>{result.zone.name}</p>
                                <p className={`text-sm ${index === 0 ? 'text-amber-900' : 'text-blue-300'}`}>Precio: {result.zone.prices[priceCategory]}€</p>
                            </div>
                        </div>
                        <span className={`text-lg font-bold px-3 py-1 rounded-md ${index === 0 ? 'bg-white/30' : 'bg-brand-blue-800 text-white'}`}>{result.score}</span>
                    </div>
                ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Gráfico de Puntuaciones</h3>
            <div className="w-full bg-brand-blue-900 p-4 rounded-lg" style={{ height: `${chartHeight}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 130, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#d1d5db', fontSize: 12 }} stroke="#9ca3af" interval={0}/>
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} />
                    <Bar dataKey="score" barSize={20} radius={[0, 10, 10, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={'currentColor'} className={entry.color.replace('bg-','text-')}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Detalle de Votos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {voters.map(voter => (
                <div key={voter.id} className="bg-brand-blue-900 p-4 rounded-lg border border-blue-700">
                  <h4 className="font-bold text-brand-gold-400 text-lg">{voter.name}</h4>
                  <ol className="mt-2 space-y-2 text-blue-200">
                    {votes[voter.id]?.map((zoneId, index) => {
                      const zone = allZones.find(z => z.id === zoneId);
                      const points = numOptions - index;
                      return (
                        <li key={zoneId} className="text-sm flex justify-between items-center">
                          <span>{index + 1}. {zone ? zone.name : 'Zona no encontrada'}</span>
                          <span className="font-bold text-brand-gold-400 ml-2">{points} pts</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button onClick={handleExport} disabled={isExporting} className="text-white bg-green-600 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-400 font-bold rounded-lg text-lg px-8 py-3 text-center transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
            {isExporting ? 'Exportando...' : 'Exportar como Imagen'}
        </button>
        <button onClick={onReset} className="text-brand-blue-900 bg-gray-200 hover:bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-lg text-lg px-8 py-3 text-center transition-colors duration-300">
          Votar de Nuevo
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
