import MonacoEditor from '@monaco-editor/react';
import { defaultComment } from './codeTemplates';

interface EditorProps {
  sourceCode: string;
}

const Editor = ({ sourceCode = defaultComment }: EditorProps) => {
  return (
    <MonacoEditor
      height="100vh"
      defaultLanguage="typescript"
      theme="vs-dark"
      defaultValue={defaultComment}
      value={sourceCode}
      options={{
        minimap: { enabled: false },
      }}
    />
  );
};

export default Editor;
