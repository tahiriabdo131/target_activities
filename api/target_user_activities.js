export default function handler(req, res) {
  // --- CORS ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are accepted'
    });
  }

  // ✅ helper لتحويل string → boolean
  const toBoolean = (value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value; // نخليها كما هي إلا كانت undefined
  };

  const params = {
    isLastConnexion: toBoolean(req.body.isLastConnexion),
    ILI_DerniereConnexionDashboardModeEco: toBoolean(req.body.ILI_DerniereConnexionDashboardModeEco),
    ILI_DerniereConnexionBilanConso: toBoolean(req.body.ILI_DerniereConnexionBilanConso),
    ILI_ModeEcoActif: toBoolean(req.body.ILI_ModeEcoActif),
  };

  // ✅ validation دابا غادي تخدم
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && typeof value !== 'boolean') {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Parameter "${key}" must be a boolean if provided`,
        received: typeof value
      });
    }
  }

  const result = {
    success: true,
    received: {
      isLastConnexion: params.isLastConnexion ?? null,
      ILI_DerniereConnexionDashboardModeEco: params.ILI_DerniereConnexionDashboardModeEco ?? null,
      ILI_DerniereConnexionBilanConso: params.ILI_DerniereConnexionBilanConso ?? null,
      is_modeEco_active: params.ILI_ModeEcoActif ?? null
    },
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(result);
}
