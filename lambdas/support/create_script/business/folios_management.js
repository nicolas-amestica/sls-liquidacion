'use strict';
const conexion = require('../../../../comun/connection');
const DeleteDuplicates = require('../../../../comun/deleteDuplicates');
const QueryGenerator = require('../../../../comun/queryGenerator');
const sql = require("mssql");

// Identificar Folios Canceladois.
module.exports.create_script = async (folios) => {

    try {

        let groupFolios = await QueryGenerator.divideObject(folios, 1000);

        let cadena = '';
        let preCadena = `declare @folios table(folio nvarchar(255));`;
        let posCadena = `select f.folio, CASE WHEN s.id IS NULL THEN 'REQUIERE ENVIO POR SRX' ELSE 'REGISTRADO' END as status, s.*  from sales s right join @folios f ON f.folio = s.folio order by status;`;

        for (const iterator of groupFolios) {

            let sCadena = await QueryGenerator.inQueryGeneratorStringByScript(iterator);
            cadena = cadena + `insert into @folios values ${sCadena};`;
        }

        // Retorna respuesta.
        return `${preCadena} ${cadena} ${posCadena}`;

    } catch (error) {

        return { error };

    }

};