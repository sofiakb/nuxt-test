<template>
    <div :key="`form-container-key-${name}-${componentKey}`" :class="mainClasses" @click="$emit('click', $event)">
        <div :class="containerClass">

            <ssf-select
                v-if="select"
                v-model="modelValue"
                :autocomplete="inputAutocomplete"
                :disabled="disabled"
                :icon="xIcon"
                :input-class="inputClass"
                :label="label"
                :multiple="multiple"
                :name="name"
                :option-field="optionField"
                :option-group="optionGroup"
                :option-items="optionItems"
                :option-label="optionLabel"
                :placeholder="inputPlaceholder"
                :required="required"
                :scroll-x="scrollX"
                :select-height="selectHeight"
                :wheel-propagation="wheelPropagation"
                @change="$emit('change')"
                @focus="$emit('focus')"
                @input="onInput"/>

            <ssf-textarea
                v-else-if="textarea"
                v-model="modelValue"
                :autocomplete="inputAutocomplete"
                :autosize="autosize"
                :disabled="disabled"
                :icon="xIcon"
                :input-class="inputClass"
                :label="label"
                :maxHeight="maxHeight"
                :minHeight="minHeight"
                :name="name"
                :placeholder="inputPlaceholder"
                @change="$emit('change')"
                @focus="$emit('focus')"
                @input="onInput"/>

            <ssf-input
                v-else
                ref="input"
                v-model="modelValue"
                :autocomplete="inputAutocomplete"
                :current-date="currentDate"
                :current-time="currentTime"
                :date-format="dateFormat"
                :disabled="disabled"
                :default-value="defaultValue"
                :field="field"
                :file-accepted="fileAccepted"
                :file-preview="filePreview"
                :icon="icon"
                :inline="inline"
                :input-class="inputClass"
                :input-mode="inputMode"
                :items="items"
                :label="label"
                :max="max"
                :mimes="mimes"
                :min="min"
                :name="name"
                :placeholder="inputPlaceholder"
                :required="required"
                :step="step"
                :time-format="timeFormat"
                :type="type"
                @change="$emit('change')"
                @focus="$emit('focus')"
                @input="onInput">
                <slot v-if="hasSlot('label')" name="label"/>
                <slot v-if="hasSlot('file-info')" name="file-info"/>
                <slot v-if="hasSlot('selector')" name="selector"/>
                <slot v-if="hasSlot('delete-file')" name="delete-file"/>
            </ssf-input>


        </div>

        <slot/>

    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, getCurrentInstance, PropType, ref } from "vue";

    import SsfInput    from "./includes/input/main.vue";
    import SsfSelect   from "./includes/select.vue";
    import SsfTextarea from "./includes/textarea.vue";

    import { hasSlot as MainHasSlot } from "../../utils";

    enum CheckboxTypes {
        checkbox = "ssf-checkbox-group",
        switch = "ssf-checkbox-switch",
        radio = "ssf-radio-group"
    }

    export default defineComponent({
        name: "ssf-form-group",

        components: { SsfInput, SsfSelect, SsfTextarea },

        props: {

            /* CONTAINERS */
            row           : { type: Boolean, required: false, default: false },
            col           : { type: [ Boolean, Number, Object, String ], required: false, default: false },
            formGroupClass: { type: String, required: false, default: "" },
            inputClass    : { type: [ String, Object ], required: false, default: "" },

            /* COMMONS */
            name        : { type: [ String, Object ], required: true },
            label       : { type: [ String ], required: false },
            modelValue  : { required: false, default: null },
            required    : { type: Boolean, required: false, default: false },
            defaultValue: { required: false },

            /* SELECT */
            select          : { type: Boolean, required: false, default: false },
            optionItems     : { type: [ Array, Object ], required: false },
            optionField     : { type: String as PropType<string | undefined>, required: false },
            optionLabel     : { type: String, required: false, default: "label" },
            optionGroup     : { type: Boolean, required: false, default: false },
            multiple        : { type: Boolean, required: false, default: false },
            scrollX         : { type: Boolean, required: false, default: false },
            wheelPropagation: { type: Boolean, required: false, default: true },
            selectHeight    : { type: [ Number, String ], required: false, default: 350 },

            /* TEXTAREA */
            textarea : { type: Boolean, required: false, default: false },
            autosize : { type: Boolean, default: true },
            minHeight: { type: [ Number ], "default": null },
            maxHeight: { type: [ Number ], "default": null },

            /* INPUT */
            type        : { type: [ String, Object ], required: false, default: "text" },
            disabled    : { type: Boolean, required: false, default: false },
            placeholder : { type: [ Boolean, String ], required: false, default: false },
            autocomplete: { type: [ Boolean, String ], required: false, default: false },

            /* NUMBER */
            step     : { type: [ Number, String ], required: false, default: 1 },
            min      : { type: [ Number, String ], required: false, default: null },
            max      : { type: [ Number, String ], required: false, default: null },
            inputMode: { type: [ Boolean, String ], required: false, default: false },

            /* RADIO */
            items : { type: Array, required: false },
            field : { type: String, required: false, default: null },
            inline: { type: Boolean, required: false, default: false },

            /* DATE */
            dateFormat : { type: String, required: false, default: "DD/MM/YYYY" },
            currentDate: { type: Boolean, required: false, default: false },

            /* TIME */
            timeFormat : { type: String, required: false, default: "HH:mm:ss" },
            currentTime: { type: Boolean, required: false, default: false },

            /* FILE */
            mimes       : { type: String, required: false, default: "pdf, csv, text, gif, jpeg, png, icon" },
            fileAccepted: { type: String, required: false, default: "*" },
            filePreview : { type: Boolean, required: false, default: false },

            /* ICONS */
            icon      : { type: [ String, Object ], required: false, default: null },
            iconType  : { type: [ String ], required: false },
            iconWeight: { type: [ String ], required: false },
        },

        emits: [ "click", "focus", "change", "input", "update:modelValue" ],

        setup(props, { emit }) {


            const colClasses = computed(() => {
                if (typeof props.col === "boolean")
                    return { "col-12": true }
                if (typeof props.col === "number" || !isNaN(parseInt(props.col.toString()))) {
                    const object: any = {}
                    object[`col-${props.col}`] = true
                    return object
                }

                if (typeof props.col === "string") {
                    const object: any = {}
                    object[props.col] = true
                    return object
                }

                if (typeof props.col === "object") {
                    const object = {}
                    const keys = Object.keys(props.col)
                    // @ts-ignore
                    keys.forEach(key => object[`col-${key}-${props.col[key]}`] = true)
                    return object
                }

                return null;
            })

            const componentKey = ref(0)
            const hasSlot = (name = "default") => {
                // @ts-ignore
                const ctx = getCurrentInstance()
                return ctx ? MainHasSlot(ctx, name) : null;
            }

            return {
                mainClasses      : computed(() => ({ ...{ row: props.row === true }, ...colClasses.value })),
                inputPlaceholder : computed(() => props.placeholder === "false" || props.placeholder === false ? undefined : props.placeholder),
                inputAutocomplete: computed(() => props.autocomplete === "false" || props.autocomplete === false ? "off" : "on"),

                // @ts-ignore
                containerClass: computed(() => `${CheckboxTypes[props.type] || "ssf-form-group"} ${props.formGroupClass} ${hasSlot() ? "has-slot" : ""}`.trim()),
                xIcon         : computed(() => {
                    if (typeof props.icon === "string")
                        return {
                            type  : props.iconType ?? "fa",
                            icon  : props.icon,
                            weight: props.iconWeight ?? "regular",
                            size  : "1x"
                        }
                    else return props.icon
                }),

                hasSlot,

                onInput(value: any) {
                    if (!props.disabled) {
                        emit("change")
                        emit("input", value)
                        emit("update:modelValue", value)
                    }
                    // componentKey.value++
                },

                componentKey
            }
        },

    })
</script>

<style lang="scss">
    $defaultBorder: #ddd;
    $defaultBorderRadius: var(--form-radius, 4px);

    //:root {
    //    --form-radius: var(--form-radius, 6px)
    //}

    /*.ssf-row {
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            width: 100%;
    }*/

    .ssf-form-group {
        position: relative;
        width: 100%;

        .ssf-form-control {
            font-size: 14px;
            width: 100%;
            padding: 14px 18px;
            background-color: transparent;
            min-height: 45px;
            box-sizing: border-box;
            border: 1px solid $defaultBorder;
            -webkit-border-radius: var(--form-radius, $defaultBorderRadius);
            -moz-border-radius: var(--form-radius, $defaultBorderRadius);
            border-radius: var(--form-radius, $defaultBorderRadius);
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;


            &:focus,
            &:focus + .ssf-number-control {
                -webkit-box-shadow: none;
                -moz-box-shadow: none;
                box-shadow: none;
                border-color: #225a94;
                outline: 0;
            }

            &:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus,
            &:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 0 white inset;
                -moz-box-shadow: 0 0 0 0 white inset;
                box-shadow: 0 0 0 0 white inset;
            }

            .is-valid {
                border-color: #6aa280;
            }

            .is-invalid {
                border-color: #d6534c;
            }
        }

        label {
            position: absolute;
            font-size: 13px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 10px;
            color: #9e9e9e;
            margin-left: 0;
            transition: all .25s;
            cursor: pointer;
            background: transparent;
        }

        .ssf-form-control:focus + label,
        label.active {
            top: -8px;
            left: inherit;
            right: inherit;
            margin-left: 15px;
            height: 16px;
            font-size: 10px;
            background-color: #fff;
            z-index: 1;
        }

        input.ssf-form-control, select.ssf-form-control {
            -moz-appearance: none !important;
            -webkit-appearance: none !important;
            appearance: none !important;
        }

    }

    .ssf-form-group:not(.has-slot),
    .ssf-checkbox-group:not(.has-slot),
    .ssf-checkbox-switch:not(.has-slot),
    .ssf-radio-group:not(.has-slot) {
        margin-top: 8px;
        margin-bottom: 20px;
    }
</style>
