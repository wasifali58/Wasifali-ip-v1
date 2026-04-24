// IP INFO API - COMPLETE
// Developer: WASIF ALI | Telegram: @FREEHACKS95

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { ip } = req.query;

  try {
    let targetIp = ip || req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';

    // Clean IP (remove IPv6 prefix if any)
    if (targetIp.startsWith('::ffff:')) {
      targetIp = targetIp.substring(7);
    }

    // API endpoint
    let apiUrl = 'http://ip-api.com/json/';
    if (targetIp && targetIp !== '::1' && targetIp !== '127.0.0.1') {
      apiUrl += targetIp;
    }
    apiUrl += '?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query';

    const response = await fetch(apiUrl);
    const data = await response.json();

    // Format response
    const formattedResponse = {
      success: true,
      ip: data.query || targetIp || 'unknown',
      location: {
        country: data.country || 'Unknown',
        country_code: data.countryCode || 'N/A',
        region: data.regionName || data.region || 'Unknown',
        city: data.city || 'Unknown',
        zip: data.zip || 'N/A',
        latitude: data.lat || null,
        longitude: data.lon || null,
        timezone: data.timezone || 'Unknown'
      },
      network: {
        isp: data.isp || 'Unknown',
        organization: data.org || 'Unknown',
        as_number: data.as || 'Unknown'
      },
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    };

    if (data.status !== 'success') {
      formattedResponse.success = false;
      formattedResponse.message = data.message || 'Unable to fetch IP information';
    }

    return res.status(200).json(formattedResponse);

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    });
  }
}
