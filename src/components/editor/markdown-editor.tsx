// dependencies:
// codemirror @codemirror/view @codemirror/commands @uiw/react-codemirror @codemirror/language-data @uiw/codemirror-themes @lezer/highlight @codemirror/state @codemirror/lang-markdown
import { FC } from 'react'
import { useCallback } from 'react'
import { EditorView } from 'codemirror'
import { keymap, KeyBinding } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import ReactCodeMirror, { ReactCodeMirrorProps, ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'
import { EditorSelection, StateCommand, Text, Transaction } from '@codemirror/state'

const TextWrappingFactory = (token: string) => {
  const res: StateCommand = ({ state, dispatch }) => {
    const changes = state.changeByRange((range) => {
      return {
        changes: [
          {
            from: range.from,
            insert: Text.of([token]),
          },
          {
            from: range.to,
            insert: Text.of([token]),
          },
        ],
        range: EditorSelection.range(range.from + token.length, range.to + token.length),
      }
    })

    dispatch(
      state.update(changes, {
        scrollIntoView: true,
        annotations: Transaction.userEvent.of('input'),
      })
    )

    return true
  }
  return res
}

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
      key: 'Mod-b',
      run: TextWrappingFactory('**'),
    },
    {
      key: 'Mod-i',
      run: TextWrappingFactory('_'),
    },
    {
      key: 'Mod-m',
      run: TextWrappingFactory('`'),
    },
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

  const theme = createTheme({
    theme: 'light',
    settings: props.themeDefinition ?? {
      background: '#ffffff',
      foreground: '#000000',
      caret: '#059669',
      selection: '#036dd626',
      selectionMatch: '#036dd626',
      lineHighlight: '#6ee7b720',
      gutterBackground: '#ffffff00',
      gutterForeground: '#bae6fd20',
    },
    styles: [
      { tag: t.string, class: 'text-base' },
      { tag: t.heading1, class: 'text-[1.75em] sm:text-[2.25em] text-pink-300' },
      { tag: t.heading2, class: 'text-[1.4em] sm:text-[1.5em] text-rose-300' },
      { tag: t.heading3, class: 'text-[1.25em] text-pink-200' },
      { tag: t.heading4, class: 'text-[1.125em] text-rose-200 font-semibold' },
      { tag: t.comment, class: 'italic text-gray-400' },
      { tag: t.emphasis, class: 'italic text-lime-200' },
      { tag: t.strong, class: 'font-semibold text-cyan-400' },
    ],
  })

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
      extensions={[
        keymap.of([...customKeyMap]),
        EditorView.lineWrapping,
        markdown({ base: markdownLanguage, codeLanguages: languages }),
      ]}
      theme={theme}
      onChange={handleChange}
    />
  )
}

export default MarkdownEditor
