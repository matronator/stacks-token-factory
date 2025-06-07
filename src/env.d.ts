/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_ONIGASM_PATH: string
    readonly VITE_STX_CHAIN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
