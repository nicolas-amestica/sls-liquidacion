'use strict';
const sql = require("mssql");
const conexion = require('../../../../comun/connection');
const createFile = require('../../../../comun/createFile');
const S3 = require('../../../../comun/S3');
const dateFormat = require('dateformat');

// OBTENER DATOS SELLERS.
module.exports.getDataSellers = async () => {

    try {

        let valida = await conexion.validarConexionFinanzas();

        if (valida.length > 0) throw valida;

        let pool = await sql.connect(conexion.configFinanzas);

        console.log("- (1/4) Consultando sellers.");

        const RESULT = await pool.request().query(`
            SELECT
                REPLACE(REPLACE(REPLACE(id, CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS id,
                REPLACE(REPLACE(REPLACE(number, CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS number,
                REPLACE(REPLACE(REPLACE(term, CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS term,
                REPLACE(REPLACE(REPLACE(rut, CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS rut,
                REPLACE(REPLACE(REPLACE(name, CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS name,
                REPLACE(REPLACE(REPLACE(CAST(CAST(createdAt AS date) AS varchar), CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS createdAt,
                REPLACE(REPLACE(REPLACE(CAST(CAST(updatedAt AS date) AS varchar), CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS updatedAt,
                gross_income_to_bill,
                commission,
                gross_sale_income,
                REPLACE(REPLACE(REPLACE(origin, CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS origin,
                REPLACE(REPLACE(REPLACE(CAST(CAST(term_date AS date) AS varchar), CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS term_date,
                REPLACE(REPLACE(REPLACE(business, CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS business,
                REPLACE(REPLACE(REPLACE(country, CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS country
            FROM
                closeouts
            WHERE
                term = '${dateFormat(new Date(), "yyyy-mm-dd")}'`);
            // term = '2021-07-23'`);

        sql.close();

        return RESULT.recordset

    } catch (error) {

        return { error };

    }

};

// EXPORTAR DATOS A CSV.
module.exports.exportFileToCSV = async (data, fileName) => {

    try {

        console.log("- (2/4) Generando reporte.");

        if (data.length == 0) {
            throw 'No existen datos a exportar.';
        }

        const fullFileName = `${fileName}_${dateFormat(new Date(), "yyyymmddHMM")}`;

        const resultado = await createFile.exportDataToCSV(data, fullFileName);

        if (resultado.error)
            throw resultado;

        return resultado;

    } catch (error) {

        return { error };

    }

}

// SUBIR ARCHIVO AL BUCKET S3.
module.exports.uploadFiles = async (fileName, filePath) => {

    try {

        console.log("- (3/4) Subiendo reporte a bucket S3.");

        // ENVIAR PROCESO UPLOAD S3, SE ENVIAN 3 PARAMETROS; fileName, filePath, bucket.
        let result = await S3.uploadFromFile(fileName, filePath, process.env.BUCKET_LIQ_PROC_3);

        if (result.error)
            throw result.error;

        result.Name = fileName;

        return result;

    } catch (error) {

        return { error };

    }

}

// ELIMINAR REPORTE DE CARPETA TEMPORAL.
module.exports.deleteFile = async (filePath) => {

    try {

        console.log("- (4/4) Eliminando reporte CSV de carpeta temporal.");

        // ELIMINAR ARCHIVO DE TMP.
        let result = await createFile.deleteFile(filePath);

        if (result.error)
            throw result.error;

        return result;

    } catch (error) {

        return { error };

    }

}