import type { Patient, Village, FollowUpVisit } from './types'
import { calculateContinuityRisk } from './calculator'

const mockVillage: Village = { id: 'v1', name: 'Rampur', distanceFromPhcKm: 5 }
const remoteVillage: Village = { id: 'v2', name: 'Devipur', distanceFromPhcKm: 18 } // Close to 20km cap

const today = new Date('2024-03-15T10:00:00Z')

// Helper to easily create visits
function createVisit(dateStr: string, systolic: number, adherent: boolean, expectedNextStr: string): FollowUpVisit {
  return {
    id: Math.random().toString(),
    visitDate: new Date(dateStr),
    bpSystolic: systolic,
    bpDiastolic: 80,
    medicationAdherent: adherent,
    expectedNextVisitDate: new Date(expectedNextStr)
  }
}

/**
 * TEST CASE 1: Missed follow-up (Overdue)
 * Patient is overdue by 45 days. 
 * Expected: High risk primarily driven by the OVERDUE factor.
 */
const patient1: Patient = { id: 'p1', fullName: 'Ramesh Kumar', age: 55, gender: 'male' }
const visits1: FollowUpVisit[] = [
  createVisit('2023-12-01T10:00:00Z', 130, true, '2024-01-01T10:00:00Z'), // Expected Jan 1, but today is Mar 15 (74 days overdue, cap is usually 60)
  createVisit('2023-11-01T10:00:00Z', 130, true, '2023-12-01T10:00:00Z')
]

/**
 * TEST CASE 2: Poor adherence
 * Patient is on time, BP is stable, but they rarely take medication.
 * Expected: Medium/High risk driven by ADHERENCE factor.
 */
const patient2: Patient = { id: 'p2', fullName: 'Sita Devi', age: 60, gender: 'female' }
const visits2: FollowUpVisit[] = [
  createVisit('2024-03-10T10:00:00Z', 135, false, '2024-04-10T10:00:00Z'), // On time
  createVisit('2024-02-10T10:00:00Z', 135, false, '2024-03-10T10:00:00Z'),
  createVisit('2024-01-10T10:00:00Z', 135, false, '2024-02-10T10:00:00Z')
]

/**
 * TEST CASE 3: Rising BP & High Severity
 * Patient takes meds and visits on time, but BP is dangerously increasing.
 * Expected: Medium/High risk driven by BP_TREND and SEVERITY factors.
 */
const patient3: Patient = { id: 'p3', fullName: 'Anil Sharma', age: 48, gender: 'male' }
const visits3: FollowUpVisit[] = [
  createVisit('2024-03-14T10:00:00Z', 180, true, '2024-04-14T10:00:00Z'), // On time, BP 180!
  createVisit('2024-02-14T10:00:00Z', 160, true, '2024-03-14T10:00:00Z'),
  createVisit('2024-01-14T10:00:00Z', 140, true, '2024-02-14T10:00:00Z')
]

/**
 * TEST CASE 4: Remote village & Slight Overdue
 * Patient lives very far away (18km) and is slightly overdue (10 days).
 * Expected: Medium risk, driven by DISTANCE and slight OVERDUE.
 */
const patient4: Patient = { id: 'p4', fullName: 'Kamla Bai', age: 65, gender: 'female' }
const visits4: FollowUpVisit[] = [
  createVisit('2024-02-05T10:00:00Z', 130, true, '2024-03-05T10:00:00Z'), // Overdue by 10 days
  createVisit('2024-01-05T10:00:00Z', 130, true, '2024-02-05T10:00:00Z')
]

/**
 * TEST CASE 5: Well-controlled patient
 * On time, good BP, good adherence, close to PHC.
 * Expected: Low risk.
 */
const patient5: Patient = { id: 'p5', fullName: 'Vikram Singh', age: 50, gender: 'male' }
const visits5: FollowUpVisit[] = [
  createVisit('2024-03-14T10:00:00Z', 118, true, '2024-04-14T10:00:00Z'),
  createVisit('2024-02-14T10:00:00Z', 120, true, '2024-03-14T10:00:00Z')
]

/**
 * RUNNER 
 * Used to manually verify the logic.
 */
export function runTests() {
  console.log('--- SETU CONTINUITY RISK ENGINE TESTS ---\n')
  
  const cases = [
    { name: 'Missed Follow-up', p: patient1, v: mockVillage, vi: visits1 },
    { name: 'Poor Adherence', p: patient2, v: mockVillage, vi: visits2 },
    { name: 'Rising BP & Severity', p: patient3, v: mockVillage, vi: visits3 },
    { name: 'Remote Village + Slight Overdue', p: patient4, v: remoteVillage, vi: visits4 },
    { name: 'Well-controlled', p: patient5, v: mockVillage, vi: visits5 },
  ]

  cases.forEach((c) => {
    const result = calculateContinuityRisk(c.p, c.v, c.vi, today)
    console.log(`[TEST CASE] ${c.name}`)
    console.log(`Score: ${result.score}/100 => Level: ${result.level}`)
    console.log(`Action: ${result.suggestedAction}`)
    console.log('Explanations:')
    result.explanations.forEach(exp => console.log(`  - ${exp}`))
    console.log('\n----------------------------------------\n')
  })
}
