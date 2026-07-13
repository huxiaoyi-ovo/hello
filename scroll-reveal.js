(function(){
  // Normal reading mode. Keep this file as a lightweight cleanup shim so any
  // previously cached scroll-reveal state is removed without changing the
  // frozen ledger layout or the standard <details> expand/collapse behavior.
  function cleanup(){
    document.body.classList.remove('scroll-reveal-enabled');
    document.querySelectorAll('.scroll-reading-marker,.scroll-soft-mask,#scroll-reveal-styles').forEach(function(node){
      if(node && node.parentNode) node.parentNode.removeChild(node);
    });
    document.querySelectorAll('.story-row').forEach(function(card){
      card.classList.remove('reveal-focus','reveal-near');
      ['--story-progress','--reveal-height','--reveal-opacity','--reveal-y','--card-dim','--focus-weight'].forEach(function(name){
        card.style.removeProperty(name);
      });
      const details=card.querySelector('details[data-progress-reveal="1"]');
      if(details){
        details.removeAttribute('data-progress-reveal');
        details.open=false;
      }
      const body=card.querySelector('.brief-body');
      if(body){
        ['max-height','opacity','transform','padding-top'].forEach(function(name){body.style.removeProperty(name);});
      }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',cleanup); else cleanup();
})();
