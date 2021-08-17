'use strict';
const sql = require("mssql");
const conexion = require('../../../comun/connection');
const queryGeneration = require('../../../comun/queryGenerator')
const dateFormat = require('dateformat')
require("dotenv").config();
const async = require('async');

module.exports.getDataFoliosPendientes = async () => {

    // try {

    //svl productos
    const config_products = {
        user: process.env.DB_USUARIO_PRODUCT,
        password: process.env.DB_PASS_PRODUCT,
        server: process.env.DB_HOST_PRODUCT,
        database: process.env.DB_NAME_PRODUCT,
        port: parseInt(1433),
        options: {
            encrypt: true
        },
        pool: {
            idleTimeoutMillis: 60000,
            max: 1000,
            min: 0
        },
        requestTimeout: 60000,
        connectionTimeout: 60000,
        stream: true
    };

    //svl finanzas
    const config_skus = {
        user: process.env.DB_USUARIO_FINANCES,
        password: process.env.DB_PASS_FINANCES,
        server: process.env.DB_HOST_FINANCES,
        database: process.env.DB_NAME_FINANCES,
        port: parseInt(1433),
        options: {
            encrypt: true
        },
        pool: {
            idleTimeoutMillis: 60000,
            max: 1000,
            min: 0
        },
        requestTimeout: 60000,
        connectionTimeout: 60000,
        stream: true
    };

    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dtBef = date.getDate() - 1;
    let dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (dtBef < 10) {
        dtBef = '0' + dtBef;
    }

    //fechas
    const dateToday = year + '-' + month + '-' + dt;
    const datePrevious = year + '-' + month + '-' + dtBef;

    function insert(sqlInsert) {
        try {
            const poolPromise2 = new sql.ConnectionPool(config_skus)
                .connect()
                .then(pool => {
                    const request2 = new sql.Request(pool);
                    console.log(sqlInsert);
                    // request2.query(sqlInsert, (error, result) => {
                    //     if (error) {
                    //         console.log('error al insertar data:');
                    //         console.log(error);
                    //     } else {
                    //         console.log("done");
                    //     }
                    // });
                    return "";
                })
                .catch(err => console.log('Bad Config: ', err));
        } catch (err) {
            console.log('SQL error', err);
        }
    }

    // 2021-04-22 | NICOLÁS AMÉSTICA
    // FUNCIÓN QUE GUARDA REGISTRO DE QUE LA FUNCTION SE EJECUTÓ.
    function insertHist(insertHist) {
        try {
            const poolPromise2 = new sql.ConnectionPool(config_skus)
                .connect()
                .then(pool => {
                    const request3 = new sql.Request(pool);
                    console.log(insertHist);
                    request3.query(insertHist, (error, result) => {
                        if (error) {
                            console.log('error al insertar data:');
                            console.log(error);
                        } else {
                            console.log("done hist");
                        }
                    });
                    return "";
                })
                .catch(err => console.log('Bad Config: ', err));
        } catch (err) {
            console.log('SQL error', err);
        }
    }

    const sqlSelect = `
        SELECT
            PV.sku,
            C.code,
            P.name,
            REPLACE(REPLACE(REPLACE(PV.seller_sku, CHAR(9), ''), CHAR(10), ''), CHAR(13), '') AS seller_sku,
            SUBSTRING(S.facility, 1, LEN(S.facility)-3) as facility
        FROM
            products P
            INNER JOIN product_variants PV ON (P.id = PV.product_id)
            INNER JOIN categories C ON (P.category_id = C.id)
            INNER JOIN stock_report S ON (PV.sku = S.sku)
        WHERE
            P.svl_country_id = 45
            AND P.business = 0
            AND PV.sku IS NOT NULL
            AND PV.sku in (
                '7406840'
            )`;
            // AND P.created_at <= '${dateToday}'
            // AND P.created_at >= '${datePrevious}'`;

            // AND PV.sku in ('15125780', '14998100', '15054670', '14739300', '14935210', '14814440', '15061640', '15147960', '15179720', '14883260', '15136450', '15185890', '14801820', '15122110', '14766500', '14743730', '15120490', '14776220', '15126550', '15152310', '15081850', '15015290', '15060070', '15194850', '15057090', '14963330', '15180000', '14814530', '15065790', '14913260', '15141470', '15002010', '6385290', '15046480', '14989020', '14802160', '15137640', '15141890', '15072410', '14976430', '15111580', '15105570', '15121880', '15154900', '15077310', '15088190', '14758650', '15156640', '15121870', '14999290', '15168580', '15177860', '15120710', '15141220', '14773310', '15164940', '15133520', '15009450', '14781660', '15193020', '15121830', '15112990', '14961520', '14987820', '14902630', '15133110', '15102210', '15195290', '15201710', '15024550', '15061690', '14886580', '15053070', '15116970', '15019240', '15123280', '15081890', '15186770', '15063160', '15034610', '15201430', '14845810', '14829610', '15142800', '14727880', '14805720', '14900770', '15122790', '14835090', '15150930', '14737400', '14734080', '15133450', '14987850', '15034630', '15061670', '15094410', '14944210', '15192950', '14996360', '15202290', '14988890', '14806240', '14984100', '15138880', '14964870', '15178660', '15141530', '15160910', '7340210', '14993050', '6404010', '14708560', '15062100', '15101560', '15190780', '15186130', '14834770', '15157900', '14767280', '15102180', '14895230', '14937050', '15051930', '15036020', '14764390', '14731160', '15152410', '15019110', '15141550', '14926080', '14836340', '14900750', '15088580', '15024520', '15158120', '15008590', '15178130', '15178850', '15122810', '14974250', '15056350', '15143300', '14706010', '14955380', '15024610', '14705630', '15110820', '14760430', '14780620', '14790580', '14940030', '15014870', '14975730', '14717650', '15179750', '14887040', '15075360', '14997220', '15165330', '14890000', '15027850', '14823590', '15115700', '14914730', '15194870', '14682750', '14983750', '14959500', '15099540', '15079520', '14767920', '14895590', '15121890', '15014580', '15193320', '15041380', '15018470', '14772250', '14987830', '14701650', '15128760', '14925260', '15105260', '14679050', '15123190', '15110990', '15146580', '15008130', '14863180', '14890910', '15182590', '15113640', '15124670', '15169970', '15055220', '14805910', '14854260', '14759350', '14803390', '15175520', '14849390', '15195970', '15055200', '15011430', '14919130', '15096430', '15051560', '14827460', '14955470', '15139290', '14767910', '14828950', '14827620', '15179620', '15006680', '14805990', '14920360', '15082150', '15030670', '14701610', '14890150', '14944300', '14748300', '14993190', '14877400', '14749880', '14847310', '15011200', '15035870', '14988940', '14974100', '15111790', '14865860', '14726730', '14997200', '5587340', '15034530', '15008960', '15034800', '14838210', '15115170', '15120420', '14963960', '15054980', '14726750', '15057350', '15125650', '15002000', '14790700', '14737530', '14739600', '14738860', '15056910', '14763260', '15074680', '15143280', '14763320', '14814200', '15192540', '14758820', '14762930', '14895650', '14935980', '14955770', '15190980', '14999530', '14910670', '15051480', '14734780', '14763240', '15160930', '15192490', '14764380', '14827830', '14797770', '15041190', '14803270', '14822120', '14690040', '14903500', '14717620', '15060100', '15124800', '14853880', '14959350', '15190820', '15085270', '14760230', '14729400', '14710820', '14933190', '14959710', '15035750', '15141570', '14836110', '15071540', '15105790', '15121510', '15005510', '15111850', '14737360', '15192560', '15076740', '15166450', '14943820', '14771920', '14944780', '15156240', '15086610', '14830800', '14722620', '14927860', '14877280', '14769360', '15152710', '15125310', '15086580', '15166700', '14888380', '15141200', '15047340', '14932600', '15202650', '14739050', '14933210', '15010850', '15081060', '15040040', '14977010', '15101920', '14781020', '15034250', '14878880', '14856430', '15183260', '14849250', '14739210', '14940060', '15153430', '15172350', '15010010', '15000920', '14808530', '14829170', '15030880', '14746500', '14999830', '15186580', '15105810', '15011420', '14710850', '15015350', '14751180', '15054180', '15121760', '14839350', '14713090', '14763080', '14800740', '15019670', '15088260', '14736870', '14968610', '15186230', '14999640', '14726680', '15085190', '14736030', '14933240', '14984110', '15139280', '14983270', '15168740', '14987760', '14915560', '15026880', '14830940', '14739280', '15179960', '14767210', '14825350', '15032340', '15110600', '14830080', '14993320', '14732900', '6497640', '14996160', '15009300', '14890870', '14911110', '14895210', '15135970', '14725390', '14959660', '15163300', '15114630', '15124820', '14865760', '15152780', '14983720', '15008750', '14903420', '14877090', '14776660', '14864110', '14968740', '14792040', '14963670', '14762170', '15085240', '15178410', '14935800', '15073450', '15086750', '15046460', '14803720', '15194790', '14944810', '15164570', '14790500', '15088680', '14994000', '14978220', '15152930', '15166970', '14863220', '14940150', '14754130', '14767110', '15105900', '14956170', '15051090', '15104990', '14686840', '14803110', '15013380', '14847220', '15166300', '15133090', '14926070', '14769090', '14768480', '14830150', '15151890', '14729450', '14741160', '14849510', '14839550', '15160950', '14768060', '14719900', '14890470', '15097010', '15176810', '14799260', '14688850', '15168450', '14915770', '14838810', '15141060', '15005500', '14760480', '14710450', '14958800', '14956100', '15101840', '14727490', '7423710', '14827760', '15075720', '15112200', '15114390', '15055960', '15111060', '14835200', '15192250', '14829620', '14854180', '14939720', '14688830', '14828930', '15163800', '15079090', '15054360', '15121660', '15075570', '15194810', '14800810', '15084230', '15081160', '15101330', '15177670', '7940250', '15141030', '15101550', '15062870', '15011170')`;

    console.log("DATETODAY:", dateToday);
    console.log("DATEPREVIOUS:", datePrevious);

    let sqlInsert = 'INSERT INTO skus(sku, category, product_name, seller_sku, facility) values ';

    try {
        const poolPromise = new sql.ConnectionPool(config_products)
            .connect()
            .then(pool => {
                const request = new sql.Request(pool);
                request.query(sqlSelect, (err, data) => {

                    if (err) console.log(err);

                    console.log("TOTAL REGISTROS: ", data.recordset.length);

                    if (data.recordset.length == 0)
                        return "No hay datos para actualizar"
                        // throw resultDataDetalleFoliosPendientes;

                    if (data.recordset[0].code) {
                        const datas = data.recordset;
                        const total = datas.length;

                        let limit = parseInt(1000);
                        const group = Math.ceil(total / limit);
                        if (group <= 1) {
                            async.eachSeries(datas, (data, callback) => {
                                sqlInsert += ` ('${data.sku}', '${data.code}', '${data.name.replace("'", "")}', '${data.seller_sku}', '${data.facility}'),`;
                                callback();
                            }, (err, results) => {
                                sqlInsert = sqlInsert.slice(0, sqlInsert.length - 1);
                                insert(sqlInsert);
                            });
                        } else {
                            let start = 0;
                            let end = limit;
                            for (let i = 0; i < group; i++) {
                                sqlInsert = 'INSERT INTO skus(sku, category, product_name, seller_sku, facility) values ';
                                for (let x = start; x < end; x++) {
                                    sqlInsert += ` ('${datas[x].sku}', '${datas[x].code}', '${datas[x].name.replace("'", "")}', '${datas[x].seller_sku}', '${datas[x].facility}'),`;
                                }
                                start = end;
                                if (start != total - 1) {
                                    end = end + limit;
                                } else {
                                    end = end + 1;
                                }
                                if (end > total) {
                                    end = total;
                                }

                                sqlInsert = sqlInsert.slice(0, sqlInsert.length - 1);
                                insert(sqlInsert);
                            }

                        }

                        const sqlHist = `INSERT INTO skus_hist (type, total_updated_records) VALUES ('MANUAL', ${data.recordset.length})`;
                        // insertHist(sqlHist);

                    } else {}
                });
                return "";
            })
            .catch(err => console.log('Database Connection Failed! Bad Config: ', err));
    } catch (err) {
        console.log("error en la funcion");
    }

};