QUnit.test(
    'Series should be hidden from screen readers when not visible',
    function (assert) {
        var chart = Highcharts.chart('container', {
                series: [
                    {
                        data: [1, 2, 3]
                    },
                    {
                        data: [4, 5, 6]
                    }, {
                        // Empty series
                    }
                ]
            }),
            seriesA = chart.series[0],
            seriesB = chart.series[1],
            seriesC = chart.series[2],
            getSeriesAriaHidden = function (series) {
                return Highcharts.A11yChartUtilities.getSeriesA11yElement(
                    series
                ).getAttribute('aria-hidden');
            },
            { proxyProvider, keyboardNavigation } = chart.accessibility,
            initDomElementProviderElementsLength =
                proxyProvider.domElementProvider.elements.length,
            initEventRemoversLength =
                keyboardNavigation.eventProvider.eventRemovers.length;

        assert.strictEqual(
            getSeriesAriaHidden(seriesA),
            'false',
            'Series should not be hidden from AT'
        );
        assert.strictEqual(
            getSeriesAriaHidden(seriesB),
            'false',
            'Series should not be hidden from AT'
        );
        assert.strictEqual(
            getSeriesAriaHidden(seriesC),
            'true',
            'Series without data should be hidden from AT'
        );

        seriesB.hide();

        assert.strictEqual(
            getSeriesAriaHidden(seriesA),
            'false',
            'Series should still not be hidden from AT'
        );
        assert.strictEqual(
            getSeriesAriaHidden(seriesB),
            'true',
            'Series should be hidden from AT'
        );

        chart.series[0].update({
            name: 'Bean sprouts'
        });

        assert.notStrictEqual(
            chart.series[0].a11yProxyElement.innerElement.getAttribute('aria-label').indexOf('Bean'),
            -1,
            '#15902: Proxy button aria-label should have been updated'
        );

        const added = chart.addSeries({ data: [1, 2, 3] });

        assert.ok(
            added.a11yProxyElement.innerElement,
            '#15902: New legend item should have proxy button'
        );

        added.remove();

        assert.strictEqual(
            chart.accessibility.proxyProvider.groups
                .legend.proxyElements.length,
            3,
            '#15902: Proxy items should be recreated after removing legend item'
        );

        assert.strictEqual(
            proxyProvider.domElementProvider.elements.length,
            initDomElementProviderElementsLength,
            `#20329: After multiple chart re-renders dom element provider
            should'nt create detached HTML elements and remove existing old
            ones.`
        );

        assert.strictEqual(
            keyboardNavigation.eventProvider.eventRemovers.length,
            initEventRemoversLength,
            `#20329: After multiple chart re-renders event removers in keyboard
            navigation should remove existing old ones.`
        );
    }
);
