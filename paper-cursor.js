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
      .paper-cursor-ring{width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:999px;border:1px solid rgba(123,47,42,.44);background:radial-gradient(circle,rgba(157,123,79,.12),rgba(255,250,240,.04) 56%,transparent 70%);box-shadow:0 0 0 1px rgba(255,250,240,.18),0 10px 28px rgba(45,33,18,.08);transition:width .18s ease,height .18s ease,margin .18s ease,border-color .18s ease,opacity .22s ease,background .18s ease}
      .paper-cursor-dot{width:5px;height:5px;margin:-2.5px 0 0 -2.5px;border-radius:999px;background:#7b2f2a;box-shadow:0 0 12px rgba(123,47,42,.35);transition:opacity .22s ease,background .18s ease}
      html.paper-cursor-ready .paper-cursor-ring,html.paper-cursor-ready .paper-cursor-dot{opacity:1}
      .paper-cursor-ring.is-hover{width:48px;height:48px;margin:-24px 0 0 -24px;border-color:rgba(157,123,79,.72);background:radial-gradient(circle,rgba(157,123,79,.18),rgba(255,250,240,.08) 58%,transparent 72%)}
      .paper-cursor-ring.is-text{width:18px;height:34px;margin:-17px 0 0 -9px;border-radius:10px;border-color:rgba(38,63,85,.48);background:rgba(38,63,85,.045)}
      [data-theme="night"] .paper-cursor-ring{border-color:rgba(210,140,129,.55);background:radial-gradient(circle,rgba(195,154,98,.16),rgba(32,27,21,.05) 56%,transparent 70%)}
      [data-theme="night"] .paper-cursor-dot{background:#d28c81;box-shadow:0 0 12px rgba(210,140,129,.35)}
      @media(max-width:760px){html.paper-cursor-ready,html.paper-cursor-ready *{cursor:auto!important}.paper-cursor-ring,.paper-cursor-dot{display:none!important}}
    `;
    document.head.appendChild(style);
  }
  function init(){
    inject();
    const ring=document.createElement('div');ring.className='paper-cursor-ring';
    const dot=document.createElement('div');dot.className='paper-cursor-dot';
    document.body.append(ring,dot);
    document.documentElement.classList.add('paper-cursor-ready');
    let tx=window.innerWidth/2,ty=window.innerHeight/2,rx=tx,ry=ty,dx=tx,dy=ty;
    const hoverSelector='a,button,summary,.chip,.btn,.star,.source-link,.story-row,.analysis-panel,.board,.lead,input';
    const textSelector='p,h1,h2,h3,h4,.deck,.digest,.digest-reader,.td';
    document.addEventListener('pointermove',e=>{
      tx=e.clientX;ty=e.clientY;
      const target=e.target;
      const hovering=target.closest && target.closest(hoverSelector);
      const texting=target.closest && target.closest(textSelector) && !hovering;
      ring.classList.toggle('is-hover',!!hovering);
      ring.classList.toggle('is-text',!!texting);
    },{passive:true});
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