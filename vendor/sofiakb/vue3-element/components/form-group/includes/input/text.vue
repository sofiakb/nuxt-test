<template>
    <div class="ssf-input-container ssf-form-text">

        <ssf-input-label
            v-if="label"
            :key="`text-label-${label}`"
            :icon="icon"
            :label="label"
            :placeholder="placeholder"
            @label-click="onLabelClick"/>

        <!-- TYPE : text -->
        <input
            :id="name"
            ref="inputComponent"
            :autocomplete="autocomplete"
            :class="inputClass"
            :disabled="disabled"
            :inputmode="type"
            :name="name"
            :placeholder="placeholder"
            :required="required"
            :type="type"
            :value="modelValue"
            class="ssf-form-control"
            @change="$emit('change')"
            @focus="$emit('focus')"
            @input="onInput()"/>

    </div>
</template>

<script lang="ts">
    import SsfInputLabel                                from "../input-label.vue";
    import { defineComponent, nextTick, PropType, ref } from "vue";

    export default defineComponent({
        name: "ssf-input-text",

        components: { SsfInputLabel },

        props: {
            label     : { type: String as PropType<string | undefined>, required: false },
            name      : { type: String, required: true },
            inputClass: { type: [String, Object], required: true },
            type      : { type: [String, Object] as PropType<Record<string, any>>, required: true },

            modelValue: { required: true },

            disabled: { type: Boolean, required: true },
            required: { type: Boolean, required: true },

            placeholder : { type: String as PropType<string | undefined>, required: false },
            autocomplete: { type: String as PropType<string | undefined>, required: false },

            icon: { required: true },
        },

        emits: [ "focus", "change", "input" ],

        setup(_, { emit }) {

            const inputComponent = ref(null)

            return {
                inputComponent,

                onLabelClick() {
                    // @ts-ignore
                    nextTick(() => inputComponent.value?.focus())
                },

                onInput() {
                    // @ts-ignore
                    nextTick(() => emit("input", inputComponent.value?.value))
                }
            }
        },
    })
</script>

<style scoped>

</style>
