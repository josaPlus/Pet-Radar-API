import { envs } from "src/config/envs";

export const generateMapBoxStaticImage = (
  foundLat: number,
  foundLon: number,
  lostLat: number,
  lostLon: number
): string => {
  const accessToken = envs.MAPBOX_TOKEN;
  const zoom = 14;
  const width = 800;
  const height = 400;

  // Pin rojo = donde se encontró, pin azul = donde se perdió
  const pins = `pin-s-p+f74e4e(${foundLon},${foundLat}),pin-s-l+4e90f7(${lostLon},${lostLat})`;
  const center = `${foundLon},${foundLat},${zoom}`;

  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${pins}/${center}/${width}x${height}?access_token=${accessToken}`;
};