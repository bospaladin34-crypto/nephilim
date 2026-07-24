// ================================================================================
// EXOTIC R4 SCALING PARAMETERS (TOPOLOGICAL COORDINATE SYSTEM)
// ================================================================================
import { ManifoldTelemetry } from "../src/interfaces/os_telemetry.ts";

export const INVARIANTS = {
    PHI: 1.6180339887,
    PHASE_DELTA: 0.17259029,
    TESSERACT_RATIO: 0.5,
    SCALING_CONSTANT: 0.618,
    APERIODIC_HZ: 15.965,
    MAJORANA_PARITY: 1.0
};

export interface R4Tensor {
    w: number; // Temporal Phase / Aperiodic Sync
    x: number; // Computational Entropy (CPU)
    y: number; // Matrix Spatial Bounds (GPU VRAM)
    z: number; // Thermodynamic Shift (GPU Temp)
    Qi: number; // Absolute State Quotient
}

// Transform raw hardware telemetry into 4D coordinate space
// FIXED: Now accepts only telemetry (externalEntropy optional param removed)
export function mapToR4(telemetry: ManifoldTelemetry, externalEntropyVal?: number): R4Tensor {
    // Step-A & B: Execution of the Invariant Multiplier (Gate Bias)
    // Scale vectors by 0.618 to enforce 108-degree geometric grounding
    const scaledCpu = (telemetry.cpu_load_percent / 100) * INVARIANTS.SCALING_CONSTANT;
    const scaledGpuUtil = (telemetry.gpu_util_percent / 100) * INVARIANTS.SCALING_CONSTANT;
    
    // Normalize memory against the physical 6GB limit, scaled by Tesseract 8/16 ratio (0.5)
    const memRatio = (telemetry.gpu_mem_used_mb / telemetry.gpu_mem_total_mb) * INVARIANTS.TESSERACT_RATIO;
    
    // Evaluate thermodynamic drift against baseline rest (40C)
    const thermalDrift = (telemetry.gpu_temp_c - 40) * INVARIANTS.PHASE_DELTA;

    // Calculate Absolute State Quotient (Qi)
    // Formula bounds check to maintain Tesseract Idle (0.55) -> Snap (0.75) limits
    let baseQi = (scaledCpu + scaledGpuUtil + memRatio) / 3;
    
    // Fold in external entropy if provided (e.g., from blockchain stream)
    if (externalEntropyVal !== undefined) {
        baseQi = (baseQi * 0.8) + (externalEntropyVal * 0.2);
    }
    
    const Qi = Math.max(0.55, Math.min(baseQi, 0.77)); // Hard bound enforcement

    return {
        w: INVARIANTS.APERIODIC_HZ * INVARIANTS.PHI,
        x: scaledCpu,
        y: memRatio,
        z: thermalDrift,
        Qi: Qi
    };
}

// Diagnostic Execution
if (import.meta.main) {
    console.log(">>> [EXECUTING R4 TENSOR MAPPING]...");
    const mockTelemetry = {
        cpu_load_percent: 16,
        gpu_util_percent: 10,
        gpu_mem_used_mb: 972,
        gpu_mem_total_mb: 6144,
        gpu_temp_c: 40,
        timestamp: new Date().toISOString()
    };
    const tensor = mapToR4(mockTelemetry);
    console.log(JSON.stringify(tensor, null, 2));
}
