<template>
    <div class="container">
        <div class="row">
            <div class="col text-center">
                <form class="form-resource-edit">
                    <label for="inputName">Name</label>
                    <input v-model="resource.name" id="inputName"/>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col">
                Components
            </div>
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
        }
    }
</script>

<style scoped>

</style>