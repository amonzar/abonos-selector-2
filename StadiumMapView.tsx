import React from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

const Controls: React.FC = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-2 right-2 flex gap-2">
      <button 
        onClick={() => zoomIn()} 
        className="bg-brand-blue-900/80 text-white rounded-md w-10 h-10 font-bold text-xl hover:bg-brand-blue-900 transition-colors border border-blue-600 flex items-center justify-center"
        aria-label="Acercar"
      >
        +
      </button>
      <button 
        onClick={() => zoomOut()} 
        className="bg-brand-blue-900/80 text-white rounded-md w-10 h-10 font-bold text-xl hover:bg-brand-blue-900 transition-colors border border-blue-600 flex items-center justify-center"
        aria-label="Alejar"
      >
        -
      </button>
      <button 
        onClick={() => resetTransform()} 
        className="bg-brand-blue-900/80 text-white rounded-md w-10 h-10 font-bold text-xl hover:bg-brand-blue-900 transition-colors border border-blue-600 flex items-center justify-center"
        aria-label="Restablecer vista"
      >
        ⟲
      </button>
    </div>
  );
};

const StadiumMapView: React.FC = () => {
  return (
    <div className="my-4 w-full max-w-6xl p-2 bg-brand-blue-800 rounded-lg overflow-hidden relative">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        centerOnInit
        limitToBounds
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', maxHeight: '70vh' }}
          contentStyle={{ width: '100%', height: '100%' }}
        >
          <img 
            src="https://i.ibb.co/7N28CR17/c8e2db41-111b-485c-9976-5263086747cf-812.webp" 
            alt="Plano de precios del estadio" 
            className="rounded-lg w-full h-auto cursor-grab"
          />
        </TransformComponent>
        <Controls />
      </TransformWrapper>
    </div>
  );
};

export default StadiumMapView;