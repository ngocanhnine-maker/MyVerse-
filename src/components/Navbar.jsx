import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/create-world', label: 'Create World' },
  { to: '/create-character', label: 'Create Character' },
  { to: '/my-creations', label: 'My Creations' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-0 text-xl font-black tracking-tight sm:text-2xl">
          <img
            src="/logo.svg"
            alt="MyVerse logo"
            className="-mr-2 h-16 w-auto shrink-0 object-contain sm:-mr-3 sm:h-[76px] lg:-mr-4 lg:h-[88px]"
          />
          <span className="brand-name leading-none">MyVerse</span>
        </Link>
        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/60 text-slate-700 hover:bg-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
