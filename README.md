# Transcript Retriever

## 📹 Return the audio transcript of a YouTube video

### To run local

```
rm -rf node_modules package-lock.json
npm update
npm run prebuild
npm run prettier
npm run test
npm run build
node build/src/main.js kRCWUrCZoTI
```

## Available Scripts

- `clean` - remove coverage data, Jest cache and transpiled files,
- `prebuild` - lint source files and tests before building,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `prettier` - reformat files,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests

Project maded with https://github.com/jsynowiec/node-typescript-boilerplate
