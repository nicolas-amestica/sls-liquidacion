'use strict';
const getInitialReport = require('./DAO/get_finance_initial_reports');
const { Responses } = require('../../../comun/API_Responses');

module.exports.maintanceTask = async () => {

    try {

        console.log("**************** ACTUALIZACION VENTAS INTERNACIONALES ****************");

        // OBTENER DATOS DE FOLIOS INTERNACIONALES.
        const resultGetData = await getInitialReport.getDataFinanzas();
        if (resultGetData.error)
            throw resultGetData;

        // LISTAR RUT QUE TIENEN VENTAS INTERNACIONALES Y GENERAR QUERY.
        const resultQueryGenerator = await getInitialReport.queryGenerator(resultGetData.data);
        if (resultQueryGenerator.error)
            throw resultQueryGenerator;

        // LISTAR USUARIOS DE ACUERDO AL FILTRO ANTERIOR.
        const lstAllRutsCompanies = await getInitialReport.getDataUser(resultQueryGenerator.data);
        if (lstAllRutsCompanies.error)
            throw lstAllRutsCompanies;

        // ACTUALIZAR VENTAS INTERNACIONAL.
        const resultUpdate = await getInitialReport.updateDataVentasInternacionales(lstAllRutsCompanies.data);
        if (resultUpdate.error)
            throw resultUpdate.data;

        console.log("**************** ACTUALIZACION VENTAS INTERNACIONALES FINALIZADA ****************");

        // RETORNO RESPUESTA SATISFACTORIA.
        return Responses._200({
            message: "PROCESO 1: Finalizado correctamente.",
            data: resultUpdate
        });

    } catch (error) {

        // RETORNO ERROR.
        return Responses._400({ message: `PROCESO 1: Ha presentado problemas en su ejecución.`, error });

    }

};