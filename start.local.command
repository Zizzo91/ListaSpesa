#!/bin/bash
# Lista Spesa — anteprima locale. Apre il browser su http://localhost:8756
cd "$(dirname "$0")" || exit 1
PORT=8756
echo "Lista Spesa → http://localhost:$PORT"
( sleep 1 && open "http://localhost:$PORT" ) &
python3 -m http.server "$PORT"
