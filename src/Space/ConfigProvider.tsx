// 配置 ConfigProvider 包裹
import { createContext, PropsWithChildren } from "react"
import { SizeType } from "."

// 这样使用的时候是这样的：<ConfigContext.Provider value={{ space: { size: 20 }}}>
export interface ConfigContextType {
    space?: {
        size?: SizeType
    }
}

export const ConfigContext = createContext<ConfigContextType>({});

// 进行包裹，使用时变成这样：<ConfigProvider space={{ size: 20 }}>
interface ConfigProviderProps extends PropsWithChildren<ConfigContextType>{
}

export function ConfigProvider(props: ConfigProviderProps) {
  const {
    space,
    children
  } = props;

  return <ConfigContext.Provider value={{ space }}>{children}</ConfigContext.Provider>
}