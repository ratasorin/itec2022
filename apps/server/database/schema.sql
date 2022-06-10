CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT false,
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- time range representing old [bookfrom, bookuntil)
    interval TSRANGE NOT NULL
    space_id UUID NOT NULL REFERENCES spaces ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users ON DELETE CASCADE,
    -- do not allow overlapping time-ranges
    EXCLUDE USING GIST (id WITH =, interval WITH &&),
);

CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level INTEGER NOT NULL,
    building_id UUID NOT NULL REFERENCES buildings ON DELETE CASCADE,
    UNIQUE (level, building_id),
);

CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    x INTEGER NOT NULL DEFAULT 0,
    y INTEGER NOT NULL DEFAULT 0,
    floor_id UUID NOT NULL REFERENCES floors ON DELETE CASCADE,
);

CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users ON DELETE SET NULL,
);