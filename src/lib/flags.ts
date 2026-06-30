// Catálogo de banderas inline — SVG resolución-independiente con
// colores nacionales fijos (multicolor: currentColor NO aplica).
//
// Cada bandera: viewBox + dimensiones intrínsecas (para el ratio) +
// markup interno + label accesible. Donde se necesite un id (clipPath),
// usar el placeholder __ID__: IxFlag lo reemplaza por un id único por
// instancia para que no choquen si hay varias banderas en la página.

export interface FlagData {
  viewBox: string;
  width:   number;
  height:  number;
  inner:   string;
  label:   string;
}

const FLAGS: Record<string, FlagData> = {
  PY: {
    viewBox: '0 0 30 18',
    width:   30,
    height:  18,
    label:   'Bandera de Paraguay',
    inner: `
      <defs><clipPath id="__ID__"><rect width="30" height="18" rx="2.5"/></clipPath></defs>
      <g clip-path="url(#__ID__)">
        <rect width="30" height="6" fill="#D52B1E"/>
        <rect y="6"  width="30" height="6" fill="#FFFFFF"/>
        <rect y="12" width="30" height="6" fill="#0038A8"/>
        <circle cx="15" cy="9" r="2.8" fill="none" stroke="#1B8A3A" stroke-width="0.35"/>
        <polygon points="15,6.5 15.59,8.19 17.38,8.23 15.95,9.31 16.47,11.02 15,10 13.53,11.02 14.05,9.31 12.62,8.23 14.41,8.19" fill="#FCD116"/>
      </g>`.trim(),
  },
};

// Contador determinista para ids de clipPath únicos por instancia.
// Determinista (no random) para no romper la hidratación SSR.
let idCounter = 0;
export function nextFlagId(): string {
  idCounter += 1;
  return `ix-flag-clip-${idCounter}`;
}

export function getFlagData(code: string): FlagData | undefined {
  return FLAGS[code.toUpperCase()];
}

export function getAvailableFlags(): string[] {
  return Object.keys(FLAGS);
}
