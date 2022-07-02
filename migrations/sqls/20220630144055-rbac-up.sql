/* Replace with your SQL commands */
CREATE TABLE public."users" (
	id integer primary key generated by default as identity,
	email varchar(10485760) NOT NULL,
	"password" varchar(10485760) NOT NULL,
	first_name varchar(10485760) NULL,
	last_name varchar(10485760) NULL,
	phone varchar(10485760) NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW(),
	resource_id varchar(10485760) NOT NULL,
	CONSTRAINT users_resource_id_uq UNIQUE (resource_id),
	CONSTRAINT users_phone_uq UNIQUE (phone),
	CONSTRAINT users_email_uq UNIQUE (email)
);

CREATE TABLE public."roles" (
	id integer primary key generated by default as identity,
	name varchar(10485760) NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW(),
	resource_id varchar(10485760) NOT NULL,
	CONSTRAINT roles_resource_id_uq UNIQUE (resource_id),
	CONSTRAINT roles_name_uq UNIQUE (name)
);

CREATE TABLE public.user_has_roles (
	id integer primary key generated by default as identity,
	user_id int NOT NULL,
	role_id int NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW(),
	resource_id varchar(10485760) NOT NULL,
	CONSTRAINT user_has_roles_resource_id_uq UNIQUE (resource_id),
	CONSTRAINT user_has_roles_user_id_role_id_uq UNIQUE (user_id, role_id),
	CONSTRAINT user_has_roles_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
	CONSTRAINT user_has_roles_role_id_fk FOREIGN KEY (role_id) REFERENCES public.roles(id)
);

CREATE TABLE public.permissions (
	id integer primary key generated by default as identity,
	name varchar NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW(),
	resource_id varchar(10485760) NOT NULL,
	CONSTRAINT permissions_resource_id_uq UNIQUE (resource_id),
	CONSTRAINT permissions_name_uq UNIQUE (name)
);

CREATE TABLE public.role_has_permissions (
	id integer primary key generated by default as identity,
	role_id int NOT NULL,
	permission_id int NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW(),
	resource_id varchar(10485760) NOT NULL,
	CONSTRAINT role_has_permissions_resource_id_uq UNIQUE (resource_id),
	CONSTRAINT role_has_permissions_role_id_permission_id_uq UNIQUE (role_id, permission_id),
	CONSTRAINT role_has_permissions_role_id_fk FOREIGN KEY (role_id) REFERENCES public.roles(id),
	CONSTRAINT role_has_permissions_permission_id_fk FOREIGN KEY (permission_id) REFERENCES public.permissions(id)
);

CREATE TABLE public.groups (
	id integer primary key generated by default as identity,
	name int NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW(),
	resource_id varchar(10485760) NOT NULL,
	CONSTRAINT groups_resource_id_uq UNIQUE (resource_id),
	CONSTRAINT groups_name_uq UNIQUE (name)
);