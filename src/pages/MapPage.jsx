import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// FIX: Leaflet's default icons do not load correctly in Vite out of the box. 
// This overrides the broken paths with the correct imported images.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// DELIVERABLE: Five sample reports mapped directly around Sion, Mumbai
const sampleReports = [
  { id: 1, lat: 19.0480, lng: 72.8620, category: 'Pothole', description: 'Deep pothole causing traffic slowdowns near the station.' },
  { id: 2, lat: 19.0450, lng: 72.8640, category: 'Broken Streetlight', description: 'Streetlight has been out for 3 weeks near VPPCOE campus.' },
  { id: 3, lat: 19.0475, lng: 72.8655, category: 'Garbage Dump', description: 'Uncollected garbage spilling onto the footpath.' },
  { id: 4, lat: 19.0440, lng: 72.8610, category: 'Open Drain', description: 'Missing manhole cover near the main crossing.' },
  { id: 5, lat: 19.0495, lng: 72.8600, category: 'Damaged Railing', description: 'Bridge safety railing is completely broken.' },
];

function MapPage() {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Intelligence Map</h1>
        <p style={{ opacity: 0.7 }}>Live hazard-density visualization (Sion)</p>
      </div>
      
      {/* BRUTE-FORCE HEIGHT: minHeight guarantees it cannot collapse to 0px */}
      <div style={{ flexGrow: 1, width: '100%', minHeight: '600px', border: '2px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer 
          center={[19.0465, 72.8633]} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {sampleReports.map((report) => (
            <Marker key={report.id} position={[report.lat, report.lng]}>
              <Popup>
                {/* Forcing black text so the global dark mode doesn't make it invisible */}
                <div style={{ color: 'black' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{report.category}</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>{report.description}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;