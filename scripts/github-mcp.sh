#!/usr/bin/env bash
# Run GitHub's official MCP server against this repo.
# Token order: GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_TOKEN, then `gh auth token`.
set -euo pipefail

cd "$(dirname "$0")/.."

VERSION="${GITHUB_MCP_VERSION:-1.12.1}"
BIN_DIR="${TONIGHT_GITHUB_MCP_DIR:-$HOME/.cache/tonight}"
BIN="$BIN_DIR/github-mcp-server-${VERSION}"

os="$(uname -s)"
arch="$(uname -m)"
case "${os}-${arch}" in
  Linux-x86_64) asset="github-mcp-server_Linux_x86_64.tar.gz" ;;
  Linux-aarch64 | Linux-arm64) asset="github-mcp-server_Linux_arm64.tar.gz" ;;
  Darwin-arm64) asset="github-mcp-server_Darwin_arm64.tar.gz" ;;
  Darwin-x86_64) asset="github-mcp-server_Darwin_x86_64.tar.gz" ;;
  *)
    echo "Unsupported platform ${os} ${arch} for github-mcp-server." >&2
    exit 1
    ;;
esac

mkdir -p "$BIN_DIR"
if [[ ! -x "$BIN" ]]; then
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  curl -fL --retry 4 --retry-all-errors --retry-delay 2 \
    -o "$tmp/mcp.tgz" \
    "https://github.com/github/github-mcp-server/releases/download/v${VERSION}/${asset}"
  tar -xzf "$tmp/mcp.tgz" -C "$tmp"
  mv "$tmp/github-mcp-server" "$BIN"
  chmod +x "$BIN"
  trap - EXIT
  rm -rf "$tmp"
fi

TOKEN="${GITHUB_PERSONAL_ACCESS_TOKEN:-${GITHUB_TOKEN:-}}"
if [[ -z "$TOKEN" ]] && command -v gh >/dev/null 2>&1; then
  TOKEN="$(gh auth token 2>/dev/null || true)"
fi
if [[ -z "$TOKEN" ]]; then
  echo "GitHub MCP needs a token. Set GITHUB_PERSONAL_ACCESS_TOKEN or run gh auth login." >&2
  exit 1
fi

export GITHUB_PERSONAL_ACCESS_TOKEN="$TOKEN"
exec "$BIN" stdio --toolsets=default,actions
