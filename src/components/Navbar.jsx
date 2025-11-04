import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { User as UserIcon } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const normalizeQuery = (q) => q.trim().toLowerCase();

  // ✅ Real-time search (no enter needed)
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      const normalized = normalizeQuery(val);
      navigate(`/search?q=${encodeURIComponent(normalized)}`);
    } else {
      navigate(`/search?q=`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const normalized = normalizeQuery(query);
      navigate(`/search?q=${encodeURIComponent(normalized)}`);
      setOpen(false);
    }
  };

  useEffect(() => {
    function onDocClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    }
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const baseMenu = ["Home", "About", "Our Story"];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-auto">
            <div className="text-2xl font-extrabold bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
              JewelRolins
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            {baseMenu.map((item, i) => (
              <Link
                key={i}
                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                className="relative px-1 text-gray-700 transition duration-300 hover:text-[var(--brand)] 
                  after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[var(--brand)] 
                  after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </Link>
            ))}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative px-1 text-gray-700 transition duration-300 hover:text-[var(--brand)] 
                after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[var(--brand)] 
                after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
            >
              Cart 🛒
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--brand)] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex h-9 border rounded overflow-hidden">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search products..."
                className="px-3 py-2 flex-1 focus:outline-none"
              />
              <button type="submit" className="px-3 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white">
                🔍
              </button>
            </form>

            {/* User menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenu((p) => !p)}
                aria-expanded={userMenu}
                aria-label="Account menu"
                className="w-10 h-10 rounded-full flex items-center justify-center border shadow-sm"
              >
                <UserIcon className="w-5 h-5" />
              </button>

              {userMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow rounded p-2 z-50">
                  {user ? (
                    <>
                      {user.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserMenu(false)}
                          className="block px-3 py-2 text-sm hover:bg-gray-50 rounded"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded mt-1"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setUserMenu(false)}
                      className="block px-3 py-2 text-sm hover:bg-gray-50 rounded"
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen((prev) => !prev)} aria-label="Toggle menu" className="p-2 rounded hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
            {baseMenu.map((item, i) => (
              <Link
                key={i}
                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 transition duration-300 hover:text-[var(--brand)] border-b border-transparent hover:border-[var(--brand)]"
              >
                {item}
              </Link>
            ))}

            {/* Cart mobile */}
            <Link
              to="/cart"
              onClick={closeMenu}
              className="block px-3 py-2 text-gray-700 transition duration-300 hover:text-[var(--brand)] border-b border-transparent hover:border-[var(--brand)] relative"
            >
              🛒 Cart
              {cart.length > 0 && (
                <span className="absolute top-1 left-16 bg-[var(--brand)] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Search mobile */}
            <form onSubmit={handleSearch} className="flex h-9 border rounded overflow-hidden mx-2">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search products..."
                className="px-3 py-2 flex-1 focus:outline-none"
              />
              <button type="submit" className="px-3 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white">
                🔍
              </button>
            </form>

            {/* Mobile user area */}
            <div className="mt-2 border-t pt-2 space-y-1">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => {
                        closeMenu();
                        navigate("/admin/dashboard");
                      }}
                      className="block px-3 py-2 text-gray-700 hover:text-[var(--brand)]"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[var(--brand)]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block px-3 py-2 text-gray-700 transition duration-300 hover:text-[var(--brand)] border-b border-transparent hover:border-[var(--brand)]"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
