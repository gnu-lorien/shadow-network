<template>
    <div>
        <p>A component with {{component.id}} and {{component.short}}</p>
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
        name: "ComponentSummary",
        props: [
            'memberId',
            'resourceId',
            'componentId'
        ],
        computed: {
            component() {
                return this.$store.state.components.components[this.$props.componentId] || {id: "", short: ""};
            }
        },
        mounted: function () {
            this.fetch();
        },
        methods: {
            fetch() {
                this.$store.dispatch('loadOrUseComponent', this.$props.componentId);
            },
            edit() {
                this.$router.push({
                    'name': 'memberResourceComponentEdit',
                    params: {
                        memberId: this.$props.memberId,
                        resourceId: this.$props.resourceId,
                        componentId: this.$props.componentId
                    }
                });
            },
            remove() {
                this.$store.dispatch('destroyComponent', this.$props.componentId)
                    .catch((e) => {
                        alert("Broke destroying component " + e.message);
                    })
            }
        }
    }
</script>

<style scoped>

</style>