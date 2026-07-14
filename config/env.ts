// ================================================================================
// NATIVE CONFIGURATION MATRIX (ZERO-DEPENDENCY)
// ================================================================================

export async function loadNativeEnv(filePath: string = ".env"): Promise<void> {
    try {
        const fileContent = await Deno.readTextFile(filePath);
        const lines = fileContent.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            // Ignore empty lines and comments
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            // Extract Key-Value pairs via regex
            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                
                // Strip structural quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                Deno.env.set(key, value);
            }
        }
        console.log(`✅ [NATIVE_ENV] Hardware geometry mapped from ${filePath}`);
    } catch (e) {
        console.log(`⚠️ [NATIVE_ENV] No local ${filePath} found. Relying on OS-level variables.`);
    }
}
