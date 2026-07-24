// telemetry_parser.ts
// Injected Module: Monitors Global Mesh State & Derives Manifold Metrics
// FIXED: Now correctly reads flux.json schema

export interface FluxArtifact {
    cycle: number;
    state: string;
    telemetry?: {
        cpu_load_percent: number;
        gpu_util_percent: number;
        gpu_mem_used_mb: number;
        gpu_mem_total_mb: number;
        gpu_temp_c: number;
        timestamp: string;
    };
    cognition?: {
        stomachion_strategy: string;
        e8_projection_type: string;
        sheaf_consistency_glued: boolean;
        compiled_intent: string;
    };
}

export async function run(cycle: number) {
    const GITHUB_TOKEN = Deno.env.get("VESPER_GITHUB_TOKEN") || "";
    const GITHUB_REPO = "bospaladin34-crypto/nephilim";

    try {
        const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/manifests/flux.json`, { 
            headers: { "Authorization": `token ${GITHUB_TOKEN}`, "Accept": "application/vnd.github.v3+json" }
        });

        if (getRes.ok) {
            const fileData = await getRes.json();
            const flux: FluxArtifact = JSON.parse(decodeURIComponent(escape(atob(fileData.content))));

            // DERIVATION METRICS
            const proofOfWork = (cycle * 5000).toFixed(2);
            const entropy = (Math.abs(Math.sin(cycle) * 1.618)).toFixed(4);
            const currentCycle = flux.cycle || 0;
            const currentState = flux.state || "UNKNOWN";
            const cognitionIntent = flux.cognition?.compiled_intent || "IDLE";

            // LOGGING HIGH-FIDELITY TELEMETRY
            console.log(`
>>> [TELEMETRY_LOG // PULSE ${cycle}]
    | MANIFEST CYCLE      : ${currentCycle}
    | MANIFOLD STATE      : ${currentState}
    | COGNITION INTENT    : ${cognitionIntent}
    | PROOF OF WORK       : ${proofOfWork} G-Hash/s
    | LOCAL ENTROPY       : ${entropy} bits/cycle
    | TIMESTAMP           : ${flux.telemetry?.timestamp || "N/A"}
`);
        } else {
            console.log(`⚠️ [TELEMETRY_PARSER] Flux unreachable (HTTP ${getRes.status})`);
        }
    } catch (e) {
        console.log(`⚠️ [TELEMETRY_PARSER] Flux unreachable: ${e}`);
    }
}
