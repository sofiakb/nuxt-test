import { App, Plugin } from "vue";

import SsfButton      from "./components/button/x-button.vue"
import SsfCard        from "./components/card.vue"
import SsfCol         from "./components/col.vue"
import SsfContainer   from "./components/container.vue"
import SsfFormGroup   from "./components/form-group/index.vue"
import SsfFormInput   from "./components/form-input.vue"
import SsfIcon        from "./components/icon/icon.vue"
import SsfImage       from "./components/image.vue"
import SsfInitial     from "./components/initial/initial.vue"
import SsfLine        from "./components/line.vue"
import SsfLink        from "./components/link.vue"
import SsfLoader      from "./components/loader/loader.vue"
import SsfLogo        from "./components/logo.vue"
import SsfModal       from "./components/modal.vue"
import SsfPagination  from "./components/pagination.vue"
import SsfRouterBack  from "./components/router-back.vue"
import SsfRow         from "./components/row.vue"
import SsfShape       from "./components/shape.vue"
import SsfSection     from "./components/section.vue"
import SsfTable       from "./components/table/index.vue"
import SsfTableColumn from "./components/table/includes/column-bridge.vue"
import SsfTabs        from "./components/tab/tabs.vue"
import SsfTab         from "./components/tab/tab.vue"
import SsfText        from "./components/text.vue"
import SsfTitle       from "./components/title.vue"

export default {
    install(Vue: App) {
        Vue.component("ssf-button", SsfButton);
        Vue.component("ssf-card", SsfCard);
        Vue.component("ssf-col", SsfCol);
        Vue.component("ssf-container", SsfContainer);
        Vue.component("ssf-form-group", SsfFormGroup);
        Vue.component("ssf-form-input", SsfFormInput);
        Vue.component("ssf-icon", SsfIcon);
        Vue.component("ssf-image", SsfImage);
        Vue.component("ssf-initial", SsfInitial);
        Vue.component("ssf-line", SsfLine);
        Vue.component("ssf-link", SsfLink);
        Vue.component("ssf-loader", SsfLoader);
        Vue.component("ssf-logo", SsfLogo);
        Vue.component("ssf-modal", SsfModal);
        Vue.component("ssf-pagination", SsfPagination);
        Vue.component("ssf-router-back", SsfRouterBack);
        Vue.component("ssf-row", SsfRow);
        Vue.component("ssf-section", SsfSection);
        Vue.component("ssf-shape", SsfShape);
        Vue.component("ssf-tab", SsfTab);
        Vue.component("ssf-tabs", SsfTabs);
        Vue.component("ssf-table", SsfTable);
        Vue.component("ssf-table-column", SsfTableColumn);
        Vue.component("ssf-text", SsfText);
        Vue.component("ssf-title", SsfTitle);
    }
} as Plugin

export * from "./commons/validation"

export { jElement, jIdElement, jClassElement } from "./commons/jquery"

export { useRouteHelper, toNumberStyle } from "./utils"

export { default as FontAwesomeIcons } from "./components/icon/utils/font-awesome-icons"
