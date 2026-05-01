import chromadb
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from langchain_text_splitters import RecursiveCharacterTextSplitter


app = FastAPI()

@app.get("/split")
def split():
    with open("sample (2).txt") as f:
        text = f.read()
    splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=0)
    result = splitter.split_text(text)
    chunks = []
    for i in range(len(result)):
        chunks.append({"chunk": result[i], "length": len(result[i])})
    return chunks

app.mount("/", StaticFiles(directory="static", html=True), name="static")