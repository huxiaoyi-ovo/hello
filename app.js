(function(){
  'use strict';

  const STORE_PREFIX='global-ledger.';
  const CATEGORY_LABELS={all:'全部',economy:'经济/市场',tech:'科技',robotics:'机器人',culture:'文化',entertainment:'娱乐'};

  const $=(sel,root=document)=>root.querySelector(sel);
  const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));

  function esc(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function readJSON(key,fallback){
    try{return JSON.parse(localStorage.getItem(STORE_PREFIX+key)||'')||fallback;}catch(e){return fallback;}
  }

  function writeJSON(key,value){
    try{localStorage.setItem(STORE_PREFIX+key,JSON.stringify(value));}catch(e){}
  }

  const state={
    filter:'all',
    query:'',
    savedOnly:false,
    saved:readJSON('saved',{}),
    read:readJSON('read',{}),
    feedback:readJSON('feedback',{})
  };

  function toast(text){
    const node=$('#toast');
    if(!node)return;
    node.textContent=text;
    node.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer=setTimeout(()=>node.classList.remove('show'),1200);
  }

  function host(url){
    try{return new URL(url).hostname.replace(/^www\./,'');}catch(e){return 'source';}
  }

  function catsOf(story){
    return String(story.cat||'').split(/\s+/).filter(Boolean);
  }

  function metaPills(story){
    const meta=Array.isArray(story.meta)?story.meta:[];
    const cats=catsOf(story).map(c=>CATEGORY_LABELS[c]||c);
    const values=[...meta,...cats].filter(Boolean).slice(0,8);
    return values.map(function(m,i){
      const lower=String(m).toLowerCase();
      const cls=i===1?'source':(/top|high|priority|重要/.test(lower)?'hot':'');
      return `<span class="meta-pill ${cls}">${esc(m)}</span>`;
    }).join('');
  }

  function sourcesHTML(story){
    const sources=Array.isArray(story.sources)?story.sources:[];
    if(!sources.length)return '<p>Source link unavailable in this edition.</p>';
    return `<div class="source-list">${sources.map(function(item){
      const label=Array.isArray(item)?item[0]:'Source';
      const url=Array.isArray(item)?item[1]:'#';
      return `<a class="source-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><span>${esc(label)}</span><span>${esc(host(url))} ↗</span></a>`;
    }).join('')}</div>`;
  }

  function searchText(story){
    return [story.title,story.deck,story.digest,story.view,story.action,story.tags,(story.meta||[]).join(' '),(story.sources||[]).map(s=>Array.isArray(s)?s.join(' '):'').join(' ')]
      .join(' ').toLowerCase().replace(/\s+/g,' ');
  }

  function renderStory(story,index){
    const id=String(story.id||`story-${index}`);
    const saved=!!state.saved[id];
    const read=!!state.read[id];
    const fb=state.feedback[id]||'';
    return `<article class="story-row${read?' read':''}" data-id="${esc(id)}" data-cat="${esc(story.cat||'')}" data-search="${esc(searchText(story))}">
      <div class="story-inner">
        <aside class="story-meta">
          <span class="meta-pill">${String(index+1).padStart(2,'0')}</span>
          ${metaPills(story)}
        </aside>
        <div class="story-main">
          <div class="story-topline">
            <div>
              <h3>${esc(story.title)}</h3>
              <p class="deck">${esc(story.deck)}</p>
            </div>
            <button class="star${saved?' saved':''}" type="button" aria-label="Save story" data-save="${esc(id)}">${saved?'★':'☆'}</button>
          </div>
          <details class="readmore">
            <summary>Read brief / 展开全文</summary>
            <div class="brief-body">
              <section class="analysis-panel">
                <h4>Source brief · original-source digest · evidence boundary</h4>
                <p class="digest">${esc(story.digest)}</p>
              </section>
              <section class="analysis-panel">
                <h4>Source provenance</h4>
                ${sourcesHTML(story)}
              </section>
              <section class="analysis-panel private-view">
                <h4>Private analyst read</h4>
                <p>${esc(story.view)}</p>
              </section>
              <section class="analysis-panel action-box">
                <h4>Actionable next step</h4>
                <p>${esc(story.action)}</p>
              </section>
            </div>
          </details>
          <div class="feedback" data-feedback-row="${esc(id)}">
            <button type="button" data-read="${esc(id)}">${read?'已读':'Mark read'}</button>
            <button type="button" data-feedback="save" data-id="${esc(id)}">${saved?'已收藏':'Save'}</button>
            <button type="button" data-feedback="useful" data-id="${esc(id)}">${fb==='useful'?'Useful ✓':'Useful'}</button>
            <button type="button" data-feedback="skip" data-id="${esc(id)}">${fb==='skip'?'Skip ✓':'Skip'}</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function setRead(id,value){
    state.read[id]=!!value;
    if(!value)delete state.read[id];
    writeJSON('read',state.read);
    const row=document.querySelector(`.story-row[data-id="${CSS.escape(id)}"]`);
    if(row)row.classList.toggle('read',!!value);
  }

  function toggleSaved(id){
    state.saved[id]=!state.saved[id];
    if(!state.saved[id])delete state.saved[id];
    writeJSON('saved',state.saved);
    const row=document.querySelector(`.story-row[data-id="${CSS.escape(id)}"]`);
    if(row){
      const star=$('[data-save]',row);
      if(star){star.classList.toggle('saved',!!state.saved[id]);star.textContent=state.saved[id]?'★':'☆';}
      const saveBtn=$('[data-feedback="save"]',row);
      if(saveBtn)saveBtn.textContent=state.saved[id]?'已收藏':'Save';
    }
    applyFilter();
    toast(state.saved[id]?'已收藏':'已取消收藏');
  }

  function applyFeedback(id,value){
    state.feedback[id]=value;
    writeJSON('feedback',state.feedback);
    const row=document.querySelector(`.story-row[data-id="${CSS.escape(id)}"]`);
    if(row){
      $$('[data-feedback]',row).forEach(function(btn){
        const type=btn.getAttribute('data-feedback');
        if(type==='useful')btn.textContent=value==='useful'?'Useful ✓':'Useful';
        if(type==='skip')btn.textContent=value==='skip'?'Skip ✓':'Skip';
      });
    }
    toast(value==='useful'?'已记录：有用':'已记录：跳过');
  }

  function applyFilter(){
    const rows=$$('.story-row');
    const q=state.query.trim().toLowerCase();
    let shown=0;
    rows.forEach(function(row){
      const cats=String(row.dataset.cat||'').split(/\s+/);
      const id=row.dataset.id;
      const matchCat=state.filter==='all'||cats.includes(state.filter);
      const matchQuery=!q||String(row.dataset.search||'').includes(q);
      const matchSaved=!state.savedOnly||!!state.saved[id];
      const visible=matchCat&&matchQuery&&matchSaved;
      row.style.display=visible?'':'none';
      if(visible)shown++;
    });
    const count=$('#count');
    if(count)count.textContent=`${shown} / ${rows.length} items`;
    const empty=$('#empty');
    if(empty)empty.classList.toggle('show',shown===0);
  }

  function bindControls(){
    const search=$('#search');
    if(search){
      search.addEventListener('input',function(){state.query=search.value||'';applyFilter();});
    }

    $$('[data-filter]').forEach(function(btn){
      btn.addEventListener('click',function(){
        state.filter=btn.getAttribute('data-filter')||'all';
        $$('[data-filter]').forEach(b=>b.classList.toggle('active',b===btn));
        applyFilter();
      });
    });

    const savedOnly=$('#savedOnly');
    if(savedOnly){
      savedOnly.addEventListener('click',function(){
        state.savedOnly=!state.savedOnly;
        savedOnly.classList.toggle('active',state.savedOnly);
        applyFilter();
      });
    }

    const density=$('#densityBtn');
    if(density){
      density.addEventListener('click',function(){
        document.body.classList.toggle('dense');
        density.classList.toggle('active',document.body.classList.contains('dense'));
      });
    }

    const expand=$('#expandBtn');
    if(expand){
      expand.addEventListener('click',function(){
        const willOpen=!$$('details.readmore').every(d=>d.open);
        $$('details.readmore').forEach(function(d){d.open=willOpen; if(willOpen){const row=d.closest('.story-row'); if(row)setRead(row.dataset.id,true);}});
        expand.textContent=willOpen?'Collapse all':'Expand all';
      });
    }

    const themeBtn=$('#themeBtn');
    const savedTheme=localStorage.getItem(STORE_PREFIX+'theme');
    if(savedTheme==='night')document.body.dataset.theme='night';
    if(themeBtn){
      themeBtn.addEventListener('click',function(){
        const night=document.body.dataset.theme!=='night';
        if(night)document.body.dataset.theme='night'; else delete document.body.dataset.theme;
        localStorage.setItem(STORE_PREFIX+'theme',night?'night':'day');
      });
    }

    document.addEventListener('click',function(e){
      const save=e.target.closest('[data-save]');
      if(save){toggleSaved(save.getAttribute('data-save'));return;}
      const read=e.target.closest('[data-read]');
      if(read){const id=read.getAttribute('data-read');setRead(id,!state.read[id]);read.textContent=state.read[id]?'已读':'Mark read';return;}
      const feedback=e.target.closest('[data-feedback]');
      if(feedback){
        const type=feedback.getAttribute('data-feedback');
        const id=feedback.getAttribute('data-id');
        if(type==='save')toggleSaved(id); else applyFeedback(id,type);
      }
    });

    document.addEventListener('toggle',function(e){
      if(e.target&&e.target.matches('details.readmore')&&e.target.open){
        const row=e.target.closest('.story-row');
        if(row)setRead(row.dataset.id,true);
      }
    },true);
  }

  function bindProgress(){
    const bar=$('#progress');
    if(!bar)return;
    const update=function(){
      const doc=document.documentElement;
      const max=Math.max(1,doc.scrollHeight-window.innerHeight);
      bar.style.width=Math.min(100,Math.max(0,window.scrollY/max*100))+'%';
    };
    update();
    window.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update);
  }

  function boot(){
    const feed=$('#feed');
    if(!feed)return;
    if(!Array.isArray(window.STORIES)&&typeof STORIES==='undefined'){
      feed.innerHTML='<div class="empty show">stories.js 未加载。请刷新页面。</div>';
      return;
    }
    const stories=Array.isArray(window.STORIES)?window.STORIES:STORIES;
    feed.innerHTML=stories.map(renderStory).join('');
    bindControls();
    bindProgress();
    applyFilter();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot); else boot();
})();
