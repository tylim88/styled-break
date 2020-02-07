import React from 'react'
import { render } from 'react-dom'
import { responsiveStyledGenerator } from './components/styled-break'
import { css } from 'styled-components'

const config = {
	breakpoints: {
		xs: 0,
		sx: 501,
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
			maxWidth='500'
			styledCss={{
				xs_m: `width:100px;
				height:100px;
				background-color:blue;`,
				sm_md: `
				width:200px;
				height:200px;
				background-color:red;`,
				xl: css`
					${props =>
						`width:${props.maxWidth}px;
				height:300px;
				background-color:purple;`}
				`,
			}}
		/>
	)
}

render(<Demo />, document.getElementById('root'))
