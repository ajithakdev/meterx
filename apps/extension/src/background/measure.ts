/**
 * Pure measurement math. No I/O, so it is unit tested (measure.test.ts).
 * @license AGPL-3.0
 */

import { gradeBufferbloat, median } from '@meterx/shared';

export { gradeBufferbloat, median };

/** Cumulative bytes received at time t (ms since the phase started). */
export interface ByteSample { t: number; bytes: number }

/** Decimal megabits per second, the unit ISPs advertise (#64). */
export function toMbps(bytes: number, ms: number): number {
    return ms > 0 ? (bytes * 8) / (ms * 1000) : 0;
}

/** Bytes at tTarget by linear interpolation between samples ordered by t. */
export function bytesAtTime(samples: ByteSample[], tTarget: number): number {
    if (samples.length === 0) return 0;
    if (tTarget <= samples[0].t) return samples[0].bytes;
    for (let i = 1; i < samples.length; i++) {
        const b = samples[i];
        if (b.t >= tTarget) {
            const a = samples[i - 1];
            return a.bytes + (b.bytes - a.bytes) * ((tTarget - a.t) / (b.t - a.t || 1));
        }
    }
    return samples[samples.length - 1].bytes;
}

/**
 * Steady-state throughput: drops the ramp-up and the tail, then measures
 * the bytes moved in the window between. Falls back to total/elapsed when
 * the phase ended too early for a window.
 */
export function steadyMbps(samples: ByteSample[], elapsedMs: number, opts: { rampMs: number; tailMs: number; durationMs: number }): number {
    const end = Math.min(opts.durationMs - opts.tailMs, elapsedMs);
    const last = samples.length ? samples[samples.length - 1].bytes : 0;
    if (end <= opts.rampMs) return toMbps(last, elapsedMs);
    return toMbps(bytesAtTime(samples, end) - bytesAtTime(samples, opts.rampMs), end - opts.rampMs);
}


/** Median ping, mean absolute change between consecutive pings, and % of probes lost. */
export function latencyStats(latencies: number[], attempts: number): { ping: number; jitter: number; packetLoss: number } {
    let diff = 0;
    for (let i = 1; i < latencies.length; i++) diff += Math.abs(latencies[i] - latencies[i - 1]);
    return {
        ping: median(latencies),
        jitter: latencies.length > 1 ? diff / (latencies.length - 1) : 0,
        packetLoss: attempts > 0 ? ((attempts - latencies.length) / attempts) * 100 : 0,
    };
}


const KB = 1024;
/** Every upload stream starts here and grows from what it measures, so lopsided lines (fast down, slow up) still finish bodies (#60). */
export const MIN_UPLOAD_CHUNK = 256 * KB;
export const MAX_UPLOAD_CHUNK = 8 * 1024 * KB;

const UPLOAD_TARGET_MS = 1000;

/**
 * Next body size for one upload stream, from how long its last body took: aims at about
 * 1 s per request, so a test spends about 24 Worker requests on uploads instead of about 96.
 * Grows at most 4x per step, so a slow uplink behind a fast downlink still completes bodies (#60).
 */
export function nextUploadChunk(lastBytes: number, lastMs: number): number {
    const ideal = lastMs > 0 ? (lastBytes * UPLOAD_TARGET_MS) / lastMs : lastBytes * 4;
    const next = Math.round(Math.min(ideal, lastBytes * 4));
    return Math.min(MAX_UPLOAD_CHUNK, Math.max(MIN_UPLOAD_CHUNK, next));
}

/** Delay before retrying a failed transfer request: 250 ms, doubling, capped at 2 s (#65). */
export function backoffMs(failures: number): number {
    return Math.min(2000, 250 * 2 ** Math.max(0, failures - 1));
}
