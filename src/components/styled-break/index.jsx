import styled, { css } from 'styled-components'

const mediaParser = (
	direction = '',
	sortedBreakpoints = {},
	targetPoint = ''
) => {
	const targetPointValue = sortedBreakpoints[targetPoint]

	const getMaxWidth = targetPointValue => {
		const values = Object.values(sortedBreakpoints)
		const result = values[values.indexOf(targetPointValue) + 1]
		if (result) {
			return result - 0.02 + 'px'
		} else {
			return 999999 + 'px'
		}
	}

	const maxWidth = getMaxWidth(targetPointValue)

	const minMedia = `@media (min-width: ${targetPointValue}px)`
	const maxMedia = maxWidth ? `@media (max-width: ${maxWidth})` : ''
	switch (direction) {
		case '':
			return minMedia
		case 'm':
			return maxMedia
		case 'o':
			return `${minMedia} and ${maxMedia}`
		default: {
			const targetPointValue2 = sortedBreakpoints[direction]
			if (targetPointValue2) {
				const maxWidth2 = getMaxWidth(targetPointValue2)
				const maxQuery = maxWidth2
					? `and (max-width: ${getMaxWidth(targetPointValue2)})`
					: ''
				return `${minMedia} ${maxQuery}`
			} else {
				return minMedia
			}
		}
	}
}

const responsiveStyledGenerator = config => {
	const { breakpoints, sLevel } = config

	const sortedBreakpoints = Object.keys(breakpoints)
		.sort((a, b) => {
			return breakpoints[a] - breakpoints[b]
		})
		.reduce((acc, key) => {
			acc[key] = breakpoints[key]
			return acc
		}, {})

	const cssR = (styledCss = '') => {
		const type = typeof styledCss
		if (type === 'string' || Array.isArray(styledCss)) {
			return styledCss
		} else if (type === 'object' && styledCss) {
			let cssString = []
			for (const prop in styledCss) {
				const split = prop.split('_')
				const targetPoint = split[0]
				if (
					styledCss[prop] !== undefined &&
					sortedBreakpoints[targetPoint] !== undefined
				) {
					const direction = split[1] || ''
					cssString = [
						...cssString,
						`
						${mediaParser(direction, sortedBreakpoints, targetPoint)} {`,
						styledCss[prop],
						`
					}
					`,
					]
				}
			}
			console.log(cssString.join(''))
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
	const styledHOC = comp => (level = sLevel) => {
		return isComponentHtml(comp)`
			${props => {
				const { styledCss } = props
				return specificityWrapper(styledCss, level)
			}}
		`
	}

	return { cssR, styledR, styledHOC }
}

export { responsiveStyledGenerator }
