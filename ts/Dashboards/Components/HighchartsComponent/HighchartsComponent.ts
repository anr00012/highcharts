/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Gøran Slettemark
 *  - Wojciech Chmiel
 *  - Sebastian Bochan
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */


import type Board from '../../Board';
import type Cell from '../../Layout/Cell';
import type {
    AxisOptions,
    Chart,
    Options as ChartOptions,
    Highcharts as H,
    Point,
    Series,
    SeriesOptions
} from '../../Plugins/HighchartsTypes';
import type {
    ColumnAssignmentOptions,
    ConstructorType,
    Options
} from './HighchartsComponentOptions';
import type MathModifierOptions from '../../../Data/Modifiers/MathModifierOptions';
import type SidebarPopup from '../../EditMode/SidebarPopup';

import Component from '../Component.js';
import DataConnector from '../../../Data/Connectors/DataConnector.js';
import DataConverter from '../../../Data/Converters/DataConverter.js';
import DataTable from '../../../Data/DataTable.js';
import Globals from '../../Globals.js';
import HighchartsSyncHandlers from './HighchartsSyncHandlers.js';
import HighchartsComponentDefaults from './HighchartsComponentDefaults.js';
import U from '../../../Core/Utilities.js';
const {
    createElement,
    diffObjects,
    isString,
    merge,
    splat
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 *
 * Class that represents a Highcharts component.
 *
 */
class HighchartsComponent extends Component {

    /* *
     *
     *  Static properties
     *
     * */

    /** @private */
    public static charter: H;

    /** @private */
    public static syncHandlers = HighchartsSyncHandlers;

    /**
     * Default options of the Highcharts component.
     */
    public static defaultOptions = merge(
        Component.defaultOptions,
        HighchartsComponentDefaults
    );

    /* *
     *
     *  Static functions
     *
     * */

    /**
     * Creates component from JSON.
     *
     * @param json
     * Set of component options, used for creating the Highcharts component.
     *
     * @returns
     * Highcharts component based on config from JSON.
     *
     * @private
     */
    public static fromJSON(
        json: HighchartsComponent.ClassJSON,
        cell: Cell
    ): HighchartsComponent {
        const options = json.options;
        const chartOptions = JSON.parse(json.options.chartOptions || '{}');
        /// const store = json.store ? DataJSON.fromJSON(json.store) : void 0;

        const component = new HighchartsComponent(
            cell,
            merge<Options>(
                options as any,
                {
                    chartOptions,
                    // Highcharts, // TODO: Find a solution
                    // store: store instanceof DataConnector ? store : void 0,

                    // Get from static registry:
                    syncHandlers: HighchartsComponent.syncHandlers
                }
            )
        );

        component.emit({
            type: 'fromJSON',
            json
        });

        return component;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * A full set of chart options used by the chart.
     * [Highcharts API](https://api.highcharts.com/highcharts/)
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/highcharts-components/highcharts/  | Chart options}
     *
     */
    public chartOptions: Partial<ChartOptions>;

    /**
     * Reference to the chart.
     */
    public chart?: Chart;

    /**
     * HTML element where the chart is created.
     */
    public chartContainer: HTMLElement;

    /**
     * Highcharts component's options.
     */
    public options: Options;

    /**
     * Type of constructor used for creating proper chart like: chart, stock,
     * gantt or map.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/highcharts-components/chart-constructor-maps/ | Map constructor}
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/highcharts-components/chart-constructor-gantt/ | Gantt constructor}
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/highcharts-components/chart-and-stock-constructors/ | Chart and Stock constructors}
     *
     */
    public chartConstructor: ConstructorType;

    /**
     * Reference to sync component that allows to sync i.e tooltips.
     *
     * @private
     */
    public sync: Component['sync'];

    /**
     * List of series IDs created from the connector using `columnAssignment`.
     */
    public seriesFromConnector: string[] = [];

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Creates a Highcharts component in the cell.
     *
     * @param options
     * The options for the component.
     */

    constructor(
        cell: Cell,
        options: Partial<Options>,
        board?: Board
    ) {
        options = merge(
            HighchartsComponent.defaultOptions,
            options
        );

        super(cell, options, board);
        this.options = options as Options;

        this.chartConstructor = this.options.chartConstructor || 'chart';
        this.type = 'Highcharts';

        this.chartContainer = createElement(
            'figure',
            void 0,
            void 0,
            this.contentElement,
            true
        );

        this.setOptions();
        this.sync = new HighchartsComponent.Sync(
            this,
            this.syncHandlers
        );

        this.chartOptions = merge((
            this.options.chartOptions ||
            { chart: {} } as Partial<ChartOptions>
        ), {
            tooltip: {} // Temporary fix for #18876
        });

        if (this.connector) {
            // Reload the store when polling
            this.connector.on('afterLoad', (e: DataConnector.Event): void => {
                if (e.table && this.connector) {
                    this.connector.table.setColumns(e.table.getColumns());
                }
            });
        }

        this.innerResizeTimeouts = [];
    }

    public onTableChanged(): void {
        this.updateSeries();
    }
    /* *
     *
     *  Functions
     *
     * */

    /** @private */
    public async load(): Promise<this> {
        this.emit({ type: 'load' });

        await super.load();

        this.emit({ type: 'afterLoad' });

        return this;
    }

    public render(): this {
        const hcComponent = this;

        super.render();
        hcComponent.chart = hcComponent.getChart();
        hcComponent.updateSeries();

        this.sync.start();
        hcComponent.emit({ type: 'afterRender' });
        hcComponent.setupConnectorUpdate();

        return this;
    }

    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): this {
        super.resize(width, height);

        while (this.innerResizeTimeouts.length) {
            const timeoutID = this.innerResizeTimeouts.pop();
            if (timeoutID) {
                clearTimeout(timeoutID);
            }
        }

        this.innerResizeTimeouts.push(setTimeout((): void => {
            if (this.chart && this.chart.container) {
                const heightOffset = this.contentElement.offsetHeight -
                    this.chart?.container.offsetHeight;

                this.chart.setSize(
                    null,
                    (Math.abs(heightOffset) > 1) ?
                        this.contentElement.offsetHeight : null,
                    false
                );
            }
        }, 33));

        return this;
    }

    /**
     * Adds call update value in store, when chart's point is updated.
     *
     * @private
     * */
    private setupConnectorUpdate(): void {
        const { connector: store, chart } = this;

        if (store && chart && this.options.allowConnectorUpdate) {
            for (let i = 0, iEnd = chart.series.length; i < iEnd; ++i) {
                const series = chart.series[i];
                series.update({
                    point: {
                        events: {
                            drag: (e: { target: Point }): void => {
                                this.onChartUpdate(e.target, store);
                            }
                        }
                    }
                }, false);
            }

            chart.redraw();
        }
    }

    /**
     * Internal method for handling option updates.
     *
     * @internal
     */
    private setOptions(): void {
        if (this.options.chartClassName) {
            this.chartContainer.classList.add(this.options.chartClassName);
        }

        if (this.options.chartID) {
            this.chartContainer.id = this.options.chartID;
        }
    }

    /**
     * Update the store, when the point is being dragged.
     * @param  {Point} point Dragged point.
     * @param  {Component.ConnectorTypes} store Connector to update.
     */
    private onChartUpdate(
        point: Point,
        store: Component.ConnectorTypes
    ): void {
        const table = store.table,
            columnName = point.series.name,
            rowNumber = point.index,
            converter = new DataConverter(),
            valueToSet = converter.asNumber(point.y);

        table.setCell(columnName, rowNumber, valueToSet);
    }
    /**
     * Handles updating via options.
     * @param options
     * The options to apply.
     *
     */
    public async update(
        options: Partial<Options>,
        shouldRerender: boolean = true
    ): Promise<void> {
        await super.update(options, false);
        this.setOptions();
        this.filterAndAssignSyncOptions(HighchartsSyncHandlers);

        if (this.chart) {
            this.chart.update(merge(this.options.chartOptions) || {});
        }
        this.emit({ type: 'afterUpdate' });

        shouldRerender && this.render();
    }

    /**
     * Updates chart's series when the data table is changed.
     *
     * @private
     */
    public updateSeries(): void {
        const { chart, connector } = this;
        if (!chart || !connector) {
            return;
        }

        if (this.presentationModifier) {
            this.presentationTable = this.presentationModifier
                .modifyTable(connector.table.modified.clone()).modified;
        } else {
            this.presentationTable = connector.table;
        }

        const table = this.presentationTable.modified;
        const modifierOptions = this.presentationTable.getModifier()?.options;

        this.emit({ type: 'afterPresentationModifier', table: table });

        const columnNames = table.getColumnNames();
        const columnAssignment = this.options.connector?.columnAssignment ??
            this.getDefaultColumnAssignment(columnNames);

        // Remove series that were added in the previous update and are not
        // present in the new columnAssignment.
        for (let i = 0, iEnd = this.seriesFromConnector.length; i < iEnd; ++i) {
            const oldSeriesId = this.seriesFromConnector[i];
            if (columnAssignment.some(
                (seriesId): boolean => seriesId.seriesId === oldSeriesId
            )) {
                continue;
            }

            const series = chart.get(oldSeriesId);
            if (series) {
                series.destroy();
            }
        }
        this.seriesFromConnector.length = 0;

        // Create the series or update the existing ones.
        for (let i = 0, iEnd = columnAssignment.length; i < iEnd; ++i) {
            const assignment = columnAssignment[i];
            const dataStructure = assignment.data;
            const series = chart.get(assignment.seriesId) as Series | undefined;
            const seriesOptions: SeriesOptions = {};

            // Prevent dragging on series, which were created out of a
            // columns which are created by MathModifier.
            const adjustDraggableOptions = (
                compare: (column: string) => boolean
            ): void => {
                if (
                    modifierOptions?.type === 'Math' &&
                    (modifierOptions as MathModifierOptions)
                        .columnFormulas?.some(
                            (formula): boolean => compare(formula.column)
                        )
                ) {
                    seriesOptions.dragDrop = {
                        draggableY: false
                    };
                }
            };

            // Set the series data based on the column assignment data structure
            // type.
            if (isString(dataStructure)) {
                const column = table.getColumn(dataStructure);
                if (column) {
                    seriesOptions.data = column.slice() as [];
                }

                adjustDraggableOptions((columnName): boolean => (
                    columnName === dataStructure
                ));
            } else if (Array.isArray(dataStructure)) {
                const seriesTable = new DataTable({
                    columns: table.getColumns(dataStructure)
                });
                seriesOptions.data = seriesTable.getRows() as [][];

                adjustDraggableOptions((columnName): boolean => (
                    dataStructure.some((name): boolean => name === columnName)
                ));
            } else {
                const keys = Object.keys(dataStructure);
                const columnNames: string[] = [];
                for (let j = 0, jEnd = keys.length; j < jEnd; ++j) {
                    columnNames.push(dataStructure[keys[j]]);
                }

                const seriesTable = new DataTable({
                    columns: table.getColumns(columnNames)
                });

                seriesOptions.keys = keys;
                seriesOptions.data = seriesTable.getRows() as [][];

                adjustDraggableOptions((columnName): boolean => (
                    columnNames.some((name): boolean => name === columnName)
                ));
            }

            if (!series) {
                chart.addSeries({
                    name: assignment.seriesId,
                    id: assignment.seriesId,
                    ...seriesOptions
                }, false);
            } else {
                series.update(seriesOptions, false);
            }

            this.seriesFromConnector.push(assignment.seriesId);
        }

        chart.redraw();
    }

    /**
     * Destroy chart and create a new one.
     *
     * @returns
     * The chart.
     *
     * @private
     *
     */
    private getChart(): Chart|undefined {
        return this.chart || this.createChart();
    }

    /**
     * Destroys the highcharts component.
     */
    public destroy(): void {
        // Cleanup references in the global Highcharts scope
        this.chart?.destroy();
        super.destroy();
    }

    /**
     * Creates default mapping when columnAssignment is not declared.
     * @param  { Array<string>} columnNames all columns returned from dataTable.
     *
     * @returns
     * The record of mapping
     *
     * @private
     *
     */
    private getDefaultColumnAssignment(
        columnNames: Array<string> = []
    ): ColumnAssignmentOptions[] {
        const result: ColumnAssignmentOptions[] = [];

        const firstColumn = this.presentationTable?.getColumn(columnNames[0]);
        if (firstColumn && isString(firstColumn[0])) {
            for (let i = 1, iEnd = columnNames.length; i < iEnd; ++i) {
                result.push({
                    seriesId: columnNames[i],
                    data: [columnNames[0], columnNames[i]]
                });
            }
            return result;
        }

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            result.push({
                seriesId: columnNames[i],
                data: columnNames[i]
            });
        }
        return result;
    }

    /**
     * Creates chart.
     *
     * @returns
     * The chart.
     *
     * @private
     *
     */
    private createChart(): Chart|undefined {
        const charter = HighchartsComponent.charter || Globals.win.Highcharts;

        if (!this.chartConstructor) {
            this.chartConstructor = 'chart';
        }

        const Factory = charter[this.chartConstructor];
        if (Factory) {
            try {
                if (this.chartConstructor === 'chart') {
                    return charter.Chart.chart(
                        this.chartContainer,
                        this.chartOptions
                    );
                }
                return new Factory(this.chartContainer, this.chartOptions);
            } catch {
                throw new Error(
                    'The Highcharts component is misconfigured: `' +
                    this.cell.id + '`'
                );
            }
        }

        if (typeof charter.chart !== 'function') {
            throw new Error('Chart constructor not found');
        }

        return this.chart;
    }

    /**
     * Registers events from the chart options to the callback register.
     *
     * @private
     */
    private registerChartEvents(): void {
        if (this.chart && this.chart.options) {
            const options = this.chart.options;
            const allEvents = [
                'chart',
                'series',
                'yAxis',
                'xAxis',
                'colorAxis',
                'annotations',
                'navigation'
            ].map((optionKey: string): Record<string, any> => {
                let seriesOrAxisOptions = (options as any)[optionKey] || {};

                if (
                    !Array.isArray(seriesOrAxisOptions) &&
                    seriesOrAxisOptions.events
                ) {
                    seriesOrAxisOptions = [seriesOrAxisOptions];
                }

                if (
                    seriesOrAxisOptions &&
                    typeof seriesOrAxisOptions === 'object' &&
                    Array.isArray(seriesOrAxisOptions)
                ) {
                    return seriesOrAxisOptions.reduce(
                        (
                            acc: Record<string, any>,
                            seriesOrAxis: SeriesOptions | AxisOptions,
                            i: number
                        ): Record<string, {}> => {
                            if (seriesOrAxis && seriesOrAxis.events) {
                                acc[seriesOrAxis.id || `${optionKey}-${i}`] = seriesOrAxis.events;
                            }
                            return acc;
                        }, {}) || {};
                }

                return {};
            });


            allEvents.forEach((options): void => {
                Object.keys(options).forEach((key): void => {
                    const events = options[key];
                    Object.keys(events).forEach((callbackKey): void => {
                        this.callbackRegistry.addCallback(`${key}-${callbackKey}`, {
                            type: 'seriesEvent',
                            func: events[callbackKey]
                        });
                    });
                });
            });
        }
    }
    public setConnector(connector: DataConnector | undefined): this {
        const chart = this.chart;
        if (
            this.connector &&
            chart &&
            chart.series &&
            this.connector.table.id !== connector?.table.id
        ) {
            const storeTableID = this.connector.table.id;
            for (let i = chart.series.length - 1; i >= 0; i--) {
                const series = chart.series[i];

                if (series.options.id?.indexOf(storeTableID) !== -1) {
                    series.remove(false);
                }
            }
        }
        super.setConnector(connector);


        return this;
    }

    public getOptionsOnDrop(sidebar: SidebarPopup): Partial<Options> {
        const connectorsIds =
            sidebar.editMode.board.dataPool.getConnectorIds();

        let options: Partial<Options> = {
            cell: '',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    animation: false,
                    type: 'column',
                    zooming: {}
                }
            }
        };

        if (connectorsIds.length) {
            options = {
                ...options,
                connector: {
                    id: connectorsIds[0]
                }
            };
        }

        return options;
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @returns
     * Class JSON of this Component instance.
     *
     * @private
     */
    public toJSON(): HighchartsComponent.ClassJSON {
        const chartOptions = JSON.stringify(this.options.chartOptions),
            chartConstructor = this.options.chartConstructor || 'chart';

        this.registerChartEvents();

        const base = super.toJSON();

        const json: HighchartsComponent.ClassJSON = {
            ...base,
            type: 'Highcharts',
            options: {
                ...base.options,
                chartOptions,
                chartConstructor,
                // TODO: may need to handle callback functions
                // Maybe have a sync.toJSON()
                type: 'Highcharts',
                sync: {}
            }
        };

        this.emit({ type: 'toJSON', json });
        return json;
    }

    /**
     * Get the HighchartsComponent component's options.
     * @returns
     * The JSON of HighchartsComponent component's options.
     *
     * @internal
     *
     */
    public getOptions(): Partial<Options> {
        return {
            ...diffObjects(this.options, HighchartsComponent.defaultOptions),
            type: 'Highcharts'
        };
    }

    public getEditableOptions(): Options {
        const component = this;
        const componentOptions = component.options;
        const chart = component.chart;
        const chartOptions = chart && chart.options;
        const chartType = chartOptions && chartOptions.chart?.type || 'line';

        return merge(componentOptions, {
            chartOptions
        }, {
            chartOptions: {
                yAxis: splat(chart && chart.yAxis[0].options),
                xAxis: splat(chart && chart.xAxis[0].options),
                plotOptions: {
                    series: ((chartOptions && chartOptions.plotOptions) ||
                        {})[chartType]
                }
            }
        });
    }


    public getEditableOptionValue(
        propertyPath?: string[]
    ): number | boolean | undefined | string {
        const component = this;
        if (!propertyPath) {
            return;
        }

        if (propertyPath.length === 1 && propertyPath[0] === 'chartOptions') {
            return JSON.stringify(component.options.chartOptions, null, 2);
        }

        return super.getEditableOptionValue.call(this, propertyPath);
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

/** @private */
namespace HighchartsComponent {

    /* *
    *
    *  Declarations
    *
    * */

    /** @private */
    export type ComponentType = HighchartsComponent;

    /** @private */
    export type ChartComponentEvents =
        JSONEvent |
        Component.EventTypes;

    /** @private */
    export type JSONEvent = Component.Event<'toJSON' | 'fromJSON', {
        json: ClassJSON;
    }>;

    /** @private */
    export interface OptionsJSON extends Component.ComponentOptionsJSON {
        chartOptions?: string;
        chartClassName?: string;
        chartID?: string;
        chartConstructor: ConstructorType;
        type: 'Highcharts'
    }
    /** @private */
    export interface ClassJSON extends Component.JSON {
        options: OptionsJSON;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default HighchartsComponent;
