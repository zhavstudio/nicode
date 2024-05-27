import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import Login from './views/auth/Login';
import React from "react";
enum AuthRoutes {
    dashboard = '/dashboard',
    preferences = '/preferences',
    account = '/account'
}

enum NonAuthRoutes {
    login = '/',
    support = '/support',
    unauthorized = '/unauthorized'
}
enum UserRoles {
    admin = 'admin',
    user = 'user'
}
//some views will be for admins only, some for users (non-admins)
// and then the rest is available for all roles
const userRoles = {
    admins: [String(UserRoles.admin)],
    users: [String(UserRoles.user)],
    all: [
        String(UserRoles.admin),
        String(UserRoles.user)
    ]
};
const App: React.FC = (): JSX.Element => (
    <Router>
        <Switch>
            <Route exact path={NonAuthRoutes.login} component={Login} />

        </Switch>
    </Router>
)
