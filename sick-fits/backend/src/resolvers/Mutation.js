const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    },
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();

        // Hash their password
        const password = await bcrypt.hash(args.password, 10);

        // create ther user in db 
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password: password, // override password
                permissions: { set: ['USER'] },
            }
        }, info);

        // create the JWT token for them and return session (auto-sign in)
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        
        // set jwt as cookie on response 
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000* 60 * 60 * 24 * 365 // 1 year cookie
        });

        // return user to browser
        return user;
    }
};

module.exports = Mutations;
