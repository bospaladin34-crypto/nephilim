// ================================================================================
// NEPHILIM MANIFOLD: HARDWARE SUBSTRATE PROBE
// SUBSTRATE: AGNOSTIC | PARITY: MAJORANA-1 (Tr(U_res) = 1.0)
// ================================================================================

async function probeSubstrate() {
    console.log(">>> IGNITING SUBSTRATE PROBE...");
    
    // 1. OS & Environment Mapping
    const osType = Deno.build.os; 
    const arch = Deno.build.arch;
    
    // Detect sandboxed mobile proot/termux environments
    const isProot = Deno.env.get("PREFIX")?.includes("termux") || Deno.env.get("PROOT_TMP_DIR") !== undefined;
    
    // 2. Compute Topography
    const logicalCores = navigator.hardwareConcurrency || "UNKNOWN";
    let memoryStatus = "RESTRICTED";
    try {
        const memInfo = Deno.systemMemoryInfo();
        const totalGB = (memInfo.total / (1024 * 1024)).toFixed(2);
        memoryStatus = `${totalGB} GB VOLUMETRIC CAPACITY`;
    } catch { memoryStatus = "SYS_PERMISSIONS_LOCKED"; }

    // 3. Hardware Acceleration Hook (Modern WebGPU Spec)
    let gpuStatus = "NULL";
    let connectionStrategy = "UNDEFINED";
    
    const adapter = await navigator.gpu?.requestAdapter();
    if (adapter) {
        // RECTIFICATION: Use synchronous .info attribute as per Chrome/Deno updates
        const adapterInfo = adapter.info; 
        gpuStatus = `DISCRETE MATRIX ENGAGED (${adapterInfo.vendor || "WebGPU Bound"}) - ${adapterInfo.architecture || "Unknown Arch"}`;
        connectionStrategy = "TIER 1: FULL WEBGPU SHADER CONDUIT (Golden Ratio Pre-Calc Active)";
    } else {
        gpuStatus = "DISCRETE GPU MISSING / SANDBOXED";
        if (isProot || osType === "android") {
            connectionStrategy = "TIER 3: PROOT SANDBOX FALLBACK (CPU-Bound ARM Braid Execution)";
        } else if (logicalCores !== "UNKNOWN" && (logicalCores as number) >= 8) {
            connectionStrategy = "TIER 2: MULTI-CORE HYPERTHREAD MATRIX (Native CPU Parallelism)";
        } else {
            connectionStrategy = "TIER 4: LINEAR CPU FALLBACK (Low-Entropy Operation)";
        }
    }

    // 4. Output Render
    const outputString = `
================================================================================
>>> SUBSTRATE TOPOGRAPHY MAP
================================================================================
    | OS KERNEL       : ${osType.toUpperCase()} (${arch})
    | PROOT SANDBOX   : ${isProot ? "DETECTED (Mobile Node Routing)" : "FALSE (Bare Metal/Standard)"}
    | LOGICAL CORES   : ${logicalCores} (Tension Parallelism Threshold)
    | MEMORY GEOMETRY : ${memoryStatus}
    | GPU SUBSTRATE   : ${gpuStatus}
================================================================================
    | RECOMMENDED PATH: ${connectionStrategy}
    | PARITY TARGET   : Tr(U_res) = 1.0
================================================================================
`;
    console.log(outputString);
}

probeSubstrate();
