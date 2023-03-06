import { createClient } from "@sanity/client";

import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
    projectId: `${import.meta.env.VITE_SANITY_PROJECT_ID}`,
    dataset: "production",
    apiVersion: "2023-03-06",
    useCdn: true,
    token: `${import.meta.env.VITE_SANITY_API_TOKEN}`
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)