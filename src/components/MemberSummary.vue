<template>
    <div>
        <p><img :src="portraitthumb_64"/>{{member.street_name}} / {{member.id}}</p>
        <p><button v-on:click="$emit('member-selected', member.id)">Select</button></p>
    </div>
</template>

<script>
    import Parse from 'parse';
    let Member = Parse.Object.extend("Member");
    import Vue from 'vue';
    export default {
        name: "MemberSummary",
        props: [
            'memberId'
        ],
        data: function () {
            return {
                member: {
                    id: "",
                    street_name: ""
                },
                memberPortrait: {}
            }
        },
        computed: {
            portraitthumb_64() { return this.memberPortrait.thumb_64 ? this.memberPortrait.thumb_64.url() : ""; }
        },
        mounted: async function() {
            await this.fetch();
        },
        methods: {
            async fetch() {
                let {member, portrait} = await this.$store.dispatch('loadOrUseMember', {
                    memberId: this.$props.memberId
                });
                this.member = member;
                this.memberPortrait = portrait || {};
            },
            select() {
                this.$router.push({name: 'memberLanding', params: { memberId: this.member.id}});
            },
        }
    }
</script>

<style scoped>

</style>