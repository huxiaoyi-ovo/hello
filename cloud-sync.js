/* Encrypted Cloud Sync for DR.Hu Intelligence Desk
   - Client-side encryption with Web Crypto AES-GCM
   - Optional GitHub repo storage using a user-provided fine-grained PAT
   - Token is kept in sessionStorage by default; passphrase may be remembered locally only if user chooses
*/
(function(){
  const OWNER = 'huxiaoyi-ovo';
  const REPO = 'hello';
  const BRANCH = 'main';
  const CLOUD_PATH = 'memory/drhu-memory.enc.json';
  const API_FILE = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${CLOUD_PATH}`;
  const MEM_KEY = 'drhu.memory.v2';
  const CLOUD_CFG = 'drhu.cloud.cfg.v1';
  const PASS_KEY = 'drhu.cloud.passphrase.v1';
  const TOKEN_KEY = 'drhu.cloud.token.session';

  const css = `
  .cloud-panel{margin-top:14px;border:1px solid var(--hair);border-radius:18px;padding:13px;background:color-mix(in srgb,var(--paper2) 72%,var(--card));}
  .cloud-panel h4{margin:0 0 8px;font-family:var(--serif);font-size:21px;letter-spacing:-.025em;}
  .cloud-panel p{margin:7px 0;color:var(--muted);font-size:13px;}
  .cloud-grid{display:grid;grid-template-columns:1fr;gap:8px;margin-top:10px;}
  .cloud-grid input{width:100%;border:1px solid var(--hair);background:var(--card);color:var(--ink);border-radius:12px;padding:10px 11px;outline:none;font-size:13px;}
  .cloud-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:9px;}
  .cloud-status{font-size:12px;color:var(--muted);padding:8px 0 0;line-height:1.5;}
  .cloud-warning{border-left:3px solid var(--gold);padding:8px 10px;background:color-mix(in srgb,var(--gold2) 20%,transparent);border-radius:12px;margin-top:9px;}
  .cloud-check{display:flex;gap:7px;align-items:center;font-size:12px;color:var(--muted);}
  @media(min-width:760px){.cloud-grid{grid-template-columns:1fr 1fr;}}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  function $(sel){ return document.querySelector(sel); }
  function toast(msg){
    const t = document.getElementById('toast');
    if(t){ t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 1600); }
  }
  function b64(buf){ return btoa(String.fromCharCode(...new Uint8Array(buf))); }
  function ub64(s){ return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }
  function utf8(s){ return new TextEncoder().encode(s); }
  function fromUtf8(buf){ return new TextDecoder().decode(buf); }
  async function sha256(text){
    const hash = await crypto.subtle.digest('SHA-256', utf8(text));
    return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,16);
  }
  async function deriveKey(passphrase, salt){
    const material = await crypto.subtle.importKey('raw', utf8(passphrase), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name:'PBKDF2', salt, iterations:180000, hash:'SHA-256' },
      material,
      { name:'AES-GCM', length:256 },
      false,
      ['encrypt','decrypt']
    );
  }
  async function encryptJson(obj, passphrase){
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt);
    const plaintext = utf8(JSON.stringify(obj));
    const ciphertext = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, key, plaintext);
    return {
      version: 1,
      app: 'drhu-intelligence-desk',
      algorithm: 'AES-GCM-256/PBKDF2-SHA256',
      iterations: 180000,
      updatedAt: new Date().toISOString(),
      salt: b64(salt),
      iv: b64(iv),
      ciphertext: b64(ciphertext)
    };
  }
  async function decryptJson(payload, passphrase){
    const salt = ub64(payload.salt); const iv = ub64(payload.iv);
    const key = await deriveKey(passphrase, salt);
    const plain = await crypto.subtle.decrypt({ name:'AES-GCM', iv }, key, ub64(payload.ciphertext));
    return JSON.parse(fromUtf8(plain));
  }
  function getMemory(){ return JSON.parse(localStorage.getItem(MEM_KEY) || '{}'); }
  function setMemory(mem){ localStorage.setItem(MEM_KEY, JSON.stringify(mem)); }
  function getCfg(){ return JSON.parse(localStorage.getItem(CLOUD_CFG) || '{}'); }
  function setCfg(cfg){ localStorage.setItem(CLOUD_CFG, JSON.stringify(cfg)); }
  function getToken(){ return sessionStorage.getItem(TOKEN_KEY) || ''; }
  function setToken(token){ token ? sessionStorage.setItem(TOKEN_KEY, token) : sessionStorage.removeItem(TOKEN_KEY); }
  function headers(token){ return { 'Accept':'application/vnd.github+json', 'Authorization':`Bearer ${token}`, 'X-GitHub-Api-Version':'2022-11-28' }; }
  async function getRemote(token){
    const r = await fetch(`${API_FILE}?ref=${BRANCH}`, { headers: headers(token) });
    if(r.status === 404) return { exists:false, sha:null, payload:null };
    if(!r.ok) throw new Error(`GitHub read failed: ${r.status}`);
    const j = await r.json();
    const decoded = JSON.parse(decodeURIComponent(escape(atob(j.content.replace(/\n/g,'')))));
    return { exists:true, sha:j.sha, payload:decoded };
  }
  async function putRemote(token, payload, sha){
    const body = {
      message: 'Sync encrypted DR.Hu memory',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2)))),
      branch: BRANCH
    };
    if(sha) body.sha = sha;
    const r = await fetch(API_FILE, { method:'PUT', headers:{...headers(token),'Content-Type':'application/json'}, body:JSON.stringify(body) });
    if(!r.ok){ const txt = await r.text(); throw new Error(`GitHub write failed: ${r.status} ${txt.slice(0,120)}`); }
    return r.json();
  }
  function ensurePanel(){
    const memSection = document.querySelector('#memory .memory-grid');
    if(!memSection || document.getElementById('cloudPanel')) return;
    const cfg = getCfg();
    const panel = document.createElement('article');
    panel.className = 'board';
    panel.id = 'cloudPanel';
    panel.innerHTML = `
      <h3>Encrypted Cloud Sync</h3>
      <div class="cloud-panel">
        <h4>Cloud memory</h4>
        <p>把本地偏好加密后保存到 GitHub 文件 <code>${CLOUD_PATH}</code>。密钥只在浏览器内使用，仓库里只保存密文。</p>
        <div class="cloud-warning"><p><b>安全规则：</b>不要把 GitHub token 发给任何人；建议用 fine-grained token，仅授权 <code>${OWNER}/${REPO}</code> 的 Contents read/write。Token 默认只保存在本次浏览器会话。</p></div>
        <div class="cloud-grid">
          <input id="cloudToken" type="password" placeholder="GitHub fine-grained token · Contents read/write" autocomplete="off" />
          <input id="cloudPass" type="password" placeholder="Encryption passphrase · 用于加密/解密记忆" autocomplete="off" />
        </div>
        <div class="cloud-row">
          <label class="cloud-check"><input id="rememberPass" type="checkbox" ${cfg.rememberPass?'checked':''}/> 记住加密口令到本机</label>
          <label class="cloud-check"><input id="autoPull" type="checkbox" ${cfg.autoPull?'checked':''}/> 打开网页时自动拉取</label>
        </div>
        <div class="cloud-row">
          <button class="btn" id="cloudPush">Push encrypted memory</button>
          <button class="btn" id="cloudPull">Pull & merge memory</button>
          <button class="btn" id="cloudTest">Test connection</button>
        </div>
        <div class="cloud-status" id="cloudStatus">Cloud sync 未连接。</div>
      </div>`;
    memSection.appendChild(panel);
    $('#cloudToken').value = getToken();
    const rememberedPass = localStorage.getItem(PASS_KEY) || '';
    if(rememberedPass) $('#cloudPass').value = rememberedPass;
    bindPanel();
    if(cfg.autoPull && getToken() && ($('#cloudPass').value || rememberedPass)) setTimeout(()=>pull(true), 800);
  }
  function status(msg){ const s=$('#cloudStatus'); if(s) s.textContent = msg; }
  function getPass(){ return $('#cloudPass')?.value || localStorage.getItem(PASS_KEY) || ''; }
  function saveInputs(){
    const token = $('#cloudToken')?.value.trim() || '';
    const pass = $('#cloudPass')?.value || '';
    setToken(token);
    const cfg = getCfg();
    cfg.rememberPass = !!$('#rememberPass')?.checked;
    cfg.autoPull = !!$('#autoPull')?.checked;
    setCfg(cfg);
    if(cfg.rememberPass && pass) localStorage.setItem(PASS_KEY, pass); else localStorage.removeItem(PASS_KEY);
    return { token, pass };
  }
  function mergeMemory(local, remote){
    const out = {...local, ...remote};
    out.weights = {...(local.weights||{}), ...(remote.weights||{})};
    // choose max weight to preserve learned preference strength
    Object.keys(local.weights||{}).forEach(k => { out.weights[k] = Math.max(Number(local.weights[k]||0), Number(remote.weights?.[k]||0)); });
    ['saved','read','hidden'].forEach(k => { out[k] = [...new Set([...(local[k]||[]), ...(remote[k]||[])])]; });
    const events = [...(remote.events||[]), ...(local.events||[])];
    const seen = new Set();
    out.events = events.filter(e => { const key = `${e.time}|${e.type}|${e.id||e.title}`; if(seen.has(key)) return false; seen.add(key); return true; }).slice(0,160);
    out.updatedAt = new Date().toISOString();
    out.cloudMergedAt = new Date().toISOString();
    return out;
  }
  async function push(){
    try{
      const {token, pass} = saveInputs();
      if(!token) throw new Error('缺少 GitHub token');
      if(!pass || pass.length < 8) throw new Error('加密口令至少 8 位');
      status('Encrypting local memory...');
      const mem = getMemory();
      mem.cloud = { provider:'github', path:CLOUD_PATH, lastPushAt:new Date().toISOString(), passHint: await sha256(pass) };
      const payload = await encryptJson(mem, pass);
      status('Checking remote file...');
      const remote = await getRemote(token);
      status('Uploading encrypted memory...');
      await putRemote(token, payload, remote.sha);
      status(`已同步到云端：${CLOUD_PATH} · ${new Date().toLocaleString('zh-CN')}`);
      toast('Cloud memory 已上传');
    }catch(e){ status(e.message); toast('云同步失败'); }
  }
  async function pull(silent=false){
    try{
      const {token, pass} = saveInputs();
      if(!token) throw new Error('缺少 GitHub token');
      if(!pass || pass.length < 8) throw new Error('缺少加密口令');
      status('Reading encrypted cloud memory...');
      const remote = await getRemote(token);
      if(!remote.exists) throw new Error('云端记忆文件不存在，先 Push 一次');
      status('Decrypting...');
      const remoteMem = await decryptJson(remote.payload, pass);
      const merged = mergeMemory(getMemory(), remoteMem);
      setMemory(merged);
      status(`已拉取并合并云端记忆 · ${new Date().toLocaleString('zh-CN')}。刷新页面后排序会完全应用。`);
      if(!silent) toast('Cloud memory 已合并');
    }catch(e){ status(e.message); if(!silent) toast('云拉取失败'); }
  }
  async function test(){
    try{
      const {token, pass} = saveInputs();
      if(!token) throw new Error('缺少 GitHub token');
      status('Testing GitHub token...');
      const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, { headers: headers(token) });
      if(!r.ok) throw new Error(`Repo access failed: ${r.status}`);
      const remote = await getRemote(token);
      let msg = remote.exists ? '已找到云端记忆文件。' : '连接成功；云端记忆文件尚未创建。';
      if(pass && remote.exists){ try{ await decryptJson(remote.payload, pass); msg += ' 解密成功。'; }catch{ msg += ' 但口令无法解密。'; } }
      status(msg); toast('连接测试完成');
    }catch(e){ status(e.message); toast('连接失败'); }
  }
  function bindPanel(){
    $('#cloudPush')?.addEventListener('click', push);
    $('#cloudPull')?.addEventListener('click', ()=>pull(false));
    $('#cloudTest')?.addEventListener('click', test);
    $('#rememberPass')?.addEventListener('change', saveInputs);
    $('#autoPull')?.addEventListener('change', saveInputs);
    $('#cloudToken')?.addEventListener('change', saveInputs);
    $('#cloudPass')?.addEventListener('change', saveInputs);
  }
  document.addEventListener('DOMContentLoaded', ensurePanel);
  if(document.readyState !== 'loading') ensurePanel();
})();
