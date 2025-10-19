import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main>
      <h1>404 — Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </main>
  );
}
