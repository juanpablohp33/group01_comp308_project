const Record = require('../../models/record');
const Patient = require('../../models/patient');

const { transformPatient, transformRecord } = require('./merge');

//.then(delayPromise())
module.exports = {
    records: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const records = await Record.find({ user: req.userId });

            return records.map(record => transformRecord(record));
        } catch (err) {
            throw err;
        }
    },
    recordPatient: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const fetchedPatient = await Patient.findById(args.patientId);
            if (!fetchedPatient) {
                throw new Error('Patient does not exists');
            }
            const record = new Record({
                user: req.userId,
                patient: fetchedPatient
            });

            const result = await record.save();

            return transformRecord(result);
        } catch (err) {
            throw err;
        }
    },
    cancelRecord: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const record = await Record.findById(args.recordingId).populate('patient');
            const patient = transformPatient(record.patient);
            await Record.deleteOne({ _id: args.recordingId });
            return patient;
        } catch (err) {
            throw err;
        }
    }
};
