-- Create Database

CREATE DATABASE hiddenfigures

-- Create Table for figures 

CREATE TABLE figures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    bio TEXT,
    achievements TEXT[],
    birth_date DATE,
    death_date DATE, 
    image_url TEXT, 
    video_url TEXT, 
    field VARCHAR(100), --Category (Civil Rights, Science, etc.)
    month INT, -- Month of feature
    year INT, -- Year of feature
    Created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE quotes (
    id SERIAL PRIMARY KEY,
    figure_id FOREIGN KEY, -- References figues.id
    text TEXT, -- The quote itself 
    source TEXT -- The source of the quote 
);
