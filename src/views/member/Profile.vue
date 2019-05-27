<template>
    <div>
        <form>
            <label>Name: </label>
            <input type="text" v-model="name"/>
            <label>Street Name:</label>
            <input type="text" v-model="street_name"/>
            <label>Portrait</label>
            <input type="file" @change="handleFileChange($event)"/>
            <button v-on:click.prevent="save">Save</button>
            <button v-on:click.prevent="thumbit">Thumb It</button>
        </form>
    </div>
</template>

<script>
    import Parse from 'parse';
    import CurrentMember from '@/mixins/CurrentMember.js'
    let MemberPortrait = Parse.Object.extend("MemberPortrait");

    export default {
        name: "MemberProfile",
        props: [
            "memberId"
        ],
        mixins: [ CurrentMember ],
        data: function() {
            return {
                name: "",
                street_name: "",
                portrait: undefined,
                memberPortrait: undefined
            }
        },
        mounted: function() {
            this.name = this.currentMember.name;
            this.street_name = this.currentMember.street_name;
        },
        methods: {
            async save() {
                this.portrait = await this.portrait.save();
                this.memberPortrait = new MemberPortrait();
                this.memberPortrait.set('original', this.portrait);
                this.memberPortrait = await this.memberPortrait.save();
                await this.$store.dispatch('updateAndSaveCurrentMember', {
                    name: this.name,
                    street_name: this.street_name
                });
            },
            async handleFileChange(event) {
                if (event.target.files.length !== 1) {
                    return;
                }
                let file = event.target.files[0];
                let name = file.name;
                this.portrait = new Parse.File(name, file);
            },
            async thumbit() {
                console.log('break');
                await Parse.Cloud.run('doTheCrop', {
                    portraitId: this.memberPortrait.id
                })
            }
        }
    }
</script>

<style scoped>

</style>