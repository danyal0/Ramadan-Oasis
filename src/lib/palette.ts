export type RGB = { r: number; g: number; b: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function rgbToHsl({ r, g, b }: RGB) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  let s = 0;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = 60 * (((gn - bn) / d) % 6);
        break;
      case gn:
        h = 60 * ((bn - rn) / d + 2);
        break;
      default:
        h = 60 * ((rn - gn) / d + 4);
        break;
    }
  }

  return {
    h: (h + 360) % 360,
    s: clamp(s * 100, 8, 36),
    l: clamp(l * 100, 16, 90),
  };
}

function hslToCss(h: number, s: number, l: number) {
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

type Palette = {
  bgStart: string;
  bgEnd: string;
  surface: string;
  border: string;
  ink: string;
  muted: string;
  accent: string;
};

export function createAccessiblePalette(primary: RGB, secondary: RGB): Palette {
  const p = rgbToHsl(primary);
  const s = rgbToHsl(secondary);

  const hue = (p.h * 0.72 + s.h * 0.28) % 360;
  const lowSat = clamp((p.s + s.s) / 2, 10, 28);

  return {
    bgStart: hslToCss(hue, lowSat - 4, 94),
    bgEnd: hslToCss((hue + 8) % 360, lowSat, 89),
    surface: hslToCss(hue, lowSat - 6, 97),
    border: hslToCss(hue, lowSat + 2, 78),
    ink: hslToCss((hue + 12) % 360, lowSat + 8, 16),
    muted: hslToCss((hue + 8) % 360, lowSat + 4, 34),
    accent: hslToCss((hue + 20) % 360, lowSat + 10, 28),
  };
}

export function getFallbackPalette(): Palette {
  return createAccessiblePalette({ r: 178, g: 165, b: 145 }, { r: 138, g: 152, b: 149 });
}
