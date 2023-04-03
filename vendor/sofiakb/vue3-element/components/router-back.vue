<template>
    <ssf-container class="cursor-pointer" not-full @click="back">

        <ssf-icon v-if="withIcon" :icon="icon" class="me-1" light/>
        <ssf-text v-if="!withoutText">{{ text }}</ssf-text>

    </ssf-container>
</template>

<script lang="ts">
    import { defineComponent } from "vue"
    import { useRouter }       from "vue-router";

    export default defineComponent({
        name: "ssf-router-back",

        props: {
            withIcon   : { type: Boolean, required: false, default: true },
            withoutText: { type: Boolean, required: false, default: false },
            icon       : { type: String, required: false, default: "hand-point-left" },
            text       : { type: String, required: false, default: "Revenir en arrière" },
        },

        setup() {
            ////////// init
            const router = useRouter()

            ////////// methods
            const back = () => router.back()

            return {
                back,
            }
        },

    })
</script>

<style lang="scss" scoped>

</style>
