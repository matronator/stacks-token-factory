import { wireTmGrammars } from 'monaco-editor-textmate';
import { IGrammarDefinition, Registry } from 'monaco-textmate';
import { loadWASM } from 'onigasm';
import { Monaco } from '@monaco-editor/react';

export async function liftOff(
  monaco: Monaco,
  claritySyntax: Record<string, any>
) {
  try {
    await loadWASM(import.meta.env.VITE_ONIGASM_PATH);
    const registry = new Registry({
      getGrammarDefinition: (scopeName) =>
        Promise.resolve({
          format: "json",
          content: claritySyntax,
        } as IGrammarDefinition),
    });

    const grammars = new Map();
    grammars.set("clarity", "source.clarity");
    await wireTmGrammars(monaco, registry, grammars);
    return true;
  } catch (e) {}
}
