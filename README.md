# styled-break

🍨 Create your responsive styled components with breeze using custom [Styled Components](https://www.npmjs.com/package/styled-components) HOC!

## Installation

```bash
npm i styled-break
```

## Demo

Try it at **[Code Sandbox](https://codesandbox.io/s/styled-break-sf6c9)**!  

## Usage

```jsx
import React from 'react'
import { render } from 'react-dom'
import styledBreak from 'styled-break'
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

const { styledHOC } = styledBreak(config)

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

```

Above responsive code translate into

```css
@media (max-width: 500.98px) {
    width: 100px;
    height: 100px;
    background-color: blue;
}

@media (min-width: 576px) and (max-width: 991.98px) {
    width: 200px;
    height: 200px;
    background-color: red;
}

@media (min-width: 1200px) {
    width: 500px;
    height: 300px;
    background-color: purple;
}
```

## Doc

### styledBreak(config)

```jsx
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

const { cssR, styledR, styledHOC } = styledBreak(config)
```

create a `cssR` helper function plus 2 HOC `styledR` and `styledHOC`.

* config(required): object made of `breakpoints` and `sLevel` props.
  * breakpoints(required): you can define as many breakpoints you want, however please avoid including underscore `_` in props name. The value should be the **minimum** value of your breakpoint (the unit is `px`).
  * sLevel(optional): is your class specificity level, default value is `1`. You can nest specificity level in the tagged template literal to have finer control on class specificity.
  
### styledHOC(component)(sLevel)  <--Recommended

create a component that accept `styledCSS` prop that take `styledCSS` object (see below for more information about this `styledCSS` object).

* component(required): the component can be Html or React component, see below code for example
* sLevel: override the `sLevel` pass to `styledBreak`, the default value is `styledBreak`'s `sLevel`.

```jsx
// to create styled html component
const DivStyled = styledHOC('div')(1)

// to create a styled react component
const ButtonStyled = styledHOC(Button)(2)
```

### styledCss

Is your responsive object, the props name have 4 combination for every breakpoint, let take break point `xs`, `sm` and `md` as example where minimum of `xs` is 0, `sm` is 576 and `md` is 768.

here is how you do max, min, only, and between width:

### min

don't append anything to the breakpoint prop name:

```jsx
{xs:`width: 100px;`}
```

which translate into

```css
@media (min-width: 0px) {
    width: 100px;
}
```

### max

append `_m` to the breakpoint prop name:

```jsx
{sm_m:`width: 100px;`}
```

which translate into

```css
@media (max-width: 576px) {
    width: 100px;
}
```

the value max width is `next breakpoint - 0.02`

if there is no next breakpoint, the value is `999999`

### between

append `_anotherBreakpointName` to the breakpoint prop name:

```jsx
{xs_sm:`width: 100px;`}
```

which translate into

```css
@media (min-width: 0px) and (max-width: 767.98px) {
    width: 100px;
}
```

it takes `xs` **min** width and `md` **max** width.

### only

append `_o` to the breakpoint prop name:

```jsx
{xs_o:`width: 100px;`}
```

which translate into

```css
@media (min-width: 0px) and (max-width: 575.98px) {
    width: 100px;
}
```

it takes `xs` **min** width and `xs` **max** width.

`styledCss` can also be just pure string without any breakpoint needed, which mean the style is applied without any media query.

```jsx
const styledCss = `width: 100px;`
```

Of course you can also interpolate function just like you do in Styled Component (because that is the whole point), however you need Styled Component `css` helper function.

```jsx
import {css} from styled-components

const styledCss = {xs_o: css`${props=> `width: ${props.width}px;`}`}

// or without any breakpoint
const styledCss = css`${props=> `width: ${props.width}px;`}`

```

you don't need `css` helper if you are not doing function interpolation.

### styledR(component)(styledCss)(sLevel)

basically a extended `styled` of Styled Component

* component(required): same as component object described in [styledHOC](https://github.com/tylim88/styled-break#styledhoccomponentslevel).
* styledCss(required): same as styledCss object described in [styledCss](https://github.com/tylim88/styled-break#styledcss).
* sLevel(optional):  same as sLevel number described in [styledHOC](https://github.com/tylim88/styled-break#styledhoccomponentslevel).

usage example

```jsx
// to create styled html component
const DivStyled = styledR('div')({xs_o: css`${props=> `width: ${props.width}px;`}`})(1)

// to create a styled react component
const ButtonStyled = styledR(Button)(`width: 100px;`)(2)
```

### cssR(styledCss)

if you don't like to create responsive styled component with `styledR` or `styledHOC`, you want to use `styled` api of Styled Component, then this is what you need.

* styledCss(required): same as styledCss object described in [styledCss](https://github.com/tylim88/styled-break#styledcss).

```jsx
import styled, { css } from 'styled-components'

const DivStyled = styled.div`
  ${cssR({
        xs_m: `width:100px;`
        sm_md: `width:200px;
        xl: css`${props =>
            `width:${props.maxWidth}px;`
      })}
`
```

keep in mind that to always use `css` helper to interpolate the function.

