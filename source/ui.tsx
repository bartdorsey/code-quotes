import React, { FC } from "react";
import Quote from "./Quote";
import useQuote from "./useQuote";
import Spinner from 'ink-spinner';
import { Box } from 'ink';


const App: FC<{ name?: string, color?: string  }> = ({ color = '#FFFFFF' }) => {
	const { quote, loading, error } = useQuote();

	if (loading) {
		return (
			<Box justifyContent="center">
				<Spinner type="dots" />
			</Box>
		)
	}

	return (
		<Quote
			quote={quote || error}
			color={color}
		/>
	);

};

module.exports = App;
export default App;
