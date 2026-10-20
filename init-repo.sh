#!/bin/bash
# Script d'init pour google-ads-client
# Lance-le dans le dossier du projet

echo "🚀 Setup google-ads-client..."

# Init Git
git init
git add .
git commit -m "Initial commit: Google Ads automation client

- TypeScript client with auto-renew refresh token
- Vercel API routes for campaigns (list, create)
- Full type safety
- Ready to deploy

Co-Authored-By: Claude <claude@anthropic.com>"

echo ""
echo "✅ Git initialized!"
echo ""
echo "Prochaines étapes:"
echo "1. Crée un repo sur GitHub: github.com/new"
echo "2. Remplace <ton-username> et <ton-repo> ci-dessous:"
echo ""
echo "   git remote add origin https://github.com/<ton-username>/<ton-repo>.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Puis deploy sur Vercel:"
echo "   vercel"
echo ""
