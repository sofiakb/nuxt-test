<template>
    <div class="ssf-input-container ssf-form-file">

        <slot v-if="hasSlot('label')" name="label"/>

        <ssf-input-label
            v-else-if="label"
            :key="`text-label-${label}`"
            :class="{'with-preview': preview}"
            :icon="icon"
            :label="label"
            :placeholder="placeholder"
            @label-click="onLabelClick"/>


        <!-- TYPE : FILE -->
        <input v-if="showInputFile"
               :id="name"
               ref="inputComponent"
               :accept="options.accepted"
               :autocomplete="autocomplete"
               :disabled="disabled"
               :name="name"
               :placeholder="placeholder"
               :required="required"
               class="ssf-form-control"
               type="file"
               @focusin="focused = true"
               @focusout="focused = false"
               @input="onFileSelected"
        >
        <!--               @input="onInput()" -->


        <div :class="{'ssf-file-custom': hasSlot('selector'), 'ssf-form-control': !hasSlot('selector')}"
             class="ssf-file-selector"
             @click="onSelectorClick">

            <slot v-if="hasSlot('file-info')" name="file-info"/>

            <div v-else-if="file" class="file-info">
                {{ file.name }}&nbsp;<span class="file-size">({{ humanizeSize(file.size) }})</span>
            </div>

            <slot v-if="hasSlot('selector')" name="selector"/>

            <div v-else class="selector">
                <span>Choisir un fichier...</span>
            </div>

            <slot v-if="hasSlot('delete-file')" name="delete-file" @click.stop="onInput(true)"/>

            <div v-else class="delete-file" @click.stop="onInput(true)"></div>

        </div>

        <div v-if="preview" class="file-preview">
            <img v-if="url" :alt="url" :src="url"/>
        </div>


    </div>
</template>

<script lang="ts">
    import SsfInputLabel from "../input-label.vue";

    import { mimes }                                                                         from "../../utils/config/file";
    import { hasSlot as MainHasSlot }                                                        from "../../../../utils";
    import { defineComponent, getCurrentInstance, nextTick, PropType, reactive, ref, watch } from "vue";
    import IconProperties
                                                                                             from "../../utils/icon-properties";
    import Nullable
                                                                                             from "../../../../types/nullable";

    const config = { mimes }

    export default defineComponent({
        name: "ssf-input-file",

        components: { SsfInputLabel },

        props: {

            /* CONTAINERS */
            // inputClass: { type: [ String, Object ], required: true, default: "" },

            /* COMMONS */
            name      : { type: String, required: true },
            label     : { type: [ String ], required: true },
            modelValue: { required: true, default: null },
            required  : { type: Boolean, required: true, default: false },

            /* INPUT */
            disabled    : { type: Boolean, required: true, default: false },
            placeholder : { type: String as PropType<string | undefined>, required: false },
            autocomplete: { type: String as PropType<string | undefined>, required: true },

            /* FILE */
            preview: { type: Boolean, required: true, default: false },
            mimes  : {
                type    : String,
                required: true,
                default : "pdf, csv, text, gif, jpeg, png, icon",
                // validator: (mime) => typeof mime === 'undefined' || mime === '*' || mime.trim() === '' || keys(mimes).includes(mime)
            },

            fileAccepted: { type: String, required: true, default: "*" },

            /* ICONS */
            icon: { type: [ String, Object ] as PropType<string | IconProperties>, required: true, default: null },
        },

        emits: [ "focus", "change", "input", "error" ],

        setup(props, { emit }) {

            const focused = ref(false)
            const inputComponent = ref<Nullable<HTMLInputElement>>(null)
            const file = ref<any>(null)
            const options = reactive<any>({
                mimes   : null,
                accepted: null,
            })

            const url = ref<any>(null)
            const showInputFile = ref(true)

            const hasSlot = (name = "default") => {
                // @ts-ignore
                const ctx = getCurrentInstance()
                return ctx ? MainHasSlot(ctx, name) : null;
            }

            const initMimes = () => {
                const mimes = (props.fileAccepted === "*" ? "*" : props.mimes).split(", ");
                options.mimes = {};
                // @ts-ignore
                mimes.forEach((mime) => options.mimes[mime] = config.mimes[mime] ?? mime)
            }
            const initFileAccepted = () => {
                initMimes()
                const accepted = props.fileAccepted.split(", "), result = Object.values(options.mimes);
                // options.accepted = "";
                accepted.forEach((mime) => result.push(mime))
                options.accepted = result.join(",")
            }

            watch(() => props.mimes, () => initMimes(), { immediate: true })
            watch(() => props.fileAccepted, () => initFileAccepted(), { immediate: true })

            watch(() => props.modelValue, () => {
                showInputFile.value = false
                if (!props.modelValue)
                    file.value = null
                setTimeout(() => showInputFile.value = true, 50)
            }, { immediate: true })

            const checkMimeType = (mime: Nullable<string>) => mime && options.mimes
                ? Object.keys(options.mimes).find(key => Array.isArray(options.mimes[key]) ? options.mimes[key].includes(mime) : options.mimes[key] === mime)
                    ? true
                    : true
                : false

            const checkFile = (file: Nullable<File>) => file === null ? false : checkMimeType(file.type)

            const humanizeSize = (size: number) => {
                if (size / 1000 < 1000)
                    return Number((size / 1000).toFixed(1)) + " Ko";
                if (size / 1000 / 1000 < 1000)
                    return Number((size / 1000 / 1000).toFixed(1)) + " Mo";
                return Number((size / 1000 / 1000 / 1000).toFixed(1)) + " Go"
            }

            const onLabelClick = () => {
                nextTick(() => inputComponent.value?.focus())
            }

            const onSelectorClick = () => {
                nextTick(() => inputComponent.value?.click())
            }

            const onFileSelected = ($event: any) => {
                // @ts-ignore
                const event = $event || window.event, target: any = event.target ?? event.dataTransfer
                const _file = target && target.files ? target.files[0] ?? null : null;
                url.value = URL.createObjectURL(_file);
                if (checkFile(_file)) {
                    file.value = _file
                    onInput()
                } else {
                    return emit("error")
                }
            }

            const onInput = (deleteFile = false) => {
                if (deleteFile) {
                    showInputFile.value = false
                    file.value = null
                    url.value = null
                    setTimeout(() => showInputFile.value = true, 50)
                    return emit("input", file.value)
                } else
                    return emit("input", file.value ? {
                        name     : file.value.name,
                        size     : file.value.size,
                        humanSize: humanizeSize(file.value.size),
                        type     : file.value.type,
                        data     : file.value
                    } : file.value)
            }

            return {
                focused,
                file,
                options,
                url,
                showInputFile,

                inputComponent,

                hasSlot,

                // hasSlots: computed(() => hasSlot("selector") && hasSlot("file-info") && hasSlot("delete-file")),

                humanizeSize,
                onLabelClick,
                onSelectorClick,
                onFileSelected,
                onInput,
            }
        },
    })
</script>

<style lang="scss" scoped>
    .ssf-form-file {
        input[type=file].ssf-form-control {
            display: none;
        }

        .file-preview {
            padding-top: 15px;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                max-width: 100%;
                max-height: 200px;
            }
        }

        .ssf__input-label.with-preview:not(.active) {
            height: inherit !important;
            bottom: 15px;
        }

        .ssf-form-control.ssf-file-selector:not(.ssf-file-custom) {
            position: relative;
            cursor: pointer;

            .file-info {
                .file-size {
                    font-size: small;
                    font-style: italic;
                    color: #dddddd;
                }
            }

            .selector, .delete-file {
                position: absolute;
                top: 0;
                bottom: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: auto;
                margin-bottom: auto;
            }

            .selector {
                right: 0;
                width: 150px;
                color: #FFFFFF;
                border-top-right-radius: var(--form-radius);
                border-bottom-right-radius: var(--form-radius);
                background: #0f0f0f;
                font-style: italic;
            }

            .delete-file {
                right: 155px;
                width: 20px;
                height: 20px;

                &:before,
                &:after {
                    content: '';
                    position: absolute;
                    height: 10px;
                    width: 2px;
                    background: #0f0f0f;
                }

                &:before {
                    transform: rotate(45deg);
                }

                &:after {
                    transform: rotate(-45deg);
                }

                &:hover {
                    &:before, &:after {
                        background: #d6534c;
                    }
                }

            }
        }

    }
</style>
