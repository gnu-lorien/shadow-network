<template>
    <b-card class="w-100 h-100 p-0 m-0" body-class="p-1">
        <b-card-header class="p-0">
            <img class="border-info" style="border-width: 1px; border-style: solid" :src="portraitthumb_64" v-if="portraitthumb_64"/>
            <button class="ml-1" v-on:click="$emit('member-selected', member.id)">Select</button>
        </b-card-header>
        <b-card-title>{{member.street_name}}</b-card-title>
        <b-card-sub-title>{{member.id}}</b-card-sub-title>
    </b-card>
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