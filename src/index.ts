/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://dwrevelopers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;

}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const CLIENT_ID = 'o-aHKqoioDgSKOfyqOiPWK2vDelte2R7EKCb3fS4LU4'
		const res = await fetch("https://api.unsplash.com/photos",{
			headers: {
				Authorization: `Client-ID ${CLIENT_ID}`
			}
		})
		const data = await res.json() 
		
		return new Response(JSON.stringify(data),{
			status: 200,
			headers: {
				"Content-Type": "application/json"
			}
		})

		const { query }: any = await request.json() // getBody
		return new Response(`Your query was ${ query }`);
	},
};
