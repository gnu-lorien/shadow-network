<template>
    <div>
        <p>A resource with {{resource.id}} and {{resource.name}}</p>
        <p>
            <button v-on:click="edit">Edit</button>
        </p>
        <p>
            <button v-on:click="remove">Delete</button>
        </p>
    </div>
</template>

<script>
    export default {
        name: "ResourceSummary",
        props: [
            'resourceId'
        ],
        computed: {
            resource() {
                return this.$store.state.resources.resources[this.$props.resourceId] || { id: "" , name: ""};
            }
        },
        mounted: function () {
            this.fetch();
        },
        methods: {
            fetch() {
                this.$store.dispatch('loadOrUseResource', this.$props.resourceId);
            },
            edit() {
                this.$router.push({'name': 'memberResourceEdit', params: { memberId: this.resource.member.id, resourceId: this.$props.resourceId}});
            },
            remove() {
                this.$store.dispatch('destroyResource', this.$props.resourceId)
                    .then(() => {
                        this.resource = {
                            id: "",
                            name: ""
                        }
                    })
            }
        }
    }
</script>

<style scoped>

</style>