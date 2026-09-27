import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../supabase';

// CRITICAL VITE FIX: leaflet.heat requires L to be available globally
window.L = L;
import 'leaflet.heat';

// Fix for default Leaflet icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// 1. We create a custom component to bridge Leaflet.heat into React
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;
    
    // Create the thermal layer
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 15,
      gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red' }
    }).addTo(map);

    // Cleanup when component unmounts
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

function MapPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase.from('reports').select('*');
      if (error) {
        console.error("Supabase Error:", error);
      } else {
        setReports(data);
      }
    }
    fetchReports();
  }, []);

  // 2. Hardcoded thermal density points (Sion Area) so you can see the visual effect 
  // format: [latitude, longitude, intensity]
  const thermalData = [
    [19.0465, 72.8633, 0.9],
    [19.0475, 72.8623, 0.6],
    [19.0455, 72.8643, 0.8],
    [19.0485, 72.8613, 0.4],
    [19.0445, 72.8653, 0.7],
    [19.0460, 72.8620, 1.0]
  ];

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Intelligence Map</h1>
        <p style={{ opacity: 0.7 }}>Live hazard-density visualization (Sion Area)</p>
      </div>
      
      <div style={{ flexGrow: 1, width: '100%', minHeight: '600px', border: '2px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer center={[19.0465, 72.8633]} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {/* Inject the thermal layer */}
          <HeatmapLayer points={thermalData} />
          
          {/* Render individual database markers on top of the heatmap */}
          {reports.map((report) => (
            report.latitude && report.longitude ? (
              <Marker key={report.id} position={[report.latitude, report.longitude]}>
                <Popup>
                  <div style={{ color: 'black' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{report.category || 'Hazard'}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>{report.description || 'No details provided.'}</div>
                  </div>
                </Popup>
              </Marker>
            ) : null
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;