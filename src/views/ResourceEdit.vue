<template>
    <div class="container">
        <div class="row">
            <div class="col text-center">
                <form class="form-resource-edit">
                    <label for="inputName">Name</label>
                    <input v-model="resource.name" id="inputName"/>
                    <button v-on:click.prevent="save">Save</button>
                </form>
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
    import Parse from 'parse';
    import Component from '@/models/component.js';
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
                this.$store.dispatch('loadOrUseResource', this.$props.resourceId)
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