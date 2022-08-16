import { FC } from 'react'
import { useCallback } from 'react'
import { EditorView } from 'codemirror'
import { keymap, KeyBinding } from '@codemirror/view'
import ReactCodeMirror, { ReactCodeMirrorProps, ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { StreamLanguage } from '@codemirror/language'
import { json } from '@codemirror/legacy-modes/mode/javascript'
import { sublime } from '@uiw/codemirror-theme-sublime'

// TODO: look into https://discuss.codemirror.net/t/keymap-for-bold-text-in-lang-markdown/3150
const MarkdownEditor: FC<
  {
    themeDefinition?: {
      background: string
      foreground: string
      caret: string
      selection: string
      selectionMatch: string
      lineHighlight: string
      gutterBackground: string
      gutterForeground: string
    }
    handleSubmit?: (value?: string) => void
  } & ReactCodeMirrorProps &
    React.RefAttributes<ReactCodeMirrorRef>
> = (props) => {
  const customKeyMap: KeyBinding[] = [
    {
      key: 'Enter',
      shift: () => {
        return false
      },
      run: () => {
        props.handleSubmit?.(props.value ?? '')
        return true
      },
    },
  ]

  const { onChange, handleSubmit, themeDefinition, ...restProps } = props
  const handleChange = useCallback((value: string) => onChange?.(value, undefined as any), [onChange])
  return (
    <ReactCodeMirror
      {...restProps}
      basicSetup={{
        lineNumbers: false,
        foldGutter: true,
        highlightActiveLine: true,
        defaultKeymap: false,
      }}
      theme={sublime}
      extensions={[keymap.of([...customKeyMap]), EditorView.lineWrapping, StreamLanguage.define(json)]}
      onChange={handleChange}
    />
  )
}

export default MarkdownEditor
