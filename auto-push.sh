#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/nephilim
echo "→ committing as bospaladin34-crypto..."
git add nephilim server.py .current_spec fix-nephilim.sh
git commit -m "auto: $(date '+%Y-%m-%d %H:%M') - spec $(cat .current_spec 2>/dev/null || echo nephilim)" || echo "nothing to commit"
git push origin master
echo "✓ pushed to github.com/bospaladin34-crypto/nephilim"
