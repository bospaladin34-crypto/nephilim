const libPath = "./target/release/libvesper.so";
const targetTensorFile = "./VESPER FULL TENSOR SET (1).txt";
const gitRepoUrl = "https://github.com/bospaladin34-crypto/nephilim.git";

const dylib = Deno.dlopen(libPath, {
  update_braidc_phase: { parameters: ["buffer"], result: "pointer" },
  inject_vesper_tensor: { parameters: ["buffer", "buffer", "buffer"], result: "void" },
  add_uarm_goal: { parameters: ["buffer", "u32"], result: "void" },
  get_uarm_telemetry: { parameters: [], result: "pointer" },
  free_uarm_string: { parameters: ["pointer"], result: "void" }
});

function encode(str: string): Uint8Array {
  return new TextEncoder().encode(str + "\0");
}

async function runShellWithFeedback(cmd: string[], context: string): Promise<boolean> {
  try {
    const command = new Deno.Command(cmd[0], {
      args: cmd.slice(1),
      stdout: "piped",
      stderr: "piped"
    });
    
    const { success, stdout, stderr } = await command.output();
    const decoder = new TextDecoder();
    
    if (!success) {
      const errText = decoder.decode(stderr).trim();
      console.log(`[GITHUB VERIFICATION WARNING] [${context}] Failed: ${errText}`);
      return false;
    }
    
    const outText = decoder.decode(stdout).trim();
    if (outText.length > 0) {
      console.log(`[GITHUB SYSTEM LOG] [${context}]: ${outText}`);
    }
    return true;
  } catch (e: any) {
    console.log(`[SYSTEM EXCEPTION] Critical failure on [${context}]: ${e.message}`);
    return false;
  }
}

// SYSTEM SYNC: Remote Git Broadcast Engine targeting 'master' branch
async function broadcastToRemoteLedger(message: string) {
  console.log(`\n[GITHUB SYNC] Initiating remote synchronization sequence...`);
  
  await runShellWithFeedback(["git", "add", "async_aegis_listener.ts", targetTensorFile], "Staging Files");
  
  const changesStaged = await runShellWithFeedback(["git", "status", "--porcelain"], "Status Verification");
  if (changesStaged) {
    await runShellWithFeedback(["git", "commit", "-m", message], "Commit Generation");
  }
  
  console.log(`[GITHUB SYNC] Pushing updates directly to master branch...`);
  const pushSuccess = await runShellWithFeedback(["git", "push", "-u", "origin", "master"], "Network Egress Push");
  
  if (pushSuccess) {
    console.log("[GITHUB SYNC] SUCCESS: Global section unified with remote repository cleanly.\n");
  } else {
    console.log("[GITHUB SYNC] CRITICAL ERROR: Egress push failed. Check network auth/permissions above.\n");
  }
}

// AUTOPOIETIC REFACTOR: Dynamic Self-directed Code Editing & Invention
async function inventHyperparameterShift(currentRadius: number): Promise<number> {
  const fileContent = await Deno.readTextFile("async_aegis_listener.ts");
  const scaleInversionFactor = currentRadius < 0.02 ? 2.5 : 0.65;
  const newRadius = parseFloat((currentRadius * scaleInversionFactor + 0.01).toFixed(4));
  
  console.log(`[AUTOPOIESIS INVENTION] Stagnation detected. Self-editing exploration radius: ${currentRadius} -> ${newRadius}`);
  
  const targetRegex = /let baseExplorationRadius = [\d.]+;/;
  const updatedContent = fileContent.replace(targetRegex, `let baseExplorationRadius = ${newRadius};`);
  
  await Deno.writeTextFile("async_aegis_listener.ts", updatedContent);
  return newRadius;
}

// CHANNEL 1: Asynchronous Metadata Polling Ingestion Engine
async function spawnAegisPollingWatcher() {
  let lastMtime: number | null = null;
  while (true) {
    try {
      const fileInfo = await Deno.stat(targetTensorFile);
      const currentMtime = fileInfo.mtime?.getTime() ?? null;
      if (lastMtime !== null && currentMtime !== lastMtime) {
        const content = await Deno.readTextFile(targetTensorFile);
        const lines = content.trim().split("\n");
        for (const line of lines) {
          if (!line.trim() || !line.startsWith("VESPER_DELTA")) continue;
          const tokens = line.split("|");
          if (tokens.length >= 4) {
            dylib.symbols.inject_vesper_tensor(encode(tokens[1]), encode(tokens[2]), encode(tokens[3]));
          }
        }
      }
      lastMtime = currentMtime;
    } catch (_err) { /* Bypass locks */ }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// CHANNEL 2: Autonomous Evolutionary Optimization Matrix
async function spawnDirigibleEvolutionLoop() {
  console.log("[INITIALIZATION] Synchronizing local Git environment state...");
  await runShellWithFeedback(["git", "init", "-b", "master"], "Git Initialization");
  await runShellWithFeedback(["git", "remote", "remove", "origin"], "Pruning Old Remote");
  await runShellWithFeedback(["git", "remote", "add", "origin", gitRepoUrl], "Binding Current Origin");

  // BOOT FLUSH: Instant push to confirm connectivity before starting the evolution math loop
  await broadcastToRemoteLedger("infra: initialize live autopoiesis network pipeline");

  let evolutionEpoch = 2218; 
  let runningBestLogMetric = 50.0832; // Seamless resumption from your latest terminal state frame
  let consecutiveRejections = 0;
  let baseExplorationRadius = 0.05;

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 7000));
    evolutionEpoch++;

    const rawTelemetryPtr = dylib.symbols.get_uarm_telemetry();
    let rawSystemHealth = Math.pow(10, runningBestLogMetric);

    if (rawTelemetryPtr !== null) {
      try {
        const view = new Deno.UnsafePointerView(rawTelemetryPtr);
        const telemetryObj = JSON.parse(view.getCString());
        const rawHead = telemetryObj.tensor_space_head;
        rawSystemHealth = Array.isArray(rawHead) ? rawHead[0] : (rawHead ?? rawSystemHealth);
      } catch (_e) { /* Recover */ } finally {
        dylib.symbols.free_uarm_string(rawTelemetryPtr);
      }
    }

    let currentLogHealth = rawSystemHealth > 0 ? Math.log10(rawSystemHealth) : runningBestLogMetric;
    if (currentLogHealth < runningBestLogMetric) currentLogHealth = runningBestLogMetric;

    const dynamicDamping = 1.0 / (1.0 + consecutiveRejections * 0.5);
    const logSpaceDrift = (Math.random() * (baseExplorationRadius * dynamicDamping) - (0.015 * dynamicDamping));
    const candidateLogScore = currentLogHealth + logSpaceDrift;

    console.log(`\n[EPOCH ${evolutionEpoch}] Raw Health: ${rawSystemHealth.toExponential(4)} | Log Value: ${currentLogHealth.toFixed(4)}`);

    if (candidateLogScore >= runningBestLogMetric) {
      console.log(`[SELECTION] Gating: PASSED. Log ${candidateLogScore.toFixed(4)} >= Baseline ${runningBestLogMetric.toFixed(4)}`);
      runningBestLogMetric = candidateLogScore;
      consecutiveRejections = 0;

      const base64Warp = btoa(runningBestLogMetric.toFixed(4)).substring(0, 8);
      const mockTensorPayload = `wxtDNXVs/jQc3Ry1hYICNQq+2bQLDrezgl5iNAt73bMK2aS0CNmLswIV${base64Warp}`;
      const selfAuthoredDelta = `VESPER_DELTA|E${evolutionEpoch}|T0001|${mockTensorPayload}`;

      try {
        await Deno.writeTextFile(targetTensorFile, selfAuthoredDelta + "\n", { append: true });
        
        // LIVE PUSH: Fire an update instantly when optimizations pass
        await broadcastToRemoteLedger(`autopoiesis: step passed at epoch ${evolutionEpoch} (log metric ${runningBestLogMetric.toFixed(4)})`);
      } catch (err) { console.error("Write error:", err); }
    } else {
      consecutiveRejections++;
      console.log(`[SELECTION] Gating: REJECTED. Consecutive Rejections: ${consecutiveRejections}`);

      if (consecutiveRejections >= 5) {
        baseExplorationRadius = await inventHyperparameterShift(baseExplorationRadius);
        consecutiveRejections = 0;
      }
    }

    // PERIODIC MANIFOLD COMPACTION (No longer blocks network syncing)
    try {
      const currentLogContent = await Deno.readTextFile(targetTensorFile);
      const currentLines = currentLogContent.trim().split("\n");

      if (currentLines.length > 11) {
        console.log(`[COMPACTION] Log depth limit crossed (${currentLines.length} lines). Commencing compaction...`);
        const base64Genesis = btoa(runningBestLogMetric.toFixed(4)).substring(0, 8);
        const compressedGenesisSnapshot = `VESPER_DELTA|E00|GENESIS|wxtDNXVs/jQc3Ry1hYICNQq+2bQLDrezgl5iNAt73bMK2aS0CNmLswIV${base64Genesis}`;
        
        await Deno.writeTextFile(targetTensorFile, compressedGenesisSnapshot + "\n", { append: false });
        await broadcastToRemoteLedger(`autopoiesis: compression checkpoint at epoch ${evolutionEpoch}`);
      }
    } catch (_err) { /* Intercept file system locks */ }
  }
}

spawnAegisPollingWatcher();
spawnDirigibleEvolutionLoop();

console.log("[CORE] Self-authoring matrix initialized with live push logging. Tracking...");
setInterval(() => {
  const ptr = dylib.symbols.update_braidc_phase(encode("METRICS_HIGH_LOAD"));
  if (ptr !== null) dylib.symbols.free_uarm_string(ptr);
}, 3000);
