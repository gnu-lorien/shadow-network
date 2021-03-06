import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import Parse from 'parse'
import store from '@/store.js'

const tradeWithoutChangingLogin = function() {
    it('can initiate a trade', async function() {
        let result = await store.dispatch('initiateTradeWith', {
            themId: this.themId,
            meId: this.meId
        });
        expect(result).to.be.an('object');
        let sync = result.sync;
        expect(sync).to.be.an('object');
        expect(sync.id).to.be.a('string');
        expect(sync.get('counter')).to.equal(1);
        let checkLocal = (local) => {
            expect(local).to.be.an('object');
            expect(local.id).to.be.a('string');
            expect(local.counter).to.equal(1);
            expect(local.approved).to.equal(0);
        };
        let checkRemote = (remote) => {
            expect(remote).to.be.an('object');
            expect(remote.id).to.be.a('string');
            expect(remote.get('counter')).to.equal(1);
            expect(remote.get('approved')).to.equal(0);
        };
        checkLocal(result.me.local);
        checkRemote(result.me.remote);
        checkLocal(result.them.local);
        checkRemote(result.them.remote);
    });

    it("can add a resource", async function() {
        let result;
        result = await store.dispatch('initiateTradeWith', {
            themId: this.themId,
            meId: this.meId
        });
        expect(result.me.local.resources).to.be.an('array').of.length(0);
        expect(result.me.remote.get('resources')).to.be.an('array').of.length(0);
        const {remote: resource} = await store.dispatch('createNewResource', this.meId);
        result = await store.dispatch('addResourceToTrade', {
            syncId: result.sync.id,
            resourceId: resource.id,
            memberId: this.meId
        });
        expect(result).to.be.an('object');
        expect(result.me).to.be.an('object');
        expect(result.me.local).to.be.an('object');
        expect(result.me.remote).to.be.an('object');
        expect(result.me.local.counter).to.equal(2);
        expect(result.me.local.resources).to.be.an('array').that.includes(resource.id);
        expect(result.me.local.resources).to.have.lengthOf(1);
        expect(result.me.remote.get('counter')).to.equal(2);
        expect(result.me.remote.get('resources')).to.be.an('array').that.includes(resource.id);
        expect(result.me.remote.get('resources')).to.have.lengthOf(1);
        expect(result.sync.get('counter')).to.equal(2);
    });

    it("can't add the same resource twice", async function() {
        let result;
        result = await store.dispatch('initiateTradeWith', {
            themId: this.themId,
            meId: this.meId
        });
        const {remote: resource} = await store.dispatch('createNewResource', this.meId);
        result = await store.dispatch('addResourceToTrade', {
            syncId: result.sync.id,
            resourceId: resource.id,
            memberId: this.meId
        });
        result = await store.dispatch('addResourceToTrade', {
            syncId: result.sync.id,
            resourceId: resource.id,
            memberId: this.meId
        });
        expect(result).to.be.an('object');
        expect(result.me).to.be.an('object');
        expect(result.me.local).to.be.an('object');
        expect(result.me.remote).to.be.an('object');
        expect(result.me.local.counter).to.equal(3);
        expect(result.me.local.resources).to.be.an('array').that.includes(resource.id);
        expect(result.me.local.resources).to.have.lengthOf(1);
        expect(result.me.remote.get('counter')).to.equal(3);
        expect(result.me.remote.get('resources')).to.be.an('array').that.includes(resource.id);
        expect(result.me.remote.get('resources')).to.have.lengthOf(1);
        expect(result.sync.get('counter')).to.equal(3);
    });

    it("can't change other side's resources", async function() {
        let result = await store.dispatch('initiateTradeWith', {
            themId: this.themId,
            meId: this.meId
        });
        try {
            result.them.remote.increment('counter');
            await result.them.remote.save();
            expect.fail("Allowed me to save the other remote object");
        } catch (e) {

        }
    });

    it("can change my resources", async function() {
        let result = await store.dispatch('initiateTradeWith', {
            themId: this.themId,
            meId: this.meId
        });
        result.me.remote.increment('counter');
        await result.me.remote.save();
    });

    it ("can't add non-existent resources", async function() {
        let result;
        result = await store.dispatch('initiateTradeWith', {
            themId: this.themId,
            meId: this.meId
        });
        expect(result.me.local.resources).to.be.an('array').of.length(0);
        expect(result.me.remote.get('resources')).to.be.an('array').of.length(0);
        try {
            result = await store.dispatch('addResourceToTrade', {
                syncId: result.sync.id,
                resourceId: "aoeu",
                memberId: this.meId
            });
            expect.fail("Shouldn't have let me complete this dispatch.");
        } catch (e) {
            expect(true).to.equal(true);
        }
        expect(result).to.be.an('object');
        expect(result.me).to.be.an('object');
        expect(result.me.local).to.be.an('object');
        expect(result.me.remote).to.be.an('object');
        expect(result.me.local.counter).to.equal(1);
        expect(result.me.local.resources).to.be.an('array').that.does.not.include("aoeu");
        expect(result.me.local.resources).to.have.lengthOf(0);
        expect(result.me.remote.get('counter')).to.equal(1);
        expect(result.me.remote.get('resources')).to.be.an('array').that.does.not.include("aoeu");
        expect(result.me.remote.get('resources')).to.have.lengthOf(0);
        expect(result.sync.get('counter')).to.equal(1);
    });

    it ("can't add another person's resource", async function() {
        let result;
        result = await store.dispatch('initiateTradeWith', {
            themId: this.themId,
            meId: this.meId
        });
        expect(result.me.local.resources).to.be.an('array').of.length(0);
        expect(result.me.remote.get('resources')).to.be.an('array').of.length(0);
        let {remote: resource} = await store.dispatch('createNewResource', this.meId);
        let acl = new Parse.ACL();
        acl.setPublicWriteAccess(false);
        acl.setPublicReadAccess(false);
        resource.setACL(acl);
        resource = await resource.save();
        try {
            result = await store.dispatch('addResourceToTrade', {
                syncId: result.sync.id,
                resourceId: resource.id,
                memberId: this.meId
            });
            expect.fail("Shouldn't have let me complete this dispatch.");
        } catch (e) {
            expect(true).to.equal(true);
        }
        expect(result).to.be.an('object');
        expect(result.me).to.be.an('object');
        expect(result.me.local).to.be.an('object');
        expect(result.me.remote).to.be.an('object');
        expect(result.me.local.counter).to.equal(1);
        expect(result.me.local.resources).to.be.an('array').that.does.not.include(resource.id);
        expect(result.me.local.resources).to.have.lengthOf(0);
        expect(result.me.remote.get('counter')).to.equal(1);
        expect(result.me.remote.get('resources')).to.be.an('array').that.does.not.include(resource.id);
        expect(result.me.remote.get('resources')).to.have.lengthOf(0);
        expect(result.sync.get('counter')).to.equal(1);
    });
};

describe('member/Trade.vue', () => {
    before(function() {
        Parse.serverURL = process.env.VUE_APP_PARSE_SERVER_URL;
        Parse.initialize(
            'APPLICATION_ID', // This is your Application ID
            'g8q6x9uvsept5Sjfz3hdiiP3mh5mgOoda2rZeP4I' // This is your Javascript key
        );
        this.meId = "UjAJB34E6d";
        this.themId = "tUl6fCXYD4";
        this.gamemasterId = "if1YbUYMUB";
        return Parse.User.logIn(
            process.env.VUE_APP_TEST_USERNAME,
            process.env.VUE_APP_TEST_PASSWORD)
            .finally(() => {
                expect(Parse.User.current()).not.to.equal(undefined);
            });

    });

    tradeWithoutChangingLogin();

    it("can complete a full trade from another to me", async function() {
        let result;
        result = await store.dispatch('initiateTradeWith', {
            themId: this.themId,
            meId: this.meId
        });
        await store.dispatch('loadOrUseCurrentMember', this.meId);
        let {remote: resource} = await store.dispatch('createNewResource', this.themId);
        await Parse.User.logOut();
        await Parse.User.logIn(
            process.env.VUE_APP_TEST_THEM_USERNAME,
            process.env.VUE_APP_TEST_THEM_PASSWORD);
        result = await store.dispatch('addResourceToTrade', {
            syncId: result.sync.id,
            resourceId: resource.id,
            memberId: this.themId
        });
        result = await store.dispatch('updateTrade', {
            syncId: result.sync.id,
        });
        await store.dispatch('acceptTradeAs', {
            syncId: result.sync.id,
            memberId: this.themId
        });
        await Parse.User.logOut();
        await Parse.User.logIn(
            process.env.VUE_APP_TEST_USERNAME,
            process.env.VUE_APP_TEST_PASSWORD);
        result = await store.dispatch('updateTrade', {
            syncId: result.sync.id,
        });
        await store.dispatch('acceptTradeAs', {
            syncId: result.sync.id,
            memberId: this.meId
        });
        await store.dispatch('completeTrade', {
            syncId: result.sync.id
        });
        await store.dispatch('loadOrUseResource', {
            resourceId: resource.id,
            force: true
        });
        let newResource = store.state.resources.remoteResources[resource.id];
        expect(newResource).to.be.an('object');
        expect(newResource.get('member').id).to.equal(this.meId);

        let resourceIds = await store.dispatch('loadOrUseAllResourceIds', this.themId);
        expect(resourceIds).to.be.an('array').that.does.not.include(resource.id);
    });

    /*
    it("can get all active trades", async () => {
        expect.fail("Not implemented.");
    });

    it("can add to trade without having initiated it", async () => {
        expect.fail("Not implemented.");
    });

    it ("can only add your resources", async () => {
        expect.fail("Not implemented.");
    });

    it ("can't change the sync count yourself", async () => {
        expect.fail("Not implemented.");
    });
     */
});

describe('gamemaster/Trade.vue', () => {
    before(function () {
        Parse.serverURL = process.env.VUE_APP_PARSE_SERVER_URL;
        Parse.initialize(
            'APPLICATION_ID', // This is your Application ID
            'g8q6x9uvsept5Sjfz3hdiiP3mh5mgOoda2rZeP4I' // This is your Javascript key
        );
        this.meId = "UjAJB34E6d";
        this.themId = "tUl6fCXYD4";
        return Parse.User.logIn(
            process.env.VUE_APP_TEST_GAMEMASTER_USERNAME,
            process.env.VUE_APP_TEST_GAMEMASTER_PASSWORD)
            .finally(() => {
                expect(Parse.User.current()).not.to.equal(undefined);
            });

    });

    tradeWithoutChangingLogin();

    it("can complete a full trade from another to me", async function() {
        let result;
        result = await store.dispatch('initiateTradeWith', {
            themId: this.themId,
            meId: this.meId
        });

        await Parse.User.logOut();
        await Parse.User.logIn(
            process.env.VUE_APP_TEST_USERNAME,
            process.env.VUE_APP_TEST_PASSWORD);
        await store.dispatch('loadOrUseCurrentMember', this.meId);
        let {remote: resource} = await store.dispatch('createNewResource', this.themId);
        await Parse.User.logOut();
        await Parse.User.logIn(
            process.env.VUE_APP_TEST_THEM_USERNAME,
            process.env.VUE_APP_TEST_THEM_PASSWORD);
        result = await store.dispatch('addResourceToTrade', {
            syncId: result.sync.id,
            resourceId: resource.id,
            memberId: this.themId
        });
        result = await store.dispatch('updateTrade', {
            syncId: result.sync.id,
        });
        await store.dispatch('acceptTradeAs', {
            syncId: result.sync.id,
            memberId: this.themId
        });
        await Parse.User.logOut();
        await Parse.User.logIn(
            process.env.VUE_APP_TEST_USERNAME,
            process.env.VUE_APP_TEST_PASSWORD);
        result = await store.dispatch('updateTrade', {
            syncId: result.sync.id,
        });
        await store.dispatch('acceptTradeAs', {
            syncId: result.sync.id,
            memberId: this.meId
        });
        await store.dispatch('completeTrade', {
            syncId: result.sync.id
        });
        await store.dispatch('loadOrUseResource', {
            resourceId: resource.id,
            force: true
        });
        let newResource = store.state.resources.remoteResources[resource.id];
        expect(newResource).to.be.an('object');
        expect(newResource.get('member').id).to.equal(this.meId);

        let resourceIds = await store.dispatch('loadOrUseAllResourceIds', this.themId);
        expect(resourceIds).to.be.an('array').that.does.not.include(resource.id);
    });
});
