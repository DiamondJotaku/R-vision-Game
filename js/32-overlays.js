/* =======================================================
   OVERLAYS : règles, fiche de notes, nouveautés
   ======================================================= */
let ovOpen=false;
function openOv(title,html,after){
  $("#ovTitle").textContent=title;$("#ovBody").innerHTML=html;
  $("#ov").hidden=false;ovOpen=true;pauseAll();
  document.body.style.overflow="hidden";
  $(".ovbox").scrollTop=0;
  if(after)after();
}
function closeOv(){if(!ovOpen)return;$("#ov").hidden=true;ovOpen=false;document.body.style.overflow="";resumeAll()}
$("#ovClose").onclick=closeOv;
$("#ov").onclick=e=>{if(e.target.id==="ov")closeOv()};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&ovOpen)closeOv()});

/* --- fiche de notes --- */
function openCheat(){
  openOv("Fiche de notes",
    `<div class="note">La réponse est là-dedans. Le chrono est en pause tant que cette fiche est ouverte.</div>
     <input class="search" id="cSearch" placeholder="Filtrer : ldap, 3389, PRA, couche 4, SIEM…" autocomplete="off">
     <div id="cList"></div>`,
    ()=>{
      const inp=$("#cSearch");
      $("#cList").innerHTML=ficheHTML("");
      inp.oninput=e=>{$("#cList").innerHTML=ficheHTML(e.target.value)};
    });
}

/* --- règles par mode --- */
const RULES={
 port:{t:"🎯 Le juste port",h:`
  <h3>Le principe</h3>
  <p>Un service réseau est affiché. Ton objectif est de retrouver son <b>numéro de port</b> avant la fin du chrono.</p>
  <h3>Comment jouer ?</h3>
  <ol>
   <li>Regarde le <b>service</b> affiché.</li>
   <li>Saisis un numéro de port puis valide avec <b>OK</b> ou <b>Entrée</b>.</li>
   <li>Si ton nombre est trop petit, le jeu affiche <b>PLUS</b>.</li>
   <li>Si ton nombre est trop grand, le jeu affiche <b>MOINS</b>.</li>
   <li>Trouve le bon port pour gagner <b>1 point</b> et passer au service suivant.</li>
  </ol>
  <h3>⏱️ Chrono</h3>
  <p>Tu as <b>60 secondes</b> pour trouver un maximum de ports. Une mauvaise proposition ne fait pas perdre de point : elle donne seulement un indice <b>PLUS</b> ou <b>MOINS</b>.</p>
  <h3>🎨 Feedback</h3>
  <p><b style="color:var(--l3)">PLUS</b> = le port recherché est plus grand · <b style="color:var(--l6)">MOINS</b> = le port recherché est plus petit · <b style="color:var(--ok)">CORRECT</b> = port trouvé.</p>
  <div class="note">Le bouton 📋 de la Version révision ouvre la fiche de notes et met le chrono en pause. Les records ne sont pas enregistrés en révision.</div>`},
 mara:{t:"🏃 Marathon",h:`
  <h3>Le principe</h3><p>Une course de 1 200 m. Le coureur avance tout seul, mais sa foulée ralentit sans arrêt. Seules les bonnes réponses la relancent.</p>
  <h3>Allure</h3><div class="kv">
   <b>+1,5 m/s</b><span>par bonne réponse</span>
   <b>+2,6 m/s</b><span>et 35 m offerts si une épreuve est bouclée sans aucune faute</span>
   <b>0</b><span>une erreur ne ralentit pas : elle ne coûte que le temps passé dessus</span></div>
  <h3>Paliers</h3><p>Un palier tous les 300 m, quatre en tout. À chaque palier la fatigue s'accentue, donc l'allure retombe plus vite.</p>
  <h3>Fin</h3><p>Allure à zéro, la course s'arrête. Ligne franchie, tu repars pour une étape de 200 m de plus.</p>`},
 bomb:{t:"💣 Désamorçage",h:`
  <h3>Solo</h3><p>Choisis ton calibre : 3, 5 ou 7 modules. Chaque module est une épreuve. Tu attaques ceux que tu veux, dans l'ordre que tu veux, et tu peux changer en cours de route — mais en solo un module quitté repart de zéro.</p>
  <h3>Sanctions</h3><div class="kv"><b>3 erreurs</b><span>elle saute</span><b>−12 s</b><span>par erreur, en plus de la LED allumée</span><b>Chrono à 0</b><span>elle saute aussi</span></div>
  <h3>À deux</h3><p>L'un tient la bombe, l'autre ouvre le <b>Manuel du décodeur</b> sur un second téléphone et saisit le numéro de série affiché. Les tables du manuel sont différentes pour chaque numéro de série.</p>
  <p>Cinq modules : Fils, Clavier chiffré, Flèches, Colorize, et le module Couche qui se déclenche tout seul. Ici les modules gardent leur état : tu peux passer de l'un à l'autre sans rien perdre.</p>
  <div class="note">Le désamorceur ne voit aucune consigne à l'écran : toutes les explications sortent de la bouche du décodeur.</div>`},
 duel:{t:"⚔️ Duel du Saboteur",h:`
  <h3>Le principe</h3><p>Combat au tour par tour. À ton tour tu reçois trois cartes : une épreuve associée à un effet. Le boss riposte ensuite avec une attaque chronométrée.</p>
  <h3>Les effets</h3><div class="kv"><b>⚔️</b><span>inflige des dégâts</span><b>✚</b><span>restaure tes PV</span><b>🛡️</b><span>absorbe la prochaine attaque</span></div>
  <h3>Puissance</h3><p>Plus tu réponds juste, plus l'effet est fort. Une épreuve sans aucune faute devient un coup critique, +30 %.</p>
  <h3>Usure</h3><p>Chaque carte jouée perd <b>0,30</b> de multiplicateur et en regagne <b>0,10</b> à chaque tour où tu ne t'en sers pas. Plancher 0,10, plafond 1,00. Il faut donc tourner entre les épreuves.</p>
  <h3>Riposte</h3><p>Fini avec plus de la moitié du chrono restant : aucun dégât. Chaque erreur pendant la riposte coupe 3 s. Chrono épuisé, tu prends tout.</p>
  <h3>Difficulté</h3><p>Trois niveaux, qui changent les PV des deux camps, les dégâts, les soins, le chrono et le seuil d'esquive. En Facile, une erreur par épreuve est pardonnée.</p>`},
 red:{t:"🔴 Alerte rouge",h:`
  <h3>Le principe</h3><p>Un sabotage est en cours. Quatre épreuves tirées au hasard parmi neuf, à enchaîner avant la fin du compte à rebours.</p>
  <h3>Chrono</h3><div class="kv"><b>−3 s</b><span>par erreur</span><b>+45 s</b><span>quand les quatre épreuves sont bouclées</span></div>
  <h3>Montée</h3><p>Chaque sabotage contenu déclenche le suivant, avec un compte à rebours plus court.</p>`},
 fw:{t:"🧱 Pare-feu",h:`
  <h3>Le principe</h3><p>Des paquets descendent vers le réseau interne, étiquetés par service. Tape le numéro de port sur le pavé, puis OK, avant qu'ils touchent le sol.</p>
  <h3>Lecture de l'étiquette</h3><p>Le nom affiché est parfois l'<b>alias</b> du service et non son nom. Si le service a plusieurs ports, une mention précise lequel est attendu : <em>côté serveur</em>, <em>données</em>, <em>session service</em>…</p>
  <h3>Sanctions</h3><div class="kv"><b>Mauvais port</b><span>la saisie est effacée et un indice s'affiche</span><b>Paquet au sol</b><span>une vie sur trois</span></div>
  <h3>Vagues</h3><p>Toutes les six bonnes réponses, la vague monte : chute plus rapide, paquets plus rapprochés, et jusqu'à trois paquets simultanés en fin de partie.</p>
  <p>Au clavier : les chiffres, ⌫ et Entrée.</p>`},
 soc:{t:"🚨 Cellule de crise",h:`
  <h3>Le principe</h3><p>Une menace attaque le SI et possède une barre de vie. À chaque symptôme, joue la carte outil qui y répond parmi cinq.</p>
  <h3>Chrono</h3><p>Un temps limité par symptôme, qui se raccourcit à chaque menace abattue. Laisser filer le temps compte comme une erreur.</p>
  <h3>Vies</h3><p>Trois. Une mauvaise carte en coûte une.</p>
  <p>Au clavier : les touches 1 à 5.</p>`},
 duo:{t:"👥 Désamorçage à deux",h:`
  <h3>Rôles</h3><p>Le <b>désamorceur</b> garde cet écran et ne voit aucune consigne. Le <b>décodeur</b> ouvre le Manuel sur un autre téléphone, saisit le numéro de série, et donne toutes les instructions à voix haute.</p>
  <h3>Règle d'or</h3><p>Personne ne montre son écran. Le décodeur ne donne jamais la réponse : il dit quel thème, quelle couleur ou quel symbole, c'est au désamorceur de savoir de quel sigle ou de quel port il s'agit.</p>
  <h3>Navigation</h3><p>La grille reste affichée : tu passes d'un module à l'autre quand tu veux, chacun garde son état.</p>
  <h3>Module Couche</h3><p>Il se déclenche seul et n'a aucune table. Douze secondes pour cliquer la bonne couche, sinon c'est une erreur.</p>`},
 zen:{t:"🧘 Mode zen",h:`
  <h3>Le principe</h3><p>Aucun chrono, aucun point de vie, aucune sanction. Les épreuves s'enchaînent et la fiche complète s'affiche à chaque réponse, juste ou fausse.</p>
  <p><b>Autre épreuve</b> passe à la suivante si celle en cours ne te sert à rien. <b>Terminer</b> clôt la session et récupère les XP.</p>
  <div class="note">Le mode à utiliser la veille du contrôle, quand le stress n'aide pas.</div>`}
};
function openRules(k){const r=RULES[k];if(r)openOv(r.t,r.h)}

