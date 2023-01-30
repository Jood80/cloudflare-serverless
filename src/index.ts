export interface Env {
    CLIENT_ID: string;
}

const allowedOrigins = [
    "https://serverless.shawar-nujood.workers.dev/",
    "http://localhost:5173/",
];

const corsHeaders = (origin: string) => ({
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST",
});

const checkOrigin = (request: Request) => {
    const origin = request.headers.get("Origin");
    const foundOrigin = allowedOrigins.find((allowedOrigin) =>
        allowedOrigin.includes(origin as string)
    );
    return foundOrigin ? foundOrigin : allowedOrigins[0];
};

const getImages = async (request: Request, env: Env): Promise<Response> => {
    const { query }: any = await request.json();

    const res = await fetch(
        `https://api.unsplash.com/search/photos?page=1&query=${query}`,
        {
            headers: {
                Authorization: `Client-ID ${env.CLIENT_ID}`,
            },
        }
    );

    const data: any = await res.json();
    const images = data.results.map((image: any) => ({
        id: image.id,
        image: image.urls.small,
        link: image.links.html,
    }));

    const allowedOrigin = checkOrigin(request);
    return new Response(JSON.stringify(images), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            ...corsHeaders(allowedOrigin as string),
        },
    });
};

export default {
    async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
        if (request.method === "OPTIONS") {
            const allowedOrigin = checkOrigin(request);
            return new Response("OK", {
                headers: corsHeaders(allowedOrigin as string),
            });
        }

        if (request.method === "POST") {
            return getImages(request, env);
        }
    },
};
