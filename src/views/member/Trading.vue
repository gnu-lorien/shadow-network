<template>
    <div class="container">
        <button v-on:click="initiatingATrade">Initiate a Trade</button>
        <button v-on:click="declineAllTrades">Decline All Trades</button>
        <div v-if="initiating">
            <member-summary class="row" v-for="id in members" :key="id" :memberId="id" @member-selected="select"/>
        </div>
        <b-list-group>
            <b-list-group-item v-for="syncId in syncIds" :key="syncId" @click="openTrade(syncId)">Trade: {{syncId}}</b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    import Parse from "parse";
    import Member from '@/models/member.js';
    import CurrentMember from '@/mixins/CurrentMember.js'
    import MemberSummary from '@/components/MemberSummary.vue'
    export default {
        name: "MemberTrading",
        components: {
            MemberSummary
        },
        props: [
            "memberId"
        ],
        mixins: [ CurrentMember ],
        data: function() {
            return {
                syncIds: [],
                initiating: false,
                members: []
            }
        },
        mounted: async function() {
            await this.fetch();
        },
        methods: {
            async fetch() {
                this.syncIds = await this.$store.dispatch('loadOrUseTradeIds',{
                    memberId: this.$props.memberId,
                    filters: {
                        noStarted: true,
                        noCompleted: true
                    }
                });
            },
            async initiatingATrade() {
                let user = Parse.User.current();
                let userId = user.id;
                const q = new Parse.Query(Member);
                q.equalTo("owner", {
                    __type: 'Pointer',
                    className: '_User',
                    objectId: userId
                });
                q.select("id");
                let members = await q.find();
                this.members = members.map(member => member.id);
                this.initiating = true;
            },
            async select(memberId) {
                await this.$store.dispatch('initiateTradeWith', {
                    themId: memberId,
                    meId: this.$props.memberId
                });
                await this.fetch();
                this.initiating = false;
            },
            openTrade(syncId) {
                this.$router.push({
                    name: 'memberTradeLanding',
                    params: {
                        memberId: this.$props.memberId,
                        syncId: syncId
                    }
                });
            },
            async declineAllTrades() {
                await this.$store.dispatch('declineTrades', {
                    syncIds: this.syncIds
                });
                await this.fetch();
            }
        }
    }
</script>

<style scoped>

</style>