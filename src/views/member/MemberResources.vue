<template>
    <div class="container">
        <div class="row">
            <button v-on:click="add">Add</button>
        </div>
        <resource-summary class="row" v-for="id in resources" :key="id" :resourceId="id" :memberId="memberId"/>
    </div>
</template>

<script>
    import Parse from 'parse';
    import ResourceSummary from '@/components/ResourceSummary.vue';
    import CurrentMember from '@/mixins/CurrentMember.js'
    import Member from '@/models/member.js'

    export default {
        name: "MemberResources",
        components: {
            ResourceSummary
        },
        mixins: [ CurrentMember ],
        props: [ 'memberId' ],
        mounted: function () {
            this.fetch();
        },
        computed: {
            resources() {
                return this.$store.state.member.resourceIds;
            }
        },
        methods: {
            fetch() {
                this.$store.dispatch('loadOrUseCurrentMemberResourceIds');
            },
            async add() {
                try {
                    await this.$store.dispatch('createNewCurrentMemberResource', this.$props.memberId);
                } catch (e) {
                    alert("Failed to create new resource " + e.message);
                }
            }
        },
    }
</script>

<style scoped>

</style>