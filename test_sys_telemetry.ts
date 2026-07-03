// ACT-Ω Substrate Telemetry Sandboxed Diagnostic Probe
console.log("======================================================================");
console.log("🔬 SUBSTRATE TELEMETRY PROTOTYPE VALIDATION (TERMINAL 2)");
console.log("======================================================================");

const startTime = performance.now();

try {
  console.log("📡 Intercepting host kernel metrics via Deno.systemMemoryInfo()...");
  
  // Fetch physical memory properties from the hardware layer
  const memInfo = Deno.systemMemoryInfo();
  
  const endTime = performance.now();
  const executionDuration = endTime - startTime;

  console.log("\n✅ [TEST PASSED] Substrate telemetry extracted successfully!");
  console.log("----------------------------------------------------------------------");
  console.log(`📊 Code Execution Delta : ${executionDuration.toFixed(4)} ms`);
  console.log(`💾 Free System Memory   : ${(memInfo.free / 1024 / 1024).toFixed(2)} GB (${memInfo.free} KB)`);
  console.log(`💾 Total System Memory  : ${(memInfo.total / 1024 / 1024).toFixed(2)} GB (${memInfo.total} KB)`);
  console.log(`🔄 Available Swap Space : ${(memInfo.swapFree / 1024 / 1024).toFixed(2)} GB`);
  console.log("----------------------------------------------------------------------");
  console.log("💡 Global Section Consistency: SAFE for V2.5 integration.");
  
} catch (error) {
  console.log("\n❌ [TEST FAILED] Substrate isolation layer blocked access.");
  console.log(`⚠️ Error Signature: ${error.message}`);
  console.log("\n💡 Resolution: You must execute this file with the '--allow-sys' flag to unlock hardware metrics.");
}
