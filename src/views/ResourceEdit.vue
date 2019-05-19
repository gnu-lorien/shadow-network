<template>
    <div class="container">
        <div class="row">
            <div class="col text-center">
                <form class="form-resource-edit">
                    <label for="inputName">Name</label>
                    <input v-model="resource.name" id="inputName"/>
                    <button v-on:click="save">Save</button>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col">
                Components
                <button v-on:click="add">Add</button>
            </div>
        </div>
        <component-summary class="row" v-for="id in componentIds" :key="id" :componentId="id" :memberId="memberId" :resourceId="resourceId" />
    </div>
</template>

<script>
    /* global Parse */
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
            add() {
                const component = new Component();
                const acl = new Parse.ACL();
                acl.setWriteAccess(Parse.User.current(), true);
                acl.setPublicReadAccess(true);
                component.setACL(acl);

                component.set('short', "A short description");
                component.set('resource', this.$store.state.resources.remoteResources[this.$props.resourceId]);
                component.save()
                    .then((component) => {
                        this.$store.commit('setComponent', component);
                        this.$store.commit('addCurrentMemberResourceComponentId', {resourceId: this.$props.resourceId, componentId: component.id});
                    })
                    .catch((e) => {
                        alert("Failed to create a new component " + e.message);
                    });
            }
        }
    }
</script>

<style scoped>

</style>