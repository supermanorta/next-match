import {PrismaClient} from '@prisma/client';
const globalForPrisma = global as unknown as {prisma: PrismaClient}

export const prisma = globalForPrisma.prisma || new PrismaClient({log:['query']});

//if our app restarts, it will only used our instance currently running in a dev env, this will allow more clients to spin up in Prod but not needed for DEV. 
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;