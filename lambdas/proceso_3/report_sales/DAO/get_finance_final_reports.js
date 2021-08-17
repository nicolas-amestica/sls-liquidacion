'use strict';
const sql = require("mssql");
const conexion = require('../../../../comun/connection');
const createFile = require('../../../../comun/createFile');
const S3 = require('../../../../comun/S3');
const dateFormat = require('dateformat');

// OBTENER DATOS VENTAS.
module.exports.getDataVentas = async () => {

    try {

        let valida = await conexion.validarConexionFinanzas();

        if (valida.length > 0) throw valida;

        let pool = await sql.connect(conexion.configFinanzas);

        console.log('- (1/4) Consultando folios.');

        const RESULT = await pool.request().query(`
            SELECT
                sal.id AS id,
                sal.closeout_number AS closeout_number,
                sal.term,
                sal.rut,
                REPLACE(REPLACE(REPLACE(TRIM(REPLACE(TRIM(s.seller_sku), '''', '')), CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS seller_sku,
                sal.quantity,
                REPLACE(REPLACE(REPLACE(sal.sku, CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS sku,
                REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(sal.description, '''', ''), ';', ' '), CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS description,
                sal.percentage AS percentage,
                sal.gross_sale_income AS gross_sale_income,
                sal.IVA_gross_income AS IVA_gross_income,
                sal.net_sale_income AS net_sale_income,
                sal.commission_value AS commission_value,
                sal.net_sale_to_bill AS net_sale_to_bill,
                sal.IVA_to_bill AS IVA_to_bill,
                sal.gross_income_to_bill AS gross_income_to_bill,
                sal.folio AS folio,
                CONVERT(VARCHAR, sal.createdAt, 120) AS createdAt,
                CONVERT(VARCHAR, sal.updatedAt, 120) AS updatedAt,
                CONVERT(VARCHAR, sal.date_of_sale, 120) AS date_of_sale,
                CONVERT(VARCHAR, sal.reception_time, 120) AS reception_time,
                sal.category AS category,
                sal.origin AS origin,
                sal.fulfillment_type AS fulfillment_type,
                sal.purchase_order AS purchase_order,
                sal.sales_commission AS sales_commission,
                sal.discount_value AS discount_value,
                sal.discounted_commission AS discounted_commission,
                sal.total_commission AS total_commission,
                REPLACE(REPLACE(REPLACE(REPLACE(sal.ticket_number, ';', ' '), CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS ticket_number,
                sal.depth AS depth,
                sal.width AS width,
                sal.height AS height,
                sal.stock_management AS stock_management,
                sal.storage AS storage,
                sal.crossdock AS crossdock,
                sal.logistic_train AS logistic_train,
                sal.mks_ctipo AS mks_ctipo,
                sal.tienda_key AS tienda_key,
                sal.tienda_usu AS tienda_usu,
                sal.local_vent_key AS local_vent_key,
                sal.local_vent_usu AS local_vent_usu,
                sal.local_desp_key AS local_desp_key,
                sal.local_desp_usu AS local_desp_usu,
                sal.local_inter_key AS local_inter_key,
                sal.local_inter_usu AS local_inter_usu,
                sal.descto_item AS descto_item,
                sal.descto_prorrat AS descto_prorrat,
                sal.dispatch_type AS dispatch_type,
                sal.price_svl AS price_svl,
                sal.international AS international,
                sal.business AS business,
                sal.country AS country,
                clo.id AS id_clo,
                clo.number AS number_clo,
                clo.term AS term_clo,
                clo.rut AS rut_clo,
                clo.name AS name_clo,
                CONVERT(VARCHAR, clo.createdAt, 120) AS createdAt_clo,
                CONVERT(VARCHAR, clo.updatedAt, 120) AS updatedAt_clo,
                clo.gross_income_to_bill AS gross_income_to_bill_clo,
                clo.commission AS commission_clo,
                clo.gross_sale_income AS gross_sale_income_clo,
                clo.origin AS origin_clo,
                CONVERT(VARCHAR, clo.term_date, 120) AS term_date_clo,
                clo.business AS business_clo,
                clo.country AS country_clo
            FROM
                sales sal
                INNER JOIN closeouts clo ON sal.closeout_number = clo.[number]
                LEFT JOIN skus s ON sal.sku=s.sku
            WHERE
                1 = 1
                AND clo.origin = 'SVL'
                AND clo.term = '${dateFormat(new Date(), "yyyy-mm-dd")}'`);
                // AND clo.term = '2021-07-23'`);

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