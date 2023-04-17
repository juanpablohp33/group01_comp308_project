import gql from 'graphql-tag';

export default gql`
    mutation recordPatient($patientId: ID!) {
        recordPatient(patientId: $patientId) {
            _id
            createdAt
            updatedAt
        }
    }
`;
