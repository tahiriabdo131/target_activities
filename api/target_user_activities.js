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
    last_visit_user_Dashboard,
    last_visit_modeEco_Dashboard,
    last_visit_modeEco_BilanConso,
    is_modeEco_active
  } = req.body;

  // Validation : si fournis, doivent être des booléens
  const params = {
    last_visit_user_Dashboard,
    last_visit_modeEco_Dashboard,
    last_visit_modeEco_BilanConso,
    is_modeEco_active
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
      last_visit_user_Dashboard: last_visit_user_Dashboard ?? null,
      last_visit_modeEco_Dashboard: last_visit_modeEco_Dashboard ?? null,
      last_visit_modeEco_BilanConso: last_visit_modeEco_BilanConso ?? null,
      is_modeEco_active: is_modeEco_active ?? null
    },
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(result);
}
