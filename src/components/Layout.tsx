import { NavLink, Outlet, ScrollRestoration } from 'react-router-dom';

const navItems = [
  { to: '/gof', label: 'GoF' },
  { to: '/solid', label: 'SOLID' },
  { to: '/grasp', label: 'GRASP' },
  { to: '/mixto', label: 'Mixto' },
  { to: '/progreso', label: 'Progreso', badge: 'F3' },
];

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-rule bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <NavLink
            to="/"
            className="group flex items-baseline gap-2.5 self-start"
            aria-label="Design Study, ir al inicio"
          >
            <span className="font-serif text-[17px] font-semibold tracking-tight text-ink">
              Design Study
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 sm:inline">
              GoF · SOLID · GRASP
            </span>
          </NavLink>

          <nav aria-label="Secciones" className="-mx-1 overflow-x-auto">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-[13px] transition-colors duration-150 ${
                        isActive
                          ? 'bg-inset font-medium text-ink'
                          : 'text-ink-3 hover:bg-inset hover:text-ink'
                      }`
                    }
                  >
                    {item.label}
                    {item.badge ? (
                      <span className="rounded-sm border border-rule px-1 py-px font-mono text-[9px] leading-none tracking-wide text-ink-3">
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      <footer className="border-t border-rule">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-6 font-mono text-[11px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Contenido local, sin backend ni cuentas.</p>
          <p>Fase 2 · Java y React</p>
        </div>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
