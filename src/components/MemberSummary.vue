<template>
    <div>
        <p>{{member.attributes.street_name}} / {{member.id}}</p>
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
                    attributes: {
                        name: ""
                    }
                }
            }
        },
        mounted: function() {
            this.fetch();
        },
        methods: {
            fetch() {
                const q = new Parse.Query(Member);
                q.get(this.$props.memberId)
                    .then((member) => {
                        this.setupMember(member);
                    });
            },
            setupMember(member) {
                this.member = member;
            },
            select() {
                this.$router.push({name: 'memberLanding', params: { memberId: this.member.id}});
            },
        }
    }
</script>

<style scoped>

</style>