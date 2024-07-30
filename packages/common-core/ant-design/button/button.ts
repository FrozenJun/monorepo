import { Button } from 'ant-design-vue'
import { DefineComponent } from 'vue'

export const componentWrapper = (component: any) => {
  console.log(component)
  return component
}
componentWrapper(Button)

export const withMergePropsHoc = (WrappedComponent: DefineComponent<object, object, any>) => {
  return {
    props: {
      ...WrappedComponent.props,
    },
    ...WrappedComponent,
  }
}
