'use strict';
const { Responses } = require('../../../comun/API_Responses');
const validateExcel = require('./business/validateExcel');
const files = require('../../../comun/createFile');

module.exports.format_document = async (body) => {

    try {

        // Destructuracion de variables de entrada
        const { SENDEMAIL, DELETEREPORT } = JSON.parse(body);

        if (typeof SENDEMAIL === 'undefined' || typeof DELETEREPORT  === 'undefined')
            throw { error: "Los parámetros de entrada SENDEMAIL y DELETEREPORT son obligatorios." };

        if ((Number(SENDEMAIL) > 1 || Number(SENDEMAIL) < 0) || (Number(DELETEREPORT) > 1 || Number(DELETEREPORT) < 0))
            throw { error: "Los valores de los parámetros de entrada no corresponden a los esperado (1 o 0)." };

        // Validar que el archivo que se está leyendo tenga todas las columnas obligatorias necesatias.
        let resultValidateSheet = await validateExcel.validateSheets();

        // Crear cancelados
        let resultValidateValuesCancelados = await validateExcel.validateColCancelados(resultValidateSheet.data.filename, resultValidateSheet.data.extension);
        // Crear Sin Despacho
        let resultValidateValuesSinDespacho = await validateExcel.validateColSinDespacho(resultValidateValuesCancelados.data.filename, resultValidateValuesCancelados.data.extension);
        // Elimiminar Cancelados
        await files.deleteFile(resultValidateValuesCancelados.data.filename, resultValidateValuesCancelados.data.extension);
        // Crear Sin Categorias
        let resultValidateValuesSinCategorias = await validateExcel.validateColSinCategorias(resultValidateValuesSinDespacho.data.filename, resultValidateValuesSinDespacho.data.extension);
        // Eliminar Sin Despacho
        await files.deleteFile(resultValidateValuesSinDespacho.data.filename, resultValidateValuesSinDespacho.data.extension);
        // Crear Pendientes
        let resultValidateValuesPendientes = await validateExcel.validateColPendientes(resultValidateValuesSinCategorias.data.filename, resultValidateValuesSinCategorias.data.extension);
        // Eliminar Sin Categoría
        await files.deleteFile(resultValidateValuesSinCategorias.data.filename, resultValidateValuesSinCategorias.data.extension);

        // Retorno respuesta satisfactoria
        return Responses._200({
            message: "Proceso format document finalizado correctamente.",
            data : {
                resultValidateSheet,
                resultValidateValuesCancelados,
                resultValidateValuesSinDespacho,
                resultValidateValuesSinCategorias,
                resultValidateValuesPendientes
            }
        });

    } catch (error) {

        // Retorno error
        return Responses._400({ message: `FORMAT DOCUMENT: Ha presentado problemas en su ejecución.`, error });

    }

};