const Record = require('../../models/record');
const Patient = require('../../models/patient');
const User = require('../../models/user');

const { transformPatient } = require('./merge');

module.exports = {
    patients: async () => {
        try {
            const patients = await Patient.find();
            return patients.map(patient => transformPatient(patient)).reverse();
        } catch (err) {
            throw err;
        }
    },
    createPatient: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const patient = new Patient({
            name: args.patientInput.name,
            description: args.patientInput.description,
            bodyTemperature: +args.patientInput.bodyTemperature,
            date: new Date(args.patientInput.date),
            creator: req.userId
        });
        let createdPatient;

        try {
            const result = await patient.save();
            createdPatient = transformPatient(result);
            const user = await User.findById(req.userId);

            if (!user) {
                throw new Error('User not found');
            }
            user.createdPatients.push(patient);

            await user.save();

            return createdPatient;
        } catch (err) {
            throw err;
        }
    },
    deletePatient: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const patient = await Patient.findOne({ _id: args.patientId, creator: req.userId });
            if (!patient) {
                throw new Error('Patient does not exists');
            }

            //Delete all records releated to the patient
            await Record.deleteMany({ patient: args.patientId });

            //Remove patient from the createdPatients list
            await User.findOneAndUpdate(
                req.userId,
                { $pull: { createdPatients: args.patientId } },
                { safe: true, upsert: true }
            );

            //Remove patient
            await Patient.deleteOne({ _id: args.patientId });
            return patient;
        } catch (err) {
            throw err;
        }
    }
};
