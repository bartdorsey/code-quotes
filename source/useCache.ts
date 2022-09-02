import { useState } from "react"
import { useAsyncEffect } from "ahooks"
import { promises as fs } from "fs"
import { differenceInHours } from 'date-fns'
import path from 'path'
import debug from 'debug'
const log = debug('cache:');

let home_path: string;


if (process.env['HOME']) {
	home_path = process.env['HOME'];
}
else if (process.env['USERPROFILE']) {
	home_path = process.env['USERPROFILE'];
}
else {
	throw "no $HOME or $USERPROFILE environment variable"
}

const GLOBAL_CONFIG_DIR = path.join(home_path, '.config')
const CONFIG_DIR = path.join(GLOBAL_CONFIG_DIR, 'code-quotes')
const CACHE_DIR = path.join(CONFIG_DIR, 'cache');

export default function useCache(filename: string, hours: number = 1): any {
	const [cacheData, setCacheData] = useState<any>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | undefined>();
	const cacheFile = path.join(CACHE_DIR, filename);

	async function setCache(data: any) {
		try {
			log(`Writing new cache file, populating cache...`)
			await fs.writeFile(cacheFile, JSON.stringify(data), 'utf-8')
			setCacheData(data);
		}
		catch (e) {
			setError(e as Error)
		}
	}

	useAsyncEffect(
		async () => {
			await createDirectory(GLOBAL_CONFIG_DIR);
			await createDirectory(CONFIG_DIR)
			await createDirectory(CACHE_DIR)

			try {
				log(`Checking time on cache file`);
				const { ctime } = await fs.stat(cacheFile)
				const now = new Date(Date.now())
				log(`Timestamp: ${ctime}, Now: ${now}`)
				if (differenceInHours(now, ctime) >= hours) {
					log(`Removing old cache`);
					await fs.unlink(cacheFile)
					setLoading(false)
					return;
				}
			}
			catch (e) {
				log(e);
				log(`No cache file found`)
				setLoading(false)
				return;
			}

			try {
				log(`Attempting to read cache file`)
				const contents = await fs.readFile(cacheFile, 'utf-8')
				log(`Got contents of cache file`)
				const data = JSON.parse(contents);
				log(`Setting cache data`);
				setCacheData(data);
				setLoading(false);
			}
			catch (err) {
				log(err)
				setError(err as Error);
			}
		},
		[filename, hours]
	);
	return [cacheData, setCache, loading, error];
}

async function createDirectory(path: string) {
	try {
		const stat = await fs.stat(path);
		return stat;
	}
	catch (e) {
		try {
			log(`Creating ${path}`);
			await fs.mkdir(path);
			const stat = await fs.stat(path)
			return stat
		} catch (e) {
			log(e)
			return;
		}
	}
}
