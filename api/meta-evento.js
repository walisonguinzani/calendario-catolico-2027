// Função serverless (Vercel): envia eventos para a API de Conversões da Meta.
// O token fica SÓ na variável de ambiente META_CAPI_TOKEN da Vercel, nunca no código.
// A página só chama esta função depois de o visitante permitir a medição.

const PIXEL_ID = process.env.META_PIXEL_ID || "1556039792956905";
const ALLOWED = new Set(["PageView", "ViewContent", "InitiateCheckout"]);
const GRAPH_VERSION = "v21.0";

function cookie(header, name) {
  const m = (header || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.statusCode = 405; return res.end(); }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) { res.statusCode = 204; return res.end(); }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || !ALLOWED.has(body.event_name) || typeof body.event_id !== "string") {
    res.statusCode = 400; return res.end();
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || undefined;
  const event = {
    event_name: body.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: body.event_id.slice(0, 64),
    event_source_url: typeof body.event_source_url === "string" ? body.event_source_url.slice(0, 500) : undefined,
    action_source: "website",
    user_data: {
      client_ip_address: ip,
      client_user_agent: req.headers["user-agent"],
      fbp: cookie(req.headers.cookie, "_fbp"),
      fbc: cookie(req.headers.cookie, "_fbc")
    }
  };
  const cd = body.custom_data;
  if (cd && typeof cd.value === "number" && cd.currency === "EUR") {
    event.custom_data = { value: cd.value, currency: "EUR" };
  }

  try {
    const r = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [event] })
    });
    res.statusCode = r.ok ? 200 : 502;
  } catch (e) {
    res.statusCode = 502;
  }
  res.end();
};
