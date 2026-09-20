const ORIGIN = "https://nitin-paid-apis.nitinmuwal96.workers.dev/api";
const KEY = "FIZZA-9C6BTESLUD6DYGREKW8M";
const BRAND = "@KRexplots99";

// endpoint -> action mapping
const ACTIONS = {
  "weather-info": "weather-info",
  "imei-info": "imei-info",
  "pincode-info": "pincode-info",
  "ifsc-info": "ifsc-info",
  "country-info": "country-info",
  "voter-info": "voter-info",
  "vehicle-v1": "vehicle-v1",
  "vehicle-v2": "vehicle-v2",
  "vehicle-v3": "vehicle-v3",
  "vehicle-v4": "vehicle-v4",
  "vehicle-number": "vehicle-number",
  "vehicle-pdf": "vehicle-pdf",
  "tg-to-info": "tg-to-info",
  "num-tower": "num-tower",
  "photo-gen": "photo-gen",
  "truecaller": "truecaller",
  "aadhar-ration": "aadhar-ration",
  "gst-search": "gst-search",
  "gst-direct": "gst-direct",
  "ip-v1": "ip-v1",
  "ip-v2": "ip-v2",
  "ip-v3": "ip-v3",
  "terabox": "terabox",
  "img2txt": "img2txt",
  "ai-gf": "ai-gf",
  "song-image": "song-image",
  "song-download": "song-download",
  "website-source": "website-source",
  "github-repos": "github-repos",
  "playstore-search": "playstore-search",
  "instagram-profile": "instagram-profile",
  "instagram-best": "instagram-best",
  "instagram-downloads": "instagram-downloads",
  "instagram-media": "instagram-media",
  "instagram-stats": "instagram-stats",
  "instagram-user": "instagram-user",
  "instagram-profile-full": "instagram-profile-full",
  "gst": "gst",
  "tgid": "tgid",
  "ff": "ff",
  "imei": "imei",
  "ifsc": "ifsc",
  "pincode": "pincode",
  "ip": "ip",
  "tguser": "tguser",
  "pan": "pan",
  "challan": "challan",
  "instagram": "instagram",
  "upiinfo": "upiinfo",
  "num": "num",
  "aadhar": "aadhar",
  "family": "family",
  "vehicle": "vehicle",
  "v2num": "v2num",
  "adhaar-adv": "adhaar_adv",
  "girlfriend": "girlfriend",
  "github": "github",
  "vehicle-adv": "vehicle_adv",
  "numverify": "numverify",
  "pan-gst": "pan_gst",
  "gst-basic": "gst_basic",
};

// cleanup: links aur original branding hata do
function cleanData(obj) {
  if (Array.isArray(obj)) return obj.map(cleanData);
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") {
        if (v.startsWith("http")) continue;
        if (/nitin|fizza|alonepatel|SGCodexs|UnknownGuy|nitinmuwal/i.test(v)) continue;
      }
      out[k] = cleanData(v);
    }
    return out;
  }
  return obj;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  // endpoint nikaalo: /api/weather-info  ya  /api?endpoint=weather-info
  let endpoint = "";
  if (req.query.endpoint) {
    endpoint = req.query.endpoint;
  } else {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const parts = url.pathname.split("/").filter(Boolean);
    // /api/weather-info => parts = ["api", "weather-info"]
    if (parts.length >= 2) endpoint = parts[1];
  }

  if (!endpoint || !ACTIONS[endpoint]) {
    return res.status(200).json({
      success: true,
      owner: BRAND,
      message: "KRX API is live",
      endpoints: Object.keys(ACTIONS),
    });
  }

  const action = ACTIONS[endpoint];

  const params = new URLSearchParams();
  params.set("key", KEY);
  params.set("action", action);

  for (const [k, v] of Object.entries(req.query)) {
    if (k === "endpoint") continue;
    params.set(k, v);
  }

  try {
    const up = await fetch(`${ORIGIN}?${params.toString()}`);
    const text = await up.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return res.status(200).json({
      success: true,
      owner: BRAND,
      endpoint: endpoint,
      result: cleanData(data),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      owner: BRAND,
      error: "Upstream fetch failed",
    });
  }
    }
