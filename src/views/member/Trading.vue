<template>
    <div class="container">
        <button v-on:click="initiatingATrade">Initiate a Trade</button>
        <button v-on:click="declineAllTrades">Decline All Trades</button>
        <member-select v-if="initiating" @member-selected="select"></member-select>
        <b-list-group>
            <b-list-group-item v-for="syncId in syncIds" :key="syncId" @click="openTrade(syncId)">
                Trade between {{getSync(syncId).get('leftMember').get('street_name')}} and {{getSync(syncId).get('rightMember').get('street_name')}}
                <b-row>
                    <b-col>
                        <member-summary :memberId="getSync(syncId).get('leftMember').id"><span></span></member-summary>
                    </b-col>
                    <b-col>
                        <member-summary :memberId="getSync(syncId).get('rightMember').id"><span></span></member-summary>
                    </b-col>
                </b-row>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    import Parse from "parse";
    import Member from '@/models/member.js';
    import CurrentMember from '@/mixins/CurrentMember.js'
    import MemberSelect from '@/components/MemberSelect.vue'
    import MemberSummary from '@/components/MemberSummary.vue'

    export default {
        name: "MemberTrading",
        components: {
            MemberSelect,
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
            getSync(syncId) {
                return this.$store.state.trading.remoteSyncs[syncId];
            },
            async initiatingATrade() {
                const q = new Parse.Query(Member);
                q.select("id");
                let members = [];
                q.each((member) => {
                    members.push(member.id);
                });
                this.members = members;
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