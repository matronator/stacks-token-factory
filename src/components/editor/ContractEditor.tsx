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
    <div className='w-full bg-gray-900 rounded-md h-96 relative'>
      <Editor
        beforeMount={handleEditorWillMount}
        onMount={(editor, monaco) => {
          editor.updateOptions({
            wordSeparators: "`~!@#$%^&*()=+[{]}\\|;:'\",.<>/?",
          });

          editor.onKeyDown((event) => {
            const { keyCode, ctrlKey, metaKey } = event;
            if ((keyCode === 33 || keyCode === 52) && (metaKey || ctrlKey)) {
              event.preventDefault();
            }
          });

          editor.onMouseDown((event) => {
            if (event.event.rightButton || event.event.altKey || event.event.ctrlKey) {
              editor.setSelection(new monaco.Selection(0, 0, 0, 0));
            }
          });

          editor.onDidChangeCursorSelection(event => {
            editor.setSelection(new monaco.Selection(0, 0, 0, 0));
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
