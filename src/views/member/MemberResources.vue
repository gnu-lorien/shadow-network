<template>
    <div class="container">
        <div class="row">
            <button v-on:click="add">Add</button>
            <b-pagination
                    v-model="currentPage"
                    :total-rows="resourcesCount"
                    :per-page="perPage"
            ></b-pagination>
            {{resourcesCount}} / {{currentPage}}
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
        data: function() {
            return {
                currentPage: 1
            }
        },
        mounted: function () {
            this.currentPage = this.$props.page;
        },
        computed: {
            resources() {
                return this.$store.state.member.resourceIds;
            },
            resourcesCount() {
                return this.$store.state.member.resourcesCount;
            },
            perPage() {
                return process.env.VUE_APP_PARSE_BATCH_SIZE;
            }
        },
        watch: {
            async currentPage(newVal) {
                let converted = parseInt(newVal);
                if (isNaN(converted)) {
                    converted = 1;
                }
                await this.$store.dispatch('loadOrUseCurrentMemberResourceIds', converted);
            }
        },
        methods: {
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