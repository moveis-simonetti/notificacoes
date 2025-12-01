#!/bin/bash

set -e

FIREBASE_RC_FILE="$(dirname "$0")/../.firebaserc"

if [ -f "$FIREBASE_RC_FILE" ]; then
  echo "O arquivo .firebaserc já existe. Nenhuma ação foi tomada."
  exit 0
fi

cat <<EOF > "$FIREBASE_RC_FILE"
{
  "projects": {}
}
EOF

echo "Arquivo .firebaserc criado com sucesso."
