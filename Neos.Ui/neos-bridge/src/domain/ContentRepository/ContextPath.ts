import {Any} from 'ts-toolbelt';

export type Path = Any.Type<string, 'NodePath'>;
export type Context = Any.Type<string, 'ContentContext'>;

export class ContextPath {
    private constructor(
        public readonly path: Path,
        public readonly context: Context
    ) { }

    public static fromString(string: string): null | ContextPath {
        const [path, context] = (string ?? '').split('@');

        if (path && string) {
            return new ContextPath(path as Path, context as Context);
        }

        return null;
    }

    public adopt(pathLike: string): null | ContextPath {
        const [path] = (pathLike ?? '').split('@');

        if (path) {
            return new ContextPath(path as Path, this.context);
        }

        return null;
    }

    public getIntermediateContextPaths(other: ContextPath): ContextPath[] {
        if (other.path.startsWith(this.path)) {
            const segments = other.path.split('/');
            const result: ContextPath[] = [];

            for (const [index] of segments.entries()) {
                const path = segments.slice(0, -index).join('/');
                if (path) {
                    result.push(new ContextPath(path as Path, this.context));
                }

                if (path === this.path) {
                    break;
                }
            }

            return result;
        }

        return [];
    }

    public toString(): string {
        return `${this.path}@${this.context}`;
    }
}
