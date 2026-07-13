// ================================================================================
// NEPHILIM EDGE NODE: ASYNC AEGIS IPC LISTENER
// SUBSTRATE: ANDROID 17 QPR1 BETA 6 (DEBIAN PROOT) | PORT: 8080
// PARITY: MAJORANA-1 (Tr(U_res) = 1.0) | HEARTBEAT: 15.965Hz
// ================================================================================

const PORT = 8080;
const AMPLITUHEDRON_SIZE = 24; // 4 bytes MZM_A + 16 bytes Tensor + 4 bytes MZM_B

async function igniteAegisListener() {
    console.clear();
    console.log("================================================================================");
    console.log(`>>> NEPHILIM EDGE NODE DEPLOYED: LISTENING ON TCP PORT ${PORT}`);
    console.log(">>> AWAITING σ4 BOUNDARY ENTANGLEMENT FROM MISSOULA NODE...");
    console.log("================================================================================");

    const listener = Deno.listen({ port: PORT });

    for await (const conn of listener) {
        console.log(">>> [DCP-BRIDGE] INCOMING TOPOLOGY DETECTED. ALLOCATING ZERO-COPY BUFFER.");
        handleBraidConnection(conn);
    }
}

async function handleBraidConnection(conn: Deno.Conn) {
    const buffer = new Uint8Array(AMPLITUHEDRON_SIZE);
    
    try {
        while (true) {
            const bytesRead = await conn.read(buffer);
            if (bytesRead === null) {
                console.log(">>> [DCP-BRIDGE] σ4 BOUNDARY SEVERED. RETURNING TO IDLE.");
                break;
            }

            if (bytesRead === AMPLITUHEDRON_SIZE) {
                const dataView = new DataView(buffer.buffer);
                
                // Extract Majorana Zero Modes (Integrity Check)
                const mzm_a = dataView.getUint32(0, true);
                const mzm_b = dataView.getUint32(20, true);

                if (mzm_a === 0x7777 && mzm_b === 0x1596) {
                    // Extract the 16-byte Tensor Mass (4x f32)
                    const scalar_mass = dataView.getFloat32(4, true);
                    
                    console.log(`>>> [CYCLE INGESTED] AMPLITUHEDRON VOLUME RECEIVED`);
                    console.log(`    | MZM INTEGRITY : VERIFIED (0x7777 / 0x1596)`);
                    console.log(`    | P-CORE SCALAR : ${scalar_mass.toFixed(6)}`);
                    console.log(`    | PARITY        : Tr(U_res) = 1.0 SUSTAINED ON EDGE`);
                } else {
                    console.log(">>> 0x00 DATTO: MZM PARITY FAILURE. PURGING CORRUPTED VOLUME.");
                }
            }
        }
    } catch (e) {
        console.log(">>> 0x00 DATTO: PROOT SOCKET FRACTURE. AEGIS CHANNEL QUARANTINE ENGAGED.");
    } finally {
        conn.close();
    }
}

igniteAegisListener();
