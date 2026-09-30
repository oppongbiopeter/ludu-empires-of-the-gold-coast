/* ============ PATH ALIGNED TO BOARD ART ============
   Board art layout (percent of board image):
   TL blue Dagbon yard ~12-28%,12-28%
   TR purple Ewe ~72-88%,12-28%
   BL teal Fante ~12-28%,72-88%
   BR gold Ashanti ~72-88%,72-88%
   Center stool ~50%,50%
   Paths: vertical/horizontal channels of the cross
*/
const FACTIONS = {
  ashanti:{id:'ashanti',name:'Ashanti',leader:'Osei Tutu I',color:'#c9a227',corner:'BR',
    img:'/ludu/assets/leaders/Leader_Ashanti_Osei_Tutu_I.jpg',
    ability:'All tokens +3 Str this turn',
    entry:32},
  fante:{id:'fante',name:'Fante',leader:'Nana Kobina Ansa',color:'#0d9a9e',corner:'BL',
    img:'/ludu/assets/leaders/Leader_Fante_Nana_Kobina_Ansa.jpg',
    ability:'Recall 2 cards from your reserve',entry:49},
  dagbon:{id:'dagbon',name:'Dagbon',leader:'Naa Gbewaa',color:'#3a7abd',corner:'TL',
    img:'/ludu/assets/leaders/Leader_Dagbon_Naa_Gbewaa.jpg',
    ability:'Advance one token +6',entry:65},
  ewe:{id:'ewe',name:'Ewe',leader:'Togbui Sri',color:'#9b4d96',corner:'TR',
    img:'/ludu/assets/leaders/Leader_Ewe_Togbui_Sri.jpg',
    ability:'Clear effects + bless yard',entry:15}
};
const FID_ORDER = ['ashanti','fante','dagbon','ewe'];

// One cell per painted tile, clockwise. Each die pip advances exactly one cell.
const RING = (function(){
  const ringCoords = [
    [12,42],[16,42],[20,42],[24,42],[28,42],[32,42],
    [36,38],[38,36],[40,34],
    [44.5,31],[44.5,27],[44.5,23],[44.5,19],[44.5,15],[44.5,11],
    [50,11],
    [56.5,11],[56.5,15],[56.5,19],[56.5,23],[56.5,27],[56.5,31],
    [59.6,33.8],[62.2,36.2],[64.8,38.6],[67.2,40.6],
    [71,42.5],[74.5,42.5],[78,42.5],[81.5,42.5],[85,42.5],[88.5,42.5],
    [86,47],
    [88.5,53],[85,53],[81.5,53],[78,53],[74.5,53],[71,53],
    [67,57],[64.2,59.8],[61.2,62.5],[58.2,65.2],
    [56.5,67],[56.5,71],[56.5,75],[56.5,79],[56.5,83],[56.5,87],
    [50,86],
    [44.5,87],[44.5,83],[44.5,79],[44.5,75],[44.5,71],[44.5,67],
    [40,62.8],[38.2,61],[35.2,57.6],
    [32,53],[28,53],[24,53],[20,53],[16,53],[12,53],
    [16,47]
  ];
  const powers = {3:'wind',10:'heal',19:'mist',28:'rain',36:'fire',46:'drum',53:'heal',61:'wind'};
  const safe = new Set([15,32,49,65]);
  return ringCoords.map((c,i)=>({x:c[0],y:c[1], power:powers[i]||null, safe:safe.has(i)}));
})();
const TRACK_LEN = RING.length;
const HOME_LEN = 5;
const HOME_PATH = {
  ashanti:[[80,47],[76,47],[72,47],[68,47],[64,47]],
  fante:[[50,82],[50,78],[50,74],[50,70],[50,65]],
  dagbon:[[22,47],[26,47],[30,47],[34,47],[39,47]],
  ewe:[[50,15],[50,19],[50,23],[50,27],[50,32]]
};

// Yard slots per faction (4 tokens) — match clover yards on art
const YARD = {
  ashanti:[{x:74,y:74},{x:82,y:74},{x:74,y:82},{x:82,y:82}],
  fante:  [{x:18,y:74},{x:26,y:74},{x:18,y:82},{x:26,y:82}],
  dagbon: [{x:18,y:18},{x:26,y:18},{x:18,y:26},{x:26,y:26}],
  ewe:    [{x:74,y:18},{x:82,y:18},{x:74,y:26},{x:82,y:26}]
};
// Home stretch from colored arm into stool
function homeXY(fid, step){
  const path=HOME_PATH[fid]||HOME_PATH.ashanti;
  const p=path[Math.max(0, Math.min(path.length-1, step||0))];
  return {x:p[0], y:p[1]};
}

const POWERS = {
  wind:{name:'Harmattan',ico:'🌪',kind:'hinder',desc:'Hinders foes — their next roll is −1'},
  rain:{name:'Monsoon',ico:'💧',kind:'board',desc:'Whole board — nobody can capture until the turn ends'},
  mist:{name:'Ancestral Mist',ico:'👁',kind:'hinder',desc:'Hinders foes — you draw 1 and they cannot play cards'},
  fire:{name:'Ancestral Fire',ico:'🔥',kind:'hinder',desc:'Hinders foes — strongest enemy on the path goes home'},
  drum:{name:'Talking Drum',ico:'🥁',kind:'help',desc:'Helps you — this piece doubles its Strength'},
  heal:{name:'Grove Heal',ico:'🌿',kind:'help',desc:'Helps you — a piece in your yard gains +3 Strength'}
};
const POWER_KEYS=['wind','heal','rain','fire','mist','drum'];

const CARDS = [
  {id:'w1',name:'Harmattan',effect:'weather',img:'/ludu/assets/cards/Weather_Harmattan_Winds.jpg'},
  {id:'w2',name:'Monsoon',effect:'no_cap',img:'/ludu/assets/cards/Weather_Monsoon_Deluge.jpg'},
  {id:'w3',name:'Mist',effect:'silence',img:'/ludu/assets/cards/Weather_Ancestral_Mist.jpg'},
  {id:'w4',name:'Clear Skies',effect:'clear',img:'/ludu/assets/cards/Weather_Clear_Skies.jpg'},
  {id:'s1',name:'Shadow Courier',effect:'spy',img:'/ludu/assets/cards/Spy_Shadow_Courier.jpg'},
  {id:'s2',name:'Cowrie Whisper',effect:'discard',img:'/ludu/assets/cards/Spy_Cowrie_Whisperer.jpg'},
  {id:'m1',name:'Priestess',effect:'revive',img:'/ludu/assets/cards/Medic_Priestess_of_the_Stool.jpg'},
  {id:'m2',name:'Healer',effect:'boost',img:'/ludu/assets/cards/Medic_Healer_of_the_Grove.jpg'},
  {id:'x1',name:'Ancestral Fire',effect:'scorch',img:'/ludu/assets/cards/Special_Ancestral_Fire_Scorch.jpg'},
  {id:'x2',name:'Talking Drum',effect:'horn',img:'/ludu/assets/cards/Special_Talking_Drum_of_Victory_Horn.jpg'},
  {id:'x3',name:'War Elephant',effect:'elephant',img:'/ludu/assets/cards/Special_War_Elephant_Charge.jpg'},
  {id:'x4',name:'Sankofa',effect:'sankofa',img:'/ludu/assets/cards/Utility_Sankofa_Return.jpg'},
  {id:'x5',name:'Kente Bond',effect:'protect',img:'/ludu/assets/cards/Special_Kente_Bond.jpg'},
];

const CARD_IMG = {
  weather:'/ludu/assets/cards/Weather_Harmattan_Winds.jpg',
  no_cap:'/ludu/assets/cards/Weather_Monsoon_Deluge.jpg',
  silence:'/ludu/assets/cards/Weather_Ancestral_Mist.jpg',
  clear:'/ludu/assets/cards/Weather_Clear_Skies.jpg',
  spy:'/ludu/assets/cards/Spy_Shadow_Courier.jpg',
  discard:'/ludu/assets/cards/Spy_Cowrie_Whisperer.jpg',
  revive:'/ludu/assets/cards/Medic_Priestess_of_the_Stool.jpg',
  boost:'/ludu/assets/cards/Medic_Healer_of_the_Grove.jpg',
  scorch:'/ludu/assets/cards/Special_Ancestral_Fire_Scorch.jpg',
  horn:'/ludu/assets/cards/Special_Talking_Drum_of_Victory_Horn.jpg',
  elephant:'/ludu/assets/cards/Special_War_Elephant_Charge.jpg',
  sankofa:'/ludu/assets/cards/Utility_Sankofa_Return.jpg',
  protect:'/ludu/assets/cards/Special_Kente_Bond.jpg'
};
function C(id,name,effect){ return {id,name,effect,img:CARD_IMG[effect]}; }

/* Eight-card clan decks. A player brings exactly five. The three left behind are a thin reserve. */
const CLAN_DECKS = {
  ashanti:[
    C('ash_fire','Stool Fire','scorch'), C('ash_drum','Talking Drum','horn'),
    C('ash_ele','War Elephant','elephant'), C('ash_kente','Kente Bond','protect'),
    C('ash_priest','Priestess of the Stool','revive'), C('ash_wind','Harmattan','weather'),
    C('ash_san','Sankofa','sankofa'), C('ash_cow','Cowrie Whisper','discard')
  ],
  fante:[
    C('fan_spy','Shadow Courier','spy'), C('fan_cow','Cowrie Market','discard'),
    C('fan_sky','Clear Skies','clear'), C('fan_heal','Lagoon Healer','boost'),
    C('fan_rain','Monsoon','no_cap'), C('fan_mist','Sea Mist','silence'),
    C('fan_bond','Net Bond','protect'), C('fan_priest','Priestess of the Lagoon','revive')
  ],
  dagbon:[
    C('dag_ele','Horse Charge','elephant'), C('dag_san','Return Drum','sankofa'),
    C('dag_horn','Praise Drum','horn'), C('dag_wind','Sahel Wind','weather'),
    C('dag_heal','Grove Healer','boost'), C('dag_fire','Ancestral Fire','scorch'),
    C('dag_spy','Courier','spy'), C('dag_priest','Priestess of the Court','revive')
  ],
  ewe:[
    C('ewe_mist','Ancestral Mist','silence'), C('ewe_sky','Clear the Path','clear'),
    C('ewe_priest','Priestess of the East','revive'), C('ewe_heal','Healer','boost'),
    C('ewe_rain','Rain Over the Volta','no_cap'), C('ewe_bond','Cloth Bond','protect'),
    C('ewe_san','The Bird Looks Back','sankofa'), C('ewe_cow','Market Whisper','discard')
  ],
  fon:[
    C('fon_py','Iron Python','scorch'), C('fon_whisper','Dan Whisper','silence'),
    C('fon_priest','Priestess of the Pythons','revive'), C('fon_cow','Whydah Cowrie','discard'),
    C('fon_rain','Rain of Whydah','no_cap'), C('fon_drum','Dahomey Drum','horn'),
    C('fon_charge','Amazon Charge','elephant'), C('fon_shield','Palm Shield','protect')
  ],
  yoruba:[
    C('yor_fire','Ife Fire','scorch'), C('yor_drum','Drum of the Road','horn'),
    C('yor_heal','Grove Healer','boost'), C('yor_spy','Cowrie Market','spy'),
    C('yor_wind','Harmattan Gate','weather'), C('yor_priest','Priestess of the Beads','revive'),
    C('yor_bond','Aso Bond','protect'), C('yor_return','Calabash Return','sankofa')
  ],
  hausa:[
    C('hau_wind','Harmattan Blade','weather'), C('hau_fire','Desert Fire','scorch'),
    C('hau_spy','Caravan Whisper','spy'), C('hau_priest','Magajiya’s Blessing','revive'),
    C('hau_horse','War Horse','elephant'), C('hau_drum','Praise Drum','horn'),
    C('hau_cow','Market Cut','discard'), C('hau_wall','City Wall','protect')
  ],
  baoule:[
    C('bao_mist','Forest Mist','silence'), C('bao_gold','Gold Weight','boost'),
    C('bao_sky','Clear the Ford','clear'), C('bao_ele','Elephant of the Comoé','elephant'),
    C('bao_priest','Priestess of the Mask','revive'), C('bao_drum','Dance Drum','horn'),
    C('bao_bond','Cloth Bond','protect'), C('bao_bird','The Bird Looks Back','sankofa')
  ],
  kabye:[
    C('kab_wind','Highland Wind','weather'), C('kab_charge','Wrestling Charge','elephant'),
    C('kab_fire','Iron Fire','scorch'), C('kab_rain','Rain on Kara','no_cap'),
    C('kab_heal','Healer of the Hills','boost'), C('kab_priest','Priestess of the Stones','revive'),
    C('kab_spy','Hill Courier','spy'), C('kab_wall','Shield Wall','protect')
  ]
};

/* Invaders wear a Gold Coast yard so the four-color board stays intact. */
const INVADERS = {
  fon:{id:'fon', name:'Fon', region:'Benin', leader:'Queen Adjo', wears:'fante',
    img:'/ludu/assets/leaders/Invader_Fon_Queen_Adjo.jpg', abilityId:'fon',
    ability:'One piece +5 and may capture along its next move'},
  yoruba:{id:'yoruba', name:'Yoruba', region:'Nigeria', leader:'Olori Ireti', wears:'ewe',
    img:'/ludu/assets/leaders/Invader_Yoruba_Olori_Ireti.jpg', abilityId:'yoruba',
    ability:'Your pieces +3. One rival on the path is sent home'},
  hausa:{id:'hausa', name:'Hausa', region:'Nigeria', leader:'Magajiya Dalla', wears:'dagbon',
    img:'/ludu/assets/leaders/Invader_Hausa_Magajiya_Dalla.jpg', abilityId:'hausa',
    ability:'Harmattan cuts rival rolls. Your pieces +2'},
  baoule:{id:'baoule', name:'Baoulé', region:"Côte d'Ivoire", leader:'Nanan Affoue', wears:'ashanti',
    img:'/ludu/assets/leaders/Invader_Baoule_Nanan_Affoue.jpg', abilityId:'baoule',
    ability:'Clears harm and protects the table for the turn'},
  kabye:{id:'kabye', name:'Kabyè', region:'Togo', leader:'Wondefa Tchabi', wears:'fante',
    img:'/ludu/assets/leaders/Invader_Kabye_Wondefa_Tchabi.jpg', abilityId:'kabye',
    ability:'Advances one piece six tiles, even from the yard'}
};

const STORY_NODES = [
  {id:'whydah', name:'Whydah Gate', region:'Benin', foe:'fon', diff:'easy', x:30, y:88,
    blurb:'Queen Adjo of the Fon opens the road. A six still leaves the yard.'},
  {id:'abomey', name:'Abomey Road', region:'Benin', foe:'fon', diff:'normal', x:58, y:76,
    blurb:'The python court presses again, with a harder hand.'},
  {id:'sahel', name:'Sahel Road', region:'Nigeria', foe:'hausa', diff:'normal', x:74, y:62,
    blurb:'Magajiya Dalla rides the harmattan down from the north.'},
  {id:'ife', name:'Ife Crossroads', region:'Nigeria', foe:'yoruba', diff:'hard', x:46, y:50,
    blurb:'Olori Ireti holds the crossroads in indigo and coral.'},
  {id:'comoe', name:'Comoé Ford', region:"Côte d'Ivoire", foe:'baoule', diff:'hard', x:28, y:38,
    blurb:'Nanan Affoue waits at the ford, forest at her back.'},
  {id:'kara', name:'Kara Highlands', region:'Togo', foe:'kabye', diff:'hard', x:64, y:28,
    blurb:'Wondefa Tchabi challenges you on the high red road.'},
  {id:'return', name:'The Long Return', region:'The Coast', foe:'fon', diff:'advanced', x:40, y:16,
    blurb:'Queen Adjo returns. The stool is in sight.'},
  {id:'besieged', name:'Stool Besieged', region:'The Coast', foe:'yoruba', diff:'advanced', x:52, y:7,
    blurb:'Olori Ireti stands at the last gate.'}
];

const Story = {
  key:'ludu_story_v1',
  selected:0,
  load(){
    try{ return Object.assign({cleared:[]}, JSON.parse(localStorage.getItem(this.key)||'{}')); }
    catch(e){ return {cleared:[]}; }
  },
  save(p){ try{ localStorage.setItem(this.key, JSON.stringify(p)); }catch(e){} },
  nextIndex(){
    const p=this.load();
    const i=STORY_NODES.findIndex(n=>!(p.cleared||[]).includes(n.id));
    return i<0 ? STORY_NODES.length-1 : i;
  },
  isOpen(i){
    if(i<=0) return true;
    const p=this.load();
    return (p.cleared||[]).includes(STORY_NODES[i-1].id);
  },
  clear(id){
    const p=this.load();
    if(!(p.cleared||[]).includes(id)) p.cleared.push(id);
    this.save(p);
  }
};

const ACHIEVEMENTS = [
  {id:'first_win',name:'Claim the Stool',desc:'Win your first game',ico:'👑'},
  {id:'first_cap',name:'First Blood',desc:'Capture an enemy token',ico:'⚔️'},
  {id:'power_3',name:'Spirit Touched',desc:'Trigger 3 board power-ups in one game',ico:'✨'},
  {id:'hard_win',name:'Against the Odds',desc:'Win on Hard AI',ico:'🔥'},
  {id:'hotseat',name:'Palaver',desc:'Finish a 3+ player hotseat game',ico:'🪑'},
  {id:'all_home',name:'Full Court',desc:'Seat all 4 tokens on the Stool',ico:'🏆'},
  {id:'scorch',name:'Ancestral Wrath',desc:'Play Ancestral Fire / Fire power',ico:'🌋'},
  {id:'leader',name:'Royal Decree',desc:'Use a leader ability',ico:'📜'},
  {id:'games_5',name:'Regular at Court',desc:'Play 5 games',ico:'🎲'},
  {id:'win_streak_2',name:'Momentum',desc:'Win 2 games in a row',ico:'💫'},
  {id:'share',name:'Herald',desc:'Share the game or a victory',ico:'📢'},
  {id:'login',name:'Named Among Kings',desc:'Create or login to an account',ico:'🪪'},
];

/* ============ STORAGE / AUTH ============ */
const Store = {
  key:'ludu_gold_coast_v1',
  load(){try{return JSON.parse(localStorage.getItem(this.key))||{users:{},session:null};}catch(e){return{users:{},session:null};}},
  save(d){localStorage.setItem(this.key,JSON.stringify(d));},
  data:null,
  init(){this.data=this.load();},
  user(){const s=this.data.session;return s?this.data.users[s]:null;},
  ensureStats(u){
    if(!u.stats) u.stats={wins:0,losses:0,games:0,captures:0,powers:0,streak:0};
    if(!u.ach) u.ach=[];
    return u;
  }
};
Store.init();

let meta = {
  mode:'ai', // ai | hotseat | solo
  difficulty:'normal',
  solo:'warrior',
  aiCount:3,
  hotCount:4,
  mpOpponents:3,
  altAshanti:false,
  altFante:false,
  speed:'normal',
  gameSpeed:100,
  powerSpeed:55,
  moveMode:'choose',
  diceCount:1,
  safeHouses:true,
  barriers:false,
  sixToExit:true,
  removeOnCapture:false,
  againOnCapture:false,
  boardRot:0,
  lang:'en',
  seats:[],
  pickIndex:0,
  picks:{}
};

function dieCount(){ return meta.diceCount===1 ? 1 : 2; }
function dieSlots(){ return dieCount()===1 ? [0] : [0,1]; }
function pace(ms){
  const spd=Math.max(40, Math.min(240, meta.gameSpeed||100));
  return Math.max(28, Math.round(ms * (100/spd)));
}
function powerPace(ms){
  const spd=Math.max(30, Math.min(180, meta.powerSpeed||55));
  return Math.max(160, Math.round(ms * (100/spd)));
}
function applyPace(){
  document.documentElement.style.setProperty('--step', pace(240)+'ms');
  document.documentElement.style.setProperty('--power-pop', powerPace(900)+'ms');
  document.documentElement.style.setProperty('--power-burst', powerPace(1200)+'ms');
  document.documentElement.style.setProperty('--power-hold', powerPace(2000)+'ms');
  const b=document.getElementById('board');
  if(b) b.style.transform=`rotate(${meta.boardRot||0}deg)`;
  const rr=document.getElementById('rot-read');
  if(rr) rr.textContent=(meta.boardRot||0)+'°';
}
function syncDiceChrome(){
  const two=dieCount()===2;
  ['die2','bd2'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.style.display=two?'':'none';
  });
}
function syncOptUI(){
  document.querySelectorAll('[data-move]').forEach(b=>b.classList.toggle('on', b.dataset.move===meta.moveMode));
  const preset=presetFor(meta.gameSpeed||100);
  document.querySelectorAll('[data-spd]').forEach(b=>b.classList.toggle('on', b.dataset.spd===preset));
  document.querySelectorAll('[data-dice]').forEach(b=>b.classList.toggle('on', +b.dataset.dice===dieCount()));
  const gs=document.getElementById('spd-range');
  const ps=document.getElementById('pow-range');
  if(gs) gs.value=String(meta.gameSpeed||100);
  if(ps) ps.value=String(meta.powerSpeed||55);
  const gr=document.getElementById('spd-read'); if(gr) gr.textContent=(meta.gameSpeed||100)+'%';
  const pr=document.getElementById('pow-read'); if(pr) pr.textContent=(meta.powerSpeed||55)+'%';
  const flags={
    safeHouses: meta.safeHouses!==false,
    barriers: !!meta.barriers,
    sixToExit: !!meta.sixToExit,
    removeOnCapture: !!meta.removeOnCapture,
    againOnCapture: !!meta.againOnCapture
  };
  Object.entries(flags).forEach(([k,on])=>{
    const b=document.querySelector('[data-opt="'+k+'"]');
    if(!b) return;
    b.classList.toggle('on', on);
    const st=b.querySelector('.st');
    if(st) st.textContent=on?t('on'):t('off');
  });
  const lab=document.getElementById('opt-summary');
  if(lab) lab.textContent=t(meta.moveMode==='auto'?'forme':'choose')+' · '+(meta.gameSpeed||100)+'%';
  const sel=document.getElementById('lang-sel');
  if(sel) sel.value=meta.lang||'en';
  applyLang();
  syncDiceChrome();
}
function loadOpts(){
  try{
    const o=JSON.parse(localStorage.getItem('ludu_options_v1')||'{}');
    if(typeof o.gameSpeed==='number') meta.gameSpeed=o.gameSpeed;
    else if(o.speed==='slow') meta.gameSpeed=50;
    else if(o.speed==='fast') meta.gameSpeed=210;
    else meta.gameSpeed=100;
    if(typeof o.powerSpeed==='number') meta.powerSpeed=o.powerSpeed;
    if(o.moveMode==='choose'||o.moveMode==='auto') meta.moveMode=o.moveMode;
    if(o.ruleset===2 && (o.diceCount===1||o.diceCount===2)) meta.diceCount=o.diceCount;
    else meta.diceCount=1;
    if(o.safeHouses===false) meta.safeHouses=false;
    meta.barriers=!!o.barriers;
    if(o.ruleset===2) meta.sixToExit=o.sixToExit!==false;
    else meta.sixToExit=true;
    meta.removeOnCapture=!!o.removeOnCapture;
    meta.againOnCapture=!!o.againOnCapture;
    if([0,90,180,270].includes(o.boardRot)) meta.boardRot=o.boardRot;
    if(o.lang && I18N[o.lang]) meta.lang=o.lang;
  }catch(e){}
  meta.speed=presetFor(meta.gameSpeed)||'normal';
  applyPace();
  syncOptUI();
}
function saveOpts(){
  try{
    localStorage.setItem('ludu_options_v1', JSON.stringify({
      speed:presetFor(meta.gameSpeed)||'normal',
      gameSpeed:meta.gameSpeed, powerSpeed:meta.powerSpeed, moveMode:meta.moveMode,
      diceCount:dieCount(), safeHouses:meta.safeHouses!==false, barriers:!!meta.barriers,
      sixToExit:!!meta.sixToExit, removeOnCapture:!!meta.removeOnCapture,
      againOnCapture:!!meta.againOnCapture, boardRot:meta.boardRot||0, lang:meta.lang||'en',
      ruleset:2
    }));
  }catch(e){}
  applyPace();
  syncOptUI();
  if(G) updateAll();
}
function presetFor(spd){
  if(spd<=58) return 'slow';
  if(spd>=190) return 'fast';
  if(spd>=90 && spd<=115) return 'normal';
  return '';
}
function setMoveMode(m){
  if(m!=='choose' && m!=='auto') return;
  meta.moveMode=m;
  saveOpts();
  if(typeof AudioFX!=='undefined') AudioFX.ui();
  if(G && !G.over && meta.moveMode==='auto') autoPlayHuman();
}
function setSpeed(s){
  const map={slow:50, normal:100, fast:210};
  if(!map[s]) return;
  meta.speed=s;
  meta.gameSpeed=map[s];
  saveOpts();
  if(typeof AudioFX!=='undefined') AudioFX.ui();
}
function setGameSpeed(v){
  meta.gameSpeed=Math.max(40, Math.min(240, +v||100));
  meta.speed=presetFor(meta.gameSpeed)||'custom';
  saveOpts();
}
function setPowerSpeed(v){
  meta.powerSpeed=Math.max(30, Math.min(180, +v||55));
  saveOpts();
}
function setDiceCount(n){
  meta.diceCount=n===1?1:2;
  saveOpts();
  if(typeof AudioFX!=='undefined') AudioFX.ui();
}
function toggleOpt(key){
  if(key==='safeHouses') meta.safeHouses=!(meta.safeHouses!==false);
  else if(['barriers','sixToExit','removeOnCapture','againOnCapture'].includes(key)) meta[key]=!meta[key];
  saveOpts();
  if(typeof AudioFX!=='undefined') AudioFX.ui();
  if(G) renderTokens();
}
function rotateBoard(){
  const seq=[0,90,180,270];
  meta.boardRot=seq[(seq.indexOf(meta.boardRot||0)+1)%4];
  saveOpts();
  if(typeof AudioFX!=='undefined') AudioFX.ui();
}
function setLang(code){
  if(!I18N[code]) return;
  meta.lang=code;
  saveOpts();
  if(typeof AudioFX!=='undefined') AudioFX.ui();
}
function openOptions(){
  syncOptUI();
  openModal('opt-modal');
}

const I18N = {
  en:{
    play:'Play', online:'Online Multiplayer', boards:'Leaderboards', clans:'Clans & Teams',
    cloud:'Cloud Save', account:'Login / Register', profile:'Profile & Achievements',
    howto:'How to Play', options:'Options', share:'Share', login:'Login',
    optTitle:'Options', howMove:'How pieces move', choose:'Choose', chooseSub:'tap your piece',
    forme:'For me', formeSub:'dice move pieces', speed:'Gameplay speed', slow:'Slow', normal:'Normal', fast:'Fast',
    gameSpd:'Speed slider', powSpd:'Power-up reveal', dice:'Dice', die1:'1 die', die2:'2 dice',
    house:'House rules', safe:'Safe houses', barrier:'Barriers', six:'Need a 6 to leave the yard',
    remove:'Capturing piece also returns', again:'Extra roll after a capture', board:'Turn the board',
    lang:'Language', on:'On', off:'Off', gotit:'Got it', rulesTitle:'How to Play', adv:'Advanced',
    houseHint:'One die, and a 6 to leave home, is the usual race. That 6 still walks six tiles. Safe stars stay on. The other switches are optional.',
    rulesHtml:'<p>Race four pieces from your yard to the <strong>Golden Stool</strong>. Every pip steps onto the next tile. Only the color whose turn it is may move. When the number is spent — or nothing can legally move — press <strong>End Turn</strong>. A six on one die means you roll again; it does not pass the stool.</p><p><strong>Leaving home.</strong> A piece stays in the yard until you roll a 6. That 6 walks six tiles from your gate. After that, any number moves that many spaces.</p><p><strong>Tactics.</strong> Bring 5 cards from your clan deck. Each turn you may play one, before or after the roll. It goes to the discard. You may play none. An empty hand does not end the race.</p><p><strong>Priestess.</strong> She returns one discarded tactic of your choice to your hand, for a later turn. She does not return herself — she is spent afterward. If the discard is empty, she only blesses a piece still in the yard (+2 Strength this turn). Send her back if you opened her by mistake.</p><p><strong>Story</strong> is a separate road of Invaders. Instant play is still Ashanti, Dagbon, Fante, and Ewe.</p>'
  },
  fr:{
    play:'Jouer', online:'Multijoueur en ligne', boards:'Classements', clans:'Clans et équipes',
    cloud:'Sauvegarde cloud', account:'Connexion / inscription', profile:'Profil et succès',
    howto:'Comment jouer', options:'Options', share:'Partager', login:'Connexion',
    optTitle:'Options', howMove:'Déplacement', choose:'Choisir', chooseSub:'touchez votre pion',
    forme:'Pour moi', formeSub:'les dés déplacent', speed:'Vitesse de jeu', slow:'Lent', normal:'Normal', fast:'Rapide',
    gameSpd:'Curseur de vitesse', powSpd:'Révélation des pouvoirs', dice:'Dés', die1:'1 dé', die2:'2 dés',
    house:'Règles de la maison', safe:'Cases sûres', barrier:'Barrières', six:'Un 6 pour sortir de la maison',
    remove:'Le pion qui capture rentre aussi', again:'Relance après une capture', board:'Tourner le plateau',
    lang:'Langue', on:'Oui', off:'Non', gotit:'Compris', rulesTitle:'Comment jouer', adv:'Avancé',
    rulesHtml:'<p>Menez quatre pions de votre maison jusqu’au <strong>Tabouret d’or</strong>. Chaque point du dé avance d’une case — sans sauter. Seule la couleur dont c’est le tour peut bouger.</p><p>Un pion ne sort que sur un <strong>6</strong>, et ce 6 avance de six cases. Ensuite, n’importe quel nombre avance d’autant. Le jeu habituel se joue avec <strong>un dé</strong>. Avant la course, choisissez 5 cartes du deck de votre clan. Une carte jouée est défaussée. Une prêtresse peut la ramener. Sans cartes, la course continue. Le <strong>mode histoire</strong> est une route d’envahisseurs, à part du jeu instantané.</p>'
  },
  es:{
    play:'Jugar', online:'Multijugador en línea', boards:'Clasificaciones', clans:'Clanes y equipos',
    cloud:'Guardado en la nube', account:'Entrar / registro', profile:'Perfil y logros',
    howto:'Cómo jugar', options:'Opciones', share:'Compartir', login:'Entrar',
    optTitle:'Opciones', howMove:'Cómo se mueven', choose:'Elegir', chooseSub:'toca tu ficha',
    forme:'Por mí', formeSub:'los dados mueven', speed:'Velocidad de juego', slow:'Lenta', normal:'Normal', fast:'Rápida',
    gameSpd:'Control de velocidad', powSpd:'Revelado de poderes', dice:'Dados', die1:'1 dado', die2:'2 dados',
    house:'Reglas de casa', safe:'Casillas seguras', barrier:'Barreras', six:'Hace falta un 6 para salir',
    remove:'Quien captura también vuelve', again:'Tirada extra tras capturar', board:'Girar el tablero',
    lang:'Idioma', on:'Sí', off:'No', gotit:'Entendido', rulesTitle:'Cómo jugar', adv:'Avanzado',
    rulesHtml:'<p>Lleva cuatro fichas desde tu casa hasta el <strong>Taburete de oro</strong>. Cada punto del dado pisa la siguiente casilla. Solo se mueve el color al que le toca.</p><p>Una ficha sale solo con un <strong>6</strong>, y ese 6 recorre seis casillas. Después, cualquier número avanza eso. Lo habitual es <strong>un dado</strong>. Antes de la carrera eliges 5 cartas del mazo de tu clan. Una carta jugada se descarta. Una sacerdotisa puede devolverla. Sin cartas, la carrera sigue. La <strong>historia</strong> es un camino de invasores, aparte del juego instantáneo.</p>'
  },
  pt:{
    play:'Jogar', online:'Multijogador online', boards:'Classificações', clans:'Clãs e equipas',
    cloud:'Gravação na nuvem', account:'Entrar / registar', profile:'Perfil e conquistas',
    howto:'Como jogar', options:'Opções', share:'Partilhar', login:'Entrar',
    optTitle:'Opções', howMove:'Como as peças andam', choose:'Escolher', chooseSub:'toque na sua peça',
    forme:'Por mim', formeSub:'os dados movem', speed:'Velocidade de jogo', slow:'Lento', normal:'Normal', fast:'Rápido',
    gameSpd:'Controlo de velocidade', powSpd:'Revelação dos poderes', dice:'Dados', die1:'1 dado', die2:'2 dados',
    house:'Regras da casa', safe:'Casas seguras', barrier:'Barreiras', six:'É preciso um 6 para sair',
    remove:'Quem captura também volta', again:'Nova jogada após captura', board:'Rodar o tabuleiro',
    lang:'Idioma', on:'Sim', off:'Não', gotit:'Percebi', rulesTitle:'Como jogar', adv:'Avançado',
    rulesHtml:'<p>Leve quatro peças da casa até ao <strong>Banco de ouro</strong>. Cada ponto do dado pisa a casa seguinte. Só a cor da vez se move.</p><p>Uma peça só sai com um <strong>6</strong>, e esse 6 anda seis casas. Depois, qualquer número anda isso. O jogo habitual é <strong>um dado</strong>. Antes da corrida escolhe 5 cartas do baralho do clã. Uma carta jogada é descartada. Uma sacerdotisa pode trazê-la de volta. Sem cartas, a corrida continua. A <strong>história</strong> é um caminho de invasores, à parte do jogo instantâneo.</p>'
  },
  de:{
    play:'Spielen', online:'Online-Mehrspieler', boards:'Ranglisten', clans:'Klans & Teams',
    cloud:'Cloud-Speicher', account:'Anmelden / Registrieren', profile:'Profil & Erfolge',
    howto:'Spielanleitung', options:'Optionen', share:'Teilen', login:'Anmelden',
    optTitle:'Optionen', howMove:'Wie Figuren ziehen', choose:'Wählen', chooseSub:'eigene Figur tippen',
    forme:'Für mich', formeSub:'Würfel ziehen', speed:'Spieltempo', slow:'Langsam', normal:'Normal', fast:'Schnell',
    gameSpd:'Temporegler', powSpd:'Power-up-Anzeige', dice:'Würfel', die1:'1 Würfel', die2:'2 Würfel',
    house:'Hausregeln', safe:'Sichere Felder', barrier:'Barrieren', six:'Eine 6 zum Verlassen',
    remove:'Fänger kehrt auch zurück', again:'Extra-Wurf nach Fang', board:'Brett drehen',
    lang:'Sprache', on:'An', off:'Aus', gotit:'Verstanden', rulesTitle:'Spielanleitung', adv:'Fortgeschritten',
    rulesHtml:'<p>Bring vier Figuren vom Hof auf den <strong>Goldenen Stuhl</strong>. Jeder Würfelauge setzt auf das nächste Feld. Nur die Farbe am Zug zieht.</p><p>Eine Figur verlässt den Hof nur mit einer <strong>6</strong>, und diese 6 geht sechs Felder. Danach zieht jede Zahl so viele Felder. Üblich ist <strong>ein Würfel</strong>. Vor dem Rennen wählst du 5 Karten aus dem Klan-Deck. Eine gespielte Karte wird abgelegt. Eine Priesterin kann sie zurückholen. Ohne Karten geht das Rennen weiter. Der <strong>Geschichtenmodus</strong> ist ein eigener Weg gegen Eindringlinge.</p>'
  },
  it:{
    play:'Gioca', online:'Multigiocatore online', boards:'Classifiche', clans:'Clan e squadre',
    cloud:'Salvataggio cloud', account:'Accedi / registrati', profile:'Profilo e trofei',
    howto:'Come si gioca', options:'Opzioni', share:'Condividi', login:'Accedi',
    optTitle:'Opzioni', howMove:'Come si muovono', choose:'Scegli', chooseSub:'tocca la tua pedina',
    forme:'Per me', formeSub:'i dadi muovono', speed:'Velocità di gioco', slow:'Lenta', normal:'Normale', fast:'Veloce',
    gameSpd:'Cursore velocità', powSpd:'Rivelazione poteri', dice:'Dadi', die1:'1 dado', die2:'2 dadi',
    house:'Regole di casa', safe:'Case sicure', barrier:'Barriere', six:'Serve un 6 per uscire',
    remove:'Chi cattura torna anche', again:'Tiro extra dopo una cattura', board:'Gira il tabellone',
    lang:'Lingua', on:'Sì', off:'No', gotit:'Capito', rulesTitle:'Come si gioca', adv:'Avanzato',
    rulesHtml:'<p>Porta quattro pedine dal cortile allo <strong>Sgabello d’oro</strong>. Ogni punto del dado pesta la casella successiva. Si muove solo il colore di turno.</p><p>Una pedina esce solo con un <strong>6</strong>, e quel 6 percorre sei caselle. Poi qualsiasi numero avanza di tanto. Il gioco solito usa <strong>un dado</strong>. Prima della corsa scegli 5 carte dal mazzo del clan. Una carta giocata viene scartata. Una sacerdotessa può riportarla. Senza carte la corsa continua. La <strong>storia</strong> è una strada di invasori, separata dal gioco immediato.</p>'
  },
  id:{
    play:'Main', online:'Multipemain daring', boards:'Papan peringkat', clans:'Klan & tim',
    cloud:'Simpanan awan', account:'Masuk / daftar', profile:'Profil & prestasi',
    howto:'Cara main', options:'Opsi', share:'Bagikan', login:'Masuk',
    optTitle:'Opsi', howMove:'Cara bidak bergerak', choose:'Pilih', chooseSub:'ketuk bidakmu',
    forme:'Untukku', formeSub:'dadu yang menggerakkan', speed:'Kecepatan main', slow:'Lambat', normal:'Normal', fast:'Cepat',
    gameSpd:'Penggeser kecepatan', powSpd:'Munculnya kekuatan', dice:'Dadu', die1:'1 dadu', die2:'2 dadu',
    house:'Aturan rumah', safe:'Rumah aman', barrier:'Penghalang', six:'Perlu 6 untuk keluar',
    remove:'Bidak yang menangkap juga pulang', again:'Lempar lagi setelah menangkap', board:'Putar papan',
    lang:'Bahasa', on:'Nyala', off:'Mati', gotit:'Mengerti', rulesTitle:'Cara main', adv:'Lanjutan',
    rulesHtml:'<p>Bawa empat bidak dari halaman ke <strong>Bangku Emas</strong>. Setiap mata dadu menginjak petak berikutnya. Hanya warna yang giliran boleh bergerak.</p><p>Bidak keluar hanya dengan <strong>6</strong>, dan angka 6 itu berjalan enam petak. Setelah itu, angka berapa pun maju sebanyak itu. Permainan biasa memakai <strong>satu dadu</strong>. Sebelum lomba, pilih 5 kartu dari dek klan. Kartu yang dimainkan dibuang. Seorang pendeta wanita dapat mengembalikannya. Tanpa kartu, lomba tetap jalan. <strong>Mode cerita</strong> adalah jalan penyerbu, terpisah dari main instan.</p>'
  }
};
function t(key){
  const pack=I18N[meta.lang]||I18N.en;
  const v=pack[key];
  return v!=null?v:(I18N.en[key]||key);
}
function applyLang(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    if(el.hasAttribute('data-i18n-html')){ el.innerHTML=t(el.dataset.i18n); return; }
    if(el.dataset.i18nSub){ el.innerHTML=t(el.dataset.i18n)+'<small>'+t(el.dataset.i18nSub)+'</small>'; return; }
    el.textContent=t(el.dataset.i18n);
  });
}

function factionFor(id){
  const base = FACTIONS[id];
  const f = {...base, abilityId:id};
  if(id==='ashanti' && meta.altAshanti){
    return {...f, leader:'Yaa Asantewaa', ability:'Capture freely this turn, +4 Str. Immune to weather.',
      img:'/ludu/assets/leaders/Leader_Yaa_Asantewaa.jpg', abilityId:'yaa'};
  }
  if(id==='fante' && meta.altFante){
    return {...f, leader:'Ga Mantse', ability:'Foes discard 1 card. Your tokens +2 Str.',
      img:'/ludu/assets/leaders/Leader_Ga_Mantse.jpg', abilityId:'ga'};
  }
  return f;
}
function toggleAlt(which){
  if(which==='ashanti') meta.altAshanti=!meta.altAshanti;
  else meta.altFante=!meta.altFante;
  const y=document.getElementById('alt-yaa'); if(y) y.classList.toggle('on', meta.altAshanti);
  const g=document.getElementById('alt-ga'); if(g) g.classList.toggle('on', meta.altFante);
  if(document.getElementById('faction-screen').classList.contains('active')) updateFactionPickUI();
  if(document.getElementById('game-screen').classList.contains('active')) mountHomePortraits();
}
let G = null;

/* ============ UI NAV ============ */
const HISTORY = [
  {name:'Osei Tutu I', people:'Ashanti (Asante)', place:'Kumasi',
    img:'/ludu/assets/leaders/Leader_Ashanti_Osei_Tutu_I.jpg',
    text:'Around 1701 Osei Tutu and the priest Okomfo Anokye bound Akan forest states into Asante. Tradition says the Golden Stool, Sika Dwa Kofi, came down onto Osei Tutu’s lap. Nobody sits on it. It holds the soul of the nation. This race is named for that stool.'},
  {name:'Yaa Asantewaa', people:'Ashanti — Ejisu', place:'War of the Golden Stool, 1900',
    img:'/ludu/assets/leaders/Leader_Yaa_Asantewaa.jpg',
    text:'Queen mother of Ejisu. When a British governor demanded the Golden Stool in 1900, she led the war to keep it. In this game she is an optional Ashanti leader.'},
  {name:'Naa Gbewaa', people:'Dagomba', place:'Dagbon — Yendi',
    img:'/ludu/assets/leaders/Leader_Dagbon_Naa_Gbewaa.jpg',
    text:'Dagbon, Mamprugu, and Nanumba remember Naa Gbewaa as a common ancestor. The Ya Na sits at Yendi. The blue yard is Dagbon’s.'},
  {name:'Nana Kobina Ansa', people:'Fante', place:'The coastal Akan towns',
    img:'/ludu/assets/leaders/Leader_Fante_Nana_Kobina_Ansa.jpg',
    text:'The Fante are a coastal Akan people, gathered in tradition around Mankessim and later the Fante Confederacy. In 1482 Kwamina Ansa of Elmina — Caramansa in Portuguese accounts — negotiated the ground where the castle of São Jorge da Mina was built. This portrait is the game’s face for that stool, not a photograph from 1482.'},
  {name:'Ga Mantse', people:'Ga', place:'Accra',
    img:'/ludu/assets/leaders/Leader_Ga_Mantse.jpg',
    text:'Ga Mantse is the title of the king of the Ga people of Accra, not one person’s only name. Homowo, the harvest festival, mocks the hunger the Ga remember surviving. Here he is an optional leader beside the Fante.'},
  {name:'Togbui Sri', people:'Anlo Ewe', place:'Anlo, on the road from Notsie',
    img:'/ludu/assets/leaders/Leader_Ewe_Togbui_Sri.jpg',
    text:'Anlo tradition says Togbi Sri I, with Togbi Wenya, led people out of Notsie. Togbi Sri II was Awoamefia of Anlo from 1907 to 1956 and argued for Ewe unity across the colonial border. The purple yard carries that name.'},
  {name:'Queen Adjo', people:'Fon — fictional captain', place:'Dahomey, today’s Benin',
    img:'/ludu/assets/leaders/Invader_Fon_Queen_Adjo.jpg',
    text:'The Kingdom of Dahomey held its court at Abomey. Kings such as Agaja, Gezo, and Béhanzin, and the Agojie women’s regiment, are historical. Ouidah was its Atlantic port. Queen Adjo is a fictional Story challenger. She is not a historical queen.'},
  {name:'Olori Ireti', people:'Yoruba — fictional captain', place:'Ile-Ife and the Oyo Empire',
    img:'/ludu/assets/leaders/Invader_Yoruba_Olori_Ireti.jpg',
    text:'Ile-Ife is a spiritual center of Yoruba tradition. The Oyo Empire, under the Alaafin, was a great savanna power. Olori Ireti is a fictional captain in this game, not a historical ruler.'},
  {name:'Magajiya Dalla', people:'Hausa — fictional captain', place:'The Hausa city-states',
    img:'/ludu/assets/leaders/Invader_Hausa_Magajiya_Dalla.jpg',
    text:'The Hausa Bakwai — city-states such as Kano, Katsina, Zaria, and Gobir — shaped the central Sudan. Magajiya is a royal title. Queen Amina of Zazzau belongs to that history. Magajiya Dalla here is fictional and is not Amina.'},
  {name:'Nanan Affoue', people:'Baoulé — fictional captain', place:'Côte d’Ivoire',
    img:'/ludu/assets/leaders/Invader_Baoule_Nanan_Affoue.jpg',
    text:'Baoulé tradition remembers Queen Abla Pokou, who led people west from Asante and across the Comoé. Nanan Affoue is a fictional captain on the story road. She is not Pokou.'},
  {name:'Wondefa Tchabi', people:'Kabyè — fictional captain', place:'Kara highlands, Togo',
    img:'/ludu/assets/leaders/Invader_Kabye_Wondefa_Tchabi.jpg',
    text:'The Kabyè live in the highlands of northern Togo, around Kara. Evala wrestling and the terraced hills belong to that country. Wondefa Tchabi is a fictional captain in this game.'}
];
function renderHistory(){
  const el=document.getElementById('history-list');
  if(!el) return;
  el.innerHTML=HISTORY.map(h=>`
    <article class="hist">
      <img src="${h.img}" alt="${h.name}">
      <div>
        <h3>${h.name}</h3>
        <div class="place">${h.people} · ${h.place}</div>
        <p>${h.text}</p>
      </div>
    </article>`).join('');
}
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='hub-screen') refreshHub();
  if(id==='profile-screen') refreshProfile();
  if(id==='faction-screen') renderFactionPick();
  if(id==='mode-screen') syncModeUI();
  if(id==='story-screen') renderStory();
  if(id==='draft-screen') renderDraft();
  if(id==='cloud-screen') CloudSave.refreshUI();
  if(id==='lb-screen') LB.show(LB.current||'global');
  if(id==='clan-screen') Clans.refresh();
  if(id==='mp-screen') MP.refresh();
  if(id==='history-screen') renderHistory();
}
function openModal(id){document.getElementById(id).classList.add('on')}
function closeModal(id){document.getElementById(id).classList.remove('on')}
function refreshHub(){
  const u=Store.user();
  document.getElementById('hub-user').innerHTML = u
    ? `Signed in as <strong>${u.display||u.user}</strong>`
    : `Playing as <strong>Guest</strong>`;
  document.getElementById('btn-login-top').style.display = u?'none':'inline-block';
  document.getElementById('btn-profile').style.display = 'inline-block';
  const badges=document.getElementById('hub-badges');
  if(u){
    Store.ensureStats(u);
    badges.innerHTML = (u.ach||[]).slice(-5).map(id=>{
      const a=ACHIEVEMENTS.find(x=>x.id===id);
      return a?`<span title="${a.name}">${a.ico}</span>`:'';
    }).join(' ');
  } else badges.innerHTML='';
}

function setAuthTab(t){
  document.getElementById('auth-login').style.display=t==='login'?'block':'none';
  document.getElementById('auth-reg').style.display=t==='reg'?'block':'none';
  document.getElementById('tab-login').className=t==='login'?'btn btn-sm':'btn btn-ghost btn-sm';
  document.getElementById('tab-reg').className=t==='reg'?'btn btn-sm':'btn btn-ghost btn-sm';
}
function doRegister(){
  const user=(document.getElementById('reg-user').value||'').trim().toLowerCase();
  const pass=document.getElementById('reg-pass').value||'';
  const display=(document.getElementById('reg-display').value||user).trim();
  const err=document.getElementById('reg-err');
  if(user.length<2){err.textContent='Username too short';return;}
  if(pass.length<4){err.textContent='Password min 4 chars';return;}
  if(Store.data.users[user]){err.textContent='Username taken';return;}
  Store.data.users[user]=Store.ensureStats({user,pass,display,ach:['login'],stats:{wins:0,losses:0,games:0,captures:0,powers:0,streak:0}});
  Store.data.session=user;
  Store.save(Store.data);
  err.textContent='';
  fxBanner('Welcome, '+display);
  unlockAch('login');
  showScreen('hub-screen');
}
function doLogin(){
  const user=(document.getElementById('login-user').value||'').trim().toLowerCase();
  const pass=document.getElementById('login-pass').value||'';
  const err=document.getElementById('login-err');
  const u=Store.data.users[user];
  if(!u||u.pass!==pass){err.textContent='Invalid credentials';return;}
  Store.data.session=user;
  Store.save(Store.data);
  err.textContent='';
  unlockAch('login');
  showScreen('hub-screen');
}
function playAsGuest(){
  Store.data.session=null;
  Store.save(Store.data);
  showScreen('hub-screen');
}
function logout(){
  Store.data.session=null;
  Store.save(Store.data);
  showScreen('hub-screen');
}

function refreshProfile(){
  let u=Store.user();
  if(!u){
    // guest ephemeral view
    document.getElementById('prof-name').textContent='Guest — login to save progress';
    ['st-wins','st-losses','st-games','st-caps','st-powers','st-ach'].forEach(id=>document.getElementById(id).textContent='—');
  } else {
    Store.ensureStats(u);
    document.getElementById('prof-name').textContent=u.display||u.user;
    document.getElementById('st-wins').textContent=u.stats.wins;
    document.getElementById('st-losses').textContent=u.stats.losses;
    document.getElementById('st-games').textContent=u.stats.games;
    document.getElementById('st-caps').textContent=u.stats.captures;
    document.getElementById('st-powers').textContent=u.stats.powers;
    document.getElementById('st-ach').textContent=(u.ach||[]).length;
  }
  const list=document.getElementById('ach-list');
  const have=new Set((u&&u.ach)||[]);
  list.innerHTML=ACHIEVEMENTS.map(a=>`
    <div class="ach ${have.has(a.id)?'':'locked'}">
      <div class="ico">${a.ico}</div>
      <div><div class="tit">${a.name}</div><div class="desc">${a.desc}</div></div>
    </div>`).join('');
}

function unlockAch(id){
  const u=Store.user();
  if(!u) return;
  Store.ensureStats(u);
  if(u.ach.includes(id)) return;
  u.ach.push(id);
  Store.save(Store.data);
  const a=ACHIEVEMENTS.find(x=>x.id===id);
  if(a){
    document.getElementById('ach-modal-txt').textContent=`${a.ico} ${a.name}`;
    openModal('ach-modal');
    fxBanner(a.name); AudioFX.ach();
  }
}

/* ============ MODE / FACTION SETUP ============ */
function setMode(m){
  meta.mode=m;
  if(m==='ai') meta.aiCount=3;
  document.getElementById('mode-ai').classList.toggle('on',m==='ai');
  document.getElementById('mode-hot').classList.toggle('on',m==='hotseat');
  const solo=document.getElementById('mode-solo'); if(solo) solo.classList.toggle('on',m==='solo');
  document.getElementById('ai-opts').style.display=m==='ai'?'block':'none';
  document.getElementById('hot-opts').style.display=m==='hotseat'?'block':'none';
  const so=document.getElementById('solo-opts'); if(so) so.style.display=m==='solo'?'block':'none';
}
function setDiff(d){
  meta.difficulty=d;
  document.querySelectorAll('.diff-btn[data-d]').forEach(b=>b.classList.toggle('on',b.dataset.d===d));
}
function setSolo(s){
  meta.solo=s;
  meta.difficulty = s==='initiate'?'easy':s==='legend'?'hard':'normal';
  document.querySelectorAll('.diff-btn[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s===s));
  setDiff(meta.difficulty);
}
function setAICount(n){
  meta.aiCount=n;
  document.querySelectorAll('.diff-btn[data-n]').forEach(b=>b.classList.toggle('on',+b.dataset.n===n));
}
function setHotCount(n){
  meta.hotCount=n;
  document.querySelectorAll('[data-p]').forEach(b=>b.classList.toggle('on',+b.dataset.p===n));
}
function setMPCount(n){
  meta.mpOpponents=Math.max(1, Math.min(3, n));
  document.querySelectorAll('[data-mp]').forEach(b=>b.classList.toggle('on',+b.dataset.mp===meta.mpOpponents));
}
function syncModeUI(){
  setMode(meta.mode);
  setDiff(meta.difficulty);
  setHotCount(meta.hotCount||4);
  setMPCount(meta.mpOpponents||3);
  document.querySelectorAll('.diff-btn[data-s]').forEach(b=>b.classList.toggle('on', b.dataset.s===(meta.solo||'warrior')));
}

function seatsNeeded(){
  if(meta.mode==='solo' || meta.mode==='story') return 2;
  if(meta.mode==='ai') return 4;
  return Math.max(2, Math.min(4, meta.hotCount||4));
}
function humanSeatCount(){
  if(meta.onlineSeats) return Math.max(1, meta.onlineSeats.filter(s=>!s.isAI).length);
  if(meta.mode==='hotseat') return seatsNeeded();
  return 1;
}
function clanDeck(id){
  return CLAN_DECKS[id] || CLAN_DECKS.ashanti;
}
function wearFor(playerFid, foeId){
  const opp={ashanti:'fante', fante:'ashanti', dagbon:'ewe', ewe:'dagbon'};
  const inv=INVADERS[foeId];
  let w=(inv && inv.wears && inv.wears!==playerFid) ? inv.wears : (opp[playerFid]||'fante');
  if(w===playerFid) w=opp[playerFid]||'fante';
  return w;
}
function resolveSeatFaction(seat){
  const id=seat.factionId;
  if(INVADERS[id]){
    const inv=INVADERS[id];
    const wear=seat.wears || wearFor('ashanti', id);
    const board=FACTIONS[wear]||FACTIONS.fante;
    return {
      id:board.id, name:inv.name, leader:inv.leader, color:board.color, corner:board.corner,
      img:inv.img, ability:inv.ability, abilityId:inv.abilityId, entry:board.entry,
      clan:inv.id, invader:true, region:inv.region, wears:board.id
    };
  }
  const f=factionFor(id);
  return {...f, clan:id, wears:id, invader:false, region:'Gold Coast'};
}
function autoDraft(clanId){
  const prio=['revive','scorch','horn','elephant','protect','sankofa','boost','weather','spy','silence','discard','no_cap','clear'];
  const rank=e=>{ const i=prio.indexOf(e); return i<0?50:i; };
  return clanDeck(clanId).map(c=>({...c})).sort((a,b)=>rank(a.effect)-rank(b.effect)).slice(0,5);
}
function openInstant(){
  if(meta.mode==='story') meta.mode='ai';
  meta.onlineSeats=null;
  showScreen('mode-screen');
}
function openStory(){
  Story.selected=Story.nextIndex();
  showScreen('story-screen');
}
function renderFactionPick(){
  meta.pickIndex=0; meta.picks={};
  updateFactionPickUI();
}
function updateFactionPickUI(){
  const need=seatsNeeded();
  const humanSeats = meta.mode==='hotseat' ? need : 1;
  const pickingHuman = meta.pickIndex < humanSeats;
  const title=document.getElementById('faction-title');
  const hint=document.getElementById('faction-hint');
  if(title) title.textContent = pickingHuman
    ? (meta.mode==='story' ? 'Choose who holds the Coast' : `Player ${meta.pickIndex+1} — Choose Empire`)
    : 'Confirm Table';
  if(hint) hint.textContent = pickingHuman
    ? (meta.mode==='story'
        ? 'Your leader’s portrait is the empire. The invader is already on the road.'
        : (meta.mode==='ai'
            ? 'Your empire. Three rivals take the other colors.'
            : `Seat ${meta.pickIndex+1} of ${humanSeats}`))
    : (meta.mode==='ai' ? 'Three rival empires are seated.' : 'Remaining empires fill in');
  const taken=Object.values(meta.picks);
  const grid=document.getElementById('faction-grid');
  if(grid) grid.innerHTML=FID_ORDER.map(id=>{
    const f=FACTIONS[id];
    const show=factionFor(id);
    const used=taken.includes(id);
    return `<div class="faction-card ${used?'on':''}" style="opacity:${used&&pickingHuman?0.45:1}" onclick="pickFaction('${id}')">
      <img src="${show.img}" alt="${show.leader}">
      <div class="nm"><span class="dot" style="background:${f.color}"></span>${f.name}</div>
      <div class="ld">${show.leader}</div></div>`;
  }).join('');
  const lines=[];
  for(let i=0;i<Object.keys(meta.picks).length;i++){
    const fid=meta.picks[i];
    if(!fid || !FACTIONS[fid]) continue;
    const led=factionFor(fid);
    lines.push(`Seat ${i+1}: ${led.name} — ${led.leader}`);
  }
  if(meta.mode==='story' && meta.picks[0]){
    const node=STORY_NODES[meta.storyNode]||STORY_NODES[0];
    const inv=INVADERS[node.foe];
    if(inv) lines.push(`Challenger: ${inv.name} — ${inv.leader} (${inv.region})`);
  }
  if(meta.altAshanti) lines.push('Ashanti led by Yaa Asantewaa');
  if(meta.altFante) lines.push('Fante led by Ga Mantse');
  const sum=document.getElementById('seat-summary');
  if(sum) sum.innerHTML=lines.join('<br>')||'No seats chosen yet';
  const btn=document.getElementById('begin-btn');
  if(btn){
    btn.disabled = Object.keys(meta.picks).length < humanSeats;
    btn.textContent = btn.disabled ? 'Choose an Empire' : 'Choose 5 Cards';
  }
}
function pickFaction(id){
  const need=seatsNeeded();
  const humanSeats = meta.mode==='hotseat' ? need : 1;
  if(meta.pickIndex >= humanSeats) return;
  if(Object.values(meta.picks).includes(id)) return;
  meta.picks[meta.pickIndex]=id;
  meta.pickIndex++;
  if(meta.pickIndex < humanSeats) updateFactionPickUI();
  else {
    // auto-assign AI factions
    if(meta.mode==='ai' || meta.mode==='solo'){
      const left=FID_ORDER.filter(f=>!Object.values(meta.picks).includes(f));
      const fill=meta.mode==='ai'?3:1;
      for(let i=0;i<fill && i<left.length;i++) meta.picks[1+i]=left[i];
    }
    updateFactionPickUI();
  }
}

function beginGame(){
  let seats=[];
  if(meta.onlineSeats){
    seats=meta.onlineSeats;
    meta.onlineSeats=null;
  } else if(meta.mode==='story'){
    const node=STORY_NODES[meta.storyNode]||STORY_NODES[0];
    const you=meta.picks[0];
    if(!you || !FACTIONS[you]){ alert('Choose your empire'); return; }
    const u=Store.user();
    const inv=INVADERS[node.foe];
    const diff=node.diff==='advanced'?'advanced':node.diff;
    seats.push({
      factionId:you, isAI:false,
      name: u?(u.display||u.user):'You',
      difficulty: diff
    });
    seats.push({
      factionId:node.foe, wears:wearFor(you, node.foe), isAI:true,
      name: inv?inv.leader:'Invader',
      difficulty: diff
    });
  } else {
    const need=seatsNeeded();
    for(let i=0;i<need;i++){
      const fid=meta.picks[i];
      if(!fid){alert('Pick all human factions');return;}
      const isAI = (meta.mode==='ai' || meta.mode==='solo') ? i>0 : false;
      const u=Store.user();
      seats.push({
        factionId:fid,
        isAI,
        name: isAI
          ? (meta.mode==='solo' ? 'The Ancestors' : `AI ${FACTIONS[fid].name}`)
          : (meta.mode==='hotseat' ? `Player ${i+1}` : (u?(u.display||u.user):'You')),
        difficulty: meta.difficulty
      });
    }
  }
  meta.drafts=meta.drafts||{};
  seats.forEach((s,i)=>{
    if(meta.mode==='solo' && i>0) return;
    if(!meta.drafts[i] || meta.drafts[i].length!==5) meta.drafts[i]=autoDraft(s.factionId);
  });
  initGame(seats);
  showScreen('game-screen');
}

function openDraft(){
  const humans=humanSeatCount();
  if(!meta.onlineSeats){
    const have=Object.keys(meta.picks).filter(k=>FACTIONS[meta.picks[k]]).length;
    if(have < humans) return;
  }
  meta.drafts={};
  meta.draftSeat=0;
  meta.draftPick=[];
  showScreen('draft-screen');
}
function renderDraft(){
  const seat=meta.draftSeat||0;
  const fid = meta.onlineSeats ? meta.onlineSeats[seat].factionId : meta.picks[seat];
  const deck=clanDeck(fid);
  const fac = FACTIONS[fid] ? factionFor(fid) : (INVADERS[fid]||FACTIONS.ashanti);
  const picked=meta.draftPick||[];
  const title=document.getElementById('draft-title');
  const hint=document.getElementById('draft-hint');
  const who=meta.mode==='hotseat' ? `Player ${seat+1}` : 'You';
  if(title) title.textContent = who+' — choose 5 cards';
  if(hint) hint.textContent = (meta.mode==='hotseat' && seat>0 ? 'Pass the phone. ' : '')
    + (fac.name||'Clan')+' deck. Tap five power-ups to bring. The rest stay in reserve. A priestess can restore a discard.';
  const lead=document.getElementById('draft-leader');
  if(lead) lead.innerHTML=`<img src="${fac.img||''}" alt=""><div><div class="nm">${fac.leader||''}</div><div class="who">${fac.name||''}${fac.region?' · '+fac.region:''}</div></div>`;
  const grid=document.getElementById('draft-grid');
  if(grid) grid.innerHTML=deck.map((c,i)=>`
    <div class="card ${picked.includes(i)?'on':''}" onclick="toggleDraftCard(${i})">
      <img src="${c.img}" alt=""><div class="lb">${c.name}</div></div>`).join('');
  const count=document.getElementById('draft-count');
  if(count) count.textContent=picked.length+' / 5';
  const go=document.getElementById('draft-go');
  if(go) go.disabled=picked.length!==5;
}
function toggleDraftCard(i){
  meta.draftPick=meta.draftPick||[];
  const at=meta.draftPick.indexOf(i);
  if(at>=0) meta.draftPick.splice(at,1);
  else if(meta.draftPick.length<5) meta.draftPick.push(i);
  if(typeof AudioFX!=='undefined') AudioFX.ui();
  renderDraft();
}
function confirmDraft(){
  if(!meta.draftPick || meta.draftPick.length!==5) return;
  const seat=meta.draftSeat||0;
  const fid = meta.onlineSeats ? meta.onlineSeats[seat].factionId : meta.picks[seat];
  const deck=clanDeck(fid);
  meta.drafts[seat]=meta.draftPick.map(i=>({...deck[i]}));
  meta.draftPick=[];
  meta.draftSeat=seat+1;
  if(meta.draftSeat < humanSeatCount()){
    renderDraft();
    return;
  }
  beginGame();
}
function renderStory(){
  const box=document.getElementById('story-nodes');
  const road=document.getElementById('story-road');
  if(!box) return;
  if(Story.selected==null || Story.selected<0) Story.selected=Story.nextIndex();
  if(road){
    const pts=STORY_NODES.map(n=>`${n.x},${n.y}`).join(' ');
    road.innerHTML=`<polyline points="${pts}" fill="none" stroke="#f0d77b" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
  }
  box.innerHTML=STORY_NODES.map((n,i)=>{
    const inv=INVADERS[n.foe];
    const open=Story.isOpen(i);
    const done=(Story.load().cleared||[]).includes(n.id);
    const cls='story-node'+(open?' open':' locked')+(done?' done':'')+(Story.selected===i?' sel':'');
    return `<button type="button" class="${cls}" style="left:${n.x}%;top:${n.y}%" onclick="selectStory(${i})" title="${n.name}">
      <img src="${inv?inv.img:''}" alt="${inv?inv.leader:''}"></button>`;
  }).join('');
  const n=STORY_NODES[Story.selected]||STORY_NODES[0];
  const inv=INVADERS[n.foe];
  const open=Story.isOpen(Story.selected);
  const done=(Story.load().cleared||[]).includes(n.id);
  const detail=document.getElementById('story-detail');
  if(detail && inv){
    const cards=clanDeck(n.foe).map(c=>c.name).join(' · ');
    detail.innerHTML=`<img src="${inv.img}" alt="${inv.leader}"><div>
      <div class="nm">${n.name}${done?' · won':''}</div>
      <div class="who">${inv.leader} · ${inv.name} · ${n.region} · ${n.diff}</div>
      <p>${open?n.blurb:'Win the previous gate to open this road.'}</p>
      <p class="deck">${cards}</p></div>`;
  }
  const go=document.getElementById('story-go');
  if(go){
    go.disabled=!open;
    go.textContent=done?'Rematch':'March';
  }
}
function selectStory(i){
  Story.selected=i;
  if(typeof AudioFX!=='undefined') AudioFX.ui();
  renderStory();
}
function launchStory(){
  const i=Story.selected!=null?Story.selected:Story.nextIndex();
  if(!Story.isOpen(i)) return;
  const node=STORY_NODES[i];
  meta.mode='story';
  meta.storyNode=i;
  meta.onlineSeats=null;
  meta.difficulty=node.diff==='advanced'?'advanced':node.diff;
  meta.picks={};
  meta.pickIndex=0;
  meta.drafts={};
  if(typeof AudioFX!=='undefined') AudioFX.ui();
  showScreen('faction-screen');
}
function factionBack(){
  if(meta.mode==='story'){ showScreen('story-screen'); }
  else showScreen('mode-screen');
}
function draftBack(){
  if(meta.onlineSeats){ showScreen('mp-screen'); return; }
  showScreen('faction-screen');
}
function returnToMap(){
  closeModal('win-modal');
  G=null;
  showScreen('story-screen');
}

/* ============ GAME CORE ============ */
function mkDeck(){
  let d=[]; CARDS.forEach(c=>{d.push({...c});d.push({...c});});
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}
  return d;
}
function draw(pl,n=1){
  let got=0;
  for(let k=0;k<n;k++){
    if(!pl.deck.length) break;
    if(pl.hand.length<7){ pl.hand.push(pl.deck.pop()); got++; }
  }
  return got;
}

function initGame(seats){
  G={
    seats:seats.map((s,idx)=>{
      const f=resolveSeatFaction(s);
      const full=clanDeck(f.clan||s.factionId).map(c=>({...c}));
      const brought=(meta.drafts && meta.drafts[idx] && meta.drafts[idx].length)
        ? meta.drafts[idx].map(c=>({...c}))
        : autoDraft(f.clan||s.factionId);
      const ids=new Set(brought.map(c=>c.id));
      const reserve=full.filter(c=>!ids.has(c.id));
      for(let i=reserve.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[reserve[i],reserve[j]]=[reserve[j],reserve[i]];}
      const pl={
        idx, isAI:s.isAI, name:s.name, difficulty:s.difficulty||'normal',
        faction:f, leaderUsed:false, cardPlayed:false,
        tokens:[0,1,2,3].map(i=>({id:i,str:[5,7,9,12][i],hero:i===3,pos:'yard',track:null,home:null,temp:0,prot:false,charge:false})),
        hand:brought.slice(0,5), deck:reserve, discard:[],
        movePenalty:0, silenced:false,
        weatherImmune: f.abilityId==='yaa',
        ancestor:false,
        freeCap:false,
        stats:{caps:0,powers:0}
      };
      return pl;
    }),
    turn:0,
    dice:[0,0], rawDice:[0,0], spent:[false,false], pick:0,
    rolled:false, sel:null,
    noCap:false, log:[],
    powersThisGame:0,
    solo:null,
    over:false,
    cellPower:RING.map(c=>c.power),
    busy:false,
    hop:null,
    pendingRevive:null
  };
  if(meta.mode==='solo' && G.seats[1]){
    const anc=G.seats[1];
    anc.ancestor=true;
    anc.name='The Ancestors';
    anc.isAI=true;
    const cap = meta.solo==='initiate'?20 : meta.solo==='legend'?8 : 14;
    anc.hand=[];
    anc.discard=[];
    anc.deck=mkDeck().slice(0, cap);
    draw(anc, 2);
    G.solo={catastrophes:0, tier:meta.solo||'warrior'};
  }
  buildBoard();
  updateAll();
  log(`Table set: ${G.seats.map(s=>s.name+' · '+s.faction.leader).join(' · ')}`,true);
  if(meta.sixToExit) log('A piece leaves home only on a 6. That 6 walks six tiles from the gold gate. After that, any roll moves that many spaces.', true);
  log('Each empire brought 5 clan cards. Play one a turn. A priestess restores a discard. An empty hand still races.', true);
  if(G.solo){
    log(`Ancestral Challenge (${G.solo.tier}). Three catastrophes end the race. Ancestor deck: ${G.seats[1].deck.length}.`, true);
    fxBanner('THE ANCESTORS WATCH');
  } else if(meta.mode==='story'){
    const node=STORY_NODES[meta.storyNode];
    fxBanner(node ? node.name.toUpperCase() : 'INVADERS');
  } else fxBanner('RACE FOR THE STOOL');
  AudioFX.turn();
  setTimeout(()=>fxNameplate(cur().name.toUpperCase()+' · '+cur().faction.name.toUpperCase()),900);
  maybePassDevice();
}

function log(msg,imp){
  G.log.unshift({msg,imp:!!imp});
  if(G.log.length>60) G.log.pop();
  const el=document.getElementById('game-log');
  if(el) el.innerHTML=G.log.map(e=>`<div class="${e.imp?'imp':''}">${e.msg}</div>`).join('');
}
function fxFlash(){const f=document.getElementById('fx-flash');f.classList.add('on');setTimeout(()=>f.classList.remove('on'),150);}
function fxBanner(t){
  const b=document.getElementById('fx-banner');b.textContent=t;b.classList.add('show');
  const v=document.getElementById('fx-vignette'); if(v){v.classList.add('on'); setTimeout(()=>v.classList.remove('on'),900);}
  setTimeout(()=>b.classList.remove('show'),1600);
}
function fxNameplate(t){
  const n=document.getElementById('fx-nameplate'); if(!n) return;
  n.textContent=t; n.classList.add('show');
  setTimeout(()=>n.classList.remove('show'),1400);
}
function fxStrPop(xPct,yPct,txt){
  const board=document.getElementById('board'); if(!board) return;
  const el=document.createElement('div'); el.className='str-pop'; el.textContent=txt;
  el.style.left=xPct+'%'; el.style.top=yPct+'%';
  board.appendChild(el); setTimeout(()=>el.remove(),900);
}
function toast(ico,txt){
  document.getElementById('toast-ico').textContent=ico;
  document.getElementById('toast-txt').textContent=txt;
  const t=document.getElementById('toast');t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2000);
}
function shakeBoard(){const b=document.getElementById('board');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');}

function absTrack(pl, trackPos){
  return ((pl.faction.entry + trackPos) % TRACK_LEN + TRACK_LEN) % TRACK_LEN;
}
function tokenXY(pl,tok){
  if(tok.pos==='done') return {x:50,y:50};
  if(tok.pos==='yard') return YARD[pl.faction.id][tok.id];
  if(tok.pos==='home') return homeXY(pl.faction.id, tok.home||0);
  const a=absTrack(pl, tok.track||0);
  return {x:RING[a].x, y:RING[a].y};
}

function refreshPowerCells(){
  const cells=document.querySelectorAll('#overlay .cell.track');
  if(!G || !G.cellPower) return;
  cells.forEach(d=>{
    const i=+d.dataset.i;
    const p=G.cellPower[i];
    const safe=RING[i]&&RING[i].safe;
    const kind=p&&POWERS[p]?POWERS[p].kind:'';
    const gate=i===15||i===32||i===49||i===65;
    const pop=d.classList.contains('pop');
    const burst=d.classList.contains('burst');
    const path=d.classList.contains('path');
    const here=d.classList.contains('here');
    d.className='cell track'+(p?' power '+kind:'')+(safe?' safe':'')+(gate?' gate':'')+(pop?' pop':'')+(burst?' burst':'')+(path?' path':'')+(here?' here':'');
    d.innerHTML=p?`<span class="pico">${POWERS[p].ico}</span>`:'';
    d.title=p?`${POWERS[p].name} — ${POWERS[p].desc}`:(gate?'Starting gate — leave home on a 6':(safe?'Safe star':''));
  });
}
function spawnPower(){
  if(!G || !G.cellPower || G.over) return;
  const empty=[];
  for(let i=0;i<TRACK_LEN;i++) if(!G.cellPower[i]) empty.push(i);
  if(!empty.length) return;
  const i=empty[Math.floor(Math.random()*empty.length)];
  const key=POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)];
  G.cellPower[i]=key;
  refreshPowerCells();
  const cell=document.querySelector('#overlay .cell.track[data-i="'+i+'"]');
  if(cell){ cell.classList.add('pop'); setTimeout(()=>cell.classList.remove('pop'), powerPace(900)); }
  log(`${POWERS[key].ico} ${POWERS[key].name} appears on the path.`, true);
}
function ensureBoardDice(){
  let box=document.getElementById('board-dice');
  if(box) return box;
  const board=document.getElementById('board');
  if(!board) return null;
  box=document.createElement('div');
  box.id='board-dice';
  box.className='board-dice';
  box.innerHTML='<button type="button" class="bdie" id="bd1" onclick="pickDie(0)"></button><button type="button" class="bdie" id="bd2" onclick="pickDie(1)"></button><div class="bd-cap" id="bd-cap"></div>';
  board.appendChild(box);
  return box;
}
function paintDie(el, n){
  if(!el) return;
  el.dataset.n=String(n);
  el.textContent=(n||n===0)&&n!=='?' ? String(n) : '?';
}
function tumbleDice(){
  return new Promise(resolve=>{
    const box=ensureBoardDice();
    if(!box){ resolve(); return; }
    box.classList.add('show','tumble');
    const iv=setInterval(()=>{
      paintDie(document.getElementById('bd1'), 1+Math.floor(Math.random()*6));
      paintDie(document.getElementById('bd2'), 1+Math.floor(Math.random()*6));
    }, pace(70));
    setTimeout(()=>{ clearInterval(iv); box.classList.remove('tumble'); resolve(); }, pace(900));
  });
}
function showBoardDice(a,b,cap){
  const box=ensureBoardDice();
  if(!box || !G) return;
  box.classList.add('show');
  box.classList.remove('tumble');
  paintDie(document.getElementById('bd1'), a);
  paintDie(document.getElementById('bd2'), b);
  const c=document.getElementById('bd-cap');
  if(c){
    c.textContent=cap||'';
    if(G.seats && G.seats[G.turn]) c.style.color=G.seats[G.turn].faction.color;
  }
  [0,1].forEach(i=>{
    const el=document.getElementById('bd'+(i+1));
    if(!el) return;
    const live=!!(G.rolled && G.spent && !G.spent[i]);
    el.classList.toggle('spent', !!(G.spent && G.spent[i]));
    const col=G.seats && G.seats[G.turn] ? G.seats[G.turn].faction.color : '#d4af37';
    el.style.boxShadow=(live && G.pick===i) ? `0 0 0 4px ${col}, 0 14px 28px rgba(0,0,0,.55)` : '';
  });
}
function hideBoardDice(){
  const box=document.getElementById('board-dice');
  if(box) box.classList.remove('show','tumble');
}
function buildBoard(){
  const ov=document.getElementById('overlay'); ov.innerHTML='';
  const half=2.1;
  RING.forEach((c,i)=>{
    const d=document.createElement('div');
    d.className='cell track';
    d.dataset.i=String(i);
    d.style.left=`calc(${c.x}% - ${half}%)`;
    d.style.top=`calc(${c.y}% - ${half}%)`;
    ov.appendChild(d);
  });
  FID_ORDER.forEach(fid=>{
    (HOME_PATH[fid]||[]).forEach((c,h)=>{
      const d=document.createElement('div');
      d.className='cell home '+fid;
      d.dataset.h=String(h);
      d.style.left=`calc(${c[0]}% - ${half}%)`;
      d.style.top=`calc(${c[1]}% - ${half}%)`;
      ov.appendChild(d);
    });
  });
  refreshPowerCells();
  document.querySelectorAll('#overlay .cell.power').forEach((c,i)=>{
    setTimeout(()=>c.classList.add('pop'), 50*i);
    setTimeout(()=>c.classList.remove('pop'), 50*i+powerPace(900));
  });
  ensureBoardDice();
  mountHomePortraits();
  renderTokens();
}
const HOME_MEDALLION = {
  dagbon:{x:13.6,y:13.2},
  ewe:{x:86.4,y:13.0},
  fante:{x:13.4,y:86.6},
  ashanti:{x:86.6,y:86.8}
};
function mountHomePortraits(){
  const board=document.getElementById('board');
  if(!board) return;
  let layer=document.getElementById('home-portraits');
  if(!layer){
    layer=document.createElement('div');
    layer.id='home-portraits';
    const bg=board.querySelector('img.bg');
    if(bg && bg.nextSibling) board.insertBefore(layer, bg.nextSibling);
    else board.appendChild(layer);
  }
  layer.innerHTML='';
  FID_ORDER.forEach(fid=>{
    let f=factionFor(fid);
    if(G){
      const seat=G.seats.find(s=>s.faction && (s.faction.wears||s.faction.id)===fid);
      if(seat) f=seat.faction;
    }
    const s=HOME_MEDALLION[fid];
    if(!f || !s) return;
    const el=document.createElement('img');
    el.className='home-hero';
    el.alt=f.leader+', '+f.name;
    el.title=f.name+' — '+f.leader;
    el.src=f.img;
    el.style.left=s.x+'%';
    el.style.top=s.y+'%';
    layer.appendChild(el);
  });
}
function showPowerStage(P, kindLab){
  const board=document.getElementById('board');
  if(!board || !P) return;
  let el=document.getElementById('power-stage');
  if(!el){
    el=document.createElement('div');
    el.id='power-stage';
    el.className='power-stage';
    board.appendChild(el);
  }
  el.innerHTML=`<div class="ps-ico">${P.ico}</div><div class="ps-name">${P.name}</div><div class="ps-kind">${kindLab||''}</div>`;
  el.classList.remove('on');
  void el.offsetWidth;
  el.classList.add('on');
  clearTimeout(showPowerStage._t);
  showPowerStage._t=setTimeout(()=>el.classList.remove('on'), powerPace(2000));
}
function renderTokens(){
  const ov=document.getElementById('overlay');
  if(!ov||!G) return;
  const plTurn=G.seats[G.turn];
  const steps=(G.rolled && !G.busy && plTurn && !plTurn.isAI && G.spent && !G.spent[G.pick]) ? G.dice[G.pick] : 0;
  const seen=new Set();
  G.seats.forEach(pl=>{
    pl.tokens.forEach(tok=>{
      const key=pl.idx+'-'+tok.id;
      seen.add(key);
      let el=ov.querySelector('.token[data-k="'+key+'"]');
      if(!el){
        el=document.createElement('div');
        el.className='token';
        el.dataset.k=key;
        el.onclick=e=>{
          e.stopPropagation();
          const parts=el.dataset.k.split('-');
          onTok(+parts[0], +parts[1]);
        };
        ov.appendChild(el);
      }
      const xy=tokenXY(pl,tok);
      const mine=pl.idx===G.turn;
      const legal=!!(steps && mine && canMove(pl, tok, steps));
      el.className='token'+(mine?' mine':' waiting')+(G.sel===key?' sel':'')+(legal?' legal':'')+(G.hop===key?' hop':'');
      el.style.background=pl.faction.color;
      el.style.setProperty('--team', pl.faction.color);
      el.style.left=`calc(${xy.x}% - 1.9%)`;
      el.style.top=`calc(${xy.y}% - 1.9%)`;
      el.title=legal ? ('Move '+steps) : (mine ? pl.faction.name : (pl.faction.name+' waits'));
      const label=(tok.str+(tok.temp||0))+(tok.hero?'★':'');
      if(el.dataset.str!==label){ el.dataset.str=label; el.innerHTML=`<span class="s">${label}</span>`; }
    });
  });
  ov.querySelectorAll('.token').forEach(el=>{ if(!seen.has(el.dataset.k)) el.remove(); });
  lightLegalPaths();
}

function cellEl(pl, tok){
  if(!tok) return null;
  if(tok.pos==='track') return document.querySelector('#overlay .cell.track[data-i="'+absTrack(pl, tok.track||0)+'"]');
  if(tok.pos==='home') return document.querySelector('#overlay .cell.home.'+pl.faction.id+'[data-h="'+(tok.home||0)+'"]');
  return null;
}
function markHere(pl, tok){
  document.querySelectorAll('#overlay .cell.here').forEach(c=>c.classList.remove('here'));
  const el=cellEl(pl, tok);
  if(el) el.classList.add('here');
}
function lightLegalPaths(){
  document.querySelectorAll('#overlay .cell.path').forEach(c=>c.classList.remove('path'));
  if(!G || G.busy || !G.rolled || meta.moveMode!=='choose') return;
  const pl=cur();
  if(!pl || pl.isAI || !G.spent || G.spent[G.pick]) return;
  const steps=G.dice[G.pick];
  if(!steps) return;
  pl.tokens.forEach(tok=>{
    const route=planPath(pl, tok, steps);
    if(!route) return;
    route.forEach(step=>{
      const el=cellEl(pl, step);
      if(el) el.classList.add('path');
    });
  });
}
function clearHere(){
  document.querySelectorAll('#overlay .cell.here').forEach(c=>c.classList.remove('here'));
}
function cur(){return G.seats[G.turn];}

/* A token on ring index T, moving `steps`, lands on track, home, or the Stool.
   Yard is treated as standing just before index 0, so the first pip enters. */
function previewFromTrack(track, steps){
  const landed = track + steps;
  if(landed < TRACK_LEN) return {pos:'track', track:landed};
  const into = landed - TRACK_LEN;
  if(into > HOME_LEN) return null;
  if(into === HOME_LEN) return {pos:'done'};
  return {pos:'home', home:into};
}
function previewMove(tok, steps){
  if(!tok || tok.pos==='done' || steps<1) return null;
  if(tok.pos==='yard') return previewFromTrack(-1, steps);
  if(tok.pos==='track') return previewFromTrack(tok.track||0, steps);
  if(tok.pos==='home'){
    const dest=(tok.home||0)+steps;
    if(dest>HOME_LEN) return null;
    if(dest===HOME_LEN) return {pos:'done'};
    return {pos:'home', home:dest};
  }
  return null;
}
function barrierAt(absIdx, mover){
  if(!meta.barriers || !G || absIdx==null) return false;
  const counts={};
  G.seats.forEach(pl=>{
    if(mover && pl.idx===mover.idx) return;
    pl.tokens.forEach(t=>{
      if(t.pos==='track' && absTrack(pl, t.track||0)===absIdx) counts[pl.idx]=(counts[pl.idx]||0)+1;
    });
  });
  return Object.values(counts).some(n=>n>=2);
}
/* Walk every pip. Reject a route that would jump a painted tile, a yard exit
   that is not a 6 when that house rule is on, or a square blocked by a barrier. */
function planPath(pl, tok, steps, flags){
  flags=flags||{};
  if(!tok || !pl || steps<1 || tok.pos==='done') return null;
  if(!flags.ignoreSix && meta.sixToExit && tok.pos==='yard' && steps!==6) return null;
  if(!previewMove(tok, steps)) return null;
  const ghost={pos:tok.pos, track:tok.track, home:tok.home};
  const route=[];
  let prev=tokenXY(pl, ghost);
  const fromYard=tok.pos==='yard';
  for(let s=0;s<steps;s++){
    const one=previewMove(ghost, 1);
    if(!one) return null;
    commitTok(ghost, one);
    const xy=tokenXY(pl, ghost);
    const abs=ghost.pos==='track' ? absTrack(pl, ghost.track||0) : null;
    if(!(fromYard && s===0) && ghost.pos!=='done'){
      const d=Math.hypot(xy.x-prev.x, xy.y-prev.y);
      if(d>7.8) return null;
    }
    if(!flags.ignoreBarrier && barrierAt(abs, pl)) return null;
    route.push({pos:ghost.pos, track:ghost.track, home:ghost.home, x:xy.x, y:xy.y, abs});
    prev=xy;
    if(ghost.pos==='done') break;
  }
  return route.length ? route : null;
}
function canMove(pl, tok, steps){ return !!planPath(pl, tok, steps); }
function commitTok(tok, dest){
  tok.pos=dest.pos;
  if(dest.pos==='track'){ tok.track=dest.track; tok.home=null; }
  else if(dest.pos==='home'){ tok.home=dest.home; tok.track=null; }
  else { tok.track=null; tok.home=null; }
}
function onSafe(pl, tok){
  if(meta.safeHouses===false) return false;
  if(tok.pos!=='track') return false;
  const cell=RING[absTrack(pl, tok.track||0)];
  return !!(cell && cell.safe);
}
function noteCatastrophe(pl, why){
  if(!G.solo || !pl.ancestor || G.over) return;
  G.solo.catastrophes++;
  log(`Catastrophe ${G.solo.catastrophes}/3 — ${why}`, true);
  fxBanner('CATASTROPHE');
  shakeBoard();
  if(G.solo.catastrophes>=3) soloFail('The Ancestors triggered 3 Catastrophes. The stool stays empty.');
}
function soloFail(reason){
  if(!G || G.over) return;
  G.over=true;
  const anc=G.seats.find(s=>s.ancestor)||G.seats[1];
  document.getElementById('win-title').textContent='The Ancestors Prevail';
  document.getElementById('win-text').textContent=reason;
  document.getElementById('win-img').src='/ludu/assets/ui/solo.jpg';
  fxBanner('DEFEAT');
  AudioFX.lose();
  recordResult(anc);
  openModal('win-modal');
}
function resolveLanding(pl, tok){
  if(tok.pos!=='track' || !G.cellPower) return;
  const idx=absTrack(pl, tok.track||0);
  const key=G.cellPower[idx];
  if(key) triggerPower(pl, tok, key, idx);
  if(tok.pos==='track') checkCap(pl, tok);
}
async function applyMove(pl, tok, steps){
  const charge=!!tok.charge && tok.pos!=='done' && tok.pos!=='home';
  const route=planPath(pl, tok, steps, charge?{ignoreBarrier:true, ignoreSix:true}:null);
  if(!route) return false;
  const started=tok.pos;
  G.busy=true;
  G.hop=pl.idx+'-'+tok.id;
  tok.charge=false;
  for(let s=0;s<route.length;s++){
    const one=route[s];
    const prev=tok.pos;
    commitTok(tok, one);
    renderTokens();
    markHere(pl, tok);
    const xy=tokenXY(pl, tok);
    fxStrPop(xy.x, xy.y, String(s+1));
    AudioFX.move();
    if(tok.pos==='done'){
      log(`${pl.name} token ${tok.id+1} reaches the Golden Stool!`, true);
      fxBanner('STOOL CLAIMED'); fxFlash(); shakeBoard();
      checkWin(pl);
      break;
    }
    if(tok.pos==='home' && prev!=='home') log(`${pl.name} enters the final path`);
    if(charge && tok.pos==='track') resolveLanding(pl, tok);
    if(G.over || (charge && tok.pos!=='track')) break;
    if(s<route.length-1) await delay(pace(260));
  }
  if(started==='yard' && tok.pos!=='yard') log(`${pl.name} token ${tok.id+1} leaves the yard`, true);
  if(!charge && tok.pos==='track') resolveLanding(pl, tok);
  G.hop=null;
  G.busy=false;
  clearHere();
  renderTokens();
  return true;
}
function diceLeft(){
  if(!G.rolled || !G.spent) return [];
  return dieSlots().filter(i=>!G.spent[i]);
}
function hasLegal(){
  const pl=cur();
  if(!G || !G.rolled || !pl || !G.spent) return false;
  return dieSlots().some(i=> !G.spent[i] && G.dice[i] && pl.tokens.some(t=>canMove(pl, t, G.dice[i])));
}
function bestPick(){
  const pl=cur();
  const open=diceLeft();
  if(!open.length) return 0;
  if(open.includes(G.pick) && pl.tokens.some(t=>canMove(pl, t, G.dice[G.pick]))) return G.pick;
  const good=open.find(i=>pl.tokens.some(t=>canMove(pl, t, G.dice[i])));
  return good==null?open[0]:good;
}
function pickDie(i){
  if(!G || G.over || cur().isAI || !G.rolled || dieSlots().indexOf(i)<0 || G.spent[i]) return;
  G.pick=i;
  AudioFX.ui();
  updateAll();
}
async function onTok(pi,ti){
  if(!G || G.over || G.busy) return;
  if(meta.moveMode==='auto') return;
  const pl=G.seats[pi];
  if(pi!==G.turn || pl.isAI){
    if(pi!==G.turn && cur()) log(`Only ${cur().faction.name} moves on this turn. Other colors wait.`);
    return;
  }
  if(!G.rolled){ log('Roll the dice first.'); return; }
  const steps=G.dice[G.pick];
  if(G.spent[G.pick]){ log('That number is already spent.'); return; }
  const tok=pl.tokens[ti];
  if(!canMove(pl, tok, steps)){
    if(meta.sixToExit && tok.pos==='yard' && steps!==6)
      log('That piece is still home. Only a 6 leaves the yard, and that 6 walks six tiles from your gate.');
    else
      log('That piece cannot take this number — the Stool needs an exact count.');
    return;
  }
  G.spent[G.pick]=true;
  log(`${pl.faction.name} moves ${steps}.`);
  await applyMove(pl, tok, steps);
  if(!G.over){
    G.pick=bestPick();
    updateAll();
  }
}

function scoreMove(pl, tok, steps){
  if(!canMove(pl, tok, steps)) return -1;
  const dest=previewMove(tok, steps);
  if(!dest) return -1;
  let sc=0;
  if(dest.pos==='done') sc+=80;
  if(dest.pos==='home') sc+=50+(dest.home||0)*8;
  if(tok.pos==='track') sc+=12+(tok.track||0);
  if(dest.pos==='track'){
    const a=absTrack(pl, dest.track);
    const key=G.cellPower && G.cellPower[a];
    if(key && POWERS[key]) sc+= POWERS[key].kind==='hinder' ? 6 : 22;
  }
  if(tok.pos==='yard') sc+=10;
  return sc;
}
async function autoPlayHuman(){
  if(!G || G.over || G.busy || G.autoing || meta.moveMode!=='auto') return;
  const pl=cur();
  if(!pl || pl.isAI || !G.rolled) return;
  G.autoing=true;
  let again=false;
  try{
    for(const i of dieSlots()){
      if(G.over || cur()!==pl) return;
      if(G.spent[i]) continue;
      const steps=G.dice[i];
      G.pick=i;
      updateAll();
      let best=null, bs=-1;
      pl.tokens.forEach(t=>{
        const sc=scoreMove(pl, t, steps);
        if(sc>bs){ bs=sc; best=t; }
      });
      if(!best){ G.spent[i]=true; continue; }
      G.spent[i]=true;
      log(`${pl.faction.name} moves ${steps}.`);
      await applyMove(pl, best, steps);
    }
    if(G.over || cur()!==pl || meta.moveMode!=='auto') return;
    await delay(pace(280));
    if(G.over || cur()!==pl || meta.moveMode!=='auto') return;
    endTurn();
    again=!G.over && cur()===pl && !pl.isAI && !G.rolled && meta.moveMode==='auto';
  } finally {
    G.autoing=false;
  }
  if(again){
    await delay(pace(420));
    if(!G.over && cur()===pl && meta.moveMode==='auto' && !G.rolled && !G.busy) rollDice();
  }
}

function triggerPower(pl,tok,key,idx){
  const P=POWERS[key];
  if(!P) return;
  if(idx!=null && G.cellPower){
    G.cellPower[idx]=null;
    refreshPowerCells();
    const cell=document.querySelector('#overlay .cell.track[data-i="'+idx+'"]');
    if(cell){ cell.classList.add('burst'); setTimeout(()=>cell.classList.remove('burst'), powerPace(1200)); }
  }
  const kindLab={help:'Helps you', hinder:'Hinders foes', board:'Whole board'}[P.kind]||'Power';
  toast(P.ico, kindLab+' — '+P.name);
  log(`⚡ ${P.name} (${kindLab}): ${P.desc}`,true);
  fxFlash(); AudioFX.power(key); showPowerStage(P, kindLab);
  pl.stats.powers++;
  G.powersThisGame++;
  if(G.powersThisGame>=3) unlockAch('power_3');
  const others=G.seats.filter(s=>s.idx!==pl.idx);
  const fx=document.getElementById('active-fx');
  switch(key){
    case 'wind':
      others.forEach(o=>{ if(!o.weatherImmune) o.movePenalty=1; });
      if(fx) fx.textContent='Harmattan hinders foes: −1 next roll';
      if(pl.ancestor) noteCatastrophe(pl,'Harmattan wind');
      break;
    case 'rain':
      G.noCap=true;
      if(fx) fx.textContent='Monsoon: whole board, no captures';
      break;
    case 'mist':
      draw(pl,1); others.forEach(o=>o.silenced=true);
      if(fx) fx.textContent='Mist hinders foes: cards silenced';
      break;
    case 'fire':{
      let best=null,hs=-1;
      others.forEach(o=>o.tokens.forEach(t=>{
        if(t.pos==='track'&&!t.hero){const s=t.str+(t.temp||0);if(s>hs){hs=s;best=t;}}
      }));
      if(best){best.pos='yard';best.track=null;best.home=null;log(`Fire banished Str ${hs}!`,true);shakeBoard();unlockAch('scorch');
        if(pl.ancestor) noteCatastrophe(pl,'Ancestral fire');
      }
      if(fx) fx.textContent='Fire hinders a foe: sent home';
      break;
    }
    case 'drum':
      tok.temp=(tok.temp||0)+tok.str; {const xy=tokenXY(pl,tok); fxStrPop(xy.x,xy.y,'×2');}
      if(fx) fx.textContent='Drum helps you: Strength doubled';
      break;
    case 'heal':{
      const y=pl.tokens.find(t=>t.pos==='yard');
      if(y) y.temp=(y.temp||0)+3; else tok.temp=(tok.temp||0)+2;
      if(fx) fx.textContent='Grove helps you: yard piece +3 Strength';
      break;
    }
  }
  bumpStat('powers',1);
  setTimeout(()=>{ if(G && !G.over) spawnPower(); }, powerPace(1700));
}

function checkCap(pl,tok){
  if(G.noCap||tok.pos!=='track') return;
  const a=absTrack(pl,tok.track||0);
  const str=pl.freeCap ? 99 : (tok.str+(tok.temp||0));
  G.seats.forEach(op=>{
    if(op.idx===pl.idx) return;
    op.tokens.forEach(ot=>{
      if(ot.pos!=='track'||ot.prot||onSafe(op,ot)) return;
      if(absTrack(op,ot.track||0)===a){
        if(meta.barriers){
          const mates=op.tokens.filter(x=>x!==ot && x.pos==='track' && absTrack(op, x.track||0)===a);
          if(mates.length>=1) return;
        }
        const os=ot.str+(ot.temp||0);
        if(str>=os){
          ot.pos='yard';ot.track=null;ot.home=null;ot.prot=false;
          pl.stats.caps++; log(`${pl.name} captured a foe (Str ${os})!`,true);
          shakeBoard(); fxFlash(); AudioFX.capture(); bumpStat('captures',1); unlockAch('first_cap');
          if(meta.againOnCapture) G.againOnCapture=true;
          if(meta.removeOnCapture){
            tok.pos='yard'; tok.track=null; tok.home=null;
            log(`${pl.name}'s piece also returns to the yard.`, true);
          }
        } else {
          tok.pos='yard';tok.track=null;tok.home=null;
          log(`${pl.name}'s token was captured!`,true); shakeBoard();
        }
      }
    });
  });
}

function checkWin(pl){
  if(!pl.tokens.every(t=>t.pos==='done')) return;
  G.over=true;
  unlockAch('all_home');
  const humanWin = !pl.isAI && (meta.mode==='hotseat' || pl.idx===0);
  if(meta.mode==='hotseat' && G.seats.length>=3) unlockAch('hotseat');
  if(humanWin && ((meta.mode==='ai' && (meta.difficulty==='hard'||meta.difficulty==='advanced')) || (meta.mode==='solo' && meta.solo==='legend') || (meta.mode==='story' && (meta.difficulty==='hard'||meta.difficulty==='advanced')))) unlockAch('hard_win');
  if(meta.mode==='story' && !pl.isAI){
    const node=STORY_NODES[meta.storyNode];
    if(node) Story.clear(node.id);
  }
  recordResult(pl);
  const mapBtn=document.getElementById('win-map');
  if(mapBtn) mapBtn.style.display = meta.mode==='story' ? 'inline-block' : 'none';
  if(meta.mode==='story'){
    const node=STORY_NODES[meta.storyNode];
    document.getElementById('win-title').textContent = pl.isAI ? 'The road holds' : 'The gate falls';
    document.getElementById('win-text').textContent = pl.isAI
      ? `${pl.faction.leader} keeps ${node?node.name:'the gate'}. March again when you are ready.`
      : `${node?node.name:'The gate'} is yours. The next invader waits on the map.`;
  } else {
    document.getElementById('win-title').textContent = pl.isAI ? 'Defeat' : 'Victory!';
    document.getElementById('win-text').textContent = G.solo && !pl.isAI
      ? `${pl.name} outran the Ancestors. The Golden Stool is yours.`
      : `${pl.name} (${pl.faction.name}) claimed the Golden Stool!`;
  }
  document.getElementById('win-img').src = pl.isAI ? '/ludu/assets/board/board.jpg' : '/ludu/assets/ui/victory.jpg';
  fxBanner(pl.isAI?'DEFEAT':'VICTORY');
  if(pl.isAI) AudioFX.lose(); else AudioFX.win();
  CloudSave.maybeAuto();
  openModal('win-modal');
}

function bumpStat(k,n){
  const u=Store.user(); if(!u) return;
  Store.ensureStats(u); u.stats[k]=(u.stats[k]||0)+n; Store.save(Store.data);
}
function recordResult(winner){
  const u=Store.user(); if(!u) return;
  Store.ensureStats(u);
  u.stats.games++;
  const you=G.seats.find(s=>!s.isAI && s.idx===0);
  if(meta.mode==='ai' || meta.mode==='solo' || meta.mode==='story'){
    if(winner.idx===0 && !winner.isAI){u.stats.wins++; u.stats.streak=(u.stats.streak||0)+1; unlockAch('first_win'); if(u.stats.streak>=2) unlockAch('win_streak_2');}
    else {u.stats.losses++; u.stats.streak=0;}
  } else {
    // hotseat: award win to account only if winner was seat named with account - seat0 preferred
    if(winner.idx===0){u.stats.wins++; unlockAch('first_win');}
    u.stats.games=Math.max(u.stats.games,1);
  }
  if(u.stats.games>=5) unlockAch('games_5');
  Store.save(Store.data);
  CloudSave.maybeAuto();
}

/* cards / leader / dice */
function rollFaces(){
  const n=dieCount();
  const raw=[];
  for(let i=0;i<n;i++) raw.push(1+Math.floor(Math.random()*6));
  return raw;
}
function penalize(pl, raw){
  if(pl && pl.movePenalty && !pl.weatherImmune) return raw.map(m=>Math.max(1, m-pl.movePenalty));
  return raw.slice();
}
function bonusRoll(){
  if(G && G.againOnCapture) return true;
  const r=G && G.rawDice;
  if(!r || !r.length || !r[0]) return false;
  if(r.length===1) return r[0]===6;
  return r[0]===r[1];
}
function bonusLabel(){
  if(G && G.againOnCapture) return 'Capture — roll again.';
  if(dieCount()===1) return 'A six — roll again.';
  return 'Doubles — roll again.';
}
async function rollDice(){
  const pl=cur();
  if(!pl || pl.isAI || G.over || G.rolled || G.busy) return;
  if(G.pendingRevive){ log('Choose which card the priestess restores.'); return; }
  G.busy=true;
  G.againOnCapture=false;
  const d1=document.getElementById('die1'), d2=document.getElementById('die2');
  if(d1) d1.classList.add('roll');
  if(d2 && dieCount()===2) d2.classList.add('roll');
  document.getElementById('roll-btn').disabled=true;
  AudioFX.dice();
  const raw=rollFaces();
  await tumbleDice();
  const moves=penalize(pl, raw);
  G.rawDice=raw;
  G.dice=moves; G.spent=moves.map(()=>false); G.pick=0; G.rolled=true;
  if(d1){ d1.textContent=moves[0]; d1.classList.remove('roll'); d1.classList.add('slam'); }
  if(d2){ d2.textContent=moves[1]||'?'; d2.classList.remove('roll'); if(moves[1]) d2.classList.add('slam'); }
  setTimeout(()=>{ if(d1) d1.classList.remove('slam'); if(d2) d2.classList.remove('slam'); },350);
  if(bonusRoll()) log(bonusLabel(), true);
  const cut=moves.some((m,i)=>m!==raw[i])?` Harmattan cuts them to ${moves.join(' and ')}.`:'';
  log(`${pl.name} rolled ${raw.join(' and ')}.${cut} ${pl.faction.name} pieces move those numbers.`);
  G.pick=bestPick();
  G.busy=false;
  updateAll();
  fxBanner(moves.join('   ·   '));
  if(meta.moveMode==='auto') autoPlayHuman();
}

const EFFECT_HELP = {
  weather:'Hinders foes. Their next roll is reduced by 1.',
  no_cap:'Whole board. Nobody can capture until your turn ends.',
  silence:'Hinders foes. They cannot play a tactic on their next turn.',
  clear:'Clears weather, silence, and the no-capture veil.',
  spy:'Draws 1 card from the reserve you did not bring.',
  discard:'Each foe discards one tactic at random.',
  revive:'Priestess. Return one discarded tactic to your hand. She does not return herself.',
  boost:'Helps you. One piece gains +4 Strength this turn.',
  scorch:'Hinders a foe. Their strongest piece on the path is sent home.',
  horn:'Helps you. One piece doubles its Strength this turn.',
  elephant:'Helps you. One piece +5 Strength and may capture along its next move.',
  sankofa:'Helps you. One piece steps 6 tiles along the path.',
  protect:'Whole board. No captures until your turn ends.'
};
function effectHelp(c){ return (c && EFFECT_HELP[c.effect]) || ''; }
function blessYard(pl){
  const t=pl && pl.tokens.find(tk=>tk.pos==='yard');
  if(!t) return false;
  t.temp=(t.temp||0)+2;
  return true;
}
function showTactic(c, extra){
  if(!c) return;
  const help=effectHelp(c);
  fxBanner(c.name.toUpperCase());
  toast('✶', c.name);
  const fx=document.getElementById('active-fx');
  if(fx) fx.textContent=(extra?extra+' — ':'')+help;
}
function playCard(i){
  const pl=cur();
  if(!pl || pl.isAI||G.over||G.busy||pl.silenced){if(pl&&pl.silenced)log('Silenced — no tactic this turn.');return;}
  if(G.pendingRevive){ log('The priestess is waiting. Choose a discarded card, or send her back.'); return; }
  if(pl.cardPlayed){ log('One tactic a turn. A priestess can bring a discarded card back on a later turn.'); return; }
  const c=pl.hand[i]; if(!c) return;
  pl.cardPlayed=true;
  pl.hand.splice(i,1);
  cardFly(c.img); AudioFX.card();
  if(c.effect==='revive'){
    if(!pl.isAI && pl.discard.length>=1){
      G.pendingRevive=c;
      openReviveModal();
      updateAll();
      return;
    }
    const blessed=blessYard(pl);
    pl.discard.push(c);
    log(blessed
      ? 'The discard is empty. The priestess blesses a piece in the yard (+2 Strength) and is herself spent. She cannot return herself.'
      : 'The discard is empty, and no piece is in the yard. The priestess is spent. She cannot return herself.', true);
    showTactic(c, 'Nothing to restore');
    updateAll(); renderTokens();
    return;
  }
  applyCard(pl,c);
  pl.discard.push(c);
  showTactic(c);
  updateAll(); renderTokens();
}
function restoreOne(pl, idx){
  if(!pl.discard.length) return null;
  let at = (typeof idx==='number' && pl.discard[idx]) ? idx : pl.discard.length-1;
  if(pl.isAI && typeof idx!=='number'){
    const prio=['scorch','horn','elephant','sankofa','boost','weather','protect','spy','silence','discard'];
    const found=pl.discard.findIndex(c=>prio.includes(c.effect));
    if(found>=0) at=found;
  }
  const card=pl.discard.splice(at,1)[0];
  pl.hand.push(card);
  return card;
}
function openReviveModal(){
  const pl=cur();
  const box=document.getElementById('revive-list');
  if(box && pl){
    box.innerHTML=pl.discard.map((c,i)=>`
      <button type="button" class="tactic" onclick="finishRevive(${i})">
        <img src="${c.img}" alt="">
        <span class="tn">${c.name}</span>
        <span class="te">${effectHelp(c)}</span>
        <span class="tp">Restore</span>
      </button>`).join('') || '<p>The discard is empty.</p>';
  }
  openModal('revive-modal');
}
function finishRevive(i){
  const pl=cur();
  const spent=G.pendingRevive;
  if(!pl || !spent || !pl.discard[i]) return;
  const restored=restoreOne(pl, i);
  blessYard(pl);
  pl.discard.push(spent);
  G.pendingRevive=null;
  closeModal('revive-modal');
  log(`Priestess restores ${restored?restored.name:'a card'} to your hand. She herself is spent and cannot restore herself.`, true);
  showTactic(spent, restored?('Restored '+restored.name):'');
  updateAll(); renderTokens();
}
function cancelRevive(){
  const pl=cur();
  const spent=G.pendingRevive;
  G.pendingRevive=null;
  closeModal('revive-modal');
  if(pl && spent){
    pl.hand.unshift(spent);
    pl.cardPlayed=false;
    log('The priestess goes back to your hand. Choose a tactic again, or play none.');
    updateAll();
  }
}
function cardFly(src){
  const el=document.createElement('div'); el.className='card-fly';
  el.innerHTML=`<img src="${src}" style="width:100%;height:100%;object-fit:cover">`;
  el.style.left='50%'; el.style.top='70%'; el.style.transform='translate(-50%,-50%) scale(.5)';
  document.body.appendChild(el);
  requestAnimationFrame(()=>{el.style.transform='translate(-50%,-120%) scale(1.1)';el.style.opacity='0';});
  setTimeout(()=>el.remove(),600);
  fxFlash();
}
function applyCard(pl,c){
  log(`Card — ${c.name}`,true);
  const foes=G.seats.filter(s=>s.idx!==pl.idx);
  switch(c.effect){
    case 'weather':
      foes.forEach(f=>{ if(!f.weatherImmune) f.movePenalty=1; });
      if(pl.ancestor) noteCatastrophe(pl,'Harmattan');
      break;
    case 'no_cap': G.noCap=true; break;
    case 'silence':
      foes.forEach(f=>f.silenced=true);
      if(pl.ancestor) noteCatastrophe(pl,'Ancestral mist');
      break;
    case 'clear': G.noCap=false; G.seats.forEach(s=>{ if(!s.weatherImmune) s.movePenalty=0; }); document.getElementById('active-fx').textContent='Clear skies'; break;
    case 'spy': {
      const n=draw(pl,1);
      log(n? 'A courier brings a reserve card.' : 'No reserve cards left. The race continues.', true);
      break;
    }
    case 'discard': foes.forEach(f=>{if(f.hand.length){const i=Math.floor(Math.random()*f.hand.length);f.discard.push(f.hand.splice(i,1)[0]);}}); break;
    case 'revive':{
      const t=pl.tokens.find(t=>t.pos==='yard'); if(t) t.temp=(t.temp||0)+2;
      restoreOne(pl);
      break;
    }
    case 'boost':{const t=pl.tokens.find(t=>t.pos!=='done')||pl.tokens[0]; t.temp=(t.temp||0)+4; break;}
    case 'scorch':{
      let best=null,hs=-1;
      foes.forEach(f=>f.tokens.forEach(t=>{if(t.pos==='track'&&!t.hero){const s=t.str+(t.temp||0);if(s>hs){hs=s;best=t;}}}));
      if(best){best.pos='yard';best.track=null;unlockAch('scorch');shakeBoard();
        if(pl.ancestor) noteCatastrophe(pl,'Scorch');
      }
      break;
    }
    case 'horn':{const t=pl.tokens.find(t=>t.pos!=='done')||pl.tokens[0]; t.temp=(t.temp||0)+t.str; break;}
    case 'elephant':{
      const t=pl.tokens.find(t=>t.pos==='track')||pl.tokens.find(t=>t.pos==='yard')||pl.tokens[0];
      t.temp=(t.temp||0)+5; t.charge=true;
      log('War Elephant — that token may capture along its next move.', true);
      if(pl.ancestor) noteCatastrophe(pl,'War elephant');
      break;
    }
    case 'sankofa':{
      let t=pl.tokens.find(t=>t.pos==='track')||pl.tokens.find(t=>t.pos==='yard');
      if(t){
        const dest=previewMove(t, 6);
        if(dest) commitTok(t, dest);
        if(t.pos==='track') resolveLanding(pl, t);
        if(t.pos==='done') checkWin(pl);
      }
      break;
    }
    case 'protect': G.noCap=true; break;
  }
}
function useLeader(){
  const pl=cur();
  if(pl.isAI||pl.leaderUsed||G.over||G.pendingRevive) return;
  pl.leaderUsed=true;
  log(`LEADER — ${pl.faction.leader}!`,true);
  fxBanner(pl.faction.leader.toUpperCase()); fxNameplate('LEADER ABILITY'); fxFlash();
  unlockAch('leader');
  applyLeader(pl);
  updateAll(); renderTokens();
}
function applyLeader(pl){
  switch(pl.faction.abilityId){
    case 'ashanti': pl.tokens.forEach(t=>t.temp=(t.temp||0)+3); break;
    case 'yaa':
      pl.freeCap=true;
      pl.tokens.forEach(t=>t.temp=(t.temp||0)+4);
      log('Yaa Asantewaa — capture freely, +4 Strength. Weather cannot touch you.', true);
      break;
    case 'ga':
      G.seats.filter(s=>s.idx!==pl.idx).forEach(f=>{
        if(f.hand.length){const i=Math.floor(Math.random()*f.hand.length); f.discard.push(f.hand.splice(i,1)[0]);}
      });
      pl.tokens.forEach(t=>t.temp=(t.temp||0)+2);
      log('Ga Mantse — foes discard a card. Your tokens +2 Strength.', true);
      break;
    case 'dagbon':{
      const t=pl.tokens.find(t=>t.pos==='track')||pl.tokens.find(t=>t.pos==='yard');
      if(t){
        const d = t.pos==='yard' ? previewFromTrack(-1, 7) : previewMove(t, 6);
        if(d) commitTok(t, d);
        if(t.pos==='track') resolveLanding(pl, t);
        if(t.pos==='done') checkWin(pl);
      }
      break;
    }
    case 'kabye':{
      const t=pl.tokens.find(t=>t.pos==='track')||pl.tokens.find(t=>t.pos==='yard');
      if(t){
        const d = t.pos==='yard' ? previewFromTrack(-1, 6) : previewMove(t, 6);
        if(d) commitTok(t, d);
        if(t.pos==='track') resolveLanding(pl, t);
        if(t.pos==='done') checkWin(pl);
      }
      log('Wondefa Tchabi — one piece advances six tiles.', true);
      break;
    }
    case 'fante': {
      const n=draw(pl,2);
      log(n?`Recalled ${n} from the reserve.`:'No reserve cards left — the race continues.', true);
      break;
    }
    case 'ewe':
      G.noCap=false; G.seats.forEach(s=>{s.movePenalty=0;s.silenced=false;});
      pl.tokens.filter(t=>t.pos==='yard').forEach(t=>t.temp=(t.temp||0)+2);
      break;
    case 'baoule':
      G.noCap=false; G.seats.forEach(s=>{s.movePenalty=0;s.silenced=false;});
      pl.tokens.filter(t=>t.pos==='yard').forEach(t=>t.temp=(t.temp||0)+2);
      G.noCap=true;
      log('Nanan Affoue clears the harm and shields the table this turn.', true);
      break;
    case 'fon':{
      const t=pl.tokens.find(t=>t.pos==='track')||pl.tokens.find(t=>t.pos==='yard')||pl.tokens[0];
      if(t){ t.temp=(t.temp||0)+5; t.charge=true; }
      log('Queen Adjo — that piece may capture along its next move.', true);
      break;
    }
    case 'yoruba':{
      pl.tokens.forEach(t=>t.temp=(t.temp||0)+3);
      let best=null,hs=-1;
      G.seats.filter(s=>s.idx!==pl.idx).forEach(f=>f.tokens.forEach(t=>{
        if(t.pos==='track'&&!t.hero){const s=t.str+(t.temp||0); if(s>hs){hs=s;best=t;}}
      }));
      if(best){best.pos='yard';best.track=null;best.home=null;}
      log('Olori Ireti — your pieces +3. A rival on the path goes home.', true);
      break;
    }
    case 'hausa':
      G.seats.filter(s=>s.idx!==pl.idx && !s.weatherImmune).forEach(f=>{f.movePenalty=1;});
      pl.tokens.forEach(t=>t.temp=(t.temp||0)+2);
      log('Magajiya Dalla — the harmattan cuts rival rolls. Your pieces +2.', true);
      break;
    default:
      pl.tokens.forEach(t=>t.temp=(t.temp||0)+2);
  }
}

function endTurn(){
  if(!G || G.over) return;
  if(G.busy){ log('Wait — the piece is still stepping.'); return; }
  if(G.pendingRevive){ log('Choose the discarded card the priestess restores, or send her back to your hand.'); return; }
  const pl=cur();
  if(!pl || pl.isAI) return;
  if(!G.rolled){
    log('Roll first. You may play one tactic before or after the roll, then end the turn.');
    return;
  }
  if(hasLegal()){
    log('That number is not spent yet. Move one of your pieces, then press End Turn.');
    G.pick=bestPick();
    updateAll();
    return;
  }
  const bonus=bonusRoll();
  const why=bonusLabel();
  pl.tokens.forEach(t=>{t.temp=0; t.prot=false; t.charge=false;});
  pl.freeCap=false;
  pl.movePenalty=0;
  G.noCap=false; G.rolled=false; G.spent=[false,false]; G.dice=[0,0]; G.rawDice=[]; G.pick=0; G.sel=null;
  G.againOnCapture=false;
  const d1=document.getElementById('die1'), d2=document.getElementById('die2');
  if(d1) d1.textContent='?';
  if(d2) d2.textContent='?';
  hideBoardDice();
  document.getElementById('roll-btn').disabled=false;

  if(bonus){
    log(why, true);
    fxBanner(dieCount()===1 ? 'A SIX — ROLL AGAIN' : 'DOUBLES — ROLL AGAIN');
    updateAll();
    return;
  }

  pl.cardPlayed=false;
  G.seats[G.turn].silenced=false;
  G.turn=(G.turn+1)%G.seats.length;
  log(`— ${cur().name}'s turn —`,true);
  fxNameplate(cur().name.toUpperCase()+' · '+cur().faction.name.toUpperCase());
  updateAll();
  maybePassDevice();
  if(cur().isAI) setTimeout(()=>aiPlay(),pace(700));
}

function maybePassDevice(){
  const pl=cur();
  if(meta.mode==='hotseat' && !pl.isAI){
    document.getElementById('pass-text').textContent=`Pass the phone to ${pl.name} (${pl.faction.name}). Only ${pl.faction.name} pieces move.`;
    openModal('pass-modal');
  }
}

/* ============ AI (easy / normal / hard) ============ */
function aiPlay(){
  if(G.over||!cur().isAI) return;
  const pl=cur();
  const diff=pl.ancestor
    ? (meta.solo==='initiate'?'easy':meta.solo==='legend'?'hard':'normal')
    : (pl.difficulty||meta.difficulty);

  if(pl.ancestor && pl.hand.length<2){
    if(!pl.deck.length){ soloFail('The Ancestor deck is empty. The challenge ends.'); return; }
    draw(pl, 2-pl.hand.length);
  }
  if(G.over) return;

  if(pl.hand.length && !pl.silenced && !pl.cardPlayed){
    const playChance = diff==='easy'?0.22:diff==='advanced'?0.92:diff==='hard'?0.72:0.45;
    if(Math.random()<playChance){
      let idx=0;
      if(diff==='hard' || diff==='advanced'){
        const prio=['scorch','horn','elephant','weather','boost','sankofa','spy','revive','protect','discard'];
        const threat=G.seats.some(s=>s.idx!==pl.idx&&s.tokens.some(t=>t.pos==='home'||(t.pos==='track'&&(t.track||0)>TRACK_LEN-8)));
        const order=threat?['scorch','weather','no_cap','horn',...prio]:prio;
        idx=pl.hand.findIndex(c=>order.includes(c.effect));
        if(idx<0) idx=Math.floor(Math.random()*pl.hand.length);
      } else if(diff==='normal'){
        const prio=['scorch','horn','boost','spy','sankofa'];
        idx=pl.hand.findIndex(c=>prio.includes(c.effect));
        if(idx<0) idx=Math.floor(Math.random()*pl.hand.length);
      } else idx=Math.floor(Math.random()*pl.hand.length);
      const c=pl.hand.splice(idx,1)[0];
      pl.cardPlayed=true;
      if(c.effect==='revive'){
        const yard=pl.tokens.find(t=>t.pos==='yard'); if(yard) yard.temp=(yard.temp||0)+2;
        restoreOne(pl);
        pl.discard.push(c);
      } else {
        applyCard(pl,c);
        pl.discard.push(c);
      }
    }
  }
  if(G.over) return;
  if((diff==='hard'||diff==='advanced') && !pl.leaderUsed && !pl.ancestor && Math.random()<(diff==='advanced'?0.8:0.35)){
    pl.leaderUsed=true;
    applyLeader(pl);
    log(`AI Leader: ${pl.faction.leader}`);
  }

  setTimeout(async ()=>{
    if(G.over||cur()!==pl) return;
    const raw=rollFaces();
    G.busy=true;
    AudioFX.dice();
    await tumbleDice();
    if(G.over||cur()!==pl){ G.busy=false; return; }
    G.rawDice=raw;
    let moves=penalize(pl, raw);
    G.dice=moves; G.spent=moves.map(()=>false); G.rolled=true; G.pick=0;
    const d1=document.getElementById('die1'), d2=document.getElementById('die2');
    if(d1) d1.textContent=moves[0];
    if(d2) d2.textContent=moves[1]||'?';
    log(`${pl.name} rolled ${moves.join(' and ')}. ${pl.faction.name} moves.`);
    G.busy=false;
    showBoardDice(moves[0], moves[1], pl.faction.name+' moves '+moves.join(' and '));
    await aiMoves(diff);
  }, pace(400));
}

async function aiMoves(diff){
  const pl=cur();
  if(G.over) return;
  for(const i of dieSlots()){
    if(G.over || cur()!==pl) return;
    const steps=G.dice[i];
    G.pick=i;
    showBoardDice(G.dice[0], G.dice[1], pl.faction.name+' moves '+steps);
    const candidates=pl.tokens.filter(t=>canMove(pl, t, steps));
    if(!candidates.length){ G.spent[i]=true; continue; }
    let tok;
    if(diff==='easy'){
      tok=candidates[Math.floor(Math.random()*candidates.length)];
    } else {
      const scored=candidates.map(t=>{
        let sc=0;
        const dest=previewMove(t, steps);
        if(dest && dest.pos==='done') sc+=80;
        if(dest && dest.pos==='home') sc+=50+(dest.home||0)*8;
        if(t.pos==='track') sc+=15+(t.track||0);
        if(dest && dest.pos==='track'){
          const a=absTrack(pl, dest.track);
          if(G.cellPower && G.cellPower[a]) sc+=(diff==='hard'||diff==='advanced')?25:10;
          G.seats.forEach(op=>{
            if(op.idx===pl.idx) return;
            op.tokens.forEach(ot=>{
              if(ot.pos==='track' && !onSafe(op,ot) && absTrack(op,ot.track||0)===a){
                if((t.str+(t.temp||0))>=(ot.str+(ot.temp||0))) sc+=diff==='advanced'?60:diff==='hard'?40:15;
              }
            });
          });
        }
        if(t.pos==='yard') sc+=8;
        if(t.hero) sc+=3;
        return {t,sc};
      });
      scored.sort((a,b)=>b.sc-a.sc);
      tok=scored[0].t;
    }
    G.spent[i]=true;
    await applyMove(pl, tok, steps);
  }
  if(G.over) return;
  await delay(pace(360));
  if(G.over || cur()!==pl) return;
  const bonus=bonusRoll();
  const why=bonusLabel();
  pl.tokens.forEach(t=>{t.temp=0;t.prot=false;t.charge=false;});
  pl.freeCap=false;
  pl.movePenalty=0; G.noCap=false; G.rolled=false; G.spent=[false,false]; G.dice=[0,0]; G.rawDice=[]; G.sel=null;
  G.againOnCapture=false;
  const d1=document.getElementById('die1'), d2=document.getElementById('die2');
  if(d1) d1.textContent='?';
  if(d2) d2.textContent='?';
  hideBoardDice();
  if(bonus){log(`${pl.name} — ${why}`); setTimeout(()=>aiPlay(),pace(500)); return;}
  pl.cardPlayed=false;
  pl.silenced=false;
  G.turn=(G.turn+1)%G.seats.length;
  log(`— ${cur().name}'s turn —`,true);
  fxNameplate(cur().name.toUpperCase()+' · '+cur().faction.name.toUpperCase());
  updateAll();
  maybePassDevice();
  if(cur().isAI) setTimeout(()=>aiPlay(),pace(700));
  else {document.getElementById('roll-btn').disabled=false; updateAll();}
}

function updateAll(){
  if(!G) return;
  const pl0=cur();
  if(G.rolled && !pl0.isAI && G.spent) G.pick=bestPick();
  document.getElementById('topbar').innerHTML = G.seats.map(s=>`
    <div class="pchip ${s.idx===G.turn?'active':''}">
      <span class="c" style="background:${s.faction.color}"></span>
      ${s.name}${s.isAI && !s.ancestor?' (AI)':''}
    </div>`).join('') + `<div class="turn-lbl">${cur().name}</div>`;

  document.getElementById('seat-list').innerHTML = G.seats.map(s=>`
    <div class="row"><span><span class="dot" style="background:${s.faction.color}"></span>${s.name}</span>
    <span>${s.tokens.filter(t=>t.pos==='done').length}/4</span></div>`).join('');

  const soloEl=document.getElementById('solo-status');
  if(soloEl){
    if(G.solo){
      soloEl.style.display='block';
      const left=G.seats[1]?G.seats[1].deck.length:0;
      soloEl.textContent=`Ancestors · ${G.solo.tier} · Catastrophes ${G.solo.catastrophes}/3 · Deck ${left}`;
    } else soloEl.style.display='none';
  }

  const pl=cur();
  document.getElementById('side-active').innerHTML=`
    <img class="thumb" src="${pl.faction.img}" alt="">
    <div style="font-family:Cinzel,serif;color:var(--gold-l);font-size:.85rem">${pl.ancestor?'Ancestors':pl.faction.name}</div>
    <div style="font-size:.72rem;color:var(--muted)">${pl.faction.leader}</div>`;
  const st=t=>t.pos==='done'?'Home':t.pos==='yard'?'Yard':t.pos==='home'?`Lane ${t.home+1}`:`Path ${(t.track||0)+1}`;
  document.getElementById('side-tokens').innerHTML=pl.tokens.map(t=>
    `<div class="row"><span>T${t.id+1} (${t.str}${t.hero?'★':''})</span><span>${st(t)}</span></div>`).join('');

  const hand=document.getElementById('hand');
  const hero=document.getElementById('dock-hero');
  const who=document.getElementById('dock-who');
  if(hero && pl.faction){ hero.src=pl.faction.img; hero.alt=pl.faction.leader||pl.faction.name; }
  if(who && pl.faction){
    who.textContent = pl.isAI
      ? (pl.faction.leader+' · '+pl.faction.name)
      : (pl.faction.leader+' · play one tactic, or none');
  }
  if(!pl.isAI){
    hand.innerHTML=pl.hand.map((c,i)=>`
      <button type="button" class="tactic ${pl.cardPlayed?'spent':''}" onclick="playCard(${i})">
        <img src="${c.img}" alt="">
        <span class="tn">${c.name}</span>
        <span class="te">${effectHelp(c)}</span>
        <span class="tp">${pl.cardPlayed?'Held':'Play'}</span>
      </button>`).join('')
      || '<span class="hand-empty">No tactics left. Roll and move anyway. Only a priestess can bring a discarded card back.</span>';
  } else {
    hand.innerHTML=`<span class="hand-empty">${pl.ancestor?'The Ancestors are moving…':'The rival is taking their turn…'}</span>`;
  }
  const drow=document.getElementById('discard-row');
  if(drow){
    drow.innerHTML = pl.isAI ? '' : pl.discard.map(c=>`
      <div class="tactic mini" title="${c.name}"><img src="${c.img}" alt=""><span class="tn">${c.name}</span></div>`).join('');
  }
  const dlab=document.getElementById('discard-lbl');
  if(dlab){
    dlab.textContent = pl.isAI ? '' :
      `Hand ${pl.hand.length} · Discard ${pl.discard.length} · Reserve ${pl.deck.length}` +
      (pl.discard.length? ' · discard sits under the hand' : '');
  }
  const end=document.getElementById('end-btn');
  if(end){
    if(pl.isAI || G.over){
      end.style.display='none';
    } else {
      end.style.display='inline-block';
      const must=!!(G.rolled && hasLegal());
      const again=!!(G.rolled && !must && bonusRoll());
      end.textContent = again ? (dieCount()===1 ? 'Six — roll again' : 'Doubles — roll again') : 'End Turn';
      end.classList.toggle('end-ready', !!(G.rolled && !must && !G.busy));
    }
  }
  const pending=G.rolled && G.spent && G.spent.some(s=>!s);
  document.getElementById('roll-btn').disabled = pl.isAI || G.over || pending || G.rolled;
  document.getElementById('leader-btn').disabled = pl.isAI || pl.leaderUsed || G.over;
  const ml=document.getElementById('moves-lbl');
  if(!pl.isAI && !G.over){
    if(!G.rolled){
      ml.textContent='Roll the die. Play one tactic before or after, then End Turn.';
    } else {
      const open=diceLeft();
      if(open.length && !hasLegal()){
        ml.textContent = meta.sixToExit
          ? `Rolled ${G.dice[open[0]]}. Nothing can move — home needs a 6. Press End Turn.`
          : 'Nothing can move on that number. Press End Turn.';
      } else if(open.length){
        ml.textContent = `Move ${G.dice[G.pick]} with one ${pl.faction.name} piece, then End Turn.`;
      } else if(bonusRoll()){
        ml.textContent = dieCount()===1 ? 'A six. Press Roll again — the turn is still yours.' : 'Doubles. Press Roll again — the turn is still yours.';
      } else ml.textContent='Number spent. Press End Turn to pass.';
    }
  } else if(ml) ml.textContent='';
  [0,1].forEach(i=>{
    const el=document.getElementById('die'+(i+1));
    if(!el) return;
    el.classList.toggle('pick', !!(G.rolled && !pl.isAI && G.pick===i && G.spent && !G.spent[i]));
    el.classList.toggle('spent', !!(G.spent && G.spent[i]));
  });
  const board=document.getElementById('board');
  if(board && pl.faction) board.style.boxShadow=`0 0 0 3px ${pl.faction.color}, 0 0 36px ${pl.faction.color}66`;
  if(G.rolled && !G.busy){
    const open=diceLeft();
    const shown=dieCount()===1 ? String(G.dice[0]) : (G.dice[0]+' and '+G.dice[1]);
    const cap=!pl.isAI && open.length
      ? (meta.moveMode==='auto'
          ? `MOVE ${G.dice[G.pick]} · moving your ${pl.faction.name}`
          : `MOVE ${G.dice[G.pick]} · tap your ${pl.faction.name} piece`)
      : `${pl.faction.name} · ${shown}`;
    showBoardDice(G.dice[0], G.dice[1], cap);
  }
  syncDiceChrome();
  renderTokens();
}

function confirmQuit(){
  if(confirm('Leave the race and return to menu?')) location.reload();
}

/* share */
const SHARE_TEXT='Race for the Golden Stool in LUDU: Empires of the Gold Coast — Ghanaian fantasy Ludu × Gwent tactics!';
function shareSocial(net){
  unlockAch('share');
  const url=encodeURIComponent(location.href.split('?')[0]);
  const text=encodeURIComponent(SHARE_TEXT);
  let href='#';
  if(net==='x') href=`https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  if(net==='fb') href=`https://www.facebook.com/sharer/sharer.php?u=${url}`;
  if(net==='wa') href=`https://wa.me/?text=${text}%20${url}`;
  window.open(href,'_blank','noopener');
}
function shareNative(){
  unlockAch('share');
  if(navigator.share) navigator.share({title:'LUDU',text:SHARE_TEXT,url:location.href}).catch(()=>{});
  else shareSocial('x');
}
function shareRecord(){
  const u=Store.user();
  const t=u?`${u.display||u.user}: ${u.stats.wins}W / ${u.stats.losses}L on LUDU Gold Coast` : SHARE_TEXT;
  unlockAch('share');
  if(navigator.share) navigator.share({title:'LUDU Record',text:t}).catch(()=>{});
  else window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(t),'_blank');
}
function shareWin(){
  unlockAch('share');
  const t=`I claimed the Golden Stool in LUDU: Empires of the Gold Coast!`;
  if(navigator.share) navigator.share({title:'Victory',text:t}).catch(()=>{});
  else window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(t),'_blank');
}


/* ============================================================
   AUDIO (Web Audio — no external files)
   ============================================================ */
const AudioFX = {
  ctx:null, enabled:true, unlocked:false,
  ensure(){
    if(!this.ctx) this.ctx = new (window.AudioContext||window.webkitAudioContext)();
    if(this.ctx.state==='suspended') this.ctx.resume();
    this.unlocked=true;
  },
  toggle(){
    this.enabled=!this.enabled;
    const b=document.getElementById('sound-btn');
    if(b) b.textContent='Sound: '+(this.enabled?'On':'Off');
    if(this.enabled){this.ensure(); this.ui();}
  },
  tone(freq, dur, type='sine', gain=0.08, at=0){
    if(!this.enabled) return;
    try{
      this.ensure();
      const t=this.ctx.currentTime+at;
      const o=this.ctx.createOscillator();
      const g=this.ctx.createGain();
      o.type=type; o.frequency.setValueAtTime(freq,t);
      g.gain.setValueAtTime(gain,t);
      g.gain.exponentialRampToValueAtTime(0.001,t+dur);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t+dur+0.02);
    }catch(e){}
  },
  noise(dur=0.08, gain=0.05, at=0){
    if(!this.enabled) return;
    try{
      this.ensure();
      const n=Math.floor(this.ctx.sampleRate*dur);
      const buf=this.ctx.createBuffer(1,n,this.ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*0.5;
      const s=this.ctx.createBufferSource(); s.buffer=buf;
      const g=this.ctx.createGain();
      const t0=this.ctx.currentTime+(at||0);
      g.gain.setValueAtTime(gain, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0+dur);
      s.connect(g); g.connect(this.ctx.destination); s.start(t0);
    }catch(e){}
  },
  sweep(from, to, dur, type, gain, at){
    if(!this.enabled) return;
    try{
      this.ensure();
      const t=this.ctx.currentTime+(at||0);
      const o=this.ctx.createOscillator();
      const g=this.ctx.createGain();
      o.type=type||'sine';
      o.frequency.setValueAtTime(Math.max(40, from), t);
      o.frequency.exponentialRampToValueAtTime(Math.max(40, to), t+dur);
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.001, t+dur);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t+dur+0.02);
    }catch(e){}
  },
  ui(){ this.tone(880,0.05,'square',0.04); },
  dice(){ this.noise(0.06,0.07); this.tone(200,0.08,'triangle',0.06,0.02); this.tone(150,0.1,'triangle',0.05,0.06); },
  move(){ this.tone(420,0.07,'sine',0.05); this.tone(520,0.06,'sine',0.04,0.05); },
  capture(){ this.tone(180,0.12,'sawtooth',0.07); this.tone(90,0.2,'sawtooth',0.06,0.05); this.noise(0.1,0.06); },
  card(){ this.tone(660,0.08,'triangle',0.05); this.tone(880,0.1,'triangle',0.04,0.06); },
  power(kind){
    const k=kind||'heal';
    if(k==='wind'){
      this.noise(0.6, 0.05);
      this.sweep(1400, 160, 0.75, 'sine', 0.05);
      this.sweep(2000, 280, 0.6, 'triangle', 0.03, 0.08);
    } else if(k==='rain'){
      for(let i=0;i<12;i++) this.noise(0.08, 0.06, i*0.08);
      this.tone(150, 0.7, 'sine', 0.045);
      this.tone(210, 0.5, 'triangle', 0.03, 0.12);
    } else if(k==='mist'){
      this.tone(494, 0.8, 'sine', 0.035);
      this.tone(506, 0.8, 'sine', 0.03, 0.03);
      this.sweep(880, 440, 0.7, 'triangle', 0.03, 0.05);
    } else if(k==='fire'){
      this.noise(0.5, 0.09);
      this.sweep(260, 45, 0.55, 'sawtooth', 0.055);
      this.tone(70, 0.4, 'square', 0.03, 0.06);
      this.noise(0.22, 0.05, 0.2);
    } else if(k==='drum'){
      [0, 0.2, 0.38, 0.58].forEach((at,i)=>{
        this.tone(i%2?96:70, 0.18, 'sine', 0.11, at);
        this.noise(0.045, 0.045, at);
      });
    } else {
      [392, 494, 587, 784].forEach((f,i)=>this.tone(f, 0.32, 'triangle', 0.06, i*0.12));
    }
  },
  win(){ [523,659,784,1046].forEach((f,i)=>this.tone(f,0.25,'triangle',0.07,i*0.12)); },
  lose(){ this.tone(300,0.2,'sawtooth',0.06); this.tone(200,0.3,'sawtooth',0.05,0.15); },
  turn(){ this.tone(392,0.1,'sine',0.05); this.tone(494,0.12,'sine',0.05,0.1); },
  ach(){ this.tone(784,0.1,'square',0.05); this.tone(988,0.15,'square',0.05,0.1); this.tone(1175,0.2,'square',0.04,0.2); },
};

// Unlock audio on first user gesture
['click','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,()=>AudioFX.ensure(),{once:true}));

/* ============================================================
   CLOUD SAVE (API-shaped; local vault until real backend)
   ============================================================ */
const CloudAPI = {
  // Production: set base = 'https://api.yourgame.com'
  base: null, // null => local simulated cloud
  async put(user, payload){
    await delay(350+Math.random()*250);
    if(this.base){
      // return fetch(this.base+'/v1/save/'+user,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(r=>r.json());
    }
    const vault=JSON.parse(localStorage.getItem('ludu_cloud_vault')||'{}');
    const prev=vault[user]||{rev:0};
    const rev=(prev.rev||0)+1;
    vault[user]={rev, savedAt:Date.now(), payload};
    localStorage.setItem('ludu_cloud_vault', JSON.stringify(vault));
    return {ok:true, rev, savedAt:vault[user].savedAt};
  },
  async get(user){
    await delay(300+Math.random()*200);
    if(this.base){ /* fetch(this.base+'/v1/save/'+user) */ }
    const vault=JSON.parse(localStorage.getItem('ludu_cloud_vault')||'{}');
    return vault[user]||null;
  }
};
function delay(ms){return new Promise(r=>setTimeout(r,ms));}

const CloudSave = {
  auto:false,
  payload(){
    const u=Store.user();
    if(!u) return null;
    return {
      user:u.user, display:u.display, stats:u.stats, ach:u.ach,
      clanId:(u.clanId||null),
      settings:{sound:AudioFX.enabled},
      exportedAt:Date.now()
    };
  },
  async push(){
    const u=Store.user();
    const msg=document.getElementById('cloud-msg');
    if(!u){ if(msg) msg.textContent='Login required to use cloud save.'; AudioFX.ui(); return; }
    if(msg) msg.textContent='Uploading…';
    try{
      const res=await CloudAPI.put(u.user, this.payload());
      u.cloudRev=res.rev; u.cloudAt=res.savedAt;
      Store.save(Store.data);
      if(msg) msg.textContent='Uploaded · revision '+res.rev;
      this.refreshUI(); AudioFX.ach();
    }catch(e){ if(msg) msg.textContent='Upload failed'; }
  },
  async pull(){
    const u=Store.user();
    const msg=document.getElementById('cloud-msg');
    if(!u){ if(msg) msg.textContent='Login required.'; return; }
    if(msg) msg.textContent='Downloading…';
    try{
      const remote=await CloudAPI.get(u.user);
      if(!remote){ if(msg) msg.textContent='No cloud save found.'; return; }
      const p=remote.payload||{};
      if(p.stats) u.stats=p.stats;
      if(p.ach) u.ach=p.ach;
      if(p.display) u.display=p.display;
      if(p.clanId) u.clanId=p.clanId;
      u.cloudRev=remote.rev; u.cloudAt=remote.savedAt;
      Store.save(Store.data);
      if(msg) msg.textContent='Restored revision '+remote.rev;
      this.refreshUI(); refreshHub(); AudioFX.power();
    }catch(e){ if(msg) msg.textContent='Download failed'; }
  },
  autoToggle(){
    this.auto=!this.auto;
    const b=document.getElementById('cloud-auto-btn');
    if(b) b.textContent='Auto-sync: '+(this.auto?'On':'Off');
    AudioFX.ui();
  },
  maybeAuto(){ if(this.auto && Store.user()) this.push(); },
  refreshUI(){
    const u=Store.user();
    const st=document.getElementById('cloud-status');
    if(!u){ if(st){st.textContent='● Login required'; st.className='sync-pill';} return; }
    if(st){ st.textContent=u.cloudRev?'● Synced · rev '+u.cloudRev:'● Not uploaded yet'; st.className='sync-pill '+(u.cloudRev?'ok':'pend'); }
    const rev=document.getElementById('cloud-rev'); if(rev) rev.textContent=u.cloudRev||0;
    const when=document.getElementById('cloud-when');
    if(when) when.textContent=u.cloudAt? new Date(u.cloudAt).toLocaleString() : '—';
    const size=document.getElementById('cloud-size');
    if(size){ const p=this.payload(); size.textContent=p? (JSON.stringify(p).length+' B') : '—'; }
  }
};

/* ============================================================
   LEADERBOARDS (multi-style; local seed + player submit)
   ============================================================ */
const LB = {
  current:'global',
  seed(){
    let db=JSON.parse(localStorage.getItem('ludu_lb_v1')||'null');
    if(db) return db;
    const names=['Kofi Gold','Ama Storm','Yaw Drum','Efua Mist','Kojo Flame','Abena Tide','Nana Hawk','Serwaa Veil','Kwame Ash','Adwoa Reed'];
    const factions=['ashanti','fante','dagbon','ewe'];
    db={ global:[], weekly:[], seasonal:[], friends:[], clans:[], faction:{} };
    for(let i=0;i<12;i++){
      const e={name:names[i%names.length], score:1200-i*70-Math.floor(Math.random()*40), wins:40-i*2, faction:factions[i%4], rating:1800-i*55};
      db.global.push({...e});
      db.weekly.push({...e, score:Math.floor(e.score/3)+Math.floor(Math.random()*80)});
      db.seasonal.push({...e, score:e.score+Math.floor(Math.random()*100)});
    }
    db.friends=db.global.slice(0,5);
    factions.forEach(f=>{ db.faction[f]=db.global.filter(x=>x.faction===f).map(x=>({...x})); });
    // clans board filled from Clans store later
    db.clans=[];
    localStorage.setItem('ludu_lb_v1', JSON.stringify(db));
    return db;
  },
  save(db){ localStorage.setItem('ludu_lb_v1', JSON.stringify(db)); },
  desc:{
    global:'All-time ranking by prestige score (wins × 25 + captures × 3).',
    weekly:'Resets conceptually each week — highest activity this cycle.',
    seasonal:'Season of the Gold Coast — cumulative seasonal prestige.',
    friends:'Players you have marked as friends (local list).',
    clans:'Clan Wars — aggregate clan trophies vs other clans.',
    faction:'Filter by empire affinity (Ashanti / Fante / Dagbon / Ewe).'
  },
  show(type){
    this.current=type;
    document.querySelectorAll('#lb-tabs .tab').forEach(t=>t.classList.toggle('on', t.dataset.lb===type));
    const d=document.getElementById('lb-desc'); if(d) d.textContent=this.desc[type]||'';
    const db=this.seed();
    let rows=[];
    if(type==='clans'){
      rows = (Clans.list().length? Clans.list() : db.clans).map(c=>({name:`[${c.tag}] ${c.name}`, score:c.trophies||0, sub:(c.members||[]).length+' members'}));
      rows.sort((a,b)=>b.score-a.score);
    } else if(type==='faction'){
      // show best of each faction
      rows=[];
      ['ashanti','fante','dagbon','ewe'].forEach(f=>{
        const arr=(db.faction[f]||[]).slice().sort((a,b)=>b.score-a.score);
        if(arr[0]) rows.push({name:arr[0].name+' · '+f, score:arr[0].score, sub:FACTIONS[f].name});
      });
      rows.sort((a,b)=>b.score-a.score);
    } else {
      rows=(db[type]||db.global).slice().sort((a,b)=>b.score-a.score).map(e=>({name:e.name, score:e.score, sub:(e.wins!=null?e.wins+' wins':'')}));
    }
    const u=Store.user();
    const meName=u?(u.display||u.user):null;
    const list=document.getElementById('lb-list');
    if(!list) return;
    list.innerHTML=rows.slice(0,15).map((r,i)=>`
      <div class="lb-row ${meName&&r.name.startsWith(meName)?'me':''}">
        <div class="rank">${i+1}</div>
        <div class="who"><strong>${r.name}</strong><div style="font-size:.72rem;color:var(--muted)">${r.sub||''}</div></div>
        <div class="score">${r.score}</div>
      </div>`).join('') || '<p class="form-hint">Empty board — submit a score.</p>';
  },
  submitScore(){
    const u=Store.user();
    if(!u){ alert('Login required to submit scores.'); showScreen('login-screen'); return; }
    Store.ensureStats(u);
    const score=(u.stats.wins||0)*25+(u.stats.captures||0)*3+(u.stats.powers||0)+(u.ach||[]).length*5;
    const db=this.seed();
    const entry={name:u.display||u.user, score, wins:u.stats.wins||0, faction:u.favFaction||'ashanti', rating:1000+score};
    ['global','weekly','seasonal'].forEach(k=>{
      db[k]=db[k].filter(e=>e.name!==entry.name);
      db[k].push({...entry});
      db[k].sort((a,b)=>b.score-a.score);
    });
    // friends: add self
    db.friends=db.friends.filter(e=>e.name!==entry.name);
    db.friends.push({...entry});
    const f=entry.faction;
    if(!db.faction[f]) db.faction[f]=[];
    db.faction[f]=db.faction[f].filter(e=>e.name!==entry.name);
    db.faction[f].push({...entry});
    this.save(db);
    // clan trophies
    if(u.clanId) Clans.addTrophies(u.clanId, Math.max(5, Math.floor(score/20)));
    AudioFX.ach();
    this.show(this.current);
    unlockAch('share'); // herald spirit
    alert('Score submitted: '+score+' prestige');
    CloudSave.maybeAuto();
  },
  addFriend(){
    const u=Store.user();
    if(!u){ alert('Login required'); return; }
    const name=prompt('Friend display name to track on Friends board');
    if(!name) return;
    const db=this.seed();
    if(!db.friends.some(e=>e.name===name)) db.friends.push({name, score:0, wins:0, faction:'ashanti'});
    this.save(db); this.show('friends'); AudioFX.ui();
  }
};

/* ============================================================
   CLANS & TEAMS
   ============================================================ */
const Clans = {
  store(){ return JSON.parse(localStorage.getItem('ludu_clans_v1')||'{"clans":[]}'); },
  save(s){ localStorage.setItem('ludu_clans_v1', JSON.stringify(s)); },
  list(){ return this.store().clans||[]; },
  create(){
    const u=Store.user();
    if(!u){ alert('Login required to create a clan.'); showScreen('login-screen'); return; }
    const name=(document.getElementById('clan-name').value||'').trim();
    const tag=(document.getElementById('clan-tag').value||'').trim().toUpperCase();
    if(name.length<3){ alert('Name too short'); return; }
    if(tag.length<3||tag.length>5){ alert('Tag must be 3–5 letters'); return; }
    const s=this.store();
    if(s.clans.some(c=>c.tag===tag)){ alert('Tag taken'); return; }
    if(u.clanId){ alert('Leave your clan first (re-register clear or join overwrites)'); }
    const clan={id:'c_'+Date.now(), name, tag, leader:u.user, members:[u.user], trophies:100, createdAt:Date.now()};
    s.clans.push(clan);
    this.save(s);
    u.clanId=clan.id;
    Store.save(Store.data);
    AudioFX.ach();
    this.refresh();
    LB.show('clans');
  },
  join(){
    const u=Store.user();
    if(!u){ alert('Login required.'); showScreen('login-screen'); return; }
    const tag=(document.getElementById('clan-join').value||'').trim().toUpperCase();
    const s=this.store();
    const clan=s.clans.find(c=>c.tag===tag);
    if(!clan){ alert('Clan not found'); return; }
    // leave old
    if(u.clanId){
      const old=s.clans.find(c=>c.id===u.clanId);
      if(old) old.members=(old.members||[]).filter(m=>m!==u.user);
    }
    if(!clan.members.includes(u.user)) clan.members.push(u.user);
    u.clanId=clan.id;
    this.save(s); Store.save(Store.data);
    AudioFX.ui(); this.refresh();
  },
  addTrophies(id, n){
    const s=this.store();
    const c=s.clans.find(x=>x.id===id);
    if(c){ c.trophies=(c.trophies||0)+n; this.save(s); }
  },
  refresh(){
    const u=Store.user();
    const mine=document.getElementById('clan-mine');
    const s=this.store();
    if(!mine) return;
    if(u && u.clanId){
      const c=s.clans.find(x=>x.id===u.clanId);
      if(c){
        mine.innerHTML=`<div class="clan-card"><h4>[${c.tag}] ${c.name}</h4>
          <p>Trophies: <strong style="color:var(--gold)">${c.trophies||0}</strong> · Members: ${(c.members||[]).length}</p>
          <p>Leader: ${c.leader}</p>
          <button class="btn btn-ghost btn-sm" onclick="Clans.leave()">Leave Clan</button></div>`;
      } else mine.innerHTML='<p class="form-hint">Clan missing — create or join.</p>';
    } else mine.innerHTML='<p class="form-hint">You are not in a clan. Login and create/join one.</p>';
    const top=document.getElementById('clan-top');
    if(top){
      const rows=[...s.clans].sort((a,b)=>(b.trophies||0)-(a.trophies||0)).slice(0,8);
      top.innerHTML=rows.map((c,i)=>`<div class="lb-row"><div class="rank">${i+1}</div>
        <div class="who"><strong>[${c.tag}] ${c.name}</strong><div style="font-size:.72rem;color:var(--muted)">${(c.members||[]).length} members</div></div>
        <div class="score">${c.trophies||0}</div></div>`).join('')||'<p class="form-hint">No clans yet.</p>';
    }
  },
  leave(){
    const u=Store.user(); if(!u||!u.clanId) return;
    const s=this.store();
    const c=s.clans.find(x=>x.id===u.clanId);
    if(c) c.members=(c.members||[]).filter(m=>m!==u.user);
    u.clanId=null; this.save(s); Store.save(Store.data); this.refresh();
  }
};

/* ============================================================
   MULTIPLAYER SCAFFOLD (NetAPI + rooms + ready-check)
   ============================================================ */
const NetAPI = {
  mode:'simulated', // 'simulated' | 'socket'
  socket:null,
  handlers:{},
  connect(url){
    // Production:
    // this.socket=new WebSocket(url);
    // this.socket.onmessage=ev=>{ const msg=JSON.parse(ev.data); (this.handlers[msg.type]||[]).forEach(fn=>fn(msg)); };
    this.mode=url?'socket':'simulated';
    return Promise.resolve({ok:true, mode:this.mode});
  },
  on(type, fn){ (this.handlers[type]=this.handlers[type]||[]).push(fn); },
  send(type, data){
    if(this.mode==='socket' && this.socket) this.socket.send(JSON.stringify({type, data}));
    else {
      // simulate echo/bus for local fake peers
      setTimeout(()=> (this.handlers[type]||[]).forEach(fn=>fn({type, data})), 50);
    }
  }
};

const MP = {
  room:null,
  createRoom(){
    const u=Store.user();
    const code=('ST'+Math.random().toString(36).slice(2,6)).toUpperCase();
    const rivals=Math.max(1, Math.min(3, meta.mpOpponents||3));
    const names=['Courier','Drummer','Priestess'];
    const seats=[{name:u?(u.display||u.user):'You', ready:false, you:true, open:false}];
    for(let i=0;i<rivals;i++) seats.push({name:'— open —', ready:false, you:false, open:true});
    this.room={code, host:u?u.user:'guest', seats, rivals, sealed:false};
    seats.forEach((slot,i)=>{
      if(!slot.open) return;
      setTimeout(()=>{
        if(!this.room || this.room.code!==code || this.room.sealed) return;
        const s=this.room.seats[i];
        if(!s || !s.open) return;
        s.open=false; s.sim=true; s.ready=true; s.name=names[i-1]||('Rival '+i);
        this.renderLobby();
      }, 350+i*550);
    });
    document.getElementById('mp-lobby').style.display='block';
    this.renderLobby();
    AudioFX.ui();
    NetAPI.send('room_create', {code});
  },
  joinRoom(){
    const code=(document.getElementById('mp-code').value||'').trim().toUpperCase();
    if(code.length<4){ alert('Enter a valid code'); return; }
    const u=Store.user();
    const rivals=Math.max(1, Math.min(3, meta.mpOpponents||3));
    const names=['Host','Courier','Drummer'];
    const seats=[{name:u?(u.display||u.user):'You', ready:false, you:true, open:false}];
    for(let i=0;i<rivals;i++){
      seats.push({name:names[i]||('Rival '+(i+1)), ready:true, you:false, sim:true, open:false});
    }
    this.room={code, host:'remote', seats, rivals, sealed:true};
    document.getElementById('mp-lobby').style.display='block';
    this.renderLobby(); AudioFX.ui();
  },
  quickMatch(){
    const st=document.getElementById('mp-net-status');
    if(st) st.textContent='Matchmaking…';
    AudioFX.ui();
    setTimeout(()=>{
      this.createRoom();
      if(!this.room) return;
      const names=['Courier','Drummer','Priestess'];
      this.room.sealed=true;
      this.room.seats.forEach((s,i)=>{
        if(s.you){ s.ready=true; return; }
        s.open=false; s.sim=true; s.ready=true;
        s.name=names[i-1]||('Rival '+i);
      });
      this.renderLobby();
      if(st) st.textContent=`Matched against ${this.room.rivals} · room ${this.room.code}`;
      AudioFX.turn();
    }, 900);
  },
  toggleReady(){
    if(!this.room) return;
    const me=this.room.seats.find(s=>s.you);
    if(me){ me.ready=!me.ready; this.renderLobby(); AudioFX.ui(); }
  },
  startIfReady(){
    if(!this.room) return;
    const filled=this.room.seats.filter(s=>!s.open);
    const rivals=Math.max(1, Math.min(3, this.room.rivals||meta.mpOpponents||1));
    if(filled.length<1+rivals){ alert('Waiting for '+rivals+' opponent'+(rivals>1?'s':'')+'.'); return; }
    if(!filled.every(s=>s.ready)){ alert('Not everyone is ready yet.'); return; }
    const ordered=[...filled.filter(s=>s.you), ...filled.filter(s=>!s.you)].slice(0,4);
    meta.mode='ai';
    meta.aiCount=ordered.filter(s=>!s.you).length;
    const fids=['ashanti','fante','dagbon','ewe'];
    meta.onlineSeats=ordered.map((s,i)=>({
      factionId:fids[i%4],
      isAI:!s.you,
      name:s.you ? s.name : `AI ${FACTIONS[fids[i%4]].name}`,
      difficulty:'normal'
    }));
    meta.picks={};
    meta.onlineSeats.forEach((s,i)=>{ if(!s.isAI) meta.picks[i]=s.factionId; });
    meta.drafts={};
    meta.draftSeat=0;
    meta.draftPick=[];
    showScreen('draft-screen');
    fxBanner('CHOOSE 5 CARDS');
    AudioFX.ui();
  },
  leave(){
    this.room=null;
    document.getElementById('mp-lobby').style.display='none';
    AudioFX.ui();
  },
  renderLobby(){
    if(!this.room) return;
    document.getElementById('mp-room-code').textContent=this.room.code;
    document.getElementById('mp-seats').innerHTML=this.room.seats.map((s,i)=>`
      <div class="lobby-seat ${s.open?'':'filled'}">
        <span>Seat ${i+1}: ${s.name}${s.you?' (you)':''}</span>
        <span style="color:${s.ready?'#6c6':varMuted()}">${s.open?'Open':(s.ready?'Ready':'Not ready')}</span>
      </div>`).join('');
    const me=this.room.seats.find(s=>s.you);
    const btn=document.getElementById('mp-ready-btn');
    if(btn&&me) btn.textContent=me.ready?'Unready':'Ready';
    const st=document.getElementById('mp-net-status');
    if(st) st.textContent='NetAPI: '+NetAPI.mode+' · room '+this.room.code;
  },
  refresh(){
    if(this.room) { document.getElementById('mp-lobby').style.display='block'; this.renderLobby(); }
  }
};
function varMuted(){ return 'var(--muted)'; }


refreshHub();
loadOpts();

// Demo deep-link: ?demo=hub|mode|game|lb|clan|mp|cloud
(function(){
  const q=new URLSearchParams(location.search).get('demo');
  if(!q) return;
  function go(){
    try{
      if(q==='hub'){ showScreen('hub-screen'); }
      else if(q==='mode'){ showScreen('mode-screen'); syncModeUI&&syncModeUI(); }
      else if(q==='lb'){ showScreen('lb-screen'); LB.show('global'); }
      else if(q==='clan'){
        // seed a clan for visual interest
        try{
          const s=Clans.store();
          if(!s.clans.length){
            s.clans=[{id:'c_demo',name:'Golden Stool Guard',tag:'GSG',leader:'demo',members:['demo','kofi'],trophies:420,createdAt:Date.now()},
                     {id:'c_demo2',name:'Harmattan Riders',tag:'HMR',leader:'ama',members:['ama'],trophies:310,createdAt:Date.now()}];
            Clans.save(s);
          }
        }catch(e){}
        showScreen('clan-screen'); Clans.refresh();
      }
      else if(q==='mp'){ showScreen('mp-screen'); MP.createRoom(); }
      else if(q==='cloud'){ showScreen('cloud-screen'); CloudSave.refreshUI(); }
      else if(q==='game' || q==='mid'){
        meta.mode='ai'; meta.aiCount=1; meta.difficulty='normal'; meta.picks={0:'ashanti',1:'fante'};
        const seats=[
          {factionId:'ashanti', isAI:false, name:'You · Ashanti', difficulty:'normal'},
          {factionId:'fante', isAI:true, name:'AI · Fante Coast', difficulty:'normal'}
        ];
        initGame(seats);
        const a=G.seats[0], b=G.seats[1];
        // Place tokens on path for a lively board
        a.tokens[0].pos='track'; a.tokens[0].track=4;
        a.tokens[1].pos='track'; a.tokens[1].track=11;
        a.tokens[2].pos='yard'; a.tokens[2].track=0;
        a.tokens[3].pos='home'; a.tokens[3].home=1;
        b.tokens[0].pos='track'; b.tokens[0].track=16;
        b.tokens[1].pos='track'; b.tokens[1].track=22;
        b.tokens[2].pos='track'; b.tokens[2].track=7;
        b.tokens[3].pos='yard';
        G.dice=[5,3]; G.rawDice=[5,3]; G.spent=[false,false]; G.rolled=true; G.pick=0;
        const d1=document.getElementById('die1'), d2=document.getElementById('die2');
        if(d1) d1.textContent='5'; if(d2) d2.textContent='3';
        const eb=document.getElementById('end-btn'); if(eb) eb.style.display='inline-block';
        log('Ashanti vs Fante — race for the Golden Stool', true);
        log('Rolled 5 and 3. Tap a die, then a glowing token.', true);
        updateAll();
        showScreen('game-screen');
        // force token redraw after layout
        setTimeout(()=>{ updateAll(); fxBanner('DEMO BATTLE'); fxNameplate('YOU · ASHANTI EMPIRE'); }, 200);
      }
    }catch(e){ console.error('demo', e); document.title='demo-err '+e; }
  }
  // wait for fonts/images
  if(document.readyState==='complete') setTimeout(go, 600);
  else window.addEventListener('load', ()=>setTimeout(go, 600));
})();
