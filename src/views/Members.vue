<template>
    <member-select @member-selected="select" v-bind:added="added">
        <div class="row">
            <button v-on:click="add">Create New Member</button>
        </div>
    </member-select>
</template>

<script>
    import Parse from 'parse';

    let Member = Parse.Object.extend("Member");
    import MemberSelect from '@/components/MemberSelect.vue'

    export default {
        name: "Members.vue",
        components: {
            MemberSelect
        },
        data: function() {
            return {
                added: 0
            }
        },
        methods: {
            async add() {
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
                try {
                    await member.save();
                    this.added += 1;
                } catch (e) {
                    alert("Failed to create new member " + e.message);
                }
            },
            select(memberId) {
                this.$router.push({name: 'memberResources', params: {memberId: memberId}});
            },
        }
    }
</script>

<style scoped>

</style>