export function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-4">Not Authorized</h2>
      <p className="text-gray-600 mb-8">
        You do not have permission to view this page.
      </p>

      <a
        href="/dashboard/home"
        className="px-6 py-2 bg-blue-gray-700 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Back Home
      </a>
    </div>
  );
}

export default NotAuthorized;