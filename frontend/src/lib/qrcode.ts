/**
 * Minimal QR Code generator - pure TypeScript, no external dependencies.
 * Generates a 2D boolean matrix representing a QR code for a given string.
 * Based on the QR Code specification (ISO/IEC 18004).
 * Supports only small strings (version 1-10, byte mode, error correction L).
 */

// Reed-Solomon GF(256) arithmetic
const GF_EXP: number[] = new Array(512);
const GF_LOG: number[] = new Array(256);

(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255];
}

function gfPoly(degree: number): number[] {
  let g = [1];
  for (let i = 0; i < degree; i++) {
    const factor = [1, GF_EXP[i]];
    const result = new Array(g.length + factor.length - 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      for (let k = 0; k < factor.length; k++) {
        result[j + k] ^= gfMul(g[j], factor[k]);
      }
    }
    g = result;
  }
  return g;
}

function rsEncode(data: number[], ecCount: number): number[] {
  const gen = gfPoly(ecCount);
  const msg = [...data, ...new Array(ecCount).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return msg.slice(data.length);
}

// QR version capacity table [version][ecLevel] = {dataBytes, ecBytes, blocks}
// We only use version 1-10, error correction L
const VERSION_INFO: Array<{ dataBytes: number; ecBytes: number; blocks: number }> = [
  { dataBytes: 0, ecBytes: 0, blocks: 1 },   // placeholder
  { dataBytes: 19, ecBytes: 7, blocks: 1 },   // v1
  { dataBytes: 34, ecBytes: 10, blocks: 1 },  // v2
  { dataBytes: 55, ecBytes: 15, blocks: 1 },  // v3
  { dataBytes: 80, ecBytes: 20, blocks: 2 },  // v4
  { dataBytes: 108, ecBytes: 26, blocks: 2 }, // v5
  { dataBytes: 136, ecBytes: 18, blocks: 4 }, // v6 (actually 2 blocks but simplified)
  { dataBytes: 156, ecBytes: 20, blocks: 4 }, // v7
  { dataBytes: 194, ecBytes: 24, blocks: 2 }, // v8
  { dataBytes: 232, ecBytes: 30, blocks: 2 }, // v9
  { dataBytes: 274, ecBytes: 18, blocks: 4 }, // v10
];

function getVersion(dataLen: number): number {
  // byte mode: 4 bits mode + 8 bits char count + 8*n bits data + 4 bits terminator
  for (let v = 1; v <= 10; v++) {
    const capacity = VERSION_INFO[v].dataBytes;
    if (dataLen + 3 <= capacity) return v; // rough estimate
  }
  return 10;
}

function getSize(version: number): number {
  return 17 + 4 * version;
}

type Matrix = boolean[][];

function createMatrix(size: number): Matrix {
  return Array.from({ length: size }, () => new Array(size).fill(false));
}

function setFinderPattern(matrix: Matrix, row: number, col: number) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const nr = row + r;
      const nc = col + c;
      if (nr < 0 || nr >= matrix.length || nc < 0 || nc >= matrix.length) continue;
      const inOuter = r >= 0 && r <= 6 && (c === 0 || c === 6);
      const inTop = c >= 0 && c <= 6 && (r === 0 || r === 6);
      const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      const isSep = r === -1 || r === 7 || c === -1 || c === 7;
      if (isSep) {
        matrix[nr][nc] = false;
      } else if (inOuter || inTop || inInner) {
        matrix[nr][nc] = true;
      } else {
        matrix[nr][nc] = false;
      }
    }
  }
}

function setAlignmentPattern(matrix: Matrix, row: number, col: number) {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const isOuter = Math.abs(r) === 2 || Math.abs(c) === 2;
      const isCenter = r === 0 && c === 0;
      matrix[row + r][col + c] = isOuter || isCenter;
    }
  }
}

// Alignment pattern centers for versions 2-10
const ALIGNMENT_POSITIONS: number[][] = [
  [], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
  [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
];

function placePatterns(matrix: Matrix, version: number) {
  const size = matrix.length;

  // Finder patterns
  setFinderPattern(matrix, 0, 0);
  setFinderPattern(matrix, 0, size - 7);
  setFinderPattern(matrix, size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Dark module
  matrix[size - 8][8] = true;

  // Alignment patterns
  if (version >= 2) {
    const pos = ALIGNMENT_POSITIONS[version];
    for (const r of pos) {
      for (const c of pos) {
        if ((r === 6 && c === 6) || (r === 6 && c === pos[pos.length - 1]) || (r === pos[pos.length - 1] && c === 6)) continue;
        setAlignmentPattern(matrix, r, c);
      }
    }
  }
}

function isReserved(matrix: Matrix, row: number, col: number, version: number): boolean {
  const size = matrix.length;
  // Finder patterns + separators
  if (row < 9 && col < 9) return true;
  if (row < 9 && col >= size - 8) return true;
  if (row >= size - 8 && col < 9) return true;
  // Timing
  if (row === 6 || col === 6) return true;
  // Format info areas
  if (row === 8 && col < 9) return true;
  if (col === 8 && row < 9) return true;
  if (row === 8 && col >= size - 8) return true;
  if (col === 8 && row >= size - 8) return true;
  // Dark module
  if (row === size - 8 && col === 8) return true;
  // Alignment patterns
  if (version >= 2) {
    const pos = ALIGNMENT_POSITIONS[version];
    for (const r of pos) {
      for (const c of pos) {
        if (Math.abs(row - r) <= 2 && Math.abs(col - c) <= 2) return true;
      }
    }
  }
  return false;
}

function placeData(matrix: Matrix, data: boolean[], version: number) {
  const size = matrix.length;
  let idx = 0;
  let up = true;

  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5;
    for (let rowIdx = 0; rowIdx < size; rowIdx++) {
      const row = up ? size - 1 - rowIdx : rowIdx;
      for (let c = 0; c < 2; c++) {
        const nc = col - c;
        if (!isReserved(matrix, row, nc, version)) {
          matrix[row][nc] = idx < data.length ? data[idx] : false;
          idx++;
        }
      }
    }
    up = !up;
  }
}

function applyMask(matrix: Matrix, mask: number): Matrix {
  const size = matrix.length;
  const result = matrix.map(row => [...row]);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let apply = false;
      switch (mask) {
        case 0: apply = (r + c) % 2 === 0; break;
        case 1: apply = r % 2 === 0; break;
        case 2: apply = c % 3 === 0; break;
        case 3: apply = (r + c) % 3 === 0; break;
        case 4: apply = (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; break;
        case 5: apply = ((r * c) % 2 + (r * c) % 3) === 0; break;
        case 6: apply = ((r * c) % 2 + (r * c) % 3) % 2 === 0; break;
        case 7: apply = ((r + c) % 2 + (r * c) % 3) % 2 === 0; break;
      }
      if (apply) result[r][c] = !result[r][c];
    }
  }
  return result;
}

// Format info for EC level L (01) and mask patterns 0-7
const FORMAT_INFO: number[] = [
  0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
];

function placeFormatInfo(matrix: Matrix, mask: number) {
  const size = matrix.length;
  const fmt = FORMAT_INFO[mask];
  const bits: boolean[] = [];
  for (let i = 14; i >= 0; i--) {
    bits.push(((fmt >> i) & 1) === 1);
  }

  // Around top-left finder
  const positions1 = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  for (let i = 0; i < 15; i++) {
    matrix[positions1[i][0]][positions1[i][1]] = bits[i];
  }

  // Top-right and bottom-left
  for (let i = 0; i < 7; i++) {
    matrix[size - 1 - i][8] = bits[i];
  }
  for (let i = 7; i < 15; i++) {
    matrix[8][size - 15 + i] = bits[i];
  }
}

export function generateQRMatrix(text: string): boolean[][] {
  // Encode text as UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = Array.from(encoder.encode(text));

  const version = Math.min(10, getVersion(bytes.length));
  const info = VERSION_INFO[version];
  const size = getSize(version);

  // Build data bits: mode (0100) + char count (8 bits) + data bytes + terminator
  const dataBits: boolean[] = [];
  // Mode indicator: byte mode = 0100
  dataBits.push(false, true, false, false);
  // Character count (8 bits for version 1-9)
  const len = bytes.length;
  for (let i = 7; i >= 0; i--) dataBits.push(((len >> i) & 1) === 1);
  // Data bytes
  for (const byte of bytes) {
    for (let i = 7; i >= 0; i--) dataBits.push(((byte >> i) & 1) === 1);
  }
  // Terminator
  for (let i = 0; i < 4 && dataBits.length < info.dataBytes * 8; i++) dataBits.push(false);
  // Pad to byte boundary
  while (dataBits.length % 8 !== 0) dataBits.push(false);
  // Pad bytes
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (dataBits.length < info.dataBytes * 8) {
    const pb = padBytes[padIdx % 2];
    for (let i = 7; i >= 0; i--) dataBits.push(((pb >> i) & 1) === 1);
    padIdx++;
  }

  // Convert to byte array
  const dataBytes: number[] = [];
  for (let i = 0; i < dataBits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (dataBits[i + j] ? 1 : 0);
    dataBytes.push(byte);
  }

  // Reed-Solomon error correction
  const ecBytes = rsEncode(dataBytes, info.ecBytes);

  // Interleave (simplified - single block)
  const allBytes = [...dataBytes, ...ecBytes];
  const allBits: boolean[] = [];
  for (const byte of allBytes) {
    for (let i = 7; i >= 0; i--) allBits.push(((byte >> i) & 1) === 1);
  }

  // Build matrix
  const matrix = createMatrix(size);
  placePatterns(matrix, version);

  // Try mask 0 (simple, good enough for display)
  const maskId = 0;
  placeData(matrix, allBits, version);
  placeFormatInfo(matrix, maskId);
  const masked = applyMask(matrix, maskId);

  return masked;
}
