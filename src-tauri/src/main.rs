// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
struct DocumentContent {
    paragraphs: Vec<Paragraph>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Paragraph {
    text: String,
    formatting: TextFormatting,
}

#[derive(Debug, Serialize, Deserialize)]
struct TextFormatting {
    bold: bool,
    italic: bool,
    underline: bool,
    font_size: u32,
    font_family: String,
    color: String,
    alignment: String,
}

// Command to create a new document
#[tauri::command]
fn create_new_document() -> Result<String, String> {
    Ok("New document created".to_string())
}

// Command to save document as .docx
#[tauri::command]
async fn save_document(
    path: String,
    content: String,
) -> Result<String, String> {
    use docx_rs::*;

    let doc_content: DocumentContent = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse document content: {}", e))?;

    let mut docx = Docx::new();

    for para in doc_content.paragraphs {
        let mut run = Run::new().add_text(&para.text);

        if para.formatting.bold {
            run = run.bold();
        }
        if para.formatting.italic {
            run = run.italic();
        }
        if para.formatting.underline {
            run = run.underline("single");
        }

        run = run.size(para.formatting.font_size * 2); // Word uses half-points
        run = run.fonts(RunFonts::new().ascii(&para.formatting.font_family));

        let mut paragraph = Paragraph::new().add_run(run);

        paragraph = match para.formatting.alignment.as_str() {
            "left" => paragraph.align(AlignmentType::Left),
            "center" => paragraph.align(AlignmentType::Center),
            "right" => paragraph.align(AlignmentType::Right),
            "justify" => paragraph.align(AlignmentType::Both),
            _ => paragraph.align(AlignmentType::Left),
        };

        docx = docx.add_paragraph(paragraph);
    }

    let path_buf = PathBuf::from(&path);
    let file = std::fs::File::create(&path_buf)
        .map_err(|e| format!("Failed to create file: {}", e))?;

    docx.build()
        .pack(file)
        .map_err(|e| format!("Failed to save document: {}", e))?;

    Ok(format!("Document saved to {}", path))
}

// Command to open and read a .docx file
#[tauri::command]
async fn open_document(path: String) -> Result<String, String> {
    use docx_rs::*;

    let file = fs::File::open(&path)
        .map_err(|e| format!("Failed to open file: {}", e))?;

    let docx = read_docx(&file)
        .map_err(|e| format!("Failed to read docx: {}", e))?;

    let mut paragraphs = Vec::new();

    for child in docx.document.children {
        if let DocumentChild::Paragraph(para) = child {
            for child in para.children {
                if let ParagraphChild::Run(run) = child {
                    for run_child in run.children {
                        if let RunChild::Text(text) = run_child {
                            let formatting = TextFormatting {
                                bold: run.run_property.bold.is_some(),
                                italic: run.run_property.italic.is_some(),
                                underline: run.run_property.underline.is_some(),
                                font_size: run.run_property.size.map(|s| s.val / 2).unwrap_or(11),
                                font_family: run.run_property.fonts
                                    .as_ref()
                                    .and_then(|f| f.ascii.as_ref())
                                    .unwrap_or(&"Calibri".to_string())
                                    .clone(),
                                color: "#000000".to_string(),
                                alignment: "left".to_string(),
                            };

                            paragraphs.push(Paragraph {
                                text: text.text.clone(),
                                formatting,
                            });
                        }
                    }
                }
            }
        }
    }

    let doc_content = DocumentContent { paragraphs };
    serde_json::to_string(&doc_content)
        .map_err(|e| format!("Failed to serialize document: {}", e))
}

// Command to export document to PDF (placeholder for future implementation)
#[tauri::command]
fn export_to_pdf(path: String, content: String) -> Result<String, String> {
    Err("PDF export not yet implemented".to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_new_document,
            save_document,
            open_document,
            export_to_pdf
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
