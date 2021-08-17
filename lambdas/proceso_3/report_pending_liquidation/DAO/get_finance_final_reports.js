'use strict';
const sql = require("mssql");
const conexion = require('../../../../comun/connection');
const createFile = require('../../../../comun/createFile');
const S3 = require('../../../../comun/S3');
const dateFormat = require('dateformat');

// OBTENER DATOS FOLIOS PENDIENTES.
module.exports.getDataFoliosPendientes = async () => {

    try {

        let valida = await conexion.validarConexionFinanzas();

        if (valida.length > 0) throw valida;

        let pool = await sql.connect(conexion.configFinanzas);

        console.log('- (1/4) Consultando folios.');

        const RESULT = await pool.request().query(`
            SELECT
                sl.id,
                sl.closeout_number,
                sl.term,
                sl.rut,
                sl.quantity,
                sl.sku,
                REPLACE(REPLACE(REPLACE(TRIM(REPLACE(sk.seller_sku, '''', '')), CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS seller_sku,
                REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(sk.product_name, '''', ''), ';', ' '), CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS description,
                sl.percentage,
                sl.gross_sale_income,
                sl.IVA_gross_income,
                sl.net_sale_income,
                sl.commission_value,
                sl.net_sale_to_bill,
                sl.IVA_to_bill,
                sl.gross_income_to_bill,
                sl.folio,
                CONVERT(VARCHAR, sl.createdAt, 120) AS createdAt,
                CONVERT(VARCHAR, sl.updatedAt, 120) AS updatedAt,
                CONVERT(VARCHAR, sl.date_of_sale, 120) AS date_of_sale,
                CONVERT(VARCHAR, sl.reception_time, 120) AS reception_time,
                sl.category,
                sl.origin,
                sl.fulfillment_type,
                sl.purchase_order,
                sl.sales_commission,
                sl.discount_value,
                sl.discounted_commission,
                sl.total_commission,
                REPLACE(REPLACE(REPLACE(REPLACE(sl.ticket_number, ';', ' '), CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS ticket_number,
                sl.international,
                sl.business,
                sl.country
            FROM
                sales sl
                LEFT JOIN skus sk ON sl.sku = sk.sku 
            WHERE
                sl.origin = 'SVL'
                AND sl.folio NOT IN ('0','-1','-2','-3','-4','-5','-6','-7','-8','-9','-10','-11')
                AND sl.quantity > 0
                AND (sl.closeout_number = 0 OR sl.closeout_number IS NULL)
                AND sl.international = 0`);

        sql.close();

        return RESULT.recordset;

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