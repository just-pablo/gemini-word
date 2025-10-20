import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { save, open } from "@tauri-apps/api/dialog";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  FileText,
  FolderOpen,
  Save,
  Download
} from "lucide-react";
import "./App.css";

interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  font_size: number;
  font_family: string;
  color: string;
  alignment: string;
}

interface Paragraph {
  text: string;
  formatting: TextFormatting;
}

interface DocumentContent {
  paragraphs: Paragraph[];
}

function App() {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<DocumentContent>({
    paragraphs: []
  });
  const [currentFormatting, setCurrentFormatting] = useState<TextFormatting>({
    bold: false,
    italic: false,
    underline: false,
    font_size: 11,
    font_family: "Calibri",
    color: "#000000",
    alignment: "left"
  });
  const editorRef = useRef<HTMLDivElement>(null);

  // Handle text formatting
  const applyFormat = (format: keyof TextFormatting, value?: any) => {
    const newFormatting = { ...currentFormatting };

    if (format === 'bold' || format === 'italic' || format === 'underline') {
      newFormatting[format] = !newFormatting[format];
    } else {
      newFormatting[format] = value;
    }

    setCurrentFormatting(newFormatting);

    // Apply to selection
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      document.execCommand(format === 'bold' ? 'bold' :
                          format === 'italic' ? 'italic' :
                          format === 'underline' ? 'underline' : '', false);
    }
  };

  const applyAlignment = (alignment: string) => {
    setCurrentFormatting({ ...currentFormatting, alignment });
    const command = alignment === 'left' ? 'justifyLeft' :
                    alignment === 'center' ? 'justifyCenter' :
                    alignment === 'right' ? 'justifyRight' :
                    alignment === 'justify' ? 'justifyFull' : 'justifyLeft';
    document.execCommand(command, false);
  };

  const changeFontSize = (size: number) => {
    setCurrentFormatting({ ...currentFormatting, font_size: size });
    document.execCommand('fontSize', false, '7');
    const fontElements = document.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === '7') {
        fontElements[i].removeAttribute('size');
        fontElements[i].style.fontSize = size + 'pt';
      }
    }
  };

  const changeFontFamily = (family: string) => {
    setCurrentFormatting({ ...currentFormatting, font_family: family });
    document.execCommand('fontName', false, family);
  };

  // Extract document content from editor
  const extractDocumentContent = (): DocumentContent => {
    if (!editorRef.current) {
      return { paragraphs: [] };
    }

    const paragraphs: Paragraph[] = [];
    const text = editorRef.current.innerText;

    // Split by lines
    const lines = text.split('\n');

    lines.forEach(line => {
      if (line.trim()) {
        paragraphs.push({
          text: line,
          formatting: { ...currentFormatting }
        });
      }
    });

    return { paragraphs };
  };

  // File operations
  const handleNew = async () => {
    try {
      await invoke("create_new_document");
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      setCurrentFile(null);
      setDocumentContent({ paragraphs: [] });
    } catch (error) {
      console.error("Error creating new document:", error);
      alert("Failed to create new document: " + error);
    }
  };

  const handleOpen = async () => {
    try {
      const selected = await open({
        filters: [{
          name: 'Word Document',
          extensions: ['docx']
        }]
      });

      if (selected && typeof selected === 'string') {
        const content = await invoke<string>("open_document", { path: selected });
        const doc: DocumentContent = JSON.parse(content);
        setDocumentContent(doc);
        setCurrentFile(selected);

        // Render content in editor
        if (editorRef.current) {
          editorRef.current.innerHTML = doc.paragraphs
            .map(p => `<p>${p.text}</p>`)
            .join('');
        }
      }
    } catch (error) {
      console.error("Error opening document:", error);
      alert("Failed to open document: " + error);
    }
  };

  const handleSave = async () => {
    try {
      const content = extractDocumentContent();

      let filePath = currentFile;

      if (!filePath) {
        const selected = await save({
          filters: [{
            name: 'Word Document',
            extensions: ['docx']
          }]
        });

        if (selected) {
          filePath = selected;
          setCurrentFile(selected);
        } else {
          return;
        }
      }

      await invoke("save_document", {
        path: filePath,
        content: JSON.stringify(content)
      });

      alert("Document saved successfully!");
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Failed to save document: " + error);
    }
  };

  const handleSaveAs = async () => {
    try {
      const content = extractDocumentContent();

      const selected = await save({
        filters: [{
          name: 'Word Document',
          extensions: ['docx']
        }]
      });

      if (selected) {
        await invoke("save_document", {
          path: selected,
          content: JSON.stringify(content)
        });
        setCurrentFile(selected);
        alert("Document saved successfully!");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Failed to save document: " + error);
    }
  };

  return (
    <div className="app">
      {/* Menu Bar */}
      <div className="menu-bar">
        <div className="menu-title">Gemini Word</div>
        <div className="menu-items">
          <button onClick={handleNew} className="menu-button" title="New Document">
            <FileText size={18} />
            <span>New</span>
          </button>
          <button onClick={handleOpen} className="menu-button" title="Open Document">
            <FolderOpen size={18} />
            <span>Open</span>
          </button>
          <button onClick={handleSave} className="menu-button" title="Save">
            <Save size={18} />
            <span>Save</span>
          </button>
          <button onClick={handleSaveAs} className="menu-button" title="Save As">
            <Download size={18} />
            <span>Save As</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-group">
          <select
            value={currentFormatting.font_family}
            onChange={(e) => changeFontFamily(e.target.value)}
            className="font-select"
          >
            <option value="Calibri">Calibri</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Courier New">Courier New</option>
          </select>

          <select
            value={currentFormatting.font_size}
            onChange={(e) => changeFontSize(parseInt(e.target.value))}
            className="size-select"
          >
            {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => applyFormat('bold')}
            className={`toolbar-button ${currentFormatting.bold ? 'active' : ''}`}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => applyFormat('italic')}
            className={`toolbar-button ${currentFormatting.italic ? 'active' : ''}`}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => applyFormat('underline')}
            className={`toolbar-button ${currentFormatting.underline ? 'active' : ''}`}
            title="Underline"
          >
            <Underline size={18} />
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => applyAlignment('left')}
            className={`toolbar-button ${currentFormatting.alignment === 'left' ? 'active' : ''}`}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => applyAlignment('center')}
            className={`toolbar-button ${currentFormatting.alignment === 'center' ? 'active' : ''}`}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => applyAlignment('right')}
            className={`toolbar-button ${currentFormatting.alignment === 'right' ? 'active' : ''}`}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
          <button
            onClick={() => applyAlignment('justify')}
            className={`toolbar-button ${currentFormatting.alignment === 'justify' ? 'active' : ''}`}
            title="Justify"
          >
            <AlignJustify size={18} />
          </button>
        </div>

        <div className="toolbar-group">
          <input
            type="color"
            value={currentFormatting.color}
            onChange={(e) => {
              setCurrentFormatting({ ...currentFormatting, color: e.target.value });
              document.execCommand('foreColor', false, e.target.value);
            }}
            className="color-picker"
            title="Text Color"
          />
        </div>
      </div>

      {/* Editor */}
      <div className="editor-container">
        <div className="page">
          <div
            ref={editorRef}
            contentEditable
            className="editor"
            style={{
              fontFamily: currentFormatting.font_family,
              fontSize: `${currentFormatting.font_size}pt`,
              color: currentFormatting.color,
              textAlign: currentFormatting.alignment as any
            }}
            suppressContentEditableWarning
          >
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <span>{currentFile ? `File: ${currentFile.split('/').pop()}` : 'Untitled Document'}</span>
        <span>Ready</span>
      </div>
    </div>
  );
}

export default App;
