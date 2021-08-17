'use strict';
const { Responses } = require('../../../comun/API_Responses');
const DataExcel = require('./business/sheetDataFolios');
const updateData = require('./DAO/updateData');

module.exports.update_excel = async (body) => {

    try {

        // Destructuracion de variables de entrada
        const { SENDEMAIL, DELETEREPORT, FILENAME } = JSON.parse(body);

        if (typeof SENDEMAIL === 'undefined' || typeof DELETEREPORT === 'undefined' || typeof FILENAME === 'undefined')
            throw { message: "Los parámetros de entrada FILENAME, SENDEMAIL y DELETEREPORT son obligatorios." };

        if ((Number(SENDEMAIL) > 1 || Number(SENDEMAIL) < 0) || (Number(DELETEREPORT) > 1 || Number(DELETEREPORT) < 0) || (FILENAME.length < 1))
            throw { message: "Los valores de los parámetros de entrada no corresponden a los esperado (1 o 0) o nombre del archivo." };

        const filename = FILENAME;
        const extension = ".xlsx";
        const fullPath = `${process.env.PATH_REPORT_CSV_TMP}${filename}${extension}`;

        console.log("********************** PASO 1: INICIO OBTENCIÓN DE DATOS **********************");

        console.log("1. DATA FOLIOS CANCELADOS");
        // Obtener data de Folios Cancelados
        let resultDataCancelados = await DataExcel.getData(fullPath, "Folios Cancelados");
        if (resultDataCancelados.error)
            throw resultDataCancelados;

        console.log("3. DATA FOLIOS SIN CATEGORIAS");
        // Obtener data de Folios Sin Categorias
        let resultDataSinCategorias = await DataExcel.getData(fullPath, "Sin Categorias");
        if (resultDataSinCategorias.error)
            throw resultDataSinCategorias;

        console.log("2. DATA FOLIOS SIN DESPACHO");
        // Obtener data de Folios Sin Despacho
        let resultDataSinDespacho = await DataExcel.getData(fullPath, "Folios Sin Despacho");
        if (resultDataSinDespacho.error)
            throw resultDataSinDespacho;


        console.log("4. DATA FOLIOS PENDIENTES");
        // Obtener data de Folios Pendientes
        let resultDataPendientes = await DataExcel.getData(fullPath, "Folios Pendientes");
        if (resultDataPendientes.error)
            throw resultDataPendientes;

        console.log("********************** OBTENCIÓN DE DATOS COMPLETA **********************\n");

        console.log("********************** PASO 2: INICIO ACTUALIZACIÓN DATOS **********************");

        console.log("1. ACTUALIZACIÓN FOLIOS CANCELADOS");
        let resultUpdateCancelados = await updateData.updateDataCancelados(resultDataCancelados.data.data);
        if (resultUpdateCancelados.error)
            throw resultUpdateCancelados;

        console.log("2. ACTUALIZACIÓN FOLIOS SIN CATEGORIA");
        let resultUpdateSinCategorias = await updateData.updateDataSinCategoria(resultDataSinCategorias.data.data);
        if (resultUpdateSinCategorias.error)
            throw resultUpdateSinCategorias;

        console.log("3. ACTUALIZACIÓN FOLIOS SIN DESPACHO");
        let resultUpdateSinDespacho = await updateData.updateDataSinDespacho(resultDataSinDespacho.data.data);
        if (resultUpdateSinDespacho.error)
            throw resultUpdateSinDespacho;

        console.log("4. ACTUALIZACIÓN FOLIOS PENDIENTES");
        let resultUpdatePendientes = await updateData.updateDataPendientes(resultDataPendientes.data.data);
        if (resultUpdatePendientes.error)
            throw resultUpdatePendientes;

        console.log("********************** ACTUALIZACIÓN DATOS COMPLETADA **********************");

        // Retorno respuesta satisfactoria
        return Responses._200({
            message: "PROCESO UPDATE EXCEL: Finalizado correctamente.",
            data : {
                resultUpdateCancelados,
                resultUpdateSinCategorias,
                resultUpdateSinDespacho,
                resultUpdatePendientes
            }
        });

    } catch (error) {

        // Retorno error
        return Responses._400({ message: `PROCESO UPDATE EXCEL: Ha presentado problemas en su ejecución.`, error });

    }

};