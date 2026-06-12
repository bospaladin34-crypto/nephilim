#!/data/data/com.termux/files/usr/bin/bash
set -e
export GIT_AUTHOR_NAME="bospaladin34-crypto"
export GIT_AUTHOR_EMAIL="bospaladin34-crypto@users.noreply.github.com"
export GIT_COMMITTER_NAME="bospaladin34-crypto"
export GIT_COMMITTER_EMAIL="bospaladin34-crypto@users.noreply.github.com"

cd ~/nephilim
git add -A
git commit -m "sync core: $(date +%H:%M)" || true
git push origin master

cd /storage/emulated/0/Download/vesper-extracted
git add -A
git commit -m "sync app: $(date +%H:%M)" || true
git push origin main || git push origin master

echo "✓ both repos pushed as bospaladin34-crypto"
