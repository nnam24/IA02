import "./App.css";
import PhotoGallery from "./components/PhotoGallery";
import PhotoDetail from "./components/PhotoDetail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/photos" element={<PhotoGallery />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />
        <Route path="/" element={<PhotoGallery />} />
      </Routes>
    </Router>
  );
}

export default App;
