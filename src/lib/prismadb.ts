// import { PrismaClient } from "@prisma/client"

// declare global  {
//     var prisma: PrismaClient | undefined
// }

// const prismadb = globalThis.prisma || new PrismaClient()
// if(process.env.NODE_ENV !== "production") globalThis.prisma = prismadb

// export default prismadb

import { PrismaClient } from '@prisma/client';

const prismadb = new PrismaClient();

export default prismadb;
