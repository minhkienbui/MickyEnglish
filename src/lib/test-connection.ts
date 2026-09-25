import { db } from "./db";

async function test() {
  try {
    const users = await db.user.findMany();
    const vocab = await db.vocabularyWord.findMany();
    const lessons = await db.listeningLesson.findMany();
    console.log("Connection successful! MickyEnglish Database stats:");
    console.log(`- Users: ${users.length}`);
    console.log(`- Vocab Items: ${vocab.length}`);
    console.log(`- Dictation Lessons: ${lessons.length}`);
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    process.exit(0);
  }
}

test();
