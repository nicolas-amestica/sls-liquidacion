'use strict';
const business = require('./controller');

module.exports.generico = async (event) => {
  
    try {

        const resultado = await business.update_excel(event.body);

        if (resultado.error) {
            throw resultado.error;
        }

        return resultado;

    } catch (error) {

        return error;

    }

};