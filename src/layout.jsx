import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/">Report</Link>
        <Link to="/map">Map</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Outlet />
    </>
  );
}

export default Layout;