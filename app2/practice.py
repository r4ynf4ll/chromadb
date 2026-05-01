from langchain_text_splitters import RecursiveCharacterTextSplitter

with open("sample (2).txt") as f:
    text = f.read()

splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=0)

result = splitter.split_text(text)
print(result)