const DataLoader = require('dataloader');

const Patient = require('../../models/patient');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const patientLoader = new DataLoader(patientIds => {
    return getPatients(patientIds);
});

const getPatients = async patientIds => {
    try {
        const patients = await Patient.find({ _id: { $in: patientIds } });
        return patients.map(patient => transformPatient(patient));
    } catch (err) {
        throw err;
    }
};

const getPatient = async patientId => {
    try {
        const patient = await patientLoader.load(patientId.toString());
        return patient;
    } catch (err) {
        throw err;
    }
};

const getUser = async userId => {
    try {
        const user = await User.findById(userId);
        return { ...user._doc, _id: user.id, createdPatients: getPatients.bind(this, user._doc.createdPatients) };
    } catch (err) {
        throw err;
    }
};

const transformPatient = patient => {
    return {
        ...patient._doc,
        _id: patient.id,
        date: dateToString(patient._doc.date),
        creator: getUser.bind(this, patient._doc.creator)
    };
};
const transformRecord = record => {
    return {
        ...record._doc,
        _id: record.id,
        user: getUser.bind(this, record._doc.user),
        patient: getPatient.bind(this, record._doc.patient),
        createdAt: dateToString(record._doc.createdAt),
        updatedAt: dateToString(record._doc.updatedAt)
    };
};

exports.transformPatient = transformPatient;
exports.transformRecord = transformRecord;
