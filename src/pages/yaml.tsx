import { NextPage } from 'next'
import Head from 'next/head'
import MainLayout from '../layouts/main'
import * as Toggle from '@radix-ui/react-toggle'
import YAML from 'yaml'
import React, { useEffect, useState } from 'react'
import Clipboard from '../components/clipboard'
import JsonEditor from '../components/editor/json-editor'
import YamlEditor from '../components/editor/yaml-editor'
import { SparklesIcon } from '@heroicons/react/outline'

const Yaml: NextPage = () => {
  const [convertToYAML, setConvertToYAML] = useState(true)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  useEffect(() => {
    try {
      if (convertToYAML) {
        setOutput(YAML.stringify(JSON.parse(input)))
      } else {
        setOutput(JSON.stringify(YAML.parse(input), null, 2))
      }
    } catch (err) {
      console.log(err)
    }
  }, [input, output, convertToYAML])

  return (
    <>
      <Head>
        <title>YAML Tools</title>
        <meta name="description" content="Convert between JSON and YAML" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout mainClass="grid grid-rows-[auto,1fr] gap-8 max-w-4xl w-full mx-auto py-8 md:py-16 px-4 overflow-y-auto overflow-x-hidden">
        <header className="flex gap-4 items-center justify-between">
          <h1 className="text-2xl text-pink-100/90 font-medium">YAML Tools</h1>
        </header>
        <div className="grid grid-rows-[max-content,max-content] md:grid-rows-1 md:grid-cols-2 gap-8">
          <section aria-label="Input" className="h-full grid grid-rows-[max-content,max-content] gap-2">
            <div className="text-white/70 text-xl font-medium flex items-center gap-2">
              <h3>Input:</h3>
              <Toggle.Root
                pressed={convertToYAML}
                defaultPressed={true}
                onPressedChange={(value) => {
                  setConvertToYAML(value)
                }}
                aria-label="Conversion Mode"
                className="p-2 rounded [&[data-state=on]]:bg-purple-800 bg-indigo-800 text-sm font-semibold text-white/80"
              >
                {convertToYAML ? 'JSON' : 'YAML'}
              </Toggle.Root>
              {convertToYAML && (
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
            <div>
              {convertToYAML ? (
                <JsonEditor
                  className="overflow-hidden rounded-lg"
                  minHeight="10em"
                  maxHeight="60vh"
                  value={input}
                  onChange={(value) => setInput(value)}
                ></JsonEditor>
              ) : (
                <YamlEditor
                  className="overflow-hidden rounded-lg"
                  minHeight="10em"
                  maxHeight="60vh"
                  value={input}
                  onChange={(value) => setInput(value)}
                ></YamlEditor>
              )}
            </div>
          </section>
          <section aria-label="Output" className="h-full grid grid-rows-[max-content,max-content] gap-2">
            <div className="text-white/70 text-xl font-medium flex items-center gap-2">
              <h3>Output:</h3>
              <div className="p-2 rounded bg-slate-600/80 text-sm font-semibold text-white filter saturate-[0.75] brightness-75">
                {convertToYAML ? 'YAML' : 'JSON'}
              </div>
              <Clipboard
                className="w-24 bg-blue-700 p-2 text-sm rounded shadow flex gap-1 items-center justify-between ml-auto"
                copyText={output}
              ></Clipboard>
            </div>
            <div>
              {convertToYAML ? (
                <YamlEditor
                  className="overflow-hidden rounded-lg"
                  minHeight="10em"
                  maxHeight="60vh"
                  readOnly={true}
                  value={output}
                ></YamlEditor>
              ) : (
                <JsonEditor
                  className="overflow-hidden rounded-lg"
                  minHeight="10em"
                  maxHeight="60vh"
                  readOnly={true}
                  value={output}
                ></JsonEditor>
              )}
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  )
}

export default Yaml
