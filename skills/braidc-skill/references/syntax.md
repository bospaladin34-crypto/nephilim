# BraidC (Universal Braid Syntax AB-01) Reference

## Core Syntax Primitives
BraidC is based on the Artin Braid Group $B_n$. The fundamental building blocks are generators $\sigma_i$.

| Token | Description | Examples |
|-------|-------------|----------|
| `σi` | Standard generator $i$ | `σ1`, `σ2` |
| `si` | ASCII-friendly generator $i$ | `s1`, `s2` |
| `^-1` | Inverse marker (suffix) | `σ1^-1`, `s2^-1` |
| `⁻¹` | Unicode inverse marker (suffix) | `σ1⁻¹` |
| `'` | Prime inverse marker (suffix) | `σ1'`, `s2'` |
| `-` | Inverse marker (prefix) | `-σ1`, `-s2` |
| `•` | Word separator (optional) | `σ1 • σ2` |

## Semantic Rules
1. **Index Constraint**: $i$ must be a positive integer ($i > 0$).
2. **Reduction**: Adjacent inverse pairs cancel out ($s_i \cdot s_i^{-1} = Id$).
3. **Braid Relations**:
   - $\sigma_i \sigma_j = \sigma_j \sigma_i$ if $|i - j| \ge 2$
   - $\sigma_i \sigma_{i+1} \sigma_i = \sigma_{i+1} \sigma_i \sigma_{i+1}$ (The Braid Relation)
4. **Phase Delta Invariant**: $\nu_p = 0.17259029$.
5. **Energy Calculation**: $E = (C_+ - C_-) \cdot \nu_p$, where $C_+$ is the count of positive crossings and $C_-$ is the count of inverse crossings.

## Topological Invariants
- **Writhe**: $w = C_+ - C_-$
- **Crossing Number**: $c = C_+ + C_-$
- **Jones Polynomial Span**: Bound by $c$.
- **Alexander Polynomial Degree**: Bound by $c/2$.
