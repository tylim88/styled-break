# react-router-link-nostack

This is a Link Component that prevent stacking in browser history upon re-navigating current route.

Require react-router-dom in your project dependencies.

The package itself has 0 dependencies.

## Installation

```bash
npm i react-router-link-nostack
```

## Demo

Try it at **[Code Sandbox](https://codesandbox.io/s/interesting-ganguly-huwcr)**!  

## Usage

simply use it just like you use React Router Link

```jsx
import React from 'react'
import { render } from 'react-dom'
import Link from 'react-router-link-nostack'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

const Demo = () => {
  return (
    <BrowserRouter basename={'/'}>
      <div>
        <h1>react-router-link-nostack Demo</h1>
        <Link to='/'>to index</Link>
        <br />
        <Link to='/profile'>to profile</Link>
      </div>
      <br />
      <Switch>
        <Route
          exact
          path='/'
          render={() => {
            return (
              <>
                <Helmet>
                  <title>Index</title>
                </Helmet>
                <p>Now at Index Page(route: '/')</p>
              </>
            )
          }}
        />
        <Route
          exact
          path='/profile'
          render={() => {
            return (
              <>
                <Helmet>
                  <title>Profile</title>
                </Helmet>
                <p>Now at Profile Page(route: '/profile')</p>
              </>
            )
          }}
        />
      </Switch>
      <p>
        try to click the same route multiple time and see it wont add to history
        stack!
      </p>
    </BrowserRouter>
  )
}

render(<Demo />, document.getElementById('root'))

```

## API

This `Link` works like and has the same properties as [React Router's Link](https://reacttraining.com/react-router/web/api/Link), plus:

1. `onSamePage`: callback that trigger when user revisit the same page, can be undefined or null

```jsx
<Link to='/profile' onSamePage={()=>{console.log('same page and wont stack history!')}}>to profile</Link>
```
