import React from 'react'
import { Switch, Redirect } from 'react-router-dom'

import { RouteWithLayout } from './components'
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts'

import {
    Dashboard as DashboardView,
    Authors as AuthorsView,
    UserList as UserListView,
    Settings as SettingsView,
    SignUp as SignUpView,
    SignIn as SignInView,
    Validate as ValidateView,
    ResetPassword as ResetView,
    ForgotPassword as ForgotView,
    Text as TextView,
    Texts as TextsView,
    AddText as AddTextView,
    AddTag as AddTagView,
    EditTag as EditTagView,
    AddAuthor as AddAuthorView,
    Tags as TagsView,
    Train as TrainView,
    TrainEX as TrainEXView,
    Unauthorized as UnauthorizedView,
    NotFound as NotFoundView
} from './views'

const Routes = () => {
    return (
        <Switch>
            <RouteWithLayout component={DashboardView} exact layout={MainLayout} path="/dashboard" />
            <RouteWithLayout component={UserListView} exact layout={MainLayout} path="/users" />
            <RouteWithLayout component={AuthorsView} exact layout={MainLayout} path="/authors" />
            <RouteWithLayout component={SettingsView} exact layout={MainLayout} path="/settings" />
            <RouteWithLayout component={TextsView} exact layout={MainLayout} path="/text" />
            <RouteWithLayout component={TextView} exact layout={MainLayout} path="/text/*" />
            <RouteWithLayout component={AddTextView} exact layout={MainLayout} path="/addText" />
            <RouteWithLayout component={EditTagView} exact layout={MainLayout} path="/editTag" />
            <RouteWithLayout component={AddTagView} exact layout={MainLayout} path="/addTag" />
            <RouteWithLayout component={AddAuthorView} exact layout={MainLayout} path="/addAuthor" />
            <RouteWithLayout component={TagsView} exact layout={MainLayout} path="/tags" />
            <RouteWithLayout component={TrainView} exact layout={MainLayout} path="/trains" />
            <RouteWithLayout component={TrainEXView} exact layout={MainLayout} path="/trainExcludeds" />
            <RouteWithLayout component={SignUpView} exact layout={MinimalLayout} path="/sign-up" />
            <RouteWithLayout component={SignInView} exact layout={MinimalLayout} path="/" />
            <RouteWithLayout component={ValidateView} exact layout={MinimalLayout} path="/validate/*" />
            <RouteWithLayout component={ResetView} exact layout={MinimalLayout} path="/reset/*" />
            <RouteWithLayout component={ForgotView} exact layout={MinimalLayout} path="/forgot" />
            <RouteWithLayout component={UnauthorizedView} exact layout={MinimalLayout} path="/unauthorized" />
            <RouteWithLayout component={NotFoundView} exact layout={MinimalLayout} path="/not-found" />
            <Redirect to="/not-found" />
        </Switch>
    )
}

export default Routes
