// ================================================================================
// L6 NETWORK PROBE: ADVERSARIAL PERMISSION AUDIT
// TARGET ARCHITECTURE: HTTP STATUS EXTRACTION
// ================================================================================
import { loadNativeEnv } from "../../config/env.ts";

async function executeProbe() {
    console.log(">>> [INITIATING ADVERSARIAL I/O PROBE]...");
    
    // 1. Verify Local Memory Matrix (.env)
    await loadNativeEnv();
    const token = Deno.env.get("VESPER_GITHUB_TOKEN");
    
    if (!token || token === "REPLACE_WITH_YOUR_ACTUAL_TOKEN") {
        console.error("❌ [L0_SUBSTRATE_FAULT] The hardware key is blank or unresolved in memory.");
        return;
    }
    
    console.log(`✅ [L0_SUBSTRATE_OK] Hardware Key Loaded: ${token.substring(0, 8)}...`);

    // 2. Execute Supraluminal Handshake
    const url = "https://api.github.com/repos/bospaladin34-crypto/nephilim";
    console.log(`>>> [PINGING TARGET: ${url}]`);
    
    try {
        const getRes = await fetch(url, {
            headers: { 
                "Authorization": `token ${token}`, 
                "Accept": "application/vnd.github.v3+json" 
            }
        });

        console.log(`\n[L6_HTTP_STATUS]: ${getRes.status} ${getRes.statusText}`);

        if (getRes.status === 200) {
            console.log("✅ [HANDSHAKE_VERIFIED] The token has access to the repository coordinates.");
            
            // Check permissions explicitly via headers
            const scopes = getRes.headers.get("x-oauth-scopes") || "NONE DETECTED";
            console.log(`[L6_TOKEN_SCOPES]: ${scopes}`);
            
            if (scopes.includes("repo")) {
                console.log("✅ [SCOPE_VERIFIED] The token possesses full 'repo' scope.");
            } else {
                console.log("❌ [SCOPE_FAULT] The token lacks 'repo' scope. It cannot manifest artifacts.");
            }
        } else if (getRes.status === 401) {
            console.log("❌ [AUTH_FAULT] 401 Unauthorized: The Personal Access Token is invalid or expired.");
        } else if (getRes.status === 404) {
            console.log("❌ [ROUTING_FAULT] 404 Not Found: The token lacks 'repo' scope or the repository is entirely invisible to it.");
        } else {
            console.log(`⚠️ [UNKNOWN_FAULT] Unhandled HTTP anomaly.`);
        }
    } catch (e) {
        console.error(`❌ [NETWORK_FAULT] The physical hardware cannot reach external geometric planes: ${e}`);
    }
}

executeProbe();
