<template>
    <div class="container">
        <member-summary class="row" v-for="id in members" :key="id" :memberId="id" />
        <div class="row">
            <button v-on:click="add">Add</button>
            <button v-on:click="changeaname">Change A Name</button>
        </div>
    </div>
</template>

<script>
    /* global Parse */
    let Member = Parse.Object.extend("Member");
    import Vue from 'vue';
    import MemberSummary from '@/components/MemberSummary.vue'
    export default {
        name: "Members.vue",
        data: function () {
            return {
                members: []
            }
        },
        mounted: function () {
            this.fetch();
        },
        methods: {
            fetch() {
                const q = new Parse.Query(Member).equalTo("owner", {
                    __type: 'Pointer',
                    className: '_User',
                    objectId: Parse.User.current().id
                }).select("id");
                q.find()
                    .then((members) => {
                        this.members = members.map(member => member.id);
                    });
            },
            add() {
                const member = new Member();
                const acl = new Parse.ACL();
                acl.setWriteAccess( Parse.User.current(), true);
                acl.setPublicReadAccess( true);
                member.setACL(acl);

                member.set('owner', Parse.User.current());
                member.set('name', 'Unknown name');
                member.set('street_name', 'Unknown street name');
                member.save()
                    .then((member) => {
                        this.members = [member].concat(this.members);
                    })
                    .catch(function(e) {
                        alert("Failed to create new member " + e.message);
                    });
            },
            changeaname() {
                const member = this.members[0];
                member.set('name', 'Something else');
                //member.attributes.name = 'Something else';
                Vue.set(member, 'attributes.name', 'Something else');
            }
        },
        components: {
            MemberSummary
        }
    }
</script>

<style scoped>

</style>