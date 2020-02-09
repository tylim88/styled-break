import styled, { css } from 'styled-components'

const getMaxWidth = (minWidthArr, minWidth) => {
	const result = minWidthArr[minWidthArr.indexOf(minWidth) + 1]
	return result ? result - 0.02 : 999999
}

const getMediaQuery = (
	direction = '',
	sortedBreakpoints = {},
	targetPoint = ''
) => {
	const minWidth = sortedBreakpoints[targetPoint]
	const minWidthArr = Object.values(sortedBreakpoints)

	const minMedia = `@media (min-width: ${minWidth}px)`
	const maxWidth = getMaxWidth(minWidthArr, minWidth)
	switch (direction) {
		case '':
		case 'n':
			return minMedia
		case 'm':
			return `@media (max-width: ${maxWidth}px)`
		default: {
			const minWidth2 =
				sortedBreakpoints[direction] || (direction === 'o' ? minWidth : false)
			if (minWidth2) {
				return `${minMedia} and (max-width: ${getMaxWidth(
					minWidthArr,
					minWidth2
				)}px)`
			} else {
				return minMedia
			}
		}
	}
}

const objSort = obj =>
	Object.keys(obj)
		.sort((a, b) => {
			return obj[a] - obj[b]
		})
		.reduce((acc, key) => {
			acc[key] = obj[key]
			return acc
		}, {})

const styledBreak = config => {
	const { breakpoints, sLevel } = config

	const sLevel_ = sLevel || 1

	const breakpoints_ = breakpoints || {
		xs: 0,
		sm: 576,
		md: 768,
		lg: 992,
		xl: 1200,
	}

	const sortedBreakpoints = objSort(breakpoints_)

	const cssS = (styledCss = '') => {
		const type = typeof styledCss
		if (type === 'string' || Array.isArray(styledCss)) {
			return styledCss
		} else if (type === 'object' && styledCss) {
			let cssString = []
			for (const prop in styledCss) {
				const [targetPoint, direction] = prop.split('_')
				if (
					styledCss[prop] !== undefined &&
					sortedBreakpoints[targetPoint] !== undefined
				) {
					const direction_ = direction || ''
					cssString = [
						...cssString,
						`
						${getMediaQuery(direction_, sortedBreakpoints, targetPoint)} {`,
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

	const cssR = (styledCss = '', level = sLevel_) => css`
		${'&'.repeat(level)} {
			${cssS(styledCss)}
		}
	`

	const styledR = comp => (styledCss = '', level = sLevel_) => {
		return styled(comp)`
			${cssR(styledCss, level)}
		`
	}
	const styledHOC = comp => (level = sLevel_) => {
		return styled(comp)`
			${props => {
				const { styledCss } = props
				return cssR(styledCss, level)
			}}
		`
	}

	return { cssR, styledR, styledHOC }
}

export { styledBreak as default, css, getMaxWidth, getMediaQuery }
