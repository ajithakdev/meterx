import { describe, it, expect } from 'vitest';
import { toMbps, bytesAtTime, steadyMbps, median, latencyStats, gradeBufferbloat, nextUploadChunk, backoffMs } from './measure';

const opts = { rampMs: 1000, tailMs: 500, durationMs: 8000 };

describe('toMbps', () => {
    it('uses decimal megabits', () => {
        expect(toMbps(125_000_000, 1000)).toBe(1000); // 125 MB in 1 s = 1 Gbps
    });
    it('returns 0 for zero time', () => {
        expect(toMbps(100, 0)).toBe(0);
    });
});

describe('bytesAtTime', () => {
    const s = [{ t: 0, bytes: 0 }, { t: 1000, bytes: 1000 }, { t: 2000, bytes: 3000 }];
    it('interpolates between samples', () => {
        expect(bytesAtTime(s, 1500)).toBe(2000);
    });
    it('returns the exact sample when the window ends on it', () => {
        expect(bytesAtTime(s, 1000)).toBe(1000);
    });
    it('clamps outside the range', () => {
        expect(bytesAtTime(s, -5)).toBe(0);
        expect(bytesAtTime(s, 9999)).toBe(3000);
        expect(bytesAtTime([], 10)).toBe(0);
    });
});

describe('steadyMbps', () => {
    it('measures only the steady window', () => {
        // 1 MB/s after a slow first second: steady rate is 8 Mbps.
        const s = [{ t: 0, bytes: 0 }, { t: 1000, bytes: 100_000 }, { t: 8000, bytes: 7_100_000 }];
        expect(steadyMbps(s, 8000, opts)).toBeCloseTo(8, 5);
    });
    it('reads 0, not NaN, when nothing completed', () => {
        expect(steadyMbps([{ t: 0, bytes: 0 }], 8000, opts)).toBe(0);
    });
    it('falls back to total over elapsed for a short phase', () => {
        expect(steadyMbps([{ t: 0, bytes: 0 }, { t: 500, bytes: 500_000 }], 500, opts)).toBeCloseTo(8, 5);
    });
});

describe('latencyStats', () => {
    it('takes the median and mean consecutive change', () => {
        expect(latencyStats([10, 20, 10, 30], 4)).toEqual({ ping: 15, jitter: (10 + 10 + 20) / 3, packetLoss: 0 });
    });
    it('counts lost probes', () => {
        const r = latencyStats([20, 22, 24, 26], 5);
        expect(r.packetLoss).toBe(20);
        expect(r.ping).toBe(23);
    });
    it('has zero jitter for a single ping', () => {
        expect(latencyStats([40], 1).jitter).toBe(0);
    });
    it('median of nothing is NaN', () => {
        expect(median([])).toBeNaN();
    });
});

describe('gradeBufferbloat', () => {
    it.each([[0, 'A'], [5, 'A'], [30, 'B'], [60, 'C'], [200, 'D'], [201, 'F']] as const)('%d ms -> %s', (d, g) => {
        expect(gradeBufferbloat(d)).toBe(g);
    });
});

describe('nextUploadChunk', () => {
    it('sizes the next body to take about 1 s', () => {
        expect(nextUploadChunk(1_000_000, 250)).toBe(4_000_000);
        expect(nextUploadChunk(2_000_000, 2000)).toBe(1_000_000);
    });
    it('grows at most 4x per request, so a slow uplink still completes bodies (#60)', () => {
        expect(nextUploadChunk(300_000, 10)).toBe(1_200_000);
        expect(nextUploadChunk(300_000, 0)).toBe(1_200_000);
    });
    it('stays within the min and max body sizes', () => {
        expect(nextUploadChunk(256 * 1024, 5000)).toBe(256 * 1024);
        expect(nextUploadChunk(8 * 1024 * 1024, 100)).toBe(8 * 1024 * 1024);
    });
});

describe('backoffMs', () => {
    it('doubles and caps', () => {
        expect([1, 2, 3, 4, 10].map(backoffMs)).toEqual([250, 500, 1000, 2000, 2000]);
    });
});
