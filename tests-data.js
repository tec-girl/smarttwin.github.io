"use strict";
/* =====================================================================
   SmartTwin — Batería completa (datos)
   - Personalidad: IPIP Big Five Factor Markers, 50 ítems — DOMINIO PÚBLICO
     (ipip.ori.org; traducción ES-MX oficial de de Oliveira et al., alojada
     en el propio IPIP). Se reproduce con atribución por ser dominio público.
   - Cognitivo-32, EQ situacional-16, EQ autorreporte-24 y Conexión-36:
     reactivos ORIGINALES de SmartTwin, escritos con la arquitectura de los
     modelos públicos (tipos ICAR, ramas de Mayer-Salovey, sets de Aron).
     Ningún ítem proviene de WAIS, Raven, MSCEIT, EQ-i, TEIQue ni del NYT.
   Idiomas de los instrumentos: ES y EN (traducción profesional al resto
   de idiomas = trabajo posterior; la interfaz sí está en 6 idiomas).
   ===================================================================== */

/* ---------- 1) PERSONALIDAD — IPIP-50 (dominio público) ---------- */
const IPIP_KEY = { /* factor por ítem (1-50) y banderas de ítems inversos */
  factor: ["E","A","C","ES","I","E","A","C","ES","I","E","A","C","ES","I","E","A","C","ES","I","E","A","C","ES","I","E","A","C","ES","I","E","A","C","ES","I","E","A","C","ES","I","E","A","C","ES","I","E","A","C","ES","I"],
  rev: [2,4,6,8,10,12,14,16,18,20,22,24,26,28,29,30,32,34,36,38,39,44,46,49]
};
const IPIP_EN = [
"Am the life of the party.","Feel little concern for others.","Am always prepared.","Get stressed out easily.","Have a rich vocabulary.",
"Don't talk a lot.","Am interested in people.","Leave my belongings around.","Am relaxed most of the time.","Have difficulty understanding abstract ideas.",
"Feel comfortable around people.","Insult people.","Pay attention to details.","Worry about things.","Have a vivid imagination.",
"Keep in the background.","Sympathize with others' feelings.","Make a mess of things.","Seldom feel blue.","Am not interested in abstract ideas.",
"Start conversations.","Am not interested in other people's problems.","Get chores done right away.","Am easily disturbed.","Have excellent ideas.",
"Have little to say.","Have a soft heart.","Often forget to put things back in their proper place.","Get upset easily.","Do not have a good imagination.",
"Talk to a lot of different people at parties.","Am not really interested in others.","Like order.","Change my mood a lot.","Am quick to understand things.",
"Don't like to draw attention to myself.","Take time out for others.","Shirk my duties.","Have frequent mood swings.","Use difficult words.",
"Don't mind being the center of attention.","Feel others' emotions.","Follow a schedule.","Get irritated easily.","Spend time reflecting on things.",
"Am quiet around strangers.","Make people feel at ease.","Am exacting in my work.","Often feel blue.","Am full of ideas."];
const IPIP_ES = [
"Soy el alma de la fiesta","Me preocupo poco por los demás","Siempre estoy preparado","Me estreso con facilidad","Tengo un vocabulario amplio",
"No hablo mucho","Me intereso por la gente","Dejo mis pertenencias en cualquier lado","Estoy relajado la mayor parte del tiempo","Me cuesta entender ideas abstractas",
"Me siento cómodo con la gente","Ofendo a la gente","Pongo atención en los detalles","Me preocupo por todo","Tengo mucha imaginación",
"Prefiero mantenerme al margen","Soy sensible hacia las emociones de otros","Soy desordenado","Rara vez me siento triste","No me interesan las ideas abstractas",
"Comienzo las conversaciones","No me interesan los problemas de otras personas","Realizo mis tareas inmediatamente","Me molesto fácilmente","Tengo excelentes ideas",
"No tengo mucho que decir","Tengo un corazón sensible","A menudo olvido poner las cosas en su lugar","Me disgusto con facilidad","No tengo una buena imaginación",
"En las fiestas hablo con muchas personas diferentes","En realidad no me intereso por los demás","Me gusta el orden","Cambio mucho de humor","Soy rápido para entender las cosas",
"No me gusta llamar la atención","Dedico tiempo a los demás","Evado mis obligaciones","Tengo cambios frecuentes de estado de ánimo","Utilizo palabras difíciles",
"No me importa ser el centro de atención","Siento las emociones de los otros","Hago un programa y lo sigo","Me irrito fácilmente","Dedico tiempo a reflexionar",
"Cuando estoy entre desconocidos me mantengo callado","Hago sentir cómoda a la gente","Soy perfeccionista en mi trabajo","Me siento triste frecuentemente","Estoy lleno de ideas"];

/* ---------- 2) COGNITIVO-32 (original, 4 tipos × 8) ---------- */
/* Matrices: rejillas de glifos con reglas de Carpenter (distribución,
   progresión, rotación, constancia). a = índice de la opción correcta. */
const COG_MATRICES = [
 { q:{es:"Cada fila y cada columna contiene una vez ●, ▲ y ■:\n● ▲ ■\n▲ ■ ●\n■ ● ?",en:"Each row and column contains ●, ▲ and ■ exactly once:\n● ▲ ■\n▲ ■ ●\n■ ● ?"},
   opts:["●","▲","■","◆"], a:1 },
 { q:{es:"En cada fila, la cantidad de barras crece de una en una:\n▮  ▮▮  ▮▮▮\n▮▮  ▮▮▮  ▮▮▮▮\n▮▮▮  ▮▮▮▮  ?",en:"In each row, the number of bars grows one by one:\n▮  ▮▮  ▮▮▮\n▮▮  ▮▮▮  ▮▮▮▮\n▮▮▮  ▮▮▮▮  ?"},
   opts:["▮▮▮▮","▮▮▮▮▮","▮▮▮▮▮▮","▮▮▮"], a:1 },
 { q:{es:"En cada fila, la flecha gira 90° en el sentido de las manecillas del reloj:\n↑  →  ↓\n←  ↑  →\n↓  ←  ?",en:"In each row, the arrow rotates 90° clockwise:\n↑  →  ↓\n←  ↑  →\n↓  ←  ?"},
   opts:["↑","→","↓","←"], a:0 },
 { q:{es:"Cada fila y cada columna contiene una vez ★, ◆ y ●:\n★ ◆ ●\n◆ ● ★\n● ★ ?",en:"Each row and column contains ★, ◆ and ● exactly once:\n★ ◆ ●\n◆ ● ★\n● ★ ?"},
   opts:["★","◆","●","▲"], a:1 },
 { q:{es:"La forma es constante en cada columna y la cantidad crece en cada fila:\n▲  ●  ■\n▲▲  ●●  ■■\n▲▲▲  ●●●  ?",en:"The shape is constant down each column and the count grows across each row:\n▲  ●  ■\n▲▲  ●●  ■■\n▲▲▲  ●●●  ?"},
   opts:["■■","■■■","●●●","▲▲▲"], a:1 },
 { q:{es:"El patrón se alterna como un tablero de ajedrez:\n● ○ ●\n○ ● ○\n● ○ ?",en:"The pattern alternates like a chessboard:\n● ○ ●\n○ ● ○\n● ○ ?"},
   opts:["○","●","◐","■"], a:1 },
 { q:{es:"En cada fila, la cantidad de puntos crece de dos en dos:\n●●  ●●●●  ●●●●●●\n●  ●●●  ●●●●●\n●●●  ●●●●●  ?",en:"In each row, the number of dots grows two by two:\n●●  ●●●●  ●●●●●●\n●  ●●●  ●●●●●\n●●●  ●●●●●  ?"},
   opts:["●●●●●●","●●●●●●●","●●●●●●●●","●●●●"], a:1 },
 { q:{es:"En cada fila, la flecha gira 90° en sentido contrario a las manecillas del reloj:\n→  ↑  ←\n↓  →  ↑\n←  ↓  ?",en:"In each row, the arrow rotates 90° counterclockwise:\n→  ↑  ←\n↓  →  ↑\n←  ↓  ?"},
   opts:["→","↑","↓","←"], a:0 },
];
const COG_SERIES = [
 { q:{es:"Completa la secuencia: 1, 4, 9, 16, 25, …",en:"Complete the sequence: 1, 4, 9, 16, 25, …"}, opts:["30","32","36","49"], a:2 },
 { q:{es:"Completa la secuencia: 81, 27, 9, 3, …",en:"Complete the sequence: 81, 27, 9, 3, …"}, opts:["0","1","2","3"], a:1 },
 { q:{es:"Completa la secuencia: 2, 6, 12, 20, 30, …",en:"Complete the sequence: 2, 6, 12, 20, 30, …"}, opts:["36","40","42","44"], a:2 },
 { q:{es:"Completa la secuencia: 1, 2, 6, 24, 120, …",en:"Complete the sequence: 1, 2, 6, 24, 120, …"}, opts:["600","720","840","1440"], a:1 },
 { q:{es:"Completa la secuencia: 5, 11, 23, 47, 95, …",en:"Complete the sequence: 5, 11, 23, 47, 95, …"}, opts:["189","190","191","192"], a:2 },
 { q:{es:"Completa la secuencia: 2, 3, 5, 9, 17, 33, …",en:"Complete the sequence: 2, 3, 5, 9, 17, 33, …"}, opts:["49","57","65","81"], a:2 },
 { q:{es:"Completa la secuencia: Z, X, U, Q, …",en:"Complete the sequence: Z, X, U, Q, …"}, opts:["J","K","L","M"], a:2 },
 { q:{es:"Completa la secuencia: B, D, H, N, V, …",en:"Complete the sequence: B, D, H, N, V, …"}, opts:["D","F","H","J"], a:1 },
];
const COG_VERBAL = [
 { q:{es:"Libro es a páginas como pared es a…",en:"Book is to pages as wall is to…"},
   opts:{es:["ladrillos","puertas","ventanas","pintura"],en:["bricks","doors","windows","paint"]}, a:0 },
 { q:{es:"¿Qué palabra significa casi lo mismo que «efímero»?",en:"Which word means almost the same as “fleeting”?"},
   opts:{es:["eterno","pasajero","sólido","brillante"],en:["eternal","passing","solid","bright"]}, a:1 },
 { q:{es:"Lo opuesto de «escaso» es…",en:"The opposite of “scarce” is…"},
   opts:{es:["raro","caro","abundante","débil"],en:["rare","expensive","abundant","weak"]}, a:2 },
 { q:{es:"¿Cuál NO pertenece al grupo? rosa · tulipán · roble · margarita",en:"Which does NOT belong? rose · tulip · oak · daisy"},
   opts:{es:["rosa","tulipán","roble","margarita"],en:["rose","tulip","oak","daisy"]}, a:2 },
 { q:{es:"Todos los zorps son azules. Milo es un zorp. Entonces, Milo es…",en:"All zorps are blue. Milo is a zorp. Therefore, Milo is…"},
   opts:{es:["rojo","azul","verde","no se puede saber"],en:["red","blue","green","impossible to know"]}, a:1 },
 { q:{es:"Reloj es a tiempo como termómetro es a…",en:"Clock is to time as thermometer is to…"},
   opts:{es:["frío","vidrio","temperatura","velocidad"],en:["cold","glass","temperature","speed"]}, a:2 },
 { q:{es:"Ana es más alta que Bea. Bea es más alta que Cora. ¿Quién es la más baja?",en:"Ana is taller than Bea. Bea is taller than Cora. Who is the shortest?"},
   opts:{es:["Ana","Bea","Cora","empate"],en:["Ana","Bea","Cora","tie"]}, a:2 },
 { q:{es:"Un tren sale a las 9:40 y el viaje dura 1 h 35 min. ¿A qué hora llega?",en:"A train leaves at 9:40 and the trip takes 1 h 35 min. When does it arrive?"},
   opts:["10:55","11:05","11:15","11:25"], a:2 },
];
const COG_ESPACIAL = [
 { q:{es:"Una flecha apunta al noreste (↗). Gira 180°. ¿Hacia dónde apunta ahora?",en:"An arrow points northeast (↗). It rotates 180°. Where does it point now?"},
   opts:["↖","↗","↙","↘"], a:2 },
 { q:{es:"↖ gira 90° en el sentido de las manecillas del reloj. ¿Cómo queda?",en:"↖ rotates 90° clockwise. What does it become?"},
   opts:["↗","↘","↙","↑"], a:0 },
 { q:{es:"Un reloj marca las 3:00. La manecilla de las horas gira 90° en el sentido de las manecillas del reloj. ¿A qué número apunta ahora?",en:"A clock shows 3:00. The hour hand rotates 90° clockwise. Which number does it point to now?"},
   opts:["4","5","6","12"], a:2 },
 { q:{es:"Estás mirando hacia el este y el norte queda a tu izquierda. Si giras 180°, ¿hacia dónde queda el norte?",en:"You face east and north is on your left. If you turn 180°, where is north?"},
   opts:{es:["a mi izquierda","a mi derecha","frente a mí","detrás de mí"],en:["on my left","on my right","in front of me","behind me"]}, a:1 },
 { q:{es:"Completa el patrón de rotación: ▲ ▶ ▼ ◀ ▲ …",en:"Complete the rotation pattern: ▲ ▶ ▼ ◀ ▲ …"},
   opts:["▲","▶","▼","◀"], a:1 },
 { q:{es:"Doblas una hoja por la mitad dos veces y cortas una esquina del papel doblado. Al abrir la hoja por completo, ¿cuántos agujeros hay?",en:"You fold a sheet in half twice and cut off one corner of the folded paper. When fully unfolded, how many holes are there?"},
   opts:["1","2","4","8"], a:2 },
 { q:{es:"En un cubo, las caras opuestas son: rojo–azul, verde–amarillo, blanco–negro. Si la cara roja está arriba, ¿qué color está abajo?",en:"On a cube, opposite faces are: red–blue, green–yellow, white–black. If red is on top, which color is on the bottom?"},
   opts:{es:["verde","azul","negro","amarillo"],en:["green","blue","black","yellow"]}, a:1 },
 { q:{es:"↘ gira 90° en sentido contrario a las manecillas del reloj. ¿Cómo queda?",en:"↘ rotates 90° counterclockwise. What does it become?"},
   opts:["↗","↖","↙","↓"], a:0 },
];
/* Percentil interno preliminar y IQ estimado (referencia interna, NO clínica).
   raw/32 → [percentil, IQ estimado] */
const COG_NORMA = [[8,5,75],[12,15,84],[16,30,92],[19,45,98],[22,60,104],[24,72,109],[26,82,114],[28,90,119],[29,94,123],[30,97,128],[31,98,132],[32,99,137]];

/* ---------- 3) EQ SITUACIONAL-16 (original, método de consenso) ----------
   4 escenarios por rama de Mayer-Salovey: per=Percibir, use=Usar,
   und=Comprender (Understand), man=Manejar. s = puntaje 0–3. */
const EQ_SIT = [
 { b:"per",
   q:{es:"Durante la cena, tu cita menciona a su ex y de pronto se queda en silencio, mirando su copa. ¿Qué es lo más probable que esté sintiendo?",en:"During dinner, your date mentions their ex and suddenly goes quiet, staring at their glass. What are they most likely feeling?"},
   opts:[
    {t:{es:"Tristeza o incomodidad que todavía está procesando",en:"Sadness or discomfort they are still processing"},s:3},
    {t:{es:"Aburrimiento con la conversación",en:"Boredom with the conversation"},s:1},
    {t:{es:"Quiere que tú hables de tu ex también",en:"They want you to talk about your ex too"},s:0},
    {t:{es:"Solo está cansado/a y con hambre",en:"They are just tired and hungry"},s:1} ] },
 { b:"per",
   q:{es:"Tu match, que antes celebraba tus bromas, ahora responde «ok», «jaja» y «sí». ¿Qué es lo más probable que percibas?",en:"Your match, who used to love your jokes, now replies “ok”, “haha” and “yeah”. What should you most likely perceive?"},
   opts:[
    {t:{es:"Nada; hay gente que escribe así siempre",en:"Nothing; some people just text like that"},s:1},
    {t:{es:"Que algo le molestó o le incomodó, aunque no lo diga",en:"That something bothered or upset them, even if they don't say it"},s:3},
    {t:{es:"Que perdió el interés para siempre",en:"That they lost interest forever"},s:0},
    {t:{es:"Que está ocupado/a y ya está",en:"That they are busy, end of story"},s:1} ] },
 { b:"per",
   q:{es:"Tu cita sonríe y dice que todo está bien, pero tiene los brazos cruzados, se inclina hacia atrás y mira hacia la salida. ¿A qué le das más peso?",en:"Your date smiles and says everything is fine, but their arms are crossed, they lean back and glance at the exit. What do you give more weight to?"},
   opts:[
    {t:{es:"A sus palabras: dijo que está bien",en:"Their words: they said they are fine"},s:0},
    {t:{es:"A su cuerpo: hay una incomodidad que las palabras no dicen",en:"Their body: there is discomfort the words are not saying"},s:3},
    {t:{es:"A que seguro quiere irse contigo a otro lado",en:"They surely want to leave with you to go elsewhere"},s:0},
    {t:{es:"A nada en especial; es muy pronto para leer señales",en:"Nothing in particular; it is too early to read signals"},s:1} ] },
 { b:"per",
   q:{es:"Te presentan a alguien en un grupo: evita el contacto visual y responde con monosílabos a todos, no solo a ti. La lectura más probable es…",en:"You are introduced to someone in a group: they avoid eye contact and answer everyone, not just you, in monosyllables. The most likely reading is…"},
   opts:[
    {t:{es:"Es una persona grosera y punto",en:"They are just a rude person"},s:0},
    {t:{es:"Le caíste mal específicamente tú",en:"They specifically disliked you"},s:0},
    {t:{es:"Ansiedad social o un mal día; no es necesariamente desinterés por ti",en:"Social anxiety or a bad day; it is not necessarily disinterest in you"},s:3},
    {t:{es:"Está jugando a hacerse el/la difícil",en:"They are playing hard to get"},s:1} ] },
 { b:"use",
   q:{es:"Tienes que hablar un tema delicado con tu pareja. ¿Qué estrategia aprovecha mejor tus emociones?",en:"You need to bring up a delicate topic with your partner. Which strategy makes the best use of your emotions?"},
   opts:[
    {t:{es:"Lo suelto en cuanto lo siento, sin filtrar nada",en:"I blurt it out the moment I feel it, unfiltered"},s:0},
    {t:{es:"Identifico primero qué siento y uso eso para ordenar lo que quiero decir",en:"I first identify what I feel and use that to organize what I want to say"},s:3},
    {t:{es:"Lo evito hasta que la emoción desaparezca sola",en:"I avoid it until the emotion goes away on its own"},s:1},
    {t:{es:"Lo digo por mensaje para no sentir nada en persona",en:"I say it by text so I don't have to feel anything in person"},s:1} ] },
 { b:"use",
   q:{es:"Tuviste una cita increíble y estás en las nubes. Esa misma noche debes decidir si aceptas un trabajo en otra ciudad. Lo más sabio emocionalmente es…",en:"You had an amazing date and you are over the moon. That same night you must decide whether to take a job in another city. The emotionally wisest move is…"},
   opts:[
    {t:{es:"Decidir ya: cuando estoy feliz, decido mejor",en:"Decide now: when I am happy, I decide better"},s:0},
    {t:{es:"Disfrutar la euforia pero dormir la decisión; mi estado puede inflar el optimismo",en:"Enjoy the euphoria but sleep on the decision; my state can inflate optimism"},s:3},
    {t:{es:"Rechazarlo: el amor siempre debe ganar",en:"Reject it: love should always win"},s:0},
    {t:{es:"Pedirle a mi cita de una noche que decida por mí",en:"Ask my one-night date to decide for me"},s:0} ] },
 { b:"use",
   q:{es:"Quieres que una cita en casa se sienta cercana y especial. ¿Qué aprovecha mejor cómo funcionan las emociones?",en:"You want an at-home date to feel close and special. What best uses how emotions work?"},
   opts:[
    {t:{es:"Cuidar el ambiente (música, luz, sin pantallas): el entorno moldea lo que sentimos",en:"Set the mood (music, light, no screens): the environment shapes what we feel"},s:3},
    {t:{es:"Hablar de temas serios desde el minuto uno para crear profundidad",en:"Talk about serious topics from minute one to create depth"},s:1},
    {t:{es:"Servir el platillo más caro; el precio crea la emoción",en:"Serve the most expensive dish; price creates the emotion"},s:0},
    {t:{es:"No planear nada: la planeación mata las emociones",en:"Plan nothing: planning kills emotions"},s:1} ] },
 { b:"use",
   q:{es:"Justo antes de una presentación importante recibes un mensaje que te duele mucho. ¿Qué haces con esa emoción?",en:"Right before an important presentation you receive a message that really hurts. What do you do with that emotion?"},
   opts:[
    {t:{es:"La reprimo y finjo que no pasó nada, indefinidamente",en:"Suppress it and pretend nothing happened, indefinitely"},s:1},
    {t:{es:"Cancelo la presentación: primero mi emoción, siempre",en:"Cancel the presentation: my emotion first, always"},s:0},
    {t:{es:"La reconozco, la dejo anotada para procesarla después y uso la respiración para enfocarme ahora",en:"Acknowledge it, note it down to process later, and use breathing to focus now"},s:3},
    {t:{es:"Respondo el mensaje en caliente durante la presentación",en:"Answer the message heatedly during the presentation"},s:0} ] },
 { b:"und",
   q:{es:"Tu pareja dice estar «enojada contigo» pero en realidad siente celos. Debajo de los celos, lo más común es encontrar…",en:"Your partner says they are “angry at you” but actually feels jealous. Underneath jealousy, what is most commonly found?"},
   opts:[
    {t:{es:"Odio verdadero hacia la otra persona",en:"True hatred toward the other person"},s:0},
    {t:{es:"Miedo a perder la relación, mezclado con inseguridad",en:"Fear of losing the relationship, mixed with insecurity"},s:3},
    {t:{es:"Falta de amor, siempre",en:"Lack of love, always"},s:1},
    {t:{es:"Aburrimiento con la rutina",en:"Boredom with routine"},s:1} ] },
 { b:"und",
   q:{es:"Tu cita casi choca de camino al restaurante. Al llegar, te habla cortante y brusco/a. La explicación emocional más probable es…",en:"Your date almost crashed on the way to the restaurant. When they arrive, they speak to you sharply and brusquely. The most likely emotional explanation is…"},
   opts:[
    {t:{es:"Así es su personalidad y no cambiará",en:"That is just their personality and it won't change"},s:0},
    {t:{es:"El susto (miedo) se transformó en irritación; no es realmente contigo",en:"The scare (fear) turned into irritation; it is not really about you"},s:3},
    {t:{es:"Llegó molesto/a porque no le gusta el restaurante",en:"They arrived upset because they dislike the restaurant"},s:1},
    {t:{es:"Es una prueba para ver si la/lo quieres",en:"It is a test to see if you care"},s:0} ] },
 { b:"und",
   q:{es:"Alguien te dice «estoy bien» con lágrimas en los ojos mientras habla de su familia. Lo más acertado es entender que…",en:"Someone tells you “I'm fine” with tears in their eyes while talking about their family. The most accurate understanding is that…"},
   opts:[
    {t:{es:"Está mintiendo y hay que confrontarlo/a",en:"They are lying and must be confronted"},s:0},
    {t:{es:"Pueden coexistir emociones mezcladas: tristeza con alivio, amor con dolor",en:"Mixed emotions can coexist: sadness with relief, love with pain"},s:3},
    {t:{es:"Las lágrimas siempre significan tristeza pura",en:"Tears always mean pure sadness"},s:1},
    {t:{es:"«Estoy bien» debe tomarse literal y cambiar de tema",en:"“I'm fine” should be taken literally and the subject changed"},s:1} ] },
 { b:"und",
   q:{es:"Una pequeña molestia de tu pareja se ignora una y otra vez, sin hablarla nunca. Con el tiempo, lo más probable es que…",en:"A small annoyance from your partner is ignored again and again, never talked about. Over time, it will most likely…"},
   opts:[
    {t:{es:"Desaparezca sola: el tiempo todo lo cura sin hablar",en:"Disappear on its own: time heals everything without talking"},s:0},
    {t:{es:"Se acumule y se convierta en resentimiento o en una explosión mayor",en:"Build up and turn into resentment or a bigger explosion"},s:3},
    {t:{es:"Se convierta en más amor por arte de magia",en:"Turn into more love by magic"},s:0},
    {t:{es:"Se transfiera a otra persona sin consecuencias",en:"Transfer to another person without consequences"},s:1} ] },
 { b:"man",
   q:{es:"Tu match no te responde en todo un día. Tú…",en:"Your match hasn't replied in a whole day. You…"},
   opts:[
    {t:{es:"Le escribo muchos mensajes hasta que conteste",en:"Text them many times until they answer"},s:0},
    {t:{es:"Sigo con mi día con calma; ya responderá",en:"Calmly go on with my day; they'll reply"},s:3},
    {t:{es:"Lo elimino sin decir nada",en:"Delete them without a word"},s:1},
    {t:{es:"Publico indirectas para que reaccione",en:"Post hints so they react"},s:0} ] },
 { b:"man",
   q:{es:"En la primera cita, la otra persona llega 20 minutos tarde. Tú…",en:"On the first date, the other person arrives 20 minutes late. You…"},
   opts:[
    {t:{es:"Me voy sin avisar",en:"Leave without saying anything"},s:1},
    {t:{es:"Le reclamo en cuanto llega",en:"Call them out as soon as they arrive"},s:0},
    {t:{es:"Pregunto si está bien y decidimos cómo seguir",en:"Ask if they're okay and decide together how to go on"},s:3},
    {t:{es:"No digo nada, pero me guardo el enojo",en:"Say nothing, but hold a grudge"},s:1} ] },
 { b:"man",
   q:{es:"Tu pareja quiere revisar tu teléfono. Tú…",en:"Your partner wants to check your phone. You…"},
   opts:[
    {t:{es:"Se lo doy: quien nada debe, nada teme",en:"Hand it over: nothing to hide, nothing to fear"},s:1},
    {t:{es:"Hablo de límites: confianza no es vigilancia",en:"Talk about boundaries: trust is not surveillance"},s:3},
    {t:{es:"Acepto, pero primero reviso el suyo",en:"Agree, but only after checking theirs first"},s:0},
    {t:{es:"Termino la relación sin hablarlo",en:"End the relationship without discussing it"},s:1} ] },
 { b:"man",
   q:{es:"En medio de una discusión fuerte, tú…",en:"In the middle of a heated argument, you…"},
   opts:[
    {t:{es:"Levanto la voz para que me escuchen",en:"Raise my voice to be heard"},s:0},
    {t:{es:"Dejo de hablar por días",en:"Stop talking for days"},s:0},
    {t:{es:"Cedo siempre para que se acabe pronto",en:"Always give in so it ends quickly"},s:1},
    {t:{es:"Pido una pausa y retomamos con calma",en:"Ask for a pause and resume calmly"},s:3} ] },
];

/* ---------- 4) EQ AUTORREPORTE-24 (original, Likert 1–5) ----------
   6 ítems por rama de Mayer-Salovey; rev = ítem inverso. */
const EQ_SELF = [
 { b:"per", rev:false, t:{es:"Reconozco lo que estoy sintiendo en cuanto aparece la emoción",en:"I recognize what I am feeling as soon as the emotion appears"} },
 { b:"per", rev:false, t:{es:"Detecto el estado de ánimo de una persona por su tono de voz",en:"I can tell a person's mood from their tone of voice"} },
 { b:"per", rev:false, t:{es:"Me doy cuenta cuando una emoción está nublando mi juicio",en:"I notice when an emotion is clouding my judgment"} },
 { b:"per", rev:false, t:{es:"Noto cambios pequeños en el ánimo de mi pareja",en:"I notice small changes in my partner's mood"} },
 { b:"per", rev:false, t:{es:"Sé ponerle un nombre preciso a lo que siento",en:"I can give a precise name to what I feel"} },
 { b:"per", rev:true,  t:{es:"A menudo no sé por qué me siento como me siento",en:"I often don't know why I feel the way I feel"} },
 { b:"use", rev:false, t:{es:"Uso mis emociones para concentrarme en lo que de verdad importa",en:"I use my emotions to focus on what truly matters"} },
 { b:"use", rev:false, t:{es:"Cuando estoy de buen humor, resuelvo mejor los problemas",en:"When I am in a good mood, I solve problems better"} },
 { b:"use", rev:false, t:{es:"Puedo motivarme imaginando cómo se sentirá lograr algo",en:"I can motivate myself by imagining how achieving something will feel"} },
 { b:"use", rev:false, t:{es:"Mis emociones me ayudan a decidir a qué prestarle atención primero",en:"My emotions help me decide what to pay attention to first"} },
 { b:"use", rev:false, t:{es:"Aprovecho mi energía emocional en lugar de luchar contra ella",en:"I harness my emotional energy instead of fighting it"} },
 { b:"use", rev:true,  t:{es:"Mis emociones suelen estorbarme más de lo que me ayudan",en:"My emotions tend to get in my way more than they help me"} },
 { b:"und", rev:false, t:{es:"Entiendo cómo una emoción puede transformarse en otra",en:"I understand how one emotion can turn into another"} },
 { b:"und", rev:false, t:{es:"Suelo entender por qué la gente reacciona como reacciona",en:"I usually understand why people react the way they do"} },
 { b:"und", rev:false, t:{es:"Comprendo que alguien pueda sentir amor y enojo al mismo tiempo",en:"I understand that someone can feel love and anger at the same time"} },
 { b:"und", rev:false, t:{es:"Puedo anticipar cómo se sentirá alguien al recibir una noticia",en:"I can anticipate how someone will feel when receiving news"} },
 { b:"und", rev:true,  t:{es:"Me cuesta mucho entender las emociones de los demás",en:"I find it very hard to understand other people's emotions"} },
 { b:"und", rev:false, t:{es:"Distingo bien entre estar triste y estar decepcionado",en:"I can clearly tell being sad from being disappointed"} },
 { b:"man", rev:false, t:{es:"Puedo calmarme después de un disgusto fuerte",en:"I can calm myself down after a strong upset"} },
 { b:"man", rev:false, t:{es:"Cuando discuto, logro mantener la conversación en el tema",en:"When I argue, I manage to keep the conversation on topic"} },
 { b:"man", rev:false, t:{es:"Sé ayudar a alguien a sentirse mejor sin invalidar lo que siente",en:"I know how to help someone feel better without invalidating what they feel"} },
 { b:"man", rev:false, t:{es:"Puedo esperar a estar en calma antes de responder algo importante",en:"I can wait until I am calm before answering something important"} },
 { b:"man", rev:true,  t:{es:"Pierdo el control cuando alguien me critica",en:"I lose control when someone criticizes me"} },
 { b:"man", rev:false, t:{es:"Sé pedir perdón y reparar cuando me equivoco",en:"I know how to apologize and make amends when I am wrong"} },
];

/* ---------- 5) CONEXIÓN-36 (original, arquitectura de Aron: 3×12) ----------
   Preguntas originales de SmartTwin con los TEMAS del procedimiento de
   cercanía de Aron et al. (1997): la estructura y los temas son ideas
   públicas; la redacción es propia. Sin puntaje: actividad para dos. */
const CONN36 = [
 /* Set I — ligero: gustos, aspiraciones, anécdotas seguras */
 {es:"Si pudieras compartir una cena con cualquier persona del mundo, viva o muerta, ¿a quién elegirías y qué le preguntarías primero?",en:"If you could share dinner with anyone in the world, living or dead, who would you choose and what would you ask first?"},
 {es:"Imagina tu día perfecto de principio a fin, sin límites de dinero ni de tiempo. ¿Cómo sería?",en:"Imagine your perfect day from beginning to end, with no limits of money or time. What would it be like?"},
 {es:"Nombra tres cosas por las que te sientes genuinamente agradecido/a en este momento de tu vida.",en:"Name three things you feel genuinely grateful for at this moment in your life."},
 {es:"Si pudieras reescribir una sola cosa de la forma en que creciste, ¿qué cambiarías y por qué?",en:"If you could rewrite just one thing about the way you grew up, what would you change and why?"},
 {es:"Tienen cuatro minutos: cuéntense, por turnos, la historia de su vida con el mayor detalle que puedan.",en:"You have four minutes: take turns telling each other your life story in as much detail as you can."},
 {es:"Si mañana despertaras con un talento o una cualidad completamente nueva, ¿cuál te gustaría estrenar?",en:"If you woke up tomorrow with a completely new talent or quality, which one would you want to try out?"},
 {es:"¿Qué recuerdo guardas como un tesoro y por qué sigue tan vivo?",en:"Which memory do you keep like a treasure, and why is it still so vivid?"},
 {es:"¿Te gustaría ser famoso/a? ¿De qué manera y a cambio de qué precio?",en:"Would you like to be famous? In what way, and at what price?"},
 {es:"¿Qué lugar juega hoy el afecto en tu vida: es motor, es refugio, es deuda, es lujo?",en:"What place does affection hold in your life today: is it an engine, a refuge, a debt, a luxury?"},
 {es:"Describe en tres frases cómo sería una amistad ideal para ti.",en:"Describe in three sentences what an ideal friendship looks like to you."},
 {es:"¿Qué canción, película o libro te define mejor en esta etapa, y por qué?",en:"Which song, movie or book defines you best at this stage, and why?"},
 {es:"Si tuvieras que enseñarle a alguien algo que sabes hacer muy bien, ¿qué le enseñarías en esta misma conversación?",en:"If you had to teach someone something you are really good at, what would you teach them in this very conversation?"},
 /* Set II — valores, familia, logros y el yo profundo */
 {es:"Si pudieras hacerle una sola pregunta al futuro y te respondiera con total honestidad, ¿qué preguntarías?",en:"If you could ask the future a single question and it answered with total honesty, what would you ask?"},
 {es:"¿Qué sueño llevas años aplazando? Sé honesto/a: ¿qué te lo ha impedido de verdad?",en:"What dream have you been postponing for years? Be honest: what has really stopped you?"},
 {es:"¿Cuál consideras el logro más grande de tu vida hasta hoy, incluyendo los que nadie aplaude?",en:"What do you consider the greatest achievement of your life so far, including the ones nobody applauds?"},
 {es:"¿Qué es lo que más protege una amistad duradera: la lealtad, la honestidad, el humor o el tiempo? Ordena y explica.",en:"What protects a lasting friendship most: loyalty, honesty, humor or time? Rank them and explain."},
 {es:"¿Cuál es el recuerdo que más te duele, y qué cambió en ti desde entonces?",en:"Which memory hurts you the most, and what changed in you since then?"},
 {es:"¿Cómo describirías el clima emocional de la casa donde creciste? ¿Se parece al que quieres construir?",en:"How would you describe the emotional climate of the home you grew up in? Does it resemble the one you want to build?"},
 {es:"Habla de tu relación con tu madre: un agradecimiento, una herida y una lección.",en:"Talk about your relationship with your mother: one gratitude, one wound, one lesson."},
 {es:"Formulen tres afirmaciones que empiecen con «nosotros» y sean verdad de ustedes dos en este momento.",en:"Make three statements starting with “we” that are true of you two right now."},
 {es:"Completa esta frase en voz alta: «Ojalá tuviera a alguien con quien compartir…».",en:"Complete this sentence out loud: “I wish I had someone with whom to share…”"},
 {es:"Si esta persona fuera a convertirse en alguien muy cercano, ¿qué debería saber de ti sí o sí desde el principio?",en:"If this person were to become someone very close to you, what should they absolutely know about you from the start?"},
 {es:"Di algo que admires de la otra persona y que no le dirías a alguien que acabas de conocer. Luego cambien de rol.",en:"Say something you admire about the other person that you would not say to someone you just met. Then switch roles."},
 {es:"¿Qué significa para ti «amar bien» a alguien? Da un ejemplo concreto de tu vida.",en:"What does “loving someone well” mean to you? Give a concrete example from your life."},
 /* Set III — vulnerabilidad, interdependencia y honestidad cruda */
 {es:"Cuenta un momento verdaderamente vergonzoso de tu vida. Sin editarlo bonito.",en:"Tell a truly embarrassing moment from your life. Without making it pretty."},
 {es:"¿Cuándo fue la última vez que lloraste frente a otra persona? ¿Y la última vez que lloraste a solas?",en:"When was the last time you cried in front of another person? And the last time you cried alone?"},
 {es:"¿Qué tema es demasiado serio para ti como para bromear sobre él? ¿Por qué ese?",en:"What topic is too serious for you to joke about? Why that one?"},
 {es:"Si esta noche fuera tu última noche y no pudieras despedirte de nadie, ¿qué lamentarías más no haber dicho, y a quién?",en:"If tonight were your last night and you could say goodbye to no one, what would you most regret not having said, and to whom?"},
 {es:"Tu casa se incendia y ya salvaste a las personas y mascotas. Puedes rescatar un solo objeto. ¿Cuál y por qué?",en:"Your house is on fire and you have already saved the people and pets. You can rescue one single object. Which one, and why?"},
 {es:"De todas las personas cercanas a ti, ¿la pérdida de quién te desarmaría más? Puedes decirlo con calma y sin explicar de más.",en:"Of all the people close to you, whose loss would undo you the most? You may say it calmly, without over-explaining."},
 {es:"Comparte un problema personal que estés viviendo y pide el punto de vista de la otra persona. Después pregúntale cómo cree que te sientes con ese problema.",en:"Share a personal problem you are living through and ask for the other person's perspective. Then ask them how they think you feel about that problem."},
 {es:"¿Qué es lo que más te cuesta mostrar de ti en una relación nueva? ¿Qué temes que pase si lo muestras?",en:"What is hardest for you to show of yourself in a new relationship? What do you fear will happen if you show it?"},
 {es:"¿Cuál es la verdad más difícil que has tenido que decirle a alguien que amas? ¿Cómo te fue?",en:"What is the hardest truth you have ever had to tell someone you love? How did it go?"},
 {es:"¿Qué necesitas perdonarte a ti mismo/a todavía? Dilo en voz alta, en una sola frase.",en:"What do you still need to forgive yourself for? Say it out loud, in a single sentence."},
 {es:"¿En qué momento de tu vida te sentiste más solo/a, y qué te sostuvo para salir de ahí?",en:"At what moment in your life did you feel most alone, and what held you up to get out of it?"},
 {es:"Cierre: mírense a los ojos en silencio durante cuatro minutos. Sin hablar, sin mirar el teléfono. Al terminar, cada quien dice una sola palabra.",en:"Closing: look into each other's eyes in silence for four minutes. No talking, no phones. When it ends, each of you says a single word."},
];
