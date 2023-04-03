<template>
    <ssf-image :height="height" :src="small ? 'logo-small.png' : 'logo.png'" :width="width" alt="Logo"/>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "ssf-logo",

        props: {
            height: { type: [ String, Number ], required: false },
            width : { type: [ String, Number ], required: false },
            small : { type: Boolean, required: false, default: false }
        },
    })
</script>

<style scoped>

</style>
