"use strict";
/* ===== SmartTwin — motor de la batería completa =====
   Perfil en memoria: window.STP = { results, answers, key_id, secret } */
window.STP = window.STP || { results:{}, answers:{}, key_id:null, secret:null };

function IL(){ return (curLang === "en") ? "en" : "es"; }

const RB = {
es:{ prog:"{a} de {b}", done:"✓ Completado", again:"Cerrar",
  likA:["Nada preciso","Poco preciso","Ni preciso ni impreciso","Bastante preciso","Muy preciso"],
  likB:["Muy en desacuerdo","En desacuerdo","Neutral","De acuerdo","Muy de acuerdo"],
  cogT:"Cognitivo-32", eqsitT:"EQ Situacional-16", eqselfT:"EQ Autorreporte-24", ipipT:"Personalidad — Big Five", connT:"Conexión-36",
  br:{per:"Percibir",use:"Usar",und:"Comprender",man:"Manejar"},
  fc:{E:"Extraversión",A:"Amabilidad",C:"Responsabilidad",ES:"Estabilidad emocional",I:"Intelecto/Imaginación"},
  ct:{mat:"Matrices",ser:"Series",ver:"Verbal",esp:"Espacial"},
  sets:["Set I — Ligero","Set II — Valores y profundidad","Set III — Vulnerabilidad"],
  cogScore:"Aciertos: {n}/32 · Percentil estimado: {p} · IQ estimado ≈ {q} (rango {q1}–{q2})",
  cogText:"Matrices {mat}/8 · Series {ser}/8 · Verbal {ver}/8 · Espacial {esp}/8. Estimación interna preliminar de SmartTwin: no es una medición clínica certificada; se recalibrará con las normas de la comunidad.",
  eqsitScore:"Total: {n}/48",
  eqselfScore:"Perfil emocional por rama (0–100)",
  ipipScore:"Tus cinco factores (10–50)",
  bandLow:"bajo", bandMid:"medio", bandHigh:"alto",
  connScore:"Respondiste {n} de 36 preguntas",
  connText:"Tus respuestas quedaron en tu perfil para tu bóveda y para el análisis de compatibilidad. La Conexión-36 también puede hacerse en vivo, por turnos, con tu match.",
  branchLine:"{name}: {v}/{max}", branchLine100:"{name}: {v}/100", factorLine:"{name}: {v}/50 ({band})",
  savedNote:"Resultado guardado en tu perfil de esta sesión. Genera tu bóveda para conservarlo cifrado." },
en:{ prog:"{a} of {b}", done:"✓ Completed", again:"Close",
  likA:["Very inaccurate","Moderately inaccurate","Neither accurate nor inaccurate","Moderately accurate","Very accurate"],
  likB:["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"],
  cogT:"Cognitive-32", eqsitT:"Situational EQ-16", eqselfT:"Self-Report EQ-24", ipipT:"Personality — Big Five", connT:"Connection-36",
  br:{per:"Perceive",use:"Use",und:"Understand",man:"Manage"},
  fc:{E:"Extraversion",A:"Agreeableness",C:"Conscientiousness",ES:"Emotional Stability",I:"Intellect/Imagination"},
  ct:{mat:"Matrices",ser:"Series",ver:"Verbal",esp:"Spatial"},
  sets:["Set I — Light","Set II — Values & depth","Set III — Vulnerability"],
  cogScore:"Correct: {n}/32 · Estimated percentile: {p} · Estimated IQ ≈ {q} (range {q1}–{q2})",
  cogText:"Matrices {mat}/8 · Series {ser}/8 · Verbal {ver}/8 · Spatial {esp}/8. SmartTwin's preliminary internal estimate: not a certified clinical measurement; it will be recalibrated with community norms.",
  eqsitScore:"Total: {n}/48",
  eqselfScore:"Emotional profile by branch (0–100)",
  ipipScore:"Your five factors (10–50)",
  bandLow:"low", bandMid:"mid", bandHigh:"high",
  connScore:"You answered {n} of 36 questions",
  connText:"Your answers were saved to your profile for your vault and for compatibility analysis. Connection-36 can also be done live, taking turns, with your match.",
  branchLine:"{name}: {v}/{max}", branchLine100:"{name}: {v}/100", factorLine:"{name}: {v}/50 ({band})",
  savedNote:"Result saved to this session's profile. Generate your vault to keep it encrypted." }
};
function rb(k){ return (RB[IL()] && RB[IL()][k]) || RB.es[k]; }
function tpl(t, o){ return t.replace(/\{(\w+)\}/g, (m, k) => (o[k] !== undefined ? o[k] : m)); }

/* ===== Construcción de instrumentos ===== */
function cogItems(){
  const tag = (arr, t) => arr.map(q => ({ type:t, q:q.q, opts:q.opts, a:q.a }));
  return [...tag(COG_MATRICES,"mat"), ...tag(COG_SERIES,"ser"), ...tag(COG_VERBAL,"ver"), ...tag(COG_ESPACIAL,"esp")];
}
function optText(opt, lang){ return (opt && typeof opt === "object" && !Array.isArray(opt) && ("es" in opt || "en" in opt)) ? (opt[lang] || opt.es) : opt; }
function optsArray(it, lang){ const o = it.opts; return Array.isArray(o) ? o : (o[lang] || o.es); }

/* ===== Motor genérico ===== */
let run = null;
function startInst(inst){
  run = { inst, idx:0, ans:[] };
  document.getElementById("bat-result").hidden = true;
  const p = document.getElementById("bat-panel");
  p.hidden = false;
  p.scrollIntoView({ behavior:"smooth", block:"center" });
  renderItem();
}
function itemsOf(inst){
  if (inst === "cog") return cogItems();
  if (inst === "eqsit") return EQ_SIT;
  if (inst === "eqself") return EQ_SELF;
  if (inst === "ipip") return IL() === "en" ? IPIP_EN : IPIP_ES;
  if (inst === "conn") return CONN36;
  return [];
}
function titleOf(inst){
  return { cog:rb("cogT"), eqsit:rb("eqsitT"), eqself:rb("eqselfT"), ipip:rb("ipipT"), conn:rb("connT") }[inst];
}
function renderItem(){
  const items = itemsOf(run.inst), it = items[run.idx], lang = IL();
  document.getElementById("bat-title").textContent = titleOf(run.inst);
  document.getElementById("bat-progress").textContent = tpl(rb("prog"), { a:run.idx + 1, b:items.length });
  document.getElementById("bat-fill").style.width = (run.idx / items.length * 100) + "%";
  const setEl = document.getElementById("bat-set");
  const opts = document.getElementById("bat-opts");
  const tw = document.getElementById("bat-textwrap");
  opts.innerHTML = ""; tw.hidden = true; setEl.textContent = "";
  const qEl = document.getElementById("bat-q");

  if (run.inst === "conn") {
    setEl.textContent = rb("sets")[Math.floor(run.idx / 12)];
    qEl.textContent = it[lang] || it.es;
    tw.hidden = false;
    document.getElementById("bat-text").value = "";
    return;
  }
  if (run.inst === "eqself" || run.inst === "ipip") {
    qEl.textContent = (run.inst === "ipip") ? it : (it.t[lang] || it.t.es);
    const labels = run.inst === "ipip" ? rb("likA") : rb("likB");
    labels.forEach((lab, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = (i + 1) + " · " + lab;
      b.addEventListener("click", () => { run.ans.push(i + 1); nextItem(); });
      opts.appendChild(b);
    });
    return;
  }
  /* cog / eqsit: opción múltiple */
  qEl.textContent = it.q[lang] || it.q.es;
  const rawOpts = (run.inst === "cog") ? optsArray(it, lang) : it.opts.map(o => o.t);
  rawOpts.forEach((o) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = optText(o, lang);
    b.addEventListener("click", () => { run.ans.push(o); nextItem(); });
    opts.appendChild(b);
  });
}
function nextItem(){
  run.idx++;
  if (run.idx < itemsOf(run.inst).length) renderItem(); else finishInst();
}
document.getElementById("bat-save").addEventListener("click", () => {
  run.ans.push(document.getElementById("bat-text").value.trim()); nextItem();
});
document.getElementById("bat-skip").addEventListener("click", () => { run.ans.push(""); nextItem(); });
document.querySelectorAll("[data-start]").forEach(b =>
  b.addEventListener("click", () => startInst(b.getAttribute("data-start"))));
document.getElementById("bat-again").addEventListener("click", () => {
  document.getElementById("bat-result").hidden = true;
});

/* ===== Puntuación ===== */
function finishInst(){
  document.getElementById("bat-panel").hidden = true;
  const inst = run.inst, lang = IL();
  let emoji = "✨", title = titleOf(inst), score = "", lines = [];
  if (inst === "cog") {
    const items = cogItems(); const per = { mat:0, ser:0, ver:0, esp:0 }; let raw = 0;
    items.forEach((it, i) => {
      const chosen = optText(run.ans[i], lang), correct = optText(optsArray(it, lang)[it.a], lang);
      if (chosen === correct) { raw++; per[it.type]++; }
    });
    let pct = 5, iq = 75;
    for (const row of COG_NORMA) { if (raw <= row[0]) { pct = row[1]; iq = row[2]; break; } pct = row[1]; iq = row[2]; }
    STP.results.cog = { raw, per, percentile: pct, iq_est: iq };
    STP.answers.cog = run.ans.map(a => optText(a, "es"));
    emoji = "🧠"; score = tpl(rb("cogScore"), { n:raw, p:pct, q:iq, q1:iq - 8, q2:iq + 8 });
    lines = [tpl(rb("cogText"), per), rb("savedNote")];
  }
  if (inst === "eqsit") {
    const brs = { per:0, use:0, und:0, man:0 }; let total = 0;
    EQ_SIT.forEach((it, i) => {
      const raw = run.ans[i];
      const chosen = (raw && typeof raw === "object") ? (raw[lang] || raw.es) : raw;
      const found = it.opts.find(o => (o.t[lang] || o.t.es) === chosen) || it.opts.find(o => o.t.es === chosen);
      const v = found ? found.s : 0; brs[it.b] += v; total += v;
    });
    STP.results.eqsit = { branches: brs, total };
    STP.answers.eqsit = run.ans.map(raw => (raw && typeof raw === "object") ? (raw.es || "") : raw);
    emoji = "🎭"; score = tpl(rb("eqsitScore"), { n: total });
    lines = Object.keys(brs).map(k => tpl(rb("branchLine"), { name: rb("br")[k], v: brs[k], max: 12 }));
    lines.push(rb("savedNote"));
  }
  if (inst === "eqself") {
    const sums = { per:0, use:0, und:0, man:0 }, counts = { per:0, use:0, und:0, man:0 };
    EQ_SELF.forEach((it, i) => { const v = it.rev ? 6 - run.ans[i] : run.ans[i]; sums[it.b] += v; counts[it.b]++; });
    const prof = {}; Object.keys(sums).forEach(k => prof[k] = Math.round((sums[k] / counts[k] - 1) / 4 * 100));
    STP.results.eqself = { branches: prof };
    STP.answers.eqself = run.ans;
    emoji = "💗"; score = rb("eqselfScore");
    lines = Object.keys(prof).map(k => tpl(rb("branchLine100"), { name: rb("br")[k], v: prof[k] }));
    lines.push(rb("savedNote"));
  }
  if (inst === "ipip") {
    const sums = { E:0, A:0, C:0, ES:0, I:0 };
    run.ans.forEach((v, i) => { const f = IPIP_KEY.factor[i]; sums[f] += IPIP_KEY.rev.includes(i + 1) ? 6 - v : v; });
    STP.results.ipip = sums;
    STP.answers.ipip = run.ans;
    emoji = "🪞"; score = rb("ipipScore");
    lines = Object.keys(sums).map(k => tpl(rb("factorLine"), { name: rb("fc")[k], v: sums[k], band: sums[k] < 25 ? rb("bandLow") : (sums[k] > 38 ? rb("bandHigh") : rb("bandMid")) }));
    lines.push("IPIP · public domain (ipip.ori.org)", rb("savedNote"));
  }
  if (inst === "conn") {
    const answered = run.ans.filter(a => a && a.length > 0).length;
    STP.results.conn = { answered };
    STP.answers.conn = run.ans;
    emoji = "🔥"; score = tpl(rb("connScore"), { n: answered });
    lines = [rb("connText")];
  }
  const st = document.getElementById("st-" + inst);
  if (st) st.textContent = rb("done");
  document.getElementById("bat-remoji").textContent = emoji;
  document.getElementById("bat-rtitle").textContent = title;
  document.getElementById("bat-rscore").textContent = score;
  document.getElementById("bat-rtext").innerHTML = lines.map(l => l.replace(/</g, "&lt;")).join("<br>");
  const r = document.getElementById("bat-result");
  r.hidden = false;
  r.scrollIntoView({ behavior:"smooth", block:"center" });
  run = null;
  if (window.onSTUpdate) window.onSTUpdate();
}

/* ===== Textos nuevos de la interfaz (batería / bóveda / IA) ===== */
Object.assign(I18N.en, {
 "bat.title":"The full SmartTwin battery","bat.sub":"Five instruments, one profile. When you finish, everything is stored encrypted under your personal key.",
 "bat.langnote":"Note: the instruments are currently available in Spanish and English (professional translation in progress); the interface is in your language.",
 "bat.cogH":"Cognitive-32","bat.cogP":"Matrices, series, verbal reasoning and spatial rotation. Scoring with percentile and estimated IQ.","bat.cogM":"32 items · ~13 min",
 "bat.eqSH":"Situational EQ-16","bat.eqSP":"16 real dating and relationship scenarios, scored by emotional branch: perceive, use, understand, manage.","bat.eqSM":"16 scenarios · ~7 min",
 "bat.eqAH":"Self-Report EQ-24","bat.eqAP":"How you perceive yourself emotionally, in the same 4 branches. A 0–100 profile per branch.","bat.eqAM":"24 statements · ~4 min",
 "bat.ipipH":"Personality — Big Five (IPIP-50)","bat.ipipP":"The public-domain scientific inventory: Extraversion, Agreeableness, Conscientiousness, Emotional Stability and Intellect.","bat.ipipM":"50 statements · ~7 min",
 "bat.connH":"Connection-36","bat.connP":"36 original questions in 3 sets of rising intimacy, built on the architecture of Aron's closeness procedure. Answer them here or save them to do with your match.","bat.connM":"36 questions · at your pace",
 "bat.start":"Start","bat.save":"Save & continue","bat.skip":"Skip","bat.tobvault":"Save to my encrypted vault","bat.again":"Close",
 "bat.disclaimer":"Honest note: these are long instruments, professional in length and structure, with real scoring. The IQ shown is an internal estimate (preliminary percentile), not a diagnosis or a certified clinical measurement; the same applies to the emotional profiles. Personality: public-domain IPIP items (ipip.ori.org). All other items are SmartTwin originals.",
 "vault.title":"Your encrypted vault 🔐","vault.p1":"When you generate your key, all your results and answers are packed into an AES-256 encrypted file and correlated with your personal key: one single profile, unreadable without your key. Keep it safe: without it, not even SmartTwin can open your vault.",
 "vault.warn":"Copy your key now: it is shown only once.","vault.gen":"Generate my key & download my vault","vault.p2":"Already have a vault? Open it here to restore your profile on this device:","vault.import":"Open vault",
 "ia.title":"Connect your AI 🤖","ia.p1":"Your profile can be analyzed by the AI you use (Claude, ChatGPT or another model). Download your “AI profile” (generated by decrypting locally, only in your session) and give it the official prompt together with the file — and if you have someone else's profile, upload both together: their AI will tell you how compatible you are, where you shine and where you may clash.",
 "ia.copy":"Copy the prompt","ia.dl":"Download my AI profile"});
Object.assign(I18N.fr, {
 "bat.title":"La batterie complète SmartTwin","bat.sub":"Cinq instruments, un seul profil. À la fin, tout est stocké chiffré sous ta clé personnelle.",
 "bat.langnote":"Note : les instruments sont actuellement disponibles en espagnol et en anglais (traduction professionnelle en cours) ; l'interface est dans ta langue.",
 "bat.cogH":"Cognitif-32","bat.cogP":"Matrices, suites, raisonnement verbal et rotation spatiale. Score avec percentile et QI estimé.","bat.cogM":"32 items · ~13 min",
 "bat.eqSH":"QE situationnel-16","bat.eqSP":"16 scénarios réels de rendez-vous et de couple, notés par branche émotionnelle : percevoir, utiliser, comprendre, gérer.","bat.eqSM":"16 scénarios · ~7 min",
 "bat.eqAH":"QE auto-évalué-24","bat.eqAP":"Comment tu te perçois émotionnellement, dans les mêmes 4 branches. Profil de 0 à 100 par branche.","bat.eqAM":"24 affirmations · ~4 min",
 "bat.ipipH":"Personnalité — Big Five (IPIP-50)","bat.ipipP":"L'inventaire scientifique du domaine public : Extraversion, Amabilité, Conscience, Stabilité émotionnelle et Intellect.","bat.ipipM":"50 affirmations · ~7 min",
 "bat.connH":"Connexion-36","bat.connP":"36 questions originales en 3 séries d'intimité croissante, sur l'architecture de la procédure de proximité d'Aron. Réponds-y ici ou garde-les pour ton match.","bat.connM":"36 questions · à ton rythme",
 "bat.start":"Commencer","bat.save":"Enregistrer et continuer","bat.skip":"Passer","bat.tobvault":"Enregistrer dans mon coffre chiffré","bat.again":"Fermer",
 "bat.disclaimer":"Note honnête : ce sont des instruments longs, professionnels en longueur et en structure, avec une notation réelle. Le QI affiché est une estimation interne (percentile préliminaire), pas un diagnostic ni une mesure clinique certifiée ; idem pour les profils émotionnels. Personnalité : items IPIP du domaine public (ipip.ori.org). Tous les autres items sont des originaux SmartTwin.",
 "vault.title":"Ton coffre chiffré 🔐","vault.p1":"Quand tu génères ta clé, tous tes résultats et réponses sont emballés dans un fichier chiffré AES-256 et corrélés à ta clé personnelle : un seul profil, illisible sans ta clé. Garde-la bien : sans elle, même SmartTwin ne peut pas ouvrir ton coffre.",
 "vault.warn":"Copie ta clé maintenant : elle n'est affichée qu'une seule fois.","vault.gen":"Générer ma clé et télécharger mon coffre","vault.p2":"Tu as déjà un coffre ? Ouvre-le ici pour restaurer ton profil sur cet appareil :","vault.import":"Ouvrir le coffre",
 "ia.title":"Connecte ton IA 🤖","ia.p1":"Ton profil peut être analysé par l'IA que tu utilises (Claude, ChatGPT ou un autre modèle). Télécharge ton « profil pour IA » (généré par déchiffrement local, uniquement dans ta session) et donne-lui le prompt officiel avec le fichier — et si tu as le profil de quelqu'un d'autre, envoie-les ensemble : son IA dira votre compatibilité, vos forces et vos points de friction.",
 "ia.copy":"Copier le prompt","ia.dl":"Télécharger mon profil pour IA"});
Object.assign(I18N.de, {
 "bat.title":"Die komplette SmartTwin-Batterie","bat.sub":"Fünf Instrumente, ein Profil. Am Ende wird alles verschlüsselt unter deinem persönlichen Schlüssel gespeichert.",
 "bat.langnote":"Hinweis: Die Instrumente sind derzeit auf Spanisch und Englisch verfügbar (professionelle Übersetzung läuft); die Oberfläche ist in deiner Sprache.",
 "bat.cogH":"Kognitiv-32","bat.cogP":"Matrizen, Folgen, verbales Denken und räumliche Rotation. Auswertung mit Perzentil und geschätztem IQ.","bat.cogM":"32 Items · ~13 Min.",
 "bat.eqSH":"Situationales EQ-16","bat.eqSP":"16 echte Dating- und Beziehungsszenarien, ausgewertet nach emotionalen Zweigen: Wahrnehmen, Nutzen, Verstehen, Managen.","bat.eqSM":"16 Szenarien · ~7 Min.",
 "bat.eqAH":"Selbstbericht-EQ-24","bat.eqAP":"Wie du dich emotional selbst wahrnimmst, in denselben 4 Zweigen. Ein 0–100-Profil pro Zweig.","bat.eqAM":"24 Aussagen · ~4 Min.",
 "bat.ipipH":"Persönlichkeit — Big Five (IPIP-50)","bat.ipipP":"Das gemeinfreie wissenschaftliche Inventar: Extraversion, Verträglichkeit, Gewissenhaftigkeit, Emotionale Stabilität und Intellekt.","bat.ipipM":"50 Aussagen · ~7 Min.",
 "bat.connH":"Verbindung-36","bat.connP":"36 originale Fragen in 3 Sets steigender Intimität, nach der Architektur von Arons Nähe-Verfahren. Beantworte sie hier oder hebe sie für dein Match auf.","bat.connM":"36 Fragen · in deinem Tempo",
 "bat.start":"Starten","bat.save":"Speichern & weiter","bat.skip":"Überspringen","bat.tobvault":"In meinen verschlüsselten Tresor","bat.again":"Schließen",
 "bat.disclaimer":"Ehrlicher Hinweis: Dies sind lange Instrumente, professionell in Länge und Struktur, mit echter Auswertung. Der gezeigte IQ ist eine interne Schätzung (vorläufiges Perzentil), keine Diagnose und keine zertifizierte klinische Messung; dasselbe gilt für die emotionalen Profile. Persönlichkeit: gemeinfreie IPIP-Items (ipip.ori.org). Alle anderen Items sind SmartTwin-Originale.",
 "vault.title":"Dein verschlüsselter Tresor 🔐","vault.p1":"Wenn du deinen Schlüssel erzeugst, werden alle deine Ergebnisse und Antworten in einer AES-256-verschlüsselten Datei verpackt und mit deinem persönlichen Schlüssel verknüpft: ein einziges Profil, ohne deinen Schlüssel nicht lesbar. Bewahre ihn gut auf: Ohne ihn kann nicht einmal SmartTwin deinen Tresor öffnen.",
 "vault.warn":"Kopiere deinen Schlüssel jetzt: Er wird nur einmal angezeigt.","vault.gen":"Schlüssel erzeugen & Tresor herunterladen","vault.p2":"Du hast schon einen Tresor? Öffne ihn hier, um dein Profil auf diesem Gerät wiederherzustellen:","vault.import":"Tresor öffnen",
 "ia.title":"Verbinde deine KI 🤖","ia.p1":"Dein Profil kann von der KI analysiert werden, die du nutzt (Claude, ChatGPT oder ein anderes Modell). Lade dein „KI-Profil“ herunter (durch lokale Entschlüsselung erzeugt, nur in deiner Sitzung) und gib ihr den offiziellen Prompt zusammen mit der Datei — und wenn du das Profil einer anderen Person hast, lade beide zusammen hoch: Ihre KI sagt euch, wie kompatibel ihr seid, wo ihr glänzt und wo es reiben könnte.",
 "ia.copy":"Prompt kopieren","ia.dl":"Mein KI-Profil herunterladen"});
Object.assign(I18N.zh, {
 "bat.title":"SmartTwin 完整测评组","bat.sub":"五种工具，一个档案。完成后，所有内容都会用你的个人密钥加密保存。",
 "bat.langnote":"提示：测评内容目前提供西班牙语和英语（专业翻译进行中）；界面是你的语言。",
 "bat.cogH":"认知-32","bat.cogP":"矩阵、数列、言语推理和空间旋转。含百分位和预估智商的评分。","bat.cogM":"32 题 · 约13分钟",
 "bat.eqSH":"情境情商-16","bat.eqSP":"16 个真实的约会与恋爱场景，按情绪分支评分：感知、运用、理解、管理。","bat.eqSM":"16 个场景 · 约7分钟",
 "bat.eqAH":"自评情商-24","bat.eqAP":"你对自己情绪的感知，同样按 4 个分支。每个分支 0–100 分档案。","bat.eqAM":"24 条陈述 · 约4分钟",
 "bat.ipipH":"人格 — 大五 (IPIP-50)","bat.ipipP":"公共领域的科学量表：外向性、宜人性、尽责性、情绪稳定性与智力。","bat.ipipM":"50 条陈述 · 约7分钟",
 "bat.connH":"连接-36","bat.connP":"36 个原创问题，分 3 组，亲密度递增，采用 Aron 亲近程序的架构。在这里回答，或留着和你的匹配对象一起做。","bat.connM":"36 个问题 · 按你的节奏",
 "bat.start":"开始","bat.save":"保存并继续","bat.skip":"跳过","bat.tobvault":"保存到我的加密保险库","bat.again":"关闭",
 "bat.disclaimer":"诚实提示：这些是长篇工具，在长度和结构上达到专业水平，并有真实评分。所显示的智商是内部估计（初步百分位），不是诊断，也不是认证的临床测量；情绪档案同理。人格部分：IPIP 公共领域题目 (ipip.ori.org)。其余题目均为 SmartTwin 原创。",
 "vault.title":"你的加密保险库 🔐","vault.p1":"生成密钥后，你的所有结果和答案都会被打包进一个 AES-256 加密文件，并与你的个人密钥关联：一个单一档案，没有你的密钥无法读取。请妥善保管：没有它，连 SmartTwin 也打不开你的保险库。",
 "vault.warn":"立即复制你的密钥：它只显示一次。","vault.gen":"生成我的密钥并下载保险库","vault.p2":"已经有保险库了？在这里打开，在此设备上恢复你的档案：","vault.import":"打开保险库",
 "ia.title":"连接你的 AI 🤖","ia.p1":"你的档案可以由你使用的 AI 分析（Claude、ChatGPT 或其他模型）。下载你的“AI 档案”（通过本地解密生成，仅在你的会话中），把官方提示词和文件一起交给它 — 如果你有另一个人的档案，把两个一起上传：它的 AI 会告诉你们有多契合、闪光点在哪里、可能在哪里摩擦。",
 "ia.copy":"复制提示词","ia.dl":"下载我的 AI 档案"});
Object.assign(I18N.pt, {
 "bat.title":"A bateria completa SmartTwin","bat.sub":"Cinco instrumentos, um só perfil. Ao terminar, tudo fica guardado cifrado com sua chave pessoal.",
 "bat.langnote":"Nota: os instrumentos estão disponíveis por enquanto em espanhol e inglês (tradução profissional em andamento); a interface está no seu idioma.",
 "bat.cogH":"Cognitivo-32","bat.cogP":"Matrizes, sequências, raciocínio verbal e rotação espacial. Pontuação com percentil e QI estimado.","bat.cogM":"32 itens · ~13 min",
 "bat.eqSH":"QE Situacional-16","bat.eqSP":"16 cenários reais de encontros e relacionamentos, pontuados por ramo emocional: perceber, usar, compreender, gerenciar.","bat.eqSM":"16 cenários · ~7 min",
 "bat.eqAH":"QE Autorrelato-24","bat.eqAP":"Como você se percebe emocionalmente, nos mesmos 4 ramos. Perfil de 0 a 100 por ramo.","bat.eqAM":"24 afirmações · ~4 min",
 "bat.ipipH":"Personalidade — Big Five (IPIP-50)","bat.ipipP":"O inventário científico de domínio público: Extroversão, Amabilidade, Conscienciosidade, Estabilidade Emocional e Intelecto.","bat.ipipM":"50 afirmações · ~7 min",
 "bat.connH":"Conexão-36","bat.connP":"36 perguntas originais em 3 conjuntos de intimidade crescente, com a arquitetura do procedimento de proximidade de Aron. Responda aqui ou guarde para fazer com seu match.","bat.connM":"36 perguntas · no seu ritmo",
 "bat.start":"Começar","bat.save":"Salvar e continuar","bat.skip":"Pular","bat.tobvault":"Salvar no meu cofre cifrado","bat.again":"Fechar",
 "bat.disclaimer":"Aviso honesto: são instrumentos longos, profissionais em extensão e estrutura, com pontuação real. O QI mostrado é uma estimativa interna (percentil preliminar), não um diagnóstico nem uma medição clínica certificada; o mesmo vale para os perfis emocionais. Personalidade: itens IPIP de domínio público (ipip.ori.org). Todos os demais itens são originais da SmartTwin.",
 "vault.title":"Seu cofre cifrado 🔐","vault.p1":"Ao gerar sua chave, todos os seus resultados e respostas são empacotados em um arquivo cifrado com AES-256 e correlacionados à sua chave pessoal: um único perfil, ilegível sem sua chave. Guarde-a bem: sem ela, nem a SmartTwin consegue abrir seu cofre.",
 "vault.warn":"Copie sua chave agora: ela é mostrada uma única vez.","vault.gen":"Gerar minha chave e baixar meu cofre","vault.p2":"Já tem um cofre? Abra-o aqui para restaurar seu perfil neste dispositivo:","vault.import":"Abrir cofre",
 "ia.title":"Conecte sua IA 🤖","ia.p1":"Seu perfil pode ser analisado pela IA que você usa (Claude, ChatGPT ou outro modelo). Baixe seu “perfil para IA” (gerado por decifragem local, só na sua sessão) e entregue o prompt oficial junto com o arquivo — e se tiver o perfil de outra pessoa, suba os dois juntos: a IA dela dirá o quão compatíveis vocês são, onde brilham e onde podem entrar em atrito.",
 "ia.copy":"Copiar o prompt","ia.dl":"Baixar meu perfil para IA"});

/* Nota de idioma de los instrumentos + reaplicar idioma guardado */
function refreshLangnote(){
  const n = document.getElementById("bat-langnote");
  if (!n) return;
  if (curLang === "es" || curLang === "en") { n.hidden = true; return; }
  n.hidden = false;
  n.textContent = (I18N[curLang] && I18N[curLang]["bat.langnote"]) || "";
}
const _applyLangST = applyLang;
applyLang = function(l){ _applyLangST(l); refreshLangnote(); };
refreshLangnote();
if (curLang !== "es") applyLang(curLang);
