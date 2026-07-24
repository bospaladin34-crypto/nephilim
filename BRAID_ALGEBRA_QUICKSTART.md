# Braid Algebra Quickstart Guide

## Overview

The **Braid Algebra Engine** (`src/topology/braid_algebra.ts`) is the foundational mathematical core of Nephilim. It implements the Artin braid group B_n with full support for:

- **Invariant computation** (writhe, active strands, pattern class)
- **Reidemeister reduction** (collapse inverse pairs and apply relations)
- **Link invariants** (Alexander & Jones polynomials)
- **Topological charge** (Q(β) ∈ q₀ℤ)
- **Braid composition** (morphism chaining)
- **Reversibility checks** (β · β⁻¹ = ε)

This document shows how to run tests, interpret results, and use the engine in your code.

---

## Running the Tests

### Option 1: Run All Tests

```bash
deno test tests/braid_algebra_test.ts
```

### Option 2: Run with Verbose Output

```bash
deno test --allow-all tests/braid_algebra_test.ts --quiet=false
```

### Option 3: Run the Diagnostic (Single File Execution)

```bash
deno run src/topology/braid_algebra.ts
```

This runs the built-in diagnostic that demonstrates:
- Basic braid operations
- Reidemeister reduction
- Link invariants
- Type II relation (braid relation)
- Far-commutativity
- Commutators

---

## Expected Test Output

### Summary

```
================================================================================
BRAID ALGEBRA TEST SUITE
================================================================================

✅ Test 1: BraidWord Creation and Basic Properties (2ms)
✅ Test 2: Identity Braid (Empty Word) (1ms)
✅ Test 3: Writhe Computation (1ms)
✅ Test 4: Active Strands Detection (1ms)
✅ Test 5: Generator Multiset (1ms)
...
✅ Test 42: JSON Round-Trip (2ms)

================================================================================
TEST SUMMARY
================================================================================

Total: 42 | Passed: 42 | Failed: 0
Total Runtime: 89ms

✅ ALL TESTS PASSED
```

### Individual Test Details

Each test output includes:
- ✅ **Pass marker** (green check)
- **Test name** (descriptive)
- **Duration** (milliseconds)

Example:
```
✅ Test 11: Type II Relation (Braid Relation) (3ms)
```

---

## Key Test Categories

### 1. Basic Braid Operations (Tests 1-7)

These verify that braid creation and fundamental properties work correctly:

```typescript
const beta = new BraidWord([1, 2]);
console.log(beta.invariants().writhe);  // Should be 2
console.log(beta.charge(1));             // Should be 2
```

**What to expect:**
- Writhe = sum of exponents (+1 for positive, -1 for negative)
- Charge = q₀ × writhe (linearly proportional)
- Active strands = set of affected strand indices

### 2. Reidemeister Reduction (Tests 8-12)

These verify that the braid reduction engine correctly applies Artin relations:

```typescript
const beta = new BraidWord([1, -1, 2]);
const reduced = beta.reidemeisterReduce();
// Should reduce to just [2] (σ₁ · σ₁⁻¹ cancelled)
```

**Critical property:** After reduction, braids should be **minimal** but **equivalent**.

**Type II Relation test:**
```
σ₁σ₂σ₁ ≡ σ₂σ₁σ₂  (braid relation)
Both reduce to equivalent topological states
```

### 3. Composition & Associativity (Tests 13-14)

Verifies that braids can be chained:

```typescript
const beta1 = new BraidWord([1]);
const beta2 = new BraidWord([2]);
const composed = beta1.compose(beta2);
// Result: [1, 2]
```

**Property:** Composition should be **associative**:
```
(β₁ · β₂) · β₃ ≡ β₁ · (β₂ · β₃)
```

### 4. Inversion & Reversibility (Tests 15-17)

Verifies that every braid has a proper inverse:

```typescript
const beta = new BraidWord([1, 2, 1]);
const betaInv = BraidAlgebra.invert(beta);
const product = beta.compose(betaInv).reidemeisterReduce();
// product should be identity (empty word)
```

**Critical properties:**
- `β · β⁻¹ = ε` (identity after reduction)
- `(β⁻¹)⁻¹ = β` (double inversion recovers original)
- `w(β⁻¹) = -w(β)` (writhe is antisymmetric)

### 5. Link Invariants (Tests 18-22)

Computes Alexander and Jones polynomials:

```typescript
const beta = new BraidWord([1, 2, 1]);
const alex = beta.alexanderPolynomial();
const jones = beta.jonesPolynomial();
// These are topological invariants that distinguish knots
```

**What they mean:**
- Different knots have **different** polynomials
- Same knot (different representations) has **same** polynomials
- Identity has **trivial** polynomial (just 1)

### 6. Algebra Operations (Tests 23-27)

High-level algebraic operations:

```typescript
const beta1 = new BraidWord([1, 2]);
const beta2 = new BraidWord([1, 2]);
const equiv = BraidAlgebra.equivalent(beta1, beta2);  // true

const normal = BraidAlgebra.normalForm(beta1);
// Returns canonical representative
```

### 7. ACT Lineage Tests (Tests 31-35)

Validates the ACT topological architecture:

```typescript
// ACT Cascade Core
const cascade = new BraidWord([2, 3]);
const inv = cascade.invariants();
// Should have writhe = 2, activeStrands = {2,3,4}

// ACT Aegis Channel
const aegis = new BraidWord([-5]);
// Should have writhe = -1 (inverted)

// ACT-D Distilled
const actD = new BraidWord([1, 2, -4]);
// Should be minimal and equivalent to ACT
```

---

## Understanding Invariants

### Invariant Tuple I(β) = (A, w, ℓ, M, P)

For `β = σ₁ · σ₂ · σ₁`:

```typescript
const beta = new BraidWord([1, 2, 1]);
const inv = beta.invariants();

inv.activeStrands       // {1, 2, 3} - affects strands 1, 2, 3
inv.writhe              // 3 - three positive crossings
inv.wordLength          // 3 - three generators
inv.generatorMultiset   // {1: 2, 2: 1} - σ₁ twice, σ₂ once
inv.patternClass        // [1, 2, 1] - the pattern
```

### Charge Calculation

**Formula:**
```
Q(β) = q₀ · w(β)  where q₀ is the topological quantum (default 1)
```

**Example:**
```
β = σ₁ · σ₂ · σ₁  →  w = 3  →  Q = 3q₀  (positive charge)
β = σ₁⁻¹ · σ₂⁻¹  →  w = -2  →  Q = -2q₀ (negative charge)
```

---

## Common Patterns

### Pattern 1: Create and Inspect a Braid

```typescript
import { BraidWord, BraidAlgebra } from "../src/topology/braid_algebra.ts";

const myBraid = new BraidWord([1, 2, -1]);
console.log(myBraid.toString());           // "σ₁ · σ₂ · σ₁⁻¹"
console.log(myBraid.invariants());         // Full invariant tuple
console.log(myBraid.charge(1));            // Topological charge
```

### Pattern 2: Reduce a Braid

```typescript
const complicated = new BraidWord([1, -1, 2, 2, -2]);
const reduced = complicated.reidemeisterReduce();
console.log(reduced.toString());           // Simplified form
```

### Pattern 3: Check Equivalence

```typescript
const braid1 = new BraidWord([1, 2, 1]);
const braid2 = new BraidWord([2, 1, 2]);
if (BraidAlgebra.equivalent(braid1, braid2)) {
  console.log("These braids are topologically the same!");
}
```

### Pattern 4: Verify Reversibility

```typescript
const original = new BraidWord([1, 2, 1]);
const inverse = BraidAlgebra.invert(original);
const restored = original.compose(inverse).reidemeisterReduce();

if (BraidAlgebra.isIdentity(restored)) {
  console.log("✓ Reversibility confirmed: β · β⁻¹ = ε");
}
```

### Pattern 5: Generate Commutators

```typescript
const sig1 = BraidAlgebra.generator(1);
const sig2 = BraidAlgebra.generator(2);
const commutator = BraidAlgebra.commutator(sig1, sig2);
console.log(commutator.toString());        // [σ₁, σ₂]
```

---

## Integration with Nephilim

### Using Braid Algebra in Your Code

The braid algebra is already integrated into the topological stack:

#### 1. In State Machine Transitions

```typescript
// src/reasoning/agent_machine_topological.ts (to implement)
import { BraidWord } from "../topology/braid_algebra.ts";

const cascade = new BraidWord([2, 3]);
const aegis = new BraidWord([-5]);
const currentBraid = cascade.compose(aegis).reidemeisterReduce();

// Use invariants for state determination
const charge = currentBraid.charge();
if (charge > 0.77) {
  // Trigger fault
}
```

#### 2. In R4 Tensor Mapping

```typescript
// config/exotic_r4.ts (to upgrade)
import { BraidWord } from "../topology/braid_algebra.ts";

function mapToR4(telemetry, currentBraid: BraidWord): R4Tensor {
  const inv = currentBraid.invariants();
  
  return {
    w: APERIODIC_HZ * PHI,
    x: inv.activeStrands.size / 3,      // Active strand density
    y: inv.patternClass.length * 0.618, // Pattern complexity
    z: inv.writhe * PHASE_DELTA,        // Writhe phase
    Qi: normalizeCharge(currentBraid.charge())
  };
}
```

#### 3. In BraidC Compiler

```typescript
// src/topology/braid_syntax.ts (to implement)
import { BraidWord, BraidAlgebra } from "./braid_algebra.ts";

class BraidCompiler {
  static compile(intent: string): BraidWord {
    switch (intent) {
      case "CONSTRUCT":
        return new BraidWord([2, 3]); // Cascade Core
      case "EXPLORE":
        return new BraidWord([1, 3]); // Far-commuting
      case "ABORT":
        return new BraidWord([-5]);   // Aegis Channel
      default:
        return BraidAlgebra.identity();
    }
  }
}
```

---

## Troubleshooting

### Issue: "Generator index out of range"

**Cause:** Generator index > 10 or < 1
**Solution:** Use valid indices 1-10 (or extend BraidAlgebra.generator())

```typescript
// ❌ Wrong
const bad = BraidAlgebra.generator(15);

// ✓ Correct
const good = BraidAlgebra.generator(5);
```

### Issue: Equivalence check returns false unexpectedly

**Cause:** Braids not fully reduced before comparison
**Solution:** Always reduce before equivalence checks

```typescript
// ❌ May fail
const result = BraidAlgebra.equivalent(beta1, beta2);

// ✓ Better
const result = BraidAlgebra.equivalent(
  beta1.reidemeisterReduce(),
  beta2.reidemeisterReduce()
);
```

### Issue: Link invariants seem wrong

**Cause:** Simplified polynomial implementation for toy model
**Solution:** This is intentional for fast computation; expand with full Burau representation if needed

---

## Next Steps

1. **Run the tests** to verify braid algebra works:
   ```bash
   deno test tests/braid_algebra_test.ts
   ```

2. **Study the MATHEMATICS.md** to understand mappings:
   - How braids map to R4 tensor
   - How ACT lineage works
   - How state machine uses topology

3. **Integrate into state machine**:
   - Wire braid invariants into R4 computation
   - Map state transitions to braid morphisms
   - Validate with Santos audit

4. **Implement E8 projection** (next phase):
   - Use braid invariants to select E8 region
   - Project cognition vectors to nearest root
   - Measure compression ratio

5. **Add Penrose/Tangram** (phase after):
   - Decompose each E8 cell into Penrose patches
   - Break patches into Tangram primitives
   - Implement sheaf consistency checks

---

## Reference: All 42 Tests at a Glance

| Test # | Category | Name | What It Validates |
|--------|----------|------|-------------------|
| 1-7 | Basics | BraidWord & Invariants | Creation, writhe, strands, multiset, pattern, charge |
| 8-12 | Reduction | Reidemeister | Identity collapse, cancellation, Type II, far-commutativity |
| 13-14 | Composition | Composition & Associativity | Chaining, associativity law |
| 15-17 | Inversion | Inversion & Reversibility | Proper inverses, double inversion, antisymmetry |
| 18-22 | Invariants | Link Polynomials | Alexander, Jones, linking number |
| 23-27 | Algebra | Operations | Equivalence, normal form, commutators, generators |
| 28-30 | Topology | Properties | Preservation under transforms, additivity, symmetry |
| 31-35 | ACT | Lineage | Cascade, Aegis, ACT-D, Tangram, sectors |
| 36-40 | Stress | Edge Cases | Long braids, alternating, high index, large writhe, mixed signs |
| 41-42 | Serialize | JSON | Export, round-trip |

---

## Quick Reference: Key Classes & Methods

### BraidWord

```typescript
// Creation
const beta = new BraidWord([1, 2, -1]);

// Inspection
beta.invariants(): BraidInvariant
beta.charge(q0?: number): number
beta.getGenerators(): number[]
beta.length(): number

// Transformation
beta.compose(other: BraidWord): BraidWord
beta.reidemeisterReduce(): BraidWord
beta.alexanderPolynomial(): AlexanderCoefficients
beta.jonesPolynomial(): JonesCoefficients
beta.linkingNumber(): number

// Display
beta.toString(): string
beta.toJSON(): object
```

### BraidAlgebra (Static Methods)

```typescript
// Equivalence & Properties
BraidAlgebra.equivalent(b1, b2): boolean
BraidAlgebra.isIdentity(b): boolean
BraidAlgebra.invert(b): BraidWord
BraidAlgebra.normalForm(b): BraidWord

// Creation
BraidAlgebra.generator(n): BraidWord
BraidAlgebra.identity(): BraidWord

// Operations
BraidAlgebra.commutator(b1, b2): BraidWord
```

---

**Version:** 1.0 (Vesper Production)  
**Last Updated:** 2026-07-24  
**Status:** ✅ Ready for integration
