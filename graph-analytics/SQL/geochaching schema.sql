-- Insert sample geocaches
INSERT INTO geocaching.caches 
(name, difficulty_level, description, hints, status, validation_threshold, geometry)
VALUES 
('Maiden Tower Mystery', 3.5, 
 'Find the hidden symbol near the ancient fortress. Look for marks that tell stories of fire worship.', 
 'Count the steps, look for the eternal flame symbol', 
 'Active', 0.85, 
 ST_Point(49.8372, 40.3661)),

('Palace Puzzle', 4.0, 
 'Discover the secret passage in the Palace of the Shirvanshahs. Search for architectural clues.', 
 'Notice the pattern in the stone carvings', 
 'Active', 0.90,
 ST_Point(49.8352, 40.3665)),

('Caravanserai Challenge', 2.5, 
 'Find the merchant''s hidden treasure in the old marketplace.', 
 'Look for old trade route markers', 
 'Active', 0.75,
 ST_Point(49.8365, 40.3659)),

('Mosque Mystery', 3.0, 
 'Locate the ancient prayer marker near Juma Mosque.', 
 'Islamic geometric patterns hold the key', 
 'Active', 0.80,
 ST_Point(49.8361, 40.3657)),

('Book Hunter''s Quest', 2.0, 
 'Find the smallest book in the Miniature Book Museum area.', 
 'Size isn''t everything, but it matters here', 
 'Active', 0.70,
 ST_Point(49.8358, 40.3663));

-- Insert sample user progress data
INSERT INTO geocaching.user_progress
(user_id, cache_id, completion_status, completion_time, attempt_count, performance_score)
VALUES
(1, 1, 'Completed', '2024-02-17 14:30:00', 2, 0.92),
(1, 2, 'In Progress', NULL, 1, 0.45),
(1, 3, 'Completed', '2024-02-16 16:15:00', 1, 0.88),
(2, 1, 'Completed', '2024-02-17 12:00:00', 3, 0.78),
(2, 4, 'In Progress', NULL, 2, 0.35),
(3, 5, 'Completed', '2024-02-18 11:20:00', 1, 0.95),
(3, 2, 'Failed', NULL, 3, 0.25);

-- View the cache data
SELECT *,
    name as "Cache Name",
    difficulty_level as "Difficulty",
    status as "Status",
    validation_threshold as "Required Accuracy",
    ST_X(geometry) as longitude,
    ST_Y(geometry) as latitude
FROM geocaching.caches
ORDER BY difficulty_level DESC;

-- View user progress with cache details
SELECT *,
    up.user_id as "User ID",
    c.name as "Cache Name",
    up.completion_status as "Status",
    up.attempt_count as "Attempts",
    up.performance_score as "Score",
    up.completion_time as "Completion Time"
FROM geocaching.user_progress up
JOIN geocaching.caches c ON up.cache_id = c.cache_id
ORDER BY up.user_id, up.completion_time DESC NULLS LAST;