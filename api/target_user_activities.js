export default function handler(req, res) {
  // --- GESTION DES CORS ---
  // Autorise ton application Ionic (ou n'importe quel domaine avec '*') à appeler l'API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Gérer la requête de pré-vérification (Preflight) du navigateur
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- LOGIQUE DE L'API ---
  
  // Méthode uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are accepted'
    });
  }

  const {
    isLastConnexion,
    ILI_DerniereConnexionDashboardModeEco,
    ILI_DerniereConnexionBilanConso,
    ILI_ModeEcoActif
  } = req.body;

  // Validation : si fournis, doivent être des booléens
  const params = {
    isLastConnexion,
    ILI_DerniereConnexionDashboardModeEco,
    ILI_DerniereConnexionBilanConso,
    ILI_ModeEcoActif
  };

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && typeof value !== 'boolean') {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Parameter "${key}" must be a boolean if provided`,
        received: typeof value
      });
    }
  }

  // Logique métier et réponse
  const result = {
    success: true,
    received: {
      isLastConnexion: isLastConnexion ?? null,
      ILI_DerniereConnexionDashboardModeEco: ILI_DerniereConnexionDashboardModeEco ?? null,
      ILI_DerniereConnexionBilanConso: ILI_DerniereConnexionBilanConso ?? null,
      is_modeEco_active: ILI_ModeEcoActif ?? null
    },
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(result);
}
