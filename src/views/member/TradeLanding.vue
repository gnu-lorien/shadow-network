<template>
    <b-container>
        <div class="row">
            <div class="col">
                <b-jumbotron>
                    <template slot="header">Handle a Trade</template>
                    <template slot="lead">Transfer resources between two members of the same shadow network</template>
                    <p>Each side may offer their resources and the system automatically transfers them when both sides accept.</p>
                    <div v-if="0 !== me.resources.length">
                        <p>You are offering:</p>
                        <ul>
                            <li v-for="id in me.resources" :key="id">
                                <resource-summary :resourceId="id" :memberId="memberId" :textonly="true"></resource-summary>
                            </li>
                        </ul>
                    </div>
                    <div v-if="0 !== them.resources.length">
                        <p>They are offering:</p>
                        <ul>
                            <li v-for="id in them.resources" :key="id">
                                <resource-summary :resourceId="id" :memberId="memberId" :textonly="true"></resource-summary>
                            </li>
                        </ul>
                    </div>
                    <div v-if="!tradeCompleted">
                        <p v-if="meAccepted">You have accepted this trade.</p>
                        <p v-else>You have not accepted this trade.</p>
                        <p v-if="themAccepted">They have accepted this trade.</p>
                        <p v-else>They have not accepted this trade.</p>
                        <b-button v-on:click="acceptTrade" v-if="!meAccepted">Accept</b-button>
                        <b-button v-on:click="refresh">Refresh</b-button>
                    </div>
                    <div v-if="tradeCompleted">
                        <p v-if="!tradeDeclined">This trade is completed!</p>
                        <p v-else>This trade was declined.</p>
                    </div>
                </b-jumbotron>
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
                        <button v-on:click="cancel">Cancel Adding Resources to Trade</button>
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
                    <b-card-header>{{themMemberStreetName}}</b-card-header>
                    <b-card-body>
                        <resource-summary class="row" v-for="id in them.resources" :key="id" :resourceId="id" :memberId="memberId"/>
                    </b-card-body>
                </b-card>
            </div>
        </div>
    </b-container>
</template>

<script>
    import Parse from 'parse';
    import ResourceSummary from '@/components/ResourceSummary.vue';
    import CurrentMember from '@/mixins/CurrentMember.js'
    import Member from '@/models/member.js'
    import Vue from 'vue'

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
                adding: false,

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
                return this.$store.state.trading.offers[this.meOfferId] || { resources: [], approved: 0};
            },
            them() {
                return this.$store.state.trading.offers[this.themOfferId] || { resources: [], approved: 0};
            },
            themMemberStreetName() {
                return this.themMember.get ? this.themMember.get('street_name') : "";
            },
            meAccepted() {
                if (this.sync && this.sync.counter) {
                    if (this.me.approved) {
                        return this.sync.counter === this.me.approved;
                    }
                }
                return false;
            },
            themAccepted() {
                if (this.sync && this.sync.counter) {
                    if (this.them.approved) {
                        return this.sync.counter === this.them.approved;
                    }
                }
                return false;
            },
            tradeCompleted() {
                return this.sync && this.sync.completed;
            },
            tradeDeclined() {
                return this.sync && this.tradeCompleted && this.sync.declined;
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
            async cancel() {
                this.adding = false;
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
                    await this.$store.dispatch('completeTrade', {
                        syncId: this.$props.syncId
                    });
                    await this.refresh();
                } catch (e) {
                    // We don't actually care if this fails. We care if it succeeds
                    await this.refresh();
                    if (this.meAccepted && this.themAccepted) {
                        alert("Trade couldn't be completed for some reason: " + e.message);
                    }
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