// This file connects to the remote prisma DB and gives us the ability to query it with JS
const { Prisma } = require('prisma-binding');

// Because we give  typeDefs here we can use in our prisma files 
const db = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    debug: false,
});

module.exports = db;