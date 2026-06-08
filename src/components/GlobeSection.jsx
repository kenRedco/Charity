import { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const arcsData = [
  { startLat: 34.0522, startLng: -118.2437, endLat: -1.9403, endLng: 29.8739, color: 'rgba(255,255,255,0.6)' },
  { startLat: 40.7128, startLng: -74.0060, endLat:  0.3476, endLng: 32.5825, color: 'rgba(255,255,255,0.6)' },
  { startLat: 51.5072, startLng:  -0.1276, endLat: -6.1751, endLng: 106.8650, color: 'rgba(255,255,255,0.6)' },
];

export default function GlobeSection() {
  const globeEl = useRef();

  useEffect(() => {
    if (!globeEl.current) return;
    const ctrl = globeEl.current.controls();
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = 0.4;
    ctrl.enableZoom = false;
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="/Charity/earth-night.jpg"
      atmosphereColor="#059669"
      atmosphereAltitude={0.2}
      arcsData={arcsData}
      arcColor="color"
      arcDashLength={() => Math.random()}
      arcDashGap={() => Math.random()}
      arcDashAnimateTime={() => Math.random() * 4000 + 500}
      arcStroke={0.5}
      arcsTransitionDuration={0}
      width={600}
      height={600}
      backgroundColor="rgba(0,0,0,0)"
    />
  );
}
