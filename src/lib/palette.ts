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
  glow: string;
  surface: string;
  border: string;
  ink: string;
  muted: string;
  accent: string;
  accentSoft: string;
};

export function createAccessiblePalette(primary: RGB, secondary: RGB): Palette {
  const p = rgbToHsl(primary);
  const s = rgbToHsl(secondary);

  const hue = (p.h * 0.72 + s.h * 0.28) % 360;
  const midSat = clamp((p.s + s.s) / 2, 16, 42);

  return {
    bgStart: hslToCss(hue, midSat - 3, 93),
    bgEnd: hslToCss((hue + 10) % 360, midSat + 2, 84),
    glow: hslToCss((hue + 26) % 360, midSat + 8, 76),
    surface: hslToCss(hue, midSat - 9, 96),
    border: hslToCss(hue, midSat + 3, 72),
    ink: hslToCss((hue + 16) % 360, midSat + 9, 15),
    muted: hslToCss((hue + 10) % 360, midSat + 2, 31),
    accent: hslToCss((hue + 24) % 360, midSat + 12, 30),
    accentSoft: hslToCss((hue + 22) % 360, midSat + 6, 58),
  };
}

export function getFallbackPalette(): Palette {
  return createAccessiblePalette({ r: 178, g: 165, b: 145 }, { r: 138, g: 152, b: 149 });
}
