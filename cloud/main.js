/* global Parse */
let TradeSync = Parse.Object.extend("TradeSync");
let TradeOffer = Parse.Object.extend("TradeOffer");
let Member = Parse.Object.extend("Member");

Parse.Cloud.define('hello', async (request) => {
    return "Hello from Parse!" + JSON.stringify(request);
});

Parse.Cloud.define('initiateTradeWith', async (request) => {
    let sync = new TradeSync({
        counter: 1,
    });
    let meId = request.params.meId;
    let themId = request.params.themId;
    // RAS TODO Set the ACL so that only the server can modify it
    sync = await sync.save();

    let me = await new Parse.Query(Member).get(meId);
    let them = await new Parse.Query(Member).get(themId);
    let meUser = request.user;
    let themUser = new Parse.User({id: them.get('owner').id});

    let offer = new TradeOffer({
        resources: [],
        counter: 1,
        member: me,
        approved: 0
    });
    let acl = new Parse.ACL();
    acl.setReadAccess(meUser, true);
    acl.setWriteAccess(meUser, true);
    acl.setReadAccess(themUser.id, true);
    offer.setACL(acl);
    offer = await offer.save();
    let themOffer = new TradeOffer({
        resources: [],
        counter: 1,
        member: them,
        approved: 0
    });
    acl = new Parse.ACL();
    acl.setReadAccess(themUser, true);
    acl.setWriteAccess(themUser, true);
    acl.setReadAccess(meUser.id, true);
    themOffer.setACL(acl);
    themOffer = await themOffer.save();

    sync.set({
        'left': offer,
        'right': themOffer
    });
    sync = await sync.save();

    return Promise.resolve({
        sync: sync,
        me: offer,
        them: themOffer
    });
});
