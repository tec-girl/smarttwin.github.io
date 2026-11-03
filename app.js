"use strict";
/* ===== SmartTwin Fase 2 — cuentas, vector, Top 10 y chat (Supabase) ===== */
const SB_URL = "https://iolhhgzcueglxfymxmdr.supabase.co";
const SB_KEY = "sb_publishable_FpdX0dZQ189hjTfetNybmQ_G5v7yMaz";
const MODE_LABEL = { seria: "💍 Relación seria", corto: "🌙 Algo corto", sexo: "🔥 Solo sexo", evento: "🎟️ Solo por un evento", actividades: "🎲 Actividades / amistad" };
let sb = null, session = null, myId = null, curConv = null, chatChannel = null;

function $(id) { return document.getElementById(id); }
function say(id, t) { const el = $(id); if (el) el.textContent = t; }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function initSB() {
  if (!window.supabase || SB_URL.indexOf("%%") === 0) { say("auth-msg", "La app está en configuración (falta conectar el servidor)."); return false; }
  sb = window.supabase.createClient(SB_URL, SB_KEY);
  return true;
}

/* ---------- sesión / UI ---------- */
async function refreshSession() {
  const { data } = await sb.auth.getSession();
  session = data.session; myId = session ? session.user.id : null;
  $("app-out").hidden = !!session;
  $("app-in").hidden = !session;
  if (session) { await loadProfile(); await loadConversations(); }
}
async function loadProfile() {
  const { data } = await sb.from("profiles").select("alias,city,mode,adult_confirmed,key_id").eq("id", myId).maybeSingle();
  if (data) {
    $("pf-alias").value = data.alias || "";
    $("pf-city").value = data.city || "";
    $("pf-mode").value = data.mode || "";
    $("pf-adult").checked = !!data.adult_confirmed;
    if (data.key_id) say("vec-msg", "Ya tienes una llave de consulta (" + data.key_id + "). Si no guardaste el secreto, regenera la llave para obtener tu URL completa.");
  }
  const savedUrl = localStorage.getItem("smarttwin-consulta");
  if (savedUrl) {
    $("key-url").textContent = savedUrl;
    $("key-box").hidden = false;
    const m = savedUrl.match(/k=(ST-[A-Z0-9-]+)/);
    if (m) $("key-id").textContent = m[1];
    $("key-secret").textContent = "(guardada en este navegador)";
  }
}

/* ---------- auth ---------- */
async function doSignup() {
  const email = $("auth-email").value.trim(), pass = $("auth-pass").value;
  if (!email || pass.length < 6) { say("auth-msg", "Escribe tu correo y una contraseña de al menos 6 caracteres."); return; }
  const { error } = await sb.auth.signUp({ email, password: pass });
  say("auth-msg", error ? ("Error: " + error.message) : "✅ Cuenta creada. Ya puedes completar tu perfil aquí abajo.");
  if (!error) refreshSession();
}
async function doLogin() {
  const email = $("auth-email").value.trim(), pass = $("auth-pass").value;
  const { error } = await sb.auth.signInWithPassword({ email, password: pass });
  say("auth-msg", error ? ("Error: " + error.message) : "✅ Sesión iniciada.");
  if (!error) refreshSession();
}
async function doLogout() { await sb.auth.signOut(); location.reload(); }

/* ---------- perfil y vector ---------- */
async function saveProfile() {
  const { error } = await sb.rpc("save_profile", {
    p_alias: $("pf-alias").value.trim(), p_city: $("pf-city").value.trim(),
    p_mode: $("pf-mode").value || null, p_adult: $("pf-adult").checked });
  say("pf-msg", error ? ("Error: " + error.message) : "✅ Perfil guardado.");
}
function buildVector() {
  const R = (window.STP && STP.results) || {};
  if (!R.ipip) return null;
  const bf = { E: R.ipip.E, A: R.ipip.A, C: R.ipip.C, ES: R.ipip.ES, I: R.ipip.I };
  let eq = null;
  if (R.eqself || R.eqsit) {
    eq = {};
    ["per", "use", "und", "man"].forEach(b => {
      const vals = [];
      if (R.eqself) vals.push(R.eqself.branches[b]);
      if (R.eqsit) vals.push(Math.round(R.eqsit.branches[b] / 12 * 100));
      eq[b] = Math.round(vals.reduce((x, y) => x + y, 0) / vals.length);
    });
  }
  return { bf, eq,
    eqsit_total: R.eqsit ? R.eqsit.total : null,
    pct: R.cog ? R.cog.percentile : null, iq: R.cog ? R.cog.iq_est : null };
}
async function publishVector() {
  const v = buildVector();
  if (!v) { say("vec-msg", "Primero completa al menos el test de Personalidad (IPIP-50) en la batería de arriba."); return; }
  const { error } = await sb.rpc("publish_scores", {
    p_bigfive: v.bf, p_eq: v.eq, p_eqsit_total: v.eqsit_total,
    p_cog_percentile: v.pct, p_iq_est: v.iq });
  say("vec-msg", error ? ("Error: " + error.message)
    : "✅ Vector publicado. Ya puedes calcular tu Top 10 (recuerda guardar también tu perfil público con alias, ciudad, modo y confirmación +18).");
}

/* ---------- llave de consulta ---------- */
async function genKey() {
  const { data, error } = await sb.rpc("set_consulta_key");
  if (error) { say("vec-msg", "Error: " + error.message); return; }
  const url = SB_URL + "/functions/v1/match?k=" + data.key_id + "&t=" + data.secret;
  $("key-id").textContent = data.key_id;
  $("key-secret").textContent = data.secret;
  $("key-url").textContent = url;
  $("key-box").hidden = false;
  localStorage.setItem("smarttwin-consulta", url);
  say("vec-msg", "🔑 Llave generada. Guárdala ahora: el secreto no se vuelve a mostrar.");
}
async function copyUrl() {
  const u = $("key-url").textContent;
  try { await navigator.clipboard.writeText(u); } catch (e) { /* portapapeles no disponible */ }
  say("vec-msg", "URL de consulta copiada. Dásela a tu IA junto con el prompt de «Conecta tu IA».");
}

/* ---------- Top 10 ---------- */
function renderTop(rows) {
  const list = $("top-list"); list.innerHTML = "";
  if (!rows || !rows.length) {
    say("top-msg", "Aún no hay perfiles compatibles con puntajes publicados. Invita a más personas a registrarse 💌");
    return;
  }
  say("top-msg", "Tu Top " + rows.length + " actual:");
  rows.forEach(r => {
    const d = document.createElement("div");
    d.className = "card match-card";
    d.innerHTML = "<div class='score'>" + Math.round(Number(r.score)) + "%</div>" +
      "<h3>" + esc(r.alias || "Sin alias") + (r.is_demo ? "<span class='pill'>DEMO</span>" : "") + (r.verified ? "<span class='pill'>✓ verificado</span>" : "") + "</h3>" +
      "<p class='meta'>" + esc(r.city || "") + " · " + esc(MODE_LABEL[r.mode] || r.mode || "") + "</p>" +
      "<div class='bat-row'><button class='btn' data-chat='" + r.candidate_id + "' type='button'>💬 Pedir chat</button>" +
      "<button class='btn ghost' data-discard='" + r.candidate_id + "' type='button'>✖ Descartar</button></div>";
    list.appendChild(d);
  });
  list.querySelectorAll("[data-chat]").forEach(b => b.addEventListener("click", () => requestChat(b.getAttribute("data-chat"))));
  list.querySelectorAll("[data-discard]").forEach(b => b.addEventListener("click", () => discard(b.getAttribute("data-discard"))));
}
async function runTop() {
  say("top-msg", "Calculando contra todos los perfiles registrados…");
  const { data, error } = await sb.rpc("app_top10");
  if (error) { say("top-msg", "Error: " + error.message); return; }
  renderTop(data);
}
async function discard(cid) {
  const { data, error } = await sb.rpc("discard_candidate", { p_candidate: cid });
  if (error) { say("top-msg", "Error: " + error.message); return; }
  say("top-msg", "Perfil descartado. El matcher conservó a los demás y completó con perfiles nuevos:");
  renderTop(data);
}
async function requestChat(cid) {
  const { data, error } = await sb.rpc("request_chat", { p_candidate: cid });
  if (error) { say("chat-msg", "Error: " + error.message); return; }
  if (data && data.error) { say("chat-msg", "⚠️ " + data.error); return; }
  say("chat-msg", data.status === "accepted"
    ? "💬 ¡Chat abierto! Ya pueden hablar abajo."
    : "📨 Solicitud de chat enviada. Cuando la otra persona acepte, podrán hablar.");
  await loadConversations();
  if (data.status === "accepted") openChat(data.conversation_id);
}

/* ---------- conversaciones y chat ---------- */
async function loadConversations() {
  const { data, error } = await sb.rpc("my_conversations");
  const box = $("conv-list"); if (!box) return;
  box.innerHTML = "";
  if (error || !data || !data.length) { if (!error) say("chat-msg", "Todavía no tienes chats. Pide chat desde tu Top 10 💬"); return; }
  data.forEach(c => {
    const row = document.createElement("div");
    row.className = "conv";
    let actions = "";
    if (c.status === "accepted") actions = "<button class='btn' data-open='" + c.conversation_id + "' type='button'>Abrir chat</button>";
    else if (String(c.requested_by) !== String(myId))
      actions = "<span class='muted'>quiere chatear contigo</span> <button class='btn' data-accept='" + c.conversation_id + "' type='button'>Aceptar</button> <button class='btn ghost' data-reject='" + c.conversation_id + "' type='button'>Rechazar</button>";
    else actions = "<span class='muted'>esperando respuesta…</span>";
    row.innerHTML = "<strong>" + esc(c.other_alias || "Perfil") + (c.is_demo ? "<span class='pill'>DEMO</span>" : "") + "</strong><span>" + actions + "</span>";
    box.appendChild(row);
  });
  box.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => openChat(b.getAttribute("data-open"))));
  box.querySelectorAll("[data-accept]").forEach(b => b.addEventListener("click", () => respondChat(b.getAttribute("data-accept"), true)));
  box.querySelectorAll("[data-reject]").forEach(b => b.addEventListener("click", () => respondChat(b.getAttribute("data-reject"), false)));
}
async function respondChat(cid, accept) {
  const { data, error } = await sb.rpc("respond_chat", { p_conversation: cid, p_accept: accept });
  if (error) { say("chat-msg", "Error: " + error.message); return; }
  say("chat-msg", accept ? "💬 Chat aceptado." : "Solicitud rechazada y perfil descartado.");
  await loadConversations();
  if (accept) openChat(cid);
}
function renderMsg(m) {
  const log = $("chat-log");
  const d = document.createElement("div");
  d.className = "msg " + (String(m.sender_id) === String(myId) ? "me" : "them");
  d.textContent = m.body;
  log.appendChild(d); log.scrollTop = log.scrollHeight;
}
async function openChat(cid) {
  curConv = cid;
  $("chat-box").hidden = false;
  $("chat-title").textContent = "💬 Chat";
  $("chat-log").innerHTML = "";
  const { data } = await sb.from("messages").select("sender_id,body,created_at").eq("conversation_id", cid).order("created_at", { ascending: true });
  (data || []).forEach(renderMsg);
  if (chatChannel) { sb.removeChannel(chatChannel); chatChannel = null; }
  chatChannel = sb.channel("chat-" + cid)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: "conversation_id=eq." + cid },
      payload => { if (String(payload.new.sender_id) !== String(myId)) renderMsg(payload.new); })
    .subscribe();
  $("chat-box").scrollIntoView({ behavior: "smooth", block: "center" });
}
async function sendMsg() {
  const inp = $("chat-input"); const body = inp.value.trim();
  if (!body || !curConv) return;
  const { data, error } = await sb.from("messages").insert({ conversation_id: curConv, sender_id: myId, body }).select().single();
  if (error) { say("chat-msg", "Error al enviar: " + error.message); return; }
  inp.value = ""; renderMsg(data);
}
function closeChat() {
  curConv = null; $("chat-box").hidden = true;
  if (chatChannel) { sb.removeChannel(chatChannel); chatChannel = null; }
}

/* ---------- arranque ---------- */
if (initSB()) {
  $("auth-signup").addEventListener("click", doSignup);
  $("auth-login").addEventListener("click", doLogin);
  $("auth-logout").addEventListener("click", doLogout);
  $("pf-save").addEventListener("click", saveProfile);
  $("vec-publish").addEventListener("click", publishVector);
  $("key-gen").addEventListener("click", genKey);
  $("key-copy").addEventListener("click", copyUrl);
  $("top-run").addEventListener("click", runTop);
  $("chat-send").addEventListener("click", sendMsg);
  $("chat-close").addEventListener("click", closeChat);
  $("chat-input").addEventListener("keydown", e => { if (e.key === "Enter") sendMsg(); });
  sb.auth.onAuthStateChange(() => refreshSession());
  refreshSession();
}
