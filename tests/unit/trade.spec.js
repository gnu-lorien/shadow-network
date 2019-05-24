import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import Parse from 'parse'
import store from '@/store.js'
import Trade from '@/models/trade.js';

describe('member/Trade.vue', () => {
    let themId, meId;
    before(function() {
        Parse.serverURL = process.env.VUE_APP_PARSE_SERVER_URL;
        Parse.initialize(
            'APPLICATION_ID', // This is your Application ID
            'g8q6x9uvsept5Sjfz3hdiiP3mh5mgOoda2rZeP4I' // This is your Javascript key
        );
        meId = "UjAJB34E6d";
        themId = "tUl6fCXYD4";
        return Parse.User.logIn(
            process.env.VUE_APP_TEST_USERNAME,
            process.env.VUE_APP_TEST_PASSWORD)
            .finally(() => {
                expect(Parse.User.current()).not.to.equal(undefined);
            });

    });

    it('renders props.msg when passed', () => {
        const msg = 'new message'
        const wrapper = shallowMount(HelloWorld, {
            propsData: { msg }
        })
        expect(wrapper.text()).to.include(msg);
    });

    it('can initiate a trade', async () => {
        let result = await store.dispatch('initiateTradeWith', {
            themId: themId,
            meId: meId
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

    it("can't add the same resource twice", async () => {
        let result;
        result = await store.dispatch('initiateTradeWith', {
            themId: themId,
            meId: meId
        });
        expect(result.me.local.resources).to.be.an('array').of.length(0);
        expect(result.me.remote.get('resources')).to.be.an('array').of.length(0);
        result = await store.dispatch('addResourceToTrade', {
            syncId: result.sync.id,
            resourceId: "aoeuaoeu",
            memberId: meId
        });
        expect(result).to.be.an('object');
        expect(result.me).to.be.an('object');
        expect(result.me.local).to.be.an('object');
        expect(result.me.remote).to.be.an('object');
        expect(result.me.local.counter).to.equal(2);
        expect(result.me.local.resources).to.be.an('array').that.includes("aoeuaoeu");
        expect(result.me.local.resources).to.have.lengthOf(1);
        expect(result.me.remote.get('counter')).to.equal(2);
        expect(result.me.remote.get('resources')).to.be.an('array').that.includes("aoeuaoeu");
        expect(result.me.remote.get('resources')).to.have.lengthOf(1);
        result = await store.dispatch('addResourceToTrade', {
            syncId: result.sync.id,
            resourceId: "aoeuaoeu",
            memberId: meId
        });
        expect(result).to.be.an('object');
        expect(result.me).to.be.an('object');
        expect(result.me.local).to.be.an('object');
        expect(result.me.remote).to.be.an('object');
        expect(result.me.local.counter).to.equal(3);
        expect(result.me.local.resources).to.be.an('array').that.includes("aoeuaoeu");
        expect(result.me.local.resources).to.have.lengthOf(1);
        expect(result.me.remote.get('counter')).to.equal(3);
        expect(result.me.remote.get('resources')).to.be.an('array').that.includes("aoeuaoeu");
        expect(result.me.remote.get('resources')).to.have.lengthOf(1);
    });

    it("synchronizes out of band updates", async () => {
        let result;
        result = await store.dispatch('initiateTradeWith', {
            themId: themId,
            meId: meId
        });
        expect(result.me.local.resources).to.be.an('array').of.length(0);
        expect(result.me.remote.get('resources')).to.be.an('array').of.length(0);
        result = await store.dispatch('addResourceToTrade', {
            syncId: result.sync.id,
            resourceId: "aoeuaoeu",
            memberId: meId
        });
        expect(result).to.be.an('object');
        expect(result.me).to.be.an('object');
        expect(result.me.local).to.be.an('object');
        expect(result.me.remote).to.be.an('object');
        expect(result.me.local.counter).to.equal(2);
        expect(result.me.local.resources).to.be.an('array').that.includes("aoeuaoeu");
        expect(result.me.local.resources).to.have.lengthOf(1);
        expect(result.me.remote.get('counter')).to.equal(2);
        expect(result.me.remote.get('resources')).to.be.an('array').that.includes("aoeuaoeu");
        expect(result.me.remote.get('resources')).to.have.lengthOf(1);
        let themResult = await store.dispatch('addResourceToTrade', {
            syncId: result.sync.id,
            resourceId: "1234stahoeu124",
            memberId: themId
        });
        expect(themResult).to.be.an('object');
        expect(themResult.me).to.be.an('object');
        expect(themResult.me.local).to.be.an('object');
        expect(themResult.me.remote).to.be.an('object');
        expect(themResult.me.local.counter).to.equal(3);
        expect(themResult.me.local.resources).to.be.an('array').that.includes("1234stahoeu124");
        expect(themResult.me.local.resources).to.have.lengthOf(1);
        expect(themResult.me.remote.get('counter')).to.equal(3);
        expect(themResult.me.remote.get('themResources')).to.be.an('array').that.includes("1234stahoeu124");
        expect(themResult.me.remote.get('themResources')).to.have.lengthOf(1);
        expect(result.me.local.counter).to.equal(2);
        expect(result.me.local.resources).to.be.an('array').that.includes("aoeuaoeu");
        expect(result.me.local.resources).to.have.lengthOf(1);

        let outOfBandTrade = await new Parse.Query(Trade).get(localTrade.id);
        outOfBandTrade.increment('counter', 5);
        outOfBandTrade = await outOfBandTrade.save();
        [myLocalTrade, myRemoteTrade] = await store.dispatch('addResourceToTrade', {
            tradeId: localTrade.id,
            resourceId: "disnorenun",
            memberId: meId
        });
        expect(myLocalTrade).to.be.an('object');
        expect(myLocalTrade.counter).to.equal(4 + 5);
        expect(myLocalTrade.meResources).to.be.an('array').that.includes("disnorenun");
        expect(myLocalTrade.meResources).to.be.an('array').that.includes("aoeuaoeu");
        expect(myLocalTrade.meResources).to.have.lengthOf(2);
        expect(myRemoteTrade).to.be.an('object');
        expect(myRemoteTrade.get('counter')).to.equal(4 + 5);
        expect(myRemoteTrade.get('meResources')).to.be.an('array').that.includes("disnorenun");
        expect(myRemoteTrade.get('meResources')).to.be.an('array').that.includes("aoeuaoeu");
        expect(myRemoteTrade.get('meResources')).to.have.lengthOf(2);
        expect(myLocalTrade.themResources).to.be.an('array').that.includes("1234stahoeu124");
        expect(myLocalTrade.themResources).to.have.lengthOf(1);
        expect(myRemoteTrade.get('themResources')).to.be.an('array').that.includes("1234stahoeu124");
        expect(myRemoteTrade.get('themResources')).to.have.lengthOf(1);
    });

    it("can get all active trades", async () => {
    });

    it("can add to trade without having initiated it", async () => {
    });
});