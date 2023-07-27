-- Création de la table users
CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    ID_19 VARCHAR(255),
    Pseudo VARCHAR(255),
    Avatar VARCHAR(255)
);

-- Création de la table fields
CREATE TABLE fields (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

-- Création de la table conv
CREATE TABLE conv (
    Id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

-- Création de la table DatasUser
CREATE TABLE DatasUser (
    ID SERIAL PRIMARY KEY,
    Id_user INT REFERENCES users(ID),
    data TEXT,
    Id_field INT REFERENCES fields(ID),
    logged_at DATE
);

-- Création de la table matchs
CREATE TABLE matchs (
    Id SERIAL PRIMARY KEY,
    Id_user1 INT REFERENCES users(ID),
    Id_user2 INT REFERENCES users(ID),
    score_u1 INT,
    score_u2 INT,
    level INT
);

-- Création de la table DataConv
CREATE TABLE DataConv (
    ID SERIAL PRIMARY KEY,
    Id_conv INT REFERENCES conv(Id),
    data TEXT,
    Id_field INT REFERENCES fields(ID),
    logged_at DATE
);

-- Création de la table DataMess
CREATE TABLE DataMess (
    Id SERIAL PRIMARY KEY,
    ID_conv INT REFERENCES conv(Id),
    data TEXT,
    Id_user INT REFERENCES users(ID),
    logged_at DATE
);
