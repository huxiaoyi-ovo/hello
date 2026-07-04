(function(){
  const canUse = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!canUse) return;
  function inject(){
    if(document.getElementById('paper-cursor-styles')) return;
    const style=document.createElement('style');
    style.id='paper-cursor-styles';
    style.textContent=`
      html.paper-cursor-ready,html.paper-cursor-ready *{cursor:none!important}
      .paper-cursor-ring,.paper-cursor-dot{position:fixed;left:0;top:0;pointer-events:none;z-index:2147483647;opacity:0;will-change:transform}
      .paper-cursor-ring{width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:999px;border:1px solid rgba(123,47,42,.44);background:radial-gradient(circle,rgba(157,123,79,.12),rgba(255,250,240,.04) 56%,transparent 70%);box-shadow:0 0 0 1px rgba(255,250,240,.18),0 10px 28px rgba(45,33,18,.08);transition:width .18s ease,height .18s ease,margin .18s ease,border-color .18s ease,opacity .22s ease,background .18s ease,transform .04s linear}
      .paper-cursor-dot{width:5px;height:5px;margin:-2.5px 0 0 -2.5px;border-radius:999px;background:#7b2f2a;box-shadow:0 0 12px rgba(123,47,42,.35);transition:opacity .22s ease,background .18s ease,width .16s ease,height .16s ease,margin .16s ease}
      html.paper-cursor-ready .paper-cursor-ring,html.paper-cursor-ready .paper-cursor-dot{opacity:1}
      .paper-cursor-ring.is-hover{width:50px;height:50px;margin:-25px 0 0 -25px;border-color:rgba(157,123,79,.76);background:radial-gradient(circle,rgba(157,123,79,.20),rgba(255,250,240,.08) 58%,transparent 72%)}
      .paper-cursor-ring.is-text{width:18px;height:34px;margin:-17px 0 0 -9px;border-radius:10px;border-color:rgba(38,63,85,.48);background:rgba(38,63,85,.045)}
      .paper-cursor-ring.is-down{width:24px;height:24px;margin:-12px 0 0 -12px;border-color:rgba(123,47,42,.82)}.paper-cursor-dot.is-down{width:8px;height:8px;margin:-4px 0 0 -4px}
      .paper-ripple,.paper-speck{position:fixed;left:0;top:0;pointer-events:none;z-index:2147483646;will-change:transform,opacity}.paper-ripple{width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:999px;border:1px solid rgba(123,47,42,.42);background:rgba(157,123,79,.08);animation:paperRipple .62s cubic-bezier(.2,.8,.2,1) forwards}.paper-speck{width:3px;height:3px;border-radius:1px;background:#9d7b4f;opacity:.72;animation:paperSpeck .72s cubic-bezier(.16,.8,.24,1) forwards}
      @keyframes paperRipple{to{transform:translate3d(var(--x),var(--y),0) scale(8);opacity:0}}
      @keyframes paperSpeck{to{transform:translate3d(var(--dx),var(--dy),0) rotate(var(--rot));opacity:0}}
      [data-theme="night"] .paper-cursor-ring{border-color:rgba(210,140,129,.58);background:radial-gradient(circle,rgba(195,154,98,.16),rgba(32,27,21,.05) 56%,transparent 70%)}
      [data-theme="night"] .paper-cursor-dot{background:#d28c81;box-shadow:0 0 12px rgba(210,140,129,.35)}
      [data-theme="night"] .paper-ripple{border-color:rgba(210,140,129,.48);background:rgba(195,154,98,.08)}[data-theme="night"] .paper-speck{background:#c39a62}
      @media(max-width:760px){html.paper-cursor-ready,html.paper-cursor-ready *{cursor:auto!important}.paper-cursor-ring,.paper-cursor-dot,.paper-ripple,.paper-speck{display:none!important}}
    `;
    document.head.appendChild(style);
  }
  function init(){
    inject();
    const ring=document.createElement('div');ring.className='paper-cursor-ring';
    const dot=document.createElement('div');dot.className='paper-cursor-dot';
    document.body.append(ring,dot);
    document.documentElement.classList.add('paper-cursor-ready');
    let tx=window.innerWidth/2,ty=window.innerHeight/2,rx=tx,ry=ty,dx=tx,dy=ty,lastParticle=0,particleCount=0;
    const hoverSelector='a,button,summary,.chip,.btn,.star,.source-link,.story-row,.analysis-panel,.board,.lead,input';
    const textSelector='p,h1,h2,h3,h4,.deck,.digest,.digest-reader,.td';
    function speck(x,y,strong){
      if(particleCount>28) return;
      particleCount++;
      const el=document.createElement('i');
      el.className='paper-speck';
      const angle=Math.random()*Math.PI*2;
      const dist=(strong?18:9)+Math.random()*(strong?26:12);
      el.style.transform=`translate3d(${x}px,${y}px,0)`;
      el.style.setProperty('--dx',`${Math.cos(angle)*dist}px`);
      el.style.setProperty('--dy',`${Math.sin(angle)*dist}px`);
      el.style.setProperty('--rot',`${Math.round(Math.random()*180-90)}deg`);
      document.body.appendChild(el);
      setTimeout(()=>{el.remove();particleCount=Math.max(0,particleCount-1)},760);
    }
    function ripple(x,y){
      const el=document.createElement('i');
      el.className='paper-ripple';
      el.style.transform=`translate3d(${x}px,${y}px,0) scale(1)`;
      el.style.setProperty('--x','0px');
      el.style.setProperty('--y','0px');
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),680);
    }
    document.addEventListener('pointermove',e=>{
      tx=e.clientX;ty=e.clientY;
      const target=e.target;
      const hovering=target.closest && target.closest(hoverSelector);
      const texting=target.closest && target.closest(textSelector) && !hovering;
      ring.classList.toggle('is-hover',!!hovering);
      ring.classList.toggle('is-text',!!texting);
      const now=performance.now();
      if(now-lastParticle>110 && hovering){lastParticle=now;speck(tx,ty,false)}
    },{passive:true});
    document.addEventListener('pointerdown',e=>{ring.classList.add('is-down');dot.classList.add('is-down');ripple(e.clientX,e.clientY);for(let i=0;i<7;i++)speck(e.clientX,e.clientY,true)},{passive:true});
    document.addEventListener('pointerup',()=>{ring.classList.remove('is-down');dot.classList.remove('is-down')},{passive:true});
    document.addEventListener('pointerleave',()=>{ring.style.opacity='0';dot.style.opacity='0'});
    document.addEventListener('pointerenter',()=>{ring.style.opacity='1';dot.style.opacity='1'});
    function frame(){
      rx+=(tx-rx)*0.18;ry+=(ty-ry)*0.18;
      dx+=(tx-dx)*0.55;dy+=(ty-dy)*0.55;
      ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;
      dot.style.transform=`translate3d(${dx}px,${dy}px,0)`;
      requestAnimationFrame(frame);
    }
    frame();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();