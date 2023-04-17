import React, { useState } from 'react';
import Cookies from 'js-cookie';

import client from './gql/client';
import { ApolloProvider } from 'react-apollo-hooks';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import MainNavigation from './components/navigation/Main';

import Patients from './pages/Patients';
import Records from './pages/Records';
import AddPatient from './pages/AddPatient';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';

import AuthContext from './context/auth';

const App = () => {
    const [state, setState] = useState({
        token: Cookies.get('token'),
        userId: Cookies.get('userId'),
        name: Cookies.get('name')
    });

    const login = args => {
        const expiresIn = new Date(new Date().getTime() + args.tokenExpiration * 60 * 1000);
        setState({ token: args.token, userId: args.userId, name: args.name });

        Cookies.set('token', args.token, {
            expires: expiresIn
        });
        Cookies.set('userId', args.userId, {
            expires: expiresIn
        });
        Cookies.set('name', args.name, {
            expires: expiresIn
        });
    };
    const logout = () => {
        setState({ token: null, userId: null, name: null });
        Cookies.remove('token');
        Cookies.remove('userId');
        Cookies.remove('name');
        client.resetStore();
    };

    return (
        <ApolloProvider client={client}>
            <HashRouter>
                <>
                    <AuthContext.Provider
                        value={{
                            token: state.token,
                            userId: state.userId,
                            name: state.name,
                            login: login,
                            logout: logout
                        }}
                    >
                        <MainNavigation userId={state.userId} name={state.name} />
                        <main>
                            <Switch>
                                {!state.token && <Route path="/login" component={Login} />}
                                {!state.token && <Route path="/signup" component={Signup} />}

                                <Route path="/patients" component={Patients} />
                                
                                {state.token && <Route path="/add_patient" component={AddPatient} />}
                                {state.token && <Route path="/records" component={Records} />}

                                <Redirect from="/" to="/patients" exact />

                                {state.token && <Route path="/logout" component={Logout} />}
                                {state.token && <Redirect from="/login" to="/patients" exact />}
                                {state.token && <Redirect from="/signup" to="/patients" exact />}

                                {!state.token && <Redirect from="/logout" to="/login" exact />}
                                {!state.token && <Redirect from="/add_patient" to="/login" exact />}
                                {!state.token && <Redirect from="/records" to="/login" exact />}
                            </Switch>
                        </main>
                    </AuthContext.Provider>
                </>
            </HashRouter>
        </ApolloProvider>
    );
};

export default App;
