'use strict';
const validateDocument = require('./business');

module.exports.generico = async (event) => {
  
    try {

        const resultado = await validateDocument.format_document(event.body);

        if (resultado.error) {
            throw resultado.error;
        }

        return resultado;

    } catch (error) {

        return error;

    }

};