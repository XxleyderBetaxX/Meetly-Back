import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { createInsertSchema, CreateInsertSchema, createSelectSchema, CreateSelectSchema } from "drizzle-zod";


export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(),
    password: text('password').notNull().unique(),
    first_name: text('first_name').notNull().unique(),
    last_name: text('last_name').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});



export const vehicle_brands = pgTable('vehicle_brands', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const vehicles_categories = pgTable('vehicles_categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const vehicles_fuel_types= pgTable('vehicles_fuel_type', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const vehicles = pgTable('vehicles', {
    id: uuid('id').primaryKey().defaultRandom(),
    brand_id: uuid('brand_id').notNull().references(() => vehicle_brands.id),
    category_id: uuid('category_id').notNull().references(() => vehicles_categories.id),
    fuel_type_id: uuid('fuel_type_id').notNull().references(() => vehicles_fuel_types.id),
    model: text('model').notNull(),
    year: integer('year').notNull(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const brandsRelations = relations(vehicle_brands, ({ many }) => ({
vehicles: many(vehicles)
}));

export const categoriesRelations = relations(vehicles_categories, ({ many }) => ({
vehicles: many(vehicles)
}));

export const fuelTypesRelations = relations(vehicles_fuel_types, ({ many }) => ({
vehicles: many(vehicles)
}));

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
brand: one(vehicle_brands, {
fields: [vehicles.brand_id],
references: [vehicle_brands.id]
}),
category: one(vehicles_categories, {
fields: [vehicles.category_id],
references: [vehicles_categories.id]
}),
fuel_type: one(vehicles_fuel_types, {
fields: [vehicles.fuel_type_id],
references: [vehicles_fuel_types.id]
}),
}));


export const insertUserSchema = createInsertSchema(users);
export const insertBrandSchema = createInsertSchema(vehicle_brands);
export const insertCategorySchema = createInsertSchema(vehicles_categories);
export const insertFuelTypeSchema = createInsertSchema(vehicles_fuel_types);
export const insertVehicleSchema = createInsertSchema(vehicles);

export const SelectUserSchema = createSelectSchema(users);
export const SelectBrandSchema = createSelectSchema(vehicle_brands);
export const SelectCategorySchema = createSelectSchema(vehicles_categories);
export const SelectFuelTypeSchema = createSelectSchema(vehicles_fuel_types);
export const SelectVehicleSchema = createSelectSchema(vehicles);





