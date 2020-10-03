const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require('../mail');

const Mutations = {
    async createItem(parent, args, ctx, info) {
        // We have the prisma db object in ctx
        // TODO: Check if they are logged in

        const item = await ctx.db.mutation.createItem(
            {
                data: {
                    ...args,
                },
            },
            info
        );

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
        const where = { id: args.id };
        const item = await ctx.db.query.item({ where }, `{id, title}`);

        // Check if they own the item or have permissions
        // TODO

        // Delete it
        return ctx.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();

        // Hash their password
        const password = await bcrypt.hash(args.password, 10);

        // create ther user in db
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                    password: password, // override password
                    permissions: { set: ["USER"] },
                },
            },
            info
        );

        // create the JWT token for them and return session (auto-sign in)
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        // set jwt as cookie on response
        ctx.response.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });

        // return user to browser
        return user;
    },
    async signin(parent, { email, password }, ctx, info) {
        // Check if there is a user with that email
        const where = { email: email };
        const user = await ctx.db.query.user({ where: where });
        if (!user) {
            // on the frontend, this will be caught in mutation and we can display this!
            throw new Error(`No such user found for email ${email}`);
        }
        // Check if their password is correct
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error("Invalid pasword");
        }
        // Generate the jwt token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // Set the cookie with the token
        ctx.response.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        // Return the user
        return user;
    },
    async signout(parent, args, ctx, info) {
        ctx.response.clearCookie("token");
        return { message: "GoodBye!" };
    },
    async requestReset(parent, args, ctx, info) {
        // 1. Check if this is a real user
        const user = await ctx.db.query.user({ where: { email: args.email } });
        if (!user) {
            throw new Error(`No such user found for email ${args.email}`);
        }
        // 2. Set a reset token and expiry on that user
        const randomBytesPromiseified = promisify(randomBytes);
        const resetToken = (await randomBytesPromiseified(20)).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        const res = await ctx.db.mutation.updateUser({
            where: { email: args.email },
            data: { resetToken, resetTokenExpiry },
        });
        console.log(res);
        return { message: "Thanks!" };
        // 3. Email them that reset token
    },
    async requestReset(parent, args, ctx, info) {
        // 1. Check if this is a real user
        const user = await ctx.db.query.user({ where: { email: args.email } });
        if (!user) {
            throw new Error(`No such user found for email ${args.email}`);
        }
        // 2. Set a reset token and expiry on that user
        const randomBytesPromiseified = promisify(randomBytes);
        const resetToken = (await randomBytesPromiseified(20)).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        const res = await ctx.db.mutation.updateUser({
            where: { email: args.email },
            data: { resetToken, resetTokenExpiry },
        });
        console.log(res);
        // 3. Email them that reset token
        const mailRes = await transport.sendMail({
            from: "saiguy@me.com",
            to: user.email,
            subject: 'Your password reset token',
            html: makeANiceEmail(`Your Password Reset Token is here! \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}"
            >Click here to reset</a>`),
        });
        // 4. Return the message
        return { message: "Thanks!" };
    },
    async resetPassword(parent, args, ctx, info) {
        // 1. check if the passwords match
        if (args.password !== args.confirmPassword) {
            throw new Error("Yo Passwords don't match!");
        }
        // 2. check if its a legit reset token
        // 3. Check if its expired
        const [user] = await ctx.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000,
            },
        });
        if (!user) {
            throw new Error("This token is either invalid or expired!");
        }
        // 4. Hash their new password
        const password = await bcrypt.hash(args.password, 10);
        // 5. Save the new password to the user and remove old resetToken fields
        const updatedUser = await ctx.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        // 6. Generate JWT
        const token = jwt.sign(
            { userId: updatedUser.id },
            process.env.APP_SECRET
        );
        // 7. Set the JWT cookie
        ctx.response.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        // 8. return the new user
        return updatedUser;
    },
};

module.exports = Mutations;
