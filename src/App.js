import React from 'react';
import UploadFile from "./UploadFile"
import CytoscapeTest from "./CytoscapeTest"
import AppDropDrag from "./AppDropDrag"
import ReactGA from 'react-ga';
//import 'fast-kde';
// eslint-disable-next-line
const App = () => {
	// let d1 = density1d([1, 1, 5, 5, 6, 8]);
	// console.log(d1.points());
	ReactGA.initialize("UA-244870936-1", {
		gaOptions: {
			siteSpeedSampleRate: 100,
		},
	});
	return (
		// <UploadFile />
		// <AppDropDrag />
		<CytoscapeTest />
	)
}

export default App;
