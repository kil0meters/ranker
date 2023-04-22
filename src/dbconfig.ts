import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const config = {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}
