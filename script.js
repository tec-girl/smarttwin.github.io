"use strict";
/* ===== SmartTwin — Fase 1 =====
   Lista de espera: pega aquí la URL pública del Google Form cuando exista
   (déjala vacía para mostrar el aviso de "abre en unos días"). */
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeZ6QYnitrWjbOG-lqTLY9cko9iEYHzikDATbfGYErc6w9HQQ/viewform";
const FORM_EMBED = "https://docs.google.com/forms/d/e/1FAIpQLSeZ6QYnitrWjbOG-lqTLY9cko9iEYHzikDATbfGYErc6w9HQQ/viewform?embedded=true";

/* ===== Lista de espera (Google Forms) ===== */
(function(){
  if (!FORM_URL) return;
  const box = document.getElementById("wait-embed");
  if (FORM_EMBED) {
    const f = document.createElement("iframe");
    f.src = FORM_EMBED; f.title = "SmartTwin — Lista de espera"; f.loading = "lazy";
    box.appendChild(f);
  }
  const p = document.createElement("p");
  const a = document.createElement("a");
  a.href = FORM_URL; a.target = "_blank"; a.rel = "noopener";
  a.className = "btn big"; a.textContent = "✍️ " + (document.querySelector('[data-i18n="wait.title"]')?.textContent || "Lista de espera");
  p.appendChild(a); box.appendChild(p);
  const fb = document.getElementById("wait-fallback");
  if (fb) fb.hidden = true;
})();

/* ===== Diccionarios de la página (es = textos del HTML) ===== */
const I18N = {
en:{
 "nav.modes":"Modes","nav.how":"How it works","nav.tests":"Tests","nav.safety":"Safety","nav.therapy":"Therapy","nav.join":"Join the waitlist",
 "hero.h1":"You don't match with a photo.<br>You match with a <em>mode</em>.",
 "hero.sub":"SmartTwin connects you by mind, intention and plans: IQ and emotional intelligence tests, verified people and real activities to meet without weird games.",
 "hero.cta1":"Take the tests","hero.cta2":"Join the waitlist",
 "hero.note":"Phase 1 is open: try the tests and save your spot. Profiles are coming very soon.",
 "modes.title":"First things first: what are you looking for?","modes.sub":"Every profile picks its mode, and you only see (and are seen by) people in the same mode. No misunderstandings.",
 "modes.m1h":"Serious relationship","modes.m1p":"Build something stable, with mind and heart on the same page.",
 "modes.m2h":"Something short","modes.m2p":"Date for a while and see what happens, no long-term strings.",
 "modes.m3h":"Sex only","modes.m3p":"Verified adults only, with clear consent and zero judgment.",
 "modes.m4h":"Just for an event","modes.m4p":"Company for a concert, a party, an exhibition or a trip.",
 "modes.m5h":"Activities & friendship","modes.m5p":"People to do things with: sports, art, gaming, whatever you love.",
 "how.title":"How it works",
 "how.s1h":"Take the tests","how.s1p":"Short IQ and emotional intelligence tests. Your mental and emotional profile feeds your compatibility.",
 "how.s2h":"Get verified","how.s2p":"Official ID and a selfie. Only real, verified people can chat.",
 "how.s3h":"Match with a plan","how.s3p":"Not just chat: we suggest an activity to meet in real life, safely.",
 "tests.title":"Try it now: the tests","tests.sub":"A short, playable version of the tests profiles will use. Instant results.",
 "tests.iqh":"IQ Test — short version","tests.iqp":"6 challenges of patterns, sequences and logic. How sharp is your mind today?",
 "tests.eqh":"Emotional Intelligence Test","tests.eqp":"6 real dating and relationship situations. How does your heart respond?",
 "tests.start":"Start test","tests.start2":"Start test","tests.resultcta":"I want my profile at launch","tests.again":"Retake test",
 "tests.disclaimer":"Note: these tests are indicative, for self-knowledge and fun. They are not a clinical diagnosis or a certified IQ measurement; on the full platform they feed compatibility together with your mode, your interests and your activities.",
 "safety.title":"Safety first, always",
 "safety.s1h":"Verified identity","safety.s1p":"Official ID + matching selfie. No verification, no chat.",
 "safety.s2h":"Your data stays yours","safety.s2p":"In-app chat without exposing your phone. No exact location, just your city.",
 "safety.s3h":"Active moderation","safety.s3p":"Report and block always at hand. Harassment, fraud or impersonation = ban.",
 "therapy.title":"And if things get serious… therapy",
 "therapy.p1":"SmartTwin will include online therapy with license-verified professionals: individual and couples, at a basic level — communication, jealousy, conflict and self-love.",
 "therapy.soon":"Coming soon · Waitlist first",
 "wait.title":"Waitlist","wait.sub":"Leave your details and your mode. The first verified profiles get in free at launch.",
 "wait.soon":"Registration opens in a few days — check back soon, or take the tests meanwhile. 💜",
 "wait.privacy":"Adults only (18+). Your data is used only to notify you about the launch; it is never sold.",
 "foot.line":"Made with 💜 by Tec Girl · Puebla, Mexico",
 "foot.adults":"Adults-only platform (18+). Know yourself, get verified, and date safely.",
 "foot.rights":"All rights reserved."},
fr:{
 "nav.modes":"Modes","nav.how":"Comment ça marche","nav.tests":"Tests","nav.safety":"Sécurité","nav.therapy":"Thérapie","nav.join":"Liste d'attente",
 "hero.h1":"Tu ne matches pas avec une photo.<br>Tu matches avec un <em>mode</em>.",
 "hero.sub":"SmartTwin te connecte par l'esprit, l'intention et les projets : tests de QI et d'intelligence émotionnelle, personnes vérifiées et activités réelles pour se rencontrer sans jeux bizarres.",
 "hero.cta1":"Faire les tests","hero.cta2":"Rejoindre la liste d'attente",
 "hero.note":"La phase 1 est ouverte : essaie les tests et réserve ta place. Les profils arrivent très bientôt.",
 "modes.title":"D'abord : qu'est-ce que tu cherches ?","modes.sub":"Chaque profil choisit son mode, et tu ne vois (et n'es vu) que par des personnes dans le même mode. Sans malentendus.",
 "modes.m1h":"Relation sérieuse","modes.m1p":"Construire quelque chose de stable, l'esprit et le cœur sur la même page.",
 "modes.m2h":"Quelque chose de court","modes.m2p":"Sortir quelque temps et voir ce qui se passe, sans engagement long.",
 "modes.m3h":"Sexe uniquement","modes.m3p":"Adultes vérifiés uniquement, avec un consentement clair et zéro jugement.",
 "modes.m4h":"Juste pour un événement","modes.m4p":"De la compagnie pour un concert, une fête, une exposition ou un voyage.",
 "modes.m5h":"Activités et amitié","modes.m5p":"Des gens pour faire des choses : sport, art, gaming, ce que tu aimes.",
 "how.title":"Comment ça marche",
 "how.s1h":"Fais les tests","how.s1p":"Tests courts de QI et d'intelligence émotionnelle. Ton profil mental et émotionnel nourrit ta compatibilité.",
 "how.s2h":"Fais-toi vérifier","how.s2p":"Pièce d'identité officielle et selfie. Seules les personnes réelles et vérifiées peuvent discuter.",
 "how.s3h":"Match avec un projet","how.s3p":"Pas que du chat : on te propose une activité pour vous rencontrer dans la vraie vie, en sécurité.",
 "tests.title":"Essaie maintenant : les tests","tests.sub":"Une version courte et jouable des tests que les profils utiliseront. Résultat immédiat.",
 "tests.iqh":"Test de QI — version courte","tests.iqp":"6 défis de motifs, suites et logique. Ton esprit est-il affûté aujourd'hui ?",
 "tests.eqh":"Test d'intelligence émotionnelle","tests.eqp":"6 situations réelles de rendez-vous et de couple. Comment ton cœur répond-il ?",
 "tests.start":"Commencer le test","tests.start2":"Commencer le test","tests.resultcta":"Je veux mon profil au lancement","tests.again":"Refaire le test",
 "tests.disclaimer":"Note : ces tests sont indicatifs, pour la connaissance de soi et le plaisir. Ce ne sont ni un diagnostic clinique ni une mesure certifiée du QI ; sur la plateforme complète, ils nourrissent la compatibilité avec ton mode, tes intérêts et tes activités.",
 "safety.title":"La sécurité d'abord, toujours",
 "safety.s1h":"Identité vérifiée","safety.s1p":"Pièce officielle + selfie correspondant. Sans vérification, pas de chat.",
 "safety.s2h":"Tes données t'appartiennent","safety.s2p":"Chat interne sans exposer ton téléphone. Pas de position exacte, juste ta ville.",
 "safety.s3h":"Modération active","safety.s3p":"Signaler et bloquer toujours à portée de main. Harcèlement, fraude ou usurpation = exclusion.",
 "therapy.title":"Et si ça devient sérieux… la thérapie",
 "therapy.p1":"SmartTwin inclura une thérapie en ligne avec des professionnels au diplôme vérifié : individuelle et de couple, au niveau de base — communication, jalousie, conflits et amour de soi.",
 "therapy.soon":"Très bientôt · D'abord la liste d'attente",
 "wait.title":"Liste d'attente","wait.sub":"Laisse tes coordonnées et ton mode. Les premiers profils vérifiés entrent gratuitement au lancement.",
 "wait.soon":"Les inscriptions ouvrent dans quelques jours — reviens vite, ou fais les tests en attendant. 💜",
 "wait.privacy":"Réservé aux adultes (18+). Tes données servent uniquement à te prévenir du lancement ; elles ne sont jamais vendues.",
 "foot.line":"Fait avec 💜 par Tec Girl · Puebla, Mexique",
 "foot.adults":"Plateforme réservée aux adultes (18+). Connais-toi, fais-toi vérifier et rencontre en sécurité.",
 "foot.rights":"Tous droits réservés."}
};

Object.assign(I18N, {
de:{
 "nav.modes":"Modi","nav.how":"So funktioniert's","nav.tests":"Tests","nav.safety":"Sicherheit","nav.therapy":"Therapie","nav.join":"Warteliste",
 "hero.h1":"Du matchst nicht mit einem Foto.<br>Du matchst mit einem <em>Modus</em>.",
 "hero.sub":"SmartTwin verbindet dich über Verstand, Absicht und Pläne: IQ- und emotionale Intelligenztests, verifizierte Menschen und echte Aktivitäten zum Kennenlernen — ohne seltsame Spielchen.",
 "hero.cta1":"Tests machen","hero.cta2":"Auf die Warteliste",
 "hero.note":"Phase 1 ist offen: Mach die Tests und sichere dir deinen Platz. Profile kommen sehr bald.",
 "modes.title":"Zuerst das Wichtigste: Was suchst du?","modes.sub":"Jedes Profil wählt seinen Modus, und du siehst (und wirst gesehen von) nur Menschen im selben Modus. Keine Missverständnisse.",
 "modes.m1h":"Ernste Beziehung","modes.m1p":"Etwas Stabiles aufbauen, mit Verstand und Herz auf derselben Seite.",
 "modes.m2h":"Etwas Kurzes","modes.m2p":"Eine Weile daten und sehen, was passiert — ohne lange Bindung.",
 "modes.m3h":"Nur Sex","modes.m3p":"Nur verifizierte Erwachsene, mit klarem Einverständnis und null Verurteilung.",
 "modes.m4h":"Nur für ein Event","modes.m4p":"Begleitung für ein Konzert, eine Party, eine Ausstellung oder eine Reise.",
 "modes.m5h":"Aktivitäten & Freundschaft","modes.m5p":"Leute zum Unternehmend: Sport, Kunst, Gaming, was du liebst.",
 "how.title":"So funktioniert's",
 "how.s1h":"Mach die Tests","how.s1p":"Kurze IQ- und emotionale Intelligenztests. Dein mentales und emotionales Profil speist deine Kompatibilität.",
 "how.s2h":"Lass dich verifizieren","how.s2p":"Offizieller Ausweis und ein Selfie. Nur echte, verifizierte Menschen können chatten.",
 "how.s3h":"Match mit Plan","how.s3p":"Nicht nur Chat: Wir schlagen dir eine Aktivität vor, um euch sicher im echten Leben kennenzulernen.",
 "tests.title":"Probier es jetzt: die Tests","tests.sub":"Eine kurze, spielbare Version der Tests, die Profile nutzen werden. Ergebnis sofort.",
 "tests.iqh":"IQ-Test — Kurzversion","tests.iqp":"6 Herausforderungen aus Mustern, Folgen und Logik. Wie scharf ist dein Verstand heute?",
 "tests.eqh":"Test der emotionalen Intelligenz","tests.eqp":"6 echte Dating- und Beziehungssituationen. Wie antwortet dein Herz?",
 "tests.start":"Test starten","tests.start2":"Test starten","tests.resultcta":"Ich will mein Profil zum Start","tests.again":"Test wiederholen",
 "tests.disclaimer":"Hinweis: Diese Tests sind orientierend, zur Selbsterkenntnis und zum Spaß. Sie sind keine klinische Diagnose und keine zertifizierte IQ-Messung; auf der vollständigen Plattform speisen sie die Kompatibilität zusammen mit deinem Modus, deinen Interessen und deinen Aktivitäten.",
 "safety.title":"Sicherheit zuerst, immer",
 "safety.s1h":"Verifizierte Identität","safety.s1p":"Offizieller Ausweis + passendes Selfie. Ohne Verifizierung kein Chat.",
 "safety.s2h":"Deine Daten bleiben deine","safety.s2p":"Interner Chat, ohne deine Telefonnummer preiszugeben. Kein genauer Standort, nur deine Stadt.",
 "safety.s3h":"Aktive Moderation","safety.s3p":"Melden und Blockieren immer griffbereit. Belästigung, Betrug oder Identitätsdiebstahl = Ausschluss.",
 "therapy.title":"Und wenn es ernst wird… Therapie",
 "therapy.p1":"SmartTwin wird Online-Therapie mit lizenzgeprüften Fachleuten anbieten: Einzel- und Paartherapie auf Basisniveau — Kommunikation, Eifersucht, Konflikte und Selbstliebe.",
 "therapy.soon":"Sehr bald · Zuerst die Warteliste",
 "wait.title":"Warteliste","wait.sub":"Hinterlasse deine Daten und deinen Modus. Die ersten verifizierten Profile kommen zum Start kostenlos hinein.",
 "wait.soon":"Die Registrierung öffnet in wenigen Tagen — schau bald wieder vorbei oder mach inzwischen die Tests. 💜",
 "wait.privacy":"Nur für Erwachsene (18+). Deine Daten werden nur verwendet, um dich über den Start zu benachrichtigen; sie werden nie verkauft.",
 "foot.line":"Mit 💜 gemacht von Tec Girl · Puebla, Mexiko",
 "foot.adults":"Plattform nur für Erwachsene (18+). Kenne dich selbst, lass dich verifizieren und date sicher.",
 "foot.rights":"Alle Rechte vorbehalten."},
zh:{
 "nav.modes":"模式","nav.how":"如何运作","nav.tests":"测试","nav.safety":"安全","nav.therapy":"心理辅导","nav.join":"加入候补名单",
 "hero.h1":"你匹配的不是一张照片。<br>你匹配的是一种<em>模式</em>。",
 "hero.sub":"SmartTwin 通过头脑、意图和计划连接你们：智商与情商测试、实名认证的用户、真实的线下活动 — 认识新朋友，不玩套路。",
 "hero.cta1":"做测试","hero.cta2":"加入候补名单",
 "hero.note":"第一阶段已开启：来做测试，抢占你的位置。个人主页即将上线。",
 "modes.title":"先说最重要的：你在寻找什么？","modes.sub":"每个主页都选择自己的模式，你只能看到（也只会被）同一模式的人看到。没有误会。",
 "modes.m1h":"认真交往","modes.m1p":"建立稳定的关系，让头脑和心在同一页上。",
 "modes.m2h":"短期关系","modes.m2p":"交往一段时间看看，不做长期承诺。",
 "modes.m3h":"只约性","modes.m3p":"仅限认证成年人，明确同意，互不评判。",
 "modes.m4h":"只为一次活动","modes.m4p":"找人陪你去音乐会、派对、展览或旅行。",
 "modes.m5h":"活动与友谊","modes.m5p":"找人一起做事：运动、艺术、游戏 — 你喜欢的任何事。",
 "how.title":"如何运作",
 "how.s1h":"做测试","how.s1p":"简短的智商与情商测试。你的思维与情绪画像将用于计算契合度。",
 "how.s2h":"完成认证","how.s2p":"官方证件加自拍。只有真实、已认证的用户才能聊天。",
 "how.s3h":"带着计划匹配","how.s3p":"不只是聊天：我们会推荐一个活动，让你们安全地在线下见面。",
 "tests.title":"现在就来试试：测试","tests.sub":"主页将使用的测试的精简可玩版。即时出结果。",
 "tests.iqh":"智商测试 — 精简版","tests.iqp":"6 道关于图案、数列和逻辑的挑战。你今天的头脑有多敏锐？",
 "tests.eqh":"情商测试","tests.eqp":"6 个真实的约会与恋爱场景。你的心会如何回应？",
 "tests.start":"开始测试","tests.start2":"开始测试","tests.resultcta":"上线时我要自己的主页","tests.again":"重做测试",
 "tests.disclaimer":"提示：这些测试仅供参考，用于自我了解和娱乐。它们不是临床诊断，也不是认证智商测量；在完整平台中，它们会结合你的模式、兴趣和活动来计算契合度。",
 "safety.title":"安全第一，永远",
 "safety.s1h":"身份已认证","safety.s1p":"官方证件 + 本人自拍。没有认证，就不能聊天。",
 "safety.s2h":"你的数据属于你","safety.s2p":"站内聊天，不暴露你的电话。不显示精确位置，只显示城市。",
 "safety.s3h":"主动审核","safety.s3p":"举报和拉黑随时可用。骚扰、诈骗或冒充 = 封号。",
 "therapy.title":"如果关系认真起来…还有心理辅导",
 "therapy.p1":"SmartTwin 将提供由持证专业人士进行的在线辅导：个人与伴侣，基础级别 — 沟通、嫉妒、冲突与自爱。",
 "therapy.soon":"即将推出 · 先加入候补名单",
 "wait.title":"候补名单","wait.sub":"留下你的资料和模式。首批认证主页将在上线时免费进入。",
 "wait.soon":"注册将在几天后开放 — 请稍后再来，或先做做测试。💜",
 "wait.privacy":"仅限成年人（18+）。你的资料仅用于上线通知，绝不出售。",
 "foot.line":"由 Tec Girl 用 💜 制作 · 墨西哥，普埃布拉",
 "foot.adults":"仅限成年人平台（18+）。了解自己，完成认证，安全约会。",
 "foot.rights":"版权所有。"},
pt:{
 "nav.modes":"Modos","nav.how":"Como funciona","nav.tests":"Testes","nav.safety":"Segurança","nav.therapy":"Terapia","nav.join":"Lista de espera",
 "hero.h1":"Você não dá match com uma foto.<br>Você dá match com um <em>modo</em>.",
 "hero.sub":"O SmartTwin te conecta pela mente, pela intenção e pelos planos: testes de QI e inteligência emocional, pessoas verificadas e atividades reais para conhecer gente sem joguinhos estranhos.",
 "hero.cta1":"Fazer os testes","hero.cta2":"Entrar na lista de espera",
 "hero.note":"A Fase 1 está aberta: faça os testes e garanta seu lugar. Os perfis chegam muito em breve.",
 "modes.title":"Primeiro o mais importante: o que você procura?","modes.sub":"Cada perfil escolhe seu modo, e você só vê (e é visto por) pessoas no mesmo modo. Sem mal-entendidos.",
 "modes.m1h":"Relacionamento sério","modes.m1p":"Construir algo estável, com a mente e o coração na mesma página.",
 "modes.m2h":"Algo curto","modes.m2p":"Sair por um tempo e ver o que acontece, sem compromisso longo.",
 "modes.m3h":"Só sexo","modes.m3p":"Apenas adultos verificados, com consentimento claro e zero julgamentos.",
 "modes.m4h":"Só por um evento","modes.m4p":"Companhia para um show, uma festa, uma exposição ou uma viagem.",
 "modes.m5h":"Atividades e amizade","modes.m5p":"Gente para fazer coisas: esporte, arte, gaming, o que você amar.",
 "how.title":"Como funciona",
 "how.s1h":"Faça os testes","how.s1p":"Testes curtos de QI e inteligência emocional. Seu perfil mental e emocional alimenta sua compatibilidade.",
 "how.s2h":"Verifique-se","how.s2p":"Documento oficial e selfie. Só pessoas reais e verificadas podem conversar.",
 "how.s3h":"Match com plano","how.s3p":"Não é só chat: sugerimos uma atividade para se conhecerem na vida real, com segurança.",
 "tests.title":"Experimente agora: os testes","tests.sub":"Uma versão curta e jogável dos testes que os perfis vão usar. Resultado na hora.",
 "tests.iqh":"Teste de QI — versão curta","tests.iqp":"6 desafios de padrões, sequências e lógica. Quão afiada está sua mente hoje?",
 "tests.eqh":"Teste de inteligência emocional","tests.eqp":"6 situações reais de encontros e relacionamentos. Como seu coração responde?",
 "tests.start":"Começar o teste","tests.start2":"Começar o teste","tests.resultcta":"Quero meu perfil no lançamento","tests.again":"Repetir o teste",
 "tests.disclaimer":"Aviso: estes testes são orientativos, para autoconhecimento e diversão. Não são um diagnóstico clínico nem uma medição certificada de QI; na plataforma completa, eles alimentam a compatibilidade junto com seu modo, seus interesses e suas atividades.",
 "safety.title":"Segurança em primeiro lugar, sempre",
 "safety.s1h":"Identidade verificada","safety.s1p":"Documento oficial + selfie correspondente. Sem verificação, sem chat.",
 "safety.s2h":"Seus dados são seus","safety.s2p":"Chat interno sem expor seu telefone. Sem localização exata, só sua cidade.",
 "safety.s3h":"Moderação ativa","safety.s3p":"Denunciar e bloquear sempre à mão. Assédio, fraude ou falsidade = expulsão.",
 "therapy.title":"E se a coisa ficar séria… terapia",
 "therapy.p1":"O SmartTwin incluirá terapia on-line com profissionais de registro verificado: individual e de casal, em nível básico — comunicação, ciúmes, conflitos e amor-próprio.",
 "therapy.soon":"Muito em breve · Primeiro a lista de espera",
 "wait.title":"Lista de espera","wait.sub":"Deixe seus dados e seu modo. Os primeiros perfis verificados entram grátis no lançamento.",
 "wait.soon":"O cadastro abre em poucos dias — volte logo, ou faça os testes enquanto isso. 💜",
 "wait.privacy":"Apenas para adultos (18+). Seus dados são usados só para avisar do lançamento; nunca são vendidos.",
 "foot.line":"Feito com 💜 por Tec Girl · Puebla, México",
 "foot.adults":"Plataforma só para adultos (18+). Conheça-se, verifique-se e encontre com segurança.",
 "foot.rights":"Todos os direitos reservados."}
});

/* ===== Motor de idiomas ===== */
let curLang = localStorage.getItem("smarttwin-lang") || "es";
function applyLang(lang){
  curLang = lang;
  localStorage.setItem("smarttwin-lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh" : lang;
  const dict = I18N[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (lang === "es") { if (el.dataset.es) el.textContent = el.dataset.es; return; }
    if (dict && dict[k]) el.textContent = dict[k];
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const k = el.getAttribute("data-i18n-html");
    if (lang === "es") { if (el.dataset.esHtml) el.innerHTML = el.dataset.esHtml; return; }
    if (dict && dict[k]) el.innerHTML = dict[k];
  });
  document.querySelectorAll(".lang-switch button").forEach((b) =>
    b.classList.toggle("active", b.getAttribute("data-lang") === lang));
}
(function initLang(){
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.dataset.es = el.textContent; });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.dataset.esHtml = el.innerHTML; });
  document.querySelectorAll(".lang-switch button").forEach((b) =>
    b.addEventListener("click", () => applyLang(b.getAttribute("data-lang"))));
  const saved = localStorage.getItem("smarttwin-lang") || "es";
  if (saved !== "es") applyLang(saved);
})();
