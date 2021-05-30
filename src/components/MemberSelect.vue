<template>
    <b-container>
        <b-row align-v="start" v-for="memberIndex in rowCount" :key="memberIndex" class="mb-2">
            <b-col v-for="id in members.slice((memberIndex - 1) * membersPerRow, memberIndex * membersPerRow)" :key="id" sm>
                <member-summary :memberId="id" @member-selected="select"/>
            </b-col>
        </b-row>
        <slot>
        </slot>
    </b-container>
</template>

<script>
    import Parse from 'parse';

    let Member = Parse.Object.extend("Member");
    import MemberSummary from '@/components/MemberSummary.vue'

    export default {
        name: "MemberSelect",
        props: {
            added: Number,
            filter: {
                type: String,
                default: "user"
            }
        },
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
        mounted: async function () {
            await this.fetch();
        },
        watch: {
            async added() {
                await this.fetch();
            }
        },
        methods: {
            async fetch() {
                const q = new Parse.Query(Member);
                if ("user" === this.$props.filter) {
                    let user = Parse.User.current();
                    let userId = user.id;
                    q.equalTo("owner", {
                        __type: 'Pointer',
                        className: '_User',
                        objectId: userId
                    });
                }
                q.select("id");
                let members = await q.find();
                this.members = members.map(member => member.id);
            },
            select(memberId) {
                this.$emit('member-selected', memberId)
            }
        }
    }
</script>

<style scoped>

</style>