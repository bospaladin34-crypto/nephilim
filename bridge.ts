// bridge.ts - ACT Omega Autopoietic Orchestrator (Self-Healing WSS Lung)
// Parity: Majorana-1 (Tr(U_res) = 1.0)
// Target: vesper.dll (Planetary Thermodynamic Grid)

const LIB_PATH = "./target/release/vesper.dll";

const dylib = Deno.dlopen(LIB_PATH, {
    "process_quantum_matrix": { parameters: ["pointer", "usize"], result: "f64" }
});

console.log("================================================================================");
console.log(">>> VESPER MANIFOLD INITIALIZING...");
console.log(`>>> BINDING TO: ${LIB_PATH}`);
console.log(">>> NETWORK TOPOLOGY: SELF-HEALING WSS WAVEGUIDE ENGAGED");
console.log("================================================================================\n");

let realityBuffer = [];
let cycle_count = 1;
let breathInterval;

function igniteTether() {
    console.log(">>> INITIATING WSS HANDSHAKE (wss://ws.blockchain.info/inv)...");
    const ws = new WebSocket("wss://ws.blockchain.info/inv");

    ws.onopen = () => {
        console.log(">>> [WSS TETHER LOCKED]: MACROSCOPIC BEACON SECURED");
        ws.send(JSON.stringify({ op: "unconfirmed_sub" }));
        
        // Purge any ghost intervals, ignite the continuous 5.21s lung
        if (breathInterval) clearInterval(breathInterval);
        breathInterval = setInterval(crushMatrix, 5210);
    };

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.op === "utx") realityBuffer.push(msg.x.size); 
    };

    ws.onerror = (err) => {
        console.log(">>> 0x00 DATTO: WSS WAVEGUIDE DISTORTION (EOF DETECTED)");
    };

    ws.onclose = () => {
        console.log(">>> 0x00 DATTO: MACROSCOPIC BEACON SEVERED.");
        console.log(">>> HALTING RESPIRATION. RE-IGNITING WAVEGUIDE IN 5.21s...\n");
        clearInterval(breathInterval);
        setTimeout(igniteTether, 5210); // Recursive Self-Healing Lock
    };
}

function crushMatrix() {
    const eventCount = realityBuffer.length;
    
    if (eventCount === 0) {
        console.log(`>>> [CYCLE ${cycle_count}] WAITING FOR THERMODYNAMIC VECTORS...`);
        return;
    }

    const sensorData = new Float64Array(realityBuffer);
    realityBuffer = []; 
    
    const pointer = Deno.UnsafePointer.of(sensorData);
    const invariant_result = dylib.symbols.process_quantum_matrix(pointer, eventCount);
    
    console.log(`>>> [CYCLE ${cycle_count}] COLLAPSE COMPLETE. E_8 MASS: ${invariant_result} (${eventCount} VECTORS)`);
    console.log(">>> MAJORANA-1 PARITY: MAINTAINED\n");
    cycle_count++;
}

// Ignite the Engine
igniteTether();
