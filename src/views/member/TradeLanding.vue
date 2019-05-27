<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <button v-on:click="acceptTrade">Accept</button>
                <button v-on:click="refresh">Refresh</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <b-card bg-variant="dark" text-variant="white" border-variant="primary">
                    <b-card-header>{{currentMember.street_name}}</b-card-header>
                    <b-card-body v-if="!adding">
                        <button v-on:click="add">Add Resources to Trade</button>
                        <resource-summary class="row" v-for="id in me.resources" :key="id" :resourceId="id" :memberId="memberId">
                            <button v-on:click="removeFromMyResources(id)">Remove Resource from Trade</button>
                        </resource-summary>
                    </b-card-body>
                    <b-card-body v-if="adding">
                        <resource-summary class="row" v-for="id in resources" :key="id" :resourceId="id" :memberId="memberId">
                            <button v-on:click="addToMyResources(id)">Add Resource to Trade</button>
                        </resource-summary>
                    </b-card-body>
                </b-card>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <b-card bg-variant="dark" text-variant="white">
                    <b-card-header>{{themMember.get('street_name')}}</b-card-header>
                    <b-card-body>
                        <resource-summary class="row" v-for="id in them.resources" :key="id" :resourceId="id" :memberId="memberId"/>
                    </b-card-body>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
    import Parse from 'parse';
    import ResourceSummary from '@/components/ResourceSummary.vue';
    import CurrentMember from '@/mixins/CurrentMember.js'
    import Member from '@/models/member.js'

    export default {
        name: "MemberTradeLanding",
        components: {
            ResourceSummary
        },
        mixins: [ CurrentMember ],
        props: [
            'memberId',
            'syncId'
        ],
        data: function() {
            return {
                meOfferId: "",
                themOfferId: "",
                themMember: {},
                adding: false
            }
        },
        mounted: async function () {
            await this.fetch();
        },
        computed: {
            resources() {
                return this.$store.state.member.resourceIds;
            },
            sync() {
                return this.$store.state.trading.syncs[this.$props.syncId];
            },
            me() {
                return this.$store.state.trading.offers[this.meOfferId];
            },
            them() {
                return this.$store.state.trading.offers[this.themOfferId];
            }
        },
        methods: {
            async fetch() {
                await this.$store.dispatch('loadOrUseCurrentMemberResourceIds', 1);
                let result = await this.$store.dispatch('loadOrUseTrade', {
                    memberId: this.$props.memberId,
                    syncId: this.$props.syncId
                });
                this.meOfferId = result.me.id;
                this.themOfferId = result.them.id;
                this.themMember = await new Parse.Query(Member).get(result.them.get('member').id);
            },
            async add() {
                this.adding = true;
            },
            async addToMyResources(resourceId) {
                await this.$store.dispatch('addResourceToTrade', {
                    syncId: this.$props.syncId,
                    memberId: this.$props.memberId,
                    resourceId: resourceId
                });
                this.adding = false;
            },
            async removeFromMyResources(resourceId) {
                 await this.$store.dispatch('removeResourceFromTrade', {
                    syncId: this.$props.syncId,
                    memberId: this.$props.memberId,
                    resourceId: resourceId
                });
            },
            async acceptTrade() {
                try {
                    await this.$store.dispatch('acceptTradeAs', {
                        syncId: this.$props.syncId,
                        memberId: this.$props.memberId
                    });
                    let result = await this.$store.dispatch('completeTrade', {
                        syncId: this.$props.syncId
                    });
                    // RAS TODO Go back to the resources view and bask in your new resources
                    alert("Success!");
                } catch (e) {
                    // We don't actually care if this fails. We care if it succeeds
                    alert("Trade isn't ready to be completed." + e.message);
                }
            },
            async refresh() {
                await this.$store.dispatch('updateTrade', {
                    syncId: this.$props.syncId
                });
            }
        },
    }
</script>

<style scoped>

</style>