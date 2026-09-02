const STORAGE_KEY = "becaclara_demo_v1";
let state = loadState();
let currentView = "resumen";

const app = document.getElementById("app");
const applicationDialog = document.getElementById("applicationDialog");
const policyDialog = document.getElementById("policyDialog");
const detailDialog = document.getElementById("detailDialog");

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(window.BECA_SEED); }
  catch { return structuredClone(window.BECA_SEED); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function uid(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`; }
function money(value) { return new Intl.NumberFormat("es-PA", { style: "currency", currency: "PAB" }).format(value); }
function date(value) { return new Intl.DateTimeFormat("es-PA", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)); }
function dateTime(value) { return new Intl.DateTimeFormat("es-PA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }
function activePolicy() { return state.policies.find(policy => policy.active); }
function approvedApplications() { return state.applications.filter(item => item.status === "APROBADA"); }
function statusLabel(status) { return status === "NO_ELEGIBLE" ? "NO ELEGIBLE" : status; }
function statusBadge(status) { return `<span class="status ${status === "APROBADA" || status === "PAGADO" ? "success" : "danger"}">${statusLabel(status)}</span>`; }
function showToast(message, type = "success") { const toast = document.getElementById("toast"); toast.textContent = message; toast.className = `toast show ${type}`; setTimeout(() => toast.className = "toast", 3800); }
function heading(eyebrow, title, copy, action = "") { return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${copy}</p></div>${action}</div>`; }
function audit(action, entityId, detail, severity = "INFO", actor = "sistema.demo") { state.audit.unshift({ id: uid("aud"), actor, action, entityId, detail, severity, createdAt: new Date().toISOString() }); }

function render(view = currentView) {
  currentView = view;
  document.querySelectorAll("[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  document.getElementById("mainNav").classList.remove("open");
  const views = { resumen: renderOverview, solicitudes: renderApplications, politicas: renderPolicies, pagos: renderPayments, auditoria: renderAudit, transparencia: renderTransparency };
  app.innerHTML = views[view]();
  bindViewActions();
}

function renderOverview() {
  const approved = approvedApplications();
  const paid = state.payments.reduce((sum, item) => sum + item.amount, 0);
  const policy = activePolicy();
  return `${heading("Centro de operaciones", "Decisiones claras. Pagos bajo control.", "Supervisa solicitudes, reglas vigentes y alertas desde un único punto de control.", '<button class="button primary" data-action="new-application">＋ Nueva solicitud</button>')}
  <section class="metrics">
    ${metric("Solicitudes", state.applications.length, "Periodo 2026", "blue", "S")}
    ${metric("Aprobadas", approved.length, `${Math.round(approved.length / state.applications.length * 100)}% de aprobación`, "green", "✓")}
    ${metric("No elegibles", state.applications.length - approved.length, "Con motivo verificable", "amber", "!")}
    ${metric("Monto pagado", money(paid), `${state.payments.length} desembolso confirmado`, "violet", "$")}
  </section>
  <section class="dashboard-grid">
    <article class="card table-card"><div class="card-head"><div><h2>Solicitudes recientes</h2><p>Resultados producidos por la política vigente</p></div><button class="text-button" data-view="solicitudes">Ver todas →</button></div>${applicationsTable(state.applications.slice(0, 5))}</article>
    <aside class="side-stack">
      <article class="policy-card"><div class="policy-top"><div><small>POLÍTICA ACTIVA</small><h2>PASE-U ${policy.version}</h2><p>Vigente desde ${date(policy.effectiveFrom)}</p></div><span>ACTIVA</span></div><div class="policy-values"><div><small>Promedio</small><strong>≥ ${policy.minAverage.toFixed(1)}</strong></div><div><small>Asistencia</small><strong>≥ ${policy.minAttendance}%</strong></div></div><button data-view="politicas">Administrar reglas →</button></article>
      <article class="card audit-preview"><div class="card-head"><div><h2>Trazabilidad operativa</h2><p>Acciones críticas registradas</p></div><b>◎</b></div>${state.audit.slice(0, 3).map(event => `<div class="mini-event"><i class="${event.severity.toLowerCase()}"></i><div><strong>${event.action.replaceAll("_", " ")}</strong><small>${dateTime(event.createdAt)} · ${event.actor}</small></div></div>`).join("")}</article>
    </aside>
  </section>`;
}
function metric(label, value, helper, tone, icon) { return `<article class="metric card"><div><p>${label}</p><strong>${value}</strong><small>${helper}</small></div><span class="${tone}">${icon}</span></article>`; }

function applicationsTable(applications) {
  if (!applications.length) return `<div class="empty">No hay solicitudes para mostrar.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Solicitud</th><th>Estudiante</th><th>Estado</th><th>Regla</th><th>Monto</th><th></th></tr></thead><tbody>${applications.map(item => `<tr><td><code>${item.publicId}</code><small>${date(item.createdAt)}</small></td><td><strong>${item.name}</strong><small>${item.nationalId} · ${item.province}</small></td><td>${statusBadge(item.status)}</td><td>v${item.policyVersion}</td><td><strong>${money(item.amount)}</strong></td><td><button class="text-button" data-detail="${item.id}">Ver →</button></td></tr>`).join("")}</tbody></table></div>`;
}
function renderApplications() {
  return `${heading("Gestión de beneficiarios", "Solicitudes", "Consulta el resultado, la regla aplicada y el motivo de cada decisión.", '<button class="button primary" data-action="new-application">＋ Crear y evaluar</button>')}
  <article class="card"><div class="toolbar"><label class="search">⌕ <input id="applicationSearch" placeholder="Buscar por nombre, cédula o solicitud"></label><select id="statusFilter"><option value="TODAS">Todos los estados</option><option value="APROBADA">Aprobadas</option><option value="NO_ELEGIBLE">No elegibles</option></select></div><div id="applicationTable">${applicationsTable(state.applications)}</div></article>`;
}
function filterApplications() { const term = document.getElementById("applicationSearch").value.toLowerCase(); const status = document.getElementById("statusFilter").value; const list = state.applications.filter(item => (!term || `${item.name} ${item.nationalId} ${item.publicId}`.toLowerCase().includes(term)) && (status === "TODAS" || item.status === status)); document.getElementById("applicationTable").innerHTML = applicationsTable(list); bindDetailButtons(); }

function renderPolicies() {
  const policy = activePolicy();
  const eligible = state.applications.filter(item => item.average >= policy.minAverage && item.attendance >= policy.minAttendance).length;
  return `${heading("Adaptabilidad normativa", "Motor de políticas", "Cambia requisitos y montos sin modificar el código. Las reglas anteriores permanecen disponibles.", '<button class="button primary" data-action="new-policy">＋ Nueva versión</button>')}
  <section class="policy-grid"><article class="card"><div class="card-head"><h2>Versiones de PASE-U</h2></div><div class="policy-list">${state.policies.map(item => `<div class="policy-row ${item.active ? "active" : ""}"><div class="policy-icon">⚙</div><div><div class="row-title"><strong>Versión ${item.version}</strong>${item.active ? '<span class="status success">VIGENTE</span>' : ""}</div><small>Desde ${date(item.effectiveFrom)}</small></div><div class="rules"><span><small>Promedio</small><b>≥ ${item.minAverage.toFixed(1)}</b></span><span><small>Asistencia</small><b>≥ ${item.minAttendance}%</b></span><span><small>Primaria</small><b>${money(item.primaryAmount)}</b></span><span><small>Media</small><b>${money(item.highAmount)}</b></span></div></div>`).join("")}</div></article>
  <aside class="side-stack"><article class="card simulator"><span class="sim-icon">✦</span><h2>Simulador de impacto</h2><p>Aplicación sobre la población demo</p><div class="sim-result"><strong>${eligible}</strong><span>de ${state.applications.length}<br>serían elegibles</span></div><div class="progress"><i style="width:${eligible / state.applications.length * 100}%"></i></div><small>Crea una nueva versión y observa cómo el sistema cambia sin tocar una sola línea de código.</small></article><article class="card note"><b>▣</b><div><h3>Histórico protegido</h3><p>Cada expediente conserva la versión normativa con la que fue evaluado.</p></div></article></aside></section>`;
}

function renderPayments() {
  const approved = approvedApplications();
  return `${heading("Control financiero", "Pagos y duplicidades", "Cada desembolso utiliza una llave única por solicitud y número de pago.")}
  <section class="payment-grid"><article class="card payment-form"><h2>Simular desembolso</h2><p>Si ya fue pagado, el motor bloqueará el intento.</p><label>Solicitud aprobada<select id="paymentApplication">${approved.map(item => `<option value="${item.id}">${item.publicId} · ${item.name}</option>`).join("")}</select></label><div class="unique-key" id="uniqueKey"></div><button class="button primary full" data-action="pay">Procesar pago 1</button><div class="warning-box">⚠ Prueba con María González: su pago ya existe y será bloqueado y auditado.</div></article>
  <article class="card table-card"><div class="card-head"><h2>Desembolsos confirmados</h2></div><div class="table-wrap"><table><thead><tr><th>Referencia</th><th>Beneficiario</th><th>Pago</th><th>Estado</th><th>Monto</th></tr></thead><tbody>${state.payments.map(payment => { const item = state.applications.find(a => a.id === payment.applicationId); return `<tr><td><code>${payment.reference}</code></td><td><strong>${item?.name || "—"}</strong><small>${item?.publicId || "—"}</small></td><td>Desembolso ${payment.installment}<small>${date(payment.paidAt)}</small></td><td>${statusBadge(payment.status)}</td><td><strong>${money(payment.amount)}</strong></td></tr>`; }).join("")}</tbody></table></div></article></section>`;
}

function renderAudit() {
  return `${heading("Control e integridad", "Bitácora de auditoría", "Registro cronológico de decisiones, cambios de política, pagos e intentos bloqueados.", '<button class="button secondary" data-action="reset">Restablecer demo</button>')}
  <section class="audit-grid"><article class="card timeline">${state.audit.map(event => `<div class="event"><span class="event-icon ${event.severity.toLowerCase()}">${event.severity === "CRITICO" ? "×" : event.severity === "CAMBIO" ? "⚙" : "✓"}</span><div><div class="event-title"><strong>${event.action.replaceAll("_", " ")}</strong><time>${dateTime(event.createdAt)}</time></div><p>${event.detail}</p><small>${event.actor} · ${event.entityId}</small></div></div>`).join("")}</article><aside class="card audit-note"><b>◎</b><h2>Trazabilidad completa</h2><p>Cada evento conserva actor, fecha, entidad afectada, severidad y explicación.</p><div><strong>100%</strong><small>de acciones críticas registradas</small></div></aside></section>`;
}

function renderTransparency() {
  const approved = approvedApplications();
  const paid = state.payments.reduce((sum, item) => sum + item.amount, 0);
  const approvedAmount = approved.reduce((sum, item) => sum + item.amount, 0);
  const provinces = Object.entries(state.applications.reduce((all, item) => ({ ...all, [item.province]: (all[item.province] || 0) + 1 }), {}));
  const max = Math.max(...provinces.map(([, total]) => total), 1);
  return `${heading("Datos abiertos sin datos personales", "Portal de transparencia", "Indicadores agregados para rendición de cuentas. No se publican cédulas, notas ni datos bancarios.")}
  <section class="public-metrics"><div><small>Solicitudes procesadas</small><strong>${state.applications.length}</strong></div><div><small>Beneficiarios aprobados</small><strong>${approved.length}</strong></div><div><small>Monto aprobado</small><strong>${money(approvedAmount)}</strong></div><div><small>Monto pagado</small><strong>${money(paid)}</strong></div></section>
  <section class="transparency-grid"><article class="card"><h2>Solicitudes por provincia</h2><p>Distribución de la población de demostración</p><div class="bars">${provinces.map(([province, total]) => `<div><span><b>${province}</b><small>${total}</small></span><i><em style="width:${total / max * 100}%"></em></i></div>`).join("")}</div></article><article class="card result-card"><h2>Resultado del periodo</h2><div><strong>${Math.round(approved.length / state.applications.length * 100)}%</strong><span>tasa de aprobación</span></div><p>🔒 Solo se muestran métricas agregadas, sin información que permita identificar estudiantes.</p></article></section>`;
}

function bindViewActions() {
  document.querySelectorAll("[data-action='new-application']").forEach(button => button.onclick = () => applicationDialog.showModal());
  document.querySelectorAll("[data-action='new-policy']").forEach(button => button.onclick = () => policyDialog.showModal());
  document.querySelectorAll("[data-action='pay']").forEach(button => button.onclick = processPayment);
  document.querySelectorAll("[data-action='reset']").forEach(button => button.onclick = resetDemo);
  const search = document.getElementById("applicationSearch"), filter = document.getElementById("statusFilter");
  if (search) search.oninput = filterApplications;
  if (filter) filter.onchange = filterApplications;
  const payment = document.getElementById("paymentApplication");
  if (payment) { const update = () => document.getElementById("uniqueKey").textContent = `${payment.value}:PASE-U:2026:PAGO-1`; payment.onchange = update; update(); }
  bindDetailButtons();
}
function bindDetailButtons() { document.querySelectorAll("[data-detail]").forEach(button => button.onclick = () => openDetail(button.dataset.detail)); }

function openDetail(id) {
  const item = state.applications.find(application => application.id === id);
  const steps = [
    ["Solicitud recibida", true, dateTime(item.createdAt)], ["Identidad validada", true, "Registro verificado"], ["Matrícula validada", true, item.school],
    ["Promedio validado", item.average >= item.policyMinAverage, `${item.average.toFixed(1)} / mínimo ${item.policyMinAverage.toFixed(1)}`],
    ["Asistencia validada", item.attendance >= item.policyMinAttendance, `${item.attendance}% / mínimo ${item.policyMinAttendance}%`],
    ["Duplicidad verificada", true, "Sin coincidencias"], ["Decisión emitida", item.status === "APROBADA", statusLabel(item.status)]
  ];
  document.getElementById("detailContent").innerHTML = `<div class="dialog-head"><div><p class="eyebrow">Expediente digital</p><h2>${item.publicId}</h2><p>${item.name} · ${item.nationalId}</p></div><button class="icon-button" data-close="detailDialog">×</button></div><div class="decision ${item.status === "APROBADA" ? "approved" : "rejected"}"><div><small>RESULTADO AUTOMÁTICO</small><h3>${statusLabel(item.status)}</h3></div><strong>${money(item.amount)}</strong><p>${item.reason}</p></div><h3 class="trace-title">Trazabilidad del expediente</h3><div class="trace">${steps.map(([label, ok, detail]) => `<div><span class="${ok ? "ok" : "fail"}">${ok ? "✓" : "×"}</span><p><strong>${label}</strong><small>${detail}</small></p></div>`).join("")}</div><div class="detail-footer"><span><small>Política aplicada</small><b>PASE-U ${item.policyVersion}</b></span><span><small>Periodo</small><b>${item.period}</b></span><span><small>Nivel</small><b>${item.level}</b></span></div>`;
  document.querySelector("[data-close='detailDialog']").onclick = () => detailDialog.close();
  detailDialog.showModal();
}

document.getElementById("applicationForm").onsubmit = event => {
  event.preventDefault(); const values = Object.fromEntries(new FormData(event.target));
  const duplicate = state.applications.find(item => item.nationalId === values.nationalId.trim() && item.period === "2026");
  if (duplicate) { audit("SOLICITUD_DUPLICADA_BLOQUEADA", duplicate.id, `Intento bloqueado: ya existe ${duplicate.publicId} para el periodo 2026.`, "CRITICO", "motor.duplicidad"); saveState(); applicationDialog.close(); showToast(`Solicitud duplicada: ya existe ${duplicate.publicId}.`, "error"); render("auditoria"); return; }
  const policy = activePolicy(), average = Number(values.average), attendance = Number(values.attendance), eligible = average >= policy.minAverage && attendance >= policy.minAttendance;
  const reasons = []; if (average < policy.minAverage) reasons.push(`Promedio ${average.toFixed(1)} inferior al mínimo requerido de ${policy.minAverage.toFixed(1)}.`); if (attendance < policy.minAttendance) reasons.push(`Asistencia ${attendance}% inferior al mínimo requerido de ${policy.minAttendance}%.`);
  const amounts = { Primaria: policy.primaryAmount, Premedia: policy.middleAmount, Media: policy.highAmount };
  const item = { id: uid("app"), publicId: `BC-2026-${String(Date.now()).slice(-6)}`, name: values.name.trim(), nationalId: values.nationalId.trim(), email: values.email.trim(), province: values.province, school: values.school.trim(), level: values.level, average, attendance, period: "2026", policyVersion: policy.version, policyMinAverage: policy.minAverage, policyMinAttendance: policy.minAttendance, status: eligible ? "APROBADA" : "NO_ELEGIBLE", reason: eligible ? `Cumple con todos los criterios de la política ${policy.version}.` : reasons.join(" "), amount: eligible ? amounts[values.level] : 0, createdAt: new Date().toISOString() };
  state.applications.unshift(item); audit(eligible ? "SOLICITUD_APROBADA" : "SOLICITUD_NO_ELEGIBLE", item.id, item.reason, eligible ? "INFO" : "ALERTA", "motor.reglas"); saveState(); event.target.reset(); applicationDialog.close(); showToast(`${item.publicId}: ${statusLabel(item.status)}`, eligible ? "success" : "error"); render("solicitudes");
};

document.getElementById("policyForm").onsubmit = event => {
  event.preventDefault(); const values = Object.fromEntries(new FormData(event.target));
  if (state.policies.some(item => item.version === values.version.trim())) { showToast("Esa versión ya existe.", "error"); return; }
  state.policies.forEach(item => item.active = false);
  const policy = { id: uid("pol"), version: values.version.trim(), name: "PASE-U", minAverage: Number(values.minAverage), minAttendance: Number(values.minAttendance), primaryAmount: Number(values.primaryAmount), middleAmount: Number(values.middleAmount), highAmount: Number(values.highAmount), effectiveFrom: values.effectiveFrom, active: true };
  state.policies.unshift(policy); audit("POLITICA_ACTIVADA", policy.id, `Versión ${policy.version} activada. Reglas futuras actualizadas sin modificar código.`, "CAMBIO", "admin.politicas"); saveState(); event.target.reset(); policyDialog.close(); showToast(`Política ${policy.version} activada.`); render("politicas");
};

function processPayment() {
  const applicationId = document.getElementById("paymentApplication").value;
  const item = state.applications.find(application => application.id === applicationId);
  const existing = state.payments.find(payment => payment.applicationId === applicationId && payment.installment === 1);
  if (existing) { audit("PAGO_DUPLICADO_BLOQUEADO", applicationId, `El desembolso 1 ya fue pagado con referencia ${existing.reference}.`, "CRITICO", "motor.duplicidad"); saveState(); showToast(`Pago duplicado bloqueado: ${existing.reference}.`, "error"); render("auditoria"); return; }
  const payment = { id: uid("pay"), applicationId, installment: 1, amount: item.amount, reference: `PAY-${String(Date.now()).slice(-7)}`, status: "PAGADO", paidAt: new Date().toISOString() };
  state.payments.unshift(payment); audit("PAGO_CONFIRMADO", payment.id, `Desembolso confirmado para ${item.publicId}. Referencia ${payment.reference}.`, "INFO", "finanzas.demo"); saveState(); showToast(`Pago confirmado: ${payment.reference}.`); render("pagos");
}
function resetDemo() { if (!confirm("¿Restablecer todos los datos de demostración?")) return; state = structuredClone(window.BECA_SEED); saveState(); showToast("Datos de demostración restablecidos."); render("resumen"); }

document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => render(button.dataset.view)));
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => document.getElementById(button.dataset.close).close()));
document.getElementById("menuButton").onclick = () => document.getElementById("mainNav").classList.toggle("open");
[applicationDialog, policyDialog, detailDialog].forEach(dialog => dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); }));
render();
