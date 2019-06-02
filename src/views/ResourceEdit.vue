<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <b-form @submit.prevent="save">
                    <b-form-group
                        id="resource-edit-fieldset-horizontal"
                        label-cols="2"
                        description="What to call this resource."
                        label="Name"
                        label-for="inputName">
                        <b-form-input v-model="resource.name" id="inputName"/>
                    </b-form-group>
                    <b-form-group
                        id="resource-edit-group-2"
                        label-cols="2"
                        description="Which order to display this resource. Larger numbers display at the top."
                        label="Order"
                        label-for="inputOrder">
                        <b-form-input v-model="resource.order" id="inputOrder"/>
                    </b-form-group>
                    <b-button type="submit">Save Resource</b-button>
                </b-form>
            </div>
        </div>
        <div class="row">
            <div class="col">
                Components
                <button v-on:click="add">Add</button>
            </div>
        </div>
        <b-list-group>
            <component-summary v-for="id in componentIds" :key="id" :componentId="id" :memberId="memberId" :resourceId="resourceId" />
        </b-list-group>
    </div>
</template>

<script>
    import ComponentSummary from '@/components/ComponentSummary.vue';
    export default {
        name: "ResourceEdit",
        props: [
            'resourceId'
        ],
        components: {
            ComponentSummary
        },
        computed: {
            memberId() {
                return this.resource.member.id;
            },
            resource() {
                return this.$store.state.resources.resources[this.$props.resourceId] || {id: "", name: "", componentIds: []};
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
                this.$store.dispatch('loadOrUseResource', {
                    resourceId: this.$props.resourceId
                })
                    .then(() => {
                        return this.$store.dispatch('loadOrUseResourceComponents', this.$props.resourceId);
                    })
                    .catch((e) => {
                        alert("Failed to load resource or components " + e.message);
                    });
            },
            save() {
                this.$store.dispatch('saveResource', this.$props.resourceId)
                    .catch(function (e) {
                        alert("Failed to save resource! " + e.message);
                    })
            },
            async add() {
                await this.$store.dispatch('createNewComponent', this.$props.resourceId);
            }
        }
    }
</script>

<style scoped>

</style>