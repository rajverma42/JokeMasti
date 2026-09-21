/**
 * Single inline SVG sprite. Every icon on the site is one <use> reference,
 * so the markup stays tiny and the browser parses the paths exactly once.
 */

const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  monitor: '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2"/>',
  whatsapp:
    '<path d="M12.04 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.45A9.9 9.9 0 1 0 12.04 2Z"/><path d="M8.6 7.6c.25-.05.5-.05.72.02.2.07.42.3.55.6.13.3.43 1.05.47 1.13.04.08.06.18 0 .3-.06.11-.1.18-.2.29-.1.1-.2.23-.29.3-.1.1-.2.2-.09.4.12.2.53.87 1.13 1.4.78.7 1.44.92 1.64 1.02.2.1.32.08.44-.05.12-.14.5-.59.64-.79.13-.2.27-.17.45-.1.18.06 1.14.54 1.34.64.2.1.33.15.38.23.05.09.05.5-.12.98-.17.48-1 .94-1.4.98-.39.04-.76.18-2.55-.53-2.15-.85-3.5-3.06-3.6-3.2-.11-.15-.86-1.14-.86-2.18 0-1.03.55-1.54.74-1.75.2-.2.43-.25.57-.25Z" fill="currentColor" stroke="none"/>',
  telegram:
    '<path d="M21.5 4.3 2.9 11.4c-.9.35-.9 1.6.02 1.9l4.5 1.4 1.7 5.2c.27.8 1.3.98 1.83.32l2.3-2.9 4.5 3.3c.66.48 1.6.12 1.77-.68l3.2-14.6c.2-.9-.7-1.66-1.5-1.34Z"/><path d="m7.6 13.9 9.9-6.2-7.9 7.2-.3 3.9"/>',
  facebook:
    '<path d="M14.5 21v-7h2.4l.4-3h-2.8V9.2c0-.87.24-1.46 1.5-1.46h1.6V5.06A21 21 0 0 0 15.3 5c-2.3 0-3.9 1.4-3.9 4v2.2H9v3h2.4v7Z" fill="currentColor" stroke="none"/>',
  x: '<path d="M4 4l7 9.2L4.4 20h2l5.5-5.9L16.3 20H20l-7.4-9.7L19.4 4h-2l-5 5.4L8.2 4Z" fill="currentColor" stroke="none"/>',
  heart:
    '<path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13Z"/>',
  bookmark: '<path d="M6.5 3.8h11a1 1 0 0 1 1 1v15.5l-6.5-4-6.5 4V4.8a1 1 0 0 1 1-1Z"/>',
  download: '<path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15"/>',
  left: '<path d="m14.5 5-7 7 7 7"/>',
  right: '<path d="m9.5 5 7 7-7 7"/>',
  link: '<path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 1 0-5.7-5.7L11.6 6.7"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 1 0 5.7 5.7l1.5-1.5"/>',
  home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z"/>',
  fire: '<path d="M12 3s4.5 3.4 4.5 8a4.5 4.5 0 0 1-9 0c0-1.3.4-2.3.8-3 .3 1 1 1.7 1.7 1.7 1.2 0 2-1.3 2-3.2 0-1.5-.5-2.7-1-3.5Z"/><path d="M8.6 14.5a3.4 3.4 0 0 0 6.8 0"/>',
  sparkle: '<path d="m12 3 1.9 5.6L19.5 10l-5.6 1.9L12 17.5 10.1 12 4.5 10l5.6-1.4Z"/><path d="M18.5 16.5 19 18l1.5.5L19 19l-.5 1.5-.5-1.5L16.5 18l1.5-.5Z"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="m4.5 17.5 4.7-4.4 3.4 3 2.7-2.4 4.2 3.8"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>',
  arrow: '<path d="M4.5 12h14M13 6.5l5.5 5.5L13 17.5"/>',
  chat: '<path d="M20.5 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 20.5 12Z"/>',
  star: '<path d="m12 4 2.4 5 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.8 9.6 9Z"/>',
  trending: '<path d="M3.5 17.5 9 12l3.5 3.5L20.5 7"/><path d="M15.5 7h5v5"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.2 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.6 6.5 8.4 6 8.4-6"/>',
  shield: '<path d="M12 3.2 5 6v6c0 4.2 2.9 7.5 7 8.8 4.1-1.3 7-4.6 7-8.8V6Z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  plus: '<path d="M12 5.5v13M5.5 12h13"/>',
};

export const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${Object.entries(
  P
)
  .map(
    ([k, v]) =>
      `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`
  )
  .join('')}</svg>`;

/** Inline reference to a sprite symbol. */
export const icon = (name, cls = '') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
