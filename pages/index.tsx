import Head from "next/head";

export default function Home() {
  const endpoints = [
    {
      category: "Campagnes",
      routes: [
        "GET /api/campaigns",
        "POST /api/campaigns/create",
        "PUT /api/campaigns/:id/status",
      ],
    },
    {
      category: "Budgets",
      routes: ["POST /api/budgets/create"],
    },
    {
      category: "Groupes d'Annonces",
      routes: [
        "POST /api/ad-groups/create",
        "GET /api/ad-groups/:campaignId",
      ],
    },
    {
      category: "Keywords",
      routes: [
        "POST /api/keywords/add",
        "GET /api/keywords/:adGroupId",
        "POST /api/keywords/negative",
      ],
    },
    {
      category: "Annonces",
      routes: ["POST /api/ads/create", "GET /api/ads/:adGroupId"],
    },
    {
      category: "Audiences",
      routes: ["POST /api/audiences/create", "GET /api/audiences"],
    },
    {
      category: "Conversions",
      routes: ["POST /api/conversions/offline"],
    },
    {
      category: "Rapports",
      routes: [
        "GET /api/reports/performance",
        "GET /api/reports/roi",
        "GET /api/reports/keywords",
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Google Ads Automation - MonWe Infinity</title>
        <meta
          name="description"
          content="Google Ads API Automation for MonWe Infinity SaaS products"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>🚀 Google Ads Automation</h1>
          <p style={styles.subtitle}>
            MonWe Infinity LLC - ProfityX, SINOVA, TivyX, ASILI
          </p>
        </header>

        <main style={styles.main}>
          <section style={styles.section}>
            <h2>📚 Documentation</h2>
            <div style={styles.links}>
              <a href="https://github.com/Iyessiha/google-ads#readme" target="_blank" rel="noopener noreferrer" style={styles.link}>
                📖 README.md
              </a>
              <a href="https://github.com/Iyessiha/google-ads/blob/main/ACTIONS.md" target="_blank" rel="noopener noreferrer" style={styles.link}>
                📋 ACTIONS.md (25+ actions)
              </a>
              <a href="https://github.com/Iyessiha/google-ads/blob/main/API_ENDPOINTS.md" target="_blank" rel="noopener noreferrer" style={styles.link}>
                🔗 API_ENDPOINTS.md
              </a>
              <a href="https://github.com/Iyessiha/google-ads/blob/main/SETUP.md" target="_blank" rel="noopener noreferrer" style={styles.link}>
                ⚙️ SETUP.md
              </a>
            </div>
          </section>

          <section style={styles.section}>
            <h2>🔗 Endpoints Disponibles</h2>
            {endpoints.map((cat, idx) => (
              <div key={idx} style={styles.category}>
                <h3 style={styles.categoryTitle}>{cat.category}</h3>
                <ul style={styles.routeList}>
                  {cat.routes.map((route, routeIdx) => (
                    <li key={routeIdx} style={styles.route}>
                      <code style={styles.code}>{route}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section style={styles.section}>
            <h2>🎯 SaaS Optimisés</h2>
            <div style={styles.saasGrid}>
              <div style={styles.saasCard}>
                <h3>🟦 ProfityX</h3>
                <p>Comptabilité Cloud</p>
              </div>
              <div style={styles.saasCard}>
                <h3>🟩 SINOVA</h3>
                <p>CRM & Dropshipping</p>
              </div>
              <div style={styles.saasCard}>
                <h3>🟨 TivyX</h3>
                <p>Streaming Platform</p>
              </div>
              <div style={styles.saasCard}>
                <h3>🟪 ASILI</h3>
                <p>HR & Heritage</p>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2>🔧 Configuration Requise</h2>
            <div style={styles.config}>
              <p>Ajouter les variables d'environnement dans Vercel:</p>
              <ul>
                <li><code>GOOGLE_ADS_CLIENT_ID</code></li>
                <li><code>GOOGLE_ADS_CLIENT_SECRET</code></li>
                <li><code>GOOGLE_ADS_REFRESH_TOKEN</code></li>
                <li><code>GOOGLE_ADS_CUSTOMER_ID</code></li>
              </ul>
              <p>
                Voir{" "}
                <a
                  href="https://github.com/Iyessiha/google-ads/blob/main/SETUP.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0066cc" }}
                >
                  SETUP.md
                </a>{" "}
                pour les instructions complètes.
              </p>
            </div>
          </section>

          <section style={styles.section}>
            <h2>📊 Exemple d'Utilisation</h2>
            <div style={styles.example}>
              <pre style={styles.pre}>{`# Lister les campagnes
curl https://google-ads-[your-deployment].vercel.app/api/campaigns

# Créer une campagne
curl -X POST https://google-ads-[your-deployment].vercel.app/api/campaigns/create \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ma Campagne","budget_usd":5000}'

# Obtenir le ROI
curl https://google-ads-[your-deployment].vercel.app/api/reports/roi`}</pre>
            </div>
          </section>

          <section style={styles.section}>
            <h2>🔗 Liens</h2>
            <div style={styles.links}>
              <a
                href="https://github.com/Iyessiha/google-ads"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                GitHub Repository
              </a>
              <a
                href="https://developers.google.com/google-ads/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Google Ads API Docs
              </a>
            </div>
          </section>
        </main>

        <footer style={styles.footer}>
          <p>
            🤖 Built with ❤️ by Claude Haiku 4.5 | MonWe Infinity LLC ©
            2026
          </p>
        </footer>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0e27",
    color: "#e0e0e0",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "60px 20px",
    textAlign: "center" as const,
    color: "#fff",
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "48px",
    fontWeight: "bold",
  },
  subtitle: {
    margin: "0",
    fontSize: "18px",
    opacity: 0.9,
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 20px",
  },
  section: {
    marginBottom: "60px",
  },
  category: {
    marginBottom: "30px",
    background: "#1a1f3a",
    padding: "20px",
    borderRadius: "8px",
    borderLeft: "4px solid #667eea",
  },
  categoryTitle: {
    margin: "0 0 15px 0",
    fontSize: "18px",
    color: "#667eea",
  },
  routeList: {
    margin: "0",
    paddingLeft: "20px",
  },
  route: {
    marginBottom: "8px",
    fontSize: "14px",
  },
  code: {
    background: "#0a0e27",
    padding: "4px 8px",
    borderRadius: "4px",
    fontFamily: "monospace",
    color: "#88d498",
  },
  saasGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  saasCard: {
    background: "#1a1f3a",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center" as const,
    border: "1px solid #667eea",
  },
  config: {
    background: "#1a1f3a",
    padding: "20px",
    borderRadius: "8px",
  },
  example: {
    background: "#1a1f3a",
    borderRadius: "8px",
    overflow: "hidden",
  },
  pre: {
    margin: "0",
    padding: "20px",
    background: "#0a0e27",
    color: "#88d498",
    fontSize: "13px",
    overflowX: "auto" as const,
    fontFamily: "monospace",
  },
  links: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "15px",
  },
  link: {
    display: "inline-block",
    padding: "12px 20px",
    background: "#667eea",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  footer: {
    textAlign: "center" as const,
    padding: "40px 20px",
    borderTop: "1px solid #1a1f3a",
    color: "#888",
    fontSize: "14px",
  },
};
