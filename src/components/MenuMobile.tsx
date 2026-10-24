import { useEffect, useState } from 'preact/hooks';

interface Voce {
  href: string;
  label: string;
  figli?: Voce[];
}

interface Props {
  links: Voce[];
}

export default function MenuMobile({ links }: Props) {
  const [aperto, setAperto] = useState(false);

  useEffect(() => {
    if (!aperto) return;
    const chiudi = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setAperto(false);
    };
    document.addEventListener('keydown', chiudi);
    return () => document.removeEventListener('keydown', chiudi);
  }, [aperto]);

  return (
    <div className="ml-auto min-[601px]:hidden">
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center border-0 bg-transparent text-[26px] leading-none text-inchiostro"
        aria-expanded={aperto}
        aria-controls="menu-mobile"
        onClick={() => setAperto((valore) => !valore)}
      >
        <span className="sr-only">{aperto ? 'Chiudi il menu' : 'Apri il menu'}</span>
        <span aria-hidden="true">☰</span>
      </button>
      <nav
        id="menu-mobile"
        hidden={!aperto}
        className="absolute inset-x-0 top-full z-20 border-b border-solid border-bordo bg-white px-6 py-3"
      >
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {links.map((voce) =>
            voce.figli?.length ? (
              <li key={voce.label}>
                <p className="m-0 flex min-h-11 items-center text-[15px] font-bold">{voce.label}</p>
                <ul className="m-0 list-none p-0 pl-3">
                  {voce.figli.map((figlio) => (
                    <li key={figlio.href}>
                      <a
                        href={figlio.href}
                        className="flex min-h-11 items-center text-[15px] font-bold hover:text-terracotta"
                        onClick={() => setAperto(false)}
                      >
                        {figlio.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={voce.href}>
                <a
                  href={voce.href}
                  className="flex min-h-11 items-center text-[15px] font-bold hover:text-terracotta"
                  onClick={() => setAperto(false)}
                >
                  {voce.label}
                </a>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );
}
