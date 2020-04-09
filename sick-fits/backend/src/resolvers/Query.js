const { forwardTo } = require('prisma-binding');


const Query = {
    items: forwardTo('db'), // This works b/c it is the same name & signature as the prisma method
    item: forwardTo('db'),
};

module.exports = Query;
