import React, { useState } from 'react';
import { Badge, Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

const mainNavigation = props => {
    const { name, userId } = props;
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Container fluid>
            <Navbar dark expand="md">
                <NavbarBrand tag={Link} to="/">
    </NavbarBrand>
                <h4>
                    <Badge color="success">{name}</Badge>
                </h4>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/patients" onClick={toggle}>
                                Patients
                            </NavLink>
                        </NavItem>

                        {!userId && (
                            <>
                                <NavItem>
                                    <NavLink tag={Link} to="/login" onClick={toggle}>
                                        Login
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/signup" onClick={toggle}>
                                        Signup
                                    </NavLink>
                                </NavItem>
                            </>
                        )}

                        {userId && (
                            <>
                                <NavItem>
                                    <NavLink tag={Link} to="/records" onClick={toggle}>
                                        My Records
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink tag={Link} to="/logout" onClick={toggle}>
                                        Logout
                                    </NavLink>
                                </NavItem>
                            </>
                        )}
                    </Nav>
                </Collapse>
            </Navbar>
            <h3>
               {' '}
                <Badge color="primary">
                Monitor patients
                </Badge>
            </h3>
        </Container>
    );
};
export default mainNavigation;
