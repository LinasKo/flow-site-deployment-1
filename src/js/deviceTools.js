/** Functions to figure out info about the device */

export function getNativeResolution() {
  const pixRatio = window.devicePixelRatio;
  const width = window.screen.height * pixRatio;
  const height = window.screen.width * pixRatio;
  return [width, height];
}

export function getScreenSize() {
  const width = window.screen.width;
  const height = window.screen.height;
  return [width, height];
}
