/* =======================================================
   DONNÉES
   ======================================================= */
const ACROS=[
 {t:"reseau",s:"ACL",d:"Access Control List",def:"Liste de contrôle d'accès qui filtre les flux et le trafic réseau selon des règles de sécurité.",sym:"Il faut filtrer précisément quels flux entrent et sortent d'une interface du routeur."},
 {t:"reseau",s:"DMZ",d:"Demilitarized Zone",def:"Sous-réseau isolé hébergeant les services exposés au public (Web, FTP) tout en protégeant le réseau interne.",sym:"Le serveur web public est installé sur le même réseau que la compta. Où le déplacer ?"},
 {t:"reseau",s:"DNS",d:"Domain Name System",def:"Service de résolution qui transforme les noms de domaine en adresses IP, et inversement.",sym:"Les postes joignent 10.0.0.12 mais pas srv-fichiers.lan. Quel service est en cause ?"},
 {t:"reseau",s:"IPsec",d:"Internet Protocol Security",def:"Suite de protocoles sécurisant les communications IP par chiffrement et authentification au niveau réseau, base des VPN site-à-site.",sym:"Quelle suite de protocoles chiffre et authentifie les paquets IP au niveau réseau, entre le siège et l'agence ?"},
 {t:"reseau",s:"NAT",d:"Network Address Translation",def:"Translation d'adresses qui fait correspondre des IP privées à des IP publiques.",sym:"200 postes en 192.168.1.0/24 doivent sortir sur Internet avec une seule IP publique."},
 {t:"reseau",s:"RADIUS",d:"Remote Authentication Dial-In User Service",def:"Protocole d'authentification centralisée et de gestion des accès distants.",sym:"Le Wi-Fi d'entreprise doit authentifier chaque salarié sur l'annuaire, pas sur une clé partagée."},
 {t:"reseau",s:"VPN",d:"Virtual Private Network",def:"Tunnel chiffré entre un utilisateur ou un site et un réseau distant.",sym:"Les commerciaux en déplacement doivent atteindre le partage interne depuis l'hôtel."},
 {t:"reseau",s:"WAF",d:"Web Application Firewall",def:"Pare-feu applicatif qui protège les sites et applications web des attaques ciblées : injections SQL, XSS…",sym:"Le site e-commerce reçoit des injections SQL dans ses formulaires."},
 {t:"systemes",s:"AD DS",d:"Active Directory Domain Services",def:"Annuaire Microsoft qui centralise la gestion des identités, des machines et des droits d'accès.",sym:"Il faut un annuaire unique pour les comptes, les machines et les droits du domaine."},
 {t:"systemes",s:"AGDLP",d:"Accounts, Global groups, Domain Local groups, Permissions",def:"Modèle de bonnes pratiques pour attribuer les droits NTFS dans l'Active Directory.",sym:"Les droits NTFS sont posés à la main sur chaque utilisateur. Quel modèle appliquer ?"},
 {t:"systemes",s:"DHCP",d:"Dynamic Host Configuration Protocol",def:"Protocole d'attribution dynamique des adresses IP et des paramètres réseau aux machines.",sym:"Les nouveaux portables doivent recevoir IP, masque, passerelle et DNS tout seuls."},
 {t:"systemes",s:"GPO",d:"Group Policy Object",def:"Objet de stratégie de groupe qui déploie configurations et règles de sécurité sur les postes et utilisateurs d'un domaine.",sym:"Il faut imposer le fond d'écran et le verrouillage de session à tous les postes du domaine."},
 {t:"systemes",s:"LAPS",d:"Local Administrator Password Solution",def:"Solution qui gère et fait tourner automatiquement les mots de passe des comptes administrateurs locaux.",sym:"Tous les postes ont le même mot de passe administrateur local depuis trois ans."},
 {t:"systemes",s:"RDS",d:"Remote Desktop Services",def:"Service Microsoft qui héberge des sessions de bureau à distance ou des applications virtualisées.",sym:"Dix utilisateurs doivent travailler sur une appli lourde hébergée sur un serveur unique."},
 {t:"systemes",s:"RODC",d:"Read-Only Domain Controller",def:"Contrôleur de domaine en lecture seule, idéal pour sécuriser les agences distantes.",sym:"L'agence de Lille a besoin d'un contrôleur local, mais son local technique n'est pas sécurisé."},
 {t:"systemes",s:"SMB",d:"Server Message Block",def:"Protocole de partage de fichiers et d'imprimantes sur les réseaux locaux Windows.",sym:"Quel protocole sert le lecteur réseau Z: et les imprimantes partagées ?"},
 {t:"systemes",s:"WDS",d:"Windows Deployment Services",def:"Service de déploiement réseau qui installe des systèmes Windows à distance, de manière industrialisée.",sym:"Quarante postes neufs à installer : il faut booter en PXE et pousser l'image système."},
 {t:"virtu",s:"HA",d:"High Availability",def:"Haute disponibilité : continuité de service automatique en cas de panne matérielle ou logicielle.",sym:"Si un nœud du cluster tombe, les VM doivent redémarrer ailleurs sans intervention."},
 {t:"virtu",s:"KVM",d:"Kernel-based Virtual Machine",def:"Technologie de virtualisation open source intégrée au noyau Linux, utilisée notamment par Proxmox.",sym:"Quel moteur de virtualisation est intégré directement au noyau Linux ?"},
 {t:"virtu",s:"PVE",d:"Proxmox Virtual Environment",def:"Solution de virtualisation open source regroupant machines virtuelles KVM et conteneurs LXC.",sym:"Quel hyperviseur libre gère à la fois des VM KVM et des conteneurs LXC ?"},
 {t:"virtu",s:"PRA",d:"Plan de Reprise d'Activité",def:"Procédure et stratégie permettant de rétablir le système d'information après un sinistre majeur.",sym:"La salle serveur a brûlé. Quel document décrit comment remonter le SI ?"},
 {t:"virtu",s:"PCA",d:"Plan de Continuité d'Activité",def:"Ensemble des mesures visant à maintenir le fonctionnement de l'entreprise pendant une crise.",sym:"Quel plan vise à maintenir l'activité pendant la crise, sans interruption ?"},
 {t:"virtu",s:"RAID",d:"Redundant Array of Independent Disks",def:"Regroupement de plusieurs disques durs pour améliorer les performances et/ou tolérer les pannes matérielles.",sym:"Le serveur regroupe plusieurs disques pour survivre à la panne de l'un d'eux. Quelle technologie ?"},
 {t:"virtu",s:"VM",d:"Virtual Machine",def:"Instance de système d'exploitation virtualisée sur un hyperviseur.",sym:"Comment appelle-t-on un OS complet exécuté au-dessus d'un hyperviseur ?"},
 {t:"gouv",s:"CVE",d:"Common Vulnerabilities and Exposures",def:"Répertoire public standardisé recensant les failles de sécurité connues.",sym:"L'éditeur annonce une faille référencée sous un identifiant public unique. Lequel ?"},
 {t:"gouv",s:"CVSS",d:"Common Vulnerability Scoring System",def:"Système de notation normalisé qui évalue la criticité et la sévérité d'une vulnérabilité.",sym:"La faille est notée 9,8 sur 10. Quel référentiel donne cette note ?"},
 {t:"gouv",s:"SIEM",d:"Security Information and Event Management",def:"Outil de centralisation et d'analyse des logs de sécurité pour détecter les comportements anormaux.",sym:"Il faut corréler les logs de tous les serveurs pour repérer les comportements anormaux."},
 {t:"gouv",s:"SOC",d:"Security Operations Center",def:"Centre opérationnel de cybersécurité chargé de la surveillance, de la détection et de la réponse aux incidents.",sym:"Quelle équipe surveille, détecte et répond aux incidents 24 h sur 24 ?"},
 {t:"gouv",s:"SSO",d:"Single Sign-On",def:"Authentification unique : une seule connexion donne accès à l'ensemble des applications autorisées.",sym:"Les salariés se plaignent de saisir leur mot de passe sur six applications différentes."},
 {t:"gouv",s:"MFA / 2FA",d:"Multi-Factor Authentication / Two-Factor Authentication",def:"Authentification multifacteur ou à double facteur, qui renforce la sécurité des connexions.",sym:"Un mot de passe volé suffit à ouvrir la messagerie. Que rajouter à la connexion ?"}
];

const PORTS=[
 {s:"bootps / bootpc",p:"67 (serveur) et 68 (client)/udp",al:"dhcps, dhcpc",c:"Bootstrap Protocol : ce sont les ports du DHCP."},
 {s:"DNS",p:"53/tcp et udp",c:"Domain Name Server. UDP pour les requêtes, TCP pour les transferts de zone."},
 {s:"epmap",p:"135/tcp et udp",al:"loc-srv",c:"DCE endpoint resolution, le RPC de Windows."},
 {s:"ftp",p:"20 (data) et 21 (control)/tcp",c:"File Transfer Protocol."},
 {s:"ftps",p:"989 (data) et 990 (control)/tcp",c:"FTP over TLS/SSL."},
 {s:"http",p:"80/tcp",al:"www-http",c:"World Wide Web."},
 {s:"https",p:"443/tcp et udp",c:"HTTP over TLS/SSL."},
 {s:"imap",p:"143/tcp",al:"imap4",c:"Internet Message Access Protocol."},
 {s:"imaps",p:"993/tcp",c:"IMAP4 over TLS/SSL."},
 {s:"ipsec-msft",p:"4500/tcp et udp",c:"Microsoft IPsec NAT-T."},
 {s:"isakmp / ike",p:"500/udp",al:"ike",c:"Internet Key Exchange, la négociation des clés IPsec."},
 {s:"kerberos",p:"88/tcp et udp",al:"krb5, kerberos-sec",c:"Authentification du domaine Active Directory."},
 {s:"ldap",p:"389/tcp",c:"Lightweight Directory Access Protocol."},
 {s:"ldaps",p:"636/tcp",al:"sldap",c:"LDAP over TLS/SSL."},
 {s:"microsoft-ds",p:"445/tcp et udp",al:"SMB",c:"SMB, le serveur de fichiers Windows."},
 {s:"ms-sql-s",p:"1433/tcp et udp",c:"Microsoft SQL Server."},
 {s:"ms-wbt-server",p:"3389/tcp et udp",al:"RDP",c:"MS WBT Server, c'est-à-dire le RDP."},
 {s:"MySQL",p:"3306/tcp",c:"Base de données MySQL / MariaDB."},
 {s:"netbios",p:"137 (name), 138 (datagram) et 139 (session)/tcp et udp",al:"nbname",c:"NetBIOS Name, Datagram et Session Service."},
 {s:"nfsd",p:"2049/udp",al:"nfs",c:"NFS server, le partage de fichiers Unix."},
 {s:"ntp",p:"123/udp",c:"Network Time Protocol, synchronisation de l'heure."},
 {s:"pop3",p:"110/tcp",c:"Post Office Protocol version 3."},
 {s:"pop3s",p:"995/tcp et udp",al:"spop3",c:"POP3 over TLS/SSL."},
 {s:"radius",p:"1812 (demande d'accès) et 1813 (connexion srv)/udp",c:"RADIUS authentication protocol."},
 {s:"smtp",p:"25/tcp",al:"mail",c:"Simple Mail Transfer Protocol."},
 {s:"SMTP sécurisé",p:"465 et 587/tcp",c:"SMTP pour l'envoi de client à serveur."},
 {s:"snmp",p:"161/udp",c:"Simple Network Management Protocol, supervision."},
 {s:"ssh",p:"22/tcp",c:"SSH Remote Login Protocol."},
 {s:"telnet",p:"23/tcp",c:"Connexion distante en clair, non chiffrée."},
 {s:"tftp",p:"69/udp",c:"Trivial File Transfer, utilisé par le PXE et WDS."},
 {s:"pptp",p:"1723/tcp",c:"VPN Point-to-Point Tunneling Protocol."},
 {s:"L2TP",p:"1701/udp",c:"Layer 2 Tunneling Protocol, couplé à IPsec."},
 {s:"OpenVPN",p:"1194",c:"VPN open source, en udp par défaut."}
];
PORTS.forEach(p => p.nums = (p.p.match(/\d+/g) || []));
const PORTQ={
 "bootps / bootpc":{"67":"côté serveur","68":"côté client"},
 "ftp":{"20":"données","21":"contrôle"},
 "ftps":{"989":"données","990":"contrôle"},
 "netbios":{"137":"name service","138":"datagram service","139":"session service"},
 "radius":{"1812":"demande d'accès","1813":"connexion serveur"},
 "SMTP sécurisé":{"465":"SMTPS implicite","587":"soumission"}
};
const multi=p=>p.nums.length>1;
function askPort(p,forced){
  if(!multi(p))return{n:p.nums[0],q:"",lbl:p.s,full:p.s};
  const n=forced||p.nums[(Math.random()*p.nums.length)|0],q=(PORTQ[p.s]&&PORTQ[p.s][n])||"";
  return{n,q,lbl:q?`${p.s} <em class="qual">${q}</em>`:p.s,full:q?`${p.s} (${q})`:p.s};
}
const portLine=p=>multi(p)?p.nums.map(n=>`${n}${PORTQ[p.s]&&PORTQ[p.s][n]?` = ${PORTQ[p.s][n]}`:""}`).join(" · "):p.p;

const OSI=[
 {n:1,nom:"Physique",role:"Encodage du signal, câblage et connecteurs, spécifications physiques."},
 {n:2,nom:"Liaison de données",role:"Adresse localement les interfaces, livre les informations localement, méthode MAC."},
 {n:3,nom:"Réseau",role:"Adresse les interfaces globalement et détermine les meilleurs chemins à travers un inter-réseau."},
 {n:4,nom:"Transport",role:"Établit, maintient et termine des sessions entre les périphériques terminaux."},
 {n:5,nom:"Session",role:"Établit des sessions entre les applications."},
 {n:6,nom:"Présentation",role:"Encode, chiffre et compresse les données utiles."},
 {n:7,nom:"Application",role:"Services applicatifs au plus proche des utilisateurs."}
];

const OSI_ITEMS=[
 {n:1,l:"Câble RJ45"},{n:1,l:"Fibre optique"},{n:1,l:"Hub"},{n:1,l:"Encodage du signal"},{n:1,l:"Brochage T568B"},{n:1,l:"Répéteur"},
 {n:2,l:"Adresse MAC"},{n:2,l:"Switch"},{n:2,l:"Trame Ethernet"},{n:2,l:"VLAN"},{n:2,l:"Livraison locale"},{n:2,l:"Wi-Fi 802.11"},
 {n:3,l:"Adresse IP"},{n:3,l:"Routeur"},{n:3,l:"IPsec"},{n:3,l:"ICMP / ping"},{n:3,l:"Masque de sous-réseau"},{n:3,l:"NAT"},{n:3,l:"Meilleur chemin"},
 {n:4,l:"TCP"},{n:4,l:"UDP"},{n:4,l:"Numéro de port"},{n:4,l:"Segment"},{n:4,l:"Handshake en 3 temps"},
 {n:5,l:"Ouverture de session"},{n:5,l:"NetBIOS session"},{n:5,l:"RPC"},{n:5,l:"Dialogue entre applications"},
 {n:6,l:"Chiffrement TLS"},{n:6,l:"Compression"},{n:6,l:"Encodage ASCII"},{n:6,l:"Format JPEG"},
 {n:7,l:"HTTP"},{n:7,l:"DNS"},{n:7,l:"SMTP"},{n:7,l:"FTP"},{n:7,l:"Navigateur web"}
];

const THREATS=[
 {n:"Ransomware « Kryptos »",i:"🔒"},{n:"Exfiltration de données",i:"📤"},{n:"Intrusion sur le VPN",i:"🕳️"},
 {n:"Attaque web massive",i:"🕷️"},{n:"Panne de la baie de disques",i:"💥"},{n:"Compromission d'un compte admin",i:"🎭"}
];

const CATC={reseau:"var(--l3)",systemes:"var(--l2)",virtu:"var(--l4)",gouv:"var(--l7)"};
const CATN={reseau:"Réseau et sécurité périmétrique",systemes:"Systèmes et annuaires",virtu:"Virtualisation et continuité",gouv:"Gouvernance et incidents"};

