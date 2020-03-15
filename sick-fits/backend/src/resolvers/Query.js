const { forwardTo } = require('prisma-binding');


const Query = {
    items: forwardTo('db'), // This works b/c it is the same name & signature as the prisma method
    // async items(parent, args, ctx, info){
    //     console.log("Getting items")
    //     const items = await ctx.db.query.items();

    //     return items;
    // }
    // dogs: function(parent, args, ctx, info){
    //     return [{name: 'Snickers'}, {name: 'Sunny'}]
    // }
};

module.exports = Query;
