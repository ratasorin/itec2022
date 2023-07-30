CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS unverified_bookings CASCADE;
DROP TABLE IF EXISTS spaces CASCADE;
DROP TABLE IF EXISTS floors CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS building_ratings CASCADE;
DROP TABLE IF EXISTS space_ratings CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users ON DELETE CASCADE
);

CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    previous_floor_id UUID REFERENCES floors DEFAULT NULL,
    building_id UUID NOT NULL REFERENCES buildings ON DELETE CASCADE
);


CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    x INTEGER NOT NULL DEFAULT 0,
    y INTEGER NOT NULL DEFAULT 0,
    floor_id UUID NOT NULL REFERENCES floors ON DELETE CASCADE,
    UNIQUE(x, y, floor_id)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- time range representing [book-from, book-until)
    interval TSRANGE NOT NULL CHECK (upper(interval) - lower(interval) >= interval '2 hours'),
    space_id UUID NOT NULL REFERENCES spaces ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users ON DELETE CASCADE,
    -- do not allow overlapping time-ranges
    EXCLUDE USING GIST (space_id WITH =, interval WITH &&)
);

CREATE TABLE unverified_bookings () INHERITS (bookings);

CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stars INTEGER NOT NULL DEFAULT 0,
    review TEXT
);

CREATE TABLE building_ratings (
    building_id UUID NOT NULL REFERENCES buildings ON DELETE CASCADE
) INHERITS (ratings);

CREATE TABLE space_ratings (
    space_id UUID NOT NULL REFERENCES buildings ON DELETE CASCADE
) INHERITS (ratings);

INSERT INTO users (id, name,email, password, admin) VALUES (DEFAULT, 'Sorin', 'ratasorin0@gmail.com', 'Sorin', DEFAULT);
INSERT INTO buildings (id, name, user_id) VALUES (DEFAULT, 'AMDARIS HQ', (SELECT id FROM users));
INSERT INTO floors (id, previous_floor_id, building_id) VALUES (DEFAULT, DEFAULT, (SELECT id FROM buildings));
INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 1', 0, 0, (SELECT id FROM floors));
INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 2', 0, 1, (SELECT id FROM floors));
INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 3', 1, 0, (SELECT id FROM floors));
INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 4', 1, 1, (SELECT id FROM floors));
-- INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 5', 0, 0, (SELECT id FROM floors WHERE level = 2));
-- INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 6', 0, 1, (SELECT id FROM floors WHERE level = 2));
-- INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 7', 1, 0, (SELECT id FROM floors WHERE level = 2));
-- INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 8', 1, 1, (SELECT id FROM floors WHERE level = 2));
-- INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 9', 0, 0, (SELECT id FROM floors WHERE level = 3));
-- INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 10', 0, 1, (SELECT id FROM floors WHERE level = 3));
-- INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 11', 1, 0, (SELECT id FROM floors WHERE level = 3));
-- INSERT INTO spaces (id, name, x, y ,floor_id) VALUES (DEFAULT, 'Office 12', 1, 1, (SELECT id FROM floors WHERE level = 3));
INSERT INTO bookings (id, interval, space_id, user_id) 
       VALUES (
         
       DEFAULT, 
       tsrange(date_bin('30 minutes', date_trunc('minute', localtimestamp), CAST(TO_TIMESTAMP(0) AS timestamp)), date_bin('30 minutes', date_trunc('minute', localtimestamp  + interval '3 hours'), TIMESTAMP '2000-01-01')), 
       (SELECT id FROM spaces 
       WHERE name = 'Office 1'), 
       (SELECT id FROM users 
       WHERE name = 'Sorin')
       );
INSERT INTO bookings (id, interval, space_id, user_id) 
       VALUES (
       DEFAULT, 
        tsrange(date_bin('30 minutes', date_trunc('minute', localtimestamp  + interval '3 hours'), TIMESTAMP '2000-01-01'),date_bin('30 minutes', date_trunc('minute', localtimestamp  + interval '7 hours'), TIMESTAMP '2000-01-01')), 
       (SELECT id FROM spaces 
       WHERE name = 'Office 1'), 
       (SELECT id FROM users 
       WHERE name = 'Sorin')
       );