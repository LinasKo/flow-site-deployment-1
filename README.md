# LetsFlow Demo Website

## Architecture
The normal way to make the app is as follows:
1. A top-level Finite-State-Machine component that tracks the state of the app, schedules which components are rendered.
2. Each component has elements of:
  1. Video / canvas + pose tracking
  2. UI elements - buttons, etc
3. ...
4. Profit?

**The problems**:
* When the top-level element changes, Video + pose-tracking is reinitialized, which takes 10+ seconds.
* We suddenly need to protect everything in the hierarchy leading up to pose tracking from having state / rerendering.

**Solution**: Sandwich architecture:
* Top-level component with no state, but can pass messages between children. Contains:
  * Video / canvas + pose tracking, with mostly no state.
  children of this, like canvas, will have state, e.g. so it can rerender in RARE occasions, say, on orientation changes. But otherwise it's just controlled by functions, to, e.g. turn off pose tracking / camera.
  * Contains stateful FSM element for controlling the flow of the app. Has much state, much, UI and is basically a normal React world. Through functions, it is also told about anything related to the pose itself.

Disadvantages:
1. Maybe hard to pass messages between components, but we'll see.
2. It's unclear whether tutorial videos should be played on the UI or the Pose view.

## Installation

#### 1. fullpage issues
There's a compiler error related to a missing plugin in `fullpage`.\
To remove it, go to `extra`, and copy `scrolloverflow.min.js.map` there to `node_modules/@fullpage/dist/`

Note: it's not ideal - check if this clears up when we get the license.

#### 2. HTTPS
`navigator.mediaInfo.Something` isn't available on the phones, if not accessed via HTTP.
Solution: set up a cert authority on the PC, make a cert. Even if it's not accepted by Android, it still requests camera permissions :)

How:
```bash
# Set up authority:
# 1. Install mkcert
# 2. Run:
mkdir -p .cert
mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem "localhost"

# Start with:
HTTPS=true SSL_CRT_FILE=./.cert/cert.pem SSL_KEY_FILE=./.cert/key.pem npm start

# Or just:
npm run start-https
```



---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
