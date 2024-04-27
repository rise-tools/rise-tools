const host = process.env.NEXT_PUBLIC_EG_HOSTNAME || "localhost";

export const LiveURL = `ws://${host}:3889`;
export const ReadyURL = `ws://${host}:3888`;
