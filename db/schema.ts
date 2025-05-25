import { pgTable, serial, text, timestamp, integer, date, pgEnum } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("role", ["assigner", "assignee"]);
export const userPositionEnum = pgEnum("position", [
  "overall-cordinator",
  "head-coordinator",
  "core-coordinator",
  "executive",
  "members",
]);

export const taskStatusEnum = pgEnum("status", ["pending", "in-progress", "completed"]);
export const taskPriorityEnum = pgEnum("priority", ["low", "medium", "high"]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull(),
  position: userPositionEnum("position"),
  lastNotificationReadAt: timestamp("last_notification_read_at", {
    withTimezone: true,
  }).default(new Date("1970-01-01T00:00:00Z")),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: taskStatusEnum("status").notNull(),
  priority: taskPriorityEnum("priority").notNull(),
  dueDate: date("due_date").notNull(),
  assignerId: integer("assigner_id").notNull().references(() => users.id),
  assignerName: text("assigner_name").notNull(),
  assigneeId: integer("assignee_id").notNull().references(() => users.id),
  assigneeName: text("assignee_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  assignedTasks: many(tasks),
  receivedTasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  assigner: one(users, {
    fields: [tasks.assignerId],
    references: [users.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
}));


// TypeScript types
// Users
export type User = InferSelectModel<typeof users>;
export type CreateUserInput = InferInsertModel<typeof users>;

// Tasks
export type Task = InferSelectModel<typeof tasks>;
export type CreateTaskInput = InferInsertModel<typeof tasks>;

// For updating tasks: omit immutable fields like assignerId
export type UpdateTaskInput = Partial<Omit<CreateTaskInput, "assignerId">>;

