<template>
    <div class="container">
        <resource-summary class="row" v-for="id in resources" :key="id" :resourceId="id" />
        <div class="row">
            <button v-on:click="add">Add</button>
        </div>
    </div>
</template>

<script>
    /* global Parse */
    let Resource = Parse.Object.extend("Resource");
    //import Vue from 'vue';
    import ResourceSummary from '@/components/ResourceSummary.vue';
    export default {
        name: "Resources",
        components: {
            ResourceSummary
        },
        data: function() {
            return {
                resources: []
            }
        },
        mounted: function () {
            this.fetch();
        },
        methods: {
            fetch() {
                const q = new Parse.Query(Resource).equalTo("owner", {
                    __type: 'Pointer',
                    className: '_User',
                    objectId: Parse.User.current().id
                }).select("id");
                q.find()
                    .then((resources) => {
                        this.resources = resources.map(resource => resource.id);
                    });
            },
            add() {
                const member = new Resource();
                const acl = new Parse.ACL();
                acl.setWriteAccess(Parse.User.current(), true);
                acl.setPublicReadAccess( true);
                member.setACL(acl);

                member.set('owner', Parse.User.current());
                member.set('name', 'Unknown name');
                member.save()
                    .then((resource) => {
                        this.resources = [resource.id].concat(this.resources);
                    })
                    .catch(function(e) {
                        alert("Failed to create new resource " + e.message);
                    });
            }
        },
    }
</script>

<style scoped>

</style>