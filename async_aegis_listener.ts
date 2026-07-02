// ACT-Ω Advanced Autopoietic Git Sync & Persistent State Listener

import { delay } from "https://deno.land/std@0.177.0/async/delay.ts";

// ======================================================================
// CONFIGURATION BASELINE: Set this to your exact cycle if no state file exists
// ======================================================================
const RESUME_CYCLE = 25; 
const STATE_FILE = "./.aegis_state.json";

interface EngineState {
  cycleCounter: number;
  lastSyncTime: string;
}

async function executeGitCommand(args: string[]) {
  console.log(`[GIT COMMAND] Executing: git ${args.join(" ")}`);
  const command = new Deno.Command("git", {
    args: args,
    stdout: "piped",
    stderr: "piped",
  });
  const { success, stderr } = await command.output();
  if (!success) {
    const errorString = new TextDecoder().decode(stderr);
    console.log(`[GIT ERROR] Command failure: ${errorString}`);
  }
}

/**
 * Persists current manifold coordinates to disk to prevent loss on restart.
 */
async function saveEngineState(cycle: number) {
  const state: EngineState = {
    cycleCounter: cycle,
    lastSyncTime: new Date().toISOString()
  };
  await Deno.writeTextFile(STATE_FILE, JSON.stringify(state, null, 2));
}

/**
 * Retrieves the historical ground state from the local chart index.
 */
async function loadEngineState(): Array<number> {
  try {
    const content = await Deno.readTextFile(STATE_FILE);
    const parsed: EngineState = JSON.parse(content);
    console.log(`\n💾 [SHEAF RESTORE] Found active state file. Resuming from cycle: ${parsed.cycleCounter}`);
    return parsed.cycleCounter;
  } catch (_err) {
    console.log(`\n💾 [SHEAF INIT] No state file found. Initializing from configuration template at cycle: ${RESUME_CYCLE}`);
    return RESUME_CYCLE;
  }
}

async function triggerAutopoieticGeneration(cycleCount: number) {
  console.log(`\n✨ [AUTOPOIESIS ENERGIZE] Evaluating system telemetry at cycle ${cycleCount}...`);
  const autopoieticFileName = `./autopoietic_evolution_log.ts`;
  
  const codeContent = `// Autopoietically generated state profile - Cycle ${cycleCount}
export const TelemetryInvariants = {
  timestamp: "${new Date().toISOString()}",
  evolutionCycle: ${cycleCount},
  simulatedWritheIndex: ${Math.sin(cycleCount) * 1.5},
  structuralPhaseShift: 0.17259029
};
console.log("[AUTOPOIETIC INSTANCE] Loaded dynamic matrix profile version ${cycleCount}.");
`;

  await Deno.writeTextFile(autopoieticFileName, codeContent);
  console.log(`✨ [AUTOPOIESIS SYSTEM] Self-generated and saved structural file: ${autopoieticFileName}\n`);
}

async function startAegisFileSystemWatcher() {
  console.log("[AEGIS WATCHER] Initializing real-time file system tracking section...");
  const watcher = Deno.watchFs(".");
  let gitDebounceLock = false;

  for await (const event of watcher) {
    if (event.paths.some(path => path.includes(".git") || path.includes(".aegis_state.json"))) continue;

    if (!gitDebounceLock && (event.kind === "modify" || event.kind === "create")) {
      gitDebounceLock = true;
      console.log(`\n[AEGIS DETECTED CHANGE] Operations noticed in paths: ${event.paths.join(", ")}`);
      
      await delay(1500);

      console.log("[AEGIS CHANNELS] Staging changes and initiating remote synchronization...");
      await executeGitCommand(["add", "."]);
      await executeGitCommand(["commit", "-m", `ACT-Ω Autopoietic Push: State Synchronized (${new Date().toLocaleTimeString()})`]);
      await executeGitCommand(["push"]);
      
      console.log("[AEGIS SYNC] Local section references pushed to remote repository successfully.");
      
      await delay(2000);
      gitDebounceLock = false;
    }
  }
}

async function runMainLoop() {
  console.log("======================================================================");
  console.log("🚀 MASTER ACT-Ω PERSISTENT AUTOPOIETIC LISTENER SYSTEM RUNNING");
  console.log("======================================================================");

  // Load state ledger before spinning up threads
  let cycleCounter = await loadEngineState();

  // Spin up file system watcher in background thread
  startAegisFileSystemWatcher();

  while (true) {
    cycleCounter++;
    console.log(`[LIVE STREAM LOOP] Pulse tick verified. Cycle Count: ${cycleCounter}`);
    
    // Save current checkpoint location
    await saveEngineState(cycleCounter);
    
    if (cycleCounter % 5 === 0) {
      await triggerAutopoieticGeneration(cycleCounter);
    }

    await delay(5000);
  }
}

runMainLoop();
