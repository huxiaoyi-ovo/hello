const DIGEST_MARKS={"cpi-banks-oil-crosscurrent-20260715":[["CPI 同比升 3.5%","data"],["市场同时交易两套时间线","strong"],["能源风险仍留在桌面上","mark"]],"fed-july-pause-20260715":[["从约 35% 降到 10%","data"],["秋季是否重新收紧","strong"],["喘息窗口","mark"]],"hormuz-oil-diesel-20260715":[["7 月上涨约 21%","data"],["柴油更贴近实体物流","strong"],["从能源账单进入运输、食品和服务价格","mark"]],"tower-japan-silicon-photonics-20260715":[["投资 30 亿美元","data"],["AI 基础设施竞争延伸到芯片互连","strong"],["silicon photonics 成为关键支线","mark"]],"tsmc-record-profit-capex-20260715":[["同比增加 59%","data"],["全球 AI capex 的关键验证点","strong"],["未来两年的产能是否足以支持订单","mark"]],"apptronik-training-hub-20260715":[["从试点验证到生产部署","data"],["部署、收集失败、人工修正、再训练","strong"],["failure distribution 和 human intervention","mark"]],"china-humanoid-demand-gap-20260715":[["约占全球 humanoid 出货的 85%","data"],["市场下一阶段会严查 utilization","strong"],["复购和单位任务成本","mark"]],"algorithmic-taste-resistance-20260715":[["每周固定读一个编辑型来源","data"],["文化消费的稀缺品","strong"],["可信赖的编辑、稳定语境和愿意承担风险的选择","mark"]],"weekly-streaming-franchise-endings-20260715":[["7 月 13–19 日","data"],["平台内容承担不同功能","strong"],["订阅竞争越来越像组合管理","mark"]],"immersive-sports-viewing-20260715":[["二十年尺度","data"],["体育是 immersive media 最有机会形成付费习惯的领域","strong"],["shared moment 可能变薄","mark"]]};
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
