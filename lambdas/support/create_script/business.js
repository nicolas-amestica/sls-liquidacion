'use strict';
const { Responses } = require('../../../comun/API_Responses');
const DAO = require('./business/folios_management')

module.exports.create_script = async (folios) => {

    try {

        // Destructuracion de variables de entrada
        const { FOLIOS } = JSON.parse(folios);

        if (typeof FOLIOS === 'undefined')
            throw { error: "El parámetro de entrada FOLIOS es obligatorio." };
    
        if (FOLIOS.length <= 0) {
            throw { error: "El parámetro de entrada FOLIOS debe contener folios." };
        }

        // console.log(FOLIOS);

        // Identificar folios cancelados.
        let resultCreateScriptWithExistFolios = await DAO.create_script(FOLIOS);
        if (resultCreateScriptWithExistFolios.error)
            throw resultCreateScriptWithExistFolios;

        // Retorno respuesta satisfactoria.
        return Responses._200({
            message: "Proceso 'create script' finalizado correctamente.",
            data : {
                "script": resultCreateScriptWithExistFolios
            }
        });

    } catch (error) {

        // Retorno error
        return Responses._400({ message: `CREATE SCRIPT: Ha presentado problemas en su ejecución.`, error });

    }

};