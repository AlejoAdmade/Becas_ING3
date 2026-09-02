window.BECA_SEED = {
  policies: [
    { id: "pol-2026-01", version: "2026.01", name: "PASE-U", minAverage: 3.0, minAttendance: 80, primaryAmount: 90, middleAmount: 120, highAmount: 150, effectiveFrom: "2026-01-01", active: true },
    { id: "pol-2025-03", version: "2025.03", name: "PASE-U", minAverage: 2.8, minAttendance: 75, primaryAmount: 90, middleAmount: 120, highAmount: 150, effectiveFrom: "2025-01-01", active: false }
  ],
  applications: [
    { id: "app-maria", publicId: "BC-2026-000142", name: "María González", nationalId: "8-111-111", email: "maria@estudiante.pa", province: "Panamá", school: "Instituto Nacional", level: "Media", average: 4.2, attendance: 94, period: "2026", policyVersion: "2026.01", policyMinAverage: 3.0, policyMinAttendance: 80, status: "APROBADA", reason: "Cumple con todos los criterios de la política 2026.01.", amount: 150, createdAt: "2026-08-28T14:21:00" },
    { id: "app-carlos", publicId: "BC-2026-000143", name: "Carlos Pérez", nationalId: "8-222-222", email: "carlos@estudiante.pa", province: "Chiriquí", school: "C.E.B.G. David", level: "Media", average: 2.5, attendance: 88, period: "2026", policyVersion: "2026.01", policyMinAverage: 3.0, policyMinAttendance: 80, status: "NO_ELEGIBLE", reason: "Promedio 2.5 inferior al mínimo requerido de 3.0.", amount: 0, createdAt: "2026-08-29T09:12:00" },
    { id: "app-ana", publicId: "BC-2026-000144", name: "Ana Rodríguez", nationalId: "8-333-333", email: "ana@estudiante.pa", province: "Colón", school: "Colegio Abel Bravo", level: "Premedia", average: 3.8, attendance: 91, period: "2026", policyVersion: "2026.01", policyMinAverage: 3.0, policyMinAttendance: 80, status: "APROBADA", reason: "Cumple con todos los criterios de la política 2026.01.", amount: 120, createdAt: "2026-08-30T11:45:00" },
    { id: "app-luis", publicId: "BC-2026-000145", name: "Luis Martínez", nationalId: "4-444-444", email: "luis@estudiante.pa", province: "Veraguas", school: "Instituto Urracá", level: "Primaria", average: 3.6, attendance: 72, period: "2026", policyVersion: "2026.01", policyMinAverage: 3.0, policyMinAttendance: 80, status: "NO_ELEGIBLE", reason: "Asistencia 72% inferior al mínimo requerido de 80%.", amount: 0, createdAt: "2026-08-31T16:05:00" }
  ],
  payments: [
    { id: "pay-maria-1", applicationId: "app-maria", installment: 1, amount: 150, reference: "PAY-88291", status: "PAGADO", paidAt: "2026-09-01T13:41:00" }
  ],
  audit: [
    { id: "aud-001", actor: "motor.reglas", action: "SOLICITUD_APROBADA", entityId: "app-maria", detail: "Política PASE-U 2026.01 aplicada correctamente.", severity: "INFO", createdAt: "2026-08-28T14:21:08" },
    { id: "aud-002", actor: "analista.023", action: "SOLICITUD_REVISADA", entityId: "app-maria", detail: "Validaciones académicas e identidad verificadas.", severity: "INFO", createdAt: "2026-08-28T15:03:12" },
    { id: "aud-003", actor: "finanzas.008", action: "PAGO_CONFIRMADO", entityId: "pay-maria-1", detail: "Desembolso confirmado. Referencia PAY-88291.", severity: "INFO", createdAt: "2026-09-01T13:41:00" },
    { id: "aud-004", actor: "motor.reglas", action: "SOLICITUD_NO_ELEGIBLE", entityId: "app-carlos", detail: "Promedio inferior al mínimo requerido.", severity: "ALERTA", createdAt: "2026-08-29T09:12:04" },
    { id: "aud-005", actor: "admin.politicas", action: "POLITICA_ACTIVADA", entityId: "pol-2026-01", detail: "Versión 2026.01 activada con vigencia 01/01/2026.", severity: "CAMBIO", createdAt: "2026-01-02T08:00:00" }
  ]
};
