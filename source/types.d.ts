interface Quote {
	en?: string | null;
	author?: string | null;
}

type QuoteProps = {
	color: string,
	quote: Quote
}
