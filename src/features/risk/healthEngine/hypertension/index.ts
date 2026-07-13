/**
 * Hypertension module public API.
 * Always import from this file, never from internal files.
 */

export { hypertensionModule } from './calculator'
export type { HypertensionRiskInput, HypertensionFactorWeights } from './types'
export { HYPERTENSION_FACTOR_WEIGHTS, HYPERTENSION_FACTOR_LABELS } from './riskFactors'
