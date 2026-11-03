"use strict";
/* ===== SmartTwin — Fase 1 =====
   Lista de espera: pega aquí la URL pública del Google Form cuando exista
   (déjala vacía para mostrar el aviso de "abre en unos días"). */
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeZ6QYnitrWjbOG-lqTLY9cko9iEYHzikDATbfGYErc6w9HQQ/viewform";
const FORM_EMBED = "https://docs.google.com/forms/d/e/1FAIpQLSeZ6QYnitrWjbOG-lqTLY9cko9iEYHzikDATbfGYErc6w9HQQ/viewform?embedded=true";

/* ================= TESTS =================
   IQ: opciones universales (números/símbolos); solo el enunciado se traduce.
   EQ: enunciado y opciones en 6 idiomas; scores = puntaje emocional 0–3. */
const IQ = [
  { q:{es:"Completa la secuencia: 2, 6, 12, 20, 30, …",en:"Complete the sequence: 2, 6, 12, 20, 30, …",fr:"Complète la suite : 2, 6, 12, 20, 30, …",de:"Vervollständige die Folge: 2, 6, 12, 20, 30, …",zh:"补全数列：2, 6, 12, 20, 30, …",pt:"Complete a sequência: 2, 6, 12, 20, 30, …"},
    opts:["36","40","42","44"], a:2 },
  { q:{es:"¿Qué sigue en el patrón? ▲ ● ▲ ● ▲ …",en:"What comes next in the pattern? ▲ ● ▲ ● ▲ …",fr:"Que vient ensuite dans le motif ? ▲ ● ▲ ● ▲ …",de:"Was kommt als Nächstes im Muster? ▲ ● ▲ ● ▲ …",zh:"图案接下来是什么？▲ ● ▲ ● ▲ …",pt:"O que vem a seguir no padrão? ▲ ● ▲ ● ▲ …"},
    opts:["▲","●","■","◆"], a:1 },
  { q:{es:"Completa la secuencia: 1, 1, 2, 3, 5, 8, …",en:"Complete the sequence: 1, 1, 2, 3, 5, 8, …",fr:"Complète la suite : 1, 1, 2, 3, 5, 8, …",de:"Vervollständige die Folge: 1, 1, 2, 3, 5, 8, …",zh:"补全数列：1, 1, 2, 3, 5, 8, …",pt:"Complete a sequência: 1, 1, 2, 3, 5, 8, …"},
    opts:["11","13","15","21"], a:1 },
  { q:{es:"En cada fila y en cada columna hay dos ▓ y un ░:\n▓ ▓ ░\n▓ ░ ▓\n░ ▓ ?\n¿Qué símbolo falta?",en:"Every row and column has two ▓ and one ░:\n▓ ▓ ░\n▓ ░ ▓\n░ ▓ ?\nWhich symbol is missing?",fr:"Chaque ligne et colonne a deux ▓ et un ░ :\n▓ ▓ ░\n▓ ░ ▓\n░ ▓ ?\nQuel symbole manque ?",de:"Jede Zeile und Spalte hat zwei ▓ und ein ░:\n▓ ▓ ░\n▓ ░ ▓\n░ ▓ ?\nWelches Symbol fehlt?",zh:"每行每列都有两个▓和一个░：\n▓ ▓ ░\n▓ ░ ▓\n░ ▓ ?\n缺哪个符号？",pt:"Cada linha e coluna tem dois ▓ e um ░:\n▓ ▓ ░\n▓ ░ ▓\n░ ▓ ?\nQual símbolo falta?"},
    opts:["▓","░"], a:0 },
  { q:{es:"Completa la secuencia: A, C, F, J, O, …",en:"Complete the sequence: A, C, F, J, O, …",fr:"Complète la suite : A, C, F, J, O, …",de:"Vervollständige die Folge: A, C, F, J, O, …",zh:"补全序列：A, C, F, J, O, …",pt:"Complete a sequência: A, C, F, J, O, …"},
    opts:["S","T","U","V"], a:2 },
  { q:{es:"¿Qué número NO pertenece al grupo? 27 · 64 · 125 · 36 · 216",en:"Which number does NOT belong? 27 · 64 · 125 · 36 · 216",fr:"Quel nombre n'appartient PAS au groupe ? 27 · 64 · 125 · 36 · 216",de:"Welche Zahl gehört NICHT zur Gruppe? 27 · 64 · 125 · 36 · 216",zh:"哪个数字不属于这一组？27 · 64 · 125 · 36 · 216",pt:"Qual número NÃO pertence ao grupo? 27 · 64 · 125 · 36 · 216"},
    opts:["27","64","36","216"], a:2 },
];

const EQ = [
  { q:{es:"Tu match no te responde en todo un día. Tú…",en:"Your match hasn't replied in a whole day. You…",fr:"Ton match ne répond pas de la journée. Tu…",de:"Dein Match antwortet einen ganzen Tag nicht. Du…",zh:"你的匹配对象一整天没回消息。你…",pt:"Seu match não responde o dia todo. Você…"},
    opts:[
      {t:{es:"Le escribo muchos mensajes hasta que conteste",en:"Text them many times until they answer",fr:"Je lui écris plein de messages jusqu'à réponse",de:"Ich schreibe viele Nachrichten, bis er/sie antwortet",zh:"不停发消息直到对方回复",pt:"Mando muitas mensagens até responder"},s:0},
      {t:{es:"Sigo con mi día con calma; ya responderá",en:"Calmly go on with my day; they'll reply",fr:"Je continue ma journée calmement ; il/elle répondra",de:"Ich mache ruhig mit meinem Tag weiter; er/sie wird antworten",zh:"平静地过自己的一天；对方会回的",pt:"Sigo meu dia com calma; já vai responder"},s:3},
      {t:{es:"Lo elimino sin decir nada",en:"Delete them without a word",fr:"Je le/la supprime sans rien dire",de:"Ich lösche ihn/sie ohne ein Wort",zh:"什么都不说就删掉对方",pt:"Excluo sem dizer nada"},s:1},
      {t:{es:"Publico indirectas para que reaccione",en:"Post hints so they react",fr:"Je publie des allusions pour le/la faire réagir",de:"Ich poste Anspielungen, damit er/sie reagiert",zh:"发暗示性的动态让对方有反应",pt:"Posto indiretas para provocar reação"},s:0} ] },
  { q:{es:"En la primera cita, la otra persona llega 20 minutos tarde. Tú…",en:"On the first date, the other person arrives 20 minutes late. You…",fr:"Au premier rendez-vous, l'autre arrive avec 20 minutes de retard. Tu…",de:"Beim ersten Date kommt die andere Person 20 Minuten zu spät. Du…",zh:"第一次约会，对方迟到20分钟。你…",pt:"No primeiro encontro, a pessoa chega 20 minutos atrasada. Você…"},
    opts:[
      {t:{es:"Me voy sin avisar",en:"Leave without saying anything",fr:"Je pars sans prévenir",de:"Ich gehe, ohne etwas zu sagen",zh:"不打招呼就走",pt:"Vou embora sem avisar"},s:1},
      {t:{es:"Le reclamo en cuanto llega",en:"Call them out as soon as they arrive",fr:"Je lui fais des reproches dès son arrivée",de:"Ich mache ihm/ihr sofort Vorwürfe",zh:"对方一到就责备",pt:"Reclamo assim que chega"},s:0},
      {t:{es:"Pregunto si está bien y decidimos cómo seguir",en:"Ask if they're okay and decide together how to go on",fr:"Je demande si tout va bien et on décide ensemble",de:"Ich frage, ob alles okay ist, und wir entscheiden gemeinsam",zh:"先问对方是否没事，再一起决定接下来怎么办",pt:"Pergunto se está tudo bem e decidimos juntos como seguir"},s:3},
      {t:{es:"No digo nada, pero me guardo el enojo",en:"Say nothing, but hold a grudge",fr:"Je ne dis rien, mais je garde ma rancune",de:"Ich sage nichts, behalte aber den Groll",zh:"什么都不说，但把不满记在心里",pt:"Não digo nada, mas guardo a mágoa"},s:1} ] },
  { q:{es:"Tu pareja quiere revisar tu teléfono. Tú…",en:"Your partner wants to check your phone. You…",fr:"Ton/ta partenaire veut regarder ton téléphone. Tu…",de:"Dein Partner will dein Handy durchsehen. Du…",zh:"你的伴侣想看你的手机。你…",pt:"Seu parceiro quer ver seu celular. Você…"},
    opts:[
      {t:{es:"Se lo doy: quien nada debe, nada teme",en:"Hand it over: nothing to hide, nothing to fear",fr:"Je le lui donne : rien à cacher, rien à craindre",de:"Ich gebe es her: Wer nichts verbirgt, hat nichts zu befürchten",zh:"给对方看：没做亏心事就不怕",pt:"Entrego: quem não deve, não teme"},s:1},
      {t:{es:"Hablo de límites: confianza no es vigilancia",en:"Talk about boundaries: trust is not surveillance",fr:"Je parle de limites : la confiance n'est pas de la surveillance",de:"Ich spreche über Grenzen: Vertrauen ist keine Überwachung",zh:"谈界限：信任不是监视",pt:"Converso sobre limites: confiança não é vigilância"},s:3},
      {t:{es:"Acepto, pero primero reviso el suyo",en:"Agree, but only after checking theirs first",fr:"J'accepte, mais je regarde le sien d'abord",de:"Ich stimme zu, sehe mir aber erst seins an",zh:"可以，但先让我看对方的",pt:"Aceito, mas primeiro vejo o dele"},s:0},
      {t:{es:"Termino la relación sin hablarlo",en:"End the relationship without discussing it",fr:"Je mets fin à la relation sans en parler",de:"Ich beende die Beziehung ohne Gespräch",zh:"不沟通就结束关系",pt:"Termino a relação sem conversar"},s:1} ] },
  { q:{es:"En medio de una discusión fuerte, tú…",en:"In the middle of a heated argument, you…",fr:"En pleine dispute, tu…",de:"Mitten in einem heftigen Streit, du…",zh:"激烈争吵时，你…",pt:"No meio de uma discussão forte, você…"},
    opts:[
      {t:{es:"Levanto la voz para que me escuchen",en:"Raise my voice to be heard",fr:"Je hausse la voix pour me faire entendre",de:"Ich werde laut, um gehört zu werden",zh:"提高嗓门让对方听我说话",pt:"Levanto a voz para ser ouvido"},s:0},
      {t:{es:"Dejo de hablar por días",en:"Stop talking for days",fr:"Je ne parle plus pendant des jours",de:"Ich rede tagelang nicht mehr",zh:"好几天不说话",pt:"Paro de falar por dias"},s:0},
      {t:{es:"Cedo siempre para que se acabe pronto",en:"Always give in so it ends quickly",fr:"Je cède toujours pour que ça se termine vite",de:"Ich gebe immer nach, damit es schnell vorbei ist",zh:"总是让步，只求快点结束",pt:"Cedo sempre para acabar logo"},s:1},
      {t:{es:"Pido una pausa y retomamos con calma",en:"Ask for a pause and resume calmly",fr:"Je demande une pause et on reprend calmement",de:"Ich bitte um eine Pause, und wir reden ruhig weiter",zh:"先暂停，冷静后再继续谈",pt:"Peço uma pausa e retomamos com calma"},s:3} ] },
  { q:{es:"Tu mejor amigo te contó un secreto y tu match te pregunta por él. Tú…",en:"Your best friend told you a secret and your match asks about it. You…",fr:"Ton meilleur ami t'a confié un secret et ton match te pose des questions. Tu…",de:"Dein bester Freund hat dir ein Geheimnis erzählt und dein Match fragt danach. Du…",zh:"你最好的朋友告诉你一个秘密，你的匹配对象问起。你…",pt:"Seu melhor amigo te contou um segredo e seu match pergunta sobre ele. Você…"},
    opts:[
      {t:{es:"Se lo cuento: entre nosotros no hay secretos",en:"Tell them: no secrets between us",fr:"Je le raconte : pas de secrets entre nous",de:"Ich erzähle es: Unter uns gibt es keine Geheimnisse",zh:"告诉对方：我们之间没有秘密",pt:"Conto: entre nós não há segredos"},s:0},
      {t:{es:"Protejo el secreto sin mentir: «eso no es mío para contarlo»",en:"Protect the secret without lying: “that's not mine to tell”",fr:"Je protège le secret sans mentir : « ce n'est pas à moi de le raconter »",de:"Ich schütze das Geheimnis ohne zu lügen: „Das ist nicht meins zu erzählen“",zh:"不撒谎地守护秘密：“这不是我能说的”",pt:"Protejo o segredo sem mentir: “isso não é meu para contar”"},s:3},
      {t:{es:"Invento otra versión para salir del paso",en:"Make up another version to get by",fr:"J'invente une autre version pour m'en sortir",de:"Ich erfinde eine andere Version, um rauszukommen",zh:"编个别的版本应付过去",pt:"Invento outra versão para sair da situação"},s:1},
      {t:{es:"Digo que no sé nada del tema",en:"Say I know nothing about it",fr:"Je dis que je n'en sais rien",de:"Ich sage, ich wisse von nichts",zh:"说我什么都不知道",pt:"Digo que não sei de nada"},s:2} ] },
  { q:{es:"Alguien que te gusta te hace una crítica constructiva. Tú…",en:"Someone you like gives you constructive criticism. You…",fr:"Quelqu'un qui te plaît te fait une critique constructive. Tu…",de:"Jemand, den du magst, gibt dir konstruktive Kritik. Du…",zh:"你喜欢的人给你建设性的批评。你…",pt:"Alguém de quem você gosta te faz uma crítica construtiva. Você…"},
    opts:[
      {t:{es:"Me ofendo y le respondo igual",en:"Get offended and fire back",fr:"Je me vexe et je réplique",de:"Ich bin beleidigt und schieße zurück",zh:"生气并回怼",pt:"Fico ofendido e respondo igual"},s:0},
      {t:{es:"Acepto todo sin pensar, aunque me duela",en:"Accept everything without thinking, even if it hurts",fr:"J'accepte tout sans réfléchir, même si ça fait mal",de:"Ich akzeptiere alles unreflektiert, auch wenn es weh tut",zh:"不假思索全盘接受，哪怕很受伤",pt:"Aceito tudo sem pensar, mesmo doendo"},s:1},
      {t:{es:"Escucho y valoro si tiene razón",en:"Listen and consider whether they're right",fr:"J'écoute et j'évalue s'il/elle a raison",de:"Ich höre zu und prüfe, ob er/sie recht hat",zh:"先听，再判断对方说得有没有道理",pt:"Escuto e avalio se tem razão"},s:3},
      {t:{es:"Cambio el tema y lo ignoro",en:"Change the subject and ignore it",fr:"Je change de sujet et je l'ignore",de:"Ich wechsle das Thema und ignoriere es",zh:"转移话题，当没听见",pt:"Mudo de assunto e ignoro"},s:1} ] },
];

/* ===== Textos de la interfaz de los tests (6 idiomas) ===== */
const STR = {
  es:{iqT:"Test de IQ — versión corta",eqT:"Test de inteligencia emocional",prog:"Pregunta {a} de {b}",
    iqScore:"Acertaste {n} de 6",eqScore:"Tu puntaje: {n} de 18",
    iqB3:"Mente aguda 🧠",iqB3x:"Tu lógica y tu ojo para los patrones están en forma. En SmartTwin, tu compatibilidad brillará con mentes igual de curiosas.",
    iqB2:"Mente equilibrada ⚖️",iqB2x:"Buen balance entre lógica e intuición. Con práctica, esos patrones se vuelven tu superpoder.",
    iqB1:"Mente exploradora 🌱",iqB1x:"Hoy los patrones jugaron a las escondidas, pero la curiosidad es la mejor señal: tu match ideal amará descubrir cosas contigo.",
    eqB3:"Corazón sabio 💗",eqB3x:"Comunicas, pones límites sanos y cuidas a los demás sin dejar de cuidarte. Eso, en una relación, vale oro.",
    eqB2:"Corazón en equilibrio 💞",eqB2x:"Respondes bien en la mayoría de las situaciones; con un poco de conciencia en los momentos calientes, serás imparable.",
    eqB1:"Corazón en entrenamiento 🌧️",eqB1x:"Todos empezamos en algún punto: reconocer tus reacciones ya es el primer paso. La terapia básica de SmartTwin nace justo para esto."},
  en:{iqT:"IQ Test — short version",eqT:"Emotional Intelligence Test",prog:"Question {a} of {b}",
    iqScore:"You got {n} out of 6",eqScore:"Your score: {n} out of 18",
    iqB3:"Sharp mind 🧠",iqB3x:"Your logic and pattern-spotting are in shape. On SmartTwin, your compatibility will shine with equally curious minds.",
    iqB2:"Balanced mind ⚖️",iqB2x:"A good balance of logic and intuition. With practice, patterns become your superpower.",
    iqB1:"Explorer mind 🌱",iqB1x:"The patterns played hide-and-seek today, but curiosity is the best sign: your ideal match will love discovering things with you.",
    eqB3:"Wise heart 💗",eqB3x:"You communicate, set healthy boundaries and care for others without forgetting yourself. In a relationship, that's gold.",
    eqB2:"Balanced heart 💞",eqB2x:"You handle most situations well; with a little awareness in heated moments, you'll be unstoppable.",
    eqB1:"Heart in training 🌧️",eqB1x:"Everyone starts somewhere: noticing your reactions is already the first step. SmartTwin's basic therapy exists exactly for this."},
  fr:{iqT:"Test de QI — version courte",eqT:"Test d'intelligence émotionnelle",prog:"Question {a} sur {b}",
    iqScore:"Tu as réussi {n} sur 6",eqScore:"Ton score : {n} sur 18",
    iqB3:"Esprit vif 🧠",iqB3x:"Ta logique et ton œil pour les motifs sont en forme. Sur SmartTwin, ta compatibilité brillera avec des esprits aussi curieux.",
    iqB2:"Esprit équilibré ⚖️",iqB2x:"Un bon équilibre entre logique et intuition. Avec de la pratique, les motifs deviendront ton super-pouvoir.",
    iqB1:"Esprit explorateur 🌱",iqB1x:"Les motifs ont joué à cache-cache aujourd'hui, mais la curiosité est le meilleur signe : ton match idéal adorera découvrir avec toi.",
    eqB3:"Cœur sage 💗",eqB3x:"Tu communiques, tu poses des limites saines et tu prends soin des autres sans t'oublier. En relation, ça vaut de l'or.",
    eqB2:"Cœur en équilibre 💞",eqB2x:"Tu gères bien la plupart des situations ; avec un peu de conscience dans les moments chauds, tu seras inarrêtable.",
    eqB1:"Cœur en entraînement 🌧️",eqB1x:"Tout le monde commence quelque part : remarquer tes réactions est déjà le premier pas. La thérapie de base de SmartTwin existe pour ça."},
  de:{iqT:"IQ-Test — Kurzversion",eqT:"Test der emotionalen Intelligenz",prog:"Frage {a} von {b}",
    iqScore:"Du hast {n} von 6 richtig",eqScore:"Dein Ergebnis: {n} von 18",
    iqB3:"Scharfer Verstand 🧠",iqB3x:"Deine Logik und dein Blick für Muster sind in Form. Auf SmartTwin wird deine Kompatibilität mit ebenso neugierigen Köpfen glänzen.",
    iqB2:"Ausgeglichener Verstand ⚖️",iqB2x:"Eine gute Balance aus Logik und Intuition. Mit Übung werden Muster zu deiner Superkraft.",
    iqB1:"Entdecker-Verstand 🌱",iqB1x:"Die Muster haben heute Verstecken gespielt, aber Neugier ist das beste Zeichen: Dein ideales Match wird es lieben, mit dir Dinge zu entdecken.",
    eqB3:"Weises Herz 💗",eqB3x:"Du kommunizierst, setzt gesunde Grenzen und sorgst für andere, ohne dich zu vergessen. In einer Beziehung ist das Gold wert.",
    eqB2:"Herz im Gleichgewicht 💞",eqB2x:"Du meisterst die meisten Situationen gut; mit etwas Achtsamkeit in heißen Momenten bist du unaufhaltsam.",
    eqB1:"Herz im Training 🌧️",eqB1x:"Jeder fängt irgendwo an: Deine Reaktionen zu bemerken ist schon der erste Schritt. Die Basistherapie von SmartTwin gibt es genau dafür."},
  zh:{iqT:"智商测试 — 精简版",eqT:"情商测试",prog:"第 {a} 题，共 {b} 题",
    iqScore:"你答对了 6 题中的 {n} 题",eqScore:"你的得分：{n} / 18",
    iqB3:"敏锐的头脑 🧠",iqB3x:"你的逻辑和找规律的能力状态很好。在 SmartTwin，你会和同样好奇的头脑格外合拍。",
    iqB2:"平衡的头脑 ⚖️",iqB2x:"逻辑与直觉平衡得很好。多加练习，规律就会成为你的超能力。",
    iqB1:"探索型头脑 🌱",iqB1x:"今天规律跟你玩了捉迷藏，但好奇心是最好的信号：你的理想匹配会喜欢和你一起探索新事物。",
    eqB3:"智慧的心 💗",eqB3x:"你善于沟通、懂得设立健康界限，也能在照顾他人的同时不忘自己。在感情中，这比金子还珍贵。",
    eqB2:"平衡的心 💞",eqB2x:"大多数情况你都处理得很好；在情绪激动时多一点觉察，你将无往不利。",
    eqB1:"成长中的心 🌧️",eqB1x:"每个人都有起点：察觉自己的反应就是第一步。SmartTwin 的基础心理辅导正是为此而设。"},
  pt:{iqT:"Teste de QI — versão curta",eqT:"Teste de inteligência emocional",prog:"Pergunta {a} de {b}",
    iqScore:"Você acertou {n} de 6",eqScore:"Sua pontuação: {n} de 18",
    iqB3:"Mente afiada 🧠",iqB3x:"Sua lógica e seu olho para padrões estão em forma. No SmartTwin, sua compatibilidade vai brilhar com mentes igualmente curiosas.",
    iqB2:"Mente equilibrada ⚖️",iqB2x:"Bom equilíbrio entre lógica e intuição. Com prática, os padrões viram seu superpoder.",
    iqB1:"Mente exploradora 🌱",iqB1x:"Hoje os padrões brincaram de esconde-esconde, mas a curiosidade é o melhor sinal: seu match ideal vai amar descobrir coisas com você.",
    eqB3:"Coração sábio 💗",eqB3x:"Você se comunica, põe limites saudáveis e cuida dos outros sem se esquecer. Num relacionamento, isso vale ouro.",
    eqB2:"Coração em equilíbrio 💞",eqB2x:"Você lida bem com a maioria das situações; com um pouco de consciência nos momentos quentes, será imparável.",
    eqB1:"Coração em treinamento 🌧️",eqB1x:"Todo mundo começa em algum ponto: perceber suas reações já é o primeiro passo. A terapia básica do SmartTwin nasceu exatamente para isso."}
};

/* ===== Motor de los tests ===== */
let curLang = localStorage.getItem("smarttwin-lang") || "es";
let quiz = null; // {type:'iq'|'eq', idx, score}

function s(key){ return (STR[curLang] && STR[curLang][key]) || STR.es[key] || key; }

function startQuiz(type){
  quiz = { type, idx: 0, score: 0 };
  document.getElementById("quiz-result").hidden = true;
  const box = document.getElementById("quiz");
  box.hidden = false;
  box.scrollIntoView({ behavior:"smooth", block:"center" });
  renderQ();
}

function renderQ(){
  const data = quiz.type === "iq" ? IQ : EQ;
  const item = data[quiz.idx];
  const total = data.length;
  document.getElementById("quiz-title").textContent = quiz.type === "iq" ? s("iqT") : s("eqT");
  document.getElementById("quiz-progress").textContent =
    s("prog").replace("{a}", quiz.idx + 1).replace("{b}", total);
  document.getElementById("quiz-fill").style.width = ((quiz.idx) / total * 100) + "%";
  document.getElementById("quiz-q").textContent = item.q[curLang] || item.q.es;
  const opts = document.getElementById("quiz-opts");
  opts.innerHTML = "";
  item.opts.forEach((opt) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = quiz.type === "iq" ? opt : (opt.t[curLang] || opt.t.es);
    b.addEventListener("click", () => answer(opt));
    opts.appendChild(b);
  });
}

function answer(opt){
  const data = quiz.type === "iq" ? IQ : EQ;
  const item = data[quiz.idx];
  if (quiz.type === "iq") { if (item.opts[item.a] === opt) quiz.score++; }
  else { quiz.score += opt.s; }
  quiz.idx++;
  if (quiz.idx < data.length) { renderQ(); } else { showResult(); }
}

function showResult(){
  document.getElementById("quiz").hidden = true;
  document.getElementById("quiz-fill").style.width = "100%";
  const r = document.getElementById("quiz-result");
  let emoji, title, scoreLine, text;
  if (quiz.type === "iq") {
    scoreLine = s("iqScore").replace("{n}", quiz.score);
    if (quiz.score >= 5) { emoji = "🧠"; title = s("iqB3"); text = s("iqB3x"); }
    else if (quiz.score >= 3) { emoji = "⚖️"; title = s("iqB2"); text = s("iqB2x"); }
    else { emoji = "🌱"; title = s("iqB1"); text = s("iqB1x"); }
  } else {
    scoreLine = s("eqScore").replace("{n}", quiz.score);
    if (quiz.score >= 14) { emoji = "💗"; title = s("eqB3"); text = s("eqB3x"); }
    else if (quiz.score >= 8) { emoji = "💞"; title = s("eqB2"); text = s("eqB2x"); }
    else { emoji = "🌧️"; title = s("eqB1"); text = s("eqB1x"); }
  }
  document.getElementById("result-emoji").textContent = emoji;
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-score").textContent = scoreLine;
  document.getElementById("result-text").textContent = text;
  r.hidden = false;
  r.scrollIntoView({ behavior:"smooth", block:"center" });
  quiz = null;
}

document.getElementById("start-iq").addEventListener("click", () => startQuiz("iq"));
document.getElementById("start-eq").addEventListener("click", () => startQuiz("eq"));
document.getElementById("quiz-again").addEventListener("click", () => {
  document.getElementById("quiz-result").hidden = true;
  document.getElementById("tests").scrollIntoView({ behavior:"smooth" });
});

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
