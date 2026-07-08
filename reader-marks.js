const DIGEST_MARKS={
  'oil-dollar-iran-hormuz-20260708':[['Brent crude 上涨 2.6% 至每桶 76.12 美元','data'],['美元指数升至 101.18','data'],['inflation tail risk','strong'],['增长放缓加能源价格上行','mark']],
  'yen-boj-fiscal-pressure-20260708':[['10 年期 JGB 收益率触及 2.83%','data'],['财政可信度交易','strong'],['162.8 与 170','data'],['BOJ 加息太慢','mark']],
  'korea-chip-selloff-samsung-20260708':[['营业利润达到 89.4 万亿韩元','data'],['Philadelphia Semiconductor Index 下跌 4.7%','data'],['利润质量','strong'],['cycle discipline','mark']],
  'cxmt-apple-china-memory-20260708':[['全球第四大 DRAM 生产商','strong'],['2028 年的 15%','data'],['供应链选择权','mark'],['Apple 测试不等于正式采购','underline']],
  'eu-steel-ecommerce-china-20260708':[['3 欧元海关税','data'],['1830 万吨免税进口配额','data'],['全球化的低价入口正在被监管重估','strong'],['每单 3 欧元','mark']],
  'china-robot-hands-20260708':[['月产数千套','data'],['teleoperation、wearable sensors、Wuji Glove','mark'],['末端执行器和数据闭环','strong'],['没有可复用数据','underline']],
  'skf-leaderdrive-robot-jv-20260708':[['SKF 持股 60%','data'],['2026 年底前开始运营','data'],['部件分层','strong'],['可靠性、寿命和量产','mark']],
  'multi-robot-agentic-ai-20260708':[['Embodied Collective Intelligence','strong'],['shared world-memory inheritance','mark'],['概念框架','underline'],['6 月 26 日','data']],
  'youtube-worldcup-cazetv-20260708':[['2026 World Cup 全部 104 场比赛','data'],['creator-led broadcast','strong'],['谁来陪看','mark'],['平台重新包装成社区产品','underline']],
  'ap-streaming-week-july8-20260708':[['7 月 6 日至 12 日','data'],['《Backrooms》7 月 7 日进入 premium VOD','strong'],['互联网原生恐怖','mark'],['年龄层分割','underline']],
  'sky-itv-uk-media-20260708':[['16 亿英镑','data'],['2 亿英镑','data'],['本地广告、免费入口和家庭客厅触达','strong'],['资产整合阶段','mark']]
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
