# Extracts text from the PDF.
# Uses regex to parse key fields.
# Returns JSON to Node.js.

import sys
import re
import pdfplumber
import json

# extract text from pdf
def extract_text_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
            
    return text

# analyze the text and convert it into structured fields - parse data
def parse_invoice(text):
    data = {
        "invoice_number": re.search(r"INVOICE #(\w+-\d+)", text).group(1),
        "date": re.search(r"Date:\s*(\d{4}-\d{2}-\d{2})", text).group(1),
        "vendor": re.search(r"Vendor:\s*(.+)", text).group(1).strip(),
        "total": re.search(r"TOTAL DUE:\s*(\$\d{1,3}(?:,\d{3})*\.\d{2})", text).group(1),
    }
    return data

if __name__ == "__main__":
    pdf_path = sys.argv[1] # pass the pdf path from Node.js
    text = extract_text_from_pdf(pdf_path)
    data = parse_invoice(text)
    print(json.dumps(data)) # print the JSON data or send it to Node.js