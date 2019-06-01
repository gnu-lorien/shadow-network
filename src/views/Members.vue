<template>
    <b-container>
        <b-row align-v="start" v-for="memberIndex in rowCount" class="mb-2">
            <b-col v-for="id in members.slice((memberIndex - 1) * membersPerRow, memberIndex * membersPerRow)" :key="id" sm>
                <member-summary :memberId="id" @member-selected="select"/>
            </b-col>
        </b-row>
        <div class="row">
            <button v-on:click="add">Create New Member</button>
        </div>
    </b-container>
</template>

<script>
    import Parse from 'parse';

    let Member = Parse.Object.extend("Member");
    import Vue from 'vue';
    import MemberSummary from '@/components/MemberSummary.vue'

    export default {
        name: "Members.vue",
        components: {
            MemberSummary
        },
        data: function () {
            return {
                members: [],
                membersPerRow: 4
            }
        },
        computed: {
            rowCount() {
                return Math.ceil(this.members.length / this.membersPerRow);
            }
        },
        mounted: function () {
            this.fetch();
        },
        methods: {
            async fetch() {
                let user = Parse.User.current();
                let userId = user.id;
                const q = new Parse.Query(Member);
                q.equalTo("owner", {
                    __type: 'Pointer',
                    className: '_User',
                    objectId: userId
                });
                q.select("id");
                let members = await q.find();
                this.members = members.map(member => member.id);
            },
            add() {
                const member = new Member();
                const acl = new Parse.ACL();
                acl.setWriteAccess(Parse.User.current(), true);
                acl.setPublicReadAccess(true);
                acl.setRoleReadAccess('gamemaster', true);
                acl.setRoleWriteAccess('gamemaster', true);
                member.setACL(acl);

                member.set('owner', Parse.User.current());
                member.set('name', 'Unknown name');
                member.set('street_name', 'Unknown street name');
                member.save()
                    .then((member) => {
                        this.members = [member.id].concat(this.members);
                    })
                    .catch(function (e) {
                        alert("Failed to create new member " + e.message);
                    });
            },
            select(memberId) {
                this.$router.push({name: 'memberResources', params: {memberId: memberId}});
            },
        }
    }
</script>

<style scoped>

</style>