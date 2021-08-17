'use strict';
const sql = require("mssql");
const conexion = require('../../../../comun/connection');
const createFile = require('../../../../comun/createFile');
const S3 = require('../../../../comun/S3');

// OBTENER DATOS.
module.exports.getDataFinanzas = async () => {

    try {

        let valida = await conexion.validarConexionFinanzas();

        if (valida.length > 0) throw valida;

        let pool = await sql.connect(conexion.configFinanzas);

        console.log("- (1/4) Consultando folios.");

        let result = await pool.request().query("SELECT folio AS FOLIO, sku AS SKU, category AS CATEGORY FROM sales WHERE origin = 'SVL' AND folio NOT IN ('0','-1','-2','-3','-4','-5','-6','-7','-8','-9','-10','-11') AND quantity > 0 AND (closeout_number = 0 OR closeout_number IS NULL) AND category IS NULL");
        // let result = await pool.request().query("select folio AS FOLIO, sku AS SKU, category AS CATEGORY from sales where id in (9914451, 9914445, 9914443, 9914431)");

        sql.close();

        return {
            total: result.rowsAffected[0],
            data: result.recordset
        }

    } catch (error) {

        return { error };

    }

};

// EXPORTAR DATOS A CSV.
module.exports.exportFileToCSV = async (data, fileName) => {

    try {

        console.log("- (2/4) Generando reporte.");

        const resultado = await createFile.exportData(data, fileName);

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
        let result = await S3.upload(fileName, filePath, process.env.BUCKET_LIQ_PROC_1);

        if (result.error)
            throw result.error;

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