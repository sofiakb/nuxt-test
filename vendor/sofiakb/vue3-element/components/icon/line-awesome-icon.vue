<template>
    <i :class="lineAwesomeClass"></i>
</template>

<script lang="ts">
    import "../../assets/css/line-awesome/line-awesome.min.css"

    import * as Icons                    from "./utils/icons"
    import { computed, defineComponent } from "vue";

    export default defineComponent({
        name: "ssf-line-awesome-icon",

        props: {
            /* STRONG */
            regular: { type: Boolean, required: false, default: false },
            solid  : { type: Boolean, required: false, default: false },
            light  : { type: Boolean, required: false, default: false },
            brand  : { type: Boolean, required: false, default: false },

            /* ICON */
            icon    : { type: String, required: true, validator: (value: string) => Icons.lineAwesome.includes(value) },
            size    : { type: String, required: false, default: "" },
            fw      : { type: Boolean, required: false, default: false },
            animated: { type: Boolean, required: false, default: false },
            rotate  : { type: String, required: false, default: "" },
            pull    : { required: false, default: false }
        },

        setup(props) {

            const lineAwesomeClass = computed(() => `${strongClass.value}${iconClass.value}${sizeClass.value}${fwClass.value}${rotateClass.value}${animatedClass.value}${pullClass.value}`.trim())
            const iconClass = computed(() => ` la-${props.icon}`)
            const sizeClass = computed(() => props.size ? " la-" + props.size : "")
            const fwClass = computed(() => props.fw ? " la-fw" : "")
            const animatedClass = computed(() => props.animated ? " la-spin" : "")
            const rotateClass = computed(() => ` ${props.rotate}`.trim())
            const pullClass = computed(() => props.pull ? ` la-pull-${props.pull}` : "")

            const strongClass = computed(() => props.regular
                    ? "lar"
                    : props.light
                        ? "lal"
                        : props.solid
                            ? "las"
                            : props.brand
                                ? "lab"
                                : "la")


            return {
                lineAwesomeClass
            }
        },
    })
</script>
