import React from 'react'
import styledBreak, {
	getMaxWidth,
	getMediaQuery,
	objSort,
	css,
	styled,
} from './index'
import 'jest-styled-components'
import { create } from 'react-test-renderer'

const gap = 0.02
const infinity = 999999

const isArrSameLength = <M, N>(arr1: M[], arr2: N[]) => {
	it('check array length', () => {
		expect.assertions(1)
		expect(arr1.length).toBe(arr2.length)
	})
}

describe('test utilities', () => {
	it('test objSort', () => {
		const breakPoint = {
			md: 768,
			sm: 576,
			xs: 0,
			xl: 1200,
			lg: 992,
		}
		expect.assertions(1)
		const sorted = objSort(breakPoint)
		expect(sorted).toEqual({
			xs: 0,
			sm: 576,
			md: 768,
			lg: 992,
			xl: 1200,
		})
	})

	describe('test getMaxWidth', () => {
		const minWidthArr = [0, 576, 768, 992, 1200]
		const minWidthArr2 = [...minWidthArr]
		minWidthArr2.shift()
		const maxWidthArr = minWidthArr2.map(num => num - gap)
		maxWidthArr.push(infinity)

		isArrSameLength(minWidthArr, maxWidthArr)

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

		const minOnly = (width: number) => `@media (min-width: ${width}px)`
		const maxOnly = (width: number) => `@media (max-width: ${width}px)`
		const minMax = (width1: number, width2: number) =>
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

		isArrSameLength(modeArr, answer)

		modeArr.forEach((mode, i) => {
			it(`test ${mode}`, () => {
				expect.assertions(1)
				const [targetPoint, direction] = mode.split('_')
				const targetPoint_ = targetPoint || ''
				const mediaQuery = getMediaQuery(
					sortedBreakpoint,
					direction,
					targetPoint_
				)
				expect(mediaQuery).toBe(answer[i])
			})
		})
	})
})

describe('test core API', () => {
	const { cssR, styledR, styledHOC, cssS } = styledBreak({
		xs: 0,
		sm: 576,
		xl: 1200,
		md: 768,
		lg: 992,
	})

	describe('test styledBreak ouput', () => {
		const funcArr = [cssR, styledR, styledHOC, cssS]

		funcArr.forEach(func => {
			it(`test existence of ${func.name}`, () => {
				expect.assertions(1)
				expect(typeof func).toBe('function')
			})
		})
	})

	describe('test cssS', () => {
		const arr: unknown[] = []
		const inputArr = [
			{ i: 'haha', o: 'haha' },
			{ i: arr, o: arr },
			{ i: undefined, o: '' },
			{ i: null, o: '' },
			{ i: 123, o: '' },
		]
		inputArr.forEach((input, i) => {
			it(`test no${i}:${JSON.stringify(input)}`, () => {
				expect.assertions(1)
				const { i, o } = input
				const output = cssS(i)
				expect(output).toBe(o)
			})
		})
	})

	describe('test cssR', () => {
		const ButtonStyled = styled('button')`
			${cssR`
					@media (min-width:0px) {
						color: red;
					}

					@media (min-width:768px) and (max-width:1199.98px) {
						color: yellow;
					}
		`}
		`

		const Button = <ButtonStyled />

		it('test snapshot', () => {
			expect.assertions(1)
			const tree = create(Button).toJSON()
			expect(tree).toMatchSnapshot()
		})

		it('test hasStyle', () => {
			expect.assertions(4)
			const tree = create(Button).toJSON()
			expect(tree).toHaveStyleRule('color', 'red', {
				media: '(min-width:0px)',
			})
			expect(tree).toHaveStyleRule('color', 'yellow', {
				media: '(min-width:768px) and (max-width:1199.98px)',
			})
		})
	})

	describe('test styledR', () => {
		const ButtonStyled = styledR('button')({
			_: 'color: blue;',
			xs: css`
				color: ${props => props.color};
			`,
			md_lg: 'color: yellow;',
			[JSON.stringify({ _: 100, xl: 200, md_lg: 300 })]: width =>
				css`
					width: ${props => width + props.width}px;
				`,
		})

		const Button = <ButtonStyled width={50} color='red' />

		it('test snapshot', () => {
			expect.assertions(1)
			const tree = create(Button).toJSON()
			expect(tree).toMatchSnapshot()
		})

		it('test hasStyle', () => {
			expect.assertions(12)
			const tree = create(Button).toJSON()
			expect(tree).toHaveStyleRule('color', 'blue')
			expect(tree).toHaveStyleRule('color', 'red', {
				media: '(min-width:0px)',
			})
			expect(tree).toHaveStyleRule('color', 'yellow', {
				media: '(min-width:768px) and (max-width:1199.98px)',
			})
			expect(tree).toHaveStyleRule('width', '150px')
			expect(tree).toHaveStyleRule('width', '250px', {
				media: '(min-width:1200px)',
			})
			expect(tree).toHaveStyleRule('width', '350px', {
				media: '(min-width:768px) and (max-width:1199.98px)',
			})
		})
	})

	describe('test styleHOC', () => {
		const ButtonStyled = styledHOC('button')()

		const Button = (
			<ButtonStyled
				width={50}
				color='yellow'
				styledCss={{
					_: 'color: blue;',
					xs: 'color: red;',
					md_lg: css`
						color: ${props => props.color};
					`,
					[JSON.stringify({ _: 100, xl: 200, md_lg: 300 })]: width =>
						css`
							width: ${props => width + props.width}px;
						`,
				}}
			/>
		)

		it('test snapshot', () => {
			expect.assertions(1)
			const tree = create(Button).toJSON()
			expect(tree).toMatchSnapshot()
		})

		it('test hasStyle', () => {
			expect.assertions(12)
			const tree = create(Button).toJSON()
			expect(tree).toHaveStyleRule('color', 'blue')
			expect(tree).toHaveStyleRule('color', 'red', {
				media: '(min-width:0px)',
			})
			expect(tree).toHaveStyleRule('color', 'yellow', {
				media: '(min-width:768px) and (max-width:1199.98px)',
			})
			expect(tree).toHaveStyleRule('width', '150px')
			expect(tree).toHaveStyleRule('width', '250px', {
				media: '(min-width:1200px)',
			})
			expect(tree).toHaveStyleRule('width', '350px', {
				media: '(min-width:768px) and (max-width:1199.98px)',
			})
		})
	})
})
