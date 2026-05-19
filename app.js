/* ═══════════════════════════════════════════
   ESEN — app.js
   Lógica principal del aplicativo web:
   autenticación, navegación, CRUD actividades,
   reportes y vistas de estudiante.
═══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   ESTADO GLOBAL
───────────────────────────────────────── */
let currentUser = null;
let loginRole   = 'admin';
let editingId   = null;
let deletingId  = null;

/* ─────────────────────────────────────────
   AUTENTICACIÓN
───────────────────────────────────────── */

/** Cambia la pestaña activa en el login */
function switchTab(role) {
  loginRole = role;
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active',
      (i === 0 && role === 'admin') || (i === 1 && role === 'student')
    );
  });
}

/** Valida credenciales e inicia sesión */
function doLogin() {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  const userData = USERS[username];

  if (!userData || userData.pass !== password || userData.role !== loginRole) {
    document.getElementById('error-box').style.display = 'block';
    return;
  }

  document.getElementById('error-box').style.display = 'none';
  currentUser = { ...userData, username };
  startApp();
}

/** Cierra sesión y vuelve al login */
function doLogout() {
  currentUser = null;
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('main-screen').classList.remove('active');
}

/** Inicializa la interfaz principal tras el login */
function startApp() {
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('main-screen').classList.add('active');

  // Sidebar: datos del usuario
  document.getElementById('sidebar-avatar').textContent  = currentUser.initials;
  document.getElementById('sidebar-avatar').className    = 'user-avatar ' + currentUser.role;
  document.getElementById('sidebar-name').textContent    = currentUser.name;
  document.getElementById('sidebar-role').textContent    = currentUser.role === 'admin'
    ? 'Administrador del Sistema'
    : `${currentUser.school || ''} · ${currentUser.code || ''}`;

  // Navs por rol
  document.getElementById('nav-admin').style.display   = currentUser.role === 'admin'   ? 'block' : 'none';
  document.getElementById('nav-student').style.display = currentUser.role === 'student' ? 'block' : 'none';

  // Fecha actual
  document.getElementById('current-date').textContent = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // Pantalla inicial según rol
  showSection(currentUser.role === 'admin' ? 'dashboard' : 'my-activities');
  updateStats();
}

/* ─────────────────────────────────────────
   NAVEGACIÓN
───────────────────────────────────────── */

const SECTION_META = {
  'dashboard':     { title: 'Dashboard',               sub: 'Resumen general del sistema' },
  'activities':    { title: 'Gestionar Actividades',   sub: 'Registro y gestión de actividades extracurriculares' },
  'students':      { title: 'Estudiantes',             sub: 'Relación de estudiantes y participaciones' },
  'reports':       { title: 'Reportes',                sub: 'Generar reportes por categoría, fecha o resolución' },
  'my-activities': { title: 'Mis Actividades',         sub: 'Actividades extracurriculares en las que participé' },
  'my-history':    { title: 'Mi Historial',            sub: 'Historial completo de participación y horas acumuladas' },
};

function showSection(id) {
  // Ocultar todas las secciones y desactivar nav items
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Activar sección y nav item
  document.getElementById('section-' + id).classList.add('active');
  const activeBtn = [...document.querySelectorAll('.nav-item')]
    .find(b => b.getAttribute('onclick')?.includes("'" + id + "'"));
  if (activeBtn) activeBtn.classList.add('active');

  // Actualizar topbar
  const meta = SECTION_META[id];
  if (meta) {
    document.getElementById('page-title').textContent = meta.title;
    document.getElementById('page-sub').textContent   = meta.sub;
  }

  // Renderizar contenido de la sección
  const renderers = {
    'dashboard':     () => { updateStats(); renderDashboard(); },
    'activities':    renderTable,
    'students':      renderStudents,
    'reports':       renderReport,
    'my-activities': renderMyActivities,
    'my-history':    renderMyHistory,
  };
  if (renderers[id]) renderers[id]();
}

/* ─────────────────────────────────────────
   ESTADÍSTICAS
───────────────────────────────────────── */

function updateStats() {
  const totalHours = activities.reduce((sum, a) => sum + Number(a.horas), 0);
  document.getElementById('stat-total').textContent    = activities.length;
  document.getElementById('stat-students').textContent = STUDENTS.length;
  document.getElementById('stat-hours').textContent    = totalHours;
}

/* ─────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────── */

function renderDashboard() {
  const tbody  = document.getElementById('dashboard-table');
  const recent = [...activities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  tbody.innerHTML = recent.map(a => `
    <tr>
      <td><b>${a.name}</b></td>
      <td>${buildBadge(a.cat)}</td>
      <td>${formatDate(a.date)}</td>
      <td>${a.horas} hrs</td>
      <td>${buildStatusBadge(a.status)}</td>
    </tr>
  `).join('');
}

/* ─────────────────────────────────────────
   TABLA DE ACTIVIDADES (Admin)
───────────────────────────────────────── */

function renderTable() {
  const search = document.getElementById('filter-search').value.toLowerCase();
  const cat    = document.getElementById('filter-cat').value;
  const year   = document.getElementById('filter-year').value;

  const filtered = activities.filter(a =>
    (!search || a.name.toLowerCase().includes(search) || a.resolucion.toLowerCase().includes(search)) &&
    (!cat    || a.cat === cat) &&
    (!year   || a.date.startsWith(year))
  );

  const tbody = document.getElementById('activities-table');

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr><td colspan="9">
        <div class="empty-state">
          <div class="icon">📭</div>
          <p>No se encontraron actividades con esos filtros.</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((a, i) => `
    <tr>
      <td style="color:var(--gray-400)">${i + 1}</td>
      <td>
        <b>${a.name}</b><br>
        <span style="font-size:12px;color:var(--gray-400)">${a.desc || ''}</span>
      </td>
      <td>${buildBadge(a.cat)}</td>
      <td>${formatDate(a.date)}</td>
      <td><span style="font-family:monospace;font-size:12.5px">${a.resolucion}</span></td>
      <td><b>${a.horas}</b> hrs</td>
      <td>${a.students.length} est.</td>
      <td>${buildStatusBadge(a.status)}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon" onclick="openModal('edit', ${a.id})" title="Editar">✏️</button>
          <button class="btn-icon danger" onclick="askDelete(${a.id})" title="Eliminar">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ─────────────────────────────────────────
   TABLA DE ESTUDIANTES (Admin)
───────────────────────────────────────── */

function renderStudents() {
  const tbody = document.getElementById('students-table');
  tbody.innerHTML = STUDENTS.map(s => {
    const myActs = activities.filter(a => a.students.includes(s.code));
    const hours  = myActs.reduce((sum, a) => sum + Number(a.horas), 0);
    const pct    = Math.min(hours / 2, 100);
    return `
      <tr>
        <td><span style="font-family:monospace;font-size:12px">${s.code}</span></td>
        <td><b>${s.name}</b></td>
        <td>${s.dni}</td>
        <td>${s.school}</td>
        <td>${myActs.length} actividades</td>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <b>${hours}</b> hrs
            <div class="progress-bar-wrap">
              <div class="progress-bar" style="width:${pct}%"></div>
            </div>
          </div>
        </td>
        <td>${hours >= 20
          ? '<span class="badge badge-green">✅ Cumple</span>'
          : '<span class="badge badge-amber">⏳ En curso</span>'
        }</td>
      </tr>`;
  }).join('');
}

/* ─────────────────────────────────────────
   REPORTES (Admin)
───────────────────────────────────────── */

function renderReport() {
  const cat    = document.getElementById('rep-cat').value;
  const year   = document.getElementById('rep-year').value;
  const filtered = activities.filter(a =>
    (!cat  || a.cat === cat) &&
    (!year || a.date.startsWith(year))
  );

  const totalHours   = filtered.reduce((s, a) => s + Number(a.horas), 0);
  const allStudents  = new Set(filtered.flatMap(a => a.students));
  const avgHours     = filtered.length ? Math.round(totalHours / filtered.length) : 0;

  document.getElementById('report-output').innerHTML = `
    <div class="report-card">
      <div class="report-card-title">📊 Resumen del Reporte</div>
      <div class="report-row"><span class="key">Total de actividades</span><span class="val">${filtered.length}</span></div>
      <div class="report-row"><span class="key">Total de horas acumuladas</span><span class="val">${totalHours} hrs</span></div>
      <div class="report-row"><span class="key">Estudiantes involucrados</span><span class="val">${allStudents.size}</span></div>
      <div class="report-row"><span class="key">Promedio horas por actividad</span><span class="val">${avgHours} hrs</span></div>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Actividad</th><th>Categoría</th><th>Fecha</th>
            <th>N° Resolución</th><th>Horas</th><th>Estudiantes</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(a => `
            <tr>
              <td><b>${a.name}</b></td>
              <td>${buildBadge(a.cat)}</td>
              <td>${formatDate(a.date)}</td>
              <td><span style="font-family:monospace;font-size:12px">${a.resolucion}</span></td>
              <td>${a.horas} hrs</td>
              <td>${a.students.length}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function generateReport() {
  renderReport();
  showToast('Reporte generado exitosamente', 'success');
}

/* ─────────────────────────────────────────
   MIS ACTIVIDADES (Estudiante)
───────────────────────────────────────── */

function renderMyActivities() {
  const myActs = activities.filter(a => a.students.includes(currentUser.username));
  const hours  = myActs.reduce((s, a) => s + Number(a.horas), 0);
  const last   = [...myActs].sort((a, b) => b.date.localeCompare(a.date))[0];

  document.getElementById('my-count').textContent = myActs.length;
  document.getElementById('my-hours').textContent = hours;
  document.getElementById('my-last').textContent  = last
    ? (last.name.length > 20 ? last.name.slice(0, 20) + '…' : last.name)
    : '—';

  const tbody = document.getElementById('my-activities-table');
  if (!myActs.length) {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state">
          <div class="icon">📋</div>
          <p>Aún no tienes actividades registradas.</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = myActs.map(a => `
    <tr>
      <td><b>${a.name}</b></td>
      <td>${buildBadge(a.cat)}</td>
      <td>${formatDate(a.date)}</td>
      <td><span style="font-family:monospace;font-size:12px">${a.resolucion}</span></td>
      <td><b>${a.horas}</b> hrs</td>
      <td>${buildStatusBadge(a.status)}</td>
    </tr>
  `).join('');
}

function renderMyHistory() {
  const myActs = [...activities.filter(a => a.students.includes(currentUser.username))]
    .sort((a, b) => b.date.localeCompare(a.date));
  const tbody = document.getElementById('my-history-table');

  if (!myActs.length) {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state">
          <div class="icon">⏱️</div>
          <p>No hay historial disponible.</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = myActs.map(a => `
    <tr>
      <td>${formatDate(a.date)}</td>
      <td><b>${a.name}</b></td>
      <td>${buildBadge(a.cat)}</td>
      <td>${a.horas} hrs</td>
      <td><span style="font-family:monospace;font-size:12px">${a.resolucion}</span></td>
      <td>${buildStatusBadge(a.status)}</td>
    </tr>
  `).join('');
}

/* ─────────────────────────────────────────
   MODAL — CREAR / EDITAR ACTIVIDAD
───────────────────────────────────────── */

function buildStudentCheckboxes(selected = []) {
  document.getElementById('student-checkboxes').innerHTML = STUDENTS.map(s => `
    <label>
      <input type="checkbox" value="${s.code}" ${selected.includes(s.code) ? 'checked' : ''}>
      <b>${s.code}</b> — ${s.name} (${s.school})
    </label>
  `).join('');
}

function openModal(mode, id = null) {
  editingId = null;
  document.getElementById('modal-error').style.display = 'none';

  if (mode === 'add') {
    document.getElementById('modal-title').textContent = '➕ Nueva Actividad';
    ['f-name','f-cat','f-date','f-resolucion','f-horas','f-desc'].forEach(fid => {
      document.getElementById(fid).value = '';
    });
    document.getElementById('f-status').value = 'Activo';
    buildStudentCheckboxes([]);
  } else {
    const a = activities.find(x => x.id === id);
    if (!a) return;
    editingId = id;
    document.getElementById('modal-title').textContent    = '✏️ Editar Actividad';
    document.getElementById('f-name').value               = a.name;
    document.getElementById('f-cat').value                = a.cat;
    document.getElementById('f-date').value               = a.date;
    document.getElementById('f-resolucion').value         = a.resolucion;
    document.getElementById('f-horas').value              = a.horas;
    document.getElementById('f-desc').value               = a.desc || '';
    document.getElementById('f-status').value             = a.status;
    buildStudentCheckboxes(a.students);
  }

  document.getElementById('modal-activity').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-activity').classList.remove('open');
  editingId = null;
}

function saveActivity() {
  const name      = document.getElementById('f-name').value.trim();
  const cat       = document.getElementById('f-cat').value;
  const date      = document.getElementById('f-date').value;
  const resolucion= document.getElementById('f-resolucion').value.trim();
  const horas     = document.getElementById('f-horas').value;

  if (!name || !cat || !date || !resolucion || !horas) {
    document.getElementById('modal-error').style.display = 'block';
    return;
  }

  document.getElementById('modal-error').style.display = 'none';

  const selected = [...document.querySelectorAll('#student-checkboxes input:checked')]
    .map(c => c.value);

  const data = {
    name,
    cat,
    date,
    resolucion,
    horas: Number(horas),
    desc: document.getElementById('f-desc').value,
    status: document.getElementById('f-status').value,
    students: selected,
  };

  if (editingId) {
    const idx = activities.findIndex(a => a.id === editingId);
    activities[idx] = { ...activities[idx], ...data };
    showToast('Actividad actualizada correctamente', 'success');
  } else {
    activities.push({ id: nextId++, ...data });
    showToast('Actividad registrada exitosamente', 'success');
  }

  closeModal();
  renderTable();
  updateStats();
}

/* ─────────────────────────────────────────
   ELIMINAR ACTIVIDAD
───────────────────────────────────────── */

function askDelete(id) {
  deletingId = id;
  document.getElementById('modal-confirm').classList.add('open');
}

function closeConfirm() {
  document.getElementById('modal-confirm').classList.remove('open');
  deletingId = null;
}

function confirmDelete() {
  activities = activities.filter(a => a.id !== deletingId);
  closeConfirm();
  renderTable();
  updateStats();
  showToast('Actividad eliminada', 'danger');
}

/* ─────────────────────────────────────────
   UTILIDADES
───────────────────────────────────────── */

const CAT_COLORS = {
  'Cultural':     'badge-blue',
  'Deportivo':    'badge-green',
  'Académico':    'badge-amber',
  'Social':       'badge-gray',
  'Voluntariado': 'badge-blue',
};

function buildBadge(cat) {
  const cls = CAT_COLORS[cat] || 'badge-gray';
  return `<span class="badge ${cls}">${cat}</span>`;
}

function buildStatusBadge(status) {
  return status === 'Activo'
    ? `<span class="badge badge-green">● Activo</span>`
    : `<span class="badge badge-gray">○ Inactivo</span>`;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const MONTHS = ['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${d} ${MONTHS[+m]} ${y}`;
}

function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = (type === 'success' ? '✅ ' : '🗑️ ') + msg;
  el.className   = `toast show ${type}`;
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ─────────────────────────────────────────
   EVENTOS GLOBALES
───────────────────────────────────────── */

// Cerrar modales al hacer click en el overlay
document.getElementById('modal-activity').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.getElementById('modal-confirm').addEventListener('click', function(e) {
  if (e.target === this) closeConfirm();
});

// Login con tecla Enter
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('login-screen').classList.contains('active')) {
    doLogin();
  }
});
