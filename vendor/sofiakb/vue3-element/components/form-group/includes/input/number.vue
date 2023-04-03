<template>
    <div class="ssf-input-container ssf-form-number">

        <ssf-input-label
            v-if="label"
            :key="`number-label-${label}`"
            :icon="icon"
            :label="label"
            :placeholder="placeholder"
            @label-click="onLabelClick"/>

        <!-- TYPE : NUMBER -->
        <input
            :id="name"
            ref="inputComponent"
            :autocomplete="autocomplete"
            :class="inputClass"
            :disabled="disabled"
            :inputmode="inputmode ? 'decimal' : ''"
            :max="max"
            :min="min"
            :name="name"
            :placeholder="placeholder"
            :required="required"
            :step="step"
            :type="inputType"
            :value="modelValue"
            class="ssf-form-control"
            @change="$emit('change')"
            @focus="$emit('focus')"
            @input="onInput()"/>

        <div class="ssf-number-control">
            <div class="control control-more" @click="onInput(1)">
                <span></span>
            </div>
            <div class="control control-less" @click="onInput(-1)">
                <span></span>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import SsfInputLabel                                          from "../input-label.vue";
    import { computed, defineComponent, nextTick, PropType, ref } from "vue";
    import Nullable                                               from "../../../../types/nullable";

    export default defineComponent({
        name: "ssf-input-number",

        components: { SsfInputLabel },

        props: {
            label     : { type: String as PropType<string | undefined>, required: false },
            name      : { type: String, required: true },
            inputClass: { type: [String, Object], required: true },
            type      : { type: [String, Object] as PropType<Record<string, any>>, required: true },

            inputmode: { type: [ String, Boolean ], required: true },

            max : { type: [ String, Number, null ] as PropType<Nullable<number | string>>, required: true },
            min : { type: [ String, Number, null ] as PropType<Nullable<number | string>>, required: true },
            step: {  type: [ String, Number ] as PropType<number | string>, required: true },

            modelValue: { required: true },

            disabled: { type: Boolean, required: true },
            required: { type: Boolean, required: true },

            placeholder : { type: String as PropType<string | undefined>, required: false },
            autocomplete: { type: String as PropType<string | undefined>, required: false },

            icon: { required: true },
        },

        emits: [ "focus", "change", "input" ],

        setup(props, { emit }) {

            const small = computed(() => window.innerWidth < 768)

            const inputComponent = ref<Nullable<HTMLInputElement>>(null)

            const increase = (value: Nullable<number>) => props.max !== null
                ? Math.min(...[ parseInt(value?.toString() ?? "0") + parseInt(props.step.toString()), parseInt(props.max.toString()) ])
                : parseInt(value?.toString() ?? "0") + parseInt(props.step.toString())

            const decrease = (value: Nullable<number>) => props.min !== null
                ? Math.max(...[ parseInt(value?.toString() ?? "0") - parseInt(props.step.toString()), parseInt(props.min.toString()) ])
                : parseInt(value?.toString() ?? "0") - parseInt(props.step.toString())

            const format = (value: Nullable<number | string> = null) => parseInt((value ?? props.modelValue ?? 0).toString())

            return {

                inputType: computed(() => small.value ? "text" : props.type),

                onLabelClick() {
                    // @ts-ignore
                    return nextTick(() => inputComponent.value?.focus())
                },

                onInput(direction = null) {
                    let value: Nullable<number | string> = format();
                    value = Number.isNaN(value) ? Number.isNaN(props.min) ? 0 : props.min : value;
                    return direction === 1
                        ? emit("input", format(increase(parseInt(value?.toString() ?? "0"))))
                        : direction === -1
                            ? emit("input", format(decrease(parseInt(value?.toString() ?? "0"))))
                            : nextTick(() => emit("input", format(parseInt(inputComponent.value?.value ?? "0"))));
                }
            }

        },
    })
</script>

<style lang="scss" scoped>
    $defaultBorder: #ddd;
    $defaultBorderRadius: var(--form-radius, 4px);

    .ssf-form-number {
        position: relative;


        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            margin: 0;
        }

        .ssf-form-control {
            padding-right: 0;
            -webkit-appearance: none;
            //padding-left: 50px;
        }

        label {
            //margin-left: 42px;
        }

        .ssf-form-control:focus + label,
        label.active {
            //margin-left: 42px;
        }

        .ssf-number-control {
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;

            .control {
                position: absolute;
                height: 50%;
                //top: 1px;
                //bottom: 1px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 40px;
                cursor: pointer;
                border-left: 1px solid #ddd;
                //background: #fff;
                transition: all .5s;

                &:hover {
                    background: #000;

                    &.control-more:before,
                    &.control-less:before {
                        color: #ffffff;
                    }
                }

                &.control-more {
                    top: 1px;
                    right: 1px;
                    border-top-right-radius: $defaultBorderRadius;
                    //border-bottom-right-radius: $defaultBorderRadius;

                    &:before {
                        content: '+';
                    }
                }

                &.control-less {
                    right: 1px;
                    bottom: 1px;
                    //border-top-left-radius: $defaultBorderRadius;
                    border-bottom-right-radius: $defaultBorderRadius;

                    &:before {
                        content: '-';
                    }
                }

                &.control-more:before,
                &.control-less:before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    height: 100%;
                    width: 100%;
                    -ms-flex-align: center;
                    align-items: center;
                    -ms-flex-pack: center;
                    justify-content: center;
                    display: -ms-flexbox;
                    display: flex;
                    font-weight: 300;
                    font-size: 1rem;
                }

            }
        }

    }
</style>
