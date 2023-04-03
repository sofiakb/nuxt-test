<template>
    <div class="row" :class="{'w-100': !notFull, 'px-0': !withPadding}">
        <slot/>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "x-row",

        props: {
            notFull    : { type: Boolean, required: false, default: false },
            withPadding: { type: Boolean, required: false, default: false },
        }

    })
</script>

<style scoped>

</style>
