import React, { FC, useEffect, useState } from "react";
import Quote from "./Quote";

import useQuote from "./useQuote";


const App: FC<{ name?: string }> = () => {
	const { quote, loading } = useQuote();
	const [colorValue, setColorValue] = useState(0);

	useEffect(() => {
		if (colorValue >= 255 || loading) {
			return;
		}
		setTimeout(() => {
			setColorValue(colorValue + 1);
		}, 1);
	}, [colorValue, loading]);

	return (
		<Quote
			quote={quote}
			colorValue={colorValue}
		/>
	);

};

module.exports = App;
export default App;
