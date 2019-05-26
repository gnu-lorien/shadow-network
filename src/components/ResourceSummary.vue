<template>
    <div>
        <b-card>
            <b-card-title>{{resource.name}}</b-card-title>
            <b-card-sub-title>{{resource.id}}</b-card-sub-title>
            <b-list-group>
                <component-summary v-for="id in componentIds" :key="id" :componentId="id" :memberId="memberId" :resourceId="resourceId" />
            </b-list-group>
            <b-card-footer>
                <slot>
                    <button v-on:click="edit">Edit</button>
                    <button v-on:click="remove">Delete</button>
                </slot>
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
            }
        },
        mounted: function () {
            this.fetch();
        },
        methods: {
            fetch() {
                this.$store.dispatch('loadOrUseResource', this.$props.resourceId)
                    .then(() => {
                        return this.$store.dispatch('loadOrUseResourceComponents', this.$props.resourceId);
                    })
                    .catch((e) => {
                        alert("Failed to load resource or components " + e.message);
                    });
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