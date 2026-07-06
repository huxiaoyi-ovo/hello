const DIGEST_MARKS={
  'warsh-fed-independence':[['保持政治独立，并继续追求 2% 通胀目标','strong'],['5 月通胀三年高点','mark'],['2%','data']],
  'ecb-grey-zone':[['欧元区经济对冲击的韧性比过去更强','strong'],['5 月通胀为 3.2%','data'],['grey zone','mark']],
  'gulf-iran-risk':[['美国与伊朗间接谈判没有取得突破','strong'],['Saudi 主指下跌 0.3%','data'],['中东风险已经进入二阶定价','mark']],
  'korea-chip-590b':[['近 6000 亿美元芯片扩张计划','data'],['Samsung 与 SK Hynix 掌握全球 HBM 市场约 80% 份额','strong'],['AI 基建竞争正在从模型能力转入国家级产能组织','mark']],
  'bis-ai-capex-bust':[['AI spending spree 若无法兑现预期回报，可能导致融资突然收缩','strong'],['超过 1 万亿美元','data'],['企业付费转成可计量的回报','mark']],
  'boe-ai-agent-risk':[['AI agents 若用于资产交易或零售支付，可能在速度和规模上放大市场失灵','strong'],['circuit breakers','mark'],['责任链','underline']],
  'unitree-star-approval':[['计划募资 42 亿元人民币，约 6.194 亿美元','data'],['smart robot manufacturing base','mark'],['机器人行业从 demo 叙事进入财务表叙事','strong']],
  'china-factory-robots-ai':[['复杂零件识别、搬运、质检和生产监控','strong'],['纺织和鞋服','mark'],['可部署、可维护、可复制的自动化模块','underline']],
  'brazil-youtube-worldcup':[['免费直播 2026 World Cup 全部 104 场比赛','strong'],['2130 万 simultaneous streams','data'],['入口与语气所有权','mark']],
  'ap-streaming-july6':[['7 月 6 日至 12 日','data'],['Backrooms 将于 7 月 7 日进入 premium video-on-demand','strong'],['跨媒介同周冲突','mark']],
  'xbox-platform-crisis':[['subscription-first 的极限','strong'],['687 亿美元并购','data'],['更保守的利润纪律','mark']]
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