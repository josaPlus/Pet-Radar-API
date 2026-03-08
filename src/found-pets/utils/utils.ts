import { envs } from "src/config/envs";

export const generateMapBoxStaticImage = (lat: number, lon: number): string => {
    const accesToken = envs.MAPBOX_TOKEN;
    const zoom = 13;
    const width = 800;
    const height = 400;
    return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s-l+000(${lon},${lat})/${lon},${lat},${zoom}/${width}x${height}?access_token=${accesToken}`; 
}