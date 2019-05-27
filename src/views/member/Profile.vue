<template>
    <div>
        <img>
            <label>Name: </label>
            <input type="text" v-model="name"/>
            <label>Street Name:</label>
            <input type="text" v-model="street_name"/>
            <label>Portrait</label>
            <img :src="portraitthumb_32"/>
            <img :src="portraitthumb_64"/>
            <img :src="portraitthumb_128"/>
            <img :src="portraitthumb_256"/>
            <img :src="portraitoriginal"/>
            <input type="file" @change="handleFileChange($event)"/>
            <button v-on:click.prevent="save">Save</button>
        </form>
    </div>
</template>

<script>
    import Parse from 'parse';
    import CurrentMember from '@/mixins/CurrentMember.js'
    import MemberPortrait from '@/models/memberportrait.js'

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
                portrait: {},
                memberPortrait: {}
            }
        },
        mounted: async function() {
            this.name = this.currentMember.name;
            this.street_name = this.currentMember.street_name;
            let result = await this.$store.dispatch('loadOrUseMember', {
                memberId: this.currentMember.id
            });
            this.memberPortrait = result.portrait || {};
        },
        computed: {
            portraitoriginal() { return this.memberPortrait.original ? this.memberPortrait.original.url() : ""; },
            portraitthumb_32() { return this.memberPortrait.thumb_32 ? this.memberPortrait.thumb_32.url() : ""; },
            portraitthumb_64() { return this.memberPortrait.thumb_64 ? this.memberPortrait.thumb_64.url() : ""; },
            portraitthumb_128() { return this.memberPortrait.thumb_128 ? this.memberPortrait.thumb_128.url() : ""; },
            portraitthumb_256() { return this.memberPortrait.thumb_256 ? this.memberPortrait.thumb_256.url() : ""; }
        },
        methods: {
            async save() {
                this.portrait = await this.portrait.save();
                this.memberPortrait = new MemberPortrait();
                this.memberPortrait.set('original', this.portrait);
                this.memberPortrait = await this.memberPortrait.save();
                await this.$store.dispatch('updateAndSaveCurrentMember', {
                    name: this.name,
                    street_name: this.street_name,
                    portrait: this.memberPortrait
                });
                let result = await this.$store.dispatch('loadOrUseMember', {
                    memberId: this.currentMember.id,
                    force: true
                });
                this.memberPortrait = result.portrait || {};
            },
            async handleFileChange(event) {
                if (event.target.files.length !== 1) {
                    return;
                }
                let file = event.target.files[0];
                let name = file.name;
                this.portrait = new Parse.File(name, file);
            }
        }
    }
</script>

<style scoped>

</style>