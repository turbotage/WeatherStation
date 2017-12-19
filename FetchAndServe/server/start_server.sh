until node server.js; do
    echo "Server 'server.js' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done