<template>
<blasting-circle v-if="blast"/>
    <rotating-plane v-else-if="rotatingPlane"/>
    <bouncing-circle v-else-if="bouncing"/>
    <blasting-ripple v-else-if="ripple"/>
    <color-pulse-ball v-else-if="pulse"/>
    <clock v-else-if="clock"/>
    <double-circle v-else-if="double"/>
    <quantum-spinner v-else-if="spinner"/>
    <box-rotation v-else-if="box"/>
    <hour-glass v-else-if="hour"/>
    <squid v-else-if="squid"/>

    <simple-circle v-else/>
</template>

<script lang="ts">
    import { defineComponent, provide, ref, watch } from "vue";

    import BlastingCircle from "./includes/blasting-circle.vue";
    import BlastingRipple from "./includes/blasting-ripple.vue";
    import BouncingCircle from "./includes/bouncing-circle.vue";
    import BoxRotation    from "./includes/box-rotation.vue";
    import Clock          from "./includes/clock.vue";
    import ColorPulseBall from "./includes/color-pulse-ball.vue";
    import DoubleCircle   from "./includes/double-circle.vue";
    import HourGlass      from "./includes/hour-glass.vue";
    import QuantumSpinner from "./includes/quantum-spinner.vue";
    import RotatingPlane  from "./includes/rotating-plane.vue";
    import SimpleCircle   from "./includes/simple-circle.vue";
    import Squid          from "./includes/squid.vue";
    import LoaderProps    from "./loader-props";

    export default defineComponent({
        name      : "ssf-loader",
        components: {
            Squid,
            HourGlass,
            BoxRotation,
            QuantumSpinner,
            DoubleCircle,
            Clock,
            ColorPulseBall,
            BlastingRipple,
            BouncingCircle,
            RotatingPlane,
            BlastingCircle,
            SimpleCircle
        },

        props: {
            /* AVAILABLE LOADERS */
            circle       : { type: Boolean, required: false, default: false },
            blast        : { type: Boolean, required: false, default: false },
            rotatingPlane: { type: Boolean, required: false, default: false },
            bouncing     : { type: Boolean, required: false, default: false },
            ripple       : { type: Boolean, required: false, default: false },
            pulse        : { type: Boolean, required: false, default: false },
            clock        : { type: Boolean, required: false, default: false },
            double       : { type: Boolean, required: false, default: false },
            spinner      : { type: Boolean, required: false, default: false },
            box          : { type: Boolean, required: false, default: false },
            hour         : { type: Boolean, required: false, default: false },
            squid        : { type: Boolean, required: false, default: false },

            colorPrimary  : { type: String, required: false, default: "var(--color-1)" },
            colorSecondary: { type: String, required: false, default: "var(--color-2)" },
            colorTernary  : { type: String, required: false, default: "var(--color-3)" },

            size    : { type: [ String, Number ], required: false, default: 70 },
            stroke  : { type: [ String, Number ], required: false, default: 3 },
            duration: { type: [ String, Number ], required: false, default: 2 },
        },

        setup(props) {
            const loaderParentProps = ref<LoaderProps>({
                colorPrimary  : props.colorPrimary,
                colorSecondary: props.colorSecondary,
                colorTernary  : props.colorTernary,

                size    : props.size,
                stroke  : props.stroke,
                duration: props.duration,
            })

            for (const key in props)
                // @ts-ignore
                watch(() => props[key], () => loaderParentProps.value[key] = props[key], { immediate: true })

            provide("loaderParentProps", loaderParentProps.value)

            return { }
        },
    })
</script>

<style scoped>

</style>
