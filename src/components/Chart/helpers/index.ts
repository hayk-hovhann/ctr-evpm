
export const setVariant: SetVariantHelper = (type, apiType) => type === apiType ? `contained` : `outlined`

export type ImpressionType = `CTR` | `EV_PM` | `CTR_EV_PM`
export type SetVariantHelper = (type: ImpressionType, apiType: ImpressionType) => `contained` | `outlined`