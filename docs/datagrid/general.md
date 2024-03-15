DataGrid
===

The DataGrid is a versatile tool for visualizing and editing tabular data.
By incorporating this component, users can effectively interact with data in a structured and editable table format.


## Installation
- The package can be imported through a script tag from the Highcharts CDN like this:

    ```html
    <script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
    ```

- Or it can be installed through NPM like this:

    ```bash
    npm install @highcharts/dashboards
    ```
    Then import the module like this:

    ```typescript
    import * as DataGrid from '@highcharts/dashboards/datagrid';
    ```

## Usage
The DataGrid can be added as a standalone component or as a part of a dashboard. The following example demonstrates how to use the DataGrid as a standalone component.


First you need to create a container for the DataGrid:
```html
<div id="container"></div>
```

Then you can create the DataGrid instance and add it to the container.
Note that the DataGrid requires data to be in form of a data table.  
Check [the data documentation](https://www.highcharts.com/docs/dashboards/data-handling) to read more about data handling.

```javascript
import DataGrid from '@highcharts/dashboards/datagrid';

const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataGrid.DataTable({
        product: ['Apples', 'Pears', 'Plums', 'Bananas'],
        price: [1.5, 2.53, 5, 4.5],
     })
});
```

## Styles
The DataGrid component requires the following styles to be imported in your main CSS file:

```css
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```


## Options
<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/data-grid/basic/cells-formatting" allow="fullscreen"></iframe>

The DataGrid has a number of options that can be used to customize the appearance and behavior of the table.

For example using the [`editable`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1#editable) option you can make all the cells in a DataGrid editable (`true`) or read-only (`false`):

Using [`columns`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1#columns), you can format data and headers in cells, e.g. adding units to them. The key is the column name and the value is the object with the column-specific options.

Example:
```js
const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataGrid.DataTable({ columns }),
    editable: false,
    columns: {
        product: {
            cellFormat: '{text} No. 1',
            headerFormat: '{text} name'
        },
        weight: {
            cellFormat: '{value} kg',
            headerFormat: '{text} (kg)'
        },
        price: {
            cellFormat: '{value} $',
            headerFormat: '($) {text}'
        },
        metaData: {
            show: false
        }
    }
});
```

There are more DataGrid options that can be found in [the API](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1).
