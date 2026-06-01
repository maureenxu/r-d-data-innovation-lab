import fitz


def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    return "\n".join(page.get_text() for page in doc).strip()


def extract_text(filename: str, file_bytes: bytes) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    # For non-PDF files, attempt UTF-8 decode (covers plain text, some DOCX/XLSX exports)
    try:
        return file_bytes.decode("utf-8").strip()
    except UnicodeDecodeError:
        return f"[Binary file — text extraction not supported for {filename}]"
