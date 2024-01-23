import*as e from"../../Core/Globals.js";var i={d:(e,r)=>{for(var n in r)i.o(r,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},o:(e,i)=>Object.prototype.hasOwnProperty.call(e,i)};const r=JSON.parse('{"defaults":{"chartTitle":"Diagramtittel","pieSliceName":"Skive","seriesName":"Serie {series.index}","yAxisTitle":"Verdier","rangeselectorButtons":[]},"viewFullscreen":"Vis i fullskjerm","exitFullscreen":"Avslutt fullskjerm","printChart":"Skriv ut diagram","downloadPNG":"Last ned PNG-bilde","downloadJPEG":"Last ned JPEG-bilde","downloadPDF":"Last ned PDF-dokument","downloadSVG":"Last ned SVG-vektorgrafikk","contextButtonTitle":"Diagramkontekstmeny","loading":"Laster...","months":["Januar","Februar","Mars","April","Mai","Juni","Juli","August","September","Oktober","November","Desember"],"shortMonths":["Jan","Feb","Mar","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Des"],"weekdays":["Søndag","Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag"],"decimalPoint":",","numericSymbols":["k","M","G","T","P","E"],"resetZoom":"Tilbakestill zoom","resetZoomTitle":"Tilbakestill zoomnivå 1:1","thousandsSep":" ","rangeSelectorZoom":"Zoom","rangeSelectorFrom":"Fra","rangeSelectorTo":"→","zoomIn":"Zoom inn","zoomOut":"Zoom ut","downloadCSV":"Last ned CSV","downloadXLS":"Last ned XLS","exportData":{"annotationHeader":"Annotasjoner","categoryHeader":"Kategori","categoryDatetimeHeader":"Dato og tid"},"viewData":"Vis datatabell","hideData":"Skjul datatabell","exportInProgress":"Eksporterer...","accessibility":{"defaultChartTitle":"Diagram","chartContainerLabel":"{title}. Highcharts interaktivt diagram.","svgContainerLabel":"Interaktivt diagram","drillUpButton":"{buttonText}","credits":"Diagramkreditter: {creditsStr}","thousandsSep":",","svgContainerTitle":"","graphicContainerLabel":"","screenReaderSection":{"beforeRegionLabel":"","afterRegionLabel":"","annotations":{"heading":"Sammendrag av diagramannotasjoner","descriptionSinglePoint":"{annotationText}. Relatert til {annotationPoint}","descriptionMultiplePoints":"{annotationText}. Relatert til {annotationPoint}{#each additionalAnnotationPoints}, også relatert til {this}{/each}","descriptionNoPoints":"{annotationText}"},"endOfChartMarker":"Slutt på interaktivt diagram."},"sonification":{"playAsSoundButtonText":"Spill som lyd, {chartTitle}","playAsSoundClickAnnouncement":"Spill"},"legend":{"legendLabelNoTitle":"Endre seriens synlighet, {chartTitle}","legendLabel":"Diagramforklaring: {legendTitle}","legendItem":"Vis {itemName}"},"zoom":{"mapZoomIn":"Zoom diagram","mapZoomOut":"Zoom ut diagram","resetZoomButton":"Tilbakestill zoom"},"rangeSelector":{"dropdownLabel":"{rangeTitle}","minInputLabel":"Velg startdato.","maxInputLabel":"Velg sluttdato.","clickButtonAnnouncement":"Viser {axisRangeDescription}"},"navigator":{"handleLabel":"{#eq handleIx 0}Start, prosent{else}Slutt, prosent{/eq}","groupLabel":"Aksezoom","changeAnnouncement":"{axisRangeDescription}"},"table":{"viewAsDataTableButtonText":"Vis som datatabell, {chartTitle}","tableSummary":"Tabellrepresentasjon av diagram."},"announceNewData":{"newDataAnnounce":"Oppdaterte data for diagram {chartTitle}","newSeriesAnnounceSingle":"Ny dataserie: {seriesDesc}","newPointAnnounceSingle":"Nytt datapunkt: {pointDesc}","newSeriesAnnounceMultiple":"Ny dataserie i diagram {chartTitle}: {seriesDesc}","newPointAnnounceMultiple":"Nytt datapunkt i diagram {chartTitle}: {pointDesc}"},"seriesTypeDescriptions":{"boxplot":"Boksplott diagrammer brukes typisk til å vise grupper av statistiske data. Hvert datapunkt i diagrammet kan ha opptil 5 verdier: minimum, nedre kvartil, median, øvre kvartil, og maksimum.","arearange":"Områdeområde diagrammer er linjediagrammer som viser et område mellom en lavere og høyere verdi for hvert punkt.","areasplinerange":"Disse diagrammene er linjediagrammer som viser et område mellom en lavere og høyere verdi for hvert punkt.","bubble":"Boblediagrammer er spredningsdiagrammer der hvert datapunkt også har en størrelsesverdi.","columnrange":"Kolonneområde diagrammer er kolonnediagrammer som viser et område mellom en lavere og høyere verdi for hvert punkt.","errorbar":"Feilbjelkeserier brukes til å vise variabiliteten av data.","funnel":"Traktdiagrammer brukes til å vise reduksjon av data i stadier.","pyramid":"Pyramidediagrammer består av en enkelt pyramide med elementhøyder som svarer til hver punktverdi.","waterfall":"Et fossediagram er et kolonnediagram der hver kolonne bidrar mot en total sluttkverdi."},"chartTypes":{"emptyChart":"Tomt diagram","mapTypeDescription":"Kart over {mapTitle} med {numSeries} dataserier.","unknownMap":"Kart over uspesifisert region med {numSeries} dataserier.","combinationChart":"Kombinasjonsdiagram med {numSeries} dataserier.","defaultSingle":"Diagram med {numPoints} data {#eq numPoints 1}punkt{else}punkter{/eq}.","defaultMultiple":"Diagram med {numSeries} dataserier.","splineSingle":"Linjediagram med {numPoints} data {#eq numPoints 1}punkt{else}punkter{/eq}.","splineMultiple":"Linjediagram med {numSeries} linjer.","lineSingle":"Linjediagram med {numPoints} data {#eq numPoints 1}punkt{else}punkter{/eq}.","lineMultiple":"Linjediagram med {numSeries} linjer.","columnSingle":"Stolpediagram med {numPoints} {#eq numPoints 1}stolpe{else}stolper{/eq}.","columnMultiple":"Stolpediagram med {numSeries} dataserier.","barSingle":"Stolpediagram med {numPoints} {#eq numPoints 1}stolpe{else}stolper{/eq}.","barMultiple":"Stolpediagram med {numSeries} dataserier.","pieSingle":"Piediagram med {numPoints} {#eq numPoints 1}skive{else}skiver{/eq}.","pieMultiple":"Piediagram med {numSeries} paier.","scatterSingle":"Spredningsdiagram med {numPoints} {#eq numPoints 1}punkt{else}punkter{/eq}.","scatterMultiple":"Spredningsdiagram med {numSeries} dataserier.","boxplotSingle":"Boksplott med {numPoints} {#eq numPoints 1}boks{else}bokser{/eq}.","boxplotMultiple":"Boksplott med {numSeries} dataserier.","bubbleSingle":"Boblediagram med {numPoints} {#eq numPoints 1}boble{else}bobler{/eq}.","bubbleMultiple":"Boblediagram med {numSeries} dataserier."},"axis":{"xAxisDescriptionSingular":"Diagrammet har 1 X-akse som viser {names[0]}. {ranges[0]}","xAxisDescriptionPlural":"Diagrammet har {numAxes} X-akser som viser {#each names}{#unless @first},{/unless}{#if @last} og{/if} {this}{/each}.","yAxisDescriptionSingular":"Diagrammet har 1 Y-akse som viser {names[0]}. {ranges[0]}","yAxisDescriptionPlural":"Diagrammet har {numAxes} Y-akser som viser {#each names}{#unless @first},{/unless}{#if @last} og{/if} {this}{/each}.","timeRangeDays":"Dataområde: {range} dager.","timeRangeHours":"Dataområde: {range} timer.","timeRangeMinutes":"Dataområde: {range} minutter.","timeRangeSeconds":"Dataområde: {range} sekunder.","rangeFromTo":"Datarekkevidde fra {rangeFrom} til {rangeTo}.","rangeCategories":"Dataområde: {numCategories} kategorier."},"exporting":{"chartMenuLabel":"Diagrammeny","menuButtonLabel":"Vis diagrammeny, {chartTitle}"},"series":{"summary":{"default":"{series.name}, serie {seriesNumber} av {chart.series.length} med {series.points.length} data {#eq series.points.length 1}punkt{else}punkter{/eq}.","defaultCombination":"{series.name}, serie {seriesNumber} av {chart.series.length} med {series.points.length} data {#eq series.points.length 1}punkt{else}punkter{/eq}.","line":"{series.name}, linje {seriesNumber} av {chart.series.length} med {series.points.length} data {#eq series.points.length 1}punkt{else}punkter{/eq}.","lineCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}. Linje med {series.points.length} data {#eq series.points.length 1}punkt{else}punkter{/eq}.","spline":"{series.name}, linje {seriesNumber} av {chart.series.length} med {series.points.length} data {#eq series.points.length 1}punkt{else}punkter{/eq}.","splineCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}. Linje med {series.points.length} data {#eq series.points.length 1}punkt{else}punkter{/eq}.","column":"{series.name}, stolpeserie {seriesNumber} av {chart.series.length} med {series.points.length} {#eq series.points.length 1}stolpe{else}stolper{/eq}.","columnCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}. Stolpeserie med {series.points.length} {#eq series.points.length 1}stolpe{else}stolper{/eq}.","bar":"{series.name}, stolpeserie {seriesNumber} av {chart.series.length} med {series.points.length} {#eq series.points.length 1}stolpe{else}stolper{/eq}.","barCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}. Stolpeserie med {series.points.length} {#eq series.points.length 1}stolpe{else}stolper{/eq}.","pie":"{series.name}, pai {seriesNumber} av {chart.series.length} med {series.points.length} {#eq series.points.length 1}skive{else}skiver{/eq}.","pieCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}. Pai med {series.points.length} {#eq series.points.length 1}skive{else}skiver{/eq}.","scatter":"{series.name}, spredningsdiagram {seriesNumber} av {chart.series.length} med {series.points.length} {#eq series.points.length 1}punkt{else}punkter{/eq}.","scatterCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}, spredningsdiagram med {series.points.length} {#eq series.points.length 1}punkt{else}punkter{/eq}.","boxplot":"{series.name}, boksplott {seriesNumber} av {chart.series.length} med {series.points.length} {#eq series.points.length 1}boks{else}bokser{/eq}.","boxplotCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}. Boksplott med {series.points.length} {#eq series.points.length 1}boks{else}bokser{/eq}.","bubble":"{series.name}, bobleserie {seriesNumber} av {chart.series.length} med {series.points.length} {#eq series.points.length 1}boble{else}bobler{/eq}.","bubbleCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}. Bobleserie med {series.points.length} {#eq series.points.length 1}boble{else}bobler{/eq}.","map":"{series.name}, kart {seriesNumber} av {chart.series.length} med {series.points.length} {#eq series.points.length 1}område{else}områder{/eq}.","mapCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}. Kart med {series.points.length} {#eq series.points.length 1}område{else}områder{/eq}.","mapline":"{series.name}, linje {seriesNumber} av {chart.series.length} med {series.points.length} data {#eq series.points.length 1}punkt{else}punkter{/eq}.","maplineCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}. Linje med {series.points.length} data {#eq series.points.length 1}punkt{else}punkter{/eq}.","mapbubble":"{series.name}, bobleserie {seriesNumber} av {chart.series.length} med {series.points.length} {#eq series.points.length 1}boble{else}bobler{/eq}.","mapbubbleCombination":"{series.name}, serie {seriesNumber} av {chart.series.length}. Bobleserie med {series.points.length} {#eq series.points.length 1}boble{else}bobler{/eq}."},"description":"{description}","xAxisDescription":"X-akse, {name}","yAxisDescription":"Y-akse, {name}","nullPointValue":"Ingen verdi","pointAnnotationsDescription":"{#each annotations}Annotasjon: {this}{/each}"}},"navigation":{"popup":{"simpleShapes":"Enkle former","lines":"Linjer","circle":"Sirkel","ellipse":"Ellipse","rectangle":"Rektangel","label":"Etikett","shapeOptions":"Formalternativer","typeOptions":"Detaljer","fill":"Fyll","format":"Tekst","strokeWidth":"Linjebredde","stroke":"Linjefarge","title":"Tittel","name":"Navn","labelOptions":"Etikettalternativer","labels":"Etiketter","backgroundColor":"Bakgrunnsfarge","backgroundColors":"Bakgrunnsfarger","borderColor":"Kantfarge","borderRadius":"Kantradius","borderWidth":"Kantbredde","style":"Stil","padding":"Polstring","fontSize":"Skriftstørrelse","color":"Farge","height":"Høyde","shapes":"Formalternativer","segment":"Segment","arrowSegment":"Pilsegment","ray":"Stråle","arrowRay":"Pilstråle","line":"Linje","arrowInfinityLine":"Pillinje","horizontalLine":"Horisontal linje","verticalLine":"Vertikal linje","crooked3":"Kroket 3-linje","crooked5":"Kroket 5-linje","elliott3":"Elliott 3-linje","elliott5":"Elliott 5-linje","verticalCounter":"Vertikal teller","verticalLabel":"Vertikal etikett","verticalArrow":"Vertikal pil","fibonacci":"Fibonacci","fibonacciTimeZones":"Fibonacci tidssoner","pitchfork":"Gaffel","parallelChannel":"Parallel kanal","infinityLine":"Uendelighetslinje","measure":"Mål","measureXY":"Mål XY","measureX":"Mål X","measureY":"Mål Y","timeCycles":"Tidssykler","flags":"Flagg","addButton":"Legg til","saveButton":"Lagre","editButton":"Rediger","removeButton":"Fjern","series":"Serier","volume":"Volum","connector":"Kobling","innerBackground":"Indre bakgrunn","outerBackground":"Ytre bakgrunn","crosshairX":"Krysshår X","crosshairY":"Krysshår Y","tunnel":"Tunnel","background":"Bakgrunn","noFilterMatch":"Ingen treff","searchIndicators":"Søk indikatorer","clearFilter":"✕ fjern filter","index":"Indeks","period":"Periode","periods":"Perioder","standardDeviation":"Standardavvik","periodTenkan":"Tenkan-periode","periodSenkouSpanB":"Senkou Span B-periode","periodATR":"ATR-periode","multiplierATR":"ATR-multiplikator","shortPeriod":"Kort periode","longPeriod":"Lang periode","signalPeriod":"Signalperiode","decimals":"Desimaler","algorithm":"Algoritme","topBand":"Øvre bånd","bottomBand":"Nedre bånd","initialAccelerationFactor":"Innledende akselerasjonsfaktor","maxAccelerationFactor":"Maksimal akselerasjonsfaktor","increment":"Økning","multiplier":"Multiplikator","ranges":"Områder","highIndex":"Høy indeks","lowIndex":"Lav indeks","deviation":"Avvik","xAxisUnit":"x-akseenhet","factor":"Faktor","fastAvgPeriod":"Rask gjennomsnittlig periode","slowAvgPeriod":"Langsom gjennomsnittlig periode","average":"Gjennomsnitt","indicatorAliases":{"abands":["Akselerasjonsbånd"],"bb":["Bollinger-bånd"],"dema":["Dobbelt eksponentielt glidende gjennomsnitt"],"ema":["Eksponentielt glidende gjennomsnitt"],"ikh":["Ichimoku Kinko Hyo"],"keltnerchannels":["Keltner-kanaler"],"linearRegression":["Lineær regresjon"],"pivotpoints":["Pivotpunkter"],"pc":["Priskanal"],"priceenvelopes":["Prisenvelopper"],"psar":["Parabolic SAR"],"sma":["Enkelt glidende gjennomsnitt"],"supertrend":["Supertrend"],"tema":["Trippel eksponentielt glidende gjennomsnitt"],"vbp":["Volum ved pris"],"vwap":["Volumvektet glidende gjennomsnitt"],"wma":["Vektet glidende gjennomsnitt"],"zigzag":["Zigzag"],"apo":["Absolutt prisindikator"],"ad":["Akkumulering/Distribusjon"],"aroon":["Aroon"],"aroonoscillator":["Aroon-oscillator"],"atr":["Gjennomsnittlig sann rekkevidde"],"ao":["Fantastisk oscillator"],"cci":["Commodity Channel Index"],"chaikin":["Chaikin"],"cmf":["Chaikin Money Flow"],"cmo":["Chande Momentum Oscillator"],"disparityindex":["Disparitetsindeks"],"dmi":["Retningsbevegelsesindeks"],"dpo":["Detrended prisoscillator"],"klinger":["Klinger Oscillator"],"linearRegressionAngle":["Lineær regresjonsvinkel"],"linearRegressionIntercept":["Lineær regresjonsavskjæring"],"linearRegressionSlope":["Lineær regresjonsstigning"],"macd":["Glidende gjennomsnittskonvergensdivergens"],"mfi":["Pengeflytindeks"],"momentum":["Momentum"],"natr":["Normalisert gjennomsnittlig sann rekkevidde"],"obv":["On-Balance Volume"],"ppo":["Prosentvis prisoscillator"],"roc":["Endringsrate"],"rsi":["Relativ styrkeindeks"],"slowstochastic":["Langsom stokastisk"],"stochastic":["Stokastisk"],"trix":["TRIX"],"williamsr":["Williams %R"]}}},"mainBreadcrumb":"Hoved","downloadMIDI":"Last ned MIDI","playAsSound":"Spill som lyd","stockTools":{"gui":{"simpleShapes":"Enkle former","lines":"Linjer","crookedLines":"Krokete linjer","measure":"Mål","advanced":"Avansert","toggleAnnotations":"Veksle annotasjoner","verticalLabels":"Vertikale etiketter","flags":"Flagg","zoomChange":"Zoom endring","typeChange":"Type endring","saveChart":"Lagre diagram","indicators":"Indikatorer","currentPriceIndicator":"Indikatorer for nåværende pris","zoomX":"Zoom X","zoomY":"Zoom Y","zoomXY":"Zoom XY","fullScreen":"Fullskjerm","typeOHLC":"OHLC","typeLine":"Linje","typeCandlestick":"Lysestake","typeHLC":"HLC","typeHollowCandlestick":"Hul lysestake","typeHeikinAshi":"Heikin Ashi","circle":"Sirkel","ellipse":"Ellipse","label":"Etikett","rectangle":"Rektangel","flagCirclepin":"Flagg sirkel","flagDiamondpin":"Flagg diamant","flagSquarepin":"Flagg kvadrat","flagSimplepin":"Flagg enkel","measureXY":"Mål XY","measureX":"Mål X","measureY":"Mål Y","segment":"Segment","arrowSegment":"Pilsegment","ray":"Stråle","arrowRay":"Pilstråle","line":"Linje","arrowInfinityLine":"Pillinje","horizontalLine":"Horisontal linje","verticalLine":"Vertikal linje","infinityLine":"Uendelighetslinje","crooked3":"Kroket 3-linje","crooked5":"Kroket 5-linje","elliott3":"Elliott 3-linje","elliott5":"Elliott 5-linje","verticalCounter":"Vertikal teller","verticalLabel":"Vertikal etikett","verticalArrow":"Vertikal pil","fibonacci":"Fibonacci","fibonacciTimeZones":"Fibonacci tidssoner","pitchfork":"Høygaffel","parallelChannel":"Parallel kanal","timeCycles":"Tidsykler"}},"noData":"Ingen data å vise"}');var n,t;(n={default:()=>e.default},t={},i.d(t,n),t).default.setOptions({lang:r,title:{text:r.defaults.chartTitle}});