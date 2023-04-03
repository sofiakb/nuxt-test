<template>
    <i :class="fontAwesomeClass"></i>
</template>

<script lang="ts">
    // import "../../assets/css/font-awesome/6.0.0/font-awesome.min.css"
    // import "../../assets/css/font-awesome/6.0.0/all.min.css"

    import "../../assets/css/font-awesome/6.2.0/fontawesome.css"
    import "../../assets/css/font-awesome/6.2.0/all.css"

    import * as Icons                    from "./utils/icons"
    import { computed, defineComponent } from "vue";

    export default defineComponent({
        name: "ssf-font-awesome-icon",

        props: {
            /* STRONG */
            solid  : { type: Boolean, required: false, default: false },
            regular: { type: Boolean, required: false, default: false },
            light  : { type: Boolean, required: false, default: false },
            thin   : { type: Boolean, required: false, default: false },
            duotone: { type: Boolean, required: false, default: false },
            normal : { type: Boolean, required: false, default: false },
            brand  : { type: Boolean, required: false, default: false },

            /* ICON */
            icon: {
                type     : String,
                required : true,
                validator: (value: string) => Icons.fontAwesome.includes(value) || true
            },

            size    : { type: String, required: false, default: "" },
            fw      : { type: Boolean, required: false, default: false },
            animated: { type: Boolean, required: false, default: false },
            rotate  : { type: String, required: false, default: "" },
            pull    : { required: false, default: false }
        },

        setup(props) {

            const fontAwesomeClass = computed(() =>
                [
                    strongClass,
                    iconClass,
                    sizeClass,
                    fwClass,
                    rotateClass,
                    animatedClass,
                    pullClass
                ]
                    .map((item) => item.value)
                    .filter((item) => item && item.trim() !== "")
                    .join(" ")
            )

            const iconClass = computed(() => ` fa-${props.icon}`)
            const sizeClass = computed(() => props.size ? " fa-" + props.size : "")
            const fwClass = computed(() => props.fw ? " fa-fw" : "")
            const animatedClass = computed(() => props.animated ? " fa-spin" : "")
            const rotateClass = computed(() => ` ${props.rotate}`.trim())
            const pullClass = computed(() => props.pull ? ` fa-pull-${props.pull}` : "")

            const strongClass = computed(() => {
                const weights = {
                    normal : "fa",
                    light  : "fal",
                    solid  : "fas",
                    brand  : "fab",
                    thin   : "fa-thin",
                    duotone: "fa-duotone"
                }, weightsKeys = Object.keys(weights)

                for (let i = 0; i < weightsKeys.length; i++)
                    // @ts-ignore
                    if (props[weightsKeys[i]] === true)
                        // @ts-ignore
                        return weights[weightsKeys[i]]
                return "far";
            })

            return {
                fontAwesomeClass
            }
        },
    })
</script>
