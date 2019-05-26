<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <b-card bg-variant="dark" text-variant="white" border-variant="primary">
                    <b-card-header>{{currentMember.street_name}}</b-card-header>
                    <b-card-body>
                        <button v-on:click="add">Add</button>
                        <resource-summary class="row" v-for="id in me.resources" :key="id" :resourceId="id" :memberId="memberId"/>
                    </b-card-body>
                </b-card>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <b-card bg-variant="dark" text-variant="white">
                    <b-card-header>{{themMember.get('street_name')}}</b-card-header>
                    <b-card-body>
                        <button v-on:click="add">Add</button>
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
                themMember: {}
            }
        },
        mounted: async function () {
            console.log('break');
            await this.fetch();
            console.log('break');
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
                await this.$store.dispatch('loadOrUseCurrentMemberResourceIds');
                console.log('break');
                let result = await this.$store.dispatch('loadOrUseTrade', {
                    memberId: this.$props.memberId,
                    syncId: this.$props.syncId
                });
                this.meOfferId = result.me.id;
                this.themOfferId = result.them.id;
                this.themMember = await new Parse.Query(Member).get(result.them.get('member').id);
            },
            async add() {
                try {
                    await this.$store.dispatch('createNewCurrentMemberResource');
                } catch (e) {
                    alert("Failed to create new resource " + e.message);
                }
            }
        },
    }
</script>

<style scoped>

</style>