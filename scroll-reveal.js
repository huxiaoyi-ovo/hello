(function(){
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function injectStyles(){
    if(document.getElementById('scroll-reveal-styles')) return;
    const style=document.createElement('style');
    style.id='scroll-reveal-styles';
    style.textContent=`
      body.scroll-reveal-enabled .story-row{--story-progress:0;--reveal-height:0px;--reveal-opacity:0;--reveal-y:10px;transition:border-color .36s ease,background .36s ease,box-shadow .36s ease}
      body.scroll-reveal-enabled .story-row.reveal-focus{border-color:rgba(157,123,79,.72)!important;background:rgba(255,252,246,.90)!important;box-shadow:0 10px 22px rgba(50,37,20,.07)!important}
      body.scroll-reveal-enabled .readmore{position:relative;overflow:hidden}
      body.scroll-reveal-enabled .readmore summary{display:flex;align-items:center;gap:9px;color:var(--news-burgundy)!important;user-select:none}
      body.scroll-reveal-enabled .readmore summary::before{content:"";display:inline-block;width:32px;height:1px;background:var(--news-rule);transform-origin:left center;transform:scaleX(var(--story-progress));opacity:.78}
      body.scroll-reveal-enabled .readmore summary::after{content:"＋"!important;color:var(--news-rule)!important;opacity:calc(.45 + var(--story-progress) * .45);transform:rotate(calc(var(--story-progress) * 45deg));transition:transform .18s linear,opacity .18s linear}
      body.scroll-reveal-enabled .brief-body{display:grid!important;gap:12px!important;max-height:var(--reveal-height)!important;opacity:var(--reveal-opacity)!important;transform:translateY(var(--reveal-y))!important;overflow:hidden!important;filter:none!important;padding-top:calc(var(--story-progress) * 12px)!important;transition:none!important;will-change:max-height,opacity,transform}
      body.scroll-reveal-enabled .analysis-panel{opacity:calc(.18 + var(--story-progress) * .82);transform:translateY(calc((1 - var(--story-progress)) * 8px));transition:none!important}
      body.scroll-reveal-enabled .story-row .deck{opacity:calc(.72 + var(--story-progress) * .28);transition:opacity .18s linear}
      body.scroll-reveal-enabled .scroll-reading-marker{position:fixed;right:18px;top:50%;width:2px;height:150px;transform:translateY(-50%);z-index:40;background:linear-gradient(180deg,transparent,var(--news-line),transparent);opacity:.22;pointer-events:none}
      body.scroll-reveal-enabled .scroll-reading-marker::after{content:"";position:absolute;left:-3px;top:50%;width:8px;height:8px;border-radius:999px;background:var(--news-rule);transform:translateY(-50%);box-shadow:0 0 0 4px rgba(157,123,79,.08)}
      @media(max-width:759px){body.scroll-reveal-enabled .scroll-reading-marker{display:none}body.scroll-reveal-enabled .brief-body{gap:10px!important}}
      @media(prefers-reduced-motion:reduce){body.scroll-reveal-enabled .scroll-reading-marker{display:none!important}body.scroll-reveal-enabled .brief-body{max-height:none!important;opacity:1!important;transform:none!important;padding-top:12px!important}}
    `;
    document.head.appendChild(style);
  }
  function smoothstep(x){
    x=Math.max(0,Math.min(1,x));
    return x*x*(3-2*x);
  }
  function waitForStories(callback){
    let tries=0;
    const timer=setInterval(()=>{
      const cards=[...document.querySelectorAll('.story-row')];
      tries++;
      if(cards.length){clearInterval(timer);callback(cards)}
      if(tries>60) clearInterval(timer);
    },100);
  }
  function measure(card){
    const body=card.querySelector('.brief-body');
    if(!body) return 0;
    const oldMax=body.style.maxHeight;
    const oldOpacity=body.style.opacity;
    const oldTransform=body.style.transform;
    body.style.maxHeight='none';
    body.style.opacity='1';
    body.style.transform='none';
    const h=body.scrollHeight;
    body.style.maxHeight=oldMax;
    body.style.opacity=oldOpacity;
    body.style.transform=oldTransform;
    return h;
  }
  function init(cards){
    injectStyles();
    document.body.classList.add('scroll-reveal-enabled');
    if(!document.querySelector('.scroll-reading-marker')){
      const marker=document.createElement('div');
      marker.className='scroll-reading-marker';
      document.body.appendChild(marker);
    }
    cards.forEach(card=>{
      const details=card.querySelector('details');
      if(details){
        details.open=true;
        details.dataset.progressReveal='1';
      }
      card.dataset.fullHeight=String(measure(card));
      card.style.setProperty('--story-progress','0');
      card.style.setProperty('--reveal-height','0px');
      card.style.setProperty('--reveal-opacity','0');
      card.style.setProperty('--reveal-y','10px');
    });
    let ticking=false;
    let resizeTimer=null;
    function recalcHeights(){
      cards.forEach(card=>{card.dataset.fullHeight=String(measure(card));});
      request();
    }
    function update(){
      ticking=false;
      if(prefersReduced) return;
      const vh=window.innerHeight||720;
      const focusY=vh*0.48;
      const openRadius=vh*0.56;
      let best=null,bestProgress=0;
      cards.forEach(card=>{
        if(card.style.display==='none') return;
        const r=card.getBoundingClientRect();
        const center=r.top + Math.min(r.height*0.28,180);
        const raw=1 - Math.abs(center-focusY)/openRadius;
        let p=smoothstep(raw);
        if(r.bottom<vh*0.10 || r.top>vh*0.92) p=0;
        if(p<0.035) p=0;
        if(p>bestProgress){bestProgress=p;best=card;}
        const full=Number(card.dataset.fullHeight||0);
        const height=Math.max(0,Math.round(full*p));
        const opacity=p<0.08?0:smoothstep((p-0.08)/0.72);
        const y=Math.round((1-p)*10);
        card.style.setProperty('--story-progress',p.toFixed(4));
        card.style.setProperty('--reveal-height',height+'px');
        card.style.setProperty('--reveal-opacity',opacity.toFixed(4));
        card.style.setProperty('--reveal-y',y+'px');
        card.classList.toggle('reveal-near',p>.12);
      });
      cards.forEach(card=>card.classList.toggle('reveal-focus',card===best && bestProgress>.16));
    }
    function request(){
      if(ticking) return;
      ticking=true;
      requestAnimationFrame(update);
    }
    document.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',()=>{
      clearTimeout(resizeTimer);
      resizeTimer=setTimeout(recalcHeights,120);
    },{passive:true});
    document.addEventListener('click',e=>{
      const summary=e.target.closest&&e.target.closest('summary');
      if(summary){
        e.preventDefault();
        const card=summary.closest('.story-row');
        if(card){
          const p=Number(getComputedStyle(card).getPropertyValue('--story-progress'))||0;
          card.style.setProperty('--story-progress',p>0.55?'0':'1');
          card.style.setProperty('--reveal-height',(p>0.55?0:Number(card.dataset.fullHeight||measure(card)))+'px');
          card.style.setProperty('--reveal-opacity',p>0.55?'0':'1');
          card.style.setProperty('--reveal-y',p>0.55?'10px':'0px');
          setTimeout(request,350);
        }
      }
    },true);
    if(prefersReduced){
      cards.forEach(card=>{
        const details=card.querySelector('details');
        if(details) details.open=true;
        card.style.setProperty('--reveal-height','none');
        card.style.setProperty('--reveal-opacity','1');
        card.style.setProperty('--reveal-y','0px');
      });
      return;
    }
    setTimeout(recalcHeights,280);
    setTimeout(request,520);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>waitForStories(init));
  else waitForStories(init);
})();