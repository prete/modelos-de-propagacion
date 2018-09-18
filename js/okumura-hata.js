var okumuraHata = {
    ahre: {
        media: () => {
            return (1.1 * Math.log10(okumuraHata.config.freq) - 0.7) * okumuraHata.config.arx - (1.56 * Math.log10(okumuraHata.config.freq) -
                0.8);
        },
        grande: () => {
            return 3.2 * Math.pow((Math.log10(11.75 * (okumuraHata.config.arx))), 2) - 4.97;
        }
    },
    perdidas: {
        grande: (d) => {
            return 69.55 + 26.16 * Math.log10(okumuraHata.config.freq) - 13.82 * Math.log10(okumuraHata.config.atx) - okumuraHata.ahre.grande() +
                (44.9 - 6.55 * Math.log10(okumuraHata.config.atx)) * Math.log10(d);
        },
        media: (d) => {
            return 69.55 + 26.16 * Math.log10(okumuraHata.config.freq) - 13.82 * Math.log10(okumuraHata.config.atx) - okumuraHata.ahre.media() +
                (44.9 - 6.55 * Math.log10(okumuraHata.config.atx)) * Math.log10(d);
        },
        suburbana: (d) => {
            return okumuraHata.media(d) - 2 * Math.pow((Math.log10(okumuraHata.config.freq / 28)), 2) - 5.4;
        },
        rural: (d) => {
            return okumuraHata.media(d) - 4.78 * Math.pow((Math.log10(okumuraHata.config.freq)), 2) + 18.33 * Math.log10(
                okumuraHata.config.freq) - 40.94;
        },
        libre: (d) => {
            return 32.46 + 20 * Math.log10(okumuraHata.config.freq) + 20 * Math.log10(d);
        }
    },
    potencia: {
        urbana: (d) => {
            return okumuraHata.config.ptx + okumuraHata.config.gtx + okumuraHata.config.grx - okumuraHata.perdidas.media(d) - okumuraHata.config.pctx -
                okumuraHata.config.pcon - okumuraHata.config.pac;
        },
        suburbana: (d) => {
            return okumuraHata.config.ptx + okumuraHata.config.gtx + okumuraHata.config.grx - okumuraHata.perdidas.suburbana(d) - okumuraHata.config.pctx -
                okumuraHata.config.pcon - okumuraHata.config.pac;
        },
        rural: (d) => {
            return okumuraHata.config.ptx + okumuraHata.config.gtx + okumuraHata.config.grx - okumuraHata.perdidas.rural(d) - okumuraHata.config.pctx -
                okumuraHata.config.pcon - okumuraHata.config.pac;
        },
    },
    setConfig: () => {
        // FRECUENCIA (Mhz)
        okumuraHata.config.freq = parseFloat(document.querySelector('#frecuencia').value);
        // POTENCIA TX (dBm)
        okumuraHata.config.ptx = parseFloat(document.querySelector('#potencia-tx').value);
        // GANANCIA ANT TX (dBi)
        okumuraHata.config.gtx = parseFloat(document.querySelector('#ganancia-tx').value);
        // ALTURA ANT TX (m)
        okumuraHata.config.atx = parseFloat(document.querySelector('#altura-tx').value);
        // GANANCIA ANT RX (dBi)
        okumuraHata.config.grx = parseFloat(document.querySelector('#ganancia-rx').value);
        // ALTURA ANT RX (m)
        okumuraHata.config.arx = parseFloat(document.querySelector('#altura-rx').value);
        // SENSIBILIDAD (dBm)
        okumuraHata.config.sen = parseFloat(document.querySelector('#sensibilidad').value);
         // PÉRD. CABLE TX (5dB/100m)
        okumuraHata.config.pctx = parseFloat(document.querySelector('#perdida-cable').value);
        //PÉRD. CONECTOR (dB)
        okumuraHata.config.pcon = parseFloat(document.querySelector('#perdida-conector').value);
        //PÉRD. ACOPLADOR (dB)
        okumuraHata.config.pac = parseFloat(document.querySelector('#perdida-acoplador').value);

        console.log('CONFIG', okumuraHata.config);
    },
    featureGroup: {},
    plotTo: (map) => {

        okumuraHata.setConfig();

        if(okumuraHata.featureGroup){
            map.removeLayer(okumuraHata.featureGroup);
        }

        var tbody = document.querySelector('#data-table tbody');
        tbody.innerHTML = "";
        
        var features = []

        for (var km = 1; km < 26; km++) {

            let potencia = okumuraHata.potencia.urbana(km);
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

        okumuraHata.featureGroup =  L.featureGroup(features);
        map.addLayer(okumuraHata.featureGroup);
    },
    config: {
        freq: 850,  // FRECUENCIA (Mhz)
        ptx: 40,    // POTENCIA TX (dBm)
        gtx: 35,    // GANANCIA ANT TX (dBi)
        atx: 35,    // ALTURA ANT TX (m)
        grx: 10,    // GANANCIA ANT RX (dBi)
        arx: 1.2,   // ALTURA ANT RX (m)
        sen: -105,  // SENSIBILIDAD (dBm)
        pctx: 1.75, // PÉRD. CABLE TX (5dB/100m)
        pcon: 6,    //PÉRD. CONECTOR (dB)
        pac: 2.5,   //PÉRD. ACOPLADOR (dB)
    }
};