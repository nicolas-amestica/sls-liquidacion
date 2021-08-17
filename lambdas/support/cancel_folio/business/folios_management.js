'use strict';
const conexion = require('../../../../comun/connection');
const DeleteDuplicates = require('../../../../comun/deleteDuplicates');
const QueryGenerator = require('../../../../comun/queryGenerator');
const sql = require("mssql");

// Cancela todos los folios informados.
module.exports.cancel_folios = async (folios) => {

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