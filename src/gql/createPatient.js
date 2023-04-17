import gql from 'graphql-tag';

export default gql`
    mutation createPatient($patient: PatientInput) {
        createPatient(patientInput: $patient) {
            _id
            bodyTemperature
            name
        }
    }
`;
