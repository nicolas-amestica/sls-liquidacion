'use strict';
const { Responses } = require('../../../comun/API_Responses');
const DAO = require('./business/folios_management')

module.exports.cancel_folios = async (folios) => {

    try {
        
        // Destructuracion de variables de entrada
        const { ID_FOLIOS } = JSON.parse(folios);

        if (typeof ID_FOLIOS === 'undefined')
            throw { error: "El parámetro de entrada ID_FOLIOS es obligatorio." };
    
        if (ID_FOLIOS.length <= 0) {
            throw { error: "El parámetro de entrada ID_FOLIOS debe contener folios." };
        }

        // Cancelar folios.
        let resultCancelFolios = await DAO.cancel_folios(ID_FOLIOS);

        // Retorno respuesta satisfactoria
        return Responses._200({
            message: "Proceso 'cancel folios' finalizado correctamente.",
            data : {
                "folios_cancelados": resultCancelFolios
            }
        });

    } catch (error) {

        // Retorno error
        return Responses._400({ message: `CANCEL FOLIOS: Ha presentado problemas en su ejecución.`, error });

    }

};