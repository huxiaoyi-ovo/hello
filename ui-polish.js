(function(){
  const finePointer = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  function injectStyles(){
    if(document.getElementById('ui-polish-styles')) return;
    const style=document.createElement('style');
    style.id='ui-polish-styles';
    style.textContent=`
      :root{--cursor-x:50vw;--cursor-y:12vh;--glass-a:rgba(255,253,248,.58);--glass-b:rgba(255,255,255,.22);--glass-line:rgba(255,255,255,.62);--dock-active-x:0px;--dock-active-w:76px;--dock-light-x:50%;--dock-light-y:50%}
      [data-theme="night"]{--glass-a:rgba(32,29,24,.58);--glass-b:rgba(255,255,255,.06);--glass-line:rgba(255,255,255,.15)}
      body.ui-polished::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(520px circle at var(--cursor-x) var(--cursor-y),rgba(225,185,107,.18),rgba(255,255,255,.06) 22%,transparent 58%);mix-blend-mode:multiply;transition:opacity .35s ease}
      [data-theme="night"] body.ui-polished::before{mix-blend-mode:screen;background:radial-gradient(520px circle at var(--cursor-x) var(--cursor-y),rgba(225,185,107,.12),rgba(138,180,248,.07) 26%,transparent 60%)}
      .page{position:relative;z-index:1}.lead,.analysis-panel,.board,.story-row,.controls{position:relative;isolation:isolate;overflow:hidden}.lead::before,.analysis-panel::before,.board::before,.story-row::before,.controls::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:-1;background:radial-gradient(520px circle at var(--local-x,50%) var(--local-y,0%),rgba(255,255,255,.58),transparent 44%);opacity:0;transition:opacity .32s ease}.lead:hover::before,.analysis-panel:hover::before,.board:hover::before,.story-row:hover::before,.controls:hover::before{opacity:.62}
      .lead,.board,.analysis-panel{backdrop-filter:blur(22px) saturate(1.22);-webkit-backdrop-filter:blur(22px) saturate(1.22)}
      .story-row{border-radius:24px;margin:8px 0;padding:0 12px;border:1px solid transparent}.story-row:hover{background:linear-gradient(135deg,var(--glass-a),var(--glass-b));border-color:rgba(216,205,185,.56);box-shadow:0 24px 70px rgba(25,20,12,.10),inset 0 1px 0 var(--glass-line);transform:translateY(-1px)}
      .story-row,.analysis-panel,.board,.lead,.btn,.chip,.star,.source-link{transition:transform .28s cubic-bezier(.2,.8,.2,1),box-shadow .28s ease,border-color .28s ease,background .28s ease,opacity .24s ease,color .24s ease}
      .btn:hover,.chip:hover,.star:hover,.source-link:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(25,20,12,.08)}.btn:active,.chip:active,.star:active,.source-link:active{transform:translateY(0) scale(.98)}
      .readmore summary{transition:color .22s ease,letter-spacing .22s ease}.readmore summary:hover{color:var(--gold);letter-spacing:.025em}.readmore[open] summary{color:var(--gold)}
      .bottom-nav{height:56px;align-items:center;padding:7px 8px!important;border-radius:999px!important;background:linear-gradient(135deg,rgba(255,253,248,.74),rgba(255,255,255,.34))!important;border:1px solid rgba(255,255,255,.58)!important;box-shadow:0 24px 80px rgba(25,20,12,.18),inset 0 1px 0 rgba(255,255,255,.78)!important;backdrop-filter:blur(26px) saturate(1.65)!important;-webkit-backdrop-filter:blur(26px) saturate(1.65)!important;overflow:hidden;transform:translateX(-50%) translateY(0) scale(1);transition:transform .42s cubic-bezier(.2,.8,.2,1),opacity .26s ease,box-shadow .28s ease}
      [data-theme="night"] .bottom-nav{background:linear-gradient(135deg,rgba(28,25,21,.76),rgba(255,255,255,.07))!important;border-color:rgba(255,255,255,.12)!important;box-shadow:0 24px 80px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.12)!important}
      .bottom-nav::before{content:"";position:absolute;inset:-40%;background:radial-gradient(160px circle at var(--dock-light-x) var(--dock-light-y),rgba(255,255,255,.78),transparent 42%),linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);opacity:.56;pointer-events:none;transition:opacity .3s ease}.bottom-nav::after{content:"";position:absolute;left:var(--dock-active-x);top:7px;width:var(--dock-active-w);height:42px;border-radius:999px;background:linear-gradient(135deg,rgba(21,21,20,.92),rgba(21,21,20,.78));box-shadow:0 10px 30px rgba(25,20,12,.20),inset 0 1px 0 rgba(255,255,255,.14);transition:left .34s cubic-bezier(.2,.8,.2,1),width .34s cubic-bezier(.2,.8,.2,1),background .24s ease;z-index:0}[data-theme="night"] .bottom-nav::after{background:linear-gradient(135deg,rgba(244,239,228,.96),rgba(225,185,107,.84))}
      .bottom-nav a{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;min-width:68px;height:42px;border-radius:999px;color:var(--muted)!important;font-weight:720;letter-spacing:.015em;transition:color .25s ease,transform .25s cubic-bezier(.2,.8,.2,1),opacity .25s ease}.bottom-nav a:hover{transform:translateY(-1px)}.bottom-nav a.active{color:var(--paper)!important}[data-theme="night"] .bottom-nav a.active{color:#151514!important}.bottom-nav.dock-hidden{opacity:.12;transform:translateX(-50%) translateY(24px) scale(.96)}.bottom-nav.dock-hidden:hover{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}
      .cursor-orb,.cursor-dot{position:fixed;left:0;top:0;pointer-events:none;z-index:9999;opacity:0;will-change:transform}.cursor-orb{width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:999px;border:1px solid rgba(184,129,47,.32);background:radial-gradient(circle,rgba(225,185,107,.20),rgba(255,255,255,.03) 58%,transparent);backdrop-filter:blur(4px);transition:opacity .25s ease,width .18s ease,height .18s ease,margin .18s ease}.cursor-dot{width:5px;height:5px;margin:-2.5px 0 0 -2.5px;border-radius:999px;background:var(--gold);box-shadow:0 0 18px rgba(184,129,47,.55)}.cursor-orb.cursor-hot{width:52px;height:52px;margin:-26px 0 0 -26px;border-color:rgba(184,129,47,.46);background:radial-gradient(circle,rgba(225,185,107,.28),rgba(255,255,255,.05) 58%,transparent)}.ui-cursor-on .cursor-orb,.ui-cursor-on .cursor-dot{opacity:1}
      .dock-ripple{position:absolute;border-radius:999px;pointer-events:none;transform:translate(-50%,-50%) scale(0);background:rgba(255,255,255,.54);animation:dockRipple .62s ease-out forwards;z-index:1}@keyframes dockRipple{to{transform:translate(-50%,-50%) scale(10);opacity:0}}
      @media(max-width:759px){.bottom-nav{height:58px}.bottom-nav a{min-width:64px;font-size:12px}.story-row{padding:0 2px;border-radius:18px}.story-row:hover{transform:none}}
      @media(prefers-reduced-motion:reduce){.cursor-orb,.cursor-dot{display:none!important}.bottom-nav,.story-row,.analysis-panel,.board,.lead,.btn,.chip,.star,.source-link{transition:none!important}.dock-ripple{display:none!important}}
    `;
    document.head.appendChild(style);
    document.body.classList.add('ui-polished');
  }
  function createCursor(){
    if(!finePointer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.body.classList.add('ui-cursor-on');
    const orb=document.createElement('div');orb.className='cursor-orb';
    const dot=document.createElement('div');dot.className='cursor-dot';
    document.body.append(orb,dot);
    let tx=innerWidth/2,ty=innerHeight/2,ox=tx,oy=ty,dx=tx,dy=ty;
    const hotSelector='a,button,summary,input,.story-row,.analysis-panel,.board,.lead';
    document.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;document.documentElement.style.setProperty('--cursor-x',tx+'px');document.documentElement.style.setProperty('--cursor-y',ty+'px');const hot=e.target.closest&&e.target.closest(hotSelector);orb.classList.toggle('cursor-hot',!!hot);},{passive:true});
    function tick(){ox+=(tx-ox)*0.16;oy+=(ty-oy)*0.16;dx+=(tx-dx)*0.48;dy+=(ty-dy)*0.48;orb.style.transform=`translate3d(${ox}px,${oy}px,0)`;dot.style.transform=`translate3d(${dx}px,${dy}px,0)`;requestAnimationFrame(tick)}tick();
  }
  function localLight(){
    if(!finePointer) return;
    document.addEventListener('pointermove',e=>{
      const el=e.target.closest&&e.target.closest('.lead,.analysis-panel,.board,.story-row,.controls,.bottom-nav');
      if(!el) return;
      const r=el.getBoundingClientRect();
      el.style.setProperty('--local-x',((e.clientX-r.left)/r.width*100).toFixed(2)+'%');
      el.style.setProperty('--local-y',((e.clientY-r.top)/r.height*100).toFixed(2)+'%');
      if(el.classList.contains('bottom-nav')){el.style.setProperty('--dock-light-x',((e.clientX-r.left)/r.width*100).toFixed(2)+'%');el.style.setProperty('--dock-light-y',((e.clientY-r.top)/r.height*100).toFixed(2)+'%')}
    },{passive:true});
  }
  function polishDock(){
    const dock=document.querySelector('.bottom-nav');
    if(!dock) return;
    const links=[...dock.querySelectorAll('a')];
    if(!links.length) return;
    links.forEach(a=>{a.innerHTML=`<span>${a.textContent.trim()}</span>`;a.setAttribute('aria-label',a.textContent.trim())});
    function setActive(link){
      if(!link) return;
      links.forEach(a=>a.classList.toggle('active',a===link));
      const r=link.getBoundingClientRect(),dr=dock.getBoundingClientRect();
      dock.style.setProperty('--dock-active-x',Math.max(7,r.left-dr.left)+'px');
      dock.style.setProperty('--dock-active-w',r.width+'px');
    }
    links.forEach(link=>{
      link.addEventListener('click',e=>{
        const id=link.getAttribute('href');
        if(!id || !id.startsWith('#')) return;
        const target=document.querySelector(id);
        if(!target) return;
        e.preventDefault();
        setActive(link);
        const ripple=document.createElement('span');ripple.className='dock-ripple';
        const r=dock.getBoundingClientRect();ripple.style.left=(e.clientX-r.left)+'px';ripple.style.top=(e.clientY-r.top)+'px';ripple.style.width=ripple.style.height='18px';dock.appendChild(ripple);setTimeout(()=>ripple.remove(),700);
        window.scrollTo({top:target.getBoundingClientRect().top+scrollY-72,behavior:'smooth'});
      });
    });
    const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{
        const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(!visible) return;
        const link=links.find(a=>a.getAttribute('href')==='#'+visible.target.id);
        if(link) setActive(link);
      },{rootMargin:'-22% 0px -58% 0px',threshold:[0,.2,.5,1]});
      sections.forEach(s=>observer.observe(s));
    }
    let last=scrollY;
    window.addEventListener('scroll',()=>{
      const y=scrollY,down=y>last+8,up=y<last-8,nearTop=y<120,nearBottom=innerHeight+y>document.documentElement.scrollHeight-120;
      if(down&&!nearTop&&!nearBottom)dock.classList.add('dock-hidden');
      if(up||nearTop||nearBottom)dock.classList.remove('dock-hidden');
      last=y;
    },{passive:true});
    setTimeout(()=>setActive(links[0]),60);
    addEventListener('resize',()=>{const active=dock.querySelector('a.active')||links[0];setActive(active)},{passive:true});
  }
  function surfaceEntrance(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els=[...document.querySelectorAll('.lead,.section-head,.story-row,.board')];
    els.forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(14px)';el.style.transition='opacity .52s ease, transform .52s cubic-bezier(.2,.8,.2,1)';el.style.transitionDelay=Math.min(i*28,220)+'ms'});
    const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';io.unobserve(e.target)}})},{threshold:.08});
    els.forEach(el=>io.observe(el));
  }
  function openStatePolish(){
    document.addEventListener('toggle',e=>{
      const d=e.target;
      if(!(d instanceof HTMLDetailsElement)) return;
      const card=d.closest('.story-row');
      if(card) card.classList.toggle('story-open',d.open);
    },true);
  }
  function init(){injectStyles();createCursor();localLight();polishDock();surfaceEntrance();openStatePolish()}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();