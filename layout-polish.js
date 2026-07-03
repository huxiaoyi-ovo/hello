/* Layout Polish for DR.Hu Intelligence Desk
   Fixes expansion/collapse choreography, grid reflow, empty-state visibility, and white-board artifacts.
*/
(function(){
  const css = `
  :root{--ease-editorial:cubic-bezier(.2,.8,.2,1);}
  .feed{align-items:start;grid-auto-flow:row dense;transition:opacity .22s var(--ease-editorial);}
  .feed.is-reflowing{opacity:.985;}
  .card{contain:layout paint;will-change:transform,opacity;transform-origin:center top;animation:cardIn .34s var(--ease-editorial) both;}
  @keyframes cardIn{from{opacity:0;transform:translateY(10px) scale(.992)}to{opacity:1;transform:translateY(0) scale(1)}}
  .card[style*="display: none"]{animation:none!important;}
  .card.expanded{grid-column:1/-1;box-shadow:0 28px 80px rgba(25,20,12,.16);border-color:color-mix(in srgb,var(--gold) 55%,var(--hair));}
  .card.expanded .card-inner{padding:18px;}
  .card.expanded h3{font-size:clamp(25px,4.8vw,42px);max-width:960px;}
  .readmore{overflow:hidden;}
  .readmore summary{position:relative;outline:none;}
  .readmore summary:focus-visible{outline:2px solid var(--gold);outline-offset:4px;border-radius:10px;}
  .readmore .brief-body{overflow:hidden;max-height:0;opacity:0;transform:translateY(-6px);transition:max-height .48s var(--ease-editorial),opacity .28s ease,transform .34s var(--ease-editorial);}
  .readmore[open] .brief-body{max-height:3200px;opacity:1;transform:translateY(0);}
  .card.expanded .brief-body{padding-top:2px;}
  .card.expanded .analysis-panel{animation:panelLift .34s var(--ease-editorial) both;}
  .card.expanded .analysis-panel:nth-child(2){animation-delay:.035s}.card.expanded .analysis-panel:nth-child(3){animation-delay:.07s}.card.expanded .analysis-panel:nth-child(4){animation-delay:.105s}
  @keyframes panelLift{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .layout-empty-note{display:none;margin:14px 0;padding:20px;border:1px dashed var(--hair);border-radius:var(--radius);background:color-mix(in srgb,var(--paper2) 70%,transparent);color:var(--muted);text-align:center;}
  .layout-empty-note.show{display:block;}
  .card.ghost-closing{pointer-events:none;}
  .card.ghost-closing .brief-body{opacity:0;transform:translateY(-4px);}
  .bottom-nav{transition:transform .28s var(--ease-editorial),opacity .22s ease;}
  .reading-focus .bottom-nav{opacity:.72;}
  @media(max-width:759px){
    .feed{display:block;}
    .card{margin-bottom:13px;}
    .card.expanded{margin-left:-2px;margin-right:-2px;}
    .card.expanded .card-inner{padding:17px;}
    .readmore[open] .brief-body{max-height:4200px;}
  }
  @media(min-width:760px){
    .card.expanded .brief-body{grid-template-columns:minmax(0,1fr) minmax(0,1fr);}
    .card.expanded .private-view,.card.expanded .action-box{grid-column:1/-1;}
  }
  @media(min-width:1050px){
    .feed:not(.all-expanded) .card.expanded{grid-column:1/-1;}
    .feed.all-expanded{grid-template-columns:1fr;}
    .feed.all-expanded .card{grid-column:1/-1;}
  }
  @media(prefers-reduced-motion:reduce){.card,.analysis-panel,.brief-body,.feed,.bottom-nav{animation:none!important;transition:none!important;}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const feed = $('#feed');
  if(!feed) return;

  let expandingAll = false;
  let reflowTimer = null;
  function visibleCards(){return $$('.card[data-id]').filter(c => c.style.display !== 'none' && getComputedStyle(c).display !== 'none');}
  function reflow(){
    feed.classList.add('is-reflowing');
    clearTimeout(reflowTimer);
    reflowTimer=setTimeout(()=>feed.classList.remove('is-reflowing'),260);
  }
  function syncEmpty(){
    const empty=$('#empty');
    if(!empty) return;
    const any=visibleCards().length>0;
    empty.classList.toggle('show',!any);
  }
  function closeCard(card, fast=false){
    const d=card.querySelector('.readmore');
    if(!d || !d.open) {card.classList.remove('expanded');return;}
    card.classList.add('ghost-closing');
    if(fast){d.open=false;card.classList.remove('expanded','ghost-closing');return;}
    requestAnimationFrame(()=>{
      d.open=false;
      setTimeout(()=>card.classList.remove('expanded','ghost-closing'),180);
    });
  }
  function openCard(card){
    const d=card.querySelector('.readmore');
    if(!d) return;
    if(!expandingAll){
      visibleCards().forEach(other=>{if(other!==card) closeCard(other,true);});
      feed.classList.remove('all-expanded');
    }
    card.classList.add('expanded');
    d.open=true;
    document.body.classList.add('reading-focus');
    reflow();
    setTimeout(()=>{
      const y=card.getBoundingClientRect().top + window.scrollY - 78;
      if(Math.abs(card.getBoundingClientRect().top-78)>120) window.scrollTo({top:y,behavior:'smooth'});
    },80);
  }
  function toggleCard(card){
    const d=card.querySelector('.readmore');
    if(!d) return;
    if(d.open){closeCard(card);setTimeout(()=>{if(!$$('.readmore[open]').length)document.body.classList.remove('reading-focus');},200);}
    else openCard(card);
  }

  // Replace native summary click with controlled full-row expansion.
  $$('.card[data-id]').forEach(card=>{
    const details=card.querySelector('.readmore');
    const summary=details?.querySelector('summary');
    if(!details||!summary) return;
    summary.setAttribute('role','button');
    summary.setAttribute('aria-expanded',details.open?'true':'false');
    summary.addEventListener('click',e=>{e.preventDefault();toggleCard(card);summary.setAttribute('aria-expanded',details.open?'true':'false');});
    details.addEventListener('toggle',()=>{
      card.classList.toggle('expanded',details.open);
      summary.setAttribute('aria-expanded',details.open?'true':'false');
      reflow();
    });
  });

  // Make Expand all layout-safe: all opened cards become one-column full-width modules.
  const expandBtn=$('#expandBtn');
  if(expandBtn){
    expandBtn.addEventListener('click',()=>{
      setTimeout(()=>{
        const open=$$('.readmore[open]');
        expandingAll=open.length>1;
        feed.classList.toggle('all-expanded',open.length>1);
        $$('.card[data-id]').forEach(c=>c.classList.toggle('expanded',!!c.querySelector('.readmore')?.open));
        document.body.classList.toggle('reading-focus',open.length>0);
        reflow();
        setTimeout(()=>{expandingAll=false;},220);
      },0);
    },true);
  }

  // Observe style/display changes from filters and smart sort; close hidden expanded cards to prevent blank holes.
  const observer=new MutationObserver(()=>{
    $$('.card.expanded').forEach(c=>{if(c.style.display==='none'||getComputedStyle(c).display==='none') closeCard(c,true);});
    feed.classList.toggle('all-expanded',$$('.readmore[open]').length>1);
    syncEmpty();
    reflow();
  });
  observer.observe(feed,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class','open']});

  // When filter/search controls are used, keep the layout deterministic.
  ['search','priorityBtn','savedOnly','sortBtn','densityBtn'].forEach(id=>{
    const el=document.getElementById(id); if(!el) return;
    el.addEventListener('input',()=>setTimeout(syncEmpty,0));
    el.addEventListener('click',()=>setTimeout(()=>{syncEmpty();reflow();},0));
  });
  $$('[data-filter]').forEach(el=>el.addEventListener('click',()=>setTimeout(()=>{syncEmpty();reflow();},0)));

  // Prevent residual blank boards after browser back/restore.
  window.addEventListener('pageshow',()=>{syncEmpty();reflow();});
  window.addEventListener('resize',()=>reflow(),{passive:true});
  syncEmpty();
})();
