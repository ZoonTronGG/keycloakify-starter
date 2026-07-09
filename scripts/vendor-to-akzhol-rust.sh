#!/usr/bin/env bash
# Build the Keycloak theme JAR and vendor it into akzhol-rust.
#
# Guardrails (born from the 2026-07-08/09 prod incidents):
#  - refuses to build from a dirty working tree, so the shipped JAR always
#    corresponds to a commit that exists on GitHub;
#  - prints the exact source line to put into the akzhol-rust commit message.
set -euo pipefail

cd "$(dirname "$0")/.."

AKZHOL_RUST="${AKZHOL_RUST:-$HOME/RustRoverProjects/akzhol-rust}"
DEST="$AKZHOL_RUST/custom-keycloak-themes/keycloak-theme-for-kc-all-other-versions.jar"
JAR="dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar"

if [[ -n "$(git status --porcelain)" ]]; then
    echo "ERROR: working tree is dirty. Commit (and push) your theme changes first —" >&2
    echo "an uncommitted design shipped in a JAR is exactly how the look got lost on 2026-07-09." >&2
    git status --short >&2
    exit 1
fi

SHA=$(git rev-parse --short HEAD)
BRANCH=$(git branch --show-current)

if ! git merge-base --is-ancestor HEAD "origin/$BRANCH" 2>/dev/null; then
    echo "WARNING: HEAD ($SHA) is not pushed to origin/$BRANCH yet — push before vendoring." >&2
fi

npm run build-keycloak-theme

[[ -f "$JAR" ]] || { echo "ERROR: $JAR not produced" >&2; exit 1; }
[[ -d "$(dirname "$DEST")" ]] || { echo "ERROR: $DEST parent dir not found (set AKZHOL_RUST)" >&2; exit 1; }

cp "$JAR" "$DEST"

echo
echo "Vendored $(basename "$JAR") -> $DEST"
echo "Include this line in the akzhol-rust commit message:"
echo
echo "    Source: ZoonTronGG/keycloakify-starter@$SHA ($BRANCH)"
