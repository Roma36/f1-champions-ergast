# f1-champions-ergast
Coding challenge

To easily start the project on local machine, please run the following commands: `npm install && npm start`

The app is already deployed to github pages. You can open it by link: [https://roma36.github.io/f1-champions-ergast]

To see unit test coverage, follow: [https://roma36.github.io/f1-champions-ergast/coverage] or run `npm run test -- --coverage` locally.

The App is written without any third-party state-management library, it consists of `React` as UI library, `axios` for http requests, `styled-components` for styles and `TypeScript` as main programming language.

Also, `react-testing-library` was used for unit-testing and `nock` for mocking http requests.

The app also leverages brand new React Hooks feature, which has been released recently in v.16.8.0.
 

## All Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
