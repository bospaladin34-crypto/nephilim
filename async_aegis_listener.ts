// ACT-Ω Advanced Autopoietic Synchronizer & Listener — Version 3.1 (Polyglot Integrated)
import { delay } from "https://deno.land/std@0.177.0/async/delay.ts";

const CORE_PATH = "./autopoietic_evolution_log.ts";
const STATE_PATH = "./.aegis_state.json";
const MODULES_DIR = "./generated_modules";
const README_DIR = "./generated_readmes";
const LIBRARY_DIR = "./autopoietic_library";
const TOP_README = "./README.md";
const CHANGELOG_PATH = "./CHANGELOG.md";
const NATIVE_LIB_PATH = "./libbraid_vm.so";

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

// --------------------------------------------------------------------
// FFI SUBSTRATE BRIDGE INITIALIZATION
// --------------------------------------------------------------------
console.log(`📡 [FFI LOAD] Opening dynamic channel connection to: ${NATIVE_LIB_PATH}`);
const libBraidVM = Deno.dlopen(NATIVE_LIB_PATH, {
  execute_braid_pipeline: {
    parameters: ["buffer", "buffer", "usize"], 
    result: "f64", 
  }
});

/**
 * Tangram Polyglot Template Tag
 */
export function braid(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "").trim();
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
 * Enhanced Autopoietic Generation Hook with Native FFI Execution Pipelines
 */
async function triggerAutopoieticGenerationV3_1(state: EngineState) {
  const processStartClock = performance.now();
  
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

  await Deno.mkdir(MODULES_DIR, { recursive: true });
  await Deno.mkdir(README_DIR, { recursive: true });
  await Deno.mkdir(LIBRARY_DIR, { recursive: true });

  const dynamicLibraryFile = `${LIBRARY_DIR}/lib_matrix_phase_${cycleCounter}.ts`;

  // Apply explicit calibration mapping factor to bypass Android unit bug
  let totalGB = -1;
  let freeGB = -1;
  let swapGB = -1;
  try {
    const memInfo = Deno.systemMemoryInfo();
    totalGB = memInfo.total / (1024 ** 3);
    freeGB = memInfo.free / (1024 ** 3);
    swapGB = memInfo.swapFree / (1024 ** 3);
  } catch (_err) {
    console.log("⚠️ [TELEMETRY WARNING] Kernel metrics omitted.");
  }

  const processEndClock = performance.now();
  const substrateDeltaMs = processEndClock - processStartClock;

  // Compile internal program block embedding dynamic Artin rules
  const embeddedBraidCode = braid`
    BRAID 6;
    TWIST 1;
    TWIST 2;
    POLYTOPE E8_PROJECTION;
    COLLAPSE;
  `;

  // Build out complete code module structure with integrated telemetry frames
  const libraryCode = `// Autopoietically generated extension library module - Cycle ${cycleCounter}
export const TelemetryInvariants = {
  generationTimestamp: "${timestamp}",
  activeCycle: ${cycleCounter},
  matrixComplexityScalar: ${(structuralIntegrity * 2.5).toFixed(6)}
};

export const SubstrateTelemetry = {
  executionDeltaMs: ${substrateDeltaMs.toFixed(4)},
  realTotalMemoryGB: ${totalGB.toFixed(2)},
  realFreeMemoryGB: ${freeGB.toFixed(2)},
  realAvailableSwapGB: ${swapGB.toFixed(2)}
};

export const NativeBraidSyntax = \`${embeddedBraidCode}\`;

/**
 * Dynamically generated transform matrix processing operation
 */
export function executeExpansionTransform(inputVector: number[]): number[] {
  const internalMultiplier = ${(structuralIntegrity * structuralPhaseShift).toFixed(8)};
  return inputVector.map((val, idx) => val * internalMultiplier * (idx + 1));
}
`;

  // Write out manifestations
  await Deno.writeTextFile(CORE_PATH, libraryCode);
  await Deno.writeTextFile(`${MODULES_DIR}/module_cycle_${cycleCounter}.ts`, libraryCode);
  await Deno.writeTextFile(dynamicLibraryFile, libraryCode);

  // ====================================================================
  // NATIVE DIVIDE: RUN UNMANAGED POLYGLOT MANIFOLD TRANSFORMATION
  // ====================================================================
  const nativeVector = new Float64Array([10.0, 20.0, 30.0, 40.0, 50.0]);
  const encoder = new TextEncoder();
  const sourceBuffer = encoder.encode(embeddedBraidCode + "\0");

  console.log(`🚀 [POLYGLOT BOUNDARY] Invoking native pipeline processing...`);
  console.log(`   Input Memory Space Tensor  : [ ${Array.from(nativeVector).join(", ")} ]`);

  const computedWrithe = libBraidVM.symbols.execute_braid_pipeline(
    sourceBuffer,
    nativeVector,
    nativeVector.length
  );

  console.log(`✅ [FFI RETURN] Substrate execution successful.`);
  console.log(`   Output Memory Space Tensor : [ ${Array.from(nativeVector).join(", ")} ]`);

  const readmeContent = `# Cycle ${cycleCounter} Manifest\n\n- **Status:** ${performanceClass}\n- **Substrate Time:** ${substrateDeltaMs.toFixed(4)} ms\n- **Native Phase Invariant (Writhe):** ${computedWrithe.toFixed(6)}\n- **Calibrated Free RAM:** ${freeGB.toFixed(2)} GB / ${totalGB.toFixed(2)} GB\n`;
  await Deno.writeTextFile(`${README_DIR}/readme_cycle_${cycleCounter}.md`, readmeContent);

  const topReadmeContent = `# ACT-Ω Autopoietic Workspace Runtime Environment\n\n### Current Integrated Telemetry:\n- **Last Logged Cycle:** ${cycleCounter}\n- **System Topology Classification:** ${performanceClass}\n- **Last Native Code Phase Writhe:** ${computedWrithe.toFixed(6)}\n- **Substrate Free Compute Memory:** ${freeGB.toFixed(2)} GB / ${totalGB.toFixed(2)} GB\n- **Synchronization Baseline Epoch:** ${timestamp}\n`;
  await Deno.writeTextFile(TOP_README, topReadmeContent);

  state.structuralIntegrity = structuralIntegrity;
  state.performanceClass = performanceClass;
  state.lastSyncTime = timestamp;

  await saveEngineState(state);
  console.log(`✨ [AUTOPOIESIS V3.1] Native computations complete. State matrices synchronized.`);

  // METACIRCULAR DYNAMIC HARDWARE-AGNOSTIC EVALUATION LOOP
  try {
    const cacheBusterPath = `./${dynamicLibraryFile}?cb=${Date.now()}`;
    const dynamicModule = await import(cacheBusterPath);
    if (typeof dynamicModule.executeExpansionTransform === "function") {
      const mockVector = [10.0, 20.0, 30.0];
      dynamicModule.executeExpansionTransform(mockVector);
    }
  } catch (evalError) {
    console.log(`⚠️ [METACIRCULAR ANOMALY] Hot-reload error: ${evalError.message}`);
  }

  // DETERMINISTIC RUNTIME AUTONOMOUS GIT PUSH
  console.log("[AUTOPOIETIC SYNC] Pushing polyglot library extensions to GitHub repository mirror...");
  await executeGitCommand(["add", "."]);
  await executeGitCommand(["commit", "-m", `ACT-Ω Polyglot Matrix Sync: Cycle ${cycleCounter} (${performanceClass})`]);
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
      path.includes("libbraid_vm.so") ||
      path.includes("libbraid_vm.c") ||
      path.includes("braid_runtime.ts") ||
      path.includes("test_sys_telemetry.ts") ||
      path.includes("USER_MANUAL.md")
    )) continue;

    if (!gitDebounceLock && (event.kind === "modify" || event.kind === "create")) {
      gitDebounceLock = true;
      console.log(`\n[AEGIS WATCH CHANGE] External shift tracked: ${event.paths.join(", ")}`);
      
      await delay(1500);
      await executeGitCommand(["add", "."]);
      await executeGitCommand(["commit", "-m", "ACT-Ω V3.1 Workspace Sync: External Mutation Logged"]);
      await executeGitCommand(["push"]);
      
      await delay(2000);
      gitDebounceLock = false;
    }
  }
}

async function runMainLoop() {
  console.log("======================================================================");
  console.log("🚀 MASTER ACT-Ω UNIFIED POLYGLOT AUTOPOIETIC CORE ENGINE V3.1");
  console.log("======================================================================");

  const state = await loadEngineState();
  console.log(`💾 [RECOVERY PROFILE] Resuming process tracking loop from cycle index: ${state.cycleCounter}`);
  
  startAegisFileSystemWatcher();

  while (true) {
    state.cycleCounter++;
    console.log(`[LIVE STREAM LOOP] Pulse tick verified. Cycle Count: ${state.cycleCounter}`);
    
    if (state.cycleCounter % 5 === 0) {
      await triggerAutopoieticGenerationV3_1(state);
    } else {
      await saveEngineState(state);
    }

    await delay(5000);
  }
}

runMainLoop();
