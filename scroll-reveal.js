(function(){
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function injectStyles(){
    if(document.getElementById('scroll-reveal-styles')) return;
    const style=document.createElement('style');
    style.id='scroll-reveal-styles';
    style.textContent=`
      body.scroll-reveal-enabled .story-row{--story-progress:0;--reveal-height:0px;--reveal-opacity:0;--reveal-y:10px;--card-dim:1;--focus-weight:0;opacity:var(--card-dim)!important;transition:border-color .72s cubic-bezier(.2,.8,.2,1),background .72s cubic-bezier(.2,.8,.2,1),box-shadow .72s cubic-bezier(.2,.8,.2,1),opacity .42s ease}
      body.scroll-reveal-enabled .story-row.reveal-focus{border-color:rgba(157,123,79,.56)!important;background:rgba(255,252,246,.86)!important;box-shadow:0 calc(4px + var(--focus-weight) * 12px) calc(14px + var(--focus-weight) * 18px) rgba(50,37,20,calc(.035 + var(--focus-weight) * .055))!important}
      body.scroll-reveal-enabled .readmore{position:relative;overflow:hidden}
      body.scroll-reveal-enabled .readmore summary{display:flex;align-items:center;gap:9px;color:var(--news-burgundy)!important;user-select:none}
      body.scroll-reveal-enabled .readmore summary::before{content:"";display:inline-block;width:32px;height:1px;background:var(--news-rule);transform-origin:left center;transform:scaleX(var(--story-progress));opacity:calc(.24 + var(--story-progress) * .62)}
      body.scroll-reveal-enabled .readmore summary::after{content:"＋"!important;color:var(--news-rule)!important;opacity:calc(.40 + var(--story-progress) * .46);transform:rotate(calc(var(--story-progress) * 45deg));transition:opacity .3s ease,transform .3s ease}
      body.scroll-reveal-enabled .brief-body{display:grid!important;gap:12px!important;max-height:var(--reveal-height)!important;opacity:var(--reveal-opacity)!important;transform:translate3d(0,var(--reveal-y),0)!important;overflow:hidden!important;filter:none!important;padding-top:calc(var(--story-progress) * 12px)!important;transition:none!important;will-change:max-height,opacity,transform}
      body.scroll-reveal-enabled .analysis-panel{opacity:calc(.30 + var(--story-progress) * .70);transform:translate3d(0,calc((1 - var(--story-progress)) * 7px),0);transition:none!important}
      body.scroll-reveal-enabled .story-row .deck{opacity:calc(.76 + var(--story-progress) * .24)}
      body.scroll-reveal-enabled .scroll-reading-marker{position:fixed;right:18px;top:50%;width:2px;height:150px;transform:translateY(-50%);z-index:40;background:linear-gradient(180deg,transparent,var(--news-line),transparent);opacity:.16;pointer-events:none}
      body.scroll-reveal-enabled .scroll-reading-marker::after{content:"";position:absolute;left:-3px;top:50%;width:8px;height:8px;border-radius:999px;background:var(--news-rule);transform:translateY(-50%);box-shadow:0 0 0 4px rgba(157,123,79,.07)}
      body.scroll-reveal-enabled .scroll-soft-mask{position:fixed;left:0;right:0;top:0;height:74px;z-index:38;pointer-events:none;opacity:.26;background:linear-gradient(180deg,var(--news-paper),rgba(243,234,216,0))}
      body.scroll-reveal-enabled .scroll-soft-mask.bottom{top:auto;bottom:0;height:124px;opacity:.20;background:linear-gradient(0deg,var(--news-paper),rgba(243,234,216,0))}
      body.scroll-reveal-enabled #briefs,body.scroll-reveal-enabled #matrix,body.scroll-reveal-enabled .hero{position:relative}
      body.scroll-reveal-enabled #briefs::before,body.scroll-reveal-enabled #matrix::before{content:"";position:absolute;left:-18px;right:-18px;top:-34px;height:82px;pointer-events:none;background:linear-gradient(180deg,rgba(243,234,216,0),rgba(243,234,216,.58) 45%,rgba(243,234,216,0));z-index:-1}
      body.scroll-reveal-enabled #matrix{margin-top:46px}
      [data-theme="night"] body.scroll-reveal-enabled .scroll-soft-mask{background:linear-gradient(180deg,var(--news-paper),rgba(22,19,15,0));opacity:.22}
      [data-theme="night"] body.scroll-reveal-enabled .scroll-soft-mask.bottom{background:linear-gradient(0deg,var(--news-paper),rgba(22,19,15,0));opacity:.18}
      [data-theme="night"] body.scroll-reveal-enabled #briefs::before,[data-theme="night"] body.scroll-reveal-enabled #matrix::before{background:linear-gradient(180deg,rgba(22,19,15,0),rgba(22,19,15,.52) 45%,rgba(22,19,15,0))}
      @media(max-width:759px){body.scroll-reveal-enabled .scroll-reading-marker{display:none}body.scroll-reveal-enabled .scroll-soft-mask{height:56px;opacity:.18}body.scroll-reveal-enabled .scroll-soft-mask.bottom{height:92px;opacity:.14}body.scroll-reveal-enabled .brief-body{gap:10px!important}body.scroll-reveal-enabled .story-row{opacity:1!important}body.scroll-reveal-enabled #briefs::before,body.scroll-reveal-enabled #matrix::before{left:-12px;right:-12px;height:64px;top:-24px}}
      @media(prefers-reduced-motion:reduce){body.scroll-reveal-enabled .scroll-reading-marker,body.scroll-reveal-enabled .scroll-soft-mask{display:none!important}body.scroll-reveal-enabled .brief-body{max-height:none!important;opacity:1!important;transform:none!important;padding-top:12px!important}body.scroll-reveal-enabled .story-row{opacity:1!important}}
    `;
    document.head.appendChild(style);
  }

  function clamp(x){return Math.max(0,Math.min(1,x));}
  function smoothstep(x){x=clamp(x);return x*x*(3-2*x);}

  function waitForStories(callback){
    let tries=0;
    const timer=setInterval(()=>{
      const cards=[...document.querySelectorAll('.story-row')];
      tries++;
      if(cards.length){clearInterval(timer);callback(cards);}
      if(tries>60) clearInterval(timer);
    },100);
  }

  function measure(card){
    const body=card.querySelector('.brief-body');
    if(!body) return 0;
    const oldMax=body.style.maxHeight, oldOpacity=body.style.opacity, oldTransform=body.style.transform, oldPadding=body.style.paddingTop;
    body.style.maxHeight='none';
    body.style.opacity='1';
    body.style.transform='none';
    body.style.paddingTop='12px';
    const h=body.scrollHeight;
    body.style.maxHeight=oldMax;
    body.style.opacity=oldOpacity;
    body.style.transform=oldTransform;
    body.style.paddingTop=oldPadding;
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
    if(!document.querySelector('.scroll-soft-mask')){
      const top=document.createElement('div');
      top.className='scroll-soft-mask';
      const bottom=document.createElement('div');
      bottom.className='scroll-soft-mask bottom';
      document.body.appendChild(top);
      document.body.appendChild(bottom);
    }

    const states=new Map();
    cards.forEach(card=>{
      const details=card.querySelector('details');
      if(details){details.open=true;details.dataset.progressReveal='1';}
      const full=measure(card);
      states.set(card,{current:0,target:0,dim:1,targetDim:1,focus:0,targetFocus:0,full});
      card.style.setProperty('--story-progress','0');
      card.style.setProperty('--reveal-height','0px');
      card.style.setProperty('--reveal-opacity','0');
      card.style.setProperty('--reveal-y','10px');
      card.style.setProperty('--card-dim','1');
      card.style.setProperty('--focus-weight','0');
    });

    let resizeTimer=null;
    let raf=null;
    let lastY=window.scrollY||0;

    function recalcHeights(){
      cards.forEach(card=>{const s=states.get(card); if(s) s.full=measure(card);});
      computeTargets();
    }

    function progressForRect(r,vh){
      const anchor=r.top+Math.min(r.height*0.30,220);
      const focus=vh*0.48;
      const radius=vh*0.96;
      const proximity=smoothstep(1-Math.abs(anchor-focus)/radius);
      const readTop=vh*0.24, readBottom=vh*0.74;
      const overlap=Math.max(0,Math.min(r.bottom,readBottom)-Math.max(r.top,readTop));
      const span=Math.max(1,Math.min(r.height,readBottom-readTop));
      const band=smoothstep(overlap/span);
      const entering=smoothstep((vh*0.96-r.top)/(vh*0.52));
      const leaving=1-smoothstep((vh*0.07-r.bottom)/(vh*0.46));
      let p=(proximity*0.68+band*0.36)*entering*leaving;
      if(r.top<vh*0.88 && r.bottom>vh*0.10) p=Math.max(p,0.055);
      return p<0.018?0:clamp(p);
    }

    function dimForRect(r,vh,p){
      const visualTop=vh*0.14, visualBottom=vh*0.88;
      if(r.top<visualBottom && r.bottom>visualTop) return 1;
      return Math.max(0.82,0.90+p*0.10);
    }

    function computeTargets(){
      if(prefersReduced) return;
      const vh=window.innerHeight||720;
      const doc=document.documentElement;
      const nearBottom=(window.scrollY+vh)>(doc.scrollHeight-360);
      let best=null,bestProgress=0;
      cards.forEach(card=>{
        const s=states.get(card); if(!s) return;
        if(card.style.display==='none'){
          s.target=0;s.targetDim=1;s.targetFocus=0;
          return;
        }
        const r=card.getBoundingClientRect();
        let p=progressForRect(r,vh);
        if(nearBottom && r.bottom>0 && r.top<vh) p=Math.max(p,0.24);
        if(nearBottom && r.bottom<vh*0.92 && r.top>0) p=Math.max(p,0.72);
        s.target=clamp(p);
        s.targetDim=dimForRect(r,vh,p);
        s.targetFocus=s.target>0.16?smoothstep((s.target-0.16)/0.56):0;
        if(s.target>bestProgress){bestProgress=s.target;best=card;}
      });
      cards.forEach(card=>card.classList.toggle('reveal-focus',card===best && bestProgress>.20));
      startLoop();
    }

    function renderCard(card,s){
      const p=s.current;
      const full=s.full||0;
      const height=Math.max(0,Math.round(full*p));
      const opacity=p<0.025?0:smoothstep((p-0.025)/0.54);
      const y=((1-p)*7).toFixed(2)+'px';
      card.style.setProperty('--story-progress',p.toFixed(4));
      card.style.setProperty('--reveal-height',height+'px');
      card.style.setProperty('--reveal-opacity',opacity.toFixed(4));
      card.style.setProperty('--reveal-y',y);
      card.style.setProperty('--card-dim',s.dim.toFixed(3));
      card.style.setProperty('--focus-weight',s.focus.toFixed(3));
      card.classList.toggle('reveal-near',p>.10);
    }

    function frame(){
      raf=null;
      let moving=false;
      const y=window.scrollY||0;
      const velocity=Math.min(1,Math.abs(y-lastY)/360);
      lastY=y;
      cards.forEach(card=>{
        const s=states.get(card); if(!s) return;
        const dp=s.target-s.current;
        const dd=s.targetDim-s.dim;
        const df=s.targetFocus-s.focus;
        const openSpeed=0.070+velocity*0.030;
        const closeSpeed=0.038+velocity*0.018;
        const dimSpeed=0.080+velocity*0.025;
        const focusSpeed=0.090+velocity*0.020;
        s.current += dp*(dp>=0?openSpeed:closeSpeed);
        s.dim += dd*dimSpeed;
        s.focus += df*focusSpeed;
        if(Math.abs(dp)<0.0025) s.current=s.target; else moving=true;
        if(Math.abs(dd)<0.0025) s.dim=s.targetDim; else moving=true;
        if(Math.abs(df)<0.0025) s.focus=s.targetFocus; else moving=true;
        renderCard(card,s);
      });
      if(moving) raf=requestAnimationFrame(frame);
    }

    function startLoop(){if(!raf) raf=requestAnimationFrame(frame);}
    function onScroll(){computeTargets();}

    document.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(recalcHeights,120);},{passive:true});
    document.addEventListener('click',e=>{
      const summary=e.target.closest&&e.target.closest('summary');
      if(!summary) return;
      e.preventDefault();
      const card=summary.closest('.story-row');
      const s=card&&states.get(card);
      if(s){
        const open=s.current<=0.55;
        s.target=open?1:0;
        s.targetDim=1;
        s.targetFocus=open?1:0;
        startLoop();
        setTimeout(computeTargets,620);
      }
    },true);

    if(prefersReduced){
      cards.forEach(card=>{
        const details=card.querySelector('details');
        if(details)details.open=true;
        card.style.setProperty('--reveal-height','none');
        card.style.setProperty('--reveal-opacity','1');
        card.style.setProperty('--reveal-y','0px');
        card.style.setProperty('--card-dim','1');
        card.style.setProperty('--focus-weight','0');
      });
      return;
    }

    setTimeout(recalcHeights,260);
    setTimeout(computeTargets,520);
    setTimeout(recalcHeights,900);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>waitForStories(init)); else waitForStories(init);
})();
