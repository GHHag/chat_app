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
    username VARCHAR(50) UNIQUE NOT NULL,
    user_password VARCHAR(200) NOT NULL,
    user_role VARCHAR(50) NOT NULL
);

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.chats
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by uuid NOT NULL,
    chat_subject VARCHAR(200),
    CONSTRAINT created_by_fk FOREIGN KEY(created_by) REFERENCES users(id)
);

ALTER TABLE IF EXISTS public.chats
    OWNER to postgres;

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.chat_users
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id uuid NOT NULL,
    user_id uuid NOT NULL,
    banned BOOLEAN NOT NULL DEFAULT FALSE,
    invitation_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT chat_id_fk FOREIGN KEY(chat_id) REFERENCES chats(id),
    CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE IF EXISTS public.chat_users
    OWNER to postgres;

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.messages
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id uuid NOT NULL,
    message_timestamp TIMESTAMP NOT NULL,
    CONSTRAINT chat_id_fk FOREIGN KEY(chat_id) REFERENCES chats(id)
);

ALTER TABLE IF EXISTS public.messages
    OWNER to postgres;

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_blockings
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    blocked_user_id uuid NOT NULL,
    CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT blocked_user_id_fk FOREIGN KEY(blocked_user_id) REFERENCES users(id)
);

ALTER TABLE IF EXISTS public.user_blockings
    OWNER to postgres;

---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.session 
(
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE IF EXISTS public.session 
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid) 
    NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION f_insert_chat_creator()
RETURNS trigger AS $$
BEGIN
    INSERT INTO chat_users (chat_id, user_id, invitation_accepted)
    VALUES (new.id, new.created_by, true);
    return NEW;
END;
$$
language plpgsql;

CREATE TRIGGER t_create_chat 
    AFTER INSERT ON chats
    FOR EACH ROW
    EXECUTE PROCEDURE f_insert_chat_creator();

---------------------------------------------------------------------

-- TRIGGER som checkar att user som försöker banna från en chat e admin
-- eller skapare av chatten?