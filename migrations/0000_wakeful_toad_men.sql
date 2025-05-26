CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'in-progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."position" AS ENUM('overall-cordinator', 'head-coordinator', 'core-coordinator', 'executive', 'members');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('assigner', 'assignee');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "status" NOT NULL,
	"priority" "priority" NOT NULL,
	"due_date" date NOT NULL,
	"assigner_id" integer NOT NULL,
	"assigner_name" text NOT NULL,
	"assignees" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "role" NOT NULL,
	"position" "position",
	"last_notification_read_at" timestamp with time zone DEFAULT '1970-01-01T00:00:00.000Z',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigner_id_users_id_fk" FOREIGN KEY ("assigner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;