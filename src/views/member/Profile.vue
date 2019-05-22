<template>
    <div>
        <form>
            <label>Name: </label>
            <input type="text" v-model="name"/>
            <label>Street Name:</label>
            <input type="text" v-model="street_name"/>
            <button v-on:click.prevent="save">Save</button>
        </form>
    </div>
</template>

<script>
    import CurrentMember from '@/mixins/CurrentMember.js'

    export default {
        name: "MemberProfile",
        props: [
            "memberId"
        ],
        mixins: [ CurrentMember ],
        data: function() {
            return {
                name: "",
                street_name: ""
            }
        },
        mounted: function() {
            this.name = this.currentMember.name;
            this.street_name = this.currentMember.street_name;
        },
        methods: {
            async save() {
                await this.$store.dispatch('updateAndSaveCurrentMember', {
                    name: this.name,
                    street_name: this.street_name
                });
            }
        }
    }
</script>

<style scoped>

</style>