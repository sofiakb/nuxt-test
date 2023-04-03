<template>
    <div class="ssf-input-container ssf-form-radio">

        <ssf-input-label
            v-if="label"
            :key="`radio-label-${label}`"
            :icon="icon"
            :label="label"/>

        <!-- TYPE : RADIO -->
        <label
            v-for="(item, index) in items"
            :key="`item-${index}`"
            :class="{'ssf-radio-inline': inline}"
            class="ssf-radio-button cursor-pointer">

            <input
                :id="name"
                ref="inputComponent"
                :checked="isChecked(item, modelValue)"
                :class="{checked: isChecked(item, modelValue)}"
                :disabled="disabled"
                :name="name"
                :required="required"
                :value="value(item)"
                class="ssf-form-control"
                type="radio"
                @change="$emit('change')"
                @focus="$emit('focus')"
                @input="onInput(item)"/>&nbsp;<span>{{ item[field] || item }}</span>
        </label>

    </div>
</template>

<script lang="ts">
    import SsfInputLabel                 from "../input-label.vue";
    import { defineComponent, PropType } from "vue";

    export default defineComponent({
        name: "ssf-input-radio",

        components: { SsfInputLabel },

        props: {
            label     : { type: String as PropType<string | undefined>, required: false },
            name      : { type: String, required: true },
            modelValue: { required: true },

            disabled: { type: Boolean, required: true },
            required: { type: Boolean, required: true },

            items: { type: Array, required: true },
            field: { type: [ String, null ] as PropType<string | undefined>, required: true },

            inline: { type: Boolean, required: true },

            icon: { required: true },
        },

        emits: [ "focus", "change", "input" ],

        setup(props, { emit }) {

            return {

                value: (item: any) => props.field ? item[props.field] ?? item : item,

                isChecked: (item: any, value: any) =>props.field ? item[props.field] === value : item === value,

                onInput: (item: any) => emit("input", props.field ? item[props.field] : item)

            }

        }
    })
</script>

<style lang="scss" scoped>
    $defaultBorder: #ddd;
    $defaultBorderRadius: var(--form-radius, 4px);

    .ssf-radio-group {

        input[type=radio] {

            position: absolute;
            -webkit-appearance: none;
            -moz-appearance: none;
            border: 1px solid $defaultBorder;
            height: 16px;
            width: 16px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            cursor: pointer;
            margin-left: -22px;
            margin-top: 0;
            box-sizing: border-box;

            &:focus, &:active, &:hover {
                outline: 0;
                -webkit-box-shadow: none;
                -moz-box-shadow: none;
                box-shadow: none;
            }

            &:checked, .checked {
                border-color: #0f0f0f;
                /*border-width: 2px;*/
            }

            &:checked:before,
            .checked:before {
                content: '';
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                position: absolute;
                height: 8px;
                width: 8px;
                border-radius: 50%;
                background-color: #0f0f0f;
            }
        }

        label:not(.ssf-radio-button) {
            font-size: 13px;
            /*display: flex;*/
            /*align-items: center;*/
            padding: 0 10px 10px;
            color: #9e9e9e;
            display: block;
        }

        label.ssf-radio-button {
            height: 20px;
        }

        label.ssf-radio-button {
            display: flex;
            align-items: center;
            padding-left: 35px;


            &:not(.ssf-radio-inline) {
                margin-bottom: 5px;
            }

            &.ssf-radio-inline {
                display: inline-block;
                vertical-align: middle;
                min-height: 20px;
            }
        }
    }
</style>
