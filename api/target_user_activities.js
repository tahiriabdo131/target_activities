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

  const toBoolean = (value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  };

  const params = {
    isLastConnexion: toBoolean(body.isLastConnexion),
    ILI_DerniereConnexionDashboardModeEco: toBoolean(body.ILI_DerniereConnexionDashboardModeEco),
    ILI_DerniereConnexionBilanConso: toBoolean(body.ILI_DerniereConnexionBilanConso),
    ILI_ModeEcoActif: toBoolean(body.ILI_ModeEcoActif),
  };

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && typeof value !== 'boolean') {
      return res.status(400).json({
        error: `Parameter "${key}" must be boolean`
      });
    }
  }

  return res.status(200).json({
    success: true,
    received: {
      isLastConnexion: params.isLastConnexion ?? null,
      ILI_DerniereConnexionDashboardModeEco: params.ILI_DerniereConnexionDashboardModeEco ?? null,
      ILI_DerniereConnexionBilanConso: params.ILI_DerniereConnexionBilanConso ?? null,
      is_modeEco_active: params.ILI_ModeEcoActif ?? null
    },
    timestamp: new Date().toISOString()
  });
}
