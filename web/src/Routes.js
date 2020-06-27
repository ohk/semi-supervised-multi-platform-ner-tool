import React from 'react'
import { Switch, Redirect } from 'react-router-dom'

import { RouteWithLayout } from './components'
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts'

import {
    Dashboard as DashboardView,
    ProductList as ProductListView,
    UserList as UserListView,
    Typography as TypographyView,
    Icons as IconsView,
    Account as AccountView,
    Settings as SettingsView,
    SignUp as SignUpView,
    SignIn as SignInView,
    Validate as ValidateView,
    ResetPassword as ResetView,
    ForgotPassword as ForgotView,
    Text as TextView,
    Texts as TextsView,
    NotFound as NotFoundView
} from './views'

const Routes = () => {
    return (
        <Switch>
            <RouteWithLayout component={DashboardView} exact layout={MainLayout} path="/dashboard" />
            <RouteWithLayout component={UserListView} exact layout={MainLayout} path="/users" />
            <RouteWithLayout component={ProductListView} exact layout={MainLayout} path="/products" />
            <RouteWithLayout component={TypographyView} exact layout={MainLayout} path="/typography" />
            <RouteWithLayout component={IconsView} exact layout={MainLayout} path="/icons" />
            <RouteWithLayout component={AccountView} exact layout={MainLayout} path="/account" />
            <RouteWithLayout component={SettingsView} exact layout={MainLayout} path="/settings" />
            <RouteWithLayout component={TextsView} exact layout={MainLayout} path="/text" />
            <RouteWithLayout component={TextView} exact layout={MainLayout} path="/text/*" />

            <RouteWithLayout component={SignUpView} exact layout={MinimalLayout} path="/sign-up" />
            <RouteWithLayout component={SignInView} exact layout={MinimalLayout} path="/" />
            <RouteWithLayout component={ValidateView} exact layout={MinimalLayout} path="/validate/*" />
            <RouteWithLayout component={ResetView} exact layout={MinimalLayout} path="/reset/*" />
            <RouteWithLayout component={ForgotView} exact layout={MinimalLayout} path="/forgot" />
            <RouteWithLayout component={NotFoundView} exact layout={MinimalLayout} path="/not-found" />
            <Redirect to="/not-found" />
        </Switch>
    )
}

export default Routes
