'use strict';
const getFinalReport = require('./DAO/get_finance_final_reports');
const { Responses } = require('../../../comun/API_Responses');

module.exports.getDataFinalReport = async () => {

    try {

        console.log("**************** REPORTE FOLIOS PENDIENTES POR LIQUIDAR ****************");
        // OBTENER DATOS DE FINANZAS.
        let resultDataDetalleFoliosPendientes = await getFinalReport.getDataFoliosPendientes();
        if (resultDataDetalleFoliosPendientes.error)
            throw resultDataDetalleFoliosPendientes;

        // NEW VERSION.
        // SUBIR DOCUMENTOS AL BUCKET.
        // const resultUploadFile = await getFinalReport.uploadFiles_2(process.env.N_PENDIENTES_LIQUIDAR_FILE, resultDataDetalleFoliosPendientes)
        // if (resultUploadFile.error)
        //     throw resultUploadFile;

        // GENERAR REPORTE FOLIOS DETALLE PENDIENTES
        let resultGenerateReportsDetallePendientes = await getFinalReport.exportFileToCSV(resultDataDetalleFoliosPendientes, process.env.N_PENDIENTES_LIQUIDAR_FILE);
        if (resultGenerateReportsDetallePendientes.error)
            throw resultGenerateReportsDetallePendientes;

        // SUBIR DOCUMENTOS AL BUCKET.
        const resultUploadFile = await getFinalReport.uploadFiles(resultGenerateReportsDetallePendientes.name, resultGenerateReportsDetallePendientes.path)
        if (resultUploadFile.error)
            throw resultUploadFile;

        // ELIMINAR ARCHIVO EN CARPETA TMP.
        const resultDeleteFile = await getFinalReport.deleteFile(resultGenerateReportsDetallePendientes.path)
        if (resultDeleteFile.error)
            throw resultDeleteFile;

        console.log("**************** REPORTE FOLIOS PENDIENTES POR LIQUIDAR FINALIZADO ****************");

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