const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recordSchema = new Schema(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patient'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Record', recordSchema);
