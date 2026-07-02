// ACT-Ω Phase 1: Core Topological Engine & Aegis Phase 1/2 Toggle

export interface EngineTelemetry {
  crossings: number;
  writhe: number;
  phaseDelta: number;
  activePhaseState: number; // 1 = Stable, 2 = RAS Dampened, 3 = Quarantined, 4 = Reboot
}

export class ActOmegaEngine {
  private crossings = 0;
  private writhe = 0;
  private phaseDelta = 0.0;
  private activePhaseState = 1;
  
  // Canonical phase shift metric constant per crossing
  private readonly PHASE_DELTA_UNIT = 0.17259029;
  private readonly CRITICAL_THRESHOLD = 0.40000000;

  constructor() {
    console.log("[ENGINE INIT] Cascade Core tracking space instantiated successfully.");
  }

  /**
   * Simulates a positive Artin braid generator crossing (σ_i)
   * Updates non-commutative sequential dependencies.
   */
  public executeTwist(strandIndex: number): void {
    this.crossings++;
    this.writhe += 1; // Right-handed crossing increases writhe
    this.phaseDelta += this.PHASE_DELTA_UNIT;
    
    console.log(`[CASCADE CORE] Twist σ_${strandIndex} applied. Raw Phase Delta: ${this.phaseDelta.toFixed(6)}`);
    this.evaluateAegisGuards();
  }

  /**
   * Simulates an inverse Artin braid generator crossing (σ_i^-1)
   * Allows reversible logic traces and handles Reidemeister reductions.
   */
  public executeInvert(strandIndex: number): void {
    this.crossings++;
    this.writhe -= 1; // Left-handed crossing decreases writhe
    this.phaseDelta -= this.PHASE_DELTA_UNIT;
    
    console.log(`[CASCADE CORE] Invert σ_${strandIndex}^-1 applied. Raw Phase Delta: ${this.phaseDelta.toFixed(6)}`);
    this.evaluateAegisGuards();
  }

  /**
   * Aegis Channel safety loop monitoring absolute tension boundaries.
   */
  private evaluateAegisGuards(): void {
    const absolutePhase = Math.abs(this.phaseDelta);

    if (this.activePhaseState === 1 && absolutePhase > this.CRITICAL_THRESHOLD) {
      console.log(`\n[AEGIS WARNING] Absolute Phase Delta (${absolutePhase.toFixed(6)}) breached 0.4 threshold!`);
      this.triggerPhase2Dampening();
    } else if (this.activePhaseState === 2 && absolutePhase <= this.CRITICAL_THRESHOLD) {
      // Reversible tracking: return to stable phase if tension drops naturally
      console.log(`[AEGIS INFO] Manifold localized tension stabilized below 0.4 boundary.`);
      this.activePhaseState = 1;
    }
  }

  /**
   * Phase 2 Mitigator: Applies a 30% Reticular Activating System phase-dampening field
   */
  private triggerPhase2Dampening(): void {
    this.activePhaseState = 2;
    console.log(`[AEGIS PHASE-TOGGLE] Switching execution to PHASE 2 (Writhe Imbalance State).`);
    
    // Homotopy contraction: scale the tensor wave amplitude by 0.70 (30% dampening)
    const localizedTensionBefore = this.phaseDelta;
    this.phaseDelta = this.phaseDelta * 0.70;
    
    console.log(`[AEGIS RAS METER] Applied 30% phase-dampening field.`);
    console.log(`[AEGIS RAS METER] Adjusted Phase Delta: ${localizedTensionBefore.toFixed(6)} -> ${this.phaseDelta.toFixed(6)}\n`);
  }

  public getTelemetry(): EngineTelemetry {
    return {
      crossings: this.crossings,
      writhe: this.writhe,
      phaseDelta: this.phaseDelta,
      activePhaseState: this.activePhaseState
    };
  }
}

// ======================================================================
// AUTOMATED TESTING SUITE: PHASE 1 VERIFICATION
// ======================================================================
async function runPhase1Tests() {
  console.log("======================================================================");
  console.log("EXECUING PHASE 1 TARGET TESTS: MANIFOLD METRICS & RAS OVERRIDE");
  console.log("======================================================================\n");

  const testEngine = new ActOmegaEngine();
  
  // Test 1: Verify baseline state
  let telemetry = testEngine.getTelemetry();
  console.log("[TEST 1] Verifying initial invariants...");
  if (telemetry.crossings === 0 && telemetry.activePhaseState === 1) {
    console.log("-> TEST 1 PASSED: Baseline space is clear.\n");
  } else {
    throw new Error("TEST 1 FAILED: Invalid initial configuration.");
  }

  // Test 2: Apply safe twists below threshold (2 twists = 0.34518)
  console.log("[TEST 2] Applying minor tension within safe boundaries...");
  testEngine.executeTwist(2);
  testEngine.executeTwist(3);
  telemetry = testEngine.getTelemetry();
  console.log(`Current State: Crossings=${telemetry.crossings}, Phase=${telemetry.phaseDelta.toFixed(6)}, PhaseState=${telemetry.activePhaseState}`);
  if (telemetry.activePhaseState === 1) {
    console.log("-> TEST 2 PASSED: System remains stable under 0.4.\n");
  } else {
    throw new Error("TEST 2 FAILED: Aegis guard tripped prematurely.");
  }

  // Test 3: Induce tension spike to trip Phase 2 (3rd twist pushes phase to 0.51777)
  console.log("[TEST 3] Inducing tension spike to force Phase 2 transition...");
  testEngine.executeTwist(4); // Should trip threshold (>0.4) and trigger 30% dampening
  telemetry = testEngine.getTelemetry();
  
  // Expected calculation after dampening: (0.17259029 * 3) * 0.70 = 0.3624396
  const expectedDampenedPhase = 0.3624396;
  const variance = Math.abs(telemetry.phaseDelta - expectedDampenedPhase);

  console.log(`Current State: PhaseState=${telemetry.activePhaseState}, Stabilized Phase=${telemetry.phaseDelta.toFixed(6)}`);
  
  if (telemetry.activePhaseState === 2 && variance < 0.00001) {
    console.log("-> TEST 3 PASSED: Aegis successfully engaged Phase 2 and precise 30% RAS dampening applied.");
    console.log("\n======================================================================");
    console.log("🎉 ALL PHASE 1 CORE TOPOLOGY INTEGRATION TESTS PASSED!");
    console.log("======================================================================");
  } else {
    throw new Error(`TEST 3 FAILED: Unexpected phase state or dampening math error. Variance: ${variance}`);
  }
}

// Run test runner automatically upon execution
runPhase1Tests();
