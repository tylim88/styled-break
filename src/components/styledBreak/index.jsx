import styled, { css } from 'styled-components'
import React from 'react'

const getMaxWidth = (minWidthArr, minWidth) => {
	const result = minWidthArr[minWidthArr.indexOf(minWidth) + 1]
	return result ? result - 0.02 : 999999
}

const getMediaQuery = (
	sortedBreakpoints = {},
	direction = undefined,
	targetPoint = ''
) => {
	const minWidth = sortedBreakpoints[targetPoint]
	const minWidthArr = Object.values(sortedBreakpoints)

	const minMedia = `@media (min-width: ${minWidth}px)`
	const maxWidth = getMaxWidth(minWidthArr, minWidth)
	switch (direction) {
		case undefined:
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

const objSort = (obj = {}) =>
	Object.keys(obj)
		.sort((a, b) => {
			return obj[a] - obj[b]
		})
		.reduce((acc, key) => {
			acc[key] = obj[key]
			return acc
		}, {})

const styledBreak = (config = {}) => {
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
		} else if (type === 'function') {
			return css`
				${styledCss}
			`
		} else if (type === 'object' && styledCss) {
			let cssString = []
			for (const styledCssProp in styledCss) {
				const [targetPoint, direction] = styledCssProp.split('_')
				const styledCssValue = styledCss[styledCssProp]
				if (styledCssProp === '_') {
					cssString = [...cssString, cssS(styledCssValue)]
				} else if (sortedBreakpoints[targetPoint] !== undefined) {
					cssString = [
						...cssString,
						`
						${getMediaQuery(sortedBreakpoints, direction, targetPoint)} {`,
						cssS(styledCssValue),
						`
					}
					`,
					]
				} else if (typeof styledCssValue === 'function') {
					const mapping = JSON.parse(styledCssProp)
					if (typeof mapping === 'object') {
						const styledCssInner = {}
						for (const styledObjProp in mapping) {
							const styledObjValue = mapping[styledObjProp]
							styledCssInner[styledObjProp] = Array.isArray(styledObjValue)
								? styledCssValue(...styledObjValue)
								: styledCssValue(styledObjValue)
						}
						cssString = [...cssString, cssS(styledCssInner)]
					} else {
						// should we throw error?
					}
				}
			}
			return cssString
		} else {
			// should we throw error?
			return ''
		}
	}

	const cssR = (styledCss = '', level = sLevel_) => css`
		${'&'.repeat(level)} {
			${cssS(styledCss)}
		}
	`

	const styledR = Comp => (styledCss = '', level = sLevel_) => {
		return styled(Comp)`
			${cssR(styledCss, level)}
		`
	}
	const styledHOC = Comp => (level = sLevel_) => {
		const CompNew = props => {
			//eslint-disable-next-line
			const { styledCss, styledProp, ...otherProps } = props // prevent styledCss props from passing in
			return <Comp {...otherProps} />
		}
		return styled(CompNew)`
			${props => {
				const { styledCss } = props
				return cssR(styledCss, level)
			}}
		`
	}

	return { cssR, styledR, styledHOC, cssS }
}

export {
	styledBreak as default,
	css,
	getMaxWidth,
	getMediaQuery,
	objSort,
	styled,
}
