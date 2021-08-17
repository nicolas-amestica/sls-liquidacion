'use strict';
const getInitialReport = require('./DAO/get_finance_initial_reports');
const { Responses } = require('../../../comun/API_Responses');

module.exports.maintanceTask = async () => {

    try {

        console.log("**************** REPORTE FOLIOS SIN CATEGORIA ****************");

        // OBTENER DATOS DE FOLIOS SIN CATEGORIA.
        let resultGetData = await getInitialReport.getDataFinanzas();
        if (resultGetData.error)
            throw resultGetData;

        // GENERAR REPORTE FOLIOS SIN CATEGORIA.
        let resultGenerateReport = await getInitialReport.exportFileToCSV(resultGetData.data, process.env.N_SIN_CATEGORIA_FILE);
        if (resultGenerateReport.error)
            throw resultGenerateReport;

        // SUBIR DOCUMENTOS AL BUCKET.
        const resultUploadFile = await getInitialReport.uploadFiles(resultGenerateReport.name, resultGenerateReport.path);
        if (resultUploadFile.error)
            throw resultUploadFile;

        // ELIMINAR ARCHIVO EN CARPETA TMP.
        const resultDeleteFile = await getInitialReport.deleteFile(resultGenerateReport.path)
        if (resultDeleteFile.error)
            throw resultDeleteFile;

        resultUploadFile.Name = "FoliosSinCategorias.csv";

        console.log("**************** REPORTE FOLIOS SIN CATEGORIA FINALIZADO ****************");

        // RETORNO RESPUESTA SATISFACTORIA.
        return Responses._200({
            message: "PROCESO 1: Finalizado correctamente.",
            data: {
                resultUploadFile
            }
        });

    } catch (error) {

        // Retorno error
        return Responses._400({ message: `PROCESO 1: Ha presentado problemas en su ejecución.`, error });

    }

};