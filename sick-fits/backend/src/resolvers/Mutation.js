const Mutations = {
    async createItem(parent, args, ctx, info) { // We have the prisma db object in ctx
        // TODO: Check if they are logged in 

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    },
    updateItem(parent, args, ctx, info) {
        // first take a copy of the updates
        const updates = { ...args };
        // remove the ID from the updates
        delete updates.id;
        // run the update method
        return ctx.db.mutation.updateItem(
            {
                data: updates,
                where: {
                    id: args.id,
                },
            },
            info
        );
    },
    async deleteItem(parent, args, ctx, info) {
        // Find the item 
        const where = { id: args.id }
        const item = await ctx.db.query.item({where}, `{id, title}`);

        // Check if they own the item or have permissions
        // TODO

        // Delete it 
        return ctx.db.mutation.deleteItem({where}, info);
    }
};

module.exports = Mutations;
