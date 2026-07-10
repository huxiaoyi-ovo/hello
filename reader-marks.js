const DIGEST_MARKS={
  'bond-oil-fed-20260710':[['3.50% 至 3.75%','data'],['10 年期美债收益率升至 4.5% 上方','data'],['资金成本','strong'],['更短的回收周期','mark']],
  'yen-jgb-boj-20260710':[['10 年期 JGB 收益率升至 2.865%','data'],['美元兑日元在 162.46 附近','data'],['财政可信度','strong'],['利差、进口通胀和财政可信度','mark']],
  'memory-chip-selloff-20260710':[['Samsung Electronics 午后最大跌幅达到 7.6%','data'],['SK Hynix 下跌 5.2%','data'],['margin durability','strong'],['产能纪律','mark']],
  'nvidia-h200-china-20260710':[['少于 20 万颗','data'],['高端算力进入配给状态','strong'],['审批、数量和时间差','underline'],['低功耗 inference','mark']],
  'apple-broadcom-rf-20260710':[['超过 300 亿美元','data'],['至少 150 亿颗芯片','data'],['connectivity components','strong'],['长期订单换美国制造确定性','mark']],
  'unitree-ipo-20260710':[['42 亿元人民币','data'],['至少 4045 万股','data'],['manufacturing company 的审计阶段','strong'],['售后成本','mark']],
  'dexterous-hands-20260710':[['约月产 5000 只灵巧手','data'],['teleoperation、wearable sensors 和 Wuji Glove','mark'],['可靠末端执行器','strong'],['高质量触觉数据','underline']],
  'worldcup-country-roads-20260710':[['赛后 30 秒','data'],['可剪辑、可复唱、可参与的情绪资产','strong'],['公共情绪动作','mark'],['不能直接推导球队商业收入或版权收益','underline']],
  'streaming-menu-20260710':[['7 月 6 至 12 日','data'],['《Backrooms》7 月 7 日进入 premium VOD','data'],['互联网原生恐怖','strong'],['多资产组合','mark']],
  'summer-movies-pvod-20260710':[['7 月 7 日 Apple TV 美国购买与租赁榜','data'],['《Obsession (2026)》《The Devil Wears Prada 2》《Citizen Vigilante》位居前三','data'],['不同窗口反复收钱','strong'],['家庭端数字电影','mark']]
};
const USER_READS={};
const USER_ACTIONS={};
(function(){
  function injectStyles(){
    if(document.getElementById('editorial-mark-styles'))return;
    const style=document.createElement('style');
    style.id='editorial-mark-styles';
    style.textContent=`
      .digest-reader.editorial-marks{font-family:var(--serif);font-size:16px;line-height:1.92;color:#241e16;background:linear-gradient(180deg,rgba(255,253,248,.94),rgba(246,239,225,.70));border-left:4px solid var(--gold);border-radius:15px;padding:17px 18px;box-shadow:inset 0 0 0 1px rgba(216,205,185,.58)}
      [data-theme="night"] .digest-reader.editorial-marks{color:#efe7d7;background:rgba(30,27,22,.80);box-shadow:inset 0 0 0 1px rgba(90,79,60,.45)}
      .digest-reader.editorial-marks .digest-lede{font-size:18px;line-height:1.66;font-weight:900;color:#11100e;border-bottom:1px solid rgba(184,129,47,.28);padding-bottom:11px;margin:0 0 12px;letter-spacing:-.012em}
      [data-theme="night"] .digest-reader.editorial-marks .digest-lede{color:#fff3d8}
      .digest-reader.editorial-marks .digest-body p{margin:0 0 .78em}.digest-reader.editorial-marks .digest-body p:last-child{margin-bottom:0}
      .ed-strong{font-weight:880;color:#11100e}.ed-mark{font-weight:780;background:linear-gradient(transparent 66%,rgba(225,185,107,.28) 0);padding:0 .05em}.ed-underline{font-weight:730;text-decoration:underline;text-decoration-color:rgba(88,82,70,.45);text-decoration-thickness:1px;text-underline-offset:.2em}.ed-data{font-family:var(--mono);font-size:.94em;font-weight:780;color:#5e3b14;background:rgba(184,129,47,.10);border:1px solid rgba(184,129,47,.18);border-radius:6px;padding:.01em .22em;white-space:nowrap}
      [data-theme="night"] .ed-strong{color:#fff}[data-theme="night"] .ed-mark{background:linear-gradient(transparent 66%,rgba(225,185,107,.20) 0)}[data-theme="night"] .ed-data{color:#ffe0a4}
    `;
    document.head.appendChild(style);
  }
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
  function cssEscape(s){return String(s).replace(/(["\\])/g,'\\$1');}
  function applyOne(html,phrase,type){
    const safe=esc(phrase);
    if(!html.includes(safe))return html;
    const cls={strong:'ed-strong',mark:'ed-mark',underline:'ed-underline',data:'ed-data'}[type]||'ed-strong';
    return html.replace(safe,`<span class="${cls}">${safe}</span>`);
  }
  function buildDigest(id,text){
    const marks=DIGEST_MARKS[id]||[];
    const m=text.match(/^(.+?[。！？.!?])(.+)$/s);
    const lead=m?m[1]:text.slice(0,90);
    const rest=m?m[2].trim():text.slice(90).trim();
    let leadHtml=esc(lead);
    let bodyHtml=esc(rest);
    marks.forEach(([phrase,type])=>{leadHtml=applyOne(leadHtml,phrase,type);bodyHtml=applyOne(bodyHtml,phrase,type);});
    const paragraphs=bodyHtml.split(/(?<=[。！？])\s*/).filter(Boolean).map(p=>`<p>${p}</p>`).join('');
    return `<div class="digest-reader editorial-marks" data-editorial-marked="1"><p class="digest-lede">${leadHtml}</p><div class="digest-body">${paragraphs}</div></div>`;
  }
  function run(){
    injectStyles();
    if(typeof STORIES==='undefined')return false;
    const feed=document.getElementById('feed');
    if(!feed||!feed.children.length)return false;
    let changed=false;
    STORIES.forEach(function(s){
      const article=document.querySelector(`.story-row[data-id="${cssEscape(s.id)}"]`);
      if(!article)return;
      const panel=article.querySelector('.analysis-panel');
      if(panel){
        const old=panel.querySelector('.digest,.digest-reader:not([data-editorial-marked="1"])');
        if(old){old.outerHTML=buildDigest(s.id,s.digest);changed=true;}
      }
    });
    return changed;
  }
  document.addEventListener('DOMContentLoaded',function(){
    let tries=0;
    const timer=setInterval(function(){tries++; if(run()||tries>30)clearInterval(timer);},150);
    const feed=document.getElementById('feed');
    if(feed&&window.MutationObserver){new MutationObserver(function(){run();}).observe(feed,{childList:true,subtree:true});}
  });
})();
