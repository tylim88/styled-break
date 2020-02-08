# styled-break

🍨 Create your responsive styled components with breeze using custom [Styled Components](https://www.npmjs.com/package/styled-components) HOC!

* minimalist api
* component approach
* 0 dependency

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
      width='500'
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
            `width:${props.width}px;
        height:300px;
        background-color:purple;`}
        `,
      }}
    />
  )
}

render(<Demo />, document.getElementById('root'))

```

which is equivalent to

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

## Core utilities

### 1. styledBreak(config)

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

`styledBreak` creates a `cssR` helper function plus 2 HOC `styledR` and `styledHOC`.

* config(required): object made of `breakpoints` and `sLevel` props.
  * breakpoints(optional): default value is bootstrap breakpoint. You can define as many breakpoints you want, however please **avoid** including underscore `_` in props name. The value should be the **minimum** value of your breakpoint (the unit is `px`).
  * sLevel(optional): is global setting of class specificity level, default value is `one`. You can nest specificity level individually to have finer control on class specificity level.
  
### 2. styledCss

```jsx
const styledCss = {
  xs_m: `width:100px;`,
  sm_md: `width:200px;`,
  xl: css`${props =>`width:${props.width}px;`}`,
}
```

this is your responsive object, the props name have 4 combination for every breakpoint, let take break point `xs`, `sm` and `md` as example where minimum of `xs` is 0, `sm` is 576 and `md` is 768.

here is how you do max, min, only, and between width:

### min

append `_n` or `nothing` anything to the breakpoint prop name:

```jsx
const styledCss = { xs:`width: 100px;` }
or
const styledCss = { xs_n:`width: 100px;` }
```

which equivalent to

```css
@media (min-width: 0px) {
    width: 100px;
}
```

### max

append `_m` to the breakpoint prop name:

```jsx
const styledCss = { sm_m:`width: 100px;` }
```

which equivalent to

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
const styledCss = { xs_sm:`width: 100px;` }
```

which equivalent to

```css
@media (min-width: 0px) and (max-width: 767.98px) {
    width: 100px;
}
```

it takes `xs` **min** width and `md` **max** width.

### only

append `_o` or `_theSameBreakpointName` to the breakpoint prop name:

```jsx
const styledCss = { xs_o:`width: 100px;` }
or
const styledCss = { xs_xs:`width: 100px;` }
```

which equivalent to

```css
@media (min-width: 0px) and (max-width: 575.98px) {
    width: 100px;
}
```

It takes `xs` **min** width and `xs` **max** width.

### default

if the 1st breakpoint doesn't exist, the whole media query doesn't exist, no style would be applied.

if the 1st breakpoint exist but 2nd breakpoint doesn't exist, such as appending `_randomZT2t2`, there would be no 2nd media query, which mean, it has only `min` media query.

### Without Media Query

`styledCss` can also be just pure string without any breakpoint needed, which mean the style is applied without any media query.

```jsx
const styledCss = `width: 100px;`
```

### Function Interpolation

Of course you can also interpolate function just like you do in Styled Component (because that is the whole point), simply use Styled Component `css` helper function.

```jsx
import {css} from 'styled-components'

// with breakpoints
const styledCss = {xs_o: css`${ props=> `width: ${ props.width }px;` }`}

// or without any breakpoint
const styledCss = css`${ props=> `width: ${ props.width }px;` }`

```

### Class Specificity Level

On top of the septicity you set, you can control individual css property specificity level, the end result is global specificity level times individual specificity level.

```jsx
// if your global specificity level is 3
const styledCss = {
  xs:`&&{width: 100px;}`, // the total specificity level is 2*3 = 6
  md:`width: 200px;` // the total specificity level is 3
  }
```

you don't need `css` helper if you are not doing function interpolation.

## Create Responsive Styled Component

### 1. styledHOC(component)(level)  <--Recommended

creates a component that accept `styledCSS` prop that take `styledCSS` object (see [styledCss](https://github.com/tylim88/styled-break#styledcss) for more information).

* component(required): the component can be Html or React component, see below code for example
* level(optional): override the `sLevel` pass to `styledBreak`, the default value is `styledBreak`'s `sLevel`.

```jsx
import { css } from 'styled-components'
//or you also could import it from styled-break
// import { css } from 'styled-break'

// to create styled html component
const DivStyled = styledHOC('div')(1)

// to create a styled react component
const ButtonStyled = styledHOC(Button)(2)

const Demo = () => {
  return (<>
    <ButtonStyled
      styledCss=`width: 100px;`
    />
    <DivStyled
      width='500'
      styledCss={{
        xs_m: `width:100px;`,
        sm_md: `width:200px;`,
        xl: css`${props =>`width:${props.width}px;`}`,
      }}
    />
  </>
  )
}
```

keep in mind to always use `css` helper to interpolate the function.

### 2. styledR(component)(styledCss)(level)

styledR is basically an extended `styled` of Styled Component

* component(required): same as `component` object described in [styledHOC](https://github.com/tylim88/styled-break#styledhoccomponentslevel).
* styledCss(required): same as `styledCss` object described in [styledCss](https://github.com/tylim88/styled-break#styledcss).
* level(optional):  same as `level` number described in [styledHOC](https://github.com/tylim88/styled-break#styledhoccomponentslevel).

usage example

```jsx
// to create styled html component
const DivStyled = styledR('div')({xs_o: css`${props=> `width: ${props.width}px;`}`})(1)

// to create a styled react component
const ButtonStyled = styledR(Button)(`width: 100px;`)(2)
```

### 3. cssR(styledCss,level)

if you don't like to create responsive styled component with `styledR` or `styledHOC` and you want to use the convention `styled` api of Styled Component, then this is what you need.

* styledCss(required): same as styledCss object described in [styledCss](https://github.com/tylim88/styled-break#styledcss).
* level(optional):  same as `level` number described in [styledHOC](https://github.com/tylim88/styled-break#styledhoccomponentslevel).

```jsx
import styled, { css } from 'styled-components'

const DivStyled = styled.div`
  ${cssR({
        xs_m: `width:100px;`
        sm_md: `width:200px;
        xl: css`${props =>
            `width:${props.width}px;`
            }
      }
      ,3 // specificity level (optional)
      )}
`
```

keep in mind to always use `css` helper to interpolate the function.
