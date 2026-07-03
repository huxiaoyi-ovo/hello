/* Cloud Sync for DR.Hu Intelligence Desk
   Layer 1: public low-sensitivity preference profile, readable by future brief generation.
   Layer 2: optional full local memory JSON, written to GitHub with a user-provided fine-grained token.
*/
(function(){
  const OWNER='huxiaoyi-ovo', REPO='hello', BRANCH='main';
  const PROFILE_PATH='memory/preference-profile.json';
  const FULL_PATH='memory/drhu-full-memory.json';
  const MEM_KEY='drhu.memory.v2';
  const TOKEN_KEY='drhu.cloud.token.session';
  const PROFILE_API=`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PROFILE_PATH}`;
  const FULL_API=`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FULL_PATH}`;
  const RAW_PROFILE=`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${PROFILE_PATH}`;

  const css=`
  .cloud-panel{margin-top:14px;border:1px solid var(--hair);border-radius:18px;padding:13px;background:color-mix(in srgb,var(--paper2) 72%,var(--card));}
  .cloud-panel h4{margin:0 0 8px;font-family:var(--serif);font-size:21px;letter-spacing:-.025em;}
  .cloud-panel p{margin:7px 0;color:var(--muted);font-size:13px;}
  .cloud-grid{display:grid;grid-template-columns:1fr;gap:8px;margin-top:10px;}
  .cloud-grid input,.cloud-grid textarea{width:100%;border:1px solid var(--hair);background:var(--card);color:var(--ink);border-radius:12px;padding:10px 11px;outline:none;font-size:13px;}
  .cloud-grid textarea{min-height:88px;resize:vertical;}
  .cloud-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:9px;}
  .cloud-status{font-size:12px;color:var(--muted);padding:8px 0 0;line-height:1.5;white-space:pre-wrap;}
  .cloud-warning{border-left:3px solid var(--gold);padding:8px 10px;background:color-mix(in srgb,var(--gold2) 20%,transparent);border-radius:12px;margin-top:9px;}
  .mini-code{font-size:12px;border:1px solid var(--hair);border-radius:12px;padding:8px;background:color-mix(in srgb,var(--paper2) 72%,var(--card));overflow:auto;}
  .hero .snapshot{display:none!important;}
  .hero{grid-template-columns:1fr!important;}
  .hero .lead{max-width:none;}
  @media(min-width:760px){.cloud-grid.two{grid-template-columns:1fr 1fr;}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  function $(s){return document.querySelector(s)}
  function toast(msg){const t=document.getElementById('toast');if(t){t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1500)}}
  function getMem(){return JSON.parse(localStorage.getItem(MEM_KEY)||'{}')}
  function setMem(m){localStorage.setItem(MEM_KEY,JSON.stringify(m))}
  function getToken(){return sessionStorage.getItem(TOKEN_KEY)||''}
  function setToken(t){t?sessionStorage.setItem(TOKEN_KEY,t):sessionStorage.removeItem(TOKEN_KEY)}
  function headers(token){return {'Accept':'application/vnd.github+json','Authorization':`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28'}}
  function encodeContent(obj){return btoa(unescape(encodeURIComponent(JSON.stringify(obj,null,2))))}
  function decodeContent(s){return JSON.parse(decodeURIComponent(escape(atob(s.replace(/\n/g,'')))))}
  async function getFile(api,token){const r=await fetch(`${api}?ref=${BRANCH}`,{headers:token?headers(token):{}});if(r.status===404)return{exists:false,sha:null,obj:null};if(!r.ok)throw new Error(`Read failed: ${r.status}`);const j=await r.json();return{exists:true,sha:j.sha,obj:decodeContent(j.content)}}
  async function putFile(api,path,obj,token,sha){const body={message:`Update ${path}`,content:encodeContent(obj),branch:BRANCH};if(sha)body.sha=sha;const r=await fetch(api,{method:'PUT',headers:{...headers(token),'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok){const txt=await r.text();throw new Error(`Write failed: ${r.status} ${txt.slice(0,140)}`)}return r.json()}
  async function fetchPublicProfile(){const r=await fetch(`${RAW_PROFILE}?t=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`Public profile not found: ${r.status}`);return r.json()}
  function sortedWeights(mem){return Object.entries(mem.weights||{}).sort((a,b)=>Number(b[1]||0)-Number(a[1]||0))}
  function buildProfile(mem){
    const top=sortedWeights(mem).slice(0,12).map(([topic,weight])=>({topic,weight:Number(weight)}));
    const low=sortedWeights(mem).filter(([_,w])=>Number(w)<=2).slice(0,10).map(([topic,weight])=>({topic,weight:Number(weight)}));
    const events=(mem.events||[]).slice(0,80);
    const more=events.filter(e=>e.type==='more-like-this').map(e=>e.title).filter(Boolean).slice(0,12);
    const less=events.filter(e=>e.type==='less-like-this'||e.type==='irrelevant').map(e=>e.title).filter(Boolean).slice(0,12);
    return {
      schema:'drhu.preference-profile.v1',
      updatedAt:new Date().toISOString(),
      owner:'DR.Hu',
      profilePurpose:'Low-sensitivity preference profile for daily AIHOT/robotics research briefing generation.',
      primaryFocus:[
        'embodied intelligence / 具身智能',
        'robot learning and real-robot deployment',
        'papers / arXiv / research with actionable experimental implications',
        'big-shot opinions only when they affect research direction or capability planning',
        'robotics company capability requirements and skill roadmap'
      ],
      topTopics:top,
      downrankTopics:low,
      likedSignals:more,
      dislikedSignals:less,
      savedItemIds:mem.saved||[],
      readItemIds:mem.read||[],
      hiddenItemIds:mem.hidden||[],
      generationGuidance:{
        prioritize:['embodied AI','robot learning','sim-to-real','ROS2/C++/deployment','credible baselines','RA-L/ICRA/IROS publication strategy','future research directions based on existing hexapod/depth/target-following platform'],
        downrank:['generic AI product launches','financing-only news','celebrity hype','pure LLM benchmarks without robotics implication'],
        format:'mobile-first premium editorial briefing ledger; Chinese main text; preserve English technical terms; include 500+ character original-source digests, research implications and capability roadmap.'
      }
    }
  }
  function mergeProfileIntoMemory(profile){
    const mem=getMem(); mem.weights=mem.weights||{};
    (profile.topTopics||[]).forEach(x=>{mem.weights[x.topic]=Math.max(Number(mem.weights[x.topic]||0),Number(x.weight||0))});
    (profile.downrankTopics||[]).forEach(x=>{mem.weights[x.topic]=Math.min(Number(mem.weights[x.topic]||0),Number(x.weight||0))});
    ['savedItemIds','readItemIds','hiddenItemIds'].forEach((k)=>{const map={savedItemIds:'saved',readItemIds:'read',hiddenItemIds:'hidden'};mem[map[k]]=[...new Set([...(mem[map[k]]||[]),...(profile[k]||[])])]});
    mem.events=mem.events||[];mem.events.unshift({time:new Date().toISOString(),type:'pull-public-profile',title:'Merged preference-profile.json'});mem.events=mem.events.slice(0,160);setMem(mem);return mem;
  }
  function rewriteHero(){
    const eyebrow=document.querySelector('.hero .eyebrow');
    const title=document.querySelector('.hero h1');
    const deck=document.querySelector('.hero .lead p');
    const pill=document.querySelector('.subbrand .pill');
    const sub=document.querySelector('.subbrand span:nth-child(2)');
    if(eyebrow) eyebrow.textContent='AIHOT Daily · 2026-07-04 · Embodied intelligence / papers / industry';
    if(title) title.textContent='具身智能开始从模型叙事，转向证据、记忆与部署能力。';
    if(deck) deck.textContent='今天的主线很清楚：VLM 的推理链仍有脆弱性，视频 tokenization 正在改变长期视觉记忆的成本，多智能体研究提醒我们“专家利用”比“专家数量”更关键，而宇树 IPO 则把机器人竞争推向制造、资本和真实部署。对你的研究而言，这些新闻共同指向一个更硬的标准：系统必须能在真实约束下解释失败、保留证据，并把智能意图落到可执行的安全控制。';
    if(pill) pill.textContent='Daily robotics intelligence';
    if(sub) sub.textContent='源头消化、证据边界、私人判断；后台记忆不占用阅读首屏';
  }
  function ensurePanel(){
    rewriteHero();
    const grid=document.querySelector('#memory .memory-grid'); if(!grid||document.getElementById('cloudPanel'))return;
    const panel=document.createElement('article'); panel.className='board'; panel.id='cloudPanel';
    panel.innerHTML=`
      <h3>Cloud Preference Sync</h3>
      <div class="cloud-panel">
        <h4>Public preference profile</h4>
        <p>低敏偏好画像会以明文 JSON 保存到 <code>${PROFILE_PATH}</code>，用于后续每日简报读取，从源头调整选题。</p>
        <div class="cloud-warning"><p><b>边界：</b>这是公开仓库里的低敏摘要，不建议写私人账号、未公开论文细节、实验原始数据或任何敏感内容。</p></div>
        <div class="cloud-grid two">
          <input id="cloudToken" type="password" placeholder="GitHub fine-grained token · Contents read/write" autocomplete="off" />
          <input id="profileUrl" value="https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${PROFILE_PATH}" readonly />
        </div>
        <div class="cloud-row">
          <button class="btn" id="pushProfile">Push public profile</button>
          <button class="btn" id="pullProfile">Pull public profile</button>
          <button class="btn" id="pushFull">Push full memory JSON</button>
          <button class="btn" id="testCloud">Test token</button>
        </div>
        <div class="cloud-status" id="cloudStatus">Cloud profile 未同步。</div>
        <div class="mini-code" id="profilePreview">Profile preview will appear here.</div>
      </div>`;
    grid.appendChild(panel); $('#cloudToken').value=getToken(); bind(); preview();
  }
  function status(msg){const el=$('#cloudStatus');if(el)el.textContent=msg}
  function preview(){const el=$('#profilePreview');if(!el)return;const p=buildProfile(getMem());el.textContent=JSON.stringify({updatedAt:p.updatedAt,topTopics:p.topTopics.slice(0,6),downrankTopics:p.downrankTopics.slice(0,4)},null,2)}
  function token(){const t=$('#cloudToken')?.value.trim()||'';setToken(t);return t}
  async function pushProfile(){try{const t=token();if(!t)throw new Error('缺少 GitHub token');const profile=buildProfile(getMem());status('Checking remote profile...');const old=await getFile(PROFILE_API,t);status('Writing public preference profile...');await putFile(PROFILE_API,PROFILE_PATH,profile,t,old.sha);status(`已写入 ${PROFILE_PATH}\n后续每日简报可读取该画像。`);toast('公开偏好画像已同步');preview()}catch(e){status(e.message);toast('同步失败')}}
  async function pullProfile(){try{status('Reading public preference profile...');const profile=await fetchPublicProfile();mergeProfileIntoMemory(profile);status(`已拉取并合并 ${PROFILE_PATH}\n刷新页面后排序会完全应用。`);toast('偏好画像已合并');preview()}catch(e){status(e.message);toast('拉取失败')}}
  async function pushFull(){try{const t=token();if(!t)throw new Error('缺少 GitHub token');const mem=getMem();mem.cloudFullUpdatedAt=new Date().toISOString();const old=await getFile(FULL_API,t);await putFile(FULL_API,FULL_PATH,mem,t,old.sha);status(`已写入完整记忆 ${FULL_PATH}\n注意：这是明文完整记忆，仅适合低敏使用。`);toast('完整记忆已同步')}catch(e){status(e.message);toast('完整同步失败')}}
  async function test(){try{const t=token();if(!t)throw new Error('缺少 GitHub token');const r=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`,{headers:headers(t)});if(!r.ok)throw new Error(`Repo access failed: ${r.status}`);status('Token 可访问仓库。可以 Push public profile。');toast('连接正常')}catch(e){status(e.message);toast('连接失败')}}
  function bind(){
    $('#cloudToken')?.addEventListener('change',token);
    $('#pushProfile')?.addEventListener('click',pushProfile);
    $('#pullProfile')?.addEventListener('click',pullProfile);
    $('#pushFull')?.addEventListener('click',pushFull);
    $('#testCloud')?.addEventListener('click',test);
    setInterval(preview,2500);
  }
  document.addEventListener('DOMContentLoaded',ensurePanel); if(document.readyState!=='loading')ensurePanel();
})();
