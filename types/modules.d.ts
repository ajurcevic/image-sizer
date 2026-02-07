declare module "ico-endec" {
  export function encode(images: ArrayBuffer[]): Uint8Array;
  export function decode(data: Uint8Array): Uint8Array[];
}

declare module "@catdad/to-ico" {
  function toIco(images: Buffer[]): Promise<Buffer>;
  export default toIco;
}
