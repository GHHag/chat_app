DROP DATABASE IF EXISTS "chat_app";

CREATE DATABASE "chat_app"
    WITH
    OWNER = postgres
    ENCODING = 'UTF-8'
    CONNECTION LIMIT = -1;

\c chat_app

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    user_password VARCHAR(200) NOT NULL,
    user_role VARCHAR(50) NOT NULL
);

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.chats
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_subject VARCHAR(200)
);

ALTER TABLE IF EXISTS public.chats
    OWNER to postgres;

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.chat_users
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id uuid,
    user_id uuid,
    blocked BOOLEAN NOT NULL DEFAULT FALSE,
    invitation_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    creator BOOLEAN NOT NULL,
    CONSTRAINT chat_id_fk FOREIGN KEY(chat_id) REFERENCES chats(id),
    CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE IF EXISTS public.chat_users
    OWNER to postgres;

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.messages
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id uuid,
    message_timestamp TIMESTAMP NOT NULL,
    CONSTRAINT chat_id_fk FOREIGN KEY(chat_id) REFERENCES chats(id)
);

ALTER TABLE IF EXISTS public.messages
    OWNER to postgres;

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_blockings
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid,
    blocked_user_id uuid,
    CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT blocked_user_id_fk FOREIGN KEY(blocked_user_id) REFERENCES users(id)
);

ALTER TABLE IF EXISTS public.user_blockings
    OWNER to postgres;

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.sessions
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    session TEXT,
    last_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.sessions
    OWNER to postgres;