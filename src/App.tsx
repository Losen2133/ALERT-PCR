import { Routes, Route, Navigate } from "react-router-dom"; // 1. Import Navigate
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import { PCRForm } from "./pages/PCR-Form";
import TestingGrounds from "./pages/TestingGrounds";
import { TestingGrounds2 } from "./pages/TestingGrounds2";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 2. Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 3. Define the actual dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/pcr-form" element={<PCRForm />} />
        <Route path="/testing-grounds" element={<TestingGrounds />} />
        <Route path="/testing-grounds2" element={<TestingGrounds2 />} />
      </Route>
    </Routes>
  );
}

export default App;