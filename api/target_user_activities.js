export default function handler(req, res) {
  // Méthode uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are accepted'
    });
  }

  const {
    last_visit_modeEco_Dashboard,
    last_visit_modeEco_BilanConso,
    is_modeEco_active
  } = req.body;

  // Validation : si fournis, doivent être des booléens
  const params = {
    last_visit_modeEco_Dashboard,
    last_visit_modeEco_BilanConso,
    is_modeEco_active
  };

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && typeof value !== 'boolean') {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Parameter "${key}" must be a boolean if provided`,
        received: typeof value
      });
    }
  }

  // Logique métier ici
  const result = {
    success: true,
    received: {
      last_visit_modeEco_Dashboard: last_visit_modeEco_Dashboard ?? null,
      last_visit_modeEco_BilanConso: last_visit_modeEco_BilanConso ?? null,
      is_modeEco_active: is_modeEco_active ?? null
    },
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(result);
}
