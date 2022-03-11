import { useState, useEffect } from "react";
import axios from "axios";

const QUOTE_API = "http://programming-quotes-api.herokuapp.com/quotes/random";

export default function useQuote() {
	const [quote, setQuote] = useState<Quote>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchQuote = async () => {
			const { data: quote } = await axios.get(QUOTE_API);
			setQuote(quote);
			setLoading(false);
		};
		fetchQuote();
	}, []);

	return {
		loading,
		quote,
	};
}
