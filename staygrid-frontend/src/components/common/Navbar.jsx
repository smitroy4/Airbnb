import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          StayGrid
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/search"
            className="text-gray-700 hover:text-blue-600"
          >
            Hotels
          </Link>

          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;