-- 1. GL Mapping Master (ZTFI_LOAN_GL)
CREATE TABLE ztfi_loan_gl (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bukrs VARCHAR(4) NOT NULL DEFAULT '1000',
    loan_type VARCHAR(20) NOT NULL UNIQUE,
    principal_gl VARCHAR(10) NOT NULL,
    interest_exp_gl VARCHAR(10) NOT NULL,
    interest_accrual_gl VARCHAR(10) NOT NULL,
    bank_clearing_gl VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Interest Rate Master (ZTFI_LOAN_ROI)
CREATE TABLE ztfi_loan_roi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id VARCHAR(10) NOT NULL,
    effective_from DATE NOT NULL,
    rate_of_interest NUMERIC(5,2) NOT NULL,
    calc_basis VARCHAR(20) DEFAULT 'ACTUAL_365',
    compounding_freq VARCHAR(20) DEFAULT 'SIMPLE'
);

-- 3. Sanction Limits Master
CREATE TABLE bank_sanction_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bukrs VARCHAR(4) NOT NULL,
    hbkid VARCHAR(5) NOT NULL,
    hktid VARCHAR(5) NOT NULL,
    sanction_limit_lc NUMERIC(15,2) NOT NULL,
    sanction_limit_fc NUMERIC(15,2) DEFAULT 0.00,
    waers VARCHAR(3) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL
);

-- 4. Term Loan Master (ZTFI_LOAN_DATA)
CREATE TABLE ztfi_loan_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zloan_no VARCHAR(18) UNIQUE NOT NULL,
    zproject VARCHAR(10) NOT NULL,
    bukrs VARCHAR(4) NOT NULL DEFAULT '1000',
    hbkid VARCHAR(5) NOT NULL,
    hktid VARCHAR(5) NOT NULL,
    waers VARCHAR(3) NOT NULL,
    sanction_limit_lc NUMERIC(15,2) NOT NULL,
    sanction_limit_fc NUMERIC(15,2) DEFAULT 0.00,
    sanction_date DATE NOT NULL,
    loan_start_date DATE NOT NULL,
    tenor_months INTEGER NOT NULL,
    roi NUMERIC(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    created_by UUID REFERENCES auth.users(id),
    authorized_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Amortization Schedule Lines (ZTFI_LOAN_INS)
CREATE TABLE ztfi_loan_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID REFERENCES ztfi_loan_data(id) ON DELETE CASCADE,
    line_item INTEGER NOT NULL,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    days_count INTEGER NOT NULL,
    roi NUMERIC(5,2) NOT NULL,
    opening_balance NUMERIC(15,2) NOT NULL,
    disbursement NUMERIC(15,2) DEFAULT 0.00,
    principal_repay NUMERIC(15,2) DEFAULT 0.00,
    interest_expense NUMERIC(15,2) DEFAULT 0.00,
    interest_repay NUMERIC(15,2) DEFAULT 0.00,
    closing_balance NUMERIC(15,2) NOT NULL,
    posting_status VARCHAR(20) DEFAULT 'PLANNED'
);

-- 6. Document Quality Gates Attachments
CREATE TABLE loan_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID REFERENCES ztfi_loan_data(id) ON DELETE CASCADE,
    doc_category VARCHAR(30) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Audit Trail Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    old_payload JSONB,
    new_payload JSONB,
    performed_by UUID REFERENCES auth.users(id),
    timestamp TIMESTAMPTZ DEFAULT now()
);
