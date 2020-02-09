import React from 'react'
import styledBreak, { getMaxWidth, getMediaQuery } from './index'
import 'jest-styled-components'
import { create } from 'react-test-renderer'

const gap = 0.02
const infinity = 999999

const checkLength = (arr1, arr2) => {
	it('check array length', () => {
		expect.assertions(1)
		expect(arr1.length).toBe(arr2.length)
	})
}

describe('test utilities', () => {
	describe('test getMaxWidth', () => {
		const minWidthArr = [0, 576, 768, 992, 1200]
		const minWidthArr2 = [...minWidthArr]
		minWidthArr2.shift()
		const maxWidthArr = minWidthArr2.map(num => num - gap)
		maxWidthArr.push(infinity)

		checkLength(minWidthArr, maxWidthArr)

		minWidthArr.forEach((minWidth, i) => {
			it(`test ${minWidth}`, () => {
				expect.assertions(1)
				const maxWidth = getMaxWidth(minWidthArr, minWidth)
				expect(maxWidth).toBe(maxWidthArr[i])
			})
		})
	})

	describe('test getMediaQuery', () => {
		const sortedBreakpoint = {
			xs: 0,
			sm: 576,
			md: 768,
			lg: 992,
			xl: 1200,
		}

		const modeArr = [
			'xs',
			'xs_n',
			'sm_m',
			'sm_o',
			'md_lg',
			'md_md',
			'lg_sm',
			'lg_jshdjhskajd',
			'xl_n',
			'xl_m',
		]

		const minOnly = width => `@media (min-width: ${width}px)`
		const maxOnly = width => `@media (max-width: ${width}px)`
		const minMax = (width1, width2) =>
			`@media (min-width: ${width1}px) and (max-width: ${width2}px)`

		const answer = [
			minOnly(0),
			minOnly(0),
			maxOnly(768 - gap),
			minMax(576, 768 - 0.02),
			minMax(768, 1200 - gap),
			minMax(768, 992 - gap),
			minMax(992, 768 - gap),
			minOnly(992),
			minOnly(1200),
			maxOnly(infinity),
		]

		checkLength(modeArr, answer)

		modeArr.forEach((mode, i) => {
			it(`test ${mode}`, () => {
				expect.assertions(1)
				const [targetPoint, direction] = mode.split('_')
				const targetPoint_ = targetPoint || ''
				const mediaQuery = getMediaQuery(
					direction,
					sortedBreakpoint,
					targetPoint_
				)
				expect(mediaQuery).toBe(answer[i])
			})
		})
	})
})

describe('test styledBreak', () => {
	const { cssR, styledR, styledHOC } = styledBreak({
		xs: 0,
		sm: 576,
		xl: 1200,
		md: 768,
		lg: 992,
	})
	describe('test output is function', () => {
		const funcArr = [cssR, styledR, styledHOC]

		funcArr.forEach(func => {
			it(`test existence of ${func.name}`, () => {
				expect.assertions(1)
				expect(typeof func).toBe('function')
			})
		})
	})

	describe('test styledR', () => {
		const Button = styledR('button')({
			xs: 'color: red',
			md_lg: 'color: yellow',
		})

		it('test snapshot', () => {
			expect.assertions(1)
			const tree = create(<Button />).toJSON()
			expect(tree).toMatchSnapshot()
		})

		it('test hasStyle', () => {
			expect.assertions(4)
			const tree = create(<Button />).toJSON()
			expect(tree).toHaveStyleRule('color', 'red', {
				media: '(min-width:0px)',
			})
			expect(tree).toHaveStyleRule('color', 'yellow', {
				media: '(min-width:768px) and (max-width:1199.98px)',
			})
		})
	})

	describe('test styledR', () => {
		const Button = styledHOC('button')()

		it('test snapshot', () => {
			expect.assertions(1)
			const tree = create(
				<Button
					styledCss={{
						xs: 'color: red',
						md_lg: 'color: yellow',
					}}
				/>
			).toJSON()
			expect(tree).toMatchSnapshot()
		})

		it('test hasStyle', () => {
			expect.assertions(4)
			const tree = create(
				<Button
					styledCss={{
						xs: 'color: red',
						md_lg: 'color: yellow',
					}}
				/>
			).toJSON()
			expect(tree).toHaveStyleRule('color', 'red', {
				media: '(min-width:0px)',
			})
			expect(tree).toHaveStyleRule('color', 'yellow', {
				media: '(min-width:768px) and (max-width:1199.98px)',
			})
		})
	})
})
