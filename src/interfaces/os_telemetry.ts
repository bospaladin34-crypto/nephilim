// ================================================================================
// NATIVE TELEMETRY BRIDGE (ZERO-DEPENDENCY I/O)
// TARGET ARCHITECTURE: NATIVE OS / INTEL / NVIDIA SUBSYSTEM
// ================================================================================

export interface ManifoldTelemetry {
    cpu_load_percent: number;
    gpu_util_percent: number;
    gpu_mem_used_mb: number;
    gpu_mem_total_mb: number;
    gpu_temp_c: number;
    timestamp: string;
}

export async function extractHardwareEntropy(): Promise<ManifoldTelemetry> {
    const telemetry: ManifoldTelemetry = {
        cpu_load_percent: 0,
        gpu_util_percent: 0,
        gpu_mem_used_mb: 0,
        gpu_mem_total_mb: 0,
        gpu_temp_c: 0,
        timestamp: new Date().toISOString()
    };

    try {
        // 1. NATIVE CPU EXTRACTION (WMI)
        const cpuCmd = new Deno.Command("powershell", {
            args: ["-NoProfile", "-Command", "Get-WmiObject win32_processor | Measure-Object -Property LoadPercentage -Average | Select-Object -ExpandProperty Average"],
            stdout: "piped",
        });
        const cpuOutput = await cpuCmd.output();
        const cpuRaw = new TextDecoder().decode(cpuOutput.stdout).trim();
        if (cpuRaw) telemetry.cpu_load_percent = parseFloat(cpuRaw);

        // 2. NATIVE GPU EXTRACTION (NVIDIA-SMI)
        // Bypassing third-party tools to extract direct RTX matrix metrics
        const gpuCmd = new Deno.Command("nvidia-smi", {
            args: ["--query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu", "--format=csv,noheader,nounits"],
            stdout: "piped",
            stderr: "piped"
        });
        const gpuOutput = await gpuCmd.output();
        if (gpuOutput.success) {
            const gpuRaw = new TextDecoder().decode(gpuOutput.stdout).trim();
            const [util, memUsed, memTotal, temp] = gpuRaw.split(",").map(val => parseFloat(val.trim()));
            telemetry.gpu_util_percent = util;
            telemetry.gpu_mem_used_mb = memUsed;
            telemetry.gpu_mem_total_mb = memTotal;
            telemetry.gpu_temp_c = temp;
        } else {
            console.log("⚠️ [TELEMETRY] GPU Matrix not accessible via native driver.");
        }
    } catch (e) {
        console.error(`❌ [TELEMETRY_FAILURE] Entropy extraction compromised: ${e}`);
    }

    return telemetry;
}

// Diagnostic Execution (Only runs if executed directly)
if (import.meta.main) {
    console.log(">>> [EXECUTING NATIVE SENSOR SWEEP]...");
    extractHardwareEntropy().then(data => console.log(JSON.stringify(data, null, 2)));
}
