// src/rest/types/products/ListProductsParams.ts
export interface ListProductsParams {
    limit?: number;
    offset?: number;
    product_type?: 'FUTURE' | 'SPOT';
    product_ids?: string[];
    contract_expiry_type?: 'UNKNOWN_CONTRACT_EXPIRY_TYPE' | 'EXPIRING' | 'PERPETUAL';
    expiring_contract_status?: 'UNKNOWN_EXPIRING_CONTRACT_STATUS' | 'STATUS_UNEXPIRED' | 'STATUS_EXPIRED' | 'STATUS_ALL';
    get_tradability_status?: boolean;
}
