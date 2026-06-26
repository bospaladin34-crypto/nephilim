import sys

class BraidCCompiler:
    def __init__(self):
        self.phase_delta = 0.17259029

    def abt_parse(self, source_code: str):
        """Phase 1: Abstract Braid Tree Parsing"""
        tokens = []
        for line in source_code.strip().split('\n'):
            parts = line.strip().split()
            if not parts or parts[0].startswith("//"): continue
            op = parts[0].upper()
            if op in ["TWIST", "INVERT"]:
                tokens.append((op, int(parts[1])))
            elif op in ["POLYTOPE", "ENTANGLE", "COLLAPSE"]:
                tokens.append((op, parts[1] if len(parts) > 1 else None))
        return tokens

    def reidemeister_optimize(self, tokens):
        """Phase 2: Algebraic reduction of σ_i · σ_i⁻¹ loops"""
        optimized = []
        for tok in tokens:
            if not optimized:
                optimized.append(tok)
                continue
            prev_op, prev_val = optimized[-1]
            curr_op, curr_val = tok
            
            # If same strand index and inverse operations, cancel out (Reidemeister I/II reduction)
            if (prev_val == curr_val and 
                ((prev_op == "TWIST" and curr_op == "INVERT") or 
                 (prev_op == "INVERT" and curr_op == "TWIST"))):
                optimized.pop()
            else:
                optimized.append(tok)
        return optimized

    def compute_invariants(self, tokens):
        """Phase 3: Topological Invariant Verification"""
        writhe = 0
        crossings = 0
        net_phase = 0.0
        for op, val in tokens:
            if op == "TWIST":
                writhe += 1
                crossings += 1
                net_phase += self.phase_delta
            elif op == "INVERT":
                writhe -= 1
                crossings += 1
                net_phase -= self.phase_delta
        return {"Writhe": writhe, "Total Crossings": crossings, "Net Phase Shift": round(net_phase, 6)}

    def lower_to_microcode(self, tokens):
        """Phase 4: Translate to hardware-agnostic microcode instructions"""
        trace = []
        for idx, (op, val) in enumerate(tokens):
            addr = f"{idx*10:04d}"
            if op == "TWIST":
                trace.append(f"{addr} SHL_PHASE idx:{val} d:{self.phase_delta}")
            elif op == "INVERT":
                trace.append(f"{addr} SHR_PHASE idx:{val} d:-{self.phase_delta}")
            elif op == "POLYTOPE":
                trace.append(f"{addr} ALLOC_E8_N filter:\"{val}\"")
            elif op == "ENTANGLE":
                trace.append(f"{addr} INV_MANIFL state:ENTANGLED")
            elif op == "COLLAPSE":
                trace.append(f"{addr} SANTOS_ROT op:COLLAPSE")
        return trace

# Real-time Testing Harness
if __name__ == "__main__":
    test_program = """
    TWIST 2
    TWIST 3
    TWIST 5
    INVERT 5
    INVERT 5
    POLYTOPE 24-CELL
    ENTANGLE
    COLLAPSE
    """
    compiler = BraidCCompiler()
    raw_tokens = compiler.abt_parse(test_program)
    opt_tokens = compiler.reidemeister_optimize(raw_tokens)
    invariants = compiler.compute_invariants(opt_tokens)
    microcode = compiler.lower_to_microcode(opt_tokens)
    
    print("--- [TOPOLOGICAL COMPILER OUTPUT] ---")
    print(f"Invariants Calculated: {invariants}")
    print("\nLowered Hardware-Agnostic Microcode Trace:")
    for line in microcode:
        print(line)
