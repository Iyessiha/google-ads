#!/bin/bash
set -e

echo "🔧 Configuration Google Ads MCP"
echo "================================"

# Chemins
SETUP_DIR="$HOME/Documents/google-ads-setup"
CONFIG_DIR="$HOME/.claude"

# Lire le refresh token depuis .env
if [ ! -f "$SETUP_DIR/.env" ]; then
  echo "❌ Erreur: $SETUP_DIR/.env non trouvé"
  exit 1
fi

REFRESH_TOKEN=$(grep "GOOGLE_ADS_REFRESH_TOKEN" "$SETUP_DIR/.env" | cut -d'=' -f2)
CLIENT_ID=$(grep "GOOGLE_ADS_CLIENT_ID" "$SETUP_DIR/.env" | cut -d'=' -f2)
CLIENT_SECRET=$(grep "GOOGLE_ADS_CLIENT_SECRET" "$SETUP_DIR/.env" | cut -d'=' -f2)

echo "✓ Token lu depuis .env"

# Créer google_ads_config.json
cat > "$SETUP_DIR/google_ads_config.json" << EOF
{
  "client_id": "$CLIENT_ID",
  "client_secret": "$CLIENT_SECRET",
  "refresh_token": "$REFRESH_TOKEN",
  "customer_id": "266-527-4746"
}
EOF
echo "✓ google_ads_config.json créé"

# Créer ~/.claude/config.json
mkdir -p "$CONFIG_DIR"
cat > "$CONFIG_DIR/config.json" << EOF
{
  "mcpServers": {
    "google-ads": {
      "command": "google-ads-mcp",
      "args": ["--config", "$SETUP_DIR/google_ads_config.json"],
      "disabled": false
    }
  }
}
EOF
echo "✓ ~/.claude/config.json créé"

echo ""
echo "✅ Configuration complète !"
echo "Redémarre Claude pour activer le serveur MCP."
