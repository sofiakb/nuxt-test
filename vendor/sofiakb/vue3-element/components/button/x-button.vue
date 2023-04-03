<template>
    <button :class="classes" :type="type" class="btn">
        <div v-if="loading">
            <span class="me-3">
                {{ loadingText }}
            </span>
            <div class="dot-pulse d-inline-block ms-2"></div>
        </div>
        <slot v-else/>
    </button>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType } from "vue"
		import ButtonType                              from "./utils";

    export default defineComponent({
        name: "ssf-button",

        props: {
            rounded     : { type: Boolean, required: false, default: true },
            roundedLight: { type: Boolean, required: false, default: false },

            primary    : { type: Boolean, required: false, default: true },
            secondary  : { type: Boolean, required: false, default: false },
            transparent: { type: Boolean, required: false, default: false },

            block: { type: Boolean, required: false, default: false },

            loading    : { type: Boolean, required: false, default: false },
            loadingText: { type: String, required: false, default: "Chargement" },

            disabled: { type: Boolean, required: false, default: false },

            floating: { type: Boolean, required: false, default: false },

            small: { type: Boolean, required: false, default: false },
            large: { type: Boolean, required: false, default: false },

            borderless: { type: Boolean, required: false, default: false },

            type: { type: String as PropType<ButtonType>, required: false, default: ButtonType.BUTTON },
        },

        setup(props) {
            ////////// init

            return {

                classes: computed(() => ({
                    rounded        : props.rounded,
                    "rounded-light": props.rounded && props.roundedLight,

                    "bg-color-1": props.primary && !props.transparent,
                    "bg-color-2": props.secondary && !props.transparent,
                    "text-white": !props.transparent,

                    "btn-block": props.block,

                    "btn-sm": props.small,
                    "btn-lg": props.large,

                    "btn-floating": props.floating,

                    "border": !props.borderless,

                    "disabled": props.loading || props.disabled
                }))

            }
        }
    })
</script>

<style lang="scss" scoped>
/**
 * ==============================================
 * Dot Pulse
 * ==============================================
 */

    $dotPulseSize: 5px;

    .dot-pulse {
        position: relative;
        left: -9999px;
        width: $dotPulseSize;
        height: $dotPulseSize;
        border-radius: 5px;
        background-color: var(--btn-loading-color);
        color: var(--btn-loading-color);
        box-shadow: 9999px 0 0 -5px var(--btn-loading-color);
        animation: dotPulse 1.5s infinite linear;
        animation-delay: .25s;
    }

    .dot-pulse::before, .dot-pulse::after {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        width: $dotPulseSize;
        height: $dotPulseSize;
        border-radius: 5px;
        background-color: var(--btn-loading-color);
        color: var(--btn-loading-color);
    }

    .dot-pulse::before {
        box-shadow: 9984px 0 0 -5px var(--btn-loading-color);
        animation: dotPulseBefore 1.5s infinite linear;
        animation-delay: 0s;
    }

    .dot-pulse::after {
        box-shadow: 10014px 0 0 -5px var(--btn-loading-color);
        animation: dotPulseAfter 1.5s infinite linear;
        animation-delay: .5s;
    }

    @keyframes dotPulseBefore {
        0% {
            box-shadow: 9984px 0 0 -5px var(--btn-loading-color);
        }
        30% {
            box-shadow: 9984px 0 0 2px var(--btn-loading-color);
        }
        60%,
        100% {
            box-shadow: 9984px 0 0 -5px var(--btn-loading-color);
        }
    }

    @keyframes dotPulse {
        0% {
            box-shadow: 9999px 0 0 -5px var(--btn-loading-color);
        }
        30% {
            box-shadow: 9999px 0 0 2px var(--btn-loading-color);
        }
        60%,
        100% {
            box-shadow: 9999px 0 0 -5px var(--btn-loading-color);
        }
    }

    @keyframes dotPulseAfter {
        0% {
            box-shadow: 10014px 0 0 -5px var(--btn-loading-color);
        }
        30% {
            box-shadow: 10014px 0 0 2px var(--btn-loading-color);
        }
        60%,
        100% {
            box-shadow: 10014px 0 0 -5px var(--btn-loading-color);
        }
    }
</style>
