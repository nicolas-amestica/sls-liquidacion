'use strict';
const business = require('./business');

module.exports.generico = async (event) => {
  
    try {

        const resultado = await business.add_folios(event.body);

        if (resultado.error) {
            throw resultado.error;
        }

        return resultado;

    } catch (error) {

        return error;

    }

};