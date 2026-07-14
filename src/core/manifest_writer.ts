// ================================================================================
// MANIFEST WRITER (STATE & EVOLUTION LOGGING)
// TARGET ARCHITECTURE: DETERMINISTIC PERSISTENCE
// ================================================================================
import { ManifoldState } from "../reasoning/agent_machine.ts";

export async function logEvolution(cycle: number, state: ManifoldState, opcode: string, Qi: number): Promise<void> {
    const timestamp = new Date().toISOString();
    // Formatting the string for deterministic 1024-line column alignment
    const logEntry = `[${timestamp}] CYCLE: ${cycle.toString().padStart(5, '0')} | STATE: ${state.padEnd(23)} | OPCODE: ${opcode.padEnd(12)} | Qi: ${Qi.toFixed(4)}\n`;
    
    try {
        // Appending directly to the local manifest ledger
        await Deno.writeTextFile("manifests/state_evolution.log", logEntry, { append: true });
        console.log(`✅ [MANIFEST] Evolution state anchored: Cycle ${cycle}`);
    } catch (e) {
        console.error(`❌ [MANIFEST_FAILURE] Could not anchor state: ${e}`);
    }
}

// Diagnostic Execution
if (import.meta.main) {
    console.log(">>> [EXECUTING MANIFEST LOGGING]...");
    // Simulating the output from the successful ASM cycle
    await logEvolution(1, ManifoldState.IDLE, "0x02 KANGYU", 0.5500);
}
