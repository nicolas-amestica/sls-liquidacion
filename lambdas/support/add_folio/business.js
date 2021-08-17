'use strict';
const { Responses } = require('../../../comun/API_Responses');
const DAO = require('./business/folios_management')

module.exports.add_folios = async (folios) => {

    try {

        // Destructuracion de variables de entrada
        const { FOLIOS } = JSON.parse(folios);

        if (typeof FOLIOS === 'undefined')
            throw { error: "El parámetro de entrada FOLIOS es obligatorio." };
    
        if (FOLIOS.length <= 0) {
            throw { error: "El parámetro de entrada FOLIOS debe contener folios." };
        }

        // Identificar folios cancelados.
        let resultFindCanceledFolios = await DAO.find_canceled_folios(FOLIOS);
        if (resultFindCanceledFolios.error)
            throw resultFindCanceledFolios;

        // Verificar que los folios cancelados no estén duplicados.
        let resultFindDuplicateFolios = await DAO.find_duplicate_folios(resultFindCanceledFolios);
        if (resultFindDuplicateFolios.error)
            throw resultFindDuplicateFolios;

        // // Agregar folios.
        // let resultAddFolios = await DAO.add_folios(FOLIOS);

        // Retorno respuesta satisfactoria.
        return Responses._200({
            message: "Proceso 'add folios' finalizado correctamente.",
            data : {
                "folios_agregados": resultFindCanceledFolios
            }
        });

    } catch (error) {

        // Retorno error
        return Responses._400({ message: `ADD FOLIOS: Ha presentado problemas en su ejecución.`, error });

    }

};