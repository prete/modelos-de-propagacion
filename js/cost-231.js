var cost231 = {
    ahre: {
        media: () => {
            return (1.1 * Math.log10(cost231.config.freq) - 0.7) * cost231.config.arx - (1.56 * Math.log10(cost231.config.freq) -
                0.8);
        },
        grande: () => {
            return 3.2 * Math.pow((Math.log10(11.75 * (cost231.config.arx))), 2) - 4.97;
        }
    },
    perdidas: {
        grande: (d) => {
            return 46.3 + 33.9 * Math.log10(cost231.config.freq) - 13.82 * Math.log10(cost231.config.atx) - cost231.ahre.grande() + (44.9 - 6.55 * Math.log10(cost231.config.arx)) * Math.log10(d) + 3;
        },
        media: (d) => {
            return 46.3 + 33.9 * Math.log10(cost231.config.freq) - 13.82 * Math.log10(cost231.config.atx) - cost231.ahre.media() + (44.9 - 6.55 * Math.log10(cost231.config.arx)) * Math.log10(d);
        },
        suburbana: (d) => {
            return 46.3 + 33.9 * Math.log10(cost231.config.freq) - 13.82 * Math.log10(cost231.config.atx) - cost231.ahre.media() + (44.9 - 6.55 * Math.log10(cost231.config.arx)) * Math.log10(d) - 12;
        },
        rural: (d) => {
            return 46.3 + 33.9 * Math.log10(cost231.config.freq) - 13.82 * Math.log10(cost231.config.atx) - cost231.ahre.media() + (44.9 - 6.55 * Math.log10(cost231.config.arx)) * Math.log10(d) + 20;
        },
        libre: (d) => {
            return 32.46 + 20 * Math.log10(cost231.config.freq) + 20 * Math.log10(d);
        }
    },
    potencia: {
        urbana: (d) => {
            return cost231.config.ptx + cost231.config.gtx + cost231.config.grx - cost231.perdidas.media(d) - cost231.config.pctx -
                cost231.config.pcon - cost231.config.pac;
        },
        suburbana: (d) => {
            return cost231.config.ptx + cost231.config.gtx + cost231.config.grx - cost231.perdidas.suburbana(d) - cost231.config.pctx -
                cost231.config.pcon - cost231.config.pac;
        },
        rural: (d) => {
            return cost231.config.ptx + cost231.config.gtx + cost231.config.grx - cost231.perdidas.rural(d) - cost231.config.pctx -
                cost231.config.pcon - cost231.config.pac;
        },
    },
    plotTo: (map) => {

        cost231.setConfig();

        if (cost231.featureGroup) {
            map.removeLayer(cost231.featureGroup);
        }

        var tbody = document.querySelector('#data-table tbody');
        tbody.innerHTML = "";
        
        var features = []
        for (var km = 1; km < 26; km++) {

            let potencia = cost231.potencia.urbana(km);
            let ref = clasificar(potencia);

            let inner = [];
            let outer = [];
            for (var heading = 0; heading < 360; heading++) {
                inner.push(L.GeometryUtil.destination(center, heading, (km - 1) * 1000));
                outer.push(L.GeometryUtil.destination(center, heading, km * 1000));
            }

            features.push(L.polygon([outer, inner], {
                weight: 0,
                fillColor: colores[ref],
                fillOpacity: 0.5
            }).bindPopup(`Distancia: ${km}km.\nPotencia ${potencia.toFixed(5)} dBm`));

            let row = tbody.insertRow();
            let dCell = row.insertCell(0);
            let pCell = row.insertCell(1);

            dCell.innerHTML = km;
            pCell.innerHTML = potencia.toFixed(10);
        }

        cost231.featureGroup = L.featureGroup(features);
        map.addLayer(cost231.featureGroup);
    },
    features: new L.FeatureGroup(),
    setConfig: () => {
        // FRECUENCIA (Mhz)
        cost231.config.freq = parseFloat(document.querySelector('#frecuencia').value);
        // POTENCIA TX (dBm)
        cost231.config.ptx = parseFloat(document.querySelector('#potencia-tx').value);
        // GANANCIA ANT TX (dBi)
        cost231.config.gtx = parseFloat(document.querySelector('#ganancia-tx').value);
        // ALTURA ANT TX (m)
        cost231.config.atx = parseFloat(document.querySelector('#altura-tx').value);
        // GANANCIA ANT RX (dBi)
        cost231.config.grx = parseFloat(document.querySelector('#ganancia-rx').value);
        // ALTURA ANT RX (m)
        cost231.config.arx = parseFloat(document.querySelector('#altura-rx').value);
        // SENSIBILIDAD (dBm)
        cost231.config.sen = parseFloat(document.querySelector('#sensibilidad').value);
        // PÉRD. CABLE TX (5dB/100m)
        cost231.config.pctx = parseFloat(document.querySelector('#perdida-cable').value);
        //PÉRD. CONECTOR (dB)
        cost231.config.pcon = parseFloat(document.querySelector('#perdida-conector').value);
        //PÉRD. ACOPLADOR (dB)
        cost231.config.pac = parseFloat(document.querySelector('#perdida-acoplador').value);

        console.log('CONFIG', cost231.config);
    },
    config: {
        freq: 1700, // FRECUENCIA (Mhz)
        ptx: 45, // POTENCIA TX (dBm)
        gtx: 35, // GANANCIA ANT TX (dBi)
        atx: 60, // ALTURA ANT TX (m)
        grx: 10, // GANANCIA ANT RX (dBi)
        arx: 8, // ALTURA ANT RX (m)
        sen: -105, // SENSIBILIDAD (dBm)
        pctx: 3, // PÉRD. CABLE TX (5dB/100m)
        pcon: 6, //PÉRD. CONECTOR (dB)
        pac: 2.5, //PÉRD. ACOPLADOR (dB)
    }
};