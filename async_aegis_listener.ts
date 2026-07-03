// ACT-Ω Advanced Autopoietic Synchronizer & Listener — Version 2.4 (Metacircular Expansion)
import { delay } from "https://deno.land/std@0.177.0/async/delay.ts";

const CORE_PATH = "./autopoietic_evolution_log.ts";
const STATE_PATH = "./.aegis_state.json";
const MODULES_DIR = "./generated_modules";
const README_DIR = "./generated_readmes";
const LIBRARY_DIR = "./autopoietic_library";
const TOP_README = "./README.md";
const CHANGELOG_PATH = "./CHANGELOG.md";

const RESUME_CYCLE = 0;

interface EngineState {
  cycleCounter: number;
  structuralIntegrity: number;
  performanceClass: string;
  lastSyncTime: string;
}

function classify(integrity: number): string {
  if (integrity >= 0.8) return "OPTIMAL_FLOW";
  if (integrity >= 0.5) return "STABLE";
  return "RAS_ADAPTIVE";
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

async function saveEngineState(state: EngineState) {
  await Deno.writeTextFile(STATE_PATH, JSON.stringify(state, null, 2));
}

async function loadEngineState(): Promise<EngineState> {
  try {
    const content = await Deno.readTextFile(STATE_PATH);
    const parsed = JSON.parse(content);
    return {
      cycleCounter: parsed.cycleCounter ?? RESUME_CYCLE,
      structuralIntegrity: parsed.structuralIntegrity ?? 1.0,
      performanceClass: parsed.performanceClass ?? "INIT",
      lastSyncTime: parsed.lastSyncTime ?? new Date().toISOString()
    };
  } catch (_err) {
    return {
      cycleCounter: RESUME_CYCLE,
      structuralIntegrity: 1.0,
      performanceClass: "INIT",
      lastSyncTime: new Date().toISOString()
    };
  }
}

async function appendChangelog(timestamp: string, cycle: number, prevClass: string, prevInt: number, currClass: string, currInt: number) {
  const header = "# Vesper ACT-Ω Changelog\n\nAll mode transitions are recorded autopoietically.\n\n";
  const exists = await Deno.stat(CHANGELOG_PATH).then(() => true).catch(() => false);
  if (!exists) {
    await Deno.writeTextFile(CHANGELOG_PATH, header);
  }
  const line = `- ${timestamp} — **Cycle ${cycle}**: ${prevClass} → ${currClass} (integrity ${prevInt.toFixed(6)} → ${currInt.toFixed(6)})\n`;
  await Deno.writeTextFile(CHANGELOG_PATH, line, { append: true });
}

/**
 * Robust Autopoietic Generation Hook with Metacircular Dynamic Evaluation Loop
 */
async function triggerAutopoieticGenerationV2(state: EngineState) {
  const prevClass = state.performanceClass;
  const prevIntegrity = state.structuralIntegrity;
  
  const cycleCounter = state.cycleCounter;
  const structuralPhaseShift = 0.17259029;
  const structuralIntegrity = Math.abs(Math.cos(cycleCounter * 0.0174533));
  const performanceClass = classify(structuralIntegrity);
  const timestamp = new Date().toISOString();
  
  const modeSwitched = prevClass !== performanceClass;

  if (modeSwitched) {
    console.log(`\n🔄 [MODE SWITCH] ${prevClass} → ${performanceClass} at cycle ${cycleCounter}`);
    await appendChangelog(timestamp, cycleCounter, prevClass, prevIntegrity, performanceClass, structuralIntegrity);
  }

  // Synchronize target directories
  await Deno.mkdir(MODULES_DIR, { recursive: true });
  await Deno.mkdir(README_DIR, { recursive: true });
  await Deno.mkdir(LIBRARY_DIR, { recursive: true });

  // Generate unique library expansion path name
  const dynamicLibraryFile = `${LIBRARY_DIR}/lib_matrix_phase_${cycleCounter}.ts`;

  // Autopoietically draft the new library module codebase expansion
  const libraryCode = `// Autopoietically generated extension library module - Cycle ${cycleCounter}
export const LibraryMetadata = {
  generationTimestamp: "${timestamp}",
  activeCycle: ${cycleCounter},
  matrixComplexityScalar: ${(structuralIntegrity * 2.5).toFixed(6)}
};

/**
 * Dynamically generated transform matrix processing operation
 */
export function executeExpansionTransform(inputVector: number[]): number[] {
  const internalMultiplier = ${(structuralIntegrity * structuralPhaseShift).toFixed(8)};
  return inputVector.map((val, idx) => val * internalMultiplier * (idx + 1));
}
`;

  // Write files to workspace architecture
  await Deno.writeTextFile(CORE_PATH, libraryCode);
  await Deno.writeTextFile(`${MODULES_DIR}/module_cycle_${cycleCounter}.ts`, libraryCode);
  await Deno.writeTextFile(dynamicLibraryFile, libraryCode);

  const readmeContent = `# Cycle ${cycleCounter} Manifest\n\n- **Status:** ${performanceClass}\n- **Integrity Matrix:** ${structuralIntegrity.toFixed(6)}\n- **Timestamp:** ${timestamp}\n`;
  await Deno.writeTextFile(`${README_DIR}/readme_cycle_${cycleCounter}.md`, readmeContent);

  const topReadmeContent = `# ACT-Ω Autopoietic Workspace Runtime Environment\n\nActive monitoring state matrix running continuously.\n\n### Current System Telemetry:\n- **Last Logged Cycle:** ${cycleCounter}\n- **System Topology Classification:** ${performanceClass}\n- **Manifold Structural Density:** ${structuralIntegrity.toFixed(6)}\n- **Synchronization Baseline Epoch:** ${timestamp}\n`;
  await Deno.writeTextFile(TOP_README, topReadmeContent);

  // Update memory references
  state.structuralIntegrity = structuralIntegrity;
  state.performanceClass = performanceClass;
  state.lastSyncTime = timestamp;

  await saveEngineState(state);
  console.log(`✨ [AUTOPOIESIS V2.4] Codebase files written successfully.`);

  // ====================================================================
  // PATHWAY A: METACIRCULAR DYNAMIC HARDWARE-AGNOSTIC EVALUATION LOOP
  // ====================================================================
  try {
    const cacheBusterPath = `./${dynamicLibraryFile}?cb=${Date.now()}`;
    console.log(`📡 [METACIRCULAR HOT-RELOAD] Importing dynamic module extension: ${dynamicLibraryFile}`);
    
    const dynamicModule = await import(cacheBusterPath);
    
    if (typeof dynamicModule.executeExpansionTransform === "function") {
      const mockVector = [10.0, 20.0, 30.0];
      const transformationResult = dynamicModule.executeExpansionTransform(mockVector);
      console.log(`✅ [EVALUATION SUCCESS] Dynamic module executed flawlessly.`);
      console.log(`📊 Vector Projection Result: [ ${transformationResult.map((v: number) => v.toFixed(5)).join(", ")} ]`);
    } else {
      throw new Error("Target expansion signature function was not detected in compilation output.");
    }
  } catch (evalError) {
    console.log(`⚠️ [METACIRCULAR ANOMALY] Code runtime validation error: ${evalError.message}`);
  }

  // DETERMINISTIC RUNTIME AUTONOMOUS GIT PUSH
  console.log("[AUTOPOIETIC SYNC] Pushing dynamic library extensions to GitHub repository mirror...");
  await executeGitCommand(["add", "."]);
  await executeGitCommand(["commit", "-m", `ACT-Ω Codebase Expansion: Cycle ${cycleCounter} (${performanceClass})`]);
  await executeGitCommand(["push"]);
}

async function startAegisFileSystemWatcher() {
  console.log("[AEGIS WATCHER] Operational channels deployed to monitor open sets.");
  const watcher = Deno.watchFs(".");
  let gitDebounceLock = false;

  for await (const event of watcher) {
    if (event.paths.some(path => 
      path.includes(".git") || 
      path.includes(".aegis_state.json") || 
      path.includes("CHANGELOG.md") || 
      path.includes("README.md") || 
      path.includes("autopoietic_evolution_log.ts") || 
      path.includes("generated_modules") || 
      path.includes("generated_readmes") ||
      path.includes("autopoietic_library") ||
      path.includes("USER_MANUAL.md")
    )) continue;

    if (!gitDebounceLock && (event.kind === "modify" || event.kind === "create")) {
      gitDebounceLock = true;
      console.log(`\n[AEGIS WATCH CHANGE] External shift tracked: ${event.paths.join(", ")}`);
      
      await delay(1500);
      await executeGitCommand(["add", "."]);
      await executeGitCommand(["commit", "-m", "ACT-Ω V2.4 Workspace Sync: External Mutation Logged"]);
      await executeGitCommand(["push"]);
      
      await delay(2000);
      gitDebounceLock = false;
    }
  }
}

async function runMainLoop() {
  console.log("======================================================================");
  console.log("🚀 MASTER ACT-Ω METACIRCULAR AUTOPOIETIC CODEBASE SYSTEM V2.4");
  console.log("======================================================================");

  const state = await loadEngineState();
  console.log(`💾 [RECOVERY PROFILE] Read completed. Resuming process tracking loop from cycle index: ${state.cycleCounter}`);
  
  startAegisFileSystemWatcher();

  while (true) {
    state.cycleCounter++;
    console.log(`[LIVE STREAM LOOP] Pulse tick verified. Cycle Count: ${state.cycleCounter}`);
    
    if (state.cycleCounter % 5 === 0) {
      await triggerAutopoieticGenerationV2(state);
    } else {
      await saveEngineState(state);
    }

    await delay(5000);
  }
}

runMainLoop();
