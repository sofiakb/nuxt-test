<template>
    <div :style="cssStyle" class="loader clock"></div>
</template>

<script lang="ts">
    import { computed, defineComponent, inject } from "vue";
    import LoaderProps                           from "../loader-props";

    export default defineComponent({
        name: "clock-loader",

        setup() {
            ////////// data
            const parent: LoaderProps | undefined = inject("loaderParentProps")

            ////////// computed
            const size = computed(() => {
                const size = parent?.size;
                return typeof size === "string" ? size : `${size}px`
            })

            const stroke = computed(() => {
                const stroke = parent?.stroke;
                return typeof stroke === "string" ? stroke : `${stroke}px`
            })

            const duration = computed(() => {
                const duration = parent?.duration;
                return typeof duration === "string" ? duration : `${duration}s`
            })

            const cssStyle = computed(() => ({
                "--reset"                 : 0,
                "--loader-width"          : size.value,
                "--loader-height"         : size.value,
                "--loader-color-primary"  : parent?.colorPrimary,
                "--loader-color-secondary": parent?.colorSecondary,
                "--line-width"            : stroke.value,
                "--animation-duration"    : duration.value,
                "--loader-initial-scale"  : 0.1
            }))


            return {
                //// computed
                cssStyle,
            }
        },
    })
</script>

<style lang="scss">
    .loader.clock {
        &,
        &:before,
        &:after {
            content: '';
            box-sizing: border-box;
            -webkit-box-flex: 0;
            -ms-flex-positive: 0;
            flex-grow: 0;
            -ms-flex-negative: 0;
            flex-shrink: 0;
        }

        @-webkit-keyframes circle-loader {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }

        @keyframes circle-loader {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }

        &.clock {
            position: relative;
            width: var(--loader-width, 100px);
            height: var(--loader-height, 100px);
            border-radius: 50%;
            border: var(--line-width, 4px) solid var(--loader-color-primary, #33f);
        }

        &.clock:before {
            content: '';
            position: absolute;
            top: 8px;
            left: calc(50% - 2px);
            background: var(--loader-color-primary, #33f);
            width: var(--line-width, 4px);
            height: calc(50% - 8px);
            border-radius: calc(var(--line-width, 4px) + 1);
            -webkit-transform-origin: 50% 100%;
            transform-origin: 50% 100%;
            -webkit-animation: circle-loader var(--animation-duration, 1s) infinite linear;
            animation: circle-loader var(--animation-duration, 1s) infinite linear;
        }
    }
</style>
