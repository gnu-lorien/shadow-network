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
                    let localTrade, remoteTrade;
                    try {
                        [localTrade, remoteTrade] = await this.$store.dispatch('initiateTradeWith', {
                            meId: this.memberId,
                            themId: themId
                        });
                    } catch (e) {
                        console.log(JSON.stringify(e));
                    }
                    [localTrade, remoteTrade] = await this.$store.dispatch('addResourceToTrade', {
                        tradeId: localTrade.id,
                        resourceId: "aoeuaoeu",
                        memberId: this.memberId
                    });
                    [localTrade, remoteTrade] = await this.$store.dispatch('addResourceToTrade', {
                        tradeId: localTrade.id,
                        resourceId: "aoeuaoeu",
                        memberId: this.memberId
                    });
                    [localTrade, remoteTrade] = await this.$store.dispatch('addResourceToTrade', {
                        tradeId: localTrade.id,
                        resourceId: "dige93thau",
                        memberId: themId
                    });
                    console.log(localTrade);
                } catch (e) {
                    console.log(e.message);
                }
            }
        }
    }
</script>

<style scoped>

</style>