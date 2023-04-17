import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Table, Container, Row, Col, NavLink, Navbar, Button, UncontrolledCollapse } from 'reactstrap';
import Loader from 'react-loader-spinner';
import { MdRecordmarkBorder, MdAdd, MdExpandMore } from 'react-icons/md';
import { useQuery, useMutation } from 'react-apollo-hooks';

import DeletePatient from '~/components/deletePatient';
import AuthContext from '~/context/auth';

import getPatients from '~/gql/getPatients';
import deletePatient from '~/gql/deletePatient';
import recordPatient from '~/gql/recordPatient';
import getRecords from '~/gql/getRecords';

const PatientsList = () => {
    const { data, loading, error } = useQuery(getPatients);
    const deletePatientMut = useMutation(deletePatient);
    const recordPatientMut = useMutation(recordPatient);

    const context = useContext(AuthContext);

    const handleDeletePatient = patientId => {
        deletePatientMut({
            variables: {
                patientId: patientId
            },
            refetchQueries: [{ query: getPatients }]
        });
    };

    const handleRecordPatient = (patientId, evt) => {
        recordPatientMut({
            variables: {
                patientId: patientId
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
                    <Navbar>
                        <NavLink tag={Link} to="/add_patient">
                            <MdAdd />
                            Add Patient
                        </NavLink>
                    </Navbar>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table dark>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Body Temperature</th>
                                <th>Date</th>
                                <th>Creator</th>
                                {context.userId && (
                                    <>
                                        <th>Record</th>
                                        <th>Delete</th>
                                    </>
                                )}
                                <th>More</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!data.patients.length && (
                                <tr>
                                    <td colSpan="4">Empty list</td>
                                </tr>
                            )}
                            {data.patients.map(({ _id, name, description, bodyTemperature, date, creator }) => {
                                const allowDelete = context.userId === creator._id;
                                return (
                                    <React.Fragment key={_id}>
                                        <tr>
                                            <td>{name}</td>
                                            <td>{bodyTemperature}</td>
                                            <td>{date}</td>
                                            <td>{creator.name}</td>
                                            {context.userId && (
                                                <td>
                                                    <Button color="primary" onClick={handleRecordPatient.bind(null, _id)}>
                                                        <MdRecordmarkBorder />
                                                    </Button>
                                                </td>
                                            )}
                                            {context.userId && (
                                                <td>
                                                    {allowDelete && (
                                                        <DeletePatient
                                                            handleDeletePatient={handleDeletePatient.bind(null, _id)}
                                                            title={name}
                                                        />
                                                    )}
                                                </td>
                                            )}
                                            <td>
                                                <Button color="primary" id={`toggler-${_id}`}>
                                                    <MdExpandMore />
                                                </Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="10">
                                                <UncontrolledCollapse toggler={`toggler-${_id}`}>
                                                    {description}
                                                </UncontrolledCollapse>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default PatientsList;
