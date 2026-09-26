import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ReportPage from "./pages/ReportPage";
import MapPage from "./pages/MapPage";
import ModeratorPage from "./ModeratorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ReportPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/admin" element={<ModeratorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;