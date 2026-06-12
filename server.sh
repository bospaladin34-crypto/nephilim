#!/data/data/com.termux/files/usr/bin/bash
while true; do
  echo -e "HTTP/1.1 200 OK\nContent-Type: application/json\n"
  read -r request
  text=$(echo "$request" | grep -o 'text=[^ ]*' | cut -d= -f2 | python3 -c "import sys,urllib.parse; print(urllib.parse.unquote(sys.stdin.read().strip()))")
  spec=$(cat .current_spec 2>/dev/null || echo "vesper.spec")
  # call your Rust core — adjust the binary name if different
  result=$(./core/target/release/nephilim --spec "$spec" --input "$text" 2>/dev/null || echo '{"S":"demo","T":"demo","E8":"demo"}')
  echo "$result"
done | nc -l -p 5000 -q 1
