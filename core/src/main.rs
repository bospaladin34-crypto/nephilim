use nephilim_core::{manifold_info, generate_points};
use std::env;
use std::fs;
mod latent;
mod penrose;

fn main(){
    let args: Vec<String> = env::args().collect();

    if args.len() > 1 && args[1] == "penrose" {
        let phrase = args[2..].join(" ");
        let word = if phrase.is_empty() { "consciousness".to_string() } else { phrase };
        let words: Vec<&str> = word.split_whitespace().collect();
        let mut h: u32 = 0;
        for w in &words { h = h.wrapping_add(w.bytes().fold(0u32, |a,b| a.wrapping_mul(31).wrapping_add(b as u32))); }
        let s_idx = (h as usize) % 536;
        let t_idx = ((h >> 8) as usize) % 1600;
        let e8_root = ((h as f64 * 0.17259029) % 240.0) as u16;
        let svg = penrose::draw_penrose(&word, e8_root, s_idx, t_idx);
        let safe = word.replace(" ", "_").chars().filter(|c| c.is_alphanumeric() || *c=='_').collect::<String>();
        let filename = format!("/sdcard/Download/nephilim_{}.svg", safe);
        fs::write(&filename, svg).unwrap();
        println!("✓ {} → S{} T{} E8:{} ({} words)", filename, s_idx, t_idx, e8_root, words.len());
        return;
    }

    if args.len() > 1 && args[1] == "gallery" {
        let dir = "/sdcard/Download";
        let mut files: Vec<_> = fs::read_dir(dir).unwrap().filter_map(|e| {
            let p = e.ok()?.path();
            if p.extension()? == "svg" && p.file_name()?.to_str()?.starts_with("nephilim_") {
                Some(p)
            } else { None }
        }).collect();
        files.sort_by_key(|p| p.metadata().unwrap().modified().unwrap());
        files.reverse();

        let mut html = String::from("<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Nephilim Gallery</title><style>body{background:#0a0a0f;color:#eee;font-family:monospace;margin:0;padding:16px}h1{text-align:center;font-size:18px}.grid{display:grid;gap:18px;max-width:700px;margin:auto}.card{background:#111;padding:12px;border-radius:12px;text-align:center}svg,img{width:100%;height:auto;border-radius:8px}.l{font-size:11px;color:#888;margin-top:6px}</style></head><body><h1>VESPER-01 • νₚ=0.17259029</h1><div class='grid'>");
        for p in files.iter().take(20) {
            let name = p.file_stem().unwrap().to_str().unwrap().replace("nephilim_", "").replace("_", " ");
            let svg = fs::read_to_string(p).unwrap_or_default();
            html.push_str(&format!("<div class='card'>{}</div>", svg));
            html.push_str(&format!("<div class='l'>{}</div>", name));
        }
        html.push_str("</div></body></html>");
        let out = "/sdcard/Download/nephilim_gallery.html";
        fs::write(out, html).unwrap();
        println!("✓ Gallery updated: {} ({} items)", out, files.len().min(20));
        return;
    }

    if args.len() > 1 && args[1] == "latent" {
        let word = args[2..].join(" ");
        let word = if word.is_empty() { "consciousness".to_string() } else { word };
        let s = latent::Stomachion::new(); let t = latent::Tangram::new();
        println!("{}", latent::map_semantic_to_puzzle(&word, &s, &t));
        return;
    }

    println!("{}", manifold_info());
}
