const DIGEST_MARKS={"chips-priced-for-perfection-20260717":[["77%","data"],["市场已经把 AI growth 定价到近乎完美","strong"],["股票层面的容错率已经显著下降","mark"]],"inflation-limbo-energy-20260717":[["约 86 美元","data"],["政策判断的难点集中在时间错位","strong"],["利率路径会保持高波动","mark"]],"gulf-hormuz-recession-20260717":[["收缩 8.1%","data"],["高油价救不了出口量","strong"],["基础设施韧性重新分层","mark"]],"tsmc-capex-arizona-20260717":[["600–640 亿美元","data"],["跨十年的固定资产押注","strong"],["利用率风险","mark"]],"spacex-postipo-repricing-20260717":[["回落超过 30%","data"],["公开市场会要求季度级证据","strong"],["现金流透明度、资本密度和股权供给约束","mark"]],"nvidia-japan-physical-ai-20260717":[["27,500 颗 Nvidia Rubin chips","data"],["从机械精度延伸到算力与软件栈","strong"],["硬件渠道和现场服务网络","mark"]],"hyundai-boston-dynamics-full-control-20260717":[["约 5 万亿韩元","data"],["资本责任完整放回 Hyundai 资产负债表","strong"],["可复制部署","mark"]],"romantasy-cultural-demand-20260717":[["35 岁以下女性","data"],["情绪需求与平台分发的闭环","strong"],["comfort、agency 和 emotional competence","mark"]],"ps6-handheld-digital-platform-20260717":[["PS6","data"],["从固定硬件性能转向 access、library continuity 和 ecosystem lock-in","strong"],["便利换取更弱的所有权","mark"]],"streaming-weekly-attention-20260717":[["7 月 13–19 日","data"],["经营 weekly attention portfolio","strong"],["排期节奏与跨格式协同","mark"]]};
const USER_READS={};
const USER_ACTIONS={};
(function(){
  function injectStyles(){
    if(document.getElementById('reader-marks-styles'))return;
    const s=document.createElement('style');
    s.id='reader-marks-styles';
    s.textContent='.digest-reader.editorial-marks{margin-top:10px}.ed-data,.ed-strong,.ed-mark,.ed-underline{border-radius:4px;padding:0 2px}.ed-data{font-variant-numeric:tabular-nums}.ed-underline{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}';
    document.head.appendChild(s);
  }
  function markText(text,items){
    let html=String(text||'').replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});
    (items||[]).forEach(function(pair){
      const phrase=String(pair[0]||''); const type=String(pair[1]||'mark');
      if(!phrase)return;
      const safe=phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      html=html.replace(new RegExp(safe,'g'),'<span class="ed-'+type+'">'+phrase+'</span>');
    });
    return html;
  }
  function apply(){
    injectStyles();
    document.querySelectorAll('.story-row').forEach(function(row){
      const id=row.getAttribute('data-id');
      const marks=window.DIGEST_MARKS?window.DIGEST_MARKS[id]:DIGEST_MARKS[id];
      const digest=row.querySelector('.digest');
      if(!digest||!marks||digest.dataset.marked)return;
      digest.innerHTML=markText(digest.textContent,marks);
      digest.classList.add('digest-reader','editorial-marks');
      digest.dataset.marked='1';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(apply,180);});else setTimeout(apply,180);
})();
