import {useGlobalRegistry} from './GlobalRegistry';

export function useI18n() {
    const globalRegistry = useGlobalRegistry();
    const i18nRegistry = globalRegistry.get('i18n');

    return (
        idOrig: string,
        fallbackOrig?: string,
        params: Record<string, string> = {},
        packageKeyOrig: string = 'Neos.Neos',
        sourceNameOrig: string = 'Main',
        quantity: number = 0
    ) => (i18nRegistry as any).translate(
        idOrig,
        fallbackOrig,
        params,
        packageKeyOrig,
        sourceNameOrig,
        quantity
    );
}