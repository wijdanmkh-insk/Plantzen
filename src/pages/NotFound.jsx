export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found.</p>
      <a
        href="/"
        className="px-6 py-3 bg-green-600 rounded-md hover:bg-green-700 transition"
      >
        Go Home
      </a>
    </div>
  );
}
