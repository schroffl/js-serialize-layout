export type Layout<T> = {
  [K in keyof T]:
    LayoutProperty<T[K]>
}

export type LayoutProperty<T>
  = null
  | string
  | LayoutObject
  | LayoutMapper<T>

export type LayoutObject = {
  key?: string,
  exclude?: boolean
}

export interface LayoutMapper<T> extends LayoutObject {
  from?: (value: any, input: any) => T,
  to?: (value: T, input: any) => any
}

export function deserialize<T>(ctor: new () => T, layout: Layout<T>, data: any, input?: any) : T

export function serialize<T>(layout: Layout<T>, obj: T, input?: any) : any

export class Serializable<T> {
  public static deserialize<T>(data: any, input?: any) : T
  public static serialize<T>(obj: T, input?: any) : any
}

export type Wrapper<T> = {
  deserialize: (data: any, input?: any) => T
  serialize: (obj: T, input?: any) => any
}

export function wrap<T>(ctor: new () => T, layout: Layout<T>) : Wrapper<T>

export function makeSerializable<T extends Serializable<T>>(ctor: new () => T, layout: Layout<T>) : void
