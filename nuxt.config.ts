// https://nuxt.com/docs/api/configuration/nuxt-config

import { NuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
    runtimeConfig: {
        test: "test",
        public: {
            key: "public value"
        }
    },
    alias: {
        "~sofiakb/vue3-element": "./vendor/sofiakb/vue3-element"
    },
    plugins: [
        '~/plugins/sofiakb/vue3-element'
    ],
} as NuxtConfig )
