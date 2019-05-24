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

    it("can't change other side's resources", async () => {
        let result = await store.dispatch('initiateTradeWith', {
            themId: themId,
            meId: meId
        });
        try {
            result.them.remote.increment('counter');
            await result.them.remote.save();
            expect.fail("Allowed me to save the other remote object");
        } catch (e) {

        }
    });

    it("can get all active trades", async () => {
    });

    it("can add to trade without having initiated it", async () => {
    });
});