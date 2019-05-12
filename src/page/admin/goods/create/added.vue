<template>
    <div id="editor">
        <editor @active="setActives" @status="StatusDeparture"></editor>
    </div>
</template>

<script>
    import editor from '@/components/editor'

    export default {
        name: 'added',
        data(){
            return {
                active: 0
            }
        },
        created: function(){
            this.$store.commit('setInit');
            this.$store.commit('setActive', this.active);
        },
        components: {
            editor,
        },
        methods:{
            StatusDeparture: function(status){
                console.log('StatusDeparture', !status)
                this.$store.commit('setStatusDeparture', !status)
            },
            setActives: function (response) {
                this.$store.commit('setActive', this.active + 1);
                this.$store.commit('setAppResponse', response.data.id);

                setTimeout(() => {
                    this.$router.push({
                        name: 'admin:goods:create:setmeal'
                    });
                }, 600);
            }
        },

    }
</script>
<style>
    #editor {
        margin: auto;
        width: 100%;

    }

    #editor > .v-note-wrapper {
        padding: .1rem;
        padding-top: 0;
    }

    .markdown-body {
        height: 600px;
    }

</style>
