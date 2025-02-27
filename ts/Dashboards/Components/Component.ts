/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Board from '../Board';
import type Cell from '../Layout/Cell';
import type { ComponentConnectorOptions } from './ComponentOptions';
import type {
    ComponentType,
    ComponentTypeRegistry
} from './ComponentType';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type JSON from '../JSON';
import type Serializable from '../Serializable';
import type DataModifier from '../../Data/Modifiers/DataModifier';
import type TextOptions from './TextOptions';
import type Row from '../Layout/Row';
import type SidebarPopup from '../EditMode/SidebarPopup';

import CallbackRegistry from '../CallbackRegistry.js';
import ComponentGroup from './ComponentGroup.js';
import DataConnector from '../../Data/Connectors/DataConnector.js';
import DataTable from '../../Data/DataTable.js';
import EditableOptions from './EditableOptions.js';
import Sync from './Sync/Sync.js';

import Globals from '../Globals.js';
const { classNamePrefix } = Globals;

import U from '../../Core/Utilities.js';
const {
    createElement,
    isArray,
    merge,
    fireEvent,
    addEvent,
    objectEach,
    isFunction,
    isObject,
    getStyle,
    diffObjects
} = U;

import CU from './ComponentUtilities.js';
const {
    getMargins,
    getPaddings
} = CU;

import DU from '../Utilities.js';
const { uniqueKey } = DU;

/* *
 *
 *  Class
 *
 * */

/**
 *
 * Abstract Class of component.
 *
 * @internal
 *
 */

/**
 * Abstract Class of component.
 * @internal
 */
abstract class Component {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     *
     * Creates HTML text element like header or title
     *
     * @param tagName
     * HTML tag name used as wrapper of text like `h2` or `p`.
     * @param elementName
     * Name of element
     * @param textOptions
     * The options for the component
     * @returns
     * HTML object when title is created, otherwise undefined
     *
     * @internal
     */
    public static createTextElement(
        tagName: string,
        elementName: string,
        textOptions: Component.TextOptionsType
    ): HTMLElement | undefined {
        if (typeof textOptions === 'object') {
            const { className, text, style } = textOptions;
            return createElement(
                tagName,
                {
                    className: className || `${classNamePrefix}component-${elementName}`,
                    textContent: text
                },
                style
            );
        }

        if (typeof textOptions === 'string') {
            return createElement(
                tagName,
                {
                    className: `${classNamePrefix}component-${elementName}`,
                    textContent: textOptions
                },
                {}
            );
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public static Sync = Sync;
    /**
     * Default options of the component.
     */
    public static defaultOptions: Partial<Component.Options> = {
        className: `${classNamePrefix}component`,
        id: '',
        title: false,
        caption: false,
        sync: Sync.defaultHandlers,
        editableOptions: [{
            name: 'connectorName',
            propertyPath: ['connector', 'id'],
            type: 'select'
        }, {
            name: 'title',
            propertyPath: ['title'],
            type: 'input'
        }, {
            name: 'caption',
            propertyPath: ['caption'],
            type: 'input'
        }]
    };
    /**
     * The HTML element or id of HTML element that is used for appending
     * a component.
     *
     * @internal
     */
    public parentElement: HTMLElement;
    /**
     * Instance of cell, where component is attached.
     *
     * @internal
     */
    public cell: Cell;
    /**
     * Default sync Handlers.
     */
    public static syncHandlers: Sync.OptionsRecord = {};
    /**
     * Connector that allows you to load data via URL or from a local source.
     */
    public connector?: Component.ConnectorTypes;
    /**
     * The id of the connector in the data pool to use.
     */
    protected connectorId?: string;
    /**
     * @internal
     * The board the component belongs to
     * */
    public board: Board;
    /**
     * Size of the component (width and height).
     */
    protected dimensions: { width: number | null; height: number | null };
    /**
     * The HTML element where the component is.
     *
     * @internal
     */
    public element: HTMLElement;
    /**
     * The HTML element where the title is.
     */
    public titleElement?: HTMLElement;
    /**
     * The HTML element where the caption is.
     */
    public captionElement?: HTMLElement;
    /**
     * The HTML element where the component's content is.
     *
     * @internal
     */
    public contentElement: HTMLElement;
    /**
     * The options for the component.
     * */
    public options: Component.Options;
    /**
     * Sets an ID for the component's `div`.
     */
    public id: string;
    /**
     * An array of options marked as editable by the UI.
     *
     */
    public editableOptions: EditableOptions;
    /**
     * Registry of callbacks registered on the component. Used in the Highcharts
     * component to keep track of chart events.
     *
     * @internal
     */
    public callbackRegistry = new CallbackRegistry();
    /**
     * The interval for rendering the component on data changes.
     * @internal
     */
    private tableEventTimeout?: number;
    /**
     * Event listeners tied to the current DataTable. Used for rerendering the
     * component on data changes.
     *
     * @internal
     */
    private tableEvents: Function[] = [];
    /**
     * Event listeners tied to the parent cell. Used for rendering/resizing the
     * component on interactions.
     *
     * @internal
     */
    private cellListeners: Function[] = [];

    /**
     * Reference to ResizeObserver, which allows running 'unobserve'.
     * @internal
     */
    private resizeObserver?: ResizeObserver;

    /**
     * @internal
     */
    protected syncHandlers?: Sync.OptionsRecord;

    /**
     * DataModifier that is applied on top of modifiers set on the DataStore.
     *
     * @internal
     */
    public presentationModifier?: DataModifier;
    /**
     * The table being presented, either a result of the above or a way to
     * modify the table via events.
     *
     * @internal
     */
    public presentationTable?: DataTable;

    /**
     * The active group of the component. Used for sync.
     *
     * @internal
     */
    public activeGroup: ComponentGroup | undefined;

    /** @internal */
    public abstract sync: Sync;

    /**
     * Timeouts for calls to `Component.resizeTo()`.
     *
     * @internal
    /* *
     */
    protected resizeTimeouts: number[] = [];

    /**
     * Timeouts for resizing the content. I.e. `chart.setSize()`.
     *
     * @internal
     * */
    protected innerResizeTimeouts: number[] = [];

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Creates a component in the cell.
     *
     * @param cell
     * Instance of cell, where component is attached.
     *
     * @param options
     * The options for the component.
     */
    constructor(
        cell: Cell,
        options: Partial<Component.Options>,
        board?: Board
    ) {
        const renderTo = options.renderTo || options.cell;
        this.board = board || cell?.row?.layout?.board || {};
        this.parentElement =
            cell?.container || document.querySelector('#' + renderTo);
        this.cell = cell;

        this.options = merge(
            Component.defaultOptions as Required<Component.Options>,
            options
        );

        this.id = this.options.id && this.options.id.length ?
            this.options.id :
            uniqueKey();

        this.editableOptions =
            new EditableOptions(this, options.editableOptionsBindings);

        this.presentationModifier = this.options.presentationModifier;

        this.dimensions = {
            width: null,
            height: null
        };

        this.element = createElement(
            'div',
            {
                className: this.options.className
            },
            {},
            this.parentElement
        );

        if (!Number(getStyle(this.element, 'padding'))) {
            // Fix flex problem, because of wrong height in internal elements
            this.element.style.padding = '0.1px';
        }

        this.contentElement = createElement(
            'div', {
                className: `${this.options.className}-content`
            },
            {},
            this.element,
            true
        );

        this.filterAndAssignSyncOptions();
        this.setupEventListeners();

        if (cell) {
            this.attachCellListeners();

            this.on('tableChanged', (): void => {
                this.onTableChanged();
            });

            this.on('update', (): void => {
                this.cell.setLoadingState();
            });

            this.on('afterRender', (): void => {
                this.cell.setLoadingState(false);
            });
        }
    }

    /**
     * Function fired when component's `tableChanged` event is fired.
     * @internal
     */
    public abstract onTableChanged(e?: Component.EventTypes): void;


    /**
     * Returns the component's options when it is dropped from the sidebar.
     *
     * @param sidebar
     * The sidebar popup.
     */
    public getOptionsOnDrop(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sidebar: SidebarPopup
    ): Partial<ComponentType['options']> {
        return {};
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Inits connectors for the component and rerenders it.
     *
     * @returns
     * Promise resolving to the component.
     */
    public async initConnector(): Promise<this> {
        const connectorId = this.options.connector?.id,
            dataPool = this.board.dataPool;

        if (
            connectorId &&
            (
                this.connectorId !== connectorId ||
                dataPool.isNewConnector(connectorId)
            )
        ) {
            this.cell?.setLoadingState();

            const connector = await dataPool.getConnector(connectorId);
            this.setConnector(connector);
        }

        return this;
    }

    /**
    * Filter the sync options that are declared in the component options.
    * Assigns the sync options to the component and to the sync instance.
    *
    * @param defaultHandlers
    * Sync handlers on component.
    *
    * @internal
    */
    protected filterAndAssignSyncOptions(
        defaultHandlers: typeof Sync.defaultHandlers = (
            this.constructor as typeof Component
        ).syncHandlers
    ): void {
        const sync = this.options.sync || {};
        const syncHandlers = Object.keys(sync).reduce((
            carry: Sync.OptionsRecord,
            handlerName
        ): Sync.OptionsRecord => {
            if (handlerName) {
                const defaultHandler = defaultHandlers[handlerName];
                const defaultOptions = Sync.defaultSyncOptions[handlerName];
                const handler = sync[handlerName];

                // Make it always an object
                carry[handlerName] = merge(
                    defaultOptions || {},
                    { enabled: isObject(handler) ? handler.enabled : handler },
                    isObject(handler) ? handler : {}
                );

                // Set emitter and handler default functions
                if (defaultHandler && carry[handlerName].enabled) {
                    const keys: (keyof Sync.OptionsEntry)[] = [
                        'emitter', 'handler'
                    ];

                    for (const key of keys) {
                        if (
                            carry[handlerName][key] === true ||
                            carry[handlerName][key] === void 0
                        ) {
                            carry[handlerName][key] =
                                defaultHandler[key] as any;
                        }
                    }
                }
            }

            return carry;
        }, {});

        this.sync ? this.sync.syncConfig = syncHandlers : void 0;
        this.syncHandlers = syncHandlers;
    }

    /**
     * Setup listeners on cell/other things up the chain
     *
     * @internal
     */
    private attachCellListeners(): void {
        // Remove old listeners
        while (this.cellListeners.length) {
            const destroy = this.cellListeners.pop();
            if (destroy) {
                destroy();
            }
        }

        if (this.cell && Object.keys(this.cell).length) {
            const board = this.cell.row.layout.board;
            this.cellListeners.push(
                // Listen for resize on dashboard
                addEvent(board, 'cellResize', (): void => {
                    this.resizeTo(this.parentElement);
                }),
                // Listen for changed parent
                addEvent(
                    this.cell.row,
                    'cellChange',
                    (e: { row: Row }): void => {
                        const { row } = e;
                        if (row && this.cell) {
                            const hasLeftTheRow =
                                row.getCellIndex(this.cell) === void 0;
                            if (hasLeftTheRow) {
                                if (this.cell) {
                                    this.setCell(this.cell);
                                }
                            }
                        }
                    }
                )
            );

        }
    }

    /**
     * Set a parent cell.
     * @param cell
     * Instance of a cell.
     * @param resize
     * Flag that allow to resize the component.
     *
     * @internal
     */
    public setCell(cell: Cell, resize = false): void {
        this.cell = cell;
        if (cell.container) {
            this.parentElement = cell.container;
        }
        this.attachCellListeners();
        if (resize) {
            this.resizeTo(this.parentElement);
        }
    }

    /**
     * Adds event listeners to data table.
     * @param table
     * Data table that is source of data.
     * @internal
     */
    private setupTableListeners(table: DataTable): void {
        const connector = this.connector;

        if (connector) {
            if (table) {
                [
                    'afterDeleteColumns',
                    'afterDeleteRows',
                    'afterSetCell',
                    'afterSetConnector',
                    'afterSetColumns',
                    'afterSetRows'
                ].forEach((event: any): void => {
                    this.tableEvents.push((table)
                        .on(event, (e: any): void => {
                            clearTimeout(this.tableEventTimeout);
                            this.tableEventTimeout = Globals.win.setTimeout(
                                (): void => {
                                    this.emit({
                                        ...e,
                                        type: 'tableChanged'
                                    });
                                    this.tableEventTimeout = void 0;
                                });
                        }));
                });
            }

            this.tableEvents.push(connector.on('afterLoad', (): void => {
                clearTimeout(this.tableEventTimeout);
                this.tableEventTimeout = Globals.win.setTimeout(
                    (): void => {
                        this.emit({
                            target: this,
                            type: 'tableChanged'
                        });

                        this.tableEventTimeout = void 0;
                    });
            }));
        }
    }

    /**
     * Remove event listeners in data table.
     * @internal
     */
    private clearTableListeners(): void {
        const connector = this.connector,
            tableEvents = this.tableEvents;

        if (tableEvents.length) {
            for (let i = 0, iEnd = tableEvents.length; i < iEnd; i++) {
                tableEvents[i]();
            }
            tableEvents.length = 0;
        }

        if (connector) {
            tableEvents.push(connector.table.on(
                'afterSetModifier',
                (e): void => {
                    if (e.type === 'afterSetModifier') {
                        clearTimeout(this.tableEventTimeout);
                        this.tableEventTimeout = Globals.win.setTimeout(
                            (): void => {
                                this.emit({
                                    ...e,
                                    type: 'tableChanged'
                                });
                                this.tableEventTimeout = void 0;
                            });

                    }
                }
            ));
        }
    }

    /**
     * Attaches data store to the component.
     * @param connector
     * Connector of data.
     *
     * @returns
     * Component which can be used in chaining.
     *
     * @internal
     */
    public setConnector(connector: Component.ConnectorTypes | undefined): this {

        fireEvent(this, 'setConnector', { connector });

        // Clean up old event listeners
        while (this.tableEvents.length) {
            const eventCallback = this.tableEvents.pop();
            if (typeof eventCallback === 'function') {
                eventCallback();
            }
        }

        this.connector = connector;

        if (connector) {
            // Set up event listeners
            this.clearTableListeners();
            this.setupTableListeners(connector.table);

            // Re-setup if modifier changes
            connector.table.on(
                'setModifier',
                (): void => this.clearTableListeners()
            );
            connector.table.on(
                'afterSetModifier',
                (e: DataTable.SetModifierEvent): void => {
                    if (e.type === 'afterSetModifier' && e.modified) {
                        this.setupTableListeners(e.modified);
                    }
                }
            );


            // Add the component to a group based on the
            // connector table id by default
            // TODO: make this configurable
            const tableID = connector.table.id;

            if (!ComponentGroup.getComponentGroup(tableID)) {
                ComponentGroup.addComponentGroup(new ComponentGroup(tableID));
            }

            const group = ComponentGroup.getComponentGroup(tableID);
            if (group) {
                group.addComponents([this.id]);
                this.activeGroup = group;
            }
        }

        fireEvent(this, 'afterSetConnector', { connector });

        return this;
    }

    /** @internal */
    setActiveGroup(group: ComponentGroup | string | null): void {
        if (typeof group === 'string') {
            group = ComponentGroup.getComponentGroup(group) || null;
        }
        if (group instanceof ComponentGroup) {
            this.activeGroup = group;
        }
        if (group === null) {
            this.activeGroup = void 0;
        }
        if (this.activeGroup) {
            this.activeGroup.addComponents([this.id]);
        }
    }
    /**
     * Gets height of the component's content.
     *
     * @returns
     * Current height as number.
     * @internal
     */
    private getContentHeight(): number {
        const titleHeight = this.titleElement ?
            this.titleElement.clientHeight + getMargins(this.titleElement).y :
            0;
        const captionHeight = this.captionElement ?
            this.captionElement.clientHeight +
            getMargins(this.captionElement).y :
            0;

        return titleHeight + captionHeight;
    }

    /**
     * Resize the component
     * @param width
     * The width to set the component to.
     * Can be pixels, a percentage string or null.
     * Null will unset the style
     * @param height
     * The height to set the component to.
     * Can be pixels, a percentage string or null.
     * Null will unset the style.
     */
    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): void {
        if (height) {
            // Get offset for border, padding
            const pad =
                getPaddings(this.element).y + getMargins(this.element).y;
            this.element.style.height = 'calc(100% - ' + pad + 'px)';
            this.contentElement.style.height =
                'calc(100% - ' + this.getContentHeight() + 'px)';
        } else if (height === null) {
            this.dimensions.height = null;
            this.element.style.removeProperty('height');
        }

        fireEvent(this, 'resize', {
            width,
            height
        });
    }

    /**
     * Adjusts size of component to parent's cell size when animation is done.
     * @param element
     * HTML element that is resized.
     */
    public resizeTo(element: HTMLElement): void {
        while (this.resizeTimeouts.length) {
            const timeout = this.resizeTimeouts.pop();
            if (timeout) {
                cancelAnimationFrame(timeout);
            }
        }
        const timeoutID = requestAnimationFrame((): void => {
            const { width, height } = element.getBoundingClientRect();
            const padding = getPaddings(element);
            const margins = getMargins(element);
            this.resize(
                width - padding.x - margins.x,
                height - padding.y - margins.y
            );
        });

        this.resizeTimeouts.push(timeoutID);
    }

    /**
     * Handles updating via options.
     * @param newOptions
     * The options to apply.
     *
     * @param shouldRerender
     * Set to true if the update should rerender the component.
     */
    public async update(
        newOptions: Partial<Component.Options>,
        shouldRerender: boolean = true
    ): Promise<void> {
        const eventObject = {
            options: newOptions,
            shouldForceRerender: false
        };

        // Update options
        fireEvent(this, 'update', eventObject);

        this.options = merge(this.options, newOptions);

        if (
            this.options.connector?.id &&
            this.connectorId !== this.options.connector.id
        ) {
            const connector = await this.board.dataPool
                .getConnector(this.options.connector.id);

            this.setConnector(connector);
        }

        this.options = merge(this.options, newOptions);

        if (shouldRerender || eventObject.shouldForceRerender) {
            this.render();
        }
    }

    /**
     * Private method which sets up event listeners for the component.
     *
     * @internal
     */
    private setupEventListeners(): void {
        const events = this.options.events;

        if (events) {
            Object.keys(events).forEach((key): void => {
                const eventCallback = (events as any)[key];

                if (eventCallback) {
                    this.callbackRegistry.addCallback(key, {
                        type: 'component',
                        func: eventCallback
                    });
                }
            });
            objectEach(events, (eventCallback, eventType): void => {
                if (isFunction(eventCallback)) {
                    this.on(eventType as any, eventCallback as any);
                }
            });
        }
        const resizeObserverCallback = (): void => {
            this.resizeTo(this.parentElement);
        };

        if (typeof ResizeObserver === 'function') {
            this.resizeObserver = new ResizeObserver(resizeObserverCallback);
            this.resizeObserver.observe(this.element);
        } else {
            const unbind = addEvent(window, 'resize', resizeObserverCallback);
            addEvent(this, 'destroy', unbind);
        }
    }

    /**
     * Adds title at the top of component's container.
     *
     * @param titleOptions
     * The options for the title.
     */
    public setTitle(titleOptions: Component.TextOptionsType): void {
        const titleElement = this.titleElement,
            shouldExist =
                titleOptions &&
                (typeof titleOptions === 'string' || titleOptions.text);

        if (shouldExist) {
            const newTitle = Component.createTextElement(
                'h2',
                'title',
                titleOptions
            );

            if (newTitle) {
                if (!titleElement) {
                    this.element.insertBefore(
                        newTitle,
                        this.element.firstChild
                    );
                } else {
                    titleElement.replaceWith(newTitle);
                }
                this.titleElement = newTitle;
            }
        } else {
            if (titleElement) {
                titleElement.remove();
                delete this.titleElement;

                return;
            }
        }
    }

    /**
     * Adds caption at the bottom of component's container.
     *
     * @param captionOptions
     * The options for the caption.
     */
    public setCaption(captionOptions: Component.TextOptionsType): void {
        const captionElement = this.captionElement,
            shouldExist =
                captionOptions &&
                (typeof captionOptions === 'string' || captionOptions.text);

        if (shouldExist) {
            const newCaption = Component.createTextElement(
                'div',
                'caption',
                captionOptions
            );

            if (newCaption) {
                if (!captionElement) {
                    this.element.appendChild(newCaption);
                } else {
                    captionElement.replaceWith(newCaption);
                }
                this.captionElement = newCaption;
            }
        } else {
            if (captionElement) {
                captionElement.remove();
                delete this.captionElement;

                return;
            }
        }
    }

    /**
     * Handles setting things up on initial render.
     *
     * @returns
     * The component for chaining.
     *
     * @internal
     */
    public async load(): Promise<this> {

        await this.initConnector();
        this.render();

        return this;
    }

    /**
     * Renders the component.
     *
     * @returns
     * The component for chaining.
     *
     * @internal
     */
    public render(): this {
        this.emit({ type: 'render' });
        this.setTitle(this.options.title);
        this.setCaption(this.options.caption);
        this.resizeTo(this.parentElement);

        return this;
    }

    /**
     * Destroys the component.
     */
    public destroy(): void {
        /**
         * TODO: Should perhaps set an `isActive` flag to false.
         */

        this.sync.stop();

        while (this.element.firstChild) {
            this.element.firstChild.remove();
        }

        // Call unmount
        fireEvent(this, 'unmount');

        // Unregister events
        this.tableEvents.forEach((eventCallback): void => eventCallback());
        this.element.remove();
    }

    /** @internal */
    public on<TEvent extends Component.EventTypes>(
        type: TEvent['type'],
        callback: (this: this, e: TEvent) => void
    ): Function {
        return addEvent(this, type, callback);
    }

    /** @internal */
    public emit<TEvent extends Component.EventTypes>(
        e: TEvent
    ): void {
        if (!e.target) {
            e.target = this;
        }
        fireEvent(this, e.type, e);
    }

    /**
     * Converts the class instance to a class JSON.
     * @internal
     *
     * @returns
     * Class JSON of this Component instance.
     *
     * @internal
     */
    public toJSON(): Component.JSON {
        const dimensions: Record<'width' | 'height', number> = {
            width: 0,
            height: 0
        };
        objectEach(this.dimensions, function (value, key): void {
            if (value === null) {
                return;
            }
            dimensions[key] = value;
        });

        const json: Component.JSON = {
            $class: this.options.type,
            options: {
                renderTo: this.options.renderTo,
                parentElement: this.parentElement.id,
                dimensions,
                id: this.id,
                type: this.type
            }
        };

        return json;
    }

    /**
     * Get the component's options.
     * @returns
     * The JSON of component's options.
     *
     * @internal
     *
     */
    public getOptions(): Partial<Component.Options> {
        return diffObjects(this.options, Component.defaultOptions);
    }

    public getEditableOptions(): Component.Options {
        const component = this;
        return merge(component.options);
    }


    public getEditableOptionValue(
        propertyPath?: string[]
    ): number | boolean | undefined | string {
        const component = this;
        if (!propertyPath) {
            return;
        }

        let result = component.getEditableOptions() as any;

        for (let i = 0, end = propertyPath.length; i < end; i++) {
            if (isArray(result)) {
                result = result[0];
            }

            if (!result) {
                return;
            }

            result = result[propertyPath[i]];
        }

        return result;
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface Component {
    type: keyof ComponentTypeRegistry;
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace Component {

    /* *
    *
    *  Declarations
    *
    * */
    /** @internal */
    export interface JSON extends Serializable.JSON<string> {
        options: ComponentOptionsJSON;
    }

    /**
     * The basic events
     */
    /** @internal */
    export type EventTypes =
        SetConnectorEvent |
        ResizeEvent |
        UpdateEvent |
        TableChangedEvent |
        LoadEvent |
        RenderEvent |
        JSONEvent |
        PresentationModifierEvent;

    export type SetConnectorEvent =
        Event<'setConnector'|'afterSetConnector', {}>;

    /** @internal */
    export type ResizeEvent = Event<'resize', {
        readonly type: 'resize';
        width?: number;
        height?: number;
    }>;

    /** @internal */
    export type UpdateEvent = Event<'update' | 'afterUpdate', {
        options?: Options;
    }>;

    /** @internal */
    export type LoadEvent = Event<'load' | 'afterLoad', {}>;
    /** @internal */
    export type RenderEvent = Event<'render' | 'afterRender', {}>;

    /** @internal */
    export type JSONEvent = Event<'toJSON' | 'fromJSON', {
        json: Serializable.JSON<string>;
    }>;
    /** @internal */
    export type TableChangedEvent = Event<'tableChanged', {}>;
    /** @internal */
    export type PresentationModifierEvent =
        Component.Event<'afterPresentationModifier', { table: DataTable }>;

    /** @internal */
    export type Event<
        EventType extends string,
        EventRecord extends Record<string, any>> = {
            readonly type: EventType;
            target?: Component;
            detail?: Globals.AnyRecord;
        } & EventRecord;

    export interface Options {

        /**
         * Cell id, where component is attached.
         * Deprecated, use `renderTo` instead.
         *
         * @deprecated
         */
        cell?: string;

        /**
         * Cell id, where component is attached.
         */
        renderTo?: string;

        /**
         * The name of class that is applied to the component's container.
         */
        className?: string;

        /**
         * The type of component like: `HTML`, `KPI`, `Highcharts`, `DataGrid`,
         * `Navigator`.
         */
        type: keyof ComponentTypeRegistry;

        /**
         * Allow overwriting gui elements.
         * @internal
         */
        navigationBindings?: Array<Globals.AnyRecord>;
        /**
         * Events attached to the component : `mount`, `unmount`, `resize`, `update`.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/events/ | Mount event }
         */
        events?: Record<string, Function>;
        /**
         * Set of options that are available for editing through sidebar.
         */
        editableOptions?: Array<EditableOptions.Options>;
        /** @internal */
        editableOptionsBindings?: EditableOptions.OptionsBindings;
        /** @internal */
        presentationModifier?: DataModifier;
        /** @internal */
        sync?: Sync.RawOptionsRecord;
        /**
         * Connector options
         */
        connector?: ComponentConnectorOptions;
        /**
         * Sets an ID for the component's container.
         */
        id?: string;
        /**
         * The component's title, which will render at the top.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/title/ | Changed captions }
         */
        title?: TextOptionsType;
        /**
         * The component's caption, which will render at the bottom.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/caption/ | Changed captions }
         */
        caption?: TextOptionsType;
    }

    /**
     * JSON compatible options for export
     * @internal
     *  */
    export interface ComponentOptionsJSON extends JSON.Object {
        caption?: string;
        className?: string;
        renderTo?: string;
        editableOptions?: JSON.Array<string>;
        editableOptionsBindings?: EditableOptions.OptionsBindings&JSON.Object;
        id: string;
        parentCell?: Cell.JSON;
        parentElement?: string; // ID?
        style?: {};
        sync?: Sync.RawOptionsRecord&JSON.Object;
        title?: string;
        type: keyof ComponentTypeRegistry;
    }

    /** @internal */
    export type ConnectorTypes = DataConnector;

    /**
     * Allowed types for the text.
    */
    export type TextOptionsType = string | false | TextOptions | undefined;

}

export default Component;
