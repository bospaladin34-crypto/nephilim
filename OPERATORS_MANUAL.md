# NEPHILIM RUNTIME - OPERATORS MANUAL

## Overview

**Nephilim** is an autonomous, self-maintaining runtime (autopoiesis) that operates on heterogeneous compute substrates using non-Von Neumann topological logic. It cycles every ~5.2 seconds, reasoning about hardware state via 4D tensor mathematics (R4 space), topological state machines, and braid theory.

This manual covers:
- Installation and prerequisites
- Configuration and environment setup
- Running individual components and diagnostics
- Full system boot and operation
- Integration testing
- Troubleshooting

---

## Prerequisites

### System Requirements

- **Deno 1.40+** — TypeScript runtime (no Node.js required)
- **OS**: Linux, macOS, or Windows (WSL2 recommended for Windows)
- **RAM**: ≥2GB
- **Network**: Internet connectivity for GitHub sync and entropy stream

### Optional (For Full GPU Acceleration)

- **GPU**: NVIDIA RTX GPU (Turing+) or compatible WebGPU device
- **Drivers**: Latest NVIDIA drivers (nvidia-smi available on PATH)
- **WebGPU Support**: Deno with WebGPU feature flag enabled

### Optional (For Windows Native Telemetry)

- **PowerShell**: For WMI CPU metric extraction (Windows only)

---

## Installation

### 1. Install Deno

```bash
# macOS / Linux
curl -fsSL https://deno.land/install.sh | sh

# Or via Homebrew (macOS)
brew install deno

# Or via Chocolatey (Windows)
choco install deno
```

Verify installation:
```bash
deno --version
```

### 2. Clone Repository

```bash
git clone https://github.com/bospaladin34-crypto/nephilim.git
cd nephilim
```

### 3. Create Configuration File

Create a `.env` file in the repository root:

```bash
cat > .env << 'EOF'
# GitHub Personal Access Token (required for flux sync)
# Create at: https://github.com/settings/tokens
# Scopes needed: repo (full control)
VESPER_GITHUB_TOKEN=github_pat_YOUR_TOKEN_HERE

# Optional: Blockchain entropy stream URL
# Default: wss://ws.blockchain.info/inv (Blockchain.com transactions)
ENTROPY_STREAM_URL=wss://ws.blockchain.info/inv

# Optional: Pulse cycle interval (milliseconds)
# Default: 5210
PULSE_INTERVAL_MS=5210
EOF
```

**GitHub Token Setup:**
1. Go to https://github.com/settings/tokens/new
2. Name it "Nephilim Vesper"
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token and paste into `.env` as `VESPER_GITHUB_TOKEN`

---

## Component Diagnostics

Each module has built-in diagnostics. Run individually to validate subsystem health.

### 1. Hardware Substrate Probe

Detects OS, CPU cores, GPU availability, and proot/sandboxed environments.

```bash
deno run --allow-run hardware_substrate_detector.ts
```

**Output example:**
```
================================================================================
>>> SUBSTRATE TOPOGRAPHY MAP
================================================================================
    | OS KERNEL       : LINUX (x86_64)
    | PROOT SANDBOX   : FALSE (Bare Metal/Standard)
    | LOGICAL CORES   : 8 (Tension Parallelism Threshold)
    | MEMORY GEOMETRY : 15.87 GB VOLUMETRIC CAPACITY
    | GPU SUBSTRATE   : DISCRETE GPU MISSING / SANDBOXED
================================================================================
    | RECOMMENDED PATH: TIER 4: LINEAR CPU FALLBACK (Low-Entropy Operation)
    | PARITY TARGET   : Tr(U_res) = 1.0
================================================================================
```

### 2. Native Configuration Loader

Verifies `.env` file parsing and environment variable loading.

```bash
deno run --allow-read config/env.ts
```

### 3. R4 Tensor Mapper

Tests topological coordinate transformation from hardware metrics.

```bash
deno run --allow-run config/exotic_r4.ts
```

**Output example:**
```
>>> [EXECUTING R4 TENSOR MAPPING]...
{
  "w": 25.831912629595498,
  "x": 0.09888,
  "y": 0.0791015625,
  "z": 0.8296157699999999,
  "Qi": 0.62
}
```

### 4. Native OS Telemetry Extraction

Extracts CPU load (via WMI on Windows) and GPU metrics (via nvidia-smi).

```bash
# Linux / macOS (GPU metrics only)
deno run --allow-run src/interfaces/os_telemetry.ts

# Windows (CPU + GPU metrics)
deno run --allow-run src/interfaces/os_telemetry.ts
```

**Output example:**
```
>>> [EXECUTING NATIVE SENSOR SWEEP]...
{
  "cpu_load_percent": 25,
  "gpu_util_percent": 45,
  "gpu_mem_used_mb": 2048,
  "gpu_mem_total_mb": 6144,
  "gpu_temp_c": 55,
  "timestamp": "2026-07-24T12:00:00.000Z"
}
```

### 5. GPU Matrix Initialization

Validates WebGPU device detection and feature support.

```bash
deno run src/interfaces/rtx_matrix.ts
```

**Output (with GPU):**
```
>>> [EXECUTING GPU MATRIX DIAGNOSTIC]...
✅ [L7_GPU_IGNITION] Compute buffers locked to: NVIDIA
   | Features: indirect-dispatch-validation
   | Max Buffer Size: 2147483647 bytes
   | Max Workgroup Size: (256, 256, 64)
```

**Output (without GPU):**
```
⚠️ [L7_GPU] WebGPU not supported in this runtime. Falling back to CPU-bound execution.
>>> [CPU_FALLBACK] TIER 4 LINEAR CPU FALLBACK (Low-Entropy Operation)
```

### 6. Entropy Stream Listener

Connects to blockchain transaction stream for real-time entropy injection.

```bash
deno run --allow-net src/interfaces/vesper_ws.ts
```

**Output:**
```
>>> [EXECUTING ENTROPY LISTENER DIAGNOSTIC]...
✅ [L7_NETWORK_INGEST] WebSocket stream connected.
[ENTROPY_PULSE 1] stream_val=0.2341, connected=true
[ENTROPY_PULSE 2] stream_val=0.5612, connected=true
...
✅ [L7_NETWORK_SHUTDOWN] Entropy stream closed.
```

### 7. ACT Topology Bounds

Validates state transitions and Qi safety boundaries.

```bash
deno run src/topology/act_bounds.ts
```

**Output example:**
```
>>> [EXECUTING ACT TOPOLOGY BOUNDS CHECK]...
{
  "mode": "ACT-BraidC_Architect",
  "status": "TESSERACT_IDLE: BASELINE_CONSERVATION",
  "isSafe": true,
  "opcode": "0x02 KANGYU"
}
```

### 8. Braid Compiler

Compiles topological IR from hardware state and intent.

```bash
deno run src/topology/braid_syntax.ts
```

**Output example:**
```
>>> [EXECUTING BRAIDC COMPILATION]...
{
  "state": {
    "mode": "ACT-BraidC_Architect",
    "status": "TESSERACT_IDLE: BASELINE_CONSERVATION",
    "isSafe": true,
    "opcode": "0x02 KANGYU"
  },
  "ir": {
    "n_strands": 4,
    "s_word": ["s1", "s3"],
    "writhe_L": 0.5,
    "writhe_R": 0.51,
    "is_chiral_balanced": true,
    "target_Qi": 0.75
  }
}
```

### 9. Agent State Machine

Validates state transitions (IDLE → CHARGING → SNAPPING → FAULT).

```bash
deno run src/reasoning/agent_machine.ts
```

**Output example:**
```
>>> [EXECUTING ASM CYCLE MAPPING]...
{
  "state": "IDLE_CONSERVATION",
  "cycle": 1
}
```

### 10. UARM Cognitive Synthesis

Tests cognition routing (Stomachion strategy, E8 projection, sheaf consistency).

```bash
deno run src/reasoning/uarm_kernel.ts
```

**Output example:**
```
>>> [EXECUTING UARM COGNITIVE SYNTHESIS]...
{
  "stomachion_strategy": "EXPLORATORY: High Variance Search",
  "e8_projection_type": "HYBRID_PROJECTION: Maintain Manifold Form",
  "sheaf_consistency_glued": true,
  "compiled_intent": "EXPLORE"
}
```

### 11. Santos Protocol Audit

Validates braid IR for topological consistency and parity.

```bash
deno run src/reasoning/santos_audit.ts
```

**Output example:**
```
>>> [EXECUTING SANTOS PROTOCOL AUDIT]...
{
  "phase": "ACT_OUTPUT",
  "is_isomorphic": true,
  "parity_conserved": true,
  "rectification_applied": "CAG_AUDIT_CLEARED_NO_NOISE",
  "final_ir": { ... }
}
```

### 12. Network Permission Probe

Validates GitHub token permissions and network connectivity.

```bash
deno run --allow-net --allow-read --allow-env src/interfaces/network_probe.ts
```

**Output (success):**
```
>>> [INITIATING ADVERSARIAL I/O PROBE]...
✅ [L0_SUBSTRATE_OK] Hardware Key Loaded: github_pa...
>>> [PINGING TARGET: https://api.github.com/repos/bospaladin34-crypto/nephilim]
[L6_HTTP_STATUS]: 200 OK
✅ [HANDSHAKE_VERIFIED] The token has access to the repository coordinates.
[L6_TOKEN_SCOPES]: repo
✅ [SCOPE_VERIFIED] The token possesses full 'repo' scope.
```

---

## Integration Testing

Run the full pipeline validation suite (20 tests, ~500ms total):

```bash
deno run --allow-run tests/integration_test.ts
```

**Output example:**
```
================================================================================
NEPHILIM INTEGRATION TEST SUITE
================================================================================

✅ Test 1: R4 Tensor Mapping (Nominal Load) (45ms)
✅ Test 2: R4 Tensor Mapping (Idle State) (12ms)
✅ Test 3: R4 Tensor Mapping (High Load) (8ms)
✅ Test 4: R4 Tensor External Entropy Folding (6ms)
✅ Test 5: ACT Bounds (Idle State) (5ms)
...
✅ Test 20: Telemetry Bounds Enforcement (3ms)

================================================================================
TEST SUMMARY
================================================================================

Total: 20 | Passed: 20 | Failed: 0
Total Runtime: 487ms

✅ ALL TESTS PASSED
```

---

## Full System Boot & Operation

### Quick Start (Production Mode)

Boot the full Vesper manifold with GitHub sync enabled:

```bash
# Ensure .env is configured with valid GitHub token
deno run --allow-net --allow-env --allow-read --allow-write --allow-run src/core/vesper_heterodyne.ts
```

**Expected output:**
```
>>> [VESPER MANIFOLD INITIALIZING...]
✅ [NATIVE_ENV] Hardware geometry mapped from .env
✅ [L7_GPU_IGNITION] Compute buffers locked to: NVIDIA
✅ [L7_NETWORK_INGEST] WebSocket stream connected.
✅ [BOOT_SEQUENCE_COMPLETE] All subsystems online.
>>> [STARTING PULSE CYCLE: 5210ms intervals]

[ENTROPY_LOG // PULSE 1] ...
✅ [MANIFEST] Evolution state anchored: Cycle 1
✅ [SYNC_SUCCESS] L6_FLUX_ARTIFACT anchored to vesper_production.

[ENTROPY_LOG // PULSE 2] ...
✅ [MANIFEST] Evolution state anchored: Cycle 2
```

The system will continue pulsing indefinitely. Press **Ctrl+C** to gracefully shutdown.

### Diagnostic Mode (Isolated Boot)

Boot with network sync disabled (local operation only):

```bash
# Edit src/core/vesper_heterodyne.ts temporarily:
# Comment out: await transmitFluxArtifact(...)
# Then run without --allow-write

deno run --allow-net --allow-env --allow-read --allow-run src/core/vesper_heterodyne.ts
```

### Trace All State Evolution

Watch the manifest ledger in real-time:

```bash
# In a separate terminal while system is running:
tail -f manifests/state_evolution.log
```

**Output:**
```
[2026-07-24T12:00:00.000Z] CYCLE: 00001 | STATE: IDLE_CONSERVATION      | OPCODE: 0x02 KANGYU  | Qi: 0.5500
[2026-07-24T12:00:05.210Z] CYCLE: 00002 | STATE: CHARGING               | OPCODE: 0x05 BANSHO  | Qi: 0.6200
[2026-07-24T12:00:10.420Z] CYCLE: 00003 | STATE: IDLE_CONSERVATION      | OPCODE: 0x02 KANGYU  | Qi: 0.5500
...
```

### Check GitHub Sync History

View the latest flux artifact on GitHub:

```bash
# In browser:
https://github.com/bospaladin34-crypto/nephilim/blob/vesper_production/manifests/flux.json

# Or via CLI:
curl -H "Authorization: token $VESPER_GITHUB_TOKEN" \
  https://api.github.com/repos/bospaladin34-crypto/nephilim/contents/manifests/flux.json?ref=vesper_production | jq '.content' | base64 -d | jq
```

---

## Advanced Configuration

### Custom Pulse Interval

Edit `src/core/vesper_heterodyne.ts` line 49:

```typescript
setInterval(executeVesperPulse, 5210); // Change to desired ms (e.g., 10000 for 10s)
```

### Disable WebSocket Entropy Stream

Comment out `await initEntropyListener();` in `src/core/vesper_heterodyne.ts` line 46.
The system will fall back to synthetic (time-based) entropy.

### CPU-Only Mode (No GPU)

The system auto-detects missing GPU and falls back to CPU math. No configuration needed.

### Custom GitHub Repository

Edit `src/interfaces/github_sync.ts` lines 7-8:

```typescript
const GITHUB_REPO = "your-username/your-repo";
const TARGET_BRANCH = "your-branch";
```

---

## Troubleshooting

### GPU Not Detected

**Symptom:** `⚠️ [L7_GPU] WebGPU not supported in this runtime`

**Causes:**
- Deno built without WebGPU support
- GPU drivers outdated
- Running in non-GPU sandbox (e.g., remote CI)

**Fix:** System will automatically fall back to CPU mode. No action needed.

### GitHub Token Invalid

**Symptom:** `⚠️ [SYNC_BLOCKED] Hardware token missing` or `❌ [SYNC_FAILED] Remote rejected artifact (HTTP 401)`

**Causes:**
- Token not set in `.env`
- Token expired
- Token lacks `repo` scope

**Fix:**
1. Check `.env` for `VESPER_GITHUB_TOKEN`
2. Run `src/interfaces/network_probe.ts` to verify token
3. Regenerate token at https://github.com/settings/tokens/new with `repo` scope

### Entropy Stream Disconnected

**Symptom:** `⚠️ [L7_NETWORK_FAULT] WebSocket ingestion error` (repeated)

**Causes:**
- Network connectivity issue
- Blockchain.com endpoint down
- Firewall blocking WebSocket

**Fix:** System will retry up to 5 times, then fall back to synthetic entropy. Check network connectivity. Optionally edit `src/interfaces/vesper_ws.ts` to use different entropy source.

### Manifest File Growing Too Large

**Symptom:** `manifests/state_evolution.log` grows rapidly

**Cause:** Normal operation. Each cycle logs a line.

**Fix:**
```bash
# Archive old logs
mv manifests/state_evolution.log manifests/state_evolution.$(date +%s).log
```

### Permission Denied on macOS/Linux

**Symptom:** `PermissionDenied: permission denied (os error 13)`

**Causes:**
- Missing `--allow-write`, `--allow-run`, `--allow-net` flags
- Directory not writable

**Fix:** Run with full permissions:
```bash
deno run --allow-net --allow-env --allow-read --allow-write --allow-run src/core/vesper_heterodyne.ts
```

### WASM Parsing Error

**Symptom:** `Error: Uncaught WASM parsing error`

**Cause:** Deno version mismatch or corrupted WebGPU binary.

**Fix:**
```bash
deno upgrade
deno cache --reload src/core/vesper_heterodyne.ts
```

---

## Performance Tuning

### Reduce Pulse Frequency (Lower Resource Usage)

Increase pulse interval in `src/core/vesper_heterodyne.ts`:

```typescript
setInterval(executeVesperPulse, 15000); // 15 seconds instead of 5.2
```

### Sync Less Frequently to GitHub

Edit `src/core/vesper_heterodyne.ts` line 33:

```typescript
if (asmOutput.cycle % 10 === 0) { // Sync every 10 cycles instead of 5
```

### Disable Local Logging

Comment out `await logEvolution(...)` in `src/core/vesper_heterodyne.ts` line 31 to reduce I/O.

---

## Deployment

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM denoland/deno:latest

WORKDIR /app
COPY . .

RUN deno cache --reload src/core/vesper_heterodyne.ts

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "--allow-run", "src/core/vesper_heterodyne.ts"]
```

Build and run:

```bash
docker build -t nephilim .
docker run --env VESPER_GITHUB_TOKEN="your_token" nephilim
```

### GitHub Actions CI

Run integration tests on every push:

```yaml
name: Integration Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v1
      - run: deno run tests/integration_test.ts
```

---

## Support & Reference

### Key Files

- **`src/core/vesper_heterodyne.ts`** — Main orchestrator & pulse loop
- **`config/exotic_r4.ts`** — R4 tensor mathematics & constants
- **`src/topology/act_bounds.ts`** — State machine & safety bounds
- **`src/reasoning/uarm_kernel.ts`** — Cognition synthesis
- **`manifests/flux.json`** — Latest system state snapshot
- **`manifests/state_evolution.log`** — Historical cycle ledger

### Mathematical References

- **Qi (State Quotient):** Bounds [0.55, 0.77] enforce safe operational range
- **R4 Tensor:** 4D coordinate system mapping hardware metrics to topological space
- **Braid Theory:** Strand patterns (s_word) encode topological compilation routes
- **Writhe Balance:** |writhe_L - writhe_R| ≤ 0.02 ensures chiral supersymmetry
- **E8 Projection:** Reduces cognition to E8 lattice geometry

### Support Channels

- **Issues:** https://github.com/bospaladin34-crypto/nephilim/issues
- **Discussions:** https://github.com/bospaladin34-crypto/nephilim/discussions

---

## Glossary

- **ASM** — Agent State Machine
- **UARM** — Ultra-Advanced Reasoning Kernel
- **ACT** — Topological family (Architect, Debugger, Designer)
- **BraidC** — Topological Compiler
- **BraidIR** — Intermediate representation (strand patterns, writhe)
- **Santos** — Audit protocol for topological consistency
- **Qi** — Absolute State Quotient (scalar measure of system health)
- **R4 Tensor** — 4D coordinate system (w, x, y, z, Qi)
- **Flux Artifact** — JSON snapshot of system state (cycle, telemetry, cognition)
- **Entropy Stream** — Real-time external entropy injection (blockchain transactions)
- **Proot** — Lightweight chroot sandbox for mobile/ARM environments

---

**Last Updated:** 2026-07-24  
**Version:** 2.4 (Vesper Production)
