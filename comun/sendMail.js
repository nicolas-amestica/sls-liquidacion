const nodemailer = require('nodemailer');
const dateFormat = require('dateformat');

module.exports.sendMailProceso1 = async () => {

    try {

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_CONFIG_HOST,
            port: process.env.EMAIL_CONFIG_PORT,
            requireTLS: process.env.EMAIL_CONFIG_REQUIRETLS,
            auth: {
                user: process.env.EMAIL_CONFIG_USER,
                pass: process.env.EMAIL_CONFIG_PASS
            },
            // logger: process.env.EMAIL_CONFIG_LOGGER,
            // debug: process.env.EMAIL_CONFIG_DEBUG
        });

        const mailOptions = {
            from: process.env.EMAIL_CONFIG_USER,
            to: process.env.EMAIL_CONFIG_RECEIVER,
            subject: `${process.env.PROJECT_NAME}: Reportes iniciales del proceso liquidación del periodo ${dateFormat(new Date(), "yyyy-mm-dd")}`,
            html: `<p>Se adjuntan primeros reportes del proceso de liquidación del sistema ${process.env.PROJECT_NAME}.</p>`,
            attachments: [
                { filename: `${process.env.N_PENDIENTES_LIQUIDACION}_${dateFormat(new Date(), "yyyymmddHHMM")}.csv`, path: `${process.env.PATH_REPORT_CSV_TMP}${process.env.N_PENDIENTES_LIQUIDACION}.csv` },
                { filename: `${process.env.N_SIN_CATEGORIA}_${dateFormat(new Date(), "yyyymmddHHMM")}.csv`, path: `${process.env.PATH_REPORT_CSV_TMP}${process.env.N_SIN_CATEGORIA}.csv` }
            ]
        };

        let message;
        let sendMail;

        try {
            sendMail = await transporter.sendMail(mailOptions);
            message = "Correos enviados correctamente.";
        } catch (error) {
            sendMail = error;
            message: "No se ha podido enviar el email.";
            sendMail.error = "No se ha podido enviar el email.";
        }

        return {
            message,
            data: sendEmail
        }

    } catch (error) {

        return { error }

    }

};