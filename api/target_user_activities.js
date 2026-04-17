export const config = {
  api: {
    bodyParser: false,
  },
};

function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) return reject(new Error('No boundary'));

    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      const fields = {};

      body.split(`--${boundary}`).forEach(part => {
        const match = part.match(/name="([^"]+)"\r\n\r\n([^\r\n]*)/);
        if (match) fields[match[1]] = match[2];
      });

      resolve(fields);
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const toBoolean = (value) => {
    if (value === true || value === 'true' || value === '1' || value === 1) return true;
    if (value === false || value === 'false' || value === '0' || value === 0) return false;
    return null;
  };

  let body = {};
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('multipart/form-data')) {
    body = await parseFormData(req);
  } else {
    body = req.body || {};
  }

  const getValue = (key) => {
    const v = body[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const params = {
    isLastConnexion: toBoolean(getValue('isLastConnexion')),
    ILI_DerniereConnexionDashboardModeEco: toBoolean(getValue('ILI_DerniereConnexionDashboardModeEco')),
    ILI_DerniereConnexionBilanConso: toBoolean(getValue('ILI_DerniereConnexionBilanConso')),
    ILI_ModeEcoActif: toBoolean(getValue('ILI_ModeEcoActif')),
  };

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && typeof value !== 'boolean') {
      return res.status(400).json({ error: `Parameter "${key}" must be boolean` });
    }
  }

  return res.status(200).json({
    success: true,
    received: {
      isLastConnexion: params.isLastConnexion,
      ILI_DerniereConnexionDashboardModeEco: params.ILI_DerniereConnexionDashboardModeEco,
      ILI_DerniereConnexionBilanConso: params.ILI_DerniereConnexionBilanConso,
      is_modeEco_active: params.ILI_ModeEcoActif,
    },
    timestamp: new Date().toISOString(),
  });
}
