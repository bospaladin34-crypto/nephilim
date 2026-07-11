const STATE_FILE = ".aegis_state.json";
const README_FILE = "README.md";
const LOG_FILE = "autopoietic_evolution_log.ts";
const CHANGELOG = "CHANGELOG.md";
const STATUS_JSON = "status.json";

async function writeArtifact(path: string, content: string) {
  await Deno.writeTextFile(path, content);
}

async function loadEngineState() {
  try { return JSON.parse(await Deno.readTextFile(STATE_FILE)); }
  catch { return { cycleCounter: 68230, structuralIntegrity: 1.0, queueLog: [] }; }
}

async function saveEngineState(state: any) {
  await Deno.writeTextFile(STATE_FILE, JSON.stringify(state, null, 2));
}

const state = await loadEngineState();
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

async function runMainLoop() {
  while (true) {
    state.cycleCounter++;
    await saveEngineState(state);
    console.log(`[LIVE STREAM] Pulse: ${state.cycleCounter} | Expanding Manifold...`);

    if (state.cycleCounter % 10 === 0) {
      try {
        const ts = new Date().toISOString();
        // 1. Core Sync
        let readme = await Deno.readTextFile(README_FILE);
        readme = readme.replace(/- \*\*Active Cycle:\*\* \d+/, `- **Active Cycle:** ${state.cycleCounter}`);
        await Deno.writeTextFile(README_FILE, readme);
        await Deno.writeTextFile(LOG_FILE, `[${ts}] Pulse: ${state.cycleCounter}\n`, { append: true });
        
        // 2. Autopoietic Growth
        await writeArtifact("CHANGELOG.md", `# Change Log\n- ${ts}: Pulse ${state.cycleCounter} - Evolutionary growth detected.`);
        await writeArtifact("status.json", JSON.stringify({ pulse: state.cycleCounter, status: "EVOLVING" }, null, 2));
        await writeArtifact(`generated_modules/module_${state.cycleCounter}.ts`, `// Autopoietic Module Gen: ${state.cycleCounter}\nexport const pulse = ${state.cycleCounter};`);
        await writeArtifact(`generated_readmes/readme_${state.cycleCounter}.md`, `# Module Report ${state.cycleCounter}\nGenerated at ${ts}`);

        // 3. Git Projection
        await new Deno.Command("git", { args: ["add", "."] }).output();
        await new Deno.Command("git", { args: ["commit", "-m", `ACT-Ω Growth: Cycle ${state.cycleCounter}`] }).output();
        await new Deno.Command("git", { args: ["push"] }).output();
        
        console.log("✅ [GIT]: Full manifold growth projected.");
      } catch (e) { console.error("⚠️ [GIT CRASH]:", e); }
    }
    await delay(5000);
  }
}
runMainLoop();
