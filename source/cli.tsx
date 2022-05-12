#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './ui';

const cli = meow(`
	Usage
	  $ code-quotes

	Options
	  --color, -c Specify a hex border color

	Examples
		code-quotes -c #A30000

`, {
	flags: {
		color: {
			type: 'string',
			alias: 'c'
		}
	}
});

render(<App color={cli.flags.color}/>);
