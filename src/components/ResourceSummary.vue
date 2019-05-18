<template>
    <div>
        <p>A resource with {{resource.id}} and {{resource.attributes.name}}</p>
        <p><button v-on:click="edit">Edit</button></p>
        <p><button v-on:click="remove">Delete</button></p>
    </div>
</template>

<script>
    /* global Parse */
    import Resource from '@/models/resource.js';
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
                    attributes: {
                        name: ""
                    }
                }
            }
        },
        mounted: function() {
            this.fetch();
        },
        methods: {
            fetch() {
                const q = new Parse.Query(Resource);
                q.get(this.$props.resourceId)
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
                this.member.set('name', 'A New Name');
                for (const key in this.member.attributes) {
                    Vue.set(this.member, `attributes.${key}`, this.member.get(key));
                }
            }
        }
    }
</script>

<style scoped>

</style>