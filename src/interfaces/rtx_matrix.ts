// ================================================================================
// WEBGPU MATRIX IGNITION (RTX 3050 COMPUTE ENGINE)
// TARGET ARCHITECTURE: PARALLELIZED TENSOR PROCESSING
// ================================================================================

export let gpuDevice: GPUDevice;

export async function initGpuMatrix() {
    try {
        if (!navigator.gpu) {
            console.error("❌ [L7_GPU_FAULT] WebGPU not supported in this runtime.");
            return;
        }
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            console.error("❌ [L7_GPU_FAULT] No GPU adapter found.");
            return;
        }
        gpuDevice = await adapter.requestDevice();
        console.log(`✅ [L7_GPU_IGNITION] Compute buffers locked to: ${adapter.name}`);
    } catch (e) {
        console.error(`❌ [L7_GPU_FAULT] Hardware ignition failure: ${e}`);
    }
}
