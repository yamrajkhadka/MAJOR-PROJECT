import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-2">Oops! Page not found.</p>

      <p className="text-gray-500 mt-4 max-w-md">
        The page you're looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg shadow"
      >
        Go Back Home
      </Link>
    </div>
  );
}
