-- State/Districts Table
CREATE TABLE IF NOT EXISTS state_districts (
  id BIGSERIAL PRIMARY KEY,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state, district)
);

-- Enable RLS
ALTER TABLE state_districts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for state_districts" ON state_districts FOR SELECT USING (true);

-- Insert some initial data (optional, for testing)
INSERT INTO state_districts (state, district) VALUES
('Andhra Pradesh', 'East Godavari'),
('Andhra Pradesh', 'West Godavari'),
('Andhra Pradesh', 'Krishna'),
('Andhra Pradesh', 'Guntur'),
('Andhra Pradesh', 'Chittoor'),
('Telangana', 'Hyderabad'),
('Telangana', 'Ranga Reddy')
ON CONFLICT (state, district) DO NOTHING;
