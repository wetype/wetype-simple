# 注册 App

## App

* 类型： `class`

### App.decor([,opts])

* opts < Object >

  * config < Object >

* 用法：

```typescript
import { App } from 'wetype'

@App.decor({
  config: {
    // app.json goes here...
  }
})
class MyFirstWetypeProject extends App {
  onLaunch() {}
}
```
