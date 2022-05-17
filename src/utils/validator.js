const { isUUID } = require('validator');

module.exports.isUUIDv4 = (uuid) => {
    return isUUID(uuid, [4]);
}