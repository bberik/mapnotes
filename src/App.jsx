import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkSpacePage from "./pages/WorkSpacePage";
import { ReactFlowProvider } from 'reactflow';
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/canvas" element={<ReactFlowProvider> <WorkSpacePage /></ReactFlowProvider>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
