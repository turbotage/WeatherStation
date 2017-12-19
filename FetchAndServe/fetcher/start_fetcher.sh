until python fetcher.py; do
    echo "Fetcher 'fetcher.py' crashed with exit code $?. Respawning.." >&2
    sleep 1
done