import { ChildProcess, SpawnOptions, SpawnSyncOptions } from "node:child_process";
import { Readable } from "node:stream";
interface NormalizedSpawnCommand {
  command: string;
  args: readonly string[];
  options: SpawnOptions;
}
/**
 * Normalizes the command and arguments to work cross-platform.
 * On Windows, this basically handles things like shebangs, calling
 * `node_modules/.bin` commands, and escaping meta characters.
 * On other platforms, it just returns the command and arguments as-is.
 */
export declare function normalizeSpawnCommand(command: string, args?: readonly string[], options?: SpawnOptions): NormalizedSpawnCommand;
export declare class NonZeroExitError extends Error {
  readonly result: CommonOutputApi;
  readonly output?: Output | undefined;
  readonly exitCode: number;
  get signalCode(): string | null;
  constructor(result: CommonOutputApi, output?: Output | undefined, command?: string, args?: readonly string[]);
}
export interface Output {
  stderr: string;
  stdout: string;
  exitCode: number | undefined;
}
export interface PipeOptions extends Options {}
export type KillSignal = Parameters<ChildProcess['kill']>[0];
export interface CommonOutputApi {
  get pid(): number | undefined;
  get killed(): boolean;
  get exitCode(): number | undefined;
  get signalCode(): string | null;
}
export interface OutputApi extends AsyncIterable<string>, CommonOutputApi {
  process: ChildProcess | undefined;
  get aborted(): boolean;
  pipe(command: string, args?: readonly string[], options?: Partial<PipeOptions>): Result;
  kill(signal?: KillSignal): boolean;
}
export interface OutputApiSync extends Iterable<string>, CommonOutputApi {}
export type Result = PromiseLike<Output> & OutputApi;
export type SyncResult = Output & OutputApiSync;
export interface CommonOptions {
  timeout: number;
  throwOnError: boolean;
  nodePath: boolean;
  inheritEnv: boolean;
}
export interface Options extends CommonOptions {
  signal: AbortSignal;
  nodeOptions: SpawnOptions;
  persist: boolean;
  stdin: Result | ExecProcess | string;
}
export interface SyncOptions extends CommonOptions {
  nodeOptions: SpawnSyncOptions;
}
export interface TinyExec {
  (command: string, args?: readonly string[], options?: Partial<Options>): Result;
}
export declare class ExecProcess implements Result {
  protected _process?: ChildProcess;
  protected _aborted: boolean;
  protected _options: Partial<Options>;
  protected _command: string;
  protected _args: readonly string[];
  protected _resolveClose?: () => void;
  protected _processClosed: Promise<void>;
  protected _thrownError?: Error;
  protected _outputPromise?: Promise<Output>;
  get process(): ChildProcess | undefined;
  get pid(): number | undefined;
  get exitCode(): number | undefined;
  get signalCode(): string | null;
  constructor(command: string, args?: readonly string[], options?: Partial<Options>);
  kill(signal?: KillSignal): boolean;
  get aborted(): boolean;
  get killed(): boolean;
  pipe(command: string, args?: readonly string[], options?: Partial<PipeOptions>): Result;
  [Symbol.asyncIterator](): AsyncIterator<string>;
  protected _waitForOutput(): Promise<Output>;
  then<TResult1 = Output, TResult2 = never>(onfulfilled?: ((value: Output) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2>;
  protected _streamOut?: Readable;
  protected _streamErr?: Readable;
  spawn(): void;
  protected _resetState(): void;
  protected _onError: (err: Error) => void;
  protected _onClose: () => void;
}
export declare function xSync(command: string, args?: readonly string[], options?: Partial<SyncOptions>): SyncResult;
export declare const x: TinyExec;
export declare const exec: TinyExec;
export declare const execSync: typeof xSync;
export {};