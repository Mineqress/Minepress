export interface Config {
    server?: {
        host: string;
        port: number;
    };
    username?: string;
    password?: string;
    loginType?: "mojang" | "microsoft";
}
