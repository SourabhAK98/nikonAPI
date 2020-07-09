const {
    CosmosClient
} = require("@azure/cosmos");
const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const db = cosmosClient.database('ingage').container('logs');
module.exports = async function(context, req) {
    context.log("JavaScript HTTP trigger function processed a request.");
    console.log(req.body);
    await db.items.create({
        ...(req.body || {}),
        client: 'cosmosTestClient'
    });
    const querySpec = {
        query: 'SELECT * FROM c WHERE c.client = @client',
        parameters: [{
            name: '@client',
            value: 'cosmosTestClient'
        }]
    };
    const {
        resources: result
    } = await db.items.query(querySpec).fetchAll();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result,
    };
};