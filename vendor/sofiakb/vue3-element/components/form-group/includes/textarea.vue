<template>
    <div class="ssf-input-container ssf-form-text" style="position: relative">

        <ssf-input-label
            v-if="label"
            :key="`text-label-${label}`"
            :icon="icon"
            :label="label"
            :placeholder="placeholder"
            :focused="focused"
            @label-click="onLabelClick"/>

        <textarea
            :id="name"
            ref="inputComponent"
            :autocomplete="autocomplete"
            :class="`ssf-form-control ${inputClass}`"
            :disabled="disabled"
            :name="name"
            :placeholder="placeholder"
            :required="required"
            :style="computedStyles"
            :value="modelValue"
            @change="$emit('change')"
            @focus="resize"
            @input="onInput()"
        ></textarea>

    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, nextTick, PropType, ref, watch } from "vue";

    import SsfInputLabel from "./input-label.vue";
    import Nullable      from "../../../types/nullable";

    export default defineComponent({
        name: "ssf-textarea",

        components: { SsfInputLabel },

        props: {
            /* CONTAINERS */
            formGroupClass: { type: String, required: false, default: "" },
            inputClass    : { type: [ String, Object ], required: false, default: "" },


            /* COMMONS */
            name      : { type: [ String, Object ], required: true },
            label     : { type: [ String ], required: false },
            modelValue: { type: [ Object, null, String ] as PropType<any>, required: true, default: null },
            required  : { type: Boolean, required: false, default: false },

            autosize : { type: Boolean, default: true },
            minHeight: { type: [ Number ], "default": null },
            maxHeight: { type: [ Number ], "default": null },

            /*
             * Force !important for style properties
             */
            important: {
                type   : [ Boolean, Array ],
                default: false
            },

            icon: { type: Object as PropType<{ icon?: string, size?: string, type?: string, weight?: string }> },

            disabled    : { type: Boolean, required: false, default: false },
            placeholder : { type: String as PropType<string | undefined>, required: false },
            autocomplete: { type: String as PropType<string | undefined>, required: false },
        },

        emits: [ "focus", "change", "input" ],

        setup(props, { emit }) {
            ////////// data
            // data property for v-model binding with real textarea tag
            const val = ref<Nullable<any>>(null)
            const maxHeightScroll = ref(false)
            const height = ref("auto")

            const isResizeImportant = computed(() => props.important === true || (Array.isArray(props.important) && props.important.includes("resize")))
            const isOverflowImportant = computed(() => props.important === true || (Array.isArray(props.important) && props.important.includes("overflow")))
            const isHeightImportant = computed(() => props.important === true || (Array.isArray(props.important) && props.important.includes("height")))

            const resize = () => {
                const important = isHeightImportant.value ? "important" : ""
                height.value = `auto${important ? " !important" : ""}`
                nextTick(() => {
                    // @ts-ignore
                    let contentHeight = inputComponent.value?.scrollHeight + 1

                    if (props.minHeight) {
                        contentHeight = contentHeight < props.minHeight ? props.minHeight : contentHeight
                    }

                    if (props.maxHeight) {
                        if (contentHeight > props.maxHeight) {
                            contentHeight = props.maxHeight
                            maxHeightScroll.value = true
                        } else {
                            maxHeightScroll.value = false
                        }
                    }

                    const heightVal = contentHeight + "px"
                    height.value = `${heightVal}${important ? " !important" : ""}`
                })

                return this
            }

            // @ts-ignore
            watch(() => props.modelValue, () => val.value = props.modelValue, { immediate: true })
            watch(() => val.value, (val) => {
                resize()
                emit("input", val)
            }, { immediate: true })

            watch(() => props.minHeight, () => nextTick(resize), { immediate: true })
            watch(() => props.maxHeight, () => nextTick(resize), { immediate: true })
            watch(() => props.autosize, (val) => val ? resize() : null, { immediate: true })

            // const parent = computed((): ComponentInternalInstance | null | undefined => getCurrentInstance()?.parent)

            const inputComponent = ref<Nullable<HTMLTextAreaElement>>(null)
            const focused = ref(false)

            watch(() => props.modelValue, () => focused.value = !!props.modelValue && props.modelValue.toString().trim() !== "", { immediate: true })

            return {
                val,

                maxHeightScroll,
                height,

                focused,

                computedStyles: computed(() => {
                        if (!props.autosize) return {}
                        return {
                            resize  : !isResizeImportant.value ? "none" : "none !important",
                            height  : height.value,
                            overflow: maxHeightScroll.value ? "auto" : (!isOverflowImportant.value ? "hidden" : "hidden !important")
                        }
                    }
                ),

                onLabelClick() {
                    nextTick(() => inputComponent.value?.focus())
                },

                onInput() {
                    nextTick(() => {
                        val.value = inputComponent.value?.value
                        return emit("input", val.value);
                    })
                },

                inputComponent,
                resize
            }
        },

    })
</script>

<style lang="scss">
    .ssf-input-container {
        position: relative;
    }
</style>
