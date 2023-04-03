<template>
    <div class="ssf-input-container ssf-form-password">

        <ssf-input-label
            v-if="label"
            :key="`password-label-${label}`"
            :icon="icon"
            :label="label"
            :placeholder="placeholder"
            @label-click="onLabelClick"/>

        <!-- TYPE : password -->
        <input
            :id="name"
            ref="inputComponent"
            :autocomplete="autocomplete"
            :class="inputClass"
            :disabled="disabled"
            :name="name"
            :placeholder="placeholder"
            :required="required"
            :type="inputType"
            :value="modelValue"
            class="ssf-form-control"
            @change="$emit('change')"
            @focus="$emit('focus')"
            @input="onInput()"/>

        <span class="ssf-password-toggle" @click="toggleShow">
            <ssf-icon v-if="!show" icon="eye" light/>
            <ssf-icon v-if="show" icon="eye-slash" light/>
        </span>

    </div>
</template>

<script lang="ts">
    import SsfInputLabel                                from "../input-label.vue";
    import { defineComponent, nextTick, PropType, ref } from "vue";
    import Nullable                                     from "../../../../types/nullable";

    export default defineComponent({
        name: "ssf-input-password",

        components: { SsfInputLabel },


        props: {
            label     : { type: String as PropType<string | undefined>, required: false },
            name      : { type: String, required: true },
            inputClass: { type: [ String, Object ], required: true },

            modelValue: { required: true },

            disabled: { type: Boolean, required: true },
            required: { type: Boolean, required: true },

            placeholder : { type: String as PropType<string | undefined>, required: false },
            autocomplete: { type: String as PropType<string | undefined>, required: false },

            icon: { required: true },
        },

        emits: [ "focus", "change", "input" ],

        setup(props, { emit }) {

            const inputComponent = ref<Nullable<HTMLInputElement>>(null)
            const show = ref(false)
            const inputType = ref("password")
            return {
                inputComponent,
                inputType,
                show,

                toggleShow() {
                    show.value = !show.value
                    inputType.value = show.value ? "text" : "password"

                    if (inputComponent.value instanceof HTMLInputElement) {
                        inputComponent.value.focus()
                        // const currentValue = inputComponent.value.value
                        // emit("input", "")
                        // emit("input", currentValue)
                        // inputComponent.value.value = ""
                        // inputComponent.value.value = currentValue
                    }

                },

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

<style lang="scss" scoped>
    .ssf-form-password {
        position: relative;

        .ssf-password-toggle {
            position: absolute;
            top: 0;
            right: 10px;
            bottom: 0;
            height: 15px;
            width: 15px;
            margin-top: auto;
            margin-bottom: auto;
            cursor: pointer;

            img {
                height: 100%;
                width: 100%;
            }
        }
    }
</style>
