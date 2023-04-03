import { useRouter }       from "vue-router";
import { isNaN, isNumber } from "lodash";

export const hasSlot = (component: any, name = "default") => !!(component.$slots ?? component.slots)[name] //|| !!component.$scopedSlots[name];

export const useRouteHelper = () => {
    const router = useRouter()

    const routeExists = (name: string) => router && router.hasRoute(name)

    return {
        routeExists
    }
}


const _assetsSrc = (path: string) => require(`@/assets/img/${path}`)

export const staticSrc = (path: string) => `${process.env.PUBLIC_PATH ?? "/"}static/img/${path}`

export const src = (path: string, assets = true) => assets ? _assetsSrc(path) : staticSrc(path)

export const key = (item: { name: any; id: any }) => btoa(encodeURI(`${item.name || item || "name"}-${item.id || -1}`));

export const defined = (value: any, strict = true): boolean =>
    typeof value !== "undefined" && (strict ? value !== null : true);

export const toNumberStyle = (value: string | number | undefined): string | undefined => value ? (value?.toString().includes("%") ? value.toString() : (isNumber(parseInt(value.toString())) && !isNaN(parseInt(value.toString())) ? parseInt(value.toString()) + "px" : value.toString())) : undefined
