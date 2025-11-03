// Persistencia de tema, filtro de servicios, ordenación de tabla, back-to-top y toast de formulario
(() => {
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  const KEY = 'tci-theme';
  const apply = (m)=>{ body.classList.toggle('theme-dark', m==='dark'); btn && (btn.textContent = m==='dark'?'☀️':'🌙'); btn?.setAttribute('aria-pressed', m==='dark'?'true':'false'); };
  apply(localStorage.getItem(KEY)||'light');
  btn?.addEventListener('click', ()=>{ const next = body.classList.contains('theme-dark')?'light':'dark'; localStorage.setItem(KEY,next); apply(next); });
})();

// Filtro de servicios (si existe)
(() => {
  const input = document.getElementById('serviceSearch');
  if (!input) return;
  const cards = Array.from(document.querySelectorAll('#gridServicios .card'));
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    cards.forEach(c => c.parentElement.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none');
  });
})();

// Ordenación de tabla (si existe)
(() => {
  const table = document.querySelector('table[data-sortable="true"]');
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const ths = table.querySelectorAll('thead th[data-key]');
  const parseUnidades = (t)=>{
    t = t.toLowerCase();
    if (t.includes('hasta')) { const n = parseInt(t.replace(/\D+/g,'')); return isNaN(n)?0:n; }
    const m = t.match(/(\d+)\D+(\d+)/); if (m) return parseInt(m[1]);
    const n = parseInt(t.replace(/\D+/g,'')); return isNaN(n)?0:n;
  };
  let state = {};
  ths.forEach((th,i)=>{
    th.style.cursor='pointer'; th.title='Ordenar';
    th.addEventListener('click',()=>{
      const key = th.dataset.key; const dir = state[key]==='asc'?'desc':'asc'; state={ [key]:dir };
      const rows = Array.from(tbody.querySelectorAll('tr'));
      rows.sort((a,b)=>{
        const A = a.children[i].textContent.trim(); const B = b.children[i].textContent.trim();
        const va = key==='unidades'?parseUnidades(A): key==='precio'?parseFloat(A.replace(/[^\d.,-]/g,'').replace('.','').replace(',','.'))||1e12 : A.toLowerCase();
        const vb = key==='unidades'?parseUnidades(B): key==='precio'?parseFloat(B.replace(/[^\d.,-]/g,'').replace('.','').replace(',','.'))||1e12 : B.toLowerCase();
        return (va<vb? -1 : va>vb? 1 : 0) * (dir==='asc'?1:-1);
      });
      rows.forEach(r=>tbody.appendChild(r));
      ths.forEach(h=>h.classList.remove('sorted-asc','sorted-desc')); th.classList.add(dir==='asc'?'sorted-asc':'sorted-desc');
    });
  });
})();

// Back to top (insert auto si no existe)
(() => {
  if (!document.getElementById('backToTop')) {
    const b=document.createElement('button'); b.id='backToTop'; b.className='btn btn-primary position-fixed'; b.style.right='1rem'; b.style.bottom='4.4rem'; b.style.display='none'; b.textContent='↑'; b.setAttribute('aria-label','Volver al inicio'); document.body.appendChild(b);
    const show=()=>{ b.style.display = window.scrollY>240? '':'none'; }; window.addEventListener('scroll',show); show();
    b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }
})();

// Formulario + toast (si existe)
(() => {
  const form = document.querySelector('form.needs-validation');
  if (!form) return;
  if (!document.getElementById('submitToast')) {
    const wrap=document.createElement('div'); wrap.className='position-fixed bottom-0 start-50 translate-middle-x p-3'; wrap.style.zIndex='1080';
    wrap.innerHTML=`<div id="submitToast" class="toast align-items-center text-bg-success border-0" role="status" aria-live="polite" aria-atomic="true"><div class="d-flex"><div class="toast-body">¡Gracias! Hemos recibido tu solicitud. Te contactaremos pronto.</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div></div>`;
    document.body.appendChild(wrap);
  }
  form.addEventListener('submit', (e)=>{
    if (!form.checkValidity()) { e.preventDefault(); e.stopPropagation(); form.classList.add('was-validated'); return; }
    e.preventDefault(); form.classList.remove('was-validated'); form.reset();
    const el=document.getElementById('submitToast'); if (el && window.bootstrap?.Toast){ new bootstrap.Toast(el,{delay:3000}).show(); } else { alert('¡Formulario enviado!'); }
  });
})();