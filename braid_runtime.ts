// ACT-Ω Polyglot Engine Host Runtime - Version 3.0
import { delay } from "https://deno.land/std@0.177.0/async/delay.ts";

const LIBRARY_PATH = "./libbraid_vm.so";

console.log(`📡 [FFI LOAD] Opening dynamic channel connection to: ${LIBRARY_PATH}`);

// Open the FFI channel matching the exact symbol layouts from our C substrate
const libBraidVM = Deno.dlopen(LIBRARY_PATH, {
  execute_braid_pipeline: {
    parameters: ["buffer", "buffer", "usize"], // (string_buffer, f64_array_buffer, size)
    result: "f64", // Returns computed total writhe
  }
});

/**
 * Tangram Polyglot Template Tag
 * Enables embedding raw, clean BraidC blocks inside standard TypeScript logic
 */
export function braid(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "").trim();
}

/**
 * Encapsulates the execution cross-section
 */
export function runPolyglotManifold(braidSource: string, inputVector: Float64Array): Float64Array {
  // Serialize string into a null-terminated Uint8Array for C compatibility
  const encoder = new TextEncoder();
  const sourceBuffer = encoder.encode(braidSource + "\0");

  // Pass raw memory references straight through the Aegis boundary
  const computedWrithe = libBraidVM.symbols.execute_braid_pipeline(
    sourceBuffer,
    inputVector,
    inputVector.length
  );

  console.log(`📊 [FFI UNWIND] Returned to Host Runtime. Phase Invariant (Writhe): ${computedWrithe.toFixed(6)}`);
  return inputVector;
}

// ====================================================================
// POLYGLOT MANIFOLD VERIFICATION TRIAL
// ====================================================================
async function main() {
  const activeBraidProgram = braid`
    BRAID 6;
    TWIST 1;
    TWIST 2;
    POLYTOPE E8_PROJECTION;
    COLLAPSE;
  `;

  // Create a sample numeric data vector matrix
  const vectorMatrix = new Float64Array([10.0, 20.0, 30.0, 40.0, 50.0]);

  console.log("🚀 Initializing Mixed ACT-Ω Polyglot Execution...");
  console.log(`📈 Vector Input State  : [ ${Array.from(vectorMatrix).join(", ")} ]`);

  // Fire execution across the FFI boundary
  runPolyglotManifold(activeBraidProgram, vectorMatrix);

  console.log(`📉 Vector Output State : [ ${Array.from(vectorMatrix).join(", ")} ]`);
  console.log("======================================================================");
}

main();
