import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column' }}>
      
      {/* Clean Navbar */}
      <nav style={{ backgroundColor: '#1e293b', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', width: '100%', boxSizing: 'border-box' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '1.5rem', fontWeight: '900' }}>
          <span style={{ color: '#10b981' }}>Nagar</span>-Rakshak
        </Link>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link to="/report" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Report</Link>
          <Link to="/map" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Map</Link>
          <Link to="/admin" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 18px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)' }}>Admin Portal</Link>
        </div>
      </nav>

      <main style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;