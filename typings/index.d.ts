export interface Trigger {
    keyword: string;
    regex: RegExp | null;
    word: RegExp | null;
    op: string;
    users: Array<string>;
    usersR: Array<string>;
}

declare global {
    interface String {
        complete(...args: Array<string>): string;
    }
}

declare module "discord.js" {
    interface Message {
        command: {
            params: Array<string>;
            guildOnly: boolean;
            args: number;
            vote: boolean;
            execute(msg: Message):void;
        }
        search(): void;
        isCommand(): boolean;
    }
    interface Event {
        t: string,
        d: {
            user_id: string,
            channel_id: string,
            message_id: string,
            emoji: {
                id: string,
                name: string,
            }
        },
    }
    interface Client {
        metrics: {
            incM(): void;
        }
    }
}

export interface DBRowIgnores {
    user: string;
    ignore: string;
}

export interface DBRowTriggers {
    keyword: string;
    regex: boolean;
}

export interface DBConnection {
    query(query: string, object: object, cb:(err: Error, result: DBResult) => void): void;
    release(): void;
}

export interface DBResult {
    [index: number]: any;
    warningCount: number;
    length: number;
}
