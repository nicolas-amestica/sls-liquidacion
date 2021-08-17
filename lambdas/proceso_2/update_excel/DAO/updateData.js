'use strict';
const sql = require("mssql");
const conexion = require('../../../../comun/connection');
const DataExcel = require('../business/sheetDataFolios');
const groupBy = require('lodash.groupby');

module.exports.updateDataCancelados = async (data) => {

    try {

        // VALIDAR CONEXIÓN A BASE DE DATOS.
        let valida = await conexion.validarConexionFinanzas();

        if (valida.length > 0) throw valida;

        // SE ALMACENAN LAS QUERYS PARA LUEGO SER EJECUTADAS.
        let querys = [];

        // SI EXISTEN MÁS DE 10 MIL REGISTROS, SE DIVIDE EN 2 PARA QUE NO SE CAIGA LA CONEXIÓN.
        if (data.length >= 10000) {

            // AGRUPAR OMBS_ABAST CUANDO LA CANTIDAD SUPERA LOS 20000 REGISTROS
            let separateObject = DataExcel.separateData20000(data);
            separateObject.forEach(element => {
                querys.push(`UPDATE sales SET term = folio, folio = '-4', updatedAt = getDate() FROM sales WHERE origin = 'SVL' AND (closeout_number IS NULL OR closeout_number = 0) AND folio IN (${DataExcel.formatData(element, 'FOLIO')})`);
            });
        } else {
            querys.push(`UPDATE sales SET term = folio, folio = '-4', updatedAt = getDate() FROM sales WHERE origin = 'SVL' AND (closeout_number IS NULL OR closeout_number = 0) AND folio IN (${DataExcel.formatData(data, 'FOLIO')})`);
        }

        // CREAR POOL DE CONEXION
        const pool = new sql.ConnectionPool(conexion.configFinanzas);

        // CONECTAR AL POOL
        const poolConnect = pool.connect();

        let queryError = [];         // Almacena rut que no fueron actualizados.

        console.log("   1.1. Cantidad updates agrupados: ", querys.length);

        let cont = 1;

        for (const query of querys) {

            try {

                await poolConnect;            
                const request = pool.request();

                // PRODUCCION *****
                const result = await request.query(query);

                console.log("       - Update nro " + cont + " de " + querys.length + " ejecutado.");
                cont++;


            } catch (error) {

                console.log(error);
                console.log(query);
                queryError.push(query);

            }
        }

        sql.close();

        return {
            message: "Datos actualizados correctamente.",
            data: {
                totalGrupos: querys.length,
                totalRegistros: data.length,
                // querys,
                queryError
            }
        }

    } catch (error) {

        return { error };

    }

};

module.exports.updateDataSinCategoria = async (data) => {

    try {

        // CONECTAR A LA BASE DE DATOS
        let valida = await conexion.validarConexionFinanzas();
        if (valida.length > 0) throw valida;

        // AGRUPAR POR EL IDENTIFICADOR LOS DATOS DE LA VARIABLE DE ENTRADA
        let groups = groupBy(data , 'category');

        // ITERAR GRUPOS, CREAR QUERYSTRING Y CREAR QUERY.
        let querys = Object.keys(groups).map(category => {
            let queryString = `UPDATE sales SET category = '${category}', updatedAt = getDate() WHERE sku IN (${DataExcel.formatData(groups[category], "SKU")}) AND origin = 'SVL' AND category IS NULL AND (closeout_number IS NULL OR closeout_number = 0)`;
            return queryString;
        });

        // CREAR POOL DE CONEXION
        const pool = new sql.ConnectionPool(conexion.configFinanzas);

        // CONECTAR AL POOL
        const poolConnect = pool.connect();

        let queryError = [];         // Almacena rut que no fueron actualizados.

        console.log("   2.1. Cantidad updates agrupados: ", querys.length);

        let cont = 1;

        // ITERAR CATEGORIAS Y EJECUTAR LAS QUERYS.
        for (const query of querys) {

            try {

                await poolConnect;            
                const request = pool.request();

                // PRODUCCION *****
                const result = await request.query(query);

                console.log("       - Update nro " + cont + " de " + querys.length + " ejecutado.");
                cont++;

            } catch (error) {

                console.log(error);
                console.log(query);
                queryError.push(query);

            }
        }

        // Cerrar pool de conexión.
        pool.close();

        return {
            message: "Datos actualizados correctamente.",
            data: {
                totalGrupos: querys.length,
                totalRegistros: data.length,
                querys,
                queryError
            }
        }

    } catch (error) {

        return { error };

    }

};

module.exports.updateDataSinDespacho = async (data) => {

    try {

        // CONECTAR A LA BASE DE DATOS
        let valida = await conexion.validarConexionFinanzas();
        if (valida.length > 0) throw valida;

        // AGRUPAR POR EL IDENTIFICADOR LOS DATOS DE LA VARIABLE DE ENTRADA
        let groups = groupBy(data , 'OMS_ABAST');

        let querys = [];

        // ITERAR GRUPOS, CREAR QUERYSTRING Y CREAR QUERY.
        let querysGroups = Object.keys(groups).map(oms_abast => {

            // VALIDAR SI ES NECESARIO AGRUPAR O NO
            if (groups[oms_abast].length > 20000) {

                // AGRUPAR OMBS_ABAST CUANDO LA CANTIDAD SUPERA LOS 20000 REGISTROS
                let separateObject = DataExcel.separateData20000(groups[oms_abast]);
                separateObject.forEach(element => {
                    querys.push(`update sales set fulfillment_type = '${oms_abast}', updatedAt = getDate() where folio in (${DataExcel.formatData(element, "FOLIO")}) and (closeout_number is null or closeout_number = 0) and origin = 'SVL'`);
                });

            } else {
                querys.push(`update sales set fulfillment_type = '${oms_abast}', updatedAt = getDate() where folio in (${DataExcel.formatData(groups[oms_abast], "FOLIO")}) and (closeout_number is null or closeout_number = 0) and origin = 'SVL'`);
            }

            return querys;
        });

        // CREAR POOL DE CONEXION
        const pool = new sql.ConnectionPool(conexion.configFinanzas);

        // CONECTAR AL POOL
        const poolConnect = pool.connect();

        let queryError = [];         // Almacena rut que no fueron actualizados.

        console.log("   3.1. Cantidad updates agrupados: ", querys.length);

        let cont = 1;

        // ITERAR CATEGORIAS Y EJECUTAR LAS QUERYS.
        for (const query of querys) {

            try {

                await poolConnect;            
                const request = pool.request();

                // PRODUCCION *****
                const result = await request.query(query);

                console.log("       - Update nro " + cont + " de " + querys.length + " ejecutado.");
                cont++;

            } catch (error) {

                console.log(error);
                console.log(query);
                queryError.push(query);

            }
        }

        // Cerrar pool de conexión.
        pool.close();

        return {
            message: "Datos actualizados correctamente.",
            data: {
                totalGrupos: querys.length,
                totalRegistros: data.length,
                // querys,
                queryError
            }
        }

    } catch (error) {

        return { error };

    }

};

module.exports.updateDataPendientes = async (data) => {

    try {

        // CONECTAR A LA BASE DE DATOS
        let valida = await conexion.validarConexionFinanzas();
        if (valida.length > 0) throw valida;

        // AGRUPAR POR EL IDENTIFICADOR LOS DATOS DE LA VARIABLE DE ENTRADA
        let groups = groupBy(data , 'RECEPCION');

        // ITERAR GRUPOS, CREAR QUERYSTRING Y CREAR QUERY.
        let querys = Object.keys(groups).map(RECEPCION => {
            let queryString = `UPDATE sales SET reception_time = '${RECEPCION}', updatedAt = getDate() WHERE FOLIO IN (${DataExcel.formatData(groups[RECEPCION], "FOLIO")}) AND origin = 'SVL' AND (closeout_number IS NULL OR closeout_number = 0)`;
            return queryString;
        });

        // CREAR POOL DE CONEXION
        const pool = new sql.ConnectionPool(conexion.configFinanzas);

        // CONECTAR AL POOL
        const poolConnect = pool.connect();

        let queryError = [];         // Almacena rut que no fueron actualizados.

        console.log("   4.1. Cantidad updates agrupados: ", querys.length);

        let cont = 1;

        // ITERAR CATEGORIAS Y EJECUTAR LAS QUERYS.
        for (const query of querys) {

            try {

                await poolConnect;            
                const request = pool.request();

                // PRODUCCION *****
                const result = await request.query(query);

                console.log("       - Update nro " + cont + " de " + querys.length + " ejecutado.");
                cont++;

            } catch (error) {

                console.log(error);
                console.log(query);
                queryError.push(query);

            }
        }

        // Cerrar pool de conexión.
        pool.close();

        return {
            message: "Datos actualizados correctamente.",
            data: {
                totalGrupos: querys.length,
                totalRegistros: data.length,
                // querys,
                queryError
            }
        }

    } catch (error) {

        return { error };

    }

};