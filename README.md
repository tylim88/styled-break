# styled-break

[![npm](https://img.shields.io/npm/v/styled-break)](https://www.npmjs.com/package/styled-break)  [![GitHub](https://img.shields.io/github/license/tylim88/styled-break)](https://github.com/tylim88/styled-break/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/tylim88/styled-break/pulls) [![tylim88](https://circleci.com/gh/tylim88/styled-break.svg?style=svg)](<[LINK](https://github.com/tylim88/styled-break#styled-break)>)

🍨 Create your responsive styled components with breeze using custom [Styled Components](https://www.npmjs.com/package/styled-components) HOC!

* minimalist api, less import more styling!
* declarative, relax and code!
* 0 dependency, small footprint!
* tested and production ready!

🙌 **mapping available in 2.0.0 beta**

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
        _: `background-color: green;
        width: 150px;
        height: 150px;
        `,
        xs_m: `width: 100px;
          height: 100px;
          background-color: blue;
        `,
        sm_md: css({
          width: "200px",
          height: "200px",
          backgroundColor: "red"
        }),
        xl: css`
          ${props =>
            `width: ${props.width}px;
          height: 300px;
          background-color: purple;`}
        `,
        [JSON.stringify({
          _  : [5, 5, 5],
          xs_m: [10, 10, 10],
          sm_md: [20, 20, 20],
          xl: [30, 30, 30],
        })]: (a, b, c) => css`
      border-radius: ${a}px ${b}px ${c}px
       ${props => props.bottomLeftRadius}px;
     `,
      }}
    />
  )
}

render(<Demo />, document.getElementById('root'))

```

which is equivalent to

```css
background-color: green;
width: 150px;
height: 150px;
border-radius: 5px 5px 5px 50px;

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

@media (max-width: 500.98px) {
    border-radius: 10px 10px 10px 50px;
}

@media (min-width: 576px) and (max-width: 991.98px) {
    border-radius: 20px 20px 20px 50px;
}

@media (min-width: 1200px) {
    border-radius: 30px 30px 30px 50px;
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

#### config

* config(optional): object made of `breakpoints` and `sLevel` props.
  * breakpoints(optional): object where default value is `bootstrap` breakpoints: **0, 576, 768, 992, 1200**. You can define as many breakpoints you want.
    * props name: you can name your breakpoint whatever name you want, ⚠️however please **avoid** including underscore `_` in props name.
    * values: The value should be the **minimum** value of your breakpoint (the unit is `px`).
  * sLevel(optional): is global setting of class specificity level, default value is `one`. You can nest specificity level individually to have finer control on class specificity level.
  
the output of `styledBreak` are `styledR` and `styledHOC` HOC plus a `cssR` helper function.

### 2. styledCss

```jsx
const styledCss = {
  xs_m: `width:100px;`,
  sm_md: `width:200px;`,
  xl: css`${props =>`width:${props.width}px;`}`,
}
```

this is your responsive object, the props name have 4 combination for every breakpoint, let take break point `xs`, `sm` and `md` as example where minimum of `xs` is 0, `sm` is 576 and `md` is 768.

here is how you do `without`, `max`, `min`, `only`, and `between` query:

#### a.without

to write style with no media query, name your prop as `_`

```jsx
const styledCss = { _:`width: 100px;` }
```

which equivalent to

```css
width: 100px;
```

this advantage of this over over [As String Input](#As-String-Input) is, this can be written together with media queries.

#### b.min

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

#### c.max

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

#### d.between

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

#### e.only

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

#### default values

if the 1st breakpoint doesn't exist, the whole media query doesn't exist, no style would be applied.

if the 1st breakpoint exist but 2nd breakpoint doesn't exist, such as appending `_randomZT2t2`, there would be no 2nd media query, which mean, it has only `min` media query.

#### As String Input

`styledCss` can also be just string without any breakpoint needed, which mean the style is applied without any media query.

```jsx
const styledCss = `width: 100px;`
```

However if you need to non media query style together with media query style, it is better to use [without](#a.without).

#### Function Interpolation

Of course you can also interpolate function just like you do in Styled Component (because that is the whole point), simply use Styled Component `css` helper function.

```jsx
import {css} from 'styled-components'

// with breakpoints
const styledCss = {xs_o: css`${ props=> `width: ${ props.width }px;` }`}

// or without any breakpoint
const styledCss = css`${ props=> `width: ${ props.width }px;` }`

```

you don't need `css` helper if you are not doing function interpolation, this is stated in Styled Component [doc](https://styled-components.com/docs/api#css).

#### Class Specificity Level

On top of the septicity you set, you can control individual css property specificity level, the end result is global specificity level times individual specificity level.

```jsx
// if your global specificity level is 3
const styledCss = {
  _:`width: 50px;`,
  xs:`&&{width: 100px;}`, // the total specificity level is 2*3 = 6
  md:`width: 200px;` // the total specificity level is 3
  }
```

## Create Responsive Styled Component

### 1. styledHOC(component)(level)  <--Recommended

creates a component that accept `styledCSS` prop that take `styledCSS` object (see [styledCss](#2-styledcss) for more information).

* component(required): the component can be Html or React component, see below code for example
* level(optional): override the `sLevel` pass to [styledBreak](#config), the default value is `styledBreak`'s `sLevel`.

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
        _:`width: 50px;`,
        xs_m: `width:100px;`,
        sm_md: `width:200px;`,
        xl: css`${props =>`width:${props.width}px;`}`,
      }}
    />
  </>
  )
}
```

reminder: always use `css` helper to interpolate the function.

### 2. styledR(component)(styledCss,level)

styledR is basically an extended `styled` of Styled Component

* component(required): same as `component` object described in [styledHOC](#1-styledhoccomponentlevel----recommended).
* styledCss(required): same as `styledCss` object described in [styledCss](#2-styledcss).
* level(optional):  same as `level` number described in [styledHOC](#1-styledhoccomponentlevel----recommended).

usage example

```jsx
// to create styled html component
const DivStyled = styledR('div')({xs_o: css`${props=> `width: ${props.width}px;`}`},1)

// to create a styled react component
const ButtonStyled = styledR(Button)(`width: 100px;`,2)
```

### 3. cssR(styledCss,level)

if you don't like to create responsive styled component with `styledR` or `styledHOC` and you want to use the convention `styled` api of Styled Component, then this is what you need.

* styledCss(required): same as styledCss object described in [styledCss](#2-styledcss).
* level(optional):  same as `level` number described in [styledHOC](#1-styledhoccomponentlevel----recommended).

```jsx
import styled, { css } from 'styled-components'

const DivStyled = styled.div`
  ${cssR({
        _:`width: 50px;`,
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

reminder: always use `css` helper to interpolate the function.

## Acknowledgement

* [Styled Component Breakpoint](https://www.npmjs.com/package/styled-components-breakpoint) for mapping api inspiration.

## To Do

* [x] add styledCss prop name for non media query
* [x] implement map api
* [ ] higher level abstraction (similar to [Styled System](https://www.npmjs.com/package/styled-system))
