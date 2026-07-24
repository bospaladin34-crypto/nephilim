// ================================================================================
// WEBGPU MATRIX IGNITION (RTX COMPUTE ENGINE)
// TARGET ARCHITECTURE: PARALLELIZED TENSOR PROCESSING
// COMPLETED: Full GPU initialization with feature detection & compute buffer setup
// ================================================================================

export interface GPUMatrixStatus {
    is_initialized: boolean;
    device: GPUDevice | null;
    adapter_name: string;
    features: string[];
    limits: {
        max_buffer_size: number;
        max_compute_workgroup_size_x: number;
        max_compute_workgroup_size_y: number;
        max_compute_workgroup_size_z: number;
    };
}

export let gpuMatrix: GPUMatrixStatus = {
    is_initialized: false,
    device: null,
    adapter_name: "UNINITIALIZED",
    features: [],
    limits: {
        max_buffer_size: 0,
        max_compute_workgroup_size_x: 0,
        max_compute_workgroup_size_y: 0,
        max_compute_workgroup_size_z: 0
    }
};

/**
 * Initialize WebGPU compute device with feature detection.
 * Gracefully degrades to CPU if GPU unavailable.
 */
export async function initGpuMatrix() {
    try {
        if (!navigator.gpu) {
            console.warn("⚠️ [L7_GPU] WebGPU not supported in this runtime. Falling back to CPU-bound execution.");
            console.log(">>> [CPU_FALLBACK] TIER 4 LINEAR CPU FALLBACK (Low-Entropy Operation)");
            return;
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            console.warn("⚠️ [L7_GPU] No GPU adapter found. Falling back to CPU-bound execution.");
            console.log(">>> [CPU_FALLBACK] TIER 4 LINEAR CPU FALLBACK (Low-Entropy Operation)");
            return;
        }

        // Get adapter info
        const adapterInfo = adapter.info;
        gpuMatrix.adapter_name = adapterInfo.vendor || "Unknown Vendor";

        // Request device with features
        const device = await adapter.requestDevice();
        gpuMatrix.device = device;

        // Extract supported features
        device.features.forEach((feature) => {
            gpuMatrix.features.push(feature);
        });

        // Extract limits
        gpuMatrix.limits.max_buffer_size = device.limits.maxBufferSize;
        gpuMatrix.limits.max_compute_workgroup_size_x = device.limits.maxComputeWorkgroupSizeX;
        gpuMatrix.limits.max_compute_workgroup_size_y = device.limits.maxComputeWorkgroupSizeY;
        gpuMatrix.limits.max_compute_workgroup_size_z = device.limits.maxComputeWorkgroupSizeZ;

        gpuMatrix.is_initialized = true;

        console.log(`✅ [L7_GPU_IGNITION] Compute buffers locked to: ${gpuMatrix.adapter_name}`);
        console.log(`   | Features: ${gpuMatrix.features.join(", ") || "(no optional features)"}`);
        console.log(`   | Max Buffer Size: ${gpuMatrix.limits.max_buffer_size} bytes`);
        console.log(`   | Max Workgroup Size: (${gpuMatrix.limits.max_compute_workgroup_size_x}, ${gpuMatrix.limits.max_compute_workgroup_size_y}, ${gpuMatrix.limits.max_compute_workgroup_size_z})`);
    } catch (e) {
        console.error(`❌ [L7_GPU_FAULT] Hardware ignition failure: ${e}`);
        console.log(">>> [CPU_FALLBACK] TIER 4 LINEAR CPU FALLBACK (Low-Entropy Operation)");
    }
}

/**
 * Create a tensor buffer on the GPU for parallel operations.
 */
export function createTensorBuffer(data: Float32Array): GPUBuffer | null {
    if (!gpuMatrix.device) {
        console.warn("⚠️ [GPU_BUFFER] No GPU device available. Skipping buffer creation.");
        return null;
    }

    try {
        const buffer = gpuMatrix.device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });

        new Float32Array(buffer.getMappedRange()).set(data);
        buffer.unmap();

        return buffer;
    } catch (e) {
        console.error(`❌ [GPU_BUFFER] Failed to create tensor buffer: ${e}`);
        return null;
    }
}

/**
 * Graceful shutdown of GPU resources.
 */
export function shutdownGpuMatrix() {
    if (gpuMatrix.device) {
        gpuMatrix.device.destroy();
        gpuMatrix.is_initialized = false;
        gpuMatrix.device = null;
        console.log("✅ [L7_GPU_SHUTDOWN] GPU resources released.");
    }
}

// Diagnostic Execution
if (import.meta.main) {
    console.log(">>> [EXECUTING GPU MATRIX DIAGNOSTIC]...");
    await initGpuMatrix();
    console.log("\n[GPU_MATRIX_STATUS]");
    console.log(JSON.stringify(gpuMatrix, null, 2));
    shutdownGpuMatrix();
}
