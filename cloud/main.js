/* global Parse */
Parse.Cloud.define('hello', async (request) => {
    return "Hello from Parse!" + JSON.stringify(request);
});

/** The Trading flow.
 * It's the only part of the system that really needs to be synchronized.
 * GMs will need a way to prep trades that will be sent out en masse once the game starts.
 * We must guarantee that only the approved items are traded and that they are traded.
 *
 * Somebody initiates a trade by providing the member id of the trading partner they would like to
 * trade with. This creates a trade with the two people involved.
 *
 */
