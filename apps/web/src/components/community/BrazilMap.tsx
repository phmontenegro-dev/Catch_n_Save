'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { cn } from '@/lib/utils';

const GEO_URL = '/geo/estados.geojson';

type City = {
  id: string;
  name: string;
  // Coordenadas geográficas reais [longitude, latitude]
  coordinates: [number, number];
  delay: number;
};

const CITIES: City[] = [
  { id: 'mao', name: 'Manaus', coordinates: [-60.025, -3.117], delay: 0 },
  { id: 'for', name: 'Fortaleza', coordinates: [-38.542, -3.717], delay: 0.3 },
  { id: 'rec', name: 'Recife', coordinates: [-34.881, -8.054], delay: 0.6 },
  { id: 'ssa', name: 'Salvador', coordinates: [-38.502, -12.971], delay: 0.9 },
  { id: 'bsb', name: 'Brasília', coordinates: [-47.882, -15.794], delay: 1.2 },
  { id: 'bh', name: 'Belo Horizonte', coordinates: [-43.938, -19.921], delay: 1.5 },
  { id: 'rj', name: 'Rio de Janeiro', coordinates: [-43.172, -22.906], delay: 1.8 },
  { id: 'sp', name: 'São Paulo', coordinates: [-46.633, -23.55], delay: 2.1 },
  { id: 'cwb', name: 'Curitiba', coordinates: [-49.273, -25.428], delay: 2.4 },
  { id: 'poa', name: 'Porto Alegre', coordinates: [-51.23, -30.034], delay: 2.7 },
];

type BrazilMapProps = {
  className?: string;
};

export function BrazilMap({ className }: BrazilMapProps) {
  return (
    <div className={cn('relative w-full h-full', className)}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [-54, -15],
          scale: 1000,
        }}
        width={800}
        height={800}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="brazil-state"
                style={{
                  fill: 'rgb(var(--bg-slate))',
                  stroke: 'rgb(var(--text-muted))',
                  strokeWidth: 0.6,
                  outline: 'none',
                  transition: 'fill 200ms ease, stroke 200ms ease',
                }}
              />
            ))
          }
        </Geographies>

        {/* Marcadores de cidade — pontos luminosos */}
        {CITIES.map((city) => (
          <CityMarker key={city.id} city={city} />
        ))}
      </ComposableMap>

      <style>{`
        @keyframes cityPulse {
          0%, 100% {
          transform: scale(0.6);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.8);
          opacity: 0;
        }
        }

        .brazil-state:hover {
        fill: rgb(var(--bg-ink)) !important;
        stroke: rgb(var(--gold-500)) !important;
        stroke-width: 1 !important;
        cursor: default;
        }

        .brazil-state:focus {
        outline: none;
        }
      `}</style>
    </div>
  );
}

// --------------------------------------------------
// Marcador de cidade (dentro do SVG do mapa)
// --------------------------------------------------

import { Marker } from 'react-simple-maps';

function CityMarker({ city }: { city: City }) {
  return (
    <Marker coordinates={city.coordinates}>
      {/* Halo pulsante */}
      <circle
        cx={0}
        cy={0}
        r={14}
        fill="rgb(var(--gold-500))"
        opacity={0.3}
        style={{
          animation: `cityPulse 2.8s ease-in-out ${city.delay}s infinite`,
          transformBox: 'fill-box',
          transformOrigin: 'center',
        }}
      />
      {/* Ponto sólido */}
      <circle
        cx={0}
        cy={0}
        r={4}
        fill="rgb(var(--gold-500))"
        style={{
          filter: 'drop-shadow(0 0 6px rgb(var(--gold-500)))',
        }}
      />
    </Marker>
  );
}
