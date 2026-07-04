(function(){
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function injectStyles(){
    if(document.getElementById('scroll-reveal-styles')) return;
    const style=document.createElement('style');
    style.id='scroll-reveal-styles';
    style.textContent=`
      body.scroll-reveal-enabled .story-row{transition:border-color .42s ease,background .42s ease,box-shadow .42s ease,opacity .42s ease,transform .42s cubic-bezier(.2,.8,.2,1)}
      body.scroll-reveal-enabled .story-row.reveal-focus{border-color:var(--news-rule)!important;background:rgba(255,252,246,.92)!important;box-shadow:0 16px 34px rgba(50,37,20,.10)!important}
      body.scroll-reveal-enabled .story-row.reveal-past{opacity:.64}
      body.scroll-reveal-enabled .story-row.reveal-near{opacity:1}
      body.scroll-reveal-enabled .readmore{position:relative}
      body.scroll-reveal-enabled .readmore summary{display:flex;align-items:center;gap:8px;color:var(--news-burgundy)!important}
      body.scroll-reveal-enabled .readmore summary::before{content:"";display:inline-block;width:28px;height:1px;background:var(--news-rule);transform-origin:left center;transform:scaleX(var(--story-progress,0));transition:transform .38s cubic-bezier(.2,.8,.2,1)}
      body.scroll-reveal-enabled .story-row.reveal-focus .readmore summary{color:var(--news-ink)!important}
      body.scroll-reveal-enabled .story-row.reveal-auto-open .readmore summary::after{content:"—"!important;color:var(--news-rule)!important}
      body.scroll-reveal-enabled .brief-body{transition:max-height .72s cubic-bezier(.2,.82,.18,1),opacity .42s ease,transform .52s cubic-bezier(.2,.82,.18,1),filter .52s ease!important;filter:blur(2px)}
      body.scroll-reveal-enabled .readmore[open] .brief-body{filter:blur(0)}
      body.scroll-reveal-enabled .analysis-panel{transition:opacity .54s ease,transform .58s cubic-bezier(.2,.82,.18,1)}
      body.scroll-reveal-enabled .readmore:not([open]) .analysis-panel{opacity:0;transform:translateY(16px)}
      body.scroll-reveal-enabled .readmore[open] .analysis-panel:nth-child(1){transition-delay:.02s}
      body.scroll-reveal-enabled .readmore[open] .analysis-panel:nth-child(2){transition-delay:.08s}
      body.scroll-reveal-enabled .readmore[open] .analysis-panel:nth-child(3){transition-delay:.14s}
      body.scroll-reveal-enabled .readmore[open] .analysis-panel:nth-child(4){transition-delay:.20s}
      .scroll-reading-marker{position:fixed;right:18px;top:50%;width:2px;height:160px;transform:translateY(-50%);z-index:40;background:linear-gradient(180deg,transparent,var(--news-line),transparent);opacity:.32;pointer-events:none}.scroll-reading-marker::after{content:"";position:absolute;left:-3px;top:50%;width:8px;height:8px;border-radius:999px;background:var(--news-rule);transform:translateY(-50%);box-shadow:0 0 0 4px rgba(157,123,79,.10)}
      @media(max-width:759px){.scroll-reading-marker{display:none}body.scroll-reveal-enabled .story-row.reveal-past{opacity:.78}}
      @media(prefers-reduced-motion:reduce){.scroll-reading-marker{display:none!important}body.scroll-reveal-enabled .brief-body,body.scroll-reveal-enabled .story-row,body.scroll-reveal-enabled .analysis-panel{transition:none!important;filter:none!important}}
    `;
    document.head.appendChild(style);
  }
  function waitForStories(callback){
    let tries=0;
    const timer=setInterval(()=>{
      const cards=[...document.querySelectorAll('.story-row')];
      tries++;
      if(cards.length){clearInterval(timer);callback(cards)}
      if(tries>40) clearInterval(timer);
    },100);
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
      card.dataset.scrollAuto='1';
      const details=card.querySelector('details');
      if(details){
        details.addEventListener('toggle',()=>{
          card.classList.toggle('reveal-auto-open',details.open);
        });
      }
    });
    let lastY=window.scrollY;
    let direction='down';
    let ticking=false;
    let lockedUntil=0;
    function openCard(card){
      const details=card.querySelector('details');
      if(!details||details.open) return;
      details.open=true;
      card.classList.add('reveal-auto-open');
    }
    function closeCard(card){
      const details=card.querySelector('details');
      if(!details||!details.open) return;
      details.open=false;
      card.classList.remove('reveal-auto-open');
    }
    function update(){
      ticking=false;
      const y=window.scrollY;
      direction=y>=lastY?'down':'up';
      lastY=y;
      const vh=window.innerHeight||720;
      const focusY=vh*0.48;
      const openBandTop=vh*0.14;
      const openBandBottom=vh*0.78;
      let best=null,bestScore=Infinity;
      cards.forEach(card=>{
        if(card.style.display==='none') return;
        const r=card.getBoundingClientRect();
        const center=r.top+r.height*0.36;
        const score=Math.abs(center-focusY);
        if(score<bestScore&&r.bottom>openBandTop&&r.top<openBandBottom){best=card;bestScore=score;}
      });
      cards.forEach(card=>{
        const r=card.getBoundingClientRect();
        const center=r.top+r.height*.38;
        const distance=Math.abs(center-focusY);
        const progress=Math.max(0,Math.min(1,1-distance/(vh*.54)));
        card.style.setProperty('--story-progress',progress.toFixed(3));
        card.classList.toggle('reveal-focus',card===best);
        card.classList.toggle('reveal-near',progress>.18);
        card.classList.toggle('reveal-past',r.bottom<vh*.22);
      });
      if(Date.now()<lockedUntil) return;
      if(best){
        cards.forEach(card=>{
          if(card===best){openCard(card);return;}
          const r=card.getBoundingClientRect();
          if(direction==='down'){
            if(r.bottom<vh*.28 || r.top>vh*.90) closeCard(card);
          }else{
            if(r.top>vh*.70 || r.bottom<vh*.08) closeCard(card);
          }
        });
      }
    }
    function request(){if(ticking)return;ticking=true;requestAnimationFrame(update)}
    document.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',request,{passive:true});
    document.addEventListener('click',e=>{
      const summary=e.target.closest&&e.target.closest('summary');
      if(summary){lockedUntil=Date.now()+900;setTimeout(request,920)}
    },true);
    if(prefersReduced){
      cards.forEach(card=>card.classList.remove('reveal-past','reveal-near','reveal-focus'));
      return;
    }
    setTimeout(request,220);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>waitForStories(init));
  else waitForStories(init);
})();