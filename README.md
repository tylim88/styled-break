# styled-break

🍨 Create your responsive styled components with breeze using custom [Styled Components](https://www.npmjs.com/package/styled-components) HOC!

## Installation

```bash
npm i styled-break
```

## Demo

Try it at **[Code Sandbox](https://codesandbox.io/s/styled-break-sf6c9)**!  

## Usage

simply use it just like you use React Router Link

```jsx
import React from 'react'
import { render } from 'react-dom'
import { responsiveStyledGenerator } from 'styled-break'
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

const { styledHOC } = responsiveStyledGenerator(config)

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

## API


