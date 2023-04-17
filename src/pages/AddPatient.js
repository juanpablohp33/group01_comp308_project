import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Col, Container, Row } from 'reactstrap';
import { ReactstrapInput } from 'reactstrap-formik';
import { Redirect } from 'react-router-dom';
import { object, string, date, number } from 'yup';

import { useMutation } from 'react-apollo-hooks';
import getPatients from '~/gql/getPatients';
import createPatient from '~/gql/createPatient';

const AddPatient = () => {
    const createPatientMut = useMutation(createPatient);
    const [toPatients, setToPatients] = useState(false);

    if (toPatients) {
        return <Redirect to="/patients" />;
    }

    let initName, initDesc, initBodyTemperature;

    if (process.env.NODE_ENV === 'development') {
        initName =
            'Carlos Molina';
        initDesc =
            'This Patient ';
        initBodyTemperature = '33';
    }

    return (
        <Formik
            initialValues={{
                name: initName,
                description: initDesc,
                date: new Date().toISOString().slice(0, 10),
                bodyTemperature: initBodyTemperature
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                createPatientMut({
                    variables: {
                        patient: {
                            name: values.name,
                            description: values.description,
                            bodyTemperature: +values.bodyTemperature,
                            date: values.date
                        }
                    },
                    refetchQueries: [{ query: getPatients }]
                })
                    .then(response => {
                        resetForm();
                        setSubmitting(false);
                        setToPatients(true);
                    })
                    .catch(err => {
                        // console.log('err: ', err);
                        // this.setState({ error: 'Login failed!' });
                    });
            }}
            validationSchema={object().shape({
                name: string().required(),
                bodyTemperature: number()
                    .positive()
                    .integer()
                    .required(),
                date: date().required(),
                description: string()
                    .min(10)
                    .required()
            })}
        >
            {({ isSubmitting }) => (
                <Form>
                    <Container>
                        {/* {loading && <p>Adding an patient - please wait...</p>}``
                        {error && <p>Error :( Please try again</p>} */}
                        <Row>
                            <Col xs="12">
                                <Field
                                    autoFocus
                                    type="text"
                                    name="name"
                                    placeholder="Patient name"
                                    component={ReactstrapInput}
                                />
                            </Col>
                            <Col xs="12">
                                <Field type="text" name="bodyTemperature" placeholder="Body Temperature" component={ReactstrapInput} />
                            </Col>
                            <Col xs="12">
                                <Field type="date" name="date" component={ReactstrapInput} />
                            </Col>
                            <Col xs="12">
                                <Field
                                    type="textarea"
                                    name="description"
                                    placeholder="Description"
                                    component={ReactstrapInput}
                                />
                            </Col>
                            <Col xs="12">
                                <Button color="primary" type="submit" disabled={isSubmitting}>
                                    Create
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            )}
        </Formik>
    );
};

export default AddPatient;
