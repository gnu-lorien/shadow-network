export default {
    computed: {
        hasCurrentMember() {
            return this.$store.state.member.member.id !== "";
        },
        currentMember() {
            return this.$store.state.member.member;
        },
        currentportraitthumb_32() {
            if (this.hasCurrentMember) {
                let portrait = this.$store.state.members.portraits[this.currentMember.id] || {};
                return portrait.thumb_32 ? portrait.thumb_32.url() : "";
            } else {
                return "";
            }
        },
    },
}