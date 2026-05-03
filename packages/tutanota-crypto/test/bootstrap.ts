import {random} from "../lib/random/Randomizer.js"
export async function bootstrapTests() {
    const crypto = await import("crypto")
    const mockCrypto = {
		getRandomValues: function (bytes: Uint8Array) {
			let randomBytes = crypto.randomBytes(bytes.length)
			bytes.set(randomBytes)
		},
		randomUUID: () => crypto.randomUUID(),
		subtle: "We have to do this, because node's crypto is not compatible with SubtleCrypto. Sorry." as unknown as SubtleCrypto
	}
	Object.defineProperty(globalThis, 'crypto', { value: mockCrypto })
    await random.addEntropy([
        {
            data: 36,
            entropy: 256,
            source: "key",
        },
    ])
}