<template>
    <div class="container">
        <div class="row">
            <button v-on:click="add">Add</button>
            <b-pagination-nav :link-gen="linkGen" :number-of-pages="resourcesCount / 10" use-router></b-pagination-nav>
        </div>
        <resource-summary class="row" v-for="id in resources" :key="id" :resourceId="id" :memberId="memberId"/>
    </div>
</template>

<script>
    import ResourceSummary from '@/components/ResourceSummary.vue';
    import CurrentMember from '@/mixins/CurrentMember.js'

    export default {
        name: "MemberResources",
        components: {
            ResourceSummary
        },
        mixins: [ CurrentMember ],
        props: [ 'memberId', 'page' ],
        mounted: function () {
            this.fetch();
        },
        computed: {
            resources() {
                return this.$store.state.member.resourceIds;
            },
            resourcesCount() {
                return this.$store.state.member.resourcesCount;
            },
            currentPage() {
                if (this.$props.page) {
                    let converted = parseInt(this.$props.page);
                    if (isNaN(converted)) {
                        return 1;
                    }
                    return converted;
                }
                return 1;
            }
        },
        watch: {
            async page() {
                await this.$store.dispatch('loadOrUseCurrentMemberResourceIds', this.currentPage);
            }
        },
        methods: {
            linkGen(pageNum) {
                return {
                    name: 'memberResources',
                    query: { page: pageNum }
                }
            },
            fetch() {
                this.$store.dispatch('loadOrUseCurrentMemberResourceIds', this.currentPage);
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