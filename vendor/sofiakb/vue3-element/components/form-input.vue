<template>
    <ssf-form-group
        :autocomplete="autocomplete"
        :autosize="autosize"
        :col="col"
        :current-date="currentDate"
        :current-time="currentTime"
        :date-format="dateFormat"
        :default-value="defaultValue"
        :disabled="disabled"
        :file-accepted="fileAccepted"
        :file-preview="filePreview"
        :form-group-class="`_custom-form-group ${formGroupClass}${hasError ? ' has-own-slot' : ''}`"
        :icon="xIcon"
        :input-class="`_custom-form-control ${inputClass}`"
        :input-mode="inputMode"
        :label="label"
        :max="max"
        :max-height="maxHeight"
        :mimes="mimes"
        :min="min"
        :min-height="minHeight"
        :model-value="modelValue"
        :multiple="multiple"
        :name="name"
        :optionField="optionField"
        :optionGroup="optionGroup"
        :optionItems="optionItems"
        :optionLabel="optionLabel"
        :placeholder="placeholder"
        :required="required"
        :row="row"
        :scrollX="scrollX"
        :select="select"
        :selectHeight="selectHeight"
        :step="step"
        :textarea="textarea"
        :time-format="timeFormat"
        :type="type"
        :wheel-propagation="wheelPropagation"
        @update:model-value="onUpdateValue">
        <ssf-container v-if="hasError" class="form-input-error">
            <ssf-col size="12">
                <ssf-container v-html="errorMessages"/>
            </ssf-col>
        </ssf-container>

        <slot v-if="hasSlot('label')" name="label"/>
        <slot v-if="hasSlot('file-info')" name="file-info"/>
        <slot v-if="hasSlot('selector')" name="selector"/>
        <slot v-if="hasSlot('delete-file')" name="delete-file"/>
        <slot/>

        <template v-if="withHelp" #default>
            <div :style="`--help-item-bottom: ${helpItemBottom}px`"
                 class="help-item align-flex"
                 @mouseenter="hoverHelp = true"
                 @mouseleave="hoverHelp = false">

                <ssf-icon :class="helpColor" icon="question-circle" la size="lg"/>

                <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <div v-if="hoverHelp" class="help-content small rounded p-1 text-center text-white full-flex">
                        {{ helpText }}
                    </div>
                </transition>

            </div>
        </template>

    </ssf-form-group>
</template>

<script lang="ts">
    import { computed, defineComponent, getCurrentInstance, toRefs } from "vue";
    import { each, filter }                                          from "lodash";

    import { messages as errorMessages } from "../commons/validation";


    export default defineComponent({
        name: "form-input",

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

            /* INPUT */
            type        : { type: String, required: false, default: "text" },
            disabled    : { type: Boolean, required: false, default: false },
            placeholder : { type: [ String ], required: false, default: null },
            autocomplete: { type: [ Boolean, String ], required: false, default: false },

            /* NUMBER */
            step     : { type: [ Number, String ], required: false, default: 1 },
            min      : { type: [ Number, String ], required: false, default: null },
            max      : { type: [ Number, String ], required: false, default: null },
            inputMode: { type: [ Boolean, String ], required: false, default: false },

            /* TEXTAREA */
            textarea : { type: Boolean, required: false, default: false },
            autosize : { type: Boolean, default: true },
            minHeight: { type: [ Number ], "default": null },
            maxHeight: { type: [ Number ], "default": null },

            /* SELECT */
            select          : { type: Boolean, required: false, default: false },
            optionItems     : { type: [ Array, Object ], required: false },
            optionField     : { type: String, required: false, default: null },
            optionLabel     : { type: String, required: false, default: "label" },
            optionGroup     : { type: Boolean, required: false, default: false },
            multiple        : { type: Boolean, required: false, default: false },
            scrollX         : { type: Boolean, required: false, default: false },
            wheelPropagation: { type: Boolean, required: false, default: true },
            selectHeight    : { type: [ Number, String ], required: false, default: 350 },

            /* DATE */
            dateFormat : { type: String, required: false, default: "DD/MM/YYYY" },
            currentDate: { type: Boolean, required: false, default: false },

            /* TIME */
            timeFormat : { type: String, required: false, default: "HH:mm:ss" },
            currentTime: { type: Boolean, required: false, default: false },

            /* ICONS */
            icon      : { type: [ String, Object ], required: false },
            iconType  : { type: [ String ], required: false },
            iconWeight: { type: [ String ], required: false },

            /* FORM VALIDATION */
            errors: { type: Array },

            /* HELP ICON */
            withHelp : { type: Boolean, required: false, default: false },
            helpText : { type: String, required: false },
            helpColor: { type: String, required: false, default: "help-text-info" },

            /* FILE */
            mimes       : { type: String, required: false, default: "pdf, csv, text, gif, jpeg, png, icon" },
            fileAccepted: { type: String, required: false, default: "*" },
            filePreview : { type: Boolean, required: false, default: false },

            messages: { type: Object, required: false },
        },

        emits: [ "update:modelValue", "input" ],

        setup(props, { emit }) {
            ////////// data
            const { errors, name } = toRefs(props)

            const pattern = `(^${name.value}.)|(\\.${name.value}.)`

            ////////// methods
            const keyErrors = () => filter(errors.value, (key: string) => key.match(new RegExp(pattern, "g")) !== null)
            const hasSlot = (name = "default", component = getCurrentInstance()) => component && !!component.slots[name]

            ////////// computed
            const hasError = computed(() => keyErrors().length > 0)
            const messages = computed(() => {
                const result: string[] = [], _errorMessages: any = { ...errorMessages, ...props.messages ?? {} }
                // @ts-ignore
                each(keyErrors(), (key: string) => result.push(_errorMessages[key] || null))
                return `<ul class="_custom-errors mt-1">${result.map(item => `<li>${item}</li>`).join("")}</ul>`
            })
            const xIcon = computed(() => {
                if (typeof props.icon === "string")
                    return {
                        type  : props.iconType ?? "fa",
                        icon  : props.icon,
                        weight: props.iconWeight ?? "light",
                        size  : "1x"
                    }
                else return props.icon
            })

            return {
                //// computed
                hasError,
                errorMessages: messages,
                xIcon,

                //// methods
                hasSlot,
                onUpdateValue(event: any) {
                    emit("update:modelValue", event)
                    emit("input", event)
                }
            }
        },

    })
</script>

<style lang="scss">
    ._custom-form-group {
        &:not(.has-own-slot) {
            margin-top: 8px;
            margin-bottom: 20px;
        }

        ._custom-form-control:focus:not(.invalid) {
            border-color: var(--form-control-active, lightblue) !important;
        }

        &.ssf-checkbox-group label, .ssf-checkbox-switch label {
            margin-bottom: 0 !important;
        }

        .label-required:after {
            content: '*';
            color: var(--color-danger);
        }
    }

    ._custom-errors {
        padding-left: 0 !important;
        color: var(--color-danger);
        font-size: 80% !important;
    }

    ._custom-form-group ._custom-form-control,
    ._custom-form-group ._custom-form-control:active,
    ._custom-form-group ._custom-form-control:focus,
    ._custom-form-group ._custom-form-control:hover {
        &:not([type=checkbox]) {
            //border-top: none !important;
            //border-left: none !important;
            //border-right: none !important;
        }

        border-radius: var(--form-radius, 0) !important;
        //padding-left: 0 !important;
    }

    .form-control.is-valid {
        border-color: var(--color-success);
    }

    ._custom-form-group ._custom-form-control.invalid {
        border-color: var(--color-danger) !important;
    }


    .help-item {
        position: absolute;
        top: 0;
        right: 20px;
        bottom: calc(var(--help-item-bottom, 0) + 10px);
        height: 15px;
        width: 15px;
        margin-top: auto;
        margin-bottom: auto;

        .help-text-info {
            color: var(--color-info);
        }

        .help-content {
            position: absolute;
            top: -62px;
            left: -67.5px;
            right: -67.5px;
            width: 150px;
            height: 55px;
            background: rgba(0, 0, 0, .6);

            &:before {
                top: 100%;
                left: 50%;
                border: solid transparent;
                content: " ";
                height: 0;
                width: 0;
                position: absolute;
                pointer-events: none;
            }

            &:before {
                border-color: rgba(194, 225, 245, 0);
                border-top-color: rgba(0, 0, 0, .6);
                border-width: 5px;
                margin-left: -5px;
            }

        }
    }
</style>
