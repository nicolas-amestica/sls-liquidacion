'use strict';
const Business = require('./business');

module.exports.generico = async () => {
  
    try {

        const resultado = await Business.maintanceTask();

        if (resultado.error) {
            throw resultado.error;
        }

        return resultado;

    } catch (error) {

        return error;

    }

};