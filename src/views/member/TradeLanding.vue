<template>
    <div class="container">
        <div class="row">
            <button v-on:click="add">Add</button>
        </div>
        <resource-summary class="row" v-for="id in resources" :key="id" :resourceId="id" :memberId="memberId"/>
    </div>
</template>

<script>
    import ResourceSummary from '@/components/ResourceSummary.vue';
    import CurrentMember from '@/mixins/CurrentMember.js'

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
                themOfferId: ""
            }
        },
        mounted: async function () {
            console.log('not mounting?');
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
                await this.$store.dispatch('loadOrUseCurrentMemberResourceIds');
                let result = await this.$store.dispatch('loadOrUseTrade', {
                    memberId: this.$props.memberId,
                    syncId: this.$props.syncId
                });
                this.meOfferId = result.me.id;
                this.themOfferId = result.them.id;
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