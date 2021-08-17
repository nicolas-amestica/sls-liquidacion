'use strict';
const getFinalReport = require('./DAO/get_finance_final_reports');
const { Responses } = require('../../../comun/API_Responses');

module.exports.getDataFinalReport = async () => {

    try {

        console.log("**************** REPORTE SELLERS LIQUIDADOS ****************");

        // OBTENER DATOS DE FINANZAS.
        let resultDataSellers = await getFinalReport.getDataSellers();
        if (resultDataSellers.error)
            throw resultDataSellers;

        // GENERAR REPORTE SELLERS.
        let resultGenerateReportsSellers = await getFinalReport.exportFileToCSV(resultDataSellers, process.env.N_SELLERS_FILE);
        if (resultGenerateReportsSellers.error)
            throw resultGenerateReportsSellers;

        // SUBIR DOCUMENTOS AL BUCKET.
        const resultUploadFile = await getFinalReport.uploadFiles(resultGenerateReportsSellers.name, resultGenerateReportsSellers.path)
        if (resultUploadFile.error)
            throw resultUploadFile;

        // ELIMINAR ARCHIVO EN CARPETA TMP.
        const resultDeleteFile = await getFinalReport.deleteFile(resultGenerateReportsSellers.path)
        if (resultDeleteFile.error)
            throw resultDeleteFile;

        console.log("**************** REPORTE SELLERS LIQUIDADOS FINALIZADO ****************");

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