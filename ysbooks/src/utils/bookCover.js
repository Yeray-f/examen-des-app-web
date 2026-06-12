export function buildBookCoverFallback(title = 'Libro', seed = 0) {
  const safeTitle = String(title || 'Libro').trim().slice(0, 28) || 'Libro'
  const numericSeed = Number(seed) || safeTitle.length || 1
  const hue = (220 + (numericSeed * 17)) % 360
  const hue2 = (hue + 28) % 360
  const hue3 = (hue + 56) % 360

  const escapedTitle = safeTitle
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${hue}, 55%, 22%)" />
          <stop offset="55%" stop-color="hsl(${hue2}, 60%, 17%)" />
          <stop offset="100%" stop-color="hsl(${hue3}, 50%, 11%)" />
        </linearGradient>
        <radialGradient id="r" cx="50%" cy="28%" r="72%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.16)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="600" height="800" rx="42" fill="url(#g)" />
      <rect width="600" height="800" rx="42" fill="url(#r)" />
      <circle cx="460" cy="146" r="95" fill="rgba(255,255,255,0.06)" />
      <circle cx="120" cy="648" r="130" fill="rgba(255,255,255,0.05)" />
      <path d="M145 220c0-14 11-25 25-25h260c14 0 25 11 25 25v250c0 14-11 25-25 25H170c-14 0-25-11-25-25V220Z" fill="rgba(255,255,255,0.08)" />
      <path d="M190 245h155c14 0 25 11 25 25v18H190v-43Zm0 73h205v18H190v-18Zm0 48h205v18H190v-18Z" fill="rgba(255,255,255,0.22)" opacity="0.95" />
      <path d="M246 518c0-11 9-20 20-20h68c11 0 20 9 20 20v16h-108v-16Z" fill="rgba(255,255,255,0.18)" />
      <rect x="206" y="556" width="188" height="16" rx="8" fill="rgba(255,255,255,0.12)" />
      <text x="50%" y="690" text-anchor="middle" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">${escapedTitle}</text>
      <text x="50%" y="728" text-anchor="middle" fill="rgba(255,255,255,0.72)" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="400">Portada no disponible</text>
    </svg>
  `
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export function resolveBookCover(image, title = 'Libro', seed = 0) {
  return image || buildBookCoverFallback(title, seed)
}
