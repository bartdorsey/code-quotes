interface Quote {
	en?: string | null;
	author?: string | null;
}

type QuoteProps = {
	colorValue: number,
	quote: Quote
}
