/* --- patch notes --- */
const PATCHES=[
{v:"1.7",d:"30 septembre 2026",t:"Questions alignées sur la fiche",h:`
 <h3>🏷️ Thèmes</h3>
 <ul><li>Les thèmes s'affichent <b>sans numérotation</b> (plus de « 1. », « 2. », « 3. », « 4. ») dans tous les modes : téléchargement, triage, chasse à l'intrus, contrôle qualité, bombe à deux.</li>
 <li>Les noms des thèmes sont <b>identiques dans les questions et dans les fiches</b> : « Virtualisation et continuité » et « Gouvernance et incidents » remplacent les anciens intitulés plus longs.</li></ul>
 <h3>✅ Cohérence avec la fiche</h3>
 <ul><li><b>Filtrage des flux</b> : les ports affichés reprennent exactement ceux de la fiche (FTP 20 et 21, FTPS 989 et 990, HTTPS, POP3S et IPsec NAT-T en TCP et UDP).</li>
 <li><b>Cellule de crise</b> : deux énoncés laissaient plusieurs réponses possibles. Le scénario du <b>RAID</b> (qui correspondait aussi à HA) et celui d'<b>IPsec</b> (qui pouvait se répondre VPN) sont reformulés pour n'avoir qu'une seule bonne réponse.</li></ul>
 <h3>🧰 Sous le capot</h3>
 <ul><li>Le site est découpé en fichiers par jeu (<b>css/</b> et <b>js/</b>) : plus rapide à faire évoluer, sans aucun changement de gameplay.</li>
 <li>Suppression de scripts parasites ajoutés par un antivirus lors de l'enregistrement de la page.</li></ul>`},

{v:"1.6",d:"27 septembre 2026",t:"Juste Port : tutoriel et révision",h:`
 <h3>🎯 Juste Port</h3>
 <ul><li>Ajout du bouton <b>?</b> pour consulter le tutoriel et les règles du mode directement depuis la partie ou la salle serveur.</li>
 <li>Le bouton <b>📋</b> est maintenant disponible en <b>Version révision</b> pendant le Juste Port.</li>
 <li>La fiche de notes met le chrono en pause et les records ne sont pas enregistrés pendant la révision.</li></ul>`},

{v:"1.5",d:"27 septembre 2026",t:"Juste Port",h:`
 <h3>🎯 Nouveau mini-jeu</h3>
 <ul><li>Un nouveau mode fait son entrée : <b>Juste Port</b>.</li>
 <li>Le but est de trouver un maximum de ports en <b>60 secondes</b>.</li>
 <li>Le fonctionnement reprend le principe du <b>Juste Prix</b> : après chaque proposition, le jeu indique si le port recherché est <b>plus grand</b> ou <b>plus petit</b>.</li>
 <li>Chaque port trouvé rapporte <b>1 point</b> et le meilleur score est enregistré.</li></ul>
 <h3>🎨 Feedback</h3>
 <ul><li><b>PLUS</b> s'affiche en bleu lorsque le port recherché est supérieur à la proposition.</li>
 <li><b>MOINS</b> s'affiche en orange lorsque le port recherché est inférieur.</li>
 <li><b>CORRECT</b> s'affiche en vert lorsque le port est trouvé.</li>
 <li>Après une tentative, le nombre saisi est automatiquement effacé pour permettre une nouvelle proposition.</li></ul>`},

{v:"1.4",d:"27 septembre 2026",t:"Correctifs d'affichage",h:`
 <h3>Correctif</h3>
 <ul><li>Le <b>?</b> des cartes s'affichait collé en haut à gauche de son rond : une règle de style plus spécifique écrasait son centrage. Il est maintenant parfaitement centré.</li>
 <li>Les fenêtres <b>règles</b> et <b>patch notes</b> défilent pour de bon : la boîte entière est devenue la zone de défilement, avec le titre et les onglets qui restent collés en haut. L'ancien montage dépendait d'un comportement de mise en page que certains navigateurs mobiles n'appliquent pas.</li>
 <li>Le numéro de version est affiché en bas de la salle serveur : pratique pour vérifier que la mise à jour est bien arrivée et que le navigateur ne sert pas une ancienne copie en cache.</li></ul>`},

{v:"1.3",d:"27 septembre 2026",t:"Correctif des fenêtres",h:`
 <h3>Correctif</h3>
 <ul><li>Les fenêtres <b>règles</b> et <b>patch notes</b> ne défilaient pas : tout ce qui dépassait la hauteur de l'écran était coupé et inaccessible. Elles défilent maintenant normalement, jusqu'en bas.</li>
 <li>Hauteur recalculée pour les mobiles, barre d'adresse comprise, et la page derrière ne bouge plus quand on fait défiler la fenêtre.</li>
 <li>Les boutons <b>?</b> des cartes passent de 25 à 34 px : nettement plus faciles à viser au doigt.</li></ul>`},

{v:"1.2",d:"27 septembre 2026",t:"Correctif du module Couche",h:`
 <h3>Correctif</h3>
 <ul><li>Le <b>module Couche</b> de la bombe à deux était presque illisible : son clignotement faisait varier l'opacité de tout le bandeau, texte compris. Le bandeau reste maintenant pleinement visible et c'est son contour rouge qui pulse.</li>
 <li>Bordure épaissie, fond plus dense, rôle OSI en blanc, décompte agrandi.</li>
 <li>L'animation se coupe si « Réduire les animations » est activé sur l'appareil.</li></ul>
 <h3>Patch notes</h3>
 <ul><li>Cette fenêtre liste désormais toutes les versions, de la plus récente à la plus ancienne, chacune dans son onglet.</li>
 <li>À l'ouverture du site, seule la dernière s'affiche.</li></ul>`},

{v:"1.1",d:"26 septembre 2026",t:"Version révision, règles, ports précis",h:`
 <h3>Version révision</h3>
 <ul><li>Un interrupteur <b>Version révision</b> dans la salle serveur. Une fois activé, un bouton <b>📋</b> apparaît pendant les parties et ouvre la fiche de notes où se trouve la réponse.</li>
 <li>Le chrono et les compteurs se mettent en pause tant que la fiche est ouverte.</li>
 <li>Les records ne sont pas enregistrés dans cette version.</li></ul>
 <h3>Règles et nouveautés</h3>
 <ul><li>Un bouton <b>?</b> sur chaque mode, dans la salle serveur comme en cours de partie, donne les règles complètes.</li>
 <li>Le bouton <b>🎁</b> en haut à droite ouvre les patch notes.</li></ul>
 <h3>Ports : on précise lequel</h3>
 <ul><li>Six services ont plusieurs ports. Partout où un port est demandé, le jeu indique lequel : <em>côté serveur</em> ou <em>côté client</em> pour bootps/bootpc, <em>données</em> ou <em>contrôle</em> pour ftp et ftps, <em>name</em>, <em>datagram</em> ou <em>session service</em> pour netbios, <em>demande d'accès</em> ou <em>connexion serveur</em> pour radius, <em>SMTPS implicite</em> ou <em>soumission</em> pour SMTP sécurisé.</li>
 <li>Concerné : Pare-feu, Saisie du code, Dérivation de l'alimentation, Remise en ordre, Alerte rouge et le Clavier chiffré de la bombe à deux.</li></ul>
 <h3>Plus facile</h3>
 <ul><li><b>Marathon</b> : la foulée retombe presque deux fois moins vite. Gains portés à +1,5 m/s par bonne réponse et +2,6 m/s pour une épreuve parfaite.</li>
 <li><b>Appariement mémoire</b> : les cartes sont montrées six secondes avant d'être retournées, avec un bouton pour couper court.</li>
 <li><b>Pare-feu</b> : chute plus lente, paquets plus espacés, trois paquets simultanés au maximum au lieu de cinq.</li>
 <li><b>Duel du Saboteur</b> : la Frappe risquée est retirée. Restent attaque, soin et bouclier.</li></ul>
 <h3>Retiré</h3>
 <ul><li>Le mini-jeu d'arcade <b>La pile</b> quitte la salle serveur. L'épreuve <b>Assemblage de la pile</b> reste dans tous les modes.</li></ul>`},

{v:"1.0",d:"26 septembre 2026",t:"Désamorçage à deux et manuel du décodeur",h:`
 <h3>Bombe à deux joueurs</h3>
 <ul><li>Un <b>désamorceur</b> tient la bombe, un <b>décodeur</b> ouvre le manuel sur un second téléphone. Les deux écrans se synchronisent par un <b>numéro de série à quatre chiffres</b> : chaque série engendre ses propres tables.</li>
 <li>Cinq modules : <b>Fils</b> (couper le sigle du bon thème), <b>Clavier chiffré</b> (un port saisi en symboles), <b>Flèches</b> (trois thèmes à valider, ordre changeant), <b>Colorize</b> (définition → sigle → couleur), <b>Couche</b> (alarme automatique, rôle OSI, douze secondes).</li>
 <li>La grille reste affichée : on passe d'un module à l'autre à volonté, chacun garde son état.</li>
 <li>Le désamorceur ne voit aucune consigne : toutes les explications passent par le décodeur.</li></ul>
 <h3>Manuel du décodeur</h3>
 <ul><li>Accessible depuis la salle serveur. Rôle du décodeur, tables des fils, des symboles, des flèches et des couleurs, et bouton d'impression pour une version papier.</li>
 <li>Un champ <b>série imposée</b> permet de rejouer avec un manuel déjà imprimé.</li></ul>
 <h3>Ailleurs</h3>
 <ul><li>Les alias et les commentaires de la table des ports entrent dans le Pare-feu et l'Alerte rouge. Les alias deviennent filtrables dans les fiches.</li>
 <li>Le Pare-feu ralentit et plafonne le nombre de paquets simultanés.</li></ul>`},

{v:"0.9",d:"26 septembre 2026",t:"Marathon, Désamorçage solo, Mode zen",h:`
 <h3>Marathon</h3>
 <ul><li>Course de 1 200 m avec un coureur qui avance en temps réel. La foulée ralentit seule, les bonnes réponses la relancent.</li>
 <li>Quatre paliers, un tous les 300 m, chacun aggravant la fatigue. Ligne franchie : étape suivante, 200 m de plus.</li></ul>
 <h3>Désamorçage solo</h3>
 <ul><li>Trois calibres : 3 modules en 2 min 30, 5 en 4 min, 7 en 5 min 15. Les modules se traitent dans l'ordre voulu.</li>
 <li>Trois erreurs ou chrono à zéro, elle saute. Chaque erreur coûte aussi douze secondes.</li></ul>
 <h3>Mode zen</h3>
 <ul><li>Ni chrono ni points de vie. Les épreuves s'enchaînent et la fiche s'affiche à chaque réponse, juste ou fausse.</li></ul>
 <h3>Six épreuves de plus</h3>
 <ul><li>Chasse à l'intrus, Contrôle qualité (vrai ou faux), Aiguillage TCP/UDP, Appariement mémoire, Remise en ordre, Étage du service. Dix-huit épreuves au total.</li></ul>`},

{v:"0.8",d:"26 septembre 2026",t:"Duel du Saboteur",h:`
 <h3>Combat au tour par tour</h3>
 <ul><li>Trois cartes par tour : une épreuve associée à un effet — attaque, soin, bouclier.</li>
 <li>Plus on répond juste, plus l'effet est fort. Une épreuve sans faute devient un coup critique.</li>
 <li><b>Usure</b> : une carte jouée perd du multiplicateur et en regagne au repos. Il faut tourner entre les épreuves.</li>
 <li><b>Riposte</b> : cinq attaques chronométrées. Terminée assez vite, elle ne fait aucun dégât.</li>
 <li>Trois boss qui s'enchaînent, trois difficultés qui modifient PV, dégâts, soins, chrono et seuil d'esquive.</li></ul>`},

{v:"0.7",d:"26 septembre 2026",t:"Alerte rouge",h:`
 <h3>Sabotage chronométré</h3>
 <ul><li>Quatre tâches tirées au hasard à enchaîner avant la fin du compte à rebours : fils, téléchargement, code d'accès, séquence du réacteur, tri des flux.</li>
 <li>Chaque erreur coûte trois secondes. Sabotage contenu : quarante-cinq secondes rendues, et l'alerte suivante est plus courte.</li></ul>`},

{v:"0.6",d:"26 septembre 2026",t:"Les trois jeux d'arcade",h:`
 <h3>Fin du questionnaire</h3>
 <ul><li><b>Pare-feu</b> : les paquets tombent, il faut taper leur port avant l'impact.</li>
 <li><b>Cellule de crise</b> : une menace avec barre de vie, un symptôme, cinq cartes outil.</li>
 <li><b>La pile</b> : des éléments à envoyer sur la bonne couche OSI.</li>
 <li>Vies, combos, vagues, sons et grades de Stagiaire à RSSI.</li></ul>`},

{v:"0.1",d:"26 septembre 2026",t:"Première version",h:`
 <h3>Au départ</h3>
 <ul><li>QCM et flashcards sur les 30 sigles, les 33 services de la table des ports et les 7 couches du modèle OSI.</li>
 <li>Quatre modes, suivi de maîtrise par thème, fiches de révision consultables.</li></ul>`}
];
const PATCH_V=PATCHES[0].v;
{const t=$("#verTag");if(t)t.textContent="v"+PATCH_V;}
let patchTab=0;
function patchView(i,withTabs){
  const P=PATCHES[i];
  const tabs=withTabs?`<div class="tabs">${PATCHES.map((x,j)=>
    `<button class="tab ${j===i?"on":""}" data-j="${j}"><b>v${x.v}</b><small>${x.d.replace(" 2026","")}</small></button>`).join("")}</div>`:"";
  return `${tabs}<div class="pv">Version ${P.v} · ${P.d}</div><h3 style="margin-top:0">${P.t}</h3>${P.h}
    ${withTabs?`<div class="note">La progression, les XP et les records sont stockés dans ce navigateur. Effacer les données du site les efface aussi.</div>`
      :`<button class="btn" id="allPatch" style="width:100%;margin-top:14px">Voir tous les patch notes</button>`}`;
}
function renderPatch(i,withTabs){
  patchTab=i;
  $("#ovTitle").textContent=withTabs?"Patch notes":"Nouveautés";
  $("#ovBody").innerHTML=patchView(i,withTabs);
  $("#ovBody").scrollTop=0;

  // Toutes les versions restent directement accessibles dans la grille.
  // Le contenu du patch, lui, défile verticalement dans la fenêtre.

  $("#ovBody").querySelectorAll(".tab").forEach(b=>b.onclick=()=>renderPatch(+b.dataset.j,true));
  const all=$("#allPatch");if(all)all.onclick=()=>renderPatch(0,true);
}
function openPatch(latestOnly){
  openOv(latestOnly?"Nouveautés":"Patch notes","",()=>renderPatch(0,!latestOnly));
  DB.patch=PATCH_V;save();
  const d=$("#newsBtn").querySelector(".dot9");if(d)d.remove();
}
$("#newsBtn").onclick=()=>openPatch(false);

