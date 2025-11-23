-- Enable PostGIS first
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create Buildings table
CREATE TABLE buildings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    current_use VARCHAR(50),
    historical_significance TEXT,
    geometry geometry(POLYGON, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Roads table
CREATE TABLE roads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(50),
    direction VARCHAR(20),
    accessibility VARCHAR(50),
    geometry geometry(LINESTRING, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Points of Interest table
CREATE TABLE points_of_interest (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    importance_level INTEGER CHECK (importance_level BETWEEN 1 AND 5),
    location geometry(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some sample data
INSERT INTO buildings (name, type, current_use, geometry) 
VALUES (
    'Maiden Tower',
    'Historical Monument',
    'Museum',
    ST_GeomFromText('POLYGON((49.8372 40.3661, 49.8373 40.3661, 49.8373 40.3662, 49.8372 40.3662, 49.8372 40.3661))', 4326)
);

-- To verify our data, run these queries:
SELECT * FROM buildings;
SELECT * FROM roads;
SELECT * FROM points_of_interest;