'use strict';

module.exports.inQueryGenerator = async (data) => {

    try {

        let cadena = [];
        
        data.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                cadena.push(value)
            });
        });

        let sData = cadena.join("','")

        sData = "'" + sData + "'";

        return {
            message: "Query concatenada correctamente",
            data: JSON.stringify(sData)
        }

    } catch (error) {

        return { error };

    }

};

module.exports.inQueryGeneratorObjectByFolio = async (data) => {

    try {

        let cadena = [];
        
        data.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                cadena.push(value)
            });
        });

        return cadena

    } catch (error) {

        return { error };

    }

};

module.exports.inQueryGeneratorString = async (arreglo) => {

    try {

        let cadena = arreglo.join(`','`)
        cadena = `'${cadena}'`;

        return cadena

    } catch (error) {

        return { error };

    }

};

module.exports.divideArray = async (arreglo, divider) => {

    try {

        let pedazos = [];

        // DIVIDIR ARREGLOS EN BLOQUES DE 10 ÓRDENES.
        if (arreglo.length > 0) {
            const LONGITUD_PEDAZOS = divider; // Partir en arreglo de X partes
            for (let i = 0; i < arreglo.length; i += LONGITUD_PEDAZOS) {
                let cadena = arreglo.slice(i, i + LONGITUD_PEDAZOS).join(`','`)
                cadena = `'${cadena}'`;
                pedazos.push(cadena);
            }
        }

        return pedazos;

    } catch (error) {

        return { error };

    }

};

module.exports.divideArrayInt = async (arreglo, divider) => {

    try {

        let pedazos = [];

        // DIVIDIR ARREGLOS EN BLOQUES DE 10 ÓRDENES.
        if (arreglo.length > 0) {
            const LONGITUD_PEDAZOS = divider; // Partir en arreglo de X partes
            for (let i = 0; i < arreglo.length; i += LONGITUD_PEDAZOS) {
                let cadena = arreglo.slice(i, i + LONGITUD_PEDAZOS)
                // cadena = `'${cadena}'`;
                pedazos.push(cadena);
            }
        }

        return pedazos;

    } catch (error) {

        return { error };

    }

};

// Divide un array de objetos en pedazos.
module.exports.divideObject = async (objeto, divider) => {

    let bloques = [];

    // DIVIDIR ARREGLO SEGÚN LA CANTIDAD INFORMADA EN LA VARIABLE DE ENTRADA DIVIDER.
    if (Object.keys(objeto).length > 0) {
        for (let i = 0; i < Object.keys(objeto).length; i += divider) {
            let pedazo = objeto.slice(i, i + divider);
            bloques.push(pedazo);
        }
    }

    return bloques;

}

module.exports.queryGeneratorFolioByObject = async (data) => {

    try {

        let cadena = [];

        for (const objeto of data) {
            cadena.push(objeto.folio)
        }

        return cadena;

    } catch (error) {

        return { error };

    }

};

module.exports.inQueryGeneratorStringByScript = async (arreglo) => {

    try {

        let cadena = arreglo.join(`'),('`)
        cadena = `('${cadena}')`;

        return cadena

    } catch (error) {

        return { error };

    }

};