import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import{Document,RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter"

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. obtain the pdf -> downlaod and read from pdf
  console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = await loader.load();

  // // 2. split and segment the pdf
  // const documents = await Promise.all(pages.map(prepareDocument));

  // // 3. vectorise and embed individual documents
  // const vectors = await Promise.all(documents.flat().map(embedDocument));

  // // 4. upload to pinecone
  // const client = await getPineconeClient();
  // const pineconeIndex = await client.index("chatpdf");
  // const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  // console.log("inserting vectors into pinecone");
  // await namespace.upsert(vectors);

  return pages;
}
