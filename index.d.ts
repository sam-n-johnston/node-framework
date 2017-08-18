/// <reference types="node" />
/// <reference types="mongoose" />
/// <reference types="mongoose-paginate" />
import { Server, IncomingMessage, ServerResponse } from 'http';
import { Document as MongooseDocument, Schema as MongooseSchema, PaginateModel as MongoosePaginateModel } from 'mongoose';

//////////////////
// Logger utils //
//////////////////

// AccessLogger
export interface UserIdCallback {
    (req: IncomingMessage, res: ServerResponse): string;
}

export class AccessLogger {
    constructor(appId: string);
    enable(enabled: boolean): void;
    setPretty(pretty: boolean): void;
    setStream(stream: {write: Function}): void;
    setAppId(appId: string): void;
    setUserIdCallback(callback: UserIdCallback): void;
    logRequest(req: IncomingMessage, res: ServerResponse, next?: Function): void;
}

// AppLogger related interfaces and data
export enum LogLevel {
    Silly = 0,
    Verbose = 1,
    Info = 2,
    Warn = 3,
    Error = 4
}

export interface Logger {
    enable(enabled: boolean): void;
    setAppId(appId: string): void;
    setLevel(level: LogLevel): void;
    setPretty(pretty: Boolean): void;
    setStream(stream: {write: Function}): void;
    generateRequestId(): string;

    log(level: LogLevel, message: string, id?: string, tags?: string[], details?: any): void;
    silly(message: string, id?: string, tags?: string[], details?: any): void;
    verbose(message: string, id?: string, tags?: string[], details?: any): void;
    info(message: string, id?: string, tags?: string[], details?: any): void;
    warn(message: string, id?: string, tags?: string[], details?: any): void;
    error(message: string, id?: string, tags?: string[], details?: any): void;

    getRequestLogger(requestId: string): RequestLogger;
}

export interface RequestLogger {
    silly(message: string, tags?: string[], details?: any): void;
    verbose(message: string, tags?: string[], details?: any): void;
    info(message: string, tags?: string[], details?: any): void;
    warn(message: string, tags?: string[], details?: any): void;
    error(message: string, tags?: string[], details?: any): void;
}

// AppLogger
export class AppLogger implements Logger {
    constructor(appId: string, level?: LogLevel, stream?: {write: Function});
    enable(enabled: boolean): void;
    setAppId(appId: string): void;
    getAppId(): string;
    generateRequestId(): string;
    setLevel(level: LogLevel): void;
    getLevel(): LogLevel;
    setPretty(pretty: boolean): void;
    setStream(stream: {write: Function}): void;
    log(level: LogLevel, message: string, id?: string, tags?: string[], details?: any): void;
    silly(message: string, id?: string, tags?: string[], details?: any): void;
    verbose(message: string, id?: string, tags?: string[], details?: any): void;
    info(message: string, id?: string, tags?: string[], details?: any): void;
    warn(message: string, id?: string, tags?: string[], details?: any): void;
    error(message: string, id?: string, tags?: string[], details?: any): void;
    getRequestLogger(requestId: string): RequestLogger;
}

////////////////
// HTTP utils //
////////////////
export interface SafeShutdownServer {
    readonly isShuttingDown: boolean;
    safeShutdown(timeout?: number): Promise<void>;
}
export declare class SafeShutdown {
    static server<T extends Server>(server: T): T & SafeShutdownServer;
}

///////////////////
// MongoDb utils //
///////////////////
export interface MongoConnectionOptions {
    database: string;
    connectionString: string;
    shardedCluster: boolean;
    readPreference: string;
    replicaSetName: string;
    username: string;
    password: string;
    debug: boolean;
}

export class MongoConnection {
    protected database: string;
    protected options: any;

    constructor(options: MongoConnectionOptions);
    public connect(): Promise<void>;
    public disconnect(): Promise<void>;
    public getModel<T extends MongooseDocument>(name: string, schema: MongooseSchema, increment?: boolean): Promise<MongoosePaginateModel<T>>;
}

///////////////////
// Augmentations //
///////////////////

// HTTP module override
declare module 'http' {
    export interface IncomingMessage {
        xRequestId?: string;
        logger?: RequestLogger;
    }
}