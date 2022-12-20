import { ElNotificationOptions } from 'element-ui/types/notification'

declare module 'element-ui/types/notification' {
  interface ElNotificationOptions {
    btnText?: string
    onLater?: () => void
    onTodo?: () => void
  }
}

