import { Link } from "react-router-dom";
import { Image } from "../../components/ui";
import { usePreventOverflow } from "../../hooks/usePreventOverflow";

export default function NotFound() {
  usePreventOverflow();

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/illustrations/not-found.svg"
            alt="404 illustration"
            width={400}
            height={200}
            priority
          />
        </div>

        <h1 className="text-3xl font-bold mb-4 mt-10">404 — Not Found</h1>
        <p className="text-theme-body mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-theme-purple text-white rounded-lg hover:bg-theme-purple-dark transition-colors"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
