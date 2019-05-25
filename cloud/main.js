/* global Parse */
let TradeSync = Parse.Object.extend("TradeSync");
let TradeOffer = Parse.Object.extend("TradeOffer");
let Member = Parse.Object.extend("Member");

Parse.Cloud.define('hello', async (request) => {
    return "Hello from Parse!" + JSON.stringify(request);
});

Parse.Cloud.define('initiateTradeWith', async (request) => {
    let meId = request.params.meId;
    let themId = request.params.themId;
    let me = await new Parse.Query(Member).get(meId);
    let them = await new Parse.Query(Member).get(themId);
    let meUser = request.user;
    let themUser = new Parse.User({id: them.get('owner').id});

    let sync = new TradeSync({
        counter: 1,
    });
    let syncAcl = new Parse.ACL();
    syncAcl.setPublicReadAccess(false);
    syncAcl.setPublicWriteAccess(false);
    syncAcl.setReadAccess(meUser, true);
    syncAcl.setReadAccess(themUser, true);
    syncAcl.setRoleReadAccess('gamemaster', true);
    syncAcl.setRoleWriteAccess('gamemaster', true);
    sync.setACL(syncAcl);
    sync = await sync.save(null, {useMasterKey: true});

    let offer = new TradeOffer({
        resources: [],
        counter: 1,
        member: me,
        approved: 0,
        tradesync: sync
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
        approved: 0,
        tradesync: sync
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
    sync = await sync.save(null, {useMasterKey: true});

    return Promise.resolve({
        sync: sync,
        me: offer,
        them: themOffer
    });
});

Parse.Cloud.beforeSave('TradeOffer', async (request) => {
    let obj = request.object;
    let tradesync = request.object.get('tradesync');
    let syncId = request.object.get('tradesync').id;
    let sync = await new Parse.Query(TradeSync).get(syncId, {useMasterKey: true});
    if (sync.get('left') === undefined) {
        return;
    }
    if (sync.get('left').id !== request.object.id) {
        if (sync.get('right').id !== request.object.id) {
            throw new Parse.Error("TradeOffer " + request.object.id + " is not part of TradeSync " + sync.id);
        }
    }
    sync.increment('counter');
    await sync.save(null, {useMasterKey: true});
});
