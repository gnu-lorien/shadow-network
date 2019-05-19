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
            </div>
        </div>
        <div class="row">

        </div>
    </div>
</template>

<script>
    export default {
        name: "ResourceEdit",
        props: [
            'resourceId'
        ],
        computed: {
            resource() {
                return this.$store.state.resources.resources[this.$props.resourceId] || {id: "", name: ""};
            }
        },
        mounted: function () {
            this.fetch();
        },
        methods: {
            fetch() {
                this.$store.dispatch('loadOrUseResource', this.$props.resourceId);
            },
            save() {
                this.$store.dispatch('saveResource', this.$props.resourceId)
                    .catch(function (e) {
                        alert("Failed to save resource! " + e.message);
                    })
            }
        }
    }
</script>

<style scoped>

</style>