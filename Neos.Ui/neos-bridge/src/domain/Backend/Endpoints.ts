import backend from '@neos-project/neos-ui-backend-connector';

export const endpoints = () => backend.get().endpoints as {
    searchNodes: (options: any) => Promise<any>
    assetDetail: (assetIdentifier: string) => Promise<any>
};