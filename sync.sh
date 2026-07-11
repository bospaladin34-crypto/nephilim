#!/bin/bash
CYCLE=$(tail -n 1 autopoietic_evolution_log.ts | awk "{print \$NF}")
cat << EOF > README.md
# ACT-Ω Networked Mesh Runtime Environment
- **Active Cycle:** $CYCLE
- **Last Sync:** $(date)
EOF
git add README.md
git commit -m "ACT-Ω: Heartbeat Sync [Pulse: $CYCLE]"
git push -f origin master
