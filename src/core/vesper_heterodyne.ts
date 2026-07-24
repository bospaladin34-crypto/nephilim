// ================================================================================
// VESPER MANIFOLD: MASTER MONOLITH (PATH CORRECTED v2.4)
// ================================================================================

import { loadNativeEnv } from "../config/env.ts";
import { extractHardwareEntropy } from "../interfaces/os_telemetry.ts";
import { externalEntropy, initEntropyListener, closeEntropyListener } from "../interfaces/vesper_ws.ts";
import { initGpuMatrix, shutdownGpuMatrix } from "../interfaces/rtx_matrix.ts";
import { mapToR4 } from "../config/exotic_r4.ts";
import { enforceACTBounds } from "../topology/act_bounds.ts";
import { BraidCompiler } from "../topology/braid_syntax.ts";
import { AgentStateMachine } from "../reasoning/agent_machine.ts";
import { UARM } from "../reasoning/uarm_kernel.ts";
import { SantosAuditor } from "../reasoning/santos_audit.ts";
import { logEvolution } from "./manifest_writer.ts";
import { transmitFluxArtifact } from "../interfaces/github_sync.ts";

const asm = new AgentStateMachine();
const uarm = new UARM();

let pulseInterval: number | null = null;
let cycleCount = 0;

async function executeVesperPulse() {
    try {
        cycleCount++;
        const telemetry = await extractHardwareEntropy();
        
        // FIXED: mapToR4 now correctly accepts optional external entropy as second param
        const r4Tensor = mapToR4(telemetry, externalEntropy.stream_val);
        const actState = enforceACTBounds(r4Tensor);
        
        // Create mock BraidIR for ASM evaluation
        const mockIR = {
            n_strands: 4,
            s_word: ["s1", "s2", "s1_inv"],
            writhe_L: 0.5,
            writhe_R: 0.5,
            is_chiral_balanced: true,
            target_Qi: 0.75
        };
        
        const asmOutput = asm.evaluateState(actState, mockIR);
        const cognition = uarm.synthesizeCognition(r4Tensor, actState, asmOutput.state);
        const compiled = BraidCompiler.compile(r4Tensor, cognition.compiled_intent);
        const audit = SantosAuditor.executeAudit(compiled.ir);

        await logEvolution(asmOutput.cycle, asmOutput.state, actState.opcode, audit.final_ir.target_Qi);
        
        // Sync to GitHub every 5 cycles
        if (asmOutput.cycle % 5 === 0) {
            await transmitFluxArtifact(asmOutput.cycle, {
                cycle: asmOutput.cycle,
                state: asmOutput.state,
                telemetry,
                entropy_stream: externalEntropy.stream_val,
                cognition
            });
        }
    } catch (e) {
        console.error(`❌ [VESPER_PULSE_ERROR] ${e}`);
    }
}

async function bootSequence() {
    console.log("\n>>> [VESPER MANIFOLD INITIALIZING...]");
    await loadNativeEnv();
    await initGpuMatrix();
    await initEntropyListener();
    
    console.log("✅ [BOOT_SEQUENCE_COMPLETE] All subsystems online.");
    console.log(">>> [STARTING PULSE CYCLE: 5210ms intervals]");
    
    // Start the pulse loop
    pulseInterval = setInterval(executeVesperPulse, 5210);
    
    // Execute first pulse immediately
    await executeVesperPulse();
}

// Graceful shutdown
function shutdown() {
    console.log("\n>>> [SHUTDOWN INITIATED]");
    if (pulseInterval !== null) {
        clearInterval(pulseInterval);
    }
    closeEntropyListener();
    shutdownGpuMatrix();
    console.log("✅ [SHUTDOWN_COMPLETE]");
}

// Handle signals for graceful shutdown
Deno.addSignalListener("SIGINT", shutdown);
Deno.addSignalListener("SIGTERM", shutdown);

await bootSequence();
