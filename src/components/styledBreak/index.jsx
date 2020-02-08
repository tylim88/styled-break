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
		return result ? result - 0.02 : 999999
	}

	const minMedia = `@media (min-width: ${targetPointValue}px)`
	const maxWidth = getMaxWidth(targetPointValue)
	switch (direction) {
		case '':
		case 'n':
			return minMedia
		case 'm':
			return `@media (max-width: ${maxWidth}px)`
		default: {
			const targetPointValue2 =
				sortedBreakpoints[direction] ||
				(direction === 'o' ? targetPointValue : false)
			if (targetPointValue2) {
				return `${minMedia} and (max-width: ${getMaxWidth(
					targetPointValue2
				)}px)`
			} else {
				return minMedia
			}
		}
	}
}

const responsiveStyledGenerator = config => {
	const { breakpoints, sLevel } = config

	const sLevel_ = sLevel || 1

	const breakpoint_ = breakpoints || {
		xs: 0,
		sm: 576,
		md: 768,
		lg: 992,
		xl: 1200,
	}

	const sortedBreakpoints = Object.keys(breakpoint_)
		.sort((a, b) => {
			return breakpoint_[a] - breakpoint_[b]
		})
		.reduce((acc, key) => {
			acc[key] = breakpoint_[key]
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
			return cssString
		} else {
			return ''
		}
	}

	const isComponentHtml = component =>
		typeof component === 'string' ? styled[component] : styled(component)

	const specificityWrapper = (styledCss = '', level = sLevel_) => css`
		${'&'.repeat(level)} {
			${cssR(styledCss)}
		}
	`

	const styledR = comp => (styledCss = '', level = sLevel_) => {
		return isComponentHtml(comp)`
	${specificityWrapper(styledCss, level)}
	`
	}
	const styledHOC = comp => (level = sLevel_) => {
		return isComponentHtml(comp)`
			${props => {
				const { styledCss } = props
				return specificityWrapper(styledCss, level)
			}}
		`
	}

	return { cssR, styledR, styledHOC }
}

export default responsiveStyledGenerator
