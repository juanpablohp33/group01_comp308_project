import gql from 'graphql-tag';

export default gql`
    mutation deletePatient($patientId: ID!) {
        deletePatient(patientId: $patientId) {
            name
        }
    }
`;
