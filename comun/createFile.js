'use strict';
const fs = require('fs').promises;
const ObjectsToCsv = require('objects-to-csv-file');

module.exports.createFileProceso1 = async (data) => {

    try {

        let urls = []

        stringify(data.pendientesLiquidar.data, {
            header: true,
            delimiter: ';'
        }, function (err, output) {
            fs.writeFile(`${process.env.PATH_REPORT_CSV_TMP}${process.env.N_PENDIENTES_LIQUIDACION}.csv`, output);
        });
        urls.push({name: `${process.env.N_PENDIENTES_LIQUIDACION}.csv`, path: `${process.env.PATH_REPORT_CSV_TMP}${process.env.N_PENDIENTES_LIQUIDACION}.csv`});

        stringify(data.sinCategorias.data, {
            header: true,
            delimiter: ';'
        }, function (err, output) {
            fs.writeFile(`${process.env.PATH_REPORT_CSV_TMP}${process.env.N_SIN_CATEGORIA}.csv`, output);
        });
        urls.push({name: `${process.env.N_SIN_CATEGORIA}.csv`, path: `${process.env.PATH_REPORT_CSV_TMP}${process.env.N_SIN_CATEGORIA}.csv`});

        return {
            message: "Archivos CSV's creados correctamente.",
            data: urls
        }

    } catch (error) {

        return { error };

    }

};

module.exports.deleteFileProceso1 = async () => {

    let deleteFilePendientesLiquidar;
    let deleteFileSinCategorias;

    try {

        // try {
            // if (fs.existsSync(`${process.env.PATH_REPORT_CSV_TMP}${process.env.N_PENDIENTES_LIQUIDACION}.csv`)) {
                deleteFilePendientesLiquidar = await fs.unlinkSync(`${process.env.PATH_REPORT_CSV_TMP}${process.env.N_PENDIENTES_LIQUIDACION}.csv`);
            // }
  
            // if (fs.existsSync(`${process.env.PATH_REPORT_CSV_TMP}${process.env.N_SIN_CATEGORIA}.csv`)) {
                deleteFileSinCategorias = await fs.unlinkSync(`${process.env.PATH_REPORT_CSV_TMP}${process.env.N_SIN_CATEGORIA}.csv`);
            // }
        //   } catch(err) {
        //     console.error(err)
        //   }

        return {
            message: "Reportes eliminados correctamente."
        }

    } catch (error) {

        console.log(error);

        return { error };

    }

};

module.exports.deleteFile = async (filePath) => {

    try {

        await fs.unlink(filePath);

        return true;

    } catch (error) {

        console.log(error);

        return { error };

    }

};

module.exports.exportDataToCSV = async (data, fileName) => {

    try {

        const fullPathFile = `${process.env.PATH_REPORT_CSV_TMP}${fileName}.csv`;

        const csv = new ObjectsToCsv(data);

        if (!csv)
            throw 'No se pudieron serializar los datos.';

        const result = await csv.toDisk(fullPathFile, { header: true, delimiter: ';' });

        if (!result)
            throw 'No se pudo generar el archivo.';

        return { name: `${fileName}.csv`, path: fullPathFile, result };

    } catch (error) {

        return { error };

    }

};