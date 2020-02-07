import styled, { css } from 'styled-components'

const responsiveCssGenerator = config => {
	const { mapping, min, sLevel } = config

	const cssR = (styledCss = '') => {
		const type = typeof styledCss
		if (type === 'string' || Array.isArray(styledCss)) {
			return styledCss
		} else if (type === 'object' && styledCss) {
			let cssString = []
			for (const prop in styledCss) {
				if (styledCss[prop] !== undefined && mapping[prop] !== undefined) {
					cssString = [
						...cssString,
						`
			@media (${min ? 'min' : 'max'}-width: ${mapping[prop]}px) {`,
						styledCss[prop],
						`
		}
			`,
					]
				}
			}
			return cssString
		} else {
			return ''
		}
	}

	const isComponentHtml = component =>
		typeof component === 'string' ? styled[component] : styled(component)

	const specificityWrapper = (styledCss = '', level = sLevel) => css`
		${'&'.repeat(level)} {
			${cssR(styledCss)}
		}
	`

	const styledR = comp => (styledCss = '', level = sLevel) => {
		return isComponentHtml(comp)`
	 ${specificityWrapper(styledCss, level)}
	 `
	}
	const styledHOC = (comp, level = sLevel) => {
		return styled(comp)`
			${props => {
				const { styledCss } = props
				return specificityWrapper(styledCss, level)
			}}
		`
	}

	return { cssR, styledR, styledHOC }
}

const mapping = {
	xs: 0,
	sx: 500,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
}

const config = {
	mapping,
	min: true,
	sLevel: 3,
}

const { cssR, styledR, styledHOC } = responsiveCssGenerator(config)

export { cssR, styledR, styledHOC, css }
