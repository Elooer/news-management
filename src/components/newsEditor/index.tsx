import { useState, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { ContentState } from 'draft-js'

interface Props {
  getContent: Function
  content: string
}

export default function NewsEditor(props: Props) {
  const [editorState, setEditorState] = useState<EditorState>()
  const { getContent, content } = props

  useEffect(() => {
    if (content === undefined) return
    const contentBlock = htmlToDraft(content)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      )
      const editorState = EditorState.createWithContent(contentState)
      setEditorState(editorState)
    }
  }, [content])

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={editorState => setEditorState(editorState)}
        onBlur={() => {
          getContent(
            draftToHtml(convertToRaw(editorState!.getCurrentContent()))
          )
        }}
      />
    </div>
  )
}
