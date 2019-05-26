/* global Parse */
let TradeSync = Parse.Object.extend("TradeSync");
let TradeOffer = Parse.Object.extend("TradeOffer");
let Member = Parse.Object.extend("Member");
let Resource = Parse.Object.extend("Resource");

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
    // Handle resources validation
    if (request.object.dirty("resources")) {
        // Make sure each of these resources is valid and owned by the requesting member
        // Because roles can change this around we should only need to check that we can get
        // them
        let resources = request.object.get('resources');
        if (request.user) {
            let sessionToken = request.user.get('sessionToken');
            for (let resourceId of resources) {
                let resource = await new Parse.Query(Resource).get(resourceId, {sessionToken: sessionToken});
            }
        } else {
            // The API is making the request
            for (let resourceId of resources) {
                let resource = await new Parse.Query(Resource).get(resourceId, {useMasterKey: true});
            }
        }
    }
    // Check that we're in a valid sync
    let syncId = request.object.get('tradesync').id;
    let sync = await new Parse.Query(TradeSync).get(syncId, {useMasterKey: true});
    if (sync.get('left') === undefined) {
        return;
    }
    if (sync.get('left').id !== request.object.id) {
        if (sync.get('right').id !== request.object.id) {
            throw new Error("TradeOffer " + request.object.id + " is not part of TradeSync " + sync.id);
        }
    }

    // Only update the sync object if something meaningful to the trade changed
    if (request.object.dirty("resources")) {
        sync.increment('counter');
        await sync.save(null, {useMasterKey: true});
    }
});

async function takeResourceFromEverybody(resourceId) {
    let resource = await new Parse.Query(Resource).get(resourceId, {useMasterKey: true});
    let acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    resource.setACL(acl);
    return resource.save(null, {useMasterKey: true});
}

async function takeResourcesFromEverybody(resources) {
    for (let resourceId of resources) {
        await takeResourceFromEverybody(resourceId);
    }
}

async function giveResourceTo(resourceId, offer) {
    let resource = await new Parse.Query(Resource).get(resourceId, {useMasterKey: true});
    const member = await new Parse.Query(Member).get(offer.get('member').id, {useMasterKey: true});
    const user = new Parse.User({id: member.get('owner').id});
    let acl = new Parse.ACL();
    acl.setReadAccess(user, true);
    acl.setWriteAccess(user, true);
    acl.setRoleReadAccess('gamemaster', true);
    acl.setRoleWriteAccess('gamemaster', true);
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    resource.setACL(acl);
    resource.set('member', member);

    return resource.save(null, {useMasterKey: true});
}

async function giveResourcesTo(resources, offer) {
    for (let resourceId of resources) {
        await giveResourceTo(resourceId, offer);
    }
}

Parse.Cloud.define('completeTrade', async (request) => {
    let sync = await new Parse.Query(TradeSync).get(request.params.syncId, {useMasterKey: true});

    if (sync.get('completed')) {
        throw new Error(`Sync: ${sync.id} has already completed.`);
    }

    if (sync.get('started')) {
        throw new Error(`Sync: ${sync.id} is in progress.`);
    }

    let right = await sync.get('right').fetch({useMasterKey: true});
    if (sync.get('counter') !== right.get('approved')) {
        throw new Error(`Sync: ${sync.id} right member ${right.id} has approved ${right.get('approved')} when ${sync.get('counter')} is needed`);
    }

    let left = await sync.get('left').fetch({useMasterKey: true});
    if (sync.get('counter') !== left.get('approved')) {
        throw new Error(`Sync: ${sync.id} left member ${left.id} has approved ${left.get('approved')} when ${sync.get('counter')} is needed`);
    }

    await sync.save({started: true, completed: false}, {useMasterKey: true});
    await takeResourcesFromEverybody([...left.get('resources'), ...right.get('resources')]);
    await giveResourcesTo(left.get('resources'), right);
    await giveResourcesTo(right.get('resources'), left);
    await sync.save({started: true, completed: true}, {useMasterKey: true});
});

Parse.Cloud.define('declineTrades', async (request) => {
    for (let syncId of request.params.syncIds) {
        let sync = await new Parse.Query(TradeSync).get(syncId, {useMasterKey: true});

        if (sync.get('completed')) {
            continue;
        }

        if (sync.get('started')) {
            continue;
        }

        await sync.save({
            started: false,
            completed: true,
            declined: true
        }, {useMasterKey: true});
    }
});
