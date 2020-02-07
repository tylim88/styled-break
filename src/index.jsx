import React from 'react'
import { render } from 'react-dom'
import Link from './components/Link'
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
