export default {
    computed: {
        hasCurrentMember() {
            return this.$store.state.member.member.id !== "";
        },
        currentMember() {
            return this.$store.state.member.member;
        }
    },
}