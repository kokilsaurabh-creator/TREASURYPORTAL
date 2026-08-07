-- Migration: User and Admin Entry Roles Table & Seed Data
-- Date: 2026-08-07

-- 1. System Users Table
CREATE TABLE IF NOT EXISTS system_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    entry_role VARCHAR(50) NOT NULL DEFAULT 'User', -- 'Admin' or 'User'
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Detailed Roles Table (Mapping users to specific operational roles)
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES system_users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Finance Head', 'Maker', 'Authoriser', 'Auditor', 'User')),
    granted_at TIMESTAMPTZ DEFAULT now(),
    granted_by UUID
);

-- 3. Seed Initial Accounts for Admin and User Entry Roles
INSERT INTO system_users (id, email, password_hash, full_name, entry_role, department)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'admin@treasury.com', '$2a$10$e8T7l0X...seeded_hash', 'System Administrator', 'Admin', 'IT & Governance'),
    ('u0000000-0000-0000-0000-000000000002', 'finance.head@treasury.com', '$2a$10$e8T7l0X...seeded_hash', 'Eleanor Vance', 'User', 'Corporate Finance'),
    ('u0000000-0000-0000-0000-000000000003', 'maker@treasury.com', '$2a$10$e8T7l0X...seeded_hash', 'Marcus Sterling', 'User', 'Treasury Operations'),
    ('u0000000-0000-0000-0000-000000000004', 'authoriser@treasury.com', '$2a$10$e8T7l0X...seeded_hash', 'Sophia Chen', 'User', 'Risk & Compliance'),
    ('u0000000-0000-0000-0000-000000000005', 'auditor@treasury.com', '$2a$10$e8T7l0X...seeded_hash', 'David Miller', 'User', 'Internal Audit')
ON CONFLICT (email) DO NOTHING;

-- 4. Seed Operational Roles
INSERT INTO user_roles (user_id, role)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'Admin'),
    ('u0000000-0000-0000-0000-000000000002', 'Finance Head'),
    ('u0000000-0000-0000-0000-000000000003', 'Maker'),
    ('u0000000-0000-0000-0000-000000000004', 'Authoriser'),
    ('u0000000-0000-0000-0000-000000000005', 'Auditor')
ON CONFLICT DO NOTHING;
