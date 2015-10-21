# Description

Mr. Data Converter takes CSV or tab-delimited data from a spreadsheet such as Excel and converts it into several web-friendly formats, including JSON and XML.
Use it online here: http://thdoan.github.com/mr-data-converter/

### Modifications to Shan Carter's version

- [Enhancement] added auto-select on input focus
- [Enhancement] added input auto-focus on page load
- [Enhancement] added "Loading..." status for right panel
- [Enhancement] added `CSVParser.escapeText()` to convert common punctuation marks, symbols, and diacritics into HTML entities for HTML and XML outputs
- [Enhancement] added favicons (mobile and desktop)
- [Enhancement] overhauled CSS to make layout fluid (no need for 'resize' event handler)
- [Enhancement] optimizations to images and code
- [Fix] some numbers with a leading zero (e.g., Australia postal code 0800) were not quoted, which resulted in invalid JSON
- [Fix] empty columns were outputted as `null` instead of `""`
- [Fix] tool breaking on columns containing double quoted text when pasting directly from Excel
- [Fix] column headers containing spaces resulted in invalid key name for ActionScript, incorrect class name for HTML, invalid MySQL definition, invalid attribute name for XML Properties, and invalid tag names for XML Nodes and XML Illustrator
- [Fix] text containing double quotes were not escaped in ActionScript, ASP/VBScript, JSON (all types), PHP, Python, Ruby, and XML Properties output
- [Fix] text containing single quotes (apostrophes) were not escaped in MySQL output
- [Fix] minor indentation corrections for XML output

### Future plans

- Add more output types
- Add more formatting options for output