// https://github.com/styled-components/jest-styled-components/issues/264#issuecomment-590007752
declare namespace jest {
	interface Matchers<R> {
		toHaveStyleRule: import('jest-styled-components').jest.Matchers<
			R
		>['toHaveStyleRule']
	}
}
