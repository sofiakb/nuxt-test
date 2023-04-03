<template>
    <div class="ssf-input-container ssf-form-text">
        <label class="cursor-pointer">
            <!-- TYPE : CHECKBOX -->
            <input
                :id="name"
                ref="inputComponent"
                :checked="modelValue"
                :class="[ inputClass, {'checked': modelValue} ]"
                :disabled="disabled"
                :name="name"
                :required="required"
                :value="modelValue"
                class="ssf-form-control"
                type="checkbox"
                @change="$emit('change')"
                @input="onInput()">

            <ssf-input-label
                v-if="label"
                :key="`text-label-${label}`"
                :icon="icon"
                :label="label"
                @label-click="onLabelClick"/>

            <span v-if="switcher" :class="{'checked': modelValue}" class="slider"></span>
        </label>
    </div>
</template>

<script lang="ts">
    import SsfInputLabel                           from "../input-label.vue";
    import { defineComponent, nextTick, PropType } from "vue";
    import IconProperties
                                                   from "../../utils/icon-properties";

    export default defineComponent({
        name: "ssf-input-checkbox",

        components: { SsfInputLabel },

        props: {
            switcher: { type: Boolean, required: false, default: false },

            /* CONTAINERS */
            inputClass: { type: [ String, Object ], required: true, default: "" },

            /* COMMONS */
            name      : { type: String, required: true },
            label     : { type: [ String ], required: true },
            modelValue: { required: true, default: null },
            required  : { type: Boolean, required: true, default: false },

            /* INPUT */
            disabled: { type: Boolean, required: true, default: false },


            /* ICONS */
            icon: { type: [ String, Object ] as PropType<string | IconProperties>, required: false, default: null },
        },

        emits: [ "focus", "change", "input" ],

        setup(props, { emit }) {
            const onInput = () => nextTick(() => emit("input", !(props.modelValue ?? false)))

            return {
                onLabelClick: () => onInput(),
                onInput
            }
        },

    })
</script>

<style lang="scss" scoped>
    $defaultBorder: #ddd;
    $defaultBorderRadius: var(--form-radius, 4px);

    .ssf-checkbox-group {

        input[type=checkbox] {

            position: relative;
            -webkit-appearance: none;
            border: 1px solid $defaultBorder;
            height: 20px;
            width: 20px;
            -webkit-border-radius: $defaultBorderRadius;
            -moz-border-radius: $defaultBorderRadius;
            border-radius: $defaultBorderRadius;
            cursor: pointer;
            margin-right: 10px;

            &:focus, &:active, &:hover {
                outline: 0;
                -webkit-box-shadow: none;
                -moz-box-shadow: none;
                box-shadow: none;
            }

            &:before {
                content: '';
                height: 0;
                width: 0;
                transition: height .4s, width .4s .25s;
            }

            &:checked:before,
            .checked:before {
                content: '';
                top: -6px;
                left: 9px;
                position: absolute;
                height: 18px;
                width: 9px;
                border-bottom: 2px solid #0f0f0f;
                border-right: 2px solid #0f0f0f;
                transform: rotate(45deg);
                transition: height .4s, width .4s .25s;
            }
        }

        label {
            display: flex;
            align-items: center;
        }
    }

    .ssf-checkbox-switch {

        label {
            position: relative;
            display: flex;
            align-items: center;
        }

        input[type=checkbox] {
            height: 15px;
            width: 30px;
            border: 1px solid $defaultBorder;
            background-color: $defaultBorder;
            -webkit-appearance: none;
            -moz-appearance: none;
            border-radius: 90px;

            &:focus, &:active, &:hover {
                outline: 0;
                -webkit-box-shadow: none;
                -moz-box-shadow: none;
                box-shadow: none;
            }
        }

        .slider {
            content: "";
            position: absolute;
            height: 13px;
            width: 13px;
            top: 0;
            left: 2px;
            bottom: 0;
            background-color: #fff;
            margin-top: auto;
            margin-bottom: auto;
            border-radius: 50%;
            -webkit-transition: .4s;
            -o-transition: .4s;
            transition: .4s;
        }

        .slider.checked,
        input[type=checkbox]:checked + .slider.checked {
            -webkit-transform: translateX(13px);
            -ms-transform: translateX(13px);
            transform: translateX(13px);
        }

        input[type=checkbox]:checked {
            background-color: #2196F3;
            border-color: #2196F3;
        }

    }
</style>
