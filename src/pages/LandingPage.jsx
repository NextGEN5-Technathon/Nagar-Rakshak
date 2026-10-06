import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '40px 20px', textAlign: 'center', minHeight: '85vh' }}>
      
      {/* Hero Section */}
      <h1 style={{ 
        fontSize: '4.5rem', 
        fontWeight: '900', 
        letterSpacing: '-1.5px', 
        marginBottom: '20px', 
        background: 'linear-gradient(to right, #10b981, #3b82f6)', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent',
        lineHeight: '1.3', /* This fixes the cut-off text */
        paddingBottom: '5px'
      }}>
        Nagar-Rakshak
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '650px', marginBottom: '50px', lineHeight: '1.6' }}>
        A decentralized, crowd-sourced intelligence grid for real-time municipal hazard tracking. 
        Empowering citizens to report. Equipping authorities to resolve.
      </p>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '80px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/report" style={{ textDecoration: 'none', padding: '16px 36px', backgroundColor: '#10b981', color: 'white', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', transition: '0.2s' }}>
          🚨 Report a Hazard
        </Link>
        <Link to="/map" style={{ textDecoration: 'none', padding: '16px 36px', backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #475569', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', transition: '0.2s' }}>
          🗺️ View Map
        </Link>
      </div>

      {/* Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', width: '100%', maxWidth: '1100px' }}>
        
        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '12px', border: '1px solid #334155', textAlign: 'left', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📍</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#f8fafc', fontWeight: 'bold' }}>Pinpoint Accuracy</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>Auto-detects GPS coordinates to plot hazards exactly where they occur, while maintaining citizen privacy through generalized public mapping.</p>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '12px', border: '1px solid #334155', textAlign: 'left', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🔥</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#f8fafc', fontWeight: 'bold' }}>Thermal Intelligence</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>Live heatmaps instantly highlight crisis density zones, allowing authorities to prioritize severe infrastructure failures.</p>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '12px', border: '1px solid #334155', textAlign: 'left', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🛡️</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#f8fafc', fontWeight: 'bold' }}>Encrypted Command</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>Role-based access control with secure cloud storage. Moderators review encrypted image proofs before pushing hazards to the public grid.</p>
        </div>

      </div>
    </div>
  );
}

export default LandingPage;