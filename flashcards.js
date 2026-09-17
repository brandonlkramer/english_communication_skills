// Expects a global DECK = { cats: {key: label}, cards: [{c, ctx, jp, en}] }
let filter="all", queue=[], idx=0, mastered=0, total=0;
const $=id=>document.getElementById(id);
const card=$("card");
const CATS=DECK.cats, CARDS=DECK.cards;

function buildFilters(){
  const wrap=$("filters");
  if(Object.keys(CATS).length<2){wrap.style.display="none";return;}
  const mk=(key,label)=>{const b=document.createElement("button");b.textContent=label;b.dataset.key=key;
    b.setAttribute("aria-pressed",key===filter);b.onclick=()=>{filter=key;start();};return b;};
  wrap.appendChild(mk("all","すべて"));
  for(const k in CATS) wrap.appendChild(mk(k,CATS[k]));
}
function syncFilters(){document.querySelectorAll("#filters button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.key===filter));}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function start(shuffled=false){
  syncFilters();
  queue=CARDS.filter(c=>filter==="all"||c.c===filter);
  if(shuffled) shuffle(queue);
  idx=0;mastered=0;total=queue.length;
  $("done").style.display="none";card.style.display="flex";
  document.querySelector(".actions").style.display="flex";
  document.querySelector(".tools").style.display="flex";
  render();
}
function render(){
  card.classList.remove("revealed");
  if(queue.length===0){finish();return;}
  const c=queue[idx];
  $("context").textContent=CATS[c.c]+" — "+c.ctx;
  $("jp").textContent=c.jp;$("en").textContent=c.en;
  $("counter").textContent=(mastered+1)+" / "+total;
  $("remaining").textContent="残り "+queue.length+" 枚";
  $("bar").style.width=(mastered/total*100)+"%";
}
function reveal(){card.classList.add("revealed");}
function grade(good){
  const c=queue.splice(idx,1)[0];
  if(good){mastered++;}else{queue.push(c);}
  if(queue.length===0){finish();return;}
  if(idx>=queue.length) idx=0;
  render();
}
function finish(){
  card.style.display="none";
  document.querySelector(".actions").style.display="none";
  document.querySelector(".tools").style.display="none";
  $("bar").style.width="100%";$("counter").textContent=total+" / "+total;$("remaining").textContent="";
  $("doneMsg").textContent=total+"枚のフレーズを全部「覚えた」にしました。";
  $("done").style.display="block";
}
card.addEventListener("click",()=>{if(!card.classList.contains("revealed")) reveal();});
card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();reveal();}});
$("showBtn").onclick=reveal;$("againBtn").onclick=()=>grade(false);$("goodBtn").onclick=()=>grade(true);
$("shuffleBtn").onclick=()=>start(true);$("resetBtn").onclick=()=>start(false);$("restartBtn").onclick=()=>start(true);
document.addEventListener("keydown",e=>{
  if(e.target.tagName==="BUTTON") return;
  if(card.style.display==="none") return;
  if(e.key==="1"&&card.classList.contains("revealed")) grade(false);
  if(e.key==="2"&&card.classList.contains("revealed")) grade(true);
});
buildFilters();start(false);
