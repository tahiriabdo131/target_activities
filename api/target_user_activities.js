export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Content-Type'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const body = req.body || {};

  // ✅ robust string → boolean (form-data safe)
  const toBoolean = (value) => {
    if (value === true || value === "true" || value === "1") return true;
    if (value === false || value === "false" || value === "0") return false;
    return null; // unknown / not provided
  };

  const params = {
    isLastConnexion: toBoolean(body.isLastConnexion),
    ILI_DerniereConnexionDashboardModeEco: toBoolean(body.ILI_DerniereConnexionDashboardModeEco),
    ILI_DerniereConnexionBilanConso: toBoolean(body.ILI_DerniereConnexionBilanConso),
    ILI_ModeEcoActif: toBoolean(body.ILI_ModeEcoActif),
  };

  // ❌ validation stricte (only if provided)
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && typeof value !== 'boolean') {
      return res.status(400).json({
        error: `Parameter "${key}" must be boolean (true/false/1/0/string)`
      });
    }
  }

  return res.status(200).json({
    success: true,
    received: {
      isLastConnexion: params.isLastConnexion,
      ILI_DerniereConnexionDashboardModeEco: params.ILI_DerniereConnexionDashboardModeEco,
      ILI_DerniereConnexionBilanConso: params.ILI_DerniereConnexionBilanConso,
      is_modeEco_active: params.ILI_ModeEcoActif
    },
    timestamp: new Date().toISOString()
  });
}
