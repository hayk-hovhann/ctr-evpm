export type StateType = {
    "reg_time": string
    "uid": string
    "fc_imp_chk": string
    "fc_time_chk": string
    "utmtr": string
    "mm_dma": string
    "osName": string
    "model": string
    "hardware": string
    "site_id": string
}

export type AlignmentType = "mm_dma" | "site_id"

export type ClickEventType = `ctr`|`evpm`