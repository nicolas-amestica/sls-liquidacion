'use strict';
const FinalReport = require('./business');
const { Responses } = require('../../comun/API_Responses');

module.exports.generico = async () => {
  
    try {

        const resultado = await FinalReport.getDataFinalReport();

        if (resultado.error) {
            throw resultado.error;
        }

        return resultado;

    } catch (error) {

        return error;

    }

};