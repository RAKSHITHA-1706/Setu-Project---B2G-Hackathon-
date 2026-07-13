-- =====================================================================================
-- SETU PLATFORM — PHASE 2: DATABASE SCHEMA
-- =====================================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================================
-- 2. TABLES
-- =====================================================================================

-- ─── VILLAGES ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS villages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    distance_from_phc_km NUMERIC(5, 2) NOT NULL CHECK (distance_from_phc_km >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE villages IS 'Represents rural communities supported by the PHC.';
COMMENT ON COLUMN villages.distance_from_phc_km IS 'Distance to Primary Health Centre in kilometers (affects continuity risk).';

-- ─── PATIENTS ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 120),
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    phone TEXT,
    village_id UUID NOT NULL REFERENCES villages(id) ON DELETE RESTRICT,
    registered_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE patients IS 'Core patient demographics. Independent of specific diseases.';

-- ─── SCREENINGS ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS screenings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    screening_date DATE NOT NULL DEFAULT CURRENT_DATE,
    disease_type TEXT NOT NULL, -- e.g., 'hypertension', 'diabetes'
    bp_systolic INTEGER CHECK (bp_systolic > 0),
    bp_diastolic INTEGER CHECK (bp_diastolic > 0),
    flagged_condition BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE screenings IS 'Initial community screening events.';
COMMENT ON COLUMN screenings.disease_type IS 'Allows schema to support multiple diseases (e.g., hypertension, diabetes) without new tables.';
COMMENT ON COLUMN screenings.flagged_condition IS 'True if screening indicates need for PHC referral/treatment.';

-- ─── FOLLOWUP VISITS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS followup_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    bp_systolic INTEGER CHECK (bp_systolic > 0),
    bp_diastolic INTEGER CHECK (bp_diastolic > 0),
    medication_adherent BOOLEAN,
    chw_notes TEXT,
    expected_next_visit_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE followup_visits IS 'Routine touchpoints by CHWs for disease management tracking.';

-- ─── RISK SCORES ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS risk_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    disease_type TEXT NOT NULL, -- e.g., 'hypertension'
    score NUMERIC(5, 2) NOT NULL CHECK (score >= 0 AND score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    ai_reason TEXT,
    suggested_action TEXT,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE risk_scores IS 'Historical and current predictions from the Continuity of Care Risk Engine.';
COMMENT ON COLUMN risk_scores.ai_reason IS 'Human-readable explanation of why this risk score was assigned.';

-- ─── REFERRALS ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    urgency TEXT NOT NULL CHECK (urgency IN ('routine', 'urgent', 'emergency')),
    ai_summary TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'no_show'))
);

COMMENT ON TABLE referrals IS 'Referrals generated (either manually or AI-suggested) for a patient to visit a doctor/PHC.';

-- =====================================================================================
-- 3. INDEXES
-- =====================================================================================

CREATE INDEX IF NOT EXISTS idx_patients_village_id ON patients(village_id);
CREATE INDEX IF NOT EXISTS idx_screenings_patient_id ON screenings(patient_id);
CREATE INDEX IF NOT EXISTS idx_screenings_disease_type ON screenings(disease_type);
CREATE INDEX IF NOT EXISTS idx_followup_visits_patient_id ON followup_visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_patient_id ON risk_scores(patient_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_disease_type ON risk_scores(disease_type);
CREATE INDEX IF NOT EXISTS idx_referrals_patient_id ON referrals(patient_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- =====================================================================================
-- 4. ROW LEVEL SECURITY (RLS) - PERMISSIVE FOR HACKATHON MVP
-- =====================================================================================

ALTER TABLE villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE followup_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Villages
CREATE POLICY "Allow ALL on villages" ON villages FOR ALL USING (true) WITH CHECK (true);
-- Patients
CREATE POLICY "Allow ALL on patients" ON patients FOR ALL USING (true) WITH CHECK (true);
-- Screenings
CREATE POLICY "Allow ALL on screenings" ON screenings FOR ALL USING (true) WITH CHECK (true);
-- Followup Visits
CREATE POLICY "Allow ALL on followup_visits" ON followup_visits FOR ALL USING (true) WITH CHECK (true);
-- Risk Scores
CREATE POLICY "Allow ALL on risk_scores" ON risk_scores FOR ALL USING (true) WITH CHECK (true);
-- Referrals
CREATE POLICY "Allow ALL on referrals" ON referrals FOR ALL USING (true) WITH CHECK (true);
