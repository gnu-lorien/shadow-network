<template>
    <div class="container" v-if="hasCurrentMember">
        <div class="row">
            <button v-on:click="add">Add</button>
        </div>
        <resource-summary class="row" v-for="id in resources" :key="id" :resourceId="id" />
    </div>
    <div class="container" v-else>
        <div class="row">
            No member selected.
        </div>
    </div>
</template>

<script>
    /* global Parse */
    import Resource from '@/models/resource.js';
    //import Vue from 'vue';
    import ResourceSummary from '@/components/ResourceSummary.vue';
    import CurrentMember from '@/mixins/CurrentMember.js'
    import Member from '@/models/member.js'

    export default {
        name: "MemberResources",
        components: {
            ResourceSummary
        },
        mixins: [ CurrentMember ],
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
                const q = new Parse.Query(Resource).equalTo("member", {
                    __type: 'Pointer',
                    className: 'Member',
                    objectId: this.currentMember.id
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

                member.set('member', new Member({id: this.currentMember.id}));
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