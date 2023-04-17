import React, { useEffect } from 'react';

import { Table, Container, Row, Col, Button } from 'reactstrap';
import Loader from 'react-loader-spinner';

import { MdCancel } from 'react-icons/md';
import { useQuery, useMutation } from 'react-apollo-hooks';
import getRecords from '~/gql/getRecords';
import cancelRecord from '~/gql/cancelRecord';

const RecordsList = () => {
    const { data, loading, error } = useQuery(getRecords);
    const cancelRecordMut = useMutation(cancelRecord);

    const handleCancelRecord = recordId => {
        cancelRecordMut({
            variables: {
                recordId: recordId
            },
            refetchQueries: [{ query: getRecords }]
        });
    };

    if (loading)
        return (
            <Container style={{ textAlign: 'center' }}>
                <Loader type="ThreeDots" color="#007bff" height="100" width="100" />
            </Container>
        );
    if (error) return <Container style={{ textAlign: 'center' }}>Something went wrong</Container>;

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Table dark>
                        <thead>
                            <tr>
                                <th>Created</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Cancel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!data.records.length && (
                                <tr>
                                    <td colSpan="5">Empty list</td>
                                </tr>
                            )}
                            {data.records.map(({ _id, createdAt, patient }) => {
                                return (
                                    <tr key={_id}>
                                        <td>{createdAt}</td>
                                        <td>{patient.name}</td>
                                        <td>{patient.date}</td>
                                        <td>
                                            <Button color="primary" onClick={handleCancelRecord.bind(null, _id)}>
                                                <MdCancel />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default RecordsList;
