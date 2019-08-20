QUnit.test('Markers and zones for dumbbell.', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'dumbbell',
            width: 600
        },

        series: [{
            data: [
                [0, 10],
                [10, 20],
                { low: 30, high: 35, startColor: '#ff69b4', connectorColor: '#000000' },
                [30, 31]
            ],
            zones: [{
                value: 15,
                color: '#ff0000'
            }, {
                value: 25,
                color: '#ffff00'
            }, {
                color: '#d3d3d3'
            }],
            marker: {
                enabled: true
            },
            color: '#0000ff',
            startColor: '#00ff00'
        }]
    });

    assert.deepEqual(
        chart.series[0].points.map(function (p) {
            return [
                p.upperGraphic.attr('fill'),
                p.lowerGraphic.attr('fill'),
                p.connector.attr('stroke')
            ];
        }),
        [
            [
                "#ff0000",
                "#00ff00",
                "#ff0000"
            ],
            [
                "#ffff00",
                "#00ff00",
                "#ffff00"
            ],
            [
                "#d3d3d3",
                "#ff69b4",
                "#000000"
            ],
            [
                "#d3d3d3",
                "#00ff00",
                "#d3d3d3"
            ]
        ],
        'Upper and lower markers with connector should individually respect all the colors settings.'
    );

    // Testing setState()
    chart.series[0].points[1].setState('hover');

    assert.deepEqual(
        chart.series[0].points[1].upperGraphic.attr('fill'),
        '#ffff00',
        'The upper marker should have a correct color on hover.'
    );

    assert.deepEqual(
        chart.series[0].points[1].lowerGraphic.attr('fill'),
        chart.series[0].startColor,
        'The lower marker should have a correct color (startColor) on hover.'
    );

    chart.series[0].points[1].setState('');

    assert.deepEqual(
        chart.series[0].points[1].upperGraphic.attr('fill'),
        '#ffff00',
        'The upper marker should have a correct color without any state.'
    );

    assert.deepEqual(
        chart.series[0].points[1].lowerGraphic.attr('fill'),
        chart.series[0].startColor,
        'The lower marker should have a correct color (startColor) without any state.'
    );

});

QUnit.test('setData() and marker update for dumbbell.', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'dumbbell',
            width: 600
        },

        series: [{
            data: [
                [0, 10],
                [10, 20],
                [30, 35],
                [30, 31]
            ]
        }]
    });

    chart.series[0].setData([[50, 60], [50, 60], [50, 60]]);

    Highcharts.each(chart.series[0].points, function (point) {
        assert.ok(
            point.lowerGraphic !== undefined,
            'Bottom marker for point: x=' + (point.x) + ' exists.'
        );
        assert.ok(
            point.upperGraphic !== undefined,
            'Top marker for point: x=' + (point.x) + ' exists.'
        );
        assert.ok(
            point.connector !== undefined,
            'Connector for point: x=' + (point.x) + ' exists.'
        );
    });

    chart.series[0].points[1].update({
        marker: {
            fillColor: '#ff0000'
        }
    });

    assert.deepEqual(
        chart.series[0].points[1].upperGraphic.attr('fill'),
        '#ff0000',
        'After point.marker.fillColor update, the upperGraphic should have a correct color.'
    );

    chart.series[0].update({
        startColor: '#000000'
    });

    chart.series[0].points.forEach(function (point) {
        assert.deepEqual(
            point.lowerGraphic.attr('fill'),
            '#000000',
            'After series.startColor update, all the lowerGraphics should have a correct color.'
        );
    });

});