(function(){
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function injectStyles(){
    if(document.getElementById('scroll-reveal-styles')) return;
    const style=document.createElement('style');
    style.id='scroll-reveal-styles';
    style.textContent=`
      body.scroll-reveal-enabled .story-row{--story-progress:0;--reveal-height:0px;--reveal-opacity:0;--reveal-y:10px;--card-dim:1;opacity:var(--card-dim)!important;transition:border-color .36s ease,background .36s ease,box-shadow .36s ease}
      body.scroll-reveal-enabled .story-row.reveal-focus{border-color:rgba(157,123,79,.72)!important;background:rgba(255,252,246,.90)!important;box-shadow:0 10px 22px rgba(50,37,20,.07)!important}
      body.scroll-reveal-enabled .readmore{position:relative;overflow:hidden}
      body.scroll-reveal-enabled .readmore summary{display:flex;align-items:center;gap:9px;color:var(--news-burgundy)!important;user-select:none}
      body.scroll-reveal-enabled .readmore summary::before{content:"";display:inline-block;width:32px;height:1px;background:var(--news-rule);transform-origin:left center;transform:scaleX(var(--story-progress));opacity:calc(.30 + var(--story-progress) * .62)}
      body.scroll-reveal-enabled .readmore summary::after{content:"＋"!important;color:var(--news-rule)!important;opacity:calc(.45 + var(--story-progress) * .45);transform:rotate(calc(var(--story-progress) * 45deg))}
      body.scroll-reveal-enabled .brief-body{display:grid!important;gap:12px!important;max-height:var(--reveal-height)!important;opacity:var(--reveal-opacity)!important;transform:translate3d(0,var(--reveal-y),0)!important;overflow:hidden!important;filter:none!important;padding-top:calc(var(--story-progress) * 12px)!important;transition:none!important;will-change:max-height,opacity,transform}
      body.scroll-reveal-enabled .analysis-panel{opacity:calc(.36 + var(--story-progress) * .64);transform:translate3d(0,calc((1 - var(--story-progress)) * 6px),0);transition:none!important}
      body.scroll-reveal-enabled .story-row .deck{opacity:calc(.78 + var(--story-progress) * .22)}
      body.scroll-reveal-enabled .scroll-reading-marker{position:fixed;right:18px;top:50%;width:2px;height:150px;transform:translateY(-50%);z-index:40;background:linear-gradient(180deg,transparent,var(--news-line),transparent);opacity:.18;pointer-events:none}
      body.scroll-reveal-enabled .scroll-reading-marker::after{content:"";position:absolute;left:-3px;top:50%;width:8px;height:8px;border-radius:999px;background:var(--news-rule);transform:translateY(-50%);box-shadow:0 0 0 4px rgba(157,123,79,.07)}
      @media(max-width:759px){body.scroll-reveal-enabled .scroll-reading-marker{display:none}body.scroll-reveal-enabled .brief-body{gap:10px!important}body.scroll-reveal-enabled .story-row{opacity:1!important}}
      @media(prefers-reduced-motion:reduce){body.scroll-reveal-enabled .scroll-reading-marker{display:none!important}body.scroll-reveal-enabled .brief-body{max-height:none!important;opacity:1!important;transform:none!important;padding-top:12px!important}body.scroll-reveal-enabled .story-row{opacity:1!important}}
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
      if(cards.length){clearInterval(timer);callback(cards)}
      if(tries>60) clearInterval(timer);
    },100);
  }
  function measure(card){
    const body=card.querySelector('.brief-body');
    if(!body) return 0;
    const oldMax=body.style.maxHeight, oldOpacity=body.style.opacity, oldTransform=body.style.transform;
    body.style.maxHeight='none';body.style.opacity='1';body.style.transform='none';
    const h=body.scrollHeight;
    body.style.maxHeight=oldMax;body.style.opacity=oldOpacity;body.style.transform=oldTransform;
    return h;
  }
  function init(cards){
    injectStyles();
    document.body.classList.add('scroll-reveal-enabled');
    if(!document.querySelector('.scroll-reading-marker')){const marker=document.createElement('div');marker.className='scroll-reading-marker';document.body.appendChild(marker);}
    const states=new Map();
    cards.forEach(card=>{
      const details=card.querySelector('details');
      if(details){details.open=true;details.dataset.progressReveal='1';}
      const full=measure(card);
      states.set(card,{current:0,target:0,dim:1,targetDim:1,full});
      card.style.setProperty('--story-progress','0');
      card.style.setProperty('--reveal-height','0px');
      card.style.setProperty('--reveal-opacity','0');
      card.style.setProperty('--reveal-y','10px');
      card.style.setProperty('--card-dim','1');
    });
    let resizeTimer=null;
    let raf=null;
    let active=true;
    function recalcHeights(){
      cards.forEach(card=>{const s=states.get(card); if(s) s.full=measure(card);});
      computeTargets();
    }
    function progressForRect(r,vh){
      const focus=vh*0.50;
      const anchor=r.top+Math.min(r.height*0.30,210);
      const radius=vh*0.72;
      const base=smoothstep(1-Math.abs(anchor-focus)/radius);
      const readTop=vh*0.33, readBottom=vh*0.67;
      const coversReadBand=r.top<readBottom && r.bottom>readTop;
      return coversReadBand?Math.max(base,0.92):base;
    }
    function dimForRect(r,vh,p){
      const visualTop=vh*0.18, visualBottom=vh*0.84;
      if(r.top < visualBottom && r.bottom > visualTop) return 1;
      return Math.max(0.78,0.86+p*0.14);
    }
    function computeTargets(){
      if(prefersReduced) return;
      const vh=window.innerHeight||720;
      const doc=document.documentElement;
      const nearBottom=(window.scrollY+vh) > (doc.scrollHeight-360);
      let best=null,bestProgress=0;
      if(nearBottom){
        let lastVisible=null;
        cards.forEach(card=>{const r=card.getBoundingClientRect(); if(r.bottom>0 && r.top<vh) lastVisible=card;});
        cards.forEach(card=>{
          const r=card.getBoundingClientRect();
          let p=0;
          if(card===lastVisible) p=1;
          else if(r.bottom>vh*.18 && r.top<vh*.86) p=Math.max(0.55,progressForRect(r,vh));
          const s=states.get(card); if(!s) return;
          s.target=p; s.targetDim=dimForRect(r,vh,p);
          if(p>bestProgress){bestProgress=p;best=card;}
        });
      }else{
        cards.forEach(card=>{
          const s=states.get(card); if(!s) return;
          if(card.style.display==='none'){s.target=0;s.targetDim=1;return;}
          const r=card.getBoundingClientRect();
          let p=progressForRect(r,vh);
          if(p<0.02) p=0;
          s.target=p; s.targetDim=dimForRect(r,vh,p);
          if(p>bestProgress){bestProgress=p;best=card;}
        });
      }
      cards.forEach(card=>card.classList.toggle('reveal-focus',card===best && bestProgress>.22));
      startLoop();
    }
    function renderCard(card,s){
      const p=s.current;
      const full=s.full||0;
      const height=Math.max(0,Math.round(full*p));
      const opacity=p<0.035?0:smoothstep((p-0.035)/0.56);
      const y=((1-p)*6).toFixed(2)+'px';
      card.style.setProperty('--story-progress',p.toFixed(4));
      card.style.setProperty('--reveal-height',height+'px');
      card.style.setProperty('--reveal-opacity',opacity.toFixed(4));
      card.style.setProperty('--reveal-y',y);
      card.style.setProperty('--card-dim',s.dim.toFixed(3));
      card.classList.toggle('reveal-near',p>.10);
    }
    function frame(){
      raf=null;
      let moving=false;
      cards.forEach(card=>{
        const s=states.get(card); if(!s) return;
        const dp=s.target-s.current;
        const dd=s.targetDim-s.dim;
        s.current += dp*0.105;
        s.dim += dd*0.12;
        if(Math.abs(dp)<0.002) s.current=s.target; else moving=true;
        if(Math.abs(dd)<0.002) s.dim=s.targetDim; else moving=true;
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
      if(s){s.target=s.current>0.55?0:1;s.targetDim=1;startLoop();setTimeout(computeTargets,480);}
    },true);
    if(prefersReduced){
      cards.forEach(card=>{const details=card.querySelector('details');if(details)details.open=true;card.style.setProperty('--reveal-height','none');card.style.setProperty('--reveal-opacity','1');card.style.setProperty('--reveal-y','0px');card.style.setProperty('--card-dim','1');});
      return;
    }
    setTimeout(recalcHeights,260);
    setTimeout(computeTargets,520);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>waitForStories(init)); else waitForStories(init);
})();