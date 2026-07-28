// Minimal hand-picked SVG icon set — kept local so the site has zero
// external icon-font/network dependency and stays fast on mobile data.
const ICONS = {
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
  youtube:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none"/></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 8.5h-2a2 2 0 0 0-2 2V21m0-7h4M9 21h9a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"/></svg>',
  telegram:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4L3 11l6 2m12-9l-4 17-8-6m12-11L9 13"/></svg>',
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.3-3.8A8 8 0 1 1 8.6 19L4 20z"/><path d="M9 10c0 3 2 5 5 5"/></svg>',
  twitter:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16M20 4L4 20"/></svg>',
  x:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16M20 4L4 20"/></svg>',
  website:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg>',
  default:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>',
};
const PLATFORM_LABEL = {
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  twitter: "X / Twitter",
  x: "X / Twitter",
  website: "Website",
};
function getIcon(platform) {
  return ICONS[platform] || ICONS.default;
}
