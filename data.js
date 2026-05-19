/* ═══════════════════════════════════════════
   ESEN — data.js
   Datos del sistema: usuarios, estudiantes y
   actividades extracurriculares iniciales.
═══════════════════════════════════════════ */

/* ── USUARIOS DEL SISTEMA ── */
const USERS = {
  'admin': {
    pass: 'admin123',
    role: 'admin',
    name: 'Administrador',
    initials: 'AD'
  },
  'EST001': {
    pass: '123456',
    role: 'student',
    name: 'María García López',
    initials: 'MG',
    code: 'EST001',
    dni: '74521836',
    school: 'Ing. de Sistemas'
  },
  'EST002': {
    pass: '123456',
    role: 'student',
    name: 'Carlos Ramos Torres',
    initials: 'CR',
    code: 'EST002',
    dni: '72314589',
    school: 'Administración'
  },
  'EST003': {
    pass: '123456',
    role: 'student',
    name: 'Ana Flores Huanca',
    initials: 'AF',
    code: 'EST003',
    dni: '70145623',
    school: 'Contabilidad'
  }
};

/* ── CATÁLOGO DE ESTUDIANTES ── */
const STUDENTS = [
  { code: 'EST001', name: 'María García López',   dni: '74521836', school: 'Ing. de Sistemas' },
  { code: 'EST002', name: 'Carlos Ramos Torres',  dni: '72314589', school: 'Administración' },
  { code: 'EST003', name: 'Ana Flores Huanca',    dni: '70145623', school: 'Contabilidad' },
  { code: 'EST004', name: 'Luis Quispe Mamani',   dni: '76892134', school: 'Ing. de Sistemas' },
  { code: 'EST005', name: 'Sofía Mendoza Cruz',   dni: '71234567', school: 'Derecho' },
];

/* ── ACTIVIDADES EXTRACURRICULARES ── */
let activities = [
  {
    id: 1,
    name: 'Festival Cultural Aniversario',
    cat: 'Cultural',
    date: '2025-04-10',
    resolucion: 'RES-2025-012',
    horas: 12,
    status: 'Activo',
    desc: 'Celebración cultural por aniversario institucional',
    students: ['EST001', 'EST003', 'EST005']
  },
  {
    id: 2,
    name: 'Torneo Interescolar de Fútbol',
    cat: 'Deportivo',
    date: '2025-03-22',
    resolucion: 'RES-2025-008',
    horas: 8,
    status: 'Activo',
    desc: 'Competencia deportiva entre escuelas',
    students: ['EST002', 'EST004']
  },
  {
    id: 3,
    name: 'Congreso de Investigación 2025',
    cat: 'Académico',
    date: '2025-02-14',
    resolucion: 'RES-2025-003',
    horas: 16,
    status: 'Activo',
    desc: 'Presentación de proyectos de investigación estudiantil',
    students: ['EST001', 'EST002', 'EST004']
  },
  {
    id: 4,
    name: 'Campaña de Reforestación',
    cat: 'Voluntariado',
    date: '2025-01-20',
    resolucion: 'RES-2025-001',
    horas: 6,
    status: 'Inactivo',
    desc: 'Actividad de responsabilidad ambiental',
    students: ['EST003', 'EST005']
  },
  {
    id: 5,
    name: 'Feria Emprendedora',
    cat: 'Social',
    date: '2024-11-30',
    resolucion: 'RES-2024-098',
    horas: 10,
    status: 'Activo',
    desc: 'Exposición de proyectos de emprendimiento',
    students: ['EST001', 'EST002', 'EST003']
  },
];

/* Contador autoincremental para IDs */
let nextId = 6;
