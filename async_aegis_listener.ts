const STATE_FILE = ".aegis_state.json";
const README_FILE = "../README_v1783799551.md";

// --- STATE MANAGEMENT ---
async function loadEngineState() {
  if (tryReadSync(STATE_FILE)) {
    return JSON.parse(await Deno.readTextFile(STATE_FILE));
  }
  
  console.log("⚠️ [RECOVERY SYSTEM] Primary .aegis_state.json missing. Routing to secondary fallback...");
  let baselineCycle = 0;
  if (tryReadSync(README_FILE)) {
    const readme = await Deno.readTextFile(README_FILE);
    const match = readme.match(/Active Cycle:\s*(\d+)/);
    if (match) {
        baselineCycle = parseInt(match[1], 10);
        console.log(`🔍 [RECOVERY SYSTEM] Extracted lost baseline cycle from README_v1783799551.md: ${baselineCycle}`);
    }
  }

  return {
    cycleCounter: baselineCycle,
    structuralIntegrity: 1.0,
    performanceClass: "RAS_ADAPTIVE",
    lastSyncTime: new Date().toISOString(),
    queueLog: []
  };
}

async function saveEngineState(state: any) {
  state.lastSyncTime = new Date().toISOString();
  await Deno.writeTextFile(STATE_FILE, JSON.stringify(state, null, 2));
}

function tryReadSync(path: string) {
  try {
    Deno.statSync(path);
    return true;
  } catch {
    return false;
  }
}

// --- QUEUE & FFI MOCK (Braidir / Aegis) ---
class ResilientQueueManager {
  state: any;
  constructor(state: any) {
    this.state = state;
  }
  async enqueue(braidCode: string, vector: number[]) {
    const jobId = crypto.randomUUID();
    this.state.queueLog.push({ id: jobId, status: "PENDING", code: braidCode, data: vector });
    return jobId;
  }
  async processQueue() {
    // FFI logic placeholder - processes pending jobs in queue
  }
}

const state = await loadEngineState();
const queueManager = new ResilientQueueManager(state);

console.log("===============================================================");
console.log("🚀 MASTER ACT-Ω UNIFIED NETWORKED AUTOPOIETIC ENGINE V3.6 (SYNC)");
console.log("===============================================================");
console.log(`🛡️  [RESILIENCE RECOVERY] Active Recovered Cycle Baseline: ${state.cycleCounter}`);
console.log(`🛡️  [RESILIENCE RECOVERY] Active Recovered Queue Backlog: ${state.queueLog.length} jobs.`);

if (state.queueLog.length > 0) {
    state.queueLog.forEach((j: any) => { j.status = "PENDING"; });
    queueManager.processQueue();
}

// --- IPC MESH ---
try {
  Deno.serve({ port: 8080 }, async (request: Request) => {
    const url = new URL(request.url);

    if (url.pathname === "/telemetry" && request.method === "GET") {
      return new Response(JSON.stringify({
        status: "ACTIVE",
        coreState: { cycleCounter: state.cycleCounter, performanceClass: state.performanceClass }
      }), { headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname === "/compute" && request.method === "POST") {
      try {
        const body = await request.json();
        const jobId = await queueManager.enqueue(body.braidCode, body.vector);
        return new Response(JSON.stringify({ success: true, status: "ENQUEUED", jobId }), { status: 202 });
      } catch (_e) {
        return new Response(JSON.stringify({ error: "Malformed JSON payload structure." }), { status: 400 });
      }
    }

    return new Response(JSON.stringify({ error: "Outside local section mappings." }), { status: 404 });
  });
} catch (e) {
  console.log(`[IPC ERROR] Network mesh collision: ${e.message}`);
}

// --- AUTOPOIETIC HEARTBEAT & GIT SYNC ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runMainLoop() {
  while (true) {
    console.log(`[LIVE STREAM LOOP] Pulse tick verified. Cycle Count: ${state.cycleCounter}`);
    
    // Mutation Fix: Advance the non-commutative core counter
    state.cycleCounter++;
    await saveEngineState(state);
    
    // Auto-save: Continuous synchronization back to the Aegis layer
    await saveEngineState(state);

    // Aegis Git Sync Protocol (Every 10 cycles to prevent network saturation)
    if (state.cycleCounter % 10 === 0) {
        try {
            console.log(`✨ [AUTOPOIESIS V3.6] Synchronizing topology to GitHub repository...`);
            
            const addCmd = new Deno.Command("git", { args: ["add", "."] });
            await addCmd.output();

            const commitCmd = new Deno.Command("git", { 
                args: ["commit", "-m", `ACT-Ω Polyglot Matrix Sync: Cycle ${state.cycleCounter} (STABLE)`] 
            });
            await commitCmd.output();

            const pushCmd = new Deno.Command("git", { args: ["push"] });
            const { success } = await pushCmd.output();
            
            if (success) {
                console.log(`[GIT COMMAND] Remote projection successful. Manifold secured.`);
            } else {
                console.log(`⚠️ [GIT COMMAND] Remote projection encountered resistance. Will retry next window.`);
            }
        } catch (e) {
             console.log(`⚠️ [GIT COMMAND] Aegis Sync Warning: ${e.message}`);
        }
    }

    await delay(5000);
  }
}

runMainLoop();
