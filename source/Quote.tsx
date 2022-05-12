import React from "react";
import { Text, Box } from "ink";

export default function Quote({ color, quote }: QuoteProps) {
	const borderColorString = color;
	const textColor = `#FFFFFF`;

	return (
		<Box justifyContent="center">
			<Box
				flexDirection="column"
				borderStyle="round"
				paddingX={2}
				paddingY={1}
				width={80}
				borderColor={borderColorString}
			>
				<Box>
					<Text color={textColor}>{quote.en}</Text>
				</Box>
				<Box justifyContent="flex-end">
					<Text color={textColor}>― {quote.author}</Text>
				</Box>
			</Box>
		</Box>
	);
}
