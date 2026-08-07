-- Migration: System Users Table & Initial Seed Accounts
-- Date: 2026-08-07

-- 1. Create System Users Table (Keyed by User ID)
CREATE TABLE IF NOT EXISTS system_users (
    user_id VARCHAR(50) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Finance Head', 'Maker', 'Authoriser', 'Auditor')),
    department VARCHAR(100) NOT NULL DEFAULT 'Treasury',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Seed Initial User Accounts (User ID / Password)
INSERT INTO system_users (user_id, password_hash, full_name, role, department)
VALUES 
    ('ADMIN',      'Admin@123',   'System Administrator', 'Admin',        'IT & Governance'),
    ('FINANCE01',  'Finance@123', 'Eleanor Vance',       'Finance Head', 'Corporate Finance'),
    ('MAKER01',    'Maker@123',   'Marcus Sterling',     'Maker',        'Treasury Operations'),
    ('AUTH01',     'Auth@123',    'Sophia Chen',         'Authoriser',   'Risk & Approvals'),
    ('AUDIT01',    'Audit@123',   'David Miller',        'Auditor',      'Internal Audit')
ON CONFLICT (user_id) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    is_active = TRUE;
