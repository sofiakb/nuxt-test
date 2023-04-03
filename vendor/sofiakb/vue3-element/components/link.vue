<template>
    <router-link v-if="to && routeExists(to.name)" :style="{color: inherit ? 'inherit' : ''}" :to="to">
        <slot name="before"/>
        <span v-if="title" v-html="title"></span>
        <slot v-else/>
        <slot name="after"/>
    </router-link>
    <a v-else-if="url" :href="url" :style="{color: inherit ? 'inherit' : ''}" :target="target">
        <slot name="before"/>
        <span v-html="title"></span>
        <slot name="after"/>
    </a>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue"
    import { useRouteHelper }            from "../utils";

    interface SsfRouteOption {
        name: string
        query?: Record<string, unknown>
        params?: Record<string, unknown>
    }

    export default defineComponent({
        name: "ssf-link",

        props: {
            to     : { type: Object as PropType<SsfRouteOption>, required: false },
            title  : { type: String, required: false },
            url    : { type: String, required: false },
            inherit: { type: Boolean, required: false, default: true },
            target : { type: String, required: false, default: "_self" }
        },

        setup() {

            const {routeExists} = useRouteHelper()

            return {
                routeExists
            }
        }
    })
</script>

<style lang="scss" scoped>

</style>
