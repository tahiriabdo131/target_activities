export default function handler(req, res) {
    if (req.method === 'POST') {
        const { 
            last_visit_modeEco_Dashboard, 
            last_visit_modeEco_BilanConso, 
            extra_param 
        } = req.body;

        // Logic: Return 400 if types aren't boolean (optional)
        if (typeof last_visit_modeEco_Dashboard !== 'boolean' && last_visit_modeEco_Dashboard !== undefined) {
            return res.status(400).json({ error: 'Invalid types' });
        }

        // Return 200 Success
        return res.status(200).json({
            message: "Activity logged successfully",
            received: { last_visit_modeEco_Dashboard, last_visit_modeEco_BilanConso }
        });
    } 
    else {
        // Handle non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}