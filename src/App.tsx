import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./shared/lib/react-query";
import Navigation from "./components/navigation/Navigation";
import Home from "./pages/user/home/Home";
import NotFound from "./pages/not-found/NotFound";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto min-h-screen max-w-screen-sm py-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Navigation />
      </div>
    </QueryClientProvider>
  );
}
