'use-strinct'
// const { Dynamo } = require('../../comun/Dynamo');
const { Responses } = require('../../comun/API_Responses');
// const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

module.exports.generico = async (event) => {

    try {

        // const { ID, CLAVE } = JSON.parse(event.body);

        // // VERIFICA QUE SE HAYAN RECIBIDO LOS PARAMETROS NECESARIOS PARA EL PROCESO
        // if (!ID.toUpperCase().trim() || !CLAVE) {
        //   console.log(event.body);
        //   return Responses._404({ message: 'Usuario o contraseña incorrectos.' });
        // }

        // const data = await Dynamo.get(ID.toUpperCase().trim(), process.env.TABLE_USUARIOS);

        // // VERIFICA QUE HAYAN RESULTADOS
        // if (!data.Item) {
        //   return Responses._404({ message: 'Usuario o contraseña incorrectos.' });
        // }

        // // VERIFICA QUE EL USUARIO ESTÉ EN ESTADO 1
        // if (data.Item.ESTADO != 1) {
        //   return Responses._200({ message: 'Usuario bloqueado.' });
        // }

        // // VEIRIFCA CLAVE
        // if (!bcrypt.compareSync(CLAVE, data.Item.CLAVE)) {
        //   return Responses._404({ message: 'Usuario o contraseña incorrectos.' });
        // }

        // // IDENTIFICAR MASCULINO O FEMENINO PARA MENSAJE AUTENTICACIÓN EXITOSA (1: MASCULINO, 2: FEMENINO)
        // const saludo = (data.Item.GENERO == 1 ? 'Bienvenido' : 'Bienvenida');

        // // QUITAR PROPIEDADES DE LA RESPUESTA
        // delete data.Item.CLAVE;
        // delete data.Item.CLAVE_2;
        // delete data.Item.ESTADO;
        // delete data.Item.GENERO;
        // delete data.Item.EMAIL;
        // delete data.Item.TELEFONO;
        // delete data.Item.FOTO;

        // GENERA TOKEN
        const token = JWT.sign({
            nombre: 'Nicolas', apellido: 'Amestica'
        }, process.env.SEED_TOKEN, {
          expiresIn: '1h'
        });

        let userData = {
          nombre: 'Nicolas',
          apellido: 'Amestica',
          role: 'admin',
          userId: '17137440-5',
          token
        }

        // RETORNA RESPUESTA
        return Responses._200(userData);

    } catch (err) {
      console.log(err);
      return Responses._400({ error: 'No se ha podido acceder al servicio.', err });
    }

};