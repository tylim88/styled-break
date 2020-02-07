import React from 'react'
import { render } from 'react-dom'
import { responsiveStyledGenerator } from './components/styled-break'

const config = {
	breakpoints: {
		xs: 0,
		sm: 576,
		md: 768,
		lg: 992,
		xl: 1200,
	},
	sLevel: 3,
}

const { styledHOC } = responsiveStyledGenerator(config)

const DivStyled = styledHOC('div')()

const Demo = () => {
	return (
		<DivStyled
			styledCss={{
				sm_m: `width:100px;
				height:100px;
				background-color:blue;`,
				md_lg: `
				width:200px;
				height:200px;
				background-color:red;`,
				xl: `
				width:300px;
				height:300px;
				background-color:yellow;`,
			}}
		/>
	)
}

render(<Demo />, document.getElementById('root'))
