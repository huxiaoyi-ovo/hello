const DIGEST_MARKS={"ppi-earnings-geopolitics-20260716":[["PPI 环比下降 0.3%","data"],["旧数据在降温，新成本已经抬头","strong"],["当前 rally 就会持续依赖企业利润","mark"]],"ecb-second-round-risk-20260716":[["完全计入 9 月再加息","data"],["防止企业和家庭把临时冲击写进长期价格与工资合同","strong"],["传导速度","mark"]],"hormuz-emerging-market-pressure-20260716":[["17 个月来首次高于央行 4% 中期目标","data"],["能源进口国会更早感受到这轮冲击","strong"],["降息空间被油价挤压","mark"]],"apple-cxmt-mature-memory-20260716":[["约占全球 DRAM 市场 8%","data"],["成熟芯片的战略价值上升","strong"],["基础器件决定整条产线能否按时出货","mark"]],"asml-capacity-highna-20260716":[["2027 年把 low-NA EUV 产能提高约 30%","data"],["AI 基础设施的瓶颈逐层外移","strong"],["high-NA 是否形成广泛采用","mark"]],"hyundai-atlas-labor-strike-20260716":[["超过 1.34 亿美元损失","data"],["成本模型从机器售价扩展到组织成本","strong"],["岗位设计、培训、责任边界和生产率收益分配","mark"]],"schaeffler-humanoid-deployment-20260716":[["约 1000–2000 台机器人","data"],["工厂供应商又进入机器人 BOM","strong"],["首阶段能否稳定完成低复杂度搬运","mark"]],"internet-culture-raves-20260716":[["从 2024 年开始巡演","data"],["线上文化正在寻找更有身体感的出口","strong"],["公开承认旧爱好的社交许可","mark"]],"weekly-streaming-programming-20260716":[["7 月 13–19 日","data"],["不同内容承担不同任务","strong"],["持续打开率更影响 churn","mark"]],"game-adaptation-pipeline-20260716":[["2027 年","data"],["游戏世界观已成为 studio slate 的稳定来源","strong"],["跨媒体循环是否真正成立","mark"]]};
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