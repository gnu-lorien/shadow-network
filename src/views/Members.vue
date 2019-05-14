<template>
    <div class="container">
        <div class="row" v-for="member in members">
            <p>A member with {{member.id}} and {{member.get('name')}}</p>
        </div>
        <div class="row">
            <button v-on:click="add">Add</button>
            <button v-on:click="changeaname">Change A Name</button>
        </div>
    </div>
</template>

<script>
    /* global Parse */
    let Member = Parse.Object.extend("Member");
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
                });
                q.find()
                    .then((members) => {
                        this.members = members;
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
                        alert("New member created with id " + member.id);
                        this.members = [member].concat(this.members);
                    })
                    .catch(function(e) {
                        alert("Failed to create new member " + e.message);
                    });
            },
            changeaname() {
                const member = this.members[0];
                member.set('name', 'Something else');
            }
        }
    }
</script>

<style scoped>

</style>