-- Create users table for authentication
CREATE TABLE IF NOT EXISTS demo_bank.users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) DEFAULT 'manager' CHECK (role IN ('admin', 'manager', 'analyst')),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON demo_bank.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON demo_bank.users(role);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION demo_bank.update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON demo_bank.users
    FOR EACH ROW
    EXECUTE FUNCTION demo_bank.update_users_updated_at();

-- Insert demo user (password: "demo123")
-- Hash generated with: bcrypt.hash('demo123', 10)
INSERT INTO demo_bank.users (email, password_hash, full_name, role, department)
VALUES
    ('demo@querybank.az', '$2b$10$hash_will_be_generated_on_deployment', 'Demo İstifadəçi', 'analyst', 'Data Analitika')
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE demo_bank.users IS 'Bank məlumat sisteminin istifadəçiləri';
COMMENT ON COLUMN demo_bank.users.user_id IS 'Unikal istifadəçi identifikatoru';
COMMENT ON COLUMN demo_bank.users.email IS 'İstifadəçinin email ünvanı (login)';
COMMENT ON COLUMN demo_bank.users.password_hash IS 'Şifrələnmiş parol (bcrypt)';
COMMENT ON COLUMN demo_bank.users.role IS 'İstifadəçi rolu (admin, manager, analyst)';
