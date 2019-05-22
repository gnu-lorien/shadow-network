import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import Parse from 'parse/dist/parse.js'
import store from '@/store.js'

describe('member/Trade.vue', () => {
    it('renders props.msg when passed', () => {
        const msg = 'new message'
        const wrapper = shallowMount(HelloWorld, {
            propsData: { msg }
        })
        expect(wrapper.text()).to.include(msg);
    });

    it('can initiate a trade', async () => {
        let trade = await store.dispatch('initiateTradeWith', {them: "aoeu"});
        expect(trade.id).to.be.a('string');
    })
})