'use strict';
const getFinalReport = require('./DAO/get_finance_final_reports');
const { Responses } = require('../../../comun/API_Responses');

module.exports.getDataFinalReport = async () => {

    try {

        console.log("**************** REPORTE VENTAS LIQUIDADAS ****************");

        // OBTENER DATOS DE FINANZAS.
        let resultDataVentas = await getFinalReport.getDataVentas();
        if (resultDataVentas.error)
            throw resultDataVentas;
            
        // GENERAR REPORTE VENTAS LIQUIDADAS.
        let resultGenerateReportsVentas = await getFinalReport.exportFileToCSV(resultDataVentas, process.env.N_SALES_FILE);
        if (resultGenerateReportsVentas.error)
            throw resultGenerateReportsVentas;

        // SUBIR DOCUMENTOS AL BUCKET.
        let resultUploadFile = await getFinalReport.uploadFiles(resultGenerateReportsVentas.name, resultGenerateReportsVentas.path)
        if (resultUploadFile.error)
            throw resultUploadFile;

        // ELIMINAR ARCHIVO EN CARPETA TMP.
        const resultDeleteFile = await getFinalReport.deleteFile(resultGenerateReportsVentas.path)
        if (resultDeleteFile.error)
            throw resultDeleteFile;

        console.log("**************** REPORTE VENTAS LIQUIDADAS FINALIZADO ****************");

        // RETORNO RESPUESTA SATISFACTORIA.
        return Responses._200({
            message: "PROCESO 3: Finalizado correctamente.",
            data: {
                resultUploadFile
            }
        });

    } catch (error) {

        // Retorno error
        return Responses._400({ message: `PROCESO 3: Ha presentado problemas en su ejecución.`, error });

    }

};