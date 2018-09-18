var lee = {
    ahre: {
        media: () => {
            return (1.1 * Math.log10(lee.config.freq) - 0.7) * lee.config.arx - (1.56 * Math.log10(lee.config.freq) -
                0.8);
        },
        grande: () => {
            return 3.2 * Math.pow((Math.log10(11.75 * (lee.config.arx))), 2) - 4.97;
        }
    },
    alpha: () => {
        var alpha1 = Math.pow(lee.config.atx/30.5,2);
        var alpha2 = Math.pow(lee.config.arx/3,2);
        var alpha3 = 31.62/10;
        var alpha4 = 3162.3/4;
        var alpha5 = 10/1;
        return alpha1*alpha2*alpha3*alpha4*alpha5;
    },
    potencia: {
        urbana: (d) => {
            return -53.9-38.4*Math.log10(d)-3*Math.log10(lee.config.freq/900)+10*Math.log10(lee.alpha());
        }
    },    
    featureGroup: {},
    plotTo: (map) => {
        
        lee.setConfig();

        if(lee.featureGroup){
            map.removeLayer(lee.featureGroup);
        }

        var tbody = document.querySelector('#data-table tbody');
        tbody.innerHTML = "";
                
        var features = []
        for (var km = 1; km < 26; km++) {

            let potencia = lee.potencia.urbana(km);
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

        lee.featureGroup =  L.featureGroup(features);
        map.addLayer(lee.featureGroup);
    },
    setConfig: () => {
        // FRECUENCIA (Mhz)
        lee.config.freq = parseFloat(document.querySelector('#frecuencia').value);
        // POTENCIA TX (dBm)
        lee.config.ptx = parseFloat(document.querySelector('#potencia-tx').value);
        // GANANCIA ANT TX (dBi)
        lee.config.gtx = parseFloat(document.querySelector('#ganancia-tx').value);
        // ALTURA ANT TX (m)
        lee.config.atx = parseFloat(document.querySelector('#altura-tx').value);
        // GANANCIA ANT RX (dBi)
        lee.config.grx = parseFloat(document.querySelector('#ganancia-rx').value);
        // ALTURA ANT RX (m)
        lee.config.arx = parseFloat(document.querySelector('#altura-rx').value);
        // SENSIBILIDAD (dBm)
        lee.config.sen = parseFloat(document.querySelector('#sensibilidad').value);
         // PÉRD. CABLE TX (5dB/100m)
        lee.config.pctx = parseFloat(document.querySelector('#perdida-cable').value);
        //PÉRD. CONECTOR (dB)
        lee.config.pcon = parseFloat(document.querySelector('#perdida-conector').value);
        //PÉRD. ACOPLADOR (dB)
        lee.config.pac = parseFloat(document.querySelector('#perdida-acoplador').value);

        console.log('CONFIG', lee.config);
    },
    config: {
        freq: 2100, // FRECUENCIA (Mhz)
        ptx: 45, // POTENCIA TX (dBm)
        gtx: 35, // GANANCIA ANT TX (dBi)
        atx: 60, // ALTURA ANT TX (m)
        grx: 10, // GANANCIA ANT RX (dBi)
        arx: 12, // ALTURA ANT RX (m)
        sen: -105, // SENSIBILIDAD (dBm)
        pctx: 3, // PÉRD. CABLE TX (5dB/100m)
        pcon: 6, //PÉRD. CONECTOR (dB)
        pac: 2.5, //PÉRD. ACOPLADOR (dB)
    }
};