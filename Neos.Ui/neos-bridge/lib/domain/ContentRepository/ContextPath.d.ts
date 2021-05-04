import { Any } from 'ts-toolbelt';
export declare type Path = Any.Type<string, 'NodePath'>;
export declare type Context = Any.Type<string, 'ContentContext'>;
export declare class ContextPath {
    readonly path: Path;
    readonly context: Context;
    private constructor();
    static fromString(string: string): null | ContextPath;
    adopt(pathLike: undefined | null | string): null | ContextPath;
    getIntermediateContextPaths(other: ContextPath): ContextPath[];
    equals(other: ContextPath): boolean;
    toString(): string;
    get depth(): number;
}
export declare function useSiteNodeContextPath(): null | ContextPath;
export declare function useDocumentNodeContextPath(): null | ContextPath;
