const ORIGIN = "https://nitin-paid-apis.nitinmuwal96.workers.dev/api";
const KEY = "FIZZA-9C6BTESLUD6DYGREKW8M";
const BRAND = "@KRexplots99";

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

// banned words — inme se kuch bhi string me aaya toh hata do
const BANNED_WORDS = [
  "alone",
  "patel",
  "nitin",
  "fizza",
  "sgcodex",
  "unknownguy",
  "paid api",
  "paid-api",
  "paidapi",
  "nitinmuwal",
  "workers.dev",
];

// banned keys — yeh keys poori tarah hata do (kisi bhi level pe)
const BANNED_KEYS = [
  "note",
  "credit",
  "key_info",
  "keyinfo",
  "owner",
  "developer",
  "dev",
  "author",
  "source",
  "powered_by",
  "poweredby",
];

function cleanData(obj) {
  if (Array.isArray(obj)) return obj.map(cleanData);
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const kLow = String(k).toLowerCase().trim();

      // banned key skip
      if (BANNED_KEYS.includes(kLow)) continue;

      if (typeof v === "string") {
        const low = v.toLowerCase();
        // links skip
        if (low.startsWith("http://") || low.startsWith("https://")) continue;
        // banned words skip
        if (BANNED_WORDS.some((w) => low.includes(w))) continue;
        // @mention skip (koi bhi @something)
        if (/@[a-z0-9_]+/i.test(v)) continue;
      }

      if (typeof v === "number" || typeof v === "boolean" || v === null) {
        out[k] = v;
        continue;
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

  // endpoint nikaalo
  let endpoint = "";
  if (req.query.endpoint) {
    endpoint = req.query.endpoint;
  } else {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) endpoint = parts[1];
  }

  // root / list
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
