-- Enable PostGIS extension for spatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS navigation;
CREATE SCHEMA IF NOT EXISTS geocaching;

-- Create tables for navigation features
CREATE TABLE navigation.buildings (
    building_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(50),
    current_use VARCHAR(100),
    historical_significance TEXT,
    architecture_style VARCHAR(100),
    construction_period VARCHAR(50),
    operating_hours VARCHAR(255),
    geometry geometry(POLYGON, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE navigation.roads (
    road_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(50),
    direction VARCHAR(20), -- one-way/two-way
    lanes INTEGER,
    access_restrictions TEXT,
    historical_significance TEXT,
    geometry geometry(LINESTRING, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE navigation.points_of_interest (
    poi_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(50),
    description TEXT,
    significance_level INTEGER CHECK (significance_level BETWEEN 1 AND 5),
    visitor_capacity INTEGER,
    accessibility_info TEXT,
    operating_hours VARCHAR(255),
    geometry geometry(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tables for geocaching features
CREATE TABLE geocaching.caches (
    cache_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    difficulty_level DECIMAL(3,1),
    description TEXT,
    hints TEXT,
    status VARCHAR(50),
    validation_threshold DECIMAL(4,2),
    geometry geometry(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE geocaching.user_progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    cache_id INTEGER REFERENCES geocaching.caches(cache_id),
    completion_status VARCHAR(50),
    completion_time TIMESTAMP,
    attempt_count INTEGER DEFAULT 0,
    performance_score DECIMAL(4,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial indexes
CREATE INDEX idx_buildings_geom ON navigation.buildings USING GIST(geometry);
CREATE INDEX idx_roads_geom ON navigation.roads USING GIST(geometry);
CREATE INDEX idx_poi_geom ON navigation.points_of_interest USING GIST(geometry);
CREATE INDEX idx_caches_geom ON geocaching.caches USING GIST(geometry);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_buildings_timestamp
    BEFORE UPDATE ON navigation.buildings
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_roads_timestamp
    BEFORE UPDATE ON navigation.roads
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_poi_timestamp
    BEFORE UPDATE ON navigation.points_of_interest
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_caches_timestamp
    BEFORE UPDATE ON geocaching.caches
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_progress_timestamp
    BEFORE UPDATE ON geocaching.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Grant appropriate permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA navigation TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA geocaching TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA navigation TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA geocaching TO postgres;


select * from navigation.buildings;