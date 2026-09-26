import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ReportPage from "./pages/ReportPage";
import MapPage from "./pages/MapPage";
import ModeratorPage from "./ModeratorPage";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/">Report</Link>
        <Link to="/map">Map</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ReportPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/admin" element={<ModeratorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;