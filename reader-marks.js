const DIGEST_MARKS={"week-ahead-cpi-banks-tsmc-20260713":[["约 23.4%","data"],["物价、银行、台积电","strong"],["股价有没有贵得有道理","mark"]],"oil-inflation-centralbanks-20260713":[["约 6%","data"],["油价像隐形税","strong"],["利率也下不来","underline"]],"imf-growth-fragility-20260713":[["3.0%","data"],["4.7%","data"],["抗摔能力变弱","strong"]],"micron-us-wafer-chain-20260713":[["超过 2500 亿美元","data"],["硅晶圆是芯片底板","strong"],["上游材料稳不稳","mark"]],"helium-chipmaking-squeeze-20260713":[["临时暂停氦气出口","data"],["氦气远不止气球用气","strong"],["小东西也会卡住先进制造","mark"]],"atlas-field-constraints-20260713":[["2028 年","data"],["人多、信号挤、草地软","strong"],["真实世界才是门槛","mark"]],"dexterous-hands-data-layer-20260713":[["月产约 5000 只灵巧手","data"],["摸得准、拿得稳","strong"],["失败后重新抓","mark"]],"worldcup-y2k-fashion-20260713":[["世界杯","data"],["复古球衣和 Y2K","strong"],["赛事变成生活方式入口","mark"]],"moana-live-action-boxoffice-20260713":[["约 9500 万美元","data"],["约 2.5 亿美元","data"],["经典 IP 的安全感变贵","strong"]],"streaming-menu-july13-19-20260713":[["7 月 13–19 日","data"],["本周必须打开","strong"],["注意力按周结算","mark"]]};
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
