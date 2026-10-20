-- VIMO Database Schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS cards (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    cost INTEGER NOT NULL DEFAULT 0,
    rarity VARCHAR(64) NOT NULL DEFAULT 'Común',
    effect TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cards_name ON cards (name);
CREATE INDEX IF NOT EXISTS idx_cards_type ON cards (type);

-- Código visible en PC; string para conservar ceros iniciales. No altera los IDs internos.
ALTER TABLE cards ADD COLUMN IF NOT EXISTS game_id VARCHAR(4)
    CHECK (game_id IS NULL OR game_id ~ '^[0-9]{4}$');
CREATE UNIQUE INDEX IF NOT EXISTS idx_cards_game_id ON cards (game_id);

CREATE TABLE IF NOT EXISTS characters (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    lore TEXT NOT NULL,
    related_cards TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_characters_name ON characters (name);

CREATE TABLE IF NOT EXISTS enemies (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(128) NOT NULL,
    difficulty VARCHAR(64) NOT NULL DEFAULT 'Media',
    description TEXT NOT NULL,
    lore TEXT NOT NULL,
    related_cards TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_enemies_name ON enemies (name);

CREATE TABLE IF NOT EXISTS infrastructure (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(128) NOT NULL,
    location VARCHAR(255),
    description TEXT NOT NULL,
    lore TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_infrastructure_name ON infrastructure (name);
