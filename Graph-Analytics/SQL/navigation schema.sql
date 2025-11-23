-- Insert Points of Interest
INSERT INTO navigation.points_of_interest 
(name, category, description, significance_level, visitor_capacity, accessibility_info, operating_hours, geometry)
VALUES 
('Maiden Tower', 'Historical Monument', 'UNESCO World Heritage site, iconic symbol of Baku', 5, 150, 'Stairs to upper levels', '09:00-18:00', ST_Point(49.8372, 40.3661)),
('Palace of the Shirvanshahs', 'Historical Monument', '15th-century royal palace complex', 5, 200, 'Multiple levels with stairs', '10:00-18:00', ST_Point(49.8352, 40.3665)),
('Juma Mosque', 'Religious Site', 'Historic mosque in the heart of the old city', 4, 100, 'Ground level access', '05:00-22:00', ST_Point(49.8361, 40.3657)),
('Museum of Miniature Books', 'Museum', 'Unique collection of miniature books', 3, 30, 'Wheelchair accessible', '11:00-17:00', ST_Point(49.8358, 40.3663)),
('Caravanserai Restaurant', 'Dining', 'Traditional Azerbaijani cuisine in historic building', 3, 80, 'Ground floor access', '12:00-23:00', ST_Point(49.8365, 40.3659));

-- Insert Buildings
INSERT INTO navigation.buildings 
(name, type, current_use, historical_significance, architecture_style, construction_period, operating_hours, geometry)
VALUES 
('Double Gate', 'Gate', 'Tourist Entrance', 'Main entrance to the old city', 'Medieval', '12th century', '24/7', 
 ST_GeomFromText('POLYGON((49.8375 40.3665, 49.8376 40.3665, 49.8376 40.3666, 49.8375 40.3666, 49.8375 40.3665))')),
('Muhammad Mosque', 'Religious', 'Active Mosque', 'Historical place of worship', 'Islamic Architecture', '11th century', '05:00-22:00',
 ST_GeomFromText('POLYGON((49.8362 40.3658, 49.8363 40.3658, 49.8363 40.3659, 49.8362 40.3659, 49.8362 40.3658))')),
('Hamam Museum', 'Museum', 'Exhibition Space', 'Former public bathhouse', 'Traditional Bath House', '15th century', '10:00-18:00',
 ST_GeomFromText('POLYGON((49.8367 40.3662, 49.8368 40.3662, 49.8368 40.3663, 49.8367 40.3663, 49.8367 40.3662))'));

-- Insert Roads
INSERT INTO navigation.roads 
(name, type, direction, lanes, access_restrictions, historical_significance, geometry)
VALUES 
('Boyuk Gala Street', 'Primary', 'two-way', 2, 'Vehicle access limited', 'Main historical thoroughfare', 
 ST_GeomFromText('LINESTRING(49.8370 40.3660, 49.8375 40.3665)')),
('Kichik Gala Street', 'Secondary', 'one-way', 1, 'Pedestrian priority', 'Ancient market route', 
 ST_GeomFromText('LINESTRING(49.8365 40.3662, 49.8370 40.3667)')),
('Asaf Zeynally Street', 'Pedestrian', 'two-way', 0, 'Pedestrian only', 'Traditional craft quarter', 
 ST_GeomFromText('LINESTRING(49.8360 40.3658, 49.8365 40.3663)'));

-- View the inserted data
-- View Points of Interest
SELECT *,name, category, significance_level, operating_hours 
FROM navigation.points_of_interest
ORDER BY significance_level DESC;

-- View Buildings
SELECT *,name, type, current_use, construction_period
FROM navigation.buildings
ORDER BY name;

-- View Roads
SELECT *,name, type, direction, access_restrictions
FROM navigation.roads
ORDER BY name;