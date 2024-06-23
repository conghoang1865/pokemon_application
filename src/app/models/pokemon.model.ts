//core
export interface BaseResponse {
    status: number
    success: boolean
    data: any
    error: ErrorType
}

export interface ErrorType {
    code: string
    message: string
}

export interface PokemonItem {
    id: string
    number: number
    name: string
    type_1: number
    type_2: number
    total: number
    hp: number
    attack: number
    defense: number
    sp_atk: number
    sp_def: number
    speed: number
    generation: number
    legendary: number
    created_at: string
    updated_at: string
}

export interface ResponseData extends BaseResponse {
    data: PokemonItem[]
    links: Links
    meta: Meta
}

export interface Links {
    first: string
    last: string
    prev: any
    next: string
}

export interface Meta {
    per_page: number
    current_page: number
    from: number
    to: number
    total: number
    last_page: number
    path: string
}


export interface types extends BaseResponse {
    data: TypeData[]
}

export interface TypeData {
    id: number
    name: string
}

export interface PokemonDetail extends BaseResponse {
    data: PokemonItem
}