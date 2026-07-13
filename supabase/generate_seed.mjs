import fs from 'fs'
import crypto from 'crypto'

const v4 = () => crypto.randomUUID()

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomEl = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

const FIRST_NAMES_MALE = ['Ramesh', 'Shivanna', 'Manjunath', 'Mahesh', 'Prakash', 'Raju', 'Kumar', 'Anand', 'Ganesh', 'Suresh', 'Kiran']
const FIRST_NAMES_FEMALE = ['Rakshitha', 'Lakshmi', 'Anitha', 'Kavya', 'Renuka', 'Radha', 'Sita', 'Meena', 'Geetha', 'Savitri']
const LAST_NAMES = ['Gowda', 'Nayaka', 'Reddy', 'Patil', 'Shetty', 'Kumar', 'Rao', 'Bhat', 'Hegde', 'Singh']
const VILLAGE_NAMES = ['Rampur', 'Devipur', 'Hosahalli', 'Kallur', 'Shirasi', 'Malandur', 'Hassan', 'Tumkur', 'Chikmagalur', 'Somwarpet']

const V_IDS = Array.from({ length: 10 }, () => v4())
const P_IDS = Array.from({ length: 120 }, () => v4())

let sql = `-- =====================================================================================
-- SETU PLATFORM — PHASE 4: REALISTIC DEMO DATA (Mysuru District)
-- =====================================================================================

`

// 1. Villages
sql += `-- ─── VILLAGES (10) ───────────────────────────────────────────────────────────────────\n`
sql += `INSERT INTO villages (id, name, district, distance_from_phc_km) VALUES\n`
const villages = V_IDS.map((id, i) => {
  return `('${id}', '${VILLAGE_NAMES[i]}', 'Mysuru', ${randomInt(2, 25)})`
})
sql += villages.join(',\n') + ';\n\n'

// 2. Patients
sql += `-- ─── PATIENTS (120) ──────────────────────────────────────────────────────────────────\n`
sql += `INSERT INTO patients (id, full_name, age, gender, phone, village_id, registered_date) VALUES\n`
const now = new Date()
const oneYearAgo = new Date(now)
oneYearAgo.setFullYear(now.getFullYear() - 1)

const patients = P_IDS.map((id) => {
  const isMale = Math.random() > 0.5
  const first = randomEl(isMale ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE)
  const last = randomEl(LAST_NAMES)
  const age = randomInt(35, 80)
  const phone = Math.random() > 0.3 ? `+919${randomInt(100000000, 999999999)}` : 'NULL'
  const vId = randomEl(V_IDS)
  const regDate = randomDate(oneYearAgo, now).toISOString().split('T')[0]
  return `('${id}', '${first} ${last}', ${age}, '${isMale ? 'male' : 'female'}', ${phone === 'NULL' ? 'NULL' : `'${phone}'`}, '${vId}', '${regDate}')`
})
sql += patients.join(',\n') + ';\n\n'

// 3. Screenings
sql += `-- ─── SCREENINGS (180) ────────────────────────────────────────────────────────────────\n`
sql += `INSERT INTO screenings (id, patient_id, screening_date, disease_type, bp_systolic, bp_diastolic, flagged_condition) VALUES\n`
const screenings = []
for (let i = 0; i < 180; i++) {
  const pId = randomEl(P_IDS)
  const sDate = randomDate(oneYearAgo, now).toISOString().split('T')[0]
  const sys = randomInt(110, 180)
  const dia = randomInt(70, 110)
  const flagged = sys > 140 || dia > 90
  screenings.push(`('${v4()}', '${pId}', '${sDate}', 'hypertension', ${sys}, ${dia}, ${flagged})`)
}
sql += screenings.join(',\n') + ';\n\n'

// 4. FollowUpVisits
sql += `-- ─── FOLLOW-UP VISITS (300) ──────────────────────────────────────────────────────────\n`
sql += `INSERT INTO followup_visits (id, patient_id, visit_date, bp_systolic, bp_diastolic, medication_adherent, expected_next_visit_date) VALUES\n`
const followups = []
for (let i = 0; i < 300; i++) {
  const pId = randomEl(P_IDS)
  const vDate = randomDate(oneYearAgo, now)
  const nextDate = new Date(vDate)
  nextDate.setDate(vDate.getDate() + 30)
  const sys = randomInt(120, 170)
  const dia = randomInt(80, 100)
  const adherent = Math.random() > 0.3
  followups.push(`('${v4()}', '${pId}', '${vDate.toISOString().split('T')[0]}', ${sys}, ${dia}, ${adherent}, '${nextDate.toISOString().split('T')[0]}')`)
}
sql += followups.join(',\n') + ';\n\n'

// 5. RiskScores
sql += `-- ─── RISK SCORES (120) ───────────────────────────────────────────────────────────────\n`
sql += `INSERT INTO risk_scores (id, patient_id, disease_type, score, risk_level, ai_reason, suggested_action) VALUES\n`
const risks = []
for (let i = 0; i < 120; i++) {
  const pId = P_IDS[i]
  const score = randomInt(10, 95)
  let level = 'low'
  if (score > 66) level = 'high'
  else if (score > 33) level = 'medium'
  const action = level === 'high' ? 'Immediate CHW home visit' : level === 'medium' ? 'Phone reminder' : 'Continue routine follow-up'
  risks.push(`('${v4()}', '${pId}', 'hypertension', ${score}, '${level}', 'Patient history indicates ${level} drop-out risk.', '${action}')`)
}
sql += risks.join(',\n') + ';\n\n'

// 6. Referrals
sql += `-- ─── REFERRALS (40) ──────────────────────────────────────────────────────────────────\n`
sql += `INSERT INTO referrals (id, patient_id, created_date, urgency, status) VALUES\n`
const referrals = []
for (let i = 0; i < 40; i++) {
  const pId = randomEl(P_IDS)
  const cDate = randomDate(oneYearAgo, now).toISOString().split('T')[0]
  const urg = randomEl(['routine', 'urgent', 'emergency'])
  const stat = randomEl(['pending', 'completed', 'no_show'])
  referrals.push(`('${v4()}', '${pId}', '${cDate}', '${urg}', '${stat}')`)
}
sql += referrals.join(',\n') + ';\n\n'

fs.writeFileSync('supabase/seed.sql', sql)
console.log('Generated supabase/seed.sql')
