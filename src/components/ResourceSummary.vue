<template>
    <div>
        <b-card class="w-100">
            <b-card-title>{{resource.name}}</b-card-title>
            <b-card-sub-title v-if="showIds">
                {{resource.id}}
                <slot>
                    <button v-on:click="edit">Edit {{resource.name}}</button>
                    <button v-on:click="remove">Delete {{resource.name}}</button>
                </slot>
            </b-card-sub-title>
            <b-list-group>
                <component-summary v-for="id in componentIds" :key="id" :componentId="id" :memberId="memberId" :resourceId="resourceId" />
            </b-list-group>
            <b-card-footer>

            </b-card-footer>
        </b-card>
    </div>
</template>

<script>
    import ComponentSummary from '@/components/ComponentSummary.vue';
    export default {
        name: "ResourceSummary",
        props: [
            'memberId',
            'resourceId'
        ],
        components: {
            ComponentSummary
        },
        computed: {
            resource() {
                return this.$store.state.resources.resources[this.$props.resourceId] || { id: "" , name: ""};
            },
            componentIds() {
                return this.resource.componentIds;
            },
            showIds() {
                return process.env.VUE_APP_SHOW_IDS;
            }
        },
        mounted: function () {
            this.fetch();
        },
        methods: {
            async fetch() {
                await this.$store.dispatch('loadOrUseResource', this.$props.resourceId);
                await this.$store.dispatch('loadOrUseResourceComponents', this.$props.resourceId);
            },
            edit() {
                this.$router.push({
                    'name': 'memberResourceEdit',
                    params: {
                        memberId: this.resource.member.id,
                        resourceId: this.$props.resourceId
                    }
                });
            },
            async remove() {
                await this.$store.dispatch('destroyResource', this.$props.resourceId);
            }
        }
    }
</script>

<style scoped>

</style>