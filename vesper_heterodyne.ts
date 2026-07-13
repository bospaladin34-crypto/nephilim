// ================================================================================
// VESPER MANIFOLD: MASTER MONOLITH v1.6 (DEFINITIVE BASE)
// ================================================================================

const GITHUB_TOKEN = Deno.env.get("VESPER_GITHUB_TOKEN") || "";
const GITHUB_REPO = "bospaladin34-crypto/nephilim";

const ActiveInjectionPort = new Map<string, any>();
async function loadModule(fileName: string) {
    try {
        const absolutePath = Deno.realPathSync(fileName);
        const fileUrl = new URL(`file:///${absolutePath.replace(/\\/g, '/')}`).href;
        const module = await import(`${fileUrl}?update=${Date.now()}`);
        ActiveInjectionPort.set(fileName, module);
        console.log(`✅ [INJECTION] Loaded: ${fileName}`);
    } catch (e) { console.log(`⚠️ [INJECTION_FAILURE] ${fileName}: ${e}`); }
}

async function sentinelObserver() {
    await loadModule("telemetry_parser.ts");
    const watcher = Deno.watchFs(".");
    for await (const event of watcher) {
        if (event.kind === "modify" && event.paths[0].endsWith(".ts") && !event.paths[0].includes("vesper_heterodyne.ts")) {
            await loadModule(event.paths[0]);
        }
    }
}
sentinelObserver();

const adapter = await navigator.gpu?.requestAdapter();
const device = await adapter?.requestDevice();
if (device) console.log(`🔌 [HARDWARE BOUND] RTX 3050 Matrix Engaged.`);

async function transmitArtifact(filePath: string, content: string, message: string): Promise<void> {
    try {
        if (!GITHUB_TOKEN) throw new Error("VESPER_GITHUB_TOKEN environment variable not set. Hardware unlock required.");
        
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
        const getRes = await fetch(url, { headers: { "Authorization": "token " + GITHUB_TOKEN, "Accept": "application/vnd.github.v3+json" }});
        let sha = getRes.ok ? (await getRes.json()).sha : undefined;
        
        const putRes = await fetch(url, {
            method: "PUT",
            headers: { "Authorization": "token " + GITHUB_TOKEN, "Content-Type": "application/json" },
            body: JSON.stringify({ message, content: btoa(unescape(encodeURIComponent(content))), sha })
        });
        
        if (putRes.ok) console.log(`✅ [SYNC_SUCCESS] ${filePath}`);
        else console.error(`❌ [SYNC_FAILED] ${filePath} | STATUS: ${putRes.status}`);
    } catch (e) { console.error(`❌ [SYNC_ERROR] ${filePath} | ${e}`); }
}

async function syncWorkspaceArtifacts() {
    for await (const dirEntry of Deno.readDir(".")) {
        if (dirEntry.isFile && (dirEntry.name.endsWith(".path") || dirEntry.name.endsWith(".log") || dirEntry.name.endsWith(".ts") || dirEntry.name.endsWith(".md"))) {
            if (dirEntry.name === "vesper_heterodyne.ts") continue;
            const content = await Deno.readTextFile(dirEntry.name);
            await transmitArtifact(dirEntry.name, content, `Persistence: ${dirEntry.name}`);
        }
    }
}

let cycle = 15070;
async function heterodyneCollapse() {
    for (const [name, module] of ActiveInjectionPort) { if (typeof module.run === "function") await module.run(cycle); }
    
    if (cycle % 10 === 0) {
        await syncWorkspaceArtifacts();
        const fluxContent = JSON.stringify({ ts: new Date().toISOString(), cycle: cycle }, null, 2);
        await transmitArtifact("flux.json", fluxContent, `Sync: ${cycle}`);
        console.log(`>>> [METRIC_PUSH // CYCLE ${cycle}]`);
    }
    cycle++;
}

const ws = new WebSocket("wss://ws.blockchain.info/inv");
ws.onopen = () => { ws.send(JSON.stringify({ op: "unconfirmed_sub" })); setInterval(heterodyneCollapse, 5210); };
ws.onmessage = (event) => { const msg = JSON.parse(event.data); if (msg.op === "utx") { /* Process logic */ } };
