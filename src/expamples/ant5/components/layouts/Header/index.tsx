import { ConfigProvider, theme } from "antd"
import { forwardRef, memo, CSSProperties } from "react"
import { Trigger } from "../Trigger"
import { HeaderInner } from "./HeaderInner"

export type HeaderProps = {
  style?: CSSProperties
  hasTrigger?: boolean
  dark?: boolean,
  children?: React.ReactNode,
  sticky?: boolean,
}

export const Header = memo(forwardRef<HTMLDivElement, HeaderProps>((
  props, ref) => {
  const { hasTrigger = true, dark, children, ...other } = props;

  return (
    <ConfigProvider
      theme={{
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <HeaderInner
        ref={ref}
        {...other}
      >
        {hasTrigger && <Trigger />}
        {children}
      </HeaderInner>
    </ConfigProvider>
  )
}))