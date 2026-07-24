// ================================================================================
// NEPHILIM INTEGRATION TEST SUITE
// Full pipeline validation: telemetry -> R4 -> ACT -> ASM -> UARM -> BraidC -> Santos
// ================================================================================

import { mapToR4, INVARIANTS, type R4Tensor } from "../config/exotic_r4.ts";
import { enforceACTBounds, ACTFamily } from "../src/topology/act_bounds.ts";
import { BraidCompiler } from "../src/topology/braid_syntax.ts";
import { AgentStateMachine, ManifoldState } from "../src/reasoning/agent_machine.ts";
import { UARM, StomachionMode } from "../src/reasoning/uarm_kernel.ts";
import { SantosAuditor, SantosPhase } from "../src/reasoning/santos_audit.ts";
import type { ManifoldTelemetry } from "../src/interfaces/os_telemetry.ts";

// ================================================================================
// TEST UTILITIES
// ================================================================================

interface TestResult {
    name: string;
    passed: boolean;
    message: string;
    duration_ms: number;
}

const testResults: TestResult[] = [];

function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const start = Date.now();
    try {
        await testFn();
        const duration = Date.now() - start;
        testResults.push({ name, passed: true, message: "OK", duration_ms: duration });
        console.log(`✅ ${name} (${duration}ms)`);
    } catch (e) {
        const duration = Date.now() - start;
        testResults.push({ name, passed: false, message: e.message, duration_ms: duration });
        console.log(`❌ ${name} (${duration}ms)`);
        console.log(`   Error: ${e.message}`);
    }
}

// ================================================================================
// MOCK DATA
// ================================================================================

const mockTelemetry: ManifoldTelemetry = {
    cpu_load_percent: 25,
    gpu_util_percent: 45,
    gpu_mem_used_mb: 2048,
    gpu_mem_total_mb: 6144,
    gpu_temp_c: 55,
    timestamp: new Date().toISOString()
};

const mockIdleTelemetry: ManifoldTelemetry = {
    cpu_load_percent: 5,
    gpu_util_percent: 0,
    gpu_mem_used_mb: 512,
    gpu_mem_total_mb: 6144,
    gpu_temp_c: 40,
    timestamp: new Date().toISOString()
};

const mockHighLoadTelemetry: ManifoldTelemetry = {
    cpu_load_percent: 95,
    gpu_util_percent: 99,
    gpu_mem_used_mb: 5500,
    gpu_mem_total_mb: 6144,
    gpu_temp_c: 85,
    timestamp: new Date().toISOString()
};

// ================================================================================
// TEST SUITE
// ================================================================================

const testSuite = [
    // R4 Tensor Mapping Tests
    {
        name: "Test 1: R4 Tensor Mapping (Nominal Load)",
        test: async () => {
            const tensor = mapToR4(mockTelemetry);
            assert(tensor.Qi >= 0.55 && tensor.Qi <= 0.77, "Qi out of bounds");
            assert(typeof tensor.w === "number" && tensor.w > 0, "w coordinate invalid");
            assert(tensor.x >= 0, "x (CPU entropy) negative");
            assert(tensor.y >= 0, "y (memory) negative");
        }
    },
    {
        name: "Test 2: R4 Tensor Mapping (Idle State)",
        test: async () => {
            const tensor = mapToR4(mockIdleTelemetry);
            assert(tensor.Qi <= 0.60, "Idle Qi should be low");
        }
    },
    {
        name: "Test 3: R4 Tensor Mapping (High Load)",
        test: async () => {
            const tensor = mapToR4(mockHighLoadTelemetry);
            assert(tensor.Qi >= 0.70, "High load Qi should be elevated");
        }
    },
    {
        name: "Test 4: R4 Tensor External Entropy Folding",
        test: async () => {
            const tensorWithoutEntropy = mapToR4(mockTelemetry, 0.0);
            const tensorWithEntropy = mapToR4(mockTelemetry, 0.9);
            // Entropy should increase Qi (20% weight)
            assert(tensorWithEntropy.Qi > tensorWithoutEntropy.Qi, "External entropy not folded correctly");
        }
    },
    // ACT Bounds Tests
    {
        name: "Test 5: ACT Bounds (Idle State)",
        test: async () => {
            const tensor = mapToR4(mockIdleTelemetry);
            const act = enforceACTBounds(tensor);
            assert(act.status.includes("TESSERACT_IDLE"), "Expected TESSERACT_IDLE status");
            assert(act.isSafe === true, "Idle state should be safe");
            assert(act.opcode === "0x02 KANGYU", "Wrong opcode for idle");
        }
    },
    {
        name: "Test 6: ACT Bounds (Charging State)",
        test: async () => {
            const tensor = mapToR4(mockTelemetry);
            const act = enforceACTBounds(tensor);
            assert(act.status.includes("CHARGE_STATE"), "Expected CHARGE_STATE status");
            assert(act.isSafe === true, "Charging state should be safe");
        }
    },
    {
        name: "Test 7: ACT Bounds (Snap Prepared)",
        test: async () => {
            // Create tensor that triggers snap (Qi >= 0.74)
            const snapTensor: R4Tensor = {
                w: 25.83,
                x: 0.618 * 0.7,
                y: 0.618 * 0.7,
                z: 0,
                Qi: 0.75
            };
            const act = enforceACTBounds(snapTensor);
            assert(act.status.includes("SNAP_PREPARED"), "Expected SNAP_PREPARED status");
            assert(act.opcode === "0x08 MAKORA", "Wrong opcode for snap");
        }
    },
    {
        name: "Test 8: ACT Bounds Hard Trip (Qi > 0.77)",
        test: async () => {
            const faultTensor: R4Tensor = {
                w: 25.83,
                x: 1.0,
                y: 1.0,
                z: 1.0,
                Qi: 0.80 // Exceeds bounds
            };
            const act = enforceACTBounds(faultTensor);
            assert(!act.isSafe, "Should trigger unsafe condition");
            assert(act.opcode === "0x00 DATTO", "Wrong opcode for hard trip");
            assert(act.status.includes("HARD_TRIP"), "Expected HARD_TRIP");
        }
    },
    // Agent State Machine Tests
    {
        name: "Test 9: Agent State Machine (IDLE to CHARGING)",
        test: async () => {
            const asm = new AgentStateMachine();
            const tensor = mapToR4(mockTelemetry);
            const act = enforceACTBounds(tensor);
            
            const mockIR = {
                n_strands: 4,
                s_word: ["s1", "s2"],
                writhe_L: 0.5,
                writhe_R: 0.51,
                is_chiral_balanced: true,
                target_Qi: 0.75
            };
            
            const result = asm.evaluateState(act, mockIR);
            assert(result.state === ManifoldState.CHARGING, "Should transition to CHARGING");
            assert(result.cycle > 0, "Cycle count should increment");
        }
    },
    {
        name: "Test 10: Agent State Machine (Fault Detection)",
        test: async () => {
            const asm = new AgentStateMachine();
            const faultTensor: R4Tensor = {
                w: 25.83,
                x: 1.0,
                y: 1.0,
                z: 1.0,
                Qi: 0.80
            };
            const act = enforceACTBounds(faultTensor);
            
            const mockIR = {
                n_strands: 4,
                s_word: ["0x00_DATTO_ABORT"],
                writhe_L: 0.0,
                writhe_R: 0.0,
                is_chiral_balanced: false,
                target_Qi: 0.80
            };
            
            const result = asm.evaluateState(act, mockIR);
            assert(result.state === ManifoldState.FAULT, "Should transition to FAULT");
        }
    },
    // UARM Cognition Tests
    {
        name: "Test 11: UARM Cognition (IDLE -> EXPLORATORY)",
        test: async () => {
            const uarm = new UARM();
            const tensor = mapToR4(mockIdleTelemetry);
            const act = enforceACTBounds(tensor);
            
            const cognition = uarm.synthesizeCognition(tensor, act, ManifoldState.IDLE);
            assert(cognition.stomachion_strategy === StomachionMode.EXPLORATORY, "Expected EXPLORATORY mode");
            assert(cognition.compiled_intent === "EXPLORE", "Expected EXPLORE intent");
        }
    },
    {
        name: "Test 12: UARM Cognition (CHARGING -> GENERATIVE)",
        test: async () => {
            const uarm = new UARM();
            const tensor = mapToR4(mockTelemetry);
            const act = enforceACTBounds(tensor);
            
            const cognition = uarm.synthesizeCognition(tensor, act, ManifoldState.CHARGING);
            assert(cognition.stomachion_strategy === StomachionMode.GENERATIVE, "Expected GENERATIVE mode");
            assert(cognition.compiled_intent === "GENERATE", "Expected GENERATE intent");
        }
    },
    {
        name: "Test 13: UARM Cognition (FAULT -> REDUCTIVE)",
        test: async () => {
            const uarm = new UARM();
            const tensor = mapToR4(mockHighLoadTelemetry);
            const act = enforceACTBounds(tensor);
            
            const cognition = uarm.synthesizeCognition(tensor, act, ManifoldState.FAULT);
            assert(cognition.stomachion_strategy === StomachionMode.REDUCTIVE, "Expected REDUCTIVE mode");
            assert(cognition.compiled_intent === "0x00_DATTO_ABORT", "Expected DATTO_ABORT intent");
        }
    },
    // Braid Compiler Tests
    {
        name: "Test 14: BraidC Compilation (ARCHITECT mode)",
        test: async () => {
            const tensor = mapToR4(mockTelemetry);
            const result = BraidCompiler.compile(tensor, "CONSTRUCT");
            assert(result.ir.is_chiral_balanced === true, "IR should be chiral balanced");
            assert(result.ir.n_strands === 4, "Should have 4 strands");
            assert(result.ir.s_word.length > 0, "Should have strand words");
        }
    },
    {
        name: "Test 15: BraidC Compilation (Hard Trip)",
        test: async () => {
            const faultTensor: R4Tensor = {
                w: 25.83,
                x: 1.0,
                y: 1.0,
                z: 1.0,
                Qi: 0.80
            };
            const result = BraidCompiler.compile(faultTensor, "EXPLORE");
            assert(result.ir.n_strands === 0, "Hard trip IR should have 0 strands");
            assert(result.ir.is_chiral_balanced === false, "Hard trip IR should not be balanced");
        }
    },
    // Santos Auditor Tests
    {
        name: "Test 16: Santos Audit (Clean IR)",
        test: async () => {
            const cleanIR = {
                n_strands: 4,
                s_word: ["s1", "s2", "s1_inv"],
                writhe_L: 0.50,
                writhe_R: 0.51,
                is_chiral_balanced: true,
                target_Qi: 0.75
            };
            const audit = SantosAuditor.executeAudit(cleanIR);
            assert(audit.is_isomorphic === true, "Clean IR should be isomorphic");
            assert(audit.parity_conserved === true, "Parity should be conserved");
            assert(audit.phase === SantosPhase.ACT, "Should reach ACT phase");
        }
    },
    {
        name: "Test 17: Santos Audit (Writhe Violation)",
        test: async () => {
            const violationIR = {
                n_strands: 4,
                s_word: ["s1", "s2"],
                writhe_L: 0.50,
                writhe_R: 0.65, // Exceeds 0.02 delta
                is_chiral_balanced: false,
                target_Qi: 0.75
            };
            const audit = SantosAuditor.executeAudit(violationIR);
            assert(audit.is_isomorphic === false, "Should detect violation");
            assert(audit.rectification_applied === "J_IDEAL_SHUNT_APPLIED", "Should apply rectification");
            assert(audit.final_ir.target_Qi === 0.55, "Should reset Qi to safe");
        }
    },
    // Full Pipeline Integration Test
    {
        name: "Test 18: Full Pipeline Integration (Idle -> Charging -> Snap)",
        test: async () => {
            // Start idle
            let tensor = mapToR4(mockIdleTelemetry);
            let act = enforceACTBounds(tensor);
            assert(act.status.includes("TESSERACT_IDLE"), "Step 1: Should be idle");
            
            // Transition to charging
            tensor = mapToR4(mockTelemetry);
            act = enforceACTBounds(tensor);
            assert(act.status.includes("CHARGE_STATE"), "Step 2: Should be charging");
            
            // Move to snap territory
            const snapTensor: R4Tensor = {
                w: 25.83,
                x: 0.618 * 0.7,
                y: 0.618 * 0.7,
                z: 0,
                Qi: 0.75
            };
            act = enforceACTBounds(snapTensor);
            assert(act.status.includes("SNAP_PREPARED"), "Step 3: Should be snap-prepared");
        }
    },
    {
        name: "Test 19: Constants Validation",
        test: async () => {
            assert(INVARIANTS.PHI > 1.6 && INVARIANTS.PHI < 1.7, "PHI constant invalid");
            assert(INVARIANTS.SCALING_CONSTANT === 0.618, "SCALING_CONSTANT invalid");
            assert(INVARIANTS.MAJORANA_PARITY === 1.0, "MAJORANA_PARITY should be 1.0");
        }
    },
    {
        name: "Test 20: Telemetry Bounds Enforcement",
        test: async () => {
            // Create extreme telemetry
            const extremeTelemetry: ManifoldTelemetry = {
                cpu_load_percent: 999,
                gpu_util_percent: 999,
                gpu_mem_used_mb: 999999,
                gpu_mem_total_mb: 1,
                gpu_temp_c: 999,
                timestamp: new Date().toISOString()
            };
            const tensor = mapToR4(extremeTelemetry);
            // Qi should still be bounded
            assert(tensor.Qi >= 0.55 && tensor.Qi <= 0.77, "Qi must remain bounded even with extreme input");
        }
    }
];

// ================================================================================
// MAIN TEST RUNNER
// ================================================================================

async function runAllTests() {
    console.log("\n" + "=".repeat(80));
    console.log("NEPHILIM INTEGRATION TEST SUITE");
    console.log("=".repeat(80) + "\n");

    for (const test of testSuite) {
        await runTest(test.name, test.test);
    }

    // Summary
    console.log("\n" + "=".repeat(80));
    console.log("TEST SUMMARY");
    console.log("=".repeat(80));

    const passed = testResults.filter(r => r.passed).length;
    const failed = testResults.filter(r => !r.passed).length;
    const total = testResults.length;
    const totalTime = testResults.reduce((sum, r) => sum + r.duration_ms, 0);

    console.log(`\nTotal: ${total} | Passed: ${passed} | Failed: ${failed}`);
    console.log(`Total Runtime: ${totalTime}ms`);

    if (failed > 0) {
        console.log("\n❌ FAILED TESTS:");
        testResults.filter(r => !r.passed).forEach(r => {
            console.log(`   - ${r.name}`);
            console.log(`     ${r.message}`);
        });
        Deno.exit(1);
    } else {
        console.log("\n✅ ALL TESTS PASSED");
        Deno.exit(0);
    }
}

await runAllTests();
