const Mutations = {
    async createItem(parent, args, ctx, info){ // We have the prisma db object in ctx
        // TODO: Check if they are logged in 

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    }
    // createDog: function(parent, args, ctx, info){
    //     // Create a dog
    //     console.log(args);
    // }
};

module.exports = Mutations;
