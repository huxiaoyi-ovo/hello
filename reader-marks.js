const DIGEST_MARKS={"oil-chips-riskoff-20260714":[["原油结算价单日上涨 9.4%","data"],["资金对高估值容忍度下降","strong"],["从增长故事转向现金流质量","mark"]],"fed-waller-inflation-crossroads-20260714":[["接近 70% 的类别","data"],["政策处在 crossroads","strong"],["利率上行尾部风险","mark"]],"chip-cycle-valuation-test-20260714":[["ETF 单周流出约 110 亿美元","data"],["波动升高","strong"],["整个板块一起上涨的难度上升","mark"]],"tsmc-advanced-packaging-chiayi-20260714":[["超过 3000 亿新台币","data"],["先进封装成为交付节拍器","strong"],["封装良率、散热和排程","mark"]],"bosch-sic-us-production-20260714":[["投入约 20 亿美元改造","data"],["SiC 适合高电压、高效率电力转换","strong"],["算力扩张背后的基础器件","mark"]],"atlas-field-reality-20260714":[["2028 年","data"],["通信冗余、地面状态估计、跌倒保护","strong"],["benchmark 应该记录扰动和恢复","mark"]],"dexterous-hand-data-economy-20260714":[["月产量约为 5000 只灵巧手","data"],["数据质量成为分水岭","strong"],["失败后选择新的接近方向","mark"]],"worldcup-y2k-attention-20260714":[["7 月 12 日","data"],["消费者对过度光滑数字内容的疲劳","strong"],["更像个人记录","mark"]],"playstation-physical-ownership-20260714":[["约 80%","data"],["数字所有权的担忧","strong"],["平台经济的控制权","mark"]],"streaming-week-july13-19-20260714":[["7 月 13–19 日","data"],["多个微型入口","strong"],["按月轮换","mark"]]};
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
