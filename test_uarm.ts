const libPath = "./target/release/libvesper.so";
const tensorFilePath = "./VESPER FULL TENSOR SET (1).txt";

const dylib = Deno.dlopen(libPath, {
  update_braidc_phase: { parameters: ["buffer"], result: "pointer" },
  inject_vesper_tensor: { parameters: ["buffer", "buffer", "buffer"], result: "void" },
  add_uarm_goal: { parameters: ["buffer", "u32"], result: "void" },
  get_uarm_telemetry: { parameters: [], result: "pointer" },
  free_uarm_string: { parameters: ["pointer"], result: "void" }
});

function encodeString(str: string): Uint8Array {
  return new TextEncoder().encode(str + "\0");
}

function queryKernel(observation: string): string {
  const ptr = dylib.symbols.update_braidc_phase(encodeString(observation));
  if (ptr === null) return "NULL_PTR_ERROR";
  const view = new Deno.UnsafePointerView(ptr);
  const action = view.getCString();
  dylib.symbols.free_uarm_string(ptr);
  return action;
}

console.log("=== STEP 1: Processing Custom Weights Stream ===");
try {
  const fileContent = Deno.readTextFileSync(tensorFilePath);
  const lines = fileContent.split("\n");
  let injectedCount = 0;

  for (const line of lines) {
    if (!line.trim() || !line.startsWith("VESPER_DELTA")) continue;
    const tokens = line.split("|");
    if (tokens.len < 4 || tokens.length < 4) {
      // Direct field backup check
      const parts = line.split("|");
      if (parts.length >= 4) {
        dylib.symbols.inject_vesper_tensor(encodeString(parts[1]), encodeString(parts[2]), encodeString(parts[3]));
        injectedCount++;
      }
      continue;
    }
    dylib.symbols.inject_vesper_tensor(encodeString(tokens[1]), encodeString(tokens[2]), encodeString(tokens[3]));
    injectedCount++;
    if (injectedCount >= 5) break; // Ingest 5 baseline snapshots for verification
  }
  console.log(`Successfully parsed and linked ${injectedCount} Vesper weight deltas.`);
} catch (e) {
  console.log("Note: Local tensor file read deferred, running mock stream generation fallback.");
  dylib.symbols.inject_vesper_tensor(encodeString("E01"), encodeString("T0001"), encodeString("wxtDNXVs/jQc3Ry"));
}

console.log("\n=== STEP 2: Pre-Mutation Evaluation ===");
console.log(`Observation: METRICS_HIGH_LOAD -> Choice: ${queryKernel("METRICS_HIGH_LOAD")}`);

console.log("\n=== STEP 3: Injecting Dynamic Overclock Goal ===");
dylib.symbols.add_uarm_goal(encodeString("Optimize_Throughput"), 25);

console.log("\n=== STEP 4: Post-Mutation Evaluation ===");
console.log(`Observation: METRICS_HIGH_LOAD -> Choice: ${queryKernel("METRICS_HIGH_LOAD")}`);

console.log("\n=== STEP 5: Final Multi-Substrate Telemetry Dump ===");
const telemetryPtr = dylib.symbols.get_uarm_telemetry();
if (telemetryPtr !== null) {
  const view = new Deno.UnsafePointerView(telemetryPtr);
  console.log(view.getCString());
  dylib.symbols.free_uarm_string(telemetryPtr);
}

dylib.close();
