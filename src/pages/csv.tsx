import { NextPage } from 'next'
import Head from 'next/head'
import MainLayout from '../layouts/main'
import * as Toggle from '@radix-ui/react-toggle'
import React, { useEffect, useState } from 'react'
import Clipboard from '../components/clipboard'
import JsonEditor from '../components/editor/json-editor'
import { SparklesIcon } from '@heroicons/react/outline'
import CSV from 'csvtojson'

const TextArea: React.FC<{
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  value: string
  readOnly?: boolean
}> = (props) => (
  <textarea
    {...props}
    className="overflow-hidden rounded-lg bg-[#303841] border-brand-dark max-h-[60vh] min-h-[10em] text-white/90 w-full"
  ></textarea>
)

const CSVEditor: React.FC<{
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  value: string
  readOnly?: boolean
}> = (props) => {
  const colors = [
    'text-red-300',
    'text-green-300',
    'text-orange-300',
    'text-blue-300',
    'text-yellow-300',
    'text-purple-300',
  ]
  return (
    <div className="overflow-hidden max-h-[60vh] min-h-[10em] rounded-lg">
      <div className="grid relative overflow-auto h-full rounded-lg bg-[#303841] border-brand-dark w-full font-mono">
        <textarea
          spellCheck={false}
          {...props}
          className="text-transparent w-full appearance-none bg-transparent h-full resize-none overflow-hidden font-mono tracking-normal !outline-none border-transparent focus:border-transparent"
          style={{ caretColor: 'white', gridArea: '1 / 1 / 2 / 2', font: 'inherit' }}
        ></textarea>
        <div
          className="inset-0 pointer-events-none bg-transparent whitespace-pre-wrap font-mono tracking-normal border border-transparent"
          type="text"
          style={{ gridArea: '1 / 1 / 2 / 2', font: 'inherit' }}
        >
          {props.value.split('\n').map((line, i) => {
            return (
              <div key={'line' + i}>
                {line.split(',').map((value, j) => {
                  return (
                    <span key={'line' + i + 'value' + j}>
                      <span className={colors[j % 6]}>{value}</span>
                      {j < line.split(',').length - 1 && (
                        <span className={colors[j % 6] + ' opacity-80 filter brightness-75'}>,</span>
                      )}
                    </span>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const Csv: NextPage = () => {
  const [convertToJSON, setConvertToJSON] = useState(true)
  const [noHeader, setNoHeader] = useState(false)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const parseCSV = (value: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      CSV({
        output: noHeader ? 'csv' : 'json',
        noheader: noHeader,
        trim: true,
        delimiter: 'auto',
      })
        .fromString(value)
        .then((value) => {
          if (value) {
            resolve(JSON.stringify(value, null, 2))
          } else {
            reject(new Error('failed to parse'))
          }
        })
    })
  }

  const parseJSON = (value: string) => {
    const parsed: any[] = JSON.parse(value)
    if (Array.isArray(parsed[0])) {
      return parsed.map((line) => line.join(',')).join('\n')
    }
    return [Object.keys(parsed[0]), ...parsed.map((line) => Object.values(line).join(','))].join('\n')
  }

  useEffect(() => {
    try {
      if (convertToJSON) {
        setInput(input.replaceAll('\n\n', '\n'))
        parseCSV(input).then((value) => {
          setOutput(value)
        })
      } else {
        setOutput(parseJSON(input))
      }
    } catch (err) {
      console.log(err)
    }
  }, [input, output, convertToJSON, noHeader])

  return (
    <>
      <Head>
        <title>CSV Tools</title>
        <meta name="description" content="Convert between CSV and JSON" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout mainClass="grid grid-rows-[auto,1fr] gap-8 max-w-4xl w-full mx-auto py-8 md:py-16 px-4 overflow-y-auto overflow-x-hidden">
        <header className="flex gap-4 items-center justify-between">
          <h1 className="text-2xl text-pink-100/90 font-medium">CSV Tools</h1>
        </header>
        <div className="grid grid-rows-[max-content,max-content] md:grid-rows-1 md:grid-cols-2 gap-8">
          <section aria-label="Input" className="h-full grid grid-rows-[max-content,max-content] gap-2">
            <div className="text-white/70 text-xl font-medium flex items-center gap-2">
              <h3>Input:</h3>
              <Toggle.Root
                pressed={convertToJSON}
                defaultPressed={true}
                onPressedChange={(value) => {
                  setConvertToJSON(value)
                }}
                aria-label="Conversion Mode"
                className="p-2 rounded [&[data-state=on]]:bg-purple-800 bg-indigo-800 text-sm font-semibold text-white/80"
              >
                {convertToJSON ? 'CSV' : 'JSON'}
              </Toggle.Root>
              {convertToJSON && (
                <button
                  className="hover:bg-blue-700/30 transition duration-150 p-2 text-sm rounded hover:shadow ml-auto"
                  onClick={() => {
                    setNoHeader(!noHeader)
                  }}
                >
                  {noHeader ? 'Without Header' : 'With Header'}
                </button>
              )}
              {!convertToJSON && (
                <button
                  className="hover:bg-blue-700/30 transition duration-150 p-2 text-sm rounded hover:shadow ml-auto"
                  onClick={() => {
                    try {
                      setInput(JSON.stringify(JSON.parse(input), null, 2))
                    } catch (error) {
                      console.log(error)
                    }
                  }}
                >
                  <SparklesIcon className="w-5 h-5 text-white/90"></SparklesIcon>
                </button>
              )}
            </div>
            {convertToJSON ? (
              <CSVEditor value={input} onChange={(e) => setInput(e.target.value)}></CSVEditor>
            ) : (
              <div>
                <JsonEditor
                  className="overflow-hidden rounded-lg"
                  minHeight="10em"
                  maxHeight="60vh"
                  value={input}
                  onChange={(value) => setInput(value)}
                ></JsonEditor>
              </div>
            )}
          </section>
          <section aria-label="Output" className="h-full grid grid-rows-[max-content,max-content] gap-2">
            <div className="text-white/70 text-xl font-medium flex items-center gap-2">
              <h3>Output:</h3>
              <div className="p-2 rounded bg-slate-600/80 text-sm font-semibold text-white filter saturate-[0.75] brightness-75">
                {convertToJSON ? 'JSON' : 'CSV'}
              </div>
              <Clipboard
                className="w-24 bg-blue-700 p-2 text-sm rounded shadow flex gap-1 items-center justify-between ml-auto"
                copyText={output}
              ></Clipboard>
            </div>
            {convertToJSON ? (
              <div>
                <JsonEditor
                  className="overflow-hidden rounded-lg"
                  minHeight="10em"
                  maxHeight="60vh"
                  readOnly={true}
                  value={output}
                ></JsonEditor>
              </div>
            ) : (
              <CSVEditor readOnly={true} value={output}></CSVEditor>
            )}
          </section>
        </div>
      </MainLayout>
    </>
  )
}

export default Csv
