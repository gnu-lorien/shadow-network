<template>
    <div class="container">
        <member-select @member-selected="select" filter="all"></member-select>
    </div>
</template>

<script>
    import Parse from 'parse';
    let Member = Parse.Object.extend("Member");
    import MemberSelect from '@/components/MemberSelect.vue'

    export default {
        name: "GameMasterTransferMembers",
        components: { MemberSelect },
        data: function() {
            return {
                members: [],
                memberIds: [],
                memberId: "",
                users: []
            }
        },
        computed: {
            needSelection() {
                return this.memberId === "";
            }
        },
        mounted: async function() {
            await this.fetch();
        },
        methods: {
            async fetch() {
                const q = new Parse.Query(Member).select("id");
                let memberIds = []
                await q.each((member) => {
                    memberIds.push(member.id);
                });
                this.members = [];
                for (let memberId of memberIds) {
                    let {member} = await this.$store.dispatch('loadOrUseMember', {
                        memberId: memberId
                    });
                    this.members = [member].concat(this.members);
                    this.memberIds = [member.id].concat(this.memberIds);
                }
            },
            async select(memberId) {
                this.$router.push({name: 'memberResources', params: {memberId: memberId}});
            }
        }
    }
</script>

<style scoped>

</style>