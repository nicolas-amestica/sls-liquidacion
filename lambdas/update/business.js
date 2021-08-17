'use strict';
const getFinalReport = require('./DAO/skus');
const { Responses } = require('../../comun/API_Responses');

module.exports.getDataFinalReport = async () => {

    try {

        let resultDataDetalleFoliosPendientes = await getFinalReport.getDataFoliosPendientes();
        if (resultDataDetalleFoliosPendientes.error)
            throw resultDataDetalleFoliosPendientes;

        // RETORNO RESPUESTA SATISFACTORIA.
        return Responses._200({
            message: "PROCESO UPDATE: Finalizado correctamente."
        });

    } catch (error) {

        // Retorno error
        return Responses._400({ message: `PROCESO UPDATE: Ha presentado problemas en su ejecución.`, error });

    }

};