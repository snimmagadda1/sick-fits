const { forwardTo } = require("prisma-binding");

const Query = {
    items: forwardTo("db"), // This works b/c it is the same name & signature as the prisma method
    item: forwardTo("db"),
    itemsConnection: forwardTo("db"),
    me(parent, args, ctx, info) {
        // Check if there is a current userId
        if (!ctx.request.userId) {
            return null;
        }
        return ctx.db.query.user(
            {
                where: { id: ctx.request.userId },
            },
            info
        );
    },
};

module.exports = Query;
