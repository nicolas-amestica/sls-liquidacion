
module.exports.agregarDias = function (date, days) {

    try {

        var result = new Date(date);
        result.setDate(result.getDate() + days);

        return result;

    } catch (error) {

        return { error };

    }
}