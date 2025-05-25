import { useCallback, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { claritySyntax } from './config/claritySyntax';
import { defineTheme } from './config/defineTheme';
import { liftOff } from './config/init';
import { configLanguage } from './config/language';

interface ContractEditorProps {
  contractBody: string;
}

function ContractEditor(props: ContractEditorProps) {
  const [loaded, setLoaded] = useState(false);
  const handleEditorWillMount = useCallback(
    async (monaco: Monaco) => {
      if (!loaded) {
        configLanguage(monaco);
        defineTheme(monaco);
        await liftOff(monaco, claritySyntax);

        setLoaded(true);
      }
    },
    [loaded]
  );

  return (
    <div className='w-full bg-gray-900 rounded-md h-96'>
      <Editor
        beforeMount={handleEditorWillMount}
        onMount={(editor) => {
          editor.updateOptions({
            wordSeparators: "`~!@#$%^&*()=+[{]}\\|;:'\",.<>/?",
          });
        }}
        className="clarity-editor"
        defaultLanguage="clarity"
        theme="vs-dark"
        value={props.contractBody}
        options={{
          readOnly: true,
          contextmenu: false,
          fontLigatures: true,
          fontSize: 14,
          minimap: {
            enabled: false,
          },
          emptySelectionClipboard: true,
          selectionClipboard: false,
          copyWithSyntaxHighlighting: true,
          domReadOnly: true,
          dragAndDrop: false,
          stickyScroll: {
            enabled: false,
          }
        }}
      />
    </div>
  );
};

export default ContractEditor;
