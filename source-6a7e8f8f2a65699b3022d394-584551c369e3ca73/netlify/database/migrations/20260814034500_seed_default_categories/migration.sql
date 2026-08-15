INSERT INTO "categories" ("name", "slug", "description", "emoji") VALUES
	('Clip Dump', 'clip-dump', 'Chaotic, unhinged, and unforgettable clips.', '🎬'),
	('Music Finds', 'music-finds', 'Songs and sets worth the replay.', '🎧'),
	('Hot Takes', 'hot-takes', 'Debate club, no notes.', '🔥'),
	('Late Night', 'late-night', 'For the 2am scrollers.', '🌙')
ON CONFLICT ("slug") DO NOTHING;
