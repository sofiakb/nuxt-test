"use strict";

/*
 * nuxt3-project-default
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 01/09/2022 at 10:02
 * File plugins/sofiakb/vue-element/index
 */

import VueSofiakbElement    from "~sofiakb/vue3-element"
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.use(VueSofiakbElement);
})
