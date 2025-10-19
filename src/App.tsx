import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/home/Home";

import NotFound from "./pages/not-found/NotFound";

export default function App() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
