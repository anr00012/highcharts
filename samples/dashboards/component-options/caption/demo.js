Dashboards.board('container', {
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        title: 'Component title',
        caption: 'Caption line',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }, {
        renderTo: 'dashboard-col-1',
        caption: {
            text: 'Caption bar',
            style: {
                fontSize: '20px',
                color: '#0000FF'
            }
        },
        type: 'Highcharts',
        chartOptions: {
            chart: {
                type: 'bar'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});
