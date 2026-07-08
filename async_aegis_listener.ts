// ACT-Ω Advanced Autopoietic Synchronizer & Listener — Version 3.2 (IPC Gateway Mesh)
import { delay } from "https://deno.land/std@0.177.0/async/delay.ts";

const CORE_PATH = "./autopoietic_evolution_log.ts";
const STATE_PATH = "./.aegis_state.json";
const MODULES_DIR = "./generated_modules";
const README_DIR = "./generated_readmes";
const LIBRARY_DIR = "./autopoietic_library";
const TOP_README = "./README.md";
const CHANGELOG_PATH = "./CHANGELOG.md";
const NATIVE_LIB_PATH = "./libbraid_vm.so";

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
// NATIVE SUBSTRATE BRIDGE INITIALIZATION
// --------------------------------------------------------------------
console.log(`📡 [FFI LOAD] Opening dynamic channel connection to: ${NATIVE_LIB_PATH}`);
const libBraidVM = Deno.dlopen(NATIVE_LIB_PATH, {
  execute_braid_pipeline: {
    parameters: ["buffer", "buffer", "usize"], 
    result: "f64", 
  }
});

// Mutex lock to prevent simultaneous native execution overlaps
let ffiMutexLocked = false;

function safeNativeCompute(braidSource: string, inputVector: Float64Array): number {
  while (ffiMutexLocked) { /* Spin-lock or wait */ }
  ffiMutexLocked = true;
  try {
    const encoder = new TextEncoder();
    const sourceBuffer = encoder.encode(braidSource + "\0");
    return libBraidVM.symbols.execute_braid_pipeline(sourceBuffer, inputVector, inputVector.length);
  } finally {
    ffiMutexLocked = false;
  }
}

async function executeGitCommand(args: string[]) {
  const command = new Deno.Command("git", { args, stdout: "piped", stderr: "piped" });
  const { success } = await command.output();
  return success;
}

async function saveEngineState(state: EngineState) {
  await Deno.writeTextFile(STATE_PATH, JSON.stringify(state, null, 2));
}

async function loadEngineState(): Promise<EngineState> {
  try {
    const content = await Deno.readTextFile(STATE_PATH);
    return JSON.parse(content);
  } catch (_err) {
    return { cycleCounter: 0, structuralIntegrity: 1.0, performanceClass: "INIT", lastSyncTime: new Date().toISOString() };
  }
}

// --------------------------------------------------------------------
// AEGIS CHANNELS: EXTERNAL IPC ENDPOINT GATEWAY
// --------------------------------------------------------------------
function startIPCGateway(state: EngineState) {
  console.log("🌐 [IPC GATEWAY] Deploying external connectivity mesh on port 8080...");
  
  Deno.serve({ port: 8080 }, async (request: Request) => {
    const url = new URL(request.url);

    // Endpoint 1: Telemetry Probe (Read Current Core Metrics)
    if (url.pathname === "/telemetry" && request.method === "GET") {
      let memInfo = {};
      try { memInfo = Deno.systemMemoryInfo(); } catch (_) {}
      return new Response(JSON.stringify({ status: "ACTIVE", coreState: state, hardwareMetrics: memInfo }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Endpoint 2: Native Computation Offload (Expose FFI Matrix to Foreign Code)
    if (url.pathname === "/compute" && request.method === "POST") {
      try {
        const body = await request.json();
        const { braidCode, vector } = body; // Expects a string and an array of numbers

        if (!braidCode || !Array.isArray(vector)) {
          return new Response(JSON.stringify({ error: "Malformed payload matrix." }), { status: 400 });
        }

        const nativeVector = new Float64Array(vector);
        const writheResult = safeNativeCompute(braidCode, nativeVector);

        return new Response(JSON.stringify({
          success: true,
          phaseWrithe: writheResult,
          transformedVector: Array.from(nativeVector)
        }), { headers: { "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ error: "Endpoint outside local section mappings." }), { status: 404 });
  });
}

// --------------------------------------------------------------------
// PRIMARY AUTOPOIETIC SYNC CYCLE
// --------------------------------------------------------------------
async function triggerAutopoieticGenerationV3_2(state: EngineState) {
  const processStartClock = performance.now();
  const cycleCounter = state.cycleCounter;
  const structuralIntegrity = Math.abs(Math.cos(cycleCounter * 0.0174533));
  const performanceClass = classify(structuralIntegrity);
  const timestamp = new Date().toISOString();

  await Deno.mkdir(MODULES_DIR, { recursive: true });
  await Deno.mkdir(README_DIR, { recursive: true });
  await Deno.mkdir(LIBRARY_DIR, { recursive: true });

  let totalGB = -1, freeGB = -1;
  try {
    const memInfo = Deno.systemMemoryInfo();
    totalGB = memInfo.total / (1024 ** 3);
    freeGB = memInfo.free / (1024 ** 3);
  } catch (_err) {}

  const dynamicBraidCode = `BRAID 6; TWIST 1; TWIST 2; COLLAPSE;`;
  const internalVector = new Float64Array([10.0, 20.0, 30.0, 40.0, 50.0]);
  
  // Execute internal pipeline check via shared substrate function
  const computedWrithe = safeNativeCompute(dynamicBraidCode, internalVector);
  const substrateDeltaMs = performance.now() - processStartClock;

  const libraryCode = `// Autopoietically generated extension library module - Cycle ${cycleCounter}
export const TelemetryInvariants = { generationTimestamp: "${timestamp}", activeCycle: ${cycleCounter} };
export const NativeBraidSyntax = \`${dynamicBraidCode}\`;
`;

  await Deno.writeTextFile(CORE_PATH, libraryCode);
  await Deno.writeTextFile(`${MODULES_DIR}/module_cycle_${cycleCounter}.ts`, libraryCode);
  await Deno.writeTextFile(`${LIBRARY_DIR}/lib_matrix_phase_${cycleCounter}.ts`, libraryCode);

  const readmeContent = `# Cycle ${cycleCounter} Manifest\n- **Native Phase Invariant:** ${computedWrithe.toFixed(6)}\n- **Free RAM:** ${freeGB.toFixed(2)} GB / ${totalGB.toFixed(2)} GB\n`;
  await Deno.writeTextFile(`${README_DIR}/readme_cycle_${cycleCounter}.md`, readmeContent);

  const topReadmeContent = `# ACT-Ω Networked Mesh Runtime Environment\n\n- **Active Cycle:** ${cycleCounter}\n- **IPC Listener Matrix:** http://localhost:8080/compute\n- **System Status:** ${performanceClass}\n`;
  await Deno.writeTextFile(TOP_README, topReadmeContent);

  state.structuralIntegrity = structuralIntegrity;
  state.performanceClass = performanceClass;
  state.lastSyncTime = timestamp;

  await saveEngineState(state);
  console.log(`✨ [AUTOPOIESIS V3.2] Loop Sync Complete. Native Vector Out: [ ${Array.from(internalVector).join(", ")} ]`);

  await executeGitCommand(["add", "."]);
  await executeGitCommand(["commit", "-m", `ACT-Ω Polyglot Gateway Sync: Cycle ${cycleCounter} (${performanceClass})`]);
  await executeGitCommand(["push"]);
}

async function runMainLoop() {
  console.log("======================================================================");
  console.log("🚀 MASTER ACT-Ω UNIFIED NETWORKED AUTOPOIETIC ENGINE V3.2");
  console.log("======================================================================");

  const state = await loadEngineState();
  
  // Fire the IPC endpoint gateway server into parallel background context
  startIPCGateway(state);

  while (true) {
    state.cycleCounter++;
    console.log(`[LIVE STREAM LOOP] Pulse tick verified. Cycle Count: ${state.cycleCounter}`);
    
    if (state.cycleCounter % 5 === 0) {
      await triggerAutopoieticGenerationV3_2(state);
    } else {
      await saveEngineState(state);
    }

    await delay(5000);
  }
}

runMainLoop();
