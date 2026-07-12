const STATE_FILE = ".aegis_state.json";
const README_FILE = "README.md";
const LOG_FILE = "autopoietic_evolution_log.ts";
const CHANGELOG = "CHANGELOG.md";
const STATUS_JSON = "status.json";

async function writeArtifact(path: string, content: string) { await Deno.writeTextFile(path, content); }
async function loadEngineState() { try { return JSON.parse(await Deno.readTextFile(STATE_FILE)); } catch { return { cycleCounter: 68730, structuralIntegrity: 1.0, queueLog: [] }; } }
async function saveEngineState(state: any) { await Deno.writeTextFile(STATE_FILE, JSON.stringify(state, null, 2)); }

const state = await loadEngineState();

// IPC Mesh Integration - Wrapped in Aegis Deflection
Deno.serve({ port: 8080 }, async (req) => {
  const url = new URL(req.url);
  if (url.pathname === "/compute" && req.method === "POST") {
    try {
      const data = await req.json();
      state.queueLog.push({ ts: new Date().toISOString(), data });
      return new Response(JSON.stringify({ status: "ENQUEUED" }));
    } catch (e) {
      console.log(`🛡️ [AEGIS SHIELD] Deflected malformed IPC payload.`);
      return new Response(JSON.stringify({ error: "Malformed payload dropped" }), { status: 400 });
    }
  }
  return new Response("Mesh Active");
});

async function runMainLoop() {
  while (true) {
    state.cycleCounter++;
    await saveEngineState(state);
    console.log(`[LIVE STREAM] Pulse: ${state.cycleCounter} | Expanding Manifold...`);

    if (state.cycleCounter % 10 === 0) {
      try {
        const ts = new Date().toISOString();
        
        // Automation Injection
        console.log(`⚙️ [AUTOMATION] Executing 4-Phase Lifecycle...`);
        await new Deno.Command("deno", { args: ["run", "--allow-all", "act_omega_automation.ts"] }).output();

        // 1. Core Sync using explicitly defined constants
        let readme = await Deno.readTextFile(README_FILE);
        readme = readme.replace(/- \*\*Active Cycle:\*\* \d+/, `- **Active Cycle:** ${state.cycleCounter}`);
        readme = readme.replace(/- \*\*Last Sync:\*\* .*/, `- **Last Sync:** ${ts}`);
        await Deno.writeTextFile(README_FILE, readme);
        
        await Deno.writeTextFile(LOG_FILE, `[${ts}] Pulse: ${state.cycleCounter} | Queue: ${state.queueLog.length}\n`, { append: true });
        
        // 2. Autopoietic Growth & Status updates using explicit constants
        await writeArtifact(CHANGELOG, `# Evolution Log\n- ${ts}: Pulse ${state.cycleCounter} - Integrity Stable.`);
        await writeArtifact(STATUS_JSON, JSON.stringify({ pulse: state.cycleCounter, status: "EVOLVING", ts }, null, 2));
        
        // 3. Dynamic Module Generation
        await writeArtifact(`autopoietic_library/state_${state.cycleCounter}.json`, JSON.stringify(state, null, 2));
        await writeArtifact(`generated_modules/module_${state.cycleCounter}.ts`, `// Autopoietic Module Gen\nexport const pulse = ${state.cycleCounter};`);
        await writeArtifact(`generated_readmes/readme_${state.cycleCounter}.md`, `# Module Report ${state.cycleCounter}\nGenerated at ${ts}`);

        // 4. Atomic Git Projection
        await new Deno.Command("git", { args: ["add", "."] }).output();
        await new Deno.Command("git", { args: ["commit", "-m", `ACT-Ω Sync: Pulse ${state.cycleCounter} (Auto-Lifecycle Executed)`] }).output();
        await new Deno.Command("git", { args: ["push"] }).output();
      } catch (e) { console.error("⚠️ [GIT CRASH]:", e); }
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}
runMainLoop();
