
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model feedbacks
 * 
 */
export type feedbacks = $Result.DefaultSelection<Prisma.$feedbacksPayload>
/**
 * Model group_chats
 * 
 */
export type group_chats = $Result.DefaultSelection<Prisma.$group_chatsPayload>
/**
 * Model meetings
 * 
 */
export type meetings = $Result.DefaultSelection<Prisma.$meetingsPayload>
/**
 * Model messages
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 */
export type messages = $Result.DefaultSelection<Prisma.$messagesPayload>
/**
 * Model projects
 * 
 */
export type projects = $Result.DefaultSelection<Prisma.$projectsPayload>
/**
 * Model recordings
 * 
 */
export type recordings = $Result.DefaultSelection<Prisma.$recordingsPayload>
/**
 * Model requirements
 * 
 */
export type requirements = $Result.DefaultSelection<Prisma.$requirementsPayload>
/**
 * Model specbot_chats
 * 
 */
export type specbot_chats = $Result.DefaultSelection<Prisma.$specbot_chatsPayload>
/**
 * Model users
 * 
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const project_status: {
  draft: 'draft',
  active: 'active',
  on_hold: 'on_hold',
  completed: 'completed',
  archived: 'archived'
};

export type project_status = (typeof project_status)[keyof typeof project_status]

}

export type project_status = $Enums.project_status

export const project_status: typeof $Enums.project_status

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Feedbacks
 * const feedbacks = await prisma.feedbacks.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Feedbacks
   * const feedbacks = await prisma.feedbacks.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.feedbacks`: Exposes CRUD operations for the **feedbacks** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Feedbacks
    * const feedbacks = await prisma.feedbacks.findMany()
    * ```
    */
  get feedbacks(): Prisma.feedbacksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.group_chats`: Exposes CRUD operations for the **group_chats** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Group_chats
    * const group_chats = await prisma.group_chats.findMany()
    * ```
    */
  get group_chats(): Prisma.group_chatsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.meetings`: Exposes CRUD operations for the **meetings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Meetings
    * const meetings = await prisma.meetings.findMany()
    * ```
    */
  get meetings(): Prisma.meetingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.messages`: Exposes CRUD operations for the **messages** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.messages.findMany()
    * ```
    */
  get messages(): Prisma.messagesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projects`: Exposes CRUD operations for the **projects** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.projects.findMany()
    * ```
    */
  get projects(): Prisma.projectsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recordings`: Exposes CRUD operations for the **recordings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Recordings
    * const recordings = await prisma.recordings.findMany()
    * ```
    */
  get recordings(): Prisma.recordingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.requirements`: Exposes CRUD operations for the **requirements** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Requirements
    * const requirements = await prisma.requirements.findMany()
    * ```
    */
  get requirements(): Prisma.requirementsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.specbot_chats`: Exposes CRUD operations for the **specbot_chats** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Specbot_chats
    * const specbot_chats = await prisma.specbot_chats.findMany()
    * ```
    */
  get specbot_chats(): Prisma.specbot_chatsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    feedbacks: 'feedbacks',
    group_chats: 'group_chats',
    meetings: 'meetings',
    messages: 'messages',
    projects: 'projects',
    recordings: 'recordings',
    requirements: 'requirements',
    specbot_chats: 'specbot_chats',
    users: 'users'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "feedbacks" | "group_chats" | "meetings" | "messages" | "projects" | "recordings" | "requirements" | "specbot_chats" | "users"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      feedbacks: {
        payload: Prisma.$feedbacksPayload<ExtArgs>
        fields: Prisma.feedbacksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.feedbacksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.feedbacksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          findFirst: {
            args: Prisma.feedbacksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.feedbacksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          findMany: {
            args: Prisma.feedbacksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>[]
          }
          create: {
            args: Prisma.feedbacksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          createMany: {
            args: Prisma.feedbacksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.feedbacksCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>[]
          }
          delete: {
            args: Prisma.feedbacksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          update: {
            args: Prisma.feedbacksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          deleteMany: {
            args: Prisma.feedbacksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.feedbacksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.feedbacksUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>[]
          }
          upsert: {
            args: Prisma.feedbacksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbacksPayload>
          }
          aggregate: {
            args: Prisma.FeedbacksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeedbacks>
          }
          groupBy: {
            args: Prisma.feedbacksGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeedbacksGroupByOutputType>[]
          }
          count: {
            args: Prisma.feedbacksCountArgs<ExtArgs>
            result: $Utils.Optional<FeedbacksCountAggregateOutputType> | number
          }
        }
      }
      group_chats: {
        payload: Prisma.$group_chatsPayload<ExtArgs>
        fields: Prisma.group_chatsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.group_chatsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.group_chatsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload>
          }
          findFirst: {
            args: Prisma.group_chatsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.group_chatsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload>
          }
          findMany: {
            args: Prisma.group_chatsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload>[]
          }
          create: {
            args: Prisma.group_chatsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload>
          }
          createMany: {
            args: Prisma.group_chatsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.group_chatsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload>[]
          }
          delete: {
            args: Prisma.group_chatsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload>
          }
          update: {
            args: Prisma.group_chatsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload>
          }
          deleteMany: {
            args: Prisma.group_chatsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.group_chatsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.group_chatsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload>[]
          }
          upsert: {
            args: Prisma.group_chatsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$group_chatsPayload>
          }
          aggregate: {
            args: Prisma.Group_chatsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroup_chats>
          }
          groupBy: {
            args: Prisma.group_chatsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Group_chatsGroupByOutputType>[]
          }
          count: {
            args: Prisma.group_chatsCountArgs<ExtArgs>
            result: $Utils.Optional<Group_chatsCountAggregateOutputType> | number
          }
        }
      }
      meetings: {
        payload: Prisma.$meetingsPayload<ExtArgs>
        fields: Prisma.meetingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.meetingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.meetingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload>
          }
          findFirst: {
            args: Prisma.meetingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.meetingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload>
          }
          findMany: {
            args: Prisma.meetingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload>[]
          }
          create: {
            args: Prisma.meetingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload>
          }
          createMany: {
            args: Prisma.meetingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.meetingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload>[]
          }
          delete: {
            args: Prisma.meetingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload>
          }
          update: {
            args: Prisma.meetingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload>
          }
          deleteMany: {
            args: Prisma.meetingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.meetingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.meetingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload>[]
          }
          upsert: {
            args: Prisma.meetingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$meetingsPayload>
          }
          aggregate: {
            args: Prisma.MeetingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMeetings>
          }
          groupBy: {
            args: Prisma.meetingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<MeetingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.meetingsCountArgs<ExtArgs>
            result: $Utils.Optional<MeetingsCountAggregateOutputType> | number
          }
        }
      }
      messages: {
        payload: Prisma.$messagesPayload<ExtArgs>
        fields: Prisma.messagesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.messagesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.messagesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          findFirst: {
            args: Prisma.messagesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.messagesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          findMany: {
            args: Prisma.messagesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>[]
          }
          create: {
            args: Prisma.messagesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          createMany: {
            args: Prisma.messagesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.messagesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>[]
          }
          delete: {
            args: Prisma.messagesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          update: {
            args: Prisma.messagesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          deleteMany: {
            args: Prisma.messagesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.messagesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.messagesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>[]
          }
          upsert: {
            args: Prisma.messagesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          aggregate: {
            args: Prisma.MessagesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessages>
          }
          groupBy: {
            args: Prisma.messagesGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessagesGroupByOutputType>[]
          }
          count: {
            args: Prisma.messagesCountArgs<ExtArgs>
            result: $Utils.Optional<MessagesCountAggregateOutputType> | number
          }
        }
      }
      projects: {
        payload: Prisma.$projectsPayload<ExtArgs>
        fields: Prisma.projectsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.projectsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.projectsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload>
          }
          findFirst: {
            args: Prisma.projectsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.projectsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload>
          }
          findMany: {
            args: Prisma.projectsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload>[]
          }
          create: {
            args: Prisma.projectsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload>
          }
          createMany: {
            args: Prisma.projectsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.projectsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload>[]
          }
          delete: {
            args: Prisma.projectsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload>
          }
          update: {
            args: Prisma.projectsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload>
          }
          deleteMany: {
            args: Prisma.projectsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.projectsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.projectsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload>[]
          }
          upsert: {
            args: Prisma.projectsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectsPayload>
          }
          aggregate: {
            args: Prisma.ProjectsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjects>
          }
          groupBy: {
            args: Prisma.projectsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectsGroupByOutputType>[]
          }
          count: {
            args: Prisma.projectsCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectsCountAggregateOutputType> | number
          }
        }
      }
      recordings: {
        payload: Prisma.$recordingsPayload<ExtArgs>
        fields: Prisma.recordingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.recordingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.recordingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload>
          }
          findFirst: {
            args: Prisma.recordingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.recordingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload>
          }
          findMany: {
            args: Prisma.recordingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload>[]
          }
          create: {
            args: Prisma.recordingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload>
          }
          createMany: {
            args: Prisma.recordingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.recordingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload>[]
          }
          delete: {
            args: Prisma.recordingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload>
          }
          update: {
            args: Prisma.recordingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload>
          }
          deleteMany: {
            args: Prisma.recordingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.recordingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.recordingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload>[]
          }
          upsert: {
            args: Prisma.recordingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$recordingsPayload>
          }
          aggregate: {
            args: Prisma.RecordingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecordings>
          }
          groupBy: {
            args: Prisma.recordingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecordingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.recordingsCountArgs<ExtArgs>
            result: $Utils.Optional<RecordingsCountAggregateOutputType> | number
          }
        }
      }
      requirements: {
        payload: Prisma.$requirementsPayload<ExtArgs>
        fields: Prisma.requirementsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.requirementsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.requirementsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload>
          }
          findFirst: {
            args: Prisma.requirementsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.requirementsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload>
          }
          findMany: {
            args: Prisma.requirementsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload>[]
          }
          create: {
            args: Prisma.requirementsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload>
          }
          createMany: {
            args: Prisma.requirementsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.requirementsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload>[]
          }
          delete: {
            args: Prisma.requirementsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload>
          }
          update: {
            args: Prisma.requirementsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload>
          }
          deleteMany: {
            args: Prisma.requirementsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.requirementsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.requirementsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload>[]
          }
          upsert: {
            args: Prisma.requirementsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requirementsPayload>
          }
          aggregate: {
            args: Prisma.RequirementsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRequirements>
          }
          groupBy: {
            args: Prisma.requirementsGroupByArgs<ExtArgs>
            result: $Utils.Optional<RequirementsGroupByOutputType>[]
          }
          count: {
            args: Prisma.requirementsCountArgs<ExtArgs>
            result: $Utils.Optional<RequirementsCountAggregateOutputType> | number
          }
        }
      }
      specbot_chats: {
        payload: Prisma.$specbot_chatsPayload<ExtArgs>
        fields: Prisma.specbot_chatsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.specbot_chatsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.specbot_chatsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload>
          }
          findFirst: {
            args: Prisma.specbot_chatsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.specbot_chatsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload>
          }
          findMany: {
            args: Prisma.specbot_chatsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload>[]
          }
          create: {
            args: Prisma.specbot_chatsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload>
          }
          createMany: {
            args: Prisma.specbot_chatsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.specbot_chatsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload>[]
          }
          delete: {
            args: Prisma.specbot_chatsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload>
          }
          update: {
            args: Prisma.specbot_chatsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload>
          }
          deleteMany: {
            args: Prisma.specbot_chatsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.specbot_chatsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.specbot_chatsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload>[]
          }
          upsert: {
            args: Prisma.specbot_chatsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$specbot_chatsPayload>
          }
          aggregate: {
            args: Prisma.Specbot_chatsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpecbot_chats>
          }
          groupBy: {
            args: Prisma.specbot_chatsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Specbot_chatsGroupByOutputType>[]
          }
          count: {
            args: Prisma.specbot_chatsCountArgs<ExtArgs>
            result: $Utils.Optional<Specbot_chatsCountAggregateOutputType> | number
          }
        }
      }
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    feedbacks?: feedbacksOmit
    group_chats?: group_chatsOmit
    meetings?: meetingsOmit
    messages?: messagesOmit
    projects?: projectsOmit
    recordings?: recordingsOmit
    requirements?: requirementsOmit
    specbot_chats?: specbot_chatsOmit
    users?: usersOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type MeetingsCountOutputType
   */

  export type MeetingsCountOutputType = {
    recordings: number
  }

  export type MeetingsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recordings?: boolean | MeetingsCountOutputTypeCountRecordingsArgs
  }

  // Custom InputTypes
  /**
   * MeetingsCountOutputType without action
   */
  export type MeetingsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingsCountOutputType
     */
    select?: MeetingsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MeetingsCountOutputType without action
   */
  export type MeetingsCountOutputTypeCountRecordingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: recordingsWhereInput
  }


  /**
   * Count Type ProjectsCountOutputType
   */

  export type ProjectsCountOutputType = {
    feedbacks: number
    meetings: number
    requirements: number
    specbot_chats: number
  }

  export type ProjectsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    feedbacks?: boolean | ProjectsCountOutputTypeCountFeedbacksArgs
    meetings?: boolean | ProjectsCountOutputTypeCountMeetingsArgs
    requirements?: boolean | ProjectsCountOutputTypeCountRequirementsArgs
    specbot_chats?: boolean | ProjectsCountOutputTypeCountSpecbot_chatsArgs
  }

  // Custom InputTypes
  /**
   * ProjectsCountOutputType without action
   */
  export type ProjectsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectsCountOutputType
     */
    select?: ProjectsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectsCountOutputType without action
   */
  export type ProjectsCountOutputTypeCountFeedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: feedbacksWhereInput
  }

  /**
   * ProjectsCountOutputType without action
   */
  export type ProjectsCountOutputTypeCountMeetingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: meetingsWhereInput
  }

  /**
   * ProjectsCountOutputType without action
   */
  export type ProjectsCountOutputTypeCountRequirementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: requirementsWhereInput
  }

  /**
   * ProjectsCountOutputType without action
   */
  export type ProjectsCountOutputTypeCountSpecbot_chatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: specbot_chatsWhereInput
  }


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    meetings: number
    messages: number
    projects: number
    specbot_chats: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meetings?: boolean | UsersCountOutputTypeCountMeetingsArgs
    messages?: boolean | UsersCountOutputTypeCountMessagesArgs
    projects?: boolean | UsersCountOutputTypeCountProjectsArgs
    specbot_chats?: boolean | UsersCountOutputTypeCountSpecbot_chatsArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountMeetingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: meetingsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: messagesWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: projectsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountSpecbot_chatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: specbot_chatsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model feedbacks
   */

  export type AggregateFeedbacks = {
    _count: FeedbacksCountAggregateOutputType | null
    _min: FeedbacksMinAggregateOutputType | null
    _max: FeedbacksMaxAggregateOutputType | null
  }

  export type FeedbacksMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: string | null
    created_at: Date | null
    project_id: string | null
  }

  export type FeedbacksMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: string | null
    created_at: Date | null
    project_id: string | null
  }

  export type FeedbacksCountAggregateOutputType = {
    id: number
    title: number
    description: number
    status: number
    form_structure: number
    response: number
    created_at: number
    project_id: number
    _all: number
  }


  export type FeedbacksMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    created_at?: true
    project_id?: true
  }

  export type FeedbacksMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    created_at?: true
    project_id?: true
  }

  export type FeedbacksCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    form_structure?: true
    response?: true
    created_at?: true
    project_id?: true
    _all?: true
  }

  export type FeedbacksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which feedbacks to aggregate.
     */
    where?: feedbacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbacksOrderByWithRelationInput | feedbacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: feedbacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned feedbacks
    **/
    _count?: true | FeedbacksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeedbacksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeedbacksMaxAggregateInputType
  }

  export type GetFeedbacksAggregateType<T extends FeedbacksAggregateArgs> = {
        [P in keyof T & keyof AggregateFeedbacks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeedbacks[P]>
      : GetScalarType<T[P], AggregateFeedbacks[P]>
  }




  export type feedbacksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: feedbacksWhereInput
    orderBy?: feedbacksOrderByWithAggregationInput | feedbacksOrderByWithAggregationInput[]
    by: FeedbacksScalarFieldEnum[] | FeedbacksScalarFieldEnum
    having?: feedbacksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeedbacksCountAggregateInputType | true
    _min?: FeedbacksMinAggregateInputType
    _max?: FeedbacksMaxAggregateInputType
  }

  export type FeedbacksGroupByOutputType = {
    id: string
    title: string | null
    description: string | null
    status: string | null
    form_structure: JsonValue | null
    response: JsonValue | null
    created_at: Date | null
    project_id: string | null
    _count: FeedbacksCountAggregateOutputType | null
    _min: FeedbacksMinAggregateOutputType | null
    _max: FeedbacksMaxAggregateOutputType | null
  }

  type GetFeedbacksGroupByPayload<T extends feedbacksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeedbacksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeedbacksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeedbacksGroupByOutputType[P]>
            : GetScalarType<T[P], FeedbacksGroupByOutputType[P]>
        }
      >
    >


  export type feedbacksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    form_structure?: boolean
    response?: boolean
    created_at?: boolean
    project_id?: boolean
    projects?: boolean | feedbacks$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["feedbacks"]>

  export type feedbacksSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    form_structure?: boolean
    response?: boolean
    created_at?: boolean
    project_id?: boolean
    projects?: boolean | feedbacks$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["feedbacks"]>

  export type feedbacksSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    form_structure?: boolean
    response?: boolean
    created_at?: boolean
    project_id?: boolean
    projects?: boolean | feedbacks$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["feedbacks"]>

  export type feedbacksSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    form_structure?: boolean
    response?: boolean
    created_at?: boolean
    project_id?: boolean
  }

  export type feedbacksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "status" | "form_structure" | "response" | "created_at" | "project_id", ExtArgs["result"]["feedbacks"]>
  export type feedbacksInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | feedbacks$projectsArgs<ExtArgs>
  }
  export type feedbacksIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | feedbacks$projectsArgs<ExtArgs>
  }
  export type feedbacksIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | feedbacks$projectsArgs<ExtArgs>
  }

  export type $feedbacksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "feedbacks"
    objects: {
      projects: Prisma.$projectsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      description: string | null
      status: string | null
      form_structure: Prisma.JsonValue | null
      response: Prisma.JsonValue | null
      created_at: Date | null
      project_id: string | null
    }, ExtArgs["result"]["feedbacks"]>
    composites: {}
  }

  type feedbacksGetPayload<S extends boolean | null | undefined | feedbacksDefaultArgs> = $Result.GetResult<Prisma.$feedbacksPayload, S>

  type feedbacksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<feedbacksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FeedbacksCountAggregateInputType | true
    }

  export interface feedbacksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['feedbacks'], meta: { name: 'feedbacks' } }
    /**
     * Find zero or one Feedbacks that matches the filter.
     * @param {feedbacksFindUniqueArgs} args - Arguments to find a Feedbacks
     * @example
     * // Get one Feedbacks
     * const feedbacks = await prisma.feedbacks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends feedbacksFindUniqueArgs>(args: SelectSubset<T, feedbacksFindUniqueArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Feedbacks that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {feedbacksFindUniqueOrThrowArgs} args - Arguments to find a Feedbacks
     * @example
     * // Get one Feedbacks
     * const feedbacks = await prisma.feedbacks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends feedbacksFindUniqueOrThrowArgs>(args: SelectSubset<T, feedbacksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksFindFirstArgs} args - Arguments to find a Feedbacks
     * @example
     * // Get one Feedbacks
     * const feedbacks = await prisma.feedbacks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends feedbacksFindFirstArgs>(args?: SelectSubset<T, feedbacksFindFirstArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedbacks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksFindFirstOrThrowArgs} args - Arguments to find a Feedbacks
     * @example
     * // Get one Feedbacks
     * const feedbacks = await prisma.feedbacks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends feedbacksFindFirstOrThrowArgs>(args?: SelectSubset<T, feedbacksFindFirstOrThrowArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Feedbacks
     * const feedbacks = await prisma.feedbacks.findMany()
     * 
     * // Get first 10 Feedbacks
     * const feedbacks = await prisma.feedbacks.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feedbacksWithIdOnly = await prisma.feedbacks.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends feedbacksFindManyArgs>(args?: SelectSubset<T, feedbacksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Feedbacks.
     * @param {feedbacksCreateArgs} args - Arguments to create a Feedbacks.
     * @example
     * // Create one Feedbacks
     * const Feedbacks = await prisma.feedbacks.create({
     *   data: {
     *     // ... data to create a Feedbacks
     *   }
     * })
     * 
     */
    create<T extends feedbacksCreateArgs>(args: SelectSubset<T, feedbacksCreateArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Feedbacks.
     * @param {feedbacksCreateManyArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedbacks = await prisma.feedbacks.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends feedbacksCreateManyArgs>(args?: SelectSubset<T, feedbacksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Feedbacks and returns the data saved in the database.
     * @param {feedbacksCreateManyAndReturnArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedbacks = await prisma.feedbacks.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Feedbacks and only return the `id`
     * const feedbacksWithIdOnly = await prisma.feedbacks.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends feedbacksCreateManyAndReturnArgs>(args?: SelectSubset<T, feedbacksCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Feedbacks.
     * @param {feedbacksDeleteArgs} args - Arguments to delete one Feedbacks.
     * @example
     * // Delete one Feedbacks
     * const Feedbacks = await prisma.feedbacks.delete({
     *   where: {
     *     // ... filter to delete one Feedbacks
     *   }
     * })
     * 
     */
    delete<T extends feedbacksDeleteArgs>(args: SelectSubset<T, feedbacksDeleteArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Feedbacks.
     * @param {feedbacksUpdateArgs} args - Arguments to update one Feedbacks.
     * @example
     * // Update one Feedbacks
     * const feedbacks = await prisma.feedbacks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends feedbacksUpdateArgs>(args: SelectSubset<T, feedbacksUpdateArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Feedbacks.
     * @param {feedbacksDeleteManyArgs} args - Arguments to filter Feedbacks to delete.
     * @example
     * // Delete a few Feedbacks
     * const { count } = await prisma.feedbacks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends feedbacksDeleteManyArgs>(args?: SelectSubset<T, feedbacksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Feedbacks
     * const feedbacks = await prisma.feedbacks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends feedbacksUpdateManyArgs>(args: SelectSubset<T, feedbacksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks and returns the data updated in the database.
     * @param {feedbacksUpdateManyAndReturnArgs} args - Arguments to update many Feedbacks.
     * @example
     * // Update many Feedbacks
     * const feedbacks = await prisma.feedbacks.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Feedbacks and only return the `id`
     * const feedbacksWithIdOnly = await prisma.feedbacks.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends feedbacksUpdateManyAndReturnArgs>(args: SelectSubset<T, feedbacksUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Feedbacks.
     * @param {feedbacksUpsertArgs} args - Arguments to update or create a Feedbacks.
     * @example
     * // Update or create a Feedbacks
     * const feedbacks = await prisma.feedbacks.upsert({
     *   create: {
     *     // ... data to create a Feedbacks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feedbacks we want to update
     *   }
     * })
     */
    upsert<T extends feedbacksUpsertArgs>(args: SelectSubset<T, feedbacksUpsertArgs<ExtArgs>>): Prisma__feedbacksClient<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksCountArgs} args - Arguments to filter Feedbacks to count.
     * @example
     * // Count the number of Feedbacks
     * const count = await prisma.feedbacks.count({
     *   where: {
     *     // ... the filter for the Feedbacks we want to count
     *   }
     * })
    **/
    count<T extends feedbacksCountArgs>(
      args?: Subset<T, feedbacksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeedbacksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbacksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeedbacksAggregateArgs>(args: Subset<T, FeedbacksAggregateArgs>): Prisma.PrismaPromise<GetFeedbacksAggregateType<T>>

    /**
     * Group by Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbacksGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends feedbacksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: feedbacksGroupByArgs['orderBy'] }
        : { orderBy?: feedbacksGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, feedbacksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeedbacksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the feedbacks model
   */
  readonly fields: feedbacksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for feedbacks.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__feedbacksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends feedbacks$projectsArgs<ExtArgs> = {}>(args?: Subset<T, feedbacks$projectsArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the feedbacks model
   */
  interface feedbacksFieldRefs {
    readonly id: FieldRef<"feedbacks", 'String'>
    readonly title: FieldRef<"feedbacks", 'String'>
    readonly description: FieldRef<"feedbacks", 'String'>
    readonly status: FieldRef<"feedbacks", 'String'>
    readonly form_structure: FieldRef<"feedbacks", 'Json'>
    readonly response: FieldRef<"feedbacks", 'Json'>
    readonly created_at: FieldRef<"feedbacks", 'DateTime'>
    readonly project_id: FieldRef<"feedbacks", 'String'>
  }
    

  // Custom InputTypes
  /**
   * feedbacks findUnique
   */
  export type feedbacksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where: feedbacksWhereUniqueInput
  }

  /**
   * feedbacks findUniqueOrThrow
   */
  export type feedbacksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where: feedbacksWhereUniqueInput
  }

  /**
   * feedbacks findFirst
   */
  export type feedbacksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where?: feedbacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbacksOrderByWithRelationInput | feedbacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for feedbacks.
     */
    cursor?: feedbacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of feedbacks.
     */
    distinct?: FeedbacksScalarFieldEnum | FeedbacksScalarFieldEnum[]
  }

  /**
   * feedbacks findFirstOrThrow
   */
  export type feedbacksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where?: feedbacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbacksOrderByWithRelationInput | feedbacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for feedbacks.
     */
    cursor?: feedbacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of feedbacks.
     */
    distinct?: FeedbacksScalarFieldEnum | FeedbacksScalarFieldEnum[]
  }

  /**
   * feedbacks findMany
   */
  export type feedbacksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where?: feedbacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbacksOrderByWithRelationInput | feedbacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing feedbacks.
     */
    cursor?: feedbacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    distinct?: FeedbacksScalarFieldEnum | FeedbacksScalarFieldEnum[]
  }

  /**
   * feedbacks create
   */
  export type feedbacksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
    /**
     * The data needed to create a feedbacks.
     */
    data?: XOR<feedbacksCreateInput, feedbacksUncheckedCreateInput>
  }

  /**
   * feedbacks createMany
   */
  export type feedbacksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many feedbacks.
     */
    data: feedbacksCreateManyInput | feedbacksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * feedbacks createManyAndReturn
   */
  export type feedbacksCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * The data used to create many feedbacks.
     */
    data: feedbacksCreateManyInput | feedbacksCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * feedbacks update
   */
  export type feedbacksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
    /**
     * The data needed to update a feedbacks.
     */
    data: XOR<feedbacksUpdateInput, feedbacksUncheckedUpdateInput>
    /**
     * Choose, which feedbacks to update.
     */
    where: feedbacksWhereUniqueInput
  }

  /**
   * feedbacks updateMany
   */
  export type feedbacksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update feedbacks.
     */
    data: XOR<feedbacksUpdateManyMutationInput, feedbacksUncheckedUpdateManyInput>
    /**
     * Filter which feedbacks to update
     */
    where?: feedbacksWhereInput
    /**
     * Limit how many feedbacks to update.
     */
    limit?: number
  }

  /**
   * feedbacks updateManyAndReturn
   */
  export type feedbacksUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * The data used to update feedbacks.
     */
    data: XOR<feedbacksUpdateManyMutationInput, feedbacksUncheckedUpdateManyInput>
    /**
     * Filter which feedbacks to update
     */
    where?: feedbacksWhereInput
    /**
     * Limit how many feedbacks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * feedbacks upsert
   */
  export type feedbacksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
    /**
     * The filter to search for the feedbacks to update in case it exists.
     */
    where: feedbacksWhereUniqueInput
    /**
     * In case the feedbacks found by the `where` argument doesn't exist, create a new feedbacks with this data.
     */
    create: XOR<feedbacksCreateInput, feedbacksUncheckedCreateInput>
    /**
     * In case the feedbacks was found with the provided `where` argument, update it with this data.
     */
    update: XOR<feedbacksUpdateInput, feedbacksUncheckedUpdateInput>
  }

  /**
   * feedbacks delete
   */
  export type feedbacksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
    /**
     * Filter which feedbacks to delete.
     */
    where: feedbacksWhereUniqueInput
  }

  /**
   * feedbacks deleteMany
   */
  export type feedbacksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which feedbacks to delete
     */
    where?: feedbacksWhereInput
    /**
     * Limit how many feedbacks to delete.
     */
    limit?: number
  }

  /**
   * feedbacks.projects
   */
  export type feedbacks$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    where?: projectsWhereInput
  }

  /**
   * feedbacks without action
   */
  export type feedbacksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
  }


  /**
   * Model group_chats
   */

  export type AggregateGroup_chats = {
    _count: Group_chatsCountAggregateOutputType | null
    _min: Group_chatsMinAggregateOutputType | null
    _max: Group_chatsMaxAggregateOutputType | null
  }

  export type Group_chatsMinAggregateOutputType = {
    id: string | null
    created_at: Date | null
    project_id: string | null
  }

  export type Group_chatsMaxAggregateOutputType = {
    id: string | null
    created_at: Date | null
    project_id: string | null
  }

  export type Group_chatsCountAggregateOutputType = {
    id: number
    members: number
    created_at: number
    project_id: number
    _all: number
  }


  export type Group_chatsMinAggregateInputType = {
    id?: true
    created_at?: true
    project_id?: true
  }

  export type Group_chatsMaxAggregateInputType = {
    id?: true
    created_at?: true
    project_id?: true
  }

  export type Group_chatsCountAggregateInputType = {
    id?: true
    members?: true
    created_at?: true
    project_id?: true
    _all?: true
  }

  export type Group_chatsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which group_chats to aggregate.
     */
    where?: group_chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of group_chats to fetch.
     */
    orderBy?: group_chatsOrderByWithRelationInput | group_chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: group_chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` group_chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` group_chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned group_chats
    **/
    _count?: true | Group_chatsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Group_chatsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Group_chatsMaxAggregateInputType
  }

  export type GetGroup_chatsAggregateType<T extends Group_chatsAggregateArgs> = {
        [P in keyof T & keyof AggregateGroup_chats]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroup_chats[P]>
      : GetScalarType<T[P], AggregateGroup_chats[P]>
  }




  export type group_chatsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: group_chatsWhereInput
    orderBy?: group_chatsOrderByWithAggregationInput | group_chatsOrderByWithAggregationInput[]
    by: Group_chatsScalarFieldEnum[] | Group_chatsScalarFieldEnum
    having?: group_chatsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Group_chatsCountAggregateInputType | true
    _min?: Group_chatsMinAggregateInputType
    _max?: Group_chatsMaxAggregateInputType
  }

  export type Group_chatsGroupByOutputType = {
    id: string
    members: JsonValue | null
    created_at: Date | null
    project_id: string | null
    _count: Group_chatsCountAggregateOutputType | null
    _min: Group_chatsMinAggregateOutputType | null
    _max: Group_chatsMaxAggregateOutputType | null
  }

  type GetGroup_chatsGroupByPayload<T extends group_chatsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Group_chatsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Group_chatsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Group_chatsGroupByOutputType[P]>
            : GetScalarType<T[P], Group_chatsGroupByOutputType[P]>
        }
      >
    >


  export type group_chatsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    members?: boolean
    created_at?: boolean
    project_id?: boolean
    projects?: boolean | group_chats$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["group_chats"]>

  export type group_chatsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    members?: boolean
    created_at?: boolean
    project_id?: boolean
    projects?: boolean | group_chats$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["group_chats"]>

  export type group_chatsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    members?: boolean
    created_at?: boolean
    project_id?: boolean
    projects?: boolean | group_chats$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["group_chats"]>

  export type group_chatsSelectScalar = {
    id?: boolean
    members?: boolean
    created_at?: boolean
    project_id?: boolean
  }

  export type group_chatsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "members" | "created_at" | "project_id", ExtArgs["result"]["group_chats"]>
  export type group_chatsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | group_chats$projectsArgs<ExtArgs>
  }
  export type group_chatsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | group_chats$projectsArgs<ExtArgs>
  }
  export type group_chatsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | group_chats$projectsArgs<ExtArgs>
  }

  export type $group_chatsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "group_chats"
    objects: {
      projects: Prisma.$projectsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      members: Prisma.JsonValue | null
      created_at: Date | null
      project_id: string | null
    }, ExtArgs["result"]["group_chats"]>
    composites: {}
  }

  type group_chatsGetPayload<S extends boolean | null | undefined | group_chatsDefaultArgs> = $Result.GetResult<Prisma.$group_chatsPayload, S>

  type group_chatsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<group_chatsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Group_chatsCountAggregateInputType | true
    }

  export interface group_chatsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['group_chats'], meta: { name: 'group_chats' } }
    /**
     * Find zero or one Group_chats that matches the filter.
     * @param {group_chatsFindUniqueArgs} args - Arguments to find a Group_chats
     * @example
     * // Get one Group_chats
     * const group_chats = await prisma.group_chats.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends group_chatsFindUniqueArgs>(args: SelectSubset<T, group_chatsFindUniqueArgs<ExtArgs>>): Prisma__group_chatsClient<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Group_chats that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {group_chatsFindUniqueOrThrowArgs} args - Arguments to find a Group_chats
     * @example
     * // Get one Group_chats
     * const group_chats = await prisma.group_chats.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends group_chatsFindUniqueOrThrowArgs>(args: SelectSubset<T, group_chatsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__group_chatsClient<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Group_chats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {group_chatsFindFirstArgs} args - Arguments to find a Group_chats
     * @example
     * // Get one Group_chats
     * const group_chats = await prisma.group_chats.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends group_chatsFindFirstArgs>(args?: SelectSubset<T, group_chatsFindFirstArgs<ExtArgs>>): Prisma__group_chatsClient<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Group_chats that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {group_chatsFindFirstOrThrowArgs} args - Arguments to find a Group_chats
     * @example
     * // Get one Group_chats
     * const group_chats = await prisma.group_chats.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends group_chatsFindFirstOrThrowArgs>(args?: SelectSubset<T, group_chatsFindFirstOrThrowArgs<ExtArgs>>): Prisma__group_chatsClient<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Group_chats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {group_chatsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Group_chats
     * const group_chats = await prisma.group_chats.findMany()
     * 
     * // Get first 10 Group_chats
     * const group_chats = await prisma.group_chats.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const group_chatsWithIdOnly = await prisma.group_chats.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends group_chatsFindManyArgs>(args?: SelectSubset<T, group_chatsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Group_chats.
     * @param {group_chatsCreateArgs} args - Arguments to create a Group_chats.
     * @example
     * // Create one Group_chats
     * const Group_chats = await prisma.group_chats.create({
     *   data: {
     *     // ... data to create a Group_chats
     *   }
     * })
     * 
     */
    create<T extends group_chatsCreateArgs>(args: SelectSubset<T, group_chatsCreateArgs<ExtArgs>>): Prisma__group_chatsClient<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Group_chats.
     * @param {group_chatsCreateManyArgs} args - Arguments to create many Group_chats.
     * @example
     * // Create many Group_chats
     * const group_chats = await prisma.group_chats.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends group_chatsCreateManyArgs>(args?: SelectSubset<T, group_chatsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Group_chats and returns the data saved in the database.
     * @param {group_chatsCreateManyAndReturnArgs} args - Arguments to create many Group_chats.
     * @example
     * // Create many Group_chats
     * const group_chats = await prisma.group_chats.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Group_chats and only return the `id`
     * const group_chatsWithIdOnly = await prisma.group_chats.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends group_chatsCreateManyAndReturnArgs>(args?: SelectSubset<T, group_chatsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Group_chats.
     * @param {group_chatsDeleteArgs} args - Arguments to delete one Group_chats.
     * @example
     * // Delete one Group_chats
     * const Group_chats = await prisma.group_chats.delete({
     *   where: {
     *     // ... filter to delete one Group_chats
     *   }
     * })
     * 
     */
    delete<T extends group_chatsDeleteArgs>(args: SelectSubset<T, group_chatsDeleteArgs<ExtArgs>>): Prisma__group_chatsClient<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Group_chats.
     * @param {group_chatsUpdateArgs} args - Arguments to update one Group_chats.
     * @example
     * // Update one Group_chats
     * const group_chats = await prisma.group_chats.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends group_chatsUpdateArgs>(args: SelectSubset<T, group_chatsUpdateArgs<ExtArgs>>): Prisma__group_chatsClient<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Group_chats.
     * @param {group_chatsDeleteManyArgs} args - Arguments to filter Group_chats to delete.
     * @example
     * // Delete a few Group_chats
     * const { count } = await prisma.group_chats.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends group_chatsDeleteManyArgs>(args?: SelectSubset<T, group_chatsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Group_chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {group_chatsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Group_chats
     * const group_chats = await prisma.group_chats.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends group_chatsUpdateManyArgs>(args: SelectSubset<T, group_chatsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Group_chats and returns the data updated in the database.
     * @param {group_chatsUpdateManyAndReturnArgs} args - Arguments to update many Group_chats.
     * @example
     * // Update many Group_chats
     * const group_chats = await prisma.group_chats.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Group_chats and only return the `id`
     * const group_chatsWithIdOnly = await prisma.group_chats.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends group_chatsUpdateManyAndReturnArgs>(args: SelectSubset<T, group_chatsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Group_chats.
     * @param {group_chatsUpsertArgs} args - Arguments to update or create a Group_chats.
     * @example
     * // Update or create a Group_chats
     * const group_chats = await prisma.group_chats.upsert({
     *   create: {
     *     // ... data to create a Group_chats
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Group_chats we want to update
     *   }
     * })
     */
    upsert<T extends group_chatsUpsertArgs>(args: SelectSubset<T, group_chatsUpsertArgs<ExtArgs>>): Prisma__group_chatsClient<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Group_chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {group_chatsCountArgs} args - Arguments to filter Group_chats to count.
     * @example
     * // Count the number of Group_chats
     * const count = await prisma.group_chats.count({
     *   where: {
     *     // ... the filter for the Group_chats we want to count
     *   }
     * })
    **/
    count<T extends group_chatsCountArgs>(
      args?: Subset<T, group_chatsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Group_chatsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Group_chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Group_chatsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Group_chatsAggregateArgs>(args: Subset<T, Group_chatsAggregateArgs>): Prisma.PrismaPromise<GetGroup_chatsAggregateType<T>>

    /**
     * Group by Group_chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {group_chatsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends group_chatsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: group_chatsGroupByArgs['orderBy'] }
        : { orderBy?: group_chatsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, group_chatsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroup_chatsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the group_chats model
   */
  readonly fields: group_chatsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for group_chats.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__group_chatsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends group_chats$projectsArgs<ExtArgs> = {}>(args?: Subset<T, group_chats$projectsArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the group_chats model
   */
  interface group_chatsFieldRefs {
    readonly id: FieldRef<"group_chats", 'String'>
    readonly members: FieldRef<"group_chats", 'Json'>
    readonly created_at: FieldRef<"group_chats", 'DateTime'>
    readonly project_id: FieldRef<"group_chats", 'String'>
  }
    

  // Custom InputTypes
  /**
   * group_chats findUnique
   */
  export type group_chatsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
    /**
     * Filter, which group_chats to fetch.
     */
    where: group_chatsWhereUniqueInput
  }

  /**
   * group_chats findUniqueOrThrow
   */
  export type group_chatsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
    /**
     * Filter, which group_chats to fetch.
     */
    where: group_chatsWhereUniqueInput
  }

  /**
   * group_chats findFirst
   */
  export type group_chatsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
    /**
     * Filter, which group_chats to fetch.
     */
    where?: group_chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of group_chats to fetch.
     */
    orderBy?: group_chatsOrderByWithRelationInput | group_chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for group_chats.
     */
    cursor?: group_chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` group_chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` group_chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of group_chats.
     */
    distinct?: Group_chatsScalarFieldEnum | Group_chatsScalarFieldEnum[]
  }

  /**
   * group_chats findFirstOrThrow
   */
  export type group_chatsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
    /**
     * Filter, which group_chats to fetch.
     */
    where?: group_chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of group_chats to fetch.
     */
    orderBy?: group_chatsOrderByWithRelationInput | group_chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for group_chats.
     */
    cursor?: group_chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` group_chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` group_chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of group_chats.
     */
    distinct?: Group_chatsScalarFieldEnum | Group_chatsScalarFieldEnum[]
  }

  /**
   * group_chats findMany
   */
  export type group_chatsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
    /**
     * Filter, which group_chats to fetch.
     */
    where?: group_chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of group_chats to fetch.
     */
    orderBy?: group_chatsOrderByWithRelationInput | group_chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing group_chats.
     */
    cursor?: group_chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` group_chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` group_chats.
     */
    skip?: number
    distinct?: Group_chatsScalarFieldEnum | Group_chatsScalarFieldEnum[]
  }

  /**
   * group_chats create
   */
  export type group_chatsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
    /**
     * The data needed to create a group_chats.
     */
    data?: XOR<group_chatsCreateInput, group_chatsUncheckedCreateInput>
  }

  /**
   * group_chats createMany
   */
  export type group_chatsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many group_chats.
     */
    data: group_chatsCreateManyInput | group_chatsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * group_chats createManyAndReturn
   */
  export type group_chatsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * The data used to create many group_chats.
     */
    data: group_chatsCreateManyInput | group_chatsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * group_chats update
   */
  export type group_chatsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
    /**
     * The data needed to update a group_chats.
     */
    data: XOR<group_chatsUpdateInput, group_chatsUncheckedUpdateInput>
    /**
     * Choose, which group_chats to update.
     */
    where: group_chatsWhereUniqueInput
  }

  /**
   * group_chats updateMany
   */
  export type group_chatsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update group_chats.
     */
    data: XOR<group_chatsUpdateManyMutationInput, group_chatsUncheckedUpdateManyInput>
    /**
     * Filter which group_chats to update
     */
    where?: group_chatsWhereInput
    /**
     * Limit how many group_chats to update.
     */
    limit?: number
  }

  /**
   * group_chats updateManyAndReturn
   */
  export type group_chatsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * The data used to update group_chats.
     */
    data: XOR<group_chatsUpdateManyMutationInput, group_chatsUncheckedUpdateManyInput>
    /**
     * Filter which group_chats to update
     */
    where?: group_chatsWhereInput
    /**
     * Limit how many group_chats to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * group_chats upsert
   */
  export type group_chatsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
    /**
     * The filter to search for the group_chats to update in case it exists.
     */
    where: group_chatsWhereUniqueInput
    /**
     * In case the group_chats found by the `where` argument doesn't exist, create a new group_chats with this data.
     */
    create: XOR<group_chatsCreateInput, group_chatsUncheckedCreateInput>
    /**
     * In case the group_chats was found with the provided `where` argument, update it with this data.
     */
    update: XOR<group_chatsUpdateInput, group_chatsUncheckedUpdateInput>
  }

  /**
   * group_chats delete
   */
  export type group_chatsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
    /**
     * Filter which group_chats to delete.
     */
    where: group_chatsWhereUniqueInput
  }

  /**
   * group_chats deleteMany
   */
  export type group_chatsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which group_chats to delete
     */
    where?: group_chatsWhereInput
    /**
     * Limit how many group_chats to delete.
     */
    limit?: number
  }

  /**
   * group_chats.projects
   */
  export type group_chats$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    where?: projectsWhereInput
  }

  /**
   * group_chats without action
   */
  export type group_chatsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
  }


  /**
   * Model meetings
   */

  export type AggregateMeetings = {
    _count: MeetingsCountAggregateOutputType | null
    _min: MeetingsMinAggregateOutputType | null
    _max: MeetingsMaxAggregateOutputType | null
  }

  export type MeetingsMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    type: string | null
    status: string | null
    link: string | null
    room_id: string | null
    scheduled_at: Date | null
    started_at: Date | null
    ended_at: Date | null
    is_recurring: boolean | null
    created_at: Date | null
    updated_at: Date | null
    created_by: string | null
    project_id: string | null
  }

  export type MeetingsMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    type: string | null
    status: string | null
    link: string | null
    room_id: string | null
    scheduled_at: Date | null
    started_at: Date | null
    ended_at: Date | null
    is_recurring: boolean | null
    created_at: Date | null
    updated_at: Date | null
    created_by: string | null
    project_id: string | null
  }

  export type MeetingsCountAggregateOutputType = {
    id: number
    title: number
    description: number
    type: number
    status: number
    link: number
    room_id: number
    scheduled_at: number
    started_at: number
    ended_at: number
    is_recurring: number
    participants: number
    created_at: number
    updated_at: number
    created_by: number
    project_id: number
    _all: number
  }


  export type MeetingsMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    type?: true
    status?: true
    link?: true
    room_id?: true
    scheduled_at?: true
    started_at?: true
    ended_at?: true
    is_recurring?: true
    created_at?: true
    updated_at?: true
    created_by?: true
    project_id?: true
  }

  export type MeetingsMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    type?: true
    status?: true
    link?: true
    room_id?: true
    scheduled_at?: true
    started_at?: true
    ended_at?: true
    is_recurring?: true
    created_at?: true
    updated_at?: true
    created_by?: true
    project_id?: true
  }

  export type MeetingsCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    type?: true
    status?: true
    link?: true
    room_id?: true
    scheduled_at?: true
    started_at?: true
    ended_at?: true
    is_recurring?: true
    participants?: true
    created_at?: true
    updated_at?: true
    created_by?: true
    project_id?: true
    _all?: true
  }

  export type MeetingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which meetings to aggregate.
     */
    where?: meetingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of meetings to fetch.
     */
    orderBy?: meetingsOrderByWithRelationInput | meetingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: meetingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned meetings
    **/
    _count?: true | MeetingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MeetingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MeetingsMaxAggregateInputType
  }

  export type GetMeetingsAggregateType<T extends MeetingsAggregateArgs> = {
        [P in keyof T & keyof AggregateMeetings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMeetings[P]>
      : GetScalarType<T[P], AggregateMeetings[P]>
  }




  export type meetingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: meetingsWhereInput
    orderBy?: meetingsOrderByWithAggregationInput | meetingsOrderByWithAggregationInput[]
    by: MeetingsScalarFieldEnum[] | MeetingsScalarFieldEnum
    having?: meetingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MeetingsCountAggregateInputType | true
    _min?: MeetingsMinAggregateInputType
    _max?: MeetingsMaxAggregateInputType
  }

  export type MeetingsGroupByOutputType = {
    id: string
    title: string | null
    description: string | null
    type: string | null
    status: string | null
    link: string | null
    room_id: string | null
    scheduled_at: Date | null
    started_at: Date | null
    ended_at: Date | null
    is_recurring: boolean | null
    participants: JsonValue | null
    created_at: Date | null
    updated_at: Date | null
    created_by: string | null
    project_id: string | null
    _count: MeetingsCountAggregateOutputType | null
    _min: MeetingsMinAggregateOutputType | null
    _max: MeetingsMaxAggregateOutputType | null
  }

  type GetMeetingsGroupByPayload<T extends meetingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MeetingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MeetingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MeetingsGroupByOutputType[P]>
            : GetScalarType<T[P], MeetingsGroupByOutputType[P]>
        }
      >
    >


  export type meetingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    link?: boolean
    room_id?: boolean
    scheduled_at?: boolean
    started_at?: boolean
    ended_at?: boolean
    is_recurring?: boolean
    participants?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    project_id?: boolean
    users?: boolean | meetings$usersArgs<ExtArgs>
    projects?: boolean | meetings$projectsArgs<ExtArgs>
    recordings?: boolean | meetings$recordingsArgs<ExtArgs>
    _count?: boolean | MeetingsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetings"]>

  export type meetingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    link?: boolean
    room_id?: boolean
    scheduled_at?: boolean
    started_at?: boolean
    ended_at?: boolean
    is_recurring?: boolean
    participants?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    project_id?: boolean
    users?: boolean | meetings$usersArgs<ExtArgs>
    projects?: boolean | meetings$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["meetings"]>

  export type meetingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    link?: boolean
    room_id?: boolean
    scheduled_at?: boolean
    started_at?: boolean
    ended_at?: boolean
    is_recurring?: boolean
    participants?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    project_id?: boolean
    users?: boolean | meetings$usersArgs<ExtArgs>
    projects?: boolean | meetings$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["meetings"]>

  export type meetingsSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    link?: boolean
    room_id?: boolean
    scheduled_at?: boolean
    started_at?: boolean
    ended_at?: boolean
    is_recurring?: boolean
    participants?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    project_id?: boolean
  }

  export type meetingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "type" | "status" | "link" | "room_id" | "scheduled_at" | "started_at" | "ended_at" | "is_recurring" | "participants" | "created_at" | "updated_at" | "created_by" | "project_id", ExtArgs["result"]["meetings"]>
  export type meetingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | meetings$usersArgs<ExtArgs>
    projects?: boolean | meetings$projectsArgs<ExtArgs>
    recordings?: boolean | meetings$recordingsArgs<ExtArgs>
    _count?: boolean | MeetingsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type meetingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | meetings$usersArgs<ExtArgs>
    projects?: boolean | meetings$projectsArgs<ExtArgs>
  }
  export type meetingsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | meetings$usersArgs<ExtArgs>
    projects?: boolean | meetings$projectsArgs<ExtArgs>
  }

  export type $meetingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "meetings"
    objects: {
      users: Prisma.$usersPayload<ExtArgs> | null
      projects: Prisma.$projectsPayload<ExtArgs> | null
      recordings: Prisma.$recordingsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      description: string | null
      type: string | null
      status: string | null
      link: string | null
      room_id: string | null
      scheduled_at: Date | null
      started_at: Date | null
      ended_at: Date | null
      is_recurring: boolean | null
      participants: Prisma.JsonValue | null
      created_at: Date | null
      updated_at: Date | null
      created_by: string | null
      project_id: string | null
    }, ExtArgs["result"]["meetings"]>
    composites: {}
  }

  type meetingsGetPayload<S extends boolean | null | undefined | meetingsDefaultArgs> = $Result.GetResult<Prisma.$meetingsPayload, S>

  type meetingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<meetingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MeetingsCountAggregateInputType | true
    }

  export interface meetingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['meetings'], meta: { name: 'meetings' } }
    /**
     * Find zero or one Meetings that matches the filter.
     * @param {meetingsFindUniqueArgs} args - Arguments to find a Meetings
     * @example
     * // Get one Meetings
     * const meetings = await prisma.meetings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends meetingsFindUniqueArgs>(args: SelectSubset<T, meetingsFindUniqueArgs<ExtArgs>>): Prisma__meetingsClient<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Meetings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {meetingsFindUniqueOrThrowArgs} args - Arguments to find a Meetings
     * @example
     * // Get one Meetings
     * const meetings = await prisma.meetings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends meetingsFindUniqueOrThrowArgs>(args: SelectSubset<T, meetingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__meetingsClient<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Meetings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {meetingsFindFirstArgs} args - Arguments to find a Meetings
     * @example
     * // Get one Meetings
     * const meetings = await prisma.meetings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends meetingsFindFirstArgs>(args?: SelectSubset<T, meetingsFindFirstArgs<ExtArgs>>): Prisma__meetingsClient<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Meetings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {meetingsFindFirstOrThrowArgs} args - Arguments to find a Meetings
     * @example
     * // Get one Meetings
     * const meetings = await prisma.meetings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends meetingsFindFirstOrThrowArgs>(args?: SelectSubset<T, meetingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__meetingsClient<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Meetings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {meetingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Meetings
     * const meetings = await prisma.meetings.findMany()
     * 
     * // Get first 10 Meetings
     * const meetings = await prisma.meetings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const meetingsWithIdOnly = await prisma.meetings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends meetingsFindManyArgs>(args?: SelectSubset<T, meetingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Meetings.
     * @param {meetingsCreateArgs} args - Arguments to create a Meetings.
     * @example
     * // Create one Meetings
     * const Meetings = await prisma.meetings.create({
     *   data: {
     *     // ... data to create a Meetings
     *   }
     * })
     * 
     */
    create<T extends meetingsCreateArgs>(args: SelectSubset<T, meetingsCreateArgs<ExtArgs>>): Prisma__meetingsClient<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Meetings.
     * @param {meetingsCreateManyArgs} args - Arguments to create many Meetings.
     * @example
     * // Create many Meetings
     * const meetings = await prisma.meetings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends meetingsCreateManyArgs>(args?: SelectSubset<T, meetingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Meetings and returns the data saved in the database.
     * @param {meetingsCreateManyAndReturnArgs} args - Arguments to create many Meetings.
     * @example
     * // Create many Meetings
     * const meetings = await prisma.meetings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Meetings and only return the `id`
     * const meetingsWithIdOnly = await prisma.meetings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends meetingsCreateManyAndReturnArgs>(args?: SelectSubset<T, meetingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Meetings.
     * @param {meetingsDeleteArgs} args - Arguments to delete one Meetings.
     * @example
     * // Delete one Meetings
     * const Meetings = await prisma.meetings.delete({
     *   where: {
     *     // ... filter to delete one Meetings
     *   }
     * })
     * 
     */
    delete<T extends meetingsDeleteArgs>(args: SelectSubset<T, meetingsDeleteArgs<ExtArgs>>): Prisma__meetingsClient<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Meetings.
     * @param {meetingsUpdateArgs} args - Arguments to update one Meetings.
     * @example
     * // Update one Meetings
     * const meetings = await prisma.meetings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends meetingsUpdateArgs>(args: SelectSubset<T, meetingsUpdateArgs<ExtArgs>>): Prisma__meetingsClient<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Meetings.
     * @param {meetingsDeleteManyArgs} args - Arguments to filter Meetings to delete.
     * @example
     * // Delete a few Meetings
     * const { count } = await prisma.meetings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends meetingsDeleteManyArgs>(args?: SelectSubset<T, meetingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Meetings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {meetingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Meetings
     * const meetings = await prisma.meetings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends meetingsUpdateManyArgs>(args: SelectSubset<T, meetingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Meetings and returns the data updated in the database.
     * @param {meetingsUpdateManyAndReturnArgs} args - Arguments to update many Meetings.
     * @example
     * // Update many Meetings
     * const meetings = await prisma.meetings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Meetings and only return the `id`
     * const meetingsWithIdOnly = await prisma.meetings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends meetingsUpdateManyAndReturnArgs>(args: SelectSubset<T, meetingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Meetings.
     * @param {meetingsUpsertArgs} args - Arguments to update or create a Meetings.
     * @example
     * // Update or create a Meetings
     * const meetings = await prisma.meetings.upsert({
     *   create: {
     *     // ... data to create a Meetings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Meetings we want to update
     *   }
     * })
     */
    upsert<T extends meetingsUpsertArgs>(args: SelectSubset<T, meetingsUpsertArgs<ExtArgs>>): Prisma__meetingsClient<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Meetings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {meetingsCountArgs} args - Arguments to filter Meetings to count.
     * @example
     * // Count the number of Meetings
     * const count = await prisma.meetings.count({
     *   where: {
     *     // ... the filter for the Meetings we want to count
     *   }
     * })
    **/
    count<T extends meetingsCountArgs>(
      args?: Subset<T, meetingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MeetingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Meetings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MeetingsAggregateArgs>(args: Subset<T, MeetingsAggregateArgs>): Prisma.PrismaPromise<GetMeetingsAggregateType<T>>

    /**
     * Group by Meetings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {meetingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends meetingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: meetingsGroupByArgs['orderBy'] }
        : { orderBy?: meetingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, meetingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMeetingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the meetings model
   */
  readonly fields: meetingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for meetings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__meetingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends meetings$usersArgs<ExtArgs> = {}>(args?: Subset<T, meetings$usersArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    projects<T extends meetings$projectsArgs<ExtArgs> = {}>(args?: Subset<T, meetings$projectsArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    recordings<T extends meetings$recordingsArgs<ExtArgs> = {}>(args?: Subset<T, meetings$recordingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the meetings model
   */
  interface meetingsFieldRefs {
    readonly id: FieldRef<"meetings", 'String'>
    readonly title: FieldRef<"meetings", 'String'>
    readonly description: FieldRef<"meetings", 'String'>
    readonly type: FieldRef<"meetings", 'String'>
    readonly status: FieldRef<"meetings", 'String'>
    readonly link: FieldRef<"meetings", 'String'>
    readonly room_id: FieldRef<"meetings", 'String'>
    readonly scheduled_at: FieldRef<"meetings", 'DateTime'>
    readonly started_at: FieldRef<"meetings", 'DateTime'>
    readonly ended_at: FieldRef<"meetings", 'DateTime'>
    readonly is_recurring: FieldRef<"meetings", 'Boolean'>
    readonly participants: FieldRef<"meetings", 'Json'>
    readonly created_at: FieldRef<"meetings", 'DateTime'>
    readonly updated_at: FieldRef<"meetings", 'DateTime'>
    readonly created_by: FieldRef<"meetings", 'String'>
    readonly project_id: FieldRef<"meetings", 'String'>
  }
    

  // Custom InputTypes
  /**
   * meetings findUnique
   */
  export type meetingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    /**
     * Filter, which meetings to fetch.
     */
    where: meetingsWhereUniqueInput
  }

  /**
   * meetings findUniqueOrThrow
   */
  export type meetingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    /**
     * Filter, which meetings to fetch.
     */
    where: meetingsWhereUniqueInput
  }

  /**
   * meetings findFirst
   */
  export type meetingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    /**
     * Filter, which meetings to fetch.
     */
    where?: meetingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of meetings to fetch.
     */
    orderBy?: meetingsOrderByWithRelationInput | meetingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for meetings.
     */
    cursor?: meetingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of meetings.
     */
    distinct?: MeetingsScalarFieldEnum | MeetingsScalarFieldEnum[]
  }

  /**
   * meetings findFirstOrThrow
   */
  export type meetingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    /**
     * Filter, which meetings to fetch.
     */
    where?: meetingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of meetings to fetch.
     */
    orderBy?: meetingsOrderByWithRelationInput | meetingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for meetings.
     */
    cursor?: meetingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of meetings.
     */
    distinct?: MeetingsScalarFieldEnum | MeetingsScalarFieldEnum[]
  }

  /**
   * meetings findMany
   */
  export type meetingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    /**
     * Filter, which meetings to fetch.
     */
    where?: meetingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of meetings to fetch.
     */
    orderBy?: meetingsOrderByWithRelationInput | meetingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing meetings.
     */
    cursor?: meetingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` meetings.
     */
    skip?: number
    distinct?: MeetingsScalarFieldEnum | MeetingsScalarFieldEnum[]
  }

  /**
   * meetings create
   */
  export type meetingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    /**
     * The data needed to create a meetings.
     */
    data?: XOR<meetingsCreateInput, meetingsUncheckedCreateInput>
  }

  /**
   * meetings createMany
   */
  export type meetingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many meetings.
     */
    data: meetingsCreateManyInput | meetingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * meetings createManyAndReturn
   */
  export type meetingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * The data used to create many meetings.
     */
    data: meetingsCreateManyInput | meetingsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * meetings update
   */
  export type meetingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    /**
     * The data needed to update a meetings.
     */
    data: XOR<meetingsUpdateInput, meetingsUncheckedUpdateInput>
    /**
     * Choose, which meetings to update.
     */
    where: meetingsWhereUniqueInput
  }

  /**
   * meetings updateMany
   */
  export type meetingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update meetings.
     */
    data: XOR<meetingsUpdateManyMutationInput, meetingsUncheckedUpdateManyInput>
    /**
     * Filter which meetings to update
     */
    where?: meetingsWhereInput
    /**
     * Limit how many meetings to update.
     */
    limit?: number
  }

  /**
   * meetings updateManyAndReturn
   */
  export type meetingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * The data used to update meetings.
     */
    data: XOR<meetingsUpdateManyMutationInput, meetingsUncheckedUpdateManyInput>
    /**
     * Filter which meetings to update
     */
    where?: meetingsWhereInput
    /**
     * Limit how many meetings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * meetings upsert
   */
  export type meetingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    /**
     * The filter to search for the meetings to update in case it exists.
     */
    where: meetingsWhereUniqueInput
    /**
     * In case the meetings found by the `where` argument doesn't exist, create a new meetings with this data.
     */
    create: XOR<meetingsCreateInput, meetingsUncheckedCreateInput>
    /**
     * In case the meetings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<meetingsUpdateInput, meetingsUncheckedUpdateInput>
  }

  /**
   * meetings delete
   */
  export type meetingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    /**
     * Filter which meetings to delete.
     */
    where: meetingsWhereUniqueInput
  }

  /**
   * meetings deleteMany
   */
  export type meetingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which meetings to delete
     */
    where?: meetingsWhereInput
    /**
     * Limit how many meetings to delete.
     */
    limit?: number
  }

  /**
   * meetings.users
   */
  export type meetings$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
  }

  /**
   * meetings.projects
   */
  export type meetings$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    where?: projectsWhereInput
  }

  /**
   * meetings.recordings
   */
  export type meetings$recordingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
    where?: recordingsWhereInput
    orderBy?: recordingsOrderByWithRelationInput | recordingsOrderByWithRelationInput[]
    cursor?: recordingsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecordingsScalarFieldEnum | RecordingsScalarFieldEnum[]
  }

  /**
   * meetings without action
   */
  export type meetingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
  }


  /**
   * Model messages
   */

  export type AggregateMessages = {
    _count: MessagesCountAggregateOutputType | null
    _min: MessagesMinAggregateOutputType | null
    _max: MessagesMaxAggregateOutputType | null
  }

  export type MessagesMinAggregateOutputType = {
    id: string | null
    chat_type: string | null
    chat_id: string | null
    content: string | null
    created_at: Date | null
    sender_id: string | null
  }

  export type MessagesMaxAggregateOutputType = {
    id: string | null
    chat_type: string | null
    chat_id: string | null
    content: string | null
    created_at: Date | null
    sender_id: string | null
  }

  export type MessagesCountAggregateOutputType = {
    id: number
    chat_type: number
    chat_id: number
    content: number
    metadata: number
    created_at: number
    sender_id: number
    _all: number
  }


  export type MessagesMinAggregateInputType = {
    id?: true
    chat_type?: true
    chat_id?: true
    content?: true
    created_at?: true
    sender_id?: true
  }

  export type MessagesMaxAggregateInputType = {
    id?: true
    chat_type?: true
    chat_id?: true
    content?: true
    created_at?: true
    sender_id?: true
  }

  export type MessagesCountAggregateInputType = {
    id?: true
    chat_type?: true
    chat_id?: true
    content?: true
    metadata?: true
    created_at?: true
    sender_id?: true
    _all?: true
  }

  export type MessagesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which messages to aggregate.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned messages
    **/
    _count?: true | MessagesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessagesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessagesMaxAggregateInputType
  }

  export type GetMessagesAggregateType<T extends MessagesAggregateArgs> = {
        [P in keyof T & keyof AggregateMessages]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessages[P]>
      : GetScalarType<T[P], AggregateMessages[P]>
  }




  export type messagesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: messagesWhereInput
    orderBy?: messagesOrderByWithAggregationInput | messagesOrderByWithAggregationInput[]
    by: MessagesScalarFieldEnum[] | MessagesScalarFieldEnum
    having?: messagesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessagesCountAggregateInputType | true
    _min?: MessagesMinAggregateInputType
    _max?: MessagesMaxAggregateInputType
  }

  export type MessagesGroupByOutputType = {
    id: string
    chat_type: string
    chat_id: string
    content: string
    metadata: JsonValue | null
    created_at: Date | null
    sender_id: string | null
    _count: MessagesCountAggregateOutputType | null
    _min: MessagesMinAggregateOutputType | null
    _max: MessagesMaxAggregateOutputType | null
  }

  type GetMessagesGroupByPayload<T extends messagesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessagesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessagesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessagesGroupByOutputType[P]>
            : GetScalarType<T[P], MessagesGroupByOutputType[P]>
        }
      >
    >


  export type messagesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chat_type?: boolean
    chat_id?: boolean
    content?: boolean
    metadata?: boolean
    created_at?: boolean
    sender_id?: boolean
    users?: boolean | messages$usersArgs<ExtArgs>
  }, ExtArgs["result"]["messages"]>

  export type messagesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chat_type?: boolean
    chat_id?: boolean
    content?: boolean
    metadata?: boolean
    created_at?: boolean
    sender_id?: boolean
    users?: boolean | messages$usersArgs<ExtArgs>
  }, ExtArgs["result"]["messages"]>

  export type messagesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chat_type?: boolean
    chat_id?: boolean
    content?: boolean
    metadata?: boolean
    created_at?: boolean
    sender_id?: boolean
    users?: boolean | messages$usersArgs<ExtArgs>
  }, ExtArgs["result"]["messages"]>

  export type messagesSelectScalar = {
    id?: boolean
    chat_type?: boolean
    chat_id?: boolean
    content?: boolean
    metadata?: boolean
    created_at?: boolean
    sender_id?: boolean
  }

  export type messagesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chat_type" | "chat_id" | "content" | "metadata" | "created_at" | "sender_id", ExtArgs["result"]["messages"]>
  export type messagesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | messages$usersArgs<ExtArgs>
  }
  export type messagesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | messages$usersArgs<ExtArgs>
  }
  export type messagesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | messages$usersArgs<ExtArgs>
  }

  export type $messagesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "messages"
    objects: {
      users: Prisma.$usersPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chat_type: string
      chat_id: string
      content: string
      metadata: Prisma.JsonValue | null
      created_at: Date | null
      sender_id: string | null
    }, ExtArgs["result"]["messages"]>
    composites: {}
  }

  type messagesGetPayload<S extends boolean | null | undefined | messagesDefaultArgs> = $Result.GetResult<Prisma.$messagesPayload, S>

  type messagesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<messagesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessagesCountAggregateInputType | true
    }

  export interface messagesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['messages'], meta: { name: 'messages' } }
    /**
     * Find zero or one Messages that matches the filter.
     * @param {messagesFindUniqueArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends messagesFindUniqueArgs>(args: SelectSubset<T, messagesFindUniqueArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Messages that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {messagesFindUniqueOrThrowArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends messagesFindUniqueOrThrowArgs>(args: SelectSubset<T, messagesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesFindFirstArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends messagesFindFirstArgs>(args?: SelectSubset<T, messagesFindFirstArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Messages that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesFindFirstOrThrowArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends messagesFindFirstOrThrowArgs>(args?: SelectSubset<T, messagesFindFirstOrThrowArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.messages.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.messages.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messagesWithIdOnly = await prisma.messages.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends messagesFindManyArgs>(args?: SelectSubset<T, messagesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Messages.
     * @param {messagesCreateArgs} args - Arguments to create a Messages.
     * @example
     * // Create one Messages
     * const Messages = await prisma.messages.create({
     *   data: {
     *     // ... data to create a Messages
     *   }
     * })
     * 
     */
    create<T extends messagesCreateArgs>(args: SelectSubset<T, messagesCreateArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {messagesCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const messages = await prisma.messages.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends messagesCreateManyArgs>(args?: SelectSubset<T, messagesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {messagesCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const messages = await prisma.messages.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messagesWithIdOnly = await prisma.messages.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends messagesCreateManyAndReturnArgs>(args?: SelectSubset<T, messagesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Messages.
     * @param {messagesDeleteArgs} args - Arguments to delete one Messages.
     * @example
     * // Delete one Messages
     * const Messages = await prisma.messages.delete({
     *   where: {
     *     // ... filter to delete one Messages
     *   }
     * })
     * 
     */
    delete<T extends messagesDeleteArgs>(args: SelectSubset<T, messagesDeleteArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Messages.
     * @param {messagesUpdateArgs} args - Arguments to update one Messages.
     * @example
     * // Update one Messages
     * const messages = await prisma.messages.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends messagesUpdateArgs>(args: SelectSubset<T, messagesUpdateArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {messagesDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.messages.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends messagesDeleteManyArgs>(args?: SelectSubset<T, messagesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const messages = await prisma.messages.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends messagesUpdateManyArgs>(args: SelectSubset<T, messagesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {messagesUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const messages = await prisma.messages.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messagesWithIdOnly = await prisma.messages.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends messagesUpdateManyAndReturnArgs>(args: SelectSubset<T, messagesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Messages.
     * @param {messagesUpsertArgs} args - Arguments to update or create a Messages.
     * @example
     * // Update or create a Messages
     * const messages = await prisma.messages.upsert({
     *   create: {
     *     // ... data to create a Messages
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Messages we want to update
     *   }
     * })
     */
    upsert<T extends messagesUpsertArgs>(args: SelectSubset<T, messagesUpsertArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.messages.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends messagesCountArgs>(
      args?: Subset<T, messagesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessagesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessagesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessagesAggregateArgs>(args: Subset<T, MessagesAggregateArgs>): Prisma.PrismaPromise<GetMessagesAggregateType<T>>

    /**
     * Group by Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends messagesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: messagesGroupByArgs['orderBy'] }
        : { orderBy?: messagesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, messagesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessagesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the messages model
   */
  readonly fields: messagesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for messages.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__messagesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends messages$usersArgs<ExtArgs> = {}>(args?: Subset<T, messages$usersArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the messages model
   */
  interface messagesFieldRefs {
    readonly id: FieldRef<"messages", 'String'>
    readonly chat_type: FieldRef<"messages", 'String'>
    readonly chat_id: FieldRef<"messages", 'String'>
    readonly content: FieldRef<"messages", 'String'>
    readonly metadata: FieldRef<"messages", 'Json'>
    readonly created_at: FieldRef<"messages", 'DateTime'>
    readonly sender_id: FieldRef<"messages", 'String'>
  }
    

  // Custom InputTypes
  /**
   * messages findUnique
   */
  export type messagesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where: messagesWhereUniqueInput
  }

  /**
   * messages findUniqueOrThrow
   */
  export type messagesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where: messagesWhereUniqueInput
  }

  /**
   * messages findFirst
   */
  export type messagesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for messages.
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of messages.
     */
    distinct?: MessagesScalarFieldEnum | MessagesScalarFieldEnum[]
  }

  /**
   * messages findFirstOrThrow
   */
  export type messagesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for messages.
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of messages.
     */
    distinct?: MessagesScalarFieldEnum | MessagesScalarFieldEnum[]
  }

  /**
   * messages findMany
   */
  export type messagesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing messages.
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    distinct?: MessagesScalarFieldEnum | MessagesScalarFieldEnum[]
  }

  /**
   * messages create
   */
  export type messagesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * The data needed to create a messages.
     */
    data: XOR<messagesCreateInput, messagesUncheckedCreateInput>
  }

  /**
   * messages createMany
   */
  export type messagesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many messages.
     */
    data: messagesCreateManyInput | messagesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * messages createManyAndReturn
   */
  export type messagesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * The data used to create many messages.
     */
    data: messagesCreateManyInput | messagesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * messages update
   */
  export type messagesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * The data needed to update a messages.
     */
    data: XOR<messagesUpdateInput, messagesUncheckedUpdateInput>
    /**
     * Choose, which messages to update.
     */
    where: messagesWhereUniqueInput
  }

  /**
   * messages updateMany
   */
  export type messagesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update messages.
     */
    data: XOR<messagesUpdateManyMutationInput, messagesUncheckedUpdateManyInput>
    /**
     * Filter which messages to update
     */
    where?: messagesWhereInput
    /**
     * Limit how many messages to update.
     */
    limit?: number
  }

  /**
   * messages updateManyAndReturn
   */
  export type messagesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * The data used to update messages.
     */
    data: XOR<messagesUpdateManyMutationInput, messagesUncheckedUpdateManyInput>
    /**
     * Filter which messages to update
     */
    where?: messagesWhereInput
    /**
     * Limit how many messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * messages upsert
   */
  export type messagesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * The filter to search for the messages to update in case it exists.
     */
    where: messagesWhereUniqueInput
    /**
     * In case the messages found by the `where` argument doesn't exist, create a new messages with this data.
     */
    create: XOR<messagesCreateInput, messagesUncheckedCreateInput>
    /**
     * In case the messages was found with the provided `where` argument, update it with this data.
     */
    update: XOR<messagesUpdateInput, messagesUncheckedUpdateInput>
  }

  /**
   * messages delete
   */
  export type messagesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter which messages to delete.
     */
    where: messagesWhereUniqueInput
  }

  /**
   * messages deleteMany
   */
  export type messagesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which messages to delete
     */
    where?: messagesWhereInput
    /**
     * Limit how many messages to delete.
     */
    limit?: number
  }

  /**
   * messages.users
   */
  export type messages$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
  }

  /**
   * messages without action
   */
  export type messagesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
  }


  /**
   * Model projects
   */

  export type AggregateProjects = {
    _count: ProjectsCountAggregateOutputType | null
    _min: ProjectsMinAggregateOutputType | null
    _max: ProjectsMaxAggregateOutputType | null
  }

  export type ProjectsMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    description: string | null
    cover_image_url: string | null
    icon_url: string | null
    status: string | null
    start_date: Date | null
    end_date: Date | null
    created_at: Date | null
    updated_at: Date | null
    created_by: string | null
  }

  export type ProjectsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    description: string | null
    cover_image_url: string | null
    icon_url: string | null
    status: string | null
    start_date: Date | null
    end_date: Date | null
    created_at: Date | null
    updated_at: Date | null
    created_by: string | null
  }

  export type ProjectsCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    cover_image_url: number
    icon_url: number
    status: number
    start_date: number
    end_date: number
    tags: number
    members: number
    created_at: number
    updated_at: number
    created_by: number
    _all: number
  }


  export type ProjectsMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    cover_image_url?: true
    icon_url?: true
    status?: true
    start_date?: true
    end_date?: true
    created_at?: true
    updated_at?: true
    created_by?: true
  }

  export type ProjectsMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    cover_image_url?: true
    icon_url?: true
    status?: true
    start_date?: true
    end_date?: true
    created_at?: true
    updated_at?: true
    created_by?: true
  }

  export type ProjectsCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    cover_image_url?: true
    icon_url?: true
    status?: true
    start_date?: true
    end_date?: true
    tags?: true
    members?: true
    created_at?: true
    updated_at?: true
    created_by?: true
    _all?: true
  }

  export type ProjectsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which projects to aggregate.
     */
    where?: projectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of projects to fetch.
     */
    orderBy?: projectsOrderByWithRelationInput | projectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: projectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned projects
    **/
    _count?: true | ProjectsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectsMaxAggregateInputType
  }

  export type GetProjectsAggregateType<T extends ProjectsAggregateArgs> = {
        [P in keyof T & keyof AggregateProjects]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjects[P]>
      : GetScalarType<T[P], AggregateProjects[P]>
  }




  export type projectsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: projectsWhereInput
    orderBy?: projectsOrderByWithAggregationInput | projectsOrderByWithAggregationInput[]
    by: ProjectsScalarFieldEnum[] | ProjectsScalarFieldEnum
    having?: projectsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectsCountAggregateInputType | true
    _min?: ProjectsMinAggregateInputType
    _max?: ProjectsMaxAggregateInputType
  }

  export type ProjectsGroupByOutputType = {
    id: string
    name: string
    slug: string
    description: string | null
    cover_image_url: string | null
    icon_url: string | null
    status: string | null
    start_date: Date | null
    end_date: Date | null
    tags: JsonValue | null
    members: JsonValue | null
    created_at: Date | null
    updated_at: Date | null
    created_by: string | null
    _count: ProjectsCountAggregateOutputType | null
    _min: ProjectsMinAggregateOutputType | null
    _max: ProjectsMaxAggregateOutputType | null
  }

  type GetProjectsGroupByPayload<T extends projectsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectsGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectsGroupByOutputType[P]>
        }
      >
    >


  export type projectsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    cover_image_url?: boolean
    icon_url?: boolean
    status?: boolean
    start_date?: boolean
    end_date?: boolean
    tags?: boolean
    members?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    feedbacks?: boolean | projects$feedbacksArgs<ExtArgs>
    group_chats?: boolean | projects$group_chatsArgs<ExtArgs>
    meetings?: boolean | projects$meetingsArgs<ExtArgs>
    users?: boolean | projects$usersArgs<ExtArgs>
    requirements?: boolean | projects$requirementsArgs<ExtArgs>
    specbot_chats?: boolean | projects$specbot_chatsArgs<ExtArgs>
    _count?: boolean | ProjectsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projects"]>

  export type projectsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    cover_image_url?: boolean
    icon_url?: boolean
    status?: boolean
    start_date?: boolean
    end_date?: boolean
    tags?: boolean
    members?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    users?: boolean | projects$usersArgs<ExtArgs>
  }, ExtArgs["result"]["projects"]>

  export type projectsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    cover_image_url?: boolean
    icon_url?: boolean
    status?: boolean
    start_date?: boolean
    end_date?: boolean
    tags?: boolean
    members?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    users?: boolean | projects$usersArgs<ExtArgs>
  }, ExtArgs["result"]["projects"]>

  export type projectsSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    cover_image_url?: boolean
    icon_url?: boolean
    status?: boolean
    start_date?: boolean
    end_date?: boolean
    tags?: boolean
    members?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
  }

  export type projectsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "description" | "cover_image_url" | "icon_url" | "status" | "start_date" | "end_date" | "tags" | "members" | "created_at" | "updated_at" | "created_by", ExtArgs["result"]["projects"]>
  export type projectsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    feedbacks?: boolean | projects$feedbacksArgs<ExtArgs>
    group_chats?: boolean | projects$group_chatsArgs<ExtArgs>
    meetings?: boolean | projects$meetingsArgs<ExtArgs>
    users?: boolean | projects$usersArgs<ExtArgs>
    requirements?: boolean | projects$requirementsArgs<ExtArgs>
    specbot_chats?: boolean | projects$specbot_chatsArgs<ExtArgs>
    _count?: boolean | ProjectsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type projectsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | projects$usersArgs<ExtArgs>
  }
  export type projectsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | projects$usersArgs<ExtArgs>
  }

  export type $projectsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "projects"
    objects: {
      feedbacks: Prisma.$feedbacksPayload<ExtArgs>[]
      group_chats: Prisma.$group_chatsPayload<ExtArgs> | null
      meetings: Prisma.$meetingsPayload<ExtArgs>[]
      users: Prisma.$usersPayload<ExtArgs> | null
      requirements: Prisma.$requirementsPayload<ExtArgs>[]
      specbot_chats: Prisma.$specbot_chatsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      description: string | null
      cover_image_url: string | null
      icon_url: string | null
      status: string | null
      start_date: Date | null
      end_date: Date | null
      tags: Prisma.JsonValue | null
      members: Prisma.JsonValue | null
      created_at: Date | null
      updated_at: Date | null
      created_by: string | null
    }, ExtArgs["result"]["projects"]>
    composites: {}
  }

  type projectsGetPayload<S extends boolean | null | undefined | projectsDefaultArgs> = $Result.GetResult<Prisma.$projectsPayload, S>

  type projectsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<projectsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectsCountAggregateInputType | true
    }

  export interface projectsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['projects'], meta: { name: 'projects' } }
    /**
     * Find zero or one Projects that matches the filter.
     * @param {projectsFindUniqueArgs} args - Arguments to find a Projects
     * @example
     * // Get one Projects
     * const projects = await prisma.projects.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends projectsFindUniqueArgs>(args: SelectSubset<T, projectsFindUniqueArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Projects that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {projectsFindUniqueOrThrowArgs} args - Arguments to find a Projects
     * @example
     * // Get one Projects
     * const projects = await prisma.projects.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends projectsFindUniqueOrThrowArgs>(args: SelectSubset<T, projectsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectsFindFirstArgs} args - Arguments to find a Projects
     * @example
     * // Get one Projects
     * const projects = await prisma.projects.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends projectsFindFirstArgs>(args?: SelectSubset<T, projectsFindFirstArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Projects that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectsFindFirstOrThrowArgs} args - Arguments to find a Projects
     * @example
     * // Get one Projects
     * const projects = await prisma.projects.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends projectsFindFirstOrThrowArgs>(args?: SelectSubset<T, projectsFindFirstOrThrowArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.projects.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.projects.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectsWithIdOnly = await prisma.projects.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends projectsFindManyArgs>(args?: SelectSubset<T, projectsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Projects.
     * @param {projectsCreateArgs} args - Arguments to create a Projects.
     * @example
     * // Create one Projects
     * const Projects = await prisma.projects.create({
     *   data: {
     *     // ... data to create a Projects
     *   }
     * })
     * 
     */
    create<T extends projectsCreateArgs>(args: SelectSubset<T, projectsCreateArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {projectsCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const projects = await prisma.projects.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends projectsCreateManyArgs>(args?: SelectSubset<T, projectsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {projectsCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const projects = await prisma.projects.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectsWithIdOnly = await prisma.projects.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends projectsCreateManyAndReturnArgs>(args?: SelectSubset<T, projectsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Projects.
     * @param {projectsDeleteArgs} args - Arguments to delete one Projects.
     * @example
     * // Delete one Projects
     * const Projects = await prisma.projects.delete({
     *   where: {
     *     // ... filter to delete one Projects
     *   }
     * })
     * 
     */
    delete<T extends projectsDeleteArgs>(args: SelectSubset<T, projectsDeleteArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Projects.
     * @param {projectsUpdateArgs} args - Arguments to update one Projects.
     * @example
     * // Update one Projects
     * const projects = await prisma.projects.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends projectsUpdateArgs>(args: SelectSubset<T, projectsUpdateArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {projectsDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.projects.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends projectsDeleteManyArgs>(args?: SelectSubset<T, projectsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const projects = await prisma.projects.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends projectsUpdateManyArgs>(args: SelectSubset<T, projectsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {projectsUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const projects = await prisma.projects.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectsWithIdOnly = await prisma.projects.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends projectsUpdateManyAndReturnArgs>(args: SelectSubset<T, projectsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Projects.
     * @param {projectsUpsertArgs} args - Arguments to update or create a Projects.
     * @example
     * // Update or create a Projects
     * const projects = await prisma.projects.upsert({
     *   create: {
     *     // ... data to create a Projects
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Projects we want to update
     *   }
     * })
     */
    upsert<T extends projectsUpsertArgs>(args: SelectSubset<T, projectsUpsertArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectsCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.projects.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends projectsCountArgs>(
      args?: Subset<T, projectsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectsAggregateArgs>(args: Subset<T, ProjectsAggregateArgs>): Prisma.PrismaPromise<GetProjectsAggregateType<T>>

    /**
     * Group by Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends projectsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: projectsGroupByArgs['orderBy'] }
        : { orderBy?: projectsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, projectsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the projects model
   */
  readonly fields: projectsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for projects.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__projectsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    feedbacks<T extends projects$feedbacksArgs<ExtArgs> = {}>(args?: Subset<T, projects$feedbacksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$feedbacksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    group_chats<T extends projects$group_chatsArgs<ExtArgs> = {}>(args?: Subset<T, projects$group_chatsArgs<ExtArgs>>): Prisma__group_chatsClient<$Result.GetResult<Prisma.$group_chatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    meetings<T extends projects$meetingsArgs<ExtArgs> = {}>(args?: Subset<T, projects$meetingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends projects$usersArgs<ExtArgs> = {}>(args?: Subset<T, projects$usersArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    requirements<T extends projects$requirementsArgs<ExtArgs> = {}>(args?: Subset<T, projects$requirementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    specbot_chats<T extends projects$specbot_chatsArgs<ExtArgs> = {}>(args?: Subset<T, projects$specbot_chatsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the projects model
   */
  interface projectsFieldRefs {
    readonly id: FieldRef<"projects", 'String'>
    readonly name: FieldRef<"projects", 'String'>
    readonly slug: FieldRef<"projects", 'String'>
    readonly description: FieldRef<"projects", 'String'>
    readonly cover_image_url: FieldRef<"projects", 'String'>
    readonly icon_url: FieldRef<"projects", 'String'>
    readonly status: FieldRef<"projects", 'String'>
    readonly start_date: FieldRef<"projects", 'DateTime'>
    readonly end_date: FieldRef<"projects", 'DateTime'>
    readonly tags: FieldRef<"projects", 'Json'>
    readonly members: FieldRef<"projects", 'Json'>
    readonly created_at: FieldRef<"projects", 'DateTime'>
    readonly updated_at: FieldRef<"projects", 'DateTime'>
    readonly created_by: FieldRef<"projects", 'String'>
  }
    

  // Custom InputTypes
  /**
   * projects findUnique
   */
  export type projectsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    /**
     * Filter, which projects to fetch.
     */
    where: projectsWhereUniqueInput
  }

  /**
   * projects findUniqueOrThrow
   */
  export type projectsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    /**
     * Filter, which projects to fetch.
     */
    where: projectsWhereUniqueInput
  }

  /**
   * projects findFirst
   */
  export type projectsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    /**
     * Filter, which projects to fetch.
     */
    where?: projectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of projects to fetch.
     */
    orderBy?: projectsOrderByWithRelationInput | projectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for projects.
     */
    cursor?: projectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of projects.
     */
    distinct?: ProjectsScalarFieldEnum | ProjectsScalarFieldEnum[]
  }

  /**
   * projects findFirstOrThrow
   */
  export type projectsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    /**
     * Filter, which projects to fetch.
     */
    where?: projectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of projects to fetch.
     */
    orderBy?: projectsOrderByWithRelationInput | projectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for projects.
     */
    cursor?: projectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of projects.
     */
    distinct?: ProjectsScalarFieldEnum | ProjectsScalarFieldEnum[]
  }

  /**
   * projects findMany
   */
  export type projectsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    /**
     * Filter, which projects to fetch.
     */
    where?: projectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of projects to fetch.
     */
    orderBy?: projectsOrderByWithRelationInput | projectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing projects.
     */
    cursor?: projectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` projects.
     */
    skip?: number
    distinct?: ProjectsScalarFieldEnum | ProjectsScalarFieldEnum[]
  }

  /**
   * projects create
   */
  export type projectsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    /**
     * The data needed to create a projects.
     */
    data: XOR<projectsCreateInput, projectsUncheckedCreateInput>
  }

  /**
   * projects createMany
   */
  export type projectsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many projects.
     */
    data: projectsCreateManyInput | projectsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * projects createManyAndReturn
   */
  export type projectsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * The data used to create many projects.
     */
    data: projectsCreateManyInput | projectsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * projects update
   */
  export type projectsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    /**
     * The data needed to update a projects.
     */
    data: XOR<projectsUpdateInput, projectsUncheckedUpdateInput>
    /**
     * Choose, which projects to update.
     */
    where: projectsWhereUniqueInput
  }

  /**
   * projects updateMany
   */
  export type projectsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update projects.
     */
    data: XOR<projectsUpdateManyMutationInput, projectsUncheckedUpdateManyInput>
    /**
     * Filter which projects to update
     */
    where?: projectsWhereInput
    /**
     * Limit how many projects to update.
     */
    limit?: number
  }

  /**
   * projects updateManyAndReturn
   */
  export type projectsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * The data used to update projects.
     */
    data: XOR<projectsUpdateManyMutationInput, projectsUncheckedUpdateManyInput>
    /**
     * Filter which projects to update
     */
    where?: projectsWhereInput
    /**
     * Limit how many projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * projects upsert
   */
  export type projectsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    /**
     * The filter to search for the projects to update in case it exists.
     */
    where: projectsWhereUniqueInput
    /**
     * In case the projects found by the `where` argument doesn't exist, create a new projects with this data.
     */
    create: XOR<projectsCreateInput, projectsUncheckedCreateInput>
    /**
     * In case the projects was found with the provided `where` argument, update it with this data.
     */
    update: XOR<projectsUpdateInput, projectsUncheckedUpdateInput>
  }

  /**
   * projects delete
   */
  export type projectsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    /**
     * Filter which projects to delete.
     */
    where: projectsWhereUniqueInput
  }

  /**
   * projects deleteMany
   */
  export type projectsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which projects to delete
     */
    where?: projectsWhereInput
    /**
     * Limit how many projects to delete.
     */
    limit?: number
  }

  /**
   * projects.feedbacks
   */
  export type projects$feedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedbacks
     */
    select?: feedbacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedbacks
     */
    omit?: feedbacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: feedbacksInclude<ExtArgs> | null
    where?: feedbacksWhereInput
    orderBy?: feedbacksOrderByWithRelationInput | feedbacksOrderByWithRelationInput[]
    cursor?: feedbacksWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FeedbacksScalarFieldEnum | FeedbacksScalarFieldEnum[]
  }

  /**
   * projects.group_chats
   */
  export type projects$group_chatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the group_chats
     */
    select?: group_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the group_chats
     */
    omit?: group_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: group_chatsInclude<ExtArgs> | null
    where?: group_chatsWhereInput
  }

  /**
   * projects.meetings
   */
  export type projects$meetingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    where?: meetingsWhereInput
    orderBy?: meetingsOrderByWithRelationInput | meetingsOrderByWithRelationInput[]
    cursor?: meetingsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MeetingsScalarFieldEnum | MeetingsScalarFieldEnum[]
  }

  /**
   * projects.users
   */
  export type projects$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
  }

  /**
   * projects.requirements
   */
  export type projects$requirementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
    where?: requirementsWhereInput
    orderBy?: requirementsOrderByWithRelationInput | requirementsOrderByWithRelationInput[]
    cursor?: requirementsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RequirementsScalarFieldEnum | RequirementsScalarFieldEnum[]
  }

  /**
   * projects.specbot_chats
   */
  export type projects$specbot_chatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    where?: specbot_chatsWhereInput
    orderBy?: specbot_chatsOrderByWithRelationInput | specbot_chatsOrderByWithRelationInput[]
    cursor?: specbot_chatsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Specbot_chatsScalarFieldEnum | Specbot_chatsScalarFieldEnum[]
  }

  /**
   * projects without action
   */
  export type projectsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
  }


  /**
   * Model recordings
   */

  export type AggregateRecordings = {
    _count: RecordingsCountAggregateOutputType | null
    _min: RecordingsMinAggregateOutputType | null
    _max: RecordingsMaxAggregateOutputType | null
  }

  export type RecordingsMinAggregateOutputType = {
    id: string | null
    title: string | null
    recording_url: string | null
    transcript_url: string | null
    created_at: Date | null
    updated_at: Date | null
    meeting_id: string | null
  }

  export type RecordingsMaxAggregateOutputType = {
    id: string | null
    title: string | null
    recording_url: string | null
    transcript_url: string | null
    created_at: Date | null
    updated_at: Date | null
    meeting_id: string | null
  }

  export type RecordingsCountAggregateOutputType = {
    id: number
    title: number
    recording_url: number
    transcript_url: number
    created_at: number
    updated_at: number
    meeting_id: number
    _all: number
  }


  export type RecordingsMinAggregateInputType = {
    id?: true
    title?: true
    recording_url?: true
    transcript_url?: true
    created_at?: true
    updated_at?: true
    meeting_id?: true
  }

  export type RecordingsMaxAggregateInputType = {
    id?: true
    title?: true
    recording_url?: true
    transcript_url?: true
    created_at?: true
    updated_at?: true
    meeting_id?: true
  }

  export type RecordingsCountAggregateInputType = {
    id?: true
    title?: true
    recording_url?: true
    transcript_url?: true
    created_at?: true
    updated_at?: true
    meeting_id?: true
    _all?: true
  }

  export type RecordingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which recordings to aggregate.
     */
    where?: recordingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of recordings to fetch.
     */
    orderBy?: recordingsOrderByWithRelationInput | recordingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: recordingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` recordings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned recordings
    **/
    _count?: true | RecordingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecordingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecordingsMaxAggregateInputType
  }

  export type GetRecordingsAggregateType<T extends RecordingsAggregateArgs> = {
        [P in keyof T & keyof AggregateRecordings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecordings[P]>
      : GetScalarType<T[P], AggregateRecordings[P]>
  }




  export type recordingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: recordingsWhereInput
    orderBy?: recordingsOrderByWithAggregationInput | recordingsOrderByWithAggregationInput[]
    by: RecordingsScalarFieldEnum[] | RecordingsScalarFieldEnum
    having?: recordingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecordingsCountAggregateInputType | true
    _min?: RecordingsMinAggregateInputType
    _max?: RecordingsMaxAggregateInputType
  }

  export type RecordingsGroupByOutputType = {
    id: string
    title: string | null
    recording_url: string | null
    transcript_url: string | null
    created_at: Date | null
    updated_at: Date | null
    meeting_id: string | null
    _count: RecordingsCountAggregateOutputType | null
    _min: RecordingsMinAggregateOutputType | null
    _max: RecordingsMaxAggregateOutputType | null
  }

  type GetRecordingsGroupByPayload<T extends recordingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecordingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecordingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecordingsGroupByOutputType[P]>
            : GetScalarType<T[P], RecordingsGroupByOutputType[P]>
        }
      >
    >


  export type recordingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    recording_url?: boolean
    transcript_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    meeting_id?: boolean
    meetings?: boolean | recordings$meetingsArgs<ExtArgs>
  }, ExtArgs["result"]["recordings"]>

  export type recordingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    recording_url?: boolean
    transcript_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    meeting_id?: boolean
    meetings?: boolean | recordings$meetingsArgs<ExtArgs>
  }, ExtArgs["result"]["recordings"]>

  export type recordingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    recording_url?: boolean
    transcript_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    meeting_id?: boolean
    meetings?: boolean | recordings$meetingsArgs<ExtArgs>
  }, ExtArgs["result"]["recordings"]>

  export type recordingsSelectScalar = {
    id?: boolean
    title?: boolean
    recording_url?: boolean
    transcript_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    meeting_id?: boolean
  }

  export type recordingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "recording_url" | "transcript_url" | "created_at" | "updated_at" | "meeting_id", ExtArgs["result"]["recordings"]>
  export type recordingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meetings?: boolean | recordings$meetingsArgs<ExtArgs>
  }
  export type recordingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meetings?: boolean | recordings$meetingsArgs<ExtArgs>
  }
  export type recordingsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meetings?: boolean | recordings$meetingsArgs<ExtArgs>
  }

  export type $recordingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "recordings"
    objects: {
      meetings: Prisma.$meetingsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      recording_url: string | null
      transcript_url: string | null
      created_at: Date | null
      updated_at: Date | null
      meeting_id: string | null
    }, ExtArgs["result"]["recordings"]>
    composites: {}
  }

  type recordingsGetPayload<S extends boolean | null | undefined | recordingsDefaultArgs> = $Result.GetResult<Prisma.$recordingsPayload, S>

  type recordingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<recordingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecordingsCountAggregateInputType | true
    }

  export interface recordingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['recordings'], meta: { name: 'recordings' } }
    /**
     * Find zero or one Recordings that matches the filter.
     * @param {recordingsFindUniqueArgs} args - Arguments to find a Recordings
     * @example
     * // Get one Recordings
     * const recordings = await prisma.recordings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends recordingsFindUniqueArgs>(args: SelectSubset<T, recordingsFindUniqueArgs<ExtArgs>>): Prisma__recordingsClient<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Recordings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {recordingsFindUniqueOrThrowArgs} args - Arguments to find a Recordings
     * @example
     * // Get one Recordings
     * const recordings = await prisma.recordings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends recordingsFindUniqueOrThrowArgs>(args: SelectSubset<T, recordingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__recordingsClient<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Recordings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recordingsFindFirstArgs} args - Arguments to find a Recordings
     * @example
     * // Get one Recordings
     * const recordings = await prisma.recordings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends recordingsFindFirstArgs>(args?: SelectSubset<T, recordingsFindFirstArgs<ExtArgs>>): Prisma__recordingsClient<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Recordings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recordingsFindFirstOrThrowArgs} args - Arguments to find a Recordings
     * @example
     * // Get one Recordings
     * const recordings = await prisma.recordings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends recordingsFindFirstOrThrowArgs>(args?: SelectSubset<T, recordingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__recordingsClient<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Recordings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recordingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recordings
     * const recordings = await prisma.recordings.findMany()
     * 
     * // Get first 10 Recordings
     * const recordings = await prisma.recordings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recordingsWithIdOnly = await prisma.recordings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends recordingsFindManyArgs>(args?: SelectSubset<T, recordingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Recordings.
     * @param {recordingsCreateArgs} args - Arguments to create a Recordings.
     * @example
     * // Create one Recordings
     * const Recordings = await prisma.recordings.create({
     *   data: {
     *     // ... data to create a Recordings
     *   }
     * })
     * 
     */
    create<T extends recordingsCreateArgs>(args: SelectSubset<T, recordingsCreateArgs<ExtArgs>>): Prisma__recordingsClient<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Recordings.
     * @param {recordingsCreateManyArgs} args - Arguments to create many Recordings.
     * @example
     * // Create many Recordings
     * const recordings = await prisma.recordings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends recordingsCreateManyArgs>(args?: SelectSubset<T, recordingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Recordings and returns the data saved in the database.
     * @param {recordingsCreateManyAndReturnArgs} args - Arguments to create many Recordings.
     * @example
     * // Create many Recordings
     * const recordings = await prisma.recordings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Recordings and only return the `id`
     * const recordingsWithIdOnly = await prisma.recordings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends recordingsCreateManyAndReturnArgs>(args?: SelectSubset<T, recordingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Recordings.
     * @param {recordingsDeleteArgs} args - Arguments to delete one Recordings.
     * @example
     * // Delete one Recordings
     * const Recordings = await prisma.recordings.delete({
     *   where: {
     *     // ... filter to delete one Recordings
     *   }
     * })
     * 
     */
    delete<T extends recordingsDeleteArgs>(args: SelectSubset<T, recordingsDeleteArgs<ExtArgs>>): Prisma__recordingsClient<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Recordings.
     * @param {recordingsUpdateArgs} args - Arguments to update one Recordings.
     * @example
     * // Update one Recordings
     * const recordings = await prisma.recordings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends recordingsUpdateArgs>(args: SelectSubset<T, recordingsUpdateArgs<ExtArgs>>): Prisma__recordingsClient<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Recordings.
     * @param {recordingsDeleteManyArgs} args - Arguments to filter Recordings to delete.
     * @example
     * // Delete a few Recordings
     * const { count } = await prisma.recordings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends recordingsDeleteManyArgs>(args?: SelectSubset<T, recordingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recordings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recordingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recordings
     * const recordings = await prisma.recordings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends recordingsUpdateManyArgs>(args: SelectSubset<T, recordingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recordings and returns the data updated in the database.
     * @param {recordingsUpdateManyAndReturnArgs} args - Arguments to update many Recordings.
     * @example
     * // Update many Recordings
     * const recordings = await prisma.recordings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Recordings and only return the `id`
     * const recordingsWithIdOnly = await prisma.recordings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends recordingsUpdateManyAndReturnArgs>(args: SelectSubset<T, recordingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Recordings.
     * @param {recordingsUpsertArgs} args - Arguments to update or create a Recordings.
     * @example
     * // Update or create a Recordings
     * const recordings = await prisma.recordings.upsert({
     *   create: {
     *     // ... data to create a Recordings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recordings we want to update
     *   }
     * })
     */
    upsert<T extends recordingsUpsertArgs>(args: SelectSubset<T, recordingsUpsertArgs<ExtArgs>>): Prisma__recordingsClient<$Result.GetResult<Prisma.$recordingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Recordings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recordingsCountArgs} args - Arguments to filter Recordings to count.
     * @example
     * // Count the number of Recordings
     * const count = await prisma.recordings.count({
     *   where: {
     *     // ... the filter for the Recordings we want to count
     *   }
     * })
    **/
    count<T extends recordingsCountArgs>(
      args?: Subset<T, recordingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecordingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Recordings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecordingsAggregateArgs>(args: Subset<T, RecordingsAggregateArgs>): Prisma.PrismaPromise<GetRecordingsAggregateType<T>>

    /**
     * Group by Recordings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recordingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends recordingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: recordingsGroupByArgs['orderBy'] }
        : { orderBy?: recordingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, recordingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecordingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the recordings model
   */
  readonly fields: recordingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for recordings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__recordingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meetings<T extends recordings$meetingsArgs<ExtArgs> = {}>(args?: Subset<T, recordings$meetingsArgs<ExtArgs>>): Prisma__meetingsClient<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the recordings model
   */
  interface recordingsFieldRefs {
    readonly id: FieldRef<"recordings", 'String'>
    readonly title: FieldRef<"recordings", 'String'>
    readonly recording_url: FieldRef<"recordings", 'String'>
    readonly transcript_url: FieldRef<"recordings", 'String'>
    readonly created_at: FieldRef<"recordings", 'DateTime'>
    readonly updated_at: FieldRef<"recordings", 'DateTime'>
    readonly meeting_id: FieldRef<"recordings", 'String'>
  }
    

  // Custom InputTypes
  /**
   * recordings findUnique
   */
  export type recordingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
    /**
     * Filter, which recordings to fetch.
     */
    where: recordingsWhereUniqueInput
  }

  /**
   * recordings findUniqueOrThrow
   */
  export type recordingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
    /**
     * Filter, which recordings to fetch.
     */
    where: recordingsWhereUniqueInput
  }

  /**
   * recordings findFirst
   */
  export type recordingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
    /**
     * Filter, which recordings to fetch.
     */
    where?: recordingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of recordings to fetch.
     */
    orderBy?: recordingsOrderByWithRelationInput | recordingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for recordings.
     */
    cursor?: recordingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` recordings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of recordings.
     */
    distinct?: RecordingsScalarFieldEnum | RecordingsScalarFieldEnum[]
  }

  /**
   * recordings findFirstOrThrow
   */
  export type recordingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
    /**
     * Filter, which recordings to fetch.
     */
    where?: recordingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of recordings to fetch.
     */
    orderBy?: recordingsOrderByWithRelationInput | recordingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for recordings.
     */
    cursor?: recordingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` recordings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of recordings.
     */
    distinct?: RecordingsScalarFieldEnum | RecordingsScalarFieldEnum[]
  }

  /**
   * recordings findMany
   */
  export type recordingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
    /**
     * Filter, which recordings to fetch.
     */
    where?: recordingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of recordings to fetch.
     */
    orderBy?: recordingsOrderByWithRelationInput | recordingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing recordings.
     */
    cursor?: recordingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` recordings.
     */
    skip?: number
    distinct?: RecordingsScalarFieldEnum | RecordingsScalarFieldEnum[]
  }

  /**
   * recordings create
   */
  export type recordingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
    /**
     * The data needed to create a recordings.
     */
    data?: XOR<recordingsCreateInput, recordingsUncheckedCreateInput>
  }

  /**
   * recordings createMany
   */
  export type recordingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many recordings.
     */
    data: recordingsCreateManyInput | recordingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * recordings createManyAndReturn
   */
  export type recordingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * The data used to create many recordings.
     */
    data: recordingsCreateManyInput | recordingsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * recordings update
   */
  export type recordingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
    /**
     * The data needed to update a recordings.
     */
    data: XOR<recordingsUpdateInput, recordingsUncheckedUpdateInput>
    /**
     * Choose, which recordings to update.
     */
    where: recordingsWhereUniqueInput
  }

  /**
   * recordings updateMany
   */
  export type recordingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update recordings.
     */
    data: XOR<recordingsUpdateManyMutationInput, recordingsUncheckedUpdateManyInput>
    /**
     * Filter which recordings to update
     */
    where?: recordingsWhereInput
    /**
     * Limit how many recordings to update.
     */
    limit?: number
  }

  /**
   * recordings updateManyAndReturn
   */
  export type recordingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * The data used to update recordings.
     */
    data: XOR<recordingsUpdateManyMutationInput, recordingsUncheckedUpdateManyInput>
    /**
     * Filter which recordings to update
     */
    where?: recordingsWhereInput
    /**
     * Limit how many recordings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * recordings upsert
   */
  export type recordingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
    /**
     * The filter to search for the recordings to update in case it exists.
     */
    where: recordingsWhereUniqueInput
    /**
     * In case the recordings found by the `where` argument doesn't exist, create a new recordings with this data.
     */
    create: XOR<recordingsCreateInput, recordingsUncheckedCreateInput>
    /**
     * In case the recordings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<recordingsUpdateInput, recordingsUncheckedUpdateInput>
  }

  /**
   * recordings delete
   */
  export type recordingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
    /**
     * Filter which recordings to delete.
     */
    where: recordingsWhereUniqueInput
  }

  /**
   * recordings deleteMany
   */
  export type recordingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which recordings to delete
     */
    where?: recordingsWhereInput
    /**
     * Limit how many recordings to delete.
     */
    limit?: number
  }

  /**
   * recordings.meetings
   */
  export type recordings$meetingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    where?: meetingsWhereInput
  }

  /**
   * recordings without action
   */
  export type recordingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recordings
     */
    select?: recordingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the recordings
     */
    omit?: recordingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: recordingsInclude<ExtArgs> | null
  }


  /**
   * Model requirements
   */

  export type AggregateRequirements = {
    _count: RequirementsCountAggregateOutputType | null
    _min: RequirementsMinAggregateOutputType | null
    _max: RequirementsMaxAggregateOutputType | null
  }

  export type RequirementsMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    priority: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
    project_id: string | null
  }

  export type RequirementsMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    priority: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
    project_id: string | null
  }

  export type RequirementsCountAggregateOutputType = {
    id: number
    title: number
    description: number
    priority: number
    status: number
    metadata: number
    created_at: number
    updated_at: number
    project_id: number
    _all: number
  }


  export type RequirementsMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    priority?: true
    status?: true
    created_at?: true
    updated_at?: true
    project_id?: true
  }

  export type RequirementsMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    priority?: true
    status?: true
    created_at?: true
    updated_at?: true
    project_id?: true
  }

  export type RequirementsCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    priority?: true
    status?: true
    metadata?: true
    created_at?: true
    updated_at?: true
    project_id?: true
    _all?: true
  }

  export type RequirementsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which requirements to aggregate.
     */
    where?: requirementsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requirements to fetch.
     */
    orderBy?: requirementsOrderByWithRelationInput | requirementsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: requirementsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned requirements
    **/
    _count?: true | RequirementsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RequirementsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RequirementsMaxAggregateInputType
  }

  export type GetRequirementsAggregateType<T extends RequirementsAggregateArgs> = {
        [P in keyof T & keyof AggregateRequirements]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRequirements[P]>
      : GetScalarType<T[P], AggregateRequirements[P]>
  }




  export type requirementsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: requirementsWhereInput
    orderBy?: requirementsOrderByWithAggregationInput | requirementsOrderByWithAggregationInput[]
    by: RequirementsScalarFieldEnum[] | RequirementsScalarFieldEnum
    having?: requirementsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RequirementsCountAggregateInputType | true
    _min?: RequirementsMinAggregateInputType
    _max?: RequirementsMaxAggregateInputType
  }

  export type RequirementsGroupByOutputType = {
    id: string
    title: string
    description: string | null
    priority: string | null
    status: string | null
    metadata: JsonValue | null
    created_at: Date | null
    updated_at: Date | null
    project_id: string | null
    _count: RequirementsCountAggregateOutputType | null
    _min: RequirementsMinAggregateOutputType | null
    _max: RequirementsMaxAggregateOutputType | null
  }

  type GetRequirementsGroupByPayload<T extends requirementsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RequirementsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RequirementsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RequirementsGroupByOutputType[P]>
            : GetScalarType<T[P], RequirementsGroupByOutputType[P]>
        }
      >
    >


  export type requirementsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    priority?: boolean
    status?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
    project_id?: boolean
    projects?: boolean | requirements$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["requirements"]>

  export type requirementsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    priority?: boolean
    status?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
    project_id?: boolean
    projects?: boolean | requirements$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["requirements"]>

  export type requirementsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    priority?: boolean
    status?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
    project_id?: boolean
    projects?: boolean | requirements$projectsArgs<ExtArgs>
  }, ExtArgs["result"]["requirements"]>

  export type requirementsSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    priority?: boolean
    status?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
    project_id?: boolean
  }

  export type requirementsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "priority" | "status" | "metadata" | "created_at" | "updated_at" | "project_id", ExtArgs["result"]["requirements"]>
  export type requirementsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | requirements$projectsArgs<ExtArgs>
  }
  export type requirementsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | requirements$projectsArgs<ExtArgs>
  }
  export type requirementsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | requirements$projectsArgs<ExtArgs>
  }

  export type $requirementsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "requirements"
    objects: {
      projects: Prisma.$projectsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      priority: string | null
      status: string | null
      metadata: Prisma.JsonValue | null
      created_at: Date | null
      updated_at: Date | null
      project_id: string | null
    }, ExtArgs["result"]["requirements"]>
    composites: {}
  }

  type requirementsGetPayload<S extends boolean | null | undefined | requirementsDefaultArgs> = $Result.GetResult<Prisma.$requirementsPayload, S>

  type requirementsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<requirementsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RequirementsCountAggregateInputType | true
    }

  export interface requirementsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['requirements'], meta: { name: 'requirements' } }
    /**
     * Find zero or one Requirements that matches the filter.
     * @param {requirementsFindUniqueArgs} args - Arguments to find a Requirements
     * @example
     * // Get one Requirements
     * const requirements = await prisma.requirements.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends requirementsFindUniqueArgs>(args: SelectSubset<T, requirementsFindUniqueArgs<ExtArgs>>): Prisma__requirementsClient<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Requirements that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {requirementsFindUniqueOrThrowArgs} args - Arguments to find a Requirements
     * @example
     * // Get one Requirements
     * const requirements = await prisma.requirements.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends requirementsFindUniqueOrThrowArgs>(args: SelectSubset<T, requirementsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__requirementsClient<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Requirements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requirementsFindFirstArgs} args - Arguments to find a Requirements
     * @example
     * // Get one Requirements
     * const requirements = await prisma.requirements.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends requirementsFindFirstArgs>(args?: SelectSubset<T, requirementsFindFirstArgs<ExtArgs>>): Prisma__requirementsClient<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Requirements that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requirementsFindFirstOrThrowArgs} args - Arguments to find a Requirements
     * @example
     * // Get one Requirements
     * const requirements = await prisma.requirements.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends requirementsFindFirstOrThrowArgs>(args?: SelectSubset<T, requirementsFindFirstOrThrowArgs<ExtArgs>>): Prisma__requirementsClient<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Requirements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requirementsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Requirements
     * const requirements = await prisma.requirements.findMany()
     * 
     * // Get first 10 Requirements
     * const requirements = await prisma.requirements.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const requirementsWithIdOnly = await prisma.requirements.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends requirementsFindManyArgs>(args?: SelectSubset<T, requirementsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Requirements.
     * @param {requirementsCreateArgs} args - Arguments to create a Requirements.
     * @example
     * // Create one Requirements
     * const Requirements = await prisma.requirements.create({
     *   data: {
     *     // ... data to create a Requirements
     *   }
     * })
     * 
     */
    create<T extends requirementsCreateArgs>(args: SelectSubset<T, requirementsCreateArgs<ExtArgs>>): Prisma__requirementsClient<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Requirements.
     * @param {requirementsCreateManyArgs} args - Arguments to create many Requirements.
     * @example
     * // Create many Requirements
     * const requirements = await prisma.requirements.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends requirementsCreateManyArgs>(args?: SelectSubset<T, requirementsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Requirements and returns the data saved in the database.
     * @param {requirementsCreateManyAndReturnArgs} args - Arguments to create many Requirements.
     * @example
     * // Create many Requirements
     * const requirements = await prisma.requirements.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Requirements and only return the `id`
     * const requirementsWithIdOnly = await prisma.requirements.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends requirementsCreateManyAndReturnArgs>(args?: SelectSubset<T, requirementsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Requirements.
     * @param {requirementsDeleteArgs} args - Arguments to delete one Requirements.
     * @example
     * // Delete one Requirements
     * const Requirements = await prisma.requirements.delete({
     *   where: {
     *     // ... filter to delete one Requirements
     *   }
     * })
     * 
     */
    delete<T extends requirementsDeleteArgs>(args: SelectSubset<T, requirementsDeleteArgs<ExtArgs>>): Prisma__requirementsClient<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Requirements.
     * @param {requirementsUpdateArgs} args - Arguments to update one Requirements.
     * @example
     * // Update one Requirements
     * const requirements = await prisma.requirements.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends requirementsUpdateArgs>(args: SelectSubset<T, requirementsUpdateArgs<ExtArgs>>): Prisma__requirementsClient<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Requirements.
     * @param {requirementsDeleteManyArgs} args - Arguments to filter Requirements to delete.
     * @example
     * // Delete a few Requirements
     * const { count } = await prisma.requirements.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends requirementsDeleteManyArgs>(args?: SelectSubset<T, requirementsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Requirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requirementsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Requirements
     * const requirements = await prisma.requirements.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends requirementsUpdateManyArgs>(args: SelectSubset<T, requirementsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Requirements and returns the data updated in the database.
     * @param {requirementsUpdateManyAndReturnArgs} args - Arguments to update many Requirements.
     * @example
     * // Update many Requirements
     * const requirements = await prisma.requirements.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Requirements and only return the `id`
     * const requirementsWithIdOnly = await prisma.requirements.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends requirementsUpdateManyAndReturnArgs>(args: SelectSubset<T, requirementsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Requirements.
     * @param {requirementsUpsertArgs} args - Arguments to update or create a Requirements.
     * @example
     * // Update or create a Requirements
     * const requirements = await prisma.requirements.upsert({
     *   create: {
     *     // ... data to create a Requirements
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Requirements we want to update
     *   }
     * })
     */
    upsert<T extends requirementsUpsertArgs>(args: SelectSubset<T, requirementsUpsertArgs<ExtArgs>>): Prisma__requirementsClient<$Result.GetResult<Prisma.$requirementsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Requirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requirementsCountArgs} args - Arguments to filter Requirements to count.
     * @example
     * // Count the number of Requirements
     * const count = await prisma.requirements.count({
     *   where: {
     *     // ... the filter for the Requirements we want to count
     *   }
     * })
    **/
    count<T extends requirementsCountArgs>(
      args?: Subset<T, requirementsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RequirementsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Requirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequirementsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RequirementsAggregateArgs>(args: Subset<T, RequirementsAggregateArgs>): Prisma.PrismaPromise<GetRequirementsAggregateType<T>>

    /**
     * Group by Requirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requirementsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends requirementsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: requirementsGroupByArgs['orderBy'] }
        : { orderBy?: requirementsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, requirementsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRequirementsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the requirements model
   */
  readonly fields: requirementsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for requirements.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__requirementsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends requirements$projectsArgs<ExtArgs> = {}>(args?: Subset<T, requirements$projectsArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the requirements model
   */
  interface requirementsFieldRefs {
    readonly id: FieldRef<"requirements", 'String'>
    readonly title: FieldRef<"requirements", 'String'>
    readonly description: FieldRef<"requirements", 'String'>
    readonly priority: FieldRef<"requirements", 'String'>
    readonly status: FieldRef<"requirements", 'String'>
    readonly metadata: FieldRef<"requirements", 'Json'>
    readonly created_at: FieldRef<"requirements", 'DateTime'>
    readonly updated_at: FieldRef<"requirements", 'DateTime'>
    readonly project_id: FieldRef<"requirements", 'String'>
  }
    

  // Custom InputTypes
  /**
   * requirements findUnique
   */
  export type requirementsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
    /**
     * Filter, which requirements to fetch.
     */
    where: requirementsWhereUniqueInput
  }

  /**
   * requirements findUniqueOrThrow
   */
  export type requirementsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
    /**
     * Filter, which requirements to fetch.
     */
    where: requirementsWhereUniqueInput
  }

  /**
   * requirements findFirst
   */
  export type requirementsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
    /**
     * Filter, which requirements to fetch.
     */
    where?: requirementsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requirements to fetch.
     */
    orderBy?: requirementsOrderByWithRelationInput | requirementsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for requirements.
     */
    cursor?: requirementsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of requirements.
     */
    distinct?: RequirementsScalarFieldEnum | RequirementsScalarFieldEnum[]
  }

  /**
   * requirements findFirstOrThrow
   */
  export type requirementsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
    /**
     * Filter, which requirements to fetch.
     */
    where?: requirementsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requirements to fetch.
     */
    orderBy?: requirementsOrderByWithRelationInput | requirementsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for requirements.
     */
    cursor?: requirementsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of requirements.
     */
    distinct?: RequirementsScalarFieldEnum | RequirementsScalarFieldEnum[]
  }

  /**
   * requirements findMany
   */
  export type requirementsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
    /**
     * Filter, which requirements to fetch.
     */
    where?: requirementsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requirements to fetch.
     */
    orderBy?: requirementsOrderByWithRelationInput | requirementsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing requirements.
     */
    cursor?: requirementsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requirements.
     */
    skip?: number
    distinct?: RequirementsScalarFieldEnum | RequirementsScalarFieldEnum[]
  }

  /**
   * requirements create
   */
  export type requirementsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
    /**
     * The data needed to create a requirements.
     */
    data: XOR<requirementsCreateInput, requirementsUncheckedCreateInput>
  }

  /**
   * requirements createMany
   */
  export type requirementsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many requirements.
     */
    data: requirementsCreateManyInput | requirementsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * requirements createManyAndReturn
   */
  export type requirementsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * The data used to create many requirements.
     */
    data: requirementsCreateManyInput | requirementsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * requirements update
   */
  export type requirementsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
    /**
     * The data needed to update a requirements.
     */
    data: XOR<requirementsUpdateInput, requirementsUncheckedUpdateInput>
    /**
     * Choose, which requirements to update.
     */
    where: requirementsWhereUniqueInput
  }

  /**
   * requirements updateMany
   */
  export type requirementsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update requirements.
     */
    data: XOR<requirementsUpdateManyMutationInput, requirementsUncheckedUpdateManyInput>
    /**
     * Filter which requirements to update
     */
    where?: requirementsWhereInput
    /**
     * Limit how many requirements to update.
     */
    limit?: number
  }

  /**
   * requirements updateManyAndReturn
   */
  export type requirementsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * The data used to update requirements.
     */
    data: XOR<requirementsUpdateManyMutationInput, requirementsUncheckedUpdateManyInput>
    /**
     * Filter which requirements to update
     */
    where?: requirementsWhereInput
    /**
     * Limit how many requirements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * requirements upsert
   */
  export type requirementsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
    /**
     * The filter to search for the requirements to update in case it exists.
     */
    where: requirementsWhereUniqueInput
    /**
     * In case the requirements found by the `where` argument doesn't exist, create a new requirements with this data.
     */
    create: XOR<requirementsCreateInput, requirementsUncheckedCreateInput>
    /**
     * In case the requirements was found with the provided `where` argument, update it with this data.
     */
    update: XOR<requirementsUpdateInput, requirementsUncheckedUpdateInput>
  }

  /**
   * requirements delete
   */
  export type requirementsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
    /**
     * Filter which requirements to delete.
     */
    where: requirementsWhereUniqueInput
  }

  /**
   * requirements deleteMany
   */
  export type requirementsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which requirements to delete
     */
    where?: requirementsWhereInput
    /**
     * Limit how many requirements to delete.
     */
    limit?: number
  }

  /**
   * requirements.projects
   */
  export type requirements$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    where?: projectsWhereInput
  }

  /**
   * requirements without action
   */
  export type requirementsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requirements
     */
    select?: requirementsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requirements
     */
    omit?: requirementsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requirementsInclude<ExtArgs> | null
  }


  /**
   * Model specbot_chats
   */

  export type AggregateSpecbot_chats = {
    _count: Specbot_chatsCountAggregateOutputType | null
    _min: Specbot_chatsMinAggregateOutputType | null
    _max: Specbot_chatsMaxAggregateOutputType | null
  }

  export type Specbot_chatsMinAggregateOutputType = {
    id: string | null
    title: string | null
    created_at: Date | null
    user_id: string | null
    project_id: string | null
  }

  export type Specbot_chatsMaxAggregateOutputType = {
    id: string | null
    title: string | null
    created_at: Date | null
    user_id: string | null
    project_id: string | null
  }

  export type Specbot_chatsCountAggregateOutputType = {
    id: number
    title: number
    created_at: number
    user_id: number
    project_id: number
    _all: number
  }


  export type Specbot_chatsMinAggregateInputType = {
    id?: true
    title?: true
    created_at?: true
    user_id?: true
    project_id?: true
  }

  export type Specbot_chatsMaxAggregateInputType = {
    id?: true
    title?: true
    created_at?: true
    user_id?: true
    project_id?: true
  }

  export type Specbot_chatsCountAggregateInputType = {
    id?: true
    title?: true
    created_at?: true
    user_id?: true
    project_id?: true
    _all?: true
  }

  export type Specbot_chatsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which specbot_chats to aggregate.
     */
    where?: specbot_chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of specbot_chats to fetch.
     */
    orderBy?: specbot_chatsOrderByWithRelationInput | specbot_chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: specbot_chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` specbot_chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` specbot_chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned specbot_chats
    **/
    _count?: true | Specbot_chatsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Specbot_chatsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Specbot_chatsMaxAggregateInputType
  }

  export type GetSpecbot_chatsAggregateType<T extends Specbot_chatsAggregateArgs> = {
        [P in keyof T & keyof AggregateSpecbot_chats]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpecbot_chats[P]>
      : GetScalarType<T[P], AggregateSpecbot_chats[P]>
  }




  export type specbot_chatsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: specbot_chatsWhereInput
    orderBy?: specbot_chatsOrderByWithAggregationInput | specbot_chatsOrderByWithAggregationInput[]
    by: Specbot_chatsScalarFieldEnum[] | Specbot_chatsScalarFieldEnum
    having?: specbot_chatsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Specbot_chatsCountAggregateInputType | true
    _min?: Specbot_chatsMinAggregateInputType
    _max?: Specbot_chatsMaxAggregateInputType
  }

  export type Specbot_chatsGroupByOutputType = {
    id: string
    title: string | null
    created_at: Date | null
    user_id: string | null
    project_id: string | null
    _count: Specbot_chatsCountAggregateOutputType | null
    _min: Specbot_chatsMinAggregateOutputType | null
    _max: Specbot_chatsMaxAggregateOutputType | null
  }

  type GetSpecbot_chatsGroupByPayload<T extends specbot_chatsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Specbot_chatsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Specbot_chatsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Specbot_chatsGroupByOutputType[P]>
            : GetScalarType<T[P], Specbot_chatsGroupByOutputType[P]>
        }
      >
    >


  export type specbot_chatsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    created_at?: boolean
    user_id?: boolean
    project_id?: boolean
    projects?: boolean | specbot_chats$projectsArgs<ExtArgs>
    users?: boolean | specbot_chats$usersArgs<ExtArgs>
  }, ExtArgs["result"]["specbot_chats"]>

  export type specbot_chatsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    created_at?: boolean
    user_id?: boolean
    project_id?: boolean
    projects?: boolean | specbot_chats$projectsArgs<ExtArgs>
    users?: boolean | specbot_chats$usersArgs<ExtArgs>
  }, ExtArgs["result"]["specbot_chats"]>

  export type specbot_chatsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    created_at?: boolean
    user_id?: boolean
    project_id?: boolean
    projects?: boolean | specbot_chats$projectsArgs<ExtArgs>
    users?: boolean | specbot_chats$usersArgs<ExtArgs>
  }, ExtArgs["result"]["specbot_chats"]>

  export type specbot_chatsSelectScalar = {
    id?: boolean
    title?: boolean
    created_at?: boolean
    user_id?: boolean
    project_id?: boolean
  }

  export type specbot_chatsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "created_at" | "user_id" | "project_id", ExtArgs["result"]["specbot_chats"]>
  export type specbot_chatsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | specbot_chats$projectsArgs<ExtArgs>
    users?: boolean | specbot_chats$usersArgs<ExtArgs>
  }
  export type specbot_chatsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | specbot_chats$projectsArgs<ExtArgs>
    users?: boolean | specbot_chats$usersArgs<ExtArgs>
  }
  export type specbot_chatsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | specbot_chats$projectsArgs<ExtArgs>
    users?: boolean | specbot_chats$usersArgs<ExtArgs>
  }

  export type $specbot_chatsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "specbot_chats"
    objects: {
      projects: Prisma.$projectsPayload<ExtArgs> | null
      users: Prisma.$usersPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      created_at: Date | null
      user_id: string | null
      project_id: string | null
    }, ExtArgs["result"]["specbot_chats"]>
    composites: {}
  }

  type specbot_chatsGetPayload<S extends boolean | null | undefined | specbot_chatsDefaultArgs> = $Result.GetResult<Prisma.$specbot_chatsPayload, S>

  type specbot_chatsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<specbot_chatsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Specbot_chatsCountAggregateInputType | true
    }

  export interface specbot_chatsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['specbot_chats'], meta: { name: 'specbot_chats' } }
    /**
     * Find zero or one Specbot_chats that matches the filter.
     * @param {specbot_chatsFindUniqueArgs} args - Arguments to find a Specbot_chats
     * @example
     * // Get one Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends specbot_chatsFindUniqueArgs>(args: SelectSubset<T, specbot_chatsFindUniqueArgs<ExtArgs>>): Prisma__specbot_chatsClient<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Specbot_chats that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {specbot_chatsFindUniqueOrThrowArgs} args - Arguments to find a Specbot_chats
     * @example
     * // Get one Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends specbot_chatsFindUniqueOrThrowArgs>(args: SelectSubset<T, specbot_chatsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__specbot_chatsClient<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Specbot_chats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {specbot_chatsFindFirstArgs} args - Arguments to find a Specbot_chats
     * @example
     * // Get one Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends specbot_chatsFindFirstArgs>(args?: SelectSubset<T, specbot_chatsFindFirstArgs<ExtArgs>>): Prisma__specbot_chatsClient<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Specbot_chats that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {specbot_chatsFindFirstOrThrowArgs} args - Arguments to find a Specbot_chats
     * @example
     * // Get one Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends specbot_chatsFindFirstOrThrowArgs>(args?: SelectSubset<T, specbot_chatsFindFirstOrThrowArgs<ExtArgs>>): Prisma__specbot_chatsClient<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Specbot_chats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {specbot_chatsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.findMany()
     * 
     * // Get first 10 Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const specbot_chatsWithIdOnly = await prisma.specbot_chats.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends specbot_chatsFindManyArgs>(args?: SelectSubset<T, specbot_chatsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Specbot_chats.
     * @param {specbot_chatsCreateArgs} args - Arguments to create a Specbot_chats.
     * @example
     * // Create one Specbot_chats
     * const Specbot_chats = await prisma.specbot_chats.create({
     *   data: {
     *     // ... data to create a Specbot_chats
     *   }
     * })
     * 
     */
    create<T extends specbot_chatsCreateArgs>(args: SelectSubset<T, specbot_chatsCreateArgs<ExtArgs>>): Prisma__specbot_chatsClient<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Specbot_chats.
     * @param {specbot_chatsCreateManyArgs} args - Arguments to create many Specbot_chats.
     * @example
     * // Create many Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends specbot_chatsCreateManyArgs>(args?: SelectSubset<T, specbot_chatsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Specbot_chats and returns the data saved in the database.
     * @param {specbot_chatsCreateManyAndReturnArgs} args - Arguments to create many Specbot_chats.
     * @example
     * // Create many Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Specbot_chats and only return the `id`
     * const specbot_chatsWithIdOnly = await prisma.specbot_chats.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends specbot_chatsCreateManyAndReturnArgs>(args?: SelectSubset<T, specbot_chatsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Specbot_chats.
     * @param {specbot_chatsDeleteArgs} args - Arguments to delete one Specbot_chats.
     * @example
     * // Delete one Specbot_chats
     * const Specbot_chats = await prisma.specbot_chats.delete({
     *   where: {
     *     // ... filter to delete one Specbot_chats
     *   }
     * })
     * 
     */
    delete<T extends specbot_chatsDeleteArgs>(args: SelectSubset<T, specbot_chatsDeleteArgs<ExtArgs>>): Prisma__specbot_chatsClient<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Specbot_chats.
     * @param {specbot_chatsUpdateArgs} args - Arguments to update one Specbot_chats.
     * @example
     * // Update one Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends specbot_chatsUpdateArgs>(args: SelectSubset<T, specbot_chatsUpdateArgs<ExtArgs>>): Prisma__specbot_chatsClient<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Specbot_chats.
     * @param {specbot_chatsDeleteManyArgs} args - Arguments to filter Specbot_chats to delete.
     * @example
     * // Delete a few Specbot_chats
     * const { count } = await prisma.specbot_chats.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends specbot_chatsDeleteManyArgs>(args?: SelectSubset<T, specbot_chatsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Specbot_chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {specbot_chatsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends specbot_chatsUpdateManyArgs>(args: SelectSubset<T, specbot_chatsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Specbot_chats and returns the data updated in the database.
     * @param {specbot_chatsUpdateManyAndReturnArgs} args - Arguments to update many Specbot_chats.
     * @example
     * // Update many Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Specbot_chats and only return the `id`
     * const specbot_chatsWithIdOnly = await prisma.specbot_chats.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends specbot_chatsUpdateManyAndReturnArgs>(args: SelectSubset<T, specbot_chatsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Specbot_chats.
     * @param {specbot_chatsUpsertArgs} args - Arguments to update or create a Specbot_chats.
     * @example
     * // Update or create a Specbot_chats
     * const specbot_chats = await prisma.specbot_chats.upsert({
     *   create: {
     *     // ... data to create a Specbot_chats
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Specbot_chats we want to update
     *   }
     * })
     */
    upsert<T extends specbot_chatsUpsertArgs>(args: SelectSubset<T, specbot_chatsUpsertArgs<ExtArgs>>): Prisma__specbot_chatsClient<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Specbot_chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {specbot_chatsCountArgs} args - Arguments to filter Specbot_chats to count.
     * @example
     * // Count the number of Specbot_chats
     * const count = await prisma.specbot_chats.count({
     *   where: {
     *     // ... the filter for the Specbot_chats we want to count
     *   }
     * })
    **/
    count<T extends specbot_chatsCountArgs>(
      args?: Subset<T, specbot_chatsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Specbot_chatsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Specbot_chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Specbot_chatsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Specbot_chatsAggregateArgs>(args: Subset<T, Specbot_chatsAggregateArgs>): Prisma.PrismaPromise<GetSpecbot_chatsAggregateType<T>>

    /**
     * Group by Specbot_chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {specbot_chatsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends specbot_chatsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: specbot_chatsGroupByArgs['orderBy'] }
        : { orderBy?: specbot_chatsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, specbot_chatsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpecbot_chatsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the specbot_chats model
   */
  readonly fields: specbot_chatsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for specbot_chats.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__specbot_chatsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends specbot_chats$projectsArgs<ExtArgs> = {}>(args?: Subset<T, specbot_chats$projectsArgs<ExtArgs>>): Prisma__projectsClient<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    users<T extends specbot_chats$usersArgs<ExtArgs> = {}>(args?: Subset<T, specbot_chats$usersArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the specbot_chats model
   */
  interface specbot_chatsFieldRefs {
    readonly id: FieldRef<"specbot_chats", 'String'>
    readonly title: FieldRef<"specbot_chats", 'String'>
    readonly created_at: FieldRef<"specbot_chats", 'DateTime'>
    readonly user_id: FieldRef<"specbot_chats", 'String'>
    readonly project_id: FieldRef<"specbot_chats", 'String'>
  }
    

  // Custom InputTypes
  /**
   * specbot_chats findUnique
   */
  export type specbot_chatsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    /**
     * Filter, which specbot_chats to fetch.
     */
    where: specbot_chatsWhereUniqueInput
  }

  /**
   * specbot_chats findUniqueOrThrow
   */
  export type specbot_chatsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    /**
     * Filter, which specbot_chats to fetch.
     */
    where: specbot_chatsWhereUniqueInput
  }

  /**
   * specbot_chats findFirst
   */
  export type specbot_chatsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    /**
     * Filter, which specbot_chats to fetch.
     */
    where?: specbot_chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of specbot_chats to fetch.
     */
    orderBy?: specbot_chatsOrderByWithRelationInput | specbot_chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for specbot_chats.
     */
    cursor?: specbot_chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` specbot_chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` specbot_chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of specbot_chats.
     */
    distinct?: Specbot_chatsScalarFieldEnum | Specbot_chatsScalarFieldEnum[]
  }

  /**
   * specbot_chats findFirstOrThrow
   */
  export type specbot_chatsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    /**
     * Filter, which specbot_chats to fetch.
     */
    where?: specbot_chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of specbot_chats to fetch.
     */
    orderBy?: specbot_chatsOrderByWithRelationInput | specbot_chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for specbot_chats.
     */
    cursor?: specbot_chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` specbot_chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` specbot_chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of specbot_chats.
     */
    distinct?: Specbot_chatsScalarFieldEnum | Specbot_chatsScalarFieldEnum[]
  }

  /**
   * specbot_chats findMany
   */
  export type specbot_chatsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    /**
     * Filter, which specbot_chats to fetch.
     */
    where?: specbot_chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of specbot_chats to fetch.
     */
    orderBy?: specbot_chatsOrderByWithRelationInput | specbot_chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing specbot_chats.
     */
    cursor?: specbot_chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` specbot_chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` specbot_chats.
     */
    skip?: number
    distinct?: Specbot_chatsScalarFieldEnum | Specbot_chatsScalarFieldEnum[]
  }

  /**
   * specbot_chats create
   */
  export type specbot_chatsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    /**
     * The data needed to create a specbot_chats.
     */
    data?: XOR<specbot_chatsCreateInput, specbot_chatsUncheckedCreateInput>
  }

  /**
   * specbot_chats createMany
   */
  export type specbot_chatsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many specbot_chats.
     */
    data: specbot_chatsCreateManyInput | specbot_chatsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * specbot_chats createManyAndReturn
   */
  export type specbot_chatsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * The data used to create many specbot_chats.
     */
    data: specbot_chatsCreateManyInput | specbot_chatsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * specbot_chats update
   */
  export type specbot_chatsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    /**
     * The data needed to update a specbot_chats.
     */
    data: XOR<specbot_chatsUpdateInput, specbot_chatsUncheckedUpdateInput>
    /**
     * Choose, which specbot_chats to update.
     */
    where: specbot_chatsWhereUniqueInput
  }

  /**
   * specbot_chats updateMany
   */
  export type specbot_chatsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update specbot_chats.
     */
    data: XOR<specbot_chatsUpdateManyMutationInput, specbot_chatsUncheckedUpdateManyInput>
    /**
     * Filter which specbot_chats to update
     */
    where?: specbot_chatsWhereInput
    /**
     * Limit how many specbot_chats to update.
     */
    limit?: number
  }

  /**
   * specbot_chats updateManyAndReturn
   */
  export type specbot_chatsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * The data used to update specbot_chats.
     */
    data: XOR<specbot_chatsUpdateManyMutationInput, specbot_chatsUncheckedUpdateManyInput>
    /**
     * Filter which specbot_chats to update
     */
    where?: specbot_chatsWhereInput
    /**
     * Limit how many specbot_chats to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * specbot_chats upsert
   */
  export type specbot_chatsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    /**
     * The filter to search for the specbot_chats to update in case it exists.
     */
    where: specbot_chatsWhereUniqueInput
    /**
     * In case the specbot_chats found by the `where` argument doesn't exist, create a new specbot_chats with this data.
     */
    create: XOR<specbot_chatsCreateInput, specbot_chatsUncheckedCreateInput>
    /**
     * In case the specbot_chats was found with the provided `where` argument, update it with this data.
     */
    update: XOR<specbot_chatsUpdateInput, specbot_chatsUncheckedUpdateInput>
  }

  /**
   * specbot_chats delete
   */
  export type specbot_chatsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    /**
     * Filter which specbot_chats to delete.
     */
    where: specbot_chatsWhereUniqueInput
  }

  /**
   * specbot_chats deleteMany
   */
  export type specbot_chatsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which specbot_chats to delete
     */
    where?: specbot_chatsWhereInput
    /**
     * Limit how many specbot_chats to delete.
     */
    limit?: number
  }

  /**
   * specbot_chats.projects
   */
  export type specbot_chats$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    where?: projectsWhereInput
  }

  /**
   * specbot_chats.users
   */
  export type specbot_chats$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
  }

  /**
   * specbot_chats without action
   */
  export type specbot_chatsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
  }


  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersMinAggregateOutputType = {
    id: string | null
    username: string | null
    password_hash: string | null
    role: string | null
    email: string | null
    profile_pic_url: string | null
    display_name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UsersMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password_hash: string | null
    role: string | null
    email: string | null
    profile_pic_url: string | null
    display_name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    username: number
    password_hash: number
    role: number
    permissions: number
    email: number
    profile_pic_url: number
    display_name: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UsersMinAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    role?: true
    email?: true
    profile_pic_url?: true
    display_name?: true
    created_at?: true
    updated_at?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    role?: true
    email?: true
    profile_pic_url?: true
    display_name?: true
    created_at?: true
    updated_at?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    role?: true
    permissions?: true
    email?: true
    profile_pic_url?: true
    display_name?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: string
    username: string
    password_hash: string
    role: string
    permissions: JsonValue | null
    email: string
    profile_pic_url: string | null
    display_name: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password_hash?: boolean
    role?: boolean
    permissions?: boolean
    email?: boolean
    profile_pic_url?: boolean
    display_name?: boolean
    created_at?: boolean
    updated_at?: boolean
    meetings?: boolean | users$meetingsArgs<ExtArgs>
    messages?: boolean | users$messagesArgs<ExtArgs>
    projects?: boolean | users$projectsArgs<ExtArgs>
    specbot_chats?: boolean | users$specbot_chatsArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password_hash?: boolean
    role?: boolean
    permissions?: boolean
    email?: boolean
    profile_pic_url?: boolean
    display_name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password_hash?: boolean
    role?: boolean
    permissions?: boolean
    email?: boolean
    profile_pic_url?: boolean
    display_name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectScalar = {
    id?: boolean
    username?: boolean
    password_hash?: boolean
    role?: boolean
    permissions?: boolean
    email?: boolean
    profile_pic_url?: boolean
    display_name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password_hash" | "role" | "permissions" | "email" | "profile_pic_url" | "display_name" | "created_at" | "updated_at", ExtArgs["result"]["users"]>
  export type usersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meetings?: boolean | users$meetingsArgs<ExtArgs>
    messages?: boolean | users$messagesArgs<ExtArgs>
    projects?: boolean | users$projectsArgs<ExtArgs>
    specbot_chats?: boolean | users$specbot_chatsArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type usersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type usersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {
      meetings: Prisma.$meetingsPayload<ExtArgs>[]
      messages: Prisma.$messagesPayload<ExtArgs>[]
      projects: Prisma.$projectsPayload<ExtArgs>[]
      specbot_chats: Prisma.$specbot_chatsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      password_hash: string
      role: string
      permissions: Prisma.JsonValue | null
      email: string
      profile_pic_url: string | null
      display_name: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {usersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(args?: SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {usersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(args: SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meetings<T extends users$meetingsArgs<ExtArgs> = {}>(args?: Subset<T, users$meetingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$meetingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends users$messagesArgs<ExtArgs> = {}>(args?: Subset<T, users$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projects<T extends users$projectsArgs<ExtArgs> = {}>(args?: Subset<T, users$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$projectsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    specbot_chats<T extends users$specbot_chatsArgs<ExtArgs> = {}>(args?: Subset<T, users$specbot_chatsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$specbot_chatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly id: FieldRef<"users", 'String'>
    readonly username: FieldRef<"users", 'String'>
    readonly password_hash: FieldRef<"users", 'String'>
    readonly role: FieldRef<"users", 'String'>
    readonly permissions: FieldRef<"users", 'Json'>
    readonly email: FieldRef<"users", 'String'>
    readonly profile_pic_url: FieldRef<"users", 'String'>
    readonly display_name: FieldRef<"users", 'String'>
    readonly created_at: FieldRef<"users", 'DateTime'>
    readonly updated_at: FieldRef<"users", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users createManyAndReturn
   */
  export type usersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users updateManyAndReturn
   */
  export type usersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users.meetings
   */
  export type users$meetingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the meetings
     */
    select?: meetingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the meetings
     */
    omit?: meetingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: meetingsInclude<ExtArgs> | null
    where?: meetingsWhereInput
    orderBy?: meetingsOrderByWithRelationInput | meetingsOrderByWithRelationInput[]
    cursor?: meetingsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MeetingsScalarFieldEnum | MeetingsScalarFieldEnum[]
  }

  /**
   * users.messages
   */
  export type users$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    where?: messagesWhereInput
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    cursor?: messagesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessagesScalarFieldEnum | MessagesScalarFieldEnum[]
  }

  /**
   * users.projects
   */
  export type users$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the projects
     */
    select?: projectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the projects
     */
    omit?: projectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectsInclude<ExtArgs> | null
    where?: projectsWhereInput
    orderBy?: projectsOrderByWithRelationInput | projectsOrderByWithRelationInput[]
    cursor?: projectsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectsScalarFieldEnum | ProjectsScalarFieldEnum[]
  }

  /**
   * users.specbot_chats
   */
  export type users$specbot_chatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the specbot_chats
     */
    select?: specbot_chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the specbot_chats
     */
    omit?: specbot_chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: specbot_chatsInclude<ExtArgs> | null
    where?: specbot_chatsWhereInput
    orderBy?: specbot_chatsOrderByWithRelationInput | specbot_chatsOrderByWithRelationInput[]
    cursor?: specbot_chatsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Specbot_chatsScalarFieldEnum | Specbot_chatsScalarFieldEnum[]
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const FeedbacksScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    status: 'status',
    form_structure: 'form_structure',
    response: 'response',
    created_at: 'created_at',
    project_id: 'project_id'
  };

  export type FeedbacksScalarFieldEnum = (typeof FeedbacksScalarFieldEnum)[keyof typeof FeedbacksScalarFieldEnum]


  export const Group_chatsScalarFieldEnum: {
    id: 'id',
    members: 'members',
    created_at: 'created_at',
    project_id: 'project_id'
  };

  export type Group_chatsScalarFieldEnum = (typeof Group_chatsScalarFieldEnum)[keyof typeof Group_chatsScalarFieldEnum]


  export const MeetingsScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    type: 'type',
    status: 'status',
    link: 'link',
    room_id: 'room_id',
    scheduled_at: 'scheduled_at',
    started_at: 'started_at',
    ended_at: 'ended_at',
    is_recurring: 'is_recurring',
    participants: 'participants',
    created_at: 'created_at',
    updated_at: 'updated_at',
    created_by: 'created_by',
    project_id: 'project_id'
  };

  export type MeetingsScalarFieldEnum = (typeof MeetingsScalarFieldEnum)[keyof typeof MeetingsScalarFieldEnum]


  export const MessagesScalarFieldEnum: {
    id: 'id',
    chat_type: 'chat_type',
    chat_id: 'chat_id',
    content: 'content',
    metadata: 'metadata',
    created_at: 'created_at',
    sender_id: 'sender_id'
  };

  export type MessagesScalarFieldEnum = (typeof MessagesScalarFieldEnum)[keyof typeof MessagesScalarFieldEnum]


  export const ProjectsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    cover_image_url: 'cover_image_url',
    icon_url: 'icon_url',
    status: 'status',
    start_date: 'start_date',
    end_date: 'end_date',
    tags: 'tags',
    members: 'members',
    created_at: 'created_at',
    updated_at: 'updated_at',
    created_by: 'created_by'
  };

  export type ProjectsScalarFieldEnum = (typeof ProjectsScalarFieldEnum)[keyof typeof ProjectsScalarFieldEnum]


  export const RecordingsScalarFieldEnum: {
    id: 'id',
    title: 'title',
    recording_url: 'recording_url',
    transcript_url: 'transcript_url',
    created_at: 'created_at',
    updated_at: 'updated_at',
    meeting_id: 'meeting_id'
  };

  export type RecordingsScalarFieldEnum = (typeof RecordingsScalarFieldEnum)[keyof typeof RecordingsScalarFieldEnum]


  export const RequirementsScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    priority: 'priority',
    status: 'status',
    metadata: 'metadata',
    created_at: 'created_at',
    updated_at: 'updated_at',
    project_id: 'project_id'
  };

  export type RequirementsScalarFieldEnum = (typeof RequirementsScalarFieldEnum)[keyof typeof RequirementsScalarFieldEnum]


  export const Specbot_chatsScalarFieldEnum: {
    id: 'id',
    title: 'title',
    created_at: 'created_at',
    user_id: 'user_id',
    project_id: 'project_id'
  };

  export type Specbot_chatsScalarFieldEnum = (typeof Specbot_chatsScalarFieldEnum)[keyof typeof Specbot_chatsScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password_hash: 'password_hash',
    role: 'role',
    permissions: 'permissions',
    email: 'email',
    profile_pic_url: 'profile_pic_url',
    display_name: 'display_name',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type feedbacksWhereInput = {
    AND?: feedbacksWhereInput | feedbacksWhereInput[]
    OR?: feedbacksWhereInput[]
    NOT?: feedbacksWhereInput | feedbacksWhereInput[]
    id?: UuidFilter<"feedbacks"> | string
    title?: StringNullableFilter<"feedbacks"> | string | null
    description?: StringNullableFilter<"feedbacks"> | string | null
    status?: StringNullableFilter<"feedbacks"> | string | null
    form_structure?: JsonNullableFilter<"feedbacks">
    response?: JsonNullableFilter<"feedbacks">
    created_at?: DateTimeNullableFilter<"feedbacks"> | Date | string | null
    project_id?: UuidNullableFilter<"feedbacks"> | string | null
    projects?: XOR<ProjectsNullableScalarRelationFilter, projectsWhereInput> | null
  }

  export type feedbacksOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    form_structure?: SortOrderInput | SortOrder
    response?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    project_id?: SortOrderInput | SortOrder
    projects?: projectsOrderByWithRelationInput
  }

  export type feedbacksWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: feedbacksWhereInput | feedbacksWhereInput[]
    OR?: feedbacksWhereInput[]
    NOT?: feedbacksWhereInput | feedbacksWhereInput[]
    title?: StringNullableFilter<"feedbacks"> | string | null
    description?: StringNullableFilter<"feedbacks"> | string | null
    status?: StringNullableFilter<"feedbacks"> | string | null
    form_structure?: JsonNullableFilter<"feedbacks">
    response?: JsonNullableFilter<"feedbacks">
    created_at?: DateTimeNullableFilter<"feedbacks"> | Date | string | null
    project_id?: UuidNullableFilter<"feedbacks"> | string | null
    projects?: XOR<ProjectsNullableScalarRelationFilter, projectsWhereInput> | null
  }, "id">

  export type feedbacksOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    form_structure?: SortOrderInput | SortOrder
    response?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    project_id?: SortOrderInput | SortOrder
    _count?: feedbacksCountOrderByAggregateInput
    _max?: feedbacksMaxOrderByAggregateInput
    _min?: feedbacksMinOrderByAggregateInput
  }

  export type feedbacksScalarWhereWithAggregatesInput = {
    AND?: feedbacksScalarWhereWithAggregatesInput | feedbacksScalarWhereWithAggregatesInput[]
    OR?: feedbacksScalarWhereWithAggregatesInput[]
    NOT?: feedbacksScalarWhereWithAggregatesInput | feedbacksScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"feedbacks"> | string
    title?: StringNullableWithAggregatesFilter<"feedbacks"> | string | null
    description?: StringNullableWithAggregatesFilter<"feedbacks"> | string | null
    status?: StringNullableWithAggregatesFilter<"feedbacks"> | string | null
    form_structure?: JsonNullableWithAggregatesFilter<"feedbacks">
    response?: JsonNullableWithAggregatesFilter<"feedbacks">
    created_at?: DateTimeNullableWithAggregatesFilter<"feedbacks"> | Date | string | null
    project_id?: UuidNullableWithAggregatesFilter<"feedbacks"> | string | null
  }

  export type group_chatsWhereInput = {
    AND?: group_chatsWhereInput | group_chatsWhereInput[]
    OR?: group_chatsWhereInput[]
    NOT?: group_chatsWhereInput | group_chatsWhereInput[]
    id?: UuidFilter<"group_chats"> | string
    members?: JsonNullableFilter<"group_chats">
    created_at?: DateTimeNullableFilter<"group_chats"> | Date | string | null
    project_id?: UuidNullableFilter<"group_chats"> | string | null
    projects?: XOR<ProjectsNullableScalarRelationFilter, projectsWhereInput> | null
  }

  export type group_chatsOrderByWithRelationInput = {
    id?: SortOrder
    members?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    project_id?: SortOrderInput | SortOrder
    projects?: projectsOrderByWithRelationInput
  }

  export type group_chatsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    project_id?: string
    AND?: group_chatsWhereInput | group_chatsWhereInput[]
    OR?: group_chatsWhereInput[]
    NOT?: group_chatsWhereInput | group_chatsWhereInput[]
    members?: JsonNullableFilter<"group_chats">
    created_at?: DateTimeNullableFilter<"group_chats"> | Date | string | null
    projects?: XOR<ProjectsNullableScalarRelationFilter, projectsWhereInput> | null
  }, "id" | "project_id">

  export type group_chatsOrderByWithAggregationInput = {
    id?: SortOrder
    members?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    project_id?: SortOrderInput | SortOrder
    _count?: group_chatsCountOrderByAggregateInput
    _max?: group_chatsMaxOrderByAggregateInput
    _min?: group_chatsMinOrderByAggregateInput
  }

  export type group_chatsScalarWhereWithAggregatesInput = {
    AND?: group_chatsScalarWhereWithAggregatesInput | group_chatsScalarWhereWithAggregatesInput[]
    OR?: group_chatsScalarWhereWithAggregatesInput[]
    NOT?: group_chatsScalarWhereWithAggregatesInput | group_chatsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"group_chats"> | string
    members?: JsonNullableWithAggregatesFilter<"group_chats">
    created_at?: DateTimeNullableWithAggregatesFilter<"group_chats"> | Date | string | null
    project_id?: UuidNullableWithAggregatesFilter<"group_chats"> | string | null
  }

  export type meetingsWhereInput = {
    AND?: meetingsWhereInput | meetingsWhereInput[]
    OR?: meetingsWhereInput[]
    NOT?: meetingsWhereInput | meetingsWhereInput[]
    id?: UuidFilter<"meetings"> | string
    title?: StringNullableFilter<"meetings"> | string | null
    description?: StringNullableFilter<"meetings"> | string | null
    type?: StringNullableFilter<"meetings"> | string | null
    status?: StringNullableFilter<"meetings"> | string | null
    link?: StringNullableFilter<"meetings"> | string | null
    room_id?: StringNullableFilter<"meetings"> | string | null
    scheduled_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    started_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    ended_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    is_recurring?: BoolNullableFilter<"meetings"> | boolean | null
    participants?: JsonNullableFilter<"meetings">
    created_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    created_by?: UuidNullableFilter<"meetings"> | string | null
    project_id?: UuidNullableFilter<"meetings"> | string | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
    projects?: XOR<ProjectsNullableScalarRelationFilter, projectsWhereInput> | null
    recordings?: RecordingsListRelationFilter
  }

  export type meetingsOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    link?: SortOrderInput | SortOrder
    room_id?: SortOrderInput | SortOrder
    scheduled_at?: SortOrderInput | SortOrder
    started_at?: SortOrderInput | SortOrder
    ended_at?: SortOrderInput | SortOrder
    is_recurring?: SortOrderInput | SortOrder
    participants?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    project_id?: SortOrderInput | SortOrder
    users?: usersOrderByWithRelationInput
    projects?: projectsOrderByWithRelationInput
    recordings?: recordingsOrderByRelationAggregateInput
  }

  export type meetingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: meetingsWhereInput | meetingsWhereInput[]
    OR?: meetingsWhereInput[]
    NOT?: meetingsWhereInput | meetingsWhereInput[]
    title?: StringNullableFilter<"meetings"> | string | null
    description?: StringNullableFilter<"meetings"> | string | null
    type?: StringNullableFilter<"meetings"> | string | null
    status?: StringNullableFilter<"meetings"> | string | null
    link?: StringNullableFilter<"meetings"> | string | null
    room_id?: StringNullableFilter<"meetings"> | string | null
    scheduled_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    started_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    ended_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    is_recurring?: BoolNullableFilter<"meetings"> | boolean | null
    participants?: JsonNullableFilter<"meetings">
    created_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    created_by?: UuidNullableFilter<"meetings"> | string | null
    project_id?: UuidNullableFilter<"meetings"> | string | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
    projects?: XOR<ProjectsNullableScalarRelationFilter, projectsWhereInput> | null
    recordings?: RecordingsListRelationFilter
  }, "id">

  export type meetingsOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    link?: SortOrderInput | SortOrder
    room_id?: SortOrderInput | SortOrder
    scheduled_at?: SortOrderInput | SortOrder
    started_at?: SortOrderInput | SortOrder
    ended_at?: SortOrderInput | SortOrder
    is_recurring?: SortOrderInput | SortOrder
    participants?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    project_id?: SortOrderInput | SortOrder
    _count?: meetingsCountOrderByAggregateInput
    _max?: meetingsMaxOrderByAggregateInput
    _min?: meetingsMinOrderByAggregateInput
  }

  export type meetingsScalarWhereWithAggregatesInput = {
    AND?: meetingsScalarWhereWithAggregatesInput | meetingsScalarWhereWithAggregatesInput[]
    OR?: meetingsScalarWhereWithAggregatesInput[]
    NOT?: meetingsScalarWhereWithAggregatesInput | meetingsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"meetings"> | string
    title?: StringNullableWithAggregatesFilter<"meetings"> | string | null
    description?: StringNullableWithAggregatesFilter<"meetings"> | string | null
    type?: StringNullableWithAggregatesFilter<"meetings"> | string | null
    status?: StringNullableWithAggregatesFilter<"meetings"> | string | null
    link?: StringNullableWithAggregatesFilter<"meetings"> | string | null
    room_id?: StringNullableWithAggregatesFilter<"meetings"> | string | null
    scheduled_at?: DateTimeNullableWithAggregatesFilter<"meetings"> | Date | string | null
    started_at?: DateTimeNullableWithAggregatesFilter<"meetings"> | Date | string | null
    ended_at?: DateTimeNullableWithAggregatesFilter<"meetings"> | Date | string | null
    is_recurring?: BoolNullableWithAggregatesFilter<"meetings"> | boolean | null
    participants?: JsonNullableWithAggregatesFilter<"meetings">
    created_at?: DateTimeNullableWithAggregatesFilter<"meetings"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"meetings"> | Date | string | null
    created_by?: UuidNullableWithAggregatesFilter<"meetings"> | string | null
    project_id?: UuidNullableWithAggregatesFilter<"meetings"> | string | null
  }

  export type messagesWhereInput = {
    AND?: messagesWhereInput | messagesWhereInput[]
    OR?: messagesWhereInput[]
    NOT?: messagesWhereInput | messagesWhereInput[]
    id?: UuidFilter<"messages"> | string
    chat_type?: StringFilter<"messages"> | string
    chat_id?: UuidFilter<"messages"> | string
    content?: StringFilter<"messages"> | string
    metadata?: JsonNullableFilter<"messages">
    created_at?: DateTimeNullableFilter<"messages"> | Date | string | null
    sender_id?: UuidNullableFilter<"messages"> | string | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }

  export type messagesOrderByWithRelationInput = {
    id?: SortOrder
    chat_type?: SortOrder
    chat_id?: SortOrder
    content?: SortOrder
    metadata?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    sender_id?: SortOrderInput | SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type messagesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: messagesWhereInput | messagesWhereInput[]
    OR?: messagesWhereInput[]
    NOT?: messagesWhereInput | messagesWhereInput[]
    chat_type?: StringFilter<"messages"> | string
    chat_id?: UuidFilter<"messages"> | string
    content?: StringFilter<"messages"> | string
    metadata?: JsonNullableFilter<"messages">
    created_at?: DateTimeNullableFilter<"messages"> | Date | string | null
    sender_id?: UuidNullableFilter<"messages"> | string | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }, "id">

  export type messagesOrderByWithAggregationInput = {
    id?: SortOrder
    chat_type?: SortOrder
    chat_id?: SortOrder
    content?: SortOrder
    metadata?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    sender_id?: SortOrderInput | SortOrder
    _count?: messagesCountOrderByAggregateInput
    _max?: messagesMaxOrderByAggregateInput
    _min?: messagesMinOrderByAggregateInput
  }

  export type messagesScalarWhereWithAggregatesInput = {
    AND?: messagesScalarWhereWithAggregatesInput | messagesScalarWhereWithAggregatesInput[]
    OR?: messagesScalarWhereWithAggregatesInput[]
    NOT?: messagesScalarWhereWithAggregatesInput | messagesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"messages"> | string
    chat_type?: StringWithAggregatesFilter<"messages"> | string
    chat_id?: UuidWithAggregatesFilter<"messages"> | string
    content?: StringWithAggregatesFilter<"messages"> | string
    metadata?: JsonNullableWithAggregatesFilter<"messages">
    created_at?: DateTimeNullableWithAggregatesFilter<"messages"> | Date | string | null
    sender_id?: UuidNullableWithAggregatesFilter<"messages"> | string | null
  }

  export type projectsWhereInput = {
    AND?: projectsWhereInput | projectsWhereInput[]
    OR?: projectsWhereInput[]
    NOT?: projectsWhereInput | projectsWhereInput[]
    id?: UuidFilter<"projects"> | string
    name?: StringFilter<"projects"> | string
    slug?: StringFilter<"projects"> | string
    description?: StringNullableFilter<"projects"> | string | null
    cover_image_url?: StringNullableFilter<"projects"> | string | null
    icon_url?: StringNullableFilter<"projects"> | string | null
    status?: StringNullableFilter<"projects"> | string | null
    start_date?: DateTimeNullableFilter<"projects"> | Date | string | null
    end_date?: DateTimeNullableFilter<"projects"> | Date | string | null
    tags?: JsonNullableFilter<"projects">
    members?: JsonNullableFilter<"projects">
    created_at?: DateTimeNullableFilter<"projects"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"projects"> | Date | string | null
    created_by?: UuidNullableFilter<"projects"> | string | null
    feedbacks?: FeedbacksListRelationFilter
    group_chats?: XOR<Group_chatsNullableScalarRelationFilter, group_chatsWhereInput> | null
    meetings?: MeetingsListRelationFilter
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
    requirements?: RequirementsListRelationFilter
    specbot_chats?: Specbot_chatsListRelationFilter
  }

  export type projectsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    cover_image_url?: SortOrderInput | SortOrder
    icon_url?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    start_date?: SortOrderInput | SortOrder
    end_date?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    members?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    feedbacks?: feedbacksOrderByRelationAggregateInput
    group_chats?: group_chatsOrderByWithRelationInput
    meetings?: meetingsOrderByRelationAggregateInput
    users?: usersOrderByWithRelationInput
    requirements?: requirementsOrderByRelationAggregateInput
    specbot_chats?: specbot_chatsOrderByRelationAggregateInput
  }

  export type projectsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: projectsWhereInput | projectsWhereInput[]
    OR?: projectsWhereInput[]
    NOT?: projectsWhereInput | projectsWhereInput[]
    name?: StringFilter<"projects"> | string
    description?: StringNullableFilter<"projects"> | string | null
    cover_image_url?: StringNullableFilter<"projects"> | string | null
    icon_url?: StringNullableFilter<"projects"> | string | null
    status?: StringNullableFilter<"projects"> | string | null
    start_date?: DateTimeNullableFilter<"projects"> | Date | string | null
    end_date?: DateTimeNullableFilter<"projects"> | Date | string | null
    tags?: JsonNullableFilter<"projects">
    members?: JsonNullableFilter<"projects">
    created_at?: DateTimeNullableFilter<"projects"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"projects"> | Date | string | null
    created_by?: UuidNullableFilter<"projects"> | string | null
    feedbacks?: FeedbacksListRelationFilter
    group_chats?: XOR<Group_chatsNullableScalarRelationFilter, group_chatsWhereInput> | null
    meetings?: MeetingsListRelationFilter
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
    requirements?: RequirementsListRelationFilter
    specbot_chats?: Specbot_chatsListRelationFilter
  }, "id" | "slug">

  export type projectsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    cover_image_url?: SortOrderInput | SortOrder
    icon_url?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    start_date?: SortOrderInput | SortOrder
    end_date?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    members?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    _count?: projectsCountOrderByAggregateInput
    _max?: projectsMaxOrderByAggregateInput
    _min?: projectsMinOrderByAggregateInput
  }

  export type projectsScalarWhereWithAggregatesInput = {
    AND?: projectsScalarWhereWithAggregatesInput | projectsScalarWhereWithAggregatesInput[]
    OR?: projectsScalarWhereWithAggregatesInput[]
    NOT?: projectsScalarWhereWithAggregatesInput | projectsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"projects"> | string
    name?: StringWithAggregatesFilter<"projects"> | string
    slug?: StringWithAggregatesFilter<"projects"> | string
    description?: StringNullableWithAggregatesFilter<"projects"> | string | null
    cover_image_url?: StringNullableWithAggregatesFilter<"projects"> | string | null
    icon_url?: StringNullableWithAggregatesFilter<"projects"> | string | null
    status?: StringNullableWithAggregatesFilter<"projects"> | string | null
    start_date?: DateTimeNullableWithAggregatesFilter<"projects"> | Date | string | null
    end_date?: DateTimeNullableWithAggregatesFilter<"projects"> | Date | string | null
    tags?: JsonNullableWithAggregatesFilter<"projects">
    members?: JsonNullableWithAggregatesFilter<"projects">
    created_at?: DateTimeNullableWithAggregatesFilter<"projects"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"projects"> | Date | string | null
    created_by?: UuidNullableWithAggregatesFilter<"projects"> | string | null
  }

  export type recordingsWhereInput = {
    AND?: recordingsWhereInput | recordingsWhereInput[]
    OR?: recordingsWhereInput[]
    NOT?: recordingsWhereInput | recordingsWhereInput[]
    id?: UuidFilter<"recordings"> | string
    title?: StringNullableFilter<"recordings"> | string | null
    recording_url?: StringNullableFilter<"recordings"> | string | null
    transcript_url?: StringNullableFilter<"recordings"> | string | null
    created_at?: DateTimeNullableFilter<"recordings"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"recordings"> | Date | string | null
    meeting_id?: UuidNullableFilter<"recordings"> | string | null
    meetings?: XOR<MeetingsNullableScalarRelationFilter, meetingsWhereInput> | null
  }

  export type recordingsOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    recording_url?: SortOrderInput | SortOrder
    transcript_url?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    meeting_id?: SortOrderInput | SortOrder
    meetings?: meetingsOrderByWithRelationInput
  }

  export type recordingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: recordingsWhereInput | recordingsWhereInput[]
    OR?: recordingsWhereInput[]
    NOT?: recordingsWhereInput | recordingsWhereInput[]
    title?: StringNullableFilter<"recordings"> | string | null
    recording_url?: StringNullableFilter<"recordings"> | string | null
    transcript_url?: StringNullableFilter<"recordings"> | string | null
    created_at?: DateTimeNullableFilter<"recordings"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"recordings"> | Date | string | null
    meeting_id?: UuidNullableFilter<"recordings"> | string | null
    meetings?: XOR<MeetingsNullableScalarRelationFilter, meetingsWhereInput> | null
  }, "id">

  export type recordingsOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    recording_url?: SortOrderInput | SortOrder
    transcript_url?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    meeting_id?: SortOrderInput | SortOrder
    _count?: recordingsCountOrderByAggregateInput
    _max?: recordingsMaxOrderByAggregateInput
    _min?: recordingsMinOrderByAggregateInput
  }

  export type recordingsScalarWhereWithAggregatesInput = {
    AND?: recordingsScalarWhereWithAggregatesInput | recordingsScalarWhereWithAggregatesInput[]
    OR?: recordingsScalarWhereWithAggregatesInput[]
    NOT?: recordingsScalarWhereWithAggregatesInput | recordingsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"recordings"> | string
    title?: StringNullableWithAggregatesFilter<"recordings"> | string | null
    recording_url?: StringNullableWithAggregatesFilter<"recordings"> | string | null
    transcript_url?: StringNullableWithAggregatesFilter<"recordings"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"recordings"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"recordings"> | Date | string | null
    meeting_id?: UuidNullableWithAggregatesFilter<"recordings"> | string | null
  }

  export type requirementsWhereInput = {
    AND?: requirementsWhereInput | requirementsWhereInput[]
    OR?: requirementsWhereInput[]
    NOT?: requirementsWhereInput | requirementsWhereInput[]
    id?: UuidFilter<"requirements"> | string
    title?: StringFilter<"requirements"> | string
    description?: StringNullableFilter<"requirements"> | string | null
    priority?: StringNullableFilter<"requirements"> | string | null
    status?: StringNullableFilter<"requirements"> | string | null
    metadata?: JsonNullableFilter<"requirements">
    created_at?: DateTimeNullableFilter<"requirements"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"requirements"> | Date | string | null
    project_id?: UuidNullableFilter<"requirements"> | string | null
    projects?: XOR<ProjectsNullableScalarRelationFilter, projectsWhereInput> | null
  }

  export type requirementsOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    project_id?: SortOrderInput | SortOrder
    projects?: projectsOrderByWithRelationInput
  }

  export type requirementsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: requirementsWhereInput | requirementsWhereInput[]
    OR?: requirementsWhereInput[]
    NOT?: requirementsWhereInput | requirementsWhereInput[]
    title?: StringFilter<"requirements"> | string
    description?: StringNullableFilter<"requirements"> | string | null
    priority?: StringNullableFilter<"requirements"> | string | null
    status?: StringNullableFilter<"requirements"> | string | null
    metadata?: JsonNullableFilter<"requirements">
    created_at?: DateTimeNullableFilter<"requirements"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"requirements"> | Date | string | null
    project_id?: UuidNullableFilter<"requirements"> | string | null
    projects?: XOR<ProjectsNullableScalarRelationFilter, projectsWhereInput> | null
  }, "id">

  export type requirementsOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    project_id?: SortOrderInput | SortOrder
    _count?: requirementsCountOrderByAggregateInput
    _max?: requirementsMaxOrderByAggregateInput
    _min?: requirementsMinOrderByAggregateInput
  }

  export type requirementsScalarWhereWithAggregatesInput = {
    AND?: requirementsScalarWhereWithAggregatesInput | requirementsScalarWhereWithAggregatesInput[]
    OR?: requirementsScalarWhereWithAggregatesInput[]
    NOT?: requirementsScalarWhereWithAggregatesInput | requirementsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"requirements"> | string
    title?: StringWithAggregatesFilter<"requirements"> | string
    description?: StringNullableWithAggregatesFilter<"requirements"> | string | null
    priority?: StringNullableWithAggregatesFilter<"requirements"> | string | null
    status?: StringNullableWithAggregatesFilter<"requirements"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"requirements">
    created_at?: DateTimeNullableWithAggregatesFilter<"requirements"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"requirements"> | Date | string | null
    project_id?: UuidNullableWithAggregatesFilter<"requirements"> | string | null
  }

  export type specbot_chatsWhereInput = {
    AND?: specbot_chatsWhereInput | specbot_chatsWhereInput[]
    OR?: specbot_chatsWhereInput[]
    NOT?: specbot_chatsWhereInput | specbot_chatsWhereInput[]
    id?: UuidFilter<"specbot_chats"> | string
    title?: StringNullableFilter<"specbot_chats"> | string | null
    created_at?: DateTimeNullableFilter<"specbot_chats"> | Date | string | null
    user_id?: UuidNullableFilter<"specbot_chats"> | string | null
    project_id?: UuidNullableFilter<"specbot_chats"> | string | null
    projects?: XOR<ProjectsNullableScalarRelationFilter, projectsWhereInput> | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }

  export type specbot_chatsOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    project_id?: SortOrderInput | SortOrder
    projects?: projectsOrderByWithRelationInput
    users?: usersOrderByWithRelationInput
  }

  export type specbot_chatsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: specbot_chatsWhereInput | specbot_chatsWhereInput[]
    OR?: specbot_chatsWhereInput[]
    NOT?: specbot_chatsWhereInput | specbot_chatsWhereInput[]
    title?: StringNullableFilter<"specbot_chats"> | string | null
    created_at?: DateTimeNullableFilter<"specbot_chats"> | Date | string | null
    user_id?: UuidNullableFilter<"specbot_chats"> | string | null
    project_id?: UuidNullableFilter<"specbot_chats"> | string | null
    projects?: XOR<ProjectsNullableScalarRelationFilter, projectsWhereInput> | null
    users?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
  }, "id">

  export type specbot_chatsOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    project_id?: SortOrderInput | SortOrder
    _count?: specbot_chatsCountOrderByAggregateInput
    _max?: specbot_chatsMaxOrderByAggregateInput
    _min?: specbot_chatsMinOrderByAggregateInput
  }

  export type specbot_chatsScalarWhereWithAggregatesInput = {
    AND?: specbot_chatsScalarWhereWithAggregatesInput | specbot_chatsScalarWhereWithAggregatesInput[]
    OR?: specbot_chatsScalarWhereWithAggregatesInput[]
    NOT?: specbot_chatsScalarWhereWithAggregatesInput | specbot_chatsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"specbot_chats"> | string
    title?: StringNullableWithAggregatesFilter<"specbot_chats"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"specbot_chats"> | Date | string | null
    user_id?: UuidNullableWithAggregatesFilter<"specbot_chats"> | string | null
    project_id?: UuidNullableWithAggregatesFilter<"specbot_chats"> | string | null
  }

  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    id?: UuidFilter<"users"> | string
    username?: StringFilter<"users"> | string
    password_hash?: StringFilter<"users"> | string
    role?: StringFilter<"users"> | string
    permissions?: JsonNullableFilter<"users">
    email?: StringFilter<"users"> | string
    profile_pic_url?: StringNullableFilter<"users"> | string | null
    display_name?: StringNullableFilter<"users"> | string | null
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"users"> | Date | string | null
    meetings?: MeetingsListRelationFilter
    messages?: MessagesListRelationFilter
    projects?: ProjectsListRelationFilter
    specbot_chats?: Specbot_chatsListRelationFilter
  }

  export type usersOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    permissions?: SortOrderInput | SortOrder
    email?: SortOrder
    profile_pic_url?: SortOrderInput | SortOrder
    display_name?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    meetings?: meetingsOrderByRelationAggregateInput
    messages?: messagesOrderByRelationAggregateInput
    projects?: projectsOrderByRelationAggregateInput
    specbot_chats?: specbot_chatsOrderByRelationAggregateInput
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    password_hash?: StringFilter<"users"> | string
    role?: StringFilter<"users"> | string
    permissions?: JsonNullableFilter<"users">
    profile_pic_url?: StringNullableFilter<"users"> | string | null
    display_name?: StringNullableFilter<"users"> | string | null
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"users"> | Date | string | null
    meetings?: MeetingsListRelationFilter
    messages?: MessagesListRelationFilter
    projects?: ProjectsListRelationFilter
    specbot_chats?: Specbot_chatsListRelationFilter
  }, "id" | "username" | "email">

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    permissions?: SortOrderInput | SortOrder
    email?: SortOrder
    profile_pic_url?: SortOrderInput | SortOrder
    display_name?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: usersCountOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"users"> | string
    username?: StringWithAggregatesFilter<"users"> | string
    password_hash?: StringWithAggregatesFilter<"users"> | string
    role?: StringWithAggregatesFilter<"users"> | string
    permissions?: JsonNullableWithAggregatesFilter<"users">
    email?: StringWithAggregatesFilter<"users"> | string
    profile_pic_url?: StringNullableWithAggregatesFilter<"users"> | string | null
    display_name?: StringNullableWithAggregatesFilter<"users"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
  }

  export type feedbacksCreateInput = {
    id?: string
    title?: string | null
    description?: string | null
    status?: string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    projects?: projectsCreateNestedOneWithoutFeedbacksInput
  }

  export type feedbacksUncheckedCreateInput = {
    id?: string
    title?: string | null
    description?: string | null
    status?: string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    project_id?: string | null
  }

  export type feedbacksUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projects?: projectsUpdateOneWithoutFeedbacksNestedInput
  }

  export type feedbacksUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type feedbacksCreateManyInput = {
    id?: string
    title?: string | null
    description?: string | null
    status?: string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    project_id?: string | null
  }

  export type feedbacksUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type feedbacksUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type group_chatsCreateInput = {
    id?: string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    projects?: projectsCreateNestedOneWithoutGroup_chatsInput
  }

  export type group_chatsUncheckedCreateInput = {
    id?: string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    project_id?: string | null
  }

  export type group_chatsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projects?: projectsUpdateOneWithoutGroup_chatsNestedInput
  }

  export type group_chatsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type group_chatsCreateManyInput = {
    id?: string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    project_id?: string | null
  }

  export type group_chatsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type group_chatsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type meetingsCreateInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    users?: usersCreateNestedOneWithoutMeetingsInput
    projects?: projectsCreateNestedOneWithoutMeetingsInput
    recordings?: recordingsCreateNestedManyWithoutMeetingsInput
  }

  export type meetingsUncheckedCreateInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
    project_id?: string | null
    recordings?: recordingsUncheckedCreateNestedManyWithoutMeetingsInput
  }

  export type meetingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneWithoutMeetingsNestedInput
    projects?: projectsUpdateOneWithoutMeetingsNestedInput
    recordings?: recordingsUpdateManyWithoutMeetingsNestedInput
  }

  export type meetingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
    recordings?: recordingsUncheckedUpdateManyWithoutMeetingsNestedInput
  }

  export type meetingsCreateManyInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
    project_id?: string | null
  }

  export type meetingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type meetingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type messagesCreateInput = {
    id?: string
    chat_type: string
    chat_id: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    users?: usersCreateNestedOneWithoutMessagesInput
  }

  export type messagesUncheckedCreateInput = {
    id?: string
    chat_type: string
    chat_id: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    sender_id?: string | null
  }

  export type messagesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chat_type?: StringFieldUpdateOperationsInput | string
    chat_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneWithoutMessagesNestedInput
  }

  export type messagesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chat_type?: StringFieldUpdateOperationsInput | string
    chat_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sender_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type messagesCreateManyInput = {
    id?: string
    chat_type: string
    chat_id: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    sender_id?: string | null
  }

  export type messagesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    chat_type?: StringFieldUpdateOperationsInput | string
    chat_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type messagesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chat_type?: StringFieldUpdateOperationsInput | string
    chat_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sender_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type projectsCreateInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    feedbacks?: feedbacksCreateNestedManyWithoutProjectsInput
    group_chats?: group_chatsCreateNestedOneWithoutProjectsInput
    meetings?: meetingsCreateNestedManyWithoutProjectsInput
    users?: usersCreateNestedOneWithoutProjectsInput
    requirements?: requirementsCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsCreateNestedManyWithoutProjectsInput
  }

  export type projectsUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
    feedbacks?: feedbacksUncheckedCreateNestedManyWithoutProjectsInput
    group_chats?: group_chatsUncheckedCreateNestedOneWithoutProjectsInput
    meetings?: meetingsUncheckedCreateNestedManyWithoutProjectsInput
    requirements?: requirementsUncheckedCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsUncheckedCreateNestedManyWithoutProjectsInput
  }

  export type projectsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedbacks?: feedbacksUpdateManyWithoutProjectsNestedInput
    group_chats?: group_chatsUpdateOneWithoutProjectsNestedInput
    meetings?: meetingsUpdateManyWithoutProjectsNestedInput
    users?: usersUpdateOneWithoutProjectsNestedInput
    requirements?: requirementsUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUpdateManyWithoutProjectsNestedInput
  }

  export type projectsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    feedbacks?: feedbacksUncheckedUpdateManyWithoutProjectsNestedInput
    group_chats?: group_chatsUncheckedUpdateOneWithoutProjectsNestedInput
    meetings?: meetingsUncheckedUpdateManyWithoutProjectsNestedInput
    requirements?: requirementsUncheckedUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUncheckedUpdateManyWithoutProjectsNestedInput
  }

  export type projectsCreateManyInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
  }

  export type projectsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type projectsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type recordingsCreateInput = {
    id?: string
    title?: string | null
    recording_url?: string | null
    transcript_url?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meetings?: meetingsCreateNestedOneWithoutRecordingsInput
  }

  export type recordingsUncheckedCreateInput = {
    id?: string
    title?: string | null
    recording_url?: string | null
    transcript_url?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meeting_id?: string | null
  }

  export type recordingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    recording_url?: NullableStringFieldUpdateOperationsInput | string | null
    transcript_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetings?: meetingsUpdateOneWithoutRecordingsNestedInput
  }

  export type recordingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    recording_url?: NullableStringFieldUpdateOperationsInput | string | null
    transcript_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meeting_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type recordingsCreateManyInput = {
    id?: string
    title?: string | null
    recording_url?: string | null
    transcript_url?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meeting_id?: string | null
  }

  export type recordingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    recording_url?: NullableStringFieldUpdateOperationsInput | string | null
    transcript_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type recordingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    recording_url?: NullableStringFieldUpdateOperationsInput | string | null
    transcript_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meeting_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type requirementsCreateInput = {
    id?: string
    title: string
    description?: string | null
    priority?: string | null
    status?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    projects?: projectsCreateNestedOneWithoutRequirementsInput
  }

  export type requirementsUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    priority?: string | null
    status?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    project_id?: string | null
  }

  export type requirementsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projects?: projectsUpdateOneWithoutRequirementsNestedInput
  }

  export type requirementsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type requirementsCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    priority?: string | null
    status?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    project_id?: string | null
  }

  export type requirementsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type requirementsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type specbot_chatsCreateInput = {
    id?: string
    title?: string | null
    created_at?: Date | string | null
    projects?: projectsCreateNestedOneWithoutSpecbot_chatsInput
    users?: usersCreateNestedOneWithoutSpecbot_chatsInput
  }

  export type specbot_chatsUncheckedCreateInput = {
    id?: string
    title?: string | null
    created_at?: Date | string | null
    user_id?: string | null
    project_id?: string | null
  }

  export type specbot_chatsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projects?: projectsUpdateOneWithoutSpecbot_chatsNestedInput
    users?: usersUpdateOneWithoutSpecbot_chatsNestedInput
  }

  export type specbot_chatsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type specbot_chatsCreateManyInput = {
    id?: string
    title?: string | null
    created_at?: Date | string | null
    user_id?: string | null
    project_id?: string | null
  }

  export type specbot_chatsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type specbot_chatsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type usersCreateInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meetings?: meetingsCreateNestedManyWithoutUsersInput
    messages?: messagesCreateNestedManyWithoutUsersInput
    projects?: projectsCreateNestedManyWithoutUsersInput
    specbot_chats?: specbot_chatsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meetings?: meetingsUncheckedCreateNestedManyWithoutUsersInput
    messages?: messagesUncheckedCreateNestedManyWithoutUsersInput
    projects?: projectsUncheckedCreateNestedManyWithoutUsersInput
    specbot_chats?: specbot_chatsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetings?: meetingsUpdateManyWithoutUsersNestedInput
    messages?: messagesUpdateManyWithoutUsersNestedInput
    projects?: projectsUpdateManyWithoutUsersNestedInput
    specbot_chats?: specbot_chatsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetings?: meetingsUncheckedUpdateManyWithoutUsersNestedInput
    messages?: messagesUncheckedUpdateManyWithoutUsersNestedInput
    projects?: projectsUncheckedUpdateManyWithoutUsersNestedInput
    specbot_chats?: specbot_chatsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateManyInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type usersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type ProjectsNullableScalarRelationFilter = {
    is?: projectsWhereInput | null
    isNot?: projectsWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type feedbacksCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    form_structure?: SortOrder
    response?: SortOrder
    created_at?: SortOrder
    project_id?: SortOrder
  }

  export type feedbacksMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    project_id?: SortOrder
  }

  export type feedbacksMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    project_id?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type group_chatsCountOrderByAggregateInput = {
    id?: SortOrder
    members?: SortOrder
    created_at?: SortOrder
    project_id?: SortOrder
  }

  export type group_chatsMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    project_id?: SortOrder
  }

  export type group_chatsMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    project_id?: SortOrder
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type UsersNullableScalarRelationFilter = {
    is?: usersWhereInput | null
    isNot?: usersWhereInput | null
  }

  export type RecordingsListRelationFilter = {
    every?: recordingsWhereInput
    some?: recordingsWhereInput
    none?: recordingsWhereInput
  }

  export type recordingsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type meetingsCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    link?: SortOrder
    room_id?: SortOrder
    scheduled_at?: SortOrder
    started_at?: SortOrder
    ended_at?: SortOrder
    is_recurring?: SortOrder
    participants?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
    project_id?: SortOrder
  }

  export type meetingsMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    link?: SortOrder
    room_id?: SortOrder
    scheduled_at?: SortOrder
    started_at?: SortOrder
    ended_at?: SortOrder
    is_recurring?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
    project_id?: SortOrder
  }

  export type meetingsMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    link?: SortOrder
    room_id?: SortOrder
    scheduled_at?: SortOrder
    started_at?: SortOrder
    ended_at?: SortOrder
    is_recurring?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
    project_id?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type messagesCountOrderByAggregateInput = {
    id?: SortOrder
    chat_type?: SortOrder
    chat_id?: SortOrder
    content?: SortOrder
    metadata?: SortOrder
    created_at?: SortOrder
    sender_id?: SortOrder
  }

  export type messagesMaxOrderByAggregateInput = {
    id?: SortOrder
    chat_type?: SortOrder
    chat_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    sender_id?: SortOrder
  }

  export type messagesMinOrderByAggregateInput = {
    id?: SortOrder
    chat_type?: SortOrder
    chat_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    sender_id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FeedbacksListRelationFilter = {
    every?: feedbacksWhereInput
    some?: feedbacksWhereInput
    none?: feedbacksWhereInput
  }

  export type Group_chatsNullableScalarRelationFilter = {
    is?: group_chatsWhereInput | null
    isNot?: group_chatsWhereInput | null
  }

  export type MeetingsListRelationFilter = {
    every?: meetingsWhereInput
    some?: meetingsWhereInput
    none?: meetingsWhereInput
  }

  export type RequirementsListRelationFilter = {
    every?: requirementsWhereInput
    some?: requirementsWhereInput
    none?: requirementsWhereInput
  }

  export type Specbot_chatsListRelationFilter = {
    every?: specbot_chatsWhereInput
    some?: specbot_chatsWhereInput
    none?: specbot_chatsWhereInput
  }

  export type feedbacksOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type meetingsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type requirementsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type specbot_chatsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type projectsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    cover_image_url?: SortOrder
    icon_url?: SortOrder
    status?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    tags?: SortOrder
    members?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
  }

  export type projectsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    cover_image_url?: SortOrder
    icon_url?: SortOrder
    status?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
  }

  export type projectsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    cover_image_url?: SortOrder
    icon_url?: SortOrder
    status?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
  }

  export type MeetingsNullableScalarRelationFilter = {
    is?: meetingsWhereInput | null
    isNot?: meetingsWhereInput | null
  }

  export type recordingsCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    recording_url?: SortOrder
    transcript_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    meeting_id?: SortOrder
  }

  export type recordingsMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    recording_url?: SortOrder
    transcript_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    meeting_id?: SortOrder
  }

  export type recordingsMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    recording_url?: SortOrder
    transcript_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    meeting_id?: SortOrder
  }

  export type requirementsCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    metadata?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    project_id?: SortOrder
  }

  export type requirementsMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    project_id?: SortOrder
  }

  export type requirementsMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    project_id?: SortOrder
  }

  export type specbot_chatsCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    project_id?: SortOrder
  }

  export type specbot_chatsMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    project_id?: SortOrder
  }

  export type specbot_chatsMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    project_id?: SortOrder
  }

  export type MessagesListRelationFilter = {
    every?: messagesWhereInput
    some?: messagesWhereInput
    none?: messagesWhereInput
  }

  export type ProjectsListRelationFilter = {
    every?: projectsWhereInput
    some?: projectsWhereInput
    none?: projectsWhereInput
  }

  export type messagesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type projectsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    permissions?: SortOrder
    email?: SortOrder
    profile_pic_url?: SortOrder
    display_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    email?: SortOrder
    profile_pic_url?: SortOrder
    display_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    email?: SortOrder
    profile_pic_url?: SortOrder
    display_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type projectsCreateNestedOneWithoutFeedbacksInput = {
    create?: XOR<projectsCreateWithoutFeedbacksInput, projectsUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: projectsCreateOrConnectWithoutFeedbacksInput
    connect?: projectsWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type projectsUpdateOneWithoutFeedbacksNestedInput = {
    create?: XOR<projectsCreateWithoutFeedbacksInput, projectsUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: projectsCreateOrConnectWithoutFeedbacksInput
    upsert?: projectsUpsertWithoutFeedbacksInput
    disconnect?: projectsWhereInput | boolean
    delete?: projectsWhereInput | boolean
    connect?: projectsWhereUniqueInput
    update?: XOR<XOR<projectsUpdateToOneWithWhereWithoutFeedbacksInput, projectsUpdateWithoutFeedbacksInput>, projectsUncheckedUpdateWithoutFeedbacksInput>
  }

  export type projectsCreateNestedOneWithoutGroup_chatsInput = {
    create?: XOR<projectsCreateWithoutGroup_chatsInput, projectsUncheckedCreateWithoutGroup_chatsInput>
    connectOrCreate?: projectsCreateOrConnectWithoutGroup_chatsInput
    connect?: projectsWhereUniqueInput
  }

  export type projectsUpdateOneWithoutGroup_chatsNestedInput = {
    create?: XOR<projectsCreateWithoutGroup_chatsInput, projectsUncheckedCreateWithoutGroup_chatsInput>
    connectOrCreate?: projectsCreateOrConnectWithoutGroup_chatsInput
    upsert?: projectsUpsertWithoutGroup_chatsInput
    disconnect?: projectsWhereInput | boolean
    delete?: projectsWhereInput | boolean
    connect?: projectsWhereUniqueInput
    update?: XOR<XOR<projectsUpdateToOneWithWhereWithoutGroup_chatsInput, projectsUpdateWithoutGroup_chatsInput>, projectsUncheckedUpdateWithoutGroup_chatsInput>
  }

  export type usersCreateNestedOneWithoutMeetingsInput = {
    create?: XOR<usersCreateWithoutMeetingsInput, usersUncheckedCreateWithoutMeetingsInput>
    connectOrCreate?: usersCreateOrConnectWithoutMeetingsInput
    connect?: usersWhereUniqueInput
  }

  export type projectsCreateNestedOneWithoutMeetingsInput = {
    create?: XOR<projectsCreateWithoutMeetingsInput, projectsUncheckedCreateWithoutMeetingsInput>
    connectOrCreate?: projectsCreateOrConnectWithoutMeetingsInput
    connect?: projectsWhereUniqueInput
  }

  export type recordingsCreateNestedManyWithoutMeetingsInput = {
    create?: XOR<recordingsCreateWithoutMeetingsInput, recordingsUncheckedCreateWithoutMeetingsInput> | recordingsCreateWithoutMeetingsInput[] | recordingsUncheckedCreateWithoutMeetingsInput[]
    connectOrCreate?: recordingsCreateOrConnectWithoutMeetingsInput | recordingsCreateOrConnectWithoutMeetingsInput[]
    createMany?: recordingsCreateManyMeetingsInputEnvelope
    connect?: recordingsWhereUniqueInput | recordingsWhereUniqueInput[]
  }

  export type recordingsUncheckedCreateNestedManyWithoutMeetingsInput = {
    create?: XOR<recordingsCreateWithoutMeetingsInput, recordingsUncheckedCreateWithoutMeetingsInput> | recordingsCreateWithoutMeetingsInput[] | recordingsUncheckedCreateWithoutMeetingsInput[]
    connectOrCreate?: recordingsCreateOrConnectWithoutMeetingsInput | recordingsCreateOrConnectWithoutMeetingsInput[]
    createMany?: recordingsCreateManyMeetingsInputEnvelope
    connect?: recordingsWhereUniqueInput | recordingsWhereUniqueInput[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type usersUpdateOneWithoutMeetingsNestedInput = {
    create?: XOR<usersCreateWithoutMeetingsInput, usersUncheckedCreateWithoutMeetingsInput>
    connectOrCreate?: usersCreateOrConnectWithoutMeetingsInput
    upsert?: usersUpsertWithoutMeetingsInput
    disconnect?: usersWhereInput | boolean
    delete?: usersWhereInput | boolean
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutMeetingsInput, usersUpdateWithoutMeetingsInput>, usersUncheckedUpdateWithoutMeetingsInput>
  }

  export type projectsUpdateOneWithoutMeetingsNestedInput = {
    create?: XOR<projectsCreateWithoutMeetingsInput, projectsUncheckedCreateWithoutMeetingsInput>
    connectOrCreate?: projectsCreateOrConnectWithoutMeetingsInput
    upsert?: projectsUpsertWithoutMeetingsInput
    disconnect?: projectsWhereInput | boolean
    delete?: projectsWhereInput | boolean
    connect?: projectsWhereUniqueInput
    update?: XOR<XOR<projectsUpdateToOneWithWhereWithoutMeetingsInput, projectsUpdateWithoutMeetingsInput>, projectsUncheckedUpdateWithoutMeetingsInput>
  }

  export type recordingsUpdateManyWithoutMeetingsNestedInput = {
    create?: XOR<recordingsCreateWithoutMeetingsInput, recordingsUncheckedCreateWithoutMeetingsInput> | recordingsCreateWithoutMeetingsInput[] | recordingsUncheckedCreateWithoutMeetingsInput[]
    connectOrCreate?: recordingsCreateOrConnectWithoutMeetingsInput | recordingsCreateOrConnectWithoutMeetingsInput[]
    upsert?: recordingsUpsertWithWhereUniqueWithoutMeetingsInput | recordingsUpsertWithWhereUniqueWithoutMeetingsInput[]
    createMany?: recordingsCreateManyMeetingsInputEnvelope
    set?: recordingsWhereUniqueInput | recordingsWhereUniqueInput[]
    disconnect?: recordingsWhereUniqueInput | recordingsWhereUniqueInput[]
    delete?: recordingsWhereUniqueInput | recordingsWhereUniqueInput[]
    connect?: recordingsWhereUniqueInput | recordingsWhereUniqueInput[]
    update?: recordingsUpdateWithWhereUniqueWithoutMeetingsInput | recordingsUpdateWithWhereUniqueWithoutMeetingsInput[]
    updateMany?: recordingsUpdateManyWithWhereWithoutMeetingsInput | recordingsUpdateManyWithWhereWithoutMeetingsInput[]
    deleteMany?: recordingsScalarWhereInput | recordingsScalarWhereInput[]
  }

  export type recordingsUncheckedUpdateManyWithoutMeetingsNestedInput = {
    create?: XOR<recordingsCreateWithoutMeetingsInput, recordingsUncheckedCreateWithoutMeetingsInput> | recordingsCreateWithoutMeetingsInput[] | recordingsUncheckedCreateWithoutMeetingsInput[]
    connectOrCreate?: recordingsCreateOrConnectWithoutMeetingsInput | recordingsCreateOrConnectWithoutMeetingsInput[]
    upsert?: recordingsUpsertWithWhereUniqueWithoutMeetingsInput | recordingsUpsertWithWhereUniqueWithoutMeetingsInput[]
    createMany?: recordingsCreateManyMeetingsInputEnvelope
    set?: recordingsWhereUniqueInput | recordingsWhereUniqueInput[]
    disconnect?: recordingsWhereUniqueInput | recordingsWhereUniqueInput[]
    delete?: recordingsWhereUniqueInput | recordingsWhereUniqueInput[]
    connect?: recordingsWhereUniqueInput | recordingsWhereUniqueInput[]
    update?: recordingsUpdateWithWhereUniqueWithoutMeetingsInput | recordingsUpdateWithWhereUniqueWithoutMeetingsInput[]
    updateMany?: recordingsUpdateManyWithWhereWithoutMeetingsInput | recordingsUpdateManyWithWhereWithoutMeetingsInput[]
    deleteMany?: recordingsScalarWhereInput | recordingsScalarWhereInput[]
  }

  export type usersCreateNestedOneWithoutMessagesInput = {
    create?: XOR<usersCreateWithoutMessagesInput, usersUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: usersCreateOrConnectWithoutMessagesInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneWithoutMessagesNestedInput = {
    create?: XOR<usersCreateWithoutMessagesInput, usersUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: usersCreateOrConnectWithoutMessagesInput
    upsert?: usersUpsertWithoutMessagesInput
    disconnect?: usersWhereInput | boolean
    delete?: usersWhereInput | boolean
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutMessagesInput, usersUpdateWithoutMessagesInput>, usersUncheckedUpdateWithoutMessagesInput>
  }

  export type feedbacksCreateNestedManyWithoutProjectsInput = {
    create?: XOR<feedbacksCreateWithoutProjectsInput, feedbacksUncheckedCreateWithoutProjectsInput> | feedbacksCreateWithoutProjectsInput[] | feedbacksUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: feedbacksCreateOrConnectWithoutProjectsInput | feedbacksCreateOrConnectWithoutProjectsInput[]
    createMany?: feedbacksCreateManyProjectsInputEnvelope
    connect?: feedbacksWhereUniqueInput | feedbacksWhereUniqueInput[]
  }

  export type group_chatsCreateNestedOneWithoutProjectsInput = {
    create?: XOR<group_chatsCreateWithoutProjectsInput, group_chatsUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: group_chatsCreateOrConnectWithoutProjectsInput
    connect?: group_chatsWhereUniqueInput
  }

  export type meetingsCreateNestedManyWithoutProjectsInput = {
    create?: XOR<meetingsCreateWithoutProjectsInput, meetingsUncheckedCreateWithoutProjectsInput> | meetingsCreateWithoutProjectsInput[] | meetingsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: meetingsCreateOrConnectWithoutProjectsInput | meetingsCreateOrConnectWithoutProjectsInput[]
    createMany?: meetingsCreateManyProjectsInputEnvelope
    connect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
  }

  export type usersCreateNestedOneWithoutProjectsInput = {
    create?: XOR<usersCreateWithoutProjectsInput, usersUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: usersCreateOrConnectWithoutProjectsInput
    connect?: usersWhereUniqueInput
  }

  export type requirementsCreateNestedManyWithoutProjectsInput = {
    create?: XOR<requirementsCreateWithoutProjectsInput, requirementsUncheckedCreateWithoutProjectsInput> | requirementsCreateWithoutProjectsInput[] | requirementsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: requirementsCreateOrConnectWithoutProjectsInput | requirementsCreateOrConnectWithoutProjectsInput[]
    createMany?: requirementsCreateManyProjectsInputEnvelope
    connect?: requirementsWhereUniqueInput | requirementsWhereUniqueInput[]
  }

  export type specbot_chatsCreateNestedManyWithoutProjectsInput = {
    create?: XOR<specbot_chatsCreateWithoutProjectsInput, specbot_chatsUncheckedCreateWithoutProjectsInput> | specbot_chatsCreateWithoutProjectsInput[] | specbot_chatsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: specbot_chatsCreateOrConnectWithoutProjectsInput | specbot_chatsCreateOrConnectWithoutProjectsInput[]
    createMany?: specbot_chatsCreateManyProjectsInputEnvelope
    connect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
  }

  export type feedbacksUncheckedCreateNestedManyWithoutProjectsInput = {
    create?: XOR<feedbacksCreateWithoutProjectsInput, feedbacksUncheckedCreateWithoutProjectsInput> | feedbacksCreateWithoutProjectsInput[] | feedbacksUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: feedbacksCreateOrConnectWithoutProjectsInput | feedbacksCreateOrConnectWithoutProjectsInput[]
    createMany?: feedbacksCreateManyProjectsInputEnvelope
    connect?: feedbacksWhereUniqueInput | feedbacksWhereUniqueInput[]
  }

  export type group_chatsUncheckedCreateNestedOneWithoutProjectsInput = {
    create?: XOR<group_chatsCreateWithoutProjectsInput, group_chatsUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: group_chatsCreateOrConnectWithoutProjectsInput
    connect?: group_chatsWhereUniqueInput
  }

  export type meetingsUncheckedCreateNestedManyWithoutProjectsInput = {
    create?: XOR<meetingsCreateWithoutProjectsInput, meetingsUncheckedCreateWithoutProjectsInput> | meetingsCreateWithoutProjectsInput[] | meetingsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: meetingsCreateOrConnectWithoutProjectsInput | meetingsCreateOrConnectWithoutProjectsInput[]
    createMany?: meetingsCreateManyProjectsInputEnvelope
    connect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
  }

  export type requirementsUncheckedCreateNestedManyWithoutProjectsInput = {
    create?: XOR<requirementsCreateWithoutProjectsInput, requirementsUncheckedCreateWithoutProjectsInput> | requirementsCreateWithoutProjectsInput[] | requirementsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: requirementsCreateOrConnectWithoutProjectsInput | requirementsCreateOrConnectWithoutProjectsInput[]
    createMany?: requirementsCreateManyProjectsInputEnvelope
    connect?: requirementsWhereUniqueInput | requirementsWhereUniqueInput[]
  }

  export type specbot_chatsUncheckedCreateNestedManyWithoutProjectsInput = {
    create?: XOR<specbot_chatsCreateWithoutProjectsInput, specbot_chatsUncheckedCreateWithoutProjectsInput> | specbot_chatsCreateWithoutProjectsInput[] | specbot_chatsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: specbot_chatsCreateOrConnectWithoutProjectsInput | specbot_chatsCreateOrConnectWithoutProjectsInput[]
    createMany?: specbot_chatsCreateManyProjectsInputEnvelope
    connect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
  }

  export type feedbacksUpdateManyWithoutProjectsNestedInput = {
    create?: XOR<feedbacksCreateWithoutProjectsInput, feedbacksUncheckedCreateWithoutProjectsInput> | feedbacksCreateWithoutProjectsInput[] | feedbacksUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: feedbacksCreateOrConnectWithoutProjectsInput | feedbacksCreateOrConnectWithoutProjectsInput[]
    upsert?: feedbacksUpsertWithWhereUniqueWithoutProjectsInput | feedbacksUpsertWithWhereUniqueWithoutProjectsInput[]
    createMany?: feedbacksCreateManyProjectsInputEnvelope
    set?: feedbacksWhereUniqueInput | feedbacksWhereUniqueInput[]
    disconnect?: feedbacksWhereUniqueInput | feedbacksWhereUniqueInput[]
    delete?: feedbacksWhereUniqueInput | feedbacksWhereUniqueInput[]
    connect?: feedbacksWhereUniqueInput | feedbacksWhereUniqueInput[]
    update?: feedbacksUpdateWithWhereUniqueWithoutProjectsInput | feedbacksUpdateWithWhereUniqueWithoutProjectsInput[]
    updateMany?: feedbacksUpdateManyWithWhereWithoutProjectsInput | feedbacksUpdateManyWithWhereWithoutProjectsInput[]
    deleteMany?: feedbacksScalarWhereInput | feedbacksScalarWhereInput[]
  }

  export type group_chatsUpdateOneWithoutProjectsNestedInput = {
    create?: XOR<group_chatsCreateWithoutProjectsInput, group_chatsUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: group_chatsCreateOrConnectWithoutProjectsInput
    upsert?: group_chatsUpsertWithoutProjectsInput
    disconnect?: group_chatsWhereInput | boolean
    delete?: group_chatsWhereInput | boolean
    connect?: group_chatsWhereUniqueInput
    update?: XOR<XOR<group_chatsUpdateToOneWithWhereWithoutProjectsInput, group_chatsUpdateWithoutProjectsInput>, group_chatsUncheckedUpdateWithoutProjectsInput>
  }

  export type meetingsUpdateManyWithoutProjectsNestedInput = {
    create?: XOR<meetingsCreateWithoutProjectsInput, meetingsUncheckedCreateWithoutProjectsInput> | meetingsCreateWithoutProjectsInput[] | meetingsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: meetingsCreateOrConnectWithoutProjectsInput | meetingsCreateOrConnectWithoutProjectsInput[]
    upsert?: meetingsUpsertWithWhereUniqueWithoutProjectsInput | meetingsUpsertWithWhereUniqueWithoutProjectsInput[]
    createMany?: meetingsCreateManyProjectsInputEnvelope
    set?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    disconnect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    delete?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    connect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    update?: meetingsUpdateWithWhereUniqueWithoutProjectsInput | meetingsUpdateWithWhereUniqueWithoutProjectsInput[]
    updateMany?: meetingsUpdateManyWithWhereWithoutProjectsInput | meetingsUpdateManyWithWhereWithoutProjectsInput[]
    deleteMany?: meetingsScalarWhereInput | meetingsScalarWhereInput[]
  }

  export type usersUpdateOneWithoutProjectsNestedInput = {
    create?: XOR<usersCreateWithoutProjectsInput, usersUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: usersCreateOrConnectWithoutProjectsInput
    upsert?: usersUpsertWithoutProjectsInput
    disconnect?: usersWhereInput | boolean
    delete?: usersWhereInput | boolean
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutProjectsInput, usersUpdateWithoutProjectsInput>, usersUncheckedUpdateWithoutProjectsInput>
  }

  export type requirementsUpdateManyWithoutProjectsNestedInput = {
    create?: XOR<requirementsCreateWithoutProjectsInput, requirementsUncheckedCreateWithoutProjectsInput> | requirementsCreateWithoutProjectsInput[] | requirementsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: requirementsCreateOrConnectWithoutProjectsInput | requirementsCreateOrConnectWithoutProjectsInput[]
    upsert?: requirementsUpsertWithWhereUniqueWithoutProjectsInput | requirementsUpsertWithWhereUniqueWithoutProjectsInput[]
    createMany?: requirementsCreateManyProjectsInputEnvelope
    set?: requirementsWhereUniqueInput | requirementsWhereUniqueInput[]
    disconnect?: requirementsWhereUniqueInput | requirementsWhereUniqueInput[]
    delete?: requirementsWhereUniqueInput | requirementsWhereUniqueInput[]
    connect?: requirementsWhereUniqueInput | requirementsWhereUniqueInput[]
    update?: requirementsUpdateWithWhereUniqueWithoutProjectsInput | requirementsUpdateWithWhereUniqueWithoutProjectsInput[]
    updateMany?: requirementsUpdateManyWithWhereWithoutProjectsInput | requirementsUpdateManyWithWhereWithoutProjectsInput[]
    deleteMany?: requirementsScalarWhereInput | requirementsScalarWhereInput[]
  }

  export type specbot_chatsUpdateManyWithoutProjectsNestedInput = {
    create?: XOR<specbot_chatsCreateWithoutProjectsInput, specbot_chatsUncheckedCreateWithoutProjectsInput> | specbot_chatsCreateWithoutProjectsInput[] | specbot_chatsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: specbot_chatsCreateOrConnectWithoutProjectsInput | specbot_chatsCreateOrConnectWithoutProjectsInput[]
    upsert?: specbot_chatsUpsertWithWhereUniqueWithoutProjectsInput | specbot_chatsUpsertWithWhereUniqueWithoutProjectsInput[]
    createMany?: specbot_chatsCreateManyProjectsInputEnvelope
    set?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    disconnect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    delete?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    connect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    update?: specbot_chatsUpdateWithWhereUniqueWithoutProjectsInput | specbot_chatsUpdateWithWhereUniqueWithoutProjectsInput[]
    updateMany?: specbot_chatsUpdateManyWithWhereWithoutProjectsInput | specbot_chatsUpdateManyWithWhereWithoutProjectsInput[]
    deleteMany?: specbot_chatsScalarWhereInput | specbot_chatsScalarWhereInput[]
  }

  export type feedbacksUncheckedUpdateManyWithoutProjectsNestedInput = {
    create?: XOR<feedbacksCreateWithoutProjectsInput, feedbacksUncheckedCreateWithoutProjectsInput> | feedbacksCreateWithoutProjectsInput[] | feedbacksUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: feedbacksCreateOrConnectWithoutProjectsInput | feedbacksCreateOrConnectWithoutProjectsInput[]
    upsert?: feedbacksUpsertWithWhereUniqueWithoutProjectsInput | feedbacksUpsertWithWhereUniqueWithoutProjectsInput[]
    createMany?: feedbacksCreateManyProjectsInputEnvelope
    set?: feedbacksWhereUniqueInput | feedbacksWhereUniqueInput[]
    disconnect?: feedbacksWhereUniqueInput | feedbacksWhereUniqueInput[]
    delete?: feedbacksWhereUniqueInput | feedbacksWhereUniqueInput[]
    connect?: feedbacksWhereUniqueInput | feedbacksWhereUniqueInput[]
    update?: feedbacksUpdateWithWhereUniqueWithoutProjectsInput | feedbacksUpdateWithWhereUniqueWithoutProjectsInput[]
    updateMany?: feedbacksUpdateManyWithWhereWithoutProjectsInput | feedbacksUpdateManyWithWhereWithoutProjectsInput[]
    deleteMany?: feedbacksScalarWhereInput | feedbacksScalarWhereInput[]
  }

  export type group_chatsUncheckedUpdateOneWithoutProjectsNestedInput = {
    create?: XOR<group_chatsCreateWithoutProjectsInput, group_chatsUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: group_chatsCreateOrConnectWithoutProjectsInput
    upsert?: group_chatsUpsertWithoutProjectsInput
    disconnect?: group_chatsWhereInput | boolean
    delete?: group_chatsWhereInput | boolean
    connect?: group_chatsWhereUniqueInput
    update?: XOR<XOR<group_chatsUpdateToOneWithWhereWithoutProjectsInput, group_chatsUpdateWithoutProjectsInput>, group_chatsUncheckedUpdateWithoutProjectsInput>
  }

  export type meetingsUncheckedUpdateManyWithoutProjectsNestedInput = {
    create?: XOR<meetingsCreateWithoutProjectsInput, meetingsUncheckedCreateWithoutProjectsInput> | meetingsCreateWithoutProjectsInput[] | meetingsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: meetingsCreateOrConnectWithoutProjectsInput | meetingsCreateOrConnectWithoutProjectsInput[]
    upsert?: meetingsUpsertWithWhereUniqueWithoutProjectsInput | meetingsUpsertWithWhereUniqueWithoutProjectsInput[]
    createMany?: meetingsCreateManyProjectsInputEnvelope
    set?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    disconnect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    delete?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    connect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    update?: meetingsUpdateWithWhereUniqueWithoutProjectsInput | meetingsUpdateWithWhereUniqueWithoutProjectsInput[]
    updateMany?: meetingsUpdateManyWithWhereWithoutProjectsInput | meetingsUpdateManyWithWhereWithoutProjectsInput[]
    deleteMany?: meetingsScalarWhereInput | meetingsScalarWhereInput[]
  }

  export type requirementsUncheckedUpdateManyWithoutProjectsNestedInput = {
    create?: XOR<requirementsCreateWithoutProjectsInput, requirementsUncheckedCreateWithoutProjectsInput> | requirementsCreateWithoutProjectsInput[] | requirementsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: requirementsCreateOrConnectWithoutProjectsInput | requirementsCreateOrConnectWithoutProjectsInput[]
    upsert?: requirementsUpsertWithWhereUniqueWithoutProjectsInput | requirementsUpsertWithWhereUniqueWithoutProjectsInput[]
    createMany?: requirementsCreateManyProjectsInputEnvelope
    set?: requirementsWhereUniqueInput | requirementsWhereUniqueInput[]
    disconnect?: requirementsWhereUniqueInput | requirementsWhereUniqueInput[]
    delete?: requirementsWhereUniqueInput | requirementsWhereUniqueInput[]
    connect?: requirementsWhereUniqueInput | requirementsWhereUniqueInput[]
    update?: requirementsUpdateWithWhereUniqueWithoutProjectsInput | requirementsUpdateWithWhereUniqueWithoutProjectsInput[]
    updateMany?: requirementsUpdateManyWithWhereWithoutProjectsInput | requirementsUpdateManyWithWhereWithoutProjectsInput[]
    deleteMany?: requirementsScalarWhereInput | requirementsScalarWhereInput[]
  }

  export type specbot_chatsUncheckedUpdateManyWithoutProjectsNestedInput = {
    create?: XOR<specbot_chatsCreateWithoutProjectsInput, specbot_chatsUncheckedCreateWithoutProjectsInput> | specbot_chatsCreateWithoutProjectsInput[] | specbot_chatsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: specbot_chatsCreateOrConnectWithoutProjectsInput | specbot_chatsCreateOrConnectWithoutProjectsInput[]
    upsert?: specbot_chatsUpsertWithWhereUniqueWithoutProjectsInput | specbot_chatsUpsertWithWhereUniqueWithoutProjectsInput[]
    createMany?: specbot_chatsCreateManyProjectsInputEnvelope
    set?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    disconnect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    delete?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    connect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    update?: specbot_chatsUpdateWithWhereUniqueWithoutProjectsInput | specbot_chatsUpdateWithWhereUniqueWithoutProjectsInput[]
    updateMany?: specbot_chatsUpdateManyWithWhereWithoutProjectsInput | specbot_chatsUpdateManyWithWhereWithoutProjectsInput[]
    deleteMany?: specbot_chatsScalarWhereInput | specbot_chatsScalarWhereInput[]
  }

  export type meetingsCreateNestedOneWithoutRecordingsInput = {
    create?: XOR<meetingsCreateWithoutRecordingsInput, meetingsUncheckedCreateWithoutRecordingsInput>
    connectOrCreate?: meetingsCreateOrConnectWithoutRecordingsInput
    connect?: meetingsWhereUniqueInput
  }

  export type meetingsUpdateOneWithoutRecordingsNestedInput = {
    create?: XOR<meetingsCreateWithoutRecordingsInput, meetingsUncheckedCreateWithoutRecordingsInput>
    connectOrCreate?: meetingsCreateOrConnectWithoutRecordingsInput
    upsert?: meetingsUpsertWithoutRecordingsInput
    disconnect?: meetingsWhereInput | boolean
    delete?: meetingsWhereInput | boolean
    connect?: meetingsWhereUniqueInput
    update?: XOR<XOR<meetingsUpdateToOneWithWhereWithoutRecordingsInput, meetingsUpdateWithoutRecordingsInput>, meetingsUncheckedUpdateWithoutRecordingsInput>
  }

  export type projectsCreateNestedOneWithoutRequirementsInput = {
    create?: XOR<projectsCreateWithoutRequirementsInput, projectsUncheckedCreateWithoutRequirementsInput>
    connectOrCreate?: projectsCreateOrConnectWithoutRequirementsInput
    connect?: projectsWhereUniqueInput
  }

  export type projectsUpdateOneWithoutRequirementsNestedInput = {
    create?: XOR<projectsCreateWithoutRequirementsInput, projectsUncheckedCreateWithoutRequirementsInput>
    connectOrCreate?: projectsCreateOrConnectWithoutRequirementsInput
    upsert?: projectsUpsertWithoutRequirementsInput
    disconnect?: projectsWhereInput | boolean
    delete?: projectsWhereInput | boolean
    connect?: projectsWhereUniqueInput
    update?: XOR<XOR<projectsUpdateToOneWithWhereWithoutRequirementsInput, projectsUpdateWithoutRequirementsInput>, projectsUncheckedUpdateWithoutRequirementsInput>
  }

  export type projectsCreateNestedOneWithoutSpecbot_chatsInput = {
    create?: XOR<projectsCreateWithoutSpecbot_chatsInput, projectsUncheckedCreateWithoutSpecbot_chatsInput>
    connectOrCreate?: projectsCreateOrConnectWithoutSpecbot_chatsInput
    connect?: projectsWhereUniqueInput
  }

  export type usersCreateNestedOneWithoutSpecbot_chatsInput = {
    create?: XOR<usersCreateWithoutSpecbot_chatsInput, usersUncheckedCreateWithoutSpecbot_chatsInput>
    connectOrCreate?: usersCreateOrConnectWithoutSpecbot_chatsInput
    connect?: usersWhereUniqueInput
  }

  export type projectsUpdateOneWithoutSpecbot_chatsNestedInput = {
    create?: XOR<projectsCreateWithoutSpecbot_chatsInput, projectsUncheckedCreateWithoutSpecbot_chatsInput>
    connectOrCreate?: projectsCreateOrConnectWithoutSpecbot_chatsInput
    upsert?: projectsUpsertWithoutSpecbot_chatsInput
    disconnect?: projectsWhereInput | boolean
    delete?: projectsWhereInput | boolean
    connect?: projectsWhereUniqueInput
    update?: XOR<XOR<projectsUpdateToOneWithWhereWithoutSpecbot_chatsInput, projectsUpdateWithoutSpecbot_chatsInput>, projectsUncheckedUpdateWithoutSpecbot_chatsInput>
  }

  export type usersUpdateOneWithoutSpecbot_chatsNestedInput = {
    create?: XOR<usersCreateWithoutSpecbot_chatsInput, usersUncheckedCreateWithoutSpecbot_chatsInput>
    connectOrCreate?: usersCreateOrConnectWithoutSpecbot_chatsInput
    upsert?: usersUpsertWithoutSpecbot_chatsInput
    disconnect?: usersWhereInput | boolean
    delete?: usersWhereInput | boolean
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutSpecbot_chatsInput, usersUpdateWithoutSpecbot_chatsInput>, usersUncheckedUpdateWithoutSpecbot_chatsInput>
  }

  export type meetingsCreateNestedManyWithoutUsersInput = {
    create?: XOR<meetingsCreateWithoutUsersInput, meetingsUncheckedCreateWithoutUsersInput> | meetingsCreateWithoutUsersInput[] | meetingsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: meetingsCreateOrConnectWithoutUsersInput | meetingsCreateOrConnectWithoutUsersInput[]
    createMany?: meetingsCreateManyUsersInputEnvelope
    connect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
  }

  export type messagesCreateNestedManyWithoutUsersInput = {
    create?: XOR<messagesCreateWithoutUsersInput, messagesUncheckedCreateWithoutUsersInput> | messagesCreateWithoutUsersInput[] | messagesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutUsersInput | messagesCreateOrConnectWithoutUsersInput[]
    createMany?: messagesCreateManyUsersInputEnvelope
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
  }

  export type projectsCreateNestedManyWithoutUsersInput = {
    create?: XOR<projectsCreateWithoutUsersInput, projectsUncheckedCreateWithoutUsersInput> | projectsCreateWithoutUsersInput[] | projectsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: projectsCreateOrConnectWithoutUsersInput | projectsCreateOrConnectWithoutUsersInput[]
    createMany?: projectsCreateManyUsersInputEnvelope
    connect?: projectsWhereUniqueInput | projectsWhereUniqueInput[]
  }

  export type specbot_chatsCreateNestedManyWithoutUsersInput = {
    create?: XOR<specbot_chatsCreateWithoutUsersInput, specbot_chatsUncheckedCreateWithoutUsersInput> | specbot_chatsCreateWithoutUsersInput[] | specbot_chatsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: specbot_chatsCreateOrConnectWithoutUsersInput | specbot_chatsCreateOrConnectWithoutUsersInput[]
    createMany?: specbot_chatsCreateManyUsersInputEnvelope
    connect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
  }

  export type meetingsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<meetingsCreateWithoutUsersInput, meetingsUncheckedCreateWithoutUsersInput> | meetingsCreateWithoutUsersInput[] | meetingsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: meetingsCreateOrConnectWithoutUsersInput | meetingsCreateOrConnectWithoutUsersInput[]
    createMany?: meetingsCreateManyUsersInputEnvelope
    connect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
  }

  export type messagesUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<messagesCreateWithoutUsersInput, messagesUncheckedCreateWithoutUsersInput> | messagesCreateWithoutUsersInput[] | messagesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutUsersInput | messagesCreateOrConnectWithoutUsersInput[]
    createMany?: messagesCreateManyUsersInputEnvelope
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
  }

  export type projectsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<projectsCreateWithoutUsersInput, projectsUncheckedCreateWithoutUsersInput> | projectsCreateWithoutUsersInput[] | projectsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: projectsCreateOrConnectWithoutUsersInput | projectsCreateOrConnectWithoutUsersInput[]
    createMany?: projectsCreateManyUsersInputEnvelope
    connect?: projectsWhereUniqueInput | projectsWhereUniqueInput[]
  }

  export type specbot_chatsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<specbot_chatsCreateWithoutUsersInput, specbot_chatsUncheckedCreateWithoutUsersInput> | specbot_chatsCreateWithoutUsersInput[] | specbot_chatsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: specbot_chatsCreateOrConnectWithoutUsersInput | specbot_chatsCreateOrConnectWithoutUsersInput[]
    createMany?: specbot_chatsCreateManyUsersInputEnvelope
    connect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
  }

  export type meetingsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<meetingsCreateWithoutUsersInput, meetingsUncheckedCreateWithoutUsersInput> | meetingsCreateWithoutUsersInput[] | meetingsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: meetingsCreateOrConnectWithoutUsersInput | meetingsCreateOrConnectWithoutUsersInput[]
    upsert?: meetingsUpsertWithWhereUniqueWithoutUsersInput | meetingsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: meetingsCreateManyUsersInputEnvelope
    set?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    disconnect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    delete?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    connect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    update?: meetingsUpdateWithWhereUniqueWithoutUsersInput | meetingsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: meetingsUpdateManyWithWhereWithoutUsersInput | meetingsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: meetingsScalarWhereInput | meetingsScalarWhereInput[]
  }

  export type messagesUpdateManyWithoutUsersNestedInput = {
    create?: XOR<messagesCreateWithoutUsersInput, messagesUncheckedCreateWithoutUsersInput> | messagesCreateWithoutUsersInput[] | messagesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutUsersInput | messagesCreateOrConnectWithoutUsersInput[]
    upsert?: messagesUpsertWithWhereUniqueWithoutUsersInput | messagesUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: messagesCreateManyUsersInputEnvelope
    set?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    disconnect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    delete?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    update?: messagesUpdateWithWhereUniqueWithoutUsersInput | messagesUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: messagesUpdateManyWithWhereWithoutUsersInput | messagesUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: messagesScalarWhereInput | messagesScalarWhereInput[]
  }

  export type projectsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<projectsCreateWithoutUsersInput, projectsUncheckedCreateWithoutUsersInput> | projectsCreateWithoutUsersInput[] | projectsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: projectsCreateOrConnectWithoutUsersInput | projectsCreateOrConnectWithoutUsersInput[]
    upsert?: projectsUpsertWithWhereUniqueWithoutUsersInput | projectsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: projectsCreateManyUsersInputEnvelope
    set?: projectsWhereUniqueInput | projectsWhereUniqueInput[]
    disconnect?: projectsWhereUniqueInput | projectsWhereUniqueInput[]
    delete?: projectsWhereUniqueInput | projectsWhereUniqueInput[]
    connect?: projectsWhereUniqueInput | projectsWhereUniqueInput[]
    update?: projectsUpdateWithWhereUniqueWithoutUsersInput | projectsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: projectsUpdateManyWithWhereWithoutUsersInput | projectsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: projectsScalarWhereInput | projectsScalarWhereInput[]
  }

  export type specbot_chatsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<specbot_chatsCreateWithoutUsersInput, specbot_chatsUncheckedCreateWithoutUsersInput> | specbot_chatsCreateWithoutUsersInput[] | specbot_chatsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: specbot_chatsCreateOrConnectWithoutUsersInput | specbot_chatsCreateOrConnectWithoutUsersInput[]
    upsert?: specbot_chatsUpsertWithWhereUniqueWithoutUsersInput | specbot_chatsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: specbot_chatsCreateManyUsersInputEnvelope
    set?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    disconnect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    delete?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    connect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    update?: specbot_chatsUpdateWithWhereUniqueWithoutUsersInput | specbot_chatsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: specbot_chatsUpdateManyWithWhereWithoutUsersInput | specbot_chatsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: specbot_chatsScalarWhereInput | specbot_chatsScalarWhereInput[]
  }

  export type meetingsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<meetingsCreateWithoutUsersInput, meetingsUncheckedCreateWithoutUsersInput> | meetingsCreateWithoutUsersInput[] | meetingsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: meetingsCreateOrConnectWithoutUsersInput | meetingsCreateOrConnectWithoutUsersInput[]
    upsert?: meetingsUpsertWithWhereUniqueWithoutUsersInput | meetingsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: meetingsCreateManyUsersInputEnvelope
    set?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    disconnect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    delete?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    connect?: meetingsWhereUniqueInput | meetingsWhereUniqueInput[]
    update?: meetingsUpdateWithWhereUniqueWithoutUsersInput | meetingsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: meetingsUpdateManyWithWhereWithoutUsersInput | meetingsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: meetingsScalarWhereInput | meetingsScalarWhereInput[]
  }

  export type messagesUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<messagesCreateWithoutUsersInput, messagesUncheckedCreateWithoutUsersInput> | messagesCreateWithoutUsersInput[] | messagesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutUsersInput | messagesCreateOrConnectWithoutUsersInput[]
    upsert?: messagesUpsertWithWhereUniqueWithoutUsersInput | messagesUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: messagesCreateManyUsersInputEnvelope
    set?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    disconnect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    delete?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    update?: messagesUpdateWithWhereUniqueWithoutUsersInput | messagesUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: messagesUpdateManyWithWhereWithoutUsersInput | messagesUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: messagesScalarWhereInput | messagesScalarWhereInput[]
  }

  export type projectsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<projectsCreateWithoutUsersInput, projectsUncheckedCreateWithoutUsersInput> | projectsCreateWithoutUsersInput[] | projectsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: projectsCreateOrConnectWithoutUsersInput | projectsCreateOrConnectWithoutUsersInput[]
    upsert?: projectsUpsertWithWhereUniqueWithoutUsersInput | projectsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: projectsCreateManyUsersInputEnvelope
    set?: projectsWhereUniqueInput | projectsWhereUniqueInput[]
    disconnect?: projectsWhereUniqueInput | projectsWhereUniqueInput[]
    delete?: projectsWhereUniqueInput | projectsWhereUniqueInput[]
    connect?: projectsWhereUniqueInput | projectsWhereUniqueInput[]
    update?: projectsUpdateWithWhereUniqueWithoutUsersInput | projectsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: projectsUpdateManyWithWhereWithoutUsersInput | projectsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: projectsScalarWhereInput | projectsScalarWhereInput[]
  }

  export type specbot_chatsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<specbot_chatsCreateWithoutUsersInput, specbot_chatsUncheckedCreateWithoutUsersInput> | specbot_chatsCreateWithoutUsersInput[] | specbot_chatsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: specbot_chatsCreateOrConnectWithoutUsersInput | specbot_chatsCreateOrConnectWithoutUsersInput[]
    upsert?: specbot_chatsUpsertWithWhereUniqueWithoutUsersInput | specbot_chatsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: specbot_chatsCreateManyUsersInputEnvelope
    set?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    disconnect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    delete?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    connect?: specbot_chatsWhereUniqueInput | specbot_chatsWhereUniqueInput[]
    update?: specbot_chatsUpdateWithWhereUniqueWithoutUsersInput | specbot_chatsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: specbot_chatsUpdateManyWithWhereWithoutUsersInput | specbot_chatsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: specbot_chatsScalarWhereInput | specbot_chatsScalarWhereInput[]
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type projectsCreateWithoutFeedbacksInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    group_chats?: group_chatsCreateNestedOneWithoutProjectsInput
    meetings?: meetingsCreateNestedManyWithoutProjectsInput
    users?: usersCreateNestedOneWithoutProjectsInput
    requirements?: requirementsCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsCreateNestedManyWithoutProjectsInput
  }

  export type projectsUncheckedCreateWithoutFeedbacksInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
    group_chats?: group_chatsUncheckedCreateNestedOneWithoutProjectsInput
    meetings?: meetingsUncheckedCreateNestedManyWithoutProjectsInput
    requirements?: requirementsUncheckedCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsUncheckedCreateNestedManyWithoutProjectsInput
  }

  export type projectsCreateOrConnectWithoutFeedbacksInput = {
    where: projectsWhereUniqueInput
    create: XOR<projectsCreateWithoutFeedbacksInput, projectsUncheckedCreateWithoutFeedbacksInput>
  }

  export type projectsUpsertWithoutFeedbacksInput = {
    update: XOR<projectsUpdateWithoutFeedbacksInput, projectsUncheckedUpdateWithoutFeedbacksInput>
    create: XOR<projectsCreateWithoutFeedbacksInput, projectsUncheckedCreateWithoutFeedbacksInput>
    where?: projectsWhereInput
  }

  export type projectsUpdateToOneWithWhereWithoutFeedbacksInput = {
    where?: projectsWhereInput
    data: XOR<projectsUpdateWithoutFeedbacksInput, projectsUncheckedUpdateWithoutFeedbacksInput>
  }

  export type projectsUpdateWithoutFeedbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    group_chats?: group_chatsUpdateOneWithoutProjectsNestedInput
    meetings?: meetingsUpdateManyWithoutProjectsNestedInput
    users?: usersUpdateOneWithoutProjectsNestedInput
    requirements?: requirementsUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUpdateManyWithoutProjectsNestedInput
  }

  export type projectsUncheckedUpdateWithoutFeedbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    group_chats?: group_chatsUncheckedUpdateOneWithoutProjectsNestedInput
    meetings?: meetingsUncheckedUpdateManyWithoutProjectsNestedInput
    requirements?: requirementsUncheckedUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUncheckedUpdateManyWithoutProjectsNestedInput
  }

  export type projectsCreateWithoutGroup_chatsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    feedbacks?: feedbacksCreateNestedManyWithoutProjectsInput
    meetings?: meetingsCreateNestedManyWithoutProjectsInput
    users?: usersCreateNestedOneWithoutProjectsInput
    requirements?: requirementsCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsCreateNestedManyWithoutProjectsInput
  }

  export type projectsUncheckedCreateWithoutGroup_chatsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
    feedbacks?: feedbacksUncheckedCreateNestedManyWithoutProjectsInput
    meetings?: meetingsUncheckedCreateNestedManyWithoutProjectsInput
    requirements?: requirementsUncheckedCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsUncheckedCreateNestedManyWithoutProjectsInput
  }

  export type projectsCreateOrConnectWithoutGroup_chatsInput = {
    where: projectsWhereUniqueInput
    create: XOR<projectsCreateWithoutGroup_chatsInput, projectsUncheckedCreateWithoutGroup_chatsInput>
  }

  export type projectsUpsertWithoutGroup_chatsInput = {
    update: XOR<projectsUpdateWithoutGroup_chatsInput, projectsUncheckedUpdateWithoutGroup_chatsInput>
    create: XOR<projectsCreateWithoutGroup_chatsInput, projectsUncheckedCreateWithoutGroup_chatsInput>
    where?: projectsWhereInput
  }

  export type projectsUpdateToOneWithWhereWithoutGroup_chatsInput = {
    where?: projectsWhereInput
    data: XOR<projectsUpdateWithoutGroup_chatsInput, projectsUncheckedUpdateWithoutGroup_chatsInput>
  }

  export type projectsUpdateWithoutGroup_chatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedbacks?: feedbacksUpdateManyWithoutProjectsNestedInput
    meetings?: meetingsUpdateManyWithoutProjectsNestedInput
    users?: usersUpdateOneWithoutProjectsNestedInput
    requirements?: requirementsUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUpdateManyWithoutProjectsNestedInput
  }

  export type projectsUncheckedUpdateWithoutGroup_chatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    feedbacks?: feedbacksUncheckedUpdateManyWithoutProjectsNestedInput
    meetings?: meetingsUncheckedUpdateManyWithoutProjectsNestedInput
    requirements?: requirementsUncheckedUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUncheckedUpdateManyWithoutProjectsNestedInput
  }

  export type usersCreateWithoutMeetingsInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    messages?: messagesCreateNestedManyWithoutUsersInput
    projects?: projectsCreateNestedManyWithoutUsersInput
    specbot_chats?: specbot_chatsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutMeetingsInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    messages?: messagesUncheckedCreateNestedManyWithoutUsersInput
    projects?: projectsUncheckedCreateNestedManyWithoutUsersInput
    specbot_chats?: specbot_chatsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutMeetingsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutMeetingsInput, usersUncheckedCreateWithoutMeetingsInput>
  }

  export type projectsCreateWithoutMeetingsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    feedbacks?: feedbacksCreateNestedManyWithoutProjectsInput
    group_chats?: group_chatsCreateNestedOneWithoutProjectsInput
    users?: usersCreateNestedOneWithoutProjectsInput
    requirements?: requirementsCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsCreateNestedManyWithoutProjectsInput
  }

  export type projectsUncheckedCreateWithoutMeetingsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
    feedbacks?: feedbacksUncheckedCreateNestedManyWithoutProjectsInput
    group_chats?: group_chatsUncheckedCreateNestedOneWithoutProjectsInput
    requirements?: requirementsUncheckedCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsUncheckedCreateNestedManyWithoutProjectsInput
  }

  export type projectsCreateOrConnectWithoutMeetingsInput = {
    where: projectsWhereUniqueInput
    create: XOR<projectsCreateWithoutMeetingsInput, projectsUncheckedCreateWithoutMeetingsInput>
  }

  export type recordingsCreateWithoutMeetingsInput = {
    id?: string
    title?: string | null
    recording_url?: string | null
    transcript_url?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type recordingsUncheckedCreateWithoutMeetingsInput = {
    id?: string
    title?: string | null
    recording_url?: string | null
    transcript_url?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type recordingsCreateOrConnectWithoutMeetingsInput = {
    where: recordingsWhereUniqueInput
    create: XOR<recordingsCreateWithoutMeetingsInput, recordingsUncheckedCreateWithoutMeetingsInput>
  }

  export type recordingsCreateManyMeetingsInputEnvelope = {
    data: recordingsCreateManyMeetingsInput | recordingsCreateManyMeetingsInput[]
    skipDuplicates?: boolean
  }

  export type usersUpsertWithoutMeetingsInput = {
    update: XOR<usersUpdateWithoutMeetingsInput, usersUncheckedUpdateWithoutMeetingsInput>
    create: XOR<usersCreateWithoutMeetingsInput, usersUncheckedCreateWithoutMeetingsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutMeetingsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutMeetingsInput, usersUncheckedUpdateWithoutMeetingsInput>
  }

  export type usersUpdateWithoutMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: messagesUpdateManyWithoutUsersNestedInput
    projects?: projectsUpdateManyWithoutUsersNestedInput
    specbot_chats?: specbot_chatsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: messagesUncheckedUpdateManyWithoutUsersNestedInput
    projects?: projectsUncheckedUpdateManyWithoutUsersNestedInput
    specbot_chats?: specbot_chatsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type projectsUpsertWithoutMeetingsInput = {
    update: XOR<projectsUpdateWithoutMeetingsInput, projectsUncheckedUpdateWithoutMeetingsInput>
    create: XOR<projectsCreateWithoutMeetingsInput, projectsUncheckedCreateWithoutMeetingsInput>
    where?: projectsWhereInput
  }

  export type projectsUpdateToOneWithWhereWithoutMeetingsInput = {
    where?: projectsWhereInput
    data: XOR<projectsUpdateWithoutMeetingsInput, projectsUncheckedUpdateWithoutMeetingsInput>
  }

  export type projectsUpdateWithoutMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedbacks?: feedbacksUpdateManyWithoutProjectsNestedInput
    group_chats?: group_chatsUpdateOneWithoutProjectsNestedInput
    users?: usersUpdateOneWithoutProjectsNestedInput
    requirements?: requirementsUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUpdateManyWithoutProjectsNestedInput
  }

  export type projectsUncheckedUpdateWithoutMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    feedbacks?: feedbacksUncheckedUpdateManyWithoutProjectsNestedInput
    group_chats?: group_chatsUncheckedUpdateOneWithoutProjectsNestedInput
    requirements?: requirementsUncheckedUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUncheckedUpdateManyWithoutProjectsNestedInput
  }

  export type recordingsUpsertWithWhereUniqueWithoutMeetingsInput = {
    where: recordingsWhereUniqueInput
    update: XOR<recordingsUpdateWithoutMeetingsInput, recordingsUncheckedUpdateWithoutMeetingsInput>
    create: XOR<recordingsCreateWithoutMeetingsInput, recordingsUncheckedCreateWithoutMeetingsInput>
  }

  export type recordingsUpdateWithWhereUniqueWithoutMeetingsInput = {
    where: recordingsWhereUniqueInput
    data: XOR<recordingsUpdateWithoutMeetingsInput, recordingsUncheckedUpdateWithoutMeetingsInput>
  }

  export type recordingsUpdateManyWithWhereWithoutMeetingsInput = {
    where: recordingsScalarWhereInput
    data: XOR<recordingsUpdateManyMutationInput, recordingsUncheckedUpdateManyWithoutMeetingsInput>
  }

  export type recordingsScalarWhereInput = {
    AND?: recordingsScalarWhereInput | recordingsScalarWhereInput[]
    OR?: recordingsScalarWhereInput[]
    NOT?: recordingsScalarWhereInput | recordingsScalarWhereInput[]
    id?: UuidFilter<"recordings"> | string
    title?: StringNullableFilter<"recordings"> | string | null
    recording_url?: StringNullableFilter<"recordings"> | string | null
    transcript_url?: StringNullableFilter<"recordings"> | string | null
    created_at?: DateTimeNullableFilter<"recordings"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"recordings"> | Date | string | null
    meeting_id?: UuidNullableFilter<"recordings"> | string | null
  }

  export type usersCreateWithoutMessagesInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meetings?: meetingsCreateNestedManyWithoutUsersInput
    projects?: projectsCreateNestedManyWithoutUsersInput
    specbot_chats?: specbot_chatsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutMessagesInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meetings?: meetingsUncheckedCreateNestedManyWithoutUsersInput
    projects?: projectsUncheckedCreateNestedManyWithoutUsersInput
    specbot_chats?: specbot_chatsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutMessagesInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutMessagesInput, usersUncheckedCreateWithoutMessagesInput>
  }

  export type usersUpsertWithoutMessagesInput = {
    update: XOR<usersUpdateWithoutMessagesInput, usersUncheckedUpdateWithoutMessagesInput>
    create: XOR<usersCreateWithoutMessagesInput, usersUncheckedCreateWithoutMessagesInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutMessagesInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutMessagesInput, usersUncheckedUpdateWithoutMessagesInput>
  }

  export type usersUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetings?: meetingsUpdateManyWithoutUsersNestedInput
    projects?: projectsUpdateManyWithoutUsersNestedInput
    specbot_chats?: specbot_chatsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetings?: meetingsUncheckedUpdateManyWithoutUsersNestedInput
    projects?: projectsUncheckedUpdateManyWithoutUsersNestedInput
    specbot_chats?: specbot_chatsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type feedbacksCreateWithoutProjectsInput = {
    id?: string
    title?: string | null
    description?: string | null
    status?: string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type feedbacksUncheckedCreateWithoutProjectsInput = {
    id?: string
    title?: string | null
    description?: string | null
    status?: string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type feedbacksCreateOrConnectWithoutProjectsInput = {
    where: feedbacksWhereUniqueInput
    create: XOR<feedbacksCreateWithoutProjectsInput, feedbacksUncheckedCreateWithoutProjectsInput>
  }

  export type feedbacksCreateManyProjectsInputEnvelope = {
    data: feedbacksCreateManyProjectsInput | feedbacksCreateManyProjectsInput[]
    skipDuplicates?: boolean
  }

  export type group_chatsCreateWithoutProjectsInput = {
    id?: string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type group_chatsUncheckedCreateWithoutProjectsInput = {
    id?: string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type group_chatsCreateOrConnectWithoutProjectsInput = {
    where: group_chatsWhereUniqueInput
    create: XOR<group_chatsCreateWithoutProjectsInput, group_chatsUncheckedCreateWithoutProjectsInput>
  }

  export type meetingsCreateWithoutProjectsInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    users?: usersCreateNestedOneWithoutMeetingsInput
    recordings?: recordingsCreateNestedManyWithoutMeetingsInput
  }

  export type meetingsUncheckedCreateWithoutProjectsInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
    recordings?: recordingsUncheckedCreateNestedManyWithoutMeetingsInput
  }

  export type meetingsCreateOrConnectWithoutProjectsInput = {
    where: meetingsWhereUniqueInput
    create: XOR<meetingsCreateWithoutProjectsInput, meetingsUncheckedCreateWithoutProjectsInput>
  }

  export type meetingsCreateManyProjectsInputEnvelope = {
    data: meetingsCreateManyProjectsInput | meetingsCreateManyProjectsInput[]
    skipDuplicates?: boolean
  }

  export type usersCreateWithoutProjectsInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meetings?: meetingsCreateNestedManyWithoutUsersInput
    messages?: messagesCreateNestedManyWithoutUsersInput
    specbot_chats?: specbot_chatsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutProjectsInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meetings?: meetingsUncheckedCreateNestedManyWithoutUsersInput
    messages?: messagesUncheckedCreateNestedManyWithoutUsersInput
    specbot_chats?: specbot_chatsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutProjectsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutProjectsInput, usersUncheckedCreateWithoutProjectsInput>
  }

  export type requirementsCreateWithoutProjectsInput = {
    id?: string
    title: string
    description?: string | null
    priority?: string | null
    status?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type requirementsUncheckedCreateWithoutProjectsInput = {
    id?: string
    title: string
    description?: string | null
    priority?: string | null
    status?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type requirementsCreateOrConnectWithoutProjectsInput = {
    where: requirementsWhereUniqueInput
    create: XOR<requirementsCreateWithoutProjectsInput, requirementsUncheckedCreateWithoutProjectsInput>
  }

  export type requirementsCreateManyProjectsInputEnvelope = {
    data: requirementsCreateManyProjectsInput | requirementsCreateManyProjectsInput[]
    skipDuplicates?: boolean
  }

  export type specbot_chatsCreateWithoutProjectsInput = {
    id?: string
    title?: string | null
    created_at?: Date | string | null
    users?: usersCreateNestedOneWithoutSpecbot_chatsInput
  }

  export type specbot_chatsUncheckedCreateWithoutProjectsInput = {
    id?: string
    title?: string | null
    created_at?: Date | string | null
    user_id?: string | null
  }

  export type specbot_chatsCreateOrConnectWithoutProjectsInput = {
    where: specbot_chatsWhereUniqueInput
    create: XOR<specbot_chatsCreateWithoutProjectsInput, specbot_chatsUncheckedCreateWithoutProjectsInput>
  }

  export type specbot_chatsCreateManyProjectsInputEnvelope = {
    data: specbot_chatsCreateManyProjectsInput | specbot_chatsCreateManyProjectsInput[]
    skipDuplicates?: boolean
  }

  export type feedbacksUpsertWithWhereUniqueWithoutProjectsInput = {
    where: feedbacksWhereUniqueInput
    update: XOR<feedbacksUpdateWithoutProjectsInput, feedbacksUncheckedUpdateWithoutProjectsInput>
    create: XOR<feedbacksCreateWithoutProjectsInput, feedbacksUncheckedCreateWithoutProjectsInput>
  }

  export type feedbacksUpdateWithWhereUniqueWithoutProjectsInput = {
    where: feedbacksWhereUniqueInput
    data: XOR<feedbacksUpdateWithoutProjectsInput, feedbacksUncheckedUpdateWithoutProjectsInput>
  }

  export type feedbacksUpdateManyWithWhereWithoutProjectsInput = {
    where: feedbacksScalarWhereInput
    data: XOR<feedbacksUpdateManyMutationInput, feedbacksUncheckedUpdateManyWithoutProjectsInput>
  }

  export type feedbacksScalarWhereInput = {
    AND?: feedbacksScalarWhereInput | feedbacksScalarWhereInput[]
    OR?: feedbacksScalarWhereInput[]
    NOT?: feedbacksScalarWhereInput | feedbacksScalarWhereInput[]
    id?: UuidFilter<"feedbacks"> | string
    title?: StringNullableFilter<"feedbacks"> | string | null
    description?: StringNullableFilter<"feedbacks"> | string | null
    status?: StringNullableFilter<"feedbacks"> | string | null
    form_structure?: JsonNullableFilter<"feedbacks">
    response?: JsonNullableFilter<"feedbacks">
    created_at?: DateTimeNullableFilter<"feedbacks"> | Date | string | null
    project_id?: UuidNullableFilter<"feedbacks"> | string | null
  }

  export type group_chatsUpsertWithoutProjectsInput = {
    update: XOR<group_chatsUpdateWithoutProjectsInput, group_chatsUncheckedUpdateWithoutProjectsInput>
    create: XOR<group_chatsCreateWithoutProjectsInput, group_chatsUncheckedCreateWithoutProjectsInput>
    where?: group_chatsWhereInput
  }

  export type group_chatsUpdateToOneWithWhereWithoutProjectsInput = {
    where?: group_chatsWhereInput
    data: XOR<group_chatsUpdateWithoutProjectsInput, group_chatsUncheckedUpdateWithoutProjectsInput>
  }

  export type group_chatsUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type group_chatsUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type meetingsUpsertWithWhereUniqueWithoutProjectsInput = {
    where: meetingsWhereUniqueInput
    update: XOR<meetingsUpdateWithoutProjectsInput, meetingsUncheckedUpdateWithoutProjectsInput>
    create: XOR<meetingsCreateWithoutProjectsInput, meetingsUncheckedCreateWithoutProjectsInput>
  }

  export type meetingsUpdateWithWhereUniqueWithoutProjectsInput = {
    where: meetingsWhereUniqueInput
    data: XOR<meetingsUpdateWithoutProjectsInput, meetingsUncheckedUpdateWithoutProjectsInput>
  }

  export type meetingsUpdateManyWithWhereWithoutProjectsInput = {
    where: meetingsScalarWhereInput
    data: XOR<meetingsUpdateManyMutationInput, meetingsUncheckedUpdateManyWithoutProjectsInput>
  }

  export type meetingsScalarWhereInput = {
    AND?: meetingsScalarWhereInput | meetingsScalarWhereInput[]
    OR?: meetingsScalarWhereInput[]
    NOT?: meetingsScalarWhereInput | meetingsScalarWhereInput[]
    id?: UuidFilter<"meetings"> | string
    title?: StringNullableFilter<"meetings"> | string | null
    description?: StringNullableFilter<"meetings"> | string | null
    type?: StringNullableFilter<"meetings"> | string | null
    status?: StringNullableFilter<"meetings"> | string | null
    link?: StringNullableFilter<"meetings"> | string | null
    room_id?: StringNullableFilter<"meetings"> | string | null
    scheduled_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    started_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    ended_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    is_recurring?: BoolNullableFilter<"meetings"> | boolean | null
    participants?: JsonNullableFilter<"meetings">
    created_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"meetings"> | Date | string | null
    created_by?: UuidNullableFilter<"meetings"> | string | null
    project_id?: UuidNullableFilter<"meetings"> | string | null
  }

  export type usersUpsertWithoutProjectsInput = {
    update: XOR<usersUpdateWithoutProjectsInput, usersUncheckedUpdateWithoutProjectsInput>
    create: XOR<usersCreateWithoutProjectsInput, usersUncheckedCreateWithoutProjectsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutProjectsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutProjectsInput, usersUncheckedUpdateWithoutProjectsInput>
  }

  export type usersUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetings?: meetingsUpdateManyWithoutUsersNestedInput
    messages?: messagesUpdateManyWithoutUsersNestedInput
    specbot_chats?: specbot_chatsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetings?: meetingsUncheckedUpdateManyWithoutUsersNestedInput
    messages?: messagesUncheckedUpdateManyWithoutUsersNestedInput
    specbot_chats?: specbot_chatsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type requirementsUpsertWithWhereUniqueWithoutProjectsInput = {
    where: requirementsWhereUniqueInput
    update: XOR<requirementsUpdateWithoutProjectsInput, requirementsUncheckedUpdateWithoutProjectsInput>
    create: XOR<requirementsCreateWithoutProjectsInput, requirementsUncheckedCreateWithoutProjectsInput>
  }

  export type requirementsUpdateWithWhereUniqueWithoutProjectsInput = {
    where: requirementsWhereUniqueInput
    data: XOR<requirementsUpdateWithoutProjectsInput, requirementsUncheckedUpdateWithoutProjectsInput>
  }

  export type requirementsUpdateManyWithWhereWithoutProjectsInput = {
    where: requirementsScalarWhereInput
    data: XOR<requirementsUpdateManyMutationInput, requirementsUncheckedUpdateManyWithoutProjectsInput>
  }

  export type requirementsScalarWhereInput = {
    AND?: requirementsScalarWhereInput | requirementsScalarWhereInput[]
    OR?: requirementsScalarWhereInput[]
    NOT?: requirementsScalarWhereInput | requirementsScalarWhereInput[]
    id?: UuidFilter<"requirements"> | string
    title?: StringFilter<"requirements"> | string
    description?: StringNullableFilter<"requirements"> | string | null
    priority?: StringNullableFilter<"requirements"> | string | null
    status?: StringNullableFilter<"requirements"> | string | null
    metadata?: JsonNullableFilter<"requirements">
    created_at?: DateTimeNullableFilter<"requirements"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"requirements"> | Date | string | null
    project_id?: UuidNullableFilter<"requirements"> | string | null
  }

  export type specbot_chatsUpsertWithWhereUniqueWithoutProjectsInput = {
    where: specbot_chatsWhereUniqueInput
    update: XOR<specbot_chatsUpdateWithoutProjectsInput, specbot_chatsUncheckedUpdateWithoutProjectsInput>
    create: XOR<specbot_chatsCreateWithoutProjectsInput, specbot_chatsUncheckedCreateWithoutProjectsInput>
  }

  export type specbot_chatsUpdateWithWhereUniqueWithoutProjectsInput = {
    where: specbot_chatsWhereUniqueInput
    data: XOR<specbot_chatsUpdateWithoutProjectsInput, specbot_chatsUncheckedUpdateWithoutProjectsInput>
  }

  export type specbot_chatsUpdateManyWithWhereWithoutProjectsInput = {
    where: specbot_chatsScalarWhereInput
    data: XOR<specbot_chatsUpdateManyMutationInput, specbot_chatsUncheckedUpdateManyWithoutProjectsInput>
  }

  export type specbot_chatsScalarWhereInput = {
    AND?: specbot_chatsScalarWhereInput | specbot_chatsScalarWhereInput[]
    OR?: specbot_chatsScalarWhereInput[]
    NOT?: specbot_chatsScalarWhereInput | specbot_chatsScalarWhereInput[]
    id?: UuidFilter<"specbot_chats"> | string
    title?: StringNullableFilter<"specbot_chats"> | string | null
    created_at?: DateTimeNullableFilter<"specbot_chats"> | Date | string | null
    user_id?: UuidNullableFilter<"specbot_chats"> | string | null
    project_id?: UuidNullableFilter<"specbot_chats"> | string | null
  }

  export type meetingsCreateWithoutRecordingsInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    users?: usersCreateNestedOneWithoutMeetingsInput
    projects?: projectsCreateNestedOneWithoutMeetingsInput
  }

  export type meetingsUncheckedCreateWithoutRecordingsInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
    project_id?: string | null
  }

  export type meetingsCreateOrConnectWithoutRecordingsInput = {
    where: meetingsWhereUniqueInput
    create: XOR<meetingsCreateWithoutRecordingsInput, meetingsUncheckedCreateWithoutRecordingsInput>
  }

  export type meetingsUpsertWithoutRecordingsInput = {
    update: XOR<meetingsUpdateWithoutRecordingsInput, meetingsUncheckedUpdateWithoutRecordingsInput>
    create: XOR<meetingsCreateWithoutRecordingsInput, meetingsUncheckedCreateWithoutRecordingsInput>
    where?: meetingsWhereInput
  }

  export type meetingsUpdateToOneWithWhereWithoutRecordingsInput = {
    where?: meetingsWhereInput
    data: XOR<meetingsUpdateWithoutRecordingsInput, meetingsUncheckedUpdateWithoutRecordingsInput>
  }

  export type meetingsUpdateWithoutRecordingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneWithoutMeetingsNestedInput
    projects?: projectsUpdateOneWithoutMeetingsNestedInput
  }

  export type meetingsUncheckedUpdateWithoutRecordingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type projectsCreateWithoutRequirementsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    feedbacks?: feedbacksCreateNestedManyWithoutProjectsInput
    group_chats?: group_chatsCreateNestedOneWithoutProjectsInput
    meetings?: meetingsCreateNestedManyWithoutProjectsInput
    users?: usersCreateNestedOneWithoutProjectsInput
    specbot_chats?: specbot_chatsCreateNestedManyWithoutProjectsInput
  }

  export type projectsUncheckedCreateWithoutRequirementsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
    feedbacks?: feedbacksUncheckedCreateNestedManyWithoutProjectsInput
    group_chats?: group_chatsUncheckedCreateNestedOneWithoutProjectsInput
    meetings?: meetingsUncheckedCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsUncheckedCreateNestedManyWithoutProjectsInput
  }

  export type projectsCreateOrConnectWithoutRequirementsInput = {
    where: projectsWhereUniqueInput
    create: XOR<projectsCreateWithoutRequirementsInput, projectsUncheckedCreateWithoutRequirementsInput>
  }

  export type projectsUpsertWithoutRequirementsInput = {
    update: XOR<projectsUpdateWithoutRequirementsInput, projectsUncheckedUpdateWithoutRequirementsInput>
    create: XOR<projectsCreateWithoutRequirementsInput, projectsUncheckedCreateWithoutRequirementsInput>
    where?: projectsWhereInput
  }

  export type projectsUpdateToOneWithWhereWithoutRequirementsInput = {
    where?: projectsWhereInput
    data: XOR<projectsUpdateWithoutRequirementsInput, projectsUncheckedUpdateWithoutRequirementsInput>
  }

  export type projectsUpdateWithoutRequirementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedbacks?: feedbacksUpdateManyWithoutProjectsNestedInput
    group_chats?: group_chatsUpdateOneWithoutProjectsNestedInput
    meetings?: meetingsUpdateManyWithoutProjectsNestedInput
    users?: usersUpdateOneWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUpdateManyWithoutProjectsNestedInput
  }

  export type projectsUncheckedUpdateWithoutRequirementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    feedbacks?: feedbacksUncheckedUpdateManyWithoutProjectsNestedInput
    group_chats?: group_chatsUncheckedUpdateOneWithoutProjectsNestedInput
    meetings?: meetingsUncheckedUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUncheckedUpdateManyWithoutProjectsNestedInput
  }

  export type projectsCreateWithoutSpecbot_chatsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    feedbacks?: feedbacksCreateNestedManyWithoutProjectsInput
    group_chats?: group_chatsCreateNestedOneWithoutProjectsInput
    meetings?: meetingsCreateNestedManyWithoutProjectsInput
    users?: usersCreateNestedOneWithoutProjectsInput
    requirements?: requirementsCreateNestedManyWithoutProjectsInput
  }

  export type projectsUncheckedCreateWithoutSpecbot_chatsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
    feedbacks?: feedbacksUncheckedCreateNestedManyWithoutProjectsInput
    group_chats?: group_chatsUncheckedCreateNestedOneWithoutProjectsInput
    meetings?: meetingsUncheckedCreateNestedManyWithoutProjectsInput
    requirements?: requirementsUncheckedCreateNestedManyWithoutProjectsInput
  }

  export type projectsCreateOrConnectWithoutSpecbot_chatsInput = {
    where: projectsWhereUniqueInput
    create: XOR<projectsCreateWithoutSpecbot_chatsInput, projectsUncheckedCreateWithoutSpecbot_chatsInput>
  }

  export type usersCreateWithoutSpecbot_chatsInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meetings?: meetingsCreateNestedManyWithoutUsersInput
    messages?: messagesCreateNestedManyWithoutUsersInput
    projects?: projectsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutSpecbot_chatsInput = {
    id?: string
    username: string
    password_hash: string
    role?: string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email: string
    profile_pic_url?: string | null
    display_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    meetings?: meetingsUncheckedCreateNestedManyWithoutUsersInput
    messages?: messagesUncheckedCreateNestedManyWithoutUsersInput
    projects?: projectsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutSpecbot_chatsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutSpecbot_chatsInput, usersUncheckedCreateWithoutSpecbot_chatsInput>
  }

  export type projectsUpsertWithoutSpecbot_chatsInput = {
    update: XOR<projectsUpdateWithoutSpecbot_chatsInput, projectsUncheckedUpdateWithoutSpecbot_chatsInput>
    create: XOR<projectsCreateWithoutSpecbot_chatsInput, projectsUncheckedCreateWithoutSpecbot_chatsInput>
    where?: projectsWhereInput
  }

  export type projectsUpdateToOneWithWhereWithoutSpecbot_chatsInput = {
    where?: projectsWhereInput
    data: XOR<projectsUpdateWithoutSpecbot_chatsInput, projectsUncheckedUpdateWithoutSpecbot_chatsInput>
  }

  export type projectsUpdateWithoutSpecbot_chatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedbacks?: feedbacksUpdateManyWithoutProjectsNestedInput
    group_chats?: group_chatsUpdateOneWithoutProjectsNestedInput
    meetings?: meetingsUpdateManyWithoutProjectsNestedInput
    users?: usersUpdateOneWithoutProjectsNestedInput
    requirements?: requirementsUpdateManyWithoutProjectsNestedInput
  }

  export type projectsUncheckedUpdateWithoutSpecbot_chatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    feedbacks?: feedbacksUncheckedUpdateManyWithoutProjectsNestedInput
    group_chats?: group_chatsUncheckedUpdateOneWithoutProjectsNestedInput
    meetings?: meetingsUncheckedUpdateManyWithoutProjectsNestedInput
    requirements?: requirementsUncheckedUpdateManyWithoutProjectsNestedInput
  }

  export type usersUpsertWithoutSpecbot_chatsInput = {
    update: XOR<usersUpdateWithoutSpecbot_chatsInput, usersUncheckedUpdateWithoutSpecbot_chatsInput>
    create: XOR<usersCreateWithoutSpecbot_chatsInput, usersUncheckedCreateWithoutSpecbot_chatsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutSpecbot_chatsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutSpecbot_chatsInput, usersUncheckedUpdateWithoutSpecbot_chatsInput>
  }

  export type usersUpdateWithoutSpecbot_chatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetings?: meetingsUpdateManyWithoutUsersNestedInput
    messages?: messagesUpdateManyWithoutUsersNestedInput
    projects?: projectsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutSpecbot_chatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    permissions?: NullableJsonNullValueInput | InputJsonValue
    email?: StringFieldUpdateOperationsInput | string
    profile_pic_url?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    meetings?: meetingsUncheckedUpdateManyWithoutUsersNestedInput
    messages?: messagesUncheckedUpdateManyWithoutUsersNestedInput
    projects?: projectsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type meetingsCreateWithoutUsersInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    projects?: projectsCreateNestedOneWithoutMeetingsInput
    recordings?: recordingsCreateNestedManyWithoutMeetingsInput
  }

  export type meetingsUncheckedCreateWithoutUsersInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    project_id?: string | null
    recordings?: recordingsUncheckedCreateNestedManyWithoutMeetingsInput
  }

  export type meetingsCreateOrConnectWithoutUsersInput = {
    where: meetingsWhereUniqueInput
    create: XOR<meetingsCreateWithoutUsersInput, meetingsUncheckedCreateWithoutUsersInput>
  }

  export type meetingsCreateManyUsersInputEnvelope = {
    data: meetingsCreateManyUsersInput | meetingsCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type messagesCreateWithoutUsersInput = {
    id?: string
    chat_type: string
    chat_id: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type messagesUncheckedCreateWithoutUsersInput = {
    id?: string
    chat_type: string
    chat_id: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type messagesCreateOrConnectWithoutUsersInput = {
    where: messagesWhereUniqueInput
    create: XOR<messagesCreateWithoutUsersInput, messagesUncheckedCreateWithoutUsersInput>
  }

  export type messagesCreateManyUsersInputEnvelope = {
    data: messagesCreateManyUsersInput | messagesCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type projectsCreateWithoutUsersInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    feedbacks?: feedbacksCreateNestedManyWithoutProjectsInput
    group_chats?: group_chatsCreateNestedOneWithoutProjectsInput
    meetings?: meetingsCreateNestedManyWithoutProjectsInput
    requirements?: requirementsCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsCreateNestedManyWithoutProjectsInput
  }

  export type projectsUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    feedbacks?: feedbacksUncheckedCreateNestedManyWithoutProjectsInput
    group_chats?: group_chatsUncheckedCreateNestedOneWithoutProjectsInput
    meetings?: meetingsUncheckedCreateNestedManyWithoutProjectsInput
    requirements?: requirementsUncheckedCreateNestedManyWithoutProjectsInput
    specbot_chats?: specbot_chatsUncheckedCreateNestedManyWithoutProjectsInput
  }

  export type projectsCreateOrConnectWithoutUsersInput = {
    where: projectsWhereUniqueInput
    create: XOR<projectsCreateWithoutUsersInput, projectsUncheckedCreateWithoutUsersInput>
  }

  export type projectsCreateManyUsersInputEnvelope = {
    data: projectsCreateManyUsersInput | projectsCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type specbot_chatsCreateWithoutUsersInput = {
    id?: string
    title?: string | null
    created_at?: Date | string | null
    projects?: projectsCreateNestedOneWithoutSpecbot_chatsInput
  }

  export type specbot_chatsUncheckedCreateWithoutUsersInput = {
    id?: string
    title?: string | null
    created_at?: Date | string | null
    project_id?: string | null
  }

  export type specbot_chatsCreateOrConnectWithoutUsersInput = {
    where: specbot_chatsWhereUniqueInput
    create: XOR<specbot_chatsCreateWithoutUsersInput, specbot_chatsUncheckedCreateWithoutUsersInput>
  }

  export type specbot_chatsCreateManyUsersInputEnvelope = {
    data: specbot_chatsCreateManyUsersInput | specbot_chatsCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type meetingsUpsertWithWhereUniqueWithoutUsersInput = {
    where: meetingsWhereUniqueInput
    update: XOR<meetingsUpdateWithoutUsersInput, meetingsUncheckedUpdateWithoutUsersInput>
    create: XOR<meetingsCreateWithoutUsersInput, meetingsUncheckedCreateWithoutUsersInput>
  }

  export type meetingsUpdateWithWhereUniqueWithoutUsersInput = {
    where: meetingsWhereUniqueInput
    data: XOR<meetingsUpdateWithoutUsersInput, meetingsUncheckedUpdateWithoutUsersInput>
  }

  export type meetingsUpdateManyWithWhereWithoutUsersInput = {
    where: meetingsScalarWhereInput
    data: XOR<meetingsUpdateManyMutationInput, meetingsUncheckedUpdateManyWithoutUsersInput>
  }

  export type messagesUpsertWithWhereUniqueWithoutUsersInput = {
    where: messagesWhereUniqueInput
    update: XOR<messagesUpdateWithoutUsersInput, messagesUncheckedUpdateWithoutUsersInput>
    create: XOR<messagesCreateWithoutUsersInput, messagesUncheckedCreateWithoutUsersInput>
  }

  export type messagesUpdateWithWhereUniqueWithoutUsersInput = {
    where: messagesWhereUniqueInput
    data: XOR<messagesUpdateWithoutUsersInput, messagesUncheckedUpdateWithoutUsersInput>
  }

  export type messagesUpdateManyWithWhereWithoutUsersInput = {
    where: messagesScalarWhereInput
    data: XOR<messagesUpdateManyMutationInput, messagesUncheckedUpdateManyWithoutUsersInput>
  }

  export type messagesScalarWhereInput = {
    AND?: messagesScalarWhereInput | messagesScalarWhereInput[]
    OR?: messagesScalarWhereInput[]
    NOT?: messagesScalarWhereInput | messagesScalarWhereInput[]
    id?: UuidFilter<"messages"> | string
    chat_type?: StringFilter<"messages"> | string
    chat_id?: UuidFilter<"messages"> | string
    content?: StringFilter<"messages"> | string
    metadata?: JsonNullableFilter<"messages">
    created_at?: DateTimeNullableFilter<"messages"> | Date | string | null
    sender_id?: UuidNullableFilter<"messages"> | string | null
  }

  export type projectsUpsertWithWhereUniqueWithoutUsersInput = {
    where: projectsWhereUniqueInput
    update: XOR<projectsUpdateWithoutUsersInput, projectsUncheckedUpdateWithoutUsersInput>
    create: XOR<projectsCreateWithoutUsersInput, projectsUncheckedCreateWithoutUsersInput>
  }

  export type projectsUpdateWithWhereUniqueWithoutUsersInput = {
    where: projectsWhereUniqueInput
    data: XOR<projectsUpdateWithoutUsersInput, projectsUncheckedUpdateWithoutUsersInput>
  }

  export type projectsUpdateManyWithWhereWithoutUsersInput = {
    where: projectsScalarWhereInput
    data: XOR<projectsUpdateManyMutationInput, projectsUncheckedUpdateManyWithoutUsersInput>
  }

  export type projectsScalarWhereInput = {
    AND?: projectsScalarWhereInput | projectsScalarWhereInput[]
    OR?: projectsScalarWhereInput[]
    NOT?: projectsScalarWhereInput | projectsScalarWhereInput[]
    id?: UuidFilter<"projects"> | string
    name?: StringFilter<"projects"> | string
    slug?: StringFilter<"projects"> | string
    description?: StringNullableFilter<"projects"> | string | null
    cover_image_url?: StringNullableFilter<"projects"> | string | null
    icon_url?: StringNullableFilter<"projects"> | string | null
    status?: StringNullableFilter<"projects"> | string | null
    start_date?: DateTimeNullableFilter<"projects"> | Date | string | null
    end_date?: DateTimeNullableFilter<"projects"> | Date | string | null
    tags?: JsonNullableFilter<"projects">
    members?: JsonNullableFilter<"projects">
    created_at?: DateTimeNullableFilter<"projects"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"projects"> | Date | string | null
    created_by?: UuidNullableFilter<"projects"> | string | null
  }

  export type specbot_chatsUpsertWithWhereUniqueWithoutUsersInput = {
    where: specbot_chatsWhereUniqueInput
    update: XOR<specbot_chatsUpdateWithoutUsersInput, specbot_chatsUncheckedUpdateWithoutUsersInput>
    create: XOR<specbot_chatsCreateWithoutUsersInput, specbot_chatsUncheckedCreateWithoutUsersInput>
  }

  export type specbot_chatsUpdateWithWhereUniqueWithoutUsersInput = {
    where: specbot_chatsWhereUniqueInput
    data: XOR<specbot_chatsUpdateWithoutUsersInput, specbot_chatsUncheckedUpdateWithoutUsersInput>
  }

  export type specbot_chatsUpdateManyWithWhereWithoutUsersInput = {
    where: specbot_chatsScalarWhereInput
    data: XOR<specbot_chatsUpdateManyMutationInput, specbot_chatsUncheckedUpdateManyWithoutUsersInput>
  }

  export type recordingsCreateManyMeetingsInput = {
    id?: string
    title?: string | null
    recording_url?: string | null
    transcript_url?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type recordingsUpdateWithoutMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    recording_url?: NullableStringFieldUpdateOperationsInput | string | null
    transcript_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type recordingsUncheckedUpdateWithoutMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    recording_url?: NullableStringFieldUpdateOperationsInput | string | null
    transcript_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type recordingsUncheckedUpdateManyWithoutMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    recording_url?: NullableStringFieldUpdateOperationsInput | string | null
    transcript_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type feedbacksCreateManyProjectsInput = {
    id?: string
    title?: string | null
    description?: string | null
    status?: string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type meetingsCreateManyProjectsInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    created_by?: string | null
  }

  export type requirementsCreateManyProjectsInput = {
    id?: string
    title: string
    description?: string | null
    priority?: string | null
    status?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type specbot_chatsCreateManyProjectsInput = {
    id?: string
    title?: string | null
    created_at?: Date | string | null
    user_id?: string | null
  }

  export type feedbacksUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type feedbacksUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type feedbacksUncheckedUpdateManyWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    form_structure?: NullableJsonNullValueInput | InputJsonValue
    response?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type meetingsUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneWithoutMeetingsNestedInput
    recordings?: recordingsUpdateManyWithoutMeetingsNestedInput
  }

  export type meetingsUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    recordings?: recordingsUncheckedUpdateManyWithoutMeetingsNestedInput
  }

  export type meetingsUncheckedUpdateManyWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type requirementsUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type requirementsUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type requirementsUncheckedUpdateManyWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type specbot_chatsUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: usersUpdateOneWithoutSpecbot_chatsNestedInput
  }

  export type specbot_chatsUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type specbot_chatsUncheckedUpdateManyWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type meetingsCreateManyUsersInput = {
    id?: string
    title?: string | null
    description?: string | null
    type?: string | null
    status?: string | null
    link?: string | null
    room_id?: string | null
    scheduled_at?: Date | string | null
    started_at?: Date | string | null
    ended_at?: Date | string | null
    is_recurring?: boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    project_id?: string | null
  }

  export type messagesCreateManyUsersInput = {
    id?: string
    chat_type: string
    chat_id: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type projectsCreateManyUsersInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    cover_image_url?: string | null
    icon_url?: string | null
    status?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type specbot_chatsCreateManyUsersInput = {
    id?: string
    title?: string | null
    created_at?: Date | string | null
    project_id?: string | null
  }

  export type meetingsUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projects?: projectsUpdateOneWithoutMeetingsNestedInput
    recordings?: recordingsUpdateManyWithoutMeetingsNestedInput
  }

  export type meetingsUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
    recordings?: recordingsUncheckedUpdateManyWithoutMeetingsNestedInput
  }

  export type meetingsUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    room_id?: NullableStringFieldUpdateOperationsInput | string | null
    scheduled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ended_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_recurring?: NullableBoolFieldUpdateOperationsInput | boolean | null
    participants?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type messagesUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    chat_type?: StringFieldUpdateOperationsInput | string
    chat_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type messagesUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    chat_type?: StringFieldUpdateOperationsInput | string
    chat_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type messagesUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    chat_type?: StringFieldUpdateOperationsInput | string
    chat_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type projectsUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedbacks?: feedbacksUpdateManyWithoutProjectsNestedInput
    group_chats?: group_chatsUpdateOneWithoutProjectsNestedInput
    meetings?: meetingsUpdateManyWithoutProjectsNestedInput
    requirements?: requirementsUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUpdateManyWithoutProjectsNestedInput
  }

  export type projectsUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedbacks?: feedbacksUncheckedUpdateManyWithoutProjectsNestedInput
    group_chats?: group_chatsUncheckedUpdateOneWithoutProjectsNestedInput
    meetings?: meetingsUncheckedUpdateManyWithoutProjectsNestedInput
    requirements?: requirementsUncheckedUpdateManyWithoutProjectsNestedInput
    specbot_chats?: specbot_chatsUncheckedUpdateManyWithoutProjectsNestedInput
  }

  export type projectsUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    icon_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    members?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type specbot_chatsUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projects?: projectsUpdateOneWithoutSpecbot_chatsNestedInput
  }

  export type specbot_chatsUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type specbot_chatsUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}