"use strict";

/*
 * sphere-dashboard
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 24/08/2022 at 12:17
 * File resources/components/commons/table-page/utils/index
 */

export enum TablePosition {
    LEFT,
    RIGHT,
    CENTER,
}

export enum TableSortDirection {
    UP,
    DOWN,
    NONE
}


export const TABLE_HOVERABLE = "HOVERABLE"
export const TABLE_CLICKABLE = "CLICKABLE"


export interface TableHeaderProperties {
    prop: string
    label: string
    sortable?: boolean
    position?: TablePosition
}

export class TableHeaderSort {
    direction: TableSortDirection = TableSortDirection.NONE

    isSorted(): boolean {
        return this.direction !== TableSortDirection.NONE
    }

    isUp(): boolean {
        return this.isSorted() && this.direction === TableSortDirection.UP
    }

    isDown(): boolean {
        return this.isSorted() && this.direction === TableSortDirection.DOWN
    }

    sortUp() {
        this.direction = TableSortDirection.UP
    }

    sortDown() {
        this.direction = TableSortDirection.DOWN
    }

    resetSort() {
        this.direction = TableSortDirection.NONE
    }

    sort() {
        return this.isSorted()
            ? this.isUp()
                ? this.sortDown()
                : this.resetSort()
            : this.sortUp()
    }

}

export class TableHeader {
    prop: string
    label: string
    position: TablePosition

    sortable: boolean

    tableSort: TableHeaderSort


    constructor(properties: TableHeaderProperties) {
        this.prop = properties.prop
        this.label = properties.label
        this.sortable = properties.sortable ?? false
        this.position = properties.position ?? TablePosition.LEFT

        if (this.sortable)
            this.tableSort = new TableHeaderSort()
    }

    static create(properties: TableHeaderProperties): TableHeader {
        return new TableHeader(properties)
    }

    isSorted(): boolean {
        return this.isSortable() && this.tableSort.isSorted()
    }

    isSortedUp(): boolean {
        return this.isSorted() && this.tableSort.isUp()
    }

    isSortedDown(): boolean {
        return this.isSorted() && this.tableSort.isDown()
    }

    isSortable(): boolean {
        return this.sortable
    }

    isCenter(): boolean {
        return this.position === TablePosition.CENTER
    }

    isRight(): boolean {
        return this.position === TablePosition.RIGHT
    }

    sort() {
        return this.isSortable() ? this.tableSort.sort() : null
    }
}


export interface TableColumnProperties {
    prop: string
    value: string
    clickable?: boolean
    position?: TablePosition
    classes?: string
    casts?: (value: any) => any
}

export class TableColumn {
    prop: string
    value: string
    position: TablePosition
    clickable: boolean
    classes: string
    casts?: (value: any) => any


    constructor(properties: TableColumnProperties) {
        this.prop = properties.prop
        this.value = properties.value
        this.position = properties.position ?? TablePosition.LEFT
        this.clickable = properties.clickable ?? false
        this.classes = properties.classes ?? ""
        this.casts = properties.casts
    }

    static create(properties: TableColumnProperties): TableColumn {
        return new TableColumn(properties)
    }

    isClickable(): boolean {
        return this.clickable
    }

    isCenter(): boolean {
        return this.position === TablePosition.CENTER
    }

    isRight(): boolean {
        return this.position === TablePosition.RIGHT
    }
}
