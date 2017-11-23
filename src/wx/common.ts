export interface Options<T> {
    success?(res: T): void
    fail?(): void
    complete?(): void
}