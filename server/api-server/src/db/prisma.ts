import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// let prisma: PrismaClient;

// // if (process.env.NODE_ENV === "production") {
// //   prisma = new PrismaClient({
// //     log: [
// //       {
// //         emit: "event",
// //         level: "query",
// //       },
// //     ],
// //   })

// //   // @ts-ignore
// //   prisma.$on("query", async (e) => {
// //     // @ts-ignore
// //     console.log(`${e.query} ${e.params}`)
// //   })
// // } else {
// //   if (!global.prisma) {
// //     global.prisma = new PrismaClient({
// //       log: [
// //         {
// //           emit: "event",
// //           level: "query",
// //         },
// //       ],
// //     })

// //     // @ts-ignore
// //     global.prisma.$on("query", async (e) => {
// //       // @ts-ignore
// //       console.log(`${e.query} ${e.params}`)
// //     })
// //   }
// //   prisma = global.prisma
// // }

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

// prisma.$on('query', (e) => {
//   if (e.query.indexOf('article_origin') !== -1) {
//     console.log('QUERY:::::::::::::::::::::::::::::::')
//     console.log(e.query)
//     console.log('Params: ' + e.params)
//     console.log('Duration: ' + e.duration + 'ms')
//   }
  
// })

export default prisma;