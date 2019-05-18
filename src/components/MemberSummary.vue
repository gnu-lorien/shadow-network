<template>
    <div>
        <p>A member with {{member.id}} and {{member.attributes.name}}</p>
        <p><button v-on:click="edit">Edit</button></p>
        <p><button v-on:click="select">Select</button></p>
    </div>
</template>

<script>
    /* global Parse */
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
            edit() {
                this.member.set('name', 'A New Name');
                for (const key in this.member.attributes) {
                    Vue.set(this.member, `attributes.${key}`, this.member.get(key));
                }
            },
            select() {

            }
        }
    }
</script>

<style scoped>

</style>