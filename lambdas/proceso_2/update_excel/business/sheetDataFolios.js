'use strict';
const XLSX = require('xlsx');
const join = require('join-array');

module.exports.getData = async (fullPath, hoja) => {

    try {

        // Columna Identificando el nombre de la hoja
        const columnName = hoja;
        // Leer excel
        const excel = XLSX.readFile(fullPath);
        // Identificar el nombre de la hoja
        var nombreHoja = excel.SheetNames.filter(hoja => {
            if (hoja === columnName)
                return hoja;
        });
        // Almacenar los datos de la hoja en la variable data
        let data = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);
        // Total de registros
        let total = data.length;

        return {
            message: `Datos ${columnName} obtenidos correctamente.`,
            data: { total, data },
        }

    } catch (error) {
        
        console.log(error);
        return { error }

    }

}

module.exports.formatData = (object, identity) => {

    try {

        var data = object.map(key => {
            return key[identity]
        });

        const config = {
            array: data,
            separator: `', '`,
            last: `', '`,
            max: 1000000
        };

        let cadena = join(config); 
        cadena = "'" + cadena + "'";

        return cadena

    } catch (error) {
        
        console.log(error);
        return { error }

    }

}

module.exports.separateData20000 = (object) => {

    try {

        let arrResult = [];

        let porcion = Math.floor(object.length / 8);

        arrResult.push(object.slice(0, porcion));
        arrResult.push(object.slice(porcion, porcion*2));
        arrResult.push(object.slice(porcion*2, porcion*3));
        arrResult.push(object.slice(porcion*3, porcion*4));
        arrResult.push(object.slice(porcion*4, porcion*5));
        arrResult.push(object.slice(porcion*5, porcion*6));
        arrResult.push(object.slice(porcion*6, porcion*7));
        arrResult.push(object.slice(porcion*7));

        return arrResult;

    } catch (error) {

        console.log(error);
        return { error }

    }

}