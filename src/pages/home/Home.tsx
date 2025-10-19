import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <p>Welcome to the site. Browse posts:</p>
      <ul>
        <li>
          <Link to="/posts">All posts</Link>
        </li>
        <li>
          <Link to="/posts/example-post">Example post (slug)</Link>
        </li>
      </ul>
    </main>
  );
}
