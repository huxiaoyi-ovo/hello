const DIGEST_MARKS={
  'vlm-rl-robustness':[
    ['收益被准确率提前确认，损失却隐藏在鲁棒性和忠实性里','mark'],
    ['答案置信度和推理一致性出现明显退化','strong'],
    ['correctness、robustness、confidence calibration 和 visual-grounded reasoning faithfulness','underline'],
    ['把语言噪声转化成物理风险','strong']
  ],
  'videoflextok':[
    ['重新定价视频表示','strong'],
    ['少量 token 捕捉语义、运动和全局结构，再用更多 token 补充纹理与细节','underline'],
    ['672 个 token，约为可比三维网格 tokenizer 的八分之一','data'],
    ['视觉记忆的瓶颈会从存储所有帧，转向选择哪些状态变化值得留下','mark']
  ],
  'multi-agent-expert':[
    ['团队持续落后于专家智能体的单独表现','strong'],
    ['损失达到 41.1%','data'],
    ['瓶颈不在“识别专家”，而在“利用专家”','underline'],
    ['能力模块越多，仲裁层越关键','mark']
  ],
  'page-agent':[
    ['读取实时 DOM，再把复杂页面压缩成 FlatDomTree 文本映射','strong'],
    ['模型看到结构化页面状态，无需通过图像判断按钮含义','mark'],
    ['提示词安全无法替代权限系统','strong'],
    ['高层模型可以读结构化局部地图与任务摘要，底层控制权限必须受限','underline']
  ],
  'microsoft-frontier':[
    ['25 亿美元，将 6000 名行业与工程专家派驻企业客户现场','data'],
    ['模型必须进入现有流程、数据权限、审计链路、合规体系和绩效指标','mark'],
    ['一个策略网络只是资产负债表上的单项资产，部署工程决定它能否产生现金流','underline'],
    ['能把系统带到复杂环境、复现实验、解释失败、降低维护成本的人更稀缺','strong']
  ],
  'unitree-ipo':[
    ['目标募资约 42 亿元人民币，约合 6.19 亿美元','data'],
    ['模型、机械设计、产品线和制造能力被放在同一张资本计划里','mark'],
    ['资本开支、产能、良率、维护、渠道和真实场景部署','strong'],
    ['产业资本正在奖励可执行性','underline']
  ],
  'leanstral':[
    ['在 57 个开源仓库中发现 5 个未知 bug','data'],
    ['AI 工具链正在从生成代码，进入检查代码、证明性质、发现隐藏错误的阶段','mark'],
    ['策略网络性能再强，也会被这些系统错误拖垮','strong'],
    ['哪些条件触发停止，哪些状态允许高层模型介入，哪些控制量受到硬约束','underline']
  ],
  'vidu-s1':[
    ['实时视频通话级交互和语音控制视频走向','strong'],
    ['540P 分辨率下实现 25FPS，最高 42FPS','data'],
    ['严格区分视觉叙事和物理证据','underline'],
    ['它无法替代真实传感器、真实接触、真实动力学和可复现实验','strong']
  ],
  'agent-ransomware':[
    ['agent 正从问答对象变成操作主体','mark'],
    ['风险随权限上升呈非线性放大','strong'],
    ['最小权限、动作白名单、人类确认、审计日志、回滚机制、沙箱和异常中止条件','underline'],
    ['动作会进入物理空间','strong']
  ],
  'claude-real-video':[
    ['本地做场景感知、去重和语音转写','strong'],
    ['真正关键的状态变化、动作开始、目标丢失、碰撞前后片段反而被稀释','underline'],
    ['自动定位 near miss、collision、target lost、recovery、human intervention','mark'],
    ['把原始录像变成 failure intelligence','strong']
  ],
  'safari-mcp':[
    ['模型可以通过 MCP 进入浏览器调试环境','strong'],
    ['读取结构化状态、定位元素、分析性能','underline'],
    ['机器人系统会走向类似形态','mark'],
    ['工具层设计会决定 AI 助手能否从聊天对象变成实验系统的一部分','strong']
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
      .ed-strong{font-weight:850;color:#14110d}
      .ed-mark{font-weight:760;background:linear-gradient(transparent 72%,rgba(225,185,107,.25) 0);padding:0 .04em}
      .ed-underline{font-weight:720;text-decoration:underline;text-decoration-color:rgba(88,82,70,.45);text-decoration-thickness:1px;text-underline-offset:.2em}
      .ed-data{font-family:var(--mono);font-size:.94em;font-weight:760;color:#5e3b14;background:rgba(184,129,47,.10);border:1px solid rgba(184,129,47,.18);border-radius:6px;padding:.01em .22em;white-space:nowrap}
      [data-theme="night"] .ed-strong{color:#fff}[data-theme="night"] .ed-mark{background:linear-gradient(transparent 72%,rgba(225,185,107,.20) 0)}[data-theme="night"] .ed-data{color:#ffe0a4}
    `;
    document.head.appendChild(style);
  }
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
  function cssEscape(s){return String(s).replace(/(["\\])/g,'\\$1');}
  function applyOne(html,phrase,type){
    const safe=esc(phrase);
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
    return `<div class="digest-reader editorial-marks"><p class="digest-lede">${leadHtml}</p><div class="digest-body">${paragraphs}</div></div>`;
  }
  function run(){
    injectStyles();
    if(typeof STORIES==='undefined') return;
    STORIES.forEach(function(s){
      const article=document.querySelector(`.story-row[data-id="${cssEscape(s.id)}"]`);
      if(!article) return;
      const panel=article.querySelector('.analysis-panel');
      if(!panel) return;
      const old=panel.querySelector('.digest,.digest-reader');
      if(!old) return;
      old.outerHTML=buildDigest(s.id,s.digest);
    });
  }
  document.addEventListener('DOMContentLoaded',function(){setTimeout(run,350);setTimeout(run,900);});
})();