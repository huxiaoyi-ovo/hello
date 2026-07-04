const DIGEST_MARKS={
  'dollar-fed-window':[
    ['美国 6 月就业增长明显放缓','strong'],
    ['9 月加息概率压到约 45%','data'],
    ['汇率是最干净的风险温度计','mark']
  ],
  'reuters-week-ahead-warsh':[
    ['接下来一周并不缺宏观变量','strong'],
    ['Fed minutes、油价、NATO 和欧洲工业','mark'],
    ['市场短线宁愿相信软着陆','underline']
  ],
  'korea-chip-wealth-divide':[
    ['把韩国 AI 芯片热潮从股价胜利写成社会分配问题','strong'],
    ['近百万家小企业关闭','data'],
    ['AI 基建红利会沿着供应链和股权结构集中','mark']
  ],
  'korea-576b-chip-drive':[
    ['约 5760 亿美元 AI 与半导体投资战略','data'],
    ['芯片、能源、封装、数据中心和机器人会被一起规划','mark'],
    ['AI 产业不只发生在云端','strong']
  ],
  'guardian-chipmakers-rally':[
    ['韩国 Kospi 今年上涨 123%','data'],
    ['利润先流向上游硬件','strong'],
    ['先买“铲子”，谨慎对待高投入的软件回报故事','mark']
  ],
  'gemini-meta-compute-rationing':[
    ['Google 因算力需求超过供给，限制 Meta 使用 Gemini AI models','strong'],
    ['Google Cloud 一季度营收达到 200 亿美元','data'],
    ['谁能稳定拿到 compute，谁就能维持产品迭代节奏','mark']
  ],
  'unitree-star-ipo':[
    ['计划募资 42 亿元人民币，约合 6.19 亿美元','data'],
    ['AI models、研发新机器人设计、开发新产品，以及智能制造基地建设','mark'],
    ['机器人热度进入公开市场定价','strong']
  ],
  'ap-streaming-week-july':[
    ['7 月 6 日至 12 日的娱乐供给','data'],
    ['电影、音乐、剧集和游戏同时进入周度清单','mark'],
    ['暑期娱乐消费正在被 PVOD、Peacock、HBO Max、Netflix、MGM+、主机游戏和 VR 同时分流','strong']
  ],
  'macy-fireworks-streaming':[
    ['今年是 50 周年','data'],
    ['大型 live event 会创造短时刚性需求','strong'],
    ['娱乐行业的竞争不只在剧集片库，也在直播节点、体育版权和文化日历','mark']
  ],
  'verge-summer-culture':[
    ['不适合当作严肃预测，也不该被当成事实数据库','underline'],
    ['记录一组长期观察科技文化的人正在厌倦什么、拥抱什么','strong'],
    ['文化清单解释注意力和趣味怎样移动','mark']
  ]
};
const USER_READS={
  'dollar-fed-window':'这条你不需要当外汇专家去读。你只要知道：美元和利率会影响整个科技市场的情绪。如果美元压力下降，AI、机器人、半导体这类高投入行业会更容易被市场重新看好。对你来说，它是判断“大环境是否宽松”的背景信息，不是你要深入研究的主线。',
  'reuters-week-ahead-warsh':'这条的作用是帮你提前知道下周哪些新闻会影响市场情绪。你不用逐个研究 Fed minutes、OPEC、NATO，但要知道这些变量会影响 AI 公司、机器人公司和硬件产业的估值环境。简单说：下周如果市场突然波动，原因可能不在 AI 本身，而在利率、能源或地缘政治。',
  'korea-chip-wealth-divide':'这条可以很直白地理解：AI 芯片赚钱了，但钱先流向公司、员工和持股人，不会自动惠及所有人。你读它不是为了研究韩国社会问题，而是理解 AI 产业会带来分配争议。以后机器人产业如果真的爆发，也会经历类似问题：谁拿到利润，谁承担成本。',
  'korea-576b-chip-drive':'这条和你比较有关。韩国把芯片、数据中心和机器人放在同一个国家计划里，说明机器人不是孤立热点，而是 AI 基础设施往物理世界延伸的一部分。你可以把它理解为：未来机器人研究会越来越需要懂硬件、传感器、算力、部署和产业链，而不是只会写一个算法。',
  'guardian-chipmakers-rally':'这条告诉你，AI 这轮钱先流向硬件上游：芯片、内存、存储、电力、散热。对你来说，这能帮你避免被纯应用层热点带偏。机器人领域也一样，真正能落地的系统往往卡在硬件可靠性、传感器、控制链路和部署成本，而不只是模型名字。',
  'gemini-meta-compute-rationing':'这条说明一个很现实的问题：大公司也会被算力限制。你不用关心 Google 和 Meta 的商业细节，只要明白：AI 能力不是无限免费调用的。以后你做 VLM 或视频理解，也要考虑成本、延迟、token 数和设备算力，不能只想模型效果。',
  'unitree-star-ipo':'这条和你的方向最直接。宇树上市说明资本市场开始给机器人公司定价，真实硬件、量产、供应链和产品能力会变得更重要。你现在做六足机器人真机实验，其实是在积累很稀缺的系统经验。论文之外，这也是未来找机器人/具身智能方向岗位的能力资产。',
  'ap-streaming-week-july':'这条和你的科研无关，可以轻读。它主要告诉你娱乐消费正在分散到电影、剧集、游戏、VR 和不同平台。放进日报的意义是补一点文化和产品感觉，不需要花太多时间。',
  'macy-fireworks-streaming':'这条也是低优先级。你只要理解一个商业逻辑：直播事件能让用户在固定时间打开平台。它对你没什么科研价值，但能帮助你理解为什么平台会抢体育、节日和大型活动版权。',
  'verge-summer-culture':'这类文章不是硬新闻，更像审美温度计。你不需要相信它的每个判断，但可以用来观察科技圈用户正在厌倦什么、喜欢什么。它适合放松读，不要把它当成研究重点。'
};
const USER_ACTIONS={
  'dollar-fed-window':'低成本用法：只把它当成市场背景。每天看美元、利率和科技股情绪，不必深挖外汇。',
  'reuters-week-ahead-warsh':'低成本用法：下周重点只盯 Fed minutes 和油价；其他作为背景。',
  'korea-chip-wealth-divide':'低成本用法：把它归入“AI 产业影响社会分配”的例子，不需要展开研究。',
  'korea-576b-chip-drive':'低成本用法：记录韩国把机器人纳入 AI 硬科技投资，这是具身智能产业化信号。',
  'guardian-chipmakers-rally':'低成本用法：以后读 AI 新闻时先问一句：这条新闻的钱最终流向硬件、云，还是应用？',
  'gemini-meta-compute-rationing':'低成本用法：以后设计 VLM/视频方案时，把算力成本、延迟、token 限制写进边界。',
  'unitree-star-ipo':'低成本用法：持续跟踪宇树招股书、岗位 JD 和产品路线，反推机器人公司需要什么能力。',
  'ap-streaming-week-july':'低成本用法：只收藏你感兴趣的片单，不占用科研时间。',
  'macy-fireworks-streaming':'低成本用法：理解 live event 是平台拉活工具即可。',
  'verge-summer-culture':'低成本用法：当作文化雷达，每周扫一眼，不当主线。'
};
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
      .private-view h4::after{content:" / 给你看的版本";color:var(--muted);font-weight:600;text-transform:none;letter-spacing:0}.action-box h4::after{content:" / 低成本下一步";color:var(--muted);font-weight:600;text-transform:none;letter-spacing:0}
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
      const pv=article.querySelector('.private-view p');
      if(pv&&USER_READS[s.id]&&pv.textContent!==USER_READS[s.id]){pv.textContent=USER_READS[s.id];changed=true;}
      const ab=article.querySelector('.action-box p');
      if(ab&&USER_ACTIONS[s.id]&&ab.textContent!==USER_ACTIONS[s.id]){ab.textContent=USER_ACTIONS[s.id];changed=true;}
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