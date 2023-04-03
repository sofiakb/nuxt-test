<template>
    <label v-if="showLabel"
           :class="{ active, 'label-required': required }"
           class="ssf__input-label"
           @click="$emit('label-click')">
        <ssf-icon
            v-if="icon"
            :icon="icon.icon"
            :size="icon.size"
            :type="icon.type ?? 'fa'"
            :weight="icon.weight ?? 'light'"
            class="space-icon"/>
        <span v-html="label"></span>
        <slot/>
    </label>
</template>

<script lang="ts">
    import { ComponentInternalInstance, computed, defineComponent, getCurrentInstance, PropType } from "vue";
    import IconProperties
                                                                                                  from "../utils/icon-properties";

    export default defineComponent({
        name: "ssf-input-label",

        props: {
            label      : { type: [ String ], required: true },
            placeholder: { type: [ String, Boolean ] },

            focused: { type: Boolean, required: false },

            /* ICONS */
            icon: { type: [ String, Object ] as PropType<string | IconProperties>, required: false, default: null },
        },

        emits: [ "label-click" ],

        setup(props) {

            const parent = computed((): ComponentInternalInstance | null | undefined => getCurrentInstance()?.parent)

            return {
                active: computed(() => {
                    if (parent.value?.parent?.props?.modelValue === null || typeof parent.value?.parent?.props?.modelValue === "undefined" || parent.value?.parent?.props?.modelValue.toString().trim() === "") {
                        return false
                    }

                    if (props.focused || !!props.placeholder)
                        return true;

                    if (parent.value?.parent?.props?.select && parent.value?.parent?.props?.multiple)
                        return Array.isArray(parent.value?.parent?.props?.modelValue) && parent.value?.parent?.props?.modelValue.length > 0;

                    if (parent.value?.parent?.props?.type === "number")
                        return ((parent.value?.parent?.props?.modelValue || parent.value?.parent?.props?.modelValue === 0) && parent.value?.parent?.props?.modelValue.toString().trim() !== "");

                    return (parent.value?.parent?.props?.modelValue && ((typeof parent.value?.parent?.props?.modelValue === "string" && parent.value?.parent?.props?.modelValue.trim() !== "") || typeof parent.value?.parent?.props?.modelValue !== "string"))
                }),

                showLabel: computed(() => props.label && props.placeholder !== true),

                required: computed(() => parent.value?.parent?.props?.required === true)
            }

        },

    })
</script>

<style lang="scss" scoped>
    .ssf__input-label {
        margin-bottom: 0 !important;

        .space-icon {
            margin-right: 5px;
        }
    }
</style>
