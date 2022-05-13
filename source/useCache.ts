import { useState } from "react"
import { useAsyncEffect } from "ahooks"
import { promises as fs } from "fs"
import { differenceInHours } from 'date-fns'
import path from 'path'
import debug from 'debug'
const log = debug('cache:');

if (!process.env['HOME']) {
	throw "no $HOME environment variable"
}
const GLOBAL_CONFIG_DIR = path.join(process.env['HOME'],'.config')
const CONFIG_DIR = path.join(GLOBAL_CONFIG_DIR, 'code-quotes')
const CACHE_DIR = path.join(CONFIG_DIR, 'cache');

export default function useCache(filename: string, hours: number = 1): any {
	const [cacheData, setCacheData] = useState<any>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | undefined>();
	const cacheFile = path.join(CACHE_DIR, filename);

	async function setCache(data: any) {
		try {
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
				const { ctime } = await fs.stat(cacheFile)
				const now = new Date(Date.now())
				if (differenceInHours(now, ctime) > hours) {
					log(`Removing old cache`);
					await fs.unlink(cacheFile)
				}
			}
			catch (e) {
				log(e);
				log(`Writing empty cache file`)
				await fs.writeFile(cacheFile, 'utf-8')
				console.error(e);
			}

			try {
				log(`Reading cache file`)
				const contents = await fs.readFile(cacheFile, 'utf-8')
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
