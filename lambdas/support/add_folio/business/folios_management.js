'use strict';
const conexion = require('../../../../comun/connection');
const DeleteDuplicates = require('../../../../comun/deleteDuplicates');
const QueryGenerator = require('../../../../comun/queryGenerator');
const sql = require("mssql");

// Identificar Folios Canceladois.
module.exports.find_canceled_folios = async (folios) => {

    try {

        let aConjunto = [];

        let groupFolios = await QueryGenerator.divideObject(folios, 10);

        // Validar datos de conexión a BD.
        let valida = await conexion.validarConexionFinanzas();

        if (valida.length > 0) throw valida;

        // Crear pool de conexión.
        const pool = new sql.ConnectionPool(conexion.configFinanzas);

        // Conectar al pool.
        const poolConnect = pool.connect();

        // Ejecutar update de todos los folios que cumplan las condiciones para ser internacionales.
        for (const data of groupFolios) {

            try {

                // OBTENER ARREGLO DE FOLIOS DE DATA.
                let aFolios = await QueryGenerator.queryGeneratorFolioByObject(data);

                // CREAR STRING DE FOLIOS PARA INDEXARLO EN LA CONSULTA SQL.
                let sFolios = await QueryGenerator.inQueryGeneratorString(aFolios);

                await poolConnect;
                const request = pool.request();

                // let query = `SELECT * FROM sales WHERE FOLIO IN (N'0', N'-1', N'-2', N'-3', N'-4', N'-5', N'-6', N'-7', N'-8', N'-9', N'-10', N'-11') AND term IN (${sFolios});`;
                let query = `SELECT id FROM sales WHERE folio NOT IN (N'0', N'-1', N'-2', N'-3', N'-4', N'-5', N'-6', N'-7', N'-8', N'-9', N'-10', N'-11') AND folio IN (${sFolios});`;

                const result = await request.query(query);

                aConjunto.push(result.recordset);

            } catch (error) {

                console.log(error);

            }
        }

        // JUNTAR ARREGLOS DE OBJETOS IDS DE FOLIOS.
        var merged = [].concat.apply([], aConjunto);

        // CREAR ARREGLO DE STRINGS DE IDS DE FOLIOS.
        let sConjutoFolios = await QueryGenerator.inQueryGeneratorObjectByFolio(merged);

        // Cerrar pool de conexión.
        pool.close();

        // Retorna respuesta.
        return sConjutoFolios;

    } catch (error) {

        return { error };

    }

};

// Verificar que los folios cancelados no estén duplicados.
module.exports.find_duplicate_folios = async (folios) => {

    try {

        let aConjunto = [];

        let groupFolios = await QueryGenerator.divideArrayInt(folios, 10);

        // Validar datos de conexión a BD.
        let valida = await conexion.validarConexionFinanzas();

        if (valida.length > 0) throw valida;

        // Crear pool de conexión.
        const pool = new sql.ConnectionPool(conexion.configFinanzas);

        // Conectar al pool.
        const poolConnect = pool.connect();

        // Ejecutar update de todos los folios que cumplan las condiciones para ser internacionales.
        for (const data of groupFolios) {

            try {

                await poolConnect;
                const request = pool.request();

                let query = `SELECT a.id_duplicate FROM sales s INNER JOIN (SELECT id AS id_duplicate, sku, term, date_of_sale FROM sales WHERE id IN (${data})) a ON s.folio = a.term AND s.sku = a.sku AND s.date_of_sale = a.date_of_sale;`;

                const result = await request.query(query);

                console.log(query);

                aConjunto.push(result.recordset);

            } catch (error) {

                console.log(error);

            }
        }

        console.log(aConjunto);

        // JUNTAR ARREGLOS DE OBJETOS IDS DE FOLIOS.
        // var merged = [].concat.apply([], aConjunto);

        // CREAR ARREGLO DE STRINGS DE IDS DE FOLIOS.
        // let sConjutoFolios = await QueryGenerator.inQueryGeneratorObjectByFolio(merged);

        // Cerrar pool de conexión.
        pool.close();

        // Retorna respuesta.
        // return sConjutoFolios;
        return "hola"

    } catch (error) {

        return { error };

    }

};

// Agregar folios informados.
module.exports.add_folios = async (folios) => {

    try {

        // Quitar duplicados del array de ruts.
        const foliosSinDuplicados = await DeleteDuplicates.deleteDuplicatesInteger(folios);

        let groupFolios = await QueryGenerator.divideArrayInt(foliosSinDuplicados, 10000);

        // // Validar datos de conexión a BD.
        let valida = await conexion.validarConexionFinanzas();

        if (valida.length > 0) throw valida;

        // Crear pool de conexión.
        const pool = new sql.ConnectionPool(conexion.configFinanzas);

        // Conectar al pool.
        const poolConnect = pool.connect();

        // Ejecutar update de todos los folios que cumplan las condiciones para ser internacionales.
        for (const data of groupFolios) {

            try {

                await poolConnect;          
                const request = pool.request();

                 // PRODUCCION *****
                // const result = await request.query(`
                //     UPDATE
                //         sales
                //     SET
                //         term = folio,
                //         folio = -4,
                //         updatedAt = getdate()
                //     FROM
                //         sales
                //     WHERE
                //         origin = 'SVL'
                //         AND (closeout_number IS NULL OR closeout_number = 0)
                //         AND folio NOT IN (N'0', N'-1', N'-2', N'-3', N'-4', N'-6', N'-7', N'-8', N'-9', N'-10', N'-11')
                //         AND id IN (${data})`);

                // TEST *****
                let query = `
                    UPDATE
                        sales
                    SET
                        term = folio,
                        folio = -4,
                        updatedAt = getdate()
                    FROM
                        sales
                    WHERE
                        origin = 'SVL'
                        AND (closeout_number IS NULL OR closeout_number = 0)
                        AND folio NOT IN (N'0', N'-1', N'-2', N'-3', N'-4', N'-6', N'-7', N'-8', N'-9', N'-10', N'-11')
                        AND id IN (${data})`;

                // console.log(query);

            } catch (error) {

                console.log(error);

            }
        }

        // Cerrar pool de conexión.
        pool.close();

        // Retorna respuesta.
        return foliosSinDuplicados;

    } catch (error) {

        return { error };

    }

};