/* Replace with your SQL commands */
CREATE TABLE public."users" (
	id bigserial NOT NULL,
	email varchar(10485760) NOT NULL,
	"password" varchar(10485760) NOT NULL,
	first_name varchar(10485760) NULL,
	last_name varchar(10485760) NULL,
	phone varchar(10485760) NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW()
);
ALTER TABLE public."users" ADD CONSTRAINT users_pk PRIMARY KEY (id);
ALTER TABLE public."users" ADD CONSTRAINT users_email_un UNIQUE (email);
ALTER TABLE public."users" ADD CONSTRAINT users_phone_un UNIQUE (phone);

CREATE TABLE public."roles" (
	id bigserial NOT NULL,
	name varchar(10485760) NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW()
);
ALTER TABLE public."roles" ADD CONSTRAINT roles_pk PRIMARY KEY (id);
ALTER TABLE public."roles" ADD CONSTRAINT roles_name_un UNIQUE (name);