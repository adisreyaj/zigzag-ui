# Zigzag

## Getting Started

### 1. Submodule setup

```sh
git submodule add https://github.com/adisreyaj/zigzag.git
```

### 2. Install deps
Install peer dependencies manually

```sh
npm i @floating-ui/dom
npm install
```

### 3. Include styles
Include the style in the `angular.json` config.

```json
{
  "styles": [
    "zigzag/projects/zigzag/styles/components/index.scss"
  ]
}
```


### 4. Update Tailwind config

Update the tailwind config to also include code from zigzag.
Also add the colors used by the components.

```js
module.exports = {
  content: [
    ...
    'zigzag/**/*.{ts,html}', //<-- add this
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-transparent-10': 'var(--primary-transparent-10)',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
```

### 5. Add CSS Variables
Add required CSS Variables to the `styles.scss` file.

```
:root {
  --primary: hsl(207, 82%, 42%);
  --primary-transparent-10: hsla(207, 82%, 42%, 10%);
}
```