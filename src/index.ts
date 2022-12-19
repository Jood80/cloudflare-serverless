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
	CLIENT_ID: string;
}

const allowedOrigins = [
	'https://serverless.shawar-nujood.workers.dev/',
	'http://localhost:5173/'
]

const corsHeaders = (origin: string) => ({
	'Access-Control-Allow-Origin': origin ,
	'Access-Control-Allow-Headers': '*',
	"Access-Control-Allow-Methods": 'POST',
})

const checkOrigin = (request: Request) => {
	const origin = request.headers.get('Origin')
	const foundOrigin = allowedOrigins.find(allowedOrigin => allowedOrigin.includes(origin as string))
	return foundOrigin ? foundOrigin : allowedOrigins[0]
}

const getImages = async (	request: Request,
	env: Env): Promise<Response> => {
	const { query }: any = await request.json()
	
	const res = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${query}`,{
		headers: {
			Authorization: `Client-ID ${ env.CLIENT_ID }`,
		}
	})
	
	const data : any = await res.json() 
	const images = data.results.map((image:any) => ({
		id: image.id,
		image: image.urls.small,
		link: image.links.html
	}))

	const allowedOrigin = checkOrigin(request)
	return new Response(JSON.stringify(images),{
		status: 200,
		headers: {
			"Content-Type": "application/json", 
			...corsHeaders(allowedOrigin as string)
		}
	})
}

export default {
	async fetch(
		request: Request,
		env: Env,
		_ctx: ExecutionContext
	) {
		
		if(request.method === 'OPTIONS') {		
			const allowedOrigin = checkOrigin(request)
			return new Response("OK",{ headers: corsHeaders(allowedOrigin as string) })
		}

		if(request.method === 'POST') {			
			return getImages(request,env)
		}
	}
}
