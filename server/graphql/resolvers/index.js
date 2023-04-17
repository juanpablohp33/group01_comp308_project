const auth = require('./auth');
const patients = require('./patients');
const records = require('./records');

const rootResolver = {
    ...auth,
    ...patients,
    ...records
};
module.exports = rootResolver;
