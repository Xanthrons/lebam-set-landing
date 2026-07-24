const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const ICONS = {
  crown: (props) => (
    <svg {...common} {...props}>
      <path d="M3 8l4 3 5-6 5 6 4-3-2 9H5L3 8z" />
      <path d="M5 20h14" />
    </svg>
  ),
  compass: (props) => (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.5 9.5l-2 5-5 2 2-5 5-2z" />
    </svg>
  ),
  loom: (props) => (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 5v3M12 16v3M5 12h3M16 12h3" />
    </svg>
  ),
  anchor: (props) => (
    <svg {...common} {...props}>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v13M7 12H3a9 9 0 0018 0h-4" />
      <path d="M8 9h8" />
    </svg>
  ),
  gift: (props) => (
    <svg {...common} {...props}>
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M4 14h16M12 10v10" />
      <path d="M12 10c-2-4-6-4-6-1 0 2 3 1 6 1zM12 10c2-4 6-4 6-1 0 2-3 1-6 1z" />
    </svg>
  ),
  shield: (props) => (
    <svg {...common} {...props}>
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
    </svg>
  ),
  heart: (props) => (
    <svg {...common} {...props}>
      <path d="M12 20s-7-4.4-9.5-9C1 7.5 3 4 6.5 4c2 0 3.7 1.2 4.5 3 .8-1.8 2.5-3 4.5-3C19 4 21 7.5 19.5 11 17 15.6 12 20 12 20z" />
    </svg>
  ),
  scroll: (props) => (
    <svg {...common} {...props}>
      <path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4z" />
      <path d="M5 4a3 3 0 00-3 3v10a3 3 0 003 3" />
      <path d="M9 9h7M9 13h5" />
    </svg>
  ),
  cross: (props) => (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="10" opacity="0.3" />
      <path d="M12 5v14M6 12h12" />
    </svg>
  ),
};

export function VirtueIcon({ name, ...props }) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
