<template>
    <div>
        <button v-on:click="startNewTrade">Initiate a Trade</button>
        <b-list-group>
            <b-list-group-item>Trade One</b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    import CurrentMember from '@/mixins/CurrentMember.js'
    export default {
        name: "MemberTrading",
        props: [
            "memberId"
        ],
        mixins: [ CurrentMember ],
        methods: {
            async startNewTrade() {
                try {
                    let themId = "tUl6fCXYD4";
                    let trade = await this.$store.dispatch('initiateTradeWith', {
                        meId: this.memberId,
                        themId: themId
                    });
                    trade = await this.$store.dispatch('addResourceToTrade', {
                        tradeId: trade.id,
                        resourceId: "aoeuaoeu",
                        memberId: this.memberId
                    });
                    trade = await this.$store.dispatch('addResourceToTrade', {
                        tradeId: trade.id,
                        resourceId: "aoeuaoeu",
                        memberId: this.memberId
                    });
                    trade = await this.$store.dispatch('addResourceToTrade', {
                        tradeId: trade.id,
                        resourceId: "dige93thau",
                        memberId: themId
                    });
                    console.log(trade);
                } catch (e) {
                    console.log(e.message);
                }
            }
        }
    }
</script>

<style scoped>

</style>