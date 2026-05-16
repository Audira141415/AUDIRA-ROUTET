# Docker

Run Audira Route in a container. Published image: [`decolua/audira-route`](https://hub.docker.com/r/decolua/audira-route) — multi-platform `linux/amd64` + `linux/arm64`.

---

# 👤 For Users

## Quick start

```bash
docker run -d \
  -p 20128:20128 \
  -v "$HOME/.audira-route:/app/data" \
  -e DATA_DIR=/app/data \
  --name audira-route \
  decolua/audira-route:latest
```

App listens on port `20128`. Open: http://localhost:20128

## Manage container

```bash
docker logs -f audira-route        # view logs
docker stop audira-route           # stop
docker start audira-route          # start again
docker rm -f audira-route          # remove
```

## Data persistence

```bash
-v "$HOME/.audira-route:/app/data" \
-e DATA_DIR=/app/data
```

Without `DATA_DIR`, the app falls back to `~/.audira-route/` (macOS/Linux) or `%APPDATA%\audira-route\` (Windows). In the container, `DATA_DIR=/app/data` makes the bind mount work.

Data layout under `$DATA_DIR/`:

```text
$DATA_DIR/
├── db/
│   ├── data.sqlite       # main SQLite database
│   └── backups/          # auto backups
└── ...                   # certs, logs, runtime configs
```

Host path: `$HOME/.audira-route/db/data.sqlite`
Container path: `/app/data/db/data.sqlite`

## Optional env vars

```bash
docker run -d \
  -p 20128:20128 \
  -v "$HOME/.audira-route:/app/data" \
  -e DATA_DIR=/app/data \
  -e PORT=20128 \
  -e HOSTNAME=0.0.0.0 \
  -e DEBUG=true \
  --name audira-route \
  decolua/audira-route:latest
```

## Update to latest

```bash
docker pull decolua/audira-route:latest
docker rm -f audira-route
# re-run the quick start command
```

---

# 🛠 For Developers

## Build image locally (test)

```bash
cd app && docker build -t audira-route .

docker run --rm -p 20128:20128 \
  -v "$HOME/.audira-route:/app/data" \
  -e DATA_DIR=/app/data \
  audira-route
```

## Publish (automatic via CI)

Push a git tag `v*` → GitHub Actions builds multi-platform (amd64+arm64) and pushes to:
- `ghcr.io/decolua/audira-route:v{version}` + `:latest`
- `decolua/audira-route:v{version}` + `:latest`

```bash
# Use scripts/release.js (recommended)
node scripts/release.js "Release title" "Notes"

# Or manually
git tag v0.4.x && git push origin v0.4.x
```

Workflow: `app/.github/workflows/docker-publish.yml`
