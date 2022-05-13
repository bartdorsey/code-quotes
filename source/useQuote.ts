import { useState, useEffect } from 'react';
import axios from "axios";
import { useAsyncEffect } from "ahooks";
import useCache from "./useCache";
import debug from 'debug';
const log = debug('useQuote')

const QUOTE_API = "http://programming-quotes-api.herokuapp.com/quotes/"
const QUOTE_CACHE_FILE = 'quotes.json'
const CACHE_HOURS = 24

export default function useQuote() {
	const [quote, setQuote] = useState<Quote>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [quotes, setQuotes, cacheLoading] = useCache(QUOTE_CACHE_FILE, CACHE_HOURS);

	log('useQuotes running', quote, loading);

	useEffect(() => {
		if (quotes?.length) {
			log("Choosing Random quote");
			const randomQuoteIndex = Math.floor((Math.random() * quotes.length) + 0)
			const randomQuote = quotes[randomQuoteIndex];
			if (randomQuote) {
				setQuote(randomQuote)
				setLoading(false);
			}
		}
	}, [quotes])

	useAsyncEffect(async () => {
		if (!cacheLoading && !quotes) {
			log('Fetch quotes from API');
			try {
				const { data }: { data: Quote[] } = await axios.get(QUOTE_API);
				setQuotes(data);
			} catch (e) {
				setError(`Could not find a quote to display.`)
			}
		}
	}, [cacheLoading]);


	return {
		loading,
		quote,
		error
	};
}
