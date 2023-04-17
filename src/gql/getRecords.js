import gql from 'graphql-tag';

export default gql`
    {
        records {
            _id
            createdAt
            patient {
                _id
                name
                date
            }
        }
    }
`;
