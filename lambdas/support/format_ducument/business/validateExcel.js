'use strict';
const ExcelJS = require('exceljs');
const dateFormat = require('dateformat');
const Dates = require('../../../../comun/dates')

// Validar que todas las columnas obligatorias se encuentren.
module.exports.validateSheets = async () => {

    try {

        const columnFoliosPendientes = 'Folios Pendientes';
        const columnFoliosCancelados = 'Folios Cancelados';
        const colSinDespacho = 'Folios Sin Despacho';
        const colSinCategoria = 'Sin Categorias';

        const filename = "GCP_PorLiquidar";
        const extension = ".xlsx";
        const fullPath = `${process.env.PATH_REPORT_CSV_TMP}${filename}${extension}`;

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.readFile(fullPath).catch(err => {
            throw { message: `No se encontró el archivo para su lectura. Recuerde que el archivo debe tener nombre ${filename}${extension}. Procure que el archivo tenga nombre GCP_PorLiquidar.xlsx` };
        });

        const sheetFoliosPendientes = workbook.getWorksheet(columnFoliosPendientes);
        if (!sheetFoliosPendientes)
            throw { error: "No se encuentra hoja 'Folios Pendientes'. Verifique que esté bien escrito." }

        const workSheetFoliosCancelados = workbook.getWorksheet(columnFoliosCancelados);
        if (!workSheetFoliosCancelados)
            throw { error: "No se encuentra hoja 'Folios Cancelados'. Verifique que esté bien escrito." }

        const sheetSinDespacho = workbook.getWorksheet(colSinDespacho);
        if (!sheetSinDespacho)
            throw { error: "No se encuentra hoja 'Folios Sin Despacho'. Verifique que esté bien escrito." }

        const sheetSinCategoria = workbook.getWorksheet(colSinCategoria);
        if (!sheetSinCategoria)
            throw { error: "No se encuentra hoja 'Sin Categorias'. Verifique que esté bien escrito." }
        
        // Retorna respuesta.
        return {
            message: "Las hojas obligatorias se encuentran en el archivo correctamente.",
            data: {
                filename,
                extension,
                sheets: [
                    sheetFoliosPendientes.name,
                    workSheetFoliosCancelados.name,
                    sheetSinDespacho.name,
                    sheetSinCategoria.name
                ]
            }
        };

    } catch (error) {

        return { error };

    }

};

// Validar valores de la columna Folios Cancelados.
module.exports.validateColCancelados = async (name, ext) => {

    try {

        const columnFoliosCancelados = 'Folios Cancelados';
        const filename = name;
        const extension = ext;
        const fullPath = `${process.env.PATH_REPORT_CSV_TMP}${filename}${extension}`;

        const newfilename = "GCP_PorLiquidar_cancelados";
        const newFullPath = `${process.env.PATH_REPORT_CSV_TMP}${newfilename}${extension}`;

        // Crear instancia de libro excel.
        const workbook = new ExcelJS.Workbook();

        // Leer libro de acuerdo a la ruta y almacenarlo en la instancia.
        await workbook.xlsx.readFile(fullPath).catch(err => {
            throw { message: `No se encontró el archivo para su lectura. Recuerde que el archivo debe tener nombre ${filename}${extension}. Procure que el archivo tenga nombre ${filename}` };
        });

        // Obtener la hoja correspondiente.
        const workSheetFoliosCancelados = await workbook.getWorksheet(columnFoliosCancelados);

        // Autoasignar headers a las columnas. 
        await workSheetFoliosCancelados.getRow(1).eachCell((cell, colNumber) => {
            workSheetFoliosCancelados.getColumn(colNumber).key = cell.text;
            workSheetFoliosCancelados.getColumn(colNumber).header = cell.text;
            workSheetFoliosCancelados.getColumn(colNumber).hidden = false;
        });

        // Total de celdas incluidas en la hoja (extrae la que tiene más rows)
        const totalCells = workSheetFoliosCancelados.getColumn('FOLIO').worksheet.rowCount;

        // Obtener el total de registros en FOLIO.
        let totalcolumnFolio = 0;
        workSheetFoliosCancelados.getColumn('FOLIO').eachCell({ includeEmpty: true }, function(cell, rowNumber) {
            if (cell.value)
                totalcolumnFolio++;
        });

        // Obtener el total de registros en OMS_ABAST
        let totalcolumnOmsAbast = 0;
        workSheetFoliosCancelados.getColumn('OMS_ABAST').eachCell({ includeEmpty: true }, function(cell, rowNumber) {
            if (cell.value)
                totalcolumnOmsAbast++;
        });

        // Validar que los totales de registros cuadren.
        if (totalcolumnFolio !== totalcolumnOmsAbast) 
            throw `Los datos de las columnas no cuadran, favor revisar. Total FOLIOS: ${totalcolumnFolio}, Total OMS_ABAST: ${totalcolumnOmsAbast}`;

        if (totalCells !== totalcolumnFolio || totalCells !== totalcolumnOmsAbast)
            throw `Los datos de las columnas no cuadran, favor revisar. Existen campos vacíos.`;
        
        // Agregar ancho a la columna folio.
        workSheetFoliosCancelados.getColumn('FOLIO').width = 16;
        workSheetFoliosCancelados.getColumn('FOLIO').numFmt = '0';

        // Agregar ancho a la columna oms_abast.
        workSheetFoliosCancelados.getColumn('OMS_ABAST').width = 16;
        workSheetFoliosCancelados.getColumn('OMS_ABAST').numFmt = '@';

        // console.table(workSheetFoliosCancelados.columns);

        // Guardar los cambios de todo el documento en un nuevo
        await workbook.xlsx.writeFile(newFullPath);

        // Retorna respuesta.
        return {
            message: `Columna ${columnFoliosCancelados} validada y depurada correctamente.`,
            data: { filename: newfilename, extension }
        };

    } catch (error) {

        return { error };

    }

};

// Validar valores de la columna Folios Sin Despacho.
module.exports.validateColSinDespacho = async (name, ext) => {

    try {

        const columnFoliosSinDespacho = 'Folios Sin Despacho';
        const filename = name;
        const extension = ext;
        const fullPath = `${process.env.PATH_REPORT_CSV_TMP}${filename}${extension}`;

        const newfilename = "GCP_PorLiquidar_sinDespacho";
        const newFullPath = `${process.env.PATH_REPORT_CSV_TMP}${newfilename}${extension}`;

        // Crear instancia de libro excel.
        const workbook = new ExcelJS.Workbook();

        // Leer libro de acuerdo a la ruta y almacenarlo en la instancia.
        await workbook.xlsx.readFile(fullPath).catch(err => {
            throw { message: `No se encontró el archivo para su lectura. Recuerde que el archivo debe tener nombre ${filename}${extension}. Procure que el archivo tenga nombre ${filename}` };
        });

        // Obtener la hoja correspondiente.
        const workSheetSinDespacho = await workbook.getWorksheet(columnFoliosSinDespacho);

        // Autoasignar headers a las columnas. 
        await workSheetSinDespacho.getRow(1).eachCell((cell, colNumber) => {
            workSheetSinDespacho.getColumn(colNumber).key = cell.text;
            workSheetSinDespacho.getColumn(colNumber).header = cell.text;
            workSheetSinDespacho.getColumn(colNumber).hidden = false;
        });

        // Total de celdas incluidas en la hoja (extrae la que tiene más rows)
        const totalCells = workSheetSinDespacho.getColumn('FOLIO').worksheet.rowCount;

        // Obtener el total de registros en FOLIO.
        let totalcolumnFolio = 0;
        workSheetSinDespacho.getColumn('FOLIO').eachCell({ includeEmpty: true }, function(cell, rowNumber) {
            // cell.numFmt = '0';
            if (cell.value)
                totalcolumnFolio++;
        });

        // Obtener el total de registros en OMS_ABAST
        let totalcolumnOmsAbast = 0;
            workSheetSinDespacho.getColumn('OMS_ABAST').eachCell({ includeEmpty: true }, function(cell, rowNumber) {
            if (cell.value)
                totalcolumnOmsAbast++;
        });

        // Validar que los totales de registros cuadren.
        if (totalcolumnFolio !== totalcolumnOmsAbast) 
            throw `Los datos de las columnas no cuadran, favor revisar. Total FOLIOS: ${totalcolumnFolio}, Total OMS_ABAST: ${totalcolumnOmsAbast}`;

        if (totalCells !== totalcolumnFolio || totalCells !== totalcolumnOmsAbast)
            throw `Los datos de las columnas no cuadran, favor revisar. Existen campos vacíos.`;
        
        // Agregar ancho a la columna folio.
        workSheetSinDespacho.getColumn('FOLIO').width = 16;
        workSheetSinDespacho.getColumn('FOLIO').numFmt = '0';

        // Agregar ancho a la columna oms_abast.
        workSheetSinDespacho.getColumn('OMS_ABAST').width = 16;
        workSheetSinDespacho.getColumn('OMS_ABAST').numFmt = '@';

        // console.table(workSheetSinDespacho.columns);

        // Guardar los cambios de todo el documento en un nuevo
        await workbook.xlsx.writeFile(newFullPath);

        // Retorna respuesta.
        return {
            message: `Columna ${columnFoliosSinDespacho} validada y depurada correctamente.`,
            data: { filename: newfilename, extension }
        };

    } catch (error) {

        return { error };

    }

};

// Validar valores de la columna Folios Sin Categorias.
module.exports.validateColSinCategorias = async (name, ext) => {

    try {

        const columnFoliosSinCategorias = 'Sin Categorias';
        const filename = name;
        const extension = ext;
        const fullPath = `${process.env.PATH_REPORT_CSV_TMP}${filename}${extension}`;

        const newfilename = "GCP_PorLiquidar_sinCategorias";
        const newFullPath = `${process.env.PATH_REPORT_CSV_TMP}${newfilename}${extension}`;

        // Crear instancia de libro excel.
        const workbook = new ExcelJS.Workbook();

        // Leer libro de acuerdo a la ruta y almacenarlo en la instancia.
        await workbook.xlsx.readFile(fullPath).catch(err => {
            throw { message: `No se encontró el archivo para su lectura. Recuerde que el archivo debe tener nombre ${filename}${extension}. Procure que el archivo tenga nombre ${filename}` };
        });

        // Obtener la hoja correspondiente.
        const workSheetSinCategorias = await workbook.getWorksheet(columnFoliosSinCategorias);

        // Autoasignar headers a las columnas. 
        await workSheetSinCategorias.getRow(1).eachCell((cell, colNumber) => {
            if (cell.text.toUpperCase() == "CATEGORY") {
                workSheetSinCategorias.getColumn(colNumber).key = cell.text.toLowerCase();
                workSheetSinCategorias.getColumn(colNumber).header = cell.text.toLowerCase();
                workSheetSinCategorias.getColumn(colNumber).hidden = false;
            } else {
                workSheetSinCategorias.getColumn(colNumber).key = cell.text.toUpperCase();
                workSheetSinCategorias.getColumn(colNumber).header = cell.text.toUpperCase();
                workSheetSinCategorias.getColumn(colNumber).hidden = false;
            }
        });

        // Total de celdas incluidas en la hoja (extrae la que tiene más rows)
        const totalCells = workSheetSinCategorias.getColumn('FOLIO').worksheet.rowCount;

        // Obtener el total de registros en FOLIO.
        let totalcolumnFolio = 0;
        workSheetSinCategorias.getColumn('FOLIO').eachCell({ includeEmpty: true }, function(cell, rowNumber) {
            if (cell.value)
                totalcolumnFolio++;
        });

        // Obtener el total de registros en SKU
        let totalcolumnSku = 0;
        workSheetSinCategorias.getColumn('SKU').eachCell({ includeEmpty: true }, function(cell, rowNumber) {
            if (cell.value)
                totalcolumnSku++;
        });

        // Obtener el total de registros en CATEGORY
        let totalcolumnCategory = 0;
        workSheetSinCategorias.getColumn('category').eachCell({ includeEmpty: true }, function(cell, rowNumber) {
            if (cell.value)
                totalcolumnCategory++;
        });

        // Validar que los totales de registros cuadren.
        if (totalcolumnFolio !== totalcolumnSku && totalcolumnFolio !== totalcolumnCategory)
            throw `Los datos de las columnas no cuadran, favor revisar. Total FOLIOS: ${totalcolumnFolio}, Total SKU: ${totalcolumnSku}, Total CATEGORY: ${totalcolumnCategory}`;

        if (totalCells !== totalcolumnFolio || totalCells !== totalcolumnSku || totalCells !== totalcolumnCategory)
            throw `Los datos de las columnas no cuadran, favor revisar. Existen campos vacíos.`;
        
        // Agregar ancho a la columna folio.
        workSheetSinCategorias.getColumn('FOLIO').width = 16;
        workSheetSinCategorias.getColumn('FOLIO').numFmt = '0';

        // Agregar ancho a la columna sku.
        workSheetSinCategorias.getColumn('SKU').width = 16;
        workSheetSinCategorias.getColumn('SKU').numFmt = '@';

        // Agregar ancho a la columna sku.
        workSheetSinCategorias.getColumn('category').width = 16;
        workSheetSinCategorias.getColumn('category').numFmt = '@';

        // console.table(workSheetSinCategorias.columns);

        // Guardar los cambios de todo el documento en un nuevo
        await workbook.xlsx.writeFile(newFullPath);

        // Retorna respuesta.
        return {
            message: `Columna ${columnFoliosSinCategorias} validada y depurada correctamente.`,
            data: { filename: newfilename, extension }
        };

    } catch (error) {

        return { error };

    }

};

// Validar valores de la columna Folios Pendientes.
module.exports.validateColPendientes = async (name, ext) => {

    try {

        const columnFoliosPendientes = 'Folios Pendientes';
        const filename = name;
        const extension = ext;
        const fullPath = `${process.env.PATH_REPORT_CSV_TMP}${filename}${extension}`;

        const newfilename = `GCP_PorLiquidar_${dateFormat(new Date(), "yyyymmddHHMMss")}`;
        const newFullPath = `${process.env.PATH_REPORT_CSV_TMP}${newfilename}${extension}`;

        // Crear instancia de libro excel.
        const workbook = new ExcelJS.Workbook();

        // Leer libro de acuerdo a la ruta y almacenarlo en la instancia.
        await workbook.xlsx.readFile(fullPath).catch(err => {
            throw { message: `No se encontró el archivo para su lectura. Recuerde que el archivo debe tener nombre ${filename}${extension}. Procure que el archivo tenga nombre ${filename}` };
        });

        // Obtener la hoja correspondiente.
        const workSheetPendientes = await workbook.getWorksheet(columnFoliosPendientes);

        // Autoasignar headers a las columnas. 
        await workSheetPendientes.getRow(1).eachCell((cell, colNumber) => {
            if (cell.text.toUpperCase() === "RECEPCION") {
                workSheetPendientes.getColumn(colNumber).key = "RECEPCION_RESP";
                workSheetPendientes.getColumn(colNumber).header = "RECEPCION_RESP";
                workSheetPendientes.getColumn(colNumber).hidden = false;
            } else {
                workSheetPendientes.getColumn(colNumber).key = cell.text.toUpperCase();
                workSheetPendientes.getColumn(colNumber).header = cell.text.toUpperCase();
                workSheetPendientes.getColumn(colNumber).hidden = false;
            }
        });

        // Agregar ancho a la columna folio.
        workSheetPendientes.getColumn('FOLIO').width = 16;
        workSheetPendientes.getColumn('FOLIO').numFmt = '0';

        // Agregar ancho a la columna recepcion.
        workSheetPendientes.getColumn('RECEPCION_RESP').width = 20;

        // Total de celdas incluidas en la hoja (extrae la que tiene más rows)
        const totalCells = workSheetPendientes.getColumn('FOLIO').worksheet.rowCount;

        // Obtener el total de registros en FOLIO.
        let totalcolumnFolio = 0;
        workSheetPendientes.getColumn('FOLIO').eachCell({ includeEmpty: true }, function(cell, rowNumber) {
            if (cell.value)
                totalcolumnFolio++;
        });

        // Obtener el total de registros en RECEPCCION
        let arrRepeccion = [];
        let totalcolumnRecepcion = 0;
        workSheetPendientes.getColumn('RECEPCION_RESP').eachCell({ includeEmpty: true }, function(cell, rowNumber) {
            if (cell.value)
                totalcolumnRecepcion++;

            if (cell.text === "RECEPCION_RESP")
                arrRepeccion.push("RECEPCION");
            else
                arrRepeccion.push(dateFormat(Dates.agregarDias(Date.parse(cell.text), 1), "yyyy-mm-dd") + " 00:00:00");
                

        });

        workSheetPendientes.spliceColumns(6, 1, arrRepeccion);

        workSheetPendientes.deleteColumnKey("RECEPCION_RESP");

        // Validar que los totales de registros cuadren.
        if (totalcolumnFolio !== totalcolumnRecepcion)
            throw `Los datos de las columnas no cuadran, favor revisar. Total FOLIOS: ${totalcolumnFolio}, Total RECEPCION: ${totalcolumnRecepcion}`;

        if (totalCells !== totalcolumnFolio || totalCells !== totalcolumnRecepcion)
            throw `Los datos de las columnas no cuadran, favor revisar. Existen campos vacíos.`;

        // Guardar los cambios de todo el documento en un nuevo
        await workbook.xlsx.writeFile(newFullPath);

        // Retorna respuesta.
        return {
            message: `Columna ${columnFoliosPendientes} validada y depurada correctamente.`,
            data: { filename: newfilename, extension }
        };

    } catch (error) {

        return { error };

    }

};