const DIGEST_MARKS={
  'global-markets-jobs':[
    ['全球股市走向两个月来最好的一周','strong'],
    ['美国 6 月就业数据降温','data'],
    ['市场正在重新计算利率路径、AI 资本开支、美元强弱和地区估值之间的相对价格','mark'],
    ['它决定其他科技、消费、娱乐新闻的资金背景','underline']
  ],
  'bis-debt-ai-fragility':[
    ['AI 投资潮正在变成宏观金融变量','strong'],
    ['高公共债务、持续供给冲击、通胀重新黏住的风险，以及金融市场脆弱性','underline'],
    ['核心债券市场变得更脆','mark'],
    ['它会推动芯片、数据中心、电力、地产、债务融资一起涨','strong']
  ],
  'chipflation-economy':[
    ['AI 数据中心争夺高端内存和半导体产能','strong'],
    ['上游拿走定价权，下游在涨价与压缩利润之间选择','mark'],
    ['消费者则可能为更贵的电脑、手机和电子设备买单','underline'],
    ['连接科技、通胀、消费和资本市场','strong']
  ],
  'china-robot-overload':[
    ['产业声量与真实商业化之间存在明显落差','strong'],
    ['至少 200 亿美元级别的补贴','data'],
    ['很多产品进入的是科研、教育和测试场景，而非稳定工业应用','underline'],
    ['补贴—估值—技术约束—商业落地','mark']
  ],
  'unitree-ipo-capital':[
    ['计划募资约 42 亿元人民币，约合 6.19 亿美元','data'],
    ['机器人从实验室和展会进入制造纪律的信号','strong'],
    ['机械结构、关节、传感器、供应链、产线、测试和售后','mark'],
    ['市场对收入、毛利、交付和现金流的要求也更硬','underline']
  ],
  'chipmakers-stock-boom':[
    ['资本市场的重心从应用软件推向基础硬件','strong'],
    ['算力、存储、内存、电力和数据中心这类“铲子”会先吃到资本开支','mark'],
    ['它解释了为什么同样是 AI 新闻，有些是概念，有些已经变成利润和股价','underline']
  ],
  'ap-streaming-week':[
    ['电影、音乐、电视和游戏','mark'],
    ['7 月 7 日','data'],
    ['一周文化消费入口的横向筛选','strong'],
    ['观察平台、类型、IP 和消费习惯','underline']
  ],
  'streaming-subscription-strategy':[
    ['娱乐消费写成了一笔家庭预算账','strong'],
    ['Apple TV+','data'],
    ['流媒体已经不是单纯娱乐新闻','mark'],
    ['平台在一个月内有没有足够理由留下用户','underline']
  ],
  'verge-summer-culture':[
    ['互联网文化的轻量民调','strong'],
    ['人们实际在玩什么、厌倦什么、觉得什么有趣','mark'],
    ['文化雷达，而不是事实锚点','underline'],
    ['缺少生活质感','strong']
  ],
  'robot-supply-chain-jv':[
    ['机器人竞争开始深入关节和传动件','strong'],
    ['关节、减速器、轴承、传感器、电机、热管理、寿命测试和装配一致性','mark'],
    ['供应链公司决定量产后的可靠性、成本和交付速度','underline'],
    ['把注意力拉回工业能力','strong']
  ]
};
(function(){
  function injectStyles(){
    if(document.getElementById('editorial-mark-styles'))return;
    const style=document.createElement('style');
    style.id='editorial-mark-styles';
    style.textContent=`
      .digest-reader.editorial-marks{font-family:var(--serif);font-size:16px;line-height:1.96;color:#241e16;background:linear-gradient(180deg,rgba(255,253,248,.94),rgba(246,239,225,.68));border-left:4px solid var(--gold);border-radius:15px;padding:18px 18px 17px;box-shadow:inset 0 0 0 1px rgba(216,205,185,.55)}
      [data-theme="night"] .digest-reader.editorial-marks{color:#efe7d7;background:rgba(30,27,22,.80);box-shadow:inset 0 0 0 1px rgba(90,79,60,.45)}
      .digest-reader.editorial-marks .digest-lede{font-size:18px;line-height:1.66;font-weight:900;color:#11100e;border-bottom:1px solid rgba(184,129,47,.24);padding-bottom:11px;margin:0 0 13px;letter-spacing:-.012em}
      [data-theme="night"] .digest-reader.editorial-marks .digest-lede{color:#fff3d8}
      .digest-reader.editorial-marks .digest-body p{margin:0 0 .82em}.digest-reader.editorial-marks .digest-body p:last-child{margin-bottom:0}
      .ed-strong{font-weight:850;color:#14110d}.ed-mark{font-weight:760;background:linear-gradient(transparent 72%,rgba(225,185,107,.25) 0);padding:0 .04em}.ed-underline{font-weight:720;text-decoration:underline;text-decoration-color:rgba(88,82,70,.45);text-decoration-thickness:1px;text-underline-offset:.2em}.ed-data{font-family:var(--mono);font-size:.94em;font-weight:760;color:#5e3b14;background:rgba(184,129,47,.10);border:1px solid rgba(184,129,47,.18);border-radius:6px;padding:.01em .22em;white-space:nowrap}
      [data-theme="night"] .ed-strong{color:#fff}[data-theme="night"] .ed-mark{background:linear-gradient(transparent 72%,rgba(225,185,107,.20) 0)}[data-theme="night"] .ed-data{color:#ffe0a4}
    `;
    document.head.appendChild(style);
  }
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
  function cssEscape(s){return String(s).replace(/(["\\])/g,'\\$1');}
  function applyOne(html,phrase,type){const safe=esc(phrase);const cls={strong:'ed-strong',mark:'ed-mark',underline:'ed-underline',data:'ed-data'}[type]||'ed-strong';return html.replace(safe,`<span class="${cls}">${safe}</span>`);}
  function buildDigest(id,text){const marks=DIGEST_MARKS[id]||[];const m=text.match(/^(.+?[。！？.!?])(.+)$/s);const lead=m?m[1]:text.slice(0,90);const rest=m?m[2].trim():text.slice(90).trim();let leadHtml=esc(lead);let bodyHtml=esc(rest);marks.forEach(([phrase,type])=>{leadHtml=applyOne(leadHtml,phrase,type);bodyHtml=applyOne(bodyHtml,phrase,type);});const paragraphs=bodyHtml.split(/(?<=[。！？])\s*/).filter(Boolean).map(p=>`<p>${p}</p>`).join('');return `<div class="digest-reader editorial-marks"><p class="digest-lede">${leadHtml}</p><div class="digest-body">${paragraphs}</div></div>`;}
  function run(){injectStyles();if(typeof STORIES==='undefined')return;STORIES.forEach(function(s){const article=document.querySelector(`.story-row[data-id="${cssEscape(s.id)}"]`);if(!article)return;const panel=article.querySelector('.analysis-panel');if(!panel)return;const old=panel.querySelector('.digest,.digest-reader');if(!old)return;old.outerHTML=buildDigest(s.id,s.digest);});}
  document.addEventListener('DOMContentLoaded',function(){setTimeout(run,350);setTimeout(run,900);});
})();