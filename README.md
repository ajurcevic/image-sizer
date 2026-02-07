# image sizer

A browser-based image resizer that generates app icons and assets for iOS, Android, web, and social media. Upload an image, pick your sizes, and download everything as a ZIP.

## features

- **iOS app icons** — App Store, iPhone, iPad, Spotlight, Settings, Notification (Xcode 15+ / iOS 17-18)
- **Android app icons** — Play Store, mdpi through xxxhdpi, plus adaptive icon layers
- **Web assets** — favicons (ICO + PNG), PWA icons (regular + maskable), Apple touch icon
- **Social media** — Open Graph and Twitter Card images
- **Microsoft tiles** — all standard tile sizes
- **Custom sizes** — add any width x height you need
- **Client-side processing** — resize entirely in the browser using the Canvas API (no upload required)
- **Server-side processing** — optional Sharp-based resizing for higher quality output
- **Batch download** — download all generated images as a single ZIP

## supported input formats

PNG, JPG, WebP, GIF, BMP, TIFF, AVIF, SVG

1024x1024 or larger is recommended for best quality, but any size is accepted.

## tech stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Sharp](https://sharp.pixelplumbing.com) — server-side image processing
- [ico-endec](https://github.com/nickclaw/ico-endec) — client-side ICO generation
- [@catdad/to-ico](https://github.com/nickclaw/to-ico) — server-side ICO generation
- [JSZip](https://stuk.github.io/jszip/) + [file-saver](https://github.com/nickclaw/FileSaver.js) — ZIP download
- [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights)
- [Anonymous Pro](https://fonts.google.com/specimen/Anonymous+Pro) — monospace font

## project structure

```
app/
  layout.tsx          — root layout, fonts, analytics
  page.tsx            — main page
  api/resize/route.ts — server-side resize endpoint
  icon.svg            — app favicon
components/
  AppLogo.tsx         — SVG logo component
  ImageUploader.tsx   — drag-and-drop upload
  ImagePreview.tsx    — uploaded image preview
  CategorySelector.tsx — size category picker
  CustomSizeInput.tsx — custom dimension input
  ProcessingToggle.tsx — client/server mode switch
  GenerateButton.tsx  — generate + progress bar
  DownloadArea.tsx    — results grid + download
lib/
  types.ts            — shared TypeScript types
  image-sizes.ts      — all size definitions
  client-resize.ts    — Canvas API resizing
  server-resize.ts    — Sharp resizing
  ico-generator.ts    — client-side ICO encoding
  zip-builder.ts      — JSZip wrappers
  hooks/
    useImageSizer.ts  — central state management hook
```

## license

MIT
