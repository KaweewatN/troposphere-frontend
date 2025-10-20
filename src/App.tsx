import { Routes, Route } from "react-router-dom";
import Navigation from "./components/navigation";
import { Home } from "./pages/user";
import NotFound from "./pages/not-found/NotFound";

export default function App() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-sm py-5">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Navigation />
    </div>
  );
}
