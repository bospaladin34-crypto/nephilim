// ================================================================================
// BRAID ALGEBRA TEST SUITE
// Comprehensive validation of topological computation engine
// ================================================================================

import {
  BraidWord,
  BraidAlgebra,
  BraidInvariant,
  AlexanderCoefficients,
  JonesCoefficients,
} from "../src/topology/braid_algebra.ts";

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
    testResults.push({
      name,
      passed: false,
      message: e instanceof Error ? e.message : String(e),
      duration_ms: duration,
    });
    console.log(`❌ ${name} (${duration}ms)`);
    console.log(`   Error: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// ================================================================================
// TEST SUITE
// ================================================================================

const testSuite = [
  // ===== BASIC BRAID OPERATIONS =====

  {
    name: "Test 1: BraidWord Creation and Basic Properties",
    test: async () => {
      const beta = new BraidWord([1, 2]);
      assert(beta.length() === 2, "Length should be 2");
      assert(beta.getGenerators().length === 2, "Generators should have 2 elements");
      const str = beta.toString();
      assert(str.includes("σ₁"), "String representation should contain σ₁");
      assert(str.includes("σ₂"), "String representation should contain σ₂");
    },
  },

  {
    name: "Test 2: Identity Braid (Empty Word)",
    test: async () => {
      const identity = new BraidWord([]);
      assert(identity.length() === 0, "Identity should have length 0");
      assert(BraidAlgebra.isIdentity(identity), "Should be recognized as identity");
      assert(identity.toString() === "ε (identity)", "Identity should display as ε");
    },
  },

  {
    name: "Test 3: Writhe Computation",
    test: async () => {
      const beta1 = new BraidWord([1, 2, 1]);
      assert(beta1.invariants().writhe === 3, "Writhe should be +3");

      const beta2 = new BraidWord([-1, -2, -1]);
      assert(beta2.invariants().writhe === -3, "Writhe should be -3");

      const beta3 = new BraidWord([1, -1]);
      assert(beta3.invariants().writhe === 0, "Writhe should be 0");
    },
  },

  {
    name: "Test 4: Active Strands Detection",
    test: async () => {
      const beta1 = new BraidWord([1]);
      const active1 = beta1.invariants().activeStrands;
      assert(active1.has(1), "Should have strand 1");
      assert(active1.has(2), "Should have strand 2");

      const beta2 = new BraidWord([2]);
      const active2 = beta2.invariants().activeStrands;
      assert(active2.has(2), "Should have strand 2");
      assert(active2.has(3), "Should have strand 3");
    },
  },

  {
    name: "Test 5: Generator Multiset",
    test: async () => {
      const beta = new BraidWord([1, 1, 2, 1, 2]);
      const multiset = beta.invariants().generatorMultiset;
      assert(multiset.get(1) === 3, "σ₁ should appear 3 times");
      assert(multiset.get(2) === 2, "σ₂ should appear 2 times");
    },
  },

  {
    name: "Test 6: Pattern Class",
    test: async () => {
      const beta = new BraidWord([1, 2, 1]);
      const pattern = beta.invariants().patternClass;
      assert(pattern.length === 3, "Pattern should have 3 elements");
      assert(pattern[0] === 1, "First element should be 1");
      assert(pattern[1] === 2, "Second element should be 2");
      assert(pattern[2] === 1, "Third element should be 1");
    },
  },

  {
    name: "Test 7: Topological Charge Computation",
    test: async () => {
      const beta1 = new BraidWord([1, 2]);
      const charge1 = beta1.charge(1);
      assert(charge1 > 0, "Charge should be positive");

      const beta2 = new BraidWord([-1, -2]);
      const charge2 = beta2.charge(1);
      assert(charge2 < 0, "Charge should be negative");

      const beta3 = new BraidWord([1, -1]);
      const charge3 = beta3.charge(1);
      assert(charge3 === 0, "Charge should be zero (balanced)");
    },
  },

  // ===== REIDEMEISTER REDUCTION =====

  {
    name: "Test 8: Reidemeister Reduction - Identity Pairs",
    test: async () => {
      const beta = new BraidWord([1, -1, 2]);
      const reduced = beta.reidemeisterReduce();
      const gens = reduced.getGenerators();
      assert(gens.length === 1, "Should reduce to 1 generator");
      assert(gens[0] === 2, "Should be σ₂");
    },
  },

  {
    name: "Test 9: Reidemeister Reduction - Entire Cancellation",
    test: async () => {
      const beta = new BraidWord([1, -1]);
      const reduced = beta.reidemeisterReduce();
      assert(BraidAlgebra.isIdentity(reduced), "Should reduce to identity");
    },
  },

  {
    name: "Test 10: Reidemeister Reduction - Multiple Pairs",
    test: async () => {
      const beta = new BraidWord([1, 2, -2, -1]);
      const reduced = beta.reidemeisterReduce();
      assert(BraidAlgebra.isIdentity(reduced), "Should completely reduce to identity");
    },
  },

  {
    name: "Test 11: Type II Relation (Braid Relation)",
    test: async () => {
      const lhs = new BraidWord([1, 2, 1]);
      const rhs = new BraidWord([2, 1, 2]);
      const lhsReduced = lhs.reidemeisterReduce();
      const rhsReduced = rhs.reidemeisterReduce();

      // After reduction, both should represent the same topology
      assert(
        BraidAlgebra.equivalent(lhs, rhs),
        "σ₁σ₂σ₁ should be equivalent to σ₂σ₁σ₂"
      );
    },
  },

  {
    name: "Test 12: Far-Commutativity (|i - j| ≥ 2)",
    test: async () => {
      const beta1 = new BraidWord([1, 3]);
      const beta2 = new BraidWord([3, 1]);

      // σ₁ and σ₃ should commute (they don't share a strand)
      const reduced1 = beta1.reidemeisterReduce();
      const reduced2 = beta2.reidemeisterReduce();

      assert(
        BraidAlgebra.equivalent(beta1, beta2),
        "σ₁ and σ₃ should commute (far-commutativity)"
      );
    },
  },

  // ===== BRAID COMPOSITION =====

  {
    name: "Test 13: Braid Composition",
    test: async () => {
      const beta1 = new BraidWord([1]);
      const beta2 = new BraidWord([2]);
      const composed = beta1.compose(beta2);

      assert(composed.length() === 2, "Composed braid should have 2 generators");
      const gens = composed.getGenerators();
      assert(gens[0] === 1, "First generator should be σ₁");
      assert(gens[1] === 2, "Second generator should be σ₂");
    },
  },

  {
    name: "Test 14: Composition Associativity",
    test: async () => {
      const beta1 = new BraidWord([1]);
      const beta2 = new BraidWord([2]);
      const beta3 = new BraidWord([1]);

      // (β₁ · β₂) · β₃
      const path1 = beta1.compose(beta2).compose(beta3);

      // β₁ · (β₂ · β₃)
      const path2 = beta1.compose(beta2.compose(beta3));

      assert(
        BraidAlgebra.equivalent(path1, path2),
        "Composition should be associative"
      );
    },
  },

  // ===== BRAID INVERSION & REVERSIBILITY =====

  {
    name: "Test 15: Braid Inversion",
    test: async () => {
      const beta = new BraidWord([1, 2, 1]);
      const betaInv = BraidAlgebra.invert(beta);

      const gens = betaInv.getGenerators();
      assert(gens[0] === -1, "First element of inverse should be -σ₁");
      assert(gens[1] === -2, "Second element of inverse should be -σ₂");
      assert(gens[2] === -1, "Third element of inverse should be -σ₁");
    },
  },

  {
    name: "Test 16: Reversibility Check (β · β⁻¹ = ε)",
    test: async () => {
      const beta = new BraidWord([1, 2, 1]);
      const betaInv = BraidAlgebra.invert(beta);
      const product = beta.compose(betaInv).reidemeisterReduce();

      assert(BraidAlgebra.isIdentity(product), "β · β⁻¹ should reduce to identity");
    },
  },

  {
    name: "Test 17: Double Inversion (β⁻¹)⁻¹ = β",
    test: async () => {
      const beta = new BraidWord([1, 2]);
      const doubleInv = BraidAlgebra.invert(BraidAlgebra.invert(beta));

      assert(
        BraidAlgebra.equivalent(beta, doubleInv),
        "Double inversion should recover original"
      );
    },
  },

  // ===== LINK INVARIANTS =====

  {
    name: "Test 18: Alexander Polynomial - Identity",
    test: async () => {
      const identity = new BraidWord([]);
      const alex = identity.alexanderPolynomial();

      assert(alex.coefficients.size > 0, "Should have coefficients");
      assert(alex.degree === 0, "Degree should be 0 for identity");
    },
  },

  {
    name: "Test 19: Alexander Polynomial - Simple Braid",
    test: async () => {
      const beta = new BraidWord([1]);
      const alex = beta.alexanderPolynomial();

      assert(alex.coefficients.size > 0, "Should have coefficients");
      assert(alex.degree === 1, "Degree should be 1");
    },
  },

  {
    name: "Test 20: Jones Polynomial - Identity",
    test: async () => {
      const identity = new BraidWord([]);
      const jones = identity.jonesPolynomial();

      assert(jones.coefficients.size > 0, "Should have coefficients");
      assert(jones.degree === 0, "Degree should be 0 for identity");
    },
  },

  {
    name: "Test 21: Jones Polynomial - Consistency",
    test: async () => {
      const beta = new BraidWord([1, 2, 1]);
      const jones = beta.jonesPolynomial();

      assert(jones.coefficients.size > 0, "Should have coefficients");
      // Jones polynomial degree should relate to writhe
      assert(jones.degree !== undefined, "Should have a defined degree");
    },
  },

  {
    name: "Test 22: Linking Number Computation",
    test: async () => {
      const beta = new BraidWord([1, 2]);
      const linking = beta.linkingNumber();

      assert(typeof linking === "number", "Linking number should be a number");
      assert(linking >= -5 && linking <= 5, "Linking number should be reasonable");
    },
  },

  // ===== ALGEBRA OPERATIONS =====

  {
    name: "Test 23: Equivalence Check - Same Braids",
    test: async () => {
      const beta1 = new BraidWord([1, 2]);
      const beta2 = new BraidWord([1, 2]);

      assert(
        BraidAlgebra.equivalent(beta1, beta2),
        "Identical braids should be equivalent"
      );
    },
  },

  {
    name: "Test 24: Equivalence Check - Different Braids",
    test: async () => {
      const beta1 = new BraidWord([1]);
      const beta2 = new BraidWord([2]);

      assert(
        !BraidAlgebra.equivalent(beta1, beta2),
        "Different braids should not be equivalent"
      );
    },
  },

  {
    name: "Test 25: Normal Form Computation",
    test: async () => {
      const beta = new BraidWord([2, 1, 1, 2]);
      const normal = BraidAlgebra.normalForm(beta);

      const gens = normal.getGenerators();
      assert(gens.length > 0, "Normal form should have generators");
      // Generators should be sorted
      for (let i = 0; i < gens.length - 1; i++) {
        assert(
          Math.abs(gens[i]) <= Math.abs(gens[i + 1]),
          "Normal form should have sorted generators"
        );
      }
    },
  },

  {
    name: "Test 26: Commutator [σ₁, σ₂]",
    test: async () => {
      const sig1 = BraidAlgebra.generator(1);
      const sig2 = BraidAlgebra.generator(2);
      const comm = BraidAlgebra.commutator(sig1, sig2);

      assert(comm.length() > 0, "Commutator should have generators");
      // [σ₁, σ₂] is a known non-trivial commutator
      assert(
        !BraidAlgebra.isIdentity(comm),
        "[σ₁, σ₂] should not be identity"
      );
    },
  },

  {
    name: "Test 27: Generator Function",
    test: async () => {
      const gen1 = BraidAlgebra.generator(1);
      const gen2 = BraidAlgebra.generator(2);

      assert(gen1.length() === 1, "Generator should have length 1");
      assert(gen2.length() === 1, "Generator should have length 1");
      assert(gen1.getGenerators()[0] === 1, "First generator should be σ₁");
      assert(gen2.getGenerators()[0] === 2, "First generator should be σ₂");
    },
  },

  // ===== TOPOLOGICAL PROPERTIES =====

  {
    name: "Test 28: Invariant Preservation under Reidemeister",
    test: async () => {
      const beta = new BraidWord([1, 2, 1, -1, -2, -1]);
      const reduced = beta.reidemeisterReduce();

      // The reduced form should have lower word length but preserve some properties
      assert(
        reduced.length() <= beta.length(),
        "Reduction should not increase word length"
      );
    },
  },

  {
    name: "Test 29: Charge Preservation under Composition",
    test: async () => {
      const beta1 = new BraidWord([1, 1]);
      const beta2 = new BraidWord([2, 2]);

      const charge1 = beta1.charge();
      const charge2 = beta2.charge();
      const composed = beta1.compose(beta2);
      const chargeComposed = composed.charge();

      assert(
        chargeComposed === charge1 + charge2,
        "Charge should be additive under composition"
      );
    },
  },

  {
    name: "Test 30: Writhe Inversion Symmetry",
    test: async () => {
      const beta = new BraidWord([1, 2, 1]);
      const writhePos = beta.invariants().writhe;

      const betaInv = BraidAlgebra.invert(beta);
      const writeNeg = betaInv.invariants().writhe;

      assert(writhePos === -writeNeg, "Writhe of inverse should be negated");
    },
  },

  // ===== ACT LINEAGE SPECIFIC TESTS =====

  {
    name: "Test 31: ACT Cascade Core (σ₂·σ₃)",
    test: async () => {
      const cascade = new BraidWord([2, 3]);
      const inv = cascade.invariants();

      assert(inv.activeStrands.has(2), "Should have strand 2");
      assert(inv.activeStrands.has(3), "Should have strand 3");
      assert(inv.writhe === 2, "Should have writhe +2");
    },
  },

  {
    name: "Test 32: ACT Aegis Channel (σ₅⁻¹)",
    test: async () => {
      const aegis = new BraidWord([-5]);
      const inv = aegis.invariants();

      assert(inv.writhe === -1, "Should have writhe -1");
      assert(inv.activeStrands.has(5), "Should have strand 5");
    },
  },

  {
    name: "Test 33: ACT-D Distilled Form (σ₁·σ₂·σ₄⁻¹)",
    test: async () => {
      const actD = new BraidWord([1, 2, -4]);
      const inv = actD.invariants();

      assert(inv.wordLength === 3, "Should have 3 generators");
      assert(inv.writhe === 1, "Should have writhe +1");
    },
  },

  {
    name: "Test 34: Tangram Decomposition Stability",
    test: async () => {
      // Tangram primitives should maintain charge under decomposition
      const primitive1 = new BraidWord([1]);
      const primitive2 = new BraidWord([2]);

      const charge1 = primitive1.charge();
      const charge2 = primitive2.charge();

      const composite = primitive1.compose(primitive2);
      const compositeCharge = composite.charge();

      assert(
        compositeCharge === charge1 + charge2,
        "Tangram composition should be charge-additive"
      );
    },
  },

  {
    name: "Test 35: Topological Sector Consistency",
    test: async () => {
      // 3-strand braid (quark-like)
      const quarkBraid = new BraidWord([1, 2]);
      const quarkActive = quarkBraid.invariants().activeStrands.size;

      // 2-strand braid (lepton-like)
      const leptonBraid = new BraidWord([1]);
      const leptonActive = leptonBraid.invariants().activeStrands.size;

      assert(quarkActive >= 3, "Quark braid should span at least 3 strands");
      assert(leptonActive >= 2, "Lepton braid should span at least 2 strands");
    },
  },

  // ===== STRESS & EDGE CASES =====

  {
    name: "Test 36: Long Braid Reduction",
    test: async () => {
      const longBraid = new BraidWord([1, 2, 1, -1, -2, -1, 1, 2, -2, -1]);
      const reduced = longBraid.reidemeisterReduce();

      assert(
        reduced.length() <= longBraid.length(),
        "Reduction should simplify long braids"
      );
    },
  },

  {
    name: "Test 37: Alternating Braid",
    test: async () => {
      const alternating = new BraidWord([1, -1, 1, -1, 1, -1]);
      const reduced = alternating.reidemeisterReduce();

      assert(BraidAlgebra.isIdentity(reduced), "Fully alternating should reduce to identity");
    },
  },

  {
    name: "Test 38: High-Index Generators",
    test: async () => {
      const highIndex = new BraidWord([5, 6, 7]);
      const inv = highIndex.invariants();

      assert(inv.wordLength === 3, "Should accept high-index generators");
      assert(inv.activeStrands.size > 0, "Should activate strands");
    },
  },

  {
    name: "Test 39: Large Writhe Values",
    test: async () => {
      const largeBraid = new BraidWord([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
      const writhe = largeBraid.invariants().writhe;

      assert(writhe === 10, "Should compute large writhe correctly");
    },
  },

  {
    name: "Test 40: Mixed Sign Braids",
    test: async () => {
      const mixed = new BraidWord([1, -2, 1, -1, 2, -1]);
      const charge = mixed.charge();

      // Should handle mixed signs without error
      assert(typeof charge === "number", "Should compute charge for mixed sign braids");
    },
  },

  // ===== JSON SERIALIZATION =====

  {
    name: "Test 41: JSON Export",
    test: async () => {
      const beta = new BraidWord([1, 2]);
      const json = beta.toJSON() as any;

      assert(json.word !== undefined, "JSON should contain word");
      assert(json.invariants !== undefined, "JSON should contain invariants");
      assert(json.charge !== undefined, "JSON should contain charge");
    },
  },

  {
    name: "Test 42: JSON Round-Trip",
    test: async () => {
      const beta1 = new BraidWord([1, 2, -1]);
      const json = beta1.toJSON() as any;
      const beta2 = new BraidWord(json.word);

      assert(
        BraidAlgebra.equivalent(beta1, beta2),
        "JSON round-trip should preserve equivalence"
      );
    },
  },
];

// ================================================================================
// TEST RUNNER
// ================================================================================

async function runAllTests() {
  console.log("\n" + "=".repeat(80));
  console.log("BRAID ALGEBRA TEST SUITE");
  console.log("=".repeat(80) + "\n");

  for (const test of testSuite) {
    await runTest(test.name, test.test);
  }

  // Summary
  console.log("\n" + "=".repeat(80));
  console.log("TEST SUMMARY");
  console.log("=".repeat(80));

  const passed = testResults.filter((r) => r.passed).length;
  const failed = testResults.filter((r) => !r.passed).length;
  const total = testResults.length;
  const totalTime = testResults.reduce((sum, r) => sum + r.duration_ms, 0);

  console.log(`\nTotal: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`Total Runtime: ${totalTime}ms`);

  if (failed > 0) {
    console.log("\n❌ FAILED TESTS:");
    testResults
      .filter((r) => !r.passed)
      .forEach((r) => {
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
