<template>
    <b-container>
        <b-form @submit.prevent="save">
            <b-form-group
                label-cols-sm="2"
                description="Real name of this runner"
                label="Real Name"
                label-for="inputName">
                <b-form-input type="text" v-model="name" id="inputName"/>
            </b-form-group>
            <b-form-group
                label-cols-sm="2"
                description="Street name for this runner. What they go by with other members of the network and running community."
                label="Street Name"
                label-for="inputStreetName">
                <b-form-input type="text" v-model="street_name" id="inputStreetName"/>
            </b-form-group>
            <b-form-group
                label-cols-sm="2"
                description="Icon used for the runner"
                label="Icon"
                label-for="fileIcon">
                <b-form-file v-model="iconFile" :state="Boolean(iconFile)" id="fileIcon"/>
                <img :src="portraitthumb_32"/>
                <img :src="portraitthumb_64"/>
                <img :src="portraitthumb_128"/>
                <img :src="portraitthumb_256" class="d-none d-md-inline"/>
                <img :src="portraitoriginal" class="d-none d-lg-inline"/>
            </b-form-group>
            <b-button type="submit">Save</b-button>
        </b-form>
    </b-container>
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
                memberPortrait: {},
                iconFile: null
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
        watch: {
            async iconFile() {
                if (this.iconFile) {
                    let name = this.iconFile.name;
                    let startOfName = name[0].replace(/[^_a-zA-Z0-9]/g, '_');
                    let restOfName = name.slice(1);
                    let restOfNameFixed = restOfName.replace(/[^a-zA-Z0-9@. ~_-]/g, '_');
                    let fixedName = startOfName + restOfNameFixed;
                    this.portrait = new Parse.File(fixedName, this.iconFile);
                } else {
                    this.portrait = null;
                }
            }
        },
        methods: {
            async save() {
                if (this.portrait.save) {
                    this.portrait = await this.portrait.save();
                    this.memberPortrait = new MemberPortrait();
                    this.memberPortrait.set('original', this.portrait);
                    this.memberPortrait = await this.memberPortrait.save();
                    await this.$store.dispatch('updateAndSaveCurrentMember', {
                        name: this.name,
                        street_name: this.street_name,
                        portrait: this.memberPortrait
                    });
                } else {
                    await this.$store.dispatch('updateAndSaveCurrentMember', {
                        name: this.name,
                        street_name: this.street_name
                    });
                }
                let result = await this.$store.dispatch('loadOrUseMember', {
                    memberId: this.currentMember.id,
                    force: true
                });
                this.memberPortrait = result.portrait || {};
            }
        }
    }
</script>

<style scoped>

</style>