<template>
    <p>A member with {{member.id}} and {{member.attributes.name}}</p>
</template>

<script>
    /* global Parse */
    let Member = Parse.Object.extend("Member");
    export default {
        name: "MemberSummary",
        data: function () {
            return {
                member: {}
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
                        this.member = member;
                    });
            }
        },
        props: [
            'memberId'
        ]
    }
</script>

<style scoped>

</style>