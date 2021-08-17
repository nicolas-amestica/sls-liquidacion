
let configFinanzas = {
    server: process.env.DB_HOST_FINANCES,
    database: process.env.DB_NAME_FINANCES,
    user: process.env.DB_USUARIO_FINANCES,
    password: process.env.DB_PASS_FINANCES,
    multipleStatements: true,
    requestTimeout: 300000,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

let configUsuarios = {
    server: process.env.DB_HOST_USER,
    database: process.env.DB_NAME_USER,
    user: process.env.DB_USUARIO_USER,
    password: process.env.DB_PASS_USER,
    multipleStatements: true,
    requestTimeout: 180000,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

let configProductos = {
    server: process.env.DB_HOST_PRODUCT,
    database: process.env.DB_NAME_PRODUCT,
    user: process.env.DB_USUARIO_PRODUCT,
    password: process.env.DB_PASS_PRODUCT,
    multipleStatements: true,
    requestTimeout: 180000,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

module.exports.validarConexionFinanzas = async () => {

    let message = [];

    if (!configFinanzas.server)
        message.push("No está configurado el host del servidor de base de datos");

    if (!configFinanzas.database)
        message.push("No está configurado el nombre del servidor de base de datos");

    if (!configFinanzas.user)
        message.push("No está configurado el usuario del servidor de base de datos");

    if (!configFinanzas.password)
        message.push("No está configurada la clave del servidor de base de datos");

    return message;

}

module.exports.validarConexionUsuarios = async () => {

    let message = [];

    if (!configUsuarios.server)
        message.push("No está configurado el host del servidor de base de datos");

    if (!configUsuarios.database)
        message.push("No está configurado el nombre del servidor de base de datos");

    if (!configUsuarios.user)
        message.push("No está configurado el usuario del servidor de base de datos");

    if (!configUsuarios.password)
        message.push("No está configurada la clave del servidor de base de datos");

    return message;

}

module.exports.validarConexionProductos = async () => {

    let message = [];

    if (!configProductos.server)
        message.push("No está configurado el host del servidor de base de datos");

    if (!configProductos.database)
        message.push("No está configurado el nombre del servidor de base de datos");

    if (!configProductos.user)
        message.push("No está configurado el usuario del servidor de base de datos");

    if (!configProductos.password)
        message.push("No está configurada la clave del servidor de base de datos");

    return message;

}

exports.configFinanzas = configFinanzas;
exports.configUsuarios = configUsuarios;
exports.configProductos = configProductos;