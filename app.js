'use strict';
const THEMES=['Pureté','Pensées','Tentations','Discipline','Prière','Sanctification','Maîtrise de soi'];
const JQ=['Qu’est-ce que la Parole de Dieu m’a appris aujourd’hui ?','Quelle vérité dois-je retenir ?','Quelle tentation dois-je apprendre à fuir ?','Quelle action concrète vais-je entreprendre ?','Pour qui dois-je prier ?','Quel sujet dois-je reprendre demain ?'];
const SEED=[
['Matthieu 4:1-11','Tentations','Résister comme Jésus, par la Parole, face au tentateur.'],
['Psaume 119:9','Pureté','Garder sa voie pure en se conformant à la Parole.'],
['Psaume 119:11','Pureté','Mettre la Parole en réserve dans le cœur pour ne pas pécher.'],
['1 Thessaloniciens 4:3-8','Sanctification','Comprendre que la volonté de Dieu est notre sanctification.'],
['Job 31:1','Pensées','Veiller sur son regard par une décision prise devant Dieu.'],
['Proverbes 6:27-28','Tentations','Mesurer les conséquences réelles de jouer avec le péché.'],
['Marc 9:42-47','Tentations','Prendre le péché au sérieux et agir avec radicalité.'],
['Éphésiens 5:3-7','Pureté','Vivre comme des saints : pas de place pour l’impureté.'],
['2 Timothée 2:22','Tentations','Fuir les passions et poursuivre justice, foi, amour, paix.'],
['Matthieu 5:8','Pureté','Désirer un cœur pur pour voir Dieu.'],
['1 Corinthiens 6:18-20','Pureté','Honorer Dieu dans son corps, temple de l’Esprit.'],
['1 Pierre 1:14-16','Sanctification','Être saint parce que Dieu est saint.'],
['2 Corinthiens 7:1','Sanctification','Se purifier et achever sa sanctification dans la crainte de Dieu.'],
['Psaume 101:3','Pureté','Refuser ce qui est mauvais devant ses yeux.'],
['Romains 12:1-2','Pensées','Être transformé par le renouvellement de l’intelligence.'],
['Philippiens 4:8','Pensées','Orienter ses pensées vers ce qui est vrai et pur.'],
['2 Corinthiens 10:4-5','Pensées','Amener toute pensée captive à l’obéissance du Christ.'],
['Proverbes 4:23','Pensées','Garder son cœur, source de la vie.'],
['Jacques 1:14-15','Tentations','Comprendre comment le désir enfante le péché.'],
['1 Corinthiens 10:13','Tentations','Se rappeler que Dieu fournit une issue dans l’épreuve.'],
['Galates 5:16','Maîtrise de soi','Marcher par l’Esprit plutôt que par la chair.'],
['Galates 5:22-23','Maîtrise de soi','Reconnaître la maîtrise de soi comme fruit de l’Esprit.'],
['1 Corinthiens 9:24-27','Discipline','S’entraîner avec constance et discipline.'],
['Romains 13:14','Tentations','Revêtir Christ et ne pas pourvoir aux désirs de la chair.'],
['Matthieu 26:41','Prière','Veiller et prier pour ne pas tomber en tentation.'],
['Psaume 51:10-12','Prière','Demander à Dieu un cœur pur et un esprit renouvelé.'],
['Hébreux 4:15-16','Prière','S’approcher du trône de la grâce avec assurance.'],
['1 Jean 1:9','Prière','Confesser ses péchés et recevoir le pardon et la purification.'],
['Jacques 5:16','Prière','Confesser et prier les uns pour les autres.'],
['Jean 17:17','Sanctification','Être sanctifié par la vérité de la Parole.'],
['Colossiens 3:1-5','Sanctification','Chercher les choses d’en haut et faire mourir ce qui est terrestre.'],
['Éphésiens 6:10-18','Discipline','Revêtir l’armure de Dieu pour tenir ferme.'],
['Psaume 119:105','Discipline','Laisser la Parole éclairer chaque pas.'],
['Josué 1:8','Discipline','Méditer la Parole jour et nuit.'],
['Psaume 1:2','Discipline','Trouver son plaisir dans la loi de l’Éternel.'],
['2 Timothée 1:7','Maîtrise de soi','Recevoir un esprit de force, d’amour et de sagesse.'],
['1 Pierre 5:8','Tentations','Rester sobre et vigilant face à l’adversaire.'],
['Jacques 4:7','Tentations','Se soumettre à Dieu et résister au diable.'],
['Proverbes 25:28','Maîtrise de soi','Comprendre la valeur de la maîtrise de soi.'],
['Tite 2:11-12','Sanctification','Laisser la grâce nous enseigner à renoncer à l’impiété.']];
const pad=n=>String(n).padStart(2,'0');
const fmt=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=()=>fmt(new Date());
const addDays=(s,n)=>{const[y,m,d]=s.split('-').map(Number);return fmt(new Date(y,m-1,d+n));};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

class Verse{
 constructor(o){Object.assign(this,{id:'',ref:'',theme:'Pureté',goal:'',text:'',status:'todo',fav:false,last:null,due:null,level:0,notes:'',applic:'',custom:false},o);}
 get memorized(){return this.status==='memorized';}
 isDue(t=today()){return !!this.due&&this.due<=t;}
}
class ReviewScheduler{
 static INTERVALS=[0,1,3,7,14,30];
 static apply(v,r,t=today()){
  if(r==='done'){v.level=Math.min(v.level+1,5);v.status='memorized';}
  else if(r==='almost'){v.status='learning';}
  else{v.level=0;v.status='learning';}
  v.last=t;v.due=addDays(t,r==='again'?0:ReviewScheduler.INTERVALS[v.level]);
 }
}
class ProgressTracker{
 static stats(vs,t=today()){const total=vs.length,m=vs.filter(v=>v.memorized).length;
  return{total,memorized:m,remaining:total-m,pct:total?Math.round(m/total*100):0,due:vs.filter(v=>v.isDue(t)).length};}
}
class VerseLibrary{
 constructor(vs){this.vs=vs;}
 get(id){return this.vs.find(v=>v.id===id);}
 filter(theme='Tous',q='',prio=[]){
  const k=q.trim().toLowerCase();
  return this.vs.filter(v=>(theme==='Tous'||v.theme===theme)&&(!k||[v.ref,v.theme,v.goal,v.text].join(' ').toLowerCase().includes(k)))
   .map((v,i)=>[v,i]).sort((a,b)=>(prio.includes(b[0].theme)-prio.includes(a[0].theme))||a[1]-b[1]).map(x=>x[0]);
 }
 add(ref,theme,text){
  ref=(ref||'').trim();if(!ref)throw new Error('La référence est obligatoire.');
  if(!THEMES.includes(theme))throw new Error('Choisis un thème valide.');
  if(this.vs.some(v=>v.ref.toLowerCase()===ref.toLowerCase()))throw new Error('Cette référence existe déjà.');
  const v=new Verse({id:'c'+Date.now(),ref,theme,text:(text||'').trim(),custom:true,goal:'Passage ajouté par moi.'});this.vs.push(v);return v;
 }
}
class DailyDiscipline{
 static ITEMS=['Lecture et méditation bibliques','Prière personnelle','Mémorisation d’un verset','Mise en pratique concrète de la Parole','Examen de conscience le soir','Prière pour la pureté et la victoire sur la tentation'];
 constructor(d){this.d=d;}
 has(l,t=today()){return(this.d.log[t]||[]).includes(l);}
 toggle(l,t=today()){const a=this.d.log[t]||[];this.d.log[t]=a.includes(l)?a.filter(x=>x!==l):[...a,l];}
 streak(t=today()){let d=(this.d.log[t]||[]).length?t:addDays(t,-1),n=0;while((this.d.log[d]||[]).length){n++;d=addDays(d,-1);}return n;}
 history(n=7,t=today()){return Array.from({length:n},(_,i)=>{const d=addDays(t,-i);return[d,(this.d.log[d]||[]).length];});}
}
class StorageManager{
 static KEY='pietas_v1';
 static defaults(){return{v:1,verses:SEED.map((s,i)=>new Verse({id:'s'+i,ref:s[0],theme:s[1],goal:s[2]})),daily:{items:[...DailyDiscipline.ITEMS],log:{}},journal:[],settings:{theme:'dark',priority:[],diag:false}};}
 static validate(d){
  if(!d||typeof d!=='object'||!Array.isArray(d.verses))throw new Error('Fichier invalide : liste de versets absente.');
  const seen=new Set();
  const verses=d.verses.map((o,i)=>{
   if(!o||typeof o.ref!=='string'||!o.ref.trim())throw new Error('Fichier invalide : verset n°'+(i+1)+' sans référence.');
   const v=new Verse(o);if(!v.id||seen.has(v.id))v.id='i'+i+'_'+Date.now();seen.add(v.id);
   if(!THEMES.includes(v.theme))v.theme='Pureté';v.level=Math.max(0,Math.min(5,+v.level||0));return v;});
  const df=StorageManager.defaults();
  const daily=d.daily&&Array.isArray(d.daily.items)&&d.daily.log&&typeof d.daily.log==='object'?d.daily:df.daily;
  return{v:1,verses,daily,journal:Array.isArray(d.journal)?d.journal:[],settings:Object.assign(df.settings,d.settings||{})};
 }
 static load(){try{const r=localStorage.getItem(StorageManager.KEY);return r?StorageManager.validate(JSON.parse(r)):StorageManager.defaults();}catch(e){return null;}}
 static save(st){try{localStorage.setItem(StorageManager.KEY,JSON.stringify(st));}catch(e){throw new Error('Sauvegarde impossible : stockage plein ou bloqué (navigation privée ?).');}}
}
function selfTest(){
 const r=[],ok=(n,c)=>r.push([n,!!c]);
 const v=new Verse({ref:'T'});ReviewScheduler.apply(v,'done','2026-01-01');ok('Mémorisé → révision le lendemain',v.due==='2026-01-02'&&v.memorized);
 ReviewScheduler.apply(v,'again','2026-01-01');ok('À revoir → échéance le jour même',v.due==='2026-01-01'&&v.level===0);
 const w=new Verse({ref:'X'});for(let i=0;i<6;i++)ReviewScheduler.apply(w,'done','2026-01-01');ok('Niveau max → 30 jours',w.level===5&&w.due==='2026-01-31');
 ok('Calcul de date (fin de mois)',addDays('2026-01-31',1)==='2026-02-01');
 ok('Progression 50 %',ProgressTracker.stats([new Verse({ref:'a',status:'memorized'}),new Verse({ref:'b'})]).pct===50);
 let bad=false;try{StorageManager.validate({verses:[{}]});}catch(e){bad=true;}ok('Import invalide refusé',bad);
 ok('Import valide accepté',StorageManager.validate(JSON.parse(JSON.stringify(StorageManager.defaults()))).verses.length===SEED.length);
 const t=today();ok('Série de 2 jours',new DailyDiscipline({items:['a'],log:{[t]:['a'],[addDays(t,-1)]:['a']}}).streak()===2);
 const L=new VerseLibrary(StorageManager.defaults().verses);ok('Filtre par thème',L.filter('Prière').every(x=>x.theme==='Prière')&&L.filter('Prière').length>0);
 ok('Recherche par mot-clé',L.filter('Tous','jacques').length>=2);
 return r;
}
class App{
 constructor(){
  this.errors=[];this.locked=false;this.tab='home';this.filter='Tous';this.q='';this.ses=null;this.timer=null;
  let st=StorageManager.load();if(!st){st=StorageManager.defaults();this.locked=true;}
  this.st=st;this.applyTheme();
  document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(t)this.act(t.dataset.act,t.dataset);});
  document.addEventListener('input',e=>this.onInput(e.target));
  document.addEventListener('change',e=>{if(e.target.id==='imp')this.importFile(e.target.files[0]);});
  window.addEventListener('error',e=>this.log(e.message));window.addEventListener('unhandledrejection',e=>this.log(String(e.reason)));
  this.render();
  if(this.locked)this.toast('Données illisibles : rien n’est écrasé. Restaure une sauvegarde dans Paramètres.',6000);
  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(e=>this.log('Mode hors ligne indisponible : '+e.message)));
 }
 get lib(){return new VerseLibrary(this.st.verses);}
 get daily(){return new DailyDiscipline(this.st.daily);}
 log(m){this.errors.push(new Date().toLocaleTimeString()+' '+String(m).slice(0,160));this.errors=this.errors.slice(-30);}
 save(){if(this.locked){this.toast('Sauvegarde bloquée : données illisibles. Va dans Paramètres.');return false;}
  try{StorageManager.save(this.st);return true;}catch(e){this.log(e.message);this.toast(e.message,5000);return false;}}
 toast(m,ms=2500){const t=document.getElementById('toast');t.textContent=m;t.hidden=false;clearTimeout(this.tt);this.tt=setTimeout(()=>t.hidden=true,ms);}
 applyTheme(){document.documentElement.dataset.theme=this.st.settings.theme;}
 render(){
  const tabs=[['home','Accueil','🏠'],['verses','Versets','📖'],['reviews','Révisions','🔁'],['journal','Journal','✍️'],['settings','Paramètres','⚙️']];
  document.getElementById('nav').innerHTML=tabs.map(t=>`<button data-act="tab" data-t="${t[0]}" class="${this.tab===t[0]?'on':''}"><span>${t[2]}</span>${t[1]}</button>`).join('');
  document.getElementById('view').innerHTML=this[this.tab]();
  if(this.ses)this.renderSession();
 }
 home(){
  const s=ProgressTracker.stats(this.st.verses),d=this.daily,t=today();
  return`<h1>Entraînement à la Piété</h1><p class="ref">1 Timothée 4:7</p>
  <div class="card"><b style="font-size:30px;color:var(--gold)">${s.pct} %</b> <span class="mut">de progression</span><div class="bar"><i style="width:${s.pct}%"></i></div>
  <div class="grid"><div><b>${s.total}</b>passages</div><div><b>${s.memorized}</b>mémorisés</div><div><b>${s.remaining}</b>à apprendre</div></div>
  <p class="mut">${s.due} révision(s) à faire aujourd’hui</p><button class="p" data-act="cont">Continuer mon entraînement</button></div>
  <div class="card"><h2>Ma discipline quotidienne</h2><p class="mut">Ces disciplines sont une réponse à la grâce de Dieu, pas un moyen de mériter le salut.</p>
  ${this.st.daily.items.map((l,i)=>`<div class="chk"><button data-act="tick" data-i="${i}" class="${d.has(l)?'p':''}">${d.has(l)?'✓ ':'○ '}${esc(l)}</button><button class="s" data-act="rmItem" data-i="${i}" aria-label="Retirer">✕</button></div>`).join('')}
  <input id="newItem" placeholder="Ajouter une discipline" maxlength="80"><button class="s" data-act="addItem">Ajouter</button>
  <p>🔥 Série : <b>${d.streak()}</b> jour(s)</p>
  ${d.history(7).map(h=>`<div class="item"><span>${h[0]}</span><span class="${h[1]?'done':'mut'}">${h[1]}/${this.st.daily.items.length}</span></div>`).join('')}</div>`;
 }
 verses(){
  return`<h1>Versets</h1><input id="q" type="search" placeholder="Référence, mot-clé ou thème" value="${esc(this.q)}">
  <div class="chips">${['Tous',...THEMES].map(t=>`<button data-act="filter" data-t="${esc(t)}" class="${this.filter===t?'on':''}">${t}</button>`).join('')}</div><div id="list">${this.listHtml()}</div>`;
 }
 listHtml(){
  const l=this.lib.filter(this.filter,this.q,this.st.settings.priority);
  if(!l.length)return'<p class="mut">Aucun passage trouvé.</p>';
  return l.map(v=>`<div class="item" data-act="open" data-id="${v.id}"><div><b>${v.fav?'★ ':''}${esc(v.ref)}</b><div class="tag">${esc(v.theme)} · ${v.memorized?'mémorisé':v.status==='learning'?'en cours':'à apprendre'}</div></div><span>›</span></div>`).join('');
 }
 reviews(){
  const due=this.st.verses.filter(v=>v.isDue());
  return`<h1>Révisions</h1><div class="card"><p>${due.length} passage(s) à réviser.</p>
  <button class="p" data-act="quiz" ${due.length?'':'disabled'}>Réviser les passages dus</button><button data-act="quizAll">Quiz libre (au hasard)</button>
  <p class="mut">Intervalles : jour même, 1, 3, 7, 14, puis 30 jours.</p></div>
  ${due.map(v=>`<div class="item" data-act="open" data-id="${v.id}"><b>${esc(v.ref)}</b><span class="tag">dû le ${v.due}</span></div>`).join('')}`;
 }
 journal(){
  const t=today();
  return`<h1>Journal spirituel</h1><div class="card">${JQ.map((q,i)=>`<label>${q}</label><textarea id="j${i}"></textarea>`).join('')}<button class="p" data-act="saveJ">Enregistrer l’entrée du ${t}</button></div>
  ${[...this.st.journal].reverse().map(e=>`<div class="card"><h2>${esc(e.date)}</h2>${e.a.map((a,i)=>a?`<p class="mut">${JQ[i]}</p><p>${esc(a)}</p>`:'').join('')}</div>`).join('')}`;
 }
 settings(){
  const s=this.st.settings;
  return`<h1>Paramètres</h1>
  <div class="card"><h2>Thème</h2><button data-act="theme">${s.theme==='dark'?'Passer au thème clair':'Passer au thème sombre'}</button>
  <h2>Thèmes prioritaires</h2><div class="chips">${THEMES.map(t=>`<button data-act="prio" data-t="${t}" class="${s.priority.includes(t)?'on':''}">${t}</button>`).join('')}</div></div>
  <div class="card"><h2>Ajouter un passage</h2><input id="nr" placeholder="Référence (ex. Psaume 23:1)" maxlength="60"><select id="nt">${THEMES.map(t=>`<option>${t}</option>`).join('')}</select>
  <textarea id="nx" placeholder="Texte (ta traduction, facultatif)"></textarea><button class="p" data-act="addVerse">Ajouter</button></div>
  <div class="card"><h2>Mes données</h2><p class="mut">Tout est enregistré sur cet appareil uniquement.</p>
  <button data-act="export">Exporter (JSON)</button><button data-act="importBtn">Restaurer une sauvegarde</button><input id="imp" type="file" accept=".json,application/json" hidden>
  <button data-act="reset">Réinitialiser…</button></div>
  <div class="card"><h2>Diagnostic</h2><button data-act="diag">${s.diag?'Désactiver':'Activer'} le panneau</button>
  ${s.diag?`<button data-act="test">Lancer les auto-tests</button><pre id="diag">${esc(this.errors.join('\n')||'Aucune erreur.')}</pre>`:''}</div>`;
 }
 onInput(el){
  if(el.id==='q'){this.q=el.value;document.getElementById('list').innerHTML=this.listHtml();return;}
  if(el.dataset.f){const v=this.lib.get(el.dataset.id);if(!v)return;v[el.dataset.f]=el.value;clearTimeout(this.timer);this.timer=setTimeout(()=>this.save(),400);}
 }
 modal(h){const m=document.getElementById('modal');m.innerHTML=`<div class="box">${h}</div>`;m.hidden=false;}
 close(){document.getElementById('modal').hidden=true;this.ses=null;this.render();}
 detail(id){
  const v=this.lib.get(id);if(!v)return;
  this.modal(`<button class="s" data-act="close">‹ Retour</button><h1>${esc(v.ref)}</h1><p class="ref">${esc(v.theme)}</p>
  <div class="card"><h2>Objectif spirituel</h2>${esc(v.goal)}</div>
  <label>Texte biblique (ta traduction — rien n’est préenregistré)</label><textarea data-f="text" data-id="${v.id}" placeholder="Colle ici le texte de ta Bible">${esc(v.text)}</textarea>
  <button data-act="fav" data-id="${v.id}">${v.fav?'★ Retirer des favoris':'☆ Ajouter à mes favoris'}</button>
  <button data-act="mem" data-id="${v.id}">${v.memorized?'Marquer à revoir':'Marquer comme mémorisé'}</button>
  <button class="p" data-act="learn" data-id="${v.id}">Réviser</button>
  <label>Notes personnelles</label><textarea data-f="notes" data-id="${v.id}">${esc(v.notes)}</textarea>
  <label>Application pratique aujourd’hui</label><textarea data-f="applic" data-id="${v.id}">${esc(v.applic)}</textarea>
  <p class="mut">Sauvegarde automatique.</p>`);
 }
 renderSession(){
  const s=this.ses,v=this.lib.get(s.id);if(!v){this.ses=null;return;}
  const noText=!v.text.trim(),T=`<div class="card big">${noText?'<span class="mut">Aucun texte enregistré. Ouvre la fiche pour coller ta traduction.</span>':esc(v.text).replace(/\n/g,'<br>')}</div>`;
  const rate=`<button data-act="rate" data-r="again">À revoir</button><button data-act="rate" data-r="almost">Presque maîtrisé</button><button class="p" data-act="rate" data-r="done">Mémorisé</button>`;
  let h=`<button class="s" data-act="close">✕ Quitter</button><h1>${esc(v.ref)}</h1>`;
  if(s.mode==='learn'){
   const st=['1. Lire le passage','2. Observer les mots et idées clés','3. Texte masqué','4. Réciter de mémoire','5. Réafficher le texte','6. S’autoévaluer'];
   h+=`<p class="ref">${st[s.step]}</p>`;
   if(s.step<2||s.step===4)h+=T+(s.step===1?'<p class="mut">Repère les mots répétés, les verbes, les promesses.</p>':'');
   else if(s.step<4)h+=`<div class="card big mut">${s.step===2?'Le texte est masqué. Redis-le dans ta tête.':'Récite à voix haute. L’application ne peut pas vérifier ta récitation : c’est toi qui juges.'}</div>`;
   else h+='';
   if(s.step===5)h+=T+rate;
   else h+=`${s.step?'<button data-act="prev">‹ Précédent</button>':''}<button class="p" data-act="next">Suivant ›</button>`;
  }else{
   h+=`<p class="mut">Quiz ${s.i+1}/${s.q.length}</p>`+(s.shown?T+rate:`<div class="card big mut">Récite le passage de mémoire.</div><button class="p" data-act="show">Afficher le texte</button>`);
  }
  this.modal(h);
 }
 start(mode,ids){const q=ids.slice();this.ses=mode==='learn'?{mode,id:q[0],step:0}:{mode,q,i:0,id:q[0],shown:false};this.renderSession();}
 act(a,d){
  const v=d.id?this.lib.get(d.id):null,s=this.ses;
  try{switch(a){
   case'tab':this.tab=d.t;this.render();break;
   case'filter':this.filter=d.t;this.render();break;
   case'open':this.detail(d.id);break;
   case'close':this.close();break;
   case'fav':v.fav=!v.fav;this.save();this.detail(v.id);break;
   case'mem':v.status=v.memorized?'learning':'memorized';if(v.memorized&&!v.last){v.last=today();v.due=addDays(today(),1);}this.save();this.detail(v.id);break;
   case'learn':this.start('learn',[d.id]);break;
   case'next':s.step++;this.renderSession();break;
   case'prev':s.step--;this.renderSession();break;
   case'show':s.shown=true;this.renderSession();break;
   case'rate':{const vv=this.lib.get(s.id);ReviewScheduler.apply(vv,d.r);this.save();
    if(s.mode==='quiz'&&s.i+1<s.q.length){s.i++;s.id=s.q[s.i];s.shown=false;this.renderSession();}else{this.toast('Résultat enregistré.');this.close();}break;}
   case'cont':{const due=this.st.verses.filter(x=>x.isDue());
    if(due.length)this.start('quiz',due.map(x=>x.id));
    else{const n=this.lib.filter('Tous','',this.st.settings.priority).find(x=>!x.memorized);n?this.start('learn',[n.id]):this.toast('Tous les passages sont mémorisés !');}break;}
   case'quiz':this.start('quiz',this.st.verses.filter(x=>x.isDue()).map(x=>x.id));break;
   case'quizAll':{const a=[...this.st.verses].sort(()=>Math.random()-.5).slice(0,5);this.start('quiz',a.map(x=>x.id));break;}
   case'tick':this.daily.toggle(this.st.daily.items[d.i]);this.save();this.render();break;
   case'addItem':{const el=document.getElementById('newItem'),t=el.value.trim();
    if(!t)throw new Error('Écris le nom de la discipline.');if(this.st.daily.items.includes(t))throw new Error('Cette discipline existe déjà.');
    this.st.daily.items.push(t);this.save();this.render();break;}
   case'rmItem':if(confirm('Retirer cette discipline de la liste ? L’historique est conservé.')){this.st.daily.items.splice(d.i,1);this.save();this.render();}break;
   case'saveJ':{const a=JQ.map((_,i)=>document.getElementById('j'+i).value.trim());
    if(!a.some(Boolean))throw new Error('Réponds à au moins une question.');
    this.st.journal.push({date:today(),a});if(this.save())this.toast('Entrée enregistrée.');this.render();break;}
   case'theme':this.st.settings.theme=this.st.settings.theme==='dark'?'light':'dark';this.save();this.applyTheme();this.render();break;
   case'prio':{const p=this.st.settings.priority;this.st.settings.priority=p.includes(d.t)?p.filter(x=>x!==d.t):[...p,d.t];this.save();this.render();break;}
   case'addVerse':{this.lib.add(document.getElementById('nr').value,document.getElementById('nt').value,document.getElementById('nx').value);
    if(this.save())this.toast('Passage ajouté.');this.render();break;}
   case'export':{const b=new Blob([JSON.stringify(this.st,null,1)],{type:'application/json'}),u=URL.createObjectURL(b),l=document.createElement('a');
    l.href=u;l.download='entrainement-piete-'+today()+'.json';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);break;}
   case'importBtn':document.getElementById('imp').click();break;
   case'reset':if(confirm('Effacer TOUTES tes données ? Pense à exporter avant. Cette action est définitive.')){this.st=StorageManager.defaults();this.locked=false;this.save();this.applyTheme();this.render();this.toast('Données réinitialisées.');}break;
   case'diag':this.st.settings.diag=!this.st.settings.diag;this.save();this.render();break;
   case'test':{const r=selfTest();this.errors.push(...r.map(x=>(x[1]?'OK  ':'ÉCHEC ')+x[0]));this.render();break;}
  }}catch(e){this.log(e.message);this.toast(e.message,4000);}
 }
 async importFile(f){
  if(!f)return;
  try{const d=StorageManager.validate(JSON.parse(await f.text()));
   if(!confirm('Remplacer les données actuelles par cette sauvegarde ('+d.verses.length+' passages) ?'))return;
   this.st=d;this.locked=false;this.save();this.applyTheme();this.render();this.toast('Sauvegarde restaurée.');
  }catch(e){this.log(e.message);this.toast(e instanceof SyntaxError?'Fichier illisible (JSON invalide).':e.message,5000);}
 }
}
if(typeof document!=='undefined')window.app=new App();
if(typeof module!=='undefined')module.exports={selfTest,StorageManager,Verse};
