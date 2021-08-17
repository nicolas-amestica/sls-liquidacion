'use strict';

module.exports.deleteDuplicatesInteger = function (arreglo) {

    try {

        const arregloSinDuplicados = arreglo.filter((item, index) => {
            return arreglo.indexOf(parseInt(item)) === index;
        });

        return arregloSinDuplicados;

    } catch (error) {

        return { error };

    }
}

module.exports.deleteDuplicatesString = function (arreglo) {

    try {

        const arregloSinDuplicados = arreglo.filter((item, index) => {
            let i = item.toString();
            return arreglo.indexOf(i) === index;
        });

        return arregloSinDuplicados;

    } catch (error) {

        return { error };

    }
}

module.exports.deleteDuplicatesAll = function (arreglo) {

    try {

        const arregloSinDuplicados = arreglo.filter((item, index) => {
            return arreglo.indexOf(item) === index;
        });

        return arregloSinDuplicados;

    } catch (error) {

        return { error };

    }
}

module.exports.deleteDuplicateObjectById = async (arrObject) => {

    try {

        let hash = {};
        let data = arrObject.filter(function(current) {
            let exists = !hash[current.id];
            hash[current.id] = true;
            return exists;
        });

        return data;

    } catch (error) {

        return { error };

    }

}