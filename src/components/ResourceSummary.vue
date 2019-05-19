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
    import Vue from 'vue';

    export default {
        name: "ResourceSummary",
        props: [
            'resourceId'
        ],
        data: function () {
            return {
                resource: {
                    id: "",
                    name: ""
                }
            }
        },
        mounted: function () {
            this.fetch();
        },
        methods: {
            fetch() {
                this.$store.dispatch('loadOrUseResource', this.$props.resourceId)
                    .then((resource) => {
                        this.resource = resource;
                    });
            },
            edit() {
                this.member.set('name', 'A New Name');
                for (const key in this.member.attributes) {
                    Vue.set(this.member, `attributes.${key}`, this.member.get(key));
                }
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