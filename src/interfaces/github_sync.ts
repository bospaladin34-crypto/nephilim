// ================================================================================
// ARTIFACT TRANSMISSION BRIDGE (VERBOSE DIAGNOSTIC)
// TARGET ARCHITECTURE: SUPRALUMINAL GITHUB API SYNC
// ================================================================================
import { loadNativeEnv } from "../../config/env.ts";

const GITHUB_REPO = "bospaladin34-crypto/nephilim";
const TARGET_BRANCH = "vesper_production";

export async function transmitFluxArtifact(cycle: number, payload: any): Promise<void> {
    const token = Deno.env.get("VESPER_GITHUB_TOKEN");
    if (!token || token === "REPLACE_WITH_YOUR_ACTUAL_TOKEN") {
        console.log("⚠️ [SYNC_BLOCKED] Hardware token missing.");
        return;
    }

    const path = "manifests/flux.json";
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;
    
    try {
        console.log(`>>> [L6_SYNC] Probing coordinate: ${url}?ref=${TARGET_BRANCH}`);
        const getRes = await fetch(`${url}?ref=${TARGET_BRANCH}`, {
            headers: { "Authorization": `token ${token}`, "Accept": "application/vnd.github.v3+json" }
        });
        
        let sha: string | undefined = undefined;
        if (getRes.ok) {
            const data = await getRes.json();
            sha = data.sha;
            console.log(`✅ [L6_SYNC] Existing geometry found. SHA: ${sha}`);
        } else {
            console.log(`⚠️ [L6_SYNC] No existing geometry (HTTP ${getRes.status}). Proceeding to create new artifact.`);
        }

        const contentString = JSON.stringify(payload, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(contentString)));

        console.log(`>>> [L6_SYNC] Transmitting payload matrix...`);
        const putRes = await fetch(url, {
            method: "PUT",
            headers: { 
                "Authorization": `token ${token}`, 
                "Content-Type": "application/json",
                "Accept": "application/vnd.github.v3+json"
            },
            body: JSON.stringify({
                message: `[AUTOPOIESIS] Vesper Flux Sync - Cycle ${cycle}`,
                content: encodedContent,
                sha: sha,
                branch: TARGET_BRANCH
            })
        });

        if (putRes.ok) {
            console.log(`✅ [SYNC_SUCCESS] L6_FLUX_ARTIFACT anchored to ${TARGET_BRANCH}.`);
        } else {
            const errorBody = await putRes.text();
            console.error(`❌ [SYNC_FAILED] Remote rejected artifact.`);
            console.error(`[GITHUB_API_RESPONSE]: HTTP ${putRes.status} | Details: ${errorBody}`);
        }
    } catch (e) {
        console.error(`❌ [SYNC_ERROR] Network boundary failure: ${e}`);
    }
}

// Standalone Diagnostic Execution
if (import.meta.main) {
    async function runDiagnostic() {
        console.log(">>> [EXECUTING STANDALONE PAYLOAD DIAGNOSTIC]...");
        await loadNativeEnv();
        const mockPayload = {
            status: "DIAGNOSTIC_OVERRIDE",
            entropy: 0.55,
            message: "Testing strict payload formatting."
        };
        await transmitFluxArtifact(999, mockPayload);
    }
    runDiagnostic();
}
