import gql from 'graphql-tag';

export default gql`
    mutation cancelRecord($recordId: ID!) {
        cancelRecord(recordId: $recordId) {
            name
        }
    }
`;
