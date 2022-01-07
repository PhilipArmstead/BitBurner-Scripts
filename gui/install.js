const repo = "PhilipArmstead/BitBurner-Scripts"
const branch = "main"
const baseUrl = `https://raw.githubusercontent.com/${repo}/${branch}/`
const configFile = "config.txt"


/** @param {NS} ns */
export async function main (ns) {
	const { dependencies } = await fetchConfig(ns)

	for (const filename of dependencies) {
		const path = `${baseUrl}${filename}`

		try {
			await ns.scriptKill(filename, 'home')
			ns.rm(filename)
			await ns.wget(`${path}?ts=${+new Date()}`, filename)
		} catch (e) {
			ns.tprint(`ERROR: could not download ${path}`)
		}
	}

	ns.tprint("SUCCESS: Install complete")
}


/** @param {NS} ns */
async function fetchConfig (ns) {
	try {
		const dependenciesFile = `/gui/${configFile}`
		ns.rm(dependenciesFile)
		await ns.wget(`${baseUrl}${dependenciesFile}?ts=${+new Date()}`, dependenciesFile)
		const config = JSON.parse(ns.read(dependenciesFile))
		ns.rm(dependenciesFile)

		return config
	} catch (e) {
		ns.tprint(`ERROR: Downloading and reading config file failed ${configFile}`)
		throw e
	}
}
