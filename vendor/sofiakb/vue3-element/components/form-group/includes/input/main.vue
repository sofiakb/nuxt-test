<template>
    <!-- TYPE : DEFAULT -->
    <ssf-input-text v-if="isDefault"
                    ref="inputComponent"
                    :autocomplete="autocomplete"
                    :disabled="disabled"
                    :icon="icon"
                    :input-class="inputClass"
                    :inputmode="inputMode"
                    :label="label"
                    :model-value="modelValue"
                    :name="name"
                    :placeholder="placeholder"
                    :required="required"
                    :type="type"
                    @change="$emit('change')"
                    @focus="$emit('focus')"
                    @input="onInput"/>

    <!-- TYPE : PASSWORD -->
    <ssf-input-password v-else-if="type === 'password'"
                        ref="inputComponent"
                        :autocomplete="autocomplete"
                        :disabled="disabled"
                        :icon="icon"
                        :input-class="inputClass"
                        :label="label"
                        :model-value="modelValue"
                        :name="name"
                        :placeholder="placeholder"
                        :required="required"
                        @change="$emit('change')"
                        @focus="$emit('focus')"
                        @input="onInput"/>

    <!-- TYPE : NUMBER -->
    <ssf-input-number v-else-if="type === 'number'"
                      ref="inputComponent"
                      :autocomplete="autocomplete"
                      :disabled="disabled"
                      :icon="icon"
                      :input-class="inputClass"
                      :inputmode="inputMode"
                      :label="label"
                      :max="max"
                      :min="min"
                      :model-value="modelValue"
                      :name="name"
                      :placeholder="placeholder"
                      :required="required"
                      :step="step"
                      :type="type"
                      @change="$emit('change')"
                      @focus="$emit('focus')"
                      @input="onInput"/>

    <!-- TYPE : CHECKBOX -->
    <ssf-input-checkbox v-else-if="type === 'checkbox'"
                        ref="inputComponent"
                        v-model="modelValue"
                        :autocomplete="autocomplete"
                        :disabled="disabled"
                        :icon="icon"
                        :input-class="inputClass"
                        :label="label"
                        :name="name"
                        :placeholder="placeholder"
                        :required="required"
                        @change="$emit('change')"
                        @focus="$emit('focus')"
                        @input="onInput"/>

    <!-- TYPE : SWITCH -->
    <ssf-input-checkbox v-else-if="type === 'switch'"
                        ref="inputComponent"
                        v-model="modelValue"
                        :autocomplete="autocomplete"
                        :disabled="disabled"
                        :icon="icon"
                        :input-class="inputClass"
                        :label="label"
                        :name="name"
                        :placeholder="placeholder"
                        :required="required"
                        switcher
                        @change="$emit('change')"
                        @focus="$emit('focus')"
                        @input="onInput"/>

    <!-- TYPE : RADIO -->
    <ssf-input-radio v-else-if="type === 'radio'"
                     ref="inputComponent"
                     :disabled="disabled"
                     :field="field"
                     :icon="icon"
                     :inline="inline"
                     :items="items"
                     :label="label"
                     :model-value="modelValue"
                     :name="name"
                     :required="required"
                     @change="$emit('change')"
                     @focus="$emit('focus')"
                     @input="onInput"/>

    <!-- TYPE : DATE -->
    <ssf-input-date v-else-if="type === 'date'"
                    ref="inputComponent"
                    @change="$emit('change')"
                    @focus="$emit('focus')"
                    @input="onInput"/>

    <!-- TYPE : TIME -->
    <ssf-input-time v-else-if="type === 'time'"
                    ref="inputComponent"
                    :autocomplete="autocomplete"
                    :current-time="currentTime"
                    :disabled="disabled"
                    :default-value="defaultValue"
                    :format="timeFormat"
                    :icon="icon"
                    :inputClass="inputClass"
                    :label="label"
                    :modelValue="modelValue"
                    :name="name"
                    :placeholder="placeholder"
                    :required="required"
                    @change="$emit('change')"
                    @focus="$emit('focus')"
                    @input="onInput"/>

    <!-- TYPE : FILE -->
    <ssf-input-file v-else-if="type === 'file'"
                    ref="inputComponent"
                    :autocomplete="autocomplete"
                    :disabled="disabled"
                    :file-accepted="fileAccepted"
                    :icon="icon"
                    :input-class="inputClass"
                    :inputmode="inputMode"
                    :label="label"
                    :mimes="mimes"
                    :model-value="modelValue"
                    :name="name"
                    :placeholder="placeholder"
                    :preview="filePreview"
                    :required="required"
                    :type="type"
                    @change="$emit('change')"
                    @focus="$emit('focus')"
                    @input="onInput">
        <slot v-if="hasSlot('label')" name="label"/>
        <slot v-if="hasSlot('file-info')" name="file-info"/>
        <slot v-if="hasSlot('selector')" name="selector"/>
        <slot v-if="hasSlot('delete-file')" name="delete-file"/>
    </ssf-input-file>
</template>

<script lang="ts">
    import { computed, defineComponent, getCurrentInstance, nextTick, PropType, reactive, ref, watch } from "vue";

    import SsfInputText     from "./text.vue";
    import SsfInputPassword from "./password.vue";
    import SsfInputNumber   from "./number.vue";

    import SsfInputCheckbox from "./checkbox.vue";
    import SsfInputRadio    from "./radio.vue";

    import SsfInputDate from "./date/components/date.vue";
    import SsfInputTime from "./time/components/time.vue";

    import SsfInputFile               from "./file.vue";
    import { hasSlot as MainHasSlot } from "../../../../utils";
    import Nullable                   from "../../../../types/nullable";
    import IconProperties             from "../../utils/icon-properties";

    export default defineComponent({
        name      : "ssf-input",
        components: {
            SsfInputText,
            SsfInputPassword,
            SsfInputNumber,
            SsfInputCheckbox,
            SsfInputRadio,
            SsfInputDate,
            SsfInputTime,
            SsfInputFile,
        },

        props: {
            /* CONTAINERS */
            inputClass: { type: [ String, Object ], required: false, default: "" },

            /* COMMONS */
            name        : { type: String, required: true },
            label       : { type: String as PropType<string | undefined>, required: false },
            modelValue  : { required: false, default: null },
            required    : { type: Boolean, required: false, default: false },
            defaultValue: { required: false },

            /* INPUT */
            type        : { type: [ String, Object ], required: false, default: "text" },
            disabled    : { type: Boolean, required: false, default: false },
            placeholder : { type: String as PropType<string | undefined>, required: false },
            autocomplete: { type: String as PropType<string | undefined>, required: false },

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
            // eslint-disable-next-line vue/no-unused-properties
            dateFormat : { type: String, required: false, default: "DD/MM/YYYY" },
            // eslint-disable-next-line vue/no-unused-properties
            currentDate: { type: Boolean, required: false, default: false },

            /* TIME */
            timeFormat : { type: String, required: false, default: "HH:mm:ss" },
            currentTime: { type: Boolean, required: false, default: false },

            /* FILE */
            mimes       : { type: String, required: false, default: "pdf, csv, text, gif, jpeg, png, icon" },
            fileAccepted: { type: String, required: false, default: "*" },
            filePreview : { type: Boolean, required: false, default: false },

            /* ICONS */
            icon: { type: [ String, Object ] as PropType<string | IconProperties>, required: false, default: null },
        },

        emits: [ "focus", "change", "input" ],

        setup(props, { emit }) {

            const options = reactive({
                icon: null as Nullable<IconProperties>
            })
            const inputComponent = ref<Nullable<HTMLInputElement>>(null)

            const initIcon = () => {
                const icon: any = props.icon
                if (props.icon) {
                    options.icon = {
                        icon  : (typeof props.icon).toLowerCase() === "string" ? props.icon : (icon?.icon),
                        type  : icon?.type ?? "fa",
                        size  : icon?.size ?? "1x",
                        weight: icon?.weight
                    }
                }
            }

            watch(() => props.icon, () => initIcon(), { immediate: true })

            return {
                isDefault: computed(() => ![ "password", "checkbox", "switch", "date", "time", "number", "radio", "file" ].includes(props.type.toString())),
                inputComponent,

                hasSlot: (name = "default") => {
                    // @ts-ignore
                    const ctx = getCurrentInstance()
                    return ctx ? MainHasSlot(ctx, name) : null;
                },

                onInput: (value = null) =>
                    nextTick(() => emit("input", value === null && props.type !== "file" ? inputComponent.value?.value : value))

            }
        },
    })
</script>

<style lang="scss" scoped>
    .ssf-input-container {
        position: relative;
    }
</style>
