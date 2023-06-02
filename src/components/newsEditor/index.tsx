import { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

export default function NewsEditor(props: { getContent: Function }) {
  const [editorState, setEditorState] = useState<EditorState>()
  const { getContent } = props

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
