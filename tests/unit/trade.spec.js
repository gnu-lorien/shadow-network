import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import Parse from 'parse'
import store from '@/store.js'

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
        let [trade, remoteTrade] = await store.dispatch('initiateTradeWith', {
            themId: themId,
            meId: meId
        });
        expect(trade).to.be.an('object');
        expect(trade.id).to.be.a('string');
        expect(trade.counter).to.equal(1);
        expect(remoteTrade).to.be.an('object');
        expect(remoteTrade.id).to.be.a('string');
        expect(remoteTrade.get('counter')).to.equal(1);
    });

    it("can't add the same resource twice", async () => {
        let localTrade, remoteTrade;
        [localTrade, remoteTrade] = await store.dispatch('initiateTradeWith', {
            themId: themId,
            meId: meId
        });
        expect(localTrade.id).to.be.a('string');
        expect(localTrade.counter).to.equal(1);
        expect(remoteTrade.id).to.be.a('string');
        expect(remoteTrade.get('counter')).to.equal(1);
        [localTrade, remoteTrade] = await store.dispatch('addResourceToTrade', {
            tradeId: localTrade.id,
            resourceId: "aoeuaoeu",
            memberId: meId
        });
        expect(localTrade).to.be.an('object');
        expect(localTrade.counter).to.equal(2);
        expect(localTrade.meResources).to.be.an('array').that.includes("aoeuaoeu");
        expect(localTrade.meResources).to.have.lengthOf(1);
        expect(remoteTrade).to.be.an('object');
        expect(remoteTrade.get('counter')).to.equal(2);
        expect(remoteTrade.get('meResources')).to.be.an('array').that.includes("aoeuaoeu");
        expect(remoteTrade.get('meResources')).to.have.lengthOf(1);
        [localTrade, remoteTrade] = await store.dispatch('addResourceToTrade', {
            tradeId: localTrade.id,
            resourceId: "aoeuaoeu",
            memberId: meId
        });
        expect(localTrade.counter).to.equal(3);
        expect(localTrade.meResources).to.be.an('array').that.includes("aoeuaoeu");
        expect(localTrade.meResources).to.have.lengthOf(1);
        expect(remoteTrade.get('counter')).to.equal(3);
        expect(remoteTrade.get('meResources')).to.be.an('array').that.includes("aoeuaoeu");
        expect(remoteTrade.get('meResources')).to.have.lengthOf(1);
    });

    it("synchronizes me and them", async () => {
        let localTrade, remoteTrade;
        [localTrade, remoteTrade] = await store.dispatch('initiateTradeWith', {
            themId: themId,
            meId: meId
        });
        expect(localTrade.id).to.be.a('string');
        expect(localTrade.counter).to.equal(1);
        expect(remoteTrade.id).to.be.a('string');
        expect(remoteTrade.get('counter')).to.equal(1);
        let [myLocalTrade, myRemoteTrade] = await store.dispatch('addResourceToTrade', {
            tradeId: localTrade.id,
            resourceId: "aoeuaoeu",
            memberId: meId
        });
        expect(myLocalTrade).to.be.an('object');
        expect(myLocalTrade.counter).to.equal(2);
        expect(myLocalTrade.meResources).to.be.an('array').that.includes("aoeuaoeu");
        expect(myLocalTrade.meResources).to.have.lengthOf(1);
        expect(myRemoteTrade).to.be.an('object');
        expect(myRemoteTrade.get('counter')).to.equal(2);
        expect(myRemoteTrade.get('meResources')).to.be.an('array').that.includes("aoeuaoeu");
        expect(myRemoteTrade.get('meResources')).to.have.lengthOf(1);
        let [themLocalTrade, themRemoteTrade] = await store.dispatch('addResourceToTrade', {
            tradeId: localTrade.id,
            resourceId: "1234stahoeu124",
            memberId: themId
        });
        expect(themLocalTrade.counter).to.equal(3);
        expect(themLocalTrade.themResources).to.be.an('array').that.includes("1234stahoeu124");
        expect(themLocalTrade.themResources).to.have.lengthOf(1);
        expect(themRemoteTrade.get('counter')).to.equal(3);
        expect(themRemoteTrade.get('themResources')).to.be.an('array').that.includes("1234stahoeu124");
        expect(themRemoteTrade.get('themResources')).to.have.lengthOf(1);
        expect(myLocalTrade).to.be.an('object');
        expect(myLocalTrade.counter).to.equal(2);
        expect(myLocalTrade.meResources).to.be.an('array').that.includes("aoeuaoeu");
        expect(myLocalTrade.meResources).to.have.lengthOf(1);
        expect(myRemoteTrade).to.be.an('object');
        expect(myRemoteTrade.get('counter')).to.equal(2);
        expect(myRemoteTrade.get('meResources')).to.be.an('array').that.includes("aoeuaoeu");
        expect(myRemoteTrade.get('meResources')).to.have.lengthOf(1);
        [myLocalTrade, myRemoteTrade] = await store.dispatch('addResourceToTrade', {
            tradeId: localTrade.id,
            resourceId: "disnorenun",
            memberId: meId
        });
        expect(myLocalTrade).to.be.an('object');
        expect(myLocalTrade.counter).to.equal(4);
        expect(myLocalTrade.meResources).to.be.an('array').that.includes("disnorenun");
        expect(myLocalTrade.meResources).to.be.an('array').that.includes("aoeuaoeu");
        expect(myLocalTrade.meResources).to.have.lengthOf(1);
        expect(myRemoteTrade).to.be.an('object');
        expect(myRemoteTrade.get('counter')).to.equal(2);
        expect(myRemoteTrade.get('meResources')).to.be.an('array').that.includes("disnorenun");
        expect(myRemoteTrade.get('meResources')).to.be.an('array').that.includes("aoeuaoeu");
        expect(myRemoteTrade.get('meResources')).to.have.lengthOf(2);
        expect(myLocalTrade.themResources).to.be.an('array').that.includes("1234stahoeu124");
        expect(myLocalTrade.themResources).to.have.lengthOf(1);
        expect(myRemoteTrade.get('themResources')).to.be.an('array').that.includes("1234stahoeu124");
        expect(myRemoteTrade.get('themResources')).to.have.lengthOf(1);
    });
})