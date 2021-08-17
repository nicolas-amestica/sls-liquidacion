'use strict';
const sql = require("mssql");
const conexion = require('../../../../comun/connection');
const queryGenerator = require('../../../../comun/queryGenerator');

// OBTENER DATOS DE FOLIOS.
module.exports.getDataFinanzas = async () => {

    try {

        let valida = await conexion.validarConexionFinanzas();

        if (valida.length > 0) throw valida;

        let pool = await sql.connect(conexion.configFinanzas);

        const QUERY = `
            SELECT
                DISTINCT rut AS RUT
            FROM
                sales
            WHERE
                origin = 'SVL'
                AND folio NOT IN ('0', '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10', '-11')
                AND quantity > 0
                AND (closeout_number = 0 OR closeout_number IS NULL)
                AND (international = -1 OR international IS NULL)
        `;

        console.log("- (1/4) Consultando folios.");

        let result = await pool.request().query(QUERY);
        // let ventasInternacionales = await pool.request().query("select rut AS RUT from sales where id in (9914451, 9914445, 9914443, 9914431,9914426,9914424)");

        sql.close();

        return {
            total: result.rowsAffected[0],
            data: result.recordset
        }

    } catch (error) {

        return { error };

    }

};

// GENERAR CUSTOM QUERY.
module.exports.queryGenerator = async (data) => {

    try {

        console.log("- (2/4) Generando querys agrupadas.");

        let result = await queryGenerator.inQueryGenerator(data);

        if (result.error)
            throw result.error;

        return result;

    } catch (error) {

        return { error };

    }

};

// OBTENER RUT DE LAS COMPAÑIAS QUE TIENEN VENTAS INTERNACIONALES.
module.exports.getDataUser = async (query) => {

    try {

        let valida = await conexion.validarConexionUsuarios();

        if (valida.length > 0) throw valida;

        let pool = await sql.connect(conexion.configUsuarios);

        console.log("- (3/4) Consultando rut de compañias.");

        const QUERY = `
            SELECT
                companies.rut AS RUT,
                CASE
                    WHEN companies.svl_country_id = communes.country_id
                    THEN 0
                    ELSE 1
                END AS INTERNATIONAL
            FROM
                companies,
                communes
            WHERE
                companies.commune_id = communes.id
                AND companies.rut IN (${query.replace(/["]+/g, '')})
            `;

        const RESULT = await pool.request().query(QUERY);

        sql.close();

        return {
            message: "Datos de usuarios obtenidos correctamente.",
            data: {
                total: RESULT.rowsAffected[0],
                data: RESULT.recordset
            }
        }

    } catch (error) {

        return { error };

    }

};

// ACTUALIZAR VENTAS INTERNACIONAL.
module.exports.updateDataVentasInternacionales = async (ventasInt) => {

    try {

        // Quitar duplicados del array de ruts.
        let set = new Set( ventasInt.data.map( JSON.stringify ) )
        let arrSinDuplicaciones = Array.from( set ).map( JSON.parse );

        // Validar datos de conexión a BD.
        let valida = await conexion.validarConexionFinanzas();
        
        if (valida.length > 0) throw valida;

        // Crear pool de conexión.
        const pool = new sql.ConnectionPool(conexion.configFinanzas);

        // Conectar al pool.
        const poolConnect = pool.connect();

        let contador = 0;          // Contador de registros actualizados.
        let rutError = [];         // Almacena rut que no fueron actualizados.
        const TOTAL_REG = arrSinDuplicaciones.length;

        console.log("- (4/4) Actualizando folios.");

        // SI NO EXISTEN FOLIOS PARA ACTUALIZAR RETORNA RESPUSTA.
        if (arrSinDuplicaciones.length == 0)
            return { message: 'No existen folios para actualizar.' }

        // Ejecutar update de todos los folios que cumplan las condiciones para ser internacionales.
        for (const data of arrSinDuplicaciones) {

            try {

                await poolConnect;            
                const request = pool.request();

                // PRODUCCION *****
                const RESULT = await request.query(`UPDATE sales SET international = ${data.INTERNATIONAL} WHERE RUT = '${data.RUT}' AND folio NOT IN ('0','-1','-2','-3','-4','-5','-6','-7','-8','-9','-10','-11') AND quantity > 0 AND (closeout_number IS NULL OR closeout_number = 0) AND origin = 'SVL' AND (international = -1 OR international is null)`);

                console.log(`          * Actualización ${contador} de ${TOTAL_REG}.`);

                // TEST *****
                contador++;

            } catch (error) {

                console.log(error);
                rutError.push(data.RUT);

            }
        }

        // Cerrar pool de conexión.
        pool.close();

        // Retorna respuesta.
        return {
            message: "Folios actualizados correctamente.",
            data: {
                noActualizados: { rutError },
                totalRegistrosActualizados: contador
            }
        };

    } catch (error) {

        return { error };

    }

};