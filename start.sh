#!/usr/bin/env bash
#
# Démarre l'application complète (backend Spring Boot + frontend React).
# Usage : ./start.sh
# Arrêt  : Ctrl+C (arrête proprement les deux serveurs).
#
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

# --- Détection de Java 21 -------------------------------------------------
# NB : macOS fournit un stub /usr/bin/java qui "existe" sans être un vrai JDK.
# On teste donc que `java -version` fonctionne réellement.
java_works() { java -version >/dev/null 2>&1; }

if ! java_works; then
  for d in "/opt/homebrew/opt/openjdk@21" "/usr/local/opt/openjdk@21"; do
    if [ -x "$d/bin/java" ]; then
      export JAVA_HOME="$d"
      export PATH="$JAVA_HOME/bin:$PATH"
      break
    fi
  done
fi
# Dernier recours : laisser macOS trouver un JDK installé
if ! java_works && [ -x "/usr/libexec/java_home" ]; then
  JH="$(/usr/libexec/java_home 2>/dev/null || true)"
  if [ -n "$JH" ]; then export JAVA_HOME="$JH"; export PATH="$JAVA_HOME/bin:$PATH"; fi
fi
if ! java_works; then
  echo "❌ Java introuvable. Installez le JDK 21 (ex: brew install openjdk@21)."
  exit 1
fi

echo "➡️  Java : $(java -version 2>&1 | head -1)"

# --- Arrêt propre des deux serveurs --------------------------------------
PIDS=()
cleanup() {
  echo ""
  echo "🛑 Arrêt des serveurs..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  exit 0
}
trap cleanup INT TERM

# --- Backend (port 8080) --------------------------------------------------
echo "🚀 Démarrage du backend (http://localhost:8080)..."
cd "$ROOT/backend"
./mvnw -q spring-boot:run &
PIDS+=($!)

# Attendre que l'API réponde
echo "⏳ Attente du backend..."
for i in $(seq 1 60); do
  if curl -s -o /dev/null http://localhost:8080/v3/api-docs 2>/dev/null; then
    echo "✅ Backend prêt."
    break
  fi
  sleep 2
done

# --- Frontend (port 5173) -------------------------------------------------
cd "$ROOT/frontend"
if [ ! -d node_modules ]; then
  echo "📦 Installation des dépendances frontend..."
  npm install
fi
echo "🚀 Démarrage du frontend (http://localhost:5173)..."
npm run dev &
PIDS+=($!)

echo ""
echo "============================================================"
echo "  Application lancée :"
echo "    • Frontend : http://localhost:5173"
echo "    • API      : http://localhost:8080/api"
echo "    • Swagger  : http://localhost:8080/swagger-ui.html"
echo ""
echo "  Comptes : admin/admin123 · prof/prof123 · etudiant/etud123"
echo "  (Ctrl+C pour tout arrêter)"
echo "============================================================"

# Garder le script actif tant que les serveurs tournent
wait
